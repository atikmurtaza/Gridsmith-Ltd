import { defineArrayMember, defineField, defineType } from 'sanity';

/** `SCHEMA-CORE.md` §2. One definition, shared by every division — never duplicated. */

export const deliverable = defineType({
  name: 'deliverable',
  type: 'object',
  fields: [
    defineField({ name: 'label', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'detail', type: 'text', rows: 2 }),
    defineField({ name: 'included', type: 'boolean', initialValue: true }),
  ],
});

/**
 * `value` is a **string**, not a number, and that is deliberate rather than loose typing.
 * `FOUNDATION` §7.6 requires seed metrics to render as `[SEED] 00%` — a marker plus zeroed
 * digits, never a plausible figure. A numeric field cannot hold that, so a seed record would
 * have to carry a real-looking number and the marker would live somewhere else, which is
 * exactly the drift the policy exists to prevent.
 */
export const metric = defineType({
  name: 'metric',
  type: 'object',
  fields: [
    defineField({ name: 'label', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'value', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'context', type: 'text', rows: 2 }),
  ],
});

export const ctaBlock = defineType({
  name: 'ctaBlock',
  type: 'object',
  fields: [
    defineField({ name: 'label', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'href', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'style',
      type: 'string',
      options: { list: ['primary', 'secondary'] },
      initialValue: 'primary',
    }),
    // Contact-form prefill. Free-form by design: which fields a CTA prefills depends on the
    // form it points at, and those forms are division work (A-08, K-14).
    defineField({
      name: 'prefill',
      type: 'object',
      fields: [defineField({ name: 'json', type: 'text', rows: 3 })],
    }),
  ],
});

export const seoBlock = defineType({
  name: 'seoBlock',
  type: 'object',
  fields: [
    defineField({ name: 'metaTitle', type: 'string' }),
    defineField({ name: 'metaDescription', type: 'text', rows: 2 }),
    defineField({ name: 'ogImage', type: 'image' }),
    defineField({ name: 'canonical', type: 'url' }),
    defineField({ name: 'noIndex', type: 'boolean', initialValue: false }),
  ],
});

/**
 * **CLAUDE.md non-negotiable #3 — "never publish a service page without pricing" — is
 * enforced here, structurally.** `service.pricingModel` is `required`, so a service page
 * physically cannot be saved without one (`SCHEMA-CORE.md`, SC-6).
 *
 * `variables` carries a `min(2)` rule straight from the spec: *"what moves this number —
 * required, min 2"*. A price with no stated variables is a quote pretending to be a price.
 *
 * **No net/gross field yet, and that is `M-P2-3`, not an omission here.** Gridsmith is VAT
 * registered at launch; consumer-facing prices must display VAT-inclusive and B2B prices must
 * state their treatment. That is a constraint on this block, but the display rule differs per
 * division audience, so it is raised at the first division pricing row rather than guessed at
 * in the shared layer.
 */
export const pricingBlock = defineType({
  name: 'pricingBlock',
  type: 'object',
  fields: [
    defineField({
      name: 'model',
      type: 'string',
      options: { list: ['fixed', 'from', 'range', 'retainer', 'per-unit', 'day-rate'] },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'currency',
      type: 'string',
      options: { list: ['GBP'] },
      initialValue: 'GBP',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'fromAmount', type: 'number' }),
    defineField({ name: 'toAmount', type: 'number' }),
    defineField({ name: 'unit', type: 'string' }),
    defineField({ name: 'includes', type: 'array', of: [defineArrayMember({ type: 'string' })] }),
    defineField({
      name: 'variables',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      description: 'What moves this number.',
      validation: (r) => r.min(2),
    }),
    defineField({ name: 'note', type: 'string' }),
  ],
});

/** `alt` is required — WCAG 1.1.1, and the CMS is the only place it can be enforced. */
export const protectedImage = defineType({
  name: 'protectedImage',
  type: 'object',
  fields: [
    defineField({ name: 'asset', type: 'image', validation: (r) => r.required() }),
    defineField({ name: 'alt', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'caption', type: 'string' }),
    defineField({ name: 'watermarked', type: 'boolean', initialValue: true }),
    defineField({ name: 'displayMaxWidth', type: 'number', initialValue: 1600 }),
  ],
});

/**
 * **`protectedVideo` is referenced by `project.media` in `SCHEMA-CORE.md` §1 and defined
 * nowhere in any spec.** A reference to an undefined type is a Studio error, so it had to be
 * either defined or dropped from `media` — and dropping it would silently remove video from
 * the portfolio, which is a content decision this row does not own.
 *
 * So it mirrors `protectedImage` field for field, with a `file` in place of the `image`.
 * **That shape is derived, not specified** — logged as `M-P2-9`. Anything it needs beyond the
 * mirror (a poster frame, a duration, a captions track for WCAG 1.2.2) is unknown and is not
 * guessed at here. `D-01` is the first row that renders one.
 */
export const protectedVideo = defineType({
  name: 'protectedVideo',
  type: 'object',
  fields: [
    defineField({
      name: 'asset',
      type: 'file',
      options: { accept: 'video/*' },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'alt', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'caption', type: 'string' }),
    defineField({ name: 'watermarked', type: 'boolean', initialValue: true }),
    defineField({ name: 'displayMaxWidth', type: 'number', initialValue: 1600 }),
  ],
});

/**
 * The canonical six — `_shared/00-PROCESS.md`, and `master/SCHEMA.md` §1, which **supersedes
 * the weaker version in `SCHEMA-CORE.md`**. The specs deleted that duplicate at kickoff for
 * exactly one reason: so no session implements the weaker one by reading the core file first.
 * This is the stronger one, with `divisionDetail`, `clientTime` and the validator.
 *
 * The validator is what keeps three divisions aligned as content is edited over time. The
 * stage names are a shared promise to the client, not per-division copy; `divisionDetail` is
 * where a division says what its version of the stage involves.
 */
export const CANONICAL_STAGES = [
  'Consultation',
  'Planning & Scope',
  'Approval & Start',
  'Design, Development & Updates',
  'Delivery',
  'Support',
] as const;

export const processStep = defineType({
  name: 'processStep',
  type: 'object',
  fields: [
    defineField({ name: 'number', type: 'number', validation: (r) => r.required().min(1).max(6) }),
    defineField({
      name: 'title',
      type: 'string',
      options: { list: [...CANONICAL_STAGES] },
      validation: (r) =>
        r.required().custom((title) =>
          typeof title === 'string' && (CANONICAL_STAGES as readonly string[]).includes(title)
            ? true
            : 'Process stage must be one of the canonical six (see _shared/00-PROCESS.md)',
        ),
    }),
    defineField({ name: 'description', type: 'text', rows: 3, description: 'The canonical description.' }),
    defineField({ name: 'divisionDetail', type: 'text', rows: 3 }),
    defineField({ name: 'duration', type: 'string' }),
    defineField({ name: 'clientTime', type: 'string' }),
  ],
});

export const objectTypes = [
  deliverable,
  metric,
  ctaBlock,
  seoBlock,
  pricingBlock,
  protectedImage,
  protectedVideo,
  processStep,
];
