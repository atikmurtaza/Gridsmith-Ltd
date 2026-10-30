/**
 * Starts or stops the optional analytics a visitor has chosen — `GS-LAUNCH-026`.
 *
 * **Imported lazily**, by `ConsentController` only after a decision that grants something, or when
 * cookies left by an earlier grant must be removed. First-load JS carries none of this.
 *
 * **Basic consent mode.** No Google or PostHog script is requested before a grant, and a refusal
 * sends nothing at all — not even the consent state. Advertising signals are denied by default and
 * never granted: nothing on this site advertises. Google's own contract for the queue is the
 * `arguments` object from the `gtag()` shim below, not an array (`BEFORE-LAUNCH.md` item 22 step 2,
 * the defect that shipped before round 10).
 *
 * **Site-sent events are page views, as paths** (`docs/_shared/GS-LAUNCH-029.md`). Google's tag also
 * collects its standard first-visit, session and engagement information. Both providers
 * receive each page's address without its query string or fragment, so no campaign or click
 * identifier and no in-page anchor is sent. GA4 page views on client-side navigation are sent here,
 * which is why the property's Enhanced measurement is switched off (owner step); PostHog's own
 * history listener sends its page views, with every automatic capture it offers switched off by
 * name rather than left to the project's remote settings (posthog-js 1.441 measured: heatmaps,
 * dead clicks, web vitals and exception capture otherwise follow them).
 *
 * **Identifiers expire with the choice and are not renewed by activity**: GA4 by `cookie_update:
 * false` and an expiry set to what the decision has left; PostHog by the same remaining time,
 * re-derived on each page load.
 *
 * **Withdrawal** stops further collection in the open page at once — Google's documented
 * `ga-disable-<id>` flag, PostHog's opt-out — and removes each provider's cookies and storage keys
 * from the device. PostHog starts opted out by default and is opted in explicitly, so removing its
 * consent marker leaves it opted out: with the library's default (opted in when no marker exists),
 * `reset()` or clearing its storage after an opt-out silently resumed capture in that page.
 * Withdrawal cannot recall what a provider already received; the Cookie Policy says so.
 */
import type { AnalyticsConfig } from './config';
import { POSTHOG_ASSETS, POSTHOG_HOST } from './config';
import { remaining, type Choice } from '../consent/decision';

const GA_COOKIES = /^_ga(?:_|$)/;
const POSTHOG_KEYS = /^(?:ph_|__ph)/;
const DAY = 24 * 60 * 60;
let activeChoice: Choice | null = null;
let expiryTimer: ReturnType<typeof setTimeout> | undefined;
let listening = false;
let posthogPending = false;

type Gtag = (...args: unknown[]) => void;
type PostHog = {
  __loaded?: boolean;
  init: (key: string, options: Record<string, unknown>) => void;
  opt_in_capturing: (options?: { captureEventName?: false }) => void;
  opt_out_capturing: () => void;
};
type Page = Window & { dataLayer?: unknown[]; gtag?: Gtag; posthog?: PostHog } & Record<string, unknown>;

function load(src: string, onload?: () => void) {
  const script = document.createElement('script');
  script.async = true;
  script.src = src;
  if (onload) script.onload = onload;
  document.head.appendChild(script);
  return script;
}

/** An address as origin and path only: no query string, no fragment. */
function path(href: string): string {
  try {
    const url = new URL(href, location.href);
    return url.origin + url.pathname;
  } catch {
    return '';
  }
}

/** Expires matching cookies on this host and on every parent domain a provider could have used. */
function expire(names: RegExp) {
  const labels = location.hostname.split('.');
  for (const entry of document.cookie.split('; ')) {
    const name = entry.split('=')[0];
    if (!name || !names.test(name)) continue;
    document.cookie = `${name}=; Max-Age=0; Path=/`;
    for (let i = 0; i < labels.length - 1; i++) document.cookie = `${name}=; Max-Age=0; Path=/; Domain=.${labels.slice(i).join('.')}`;
  }
}

/** Removes a provider's keys from web storage. Our own code stores nothing there. */
function forget(keys: RegExp) {
  for (const store of [window.localStorage, window.sessionStorage]) {
    for (const key of Object.keys(store)) if (keys.test(key)) store.removeItem(key);
  }
}

/** GA4 page views on client-side navigation, as paths. Installed once, with the tag. */
function pageViews(page: Page) {
  let last = path(location.href);
  const view = () => {
    const now = path(location.href);
    if (now === last) return;
    const referrer = last;
    last = now;
    // After the route has rendered, so the title is the new page's.
    setTimeout(() => page.gtag && page.gtag('event', 'page_view', { page_location: now, page_referrer: referrer, page_title: document.title }), 0);
  };
  for (const method of ['pushState', 'replaceState'] as const) {
    const original = history[method];
    history[method] = function (this: History, ...args: Parameters<History['pushState']>) {
      original.apply(this, args);
      view();
    };
  }
  addEventListener('popstate', view);
}

