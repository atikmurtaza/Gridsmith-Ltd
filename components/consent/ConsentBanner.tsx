import { ANALYTICS, type AnalyticsConfig } from '@/lib/analytics/config';
import { CHOICE_MAX_AGE } from '@/lib/consent/decision';
import { COOKIE } from '@/lib/consent/state';
import { ConsentController } from './ConsentController';
import styles from './consent.module.css';

/**
 * A plain `<a>`, as in the footer: the `Link` primitive's style map would ride in every route's
 * shared chunk from this shared layout, and route-group links are document loads anyway.
 */
const COOKIE_POLICY = '/legal/cookies';

/**
 * The cookie notice, or — when the build offers optional analytics — the consent request
 * (`A-11`, FR-M14, `GS-LAUNCH-026`). Self-hosted, no CMP.
 *
 * **A Server Component since `GS-LAUNCH-026`.** The markup ships as HTML on every route, and only
 * `ConsentController`'s behaviour is client JavaScript; the shared baseline is budgeted to the
 * byte (`check-bundle-size.mjs`), and copy is not script.
 *
 * ## Two modes, decided by the build — never a choice offered for something that does not exist
 *
 * **Notice** (no analytics identifier configured): unchanged from round 10 — one cookie, one
 * control, nothing to opt out of. Offering a choice that changes nothing would represent control
 * the visitor does not have.
 *
 * **Consent** (one or both of GA4 and PostHog configured, `lib/analytics/config.ts`): the
 * `PROJECT-RULES.md` §7 shape returns. "Accept all" and "Reject optional" share one class and
 * one size and sit together; "Customise" opens a separate, unticked choice per provider, because
 * the two have different operators and recipients (ICO storage and access guidance, 29 April 2026:
 * refusal as easy as acceptance, granular choices, toggles off by default, third parties
 * identified). Nothing non-essential runs until a positive action; closing, ignoring or tabbing
 * past the request is not consent.
 *
 * **First visits render in the initial HTML.** A small prepaint script hides the request for a
 * visitor whose stored decision already covers what this build offers; mount does the rest. Without
 * JavaScript the request stays hidden: no optional analytics can run without it either.
 *
 * **It sits early in the DOM and low on the screen.** A screen reader meets it immediately after
 * the skip link without focus being taken on load; it is not `aria-modal` and does not trap focus;
 * it is bottom-anchored, so it cannot obscure the skip link. The footer's reopen control brings it
 * back with the choices showing, and moves focus into it (`ConsentController`).
 */
export function ConsentBanner({ analytics = ANALYTICS }: { analytics?: AnalyticsConfig }) {
  // A constant id, not `useId()`: `check-axe`'s INCOMPLETE_ALLOWED entry matches this exact target.
  const headingId = 'gs-consent-heading';
  const offered = [analytics.ga4 && 'Google Analytics 4', analytics.posthog && 'PostHog'].filter(Boolean) as string[];
  const consent = offered.length > 0;
  // Hide before paint when a current stored decision already answers for every offered provider.
  const prepaint = consent
    ? `try{var m=/(?:^|; )${COOKIE}=v2:g([01-]):p([01-]):(\\d{9,11})(?:;|$)/.exec(document.cookie);` +
      `if(m&&Date.now()/1e3-m[3]<${CHOICE_MAX_AGE}&&${analytics.ga4 ? "m[1]!=='-'" : 'true'}&&${analytics.posthog ? "m[2]!=='-'" : 'true'})` +
      `document.getElementById('${headingId}').closest('[role="region"]').hidden=true}catch(e){}`
    : `try{if(document.cookie.split('; ').some(c=>c.startsWith('${COOKIE}=')))` +
      `document.getElementById('${headingId}').closest('[role="region"]').hidden=true}catch{}`;

  return (
    <>
      <div className={styles.bar} role="region" aria-labelledby={headingId} tabIndex={-1}
        data-consent-mode={consent ? 'consent' : 'notice'} suppressHydrationWarning>
        <div className={styles.inner}>
          {consent ? (
            <p id={headingId} className={styles.text}>
              This site uses one cookie, <code className={styles.cookieName}>{COOKIE}</code>, to remember your choice.
              With your permission it would also use {offered.join(' and ')} to measure how the website is used.
              {offered.length > 1 ? ' Both stay' : ' It stays'} off unless you allow {offered.length > 1 ? 'them' : 'it'}, and
              you can change your choice at any time from Cookie settings at the foot of our pages.{' '}
              <a href={COOKIE_POLICY}>Cookie Policy</a>
            </p>
          ) : (
            <p id={headingId} className={styles.text}>
              This site sets one cookie, <code className={styles.cookieName}>{COOKIE}</code>, which
              records that you have seen this notice. There is no analytics, no advertising and no
              third-party tracking of any kind, so there is nothing to opt out of.
            </p>
          )}

          <div className={styles.actions}>
            {consent ? (
              <>
                <button type="button" className={styles.choice} data-consent="accept">Accept all</button>
                <button type="button" className={styles.choice} data-consent="reject">Reject optional</button>
                <button type="button" className={styles.choice} data-consent="customise"
                  aria-expanded="false" aria-controls="gs-consent-panel">Customise</button>
              </>
            ) : (
              <button type="button" className={styles.choice} data-consent="ok">Got it</button>
            )}
          </div>

          {consent ? (
            <div id="gs-consent-panel" data-consent-panel="" hidden>
              <fieldset>
                <legend>Optional analytics</legend>
                {analytics.ga4 ? (
                  <div data-consent-option="">
                    <input id="gs-consent-ga4" type="checkbox" name="ga4" aria-describedby="gs-consent-ga4-about" />
                    <label htmlFor="gs-consent-ga4">Google Analytics 4</label>
                    <p id="gs-consent-ga4-about" data-consent-about="">
                      Provided by Google. Counts the pages visited and how visitors arrive, as statistics.
                      Sets cookies named <code className={styles.cookieName}>_ga</code> and <code className={styles.cookieName}>_ga_…</code> that end with your choice, after at most six months.
                    </p>
                  </div>
                ) : null}
                {analytics.posthog ? (
                  <div data-consent-option="">
                    <input id="gs-consent-posthog" type="checkbox" name="posthog" aria-describedby="gs-consent-posthog-about" />
                    <label htmlFor="gs-consent-posthog">PostHog</label>
                    <p id="gs-consent-posthog-about" data-consent-about="">
                      Provided by PostHog, on its EU hosting. Counts the pages visited and how visitors arrive, as statistics.
                      Sets cookies whose names begin <code className={styles.cookieName}>ph_</code> and <code className={styles.cookieName}>__ph_</code> that end with your choice, after at most six months, and keeps details of your visit in your browser&rsquo;s session storage until you close the tab.
                    </p>
                  </div>
                ) : null}
              </fieldset>
              <div className={styles.actions}>
                <button type="button" className={styles.choice} data-consent="save">Save preferences</button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
      {/* Outside the bar, so a confirmation is still announced once the bar is hidden. */}
      <p className="sr-only" role="status" data-consent-status="" />
      {/* Runs during HTML parsing, before the external React chunks. The cookie name and the
          offered providers are build-time constants; no cookie value enters markup or script. */}
      <script dangerouslySetInnerHTML={{ __html: prepaint }} />
      <noscript><style>{`.${styles.bar}{display:none!important}`}</style></noscript>
      <ConsentController />
    </>
  );
}
