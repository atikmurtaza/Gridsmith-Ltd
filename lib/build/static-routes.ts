import 'server-only';
import { readFileSync } from 'node:fs';
import { STATIC_BUILD } from './target';
import type { StaticManifest } from './route-manifest';

/** Build input lives outside the public artifact; normal requests never consult it. */
export function staticManifest(): StaticManifest {
  if (!STATIC_BUILD) throw new Error('Static manifest requested in normal profile');
  const input = process.env.GRIDSMITH_STATIC_MANIFEST_PATH;
  if (!input) throw new Error('Static build requires the prepared publication manifest');
  const manifest = JSON.parse(readFileSync(input, 'utf8')) as StaticManifest;
  const preview = manifest.dataset === 'development' && manifest.legalPreview === 'adopted-development' &&
    process.env.GRIDSMITH_LEGAL_PREVIEW === 'adopted-development' && process.env.NEXT_PUBLIC_SANITY_DATASET === 'development';
  if (manifest.version !== 1 || manifest.target !== 'static' || (!preview && manifest.dataset !== 'production') ||
      manifest.indexable !== false || !Array.isArray(manifest.routes)) {
    throw new Error('Invalid static publication manifest');
  }
  return manifest;
}

export function staticParams(contentType: string, division?: string) {
  return staticManifest().routes.filter((route) => route.eligible &&
    route.contentType === contentType && (!division || route.division === division))
    .map((route) => ({ slug: route.slug! }));
}
