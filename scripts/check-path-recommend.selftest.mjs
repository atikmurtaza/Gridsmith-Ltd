#!/usr/bin/env node
/**
 * **`check:path:selftest` — the committed subject for `lib/path/recommend.ts` (`K-03`).**
 *
 * Read `lib/path/recommend.ts` first; the three forced semantics and the tie policy are
 * documented there and each has a specimen here.
 *
 * ## Why this shape
 *
 * `recommend` is pure, so every specimen asserts a **return value** rather than the absence of
 * output. `CLAUDE.md`: that is the structural immunity — a probe that produces no red proves
 * nothing until it is shown to be a subject the gate could have caught, and a value read is not
 * an absence. There is nothing to inject and nothing to be inert.
 *
 * It imports the real module by path. Node 24 strips the types on import, so the subject is the
 * shipped file and not a `.mjs` transcription of it — the §21 defect in miniature is exactly
 * what a second copy would be.
 *
 * ## What this does NOT assert
 *
 * That the rules are right. There are no rules yet — no Epic O row and no `Q-P` number owns the
 * Path Finder's rule content — and `K-04` is the run that asserts the ETH-04 scenarios against
 * the real config once it exists. **A green line here means the evaluator is correct, not that
 * the Path Finder recommends honestly.** Same ceiling as `check:legal:parity`, stated for the
 * same reason.
 */
import { recommend, matchesCondition, parseSet } from '../lib/path/recommend.ts';

const OUTCOMES = [
  { key: 'full-package', isGridsmithService: true, showCta: true },
  { key: 'ghostwriting', isGridsmithService: true, showCta: true },
  { key: 'assessment-first', isGridsmithService: true, showCta: true },
  { key: 'content-programme', isGridsmithService: true, showCta: true },
  { key: 'self-service', isGridsmithService: false, showCta: false },
  { key: 'not-ready', isGridsmithService: false, showCta: false },
];

const rule = (outcome, priority, conditions) => ({ conditions, outcome, priority });
const is = (questionKey, value) => ({ questionKey, operator: 'is', value });

const FULL = [
  rule('full-package', 10, [is('stage', 'finished'), is('budget', '10k-30k')]),
  rule('self-service', 20, [is('budget', 'under-500')]),
];

const CASES = [
  {
    name: 'MATCH — all conditions hold, the rule wins',
    run: () => recommend(FULL, OUTCOMES, { stage: 'finished', budget: '10k-30k' }),
    expect: (r) => r.outcome === 'full-package' && r.ruleIndex === 0 && r.isGridsmithOutcome === true,
  },
  {
    name: 'AND — one condition fails, the rule does not fire',
    run: () => recommend([FULL[0]], OUTCOMES, { stage: 'finished', budget: 'under-500' }),
    expect: (r) => r.outcome === null && r.ruleIndex === null,
  },
  {
    name: 'NO MATCH IS NULL — never a fallback outcome (ETH-04)',
    run: () => recommend(FULL, OUTCOMES, { stage: 'idea' }),
    expect: (r) => r.outcome === null && r.isGridsmithOutcome === null && r.tiedWith.length === 0,
  },
  {
    name: 'PRIORITY — lower wins regardless of document order',
    run: () =>
      recommend(
        [rule('full-package', 90, [is('stage', 'finished')]), rule('not-ready', 5, [is('stage', 'finished')])],
        OUTCOMES,
        { stage: 'finished' },
      ),
    expect: (r) => r.outcome === 'not-ready' && r.ruleIndex === 1,
  },
  {
    name: 'TIE — reported in tiedWith, winner still deterministic',
    run: () =>
      recommend(
        [rule('ghostwriting', 10, [is('stage', 'idea')]), rule('not-ready', 10, [is('stage', 'idea')])],
        OUTCOMES,
        { stage: 'idea' },
      ),
    expect: (r) => r.outcome === 'ghostwriting' && r.tiedWith.length === 1 && r.tiedWith[0] === 'not-ready',
  },
  {
    name: 'TIE IS NOT REPORTED WHEN THERE IS NONE — tiedWith stays empty',
    run: () => recommend(FULL, OUTCOMES, { stage: 'finished', budget: '10k-30k' }),
    expect: (r) => r.tiedWith.length === 0,
  },
  {
    name: 'HONEST OUTCOME — isGridsmithOutcome is false, not falsy-by-absence',
    run: () => recommend(FULL, OUTCOMES, { budget: 'under-500' }),
    expect: (r) => r.outcome === 'self-service' && r.isGridsmithOutcome === false,
  },
  {
    name: 'DANGLING OUTCOME — reported, never substituted',
    run: () => recommend([rule('premium-upsell', 1, [is('stage', 'idea')])], OUTCOMES, { stage: 'idea' }),
    expect: (r) => r.outcome === 'premium-upsell' && r.unknownOutcome === true && r.isGridsmithOutcome === null,
  },
  {
    name: 'OPERATOR is — exact match only',
    run: () => [
      matchesCondition(is('stage', 'idea'), { stage: 'idea' }),
      matchesCondition(is('stage', 'idea'), { stage: 'ideas' }),
    ],
    expect: ([hit, miss]) => hit === true && miss === false,
  },
  {
    name: 'OPERATOR in — comma-separated set, trimmed (decision 1)',
    run: () => [
      matchesCondition({ questionKey: 'b', operator: 'in', value: 'a, b ,c' }, { b: 'b' }),
      matchesCondition({ questionKey: 'b', operator: 'in', value: 'a, b ,c' }, { b: 'd' }),
      parseSet('a, b ,c ,,').length,
    ],
    expect: ([hit, miss, n]) => hit === true && miss === false && n === 3,
  },
  {
    name: 'OPERATOR not — matches a different answer, not an absent one (decision 2)',
    run: () => [
      matchesCondition({ questionKey: 's', operator: 'not', value: 'idea' }, { s: 'finished' }),
      matchesCondition({ questionKey: 's', operator: 'not', value: 'idea' }, {}),
      matchesCondition({ questionKey: 's', operator: 'not', value: 'idea' }, { s: '' }),
    ],
    expect: ([answered, absent, empty]) => answered === true && absent === false && empty === false,
  },
  {
    name: 'UNKNOWN OPERATOR — matches nothing',
    run: () => matchesCondition({ questionKey: 's', operator: 'maybe', value: 'idea' }, { s: 'idea' }),
    expect: (v) => v === false,
  },
  {
    name: 'EMPTY INPUTS — no rules, and a rule with no conditions',
    run: () => [
      recommend([], OUTCOMES, { stage: 'idea' }).outcome,
      recommend([rule('full-package', 1, [])], OUTCOMES, { stage: 'idea' }).outcome,
    ],
    expect: ([noRules, noConditions]) => noRules === null && noConditions === null,
  },
];

let failed = 0;
for (const c of CASES) {
  let pass = false;
  let got;
  try {
    got = c.run();
    pass = c.expect(got);
  } catch (e) {
    got = `threw: ${e.message}`;
  }
  console.log(`  ${pass ? '✓' : '✗'} ${c.name}`);
  if (!pass) {
    failed++;
    console.error(`      got ${JSON.stringify(got)}`);
  }
}
if (failed) {
  console.error(`\n✗ check:path:selftest — ${failed} of ${CASES.length} case(s) failed.`);
  process.exit(1);
}
console.log(`✓ check:path:selftest — ${CASES.length} cases over lib/path/recommend.ts.`);
