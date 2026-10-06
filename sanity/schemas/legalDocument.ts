import { defineArrayMember, defineField, defineType } from 'sanity';
import { LEGAL_DOCUMENT_SLUGS } from '../../lib/legal/slugs.ts';
import { ADOPTION_STATES } from '../../lib/legal/adoption.ts';

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
    defineField({
      name: 'reviewedBy',
      type: 'string',
      description: 'Who reviewed this version and how, stated plainly (e.g. "Owner — adopted after the GS-LEGAL-001 review").',
    }),
    /**
     * `GS-O003-R` (`lib/legal/adoption.ts`), replacing the `solicitorApproved` boolean on
     * 6 October 2026 (owner decision, `GS-LEGAL-001`). Only `PUBLISHABLE` documents enter the
     * production dataset — `migrate-production-cms.mjs` reads the committed register
     * `docs/_legal/GS-O003-R-REGISTER.json`, not this field, so a Studio edit cannot publish
     * an unadopted document. The field describes the state to the reader of the page.
     */
    defineField({
      name: 'adoptionState',
      type: 'string',
      initialValue: 'RESEARCHED',
      options: { list: [...ADOPTION_STATES] },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'ownerAdoptedOn', type: 'date', description: 'Set only when the owner adopts this exact version.' }),
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
