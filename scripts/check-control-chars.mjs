#!/usr/bin/env node
/**
 * check-control-chars
 *
 * Rejects C0 control characters — U+0000-U+0008, U+000B, U+000C, U+000E-U+001F — in
 * source. Tab, newline and carriage return are the exceptions.
 *
 * **Why this is a gate and not a rule.** A literal U+0008 was written into `check-rls`
 * where `\b` was intended, producing the lookahead `(?:using|with)\x08`, which can never
 * match. It was fixed, the class was written down, and then it happened a second time
 * hours later. Awareness does not prevent it, because the character is invisible in
 * every rendering anyone actually looks at: `sed`, the terminal, the editor and the diff
 * all draw U+0008 exactly as they draw the two-character sequence `\b`. A regex that can
 * never match therefore reads as correct in every review. Both instances were caught by
 * a discrepancy in *output* — a branch that never fired — never by reading the line.
 * `od -c` is the only thing that shows it, and nobody runs `od -c` on a file they are
 * not already suspicious of.
 *
 * So the gate is not "be careful". The gate is: the byte cannot enter the tree.
 *
 * The output is a count, and CLAUDE.md requires a count be provable to report zero.
 * Zero here is `sourceFiles` refusing to return an empty list — a scan that matched no
 * files exits non-zero rather than printing "0 hits, clean", because those two states
 * are indistinguishable in a summary line and only one of them is good news.
 */
import { readFileSync } from 'node:fs';
import { sourceFiles } from './source-files.mjs';

const GATE = 'check-control-chars';
const SOURCE = /\.(mjs|cjs|js|jsx|ts|tsx|css|json|sql|ya?ml|md|html)$/;
const CONTROL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g;

// **Every hand-edited tree, not the two that `NOT_SOURCE` was written for.** That list
// excludes `.github` as "no colours, no keys" and `docs` as "prose" — both true of
// `check-no-hardcoded-colors` and `check-service-role-key`, and neither an answer to the
// question this gate asks, which is about bytes and applies to anything a person types.
//
// The exclusions cost two instances. The fifth U+0008 sat in `.github/workflows/ci.yml`
// and took CI offline for eight days (`M-P1-5`). The sixth was found by the sweep those
// eight days prompted: a literal backspace inside the PROJECT-TRACKER row *describing the
// class*, quoted verbatim from the defect it documents, in `docs/` — excluded, so nothing
// had ever looked. `01-VALIDATION-REPORT.md` §15.
//
// What stays excluded is what nobody types: `.git`, `node_modules`, `.next`,
// `.lighthouseci`, `.sanity`, `.vercel` — generated or vendored, and large.
const files = sourceFiles(GATE, SOURCE, ['.claude', '.github', 'docs', 'public', 'redirects', 'supabase']);
const hits = [];

for (const file of files) {
  const lines = readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, i) => {
    for (const m of line.matchAll(CONTROL)) {
      hits.push({ file, line: i + 1, col: m.index + 1, cp: m[0].codePointAt(0) });
    }
  });
}

const cp = (n) => `U+${n.toString(16).toUpperCase().padStart(4, '0')}`;

if (hits.length > 0) {
  console.error(`\n${GATE}: ${hits.length} control character(s) in ${files.length} source file(s):\n`);
  for (const h of hits) console.error(`  ${h.file}:${h.line}:${h.col}  ${cp(h.cp)}`);
  console.error(
    '\nIf you meant an escape sequence, write the two characters "\\" and the letter.' +
      '\nA literal control byte renders identically to its escape and can never match one.\n',
  );
  process.exit(1);
}

console.log(`${GATE}: 0 control characters in ${files.length} source files.`);
