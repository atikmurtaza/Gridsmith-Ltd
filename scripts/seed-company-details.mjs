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
 * **`vatNumber` is a deliberately invalid placeholder, not a blank.** Registration is in
 * progress and the number arrives before launch, but the rendering path that shows the VAT
 * line has to be exercised now rather than first seen at launch. `[SEED]` marks it as
 * unusable to any human reading it, per FOUNDATION §7.6.
 */
import { createClient } from '@sanity/client';
import { SANITY_API_VERSION, SANITY_PROJECT_ID } from '../sanity/env.ts';

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
  placeOfRegistration: 'England & Wales',
  registeredOffice: '30 Briarfield Road, Farnworth, Bolton, BL4 0HD',
  // Same as the registered office, so the field stays empty and the footer says it once.
  tradingAddress: '',
  vatNumber: '[SEED] GB000000000',
  tradingNames: ['Gridsmith Design', 'Gridsmith Digital', 'Gridsmith Press'],
  responseCommitment:
    "We'll reply as soon as we can, and always by the end of the next business day.",
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
console.log(`  companyNumber ${doc.companyNumber} · vatNumber "${doc.vatNumber}" (placeholder)`);
