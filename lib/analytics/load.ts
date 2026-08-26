import type { Consent } from '@/lib/consent/state';
import { isAiReferral, trafficSource } from './referral';
import { isEuPostHogHost } from './posthog-region';
import type { EventContext, EventName, EventProps } from './events';

/**
 * Consent-gated analytics loading (`A-09`).
 *
 * **Nothing is injected until `analytics_storage` is granted, and "injected" is the whole
 * point** — `PROJECT-RULES.md` §6 says "not loaded-and-suppressed". A script that is
 * present and told not to record has already made the request, and the request itself
 * carries the visitor's IP address and user-agent to a third party. PECR is about the
 * storage, not the intent, and UK GDPR is about the transmission either way. So the tags
 * are appended to the document at grant time and never before.
 *
 * **This docstring used to add "and, for GA4, already set the cookie". That was wrong, and
 * it was settled by measurement rather than by reading.** A clean production build of this
 * tree was loaded with `NEXT_PUBLIC_GA4_ID` and `NEXT_PUBLIC_POSTHOG_KEY` both present —
 * the page's own `__gsAnalyticsConfigured` reported `{ga4: true, posthog: true}`, so this
 * is a reading from a configured environment and not from an empty one. In all three
 * consent states the only cookie on the site is `gs_consent`: no `_ga`, no `_ga_*`, no
 * PostHog cookie, and `localStorage` and `sessionStorage` empty throughout.
 *
 * The reason is below, in `loadAnalytics` itself. `inject` appends the loader and nothing
 * else. `gtag/js?id=…` fetches the container and fires `gtm.dom`/`gtm.load`, but a GA4 tag
 * is only instantiated by a `gtag('config', …)` call, and no `gtag()` call exists anywhere
 * in this repository — `window.gtag` stays `undefined` after a grant. Same shape for
 * PostHog: `array.js` defines the stub, `window.posthog.__loaded` stays `false`, and no
 * `posthog.init()` call exists either. Both libraries load and sit inert.
 *
 * **So the cookie policy is right and this file was wrong**, and the reasoning above
 * survives the correction: injection is still the thing that must wait for consent,
 * because the request goes out either way. `01-FACTUAL-INVENTORY.md` §1.3 and
 * `COOKIE-POLICY.md` §2/§4 record the same measurement; `docs/_legal/03-REVISION-LOG.md`
 * carries the finding that consent is currently collected for two libraries that record
 * nothing. Whether to initialise them or to stop asking is the owner's decision (OQ-7).
 * **Any commit that adds an initialisation call must rewrite this docstring, both of those
 * §s, and the cookie tables in the same commit** — at that point `_ga`, `_ga_*` and a
 * PostHog identifier all begin to exist and the published tables become understatements.
 *
 * **`A-11` before `A-09` is why this can be proved at all.** The consent layer owns the
 * state; this file only reacts to it. `check-axe` asserts zero requests to any analytics
 * host across every route with no interaction, and one after a grant.
 *
 * ## The ids, and the region
 *
 * `Q-M19` resolved: development ids exist in `.env.local`, live ids go in the platform
 * environment at launch. **Same variable names, different values per environment** — the
 * pattern `NEXT_PUBLIC_SANITY_DATASET` already uses.
 *
 * **`NEXT_PUBLIC_POSTHOG_HOST` must be an EU endpoint and that is asserted, not defaulted.**
 * PostHog's documented default is `https://us.i.posthog.com`. A UK site posting behavioural
 * data to a US endpoint is a data-transfer question — UK GDPR Chapter V — not a
 * misconfiguration to notice later, and the failure is silent: everything works, the data is
 * just in the wrong jurisdiction. `check-axe` asserts the configured value **and** the host
 * of the request that actually goes out, because a correct constant and a correct request are
 * different claims.
 *
 * The fallback below is the EU host rather than PostHog's default, so an unset variable
 * cannot select the US by omission. `assertEuHost` then rejects anything non-EU outright,
 * including an explicit US value.
 */
// The build's view of the ids, shared with `config.ts` so the page can report it before
// a consent choice without pulling this module in. See that file and `M-P1-6`.

import { GA4_ID, POSTHOG_KEY, POSTHOG_HOST } from './config';

let loaded = false;

function inject(src: string, id: string): void {
  if (document.getElementById(id)) return;
  const s = document.createElement('script');
  s.id = id;
  s.async = true;
  s.src = src;
  document.head.append(s);
}

export function context(division: EventContext['division']): EventContext {
  return {
    division,
    service_slug: null,
    traffic_source: trafficSource(document.referrer, location.origin),
    is_ai_referral: isAiReferral(document.referrer, location.search),
  };
}

/**
 * Called by the consent layer on every state change, including the initial denied default.
 * Idempotent: a visitor who opens preferences and saves again must not get two tags.
 */
export function loadAnalytics(consent: Consent, division: EventContext['division']): void {
  if (!consent.analytics_storage || loaded) return;
  loaded = true;

  const ctx = context(division);
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(['gs_context', ctx]);

  if (GA4_ID) inject(`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`, 'gs-ga4');
  if (POSTHOG_KEY) {
    if (!isEuPostHogHost(POSTHOG_HOST)) {
      // Refuse rather than degrade. Loading US PostHog "for now" is the version of this
      // mistake that ships, because nothing about it looks broken.
      throw new Error(
        `NEXT_PUBLIC_POSTHOG_HOST is "${POSTHOG_HOST}", which is not an EU endpoint. ` +
          'A UK site must not post behavioural data to the US default (UK GDPR Chapter V).',
      );
    }
    inject(`${POSTHOG_HOST}/static/array.js`, 'gs-posthog');
  }
}

/**
 * The one way an event reaches analytics. Queued into `dataLayer` regardless of whether a
 * tag is installed, so the taxonomy is exercised now and the events are not lost between
 * `A-09` and the day the ids arrive.
 *
 * No PII — `PROJECT-RULES.md` §6. The type on `EventProps` is the mechanical half of that;
 * the other half is review.
 */
export function track(name: EventName, props: EventProps = {}): void {
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(['event', name, props]);
}
