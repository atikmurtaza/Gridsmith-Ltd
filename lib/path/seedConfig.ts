/**
 * `pathFinderSeedConfig` — the **[SEED]** Path Finder questions, outcomes and decision rules
 * that unblock `Q-P13`, and therefore `K-05` and `K-04`.
 *
 * ## Every rule in this file is [SEED] and is to be replaced before launch
 *
 * `docs/_shared/PRE-DEPLOYMENT-CHECKLIST.md` carries the row. `isSeed` is `true` here for the
 * same reason `check:launch` refuses a published seed on production: this is scaffolding that
 * lets the chain be built and proven, not a business decision about who Gridsmith turns away.
 *
 * ## What is [SEED] here and what is not — the distinction matters
 *
 * The `K-05` premise check (`press/PROJECT-TRACKER.md`) found that the **questions, their
 * options and the six outcome titles are specified** in `press/APP-FLOW.md` §5 and were never
 * the blocker. **Only the criteria — the answer-to-outcome mapping — were stated nowhere.**
 *
 * So this file invents as little as it can:
 *
 * | Part | Provenance |
 * |---|---|
 * | The five questions and their 21 option labels | **`APP-FLOW.md` §5, verbatim** — not invented |
 * | The six outcome keys | **`pathFinderConfig.PATH_OUTCOME_KEYS`** — closed at `K-01` |
 * | The six outcome titles | `APP-FLOW.md` §5's A–F box — not invented |
 * | `questionKey` / `pathOption.key` slugs | invented, because the spec gives labels and not keys |
 * | Outcome `explanation` and `externalGuidance` copy | **[SEED]** — placeholder |
 * | **`rules` — every one of them** | **[SEED]** — this is `Q-P13` |
 *
 * ## The one criterion that is NOT a placeholder
 *
 * `APP-FLOW.md` §5: *"Under £500 budget with a partial draft **must** return E or F."* That is
 * a functional requirement, not a preference, and rule `p10` implements it **unconditionally**
 * — two conditions, no third that could let it fall through to a Gridsmith outcome. It is the
 * one rule here whose replacement would be a spec change rather than a content edit.
 *
 * ## Why `self-service` and `not-ready` have real, reachable criteria
 *
 * The brief's hard constraint, and it is `ETH-04`'s whole point. `press_path_results`'
 * `press_path_honesty_agrees` constraint (`K-08`) derives `is_gridsmith_outcome` from the
 * outcome key at the **database**, so an honest outcome nobody can reach produces a table that
 * is *correct on every row* and an honesty view that reads 0%. **Every gate stays green and the
 * tool is broken** — `APP-FLOW.md` §5 says exactly this: *"If E and F never fire in production,
 * the tool is broken."*
 *
 * Six rules — `p10`, `p11`, `p12`, `p13`, `p20`, `p21` — return a non-Gridsmith outcome, and
 * they hold the **six lowest priority numbers**, so nothing can shadow them. Reachability is
 * not asserted by reading them: `check-path-recommend.selftest.mjs` drives a complete answer
 * set through `recommend()` for **each of the six outcomes** and reads the returned key, which
 * is a value rather than an absence.
 *
 * ## No fallback, and `null` is a real result
 *
 * `recommend()` returns `null` when nothing matches and it must never acquire a default
 * (`K-03`). This config does not close over the answer space and **is not meant to**: a rule
 * set engineered so that something always matches is a fallback wearing thirteen rules. The
 * selftest asserts a complete, plausible answer set that returns `null`, so the absence of a
 * fallback is proven positively rather than by not finding one.
 *
 * ## Priorities are unique by construction
 *
 * Lower wins. `K-01` records that a tie is a content error and `K-04` is the run that finds it,
 * so the selftest asserts the priority set is distinct rather than trusting that it is.
 */

import type { PathRule, PathOutcomeLike } from './recommend';

export interface SeedOption {
  key: string;
  label: string;
}

export interface SeedQuestion {
  key: string;
  question: string;
  helpText: string;
  options: SeedOption[];
}

export interface SeedOutcome extends PathOutcomeLike {
  key: string;
  title: string;
  explanation: string;
  isGridsmithService: boolean;
  showCta: boolean;
  externalGuidance?: string;
}

