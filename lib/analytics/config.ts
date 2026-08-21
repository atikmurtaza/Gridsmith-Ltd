/**
 * The analytics ids as the **build** inlined them, and the page's self-report of them.
 *
 * `NEXT_PUBLIC_*` is substituted at build time, so these three constants are literally what
 * the shipped bundle believes. That is the fact `check-axe`'s grant path needs, and `M-P1-6`
 * is what happens when a gate guesses it instead.
 *
 * **Why this is a separate module from `load.ts`.** `ConsentBanner` imports `load.ts`
 * dynamically on purpose — statically importing it put 0.8KB in the shared layout chunk. But
 * the report has to exist *before* a consent choice, because the gate uses it to decide
 * whether the grant path can be exercised at all, and nothing has loaded `load.ts` at that
 * point. So the constants live here, both modules import them, and only this file — three
 * strings and an assignment — reaches the layout chunk.
 *
 * Booleans and the host on the reported object, never the ids. The host is already in the
 * bundle and is the thing the EU assertion measures; the keys are not restated.
 */
export const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID ?? '';
export const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY ?? '';
export const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://eu.i.posthog.com';

declare global {
  interface Window {
    __gsAnalyticsConfigured?: { ga4: boolean; posthog: boolean; posthogHost: string };
  }
}

/**
 * Called by `ConsentBanner` on mount — the one client component on every route, and the one
 * that is present before any choice is made. A page that stops publishing this is a gate
 * subject that has stopped being one, and `check-axe` fails rather than reading the absence
 * as "unconfigured".
 */
export function publishAnalyticsConfig(): void {
  window.__gsAnalyticsConfigured = {
    ga4: Boolean(GA4_ID),
    posthog: Boolean(POSTHOG_KEY),
    posthogHost: POSTHOG_HOST,
  };
}
