'use server';
import 'server-only';
import { redirect } from 'next/navigation';
import { submitLead } from './submit.ts';
import { pressLeadPayload, pressPayloadFrom } from './pressLead.ts';
import type { FormState } from './action.ts';

/**
 * The Press contact flow's `useActionState` adapter (`K-13`).
 *
 * **It is a second adapter, not a second pipeline.** Everything after validation is
 * `submitLead` — the same Zod boundary, the same `anon` insert, the same RLS posture, the same
 * `leads` row. What differs is the shape of the branch answers, which go into `payload`.
 *
 * ## Named fields only
 *
 * `Object.fromEntries(formData)` would forward anything an attacker appended. The extraction
 * below reads the fields this flow defines and nothing else — `action.ts` carries the full
 * reasoning and this file follows it rather than restating it.
 *
 * ## The payload is validated before it reaches `submitLead`, not instead of it
 *
 * `leadSchema.payload` is `z.record(z.string().max(120), z.unknown())` — a bound on size, not
 * on shape, because it is shared by four divisions. `pressLeadPayload` is the shape, and a
 * failure here returns `invalid` with the same error map the field-level UI already renders.
 * The ETH-07 gate is inside it: a memoir submission without `expectationsAcknowledged: true`
 * cannot reach the insert, whatever the browser sent.
 *
 * ## Success is a route, not a toast
 *
 * `press/PROJECT-RULES.md` §7. `redirect()` leaves nothing to a state flag that a re-render
 * could drop, and it means the confirmation — where the cross-division prompt will live at
 * `K-15` — is a real page with a real URL. The redirect throws, so it must be the last thing
 * in the function; nothing after it runs.
 */
const str = (form: FormData, name: string) => {
  const value = form.get(name);
  return typeof value === 'string' && value.trim() !== '' ? value.trim() : undefined;
};
export async function submitPressLeadAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const payload = pressLeadPayload.safeParse(pressPayloadFrom(formData));
  if (!payload.success) {
    const errors: Record<string, string[]> = {};
    for (const issue of payload.error.issues) {
      const key = issue.path.join('.') || 'segment';
      (errors[key] ??= []).push(issue.message);
    }
    return { status: 'invalid', errors };
  }

  const result = await submitLead({
    division: 'press',
    lead_type: 'enquiry',
    full_name: str(formData, 'full_name') ?? '',
    email: str(formData, 'email') ?? '',
    company: str(formData, 'company'),
    phone: str(formData, 'phone'),
    message: str(formData, 'message'),
    budget_band: str(formData, 'budget_band'),
    timeline: 'timeline' in payload.data ? payload.data.timeline : undefined,
    landing_page: str(formData, 'landing_page'),
    payload: payload.data,
  });

  if (result.status !== 'ok') return result;
  redirect('/press/contact/thank-you');
}
