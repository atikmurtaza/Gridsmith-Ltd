import type { MetadataRoute } from 'next';
import { INDEXABLE, absolute } from '@/lib/seo/site';

/**
 * `/robots.txt` — `G-04`, and the staging-indexing control `GS-R001` §17 requires.
 *
 * **The default is `Disallow: /`, and only a configured production deployment opts out of it.**
 * `lib/seo/site.ts` holds the two conditions and why there are two. Everything this programme
 * has deployed so far — preview builds, local `next start`, CI — is disallowed, which is the
 * state a staging release candidate must be in and the state it stays in until the owner sets
 * `NEXT_PUBLIC_SITE_URL` on the Production environment.
 *
 * **This is the second lock, not the first.** The Vercel project has Vercel Authentication on
 * for every deployment except custom domains, so a crawler gets 401 before it gets here. That
 * is a dashboard setting; this is a file, and a change to it appears in a diff.
 *
 * The probe routes need no entry: `next.config.ts` removes them from a production build through
 * `pageExtensions`, so they are absent rather than hidden. A `Disallow` for a route that does
 * not exist is a line telling a crawler where to look.
 */
export default function robots(): MetadataRoute.Robots {
  if (!INDEXABLE) {
    return {
      rules: [{ userAgent: '*', disallow: '/' }],
    };
  }
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: absolute('/sitemap.xml'),
  };
}
