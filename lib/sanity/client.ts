import { createClient } from '@sanity/client';
import { SANITY_API_VERSION, SANITY_DATASET, SANITY_PROJECT_ID } from '@/sanity/env';

/**
 * The read client. Server-side only — no route imports this into a Client Component, and
 * `check:secrets` sweeps the built chunks for anything that looks like a token.
 *
 * No token is configured at all, deliberately rather than incidentally: both datasets are
 * public, so a read token would be a credential the build does not need and could leak.
 * `useCdn: false` because every read here happens at build time during static generation —
 * the CDN's stale window buys nothing and can serve content older than the deploy.
 */
export const sanityClient = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: SANITY_API_VERSION,
  useCdn: false,
  perspective: 'published',
});
