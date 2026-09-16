/**
 * Freelancer review retrieval — `GS-P05`.
 *
 * Gridsmith's reviews come from Freelancer's **official documented API**, not from a
 * hand-maintained copy in the CMS and not from the HTML profile page.
 *
 *   `GET https://www.freelancer.com/api/projects/0.1/reviews/?to_users[]=<id>&role=freelancer`
 *
 * documented at `developers.freelancer.com` → Projects → Reviews → *List Project Reviews*.
 *
 * ## Why this is not a Sanity or Supabase synchronisation
 *
 * Freelancer's API T&Cs settle it before engineering does. §5.3: *"You may not copy or store
 * any Data … except to the extent permitted by these API T&Cs"*, and the permission §5.1 gives
 * is a **cache**: *"Where Data is cached, you should refresh the cache at least every 24
 * hours."* A `testimonial` document written into Sanity is a stored copy that never refreshes;
 * a 24-hour revalidating fetch cache is the form the terms describe. So the cache **is** the
 * storage layer, and there is no second copy anywhere to drift out of agreement with the
 * source — which is also what keeps this off `01-VALIDATION-REPORT.md` §21's defect class.
 *
 * `next: { revalidate: 86400 }` is therefore not a performance tuning knob. It is the term.
 *
 * ## Outage behaviour
 *
 * Next serves the previously cached entry when a background revalidation fails, so a Freelancer
 * outage leaves the last-known-good set rendering. If nothing has ever been cached, this returns
 * an empty array and the calling block renders nothing — `Testimonials` already returns `null`
 * on an empty list. **A Freelancer outage cannot take a page down.**
 *
 * ## No credential
 *
 * The documentation states this endpoint requires an OAuth token with `basic` and
 * `fln:project_manage`. Measured on 16 September 2026, it answers `200` **unauthenticated**
 * with the complete public review set — the same reviews the profile page shows an anonymous
 * visitor, with the same bodies, ratings and dates. Nothing here sends a credential, a cookie
 * or a session, and nothing reads the HTML page.
 *
 * **That divergence is a recorded risk, not an assumption to build on quietly.** If Freelancer
 * begins enforcing the documented scopes, this returns `[]` and the block stops rendering; it
 * cannot half-work. `check:reviews --live` is what notices.
 *
 * ## No `server-only`
 *
 * Deliberate. `scripts/check-reviews.mjs` imports this file to assert the transformation rules,
 * and `server-only` throws outside a React Server Component — it would make the gate impossible.
 * There is no secret in this module to protect: the request carries no credential at all. The
 * module is imported only by Server Components, and `lint:secrets` sweeps the built chunks.
 */
import { z } from 'zod';
import type { Division } from '@/lib/sanity/queries';

/** The public profile. Every rendered review links here, and a reader can check it. */
export const FREELANCER_PROFILE = 'https://www.freelancer.com/u/GridsmithLTD';

/**
 * Gridsmith's Freelancer user id, resolved from the public username on 16 September 2026 via
 * `GET /api/users/0.1/users/?usernames[]=GridsmithLTD` (also unauthenticated).
 *
 * Held as a constant rather than resolved at request time: it is immutable for the life of the
 * account, and looking it up every 24 hours would double the request count to learn a number
 * that cannot change.
 */
export const FREELANCER_USER_ID = 92543257;

export const REVIEWS_ENDPOINT = 'https://www.freelancer.com/api/projects/0.1/reviews/';

/**
 * Attribution. Freelancer's own wording for these is "review"; `verified` in the sentence
 * refers to Freelancer's verification of the engagement, which is what the platform asserts by
 * publishing it. It does **not** claim Freelancer endorses Gridsmith, and no Freelancer mark,
 * logo or asset is used — API T&Cs §2 defines the brand and §8 leaves its use unpermitted.
 */
export const SOURCE_LABEL = 'Verified review via Freelancer';

/* -- the response ---------------------------------------------------------- */

