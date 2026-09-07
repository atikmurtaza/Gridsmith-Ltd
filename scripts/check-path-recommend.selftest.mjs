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
 * That the rules are **right**. As of 7 September 2026 there is a shipped rule set —
 * `lib/path/seedConfig.ts` — and it is `[SEED]`: `Q-P13` is how it stops being seed, and
 * `docs/_shared/PRE-DEPLOYMENT-CHECKLIST.md` carries the row.
 *
 * **This file now answers two questions and prints one summary line, so say which is which.**
 * The cases above assert the **evaluator** (`K-03`). The `K-04`/`K-05` cases appended below
 * assert the **shipped rule set** — that both honest outcomes are reachable, that neither
 * carries a CTA, that `APP-FLOW.md` §5's mandate holds, and that the static table's criteria
 * are derived from the same rules the evaluator runs. Neither block is evidence for the other,
 * and neither is evidence that a criterion is the *correct* criterion. Same ceiling as
 * `check:legal:parity`, stated for the same reason.
 */
import { recommend, matchesCondition, parseSet } from '../lib/path/recommend.ts';
import {
  SEED_RULES,
  SEED_OUTCOMES,
  criteriaFor,
  pathFinderSeedConfig,
} from '../lib/path/seedConfig.ts';
import { ethicsRule } from '../sanity/schemas/pathFinderConfig.ts';

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

/**
 * ## `K-04` — the ETH-04 verification run, against the real config
 *
 * Everything above asserts the **evaluator**. Everything below asserts the **rule set that is
 * actually shipped** — `lib/path/seedConfig.ts` — and it is a different question, which is why
 * the two are separated here rather than mixed into one list.
 *
 * `press/PROJECT-TRACKER.md` `K-04` calls for three scenarios and non-negotiable #9 is what
 * they exist for: *"The Path Finder must be able to recommend against Gridsmith."* The three
 * are (1) each honest outcome is reachable by a complete answer set, (2) no honest outcome
 * carries a CTA and each carries real guidance, and (3) `APP-FLOW.md` §5's mandate holds.
 *
 * **Every case reads a returned value.** Reachability is asserted by driving a complete answer
 * set through the shipped `recommend()` and reading the key it returns — never by inspecting
 * the rules, which would be an expectation derived from its own subject. A rule set whose
 * honest outcomes were unreachable would fail here with the key it *did* return named in the
 * output, so the failure says which outcome shadowed which.
 *
 * ## Ceiling, stated because a green line will be read as more than it is
 *
 * These cases assert that the honest outcomes are **reachable and correctly shaped**. They do
 * not and cannot assert that the criteria are **right** — the rules are `[SEED]`, `Q-P13` is
 * how they stop being seed, and `PRE-DEPLOYMENT-CHECKLIST.md` carries the row. Same ceiling as
 * `check:legal:parity`, and it is a ceiling rather than a gap: asserting that a criterion is
 * the correct one is the owner's decision, not a check.
 */
const answers = (manuscript, purpose, budget, involvement, timeline) => ({
  manuscript,
  purpose,
  budget,
  involvement,
  timeline,
});

/** One complete answer set per outcome, and the key each must return. */
const REACHABILITY = [
  ['full-package', answers('finished', 'commercial', '10k-30k', 'full-service', '6-12-months')],
  ['ghostwriting', answers('needs-writing', 'business', '30k-plus', 'full-service', '6-12-months')],
  ['assessment-first', answers('partial', 'commercial', '500-3k', 'collaborate', '3-6-months')],
  ['content-programme', answers('idea', 'business', '3k-10k', 'collaborate', 'no-deadline')],
  ['self-service', answers('partial', 'commercial', 'under-500', 'collaborate', '3-months')],
  ['not-ready', answers('idea', 'legacy', 'under-500', 'full-service', 'no-deadline')],
];

for (const [key, given] of REACHABILITY) {
  CASES.push({
    name: `K-04 REACHABLE — a complete answer set returns "${key}"`,
    run: () => recommend(SEED_RULES, SEED_OUTCOMES, given),
    expect: (r) => r.outcome === key && r.tiedWith.length === 0 && r.unknownOutcome === false,
  });
}

