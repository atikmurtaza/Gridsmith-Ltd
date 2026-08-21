import { defineField, defineType } from 'sanity';

/**
 * `companyDetails` — the singleton (`M-05`).
 *
 * Every statutory footer, legal page header and form confirmation renders from this
 * document. Nothing hardcodes a company fact in a component; `master/PROJECT-RULES.md` §8
 * says the same about `responseCommitment` specifically, and the reason generalises — a
 * value that exists in two places drifts in one of them.
 *
 * **`vatNumber` is a required field with a known-empty value, not an absent one.** Gridsmith
 * will be VAT registered before launch, so the registered case is what is built: the footer
 * renders the line whenever the field is non-empty and omits it when empty, and supplying
 * the number is a content edit — no schema change, no code change, no deploy. It carries no
 * Sanity `required` rule because that would block every save until registration completes;
 * the constraint that matters is enforced at the launch boundary instead, by
 * `check:launch-content`, which fails if the dataset is `production` and this is empty.
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
    defineField({
      name: 'vatNumber',
      type: 'string',
      description:
        'Empty until registration completes. The footer omits the line while it is empty, and the launch gate refuses a production dataset without it.',
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