/**
 * Only the fields that are actually used are parsed. `paid_amount`, `bid_amount`, `price_usd`,
 * `currency`, `project_id` and `review_context.seo_url` are all present in the response and are
 * all **deliberately absent from this schema** — a project's financial value and a direct link
 * to the client's project page are exactly what §8 of the `GS-P05` brief refuses to publish, and
 * a field that is never parsed cannot be rendered by a later accident.
 */
const reviewSchema = z.object({
  id: z.number(),
  from_user_id: z.number(),
  description: z.string(),
  rating: z.number(),
  time_submitted: z.number(),
  status: z.string().optional(),
});

const userSchema = z.object({
  public_name: z.string().optional(),
  username: z.string().optional(),
  /** Parsed **only** so a body can be tested against it. Never rendered. */
  company: z.string().optional(),
});

const payloadSchema = z.object({
  status: z.literal('success'),
  result: z.object({
    reviews: z.array(reviewSchema),
    users: z.record(z.string(), userSchema).nullable().optional(),
    reviews_count: z.number().nullable().optional(),
  }),
});

export type FreelancerPayload = z.infer<typeof payloadSchema>;

/* -- anonymisation --------------------------------------------------------- */

/**
 * The category vocabulary, and the only thing a rendered category may be drawn from.
 *
 * ## Why the source's project title is never read
 *
 * `review_context.context_name` is free text a client typed — `Artistic Logo Design for Casglu`
 * names a client's brand, and `GS-O011` (16 September 2026) decided identifiable project titles
 * come off every review. No amount of cleverness makes a free-text field safe to generalise
 * automatically, because the next title can carry a name no rule anticipated.
 *
 * `jobs[]` is a **closed taxonomy Freelancer controls**: skill tags chosen from its own list. A
 * client's name cannot appear in one, not because a filter removes it but because the field
 * cannot contain it. Deriving the category from the taxonomy instead of the prose is what makes
 * the anonymisation *structurally* safe rather than merely careful, and it is why this keeps
 * working for reviews nobody has seen yet.
 *
 * ## Deterministic
 *
 * The **list order decides**, not the payload order: the first entry whose `jobs` intersect the
 * review's tags wins, so the same review always yields the same label regardless of how
 * Freelancer orders the tags. Ordered most specific first — `Logo Design` before
 * `Graphic Design`, which sits last as the broadest.
 *
 * ## Conservative
 *
 * An unmatched review gets **no category and no division**, not a guessed one. That costs
 * nothing: `projectTitle` is optional in the schema and `TestimonialList` omits the line when it
 * is absent, and `listTestimonialsForDivision` already sorts non-matching divisions later rather
 * than dropping them. The quote, the name and the source link are what make a review worth
 * printing. Adding a tag here is a content decision; leaving one out only loses a caption.
 */
export const CATEGORIES: readonly { label: string; division: Division; jobs: readonly string[] }[] = [
  { label: 'Logo design', division: 'design', jobs: ['Logo Design'] },
  { label: 'Ecommerce theme development', division: 'digital', jobs: ['Shopify Development', 'Shopify Templates', 'Shopify'] },
  { label: 'Game development', division: 'digital', jobs: ['Game Development', 'Game Design'] },
  { label: 'Mobile app development', division: 'digital', jobs: ['Mobile App Development', 'Android'] },
  { label: '3D modelling and rendering', division: 'design', jobs: ['3D Rendering', '3D Modelling', '3D Design', '3D Art'] },
  { label: 'CAD and product design', division: 'design', jobs: ['CAD/CAM', 'Solidworks', 'Product Design'] },
  { label: 'Presentation graphics', division: 'design', jobs: ['Powerpoint'] },
  { label: 'Photo editing', division: 'design', jobs: ['Photo Editing', 'Photo Retouching', 'Image Processing'] },
  { label: 'Video production', division: 'design', jobs: ['Video Services', 'Video Editing', 'Video Post-editing'] },
  { label: 'Animation and motion graphics', division: 'design', jobs: ['Motion Graphics', '2D Animation', 'Animation'] },
  { label: 'Website design and build', division: 'digital', jobs: ['Web Development', 'Website Design', 'Web Design', 'Frontend Development'] },
  { label: 'Illustration', division: 'design', jobs: ['Illustration'] },
  { label: 'Graphic design', division: 'design', jobs: ['Graphic Design'] },
];