function ga4(page: Page, id: string, on: boolean, seconds: number) {
  page[`ga-disable-${id}`] = !on;
  if (!on) {
    if (page.gtag) page.gtag('consent', 'update', { analytics_storage: 'denied' });
    expire(GA_COOKIES);
    return;
  }
  if (page.gtag) {
    page.gtag('consent', 'update', { analytics_storage: 'granted' });
    return;
  }
  page.dataLayer = page.dataLayer || [];
  const queue = page.dataLayer;
  page.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params -- Google's queue contract is this `arguments` object.
    queue.push(arguments);
  };
  page.gtag('consent', 'default', {
    ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied',
  });
  page.gtag('consent', 'update', { analytics_storage: 'granted' });
  page.gtag('js', new Date());
  page.gtag('config', id, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    cookie_expires: seconds,
    cookie_update: false,
    cookie_flags: location.protocol === 'https:' ? 'SameSite=Lax;Secure' : 'SameSite=Lax',
    page_location: path(location.href),
    page_referrer: document.referrer ? path(document.referrer) : '',
  });
  pageViews(page);
  load(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`);
}

/** PostHog's URL-valued properties, reduced to paths before an event leaves the page. */
function paths(event: { properties?: Record<string, unknown> } | null) {
  const properties = event && event.properties;
  if (properties) {
    for (const key of Object.keys(properties)) {
      const value = properties[key];
      if (typeof value === 'string' && /(?:url|referrer)$/i.test(key) && /^https?:/i.test(value)) properties[key] = path(value);
    }
  }
  return event;
}

function posthog(page: Page, key: string, on: boolean) {
  const loaded = page.posthog && page.posthog.__loaded ? page.posthog : null;
  if (!on) {
    if (loaded) loaded.opt_out_capturing();
    expire(POSTHOG_KEYS);
    forget(POSTHOG_KEYS);
    return;
  }
  if (loaded) {
    loaded.opt_in_capturing({ captureEventName: false });
    return;
  }
  if (posthogPending) return;
  posthogPending = true;
  const script = load(`${POSTHOG_ASSETS}/static/array.js`, () => {
    posthogPending = false;
    // A grant can be withdrawn or expire while the library is still downloading.
    const left = activeChoice?.posthog ? remaining(activeChoice, Math.floor(Date.now() / 1000)) : 0;
    if (!left) return;
    const instance = page.posthog;
    if (!instance) return;
    instance.init(key, {
      api_host: POSTHOG_HOST,
      persistence: 'cookie',
      cookie_expiration: left / DAY,
      opt_out_capturing_by_default: true,
      opt_out_persistence_by_default: true,
      opt_out_capturing_persistence_type: 'cookie',
      person_profiles: 'identified_only',
      capture_pageview: 'history_change',
      capture_pageleave: false,
      autocapture: false,
      rageclick: false,
      capture_heatmaps: false,
      capture_dead_clicks: false,
      capture_performance: false,
      capture_exceptions: false,
      save_campaign_params: false,
      mask_personal_data_properties: true,
      disable_capture_url_hashes: true,
      get_current_url: path,
      before_send: paths,
      mask_all_text: true,
      mask_all_element_attributes: true,
      disable_session_recording: true,
      disable_surveys: true,
      advanced_disable_flags: true,
      disable_external_dependency_loading: true,
    });
    // The grant: writes PostHog's consent marker and sends the page's first page view, no `$opt_in`.
    instance.opt_in_capturing({ captureEventName: false });
  });
  script.onerror = () => { posthogPending = false; };
}

/** Brings the page into line with `choice`: granted providers run, everything else is stopped and cleared. */
export function applyAnalytics(config: AnalyticsConfig, choice: Choice | null): void {
  activeChoice = choice;
  clearTimeout(expiryTimer);
  const page = window as unknown as Page;
  const seconds = choice ? remaining(choice, Math.floor(Date.now() / 1000)) : 0;
  const refresh = () => applyAnalytics(config, activeChoice);
  if (!listening) {
    listening = true;
    addEventListener('pageshow', refresh);
    document.addEventListener('visibilitychange', refresh);
  }
  // Browser timeouts are signed 32-bit; a 180-day choice needs bounded wakeups.
  if (seconds > 0) expiryTimer = setTimeout(refresh, Math.min(seconds * 1000, 2147483647));
  if (config.ga4) ga4(page, config.ga4, !!(choice && choice.ga4) && seconds > 0, seconds);
  else expire(GA_COOKIES);
  if (config.posthog) posthog(page, config.posthog, !!(choice && choice.posthog) && seconds > 0);
  else {
    expire(POSTHOG_KEYS);
    forget(POSTHOG_KEYS);
  }
}
