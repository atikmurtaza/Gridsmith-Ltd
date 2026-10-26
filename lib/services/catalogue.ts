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
  { group: 'editorial', name: 'Line editing' },
  { group: 'editorial', name: 'Mechanical editing' },
  { group: 'editorial', name: 'Proofreading' },
  { group: 'editorial', name: 'Manuscript assessment' },

  { group: 'publishing', name: 'Publishing preparation' },
  { group: 'book-production', name: 'Ebook/print formatting' },
  { group: 'book-production', name: 'Platform-standard formatting' },
  { group: 'book-production', name: 'Typesetting' },
  { group: 'book-production', name: 'Cover-design coordination' },
  { group: 'book-production', name: 'Print production coordination' },
  { group: 'publishing', name: 'ISBN guidance/support' },
  { group: 'publishing', name: 'Metadata preparation' },
  { group: 'publishing', name: 'Distribution/platform setup' },

  { group: 'audiobook', name: 'Audiobook production support' },
  { group: 'audiobook', name: 'Narration/voice coordination' },
  { group: 'audiobook', name: 'Audio preparation' },

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
 * ## Channel and platform services — confirmed at `GS-P05`, `GS-O012`, 16 September 2026
 *
 * `GS-P04` deliberately left these out, because the phrase "campaign management" does not
 * confirm them and the live site is reference material rather than authority. The owner has now
 * confirmed them directly, so they are here — **as engagement rows, not as new capability
 * groups, disciplines, CMS types or routes.** Nothing about the medium-based division model
 * changes; the orchestration layer `GS-P03` already defined is what carries them.
 *
 * **Why the channel rows are owned by `master` and map to no approved service.** Running a
 * Google Ads or an email campaign is not a *medium* — it is the coordination of several, and the
 * production work it commissions (the creative, the copy, the landing page, the tracking) is
 * already in the catalogue under Design, Press and Digital. Filing "Google Ads management"
 * under one of those would put a cross-division engagement inside a division-bound group, which
 * `engagementProblems` would rightly refuse. `master` + `approved: null` is the shape the model
 * already has for exactly this, and campaign management has used it since `GS-P04`.
 *
 * **Google Business Profile is the one exception and is owned by `digital`,** because its
 * confirmed scope is setup and technical configuration of a local-search listing rather than
 * campaign coordination. It maps to `Technical SEO`, which is the approved Digital capability
 * that local-search configuration belongs to.
 *
 * ## Paid media — the position corrected at `GS-P06`, `GS-O013`
 *
 * `GS-P05` read `GS-O012`'s silence on "media buying" as a refusal and let the published copy go
 * on **denying** it. The owner's `GS-O013` remediation says that is wrong: managing a Google Ads
 * or a Meta account is placing paid media, so denying media buying contradicts capabilities the
 * same owner had already confirmed. The denial is struck from the copy and the capability is
 * stated as its own engagement row above.
 *
 * **What did not change is the catalogue.** No approved service was added, because `GS-O013`
 * confirms paid-media *management* and does not ask for a standalone media-buying product. That
 * is why `Media buying` stays in `UNCONFIRMED_CHANNEL_SERVICES` below, on a narrower reading than
 * it had — see that list's own note.
 *
 * **Confirming a capability is not approving copy for it.** No public wording exists for any
 * channel service, and none is invented here. Master engagement-model copy is still unwritten
 * and unrequested (`PROJECT-STATUS.md`), so these are recorded capabilities with no page —
 * which is the same state campaign management has been in since `GS-P04`.
 */
