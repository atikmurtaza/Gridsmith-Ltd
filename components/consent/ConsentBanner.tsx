'use client';
// Client Component because the choice lives in a cookie that must be read without making
// any route dynamic. Reading it on the server via `cookies()` would opt every route out of
// static rendering — the same trade rejected at M-04 for `cache: 'no-store'`.

import { useEffect, useRef, useState } from 'react';
import { CATEGORIES, DENIED, applyConsent, readConsent, type Consent } from '@/lib/consent/state';
import styles from './consent.module.css';

const LABELS: Record<(typeof CATEGORIES)[number], string> = {
  analytics_storage: 'Analytics',
  ad_storage: 'Advertising',
  functionality_storage: 'Preferences',
};

/** Published to CSS so the focus reserve is the bar's real height — see the effect below. */
const RESERVE_VAR = '--consent-block-size';

const ALL_GRANTED: Consent = {
  analytics_storage: true,
  ad_storage: true,
  functionality_storage: true,
};

/**
 * The consent banner (`A-11`, FR-M14). Self-hosted, no CMP.
 *
 * **Accept and Reject are the same component with the same class and the same width.**
 * `PROJECT-RULES.md` §7 and `DESIGN.md` §5 both require it, and it is a compliance
 * requirement rather than an aesthetic one: making reject harder is a recognised dark
 * pattern and regulators treat the resulting consent as invalid. Preferences is a text
 * link, third, and deliberately not a third button — it is not a third answer.
 *
 * **Nothing renders on the server.** `show` starts false, so the first paint is identical
 * with and without a stored choice and there is no hydration mismatch. The bar is
 * `position: fixed`, so appearing after mount shifts no layout (`PROJECT-RULES.md` §7).
 *
 * **It sits early in the DOM and low on the screen.** A screen reader meets it immediately
 * after the skip link, which is what "announced on appearance" asks for, without stealing
 * focus on load or trapping it. It is not `aria-modal` and there is no focus trap, so it is
 * escapable by tabbing — and it is bottom-anchored, so it cannot obscure the skip link,
 * which is fixed to the top.
 *
 * **There is deliberately no Escape-to-dismiss.** Dismissing without choosing is a "not
 * now", and `PROJECT-RULES.md` §"Never" forbids a deferral dressed as an answer. Nothing
 * is stored until a button is pressed, so the default-denied state simply persists.
 *
 * `reopen` is the footer's "Cookie preferences" link: FOUNDATION requires a persistent way
 * back in. It listens for a plain custom event rather than exporting a setter, so the
 * footer stays a Server Component and costs nothing.
 */
export function ConsentBanner() {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  const [prefs, setPrefs] = useState<Consent | null>(null);
  // A constant id, not `useId()`. There is exactly one banner per document, so it cannot
  // collide, and `check-axe`'s INCOMPLETE_ALLOWED entry matches on the exact node target —
  // a generated id would change on any React or bundler change and silently stop matching,
  // which is an allowlist that quietly becomes unreachable.
  const headingId = 'gs-consent-heading';

  useEffect(() => {
    const stored = readConsent();
    if (stored) applyConsent(stored);
    else applyConsent(DENIED);
    setShow(!stored);

    const reopen = () => {
      setPrefs(readConsent() ?? DENIED);
      setShow(true);
    };
    window.addEventListener('gs:consent-reopen', reopen);
    return () => window.removeEventListener('gs:consent-reopen', reopen);
  }, []);

  /**
   * WCAG 2.2 SC 2.4.11 Focus Not Obscured. The bar is `position: fixed` against the bottom
   * edge at every width, so a control focused near the foot of the document scrolls under
   * it. `check-responsive` measured 220px of bar against 0px of reserve at 375px.
   *
   * **The measured height, not a modelled one** — the same lesson as `StickyCta`, whose
   * `calc()` estimate was 27px short once its labels wrapped. This bar's height varies far
   * more: it grows when the text wraps and again when Preferences opens three checkboxes.
   * Publishing `offsetHeight` and letting CSS reserve it is the only version that stays
   * correct. Cleared when the bar goes, so nothing reserves for an absent element.
   */
  useEffect(() => {
    const el = ref.current;
    const root = document.documentElement.style;
    if (!el) {
      root.removeProperty(RESERVE_VAR);
      return;
    }
    const reserve = () => root.setProperty(RESERVE_VAR, `${el.offsetHeight}px`);
    reserve();
    window.addEventListener('resize', reserve);
    return () => {
      window.removeEventListener('resize', reserve);
      root.removeProperty(RESERVE_VAR);
    };
  }, [show, prefs]);

  if (!show) return null;

  const choose = async (consent: Consent) => {
    const { writeConsent } = await import('@/lib/consent/state');
    writeConsent(consent);
    setShow(false);
    setPrefs(null);
  };

  return (
    <div ref={ref} className={styles.bar} role="region" aria-labelledby={headingId}>
      <div className={styles.inner}>
        <p id={headingId} className={styles.text}>
          We use cookies to understand how this site is used. Nothing non-essential is set
          until you choose.
        </p>

        {prefs ? (
          <fieldset className={styles.prefs}>
            <legend className={styles.legend}>Choose what to allow</legend>
            {CATEGORIES.map((c) => (
              <label key={c} className={styles.pref}>
                <input
                  type="checkbox"
                  checked={prefs[c]}
                  onChange={(e) => setPrefs({ ...prefs, [c]: e.target.checked })}
                />
                {LABELS[c]}
              </label>
            ))}
          </fieldset>
        ) : null}

        <div className={styles.actions}>
          {prefs ? (
            <button type="button" className={styles.choice} onClick={() => choose(prefs)}>
              Save choices
            </button>
          ) : (
            <>
              <button type="button" className={styles.choice} onClick={() => choose(ALL_GRANTED)}>
                Accept
              </button>
              <button type="button" className={styles.choice} onClick={() => choose(DENIED)}>
                Reject
              </button>
              <button
                type="button"
                className={styles.preferences}
                onClick={() => setPrefs(readConsent() ?? DENIED)}
              >
                Preferences
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
