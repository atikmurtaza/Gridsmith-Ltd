import 'server-only';
import { readFileSync } from 'node:fs';
import { STATIC_BUILD, OWNER_PREVIEW } from './target';
import type { StaticManifest } from './route-manifest';
import { PRODUCTION_ORIGIN } from './production';

/** Build input lives outside the public artifact; normal requests never consult it. */
export function staticManifest(): StaticManifest {
  if (!STATIC_BUILD) throw new Error('Static manifest requested in normal profile');
  const input = process.env.GRIDSMITH_STATIC_MANIFEST_PATH;
  if (!input) throw new Error('Static build requires the prepared publication manifest');
  const manifest = JSON.parse(readFileSync(input, 'utf8')) as StaticManifest;
  const preview = manifest.dataset === 'development' && manifest.legalPreview === 'adopted-development' &&
    process.env.GRIDSMITH_LEGAL_PREVIEW === 'adopted-development' && process.env.NEXT_PUBLIC_SANITY_DATASET === 'development';
  const ownerPreview = OWNER_PREVIEW && manifest.dataset === 'production' && manifest.legalPreview === 'adopted-owner';
  // GS-LAUNCH-026: a revision proposal is only ever an owner-preview display, named by the build.
  const proposalValid = manifest.legalProposal === undefined ||
    (ownerPreview && manifest.legalProposal === process.env.GRIDSMITH_LEGAL_PROPOSAL);
  if (manifest.version !== 1 || manifest.target !== 'static' || (!preview && manifest.dataset !== 'production') ||
      (manifest.legalPreview && !preview && !ownerPreview) || !proposalValid ||
      manifest.indexable !== productionProfile(manifest) || !Array.isArray(manifest.routes)) {
    throw new Error('Invalid static publication manifest');
  }
  return manifest;
}

/** GS-R13: only the explicit gridsmith.uk profile over the production dataset may be indexable. */
function productionProfile(manifest: StaticManifest) {
  return process.env.GRIDSMITH_STATIC_PROFILE === 'production' && manifest.dataset === 'production' &&
    process.env.NEXT_PUBLIC_SITE_URL === PRODUCTION_ORIGIN;
}

export function staticParams(contentType: string, division?: string) {
  return staticManifest().routes.filter((route) => route.eligible &&
    route.contentType === contentType && (!division || route.division === division))
    .map((route) => ({ slug: route.slug! }));
}
