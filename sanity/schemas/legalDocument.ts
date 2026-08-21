import { defineArrayMember, defineField, defineType } from 'sanity';
import { LEGAL_DOCUMENT_SLUGS } from '../../lib/legal/slugs.ts';

/**
 * `L-01` — `master/SCHEMA.md` §"legalDocument".
 *
 * **The slug set is closed, and it is closed for the same reason `groupPage`'s is** (`N-03`):
 * a slug with no route is a published document that renders nowhere, and the failure is
 * silent. `check:schemas` runs the rule rather than trusting `options.list`, which Sanity
 * treats as a Studio affordance and does not enforce on write.
 *
 * **`client-terms` is a fifth slug the spec did not list**, and the deviation is recorded in
 * `master/SCHEMA.md` in this commit. The spec's four are the *website's* terms — terms of use,
 * privacy, cookies, accessibility — and none of them is the contract a client signs. Folding
 * engagement terms into `terms` would put a consumer-facing website notice and a B2B contract
 * behind one anchor space, and `anchorId` is cited by contracts (see below), so the two must
 * not share a numbering.
 *
 * **`anchorId` is a contract-facing identifier, not a convenience.** `_legal/` drafts cite
 * clause anchors, so renumbering is a version bump plus a redirect for the old anchor, never
 * an edit.
 */
// One list, imported. `/legal/[slug]` reads the same constant and must not import this
// file — see `lib/legal/slugs.ts` for what happens when it does.
const LEGAL_SLUGS = LEGAL_DOCUMENT_SLUGS;

export const legalClause = defineType({
  name: 'legalClause',
  type: 'object',
  fields: [
    defineField({ name: 'number', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'heading', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'body', type: 'array', of: [defineArrayMember({ type: 'block' })] }),
    defineField({
      name: 'anchorId',
      type: 'string',
      description: 'Stable across versions. Contracts cite these — renumbering needs a redirect.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'basis',
      type: 'string',
      description: 'The instrument this clause implements, e.g. "UK GDPR Art. 13(1)(a)".',
    }),
  ],
});

export const legalDocument = defineType({
  name: 'legalDocument',
  type: 'document',
  fields: [
    defineField({
      name: 'slug',
      type: 'slug',
      description: 'One of the five legal routes. A sixth slug is a new route, which is code, not content.',
      validation: (r) =>
        r.required().custom((slug: { current?: string } | undefined) =>
          typeof slug?.current === 'string' && (LEGAL_SLUGS as readonly string[]).includes(slug.current)
            ? true
            : `Legal document slug must be one of: ${LEGAL_SLUGS.join(', ')}`,
        ),
    }),
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'version', type: 'string' }),
    defineField({ name: 'effectiveFrom', type: 'date', validation: (r) => r.required() }),
    defineField({ name: 'lastReviewed', type: 'date' }),
    defineField({ name: 'reviewedBy', type: 'string', description: '"Solicitor — [firm]" or "Internal".' }),
    /**
     * **Defaults false, and that is the gate.** `master/SCHEMA.md`: an unapproved legal
     * document is treated by the production build check the same way seed content is. `L-04`
     * is the hard gate that flips it.
     */
    defineField({ name: 'solicitorApproved', type: 'boolean', initialValue: false }),
    defineField({ name: 'summary', type: 'text', rows: 3, description: 'Plain-English standfirst.' }),
    defineField({ name: 'clauses', type: 'array', of: [defineArrayMember({ type: 'legalClause' })] }),
    defineField({ name: 'previousVersions', type: 'array', of: [defineArrayMember({ type: 'file' })] }),
    defineField({ name: 'seo', type: 'seoBlock' }),
    defineField({
      name: 'isSeed',
      type: 'boolean',
      initialValue: false,
      readOnly: true,
      description: 'Placeholder content. Cannot be published in production.',
    }),
  ],
  preview: { select: { title: 'title', subtitle: 'version' } },
});
