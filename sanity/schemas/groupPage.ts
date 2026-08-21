import { defineArrayMember, defineField, defineType } from 'sanity';

/**
 * `groupPage` and `groupSection` — `master/SCHEMA.md` §2 (`N-03`).
 *
 * **Premise check: this row carries no measured or projected figure, because it carries no
 * figure at all.** Its `Est` of 0.5d is an estimate of effort, not a property of the system.
 * The spec's claims here are *structural* — "singleton-per-slug", and that `sunken-plain` "is
 * a layout value rather than a styling decision so it cannot be prettified by a later content
 * edit". Structural claims are checkable in a way an unmeasured number is not, and the two
 * below are checked rather than restated.
 *
 * ## Two closed lists, and closing them is the whole point of the type
 *
 * **`slug` is a list, not free text.** *Singleton-per-slug* means exactly two documents can
 * exist — `/approach` and `/about`. Left open, an editor can create a third `groupPage` that
 * no route renders, and the failure is silent: the document looks published and the page does
 * not exist. `N-07` and `N-04` are the two routes; a third slug is a new route, which is code.
 *
 * **`layout` is a list because the spec says the design must not be editable.** The limits
 * block on `/approach` is deliberately undesigned — plain prose on `--canvas-sunken`, no
 * icons, no illustration, mirroring Press's expectations statement. That is an *honesty*
 * device: it looks unpolished because polishing it would sell the limits. A free-text layout
 * field lets a later content edit choose a prettier one, which is precisely the outcome
 * `DESIGN.md` §5 and `master/PROJECT-RULES.md` are guarding against. `check:schemas` asserts
 * both lists so the guarantee survives someone widening the field in good faith.
 */
export const GROUP_PAGE_SLUGS = ['approach', 'about'] as const;
export const GROUP_SECTION_LAYOUTS = [
  'prose',
  'two-column',
  'sunken-plain',
  'process',
  'continuity',
] as const;

export const groupSection = defineType({
  name: 'groupSection',
  type: 'object',
  fields: [
    defineField({
      name: 'key',
      type: 'string',
      description: 'Stable identifier for this section — used for in-page anchors and analytics.',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'heading', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'body', type: 'array', of: [defineArrayMember({ type: 'block' })] }),
    defineField({
      name: 'layout',
      type: 'string',
      options: { list: [...GROUP_SECTION_LAYOUTS] },
      initialValue: 'prose',
      validation: (r) =>
        r.required().custom((value) =>
          typeof value === 'string' && (GROUP_SECTION_LAYOUTS as readonly string[]).includes(value)
            ? true
            : `Layout must be one of: ${GROUP_SECTION_LAYOUTS.join(', ')}`,
        ),
    }),
    defineField({
      name: 'projects',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'project' }] })],
    }),
  ],
  preview: { select: { title: 'heading', subtitle: 'layout' } },
});

export const groupPage = defineType({
  name: 'groupPage',
  type: 'document',
  fields: [
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title' },
      description: 'One of the two group pages. A third slug is a new route, which is code, not content.',
      validation: (r) =>
        r.required().custom((value) => {
          const current = (value as { current?: string } | undefined)?.current;
          return current && (GROUP_PAGE_SLUGS as readonly string[]).includes(current)
            ? true
            : `Slug must be one of: ${GROUP_PAGE_SLUGS.join(', ')}`;
        }),
    }),
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'intro', type: 'text', rows: 3 }),
    defineField({ name: 'sections', type: 'array', of: [defineArrayMember({ type: 'groupSection' })] }),
    defineField({ name: 'seo', type: 'seoBlock' }),
    // Group-wide, per `master/SCHEMA.md` §1. `check:schemas` asserts every document type has it.
    defineField({
      name: 'isSeed',
      type: 'boolean',
      initialValue: false,
      readOnly: true,
      description: 'Placeholder content. Cannot be published in production.',
    }),
  ],
  preview: { select: { title: 'title', subtitle: 'slug.current' } },
});
