/**
 * The owner-approved service catalogue — `GS-O006`, approved 16 September 2026, recorded at
 * `GS-P04`. `docs/_shared/SERVICE-ARCHITECTURE.md` §2 is the prose record; this is the
 * machine-readable copy that the seed and `check:service-content` both read.
 *
 * ## What this file is, and what it is not
 *
 * It is **a point-in-time record of an owner decision**, not architecture. Nothing in the
 * schema, the query layer or any rendered component imports it, so an editor may add or
 * remove a service inside an approved group as ordinary CMS content with no code change —
 * which is the promise `GS-O006` was given and `SERVICE-ARCHITECTURE.md` §1.2 records.
 * `lib/services/architecture.ts` is the part that *is* architecture: the closed,
 * division-bound capability groups a service may belong to.
 *
 * What it exists for is the one question a CMS cannot answer about itself: **did the
 * development content foundation built at `GS-P04` actually represent everything the owner
 * approved?** `check:service-content` answers it by comparing the seeded records against this
 * list. The expectation therefore comes from **outside** its subject, which is the rule in
 * `CLAUDE.md` — "an expectation derived from its own subject cannot fail when the subject is
 * removed". Deleting a service from `scripts/service-content.mjs` fails the gate; deleting one
 * from here is an owner decision that has to be made here, in review, in a diff.
 *
 * ## Names are transcribed, not normalised
 *
 * Each `name` is the owner's own wording from the `GS-P04` brief. They are not titles and not
 * copy: a service record's `title` is editorial and its `covers` names these. "Technical
 * illustration" appears twice on purpose — the owner lists it under both Illustration and
 * Technical — so the identity of an entry is `group` + `name`, never `name` alone.
 *
 * Nothing here is a price, a turnaround, a guarantee or a credential.
 */
// Explicit `.ts`, like `sanity/project.ts`'s consumers: this module is imported by `.mjs`
// scripts under Node's type stripping, which requires the extension on a relative import.
// Nothing in `app/` or `components/` imports this file, so webpack never sees it.
import { CAPABILITY_GROUPS, type ServiceDivision } from './architecture.ts';

export type ApprovedService = {
  /** A `key` from `CAPABILITY_GROUPS`. */
  group: string;
  /** The owner's wording, verbatim from the `GS-O006` approval. */
  name: string;
};

