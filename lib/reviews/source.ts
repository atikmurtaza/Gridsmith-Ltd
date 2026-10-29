import type { PublicReview } from './public-model.ts';
import { REVIEW_ACTIVATION, reviewActivationProblems } from './activation.ts';
import { APPROVED_STAGING_REVIEWS } from './staging-approved.ts';

/**
 * GS-LEGAL-FINAL-001: written Freelancer permission and separate activation approval are pending.
 * GS-LAUNCH-026: the frozen set reaches a page only through a complete activation record bound to
 * that exact set (`activation.ts`). The record is empty, so this returns nothing and the reviews
 * section renders nothing at all — no heading, no empty carousel.
 */
export function listPublicReviews(): readonly PublicReview[] {
  return reviewActivationProblems(REVIEW_ACTIVATION, APPROVED_STAGING_REVIEWS).length ? [] : APPROVED_STAGING_REVIEWS;
}
