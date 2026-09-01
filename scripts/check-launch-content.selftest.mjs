#!/usr/bin/env node
/**
 * **The committed subject for `check:launch` — `M-P1-14`.**
 *
 * CLAUDE.md: *"A fix is not fixed until a permanent committed subject exists for a gate to
 * reach. A gate with no subject is not green and not red — it is silent."* `check:launch`'s
 * live tier was silent. Its only subject was the live dataset, the live dataset has never held
 * a `[SEED]` marker or a published seed record, and so **the assertions that exist to enforce
 * non-negotiable #4 had never been observed to fire.** The seed count printed a number every
 * run, which is exactly the wording CLAUDE.md warns is easiest to produce without measuring:
 * *"a summary line is not evidence a check ran."*
 *
 * Every specimen below is a deliberate failure that must stay failing, plus the clean cases
 * that must stay passing. They are committed, they run in `verify:static` and in CI, and they
 * cannot be lost by a dataset changing under the gate.
 *
 * **`ZERO` and `MANY` are the count-moves proof.** A gate whose output is a count must be
 * provable to report a different number, or nothing has been shown to be counting. These two
 * specimens differ only in `publishedSeeds` — 0 and 121 — and the second is the real figure
 * measured in the `development` dataset on 26 Aug 2026.
 */
import { evaluate } from './launch-content-rules.mjs';
import { PRODUCTION_DATASET } from '../sanity/project.ts';

/** A complete, launch-ready statutory record. No [SEED] anywhere. */
const CLEAN_RECORD = {
  legalName: 'Gridsmith Ltd',
  companyNumber: '00000000',
  placeOfRegistration: 'England and Wales',
  registeredOffice: 'A registered office address',
  responseCommitment: 'By end of the next business day',
  vatNumber: 'GB000000000',
  contactEmail: 'hello@example.invalid',
};

/** The exact condition that would currently publish: a live dataset full of seed content. */
const SEEDED_RECORD = { ...CLEAN_RECORD, vatNumber: '[SEED] GB123456789' };

const ok = (over = {}) => ({
  dataset: PRODUCTION_DATASET,
  queryStatus: 200,
  result: CLEAN_RECORD,
  seedStatus: 200,
  publishedSeeds: 0,
  ...over,
});

const SPECIMENS = [
  // ── must FAIL ───────────────────────────────────────────────────────────────────────────
  {
    name: 'SEEDED — [SEED] marker in a live dataset',
    input: ok({ result: SEEDED_RECORD, publishedSeeds: 121 }),
    expect: [
      'vatNumber carries a [SEED] marker and the dataset is live: "[SEED] GB123456789"',
      '121 published seed document(s) in the live dataset',
    ],
  },
  {
    name: 'MANY — published seed records in a live dataset, statutory record otherwise clean',
    input: ok({ publishedSeeds: 121 }),
    expect: ['121 published seed document(s) in the live dataset'],
  },
  {
    name: 'ONE — a single published seed record is still a failure',
    input: ok({ publishedSeeds: 1 }),
    expect: ['1 published seed document(s) in the live dataset'],
  },
  {
    name: 'NOT-A-NUMBER — a count that is not a number must not report clean',
    input: ok({ publishedSeeds: null }),
    expect: ['the seed count query returned null, not a number'],
  },
  {
    name: 'SEED-QUERY-DOWN — an unmeasured count is a failure, never a skip',
    input: ok({ seedStatus: 503 }),
    expect: ['the seed count query returned HTTP 503 — seed enforcement measured nothing'],
  },
  {
    name: 'DATASET-DOWN — an unreachable dataset is a failure, never a skip',
    input: ok({ queryStatus: 404, result: null }),
    expect: ['returned 404 — nothing could be measured'],
  },
  {
    name: 'EMPTY — no companyDetails singleton at all',
    input: ok({ result: null }),
    expect: ['no companyDetails document in dataset'],
  },
  {
    name: 'STATUTORY — a Companies Act field empty, in ANY dataset',
    input: ok({ dataset: 'development', result: { ...CLEAN_RECORD, placeOfRegistration: '' } }),
    expect: ['placeOfRegistration is empty'],
  },
  {
    name: 'LIVE-ONLY — vatNumber empty on a live dataset',
    input: ok({ result: { ...CLEAN_RECORD, vatNumber: '' } }),
    expect: ['vatNumber is empty and the dataset is live'],
  },

  // ── must PASS ───────────────────────────────────────────────────────────────────────────
  {
    name: 'ZERO — a clean, complete live dataset builds',
    input: ok(),
    expect: [],
  },
  {
    // The tier split, asserted rather than assumed: the SAME seeded record that fails above
    // is legitimate in `development`, which is the entire reason the gate has two tiers.
    name: 'DEV — [SEED] markers and 121 seed records are fine off production',
    input: ok({ dataset: 'development', result: SEEDED_RECORD, publishedSeeds: 121 }),
    expect: [],
  },
];

let failed = 0;
for (const { name, input, expect } of SPECIMENS) {
  const problems = evaluate(input);
  const missing = expect.filter((e) => !problems.some((p) => p.includes(e)));
  const unexpected = expect.length === 0 && problems.length > 0;

  if (missing.length > 0 || unexpected) {
    failed += 1;
    console.error(`\n  ✗ ${name}`);
    for (const m of missing) console.error(`      expected a problem containing: ${m}`);
    if (unexpected) console.error('      expected NO problems, got:');
    for (const p of problems) console.error(`      got: ${p}`);
  } else {
    console.log(`  ✓ ${name.padEnd(72)} ${expect.length} problem(s)`);
  }
}

/**
 * The count of specimens is hardcoded, not derived from `SPECIMENS.length` — CLAUDE.md,
 * *"an expectation derived from its own subject cannot fail when the subject is removed"*.
 * Deleting a specimen must fail this file, not shrink its report.
 */
const EXPECTED_SPECIMENS = 11;
if (SPECIMENS.length !== EXPECTED_SPECIMENS) {
  console.error(
    `\ncheck-launch-content.selftest: ${SPECIMENS.length} specimens, expected ${EXPECTED_SPECIMENS}.` +
      '\nThese are the committed subject for check:launch — CLAUDE.md forbids deleting a proof' +
      '\nartefact. If a specimen is genuinely obsolete, change this number in the same commit' +
      '\nand say why in VALIDATION §14.\n',
  );
  process.exitCode = 1;
} else if (failed > 0) {
  console.error(
    `\ncheck-launch-content.selftest: ${failed} of ${SPECIMENS.length} specimen(s) did not behave as recorded.\n`,
  );
  process.exitCode = 1;
} else {
  console.log(
    `\ncheck-launch-content.selftest: ${SPECIMENS.length} specimens — ` +
      `${SPECIMENS.filter((s) => s.expect.length > 0).length} deliberate failures still fail, ` +
      `${SPECIMENS.filter((s) => s.expect.length === 0).length} clean cases still pass.`,
  );
}
