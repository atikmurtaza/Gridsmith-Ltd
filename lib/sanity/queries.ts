import { sanityClient } from '@/lib/sanity/client';

/**
 * The read layer. **Every public projection is written so that a field which must not reach
 * the browser is never selected**, rather than selected and then not rendered.
 *
 * **Reads are unauthenticated and build-time.** Both datasets are public and the client holds
 * no token — see `lib/sanity/client.ts`. Nothing here passes `cache: 'no-store'`: it would turn
 * every route dynamic and break the SSG requirement in `TECH-SPEC.md` §1. The seed scripts
 * clear `.next/cache/fetch-cache` instead.
 *
 * ## No project queries, and no price projection — `GS-P03`
 *
 * `GS-D001` removed every public portfolio surface, so the `project` queries went with the
 * routes. **If a public project route is ever restored, restore the confidentiality projection
 * with it**: `"client": select(confidential == true => clientDisplay, clientName)`, resolved at
 * the database so a confidential `clientName` never reaches the RSC payload. The last version
 * that carried it is `9a804c4f`.
 *
 * `GS-D002` removed the service price, so there is no pricing projection either.
 */

/** Divisions as they appear in the CMS. `unsure` is a lead-form value, not a division. */
export type Division = 'design' | 'digital' | 'press';

export type ServiceCard = {
  title: string;
  slug: string;
  division: Division;
  /** A key from `lib/services/architecture.ts`, or null on a record that predates it. */
  capabilityGroup: string | null;
  problem: string | null;
  order: number | null;
};

/**
 * One service page's full record (`U-08`).
 *
 * **Publishable with no price and no portfolio relationship.** `relatedProjects` is in the
 * schema for permitted work and is not projected: no service page renders client work
 * (`GS-D001`). `faqs` is likewise unprojected until content exists for it.
 */
export type ServiceDetail = {
  title: string;
  slug: string;
  division: Division;
  capabilityGroup: string | null;
  /** The approved capabilities this service covers (`GS-O006`). Names, not claims. */
  capabilities: string[] | null;
  searchIntent: string | null;
  problem: string | null;
  description: PortableBlock[] | null;
  deliverables: { label: string; detail: string | null; included: boolean }[] | null;
  process: {
    number: number;
    title: string;
    description: string | null;
    divisionDetail: string | null;
    duration: string | null;
    clientTime: string | null;
  }[] | null;
  collaborators: Division[] | null;
  relatedServices: { title: string; slug: string; division: Division }[] | null;
  ctaLabel: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  isSeed: boolean;
};

/* **There is no `TestimonialCard` type and no testimonial reader here any more — `GS-P06`.**

   The `testimonial` document type still exists in Sanity and the six genuine records still sit
   in the development dataset; what was removed is the site's dependency on them. Reviews now
   come from Freelancer's official API through `lib/reviews/freelancer.ts`, which is a cache
   rather than a stored copy — the form Freelancer's API T&Cs §5.1 and §5.3 permit.

   Restoring a reader here would put the site back on two sources for one claim, which is the
   `01-VALIDATION-REPORT.md` §21 shape: two authored artefacts that must agree, only one of them
   delivered. Do not add one back without retiring the other in the same commit. */

export type PortableBlock = {
  _type: string;
  _key?: string;
  style?: string;
  children?: { _type: string; _key?: string; text?: string }[];
};

export type PostCard = {
  title: string;
  slug: string;
  division: Division | null;
  excerpt: string | null;
  publishedAt: string | null;
  readingTime: number | null;
  isSeed: boolean;
};

export type PostDetail = PostCard & { body: PortableBlock[] | null; author: string | null };

export type FaqItem = { question: string; answer: PortableBlock[] | null; category: string | null };

export type GroupSection = {
  key: string;
  heading: string;
  layout: 'prose' | 'two-column' | 'sunken-plain' | 'process' | 'continuity';
  body: PortableBlock[] | null;
};

export type GroupPage = {
  title: string;
  intro: string | null;
  sections: GroupSection[] | null;
  isSeed: boolean;
};

export type LegalClause = {
  number: string;
  heading: string;
  anchorId: string;
  basis: string | null;
  body: PortableBlock[] | null;
};

export type LegalDocument = {
  title: string;
  version: string | null;
  effectiveFrom: string | null;
  lastReviewed: string | null;
  reviewedBy: string | null;
  solicitorApproved: boolean;
  summary: string | null;
  clauses: LegalClause[] | null;
  isSeed: boolean;
};

const q = <T,>(query: string, params: Record<string, unknown> = {}) =>
  sanityClient.fetch<T>(query, params);

export const listServices = (division: Division) =>
  q<ServiceCard[]>(
    `*[_type == "service" && division == $division && published == true
       && !(_id in path("drafts.**"))]
     | order(order asc){
       "title": title, "slug": slug.current, division, capabilityGroup, problem, order
     }`,
    { division },
  );

