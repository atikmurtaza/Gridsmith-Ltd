/**
 * Sanity connection facts. **The project id is a committed constant, not an env var.**
 *
 * It is public by construction — every Sanity client that reaches the API from a browser
 * carries it — so an env var would add a build-time failure mode and hide nothing. The
 * dataset is the variable, because it is the thing that actually changes: `development`
 * holds seed, placeholder and test content, `production` holds live website content only,
 * and the two share one schema folder (never two).
 *
 * **There is no default, and that is `M-P1-2`'s fix — `A-12`.** It used to fall back to
 * `development`, which is right in CI and wrong on a host: an unset variable on the
 * Hostinger deployment would have served `[SEED] GB000000000` as the company's VAT
 * registration number on every page. A false VAT statement on a public website is precisely
 * what `check:launch`'s production tier exists to prevent, and a silent fallback defeated it
 * through an environment CI cannot see.
 *
 * So an unset variable is a **build error**, not a guess. That is the one remedy with no
 * environment it cannot see: the other options considered — detect a deployed host, or check
 * the live response after deploy — both depend on recognising a platform, and this build now
 * runs on one nobody has deployed to yet. `.env.example`, `ci.yml` and `SETUP.md` all set it
 * explicitly.
 *
 * Both datasets are public, so nothing here reads a token. `SANITY_API_WRITE_TOKEN` exists
 * only for the seed script, only from `.env.local`, and never reaches the build.
 */
export const SANITY_PROJECT_ID = 'spzu6y31';
export const SANITY_API_VERSION = '2026-08-18';

/** The dataset name that means "live". The launch gate keys off this. */
export const PRODUCTION_DATASET = 'production';

const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
if (!dataset) {
  throw new Error(
    'NEXT_PUBLIC_SANITY_DATASET is not set, and there is deliberately no default (M-P1-2).' +
      '\n  Local:  cp .env.example .env.local   (development)' +
      '\n  CI:     set in .github/workflows/ci.yml' +
      '\n  Host:   set it in the platform environment. Unset would have served seed content.',
  );
}
export const SANITY_DATASET = dataset;
