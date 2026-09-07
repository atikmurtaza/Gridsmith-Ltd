#!/usr/bin/env node
/**
 * check-state-cues
 *
 * **A state may never be carried by colour alone.** WCAG 2.2 SC 1.4.1, and
 * `digital/DESIGN.md` §2's sharpest case: `--line-strong` measures **1.59:1** on Digital's
 * canvas — `check:contrast` asserts that literal and classifies the token `decor`, decorative
 * only — so a selected estimator option distinguished by a `--line-strong` border is
 * indistinguishable to a large number of readers. §5 answers it with three cues: a 2px accent
 * border **and** a filled check glyph **and** a `--canvas-sunken` background.
 *
 * That rule was written in four places and enforced in none. Three primitives already satisfy
 * it — `.pageCurrent`, `.tabSelected`, `.stepCurrent`/`.stepComplete` — each with a comment
 * saying so, and a comment is not a gate. `Stepper`'s completed step is the reason to care: it
 * shipped carrying `border-color` and `color` and nothing else, **two colour changes, which is
 * the one thing 1.4.1 forbids**, in the primitive that renders the canonical six process
 * stages on every division. It was caught by reading. The next one would not be.
 *
 * ## The unit is the state, not the declaration block
 *
 * Per-block would be wrong and would have failed a correct primitive. `Stepper` writes the
 * current step as two rules — `.stepCurrent .stepMarker` sets background, colour and
 * border-colour (all colour), and `.stepCurrent .stepTitle` sets `font-weight` (the non-colour
 * cue). Split across blocks, the state is correct; judged per block, the first one fails. So
 * blocks are grouped by the **state token in their selector** and the group must carry a cue.
 *
 * ## What counts as a cue
 *
 * A declaration a reader can perceive without distinguishing hue: weight, decoration, a
 * generated glyph, a change in border or outline **width or style**. Background and colour and
 * border-*colour* are explicitly not cues — they are the thing being ruled out. `content` is
 * included because a filled check glyph is exactly what `DESIGN.md` §5 specifies.
 *
 * **`aria-current` / `aria-selected` are not cues here and that is deliberate.** They are the
 * assistive-technology half and are already asserted by `check-axe`; 1.4.1 is about what a
 * sighted reader who cannot separate two hues perceives, and an ARIA attribute does nothing
 * for them. A state satisfying only ARIA passes axe and fails this.
 *
 * ## Counts must be provable to move
 *
 * The specimens below run **before** the tree is read: a predicate edited into something inert
 * would otherwise report a clean scan forever. And the live scan fails on a **zero state
 * group** count — the assertion is about states, so a run that found none measured nothing,
 * which reads exactly like compliance. Today the tree holds real groups; if a refactor ever
 * removes them all, this goes red rather than quiet.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOTS = ['components', 'app', 'styles'];

/** Selector fragments that mean "this rule paints a state". */
const STATE_TOKEN =
  /(:checked|\[aria-selected|\[aria-current|\[aria-pressed|\[data-selected|\[data-state|\.[A-Za-z][A-Za-z0-9]*(?:Current|Selected|Active|Complete|Checked))/;

/** The same, capturing the token so blocks can be grouped by the state they paint. */
const STATE_KEY =
  /:checked|\[aria-selected[^\]]*\]|\[aria-current[^\]]*\]|\[aria-pressed[^\]]*\]|\[data-selected[^\]]*\]|\[data-state[^\]]*\]|\.[A-Za-z][A-Za-z0-9]*(?:Current|Selected|Active|Complete|Checked)/;