CASES.push(
  {
    name: 'K-04 ETH-04 scenario 1 — both honest outcomes are reachable and audited as honest',
    run: () =>
      ['self-service', 'not-ready'].map((key) => {
        const given = REACHABILITY.find(([k]) => k === key)[1];
        return recommend(SEED_RULES, SEED_OUTCOMES, given).isGridsmithOutcome;
      }),
    // `false`, never `null`: `press_path_results.is_gridsmith_outcome` is NOT NULL and its
    // `press_path_honesty_agrees` constraint derives from the key, so a `null` here is a row
    // the database would reject and an honesty view that would read 0%.
    expect: ([a, b]) => a === false && b === false,
  },
  {
    name: 'K-04 ETH-04 scenario 2 — no honest outcome carries a CTA, and each carries guidance',
    run: () => {
      const honest = SEED_OUTCOMES.filter((o) => o.isGridsmithService === false);
      return [
        honest.length,
        honest.every((o) => o.showCta === false),
        honest.every((o) => typeof o.externalGuidance === 'string' && o.externalGuidance.length > 0),
        ethicsRule(SEED_OUTCOMES),
      ];
    },
    // The fourth element runs the schema's own exported rule over the shipped array, so the
    // seed cannot be in a shape the Studio would refuse to save.
    expect: ([n, noCta, guided, rule]) => n === 2 && noCta === true && guided === true && rule === true,
  },
  {
    name: 'K-04 ETH-04 scenario 3 — APP-FLOW §5: under £500 with a partial draft returns E or F',
    // The mandate is unconditional, so it is asserted across the whole cross-product of the
    // other three questions — 4 purposes x 3 involvements x 4 timelines = 48 answer sets — not
    // on one convenient set. A rule that satisfied it only for some of them would fire here.
    run: () => {
      const seen = new Set();
      let violations = 0;
      let n = 0;
      for (const purpose of ['business', 'legacy', 'commercial', 'academic']) {
        for (const involvement of ['full-service', 'collaborate', 'self-led']) {
          for (const timeline of ['3-months', '3-6-months', '6-12-months', 'no-deadline']) {
            n++;
            const r = recommend(
              SEED_RULES,
              SEED_OUTCOMES,
              answers('partial', purpose, 'under-500', involvement, timeline),
            );
            seen.add(r.outcome);
            if (r.outcome !== 'self-service' && r.outcome !== 'not-ready') violations++;
          }
        }
      }
      return [n, violations, [...seen].sort()];
    },
    expect: ([n, violations, seen]) => n === 48 && violations === 0 && seen.length >= 1,
  },
  {
    name: 'K-04 NO FALLBACK — a complete, plausible answer set still returns null',
    // Proven positively. The absence of a fallback cannot be established by failing to find
    // one; this is a full five-answer set that no rule covers, and the assertion is a value.
    run: () =>
      recommend(
        SEED_RULES,
        SEED_OUTCOMES,
        answers('needs-writing', 'academic', '500-3k', 'self-led', '3-months'),
      ),
    expect: (r) => r.outcome === null && r.isGridsmithOutcome === null && r.ruleIndex === null,
  },
  {
    name: 'K-04 NO TIES — every seed rule priority is distinct',
    // `K-01`: a tie is a content error and this is the run that finds it. Asserted on the
    // count so it cannot pass by reading an empty list.
    run: () => [SEED_RULES.length, new Set(SEED_RULES.map((r) => r.priority)).size],
    expect: ([n, distinct]) => n === 13 && distinct === 13,
  },
  {
    name: 'K-04 CLOSED KEYS — every seed rule names a defined outcome, and all six are used',
    run: () => {
      const defined = new Set(SEED_OUTCOMES.map((o) => o.key));
      const used = new Set(SEED_RULES.map((r) => r.outcome));
      return [
        SEED_RULES.every((r) => defined.has(r.outcome)),
        [...defined].every((k) => used.has(k)),
        defined.size,
      ];
    },
    expect: ([allDefined, allUsed, n]) => allDefined === true && allUsed === true && n === 6,
  },
  {
    name: 'K-05 CRITERIA — the static table describes every outcome, derived from the rules',
    // `PROJECT-RULES.md` §6 requires all six outcomes AND their criteria. An outcome with an
    // empty criteria list renders "No criteria are defined", which is honest and is also a
    // table that fails its own requirement — so it fails here instead.
    run: () => SEED_OUTCOMES.map((o) => criteriaFor(o.key).length),
    expect: (counts) => counts.length === 6 && counts.every((c) => c >= 1),
  },
  {
    name: 'K-05 CRITERIA ARE PROSE — option labels, not option keys',
    // The derivation must resolve `under-500` to "Under £500". A criteria column reading raw
    // keys is a table nobody can act on, and it is the failure mode a `?? optionKey` fallback
    // produces silently.
    run: () => criteriaFor('self-service').join(' | '),
    expect: (s) =>
      s.includes('Under £500') && s.includes('Partial draft') && !s.includes('under-500'),
  },
  {
    name: 'SEED IS MARKED — the config declares itself seed content',
    run: () => pathFinderSeedConfig.isSeed,
    expect: (v) => v === true,
  },
);

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
