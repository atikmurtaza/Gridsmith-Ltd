/**
 * The one route table both Lighthouse configs read.
 *
 * `collect.url` and `assert.assertMatrix` used to be two hand-kept lists in one file: a
 * URL with no matching pattern is collected and asserted against nothing, and a URL
 * dropped from the list is simply not measured. Neither failure announces itself. Two
 * configs would have made that two ways to drift instead of one, so the table lives here
 * and both derive from it.
 *
 * `lcp` and `tbt` are the mobile ceilings from CLAUDE.md §Performance budgets. They are
 * PROVISIONAL — see Q-M16 and FOUNDATION §8. The budgets were originally set against
 * desktop numbers, which was never the measurement the specs asked for.
 */
const ORIGIN_DESKTOP = 'http://127.0.0.1:3200';
const ORIGIN_MOBILE = 'http://127.0.0.1:3201';

const ROUTES = [
  { path: '/', perf: 0.98, lcp: 1800, cls: 0.03, tbt: 200 },
  { path: '/design', perf: 0.95, lcp: 2000, cls: 0.05, tbt: 200 },
  { path: '/digital', perf: 1, lcp: 1600, cls: 0.02, tbt: 150 },
  { path: '/press', perf: 0.95, lcp: 2000, cls: 0.05, tbt: 200 },
];

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const pattern = (origin, path) => `^${escape(origin + path)}$`;

module.exports = { ORIGIN_DESKTOP, ORIGIN_MOBILE, ROUTES, pattern };