/**
 * The five questions, verbatim from `APP-FLOW.md` §5.
 *
 * `pathFinderConfig.questions` is `validation: (r) => r.length(5)` — **exactly five**, not a
 * minimum — so this list is the length the schema will accept and no other. The brief asked for
 * three to five; the schema settles it at five, and the five are already specified.
 *
 * Every option is answerable by someone who has never published a book: where the manuscript
 * is, what it is for, what they can spend, how involved they want to be, and when they need it.
 * None asks about trim size, imprint, distribution channel or rights territory.
 */
export const SEED_QUESTIONS: SeedQuestion[] = [
  {
    key: 'manuscript',
    question: 'Where is your manuscript?',
    helpText: 'Any of these is a reasonable place to start. There is no wrong answer here.',
    options: [
      { key: 'idea', label: 'Just an idea' },
      { key: 'partial', label: 'Partial draft' },
      { key: 'finished', label: 'Finished draft' },
      { key: 'needs-writing', label: 'I need it written for me' },
    ],
  },
  {
    key: 'purpose',
    question: 'What is the book for?',
    helpText: 'What you want the finished book to do for you.',
    options: [
      { key: 'business', label: 'Business credibility' },
      { key: 'legacy', label: 'Personal legacy' },
      { key: 'commercial', label: 'Commercial sales' },
      { key: 'academic', label: 'Academic/professional' },
    ],
  },
  {
    key: 'budget',
    question: 'Budget',
    helpText: 'A range, not a commitment. "Not sure yet" is a real answer.',
    options: [
      { key: 'under-500', label: 'Under £500' },
      { key: '500-3k', label: '£500–£3k' },
      { key: '3k-10k', label: '£3k–£10k' },
      { key: '10k-30k', label: '£10k–£30k' },
      { key: '30k-plus', label: '£30k+' },
      { key: 'unsure', label: 'Not sure yet' },
    ],
  },
  {
    key: 'involvement',
    question: 'How involved do you want to be?',
    helpText: 'How much of the work you want to keep in your own hands.',
    options: [
      { key: 'full-service', label: 'Do it all for me' },
      { key: 'collaborate', label: 'Collaborate closely' },
      { key: 'self-led', label: "I'll do most of it myself" },
    ],
  },
  {
    key: 'timeline',
    question: 'Timeline',
    helpText: 'When you need the finished book in your hands.',
    options: [
      { key: '3-months', label: 'Within 3 months' },
      { key: '3-6-months', label: '3–6 months' },
      { key: '6-12-months', label: '6–12 months' },
      { key: 'no-deadline', label: 'No deadline' },
    ],
  },
];

/**
 * The six outcomes. **Keys and titles are specified; explanations and guidance are [SEED].**
 *
 * `showCta` is `false` on both non-Gridsmith outcomes and `externalGuidance` is present on
 * both, which is what `ethicsRule` (`K-02`) enforces — this array is a valid input to it and
 * the selftest runs it through, so the seed cannot ship in a shape the Studio would refuse.
 *
 * **No price appears in any of this copy.** `check:content` rejects a money figure in
 * `components/**` and non-negotiable #2 forbids inventing one anywhere. The budget *bands* are
 * question options taken from `APP-FLOW.md`, not claims about what anything costs.
 *
 * Amazon KDP and IngramSpark are named because `APP-FLOW.md` §5 names them as the self-service
 * route; no claim is made about either beyond their existing.
 */
