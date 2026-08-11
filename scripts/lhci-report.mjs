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
console.log(
  'Budgets in lighthouse/routes.cjs are PROVISIONAL — Q-M16. These are the CI numbers they get set from.\n',
);
