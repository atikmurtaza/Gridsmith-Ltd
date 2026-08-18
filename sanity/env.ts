/**
 * Sanity connection facts. **The project id is a committed constant, not an env var.**
 *
 * It is public by construction — every Sanity client that reaches the API from a browser
 * carries it — so an env var would add a build-time failure mode and hide nothing. The
 * dataset is the variable, because it is the thing that actually changes: `development`
 * holds seed, placeholder and test content, `production` holds live website content only,
 * and the two share one schema folder (never two).
 *
 * **Defaults to `development` until Stage 8.** A missing variable must not silently select
 * live content; it selects the dataset whose content is allowed to be wrong.
 *
 * Both datasets are public, so nothing here reads a token. `SANITY_API_WRITE_TOKEN` exists
 * only for the seed script, only from `.env.local`, and never reaches the build.
 */
export const SANITY_PROJECT_ID = 'spzu6y31';
export const SANITY_API_VERSION = '2026-08-18';

/** The dataset name that means "live". The launch gate keys off this. */
export const PRODUCTION_DATASET = 'production';

export const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'development';
