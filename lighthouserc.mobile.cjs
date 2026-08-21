/**
 * Lighthouse CI — mobile, 4G. A-10b, axis two of two.
 *
 * **This is the engineering gate.** FOUNDATION §8 launch gate 2 specifies 4G throttling,
 * and mobile carries most of the traffic at roughly half the conversion rate. The desktop
 * axis says the craft claim is honest; this one says the experience holds up on the device
 * most people will actually use.
 *
 * **The performance category score is deliberately not asserted here.** It is a weighted
 * curve whose control points move between Lighthouse versions, so pinning it fails builds
 * for reasons no user ever experiences — a dependency bump re-scoring the same page is not
 * a regression. The Core Web Vitals are asserted directly instead: they are the quantities
 * the specs actually name, they are stable across Lighthouse versions, and a failure in one
 * of them points at a specific thing to fix rather than at a number that moved.
 *
 * **`throttlingMethod: 'devtools'`, not the default `'simulate'` — this is load-bearing.**
 *
 * Lantern (simulate) builds a dependency graph and estimates LCP as gated on the resources
 * the LCP element depends on. For text whose webfont is `font-display: swap`, it attributes
 * the font fetch to the text node and adds it to the estimate, even though swap means the
 * text has already painted in the fallback face. Measured on `/digital`, median of 3, same
 * 4G profile:
 *
 *   simulate   FCP 1363ms   LCP 1896ms   gap 533ms   performance 0.99
 *   devtools   FCP 1441ms   LCP 1441ms   gap   0ms   performance 1.00
 *
 * The 533ms gap does not exist. Real Chrome paints the h1 once and never re-reports,
 * because next/font's fallback metrics (`size-adjust`, `ascent-override`) make the fallback
 * paint the final layout — which is also why CLS is 0. Asserting against the simulated
 * number would have the gate failing the build for a delay no visitor experiences, and the
 * "fix" would be optimising a measurement artefact.
 *
 * The cost is variance: devtools throttling is sensitive to machine load, which is what the
 * median of three is for. If CI proves too noisy, the answer is more runs, not a return to
 * a model that mis-attributes swap.
 *
 * See Q-M16. The ceilings in lighthouse/routes.cjs are **measured, not provisional** — CI
 * run #7, median of 3, 1519–1530ms across the four routes. This file said the opposite
 * while routes.cjs, FOUNDATION §8 and the tracker all said measured, and this is the file
 * that *is* the gate; a reader checking whether a number could be trusted found the gate
 * itself disowning it. What is still open is durability, not the figure: the headroom is
 * measured on an empty page. See the note in lighthouse/routes.cjs.
 */
const { ORIGIN_MOBILE: ORIGIN, ROUTES, pattern } = require('./lighthouse/routes.cjs');

/** Moto G Power on 4G — stated explicitly rather than inherited from a preset name. */
const throttling = {
  rttMs: 150,
  throughputKbps: 1638.4,
  requestLatencyMs: 150 * 4,
  downloadThroughputKbps: 1638.4 * 0.9,
  uploadThroughputKbps: 675,
  cpuSlowdownMultiplier: 4,
};

module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npm run start -- -p 3201',
      startServerReadyPattern: 'Ready in|started server',
      url: ROUTES.map((r) => ORIGIN + r.path),
      numberOfRuns: 3,
      settings: {
        formFactor: 'mobile',
        screenEmulation: { mobile: true, width: 412, height: 823, deviceScaleFactor: 1.75, disabled: false },
        throttlingMethod: 'devtools',
        throttling,
        chromeFlags: '--no-sandbox --headless=new',
      },
    },
    assert: {
      assertMatrix: ROUTES.map((r) => ({
        matchingUrlPattern: pattern(ORIGIN, r.path),
        aggregationMethod: 'median',
        assertions: {
          // The page has to have loaded before any number below means anything. See the
          // note on the same assertion in lighthouserc.desktop.cjs.
          'http-status-code': ['error', { minScore: 1 }],

          // Accessibility is not a weighted curve — it is a pass/fail rule count, and it
          // is non-negotiable #10. It is asserted on both axes.
          'categories:accessibility': ['error', { minScore: 1 }],

          'largest-contentful-paint': ['error', { maxNumericValue: r.lcp }],
          'cumulative-layout-shift': ['error', { maxNumericValue: r.cls }],

          // TBT stands in for INP, which is a FIELD metric: a Lighthouse navigation run
          // does not produce one and no CI gate can. Each route's TBT ceiling is its own
          // INP budget from CLAUDE.md. Real INP comes from field data once there is
          // traffic — see 01-VALIDATION-REPORT §11.
          'total-blocking-time': ['error', { maxNumericValue: r.tbt }],
        },
      })),
    },
    upload: { target: 'filesystem', outputDir: '.lighthouseci/mobile' },
  },
};
