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
  // Master's 15KB, minus the 8KB the consent banner reserves (master/PROJECT-RULES.md §8).
  // FOUNDATION §5 and tracker M-06 both build arithmetic on the primitive layer costing
  // 5.6KB; 7KB is the ceiling that arithmetic actually requires. It was previously
  // reported and not enforced, which is how a load-bearing number drifts unnoticed.
  ['/_kitchen-sink', 7],
  ['/', 15],
];

/**
 * Routes that MUST appear in the build. A prefix table says what a route is allowed to
 * cost; it cannot say that a route was measured at all.
 *
 * This exists because the gate previously enumerated whatever HTML the build happened to
 * emit. One `cookies()` call in a route tree makes it dynamic, no HTML is written, the
 * route silently leaves the table, and the gate reports "all routes within their delta
 * budget" having never measured it — verified by deleting `digital.html` and watching it
 * pass. `check-theme-flash` already held a required list; this is the same pattern applied
 * to every gate that enumerates its own subjects.
 */
const REQUIRED = ['/', '/design', '/digital', '/press', '/_kitchen-sink'];

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
    out.push({ url: '/' + (rel === 'index' ? '' : rel), file });
  }
  // Codepoint order, not localeCompare: that is locale-dependent, so the route table
  // ordered differently under a different LC_ALL or an ICU-less Node build. It only moved
  // rows around, but a gate whose output depends on the machine's locale makes log diffs
  // between a laptop and a runner noisy for no reason.
  return out.sort((a, b) => (a.url < b.url ? -1 : a.url > b.url ? 1 : 0));
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
  const html = readFileSync(file, 'utf8');
  let bytes = 0;
  for (const src of moduleScripts(html)) {
    // Script URLs are percent-encoded, and a route segment that already contains a
    // percent sign is encoded twice — /_kitchen-sink lives at `%5Fkitchen-sink` on disk
    // and is referenced as `%255Fkitchen-sink` in the HTML. Decoding once resolves it.
    const onDisk = join('.next', decodeURIComponent(src.replace('/_next/', '')));

    // A referenced script that cannot be found is a measurement failure, not a zero.
    // Skipping it silently is how a route's entire page chunk escapes its budget while
    // the gate still reports green — which is exactly what happened when this route was
    // first added.
    if (!existsSync(onDisk)) {
      console.error(`\ncheck-bundle-size: ${url} references ${src}, which is not on disk.`);
      console.error('Cannot measure this route. Fix the path resolution rather than ignoring it.\n');
      process.exit(1);
    }

    bytes += gzipSync(readFileSync(onDisk), { level: 9 }).length;
  }

  const total = bytes / KB;
  rows.push({ url, total, delta: total - FLOOR_KB, budget: budgetFor(url) });
}

// Measuring nothing is not the same as passing, and measuring less than everything is
// the same failure in a quieter form.
const absent = REQUIRED.filter((url) => !rows.some((r) => r.url === url));
if (absent.length > 0) {
  console.error(`\ncheck-bundle-size: ${absent.length} required route(s) produced no prerendered HTML:\n`);
  for (const url of absent) console.error(`  ${url}`);
  console.error(
    '\nThe route is dynamic, renamed or gone. Either way it was not measured, and an\n' +
      'unmeasured route is a failure — not an absence from the table.\n',
  );
  process.exit(1);
}

const w = Math.max(...rows.map((r) => r.url.length), 5);
const n = (v) => (v < 0 ? '-' : '') + Math.abs(v).toFixed(1);

// Internal routes are reported but not budgeted. They are listed rather than filtered
// out: a route silently missing from this table reads as "within budget" when it was
// never measured, which is how /_kitchen-sink went unnoticed when it was first added.
const UNBUDGETED_NOTE = {
  '/_not-found': 'Next 404 template',
};

console.log(`\nframework floor  ${FLOOR_KB.toFixed(1)}KB gz  (declared; Next 15 + React 19, measured at A-01)\n`);
console.log('route'.padEnd(w + 2) + '    total     delta    budget');

const over = [];
for (const r of rows) {
  const note = UNBUDGETED_NOTE[r.url];
  if (r.budget === null || note) {
    console.log(
      `${r.url.padEnd(w + 2)}${n(r.total).padStart(8)}KB${n(r.delta).padStart(9)}KB${'—'.padStart(8)}    not budgeted — ${note ?? 'no budget matches this prefix'}`,
    );
    continue;
  }
  const bad = r.delta > r.budget;
  if (bad) over.push(r);
  console.log(
    `${r.url.padEnd(w + 2)}${n(r.total).padStart(8)}KB${n(r.delta).padStart(9)}KB${String(r.budget).padStart(8)}KB  ${bad ? 'OVER' : 'ok'}`,
  );
}

// A route measuring below the declared floor means the floor itself moved down — the
// constant is stale and every delta above is overstated.
const stale = rows.filter((r) => r.budget !== null && r.total < FLOOR_KB - FLOOR_TOLERANCE_KB);
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
