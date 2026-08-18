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
 * ## Seed enforcement — `A-12`, folded in here rather than given its own gate
 *
 * `TECH-SPEC.md` §6 sketches `scripts/check-no-seed-in-prod.ts`, and **its query counts almost
 * nothing**: `count(*[isSeed == true && published == true])`. Only `service` has a `published`
 * field — `project`, `faq`, `testimonial`, `post` and `teamMember` do not — so for five of the
 * six seedable types the predicate is `undefined == true` and the count comes back zero from a
 * dataset full of published seed records. In Sanity, "published" means the document id carries
 * no `drafts.` prefix, which is a different thing entirely. Hence
 * `!(_id in path("drafts.**"))`.
 *
 * It also keyed off a third environment variable, `NEXT_PUBLIC_ENV`. Three variables meaning
 * overlapping things is how `M-P1-2` happened. The dataset is already the single fact that
 * says "live", so this keys off the same `PRODUCTION_DATASET` as everything else here.
 *
 * **The count is asserted to be a number in every dataset**, not merely compared to zero on
 * production. A query that returns anything else — a null, an object, an error status — would
 * make `> 0` false and report clean, on the one check whose entire purpose is to stop
 * fabricated case studies reaching production.
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

const seedUrl =
  `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}` +
  `?query=${encodeURIComponent('count(*[isSeed == true && !(_id in path("drafts.**"))])')}`;

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

const seedRes = await fetch(seedUrl);
let publishedSeeds = null;
if (!seedRes.ok) {
  problems.push(`the seed count query returned HTTP ${seedRes.status} — seed enforcement measured nothing`);
} else {
  ({ result: publishedSeeds } = await seedRes.json());
  if (typeof publishedSeeds !== 'number') {
    problems.push(
      `the seed count query returned ${JSON.stringify(publishedSeeds)}, not a number — ` +
        'anything but a number makes the comparison below false and reports clean',
    );
  } else if (isLive && publishedSeeds > 0) {
    problems.push(
      `${publishedSeeds} published seed document(s) in the live dataset. Fabricated case ` +
        'studies reaching production is the most damaging content failure available to this ' +
        'project (TECH-SPEC §6). Delete and replace them — seed records are never edited into ' +
        'real content (PROJECT-RULES §5)',
    );
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
  console.log(
    `check-launch-content: ${publishedSeeds} published seed document(s) counted` +
      (isLive
        ? ' — must be 0 on a live dataset, and is'
        : `; the zero-tolerance rule applies to "${PRODUCTION_DATASET}" only`),
  );

}
