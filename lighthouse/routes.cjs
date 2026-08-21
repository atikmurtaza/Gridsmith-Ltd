/**
 * The one route table both Lighthouse configs read.
 *
 * `collect.url` and `assert.assertMatrix` used to be two hand-kept lists in one file: a
 * URL with no matching pattern is collected and asserted against nothing, and a URL
 * dropped from the list is simply not measured. Neither failure announces itself. Two
 * configs would have made that two ways to drift instead of one, so the table lives here
 * and both derive from it.
 *
 * `lcp` and `tbt` are the mobile ceilings from CLAUDE.md §Performance budgets.
 *
 * **`/digital`'s 1600 was never measured. It has been re-derived; the others have not.**
 *
 * 1600 entered the specs on 7 Aug 2026 in the original bundle, as `digital/TECH-SPEC.md` §5
 * still puts it: *"Stricter than the shared 2.0s"*. That is a relative choice, taken four
 * days before any Lighthouse config existed (11 Aug) and before there was an application to
 * measure. CI run #7 was later cited as confirming it, and did not: run #7 measured the
 * **empty-page floor** at ~1520ms and the ceiling was left as the projection it always was,
 * while this file said "MEASURED, not provisional" over the top of it. See M-P1-11.
 *
 * **The re-derivation — `/digital` 1600 → 1750.** Basis: 48 mobile measurements over four CI
 * runs on independent runners, all on commit 13ec197d, all over HTTP/2 (M-P1-10):
 *
 *   route      n    min    max   mean  |  medians the gate asserts   max
 *   /         12   1585   1622   1608  |  1595, 1602, 1614, 1618    1618
 *   /design   12   1587   1618   1604  |  1588, 1601, 1611, 1615    1615
 *   /digital  12   1591   1646   1608  |  1592, 1600, 1610, 1634    1634
 *   /press    12   1587   1632   1617  |  1602, 1617, 1624, 1627    1627
 *
 * The gate asserts the **median of 3**, so the statistic to bound is the median, not the
 * individual run. `/digital`'s worst observed median is **1634**. The between-run spread of
 * medians is **46ms** across all four routes.
 *
 * **1750 = 1634 + 116ms, and the 116ms is ~2.5x that observed spread.** It is a **variance
 * allowance and nothing else**: enough that ordinary runner-to-runner movement cannot fail a
 * build, small enough that the gate still fails on any regression exceeding ~115ms over
 * today's worst — which is less than the cost of a single additional render-blocking
 * stylesheet on this page. It is **not** an allowance for content. When Stage 3 lands real
 * components this must be **re-derived from a new measurement, not widened to fit**.
 *
 * **Digital remains the tightest ceiling in the programme** — 1750 < 1800 < 2000. That claim
 * was always a relative one and it survives the correction intact.
 *
 * **Known limit:** four runs is a small sample for a tail. This is a measured number with a
 * stated basis, not a precise one; if a run fails between 1634 and 1750 the answer is more
 * measurement, not a wider number.
 *
 * **`/`, `/design` and `/press` are UNCHANGED and are still projections.** They pass today
 * with 182ms, 385ms and 373ms of headroom against their worst observed medians, so nothing
 * forces the question — but do not read their passing as evidence that they were derived.
 *
 * ---
 *
 * **Why re-deriving here is legitimate, and why it is not a precedent for relaxing a budget.**
 *
 * These are two different acts and the difference is the *measurement*, not the direction the
 * number moves:
 *
 *   RE-DERIVING (this)      the measurement is trustworthy, and the old number is discovered
 *                           never to have had a basis. The new number is computed from data
 *                           and its derivation is stated so it can be checked and re-checked.
 *
 *   RELAXING (forbidden)    the measurement is noisy, the gate is red, and the number is
 *                           moved until the red goes away. Nothing is learned; the gate is
 *                           made to assert less and still reports that it passed.
 *
 * This repository refused the second twice in one session while the mobile LCP was bimodal:
 * raising a ceiling to absorb a 420ms artefact would have made the ceiling meaningless. The
 * artefact was diagnosed and removed instead (M-P1-10), and only then — with a within-run
 * spread of 21–40ms and a proven protocol — was the number recomputed.
 *
 * **The order matters: fix the measurement, then derive the number. Never the reverse.** If
 * anyone cites this docstring to justify moving a ceiling while a gate is flaky, they have
 * cited the wrong half of it.
 */
const ORIGIN_DESKTOP = 'http://127.0.0.1:3200';
// HTTPS, and port 3202, because the mobile run goes through `scripts/h2-proxy.mjs`.
// Chrome only speaks HTTP/2 over TLS. See M-P1-10 and the docstring in that script:
// the budget is asserted against the protocol Vercel actually negotiates, not HTTP/1.1.
const ORIGIN_MOBILE = 'https://127.0.0.1:3202';

const ROUTES = [
  { path: '/', perf: 0.98, lcp: 1800, cls: 0.03, tbt: 200 },
  { path: '/design', perf: 0.95, lcp: 2000, cls: 0.05, tbt: 200 },
  { path: '/digital', perf: 1, lcp: 1750, cls: 0.02, tbt: 150 }, // re-derived, M-P1-11
  { path: '/press', perf: 0.95, lcp: 2000, cls: 0.05, tbt: 200 },
];

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const pattern = (origin, path) => `^${escape(origin + path)}$`;

module.exports = { ORIGIN_DESKTOP, ORIGIN_MOBILE, ROUTES, pattern };
