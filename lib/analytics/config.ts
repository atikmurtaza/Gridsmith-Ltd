/**
 * Optional analytics configuration — `GS-LAUNCH-026`, `BEFORE-LAUNCH.md` item 22.
 *
 * Two providers, each switched on only by a **public** identifier given to the build. An unset
 * identifier means the provider does not exist on the site: the consent banner offers no choice for
 * it, the CSP names none of its hosts, and nothing can load it. A set-but-malformed one is a
 * configuration error, refused by `build-static` (`analyticsConfigProblems`) rather than shipped as
 * "off". Neither identifier is a secret — each is visible to every visitor who consents — but
 * neither belongs in source either: they are deployment configuration.
 *
 * PostHog is held to its EU host (item 22 step 7): a UK site posting behavioural data to PostHog's
 * US default is a Chapter V transfer whose failure is silent.
 */
export type AnalyticsConfig = { ga4: string | null; posthog: string | null };

export const GA4_ID = /^G-[A-Z0-9]{6,12}$/;
export const POSTHOG_KEY = /^phc_[A-Za-z0-9]{20,64}$/;
export const POSTHOG_HOST = 'https://eu.i.posthog.com';
export const POSTHOG_ASSETS = 'https://eu-assets.i.posthog.com';

export function readAnalyticsConfig(ga4: string | undefined, posthog: string | undefined): AnalyticsConfig {
  return { ga4: ga4 && GA4_ID.test(ga4) ? ga4 : null, posthog: posthog && POSTHOG_KEY.test(posthog) ? posthog : null };
}

/** This build's providers. Each `process.env.NEXT_PUBLIC_*` is read literally so Next inlines it. */
export const ANALYTICS = readAnalyticsConfig(process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID, process.env.NEXT_PUBLIC_POSTHOG_KEY);

/** Why these raw values must not be built. `[]` — including all three unset — is buildable. */
export function analyticsConfigProblems(ga4?: string, posthog?: string, host?: string): string[] {
  const p: string[] = [];
  if (ga4 && !GA4_ID.test(ga4)) p.push('NEXT_PUBLIC_GA4_MEASUREMENT_ID is set but is not a GA4 measurement ID (G-…)');
  if (posthog && !POSTHOG_KEY.test(posthog)) p.push('NEXT_PUBLIC_POSTHOG_KEY is set but is not a PostHog project API key (phc_…)');
  if (host && host !== POSTHOG_HOST) p.push(`NEXT_PUBLIC_POSTHOG_HOST must be unset or ${POSTHOG_HOST}: PostHog data stays in its EU region`);
  return p;
}

/**
 * CSP sources for the configured providers only, from each provider's published requirements
 * (Google tag CSP guide, "Google Analytics without any Ads features"; PostHog EU hosts). An
 * unconfigured build adds nothing, so its policy is byte-identical to the policy before analytics.
 */
export function analyticsCsp(config: AnalyticsConfig): { script: string; connect: string; img: string } {
  const join = (...parts: (string | false | null)[]) => parts.filter(Boolean).join(' ');
  return {
    script: join(config.ga4 && 'https://www.googletagmanager.com', config.posthog && POSTHOG_ASSETS),
    connect: join(config.ga4 && 'https://www.googletagmanager.com https://*.google-analytics.com https://*.google.com',
      config.posthog && `${POSTHOG_HOST} ${POSTHOG_ASSETS}`),
    img: join(config.ga4 && 'https://www.googletagmanager.com https://*.google-analytics.com'),
  };
}
