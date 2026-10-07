/**
 * `GS-O003-R` — the legal evidence + owner adoption gate (`GS-LEGAL-001`, 6 October 2026).
 *
 * It replaces the earlier rule that no legal document could be published until a solicitor had
 * approved it (`GS-O003`, the `solicitorApproved` flag). The owner decided not to commission a
 * solicitor at this stage; instead each document is reviewed against current UK legislation and
 * official guidance (`docs/_legal/research/GS-LEGAL-001/`) and then **adopted by the owner**.
 * Nothing here claims solicitor review, certification or guaranteed enforceability.
 *
 * The states are ordered. A document is published only at `PUBLISHABLE`, which is reachable only
 * after `OWNER_ADOPTED`, and only the owner moves a document to `OWNER_ADOPTED` — by recording the
 * adoption date and the adopted version in `docs/_legal/GS-O003-R-REGISTER.json`. No script sets
 * it. `check:legal:adoption` enforces the documentary conditions for `PUBLISHABLE`.
 *
 * One list, several consumers — the Sanity schema, the legal route, the production migration and
 * the adoption gate — exactly as `slugs.ts` is shared, and for the same bundle reason.
 */
export const ADOPTION_STATES = [
  /** Drafted, with the research for each clause recorded. */
  'RESEARCHED',
  /** Citations checked against current sources; site facts and cross-document checks pass. */
  'VERIFIED',
  /** Every remaining item is an owner decision; nothing else is outstanding. */
  'OWNER_REVIEW_REQUIRED',
  /** The owner has adopted this exact version (date and version recorded in the register). */
  'OWNER_ADOPTED',
  /** Adopted and passing every documentary gate: eligible for the production dataset. */
  'PUBLISHABLE',
] as const;

export type AdoptionState = (typeof ADOPTION_STATES)[number];

export const isAdoptionState = (value: unknown): value is AdoptionState =>
  typeof value === 'string' && (ADOPTION_STATES as readonly string[]).includes(value);

export const isPublishable = (state: unknown) => state === 'PUBLISHABLE';

/**
 * Adopted by the owner but not yet `PUBLISHABLE` (`GS-LEGAL-001-R4`). The page must say this
 * plainly: "not yet adopted" would be false, and "in force" would claim a publication that has
 * not happened. `check:legal:parity` holds the served banner to exactly this three-way split.
 */
export const isAdoptedNotPublished = (state: unknown) => state === 'OWNER_ADOPTED';
