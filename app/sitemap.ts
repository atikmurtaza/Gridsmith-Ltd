import type { MetadataRoute } from 'next';
import { LEGAL_DOCUMENT_SLUGS } from '@/lib/legal/slugs';
import { listPostSlugs, listServiceSlugs } from '@/lib/sanity/queries';
import { INDEXABLE, absolute } from '@/lib/seo/site';

/**
 * `/sitemap.xml` — `G-04`.
 *
 * ## It is empty on anything that is not a configured production deployment
 *
 * A sitemap is a list of URLs offered to a crawler, so publishing one from a staging candidate
 * contradicts the `Disallow: /` that same candidate serves. The two files read the **same**
 * `INDEXABLE`, so they cannot disagree — a sitemap that says "index these" beside a robots.txt
 * that says "index nothing" is the kind of contradiction someone resolves by deleting whichever
 * one they found second.
 *
 * ## The static list is hardcoded and the dynamic ones are read
 *
 * The fixed routes are written out rather than crawled, for the reason `check-vat-display`
 * gives about its own list: a list derived from the thing it describes cannot notice a
 * deletion. The service and insight slugs genuinely are content and come from the CMS, which
 * is the same read `generateStaticParams` already does for those routes — so a page that
 * exists is in the sitemap and a page that does not is not, without a second list to maintain.
 *
 * **`/press/contact/thank-you` is deliberately absent.** It is the confirmation of a submitted
 * form; a crawler arriving there directly reads a page telling it something has reached us that
 * has not. The probe routes are absent because a production build does not contain them.
 *
 * `changeFrequency` and `priority` are omitted throughout. Google has said publicly it ignores
 * both, and inventing a weekly cadence for a page nobody has scheduled to change is a made-up
 * number in a file — `CLAUDE.md` #2 applies to XML as much as to prose.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!INDEXABLE) return [];

  const STATIC = [
    '/',
    '/about',
    '/approach',
    '/contact',
    '/insights',
    '/design',
    '/digital',
    '/press',
    '/press/path-finder',
    '/press/contact',
    ...LEGAL_DOCUMENT_SLUGS.map((slug) => `/legal/${slug}`),
  ];

  const [design, digital, press, posts] = await Promise.all([
    listServiceSlugs('design'),
    listServiceSlugs('digital'),
    listServiceSlugs('press'),
    listPostSlugs(),
  ]);

  const dynamic = [
    ...design.map((slug) => `/design/services/${slug}`),
    ...digital.map((slug) => `/digital/services/${slug}`),
    ...press.map((slug) => `/press/services/${slug}`),
    ...posts.map((slug) => `/insights/${slug}`),
  ];

  const lastModified = new Date();
  return [...STATIC, ...dynamic].map((path) => ({ url: absolute(path), lastModified }));
}