/**
 * The category and division for a review, from its Freelancer skill tags alone.
 *
 * @param jobNames the review's project `jobs[].name`; order is ignored
 * @returns the matched entry, or `null` when no allowlisted tag is present
 */
export function categorise(jobNames: readonly string[] | null | undefined) {
  if (!Array.isArray(jobNames) || jobNames.length === 0) return null;
  const present = new Set(jobNames.filter((j) => typeof j === 'string'));
  return CATEGORIES.find((c) => c.jobs.some((j) => present.has(j))) ?? null;
}

/** A URL or an email address anywhere in a body. Both are contact or identity leaks. */
const CONTACT_IN_BODY = /(https?:\/\/|www\.|[\w.+-]+@[\w-]+\.[a-z]{2,})/i;

/**
 * Whether a review body must be **withheld** rather than published.
 *
 * `GS-P05` §8: a genuine quotation is never silently altered, so a body carrying something that
 * cannot be published is dropped whole and reported, not edited. That is the difference between
 * anonymising *metadata* — which this pipeline does freely, because a category is our caption —
 * and rewriting *evidence*, which it never does.
 *
 * Three rules, each deterministic:
 *
 * 1. **The reviewer's own company name appears in the body.** Two of Gridsmith's twelve
 *    reviewers publish a company on their Freelancer profile; a body naming one is identifiable
 *    client work published without permission (`GS-D001`). The name comes from the same payload
 *    as the body, so this needs no maintained list and covers reviewers nobody has seen yet.
 * 2. **A URL or email address appears in the body.**
 * 3. **The body is empty once trimmed.** Nothing to print.
 *
 * **The stated ceiling:** rule 1 can only see a company Freelancer actually publishes. A client
 * naming an employer that is not on their profile is not detectable here and is not claimed to
 * be. That is the honest limit of an automatic rule, and it is why `check:reviews` reports the
 * withheld count rather than asserting that nothing needs withholding.
 *
 * @returns the reason, or `null` when the body is publishable verbatim
 */
export function withholdReason(body: string | null | undefined, reviewerCompany?: string | null) {
  if (typeof body !== 'string' || body.trim().length === 0) return 'the body is empty';
  const company = typeof reviewerCompany === 'string' ? reviewerCompany.trim() : '';
  if (company.length > 2 && body.toLowerCase().includes(company.toLowerCase())) {
    return `the body names the reviewer's own company ("${company}")`;
  }
  if (CONTACT_IN_BODY.test(body)) return 'the body contains a URL or email address';
  return null;
}

/* -- mapping --------------------------------------------------------------- */

/**
 * What a rendered review is. A superset of the fields `TestimonialList` reads, plus the two
 * this pipeline needs and a CMS testimonial has no use for.
 */
export type FreelancerReview = {
  /** Freelancer's own review id — **the deterministic identity.** Stable, and unique per review. */
  id: number;
  quote: string;
  authorName: string;
  authorRole: null;
  authorCompany: null;
  division: Division | null;
  projectTitle: string | null;
  sourceUrl: string;
  sourceLabel: string;
  verified: true;
  isSeed: false;
  /** Freelancer's rating for this review, unrounded and unaltered. */
  rating: number;
  /** ISO date of submission. */
  date: string;
};

/**
 * The whole transformation, as a pure function of a parsed payload. Every assertion
 * `check:reviews` makes is made against this, so the gate reads a **value** rather than the
 * absence of an error — `CLAUDE.md`, *"prefer a probe whose validity is structural"*.
 *
 * `jobsByReview` is passed separately because project job tags arrive in a sibling `projects`
 * map rather than on the review; keeping it a parameter makes the categorisation testable
 * without constructing a whole payload.
 */
