import { APPROVED_STAGING_REVIEWS } from './staging-approved';
import { stagingReviewsAllowed, type PublicReview } from './public-model';

/** H4-D-R1 frozen staging source. No API, cache, refresh or automatic publication. */
export function listPublicReviews(): readonly PublicReview[] {
  if (process.env.GRIDSMITH_REVIEW_PRESENTATION !== 'owner-staging') return [];
  if (!stagingReviewsAllowed(process.env.GRIDSMITH_REVIEW_PRESENTATION, process.env.NEXT_PUBLIC_SITE_URL)) {
    throw new Error('Freelancer written permission required before final production review publication');
  }
  return APPROVED_STAGING_REVIEWS;
}