/** 81 approved services. Ordered by division, then by the group order the architecture sets. */
export const APPROVED_SERVICES: readonly ApprovedService[] = [
  // ---- Gridsmith Design ----------------------------------------------------
  { group: 'brand-visual', name: 'Brand identity systems' },
  { group: 'brand-visual', name: 'Naming support' },
  { group: 'brand-visual', name: 'Logo systems' },
  { group: 'brand-visual', name: 'Brand guidelines' },
  { group: 'brand-visual', name: 'Graphic design' },
  { group: 'brand-visual', name: 'Print and digital collateral' },
  { group: 'brand-visual', name: 'Packaging design' },
  { group: 'brand-visual', name: 'Marketing and campaign creative' },
  { group: 'brand-visual', name: 'Presentation design' },
  { group: 'brand-visual', name: 'Document/report design' },
  { group: 'brand-visual', name: 'Social/content creative' },
  { group: 'brand-visual', name: 'Gaming/streamer creative' },

  { group: 'illustration', name: 'Digital illustration' },
  { group: 'illustration', name: 'Custom artwork' },
  { group: 'illustration', name: 'Iconography' },
  { group: 'illustration', name: 'Infographics / visual explanation' },
  { group: 'illustration', name: 'Technical illustration' },

  { group: 'motion', name: 'Motion graphics' },
  { group: 'motion', name: '2D animation' },
  { group: 'motion', name: '3D animation' },
  { group: 'motion', name: 'Animated brand/content assets' },

  { group: '3d-visualisation', name: '3D modelling' },
  { group: '3d-visualisation', name: 'Product visualisation' },
  { group: '3d-visualisation', name: 'Concept rendering' },
  { group: '3d-visualisation', name: 'Presentation renders' },

  { group: 'technical', name: 'CAD drafting' },
  { group: 'technical', name: 'Engineering drawings' },
  { group: 'technical', name: 'Schematics' },
  { group: 'technical', name: 'Technical illustration' },
  { group: 'technical', name: 'Technical document layout' },
  { group: 'technical', name: 'Manuals/specification-sheet layout' },

  // ---- Gridsmith Digital ---------------------------------------------------
  { group: 'web', name: 'Website design and development' },
  { group: 'web', name: 'E-commerce' },
  { group: 'web', name: 'Web applications' },
  { group: 'web', name: 'CMS implementation' },
  { group: 'web', name: 'Content architecture' },
  { group: 'web', name: 'UI/UX for digital products' },

  { group: 'software', name: 'Custom software' },
  { group: 'software', name: 'Internal tools' },
  { group: 'software', name: 'Business portals' },
  { group: 'software', name: 'Dashboards' },
  { group: 'software', name: 'CRM/workflow systems' },

  { group: 'apps-interactive', name: 'Mobile applications' },
  { group: 'apps-interactive', name: 'Progressive web applications' },
  { group: 'apps-interactive', name: 'Game development' },

  { group: 'automation-intelligence', name: 'API integrations' },
  { group: 'automation-intelligence', name: 'Systems integration' },
  { group: 'automation-intelligence', name: 'Workflow automation' },
  { group: 'automation-intelligence', name: 'AI integrations' },
  { group: 'automation-intelligence', name: 'AI agent/workflow development' },
  { group: 'automation-intelligence', name: 'Data/reporting systems' },
  { group: 'automation-intelligence', name: 'Analytics infrastructure' },

  { group: 'operate-improve', name: 'Website/software maintenance' },
  { group: 'operate-improve', name: 'Hosting coordination' },
  { group: 'operate-improve', name: 'Monitoring' },
  { group: 'operate-improve', name: 'Performance optimisation' },
  { group: 'operate-improve', name: 'Accessibility improvements' },
  { group: 'operate-improve', name: 'Technical SEO' },
  { group: 'operate-improve', name: 'Iterative product development' },

  // ---- Gridsmith Press -----------------------------------------------------
  { group: 'writing', name: 'Ghostwriting' },
  { group: 'writing', name: 'Book writing/development' },
  { group: 'writing', name: 'Website copywriting' },
  { group: 'writing', name: 'Sales/campaign copywriting' },
  { group: 'writing', name: 'Thought leadership' },
  { group: 'writing', name: 'Whitepapers' },
  { group: 'writing', name: 'Industry/business reports' },

  { group: 'editorial', name: 'Manuscript development' },
  { group: 'editorial', name: 'Developmental/structural editing' },
  { group: 'editorial', name: 'Copy editing' },
  { group: 'editorial', name: 'Proofreading' },
  { group: 'editorial', name: 'Manuscript assessment' },

  { group: 'publishing', name: 'Publishing preparation' },
  { group: 'publishing', name: 'Ebook/print formatting' },
  { group: 'publishing', name: 'Platform-standard formatting' },
  { group: 'publishing', name: 'ISBN guidance/support' },
  { group: 'publishing', name: 'Distribution/platform setup' },
  { group: 'publishing', name: 'Typesetting' },
  { group: 'publishing', name: 'Cover-design coordination' },

  { group: 'content-promotion', name: 'Ongoing content programmes' },
  { group: 'content-promotion', name: 'Content SEO' },
  { group: 'content-promotion', name: 'Book marketing/support' },
];

/** `group:name` — the identity of an approved service. `name` alone is not unique. */
export const approvedKey = (s: ApprovedService) => `${s.group}:${s.name}`;

