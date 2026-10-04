'use server';
import 'server-only';
import { randomUUID } from 'node:crypto';
import { isTrapped } from './guard.ts';
import { submitLead } from './submit.ts';
import { contactLeadFrom, type FormState } from './form-domain.ts';
export type { FormState } from './form-domain.ts';

/**
 * The `useActionState` adapter for `submitLead` (`N-11`).
 *
 * `submitLead` takes a value and returns a result; `useActionState` wants
 * `(previousState, formData)`. This is the whole of the difference, and it lives on its own so
 * that `submit.ts` — which holds the RLS-sensitive insert and is the file a security review
 * reads — is not reshaped around a React hook's calling convention.
 *
 * ## Nothing in the payload is trusted
 *
 * `FormData` is attacker-controlled. Every value goes through `leadSchema` inside `submitLead`,
 * which is where the bounds live, and the extraction below deliberately reads **named fields
 * only** rather than iterating the form: `Object.fromEntries(formData)` would forward any field
 * an attacker appended into the insert body, and the table would accept whatever its columns
 * matched.
 *
 * `is_ai_referral` and the campaign fields come from hidden inputs the page fills in. They are
 * an attribution signal, not an authorisation one — nothing decides anything about a lead from
 * them, which is why accepting them from the client is acceptable at all.
 */
export async function submitLeadAction(_prev: FormState, formData: FormData): Promise<FormState> {
  // Preserve the accepted bot response before any domain/DB work.
  if (isTrapped(formData)) return { status: 'ok', id: randomUUID() };
  return submitLead(contactLeadFrom(formData));
}
