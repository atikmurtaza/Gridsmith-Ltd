/**
 * The five legal routes (`L-01`, `L-02`).
 *
 * **This lives in `lib/`, not in the schema file, and that is not tidiness.** `/legal/[slug]`
 * needs the list for `generateStaticParams`, and importing it from `sanity/schemas/` pulls
 * `sanity` — the whole Studio, `swr` and all — into the application bundle. The build fails
 * outright, which is the good outcome; the bad one would have been a build that succeeded and
 * put a CMS editor into the client chunks of a public route.
 *
 * So the constant is here and the schema imports it, exactly as `processStep` imports
 * `CANONICAL_STAGES` from `lib/process/canonical.ts` rather than declaring its own copy. One
 * list, two consumers, and the one that ships to browsers depends on nothing.
 */
export const LEGAL_DOCUMENT_SLUGS = [
  'privacy',
  'cookies',
  'terms',
  'client-terms',
  'accessibility',
] as const;

export type LegalSlug = (typeof LEGAL_DOCUMENT_SLUGS)[number];
