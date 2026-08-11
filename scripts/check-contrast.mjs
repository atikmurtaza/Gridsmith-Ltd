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
import { readFileSync } from 'node:fs';

const THEMES = ['master', 'design', 'digital', 'press'];
const TOLERANCE = 0.02; // DESIGN.md now carries measured values to 2dp

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
    ['--ink-subtle', '--canvas', 'text', 4.83],
    ['--accent-ink', '--accent', 'text', 19.17],
    ['--accent-design', '--canvas', 'decor', 2.16],
    ['--accent-digital', '--canvas', 'text', 5.09],
    ['--accent-press', '--canvas', 'text', 9.74],
    ['--line-strong', '--canvas', 'decor', 1.74],
  ],
  design: [
    ['--ink', '--canvas', 'text', 17.92],
    ['--ink-muted', '--canvas', 'text', 7.56],
    ['--ink-subtle', '--canvas', 'text', 5.01],
    ['--accent', '--canvas', 'text', 9.07],
    ['--accent', '--canvas-raised', 'text', 8.46],
    ['--accent-ink', '--accent', 'text', 9.07],
    ['--line-strong', '--canvas', 'decor', 1.72],
  ],
  digital: [
    ['--ink', '--canvas', 'text', 18.96],
    ['--ink-muted', '--canvas', 'text', 7.40],
    ['--ink-subtle', '--canvas', 'text', 4.63],
    ['--accent', '--canvas', 'text', 4.87],
    ['--accent', '--canvas-raised', 'text', 5.09],
    ['--accent-ink', '--accent', 'text', 5.09],
    ['--line-strong', '--canvas', 'decor', 1.59],
  ],
  press: [
    ['--ink', '--canvas', 'text', 16.84],
    ['--ink-muted', '--canvas', 'text', 7.25],
    ['--ink-subtle', '--canvas', 'text', 4.56],
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
  '--ink-subtle': {
    role: 'body',
    except: {
      '--canvas-sunken':
        'ui — measures 4.18–4.43:1 on sunken across the four themes, short of the 4.5:1 body floor. ' +
        'It stays the nominated control-border token there (>=3:1). States use --ink-muted for text on sunken.',
    },
  },
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
const EXPECTED_CELLS =
  THEMES.length * (Object.keys(USE).length - 3) * SURFACES.length + // shared tokens
  1 * 3 * SURFACES.length + // master's three division accents
  THEMES.length * 2; // --accent-ink over --accent and --accent-hover

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

if (failures.length > 0 || drift.length > 0 || matrixProblems.length > 0) {
  process.exit(1);
}

console.log(`check-contrast: ${rows.length} pairs across ${THEMES.length} themes, all within role minima and matching DESIGN.md`);
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
