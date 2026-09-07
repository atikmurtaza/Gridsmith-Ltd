import { defineArrayMember, defineField, defineType } from 'sanity';

/**
 * `publishingPackage` and `packageLine` — `R-10`, `press/SCHEMA.md` §2.
 *
 * **CLAUDE.md non-negotiable #3 and `press/PROJECT-RULES.md` §1.3 are enforced here,
 * structurally: there is no POA path.** `price` is a number and it is required, so a package
 * that does not state a total cannot be saved. That is the whole row — it needs no price to
 * build, because what it builds is the impossibility of not having one.
 *
 * ## `required()` is not enough for a number, and that is why these are custom rules
 *
 * Sanity's `required()` rejects `undefined`, `null` and `''`. On a numeric field it accepts
 * `0`, and `0` is a legitimate answer here — a package with no charge for extra revisions is
 * a real package. So `required()` alone gives an ambiguous field: the difference between
 * *"extra revisions are free"* and *"nobody filled this in"* is exactly the difference the
 * vanity-press warning is about. The rules below assert the value **is a number**, which
 * accepts `0` and refuses absence, and says so in the message.
 *
 * ## A rule that was in the prose and not in the schema
 *
 * `press/SCHEMA.md` §2's prose says *"`revisionRounds` and `extraRevisionCost` are required
 * because unexplained later fees are the specific vanity-press behaviour buyers are warned
 * about"*. The code block one screen above it marks only `revisionRounds`. **Both are
 * enforced here**, and the divergence is recorded rather than silently resolved: the prose
 * is the stronger reading and it is the one with the reason attached.
 *
 * `excludes` (min 3) and `notFor` are `ETH-03` / `FR-P06`, and they are required for the same
 * reason as the price — a package that never says what it is not is a package that will be
 * sold to the wrong person.
 *
 * **No prices in this file.** `Q-P3`–`Q-P7` and `Q-P11` are owner facts and `O-05` is the
 * content row.
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
    /** Non-negotiable #3. No POA path: a package without a total cannot exist. */
    defineField({
      name: 'price',
      type: 'number',
      validation: (r) => r.required().custom(statedNumberRule('A package price')),
    }),
    defineField({ name: 'priceNote', type: 'string', description: 'e.g. "for manuscripts up to 80,000 words".' }),
    defineField({ name: 'priceIsFrom', type: 'boolean', initialValue: false }),
    /** What moves the number. A price with no stated variables is a quote pretending to be one. */
    defineField({
      name: 'scalingFactors',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      validation: (r) => r.min(1),
    }),
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
    /** Required by §2's prose and not by its code block. The prose carries the reason. */
    defineField({
      name: 'extraRevisionCost',
      type: 'number',
      validation: (r) => r.required().custom(statedNumberRule('The cost of an extra revision round')),
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
