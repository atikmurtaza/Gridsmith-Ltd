#!/usr/bin/env node
/**
 * **`check:struck` — a rule struck in one document may not stand in another.**
 *
 * Read `scripts/struck-rules.mjs` first: the registry, the corpus, the exclusions and the
 * predicate all live there, with the reasoning and the honest limits of the scope.
 *
 * This file is the runner. It reads the corpus off disk and hands it to the pure `evaluate`.
 * `--selftest` runs the committed specimens instead, which is the permanent subject: the real
 * corpus is expected to be clean, so a clean run over it is evidence of nothing on its own.
 *
 * ## What this gate does NOT assert
 *
 * That the surviving statement is correct. `PRESS-INK-SUBTLE-17PX` being honoured everywhere
 * says the 17px contrast floor is gone from the specs; it says nothing about whether deleting
 * it was right — `check:contrast` answers that. `CONSUMER-14-DAY-UNCONDITIONAL` says the flat
 * refund promise does not stand in the specs; it says nothing about what the panel should say,
 * which is K-17 and belongs to the owner and the solicitor. **A green line here means the
 * documents agree, not that they are right.** Same ceiling as `check:legal:parity`, stated for
 * the same reason: a green line is otherwise read as "the copy is fine".
 */
import { readFileSync } from 'node:fs';
import { globSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { evaluate, CORPUS_GLOBS, STRUCK_RULES, MIN_FILES } from './struck-rules.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

function readCorpus() {
  const paths = CORPUS_GLOBS.flatMap((g) => globSync(g, { cwd: ROOT })).sort();
  const unique = [...new Set(paths)];
  return unique.map((p) => ({
    file: relative('.', p).replaceAll('\\', '/'),
    text: readFileSync(join(ROOT, p), 'utf8'),
  }));
}

function report({ ok, problems, counts }, label) {
  for (const [id, c] of Object.entries(counts)) {
    console.log(`  ${id}: ${c.matched} line(s) matched, ${c.exonerated} annotated as struck`);
  }
  if (ok) {
    console.log(`✓ ${label}: every struck rule is annotated wherever it appears.`);
    return true;
  }
  console.error(`\n✗ ${label}: ${problems.length} problem(s)\n`);
  for (const p of problems) console.error(`  ${p}\n`);
  return false;
}

// ── selftest ──────────────────────────────────────────────────────────────────────────────
//
// Every specimen asserts a RETURN VALUE, not the absence of output. `CLAUDE.md`: "a committed
// selftest that asserts a rule function's return value cannot have this defect, because the
// reading is a value rather than an absence".
//
// One specimen per branch of the predicate, and the two count specimens exist because a gate
// whose output is a count must be provable to report a different number.

const PAD = 'filler line, not a subject\n'.repeat(MIN_FILES);
const bulk = (n) => Array.from({ length: n }, (_, i) => ({ file: `pad-${i}.md`, text: PAD }));
/** A corpus that clears MIN_FILES and honours both rules, so only the injection under test can fire. */
const base = () => [
  ...bulk(MIN_FILES),
  { file: 'rule-1-subject.md', text: '~~`--ink-subtle` may never be used below 17px~~ deleted\n' },
  { file: 'rule-2-subject.md', text: 'STRUCK: "cancel within 14 days for any reason" — removed at round 9\n' },
];

const SPECIMENS = [
  {
    name: 'CLEAN — both rules present and annotated',
    files: base(),
    expect: (r) => r.ok && r.counts['PRESS-INK-SUBTLE-17PX'].exonerated === 1,
  },
  {
    name: 'BRANCH 1 — `--ink-subtle` 17px floor restated, unannotated',
    files: [...base(), { file: 'press/PROJECT-RULES.md', text: 'x\n`--ink-subtle` may never be used below 17px.\ny\n' }],
    expect: (r) => !r.ok && r.problems.some((p) => p.includes('PRESS-INK-SUBTLE-17PX STANDS at press/PROJECT-RULES.md:2')),
  },
  {
    name: 'BRANCH 2 — flat 14-day refund promise restated, unannotated',
    files: [...base(), { file: 'press/APP-FLOW.md', text: 'You can cancel within 14 days for any reason and get a full refund.\n' }],
    expect: (r) => !r.ok && r.problems.some((p) => p.includes('CONSUMER-14-DAY-UNCONDITIONAL STANDS at press/APP-FLOW.md:1')),
  },
  {
    name: 'BRANCH 3 — hollow subject: rule 1 annotated out of existence',
    files: base().filter((f) => f.file !== 'rule-1-subject.md'),
    expect: (r) => !r.ok && r.problems.some((p) => p.includes('HOLLOW SUBJECT: PRESS-INK-SUBTLE-17PX')),
  },
  {
    name: 'BRANCH 4 — zero subject: corpus below the floor',
    files: base().slice(MIN_FILES),
    expect: (r) => !r.ok && r.problems.some((p) => p.startsWith('ZERO-SUBJECT: 2 document(s)')),
  },
  {
    name: 'EXONERATION — annotation on a neighbouring line, inside the window',
    files: [...base(), { file: 'press/TECH-SPEC.md', text: '`--ink-subtle` may not be used below 17px\n— that floor is gone.\n' }],
    expect: (r) => r.ok,
  },
  {
    name: 'EXONERATION IS BOUNDED — annotation beyond the window does not reach',
    files: [...base(), { file: 'press/TECH-SPEC.md', text: '`--ink-subtle` may not be used below 17px\na\nb\nc\nthat floor is gone.\n' }],
    expect: (r) => !r.ok && r.problems.some((p) => p.includes('PRESS-INK-SUBTLE-17PX STANDS')),
  },
  {
    name: 'NOT A SUBJECT — the surviving 17px body rule, no `--ink-subtle` on the line',
    files: [...base(), { file: 'press/DESIGN.md', text: 'Body copy minimum 17px, leading 1.7, measure 52ch.\n' }],
    expect: (r) => r.ok,
  },
  {
    name: 'NOT A SUBJECT — the conditional cancellation right',
    files: [...base(), { file: 'x.md', text: 'Where the CCR 2013 give you a cancellation right, you will normally have 14 days.\n' }],
    expect: (r) => r.ok,
  },
  {
    // COUNT MOVES. Same shape as the CLEAN specimen with three more matching lines; if the
    // loop were not running, both would report the same number.
    name: 'COUNT MOVES — three further annotated occurrences',
    files: [
      ...base(),
      { file: 'a.md', text: '~~`--ink-subtle` below 17px~~\n' },
      { file: 'b.md', text: '~~`--ink-subtle` below 17px~~\n' },
      { file: 'c.md', text: '~~`--ink-subtle` below 17px~~\n' },
    ],
    expect: (r) => r.ok && r.counts['PRESS-INK-SUBTLE-17PX'].matched === 4,
  },
];

function selftest() {
  let failed = 0;
  for (const s of SPECIMENS) {
    const result = evaluate(s.files);
    const pass = s.expect(result);
    console.log(`  ${pass ? '✓' : '✗'} ${s.name}`);
    if (!pass) {
      failed++;
      console.error(`      got ok=${result.ok}, problems=${JSON.stringify(result.problems, null, 2)}`);
    }
  }
  if (failed) {
    console.error(`\n✗ check:struck selftest — ${failed} of ${SPECIMENS.length} specimen(s) failed.`);
    process.exit(1);
  }
  console.log(`✓ check:struck selftest — ${SPECIMENS.length} specimens, ${STRUCK_RULES.length} registered rules.`);
}

// ── main ──────────────────────────────────────────────────────────────────────────────────
if (process.argv.includes('--selftest')) {
  selftest();
} else {
  const files = readCorpus();
  console.log(`check:struck — ${files.length} standing-spec document(s), ${STRUCK_RULES.length} registered rule(s)`);
  if (!report(evaluate(files), 'check:struck')) process.exit(1);
}
