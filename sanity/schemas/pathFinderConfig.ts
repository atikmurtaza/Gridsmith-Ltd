import { defineArrayMember, defineField, defineType } from 'sanity';

/**
 * `pathFinderConfig` and its three objects — `K-01`, `press/SCHEMA.md` §3.
 *
 * The Path Finder asks five questions and returns one of six outcomes. **Two of the six
 * recommend against Gridsmith**, and non-negotiable #9 says they may never be removed: *"The
 * Path Finder must be able to recommend against Gridsmith. Schema-enforced and audited."*
 *
 * ## Why the honesty rule is a schema rule and not a component rule
 *
 * `press/SCHEMA.md` §3 puts it plainly: the realistic long-term risk is not that someone
 * disagrees with the honest outcomes today, it is that someone looks at the conversion numbers
 * in a year and quietly deletes them. A component can be edited in one commit by one person. A
 * document that **cannot be saved** without two non-Gridsmith outcomes cannot be edited around
 * from the Studio at all, which is where a content decision like that would actually be made.
 *
 * So `outcomes` carries a custom rule with three limbs — at least two non-Gridsmith outcomes,
 * none of them showing a CTA, and each carrying real external guidance. All three are `ETH-04`.
 *
 * ## The rule is run, not counted
 *
 * `r.custom(() => true)` calls `.custom()` too. `check:schemas` therefore runs this rule
 * against constructed outcome sets rather than asserting a rule exists — `ETH_04_CASES` in
 * that file — because a permissive rule is the failure a presence check cannot see, and this
 * repository has shipped that exact defect twice.
 *
 * ## What is deliberately NOT here
 *
 * No question text, no outcome copy, no rules. Those are content and they are Epic O's — this
 * row is the shape. `recommend.ts` (`K-03`) is the pure function that evaluates `rules` against
 * answers; nothing in this file decides an outcome.
 */

/** One of the five questions. `key` is what `pathRule.conditions[].questionKey` refers to. */
export const pathQuestion = defineType({
  name: 'pathQuestion',
  type: 'object',
  fields: [
    defineField({ name: 'key', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'question', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'helpText',
      type: 'text',
      rows: 2,
      description: 'Plain language. Persona P2 is deciding whether to trust the process at all.',
    }),
    defineField({
      name: 'options',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'pathOption',
          fields: [
            defineField({ name: 'key', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'label', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'note', type: 'string' }),
          ],
        }),
      ],
      validation: (r) => r.min(2),
    }),
  ],
  preview: { select: { title: 'question', subtitle: 'key' } },
});

/**
 * The six outcomes. The `key` list is **closed**, and closure is the guarantee.
 *
 * A free-text key lets a content edit rename `self-service` to something that is no longer a
 * recommendation away from Gridsmith while every gate stays green — `groupPage.slug`'s reason,
 * applied to the field non-negotiable #9 depends on. `check:schemas` asserts the set in both
 * directions and runs the rule, because `options.list` is a Studio affordance that Sanity does
 * not enforce on write.
 */
export const PATH_OUTCOME_KEYS = [
  'full-package',
  'ghostwriting',
  'assessment-first',
  'content-programme',
  'self-service',
  'not-ready',
] as const;

export const pathOutcome = defineType({
  name: 'pathOutcome',
  type: 'object',
  fields: [
    defineField({
      name: 'key',
      type: 'string',
      options: { list: [...PATH_OUTCOME_KEYS] },
      validation: (r) =>
        r
          .required()
          .custom((value) =>
            value === undefined ||
            (PATH_OUTCOME_KEYS as readonly string[]).includes(value)
              ? true
              : `Outcome key must be one of: ${PATH_OUTCOME_KEYS.join(', ')}`,
          ),
    }),
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'explanation', type: 'text', rows: 4, validation: (r) => r.required() }),
    defineField({
      name: 'isGridsmithService',
      type: 'boolean',
      initialValue: true,
      description: 'False for self-service and not-ready. The honest outcomes.',
    }),
    defineField({
      name: 'linkedService',
      type: 'reference',
      to: [{ type: 'service' }],
      description: 'Null when isGridsmithService is false — there is nothing of ours to link to.',
    }),
    defineField({
      name: 'externalGuidance',
      type: 'text',
      rows: 4,
      description:
        'Required when isGridsmithService is false. This is the substance of the honest ' +
        'outcome: what to actually do instead. An empty one is a dead end wearing honesty.',
    }),
    defineField({
      name: 'externalLinks',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'externalLink',
          fields: [
            defineField({ name: 'label', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'url', type: 'url', validation: (r) => r.required() }),
          ],
        }),
      ],
    }),
    /**
     * **Never true on a non-Gridsmith outcome** — `ETH-04`, and `K-07` renders no button on
     * E/F. Enforced on the array rather than here, because the constraint is a relation
     * between two fields of the same object and Sanity's field-level rule sees one value.
     */
    defineField({ name: 'showCta', type: 'boolean', initialValue: false }),
  ],
  preview: { select: { title: 'title', subtitle: 'key' } },
});

