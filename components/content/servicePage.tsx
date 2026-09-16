import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ServiceDetail } from '@/components/content/ServiceDetail';
import { getService, listServiceSlugs, type Division } from '@/lib/sanity/queries';

/**
 * The per-service route, as a factory — `GS-P04`.
 *
 * ## Why a factory rather than three route files
 *
 * Next needs a real file per route segment, so `/design/services/[slug]`,
 * `/digital/services/[slug]` and `/press/services/[slug]` each have to exist on disk. What they
 * do not have to be is three copies of the same forty lines: the only thing that differs between
 * them is the division string, and three copies is three places for a metadata fallback or a
 * `notFound()` to drift apart. Each route file is now six lines that name its division.
 *
 * The division is a literal in the route file rather than read from the URL, which is the same
 * reason `getService` takes it as a parameter: a slug is unique per record but nothing stops two
 * divisions carrying the same one, and `/design/services/copywriting` must never resolve to a
 * Press service because it happened to sort first.
 *
 * ## `dynamicParams` is left at its default
 *
 * `generateStaticParams` returns every published slug, so the pages are static. A slug that is
 * not in that list still renders on demand and `getService` returns null for it, which is the
 * `notFound()` below — an unpublished or deleted service is a 404 rather than a build error.
 */
const DIVISION_NAMES: Record<Division, string> = {
  design: 'Gridsmith Design',
  digital: 'Gridsmith Digital',
  press: 'Gridsmith Press',
};

type Params = { params: Promise<{ slug: string }> };

export function serviceRoute(division: Division) {
  return {
    generateStaticParams: async () => {
      const slugs = await listServiceSlugs(division);
      return slugs.filter(Boolean).map((slug) => ({ slug }));
    },

    generateMetadata: async ({ params }: Params): Promise<Metadata> => {
      const { slug } = await params;
      const service = await getService(division, slug);
      if (!service) return { title: 'Not found — Gridsmith Ltd' };
      return {
        title: service.metaTitle ?? `${service.title} — ${DIVISION_NAMES[division]}`,
        description: service.metaDescription ?? service.problem ?? undefined,
      };
    },

    Page: async ({ params }: Params) => {
      const { slug } = await params;
      const service = await getService(division, slug);
      if (!service) notFound();
      return <ServiceDetail service={service} />;
    },
  };
}
