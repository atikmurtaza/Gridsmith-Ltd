'use server';
import 'server-only';
import { submitLead, type SubmitResult } from './submit.ts';

export type FormState =
  | { status: 'idle' }
  | { status: 'ok'; id: string }
  | { status: 'invalid'; errors: Record<string, string[]> }
  | { status: 'error'; detail: string };

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
const str = (form: FormData, name: string) => {
  const value = form.get(name);
  return typeof value === 'string' && value.trim() !== '' ? value.trim() : undefined;
};

export async function submitLeadAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const result: SubmitResult = await submitLead({
    division: str(formData, 'division') ?? 'unsure',
    lead_type: 'enquiry',
    full_name: str(formData, 'full_name') ?? '',
    email: str(formData, 'email') ?? '',
    company: str(formData, 'company'),
    role: str(formData, 'role'),
    phone: str(formData, 'phone'),
    message: str(formData, 'message'),
    budget_band: str(formData, 'budget_band'),
    timeline: str(formData, 'timeline'),
    source: str(formData, 'source'),
    medium: str(formData, 'medium'),
    campaign: str(formData, 'campaign'),
    referrer: str(formData, 'referrer'),
    landing_page: str(formData, 'landing_page'),
    is_ai_referral: str(formData, 'is_ai_referral') === 'true',
  });

  return result;
}
