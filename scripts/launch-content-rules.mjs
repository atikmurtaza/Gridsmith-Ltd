/**
 * The launch-content assertions, as a pure function — `M-P1-14`.
 *
 * These lived inline in `check-launch-content.mjs`, which is a top-level-`await` script that
 * fetches before it asserts. Nothing could reach the assertions without a network and a served
 * site, so **the only subject the rules ever had was whatever the live dataset happened to
 * contain** — and the live dataset has never contained a `[SEED]` marker. The zero-tolerance
 * seed rule, the reason non-negotiable #4 exists, had therefore never been observed to fire.
 *
 * Splitting the predicate from the fetch gives it a subject that is committed, always present,
 * and cannot be deleted without deleting a CI step: `check-launch-content.selftest.mjs`. That
 * file is the permanent specimen required by CLAUDE.md — "a fix is not fixed until a permanent
 * committed subject exists for a gate to reach".
 *
 * Nothing here reads the environment, the network or the clock. Everything it decides on comes
 * in as an argument, which is what makes the specimens honest: the self-test exercises the same
 * function the real run does, not a copy of it.
 */
import { PRODUCTION_DATASET } from '../sanity/project.ts';

/**
 * **Checked against the legislation, not against the tracker row's summary of it.**
 *
 * `reg. 24(2)` of the Companies (Trading Disclosures) Regulations 2015 requires the
 * registered name on a company's websites; `reg. 25(2)` requires the part of the UK in which
 * it is registered, its registered number and its registered office address. The row
 * summarised this as "registered name, registered number, registered office" and dropped the
 * place of registration.
 */
export const ALWAYS_REQUIRED = [
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
export const LIVE_REQUIRED = [
  ['vatNumber', 'e-commerce regs reg. 6(1)(g)'],
  ['contactEmail', 'e-commerce regs reg. 6(1)(c)'],
];

/**
 * @param {object} input
 * @param {string}          input.dataset        the dataset actually measured
 * @param {number|null}     input.queryStatus    HTTP status of the companyDetails query, or null if it threw
 * @param {object|null}     input.result         the companyDetails singleton, or null
 * @param {number|null}     input.seedStatus     HTTP status of the seed-count query, or null if it threw
 * @param {unknown}         input.publishedSeeds whatever the seed count query returned — deliberately unknown
 * @returns {string[]} problems; empty means clean
 */
export function evaluate({ dataset, queryStatus, result, seedStatus, publishedSeeds }) {
  const isLive = dataset === PRODUCTION_DATASET;
  const problems = [];

  if (queryStatus !== 200) {
    problems.push(`dataset "${dataset}" returned ${queryStatus} — nothing could be measured`);
  } else if (!result) {
    problems.push(
      `no companyDetails document in dataset "${dataset}" — every page renders the statutory footer`,
    );
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

  if (seedStatus !== 200) {
    problems.push(
      `the seed count query returned HTTP ${seedStatus} — seed enforcement measured nothing`,
    );
  } else if (typeof publishedSeeds !== 'number') {
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

  return problems;
}
