import { defineArrayMember, defineField, defineType } from 'sanity';

/**
 * `book` and `retailerLink` — `R-01`, `press/SCHEMA.md` §1.
 *
 * **The most important document type on the Press site**, because every field exists so a
 * suspicious visitor can verify a claim without taking Gridsmith's word for it (R6-Press).
 * The two hard validators the spec names are the row:
 *
 * - `retailers` requires **at least one** entry. A book with no verifiable link is a claim,
 *   and the shelf exists to be the opposite of a claim.
 * - `authorConsent` must be **exactly `true`**. `required()` alone accepts `false`, which is
 *   how a client's title gets published as a credential without permission — an IP problem
 *   and, given `ETH-06`, a stated ethical commitment.
 *
 * ## The third validator was a rule stated only in prose
 *
 * `press/PROJECT-RULES.md` §1.7 — *"No affiliate links on retailer URLs. Monetising the
 * verification path corrupts its purpose."* — was enforced nowhere. It is the same shape as
 * `ETH-07`, which lived in a paragraph until something ran it. A retailer link earning
 * commission is not a verification link, and the drift is invisible: the URL still resolves,
 * the book still exists, and nothing on the page or in any gate looks different. So
 * `retailerLink.url` refuses one.
 *
 * **Ceiling, stated because a green field otherwise reads as more than it is:** the rule
 * refuses a *named set* of affiliate and campaign parameters. It is not a proof that a URL
 * earns nothing — a retailer could key commission off a path segment or a short domain. It
 * makes the ordinary way of doing it impossible from the Studio, which is where it would
 * actually be done.
 *
 * `linkStatus` and `lastChecked` are written by `R-04`'s weekly cron and are read-only here.
 *
 * **No content in this file.** Titles, authors, ISBNs and covers are Epic O (`O-02`), and
 * nothing here needs `Q-P1`.
 */

/**
 * Closed, and closure is the guarantee rather than a convenience. `press/SCHEMA.md` §3's
 * `press_link_checks` table keys a row by `(book_slug, retailer)` and `R-04` reports per
 * retailer; a free-text retailer silently opens a partition nothing reports on. `other` is a
 * member of the set, so the escape hatch is inside the closure rather than around it.
 */
export const RETAILERS = [
  'amazon-uk',
  'amazon-us',
  'waterstones',
  'ingram',
  'kobo',
  'apple-books',
  'bookshop-org',
  'other',
] as const;

/**
 * Query parameters that make a link a monetised one. Amazon Associates keys off `tag`,
 * `linkCode`, `linkId` and `ascsubtag`; Bookshop.org off `aid`. Anything named `*aff*` or
 * `utm_*` is campaign attribution, which is the same corruption wearing a different label.
 */
const AFFILIATE_PARAMS = ['tag', 'linkcode', 'linkid', 'ascsubtag', 'aid'];

/** Exported so `check:schemas` runs the rule the Studio runs, not a copy of it. */
export function noAffiliateRule(value: unknown): true | string {
  if (typeof value !== 'string' || value === '') return true; // required() owns absence.
  let params: URLSearchParams;
  try {
    params = new URL(value).searchParams;
  } catch {
    return true; // url() owns malformedness.
  }
  for (const [name] of params) {
    const key = name.toLowerCase();
    if (AFFILIATE_PARAMS.includes(key) || key.includes('aff') || key.startsWith('utm_')) {
      return `Retailer links carry no affiliate or campaign parameters — remove "${name}" (press/PROJECT-RULES.md §1.7)`;
    }
  }
  return true;
}

export const retailerLink = defineType({
  name: 'retailerLink',
  type: 'object',
  fields: [
    defineField({
      name: 'retailer',
      type: 'string',
      options: { list: [...RETAILERS] },
      validation: (r) =>
        r
          .required()
          .custom((value) =>
            value === undefined || (RETAILERS as readonly string[]).includes(value as string)
              ? true
              : `Retailer must be one of: ${RETAILERS.join(', ')}`,
          ),
    }),
    defineField({ name: 'url', type: 'url', validation: (r) => r.required().custom(noAffiliateRule) }),
    defineField({ name: 'label', type: 'string' }),
  ],
  preview: { select: { title: 'retailer', subtitle: 'url' } },
});

export const book = defineType({
  name: 'book',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title' }, validation: (r) => r.required() }),
    defineField({ name: 'authorName', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'authorIsClient', type: 'boolean', initialValue: true }),
    /** Fixed 2:3, no cropping — `R-02` renders the shelf at one ratio and CLS is the budget. */
    defineField({ name: 'cover', type: 'image', options: { hotspot: false }, validation: (r) => r.required() }),
    defineField({ name: 'subtitle', type: 'string' }),
    defineField({
      name: 'category',
      type: 'string',
      options: {
        list: [
          'Business',
          'Memoir',
          'Self-help',
          'Technical',
          'Fiction',
          'Academic',
          'Children',
          'History',
          'Other',
        ],
      },
    }),
    defineField({ name: 'formats', type: 'array', of: [defineArrayMember({ type: 'string' })] }),
    defineField({ name: 'isbn13', type: 'string' }),
    defineField({ name: 'publishedDate', type: 'date', validation: (r) => r.required() }),
    defineField({ name: 'pageCount', type: 'number' }),
    defineField({ name: 'wordCount', type: 'number' }),
    defineField({
      name: 'servicesUsed',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'service' }] })],
    }),
    /** Hard validator 1. `press/PROJECT-RULES.md` §1.6, `FR-P08`. */
    defineField({
      name: 'retailers',
      type: 'array',
      of: [defineArrayMember({ type: 'retailerLink' })],
      validation: (r) => r.min(1),
    }),
    defineField({
      name: 'linkStatus',
      type: 'string',
      options: { list: ['ok', 'broken', 'unchecked'] },
      initialValue: 'unchecked',
      readOnly: true,
      description: 'Written by the R-04 cron.',
    }),
    defineField({ name: 'lastChecked', type: 'datetime', readOnly: true }),
    defineField({ name: 'caseStudy', type: 'reference', to: [{ type: 'project' }] }),
    defineField({ name: 'testimonial', type: 'reference', to: [{ type: 'testimonial' }] }),
    /** Hard validator 2. `ETH-06`. `required()` alone accepts `false`. */
    defineField({
      name: 'authorConsent',
      type: 'boolean',
      initialValue: false,
      validation: (r) =>
        r.custom((value) =>
          value === true ? true : 'Written author consent is required before publishing a title',
        ),
    }),
    defineField({ name: 'featured', type: 'boolean', initialValue: false }),
    defineField({ name: 'published', type: 'boolean', initialValue: false }),
    defineField({
      name: 'isSeed',
      type: 'boolean',
      initialValue: false,
      readOnly: true,
      description: 'Placeholder content. Cannot be published in production.',
    }),
  ],
  preview: { select: { title: 'title', subtitle: 'authorName' } },
});
