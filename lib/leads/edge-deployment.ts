/**
 * Which Supabase project an Edge function runs in, and what it may do there (GS-R13-H4B).
 *
 * Preview admits only synthetic enquiries, always. Production must be told explicitly:
 * `synthetic-only` for the controlled smoke test, `live` only at cutover. An unknown project,
 * an unset or unknown Production mode, a Production origin other than gridsmith.uk, or a
 * recipient other than the approved inbox stops the function before it serves a request.
 */
export const PREVIEW_REF = 'qfgpwumvvtizeamkynes';
export const PRODUCTION_REF = 'dqiutgmxillhsbzgnlsx';
export const APPROVED_RECIPIENT = 'contact@gridsmith.uk';
export const PRODUCTION_ORIGINS = ['https://gridsmith.uk'];
export type IntakeMode = 'synthetic-only' | 'live';
export type EdgeDeployment = { ref: string; production: boolean; mode: IntakeMode; origins: string[]; recipient: string };

export function edgeDeployment(env: (name: string) => string): EdgeDeployment {
  const ref = /^https:\/\/([a-z0-9]{20})\.supabase\.co\/?$/.exec(env('SUPABASE_URL'))?.[1];
  if (ref !== PREVIEW_REF && ref !== PRODUCTION_REF) throw new Error('Edge functions run only in the approved Preview or Production project');
  const production = ref === PRODUCTION_REF;
  const mode = env('GRIDSMITH_INTAKE_MODE') || (production ? '' : 'synthetic-only');
  if (production ? mode !== 'synthetic-only' && mode !== 'live' : mode !== 'synthetic-only') {
    throw new Error(production ? 'Production requires GRIDSMITH_INTAKE_MODE synthetic-only or live' : 'Preview admits only synthetic enquiries');
  }
  let origins: unknown = null;
  try { origins = JSON.parse(env('GRIDSMITH_ALLOWED_ORIGINS')); } catch { /* Refused below. */ }
  if (!Array.isArray(origins) || !origins.every((origin) => typeof origin === 'string')) throw new Error('Exact approved intake origins required');
  if (production && JSON.stringify(origins) !== JSON.stringify(PRODUCTION_ORIGINS)) throw new Error('Production accepts enquiries only from https://gridsmith.uk');
  const recipient = env('LEAD_NOTIFICATION_EMAIL');
  if (recipient && recipient !== APPROVED_RECIPIENT) throw new Error('Notifications go only to the approved recipient');
  return { ref, production, mode: mode as IntakeMode, origins: origins as string[], recipient };
}

/** The marked identity every synthetic proof uses, in Preview and in the Production smoke test. */
export const isSyntheticLead = (lead: { full_name: string; email: string }) =>
  lead.full_name.startsWith('GS-HOST-H4-B ') && lead.email.endsWith('@gridsmith.invalid');

/** Preview always, and Production until cutover, admit only the marked synthetic identity. */
export const admitsLead = (deployment: Pick<EdgeDeployment, 'mode'>, lead: { full_name: string; email: string }) =>
  deployment.mode === 'live' || isSyntheticLead(lead);
