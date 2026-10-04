/** H4-A: routing policy consumes the existing reviewed CMS publication inventory. */
export type PublicationEntry = {
  type: string; id: string; slug: string | null; division?: string;
  eligible: boolean; gate: string | null; reason?: string;
};
export type ContentIdentity = {
  _id: string; _type: string; _rev: string; slug?: string | null;
  division?: string; published?: boolean; status?: string; isSeed?: boolean;
};
export type StaticRoute = {
  path: string; contentType: string; sourceId: string | null; slug: string | null;
  division?: string; eligible: boolean; gate: string | null; reason: string | null;
  sitemap: boolean; revision: string | null;
};
export type StaticManifest = {
  version: 1; target: 'static'; dataset: 'production'; indexable: false;
  routes: StaticRoute[];
};

const fixedPaths = [
  '/', '/about', '/approach', '/contact', '/insights', '/design', '/digital', '/press',
  '/press/contact', '/press/contact/thank-you', '/press/path-finder',
];
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function createStaticManifest(
  documents: ContentIdentity[], publication: PublicationEntry[],
): StaticManifest {
  const byId = new Map(documents.map((doc) => [doc._id, doc]));
  if (byId.size !== documents.length) throw new Error('Duplicate CMS source identity');
  const known = new Set(publication.map((entry) => entry.id));
  for (const doc of documents) {
    if (doc._id.startsWith('drafts.')) throw new Error('Draft in static content inventory');
    if (doc.isSeed || doc._id.startsWith('seed-')) throw new Error('Seed in static content inventory');
    if (!doc._rev) throw new Error('Missing CMS revision');
    if (doc._type === 'service' && doc.published && !known.has(doc._id)) {
      throw new Error('Published service is outside the reviewed publication inventory');
    }
    if (doc._type === 'service' && doc.published &&
        publication.some((entry) => entry.id === doc._id && !entry.eligible)) {
      throw new Error('Gated service published in static content inventory');
    }
  }
  for (const entry of publication.filter((item) => item.eligible)) {
    const doc = byId.get(entry.id);
    if (!doc || doc._type !== entry.type || (entry.slug && doc.slug !== entry.slug) ||
        (entry.division && doc.division !== entry.division) ||
        (entry.type === 'service' && doc.published !== true)) {
      throw new Error(`Required authorised content missing or changed: ${entry.id}`);
    }
  }
  const routes: StaticRoute[] = fixedPaths.map((path) => {
    const sourceId = path === '/about' || path === '/approach'
      ? `grouppage-${path.slice(1)}` : 'companyDetails';
    return {
      path, contentType: path === '/about' || path === '/approach' ? 'groupPage' : 'page',
      sourceId, slug: null, eligible: true, gate: null, reason: null,
      sitemap: !['/press/contact/thank-you', '/press/path-finder'].includes(path),
      revision: byId.get(sourceId)?._rev ?? null,
    };
  });
  for (const entry of publication) {
    if (!['service', 'legalDocument'].includes(entry.type)) continue;
    if (!entry.slug || !slugPattern.test(entry.slug)) throw new Error('Invalid reviewed route slug');
    const path = entry.type === 'service'
      ? `/${entry.division}/services/${entry.slug}` : `/legal/${entry.slug}`;
    routes.push({
      path, contentType: entry.type, sourceId: entry.id, slug: entry.slug,
      ...(entry.division ? { division: entry.division } : {}),
      eligible: entry.eligible, gate: entry.gate, reason: entry.reason ?? null,
      sitemap: entry.eligible, revision: byId.get(entry.id)?._rev ?? null,
    });
  }
  for (const doc of documents.filter((item) => item._type === 'post' && item.status === 'published')) {
    if (!doc.slug || !slugPattern.test(doc.slug)) throw new Error('Invalid published article slug');
    routes.push({
      path: `/insights/${doc.slug}`, contentType: 'post', sourceId: doc._id, slug: doc.slug,
      eligible: true, gate: null, reason: null, sitemap: true, revision: doc._rev,
    });
  }
  if (new Set(routes.map((route) => route.path)).size !== routes.length) {
    throw new Error('Duplicate static route');
  }
  return { version: 1, target: 'static', dataset: 'production', indexable: false,
    routes: routes.sort((a, b) => a.path.localeCompare(b.path)) };
}

/** Future indexing uses this same eligible set; H4-A always emits an empty sitemap. */
export const sitemapPaths = (manifest: StaticManifest) =>
  manifest.routes.filter((route) => route.eligible && route.sitemap).map((route) => route.path);
