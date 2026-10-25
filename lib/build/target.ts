import { REVIEW_STAGING_ORIGIN } from '../reviews/public-model.ts';

/** H4-A: production NODE_ENV never selects static delivery implicitly. */
export function resolveBuildTarget(value: string | undefined): 'normal' | 'static' {
  if (value === undefined || value === 'normal') return 'normal';
  if (value === 'static') return 'static';
  throw new Error('GRIDSMITH_BUILD_TARGET must be normal or static');
}

export const BUILD_TARGET = resolveBuildTarget(process.env.GRIDSMITH_BUILD_TARGET);
export const STATIC_BUILD = BUILD_TARGET === 'static';
/** GS-LAUNCH-017 owner authority is limited to this origin and production content. */
export function ownerPreviewAllowed(profile: string | undefined, origin: string | undefined, dataset: string | undefined) {
  return profile === 'owner-preview' && origin === REVIEW_STAGING_ORIGIN && dataset === 'production';
}
export type OwnerPreviewIdentity = { profile?: string; siteOrigin?: string; dataset?: string; legalPreview?: boolean;
  contactMode?: string; intakeOrigin?: string | null; rehearsal?: boolean; deployable?: boolean; releaseStatus?: string;
  sourceSha?: string; artifactIdentity?: string; sourceModified?: boolean;
  acceptance?: { sourceSha?: string; artifactIdentity?: string; evidenceSha256?: string; runId?: string } };
/** Shared served boundary: an owner preview cannot fall back to the historical development profile. */
export function ownerPreviewIdentityAllowed(identity: OwnerPreviewIdentity | null) {
  return Boolean(identity && ownerPreviewAllowed(identity.profile, identity.siteOrigin, identity.dataset) &&
    identity.legalPreview === true && identity.contactMode === 'direct' && identity.intakeOrigin === null &&
    identity.rehearsal === false && ((identity.deployable === false && identity.releaseStatus === 'ACCEPTANCE_PENDING') ||
      (identity.deployable === true && identity.releaseStatus === 'ACCEPTANCE_PASSED' && identity.sourceModified === false &&
        /^[a-f0-9]{40}$/.test(identity.sourceSha ?? '') && /^[a-f0-9]{64}$/.test(identity.artifactIdentity ?? '') &&
        identity.acceptance?.sourceSha === identity.sourceSha && identity.acceptance?.artifactIdentity === identity.artifactIdentity &&
        /^[a-f0-9]{64}$/.test(identity.acceptance?.evidenceSha256 ?? '') && /^\d+$/.test(identity.acceptance?.runId ?? ''))));
}
export const OWNER_PREVIEW = STATIC_BUILD && ownerPreviewAllowed(process.env.GRIDSMITH_STATIC_PROFILE,
  process.env.NEXT_PUBLIC_SITE_URL, process.env.NEXT_PUBLIC_SANITY_DATASET);
if (STATIC_BUILD && process.env.GRIDSMITH_STATIC_PROFILE === 'owner-preview' && !OWNER_PREVIEW) {
  throw new Error('Owner preview requires the exact temporary origin and production dataset');
}
// GS-LAUNCH-007: initial Hostinger launch offers direct contact; intake stays separately controlled.
export const DIRECT_CONTACT = STATIC_BUILD && (process.env.GRIDSMITH_STATIC_PROFILE === 'production' || OWNER_PREVIEW);
