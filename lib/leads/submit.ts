'use server';
import 'server-only';
import { randomUUID } from 'node:crypto';
import { notifyLead, type NotifyOutcome } from './notify.ts';
import { leadSchema } from './schema.ts';

/**
 * The lead pipeline (`A-08`, `FOUNDATION` §6). Server Action, Zod at the boundary, Supabase
 * insert, then notifications.
 *
 * ## It inserts as `anon`, deliberately, and not with a service role
 *
 * The publishable key runs as the `anon` role, so **the insert is subject to the same RLS the
 * browser would be**. Using a service role here would bypass RLS and make the `anon insert
 * only` policy decorative — the database would be protected by this file remembering to
 * behave, which is the arrangement `A-07` exists to replace. If this code is ever wrong, RLS
 * still holds.
 *
 * ## Three constraints established at `A-07` by querying the live database, not by reading SQL
 *
 * 1. **`Prefer: return=minimal` is required.** PostgREST's default is
 *    `return=representation`, which makes every insert a read as well — and there is no select
 *    policy for `anon`, by design. Measured: `representation` returns **401**, `minimal`
 *    returns **201**.
 * 2. **The id is generated here rather than read back**, for the same reason: nothing can read
 *    the row after writing it. `randomUUID()` is what the notification references.
 * 3. **`notified_at` stays null.** It is meant to be stamped after the notification is
 *    accepted, and `anon` has no UPDATE policy — correctly, since UPDATE from a public form is
 *    exactly what RLS is keeping out. Stamping it needs a service-role writer, which does not
 *    exist yet. The column is real; the speed-to-lead measurement is not. `M-P2-13`.
 *
 * ## Order, and what a partial failure means
 *
 * The insert is the commitment. A notification failure does **not** roll it back and does not
 * fail the submission: a lead in the database with no email sent is recoverable, a lost lead
 * is not. The outcomes are returned so the caller can log or surface them, and `status` is
 * `'ok'` only when the row landed.
 *
 * **Consent is not consulted anywhere in this file, and that is deliberate.**
 * `PROJECT-RULES.md` §6: processing an enquiry someone submitted is contract/legitimate
 * interest, not analytics. Never block a form on consent.
 */
export type SubmitResult =
  | { status: 'ok'; id: string; notifications: NotifyOutcome[] }
  | { status: 'invalid'; errors: Record<string, string[]> }
  | { status: 'error'; detail: string };

const PROJECT_URL = (process.env.PROJECT_URL ?? '').replace(/\/$/, '');
const PUBLISHABLE_KEY = process.env.PUBLISHABLE_KEY ?? '';

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

  if (!PROJECT_URL || !PUBLISHABLE_KEY) {
    return { status: 'error', detail: 'PROJECT_URL or PUBLISHABLE_KEY is not set' };
  }

  const id = randomUUID();

  const response = await fetch(`${PROJECT_URL}/rest/v1/leads`, {
    method: 'POST',
    headers: {
      apikey: PUBLISHABLE_KEY,
      Authorization: `Bearer ${PUBLISHABLE_KEY}`,
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

  return { status: 'ok', id, notifications: await notifyLead(parsed.data, id) };
}
