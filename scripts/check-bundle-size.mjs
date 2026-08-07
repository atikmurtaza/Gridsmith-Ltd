#!/usr/bin/env node
/**
 * check-bundle-size
 *
 * CLAUDE.md §Performance budgets · master/PROJECT-RULES.md §8 · master/TECH-SPEC.md §7
 *
 * The budgets are per route group — "Master routes JS <=110KB gz", "/work with filters
 * <=150KB gz". This measures exactly that: for each prerendered route, the gzipped
 * bytes of the scripts a modern browser actually downloads.
 *
 * Replaces size-limit, which globs `.next/static/chunks/**` and so sums every chunk in
 * the build — including `noModule` legacy polyfills no modern browser fetches, and
 * chunks belonging to other routes. On this project that reported 172KB for a page
 * whose real cost is 100KB. A budget measured against the wrong number gets raised
 * until it passes, and a raised budget is a deleted gate.
 *
 * Budgets are matched longest-prefix-first, so a specific route overrides its group.
 */
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, relative, posix, sep } from 'node:path';
import { gzipSync } from 'node:zlib';

const KB = 1024;

/** route prefix -> budget in KB gz. Longest matching prefix wins. */
const BUDGETS = [
  ['/work', 150],
  ['/', 110],
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
  const match = BUDGETS.filter(([prefix]) => url === prefix || url.startsWith(prefix === '/' ? '/' : prefix + '/'))
    .sort((a, b) => b[0].length - a[0].length)[0];
  return match ? match[1] : null;
}

/** Scripts without `noModule` — what a modern browser downloads. */
function moduleScripts(html) {
  return [...html.matchAll(/<script\b([^>]*)\bsrc="([^"]+)"([^>]*)>/g)]
    .filter((m) => !/\bnomodule\b/i.test(m[1] + m[3]))
    .map((m) => m[2])
    .filter((src) => src.startsWith('/_next/'));
}

let failed = 0;
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

  const kb = bytes / KB;
  const over = kb > budget;
  if (over) failed++;
  rows.push({ url, kb, budget, over });
}

// Measuring nothing is not the same as passing. A build that emits no budgeted route
// means the glob, the build or the budget table is wrong — fail loudly rather than
// report a green gate that checked nothing.
if (rows.length === 0) {
  console.error('\ncheck-bundle-size: no budgeted routes found in the build. Nothing was measured.\n');
  process.exit(1);
}

const width = Math.max(...rows.map((r) => r.url.length), 5);
console.log('\nroute'.padEnd(width + 3) + 'JS (gz)   budget');
for (const r of rows) {
  const status = r.over ? 'OVER' : 'ok';
  console.log(
    `${r.url.padEnd(width + 2)} ${r.kb.toFixed(1).padStart(7)}KB ${String(r.budget).padStart(6)}KB  ${status}`,
  );
}

if (failed > 0) {
  console.error(
    `\ncheck-bundle-size: ${failed} route(s) over budget.` +
      '\nThe feature changes or is cut — the budget does not move (CLAUDE.md non-negotiable #8).\n',
  );
  process.exit(1);
}

console.log('\ncheck-bundle-size: all routes within budget\n');
