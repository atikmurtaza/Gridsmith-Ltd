/**
 * Seeds `companyDetails` into the **development** dataset only (`M-05`).
 *
 * `production` is deliberately left empty. Nothing here can write to it: the dataset is
 * hardcoded below rather than read from the environment, because a seed script that follows
 * `NEXT_PUBLIC_SANITY_DATASET` is one mis-set variable away from putting placeholder content
 * into live — which is the failure `FOUNDATION` §7 exists to prevent.
 *
 * The write token is read from `.env.local` (gitignored) by name only. Run with:
 *
 *   npm run seed:company
 *
 * **There is no `vatNumber` any more, here or on the schema.** Gridsmith is not VAT
 * registered, so e-commerce regs reg. 6(1)(g) is not engaged and the correct disclosure is
 * none at all — a placeholder here was the mechanism that put `[SEED] GB123456789` in the
 * footer of every page, which is a false statement rather than a marked-unusable one.
 */
import { rmSync } from 'node:fs';
import { createClient } from '@sanity/client';
import { SANITY_API_VERSION, SANITY_PROJECT_ID } from '../sanity/project.ts';

const DATASET = 'development';

const token = process.env.SANITY_API_WRITE_TOKEN;
if (!token) {
  console.error(
    '\nseed-company-details: SANITY_API_WRITE_TOKEN is not set.\n' +
      'It lives in .env.local, which is gitignored. Run via `npm run seed:company`, which\n' +
      'passes --env-file=.env.local.\n',
  );
  process.exit(1);
}

const doc = {
  _id: 'companyDetails',
  _type: 'companyDetails',
  legalName: 'Gridsmith Ltd',
  companyNumber: '17050842',
  // **`England`, confirmed by the owner at `GS-O004` and corroborated against the public
  // register.** It was `England & Wales`, which was an agent-chosen seed value that no owner
  // and no register had ever confirmed — `PRE-DEPLOYMENT-CHECKLIST.md` A1/A2 said so. The
  // Companies House register for 17050842, read 16 September 2026, gives the registered office
  // country as `England`, and the owner's supplied public description is `Registered in
  // England`. The footer renders "registered in {placeOfRegistration}", so this string IS the
  // reg. 25(2)(a) particular and it is the owner's fact, not an inference.
  placeOfRegistration: 'England',
  // **Confirmed against the public register, 16 September 2026**, which gives
  // `30 Briarfield Road, Farnworth, Bolton, England, BL4 0HD` — the same premises and the
  // same digit-zero postcode. The country component is not repeated here because the footer
  // states the part of the UK separately, and because the three `_legal/` instruments carry
  // this exact string; amending a clause is not available to an implementer.
  //
  // **This string renders in exactly two places and that is now enforced.** SI 2015/17
  // reg. 25(2)(c) requires the registered office on the website, which is the statutory
  // footer; `_legal/` carries it as the address for service. `GS-O004` withdraws it from the
  // rest of the marketing site, and `check:company` question 4 refuses it anywhere else.
  registeredOffice: '30 Briarfield Road, Farnworth, Bolton, BL4 0HD',
  // Same as the registered office, so the field stays empty and the footer says it once.
  tradingAddress: '',
  // **Real, and no longer a placeholder.** The footer's contact line is what satisfies
  // e-commerce regs reg. 6(1)(c) — contact details including an email address that make it
  // possible to reach the provider rapidly — so a `[SEED]` value there was a legal
  // requirement met by a string that cannot receive mail.
  contactEmail: 'contact@gridsmith.uk',
  // **Published at `GS-O004`, and it is the number the live gridsmith.uk already publishes**
  // (`LIVE-SITE-EXTRACT.md` §9), so the two artefacts corroborate each other rather than
  // introducing a third contact route. Stored in display form; every render derives the
  // `tel:` href from it by stripping everything but `+` and digits, so there is one string
  // and no second copy to drift.
  contactPhone: '+44 7405 448534',
  tradingNames: ['Gridsmith Design', 'Gridsmith Digital', 'Gridsmith Press'],
  // **`GS-O004` withdrew the guarantee, and the replacement is a statement of typical
  // behaviour rather than a smaller promise.** It read *"We'll reply as soon as we can, and
  // always by the end of the next business day"* — "always" is an unqualified undertaking,
  // and the owner does not authorise a guaranteed response time or an SLA of any kind.
  //
  // Non-negotiable #5 says never promise faster than the end of the next business day. This
  // is slower than that ceiling and is not a promise at all, so the rule is satisfied twice
  // over; it stays the single source of truth for every surface that says anything about
  // timing. `check:company` question 5 refuses guarantee wording on the served pages.
  responseCommitment: 'We typically respond within 48 hours.',
};

const client = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: DATASET,
  apiVersion: SANITY_API_VERSION,
  token,
  useCdn: false,
});

const written = await client.createOrReplace(doc);
console.log(`seed-company-details: wrote ${written._id} to dataset "${DATASET}"`);
console.log(`  companyNumber ${doc.companyNumber}`);
console.log(`  contactEmail "${doc.contactEmail}" — real; no vatNumber (not VAT registered)`);
console.log(`  contactPhone "${doc.contactPhone}" — GS-O004`);
console.log(`  placeOfRegistration "${doc.placeOfRegistration}" — GS-O004, register-corroborated`);
console.log(`  responseCommitment "${doc.responseCommitment}" — typical behaviour, not an SLA`);
console.log('  no businessHours field: GS-O004 does not authorise published opening hours');

// Next's Data Cache persists across local builds, so a rebuild after a content change can
// prerender the previous response with nothing reporting it — measured, by adding
// contactEmail and getting a footer without it. Clearing it here fixes the staleness where
// the content changes, rather than at the fetch, where `cache: 'no-store'` would have turned
// every route from static to server-rendered-on-demand. CI is unaffected: it builds clean.
rmSync('.next/cache/fetch-cache', { recursive: true, force: true });
console.log('  cleared .next/cache/fetch-cache so the next build re-reads the dataset');