/** The division a group belongs to, from the architecture. `null` if the group is not one. */
export function divisionOfGroup(group: string): ServiceDivision | null {
  return CAPABILITY_GROUPS.find((g) => g.key === group)?.division ?? null;
}

/**
 * Digital Marketing / campaign management — `GS-O011`, confirmed 16 September 2026.
 *
 * **It is a cross-division engagement, not a fourth discipline and not a capability group.**
 * The owner confirms Gridsmith provides campaign management; the medium-based division model
 * from `GS-P03` is preserved by decomposing the engagement into capabilities the approved
 * catalogue above already contains. Nothing here adds a service, a group, a CMS type or a
 * route — it is the documented map, and `check:service-content` asserts every entry resolves
 * to a real approved service so the decomposition cannot drift from the catalogue.
 *
 * Campaign strategy and coordination sit with **Master**, which `SERVICE-ARCHITECTURE.md` §2
 * already defines as the relationship, orchestration and cross-division programme layer. That
 * is why no new discipline is required: the orchestration layer already exists.
 *
 * **Channel and platform services are deliberately absent.** Google Ads/PPC management,
 * Meta/Facebook/Instagram advertising, social media management, Google Business Profile work
 * and email marketing are **not** confirmed by the phrase "campaign management" and are not in
 * the catalogue. The live `gridsmith.uk` advertises three of them, and the live site is
 * reference material rather than authority (`SERVICE-ARCHITECTURE.md` §4). They remain an open
 * owner question — `GS-O012`.
 */
export const DIGITAL_MARKETING_ENGAGEMENT: readonly {
  /** What the client is buying within the engagement. */
  activity: string;
  /** Which division executes it, or `master` where it is orchestration rather than production. */
  owner: ServiceDivision | 'master';
  /** The approved catalogue entry that carries it. `null` only for the Master orchestration rows. */
  approved: ApprovedService | null;
}[] = [
  { activity: 'Campaign strategy and coordination', owner: 'master', approved: null },
  { activity: 'Campaign management', owner: 'master', approved: null },
  { activity: 'Visual campaign creative', owner: 'design', approved: { group: 'brand-visual', name: 'Marketing and campaign creative' } },
  { activity: 'Advertising creative', owner: 'design', approved: { group: 'brand-visual', name: 'Marketing and campaign creative' } },
  { activity: 'Social and content creative', owner: 'design', approved: { group: 'brand-visual', name: 'Social/content creative' } },
  { activity: 'Written campaign copy', owner: 'press', approved: { group: 'writing', name: 'Sales/campaign copywriting' } },
  { activity: 'Content programmes', owner: 'press', approved: { group: 'content-promotion', name: 'Ongoing content programmes' } },
  { activity: 'Content SEO', owner: 'press', approved: { group: 'content-promotion', name: 'Content SEO' } },
  { activity: 'Landing pages', owner: 'digital', approved: { group: 'web', name: 'Website design and development' } },
  { activity: 'Technical SEO', owner: 'digital', approved: { group: 'operate-improve', name: 'Technical SEO' } },
  { activity: 'Tracking and integration infrastructure', owner: 'digital', approved: { group: 'automation-intelligence', name: 'API integrations' } },
  { activity: 'Reporting and measurement infrastructure', owner: 'digital', approved: { group: 'automation-intelligence', name: 'Data/reporting systems' } },
];

/**
 * Channel/platform services the phrase "campaign management" does **not** confirm. Listed so
 * the decision is visible and gate-checkable, never so they can be rendered:
 * `check:service-content` asserts no seeded service claims one of these. `GS-O012`.
 */
export const UNCONFIRMED_CHANNEL_SERVICES: readonly string[] = [
  'Google Ads',
  'PPC management',
  'Meta advertising',
  'Facebook advertising',
  'Instagram advertising',
  'Social media management',
  'Google Business Profile',
  'Email marketing',
  'Media buying',
];
