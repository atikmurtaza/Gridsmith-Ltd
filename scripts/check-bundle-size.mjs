#!/usr/bin/env node
/**
 * check-bundle-size
 *
 * CLAUDE.md §Performance budgets · master/PROJECT-RULES.md §8 · FOUNDATION §2
 *
 * Budgets are on JS added ABOVE the framework floor, not on the total.
 *
 * The floor is a constant we do not control — it is whatever an empty App Router page
 * costs. Budgeting on the total means a framework upgrade silently eats the allowance
 * that features were supposed to have, and the first symptom is a feature getting cut
 * for a reason that has nothing to do with the feature. Budgeting on the delta keeps
 * the two separable: the floor is reported as its own number, and a dependency upgrade
 * shows up as the floor moving rather than as everyone's budget shrinking.
 *
 * Measured per route as the gzipped bytes of the scripts a modern browser downloads —
 * `noModule` legacy polyfills excluded, since no modern browser fetches them.
 */
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, relative, posix, sep } from 'node:path';
import { gzipSync } from 'node:zlib';

const KB = 1024;

/**
 * Framework floor, gzipped KB. Measured at A-01 against Next 15.5.23 + React 19 on an
 * empty App Router page rendering a single element.
 *
 * To re-baseline: scaffold a bare Next app at the new version with the same layout and
 * page, build it, and sum the gzipped module scripts of `/`. Changing this number is a
 * deliberate act and belongs in its own commit with the measurement in the message.
 */
const FLOOR_KB = 100.2;

/** How far below the floor a route may measure before the floor is treated as stale. */
const FLOOR_TOLERANCE_KB = 1.0;

/**
 * Route prefix -> delta budget in KB gz. Longest matching prefix wins, so a specific
 * route overrides its group.
 */
const BUDGETS = [
  ['/design/estimate', 40],
  ['/digital/estimate', 40],
  ['/press/path-finder', 40],
  ['/design', 25],
  ['/press', 20],
  ['/digital', 15],
  ['/', 15],
];

const APP_DIR = '.next/server/app';

if (!existsSync(APP_DIR)) {
  console.error('check-bundle-size: no build found. Run `npm run build` first.');
  process.exit(1);
}

const toPosix = (p) => p.split(sep).join(posix.sep);

/** Every prerendered route HTML, mapped back to its URL path. */
function routes() {
  const out = [];
  for (const entry of readdirSync(APP_DIR, { recursive: true, withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith('.html')) continue;
    const file = join(entry.parentPath ?? APP_DIR, entry.name);
    const rel = toPosix(relative(APP_DIR, file)).replace(/\.html$/, '');
    // Internal Next templates, not real routes.
    if (rel.startsWith('_')) continue;
    out.push({ url: '/' + (rel === 'index' ? '' : rel), file });
  }
  return out.sort((a, b) => a.url.localeCompare(b.url));
}

function budgetFor(url) {
  const match = BUDGETS.filter(
    ([prefix]) => url === prefix || url.startsWith(prefix === '/' ? '/' : prefix + '/'),
  ).sort((a, b) => b[0].length - a[0].length)[0];
  return match ? match[1] : null;
}

/** Scripts without `noModule` — what a modern browser downloads. */
function moduleScripts(html) {
  return [...html.matchAll(/<script\b([^>]*)\bsrc="([^"]+)"([^>]*)>/g)]
    .filter((m) => !/\bnomodule\b/i.test(m[1] + m[3]))
    .map((m) => m[2])
    .filter((src) => src.startsWith('/_next/'));
}

const rows = [];

for (const { url, file } of routes()) {
  const budget = budgetFor(url);
  if (budget === null) continue;

  const html = readFileSync(file, 'utf8');
  let bytes = 0;
  for (const src of moduleScripts(html)) {
    const onDisk = join('.next', src.replace('/_next/', ''));
    if (!existsSync(onDisk)) continue;
    bytes += gzipSync(readFileSync(onDisk), { level: 9 }).length;
  }

  const total = bytes / KB;
  rows.push({ url, total, delta: total - FLOOR_KB, budget });
}

// Measuring nothing is not the same as passing. A build that emits no budgeted route
// means the glob, the build or the budget table is wrong — fail loudly rather than
// report a green gate that checked nothing.
if (rows.length === 0) {
  console.error('\ncheck-bundle-size: no budgeted routes found in the build. Nothing was measured.\n');
  process.exit(1);
}

const w = Math.max(...rows.map((r) => r.url.length), 5);
const n = (v) => (v < 0 ? '-' : '') + Math.abs(v).toFixed(1);

console.log(`\nframework floor  ${FLOOR_KB.toFixed(1)}KB gz  (declared; Next 15 + React 19, measured at A-01)\n`);
console.log('route'.padEnd(w + 2) + '    total     delta    budget');

const over = [];
for (const r of rows) {
  const bad = r.delta > r.budget;
  if (bad) over.push(r);
  console.log(
    `${r.url.padEnd(w + 2)}${n(r.total).padStart(8)}KB${n(r.delta).padStart(9)}KB${String(r.budget).padStart(8)}KB  ${bad ? 'OVER' : 'ok'}`,
  );
}

// A route measuring below the declared floor means the floor itself moved down — the
// constant is stale and every delta above is overstated.
const stale = rows.filter((r) => r.total < FLOOR_KB - FLOOR_TOLERANCE_KB);
if (stale.length > 0) {
  console.error(
    `\ncheck-bundle-size: ${stale.length} route(s) measured below the declared floor of ${FLOOR_KB}KB.` +
      '\nThe framework got smaller. Re-measure and update FLOOR_KB — do not leave it overstated.\n',
  );
  process.exit(1);
}

if (over.length > 0) {
  console.error(`\ncheck-bundle-size: ${over.length} route(s) over their delta budget.`);
  if (over.length === rows.length && rows.length > 1) {
    console.error(
      'Every route failed. That usually means the framework floor moved up, not that every\n' +
        'feature grew at once — re-measure the floor and update FLOOR_KB in its own commit.',
    );
  }
  console.error(
    '\nOtherwise the feature changes or is cut. The budget does not move\n' +
      '(CLAUDE.md non-negotiable #8).\n',
  );
  process.exit(1);
}

console.log('\ncheck-bundle-size: all routes within their delta budget\n');
