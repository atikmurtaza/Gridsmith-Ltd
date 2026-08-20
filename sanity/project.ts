/**
 * The Sanity facts that are **constants**, separated from the one that is an environment
 * read — `M-P1-7`.
 *
 * `env.ts` throws at module load when `NEXT_PUBLIC_SANITY_DATASET` is unset. That is
 * deliberate and load-bearing (`M-P1-2`): on a host, an unset variable falling back to
 * `development` would publish a `[SEED]` VAT number, so the build must fail instead.
 *
 * But `check-launch-content` now reads the dataset **from the served site**, and it must be
 * able to run on a machine where that variable is not set — a CI runner or a laptop pointed at
 * a deployment. Importing `env.ts` for `SANITY_PROJECT_ID` alone made it throw on exactly the
 * machines the fix exists to support. The constants below depend on no environment, so they
 * live here and `env.ts` re-exports them; nothing about the fail-fast changes for the app.
 */
export const SANITY_PROJECT_ID = 'spzu6y31';
export const SANITY_API_VERSION = '2026-08-18';

/** The dataset name that means "live". The launch gate keys off this. */
export const PRODUCTION_DATASET = 'production';
