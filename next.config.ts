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

/**
 * Gate-subject routes are built everywhere except a production deploy.
 *
 * `app/(marketing)/gridsmith-error-probe/page.probe.tsx` deliberately throws — it is the
 * committed subject that lets `check-axe` reach `app/global-error.tsx`, which otherwise
 * has no gate at all. It must not be reachable on the live site.
 *
 * **The mechanism is `pageExtensions`, so the route is genuinely absent from the build**
 * rather than present-and-redirected. A rewrite or a `notFound()` would still compile the
 * page, ship its chunk, and leave it one config edit away from being live.
 *
 * **The flag excludes rather than includes, deliberately.** The gates run against a real
 * production build (`next build && next start`), so a flag that had to be *set* to include
 * probes would have to be set by `verify`, by CI, and by anyone debugging locally — and
 * the first person to forget it would get a green run against a build with no subject in
 * it, which is the hollow-subject failure this route exists to prevent. Defaulting to
 * present means the only way to lose the subject is to opt out explicitly.
 *
 * `VERCEL_ENV` is set by the platform on production deploys; `GRIDSMITH_EXCLUDE_PROBES`
 * is the manual equivalent for any other host. Neither is set locally or on CI.
 *
 * **`A-12` landed and `/_kitchen-sink` now inherits this flag rather than getting a second
 * mechanism.** Its page was renamed `page.tsx` -> `page.probe.tsx`, which is the whole change:
 * the route path is unaltered, every gate that measures it still does, and in a production
 * build it is absent from the route table for exactly the same reason the probes are. A
 * rewrite or a `notFound()` would have compiled the page and shipped its chunk — and the
 * kitchen sink's chunk is 5.8KB of primitives, the largest single artefact in the build.
 */
const excludeProbes =
  process.env.VERCEL_ENV === 'production' || process.env.GRIDSMITH_EXCLUDE_PROBES === '1';

const nextConfig: NextConfig = {
  pageExtensions: excludeProbes ? ['tsx', 'ts'] : ['tsx', 'ts', 'probe.tsx'],
  /**
   * `globalNotFound` is what makes the 404 load the token layer at all.
   *
   * With four root layouts and no `app/layout.tsx`, an unmatched URL falls outside all of
   * them, so Next has no layout to attach the route's global CSS to. `app/global-not-found.tsx`'s predecessor `app/not-found.tsx`
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
