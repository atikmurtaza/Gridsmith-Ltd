/**
 * The seven legal routes (`L-01`, `L-02`).
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
 *
 * ## Why `client-terms` became three slugs — owner's decision, 26 August 2026
 *
 * It was one slug serving two instruments. `docs/_legal/MSA-BUSINESS.md` (business clients)
 * and `docs/_legal/CONSUMER-TERMS.md` (consumers) both mapped to `/legal/client-terms`, and
 * the seeded document there mixed both regimes — clause 1.1 on the Companies Act, clause 2.1
 * on Consumer Rights Act 2015 s. 50. **A liability cap drafted for a business client is void
 * against a consumer to that extent under CRA 2015 s. 57**, and a Press author reading that
 * page had no way to tell that half of it did not apply to them. Four passes of verification
 * confirmed it is unfixable by drafting: one instrument cannot carry both a valid B2B cap and
 * a CRA-compliant consumer position.
 *
 * The instruments are therefore separated, and the old path is kept as a **disambiguation
 * page** rather than redirected. A redirect has to pick a target, and every target is wrong
 * for half the people following the link — a consumer landed silently on B2B terms is the
 * same defect with an extra hop. `client-terms` now carries no operative clause at all: it
 * says who each instrument governs and points at both.
 *
 * The slugs spell out the audience because the URL is read by people who are trying to work
 * out whether a document applies to them. `client-terms-business` was the option the draft
 * proposed; `business-client-terms` reads as a noun phrase in a browser's address bar and in
 * a footer, which `client-terms-business` does not.
 */
export const LEGAL_DOCUMENT_SLUGS = [
  'privacy',
  'cookies',
  'terms',
  'client-terms',
  'business-client-terms',
  'consumer-client-terms',
  'accessibility',
] as const;

export type LegalSlug = (typeof LEGAL_DOCUMENT_SLUGS)[number];

export const CLIENT_TERMS_BUSINESS = 'business-client-terms';
export const CLIENT_TERMS_CONSUMER = 'consumer-client-terms';
export const CLIENT_TERMS_DISAMBIGUATION = 'client-terms';

/**
 * The two client-terms instruments never link to each other.
 *
 * `/legal/[slug]` ends with an "other documents" list built from every other legal document,
 * which would put a link to the business MSA on the consumer page — reintroducing exactly the
 * defect the split removes, in the one place a reader is most likely to click. Each instrument
 * links to `/legal/client-terms` instead, which explains both before sending anyone anywhere.
 *
 * `scripts/check-consumer-terms.mjs` asserts this against the SERVED pages, not against this
 * map: the map is the mechanism, and a gate that read it would be checking its own subject.
 */
export const CLIENT_TERMS_COUNTERPART: Partial<Record<LegalSlug, LegalSlug>> = {
  [CLIENT_TERMS_BUSINESS]: CLIENT_TERMS_CONSUMER,
  [CLIENT_TERMS_CONSUMER]: CLIENT_TERMS_BUSINESS,
};
