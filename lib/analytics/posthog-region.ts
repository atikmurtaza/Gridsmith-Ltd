/**
 * PostHog region check — its own module so that **one predicate serves both the loader and
 * the gate**, rather than the gate carrying a copy that can drift from the thing it checks.
 *
 * It has no relative imports on purpose. `scripts/check-axe.mjs` imports it under Node's type
 * stripping, which requires an explicit `.ts` extension on every relative specifier it
 * reaches; keeping this file dependency-free means the app can import it extensionless the
 * way webpack expects and the gate can still reach it.
 *
 * **PostHog's documented default is `https://us.i.posthog.com`.** A UK site posting
 * behavioural data there is a UK GDPR Chapter V transfer question, not a misconfiguration to
 * tidy up later — and it is silent, because everything works and only the jurisdiction is
 * wrong.
 */
const EU_POSTHOG =
  /^https:\/\/(?:eu\.i\.posthog\.com|eu-assets\.i\.posthog\.com|[a-z0-9-]+\.posthog\.eu)$/;

export function isEuPostHogHost(host: string): boolean {
  return EU_POSTHOG.test(host.replace(/\/$/, ''));
}