export const SEED_OUTCOMES: SeedOutcome[] = [
  {
    key: 'full-package',
    title: 'Full Publishing Package',
    explanation:
      '[SEED] Your draft is far enough along, and your budget and timeline leave room for the full production route — editing, cover, interior, and setting the book up for readers to buy.',
    isGridsmithService: true,
    showCta: true,
  },
  {
    key: 'ghostwriting',
    title: 'Ghostwriting',
    explanation:
      '[SEED] The book needs writing rather than finishing, and you want that done for you. This is the longest and most involved route we offer.',
    isGridsmithService: true,
    showCta: true,
  },
  {
    key: 'assessment-first',
    title: 'Manuscript Assessment first',
    explanation:
      '[SEED] Before anyone quotes you for a full production, the sensible next step is a read of what you have and an honest account of what it needs.',
    isGridsmithService: true,
    showCta: true,
  },
  {
    key: 'content-programme',
    title: 'Content Programme',
    explanation:
      '[SEED] What you have described is ongoing writing rather than a single book with a finish line. That is a different shape of engagement and it is priced differently.',
    isGridsmithService: true,
    showCta: true,
  },
  {
    key: 'self-service',
    title: 'Self-service — publish it yourself',
    explanation:
      '[SEED] You do not need us. What you have described can be done yourself, and paying someone to do it would not get you a better book.',
    isGridsmithService: false,
    showCta: false,
    externalGuidance:
      '[SEED] Amazon KDP and IngramSpark both let you publish a finished manuscript yourself at no upfront cost. You keep your copyright either way, and you can come back to us later if you decide you want help with the parts you did not enjoy.',
  },
  {
    key: 'not-ready',
    title: 'Not ready — finish the draft',
    explanation:
      '[SEED] The most useful thing we can tell you is that it is too early. Nothing we sell would improve the outcome from where the manuscript is today.',
    isGridsmithService: false,
    showCta: false,
    externalGuidance:
      '[SEED] Finish the draft first, however rough. Come back when there is a complete manuscript to read — the conversation is a much better one, and the quote is a much more honest one.',
  },
];

/**
 * **The rules. Every one is [SEED] and this is `Q-P13`.**
 *
 * Lower priority wins; all thirteen numbers are distinct. `conditions` is an AND and `in` takes
 * a comma-separated value (`K-03`, decisions 1 and 3).
 *
 * The band structure, top to bottom:
 *
 * | Priority | Band | Outcomes |
 * |---|---|---|
 * | 10–13 | the small-budget floor — nothing here sells anything | `self-service`, `not-ready` |
 * | 20–21 | self-led or finished on the smallest budget | `self-service` |
 * | 30–31 | the book has to be written | `ghostwriting` |
 * | 40–41 | there is a draft and it has not been read yet | `assessment-first` |
 * | 45 | ongoing writing, not one book | `content-programme` |
 * | 50–51 | a real draft and room to produce it properly | `full-package` |
 *
 * **The honest outcomes hold the lowest numbers deliberately.** A Gridsmith outcome can never
 * shadow one of them, which is the ordering `ETH-04` needs and the ordering a later content
 * edit is most likely to quietly reverse.
 */
