import type { LegalDocument } from '../lib/sanity/queries';

type GeneratedLegalDocument = LegalDocument & {
  _id: string;
  _type: 'legalDocument';
  slug: { _type: 'slug'; current: string };
};

export const LEGAL_DOCUMENTS: GeneratedLegalDocument[];
/** GS-LAUNCH-026: the revision set an owner-preview build may display, each at OWNER_REVIEW_REQUIRED. */
export const ACTIVE_LEGAL_PROPOSAL: string | null;
export function legalProposalDocuments(id: string): GeneratedLegalDocument[];
