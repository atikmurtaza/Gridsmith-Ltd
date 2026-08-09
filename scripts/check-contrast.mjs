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

if (failures.length > 0 || drift.length > 0) process.exit(1);

console.log(`check-contrast: ${rows.length} pairs across ${THEMES.length} themes, all within role minima and matching DESIGN.md\n`);
