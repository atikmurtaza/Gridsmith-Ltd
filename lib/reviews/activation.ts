/**
 * Freelancer review activation — `GS-LAUNCH-026`. **The only route by which a review can reach a
 * page, and it is closed.**
 *
 * Freelancer's User Agreement (last modified 5 June 2025) §11 says feedback, ratings and reviews
 * belong to Freelancer and may not be used, marketed or exported outside a Freelancer website
 * without its prior written permission; §4 forbids displaying or exporting feedback for purposes
 * unrelated to the platform. Public availability, attribution, a link to the profile, anonymising
 * the reviewer, owner approval and the absence of a takedown are none of them that permission
 * (`docs/_shared/GS-HOST-H4-C.md`). So every field below starts empty, and an empty or partial
 * record keeps `listPublicReviews()` empty and the build's no-review artifact gate in force.
 *
 * To activate, a later task records — never infers — all of: Freelancer's written permission
 * covering off-platform display of the review text and star ratings on gridsmith.uk (private
 * evidence reference, date received, scope as granted); a fresh check of the source profile; the
 * owner's separate activation approval; and the SHA-256 of the exact approved review set, so the
 * approval cannot follow a changed text. Reviewer names are never stored or shown: each card
 * carries the fixed `REVIEWER_MASK` (`public-model.ts`), so no name can be inferred from its length
 * or initials.
 */
import { createHash } from 'node:crypto';
import type { PublicReview } from './public-model.ts';
import { REVIEW_SOURCE_URL } from './public-model.ts';

export type ReviewActivation = Readonly<{
  providerPermission: Readonly<{ grantor: 'Freelancer'; reference: string; receivedOn: string; scope: string }> | null;
  sourceVerified: Readonly<{ profileUrl: string; verifiedOn: string }> | null;
  ownerActivation: Readonly<{ approvedOn: string; reference: string }> | null;
  reviewSetSha256: string | null;
}>;

/** Nothing has been granted. Do not fill a field without the document it names. */
export const REVIEW_ACTIVATION: ReviewActivation = Object.freeze({
  providerPermission: null,
  sourceVerified: null,
  ownerActivation: null,
  reviewSetSha256: null,
});

const DATE = /^\d{4}-\d{2}-\d{2}$/;
export const reviewSetSha256 = (reviews: readonly PublicReview[]) =>
  createHash('sha256').update(JSON.stringify(reviews)).digest('hex');

/** Every reason these reviews may not be shown. `[]` only for a complete record bound to this exact set. */
export function reviewActivationProblems(record: ReviewActivation, reviews: readonly PublicReview[]): string[] {
  const p: string[] = [];
  const permission = record.providerPermission;
  if (!permission || permission.grantor !== 'Freelancer' || !permission.reference.trim() || !DATE.test(permission.receivedOn) ||
      !/gridsmith\.uk/i.test(permission.scope) || !/rating/i.test(permission.scope) || !/review/i.test(permission.scope)) {
    p.push('PERMISSION: no recorded written Freelancer permission covering review text and ratings on gridsmith.uk');
  }
  if (!record.sourceVerified || record.sourceVerified.profileUrl !== REVIEW_SOURCE_URL || !DATE.test(record.sourceVerified.verifiedOn)) {
    p.push('SOURCE: the review source profile has not been re-verified');
  }
  if (!record.ownerActivation || !DATE.test(record.ownerActivation.approvedOn) || !record.ownerActivation.reference.trim()) {
    p.push('OWNER: no separate owner activation approval');
  }
  if (!reviews.length || record.reviewSetSha256 !== reviewSetSha256(reviews)) p.push('SET: approval is not bound to this exact review set');
  return p;
}
