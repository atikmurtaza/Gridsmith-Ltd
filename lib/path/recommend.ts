/**
 * `recommend` — the Path Finder's pure recommendation function. `K-03`, `press/TECH-SPEC.md`
 * §2, `press/SCHEMA.md` §3.
 *
 * It takes the `rules` and `outcomes` of a `pathFinderConfig` (`K-01`) plus a set of answers,
 * and returns the outcome key that wins. It reads nothing, writes nothing and knows nothing
 * about React, Sanity or the database: `K-06`'s island and `K-05`'s static table both call it,
 * `K-08` logs what it returns, and `K-04` runs the three ETH-04 scenarios against it.
 *
 * That purity is the point rather than a style preference. `CLAUDE.md`: a committed selftest
 * that asserts a rule function's **return value** cannot have the inert-probe defect, because
 * the reading is a value rather than an absence. `check-path-recommend.selftest.mjs` is that
 * selftest and it calls this function, not a copy of it.
 *
 * ## What this file decides, and what it must never decide
 *
 * It decides **which rule wins**. It does not decide **what the rules are** — those are content
 * and they do not exist yet; no Epic O row and no `Q-P` number owns them (see the `K-05` note
 * in `press/PROJECT-TRACKER.md`). Nothing here has a default outcome, a fallback outcome or a
 * preference between outcomes, and it must never acquire one: a fallback that quietly returned
 * a Gridsmith service whenever the rules did not match would defeat ETH-04 with every gate
 * green, which is the precise failure non-negotiable #9 exists to prevent. **No match returns
 * `null`.**
 *
 * ## Three semantics the schema forced and the specs do not state
 *
 * Each is a decision, recorded here because it is not derivable from `SCHEMA.md`:
 *
 * 1. **`in` takes a comma-separated `value`.** `pathCondition.value` is typed `string` while
 *    `in` needs a set, so the set has to be encoded in the string. Commas, trimmed, empties
 *    dropped. This is the only degree of freedom the schema leaves.
 * 2. **A condition over an unanswered question never matches — including `not`.** Left to plain
 *    inequality, `not` is *true* against `undefined`, so a five-question rule could fire on
 *    question one and the island would recommend before it had asked. An unanswered question is
 *    an absence of evidence, not evidence.
 * 3. **Every condition in a rule must hold.** `conditions` is an AND; `in` is the OR.
 *
 * ## Ties
 *
 * `pathRule.priority` is "lower wins", and `K-01` records that a tie is a content error which
 * `K-04` is the run that finds. So a tie is **reported, never broken silently**: the winner is
 * still deterministic (first in document order among the equals, so the same answers always
 * give the same result) and `tiedWith` names the others. A caller that ignores `tiedWith` gets
 * a stable answer; `K-04` reads it and fails.
 *
 * An outcome key that no `outcomes` entry defines is likewise reported rather than substituted
 * — `unknownOutcome`. Dangling is a content error, and inventing a replacement for it here is
 * exactly the "quietly deletes the honest outcomes" risk `SCHEMA.md` §3 describes.
 */

export type PathOperator = 'is' | 'in' | 'not';

export interface PathCondition {
  questionKey: string;
  operator: PathOperator;
  value: string;
}

export interface PathRule {
  conditions: PathCondition[];
  outcome: string;
  priority: number;
}

/** Only the fields the decision needs. The full shape is `sanity/schemas/pathFinderConfig.ts`. */
export interface PathOutcomeLike {
  key: string;
  isGridsmithService?: boolean;
  showCta?: boolean;
}

/** Answers so far, `questionKey` -> the chosen `pathOption.key`. Partial by design. */
export type PathAnswers = Record<string, string | undefined>;

export interface Recommendation {
  /** The winning outcome key, or `null` when no rule matched. Never a fallback. */
  outcome: string | null;
  /** Index into `rules` of the winning rule, or `null`. */
  ruleIndex: number | null;
  /** Outcome keys of equal-priority rules that also matched. Empty unless there is a tie. */
  tiedWith: string[];
  /** True when the winning rule names an outcome no `outcomes` entry defines. */
  unknownOutcome: boolean;
  /**
   * `false` when the winning outcome is one of the honest ones (`isGridsmithService: false`).
   * `null` when there is no outcome or the key is unknown — the distinction matters, because
   * `press_path_results.is_gridsmith_outcome` must never record an unknown as a Gridsmith one.
   */
  isGridsmithOutcome: boolean | null;
}

/** Split an `in` condition's `value`. Exported so the selftest reads the same parser. */
export function parseSet(value: string): string[] {
  return value
    .split(',')
    .map((v) => v.trim())
    .filter((v) => v.length > 0);
}

export function matchesCondition(condition: PathCondition, answers: PathAnswers): boolean {
  const answer = answers[condition.questionKey];
  if (answer === undefined || answer === '') return false; // decision 2, and it covers `not`.
  switch (condition.operator) {
    case 'is':
      return answer === condition.value;
    case 'in':
      return parseSet(condition.value).includes(answer);
    case 'not':
      return answer !== condition.value;
    default:
      return false; // An operator the schema does not allow matches nothing.
  }
}

export function matchesRule(rule: PathRule, answers: PathAnswers): boolean {
  if (!Array.isArray(rule.conditions) || rule.conditions.length === 0) return false;
  return rule.conditions.every((c) => matchesCondition(c, answers));
}

export function recommend(
  rules: PathRule[],
  outcomes: PathOutcomeLike[],
  answers: PathAnswers,
): Recommendation {
  const none: Recommendation = {
    outcome: null,
    ruleIndex: null,
    tiedWith: [],
    unknownOutcome: false,
    isGridsmithOutcome: null,
  };
  if (!Array.isArray(rules) || rules.length === 0) return none;

  const matched = rules
    .map((rule, index) => ({ rule, index }))
    .filter(({ rule }) => matchesRule(rule, answers));
  if (matched.length === 0) return none;

  const best = Math.min(...matched.map(({ rule }) => rule.priority));
  const equals = matched.filter(({ rule }) => rule.priority === best);
  const winner = equals[0]; // Document order, so the same answers always give the same result.

  const defined = (Array.isArray(outcomes) ? outcomes : []).find(
    (o) => o && o.key === winner.rule.outcome,
  );

  return {
    outcome: winner.rule.outcome,
    ruleIndex: winner.index,
    tiedWith: equals.slice(1).map(({ rule }) => rule.outcome),
    unknownOutcome: defined === undefined,
    isGridsmithOutcome: defined === undefined ? null : defined.isGridsmithService !== false,
  };
}
