import { readFileSync } from 'node:fs';
import type { NextConfig } from 'next';

type LegacyRedirect = { source: string; destination: string; permanent: boolean };

/**
 * Legacy redirect map — master/TECH-SPEC.md §5, tracker G-02.
 *
 * Currently empty and intentionally so: the programme is greenfield, there is no
 * existing site to crawl, and G-01/G-02 are BLOCKED pending a separate decision. The
 * file and the wiring exist now so the mechanism is testable before it is needed —
 * adding entries later is a data change, not a config change.
 */
const legacyRedirects: LegacyRedirect[] = JSON.parse(
  readFileSync(new URL('./redirects/legacy.json', import.meta.url), 'utf8'),
);

if (!Array.isArray(legacyRedirects)) {
  throw new Error('redirects/legacy.json must contain an array');
}

const nextConfig: NextConfig = {
  /**
   * `globalNotFound` is what makes the 404 load the token layer at all.
   *
   * With four root layouts and no `app/layout.tsx`, an unmatched URL falls outside all of
   * them, so Next has no layout to attach the route's global CSS to. `app/not-found.tsx`
   * imported `globals.css` and the fonts directly and the build silently dropped both:
   * the served 404 linked the CSS-modules chunk and nothing else, leaving every token
   * undefined. `outline: 2px solid var(--ink)` is then invalid at computed-value time,
   * which also discards the UA focus ring — measured `outlineStyle: "none"` against
   * `"solid 2px"` on `/`. CSS *modules* were collected, which is why it looked styled.
   *
   * This flag switches on the `app/global-not-found.tsx` convention, whose whole purpose
   * is a 404 that owns its own `<html>`/`<body>` because there is no root layout to
   * inherit — precisely this app's shape (`next-app-loader/index.js:341` drops the layout
   * for that route). Its CSS is collected like any page's.
   *
   * Experimental in 15.5.x, so it is Next that must be pinned, not this line. What proves
   * it still works is `check-axe`, which now asserts the *computed* theme on every route
   * and fails if the tokens are not loaded. If a Next upgrade renames or stabilises the
   * flag, that gate is what will tell you, on the 404 specifically.
   */
  experimental: {
    globalNotFound: true,
  },
  async redirects() {
    return legacyRedirects;
  },
};

export default nextConfig;
