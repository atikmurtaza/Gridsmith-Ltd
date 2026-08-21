import { sanityClient } from '@/lib/sanity/client';

/**
 * The read layer. **Every public projection is written so that a field which must not reach
 * the browser is never selected**, rather than selected and then not rendered.
 *
 * `SCHEMA-CORE.md` §1 on `project.confidential`: *"When it is true, `clientName` must never be
 * returned by a public GROQ query — the projection substitutes `clientDisplay`. A
 * component-level check would leak the name into the RSC payload before anything decided not
 * to render it."* That is why there is no `clientName` anywhere below: the projection emits a
 * single `client` string chosen by `select()`, so there is no second value for a component to
 * get wrong.
 *
 * **Reads are unauthenticated and build-time.** Both datasets are public and the client holds
 * no token — see `lib/sanity/client.ts`. Nothing here passes `cache: 'no-store'`: it would turn
 * every route dynamic and break the SSG requirement in `TECH-SPEC.md` §1. The seed scripts
 * clear `.next/cache/fetch-cache` instead.
 */

/** Divisions as they appear in the CMS. `unsure` is a lead-form value, not a division. */
export type Division = 'design' | 'digital' | 'press';

export type PricingModel = {
  model: 'fixed' | 'from' | 'range' | 'retainer' | 'per-unit' | 'day-rate';
  currency: string;
  fromAmount: number | null;
  toAmount: number | null;
  unit: string | null;
  includes: string[] | null;
  variables: string[] | null;
  note: string | null;
};

export type ServiceCard = {
  title: string;
  slug: string;
  division: Division;
  track: string | null;
  problem: string | null;
  pricingModel: PricingModel | null;
  order: number | null;
};

export type ProjectCard = {
  title: string;
  slug: string;
  divisions: Division[];
  /** Derived, never stored — `master/SCHEMA.md` §1 is explicit that `isCrossDivision` is a projection. */
  isCrossDivision: boolean;
  /** Already resolved against `confidential`. There is no `clientName` to leak. */
  client: string | null;
  confidential: boolean;
  industry: string | null;
  year: number | null;
  summary: string | null;
  isSeed: boolean;
};

export type Metric = { label: string; value: string; context: string | null };

export type ProjectDetail = ProjectCard & {
  track: string | null;
  challenge: PortableBlock[] | null;
  approach: PortableBlock[] | null;
  outcome: PortableBlock[] | null;
  metrics: Metric[] | null;
  testimonial: TestimonialCard | null;
};

export type TestimonialCard = {
  quote: string;
  authorName: string;
  authorRole: string | null;
  authorCompany: string | null;
  division: Division | null;
  projectTitle: string | null;
  sourceUrl: string | null;
  sourceLabel: string | null;
  verified: boolean;
  isSeed: boolean;
};

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

export type TeamMember = {
  name: string;
  role: string | null;
  divisions: Division[] | null;
  bio: string | null;
  credentials: string[] | null;
  isSeed: boolean;
};

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

const PRICING = `pricingModel{
  model, currency, fromAmount, toAmount, unit, includes, variables, note
}`;

/**
 * **The one projection that carries a security consequence.** `select()` resolves at the
 * database, so a confidential project's `clientName` never crosses the network — not into the
 * RSC payload, not into the build output, not into a cached response.
 */
const PROJECT_CARD = `
  "title": title,
  "slug": slug.current,
  divisions,
  "isCrossDivision": count(divisions) > 1,
  "client": select(confidential == true => clientDisplay, clientName),
  "confidential": coalesce(confidential, false),
  industry, year, summary,
  "isSeed": coalesce(isSeed, false)
`;

const TESTIMONIAL = `
  quote, authorName, authorRole, authorCompany, division, projectTitle,
  sourceUrl, sourceLabel,
  "verified": coalesce(verified, false),
  "isSeed": coalesce(isSeed, false)
`;

const q = <T,>(query: string, params: Record<string, unknown> = {}) =>
  sanityClient.fetch<T>(query, params);

export const listProjects = () =>
  q<ProjectCard[]>(
    `*[_type == "project" && !(_id in path("drafts.**"))]
     | order(isCrossDivision desc, year desc, title asc){${PROJECT_CARD}}`,
  );

export const listFeaturedProjects = (limit: number) =>
  q<ProjectCard[]>(
    `*[_type == "project" && masterFeatured == true && !(_id in path("drafts.**"))]
     | order(count(divisions) desc, year desc)[0...$limit]{${PROJECT_CARD}}`,
    { limit },
  );

export const listProjectsForDivision = (division: Division, limit: number) =>
  q<ProjectCard[]>(
    `*[_type == "project" && $division in divisions && !(_id in path("drafts.**"))]
     | order(year desc, title asc)[0...$limit]{${PROJECT_CARD}}`,
    { division, limit },
  );

export const getProject = (slug: string) =>
  q<ProjectDetail | null>(
    `*[_type == "project" && slug.current == $slug && !(_id in path("drafts.**"))][0]{
      ${PROJECT_CARD}, track,
      challenge, approach, outcome,
      metrics[]{label, value, context},
      "testimonial": testimonial->{${TESTIMONIAL}}
    }`,
    { slug },
  );

export const listProjectSlugs = () =>
  q<string[]>(`*[_type == "project" && !(_id in path("drafts.**"))].slug.current`);

export const listServices = (division: Division) =>
  q<ServiceCard[]>(
    `*[_type == "service" && division == $division && published == true
       && !(_id in path("drafts.**"))]
     | order(order asc){
       "title": title, "slug": slug.current, division, track, problem, ${PRICING}, order
     }`,
    { division },
  );

export const listTestimonials = (limit: number) =>
  q<TestimonialCard[]>(
    `*[_type == "testimonial" && !(_id in path("drafts.**"))]
     | order(isSeed asc, authorName asc)[0...$limit]{${TESTIMONIAL}}`,
    { limit },
  );

export const listTestimonialsForDivision = (division: Division, limit: number) =>
  q<TestimonialCard[]>(
    `*[_type == "testimonial" && !(_id in path("drafts.**"))]
     | order(select(division == $division => 0, 1), isSeed asc)[0...$limit]{${TESTIMONIAL}}`,
    { division, limit },
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

/** `isPublic` defaults false — a person appearing on a public website is a decision. */
export const listPublicTeam = () =>
  q<TeamMember[]>(
    `*[_type == "teamMember" && isPublic == true && !(_id in path("drafts.**"))]
     | order(order asc){name, role, divisions, bio, credentials, "isSeed": coalesce(isSeed, false)}`,
  );

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
