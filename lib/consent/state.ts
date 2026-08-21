/**
 * Consent state (`A-11`). No third-party CMP — `PROJECT-RULES.md` §6.
 *
 * The three categories are Google Consent Mode v2's names, used verbatim so the bridge is
 * a pass-through rather than a translation table. `ad_storage` is here because Consent
 * Mode requires it to be declared even though nothing on this site sets an ad cookie;
 * declaring it denied is the correct state, not a placeholder.
 *
 * **Every category defaults to denied and there is no fourth "strictly necessary" toggle**,
 * because strictly necessary storage does not need consent and offering a switch for it
 * implies it does.
 */
export const CATEGORIES = ['analytics_storage', 'ad_storage', 'functionality_storage'] as const;
export type Category = (typeof CATEGORIES)[number];
export type Consent = Record<Category, boolean>;

export const DENIED: Consent = {
  analytics_storage: false,
  ad_storage: false,
  functionality_storage: false,
};

/**
 * The choice cookie. Strictly necessary — it exists only to remember that a choice was
 * made, which is what stops the banner re-prompting, so it needs no consent of its own.
 *
 * 12 months and `SameSite=Lax` are `FOUNDATION` §"Consent management" and `TECH-SPEC.md`
 * §4. `Secure` is omitted on plain http so local development works; on the deployed site
 * every request is https and the flag is set.
 */
export const COOKIE = 'gs_consent';
const MAX_AGE = 60 * 60 * 24 * 365;

/** Serialised as the granted category names, comma-separated. `"0"` means an explicit reject. */
export function readConsent(): Consent | null {
  const raw = document.cookie.split('; ').find((c) => c.startsWith(`${COOKIE}=`));
  if (!raw) return null;
  const granted = decodeURIComponent(raw.slice(COOKIE.length + 1)).split(',');
  return {
    analytics_storage: granted.includes('analytics_storage'),
    ad_storage: granted.includes('ad_storage'),
    functionality_storage: granted.includes('functionality_storage'),
  };
}

export function writeConsent(consent: Consent): void {
  const granted = CATEGORIES.filter((c) => consent[c]);
  const value = encodeURIComponent(granted.length > 0 ? granted.join(',') : '0');
  const secure = location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${COOKIE}=${value}; Max-Age=${MAX_AGE}; Path=/; SameSite=Lax${secure}`;
  applyConsent(consent);
}

/**
 * The Consent Mode v2 bridge (`TECH-SPEC.md` §4).
 *
 * **This pushes into `dataLayer` and loads nothing.** Google's contract is that the default
 * denied state must be queued *before* any Google tag runs, so the queue has to exist from
 * the first paint even though no tag is installed — `A-09` is what adds GA4 and PostHog,
 * behind this. Pushing an update costs no request and sets no cookie, so it does not
 * violate "no non-essential storage before consent"; it is what makes that true later.
 */
type ConsentSignal = 'granted' | 'denied';
declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

export function applyConsent(consent: Consent): void {
  const signals = Object.fromEntries(
    CATEGORIES.map((c) => [c, (consent[c] ? 'granted' : 'denied') as ConsentSignal]),
  );
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(['consent', 'update', signals]);
}
