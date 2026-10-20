/**
 * GS-R13-PRODUCTION-PROFILE-001: the gridsmith.uk static profile and the inputs it waits for.
 *
 * Selected only by `GRIDSMITH_STATIC_PROFILE=production`. It refuses to build while any input
 * below is unmet. Nothing here is a default: an unset input is a refusal, never a fallback.
 */
import { LEGAL_DOCUMENT_SLUGS } from '../legal/slugs.ts';

export const PRODUCTION_ORIGIN = 'https://gridsmith.uk';
export const PREVIEW_INTAKE_URL = 'https://qfgpwumvvtizeamkynes.supabase.co/functions/v1/gs-lead-intake';

/**
 * The Production Edge intake. `null` until the H4-B production phase has deployed
 * `gs-lead-intake` to the Production project, allowed this origin, and recorded the evidence.
 * That phase sets it in its own reviewed commit; nothing else may.
 */
export const PRODUCTION_INTAKE_URL: string | null = null;

const intakePattern = /^https:\/\/[a-z0-9]{20}\.supabase\.co\/functions\/v1\/gs-lead-intake$/;

type Entry = { type: string; slug: string | null; eligible: boolean };
type Register = { documents?: Record<string, { state?: string } | undefined> };

/** Every unmet production input as `CODE: detail`. An empty list is the only buildable state. */
export function productionInputProblems(intakeUrl: string | undefined, publication: Entry[],
  register: Register, expectedIntake: string | null = PRODUCTION_INTAKE_URL): string[] {
  const problems: string[] = [];
  if (!expectedIntake) problems.push('INTAKE: production intake URL not established (H4-B production phase)');
  else if (!intakePattern.test(expectedIntake) || expectedIntake === PREVIEW_INTAKE_URL) {
    problems.push('INTAKE: recorded production intake is malformed or is the isolated Preview project');
  } else if (intakeUrl !== expectedIntake) {
    problems.push('INTAKE: NEXT_PUBLIC_LEAD_INTAKE_URL is not the recorded production intake');
  }
  for (const slug of LEGAL_DOCUMENT_SLUGS) {
    const state = register.documents?.[slug]?.state ?? 'missing';
    const entry = publication.find((item) => item.type === 'legalDocument' && item.slug === slug);
    if (state !== 'PUBLISHABLE' || !entry?.eligible) {
      problems.push(`LEGAL: ${slug} is not PUBLISHABLE (register ${state}, migration ${entry?.eligible ? 'eligible' : 'gated'})`);
    }
  }
  return problems;
}
