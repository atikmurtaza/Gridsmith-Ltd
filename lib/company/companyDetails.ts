import { sanityClient } from '@/lib/sanity/client';

/**
 * The statutory record, read once per build (`M-05`).
 *
 * `vatNumber` is `string` and may be empty — see the schema. Callers decide what an empty
 * value means; the footer omits its line, and `check:launch-content` refuses a production
 * dataset that still has one.
 */
export type CompanyDetails = {
  legalName: string;
  companyNumber: string;
  placeOfRegistration: string;
  registeredOffice: string;
  tradingAddress: string | null;
  vatNumber: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  responseCommitment: string;
  businessHours: string | null;
};

export const COMPANY_DETAILS_QUERY = `*[_type == "companyDetails"][0]{
  legalName, companyNumber, placeOfRegistration, registeredOffice, tradingAddress,
  vatNumber, contactEmail, contactPhone, responseCommitment, businessHours
}`;

/**
 * **Throws when the singleton is missing, rather than returning null.**
 *
 * Every page renders the statutory footer, so a missing record is a site that cannot
 * legally be served — failing the build is the correct outcome and a silent empty footer is
 * the one thing that must not happen. `A11Y`-style graceful degradation does not apply to a
 * Companies Act disclosure.
 */
export async function getCompanyDetails(): Promise<CompanyDetails> {
  // **No `cache: 'no-store'` here, and that was measured rather than assumed.** Next patches
  // global `fetch` with its Data Cache during `next build`, and the cache persists in
  // `.next/cache` between local builds — adding `contactEmail` to the seed and rebuilding
  // produced the old response and no contact line, silently. `no-store` fixes the staleness
  // and turns all seven routes from static to server-rendered-on-demand (`○` to `ƒ`), which
  // breaks the SSG requirement in `TECH-SPEC.md` §1 and every LCP budget with it. A data
  // freshness problem is not worth a rendering-mode change.
  //
  // The staleness is local-only — CI runs `npm ci` into a clean tree — and the remedy is at
  // the point content changes: `npm run seed:company` clears `.next/cache/fetch-cache` after
  // writing. Prerendering stays static and a rebuild after a seed shows the new content.
  const details = await sanityClient.fetch<CompanyDetails | null>(COMPANY_DETAILS_QUERY);
  if (!details) {
    throw new Error(
      `No companyDetails document in dataset "${sanityClient.config().dataset}". Every page ` +
        'renders the statutory footer, so the build cannot proceed without it. Seed it with ' +
        '`npm run seed:company`.',
    );
  }
  return details;
}
