#!/usr/bin/env node
/**
 * lhci-report
 *
 * Prints the median Lighthouse numbers for an axis.
 *
 * `lhci autorun` prints assertion output only when an assertion FAILS. A passing run says
 * "All results processed!" and nothing else, so a green CI log contains no measurements at
 * all — and the numbers that set the Stage 3 LCP budgets have to come from CI hardware,
 * not a developer's laptop. Without this the only way to read them is to download an
 * artifact and open a JSON file.
 *
 * Runs with `if: always()` so the numbers are printed whether the axis passed or failed;
 * a failing run is exactly when the surrounding figures matter most.
 *
 * Usage: node scripts/lhci-report.mjs <desktop|mobile>
 */
import { existsSync, readFileSync } from 'node:fs';

const axis = process.argv[2];
if (!axis) {
  console.error('lhci-report: name the axis — desktop or mobile.');
  process.exit(1);
}

const manifestPath = `.lighthouseci/${axis}/manifest.json`;
if (!existsSync(manifestPath)) {
  console.error(`lhci-report: ${manifestPath} not found. The ${axis} axis produced no reports.`);
  process.exit(1);
}

const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
if (manifest.length === 0) {
  console.error(`lhci-report: ${manifestPath} is empty. Nothing was measured.`);
  process.exit(1);
}

const byUrl = new Map();
for (const entry of manifest) {
  if (!byUrl.has(entry.url)) byUrl.set(entry.url, []);
  byUrl.get(entry.url).push(entry);
}

const median = (values) => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];

console.log(`\n=== Lighthouse ${axis.toUpperCase()} — median of ${manifest.length / byUrl.size} runs ===\n`);
console.log(
  'route'.padEnd(14) + 'perf   a11y   bp     seo    LCP       CLS      TBT      FCP',
);

for (const [url, entries] of byUrl) {
  const reports = entries.map((e) => JSON.parse(readFileSync(e.jsonPath, 'utf8')));
  const metric = (id) => median(reports.map((r) => r.audits[id].numericValue));
  const score = (id) => median(reports.map((r) => r.categories[id].score));
  const ms = (v) => `${v.toFixed(0)}ms`;

  console.log(
    new URL(url).pathname.padEnd(14) +
      String(score('performance')).padEnd(7) +
      String(score('accessibility')).padEnd(7) +
      String(score('best-practices')).padEnd(7) +
      String(score('seo')).padEnd(7) +
      ms(metric('largest-contentful-paint')).padStart(7) + '  ' +
      metric('cumulative-layout-shift').toFixed(3).padStart(5) + '  ' +
      ms(metric('total-blocking-time')).padStart(7) + '  ' +
      ms(metric('first-contentful-paint')).padStart(7),
  );
}

const first = JSON.parse(readFileSync(manifest[0].jsonPath, 'utf8'));
const t = first.configSettings.throttling;
console.log(
  `\nform factor ${first.configSettings.formFactor} · throttlingMethod ${first.configSettings.throttlingMethod} · ` +
    `${t.throughputKbps}kbps · ${t.rttMs}ms RTT · ${t.cpuSlowdownMultiplier}× CPU · Lighthouse ${first.lighthouseVersion}`,
);

/**
 * The environment the number came out of, printed alongside the number.
 *
 * Added after four CI runs produced mobile TBT of 83–86, 87–98, 104–107 and 81–93ms on
 * byte-identical pages. The first three looked like a monotonic trend and were reported as
 * one; the fourth returned to baseline and showed it was runner variance all along. The
 * question "did the machine change, or did the site?" could not be answered from the logs,
 * because nothing recorded the machine.
 *
 * `benchmarkIndex` is Lighthouse's own CPU benchmark of the host. Under 4× throttling TBT
 * is CPU-bound and LCP is network-bound, so a TBT move with a stable LCP should be
 * checkable against this number rather than guessed at. `hostUserAgent` carries the Chrome
 * version, which is the other thing that can move underneath a run without notice.
 */
const benchmarks = manifest.map((e) => JSON.parse(readFileSync(e.jsonPath, 'utf8')).environment.benchmarkIndex);
console.log(
  `host benchmarkIndex ${Math.round(median(benchmarks))} ` +
    `(range ${Math.round(Math.min(...benchmarks))}–${Math.round(Math.max(...benchmarks))} across ${benchmarks.length} runs) · ` +
    `${first.environment.hostUserAgent}`,
);
console.log(
  'LCP ceilings in lighthouse/routes.cjs are MEASURED (CI run #7, Node 24). TBT varies with\n' +
    'runner CPU — compare benchmarkIndex before reading a TBT change as a code change. Q-M16.\n',
);
