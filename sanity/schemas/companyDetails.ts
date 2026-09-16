import { defineField, defineType } from 'sanity';

/**
 * `companyDetails` — the singleton (`M-05`).
 *
 * Every statutory footer, legal page header and form confirmation renders from this
 * document. Nothing hardcodes a company fact in a component; `master/PROJECT-RULES.md` §8
 * says the same about `responseCommitment` specifically, and the reason generalises — a
 * value that exists in two places drifts in one of them.
 *
 * **There is no `vatNumber` field, and its absence is the decision.** Gridsmith is not VAT
 * registered, so e-commerce regs reg. 6(1)(g) — which binds only *"where the provider
 * undertakes an activity subject to VAT"* — is not engaged, and publishing a number would be
 * a false disclosure. The field is removed rather than left empty so that no rendering path
 * can put one back without a schema change. Prices are the amount charged, stated plainly;
 * they carry no VAT-inclusive or VAT-exclusive label. If registration ever completes, this
 * field, the footer line, the `/about` row and the price labelling return together.
 *
 * **There is no `businessHours` field either, and its absence is the same kind of decision.**
 * `GS-O004` (16 September 2026): the owner does not authorise published opening hours. The
 * field existed, was never populated, and every render site guarded it with `? :` — which is
 * a surface waiting for a value rather than a decision. Removing it means a later session
 * cannot publish hours by filling in a blank in the Studio; it would have to change the
 * schema, which is a visible act. `check:company` question 5 asserts the absence on the
 * served pages, because a schema check cannot see what a page renders.
 *
 * **`contactPhone` is populated as of `GS-O004`** and is rendered on the contact routes and
 * in the statutory footer. It is stored in display form (`+44 7405 448534`); the `tel:` href
 * is derived from it at render time by `lib/company/companyDetails.ts`, so the site holds one
 * phone string and not two.
 */
export const companyDetails = defineType({
  name: 'companyDetails',
  title: 'Company details',
  type: 'document',
  fields: [
    defineField({ name: 'legalName', type: 'string', initialValue: 'Gridsmith Ltd', validation: (r) => r.required() }),
    defineField({ name: 'companyNumber', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'placeOfRegistration', type: 'string', initialValue: 'England & Wales', validation: (r) => r.required() }),
    defineField({ name: 'registeredOffice', type: 'text', rows: 4, validation: (r) => r.required() }),
    defineField({
      name: 'tradingAddress',
      type: 'text',
      rows: 4,
      description: 'Leave empty when it is the same as the registered office.',
    }),
    defineField({ name: 'tradingNames', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'contactEmail', type: 'string' }),
    defineField({ name: 'contactPhone', type: 'string' }),
    defineField({ name: 'responseCommitment', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'piInsurer', type: 'string' }),
    defineField({ name: 'piCoverLimit', type: 'string' }),
    defineField({ name: 'icoRegistration', type: 'string' }),
  ],
  preview: { select: { title: 'legalName', subtitle: 'companyNumber' } },
});
