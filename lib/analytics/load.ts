import type { Consent } from '@/lib/consent/state';
import { isAiReferral, trafficSource } from './referral';
import type { EventContext, EventName, EventProps } from './events';

/**
 * Consent-gated analytics loading (`A-09`).
 *
 * **Nothing is injected until `analytics_storage` is granted, and "injected" is the whole
 * point** — `PROJECT-RULES.md` §6 says "not loaded-and-suppressed". A script that is
 * present and told not to record has already made the request and, for GA4, already set
 * the cookie; PECR is about the storage, not the intent. So the tags are appended to the
 * document at grant time and never before.
 *
 * **`A-11` before `A-09` is why this can be proved at all.** The consent layer owns the
 * state; this file only reacts to it. `check-axe` asserts zero requests to any analytics
 * host across every route with no interaction, and one after a grant.
 *
 * ## The IDs are missing and that is recorded, not worked around
 *
 * `NEXT_PUBLIC_GA4_ID` and `NEXT_PUBLIC_POSTHOG_KEY` are unset. With no id, this injects
 * nothing after a grant either, which is correct and honest — inventing a placeholder
 * measurement id would send real visitor data to a property nobody owns. Tracked as
 * `Q-M19`; the site is analytics-ready and not yet analytics-enabled.
 */
const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID ?? '';
const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY ?? '';
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://eu.i.posthog.com';

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
  if (POSTHOG_KEY) inject(`${POSTHOG_HOST}/static/array.js`, 'gs-posthog');
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
