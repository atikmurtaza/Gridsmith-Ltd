/**
 * The site's own origin, and whether this deployment is allowed to be indexed — `G-04`,
 * `GS-R001` §17.
 *
 * ## Why the origin is not a constant
 *
 * `gridsmith.uk` is the **intended** production origin. It is not this deployment: the domain
 * serves a WordPress site on Hostinger today (`LIVE-SITE-EXTRACT.md`), the Vercel project holds
 * no custom domain, and `GS-R001` prohibits cutover. Hardcoding `https://gridsmith.uk` here
 * would put canonical URLs and a sitemap on a staging candidate that point at a site this build
 * does not serve — which is the thing the brief names outright: *"do not point production
 * canonical URLs incorrectly merely to make a test green."*
 *
 * So the origin comes from the deployment, and the production value is a variable the owner
 * sets once at cutover. **That is the documented production switch**, and it is one line in the
 * Vercel dashboard:
 *
 *   `NEXT_PUBLIC_SITE_URL=https://gridsmith.uk` on the Production environment.
 *
 * ## The resolution order, and why each step is where it is
 *
 * 1. `NEXT_PUBLIC_SITE_URL` — explicit, and the only thing that can name the real domain.
 * 2. `VERCEL_PROJECT_PRODUCTION_URL` / `VERCEL_URL` — the deployment's own hostname. A preview
 *    then declares itself canonical, which is correct: a preview *is* the canonical source of
 *    its own pages, and it is not indexed anyway (see below).
 * 3. `http://localhost:3000` — local and CI. The served gates run against a real `next start`,
 *    so metadata has to resolve to something during a build that has no platform variables.
 *
 * **`NEXT_PUBLIC_` is correct for this and it is not a secret.** The value is the address a
 * visitor typed; it is inlined into the client bundle the way `NEXT_PUBLIC_SANITY_DATASET`
 * already is, and `lint:secrets` sweeps the chunks regardless.
 *
 * ## Indexing
 *
 * `INDEXABLE` is true only on a Vercel **production** deployment that has been given an explicit
 * site URL. Both conditions, deliberately:
 *
 * - `VERCEL_ENV === 'production'` alone would index the first production-target build that
 *   succeeded, and the programme has been producing production-target deployments since
 *   `GS-P00` — every one of them has failed on the empty Sanity dataset (`GS-T005`), but the
 *   day one succeeds must not also be the day the site enters Google.
 * - `NEXT_PUBLIC_SITE_URL` alone would index a preview whose variable was set for a test.
 *
 * Requiring the owner to set a variable **and** deploy to production makes indexing an act
 * rather than a side effect. Everything else — preview, local, CI — is `Disallow: /`, which is
 * `app/robots.ts`.
 *
 * **Vercel Authentication is already on for this project** (`ssoProtection`, all except custom
 * domains), so a preview answers 401 to a crawler and is not reachable to be indexed in the
 * first place. This is the second lock, not the only one: deployment protection is a dashboard
 * setting anyone can turn off, and `robots.ts` is in the repository where a change to it shows
 * up in a diff.
 */

const fromEnv = () => {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, '');
  const vercel =
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() || process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel.replace(/\/+$/, '')}`;
  return 'http://localhost:3000';
};

/** The origin this deployment serves from, with no trailing slash. */
export const SITE_URL = fromEnv();

/** A `URL`, which is what `metadataBase` takes. */
export const SITE_ORIGIN = new URL(SITE_URL);

/**
 * Whether search engines may index this deployment. See the header: both conditions are
 * required, and everything that is not a configured production deployment is disallowed.
 */
export const INDEXABLE =
  process.env.VERCEL_ENV === 'production' && Boolean(process.env.NEXT_PUBLIC_SITE_URL?.trim());

/** An absolute URL for a site-relative path. */
export const absolute = (path: string) => new URL(path, SITE_URL).toString();
