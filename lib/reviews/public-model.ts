/** Sanitised public presentation contract, independent of the current data source. */
export const REVIEW_STAGING_ORIGIN = 'https://mediumaquamarine-wallaby-594070.hostingersite.com';
export const REVIEW_SOURCE_LABEL = 'Verified Freelancer review';
export const REVIEW_SOURCE_URL = 'https://www.freelancer.com/u/GridsmithLTD';

export type PublicReview = Readonly<{
  key: string;
  reviewText: string;
  rating: number;
  country?: Readonly<{ code: string; label: string; flag: string }>;
  sourceLabel: string;
  sourceUrl: string;
}>;

/** Closed staging boundary: neither anonymisation nor owner approval is provider permission. */
export function stagingReviewsAllowed(presentation: string | undefined, site: string | undefined) {
  if (presentation !== 'owner-staging' || !site) return false;
  try {
    const url = new URL(site);
    return (url.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(url.hostname)) ||
      url.origin === REVIEW_STAGING_ORIGIN;
  } catch { return false; }
}
