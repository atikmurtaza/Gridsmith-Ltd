import { defineArrayMember, defineField, defineType } from 'sanity';

/**
 * `publishingPackage` and `packageLine` — `R-10`, `press/SCHEMA.md` §2.
 *
 * ## `GS-P03`: a package is a scope description, not a price
 *
 * This type used to carry a required `price`, `priceNote`, `priceIsFrom`, `scalingFactors`
 * ("what moves the number") and a required `extraRevisionCost` — non-negotiable #3's "no POA
 * path". `GS-D002` superseded that: Gridsmith quotes bespoke work and publishes no package,
 * starting or revision price, so all five fields were removed and `check:schemas` refuses a
 * price, cost, fee or amount field on any type. **The type is dormant** — no route renders it —
 * and survives only as a structured way to describe what an engagement includes and excludes if
 * an approved package-shaped offer is ever published.
 *
 * **What survives is the honesty half, and it did not depend on the price.** `excludes` (min 3)
 * and `notFor` are `ETH-03` / `FR-P06`: a package that never says what it is not will be sold to
 * the wrong person. `revisionRounds` stays a stated number because unexplained later rounds are
 * the vanity-press behaviour buyers are warned about; what an extra round costs now belongs in
 * the written quotation, not on the website.
 *
 * ## `required()` is not enough for a number, and that is why `revisionRounds` uses a custom rule
 *
 * Sanity's `required()` rejects `undefined`, `null` and `''`. On a numeric field it accepts
 * `0`, and `0` is a legitimate answer. The rule below asserts the value **is a number**, which
 * accepts `0` and refuses absence, and says so in the message.
 */

/** Exported so `check:schemas` runs the rule the Studio runs rather than a copy of it. */
export function statedNumberRule(what: string) {
  return (value: unknown): true | string =>
    typeof value === 'number' && Number.isFinite(value)
      ? true
      : `${what} must be stated as a number. Zero is a valid answer; blank is not.`;
}

export const packageLine = defineType({
  name: 'packageLine',
  type: 'object',
  fields: [
    defineField({ name: 'label', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'detail', type: 'text', rows: 2 }),
    defineField({
      name: 'category',
      type: 'string',
      options: { list: ['editorial', 'design', 'production', 'distribution', 'support'] },
      validation: (r) => r.required(),
    }),
  ],
  preview: { select: { title: 'label', subtitle: 'category' } },
});

export const publishingPackage = defineType({
  name: 'publishingPackage',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title' }, validation: (r) => r.required() }),
    defineField({ name: 'strapline', type: 'string' }),
    defineField({
      name: 'includes',
      type: 'array',
      of: [defineArrayMember({ type: 'packageLine' })],
      validation: (r) => r.min(5),
    }),
    /** `ETH-03` / `FR-P06`. Exclusions carry equal weight to inclusions on the matrix. */
    defineField({
      name: 'excludes',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      validation: (r) => r.min(3),
    }),
    defineField({
      name: 'revisionRounds',
      type: 'number',
      validation: (r) => r.required().custom(statedNumberRule('The number of revision rounds')),
    }),
    defineField({ name: 'typicalDuration', type: 'string' }),
    defineField({ name: 'authorTimeCommitment', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'distributionPlatforms', type: 'array', of: [defineArrayMember({ type: 'string' })] }),
    defineField({ name: 'bestFor', type: 'string' }),
    /** The honesty requirement. A package that never says who it is wrong for is a funnel. */
    defineField({ name: 'notFor', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'recommended', type: 'boolean', initialValue: false }),
    defineField({ name: 'order', type: 'number' }),
    defineField({
      name: 'isSeed',
      type: 'boolean',
      initialValue: false,
      readOnly: true,
      description: 'Placeholder content. Cannot be published in production.',
    }),
  ],
  preview: { select: { title: 'title', subtitle: 'strapline' } },
});
