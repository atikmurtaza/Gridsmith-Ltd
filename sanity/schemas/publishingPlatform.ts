import { defineArrayMember, defineField, defineType } from 'sanity';

/**
 * `publishingPlatform` and `platformSpec` — `R-15`, `press/SCHEMA.md` §3a.
 *
 * Powers the platform compliance module (`FR-P07a`): the concrete answer to *"why not just
 * upload it myself"*. `couldYouDoItYourself` is required and, per the spec, is expected to
 * answer *yes* for most platforms — saying so is what makes the paid service credible rather
 * than gatekept, and a required field is what stops it being quietly dropped from the one
 * platform where the answer is inconvenient.
 *
 * ## `specCheckedOn` is the row, and its staleness rule was prose only
 *
 * The spec: *"`specCheckedOn` exists because platform specifications change; a stale date on
 * a live page is a quality failure and **should be surfaced in the CMS after 90 days**."* The
 * required date was specified; the surfacing was not enforced anywhere.
 *
 * It is installed as a **warning, not an error**, and that is deliberate rather than a
 * softening. An error would refuse every unrelated edit to a platform whose spec is merely
 * old — including the edit that fixes something else — so the honest date would be the one
 * thing an editor is punished for keeping. A warning is what the spec asked for: surfaced,
 * in the Studio, next to the field.
 *
 * **Ceiling:** it fires on the recorded date, not on the platform's actual specification. A
 * date bumped without re-reading Amazon's trim tables passes it, and nothing here can see
 * that. `O-12` is the row that does the reading.
 *
 * **No platform content in this file.** `Q-P12` — someone who has actually submitted to each
 * platform — is the owner fact, and `O-12` is the content row.
 */

export const SPEC_STALE_AFTER_DAYS = 90;

/** Exported so `check:schemas` runs the rule the Studio runs rather than a copy of it. */
export function specFreshnessRule(value: unknown): true | string {
  if (typeof value !== 'string' || value === '') return true; // required() owns absence.
  const checked = Date.parse(value);
  if (Number.isNaN(checked)) return true; // the date type owns malformedness.
  const days = Math.floor((Date.now() - checked) / 86_400_000);
  return days > SPEC_STALE_AFTER_DAYS
    ? `This specification was last checked ${days} days ago. Platform specifications change; re-read the platform's own documentation and update this date.`
    : true;
}

export const platformSpec = defineType({
  name: 'platformSpec',
  type: 'object',
  fields: [
    defineField({ name: 'requirement', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'detail', type: 'text', rows: 2 }),
    defineField({
      name: 'category',
      type: 'string',
      options: { list: ['interior', 'cover', 'metadata', 'account'] },
      validation: (r) => r.required(),
    }),
  ],
  preview: { select: { title: 'requirement', subtitle: 'category' } },
});

export const publishingPlatform = defineType({
  name: 'publishingPlatform',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'name' }, validation: (r) => r.required() }),
    defineField({ name: 'reach', type: 'text', rows: 2, description: 'What it actually gets you.' }),
    defineField({ name: 'formats', type: 'array', of: [defineArrayMember({ type: 'string' })] }),
    defineField({
      name: 'specRequirements',
      type: 'array',
      of: [defineArrayMember({ type: 'platformSpec' })],
      validation: (r) => r.min(4),
    }),
    defineField({
      name: 'commonRejectionReasons',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({ name: 'whatWeDo', type: 'text', rows: 4, validation: (r) => r.required() }),
    /** The honest answer, required. For most platforms it is "yes, and here is what it involves". */
    defineField({ name: 'couldYouDoItYourself', type: 'text', rows: 4, validation: (r) => r.required() }),
    defineField({ name: 'authorAccountRequired', type: 'boolean', initialValue: true }),
    /**
     * Required, plus the 90-day surfacing the spec asks for. Two rules rather than one chain:
     * `.warning()` applies to the whole rule it terminates, so chaining it onto `required()`
     * would demote the requirement to a warning as well.
     */
    defineField({
      name: 'specCheckedOn',
      type: 'date',
      validation: (r) => [r.required(), r.custom(specFreshnessRule).warning()],
    }),
    defineField({ name: 'order', type: 'number' }),
    defineField({ name: 'active', type: 'boolean', initialValue: true }),
    defineField({
      name: 'isSeed',
      type: 'boolean',
      initialValue: false,
      readOnly: true,
      description: 'Placeholder content. Cannot be published in production.',
    }),
  ],
  preview: { select: { title: 'name', subtitle: 'specCheckedOn' } },
});
