/** Shared named-field extraction for normal Next and external intake. No runtime imports. */
import { leadSchema, type Lead } from './schema.ts';
import { pressLeadPayload, pressPayloadFrom } from './pressLead.ts';
import { isTrapped } from './guard.ts';

export type FormType = 'contact' | 'press';
export type FieldErrors = Record<string, string[]>;
export type DomainResult = { status: 'trapped' } | { status: 'invalid'; errors: FieldErrors } |
  { status: 'valid'; lead: Lead };

const str = (form: FormData, name: string) => {
  const value = form.get(name);
  return typeof value === 'string' && value.trim() !== '' ? value.trim() : undefined;
};
export const issueMap = (issues: { path: PropertyKey[]; message: string }[], fallback = '_') => {
  const errors: FieldErrors = {};
  for (const issue of issues) (errors[issue.path.join('.') || fallback] ??= []).push(issue.message);
  return errors;
};

export function contactLeadFrom(formData: FormData) {
  return {
    division: str(formData, 'division') ?? 'unsure', lead_type: 'enquiry',
    service_slug: str(formData, 'service_slug'), full_name: str(formData, 'full_name') ?? '',
    email: str(formData, 'email') ?? '', company: str(formData, 'company'), role: str(formData, 'role'),
    phone: str(formData, 'phone'), message: str(formData, 'message'),
    budget_band: str(formData, 'budget_band'), timeline: str(formData, 'timeline'),
    source: str(formData, 'source'), medium: str(formData, 'medium'), campaign: str(formData, 'campaign'),
    referrer: str(formData, 'referrer'), landing_page: str(formData, 'landing_page'),
    is_ai_referral: str(formData, 'is_ai_referral') === 'true',
  };
}

export function validateForm(formType: FormType, form: FormData): DomainResult {
  if (isTrapped(form)) return { status: 'trapped' };
  let input: unknown;
  if (formType === 'contact') input = contactLeadFrom(form);
  else {
    const payload = pressLeadPayload.safeParse(pressPayloadFrom(form));
    if (!payload.success) return { status: 'invalid', errors: issueMap(payload.error.issues, 'segment') };
    input = {
      division: 'press', lead_type: 'enquiry', full_name: str(form, 'full_name') ?? '',
      email: str(form, 'email') ?? '', company: str(form, 'company'), phone: str(form, 'phone'),
      message: str(form, 'message'), budget_band: str(form, 'budget_band'),
      timeline: 'timeline' in payload.data ? payload.data.timeline : undefined,
      landing_page: str(form, 'landing_page'), payload: payload.data,
    };
  }
  const parsed = leadSchema.safeParse(input);
  return parsed.success ? { status: 'valid', lead: parsed.data } :
    { status: 'invalid', errors: issueMap(parsed.error.issues) };
}
export type FormState =
  | { status: 'idle' }
  | { status: 'ok'; id: string }
  | { status: 'invalid'; errors: Record<string, string[]> }
  | { status: 'error'; detail: string };
