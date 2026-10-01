#!/usr/bin/env node
/**
 * check-redirects — the legacy redirect map on the served build (`GS-PROD-001`).
 *
 * Expects `next start` at BASE_URL (`with-server.mjs` sets it). Three questions, each reported:
 *
 * 1. **Mapped:** each live WordPress URL with a successor is exactly **one** 308 to its
 *    destination, and the destination answers 200 itself (no chain, no loop). A query string
 *    survives the hop.
 * 2. **Unmapped by decision:** the WordPress/theme defaults with no successor take the site-wide
 *    slash 308 once and then answer 404 (the `global-not-found` page) — no redirect to an unrelated
 *    page; and `/` with the theme's query is a plain 200.
 * 3. **The slash rule still works:** `next.config.ts` turns Next's built-in trailing-slash
 *    redirect off so the legacy map can run first, and re-adds the same rule after it. An
 *    ordinary `/about/` must still be one 308 to `/about`, and `/` must not redirect.
 *
 * The expectations are written here, not read from `redirects/legacy.json`: a row deleted from
 * the map must fail this gate rather than shrink it (`CLAUDE.md`, an expectation derived from its
 * own subject). The live inventory is `LIVE-SITE-EXTRACT.md` §13.1.
 */
const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:3000';

const MAPPED = [
  ['/privacy-policy/', '/legal/privacy'],
  ['/privacy-policy', '/legal/privacy'],
  ['/terms-and-conditions/', '/legal/client-terms'],
  ['/terms-and-conditions', '/legal/client-terms'],
  ['/terms-and-conditions/?ref=old-footer', '/legal/client-terms?ref=old-footer'],
];
const GONE = ['/hello-world/', '/category/uncategorized/', '/uicore-cd/ui-cd-to/', '/uicore-cd/ui-cd-wp/'];
const PLAIN = ['/', '/?uicore-tb=it-business-footer'];
const SLASH = [['/about/', '/about'], ['/legal/privacy/', '/legal/privacy'], ['/design/services/brand-identity-systems/', '/design/services/brand-identity-systems']];

const problems = [];
const get = (path) => fetch(`${BASE}${path}`, { redirect: 'manual' });
const target = (res) => {
  const location = res.headers.get('location');
  if (!location) return null;
  const url = new URL(location, BASE);
  return url.pathname + url.search;
};

async function oneHop(from, to, label, final = 200) {
  const first = await get(from);
  if (first.status !== 308) return problems.push(`${label} ${from}: HTTP ${first.status}, expected 308`);
  const location = target(first);
  if (location !== to) return problems.push(`${label} ${from}: redirects to ${location}, expected ${to}`);
  const second = await get(location);
  if (second.status !== final) {
    problems.push(`${label} ${from} -> ${location}: HTTP ${second.status}${second.status >= 300 && second.status < 400 ? ` (a chain, on to ${target(second)})` : ''}, expected ${final}`);
  }
}

try {
  for (const [from, to] of MAPPED) await oneHop(from, to, 'mapped');
  // The site-wide slash rule still applies to them: one 308 to the slashless path, which 404s.
  for (const path of GONE) await oneHop(path, path.replace(/\/$/, ''), 'unmapped', 404);
  for (const path of PLAIN) {
    const res = await get(path);
    if (res.status !== 200) problems.push(`plain ${path}: HTTP ${res.status}, expected 200`);
  }
  for (const [from, to] of SLASH) await oneHop(from, to, 'slash');
} catch (error) {
  problems.push(`request failed: ${error.message} — nothing was measured`);
}

if (problems.length) {
  console.error(`\ncheck-redirects: ${problems.length} problem(s)\n`);
  for (const problem of problems) console.error(`  ${problem}`);
  console.error('');
  process.exit(1);
}

console.log(
  `check-redirects: ${MAPPED.length} legacy URLs are one 308 to a 200 (query kept); ` +
    `${GONE.length} WordPress defaults one slash 308 then 404; ${PLAIN.length} root forms 200; ` +
    `${SLASH.length} trailing-slash URLs are one 308 to a 200`,
);
