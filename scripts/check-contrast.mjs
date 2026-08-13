#!/usr/bin/env node
/**
 * check-contrast
 *
 * WCAG 2.2 AA is the floor — CLAUDE.md non-negotiable #10.
 *
 * Computes the real contrast ratio for every pair named in the four DESIGN.md §2
 * tables, reading the values out of the theme files rather than out of the prose. Two
 * distinct failures are caught:
 *
 *   1. A pair that does not meet the minimum for its role.
 *   2. A pair whose measured ratio disagrees with the ratio DESIGN.md claims. A spec
 *      that states 8.9:1 where the colours actually give 7.2:1 is worse than a spec
 *      with no numbers, because the number stops anyone re-checking.
 *
 * Roles and minima (WCAG 2.2):
 *   text      4.5:1   normal-size body text
 *   large     3.0:1   >=24px, or >=18.66px bold
 *   ui        3.0:1   component boundaries and state indicators
 *   decor     none    purely decorative — reported, never enforced
 */
import { readFileSync, globSync } from 'node:fs';

const THEMES = ['master', 'design', 'digital', 'press'];
const TOLERANCE = 0.02; // DESIGN.md now carries measured values to 2dp

/**
 * How much this gate must measure. **Literals, deliberately** — both numbers are
 * published (FOUNDATION §3, tracker A-03) and both were previously unenforced or
 * self-enforced:
 *
 *  - `EXPECTED_PAIRS` did not exist. PAIRS is the half of this gate that exists because
 *    25 of the 29 figures in the four DESIGN.md §2 tables were wrong and two were hiding
 *    real WCAG AA failures. Emptying a theme's array reported fewer pairs and exited 0.
 *  - `EXPECTED_CELLS` was computed as `THEMES.length * (Object.keys(USE).length - 3) *
 *    SURFACES.length + …` — from the same USE table the loop iterates. Remove a token
 *    from USE and the measured count and the expected count fell together, green, having
 *    measured less. It caught only an in-loop `continue`, the one failure the loop was
 *    already structurally safe from. The `- 3` and `1 * 3 *` were hand-maintained and
 *    tied to MASTER_EXTRAS by nothing but a comment.
 *
 * An expectation derived from its own subject is not an expectation.
 */
const EXPECTED_PAIRS = 29;
const EXPECTED_CELLS = 101;

/**
 * Pairs as named in each DESIGN.md §2 table, with the ratio each table publishes.
 * These are measured values as of A-03, not the original estimates — 25 of the 29
 * figures originally published were wrong, two of them hiding a real AA failure.
 * If a colour changes, this gate fails until the published table is updated too.
 */
const PAIRS = {
  master: [
    ['--ink', '--canvas', 'text', 19.17],
    ['--ink-muted', '--canvas', 'text', 7.73],
    ['--ink-subtle', '--canvas', 'text', 5.52],
    ['--accent-ink', '--accent', 'text', 19.17],
    ['--accent-design', '--canvas', 'decor', 2.16],
    ['--accent-digital', '--canvas', 'text', 5.09],
    ['--accent-press', '--canvas', 'text', 9.74],
    ['--line-strong', '--canvas', 'decor', 1.74],
  ],
  design: [
    ['--ink', '--canvas', 'text', 17.92],
    ['--ink-muted', '--canvas', 'text', 7.56],
    ['--ink-subtle', '--canvas', 'text', 5.37],
    ['--accent', '--canvas', 'text', 9.07],
    ['--accent', '--canvas-raised', 'text', 8.46],
    ['--accent-ink', '--accent', 'text', 9.07],
    ['--line-strong', '--canvas', 'decor', 1.72],
  ],
  digital: [
    ['--ink', '--canvas', 'text', 18.96],
    ['--ink-muted', '--canvas', 'text', 7.40],
    ['--ink-subtle', '--canvas', 'text', 5.28],
    ['--accent', '--canvas', 'text', 4.87],
    ['--accent', '--canvas-raised', 'text', 5.09],
    ['--accent-ink', '--accent', 'text', 5.09],
    ['--line-strong', '--canvas', 'decor', 1.59],
  ],
  press: [
    ['--ink', '--canvas', 'text', 16.84],
    ['--ink-muted', '--canvas', 'text', 7.25],
    ['--ink-subtle', '--canvas', 'text', 5.44],
    ['--accent', '--canvas', 'text', 9.25],
    ['--accent-ink', '--accent', 'text', 9.25],
    ['--ink', '--canvas-sunken', 'text', 15.42],
    ['--line-strong', '--canvas', 'decor', 1.69],
  ],
};

