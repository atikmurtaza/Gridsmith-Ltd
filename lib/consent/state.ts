/**
 * Consent state (`A-11`). No third-party CMP — `PROJECT-RULES.md` §6.
 *
 * **There are no consent categories, because there is nothing non-essential to consent to.**
 * Owner's decision, 26 August 2026 (`docs/_legal/03-REVISION-LOG.md` round 10, OQ-7 option 2).
 * Measurement at round 6 established that GA4 and PostHog loaded on grant and never
 * initialised: no `gtag('config')`, no `posthog.init()`, `window.gtag` undefined,
 * `posthog.__loaded` false, and `gs_consent` the only cookie in any of the three states. So
 * consent was being collected for two libraries that recorded nothing while every accepting
 * visitor's IP and user-agent still reached Google and PostHog. The injection is gone
 * (`lib/analytics/load.ts` deleted), and with it the three categories:
 *
 * - `analytics_storage` — removed with its only consumer.
 * - `ad_storage` — removed. It was declared because Google Consent Mode v2 defines the
 *   signal; with no Google tag there is no signal to default. Nothing on this site has ever
 *   set an advertising cookie.
 * - `functionality_storage` — removed. It gated `gs_design_track`, which does not exist.
 *
 * All three misrepresented control the visitor did not have. Re-introducing analytics is a
 * deliberate pre-launch task with prerequisites — `docs/_shared/BEFORE-LAUNCH.md` §"Analytics".
 *
 * **The Consent Mode `dataLayer` bridge went with them.** It pushed a plain array where
 * Google's contract is an `arguments` object from a `gtag()` shim; that defect is recorded in
 * BEFORE-LAUNCH as a thing to fix *before* any tag is initialised, and it must be settled by
 * measurement rather than by reading. Leaving a broken bridge in place to signal categories
 * that no longer exist would be worse than having none.
 */

/**
 * The notice cookie. Strictly necessary — it exists only to remember that the cookie notice
 * has been seen, which is what stops it appearing again. Exempt under **PECR Sch. A1
 * para. 4**; see `COOKIE-POLICY.md` §2.
 *
 * 12 months and `SameSite=Lax` are `FOUNDATION` §"Consent management" and `TECH-SPEC.md`
 * §4. `Secure` is omitted on plain http so local development works; on the deployed site
 * every request is https and the flag is set.
 */
export const COOKIE = 'gs_consent';
const MAX_AGE = 60 * 60 * 24 * 365;

/**
 * Has the notice been acknowledged?
 *
 * **Any value counts, including the pre-round-10 ones.** A cookie written before this change
 * carries granted category names (`analytics_storage,ad_storage,functionality_storage`) or
 * the single character `0`. Those names now name nothing — no code reads them, so a stale
 * value cannot enable anything, and the direction of the staleness is safe either way. The
 * cookie is **not rewritten**: it is the visitor's own record of what they were shown, and
 * silently rewriting it to say something else is the misleading state this check exists to
 * avoid. It is read for presence only, and expires on its own within 12 months.
 */
export function noticeSeen(): boolean {
  return document.cookie.split('; ').some((c) => c.startsWith(`${COOKIE}=`));
}

/** Records that the notice was seen. `1` — there is no state beyond presence. */
export function markNoticeSeen(): void {
  const secure = location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${COOKIE}=1; Max-Age=${MAX_AGE}; Path=/; SameSite=Lax${secure}`;
}
