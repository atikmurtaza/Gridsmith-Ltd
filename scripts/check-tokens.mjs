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

/**
 * The 39 base tokens — FOUNDATION §3. **Hardcoded, exactly as the 15-token theme
 * CONTRACT below already is.**
 *
 * This list did not exist. `declared` was scraped out of tokens.css and then checked
 * against the build, so the gate's expectation and the gate's subject were the same file
 * and the only floor was `length === 0`. Proven at the Epic A audit: `--text-3xl`,
 * `--measure`, `--measure-narrow` and `--shadow-2` were deleted from tokens.css and the
 * gate printed "35 base tokens, each declared exactly once" and exited 0.
 *
 * The tokens that proof used were not chosen at random. `--text-3xl` is the exact token
 * FOUNDATION §3 names as the Tailwind namespace-collision hazard, and `--shadow-2` is the
 * hard shadow ceiling in CLAUDE.md. The gate written to protect them could not notice
 * them leaving.
 *
 * The asymmetry was the tell: the theme contract was hardcoded and correctly protected,
 * while the base layer all four themes build on had no required list at all. Both halves
 * now work the same way. Adding a token means adding it here — that is the point, not an
 * inconvenience: a required list nobody has to update is a required list of nothing.
 */
const REQUIRED = [
  // Spacing — 4px base, geometric
  '--space-1', '--space-2', '--space-3', '--space-4', '--space-6', '--space-8',
  '--space-12', '--space-16', '--space-24', '--space-32', '--space-48',
  // Type scale — 1.25 major third, fluid
  '--text-xs', '--text-sm', '--text-base', '--text-lg',
  '--text-xl', '--text-2xl', '--text-3xl', '--text-4xl',
  '--leading-tight', '--leading-snug', '--leading-normal', '--leading-relaxed',
  '--measure', '--measure-narrow',
  // Structure — hairlines, not shadows. No --shadow-3, deliberately.
  '--border-hairline',
  '--radius-none', '--radius-sm', '--radius-md',
  '--shadow-1', '--shadow-2',
  // Motion — opacity and transform only
  '--ease-out', '--dur-fast', '--dur-base', '--dur-slow',
  // Layout
  '--container', '--container-narrow', '--grid-cols', '--gutter',
];

// Not line-anchored: tokens.css packs several declarations onto one line, and an
// anchored pattern silently reports only the first of each — a gate understating its
// own coverage. A trailing colon is what distinguishes a declaration from a var() use.
const declared = [
  ...new Set(
    [...readFileSync(SOURCE, 'utf8').matchAll(/(--[a-z0-9-]+)\s*:/gi)].map((m) => m[1]),
  ),
];

// Both directions. Missing means the base layer shrank without anyone saying so; extra
// means a token was added and FOUNDATION §3's published count is now wrong — and an
// undeclared token is one nothing in this file has ever checked reaches the build.
const missing = REQUIRED.filter((t) => !declared.includes(t));
const extra = declared.filter((t) => !REQUIRED.includes(t));

if (missing.length > 0 || extra.length > 0) {
  console.error(`\ncheck-tokens: ${SOURCE} does not match the required base-token list\n`);
  for (const t of missing) console.error(`  ${t.padEnd(20)} required by FOUNDATION §3, absent from ${SOURCE}`);
  for (const t of extra) console.error(`  ${t.padEnd(20)} declared in ${SOURCE}, not in the required list`);
  console.error(
    `\nThe list in this file is the specification; ${SOURCE} is the subject. If the token` +
      '\nlayer is genuinely changing, change REQUIRED here and the count in FOUNDATION §3 in' +
      '\nthe same commit — they are two statements of one fact.\n',
  );
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
  // The second colour surface. In CONTRACT rather than SHARED_ACCENTS because it is a
  // token a theme needs to *be* a theme — every theme's own palette, not a reference to
  // another division's.
  '--accent-2',
  '--line', '--line-strong',
  '--font-display', '--font-body', '--font-mono',
  '--radius-default',
];

