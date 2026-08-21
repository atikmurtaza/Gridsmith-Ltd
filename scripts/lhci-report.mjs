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

/**
 * CLS attribution, printed for any route that shifted at all.
 *
 * A CLS number says a page moved; it does not say what moved, and the assertion output
 * gives four decimal places and no nodes. `M-P2-31` was three failing routes with no
 * candidate — and the gate that measures it hard-skips on Windows, so there is no local
 * run to inspect. Lighthouse already collects `layout-shift-elements`; nothing was
 * reading it.
 *
 * Printed from the median run, not the worst, so it describes the number asserted against.
 */
for (const [url, entries] of byUrl) {
  const reports = entries.map((e) => JSON.parse(readFileSync(e.jsonPath, 'utf8')));
  const cls = reports.map((r) => r.audits['cumulative-layout-shift'].numericValue);
  const mid = reports[cls.indexOf(median(cls))];
  if (median(cls) === 0) continue;
  // Lighthouse 12 replaced `layout-shift-elements` with `layout-shifts`, whose items carry
  // `node` plus the `subItems` naming the root cause. Reading only the old id printed
  // "0 shifting element(s)" for three routes that had plainly shifted — a reporter that
  // measured nothing and said so in a plausible sentence. Both ids are read, and the id
  // that produced the items is printed so the next version rename is visible rather than silent.
  const shiftAudit = ['layout-shifts', 'layout-shift-elements'].find(
    (id) => (mid.audits[id]?.details?.items ?? []).length > 0,
  );
  const items = mid.audits[shiftAudit ?? 'layout-shifts']?.details?.items ?? [];
  console.log(
    `
${new URL(url).pathname} — CLS ${median(cls).toFixed(4)}, ${items.length} shift(s) ` +
      `from audit "${shiftAudit ?? 'none — neither layout-shifts nor layout-shift-elements had items'}":`,
  );
  if (items.length === 0) console.log('  (Lighthouse attributed the shift to no element — see the trace)');
  for (const it of items) {
    console.log(`  ${String(it.score?.toFixed?.(4) ?? it.score).padStart(8)}  ${it.node?.nodeLabel ?? '?'}`);
    console.log(`            ${(it.node?.snippet ?? '').slice(0, 150)}`);
    for (const sub of it.subItems?.items ?? []) {
      console.log(`            cause: ${sub.cause ?? sub.extra?.type ?? JSON.stringify(sub).slice(0, 120)}`);
    }
  }
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

/**
 * `M-P1-10`: the mobile axis asserts that it measured HTTP/2, and prints the straggler.
 *
 * The mobile run goes through `scripts/h2-proxy.mjs` so the protocol matches what Vercel
 * negotiates. If that proxy ever stopped serving h2 - or the config drifted back to a plain
 * `next start` - every number above would still be produced, still look reasonable, and be a
 * measurement of the wrong protocol. That is the hollow-subject shape: the gate keeps
 * reporting while its premise quietly dies. So the premise is asserted, not assumed.
 *
 * The straggler line exists because the bimodality was invisible in the median. Seven
 * render-critical requests against six HTTP/1.1 connections meant exactly one was queued per
 * run, and whether it was a stylesheet (render-blocking, ~+450ms) or a font
 * (`display: optional`, free) decided the mode - 12 times out of 12. Under h2 there is no
 * queue and the spread should collapse. Printing it means the next person can see that
 * rather than taking this docstring's word for it.
 */
if (axis === 'mobile') {
  const protocols = new Map();
  const stragglers = [];

  for (const entry of manifest) {
    const lhr = JSON.parse(readFileSync(entry.jsonPath, 'utf8'));
    const items = lhr.audits['network-requests']?.details?.items ?? [];
    for (const i of items) protocols.set(i.protocol, (protocols.get(i.protocol) ?? 0) + 1);

    const critical = items.filter((i) => i.resourceType === 'Stylesheet' || i.resourceType === 'Font');
    if (critical.length) {
      const last = critical.reduce((a, b) => (b.networkEndTime > a.networkEndTime ? b : a));
      stragglers.push({
        lcp: Math.round(lhr.audits['largest-contentful-paint'].numericValue),
        type: last.resourceType,
        nCritical: critical.length,
      });
    }
  }

  const counts = [...protocols.entries()].map(([k, v]) => `${k}x${v}`).join(' ');
  const cssLate = stragglers.filter((s) => s.type === 'Stylesheet').length;
  const lcps = stragglers.map((s) => s.lcp);
  const spread = lcps.length ? Math.max(...lcps) - Math.min(...lcps) : 0;

  console.log(
    `protocol ${counts} | render-critical ${stragglers[0]?.nCritical ?? 0} per run | ` +
      `stylesheet was last in ${cssLate}/${stragglers.length} runs | LCP spread ${spread}ms`,
  );

  const nonH2 = [...protocols.keys()].filter((k) => k !== 'h2');
  if (nonH2.length) {
    console.error(
      `\nlhci-report: the mobile axis measured ${nonH2.join(', ')}, not h2.\n` +
        'The budget is asserted against the protocol Vercel negotiates. Measuring HTTP/1.1\n' +
        'reintroduces the 6-connection limit and the bimodality of M-P1-10, and every number\n' +
        'above would be a measurement of the wrong thing. Check scripts/h2-proxy.mjs and the\n' +
        'origin in lighthouse/routes.cjs.',
    );
    process.exit(1);
  }
}
