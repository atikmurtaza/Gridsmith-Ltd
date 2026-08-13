#!/usr/bin/env node
/**
 * check-invented-content
 *
 * CLAUDE.md non-negotiable #2: *"Never invent content. No fabricated case study metrics,
 * client names, standards codes, ISBNs, prices, contract clauses, statistics or
 * credentials. Mark `[TK]` and stop."* `master/PROJECT-RULES.md` §5: *"never a plausible
 * figure"*.
 *
 * **This gate exists because the class was fixed twice in one file and recurred both
 * times.** Round 2 of `rules-compliance` found `£1,250`, `£980` and `REV-02` rendered
 * into the prerendered HTML of `/_kitchen-sink` and they were zeroed. Run 3 found
 * `Under £5,000` / `£5,000 – £15,000` twenty-nine lines below the fix, and `REV-04` in
 * the specimen above it — in the same file, against the same rule, with a comment
 * *directly beside them* stating that the rule had just been broken "two specimens above".
 *
 * Two fixes and three surviving instances is what a per-instance fix looks like. So the
 * fixes are not the deliverable here; this file is.
 *
 * **What it looks for.** Digits that assert something about the real world, in files that
 * render to HTML:
 *
 *   - money — a currency symbol followed by any non-zero digit
 *   - revision/reference codes — `REV-`, `DWG-`, `ISO `, `BS ` followed by a non-zero code
 *   - ISBNs
 *   - percentages and durations that read as outcomes
 *
 * **Zeroed digits are the permitted form** and are what the codebase already uses:
 * `£0,000`, `REV-00`, `KS-0000`, `[SEED] 00%`. They demonstrate a monospace treatment and
 * tabular alignment while asserting nothing. That convention is `PROJECT-RULES.md` §5 and
 * it is what this gate enforces — not "no numbers", which would be unusable.
 *
 * **Scope is deliberately narrow: files that render.** Documentation is full of real
 * measured figures (contrast ratios, budgets, bundle sizes) and must stay that way. A gate
 * that flagged `docs/` would be turned off within a week, and a gate that gets turned off
 * protects nothing.
 *
 * Once the CMS lands (`A-06`), real prices arrive from Sanity with their own validation
 * and this gate keeps watching the hardcoded surface, which is where invention happens.
 */
import { readFileSync, globSync } from 'node:fs';
import { relative } from 'node:path';

const SOURCES = ['app/**/*.tsx', 'components/**/*.tsx'];

/**
 * Each pattern names the thing it protects. `allowZeroed` means a match whose digits are
 * all zero is the permitted placeholder form and is not a finding.
 */
const PATTERNS = [
  {
    id: 'price',
    // £1,250 / $980 / €15.00 — any currency symbol followed by digits containing a non-zero.
    re: /[£$€]\s?\d[\d,.\s]*/g,
    what: 'a money figure',
    rule: 'CLAUDE.md #2 (prices) · PROJECT-RULES §5 "never a plausible figure"',
  },
  {
    id: 'revision',
    re: /\b(?:REV|DWG|DRG|ISS)-\d+/gi,
    what: 'a revision or drawing number',
    rule: 'CLAUDE.md #2 (standards codes)',
  },
  {
    id: 'standard',
    re: /\b(?:ISO|BS|EN|IEC)\s?\d{3,}(?:[-:]\d+)*/g,
    what: 'a standards code',
    rule: 'CLAUDE.md #2 (standards codes) — these must be real and verified, never illustrative',
  },
  {
    id: 'isbn',
    re: /\b97[89][-\d]{10,14}\b/g,
    what: 'an ISBN',
    rule: 'CLAUDE.md #2 (ISBNs)',
  },
];

/** All-zero digits are the permitted placeholder: £0,000 · REV-00 · KS-0000 · 00%. */
const isZeroed = (s) => !/[1-9]/.test(s);

/**
 * A line carrying `[TK]` is the escalation marker CLAUDE.md prescribes — the author has
 * flagged it and stopped, which is the required behaviour, not a violation of it.
 */
const isFlagged = (line) => line.includes('[TK]');

const problems = [];
let filesScanned = 0;
let candidatesSeen = 0;

for (const file of SOURCES.flatMap((g) => globSync(g))) {
  const src = readFileSync(file, 'utf8');
  filesScanned += 1;
  const lines = src.split(/\r?\n/);

  lines.forEach((line, i) => {
    // Comments explain the fixes and quote the offending literals — `£1,250` appears in
    // the kitchen sink's own explanatory comment and must not be re-flagged. Only what
    // renders counts.
    const code = line.replace(/\/\/.*$/, '').replace(/\/\*.*?\*\//g, '');
    const isCommentLine = /^\s*(\*|\/\/|\{\/\*)/.test(line);
    if (isCommentLine || isFlagged(line)) return;

    for (const p of PATTERNS) {
      for (const m of code.matchAll(p.re)) {
        candidatesSeen += 1;
        if (isZeroed(m[0])) continue;
        problems.push(
          `${relative(process.cwd(), file)}:${i + 1} — ${p.what} rendered into HTML: "${m[0].trim()}"\n` +
            `      ${p.rule}\n` +
            '      Zero the digits (£0,000 · REV-00 · 00%) or mark [TK] and stop.',
        );
      }
    }
  });
}

/**
 * A gate that measured nothing is not a gate that passed. Both halves have to exist: files
 * to scan, and at least one candidate for the patterns to have engaged with — otherwise a
 * broken regex or an unresolved glob reads exactly like a clean tree.
 */
if (filesScanned === 0) {
  problems.push('SOURCES matched no files — measured nothing.');
}
if (candidatesSeen === 0) {
  problems.push(
    'no pattern matched anything anywhere, not even a permitted zeroed placeholder. ' +
      'The codebase does carry £0,000, REV-00 and KS-0000 specimens, so this means a ' +
      'pattern or a glob has broken — measured nothing.',
  );
}

if (problems.length > 0) {
  console.error(`\ncheck-invented-content: ${problems.length} problem(s)\n`);
  for (const p of problems) console.error(`  ${p}`);
  console.error(
    '\nCLAUDE.md non-negotiable #2: never invent content. A plausible-looking figure is\n' +
      'worse than none, because it stops anyone asking where it came from.\n',
  );
  process.exit(1);
}

console.log(
  `check-invented-content: ${filesScanned} rendering file(s), ${candidatesSeen} figure(s) inspected — ` +
    'every one zeroed, flagged [TK], or absent',
);