export function toReviews(
  payload: FreelancerPayload,
  jobsByReview: Record<number, readonly string[]> = {},
): { published: FreelancerReview[]; withheld: { id: number; reason: string }[] } {
  const users = payload.result.users ?? {};
  const published: FreelancerReview[] = [];
  const withheld: { id: number; reason: string }[] = [];
  const seen = new Set<number>();

  for (const review of payload.result.reviews) {
    // Deterministic identity. A refresh that returns the same review twice, or a paginated
    // read whose pages overlap, must not print it twice.
    if (seen.has(review.id)) continue;
    seen.add(review.id);

    if (review.status && review.status !== 'active') continue;

    const user = users[String(review.from_user_id)] ?? {};
    const reason = withholdReason(review.description, user.company);
    if (reason) {
      withheld.push({ id: review.id, reason });
      continue;
    }

    const category = categorise(jobsByReview[review.id]);
    published.push({
      id: review.id,
      // Verbatim. `trim` removes only leading and trailing whitespace the platform itself
      // stores; the reviewer's own words, punctuation, capitalisation and typos are untouched.
      quote: review.description.trim(),
      // `public_name` is the name Freelancer itself shows an anonymous visitor on the profile
      // page — using it publishes nothing the source does not already publish. `company` is
      // parsed but never rendered: it is the client's employer (`GS-D001`).
      authorName: user.public_name ?? user.username ?? 'Freelancer client',
      authorRole: null,
      authorCompany: null,
      division: category?.division ?? null,
      projectTitle: category?.label ?? null,
      sourceUrl: FREELANCER_PROFILE,
      sourceLabel: SOURCE_LABEL,
      verified: true,
      isSeed: false,
      rating: review.rating,
      date: new Date(review.time_submitted * 1000).toISOString().slice(0, 10),
    });
  }

  published.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.id - b.id));
  return { published, withheld };
}

/* -- retrieval ------------------------------------------------------------- */

/** The request URL. Exported so the gate asserts the same one the app sends. */
export function reviewsUrl(limit = 100) {
  const params = new URLSearchParams({
    'to_users[]': String(FREELANCER_USER_ID),
    role: 'freelancer',
    reviews_count: 'true',
    user_details: 'true',
    user_display_info: 'true',
    project_details: 'true',
    project_job_details: 'true',
    compact: 'true',
    limit: String(limit),
  });
  return `${REVIEWS_ENDPOINT}?${params}`;
}

/** Pull the `jobs[].name` list for each review out of the sibling `projects` map. */
export function jobsByReview(raw: unknown): Record<number, string[]> {
  const result = (raw as { result?: { reviews?: unknown[]; projects?: Record<string, unknown> } })?.result;
  const projects = result?.projects ?? {};
  const out: Record<number, string[]> = {};
  for (const review of result?.reviews ?? []) {
    const r = review as { id?: number; project_id?: number };
    if (typeof r.id !== 'number' || typeof r.project_id !== 'number') continue;
    const project = projects[String(r.project_id)] as { jobs?: { name?: string }[] } | undefined;
    out[r.id] = (project?.jobs ?? []).map((j) => j?.name).filter((n): n is string => typeof n === 'string');
  }
  return out;
}

/**
 * Fetch, validate and transform. **The only impure function in this module.**
 *
 * Every failure mode — network, non-200, malformed body, schema rejection — returns an empty
 * list rather than throwing, because a review block is evidence a page can do without and a
 * page is not. The caller renders nothing.
 */
export async function listFreelancerReviews(limit = 100): Promise<FreelancerReview[]> {
  try {
    const response = await fetch(reviewsUrl(limit), {
      headers: { accept: 'application/json' },
      // API T&Cs §5.1 — the cache is refreshed at least every 24 hours. See the file header.
      next: { revalidate: 86400 },
    });
    if (!response.ok) return [];
    const raw: unknown = await response.json();
    const parsed = payloadSchema.safeParse(raw);
    if (!parsed.success) return [];
    return toReviews(parsed.data, jobsByReview(raw)).published;
  } catch {
    return [];
  }
}

/** Exported for the gate: parse without fetching. */
export function parsePayload(raw: unknown) {
  return payloadSchema.safeParse(raw);
}
