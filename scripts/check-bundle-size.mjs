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
  // ~5.7KB; 7KB is the ceiling that arithmetic actually requires. It was previously
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
const REQUIRED = ['/', '/design', '/digital', '/press', '/_kitchen-sink', '/_not-found'];

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

/**
 * `/_not-found` used to be exempted here by name, and that exemption was the ONLY mention
 * of the route anywhere in the repository — it is absent from check-axe, check-responsive
 * and lighthouse/routes.cjs. So the single gate that could see the 404 was told to skip
 * it, and no other gate knew it existed. `M-07` puts real content there and `M-04`/`L-05`
 * put the statutory company disclosure on every page, which is a legal requirement, not a
 * footer decoration. The exemption was written for an empty Next template and would have
 * silently inherited all of it.
 *
 * It now takes the master budget by prefix like any other route in that group, and it is
 * in the route lists of check-axe and check-responsive too.
 *
 * **Not in `lighthouse/routes.cjs`, and that is a decision rather than an omission.** Both
 * axes assert `http-status-code` at minScore 1, which a 404 fails by definition — adding
 * the route would make the gate red for the route behaving correctly. Lighthouse measures
 * the experience of pages people navigate to; axe, the responsive sweep and this file
 * cover the 404's conformance and its cost. `/_kitchen-sink` is absent from that file for
 * a different reason: A-12 removes it from the production build entirely.
 */
console.log(`\nframework floor  ${FLOOR_KB.toFixed(1)}KB gz  (declared; Next 15 + React 19, measured at A-01)\n`);
console.log('route'.padEnd(w + 2) + '    total     delta    budget');

