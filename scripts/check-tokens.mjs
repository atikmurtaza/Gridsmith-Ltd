#!/usr/bin/env node
/**
 * check-tokens
 *
 * docs/_shared/00-FOUNDATION.md §3 · master/PROJECT-RULES.md §3
 *
 * Asserts every base token declared in styles/tokens.css survives into the built CSS.
 *
 * The failure this exists for is silent: a wrong import path, a dropped `@import`, or a
 * build that tree-shakes the stylesheet leaves every `var(--space-4)` resolving to
 * nothing. The build still succeeds and the pages still render — just unstyled, with no
 * error anywhere. That is cheap to catch here and expensive to diagnose at A-05 with 24
 * primitives on screen.
 *
 * A-03 extends this to theme parity: a token defined in one theme but not the other
 * three is a bug (PROJECT-RULES §3).
 */
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, sep } from 'node:path';

const SOURCE = 'styles/tokens.css';
const BUILD_DIR = '.next/static';

if (!existsSync(BUILD_DIR)) {
  console.error('check-tokens: no build found. Run `npm run build` first.');
  process.exit(1);
}

// Not line-anchored: tokens.css packs several declarations onto one line, and an
// anchored pattern silently reports only the first of each — a gate understating its
// own coverage. A trailing colon is what distinguishes a declaration from a var() use.
const declared = [
  ...new Set(
    [...readFileSync(SOURCE, 'utf8').matchAll(/(--[a-z0-9-]+)\s*:/gi)].map((m) => m[1]),
  ),
];

if (declared.length === 0) {
  console.error(`check-tokens: no tokens found in ${SOURCE}. That is almost certainly wrong.`);
  process.exit(1);
}

let css = '';
for (const entry of readdirSync(BUILD_DIR, { recursive: true, withFileTypes: true })) {
  if (entry.isFile() && entry.name.endsWith('.css')) {
    css += readFileSync(join(entry.parentPath ?? BUILD_DIR, entry.name), 'utf8');
  }
}

if (css === '') {
  console.error('check-tokens: the build emitted no CSS at all. The stylesheet is not wired up.');
  process.exit(1);
}

/**
 * Count DECLARATIONS, not occurrences.
 *
 * This asserted `css.includes('--text-3xl')` and passed on the string appearing anywhere.
 * 32 of the 39 tokens appear in the output as `var()` references from the primitives'
 * CSS modules, so the assertion was satisfied by the callers rather than by the token
 * layer — verified by stripping every declaration out of the built CSS and watching 32
 * still report present.
 *
 * That defeated the exact regression it was written for. FOUNDATION §3 records that
 * Tailwind v4 emits its own `--text-*`, `--leading-*`, `--radius-*` and `--ease-*`, and
 * that reordering two lines in globals.css would silently hand the type scale back to
 * Tailwind "with nothing failing". `--text-3xl` is in the output either way, so a
 * substring test could never see it.
 *
 * Exactly one declaration is the assertion that catches both directions: zero means the
 * import chain broke, two means something else is defining our name alongside us and the
 * winner depends on source order.
 */
const declCount = (token) =>
  (css.match(new RegExp(`${token}\\s*:`, 'g')) ?? []).length;

const wrong = declared.map((t) => [t, declCount(t)]).filter(([, n]) => n !== 1);

if (wrong.length > 0) {
  const gone = wrong.filter(([, n]) => n === 0);
  const dupes = wrong.filter(([, n]) => n > 1);
  console.error(`\ncheck-tokens: ${wrong.length} of ${declared.length} token(s) are not declared exactly once\n`);
  for (const [t] of gone) console.error(`  ${t.padEnd(20)} declared 0 times — absent from the output`);
  for (const [t, n] of dupes) console.error(`  ${t.padEnd(20)} declared ${n} times — a second definition is competing with ours`);
  console.error(
    '\nZero: check the import chain in styles/globals.css.' +
      '\nMore than one: something else declares this name. Clear its namespace in the' +
      '\n@theme block rather than relying on import order to win.\n',
  );
  process.exit(1);
}

console.log(`check-tokens: ${declared.length} base tokens, each declared exactly once in the built CSS`);

/* ---------------------------------------------------------------------------------
 * Theme parity — master/PROJECT-RULES.md §3.
 * "Adding a token means adding it to all four themes, or to the base layer. A token
 * defined in one theme only is a bug." A missing token does not error at runtime; it
 * silently resolves to nothing, so nothing catches it but this.
 * ------------------------------------------------------------------------------- */

