'use server';
import 'server-only';
import { randomUUID } from 'node:crypto';
import { after } from 'next/server';
import { notifyLead } from './notify.ts';
import { leadSchema } from './schema.ts';

/**
 * The lead pipeline (`A-08`, `FOUNDATION` §6). Server Action, Zod at the boundary, Supabase
 * insert, then notifications.
 *
 * ## It inserts only from this server boundary
 *
 * GS-P01 removes direct `anon` table insertion. The service-role credential is held only in
 * this `server-only` module; `leadSchema` strips unknown fields and the insert body is built from
 * that parsed value, so callers cannot populate status, notes or notification/CRM timestamps.
 * Database constraints independently preserve the durable bounds.
 *
 * ## Three constraints established at `A-07` by querying the live database, not by reading SQL
 *
 * 1. **`Prefer: return=minimal` is required.** PostgREST's default is
 *    `return=representation`, which makes every insert a read as well — and there is no select
 *    policy for `anon`, by design. Measured: `representation` returns **401**, `minimal`
 *    returns **201**.
 * 2. **The id is generated here rather than read back**, for the same reason: nothing can read
 *    the row after writing it. `randomUUID()` is what the notification references.
 * 3. **`notified_at` stays null.** Notification reconciliation is outside GS-P01; acquiring a
 *    server credential here does not authorise that separate workflow.
 *
 * ## Order, and what a partial failure means
 *
 * The insert is the commitment. **A notification failure does not roll it back, does not fail
 * the submission, and cannot reach the visitor** — a lead in the database with no email sent
 * is recoverable, a lost lead is not. `status` is `'ok'` exactly when the row landed.
 *
 * **The send does not block the response.** `after()` runs the fan-out once the response has
 * been sent, so a slow or failing provider costs the person filling in the form nothing.
 * Awaiting it would put a third-party API's latency — and its outages — on the critical path
 * of a form submission, which is the wrong trade in both directions: the visitor waits, and a
 * timeout would look to them like a failed submission for a lead that is already saved.
 *
 * That also means the outcomes are **not** in the return value. Nothing can be, once the
 * response has gone. `notifyLead` is exported and the probe route calls it directly so the
 * branches stay observable — and the gate says which path it is exercising, rather than
 * letting a testing mode read as the production one.
 *
 * **Consent is not consulted anywhere in this file, and that is deliberate.**
 * `PROJECT-RULES.md` §6: processing an enquiry someone submitted is contract/legitimate
 * interest, not analytics. Never block a form on consent.
 */
export type SubmitResult =
  | { status: 'ok'; id: string }
  | { status: 'invalid'; errors: Record<string, string[]> }
  | { status: 'error'; detail: string };

const PROJECT_URL = (process.env.PROJECT_URL ?? '').replace(/\/$/, '');
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';

export async function submitLead(input: unknown): Promise<SubmitResult> {
  const parsed = leadSchema.safeParse(input);
  if (!parsed.success) {
    const errors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join('.') || '_';
      (errors[key] ??= []).push(issue.message);
    }
    return { status: 'invalid', errors };
  }

  if (!PROJECT_URL || !SERVICE_ROLE_KEY) {
    return { status: 'error', detail: 'PROJECT_URL or SUPABASE_SERVICE_ROLE_KEY is not set' };
  }

  const id = randomUUID();

  const response = await fetch(`${PROJECT_URL}/rest/v1/leads`, {
    method: 'POST',
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      // See constraint 1 above. Changing this to `return=representation` breaks every
      // submission with a 401, and it will look like an auth problem rather than an RLS one.
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({ id, ...parsed.data }),
  });

  if (!response.ok) {
    // The response body can echo the submitted row, so only the status is surfaced. A lead's
    // email address does not belong in a log line.
    return { status: 'error', detail: `insert failed: HTTP ${response.status}` };
  }

  after(() => notifyLead(parsed.data, id));
  return { status: 'ok', id };
}
