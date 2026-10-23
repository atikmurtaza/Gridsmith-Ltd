/** H4-A: production NODE_ENV never selects static delivery implicitly. */
export function resolveBuildTarget(value: string | undefined): 'normal' | 'static' {
  if (value === undefined || value === 'normal') return 'normal';
  if (value === 'static') return 'static';
  throw new Error('GRIDSMITH_BUILD_TARGET must be normal or static');
}

export const BUILD_TARGET = resolveBuildTarget(process.env.GRIDSMITH_BUILD_TARGET);
export const STATIC_BUILD = BUILD_TARGET === 'static';
// GS-LAUNCH-007: initial Hostinger launch offers direct contact; intake stays separately controlled.
export const DIRECT_CONTACT = STATIC_BUILD && process.env.GRIDSMITH_STATIC_PROFILE === 'production';