const MIN = { text: 4.5, large: 3.0, ui: 3.0, decor: 0 };

const SURFACES = ['--canvas', '--canvas-raised', '--canvas-sunken'];

/**
 * The permission matrix — FOUNDATION §3.
 *
 * EVERY foreground token is measured against EVERY surface in EVERY theme, and the role
 * each combination may carry is derived from that measurement. Nothing is exempt because
 * nobody has been burned by it yet.
 *
 * This replaces a three-token list that covered `--ink`, `--ink-muted` and `--ink-subtle`
 * and left `--accent` unchecked — while the A-05 sweep had already measured `--accent` at
 * 4.46:1 on Digital's `--canvas-sunken`, below the 4.5:1 body-text floor, and FOUNDATION
 * §3 published that very number. The measurement existed; the gate covered three tokens
 * out of nine. That is the class of defect, and a per-token list is what produces it.
 *
 * `role` is the strongest job the design gives a token. `except` records a surface where
 * that job is deliberately not claimed, with the reason — a downgrade must be a decision
 * someone wrote down, never a silent omission.
 */
const ROLE_OF = { body: 'body text', large: 'large text', ui: 'UI boundary or state', decor: 'decorative only' };

const USE = {
  '--ink': { role: 'body' },
  '--ink-muted': { role: 'body' },
  // **A11Y-22 is closed here, and the `except` entry is gone rather than narrowed.**
  //
  // --ink-subtle used to carry `except: { '--canvas-sunken': 'ui' }` because it measured
  // 4.18–4.43:1 there in three of the four themes, below the 4.5:1 body floor. That
  // downgrade was recorded honestly and enforced nowhere: the matrix granted it and no
  // gate checked that the stylesheets obeyed it, which is exactly what A11Y-22 named.
  //
  // Rather than enforce a restriction, the run-3 fixes removed the need for one. All four
  // --ink-subtle values were re-derived to clear the body floor on every surface, with the
  // worst cell in each theme landing in a 4.96–5.01:1 band:
  //
  //   master   5.52 / 5.28 / 5.01     design   5.37 / 5.00 / 5.56
  //   digital  5.28 / 5.52 / 4.96     press    5.44 / 5.73 / 4.98
  //
  // Design never actually failed — it measured 5.01 / 4.68 / 5.19 and had been swept into
  // the restriction blanket without meeting its stated range. It was re-derived anyway so
  // the four themes read as one system, which is the whole argument for a shared scale.
  //
  // A token that needs a restriction to be safe is a token whose value is wrong. There is
  // now no restricted token anywhere in USE — see the note in the size pass about what
  // that means for the branch that enforces restrictions.
  '--ink-subtle': { role: 'body' },
  '--accent': { role: 'body' },
  '--accent-hover': { role: 'body' },
  '--line': { role: 'decor' },
  '--line-strong': { role: 'decor' },
  // Master only. 2.16:1 on white — rules and badge borders, never text, never a state
  // (master/PROJECT-RULES.md §1.2). A badge is static content, so WCAG 1.4.11 does not
  // apply to its border; that is why decorative is the honest role rather than a failure.
  '--accent-design': { role: 'decor' },
  '--accent-digital': { role: 'body' },
  '--accent-press': { role: 'body' },
};

/**
 * Foregrounds that sit on an accent fill rather than a canvas — the filled button, the
 * current pagination page, the current stepper marker.
 */
const ON_ACCENT = { '--accent-ink': { role: 'body', over: ['--accent', '--accent-hover'] } };

/**
 * The control-border invariant — FOUNDATION §3. Neither line token clears 3:1 anywhere,
 * so `--ink-subtle` is nominated for every border that identifies a control or a state.
 * The nomination is only sound while it measures >=3:1 on every surface of every theme.
 */
const CONTROL_BORDER = '--ink-subtle';

const srgb = (v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);

