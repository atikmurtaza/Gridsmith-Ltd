import { defineArrayMember, defineField, defineType } from 'sanity';

/**
 * `continuityExample` — the evidence for `/approach` (`N-05`, `master/SCHEMA.md` §2).
 *
 * **Premise check: every figure here is a structural minimum, not a measurement or a
 * projection.** `rows.min(4)` and `divisionsInvolved.min(2)` are completeness rules — a
 * two-row table does not show continuity, and a single-division example is not cross-division
 * by definition. `relationshipMonths` is a data field with no asserted value. `DESIGN.md` §5's
 * "Month 1 / Month 18" is an **illustration of the two-column shape, not a constant**; the
 * component reads the real span from `relationshipMonths` and hardcodes nothing.
 *
 * ## `verified` is hard-true, and that collides with the seed policy on purpose
 *
 * `master/SCHEMA.md` §2: *"The continuity principle is the group's entire commercial argument;
 * illustrating it with an invented example would be the most damaging possible piece of
 * content on the site."* So `verified` must be `true` — not defaulted to it, **required to be
 * it**, which means a document asserting the opposite cannot be saved.
 *
 * **The consequence is that there can be no seed continuity example, and that is not an
 * oversight.** `FOUNDATION` §7 requires seed records to be structurally complete; completeness
 * here would mean `verified: true`; and a seed record claiming to have been verified against
 * real project records is a lie of exactly the kind this constraint exists to prevent. The two
 * rules do not both apply — the honesty rule wins, and the type simply has no placeholder
 * variant.
 *
 * `isSeed` is still present because `check:schemas` requires it group-wide and `A-12` reads it,
 * but nothing will ever set it: a seeded example would have to be a verified one.
 *
 * **So `/approach` must render without this document.** `ContinuityExample` returns an empty
 * state rather than assuming content exists, and `Q-M6` is the blocker for a real one.
 */
export const continuityRow = defineType({
  name: 'continuityRow',
  type: 'object',
  fields: [
    defineField({ name: 'label', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'monthOne', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'monthLater', type: 'string', validation: (r) => r.required() }),
  ],
  preview: { select: { title: 'label', subtitle: 'monthLater' } },
});

export const continuityExample = defineType({
  name: 'continuityExample',
  type: 'document',
  fields: [
    defineField({
      name: 'clientDisplay',
      type: 'string',
      description: 'Anonymised is fine — "A UK M&E contractor". The claim is the continuity, not the name.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'rows',
      type: 'array',
      of: [defineArrayMember({ type: 'continuityRow' })],
      validation: (r) => r.min(4),
    }),
    defineField({
      name: 'relationshipMonths',
      type: 'number',
      description: 'The real span. The component reads this; it does not assume 18.',
      validation: (r) => r.required().min(1),
    }),
    defineField({
      name: 'divisionsInvolved',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      options: { list: ['design', 'digital', 'press'] },
      validation: (r) => r.min(2),
    }),
    /**
     * **Hard-true.** `r.required()` alone would accept `false`; the custom rule is what refuses
     * it. `check:schemas` runs this rule against both values rather than checking that a rule
     * exists — a rule that is present and permissive is the failure mode a presence check
     * cannot see.
     */
    defineField({
      name: 'verified',
      type: 'boolean',
      initialValue: false,
      description: 'Must be true. Verified against real project records — not "seems right".',
      validation: (r) =>
        r.custom((value) =>
          value === true || 'Continuity examples must be verified against real project records',
        ),
    }),
    defineField({
      name: 'isSeed',
      type: 'boolean',
      initialValue: false,
      readOnly: true,
      description: 'Never set on this type — a seeded continuity example would have to claim it was verified.',
    }),
  ],
  preview: { select: { title: 'clientDisplay', subtitle: 'relationshipMonths' } },
});
