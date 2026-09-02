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
    defineField({ name: 'businessHours', type: 'string' }),
    defineField({ name: 'piInsurer', type: 'string' }),
    defineField({ name: 'piCoverLimit', type: 'string' }),
    defineField({ name: 'icoRegistration', type: 'string' }),
  ],
  preview: { select: { title: 'legalName', subtitle: 'companyNumber' } },
});
