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
 * **MEASURED, not provisional.** Confirmed against CI run #7 on ubuntu-latest, Node 24,
 * median of 3, devtools throttling: the empty-page LCP floor is ~1520ms on every route
 * (1520–1526ms across all four, a 6ms spread — the signature of a fixed floor rather than
 * of per-route content), leaving Digital 78ms of headroom against its 1600ms ceiling.
 *
 * What remains open is not the number but its durability: 78ms is the headroom on a page
 * containing one heading. Re-measure once Epic M lands real components — FOUNDATION §8.
 */
const ORIGIN_DESKTOP = 'http://127.0.0.1:3200';
// HTTPS, and port 3202, because the mobile run goes through `scripts/h2-proxy.mjs`.
// Chrome only speaks HTTP/2 over TLS. See M-P1-10 and the docstring in that script:
// the budget is asserted against the protocol Vercel actually negotiates, not HTTP/1.1.
const ORIGIN_MOBILE = 'https://127.0.0.1:3202';

const ROUTES = [
  { path: '/', perf: 0.98, lcp: 1800, cls: 0.03, tbt: 200 },
  { path: '/design', perf: 0.95, lcp: 2000, cls: 0.05, tbt: 200 },
  { path: '/digital', perf: 1, lcp: 1600, cls: 0.02, tbt: 150 },
  { path: '/press', perf: 0.95, lcp: 2000, cls: 0.05, tbt: 200 },
];

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const pattern = (origin, path) => `^${escape(origin + path)}$`;

module.exports = { ORIGIN_DESKTOP, ORIGIN_MOBILE, ROUTES, pattern };
