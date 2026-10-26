import type { LegalDocument } from '../lib/sanity/queries';

export const LEGAL_DOCUMENTS: (LegalDocument & {
  _id: string;
  _type: 'legalDocument';
  slug: { _type: 'slug'; current: string };
})[];