const over = [];
for (const r of rows) {
  if (r.budget === null) {
    console.log(
      `${r.url.padEnd(w + 2)}${n(r.total).padStart(8)}KB${n(r.delta).padStart(9)}KB${'—'.padStart(8)}    not budgeted — no budget matches this prefix`,
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

/**
 * And the same test upward. Downward drift was caught at ±1KB; upward drift was caught
 * only as *every route failing its budget at once* — which needs the growth to exceed the
 * smallest budget first, and until it does, nothing says anything.
 *
 * The cheapest route in the build is the empirical floor. When it sits more than a
 * kilobyte above the declared one, every route is carrying something none of them
 * declared, and every delta printed above is understated by that amount.
 *
 * **It does not diagnose the cause, because it cannot.** Two different things produce the
 * identical measurement — the framework got bigger, or something now ships on every
 * route — and telling them apart needs a person. Both need a decision, which is why this
 * fails rather than warns. Earned its place immediately: a root `not-found.tsx` importing
 * the Link primitive put 4.3KB gz on all six routes, and since 4.3 is inside every budget
 * in the table, nothing else in this file would have said a word.
 *
 * **Its relationship to the shared-baseline assertion below — read both before changing
 * either.** They measure the same quantity and answer different questions:
 *
 *   this check          "every route is carrying something no route declared" — cause
 *                       unknown, could be the framework or could be us, needs a person
 *   shared baseline     "the cost every route pays has outgrown what `M-06` budgets for
 *                       it" — cause known to be ours, and it is 0.5KB of Master's 0.8KB
 *                       of remaining headroom
 *
 * Because `cheapest = FLOOR_KB + shared`, this check's predicate is exactly
 * `shared > FLOOR_TOLERANCE_KB`. The two are therefore only distinct while their
 * thresholds are — set them equal and the one below becomes unreachable code, which is
 * what shipped at `G8` and was found at `A-GATE-4-3`. This note lived only in commit
 * `417e2661`'s body, where it read as reassurance rather than as the defect it described.
 */
const cheapest = Math.min(...rows.map((r) => r.total));
if (cheapest > FLOOR_KB + FLOOR_TOLERANCE_KB) {
  console.error(
    `\ncheck-bundle-size: the cheapest route in the build measures ${cheapest.toFixed(1)}KB, ` +
      `against a declared floor of ${FLOOR_KB}KB.` +
      '\n\nEvery route is carrying something that no route declared. Either:' +
      '\n  - the framework floor moved — re-measure it and update FLOOR_KB in its own commit' +
      '\n    with the measurement in the message; or' +
      '\n  - something now ships on every route (a root boundary, a shared layout import).' +
      '\n    Find it and decide whether every route should pay for it.' +
      "\n\nDo not absorb it into the features' deltas. Budgets are on the delta precisely so" +
      '\nthat a shared cost cannot quietly eat the allowance features were given.\n',
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

/**
 * The delta decomposition — `M-06`'s headroom depends on it and nothing measured it.
 *
 * `/_kitchen-sink`'s 6.2KB delta is two different costs added together, and only the sum
 * was ever measured. The docs split it as "5.8KB primitives + 0.4KB global-error
 * boundary" and no gate produced either number. `M-06` then budgets on that split —
 * consent 8KB + primitives + boundary against Master's 15KB — so the checkpoint that
 * decides whether Epic M can proceed rested on an arithmetic nobody could re-derive.
 * CLAUDE.md: an asserted number no gate covers is unverified.
 *
 * Both halves are already in the table above; they just were not read out of it.
 *
 *   The **shared baseline** is what a route with no features of its own still pays. The
 *   four placeholder pages and the 404 render one `h1` and nothing else, so their delta is
 *   the cost every route carries — today that is the `global-error` boundary, which Next
 *   puts in every route's client bundle. Taking the minimum across them means one route
 *   growing its own JS cannot inflate the figure.
 *
 *   The **primitive layer** is then the kitchen sink's delta minus that baseline.
 *
 * Both are asserted, not just printed. A number that is only printed is a number nobody
 * notices moving.
 *
 * **This runs after the floor check above, and the two are not interchangeable.** The
 * floor check asks whether every route is carrying something undeclared, without
 * diagnosing what; this asks whether the shared cost has outgrown the specific budget
 * `M-06` depends on. See the note on `SHARED_BASELINE_BUDGET_KB` for why its threshold
 * must stay strictly below `FLOOR_TOLERANCE_KB` — equal thresholds make this block
 * unreachable, since the floor check exits first.
 */
const BASELINE_ROUTES = ['/', '/design', '/digital', '/press', '/_not-found'];

/**
 * **This budget must stay strictly below `FLOOR_TOLERANCE_KB`, and that is the whole point
 * of the number.**
 *
 * The baseline routes are the cheapest rows in the build, so `cheapest = FLOOR_KB + shared`.
 * The floor check above fires when `cheapest > FLOOR_KB + FLOOR_TOLERANCE_KB` — which is
 * exactly `shared > FLOOR_TOLERANCE_KB`. Set this budget to the same 1.0 and the two
 * predicates are *identical*, the floor check `process.exit(1)`s ~70 lines earlier, and this
 * assertion becomes unreachable code that can never report anything. It shipped that way at
 * `G8` and was found at A-GATE run 4 (`A-GATE-4-3`).
 *
 * At 0.7 there is a real window — `0.7 < shared <= 1.0` — in which this fires and the floor
 * check does not. That window is what makes it an independent assertion rather than a
 * restatement, and it is what the deliberate-failure proof has to land in: a proof that
 * pushes `shared` past 1.0 is being satisfied by the floor check, not by this.
 *
 * Measured today: 0.5KB. The 0.2KB of headroom is deliberately tight — this is the cost
 * every route pays and cannot attribute to any feature.
 */
const SHARED_BASELINE_BUDGET_KB = 0.7;
const PRIMITIVES_BUDGET_KB = 6.0;

const baselineRows = rows.filter((r) => BASELINE_ROUTES.includes(r.url));
const kitchen = rows.find((r) => r.url === '/_kitchen-sink');

const decomposition = [];
if (baselineRows.length !== BASELINE_ROUTES.length) {
  decomposition.push(
    `expected ${BASELINE_ROUTES.length} baseline routes, measured ${baselineRows.length}. ` +
      'The shared-cost figure would be derived from a partial set — measured nothing usable.',
  );
} else if (!kitchen) {
  decomposition.push('/_kitchen-sink is absent, so the primitive-layer delta cannot be derived.');
} else {
  const shared = Math.min(...baselineRows.map((r) => r.delta));
  const primitives = kitchen.delta - shared;

  console.log('\ndelta decomposition — M-06 budgets on these, so they are asserted, not just printed\n');
  console.log(`  shared baseline    ${shared.toFixed(1)}KB gz   every route pays this (global-error boundary)`);
  console.log(`  primitive layer    ${primitives.toFixed(1)}KB gz   /_kitchen-sink delta minus the baseline`);
  console.log(`  consent banner     8.0KB gz   reserved, not yet built — PROJECT-RULES §8`);
  console.log(
    `  M-06 projection    ${(shared + primitives + 8).toFixed(1)}KB of Master's 15KB ` +
      `— ${(15 - shared - primitives - 8).toFixed(1)}KB headroom before header and footer exist`,
  );

  if (shared > SHARED_BASELINE_BUDGET_KB) {
    decomposition.push(
      `shared baseline is ${shared.toFixed(1)}KB, over its ${SHARED_BASELINE_BUDGET_KB}KB budget. ` +
        'Something new ships on every route. This is the cost that cannot be attributed to any ' +
        'feature, so it comes straight out of every budget at once.',
    );
  }
  if (primitives > PRIMITIVES_BUDGET_KB) {
    decomposition.push(
      `primitive layer is ${primitives.toFixed(1)}KB, over its ${PRIMITIVES_BUDGET_KB}KB budget. ` +
        'Every route group pays this, so it is the most expensive kilobyte in the programme.',
    );
  }
}

if (decomposition.length > 0) {
  console.error(`\ncheck-bundle-size: ${decomposition.length} delta-decomposition problem(s)\n`);
  for (const d of decomposition) console.error(`  ${d}`);
  console.error(
    '\nM-06 is the checkpoint these feed. If the projection exceeds 15KB, stop and raise it\n' +
      'rather than proceeding into Epic N (CLAUDE.md non-negotiable #8, 05-HANDOVER §6).\n',
  );
  process.exit(1);
}

console.log('\ncheck-bundle-size: all routes within their delta budget\n');