export const DIGITAL_MARKETING_ENGAGEMENT: readonly {
  /** What the client is buying within the engagement. */
  activity: string;
  /** Which division executes it, or `master` where it is orchestration rather than production. */
  owner: ServiceDivision | 'master';
  /** The approved catalogue entry that carries it. `null` only for the Master orchestration rows. */
  approved: ApprovedService | null;
}[] = [
  { activity: 'Digital marketing strategy', owner: 'master', approved: null },
  { activity: 'Campaign strategy and coordination', owner: 'master', approved: null },
  { activity: 'Campaign management', owner: 'master', approved: null },
  // Confirmed at GS-O012, 16 September 2026. Cross-division managed services: each commissions
  // production work that is already in the catalogue, and none of them is a medium.
  { activity: 'Google Ads / PPC management', owner: 'master', approved: null },
  { activity: 'Meta / Facebook / Instagram advertising management', owner: 'master', approved: null },
  // `GS-O013`, 16 September 2026. The owner's remediation records that denying media buying
  // contradicts the paid-channel capabilities confirmed at `GS-O012`: managing a Google Ads or
  // a Meta account *is* placing paid media. This row states that position once, explicitly, so
  // no later reader has to infer it from the two rows above — and so the copy correction has a
  // recorded capability behind it rather than only a deleted sentence.
  { activity: 'Paid media management and placement within managed advertising accounts', owner: 'master', approved: null },
  { activity: 'Social media account management', owner: 'master', approved: null },
  { activity: 'Email marketing campaigns', owner: 'master', approved: null },
  { activity: 'Visual campaign creative', owner: 'design', approved: { group: 'brand-visual', name: 'Marketing and campaign creative' } },
  { activity: 'Advertising creative', owner: 'design', approved: { group: 'brand-visual', name: 'Marketing and campaign creative' } },
  { activity: 'Social and content creative', owner: 'design', approved: { group: 'brand-visual', name: 'Social/content creative' } },
  { activity: 'Written campaign copy', owner: 'press', approved: { group: 'writing', name: 'Sales/campaign copywriting' } },
  { activity: 'Content programmes', owner: 'press', approved: { group: 'content-promotion', name: 'Ongoing content programmes' } },
  { activity: 'Content SEO', owner: 'press', approved: { group: 'content-promotion', name: 'Content SEO' } },
  { activity: 'Landing pages', owner: 'digital', approved: { group: 'web', name: 'Website design and development' } },
  { activity: 'Technical SEO', owner: 'digital', approved: { group: 'operate-improve', name: 'Technical SEO' } },
  // Setup and technical configuration of a local-search listing — Digital, not orchestration.
  { activity: 'Google Business Profile setup and management', owner: 'digital', approved: { group: 'operate-improve', name: 'Technical SEO' } },
  { activity: 'Tracking and integration infrastructure', owner: 'digital', approved: { group: 'automation-intelligence', name: 'API integrations' } },
  { activity: 'Reporting and measurement infrastructure', owner: 'digital', approved: { group: 'automation-intelligence', name: 'Data/reporting systems' } },
];

/**
 * Channel/platform phrases that **may not appear as a seeded service record's own claim** —
 * its title or one of its `covers`. `coverageProblems` limb 5 asserts it.
 *
 * ## `GS-O012` opened with nine; eight were confirmed, and the ninth changed meaning at `GS-P06`
 *
 * The eight confirmed on 16 September 2026 moved into `DIGITAL_MARKETING_ENGAGEMENT` above.
 * `Media buying` stayed here on the reading that the owner's silence was a refusal.
 *
 * **`GS-O013` corrected that reading, and this list survives it on a narrower one.** Paid-media
 * management is now an explicit engagement row, and no copy denies it. What is still absent is an
 * **approved catalogue entry** for standalone media buying: `GS-O013` also says the catalogue may
 * not be materially expanded, so a service record titled *Media buying*, or claiming it as a
 * capability, would be a page for something the approved catalogue does not contain. That is
 * what this list refuses — a service **record**, not the capability.
 *
 * Nothing in `DIGITAL_MARKETING_ENGAGEMENT` is in scope for the assertion: limb 5's haystack is a
 * record's title and `covers` only, and engagement activities are neither.
 *
 * Keeping the list non-empty is also what keeps the assertion alive. An empty list would leave
 * the gate matching nothing while still reporting a pass — a check with no subject, which
 * `CLAUDE.md` rates worse than a red one.
 */
export const UNCONFIRMED_CHANNEL_SERVICES: readonly string[] = ['Media buying'];