/** A rule maps a set of answers to an outcome key. `K-03` evaluates these; nothing here does. */
export const pathRule = defineType({
  name: 'pathRule',
  type: 'object',
  fields: [
    defineField({
      name: 'conditions',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'pathCondition',
          fields: [
            defineField({ name: 'questionKey', type: 'string', validation: (r) => r.required() }),
            defineField({
              name: 'operator',
              type: 'string',
              options: { list: ['is', 'in', 'not'] },
              validation: (r) => r.required(),
            }),
            defineField({ name: 'value', type: 'string', validation: (r) => r.required() }),
          ],
        }),
      ],
      validation: (r) => r.min(1),
    }),
    defineField({ name: 'outcome', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'priority',
      type: 'number',
      description: 'Lower wins. Ties are a content error and K-04 is the run that finds them.',
      validation: (r) => r.required(),
    }),
  ],
  preview: { select: { title: 'outcome', subtitle: 'priority' } },
});

/**
 * **The ETH-04 rule, as a named export so `check:schemas` runs the same function the Studio
 * runs rather than a copy of it.**
 *
 * Three limbs, each its own message, because a single combined message makes a gate that
 * proves one limb look like a gate that proved all three — `CLAUDE.md`'s multi-branch rule,
 * and `check:rls` is the instance that motivated it.
 *
 * @param {unknown} outcomes the `outcomes` array as the Studio holds it
 */
export function ethicsRule(outcomes: unknown): true | string {
  if (!Array.isArray(outcomes)) return true; // r.min() owns absence; this rule owns composition.
  const nonGridsmith = outcomes.filter((o) => o && !o.isGridsmithService);
  if (nonGridsmith.length < 2) {
    return 'At least two non-Gridsmith outcomes (self-service, not-ready) are required';
  }
  if (nonGridsmith.some((o) => o.showCta)) {
    return 'Non-Gridsmith outcomes must not display a CTA';
  }
  if (nonGridsmith.some((o) => !o.externalGuidance)) {
    return 'Non-Gridsmith outcomes require honest external guidance';
  }
  return true;
}

export const pathFinderConfig = defineType({
  name: 'pathFinderConfig',
  type: 'document',
  fields: [
    defineField({
      name: 'version',
      type: 'number',
      initialValue: 1,
      description: 'Bumped when the questions or rules change. K-08 records it against a result.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'questions',
      type: 'array',
      of: [defineArrayMember({ type: 'pathQuestion' })],
      validation: (r) => r.length(5),
    }),
    defineField({
      name: 'outcomes',
      type: 'array',
      of: [defineArrayMember({ type: 'pathOutcome' })],
      validation: (r) => r.min(6).custom(ethicsRule),
    }),
    defineField({
      name: 'rules',
      type: 'array',
      of: [defineArrayMember({ type: 'pathRule' })],
      validation: (r) => r.min(1),
    }),
    defineField({
      name: 'isSeed',
      type: 'boolean',
      initialValue: false,
      readOnly: true,
      description: 'Set by the seed script. check:launch refuses a published seed on production.',
    }),
  ],
  preview: { select: { subtitle: 'version' }, prepare: ({ subtitle }) => ({ title: 'Path Finder', subtitle: `v${subtitle}` }) },
});
