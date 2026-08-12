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
import { readFileSync } from 'node:fs';
import { sourceFiles } from './source-files.mjs';

/**
 * Which trees are scanned, and the guarantee that a new one cannot arrive unscanned,
 * live in scripts/source-files.mjs — shared with check-service-role-key, because the
 * two gates were drifting apart on the same invariant.
 *
 * `.svg` is deliberately NOT source here. A brand mark is an asset and legitimately
 * carries its own colour (Q-M15); the rule is about stylesheets and components, which is
 * where a stray hex breaks theming. `.svg` IS worth adding the day an inline SVG icon
 * set arrives in components/, since those must inherit `currentColor`.
 */
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
    // `color-mix` was absent, and it is precisely how someone tints a token without
    // writing a literal: `color-mix(in srgb, var(--accent), white 20%)` is a new colour
    // that no theme declares and no contrast gate measures.
    id: 'color-fn',
    re: /\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color-mix)\s*\(/g,
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

/**
 * Named CSS colours, checked in stylesheets only — too many false positives in TS.
 *
 * **This used to be `/:\s*(?:red|blue|…)/` — the colour word had to sit IMMEDIATELY after
 * a colon.** Run against realistic input, that rule caught `color: red` and missed every
 * one of these:
 *
 *     border: 1px solid red;
 *     outline: 2px dashed black;
 *     box-shadow: 0 0 0 1px navy;
 *     background: var(--canvas) no-repeat white;
 *     background: linear-gradient(to right, teal, gold);
 *
 * The first of those is not a hypothetical shape. The entire design language is 1px
 * borders and the shorthand is already idiomatic here — `interactive.module.css` writes
 * `border-block-end: 2px solid transparent`. A named colour in that position shipped
 * unflagged, under a gate reporting "clean", enforcing CLAUDE.md non-negotiable #1.
 *
 * Whatever deliberate-failure proof this gate originally had must have used `color:` or a
 * hex, both of which it caught. A proof that exercises only the forms a check already
 * catches has not proven anything. The proof for this version uses
 * `border: 1px solid red`, and is recorded in 01-VALIDATION-REPORT §14.
 *
 * The fix is a declaration mask, not a longer regex: the word is flagged anywhere inside
 * a declaration value, and nowhere else. Doing it with a lookbehind alone would flag
 * `.gold`, `#silver` and prose in comments.
 */
const NAMED = /(?<![\w-])(?:red|blue|green|black|white|gray|grey|orange|yellow|purple|pink|brown|cyan|magenta|silver|gold|navy|teal|olive|maroon|lime|aqua|fuchsia|crimson|coral|salmon|khaki|violet|indigo|turquoise|tan|beige|ivory)(?![\w-])/gi;

/**
 * Blanks everything that is not a declaration value, preserving offsets so line and
 * column numbers stay true. Comments and quoted strings go first — a comment explaining
 * why a literal was removed contains the literal, and `--font-body: 'Silver Sans'` is a
 * typeface, not a colour.
 *
 * A value runs from `:` to the next `;`, `{` or `}`. That admits the `:` in `a:hover`
 * until the `{` closes it, which costs nothing: no pseudo-class is a colour name.
 * Crucially it spans newlines, so a multi-line `transition:` or `background:` value —
 * which this codebase writes — is covered. A per-line rule would not have been.
 */
function declarationValues(css) {
  const blanked = css.replace(/\/\*[\s\S]*?\*\/|'[^'\n]*'|"[^"\n]*"/g, (m) =>
    m.replace(/[^\n]/g, ' '),
  );
  const out = [...blanked].map((ch) => (ch === '\n' ? '\n' : ' '));
  let inValue = false;
  for (let i = 0; i < blanked.length; i += 1) {
    const ch = blanked[i];
    if (ch === ':') inValue = true;
    else if (ch === ';' || ch === '{' || ch === '}') inValue = false;
    else if (inValue) out[i] = ch;
  }
  return out.join('');
}

const violations = [];
const files = sourceFiles('no-hardcoded-colors', SOURCE);

for (const file of files) {
  // The token layer is exempt from the colour-literal rules — that is where colour is
  // declared. It is NOT exempt from the amber rule: the token may be defined in
  // master.css, but painting glyphs with it is wrong wherever it happens.
  const isTokenLayer = ALLOWED.some((re) => re.test(file));

  const rules = isTokenLayer ? [AMBER_AS_TEXT] : [...RULES, AMBER_AS_TEXT];
  const source = readFileSync(file, 'utf8');

  source.split(/\r?\n/).forEach((line, i) => {
    for (const { id, re } of rules) {
      re.lastIndex = 0;
      let m;
      while ((m = re.exec(line)) !== null) {
        violations.push({ file, line: i + 1, col: m.index + 1, id, text: m[0].trim() });
      }
    }
  });

  // Named colours run over the whole file rather than line by line, because the mask that
  // decides what is a declaration value has to span newlines to cover a multi-line value.
  if (!isTokenLayer && file.endsWith('.css')) {
    const masked = declarationValues(source);
    NAMED.lastIndex = 0;
    let m;
    while ((m = NAMED.exec(masked)) !== null) {
      const before = masked.slice(0, m.index);
      const line = before.split('\n').length;
      violations.push({
        file,
        line,
        col: m.index - before.lastIndexOf('\n'),
        id: 'named',
        text: m[0],
      });
    }
  }
}

if (violations.length === 0) {
  console.log(`no-hardcoded-colors: clean (${files.length} files)`);
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
