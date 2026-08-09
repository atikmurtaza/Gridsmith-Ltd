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
import { join } from 'node:path';

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

const missing = declared.filter((t) => !css.includes(t));

if (missing.length > 0) {
  console.error(`\ncheck-tokens: ${missing.length} of ${declared.length} token(s) missing from the built CSS\n`);
  for (const t of missing) console.error(`  ${t}`);
  console.error(`\nDeclared in ${SOURCE} but absent from the output — check the import chain in styles/globals.css.\n`);
  process.exit(1);
}

console.log(`check-tokens: ${declared.length} base tokens present in the built CSS`);

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
