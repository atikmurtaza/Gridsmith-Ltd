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
 * The Production Edge intake. Set (GS-R14) from GS-R13-H4B-EXEC-001's evidence (`34e036aa`):
 * `gs-lead-intake` deployed to Production, allowing this origin, and proven synthetic-only.
 */
export const PRODUCTION_INTAKE_URL: string | null = 'https://dqiutgmxillhsbzgnlsx.supabase.co/functions/v1/gs-lead-intake';

const intakePattern = /^https:\/\/[a-z0-9]{20}\.supabase\.co\/functions\/v1\/gs-lead-intake$/;

/** Ask the local static subject before measuring it; never fall back to Next SSR. */
export function staticLighthouseProblems(identity: { profile?: string; contactMode?: string; siteOrigin?: string; sourceModified?: boolean } | null): string[] {
  return identity?.profile === 'production' && identity.contactMode === 'direct' &&
    identity.siteOrigin === PRODUCTION_ORIGIN && identity.sourceModified === false ? [] : ['STATIC_LIGHTHOUSE_SUBJECT'];
}

type Entry = { type: string; slug: string | null; eligible: boolean };
type Register = { documents?: Record<string, { state?: string; contactMode?: string;
  prerequisitesMet?: Record<string, string> } | undefined> };

/** Every unmet production input as `CODE: detail`. An empty list is the only buildable state. */
export function productionInputProblems(intakeUrl: string | undefined, publication: Entry[],
  register: Register, expectedIntake: string | null = PRODUCTION_INTAKE_URL,
  contactMode: 'edge' | 'direct' = 'edge'): string[] {
  const problems: string[] = [];
  if (contactMode === 'direct') {
    if (intakeUrl) problems.push('INTAKE: direct contact must not configure an intake endpoint');
    const privacy = register.documents?.privacy;
    if (privacy?.contactMode !== 'direct') problems.push('LEGAL: Privacy has no explicit direct-contact processing mode');
    if (!privacy?.prerequisitesMet?.['DIRECT-CONTACT-VERIFIED']?.trim()) {
      problems.push('LEGAL: DIRECT-CONTACT-VERIFIED has no recorded owner/verification receipt');
    }
  } else if (!expectedIntake) problems.push('INTAKE: production intake URL not established (H4-B production phase)');
  else if (!intakePattern.test(expectedIntake) || expectedIntake === PREVIEW_INTAKE_URL) {
    problems.push('INTAKE: recorded production intake is malformed or is the isolated Preview project');
  } else if (intakeUrl !== expectedIntake) {
    problems.push('INTAKE: NEXT_PUBLIC_LEAD_INTAKE_URL is not the recorded production intake');
  }
  if (contactMode === 'edge' && register.documents?.privacy?.contactMode === 'direct') {
    problems.push('LEGAL: form activation requires form-mode Privacy and H4-B-INTAKE-PROMOTED');
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