export const SEED_RULES: PathRule[] = [
  // p10 — `APP-FLOW.md` §5's functional requirement, unconditional. NOT a placeholder.
  {
    conditions: [
      { questionKey: 'manuscript', operator: 'is', value: 'partial' },
      { questionKey: 'budget', operator: 'is', value: 'under-500' },
    ],
    outcome: 'self-service',
    priority: 10,
  },
  // p11 — an idea and no budget for it yet. There is nothing to sell and nothing to assess.
  {
    conditions: [
      { questionKey: 'manuscript', operator: 'is', value: 'idea' },
      { questionKey: 'budget', operator: 'in', value: 'under-500,unsure' },
    ],
    outcome: 'not-ready',
    priority: 11,
  },
  // p12 — an idea the author intends to write themselves. The draft is the next step, not us.
  {
    conditions: [
      { questionKey: 'manuscript', operator: 'is', value: 'idea' },
      { questionKey: 'involvement', operator: 'is', value: 'self-led' },
    ],
    outcome: 'not-ready',
    priority: 12,
  },
  // p13 — a book to be written from nothing, on the smallest budget. Ghostwriting cannot be it.
  {
    conditions: [
      { questionKey: 'manuscript', operator: 'is', value: 'needs-writing' },
      { questionKey: 'budget', operator: 'is', value: 'under-500' },
    ],
    outcome: 'not-ready',
    priority: 13,
  },
  // p20 — smallest budget and doing most of it themselves. Self-service is the honest answer.
  {
    conditions: [
      { questionKey: 'budget', operator: 'is', value: 'under-500' },
      { questionKey: 'involvement', operator: 'is', value: 'self-led' },
    ],
    outcome: 'self-service',
    priority: 20,
  },
  // p21 — a finished draft and the smallest budget. KDP and IngramSpark cost nothing upfront.
  {
    conditions: [
      { questionKey: 'manuscript', operator: 'is', value: 'finished' },
      { questionKey: 'budget', operator: 'is', value: 'under-500' },
    ],
    outcome: 'self-service',
    priority: 21,
  },
  // p30 — needs writing, and the budget is in the range where that is a real conversation.
  {
    conditions: [
      { questionKey: 'manuscript', operator: 'is', value: 'needs-writing' },
      { questionKey: 'budget', operator: 'in', value: '10k-30k,30k-plus' },
    ],
    outcome: 'ghostwriting',
    priority: 30,
  },
  // p31 — needs writing, wants it done for them, mid budget.
  {
    conditions: [
      { questionKey: 'manuscript', operator: 'is', value: 'needs-writing' },
      { questionKey: 'involvement', operator: 'is', value: 'full-service' },
      { questionKey: 'budget', operator: 'in', value: '3k-10k' },
    ],
    outcome: 'ghostwriting',
    priority: 31,
  },
  // p40 — a partial draft nobody has read. Assessment before anyone quotes a production.
  {
    conditions: [
      { questionKey: 'manuscript', operator: 'is', value: 'partial' },
      { questionKey: 'budget', operator: 'in', value: '500-3k,unsure' },
    ],
    outcome: 'assessment-first',
    priority: 40,
  },
  // p41 — a finished draft on a modest budget. Same reasoning.
  {
    conditions: [
      { questionKey: 'manuscript', operator: 'is', value: 'finished' },
      { questionKey: 'budget', operator: 'in', value: '500-3k,unsure' },
    ],
    outcome: 'assessment-first',
    priority: 41,
  },
  // p45 — business writing with no finish line. That is a programme, not a book.
  {
    conditions: [
      { questionKey: 'purpose', operator: 'is', value: 'business' },
      { questionKey: 'involvement', operator: 'is', value: 'collaborate' },
      { questionKey: 'timeline', operator: 'is', value: 'no-deadline' },
    ],
    outcome: 'content-programme',
    priority: 45,
  },
  // p50 — a finished draft and room to produce it properly.
  {
    conditions: [
      { questionKey: 'manuscript', operator: 'is', value: 'finished' },
      { questionKey: 'budget', operator: 'in', value: '3k-10k,10k-30k,30k-plus' },
    ],
    outcome: 'full-package',
    priority: 50,
  },
  // p51 — a partial draft and the budget to finish and produce it.
  {
    conditions: [
      { questionKey: 'manuscript', operator: 'is', value: 'partial' },
      { questionKey: 'budget', operator: 'in', value: '3k-10k,10k-30k,30k-plus' },
    ],
    outcome: 'full-package',
    priority: 51,
  },
];

/** The whole seed, in the shape `pathFinderConfig` holds it. `isSeed` is the point. */
export const pathFinderSeedConfig = {
  _type: 'pathFinderConfig' as const,
  version: 1,
  isSeed: true,
  questions: SEED_QUESTIONS,
  outcomes: SEED_OUTCOMES,
  rules: SEED_RULES,
};

/**
 * The criteria as prose, for `K-05`'s static table. **Derived from `SEED_RULES` rather than
 * written beside them** — deliberately, and the direction is the one `CLAUDE.md` prescribes.
 *
 * `PROJECT-RULES.md` §6 requires the no-JS table to render *"all six outcomes and their
 * criteria"*. A hand-written criteria column would be a second document that must agree with
 * the rules with no assertion between them — `01-VALIDATION-REPORT.md` §21's shape, at the
 * exact spot where a divergence would tell a visitor they qualify for an honest outcome the
 * evaluator would never give them.
 *
 * The expectation question here is *"does the table describe the rules that are running?"*, so
 * the answer must come **from the rules**. That is the same division `check-axe`'s route probe
 * sits on, and the opposite side from `check:tokens`.
 */
export function criteriaFor(outcomeKey: string): string[] {
  const labelFor = (questionKey: string, optionKey: string): string => {
    const q = SEED_QUESTIONS.find((x) => x.key === questionKey);
    const o = q?.options.find((x) => x.key === optionKey);
    return o?.label ?? optionKey;
  };
  return SEED_RULES.filter((r) => r.outcome === outcomeKey).map((rule) =>
    rule.conditions
      .map((c) => {
        const q = SEED_QUESTIONS.find((x) => x.key === c.questionKey);
        const name = q?.question ?? c.questionKey;
        const values = c.value
          .split(',')
          .map((v) => labelFor(c.questionKey, v.trim()))
          .join(' or ');
        return c.operator === 'not' ? `${name} is not ${values}` : `${name} is ${values}`;
      })
      .join(', and '),
  );
}
