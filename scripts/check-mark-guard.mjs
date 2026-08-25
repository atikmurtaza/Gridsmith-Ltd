#!/usr/bin/env node
/**
 * check-mark-guard — every `animation-timeline` in the built CSS is inside its `@supports`.
 *
 * The subject is `HeroMark`'s assembly animation in `components/master/master.module.css`, and
 * it is a live gate with a live subject. It was written alongside the travelling mark (variant
 * B, rejected and deleted — `01-VALIDATION-REPORT.md` §18); the guard it checks predates that
 * work and outlives it.
 *
 * ## Why this is a gate and not a comment
 *
 * An `animation-timeline` declaration a browser does not understand is *dropped*, and what
 * remains is a named animation with a duration on the **document** timeline: it plays once, on
 * load, above the fold. `DESIGN.md` §6 prohibits exactly that, and on `/` it would land on the
 * LCP viewport of the route with the tightest Lighthouse gate on the site. So the guard is the
 * difference between "no effect" and "the wrong effect", and it has to survive the build.
 *
 * The source is not the subject — the **built, minified stylesheet** is. Nesting is a thing a
 * minifier rewrites: it hoists, merges and reorders at-rules, and a source file whose guard is
 * obviously correct can emit a bundle whose guard is not. Reading the source proves nothing
 * about what ships.
 *
 * ## What it asserts
 *
 *  1. Every `animation-timeline` declaration in every emitted stylesheet is lexically inside an
 *     `@supports` block whose condition mentions `animation-timeline`. Brace-matched, so a
 *     declaration hoisted out of the block by a minifier fails.
 *  2. The count is non-zero. A build that emitted no scroll-driven animation at all — because a
 *     component was dropped, or a class was renamed — must not read as clean, and this gate's
 *     only output is a count, so the count must be provable to move.
 *
 * ## Proving it
 *
 * `--selftest` runs both assertions against two committed specimens: one guarded, one not. It
 * is the deliberate-failure proof, and it lives in the file rather than in a session transcript
 * so it can be re-run. Run it and the guarded specimen passes, the unguarded one is caught, and
 * an empty specimen is reported as measuring nothing rather than as clean.
 *
 * Usage: node scripts/check-mark-guard.mjs [--selftest]
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const CSS_DIR = '.next/static/css';

/**
 * @returns {{ total: number, unguarded: string[] }}
 */
function audit(css, label) {
  const unguarded = [];
  let total = 0;
  // Depth of @supports blocks whose condition mentions animation-timeline, tracked through a
  // single left-to-right scan with a brace stack. String and comment contents are not parsed —
  // minified CSS has no comments, and no string in this codebase contains a brace.
  const stack = [];
  let guardDepth = 0;
  for (let i = 0; i < css.length; i++) {
    const c = css[i];
    if (c === '@' && css.startsWith('@supports', i)) {
      const open = css.indexOf('{', i);
      const condition = css.slice(i, open);
      stack.push(condition.includes('animation-timeline') ? 'guard' : 'block');
      if (condition.includes('animation-timeline')) guardDepth++;
      i = open;
      continue;
    }
    if (c === '{') {
      stack.push('block');
      continue;
    }
    if (c === '}') {
      if (stack.pop() === 'guard') guardDepth--;
      continue;
    }
    if (c === 'a' && css.startsWith('animation-timeline', i)) {
      // The condition text of the guard itself contains the property name; that occurrence is
      // consumed by the @supports branch above, so anything reaching here is a declaration.
      total++;
      if (guardDepth === 0) unguarded.push(`${label}: unguarded animation-timeline at offset ${i}`);
      i += 'animation-timeline'.length - 1;
    }
  }
  return { total, unguarded };
}

if (process.argv.includes('--selftest')) {
  const GUARDED = '@supports (animation-timeline:scroll()){.a{animation-timeline:scroll();animation-name:x}}';
  const UNGUARDED = '@supports (animation-timeline:scroll()){.a{animation-name:x}}.b{animation-timeline:scroll()}';
  const HOISTED = '@media (min-width:768px){.a{animation-timeline:scroll()}}';
  const EMPTY = '.a{color:red}';

  const cases = [
    ['guarded', GUARDED, { total: 1, unguarded: 0 }],
    ['unguarded sibling', UNGUARDED, { total: 1, unguarded: 1 }],
    ['hoisted out of the guard', HOISTED, { total: 1, unguarded: 1 }],
    ['no declaration at all', EMPTY, { total: 0, unguarded: 0 }],
  ];
  let failed = 0;
  for (const [name, css, want] of cases) {
    const got = audit(css, name);
    const ok = got.total === want.total && got.unguarded.length === want.unguarded;
    if (!ok) failed++;
    console.log(
      `  ${ok ? 'ok  ' : 'FAIL'} ${name.padEnd(26)} total=${got.total} (want ${want.total})  unguarded=${got.unguarded.length} (want ${want.unguarded})`,
    );
  }
  console.log(
    failed
      ? `\ncheck-mark-guard --selftest: ${failed} case(s) wrong.`
      : '\ncheck-mark-guard --selftest: all four cases behave as specified — the guarded specimen passes, both broken specimens are caught, and the empty one reports zero rather than clean.',
  );
  process.exit(failed ? 1 : 0);
}

let files;
try {
  files = readdirSync(CSS_DIR).filter((f) => f.endsWith('.css'));
} catch {
  console.error(`check-mark-guard: ${CSS_DIR} not found. Run \`next build\` first.`);
  process.exit(1);
}

let total = 0;
const problems = [];
for (const f of files) {
  const { total: n, unguarded } = audit(readFileSync(join(CSS_DIR, f), 'utf8'), f);
  total += n;
  problems.push(...unguarded);
}

if (total === 0) {
  console.error(
    'check-mark-guard: no animation-timeline declaration in any emitted stylesheet. The build shipped no scroll-driven animation — that is a failure, not a pass.',
  );
  process.exit(1);
}

if (problems.length) {
  console.error(`\ncheck-mark-guard: ${problems.length} unguarded declaration(s)\n`);
  for (const p of problems) console.error(`  ${p}`);
  process.exit(1);
}

console.log(`check-mark-guard: ${total} animation-timeline declaration(s) across ${files.length} stylesheet(s), all inside the @supports guard.`);
