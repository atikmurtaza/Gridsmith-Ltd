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
 * *Only when the dataset is `production`*: `vatNumber` is non-empty and no field carries a
 * `[SEED]` marker. Registration is in progress, so the field is legitimately empty today —
 * it is a required field with a known-empty value, not an absent one, and the footer omits
 * its line while it is empty. What must not happen is that state reaching live.
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

/** Companies Act 2006 s.82 / SI 2015/17 reg. 25 — the fields a website must disclose. */
const ALWAYS_REQUIRED = [
  'legalName',
  'companyNumber',
  'placeOfRegistration',
  'registeredOffice',
  'responseCommitment',
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
    if (!String(result.vatNumber ?? '').trim()) {
      problems.push(
        'vatNumber is empty and the dataset is live. Supplying it is a content edit — no ' +
          'schema change, no code change, no deploy',
      );
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
        ? ', VAT number supplied, no [SEED] markers'
        : `; the live-only assertions (VAT number, no [SEED] markers) do not apply to "${SANITY_DATASET}"`),
  );
}
