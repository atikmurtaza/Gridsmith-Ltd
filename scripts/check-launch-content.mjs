/**
 * **The statutory record is complete for the dataset being built** (`M-05`).
 *
 * Two tiers, and the split is the point.
 *
 * *Always*, in every dataset: the singleton exists and the Companies Act fields carry a
 * value. Every page on the site renders the statutory footer, so an empty one is not a
 * degraded experience — it is a disclosure obligation unmet, and the build should not
 * produce it. This tier is what stops the gate being a no-op today. A check that only fires
 * on `production` would sit green and unexercised until the one build where it matters, and
 * a gate first exercised at launch is a gate nobody has run.
 *
 * *Only when the dataset is `production`*: every field in `LIVE_REQUIRED` is non-empty and
 * no field carries a `[SEED]` marker. Each of those is legitimately empty today — a required
 * field with a known-empty value, not an absent one, and the footer omits its line while it
 * is empty. What must not happen is that state reaching live.
 *
 * No token: both datasets are public. A fetch that fails is a hard failure rather than a
 * skip — the whole class of defect this repository keeps finding is a check that measured
 * nothing and reported clean.
 *
 * **`process.exitCode`, never `process.exit()`.** Calling `process.exit()` while undici's
 * connection pool is still open aborts the process on Windows — `Assertion failed:
 * !(handle->flags & UV_HANDLE_CLOSING)` — and an abort's exit status is not the 1 this gate
 * meant to return. Measured: the failing path reported 127. Setting `exitCode` and letting
 * the loop drain returns 1 on every platform.
 */
import { SANITY_API_VERSION, SANITY_DATASET, SANITY_PROJECT_ID, PRODUCTION_DATASET } from '../sanity/env.ts';

/**
 * **Checked against the legislation, not against the tracker row's summary of it.**
 *
 * `reg. 24(2)` of the Companies (Trading Disclosures) Regulations 2015 requires the
 * registered name on a company's websites; `reg. 25(2)` requires the part of the UK in which
 * it is registered, its registered number and its registered office address. The row
 * summarised this as "registered name, registered number, registered office" and dropped the
 * place of registration.
 */
const ALWAYS_REQUIRED = [
  'legalName',
  'companyNumber',
  'placeOfRegistration',
  'registeredOffice',
  'responseCommitment',
];

/**
 * Fields that may be empty today and must not be on a live dataset.
 *
 * **`contactEmail` is here because verifying `M-04`'s premise turned it up, and it was in no
 * tracker row.** The VAT number's basis is not the Companies Act at all — it is reg. 6(1)(g)
 * of the Electronic Commerce (EC Directive) Regulations 2002, which binds while the activity
 * is VAT-subject. reg. 6(1)(c) of the same instrument requires contact details including an
 * email address that make it possible to reach the provider rapidly, and that is a launch
 * obligation of exactly the same shape: legitimately empty now, unacceptable live.
 */
const LIVE_REQUIRED = [
  ['vatNumber', 'e-commerce regs reg. 6(1)(g)'],
  ['contactEmail', 'e-commerce regs reg. 6(1)(c)'],
];

const isLive = SANITY_DATASET === PRODUCTION_DATASET;
const problems = [];

const url =
  `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}` +
  `?query=${encodeURIComponent('*[_type == "companyDetails"][0]')}`;

const res = await fetch(url);
let result = null;
if (!res.ok) {
  problems.push(`dataset "${SANITY_DATASET}" returned ${res.status} — nothing could be measured`);
} else {
  ({ result } = await res.json());
}

if (res.ok && !result) {
  problems.push(`no companyDetails document in dataset "${SANITY_DATASET}" — every page renders the statutory footer`);
}

if (result) {
  for (const field of ALWAYS_REQUIRED) {
    if (!String(result[field] ?? '').trim()) problems.push(`${field} is empty`);
  }
  if (isLive) {
    for (const [field, why] of LIVE_REQUIRED) {
      if (!String(result[field] ?? '').trim()) {
        problems.push(
          `${field} is empty and the dataset is live (${why}). Supplying it is a content ` +
            'edit — no schema change, no code change, no deploy',
        );
      }
    }
    for (const [field, value] of Object.entries(result)) {
      if (typeof value === 'string' && value.includes('[SEED]')) {
        problems.push(`${field} carries a [SEED] marker and the dataset is live: "${value}"`);
      }
    }
  }
}

if (problems.length > 0) {
  console.error(`
check-launch-content: ${problems.length} problem(s) in dataset "${SANITY_DATASET}"
`);
  for (const p of problems) console.error(`  ${p}`);
  console.error('');
  process.exitCode = 1;
} else {
  console.log(
    `check-launch-content: dataset "${SANITY_DATASET}" — ${ALWAYS_REQUIRED.length} statutory field(s) present` +
      (isLive
        ? `, ${LIVE_REQUIRED.map(([f]) => f).join(' and ')} supplied, no [SEED] markers`
        : `; the live-only assertions (${LIVE_REQUIRED.map(([f]) => f).join(', ')}, no [SEED] markers) do not apply to "${SANITY_DATASET}"`),
  );
}