function luminance(hex) {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? [...h].map((c) => c + c).join('') : h;
  const [r, g, b] = [0, 2, 4].map((i) => srgb(parseInt(full.slice(i, i + 2), 16) / 255));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function ratio(fg, bg) {
  const [a, b] = [luminance(fg), luminance(bg)].sort((x, y) => y - x);
  return (a + 0.05) / (b + 0.05);
}

function tokens(theme) {
  const css = readFileSync(`styles/themes/${theme}.css`, 'utf8');
  return Object.fromEntries(
    [...css.matchAll(/(--[a-z0-9-]+)\s*:\s*(#[0-9a-fA-F]{3,8})\s*;/g)].map((m) => [m[1], m[2]]),
  );
}

const failures = [];
const drift = [];
const rows = [];

for (const theme of THEMES) {
  const t = tokens(theme);
  for (const [fg, bg, role, claimed] of PAIRS[theme]) {
    if (!t[fg] || !t[bg]) {
      failures.push(`${theme}: ${fg} on ${bg} — token not found in the theme file`);
      continue;
    }
    const measured = ratio(t[fg], t[bg]);
    const min = MIN[role];
    const pass = measured >= min;
    const delta = measured - claimed;

    if (!pass) failures.push(`${theme}: ${fg} on ${bg} = ${measured.toFixed(2)}:1, needs ${min}:1 for role "${role}"`);
    if (Math.abs(delta) > TOLERANCE) drift.push({ theme, fg, bg, claimed, measured });

    rows.push({ theme, fg, bg, role, claimed, measured, min, pass, delta });
  }
}

const wf = Math.max(...rows.map((r) => r.fg.length));
const wb = Math.max(...rows.map((r) => r.bg.length));

let current = '';
for (const r of rows) {
  if (r.theme !== current) {
    current = r.theme;
    console.log(`\n${current.toUpperCase()}`);
    console.log(
      '  ' + 'foreground'.padEnd(wf) + '  ' + 'background'.padEnd(wb) +
      '  role   measured   claimed     Δ  min   verdict',
    );
  }
  const d = r.delta >= 0 ? `+${r.delta.toFixed(2)}` : r.delta.toFixed(2);
  const flag = Math.abs(r.delta) > TOLERANCE ? ' DRIFT' : '';
  console.log(
    `  ${r.fg.padEnd(wf)}  ${r.bg.padEnd(wb)}  ${r.role.padEnd(5)}  ` +
      `${r.measured.toFixed(2).padStart(6)}:1  ${r.claimed.toFixed(1).padStart(6)}:1  ` +
      `${d.padStart(5)}  ${String(r.min).padStart(3)}  ${r.pass ? 'pass' : 'FAIL'}${flag}`,
  );
}

console.log('');

if (drift.length > 0) {
  console.error(`check-contrast: ${drift.length} pair(s) disagree with DESIGN.md by more than ${TOLERANCE}\n`);
  for (const d of drift) {
    console.error(`  ${d.theme}: ${d.fg} on ${d.bg} — DESIGN.md says ${d.claimed.toFixed(1)}:1, measured ${d.measured.toFixed(2)}:1`);
  }
  console.error('\nEither the colour changed or the published number was wrong. Fix one of them.\n');
}

if (failures.length > 0) {
  console.error(`check-contrast: ${failures.length} pair(s) below the WCAG 2.2 AA minimum for their role\n`);
  for (const f of failures) console.error(`  ${f}`);
  console.error('');
}

// Ratios measured is not the same as ratios measured. An emptied PAIRS array reports
// fewer pairs and every one of them passing.
if (rows.length !== EXPECTED_PAIRS) {
  failures.push(
    `measured ${rows.length} DESIGN.md pairs, expected ${EXPECTED_PAIRS}. A published figure ` +
      'left the tables without leaving this gate.',
  );
  console.error(`check-contrast: ${failures[failures.length - 1]}\n`);
}

/* ---------------------------------------------------------------------------------
 * The permission matrix. Every foreground token against every surface, in every theme.
 * ------------------------------------------------------------------------------- */

/** Strongest role a measured ratio can carry. */
const roleFor = (r) => (r >= MIN.text ? 'body' : r >= MIN.ui ? 'ui' : 'decor');
const RANK = { decor: 0, ui: 1, large: 1, body: 2 };

const matrix = [];
const matrixProblems = [];

for (const theme of THEMES) {
  const t = tokens(theme);

  for (const [token, use] of Object.entries(USE)) {
    // Master alone carries the division accents; the other themes must not declare them,
    // which check-tokens enforces. Absent here means "not part of this theme", not "skip".
    if (!t[token]) {
      if (theme === 'master' || !token.startsWith('--accent-')) {
        matrixProblems.push(`${theme}: ${token} is in the permission matrix but not defined in the theme`);
      }
      continue;
    }

    for (const surface of SURFACES) {
      const measured = ratio(t[token], t[surface]);
      const permitted = roleFor(measured);
      const claimed = use.except?.[surface] ? use.except[surface].split(' ')[0] : use.role;

      matrix.push({ theme, token, surface, measured, claimed, permitted });

      if (RANK[claimed] > RANK[permitted]) {
        matrixProblems.push(
          `${theme}: ${token} on ${surface} = ${measured.toFixed(2)}:1 — claimed "${ROLE_OF[claimed]}", ` +
            `measurement only supports "${ROLE_OF[permitted]}"`,
        );
      }
    }
  }

  for (const [token, use] of Object.entries(ON_ACCENT)) {
    for (const over of use.over) {
      const measured = ratio(t[token], t[over]);
      const permitted = roleFor(measured);
      matrix.push({ theme, token, surface: over, measured, claimed: use.role, permitted });
      if (RANK[use.role] > RANK[permitted]) {
        matrixProblems.push(
          `${theme}: ${token} on ${over} = ${measured.toFixed(2)}:1 — claimed "${ROLE_OF[use.role]}", ` +
            `measurement only supports "${ROLE_OF[permitted]}"`,
        );
      }
    }
  }
}

// A matrix that measured nothing is not a matrix that passed.
if (matrix.length !== EXPECTED_CELLS) {
  matrixProblems.push(
    `matrix evaluated ${matrix.length} cells, expected ${EXPECTED_CELLS}. Something was skipped.`,
  );
}

const worstBorder = Math.min(
  ...matrix.filter((m) => m.token === CONTROL_BORDER).map((m) => m.measured),
);
if (worstBorder < MIN.ui) {
  matrixProblems.push(
    `${CONTROL_BORDER} measures ${worstBorder.toFixed(2)}:1 at worst — FOUNDATION §3 nominates it for ` +
      `every border that identifies a control, which needs ${MIN.ui}:1`,
  );
}

if (matrixProblems.length > 0) {
  console.error(`check-contrast: ${matrixProblems.length} permission-matrix problem(s)\n`);
  for (const p of matrixProblems) console.error(`  ${p}`);
  console.error(
    '\nEither change the value, or record the restriction in USE.except with its reason.' +
      '\nA token may not carry a job its measurement does not support.\n',
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
 * Pass 3 — the size pass. Does every declaration OBEY the matrix?
 *
 * Passes 1 and 2 measure token-on-surface pairs. Neither can see the *size* of the
 * text a declaration paints, and WCAG's body floor is a function of size: 4.5:1 under
 * 18.66px bold / 24px regular, 3:1 at or above it. So a token measured and permitted as
 * "body text" can still be used at a size its measurement does not support, and the
 * matrix stays green — A11Y-22, recorded and unenforced until now.
 *
 * That gap shipped. `.specimenName` on /_kitchen-sink set `color: var(--ink-subtle)` at
 * `--text-xs` (12.06px), rendered 23x inside the press frame, against a press DESIGN.md
 * rule reading "17px minimum, never below". Every gate was green. The rule was prose,
 * and prose is not a gate.
 *
 * **What this pass can and cannot see.** It reads *declared* sizes, not rendered ones:
 * a rule block that sets both `color` and `font-size` is measured, in every theme, on
 * every surface the token is permitted on. It therefore cannot catch a colour and a size
 * that arrive from two different rules on the same element — that needs a browser, and
 * this gate runs in `verify:static`, before the build, so it has no served page to read.
 * The rendered version belongs in the served tier alongside `check-axe`. This pass is
 * the cheap 90%, and the limit is stated here rather than left for someone to discover.
 */
const SIZE_SOURCES = [
  'styles/globals.css',
  ...globSync('components/primitives/*.module.css'),
  ...globSync('app/**/*.module.css'),
];

/** `--text-*` resolved to the SMALLEST px a clamp() can produce — the worst case. */
const TEXT_PX = Object.fromEntries(
  [...readFileSync('styles/tokens.css', 'utf8').matchAll(
    /(--text-[a-z0-9]+):\s*clamp\(\s*([\d.]+)rem/g,
  )].map((m) => [m[1], parseFloat(m[2]) * 16]),
);

/** WCAG 2.2 1.4.3: "large" is >=24px, or >=18.66px when bold (>=700). */
const isLarge = (px, weight) => px >= 24 || (px >= 18.66 && weight >= 700);

const sizeProblems = [];
let declarationsMeasured = 0;

for (const file of SIZE_SOURCES) {
  const css = readFileSync(file, 'utf8');
  // Rule blocks: everything between `{` and the next `}`. Nested at-rules are flat here
  // because these files use no nesting beyond @media, whose inner blocks match the same way.
  for (const block of css.matchAll(/\{([^{}]*)\}/g)) {
    const body = block[1];
    const colour = body.match(/(?:^|[;\s])color:\s*var\((--[a-z0-9-]+)\)/);
    const size = body.match(/font-size:\s*var\((--text-[a-z0-9]+)\)/);
    if (!colour || !size) continue;

    const token = colour[1];
    const use = USE[token];
    if (!use || use.role === 'decor') continue; // decorative text is not a thing; skip non-foregrounds
    const px = TEXT_PX[size[1]];
    if (px === undefined) continue;

    const weightMatch = body.match(/font-weight:\s*(\d+)/);
    const weight = weightMatch ? Number(weightMatch[1]) : 400;
    const needed = isLarge(px, weight) ? MIN.large : MIN.text;

    for (const theme of THEMES) {
      const t = tokens(theme);
      if (!t[token]) continue;
      for (const surface of SURFACES) {
        if (!t[surface]) continue;
        declarationsMeasured += 1;
        const r = ratio(t[token], t[surface]);

        // A `USE.except` entry is the matrix recording that this token may NOT carry text
        // on this surface. A declaration painting text with a restricted token is a
        // violation even when the matrix is green, because the matrix granted the
        // downgrade and the stylesheet ignored it. That is the half of A11Y-22 the matrix
        // cannot see.
        //
        // Skipping restricted surfaces here instead would make this whole pass incapable
        // of failing: every non-restricted body token already clears 4.5:1 by the matrix,
        // so there would be nothing left for it to catch. That was the shipped-and-caught
        // seventh instance of the gate class — A11Y-29.
        //
        // **This branch currently has no subject: USE carries no `except` entry at all
        // since A11Y-22 was closed by re-deriving the tokens.** That is deliberate and is
        // not the "gate with no subject" failure CLAUDE.md names, because the branch's
        // subject is conditional on a restriction existing — no restriction, nothing to
        // enforce. It is here so that the moment someone adds an `except` back, the
        // stylesheets are held to it. Do not delete it as dead code; deleting it is how
        // A11Y-22 comes back.
        if (use.except?.[surface] && r + TOLERANCE < needed) {
          sizeProblems.push(
            `${file} — ${token} paints text at ${size[1]} (${px.toFixed(2)}px, weight ${weight}) ` +
              `on ${surface} in ${theme}: ${r.toFixed(2)}:1, needs ${needed}:1. ` +
              `The matrix restricts this token here: ${use.except[surface]}`,
          );
          continue;
        }
        if (!use.except?.[surface] && r + TOLERANCE < needed) {
          sizeProblems.push(
            `${file} — ${token} at ${size[1]} (${px.toFixed(2)}px, weight ${weight}) on ` +
              `${surface} in ${theme}: ${r.toFixed(2)}:1, needs ${needed}:1`,
          );
        }
      }
    }
  }
}

// A pass that measured nothing is not a pass. If the primitives stop pairing colour and
// size in one rule, this must say so rather than print a green line over an empty loop.
if (declarationsMeasured === 0) {
  sizeProblems.push(
    'the size pass measured 0 declarations. Either no stylesheet pairs `color: var(--token)` ' +
      'with `font-size: var(--text-*)` any more, or SIZE_SOURCES no longer resolves. ' +
      'Both mean this pass is measuring nothing — fix it or delete it deliberately.',
  );
}

if (sizeProblems.length > 0) {
  console.error(`\ncheck-contrast: ${sizeProblems.length} size/contrast problem(s)\n`);
  for (const p of sizeProblems) console.error(`  ${p}`);
  console.error(
    '\nWCAG 1.4.3 needs 4.5:1 below 24px (18.66px bold) and 3:1 at or above it.' +
      '\nRaise the size, darken the token, or use a token whose measurement supports the size.\n',
  );
}

if (failures.length > 0 || drift.length > 0 || matrixProblems.length > 0 || sizeProblems.length > 0) {
  process.exit(1);
}

console.log(`check-contrast: ${rows.length} pairs across ${THEMES.length} themes, all within role minima and matching DESIGN.md`);
console.log(
  `check-contrast: size pass — ${declarationsMeasured} declaration/surface combinations across ` +
    `${THEMES.length} themes, every declared font-size checked against its token's measured ratio`,
);
console.log(
  `check-contrast: permission matrix — ${matrix.length} token/surface combinations across ` +
    `${THEMES.length} themes, every one measured, every claimed role supported`,
);
for (const [token, use] of Object.entries(USE)) {
  const cells = matrix.filter((m) => m.token === token);
  if (cells.length === 0) continue;
  const worst = Math.min(...cells.map((c) => c.measured));
  const note = use.except ? `  (restricted on ${Object.keys(use.except).join(', ')})` : '';
  console.log(`    ${token.padEnd(17)} ${ROLE_OF[use.role].padEnd(22)} worst ${worst.toFixed(2)}:1${note}`);
}
console.log('');