const THEMES = ['master', 'design', 'digital', 'press'];

/** The 15-token theme contract — FOUNDATION §3. */
const CONTRACT = [
  '--canvas', '--canvas-raised', '--canvas-sunken',
  '--ink', '--ink-muted', '--ink-subtle',
  '--accent', '--accent-hover', '--accent-ink',
  '--line', '--line-strong',
  '--font-display', '--font-body', '--font-mono',
  '--radius-default',
];

/** The one documented exception: master carries the division-reference accents. */
const MASTER_EXTRAS = ['--accent-design', '--accent-digital', '--accent-press'];

const themeProblems = [];

for (const theme of THEMES) {
  const src = readFileSync(`styles/themes/${theme}.css`, 'utf8');
  const defined = new Set([...src.matchAll(/(--[a-z0-9-]+)\s*:/gi)].map((m) => m[1]));

  for (const token of CONTRACT) {
    if (!defined.has(token)) themeProblems.push(`${theme}: missing ${token}`);
  }

  const allowed = new Set([...CONTRACT, ...(theme === 'master' ? MASTER_EXTRAS : [])]);
  for (const token of defined) {
    if (!allowed.has(token)) {
      themeProblems.push(`${theme}: declares ${token}, which is not in the theme contract`);
    }
  }

  // Selector must survive minification — Lightning CSS drops the quotes.
  const selector = new RegExp(`\\[data-division=["']?${theme}["']?\\]`);
  if (!selector.test(css)) {
    themeProblems.push(`${theme}: [data-division="${theme}"] is absent from the built CSS`);
  }
}

if (themeProblems.length > 0) {
  console.error(`\ncheck-tokens: ${themeProblems.length} theme contract problem(s)\n`);
  for (const p of themeProblems) console.error(`  ${p}`);
  console.error('');
  process.exit(1);
}

console.log(
  `check-tokens: ${THEMES.length} themes each define the ${CONTRACT.length}-token contract ` +
    `(master +${MASTER_EXTRAS.length} division accents), all present in the built CSS`,
);

/* ---------------------------------------------------------------------------------
 * Duration literals — CLAUDE.md "The feel", master/PROJECT-RULES.md §9.
 *
 * Motion runs on --dur-fast / --dur-base / --dur-slow. A raw `450ms` in a CSS module is
 * off the scale and outside the reduced-motion contract's intent, and nothing was looking
 * for one — the same shape as a hardcoded colour, which has had a gate since A-10a. Same
 * class, so it gets the same treatment rather than a code review note.
 * ------------------------------------------------------------------------------- */

const STYLE_ROOTS = ['app', 'components'];
const DURATION = /(?<![\w.-])\d+(?:\.\d+)?m?s(?![\w-])/g;

const durationProblems = [];
let cssFilesScanned = 0;

for (const root of STYLE_ROOTS) {
  if (!existsSync(root)) {
    console.error(`\ncheck-tokens: style root "${root}/" does not exist — it was not scanned.\n`);
    process.exit(1);
  }
  for (const entry of readdirSync(root, { recursive: true, withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith('.css')) continue;
    cssFilesScanned += 1;
    const file = join(entry.parentPath ?? root, entry.name);
    readFileSync(file, 'utf8')
      // Blank out comments, preserving line count. A comment explaining why a literal was
      // removed contains the literal, and flagging that is a gate arguing with its own
      // documentation — caught the first time this ran.
      .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))
      .split(/\r?\n/)
      .forEach((line, i) => {
        DURATION.lastIndex = 0;
        let m;
        while ((m = DURATION.exec(line)) !== null) {
          durationProblems.push(`${file.split(sep).join('/')}:${i + 1}  ${m[0]}`);
        }
      });
  }
}

if (cssFilesScanned === 0) {
  console.error('\ncheck-tokens: no CSS modules found under app/ or components/. Nothing was scanned.\n');
  process.exit(1);
}

if (durationProblems.length > 0) {
  console.error(`\ncheck-tokens: ${durationProblems.length} duration literal(s) outside the token scale\n`);
  for (const p of durationProblems) console.error(`  ${p}`);
  console.error('\nUse var(--dur-fast), var(--dur-base) or var(--dur-slow). Adding a fourth duration\nmeans adding it to styles/tokens.css first.\n');
  process.exit(1);
}

console.log(
  `check-tokens: ${cssFilesScanned} CSS modules carry no duration literal — motion is on the token scale`,
);
