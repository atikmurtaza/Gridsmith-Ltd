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