/**
 * One service, by division AND slug (`U-08`).
 *
 * **The division is part of the lookup, not a filter applied afterwards.** Slugs are unique
 * per service document but nothing in the schema stops two divisions carrying the same one,
 * and `/digital/services/copywriting` must never resolve to a Press service because it happened
 * to sort first.
 *
 * `published == true` matches `listServices`, and related services are held to the same rule —
 * a link to an unpublished service is a link to a page that does not exist.
 */
export const getService = (division: Division, slug: string) =>
  q<ServiceDetail | null>(
    `*[_type == "service" && division == $division && slug.current == $slug
       && published == true && !(_id in path("drafts.**"))][0]{
      "title": title, "slug": slug.current, division, capabilityGroup, capabilities, searchIntent,
      problem, description,
      deliverables[]{label, detail, "included": coalesce(included, true)},
      process[]{number, title, description, divisionDetail, duration, clientTime},
      collaborators,
      "relatedServices": relatedServices[@->published == true]->{
        "title": title, "slug": slug.current, division
      },
      ctaLabel,
      "metaTitle": seo.metaTitle, "metaDescription": seo.metaDescription,
      "isSeed": coalesce(isSeed, false)
    }`,
    { division, slug },
  );

/** Slugs for `generateStaticParams`, scoped to one division for the same reason. */
export const listServiceSlugs = (division: Division) =>
  q<string[]>(
    `*[_type == "service" && division == $division && published == true
       && !(_id in path("drafts.**"))].slug.current`,
    { division },
  );

export const listPosts = (limit?: number) =>
  q<PostCard[]>(
    `*[_type == "post" && !(_id in path("drafts.**"))]
     | order(publishedAt desc)${limit ? '[0...$limit]' : ''}{
       "title": title, "slug": slug.current, division, excerpt, publishedAt, readingTime,
       "isSeed": coalesce(isSeed, false)
     }`,
    { limit },
  );

export const getPost = (slug: string) =>
  q<PostDetail | null>(
    `*[_type == "post" && slug.current == $slug && !(_id in path("drafts.**"))][0]{
      "title": title, "slug": slug.current, division, excerpt, publishedAt, readingTime,
      body, author, "isSeed": coalesce(isSeed, false)
    }`,
    { slug },
  );

export const listPostSlugs = () =>
  q<string[]>(`*[_type == "post" && !(_id in path("drafts.**"))].slug.current`);

export const listFaqs = (division: Division, limit: number) =>
  q<FaqItem[]>(
    `*[_type == "faq" && division == $division && !(_id in path("drafts.**"))]
     | order(order asc)[0...$limit]{question, answer, category}`,
    { division, limit },
  );

/**
 * **There is no team query and there must not be one — `GS-O004`, 16 September 2026.**
 *
 * `listPublicTeam` and the `TeamMember` type were here and were read by `/about`. The owner's
 * decision is that Gridsmith publishes no team members at all: no founder profile, no employee
 * profiles, no placeholder staff, no stock identities. The company is represented
 * institutionally.
 *
 * The guard was `isPublic == true`, and `isPublic` defaults false — which reads as safe and was
 * not. The development dataset held four `teamMember` records named `[SEED] Placeholder Name`
 * with `isPublic: true`, so the served `/about` published four placeholder people. A boolean in
 * a dataset is a thing anyone can flip; a deleted query is not. This is the same choice
 * `GS-O014` made when it deleted `listTestimonials` rather than leaving it unused.
 *
 * The `teamMember` schema type stays defined and dormant, like `project` and `book`. Restoring
 * publication means writing a query, which is a visible act in a diff.
 */

export const getGroupPage = (slug: 'approach' | 'about') =>
  q<GroupPage | null>(
    `*[_type == "groupPage" && slug.current == $slug && !(_id in path("drafts.**"))][0]{
      title, intro,
      sections[]{key, heading, layout, body},
      "isSeed": coalesce(isSeed, false)
    }`,
    { slug },
  );

/**
 * **`solicitorApproved` is not filtered here, and that is deliberate.**
 *
 * `master/SCHEMA.md` gives the query an `$allowUnapproved` parameter. Filtering an unapproved
 * document out would serve a 404 for `/legal/privacy`, and a website with no privacy notice is
 * a worse outcome than one carrying a draft that says, at the top of the page, that it is a
 * draft. The route renders the approval state prominently instead, and `L-04` is the gate that
 * flips it. What must not happen — a draft published as though it were approved — is prevented
 * by rendering the state, not by hiding the document.
 */
export const getLegalDocument = (slug: string) =>
  q<LegalDocument | null>(
    `*[_type == "legalDocument" && slug.current == $slug && !(_id in path("drafts.**"))][0]{
      title, version, effectiveFrom, lastReviewed, reviewedBy,
      "solicitorApproved": coalesce(solicitorApproved, false),
      summary,
      clauses[]{number, heading, anchorId, basis, body},
      "isSeed": coalesce(isSeed, false)
    }`,
    { slug },
  );

export const listLegalDocuments = () =>
  q<{ title: string; slug: string; summary: string | null; solicitorApproved: boolean }[]>(
    `*[_type == "legalDocument" && !(_id in path("drafts.**"))] | order(title asc){
      title, "slug": slug.current, summary,
      "solicitorApproved": coalesce(solicitorApproved, false)
    }`,
  );
