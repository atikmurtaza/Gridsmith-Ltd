import { sanityClient } from '@/lib/sanity/client';

/**
 * The statutory record, read once per build (`M-05`).
 *
 * **No `vatNumber`.** Gridsmith is not VAT registered, so there is nothing to disclose under
 * e-commerce regs reg. 6(1)(g) and no field to read — see `sanity/schemas/companyDetails.ts`.
 */
export type CompanyDetails = {
  legalName: string;
  companyNumber: string;
  placeOfRegistration: string;
  registeredOffice: string;
  tradingAddress: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  responseCommitment: string;
};

/**
 * The `tel:` form of a displayed phone number — `GS-O004`.
 *
 * RFC 3966 wants a global number with no visual separators, and `+44 7405 448534` carries
 * two. The live `gridsmith.uk` links `tel:+44%207405%20448534`, which percent-encodes the
 * spaces rather than removing them; that resolves on most dialers and is not what the RFC
 * describes. Deriving the href here rather than storing a second field is what stops the
 * displayed number and the dialed number from ever being different numbers — which is
 * exactly the defect the live site's footer already has with its two email addresses
 * (`LIVE-SITE-EXTRACT.md` §11.2).
 *
 * Everything that is not `+` or a digit is dropped, so it cannot emit a malformed href
 * whatever the singleton holds.
 */
export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^+\d]/g, '')}`;
}

export const COMPANY_DETAILS_QUERY = `*[_type == "companyDetails"][0]{
  legalName, companyNumber, placeOfRegistration, registeredOffice, tradingAddress,
  contactEmail, contactPhone, responseCommitment
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
