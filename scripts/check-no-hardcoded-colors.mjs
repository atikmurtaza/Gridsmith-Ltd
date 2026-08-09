#!/usr/bin/env node
/**
 * no-hardcoded-colors
 *
 * CLAUDE.md non-negotiable #1 · master/PROJECT-RULES.md §1.12 · design/PROJECT-RULES.md §1.1
 *
 * Colour is declared in the token layer and nowhere else. Every other file reads a
 * CSS custom property. This is what makes four themes possible over one set of
 * primitives, so it is a build failure rather than a warning.
 *
 * Deliberately a script rather than an ESLint rule: ESLint does not parse CSS, and
 * the CSS files are exactly where a stray hex is most likely to appear.
 */
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, relative, posix, sep } from 'node:path';

const ROOTS = ['app', 'components', 'lib', 'styles', 'scripts'];
const SOURCE = /\.(?:ts|tsx|js|jsx|mjs|cjs|css)$/;

/** The token layer — the one place colour is allowed to exist. */
const ALLOWED = [
  /^styles\/tokens\.css$/,
  /^styles\/themes\/[^/]+\.css$/,
  // This file names colours in order to detect them.
  /^scripts\/check-no-hardcoded-colors\.mjs$/,
];

const RULES = [
  {
    id: 'hex',
    re: /#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{4}|[0-9a-fA-F]{3})\b/g,
  },
  {
    id: 'color-fn',
    re: /\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch)\s*\(/g,
  },
  {
    id: 'tailwind',
    re: new RegExp(
      String.raw`\b(?:text|bg|border|ring|fill|stroke|from|via|to|outline|decoration|divide|accent|caret|shadow|placeholder)-` +
        String.raw`(?:slate|gray|grey|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|white|black)` +
        String.raw`(?:-\d{1,3})?\b`,
      'g',
    ),
  },
];

/**
 * The amber constraint — master/PROJECT-RULES.md §1.2.
 *
 * `--accent-design` is 2.16:1 on master's white canvas. It may be a rule or a badge
 * border and nothing else: never text, never a link colour, never the sole indicator of
 * a state. This catches the half a rule can catch — the token used in a property that
 * paints glyphs.
 *
 * It cannot catch a badge whose only state signal is an amber border. That half is
 * manual review, recorded in master/IMPLEMENTATION-PLAN.md 1.1. Do not treat a green
 * run here as the constraint being fully enforced.
 */
/**
 * The lookbehind is load-bearing. `\b` matches between the hyphen and the `c` of
 * `border-color`, so a word-boundary pattern flags `border-color: var(--accent-design)`
 * — which is one of the two uses the spec explicitly permits. `(?<![-\w])` restricts
 * the match to the standalone property, leaving `border-color`, `background-color` and
 * `outline-color` alone.
 */
const AMBER_AS_TEXT = {
  id: 'amber-as-text',
  re: /(?<![-\w])(?:color|fill|stroke|caret-color|text-decoration-color)\s*:\s*var\(\s*--accent-design\s*\)/gi,
};

/** Named CSS colours, checked in stylesheets only — too many false positives in TS. */
const CSS_NAMED = {
  id: 'named',
  re: /:\s*(?:red|blue|green|black|white|gray|grey|orange|yellow|purple|pink|brown|cyan|magenta|silver|gold|navy|teal|olive|maroon|lime|aqua|fuchsia|crimson|coral|salmon|khaki|violet|indigo|turquoise|tan|beige|ivory)\b/gi,
};

const toPosix = (p) => p.split(sep).join(posix.sep);

function sourceFiles() {
  const out = [];
  for (const root of ROOTS) {
    if (!existsSync(root)) continue;
    for (const entry of readdirSync(root, { recursive: true, withFileTypes: true })) {
      if (!entry.isFile() || !SOURCE.test(entry.name)) continue;
      out.push(toPosix(relative('.', join(entry.parentPath ?? root, entry.name))));
    }
  }
  return out.sort();
}

const violations = [];

for (const file of sourceFiles()) {
  // The token layer is exempt from the colour-literal rules — that is where colour is
  // declared. It is NOT exempt from the amber rule: the token may be defined in
  // master.css, but painting glyphs with it is wrong wherever it happens.
  const isTokenLayer = ALLOWED.some((re) => re.test(file));

  const rules = isTokenLayer
    ? [AMBER_AS_TEXT]
    : file.endsWith('.css')
      ? [...RULES, CSS_NAMED, AMBER_AS_TEXT]
      : [...RULES, AMBER_AS_TEXT];
  const lines = readFileSync(file, 'utf8').split(/\r?\n/);

  lines.forEach((line, i) => {
    for (const { id, re } of rules) {
      re.lastIndex = 0;
      let m;
      while ((m = re.exec(line)) !== null) {
        violations.push({ file, line: i + 1, col: m.index + 1, id, text: m[0].trim() });
      }
    }
  });
}

if (violations.length === 0) {
  console.log(`no-hardcoded-colors: clean (${sourceFiles().length} files)`);
  process.exit(0);
}

console.error(`\nno-hardcoded-colors: ${violations.length} violation(s)\n`);
for (const v of violations) {
  console.error(`  ${v.file}:${v.line}:${v.col}  [${v.id}]  ${v.text}`);
}
console.error(
  '\nColour belongs in styles/tokens.css or styles/themes/*.css only.' +
    '\nEverywhere else, read a custom property: var(--accent), var(--ink), var(--canvas).\n',
);
process.exit(1);