/** Declarations a reader perceives without separating hues. */
const CUE =
  /(^|[;{\s])(font-weight|font-style|text-decoration|text-decoration-line|content|border(?:-[a-z-]+)?-width|border(?:-[a-z-]+)?-style|outline-width|outline-style|text-underline-offset)\s*:/;

/**
 * Split CSS into `{selector, body}` blocks. Naive, and adequate: these are CSS modules with no
 * nesting, and an at-rule's inner blocks come through as blocks of their own, which is what we
 * want — a rule inside `@media` still paints a state.
 *
 * @param {string} css
 * @returns {{selector: string, body: string}[]}
 */
export function blocks(css) {
  const stripped = css.replace(/\/\*[\s\S]*?\*\//g, ' ');
  const out = [];
  for (const m of stripped.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const selector = m[1].trim();
    if (!selector || selector.startsWith('@')) continue;
    out.push({ selector, body: m[2] });
  }
  return out;
}

/**
 * Group a file's state-painting blocks by state token, and report which groups carry no cue.
 *
 * @param {string} css
 * @returns {{groups: Map<string, boolean>, offenders: string[]}}
 */
export function stateGroups(css) {
  const groups = new Map();
  for (const { selector, body } of blocks(css)) {
    if (!STATE_TOKEN.test(selector)) continue;
    const key = selector.match(STATE_KEY)?.[0];
    if (!key) continue;
    const hasCue = CUE.test(body);
    groups.set(key, (groups.get(key) ?? false) || hasCue);
  }
  return { groups, offenders: [...groups].filter(([, ok]) => !ok).map(([k]) => k) };
}

/**
 * Specimens. Asserted before anything is read from disk. Each is a state rule; the boolean is
 * whether it must be reported as an offender.
 */
const SPECIMENS = [
  // The defect the rule exists for, in its sharpest form.
  ['.optionSelected { border-color: var(--line-strong); }', true],
  // Two colour changes and nothing else — Stepper's shipped defect, reconstructed.
  ['.stepComplete .stepMarker { border-color: var(--accent); color: var(--accent); }', true],
  ['.tabSelected { color: var(--ink); }', true],
  ['[aria-current="page"] { background: var(--accent); color: var(--accent-ink); }', true],
  // ARIA alone is not a cue for a sighted reader who cannot separate the hues.
  ['[aria-selected="true"] { border-block-end-color: var(--accent); }', true],
  // Correct: a non-colour cue is present.
  ['.tabSelected { color: var(--ink); font-weight: 600; border-block-end-color: var(--accent); }', false],
  ['.pageCurrent { background: var(--accent); text-decoration: underline; }', false],
  ['.optionSelected::after { content: "✓"; }', false],
  ['.stepComplete .stepMarker { border-width: 2px; border-color: var(--accent); }', false],
  // Split across blocks: the group carries the cue even though the first block does not.
  [
    '.stepCurrent .stepMarker { background: var(--accent); color: var(--accent-ink); }\n' +
      '.stepCurrent .stepTitle { font-weight: 600; }',
    false,
  ],
];

const problems = [];

for (const [css, shouldOffend] of SPECIMENS) {
  const { offenders } = stateGroups(css);
  if (offenders.length > 0 !== shouldOffend) {
    problems.push(
      `specimen ${JSON.stringify(css.slice(0, 60))} was ${shouldOffend ? 'accepted' : 'rejected'} ` +
        'by a predicate that must do the opposite. A clean scan of the tree would have meant ' +
        'nothing.',
    );
  }
}

if (problems.length > 0) {
  console.error('\ncheck-state-cues: the predicate failed its own specimens.\n');
  for (const p of problems) console.error(`  ${p}\n`);
  process.exit(1);
}

/** @param {string} dir @returns {string[]} */
const cssFiles = (dir) => {
  const out = [];
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry === '.next') continue;
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) out.push(...cssFiles(path));
    else if (entry.endsWith('.css')) out.push(path);
  }
  return out;
};

const counted = { files: 0, groups: 0 };

for (const root of ROOTS) {
  for (const file of cssFiles(root)) {
    counted.files += 1;
    const { groups, offenders } = stateGroups(readFileSync(file, 'utf8'));
    counted.groups += groups.size;
    for (const key of offenders) {
      problems.push(
        `${file} paints the state ${key} with colour alone. WCAG 2.2 SC 1.4.1 — add a cue a ` +
          'reader perceives without separating hues: weight, decoration, a glyph, or a change ' +
          'in border/outline width or style. On Digital this is not theoretical: ' +
          '--line-strong is 1.59:1 on the canvas and check:contrast classifies it decorative.',
      );
    }
  }
}

if (problems.length > 0) {
  console.error(`\ncheck-state-cues: ${problems.length} problem(s)\n`);
  for (const p of problems) console.error(`  ${p}\n`);
  process.exitCode = 1;
} else if (counted.groups === 0) {
  console.error(
    `\ncheck-state-cues: ${counted.files} CSS file(s) read and 0 state group(s) found. The ` +
      'assertion is about states, so this run measured nothing — which reads exactly like ' +
      'compliance. Either the tree lost every state rule or the selector match broke.\n',
  );
  process.exitCode = 1;
} else {
  console.log(
    `check-state-cues: ${counted.files} CSS file(s), ${counted.groups} state group(s) — every ` +
      `one carries a non-colour cue; predicate proved against ${SPECIMENS.length} specimens first`,
  );
}
