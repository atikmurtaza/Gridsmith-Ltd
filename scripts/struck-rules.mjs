/**
 * **The struck-rule registry and its predicate — a rule deleted in one document and left
 * standing in others.**
 *
 * Five registered so far, and only the first two were found by a person reading two documents
 * side by side. The other three came from a sweep of the audit trail for decisions recorded as
 * *removed* — and all three were still standing somewhere when they were registered, which is
 * the argument for the sweep rather than for the registry alone.
 *
 * Twice now. `P-01`'s `--ink-subtle` 17px floor was deleted at the run-3 fixes and survived in
 * four documents until 4 September 2026. `01-VALIDATION-REPORT.md` §21 is the same shape at a
 * larger scale: round 9 removed an unconditional 14-day refund promise from `CONSUMER-TERMS.md`
 * and `scripts/seed-legal.mjs` — the artefact the site actually published — kept it.
 *
 * Neither was found by a check, because there was nowhere to ask the question. Both were found
 * by a human reading two documents side by side, which does not scale and does not recur.
 *
 * ## Scope — narrow, and stated because the honest scope is narrower than the class
 *
 * **This check covers explicitly registered rule-statements only. It cannot see a rule struck
 * in prose it was never told about.** There is no general way to recognise "a normative
 * statement" in Markdown, and a check that claimed to would be the worst kind: a summary line
 * over an empty search. So the registry below is hand-maintained, every entry names the
 * decision that struck the rule, and adding an entry is part of striking a rule.
 *
 * What that buys is regression coverage, not discovery: once a rule is struck and registered,
 * it can never quietly come back, and the four documents that carried the 17px floor can never
 * drift apart again. What it does not buy is the *next* silent divergence, which will be in a
 * rule nobody registered. Nothing here mitigates that; the only thing that finds it is the
 * transcription pass that found §21, and that is a process rather than a gate.
 *
 * ## The corpus, and what is deliberately excluded
 *
 * Included: the standing specification documents an implementer follows — the eight per-
 * workstream files under `docs/{master,design,digital,press}/` and the shared foundation.
 *
 * Excluded, each for a reason rather than for convenience:
 *
 * - `docs/_legal/` — the reviewed instruments. `check:legal:parity` owns those, and a struck-
 *   rule check has no business asserting anything about a clause (`CLAUDE.md`: do not draft or
 *   amend clauses). It would also be wrong on its face: `_legal/` **must** state the superseded
 *   wording, because the revision log's job is to record what changed.
 * - the dated audit reports (`docs/_shared/06-` … `12-`) and `FIX-LEDGER.md` — records of a run
 *   at a point in time. A record is *supposed* to preserve struck wording verbatim; failing it
 *   would be demanding that history be rewritten.
 *
 * ## The predicate
 *
 * A line is a **violation** when it matches every regex in `patterns` and no regex in
 * `EXONERATIONS` within `WINDOW` lines either side. Matching is tight (one line, an AND of
 * patterns) and exoneration is loose (a small window), because a struck rule is struck on the
 * line it appears on and the annotation saying so is usually the line after it.
 *
 * Nothing here touches the filesystem, the network or the clock — `evaluate` decides only on
 * its arguments. That is what makes the self-test specimens honest: they exercise this
 * function, not a copy of it, and they read a **return value** rather than an absence, which is
 * the structural immunity `CLAUDE.md` asks for.
 */

/** Lines either side of a match that may carry its annotation. */
export const WINDOW = 3;

/**
 * A line inside the window carrying any of these is an annotated strike, not a live rule.
 *
 * Word-bounded on purpose. An unbounded `/cancel/` would exonerate every line of the
 * cancellation-notice panel, which is the exact subject of `STRUCK_RULES[1]`.
 */
export const EXONERATIONS = [
  /~~/,
  /\b(deleted|struck|removed|superseded|stale|rescinded)\b/i,
  /\bno longer\b/i,
  /\b(is|are|was|were) gone\b/i,
  /\bwent with\b/i,
  /\bdo not build\b/i,
];

