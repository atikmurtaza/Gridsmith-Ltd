/**
 * The approved service architecture — `GS-P03`. `docs/_shared/SERVICE-ARCHITECTURE.md` is the
 * record; this file is the part of it that code and the CMS both need.
 *
 * ## What is architecture here and what is content
 *
 * **A capability group is architecture. A service is content.** Adding "Packaging design" to
 * Brand & Visual is a CMS edit with no deploy. Adding a sixth Design group, or moving a group to
 * another division, changes what a division *is* — which is an owner decision recorded in the
 * ADR, so it lives in code where it is reviewed rather than in a free-text field an editor can
 * widen. The schema's `capabilityGroup` field reads this list and refuses anything outside it,
 * and refuses a group that belongs to a different division. That second rule is what keeps
 * the cross-division boundaries from drifting: Press cannot quietly grow a web group, and
 * Digital cannot quietly grow a copywriting one.
 *
 * **Master has no groups, on purpose.** Master is not a production studio. Its engagement
 * models (roadmap/discovery, advisory, programme management, ongoing relationship) are
 * recorded in the ADR and have no CMS type until approved copy exists for them.
 *
 * Nothing in this file is a price, a guarantee, a turnaround or a credential. Pure data and
 * pure functions: no aliases, no environment, so the Studio, the app and the gates can all
 * import the same one.
 */

export const SERVICE_DIVISIONS = ['design', 'digital', 'press'] as const;
export type ServiceDivision = (typeof SERVICE_DIVISIONS)[number];

export type CapabilityGroup = {
  key: string;
  division: ServiceDivision;
  label: string;
  /**
   * The group's services may not be published to production until professional scope and
   * professional-indemnity cover are confirmed (`GS-O005`, `GS-X002`). `check:launch` enforces
   * it on the production dataset; the Studio warns everywhere else so development is not blocked.
   */
  professionalReview?: true;
};

/** Ordered as each division presents them. The order is the rendering order. */
export const CAPABILITY_GROUPS: readonly CapabilityGroup[] = [
  { key: 'brand-visual', division: 'design', label: 'Brand & Visual' },
  { key: 'illustration', division: 'design', label: 'Illustration' },
  { key: 'motion', division: 'design', label: 'Motion' },
  { key: '3d-visualisation', division: 'design', label: '3D & Visualisation' },
  { key: 'technical', division: 'design', label: 'Technical', professionalReview: true },
  { key: 'web', division: 'digital', label: 'Web' },
  { key: 'software', division: 'digital', label: 'Software' },
  { key: 'apps-interactive', division: 'digital', label: 'Apps & Interactive' },
  { key: 'automation-intelligence', division: 'digital', label: 'Automation & Intelligence' },
  { key: 'operate-improve', division: 'digital', label: 'Operate & Improve' },
  { key: 'writing', division: 'press', label: 'Writing' },
  { key: 'editorial', division: 'press', label: 'Editorial' },
  { key: 'publishing', division: 'press', label: 'Publishing' },
  { key: 'content-promotion', division: 'press', label: 'Content & Promotion' },
];

export const CAPABILITY_GROUP_KEYS = CAPABILITY_GROUPS.map((g) => g.key);

export const PROFESSIONAL_REVIEW_GROUPS = CAPABILITY_GROUPS.filter((g) => g.professionalReview).map(
  (g) => g.key,
);

const divisionName = (d: string) => `Gridsmith ${d.charAt(0).toUpperCase()}${d.slice(1)}`;

type RuleContext = { document?: Record<string, unknown> } | undefined;

/**
 * Two limbs, each with its own message so `check:schemas` can prove them separately: the key is
 * in the closed set, and the key belongs to the document's own division. Absence is `required()`'s.
 */
export function capabilityGroupRule(value: unknown, context?: RuleContext): true | string {
  if (value === undefined || value === null || value === '') return true;
  const group = CAPABILITY_GROUPS.find((g) => g.key === value);
  if (!group) return `Capability group must be one of: ${CAPABILITY_GROUP_KEYS.join(', ')}`;
  const division = context?.document?.division;
  if (typeof division === 'string' && division !== group.division) {
    return `"${group.label}" belongs to ${divisionName(group.division)}, not ${divisionName(division)}`;
  }
  return true;
}

/**
 * The technical publication gate as the Studio sees it. Installed as a **warning**, so a
 * development record can be published and the architecture tested; `check:launch` is what
 * refuses the same record on the production dataset.
 */
export function professionalScopeRule(value: unknown, context?: RuleContext): true | string {
  const doc = context?.document;
  if (!doc || doc.published !== true) return true;
  if (!PROFESSIONAL_REVIEW_GROUPS.includes(String(doc.capabilityGroup))) return true;
  return value === true
    ? true
    : 'Technical services cannot be published to production until professional scope and PI cover are confirmed (GS-O005, GS-X002)';
}

/**
 * Primary CTA wording per division (`GS-P03` §CTA model). The service record may override the
 * label; the destination is never editable — it is always the enquiry form, carrying context.
 */
export const ENQUIRY_CTA: Record<ServiceDivision | 'master', string> = {
  master: 'Discuss Your Requirements',
  design: 'Get a Design Quote',
  digital: 'Discuss Your Project',
  press: 'Discuss Your Book or Content',
};

/** The universal secondary route. */
export const CONTACT_CTA = { label: 'Contact Gridsmith', href: '/contact' } as const;

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const validSlug = (s: string | null | undefined): s is string => !!s && s.length <= 200 && SLUG.test(s);
const isDivision = (d: string | null): d is ServiceDivision =>
  (SERVICE_DIVISIONS as readonly string[]).includes(d ?? '');

/** Where an enquiry CTA points. Division and service travel as query context, never as trust. */
export function enquiryHref(division?: ServiceDivision, service?: string): string {
  if (!division) return CONTACT_CTA.href;
  const params = new URLSearchParams({ division });
  if (validSlug(service)) params.set('service', service);
  return `${CONTACT_CTA.href}?${params}`;
}

/**
 * The inverse, for the form. Anything malformed is dropped rather than repaired: this is an
 * attribution signal from the address bar, and the server's own schema still bounds it.
 */
export function readEnquiryContext(search: string): { division?: ServiceDivision; service?: string } {
  const params = new URLSearchParams(search);
  const division = params.get('division');
  if (!isDivision(division)) return {};
  const service = params.get('service');
  return validSlug(service) ? { division, service } : { division };
}

/**
 * The credibility statement that replaces a public portfolio (`GS-D001`). It deliberately does
 * not say that all unshown work is confidential, and does not promise that an example exists or
 * will be shared.
 */
export const PRIVATE_EXAMPLES_NOTICE =
  'Some of our work cannot be shown publicly, either because we do not hold permission to publish it or because it is confidential. Relevant examples may be discussed privately where we are permitted to share them.';