/**
 * The division-reference accents. **Every theme, not master alone — changed at V3.**
 *
 * They used to be master's exception, which meant `var(--accent-design)` resolved to nothing
 * on the other three. Shared chrome that uses them — the footer division switcher — then had
 * an invalid longhand at computed-value time, which discards the shorthand's colour with it.
 * The same three accents in the same position on every theme is also what makes four themes
 * read as one system.
 *
 * Kept separate from `CONTRACT` so the split stays legible: `CONTRACT` is what a theme needs
 * to *be* a theme, this is what every theme carries to refer to the others.
 */
const SHARED_ACCENTS = [
  '--accent-design', '--accent-digital', '--accent-press',
  // The foreground each carries when it is used as a fill rather than a rule. Same
  // theme-invariant reasoning as the accents themselves: a division block must look the
  // same wherever it is rendered, so the pair travels together or not at all.
  '--accent-design-ink', '--accent-digital-ink', '--accent-press-ink',
];

const themeProblems = [];
// Counted inside the loop: `THEMES.length` and `CONTRACT.length` are both constants and print
// the same sentence whether anything was compared or not. The audit disabled this loop and the
// output was identical. `M-P1-4`.
let contractChecks = 0;

for (const theme of THEMES) {
  const src = readFileSync(`styles/themes/${theme}.css`, 'utf8');
  const defined = new Set([...src.matchAll(/(--[a-z0-9-]+)\s*:/gi)].map((m) => m[1]));

  for (const token of [...CONTRACT, ...SHARED_ACCENTS]) {
    contractChecks += 1;
    if (!defined.has(token)) themeProblems.push(`${theme}: missing ${token}`);
  }

  const allowed = new Set([...CONTRACT, ...SHARED_ACCENTS]);
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

if (contractChecks === 0) {
  console.error('\ncheck-tokens: checked zero token/theme combinations — the contract loop did not run.\n');
  process.exit(1);
}
console.log(
  `check-tokens: ${contractChecks} token/theme combination(s) checked — ${THEMES.length} themes ` +
    `× the ${CONTRACT.length}-token contract ` +
    `plus the ${SHARED_ACCENTS.length} division accents every theme now carries (V3), ` +
    'all present in the built CSS',
);

/* ---------------------------------------------------------------------------------
 * Duration literals — CLAUDE.md "The feel", master/PROJECT-RULES.md §9.
 *
 * Motion runs on --dur-fast / --dur-base / --dur-slow. A raw `450ms` in a CSS module is
 * off the scale and outside the reduced-motion contract's intent, and nothing was looking
 * for one — the same shape as a hardcoded colour, which has had a gate since A-10a. Same
 * class, so it gets the same treatment rather than a code review note.
 * ------------------------------------------------------------------------------- */

// `styles/` was missing, which is where globals.css and the four theme files live. A raw
// `450ms` in any of them was outside the sweep, in the gate that asserts motion is on the
// token scale. Same class as the narrowed subjects in the two lint gates.
const STYLE_ROOTS = ['app', 'components', 'styles'];

// tokens.css is where the duration scale is DECLARED, and the reduced-motion block that
// collapses it lives there too. Exempting the declaration site is the same shape as
// check-no-hardcoded-colors exempting the token layer from the colour rules: the point of
// a token file is to be the one place a literal is allowed. Nothing else in styles/ is
// exempt, which is what makes adding the root worth anything.
const DURATION_SOURCE = 'styles/tokens.css';
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
    const file = join(entry.parentPath ?? root, entry.name);
    if (file.split(sep).join('/') === DURATION_SOURCE) continue;
    cssFilesScanned += 1;
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
  console.error(
    `\ncheck-tokens: no CSS files found under ${STYLE_ROOTS.map((r) => r + '/').join(', ')}` +
      ` (excluding ${DURATION_SOURCE}). Nothing was scanned.\n`,
  );
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
