import { defineField, defineType } from 'sanity';
import { CANONICAL_TITLES } from '../../lib/process/canonical.ts';

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

/*
 * `ctaBlock` was removed at `GS-P03`. Its only consumer was `service`, and an editable `href`
 * let a record point a service CTA anywhere — including at a price page. The label is now
 * `service.ctaLabel`; the destination is derived (`lib/services/architecture.ts`).
 */

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

/*
 * `pricingBlock` was removed at `GS-P03` (`GS-D002`, closing `GS-T001`). It enforced SC-6 —
 * "a service page physically cannot be saved without pricing" — which the bespoke-quotation
 * decision superseded. `check:schemas` now refuses a price, cost, fee or amount field on any
 * type, so the removal cannot quietly be undone by re-adding an optional one.
 *
 * The VAT position it carried survives on its own terms: Gridsmith is not VAT registered,
 * nothing may be presented as VAT-exclusive, and `check:vat` asserts that against served pages.
 */

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
// **One constant, imported.** This was a second transcription of the same six names; a copy
// with no check is a second source of truth waiting to disagree. `check:schemas` asserts the
// one in `lib/process/` against `_shared/00-PROCESS.md`, so importing it puts the schema behind
// that same assertion instead of beside it.
export const CANONICAL_STAGES = CANONICAL_TITLES;

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
  seoBlock,
  protectedImage,
  protectedVideo,
  processStep,
];