/**
 * Every entry is a rule that a recorded decision struck. `why` is the decision; `where` is the
 * statement that survives and is not this one, so the two are never conflated again.
 */
export const STRUCK_RULES = [
  {
    id: 'PRESS-INK-SUBTLE-17PX',
    /** Both must match the same line. `--ink-subtle` alone would hit every token table. */
    patterns: [/--ink-subtle/, /\b17\s*px\b/i],
    why:
      'The `--ink-subtle` 17px size floor was deleted at the run-3 fixes, together with the ' +
      'token value that made it necessary. At its current value the token measures ' +
      '5.44 / 5.73 / 4.98:1 across the three press surfaces and needs no size rule at all. ' +
      '`styles/themes/press.css:8-16` is the record; `press/PROJECT-TRACKER.md` P-01.',
    where:
      'The 17px *body* rule survives on its own terms — typographic, not contrast ' +
      'compensation. `press/DESIGN.md` §2 line 76, gated by `check:press-type` (P-02).',
  },
  {
    id: 'CONSUMER-14-DAY-UNCONDITIONAL',
    /**
     * One phrase, and it is the whole of the struck promise: unconditional, every consumer,
     * every case. The surviving right is conditional on reg. 27(1) scope, so a document
     * stating it correctly does not contain this phrase.
     */
    patterns: [/cancel(?:\s+\w+)?\s+within\s+14\s+days\s+for\s+any\s+reason/i],
    why:
      'Round 9 removed the flat 14-day right. `CONSUMER-TERMS.md` §6 gives it only *where* ' +
      'the contract is distance or off-premises and the CCR 2013 confer it, with §6.1/§6.2 ' +
      'governing the refund. Under `L-CRA-50` the UI statement becomes a term, so the flat ' +
      'wording offers more than the reviewed contract gives — non-negotiable #6, ' +
      '`01-VALIDATION-REPORT.md` §21, `press/PROJECT-TRACKER.md` K-17.',
    where:
      '`docs/_legal/CONSUMER-TERMS.md` §6, and nowhere else. The replacement UI copy is ' +
      'K-17 and is blocked on the owner — this check asserts only that the struck wording ' +
      'does not stand, never what should stand in its place.',
  },
  {
    id: 'INP-ENFORCED-BY-LIGHTHOUSE-CI',
    /**
     * Both, on the same line. `INP` alone hits every budget table and every corrected
     * paragraph; `Lighthouse CI` alone hits the LCP and CLS rows, which are correct — the
     * mobile axis really does assert those.
     */
    patterns: [/\bINP\b/, /\b(Lighthouse\s*CI|LHCI)\b/i],
    why:
      'INP is a field metric and a Lighthouse navigation run does not produce one, so naming ' +
      'LHCI as its enforcement was never possible. Struck at the A-10b two-axis split; TBT at ' +
      'the same ceiling is the lab proxy and real INP has to come from field data. ' +
      '`CLAUDE.md` performance budgets, `master/PROJECT-TRACKER.md` line 534.',
    where:
      'The INP *target* survives — `{master,design,digital,press}/PROJECT-RULES.md` state it ' +
      'as **not assertable in CI** with TBT as the proxy, and `00-FOUNDATION.md` §8 is the ' +
      'two-axis record. This check asserts only that no document re-names LHCI as the gate.',
  },
  {
    id: 'DIGITAL-90KB-TOTAL-BUDGET',
    /** `budget` matches `budgeted` in the annotated Q-M12 line, which is the committed subject. */
    patterns: [/\b90\s*KB\b/i, /budget/i],
    why:
      'Q-M12 changed the metric, not the numbers: JS is budgeted on the delta above the ' +
      '100.2KB framework floor, not on the total, because budgeting on the total lets a ' +
      'framework upgrade silently eat the allowance features were supposed to have. Digital ' +
      "carries a 15KB delta. The 90KB total was a badly-set proxy for Digital's 100/100/100 " +
      'gate. `master/PROJECT-TRACKER.md` Q-M12; `CLAUDE.md` performance budgets.',
    where:
      "Digital's **100/100/100 Lighthouse gate** survives unchanged and is the real claim — " +
      '`digital/PROJECT-RULES.md`. The delta budgets are `CLAUDE.md` and are gated by ' +
      '`scripts/check-bundle-size.mjs`, which reports the floor as its own number.',
  },
  {
    id: 'PRESS-IMPRINT-CREDENTIAL',
    /**
     * Both, on the same line — this is the credentials-strip specification and nothing else.
     * `imprint` alone would hit every correct *no imprint* statement, of which the corpus has
     * several and all of them are the surviving rule.
     */
    patterns: [/\bimprint\b/i, /\bISBN prefix\b/i],
    why:
      'Q-P8 resolved as the author\u2019s own ISBN, the author as publisher of record, and no ' +
      'Gridsmith imprint. Gridsmith therefore has neither an imprint name nor an ISBN prefix, ' +
      'so a credentials strip carrying them would state two credentials that do not exist — ' +
      'non-negotiable #2, and the structural claim in `press/PRD.md` \u00a7Positioning is that a ' +
      'vanity press holds exactly these. `press/PROJECT-TRACKER.md` Q-P8.',
    where:
      '`press/PRD.md` FR-P19 is the surviving rule and states it directly: *"No imprint is ' +
      'claimed, because none is operated."* FR-P04a and R-18 are the module that says so to ' +
      'the reader. The credentials strip keeps company number, years trading, titles ' +
      'published and platforms published to — all verifiable.',
  },
];

