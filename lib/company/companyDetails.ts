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
 * The published number, in the two forms it is allowed to be linked as — `GS-R001-R`.
 *
 * **`telHref` is gone and `tel:` is prohibited.** `GS-O004` published the number and linked it
 * for dialling; the owner's `GS-R001-R` decision supersedes that limb and only that limb. The
 * number is unchanged, still published, still the same number the live `gridsmith.uk` shows —
 * what changed is that it is **not a voice-call channel**. Nobody has committed to answering a
 * ring, there are no published hours (`GS-O004`, unchanged), and a `tel:` link on a business
 * site is an invitation to call. `check:company` question 3 now refuses any `tel:` href on any
 * route, and `scripts/struck-rules.mjs` carries the strike.
 *
 * The number **is** authorised for WhatsApp and for SMS, which are both asynchronous — they
 * sit correctly beside *"We typically respond within 48 hours"* in a way a phone call does not.
 *
 * Both hrefs are **derived from the displayed string**, for the reason `telHref` was derived:
 * a stored second copy is how the number you read and the number you reach stop being the same
 * number, which is the defect the live site already has with its two email addresses
 * (`LIVE-SITE-EXTRACT.md` §11.2). Everything that is not `+` or a digit is dropped, so neither
 * can emit a malformed href whatever the singleton holds.
 */
const digits = (phone: string) => phone.replace(/[^+\d]/g, '');

/**
 * `https://wa.me/<international, no plus, no separators>` — wa.me rejects the `+`, which is why
 * this is not simply `digits()`. `447405448534`, not `+447405448534` and not `+44 7405 448534`.
 */
export function whatsAppHref(phone: string): string {
  return `https://wa.me/${digits(phone).replace(/^\+/, '')}`;
}

/**
 * `sms:` per RFC 5724 — the global form, `+` retained. Support is near-universal on mobile and
 * absent on most desktops, which is why it is never the only route offered beside it.
 */
export function smsHref(phone: string): string {
  return `sms:${digits(phone)}`;
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