/** The standing-spec corpus. Globbed by the runner; listed here so the scope is reviewable. */
export const CORPUS_GLOBS = [
  'docs/master/*.md',
  'docs/design/*.md',
  'docs/digital/*.md',
  'docs/press/*.md',
  'docs/_shared/00-FOUNDATION.md',
  'docs/_shared/00-PROCESS.md',
];

/** A floor on the corpus, so an empty or mis-rooted glob cannot report a clean run. */
export const MIN_FILES = 30;

/**
 * @param {{file: string, text: string}[]} files
 * @param {typeof STRUCK_RULES} [rules]
 * @returns {{ok: boolean, problems: string[], counts: Record<string, {matched: number, exonerated: number}>}}
 */
export function evaluate(files, rules = STRUCK_RULES) {
  const problems = [];
  const counts = {};

  if (files.length < MIN_FILES) {
    problems.push(
      `ZERO-SUBJECT: ${files.length} document(s) read, expected at least ${MIN_FILES}. ` +
        `The corpus is empty or mis-rooted; nothing was measured.`,
    );
  }

  for (const rule of rules) {
    counts[rule.id] = { matched: 0, exonerated: 0 };

    for (const { file, text } of files) {
      const lines = text.split('\n');
      for (let i = 0; i < lines.length; i++) {
        if (!rule.patterns.every((p) => p.test(lines[i]))) continue;
        counts[rule.id].matched++;

        const window = lines.slice(Math.max(0, i - WINDOW), i + WINDOW + 1).join('\n');
        if (EXONERATIONS.some((e) => e.test(window))) {
          counts[rule.id].exonerated++;
          continue;
        }
        problems.push(
          `${rule.id} STANDS at ${file}:${i + 1}\n` +
            `    ${lines[i].trim()}\n` +
            `    struck because: ${rule.why}\n` +
            `    what survives:  ${rule.where}`,
        );
      }
    }

    // The hollow-subject guard. A rule whose patterns have rotted matches nothing, reports no
    // violation, and is indistinguishable from a rule that is being honoured. `CLAUDE.md`: a
    // gate with no subject is not green and not red — it is silent.
    if (counts[rule.id].matched === 0) {
      problems.push(
        `HOLLOW SUBJECT: ${rule.id} matched no line in the corpus. Either the struck wording ` +
          `was deleted outright rather than annotated — which removes the gate's only ` +
          `subject — or its patterns have rotted. Restore the annotated line or retire the rule.`,
      );
    }
  }

  return { ok: problems.length === 0, problems, counts };
}
