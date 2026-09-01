'use client';
// Client Component because the notice's dismissal lives in a cookie that must be read
// without making any route dynamic. Reading it on the server via `cookies()` would opt every
// route out of static rendering — the same trade rejected at M-04 for `cache: 'no-store'`.

import { useEffect, useRef, useState } from 'react';
import { COOKIE, markNoticeSeen, noticeSeen } from '@/lib/consent/state';
import styles from './consent.module.css';

/** Published to CSS so the focus reserve is the bar's real height — see the effect below. */
const RESERVE_VAR = '--consent-block-size';

/**
 * The cookie notice (`A-11`, FR-M14). Self-hosted, no CMP.
 *
 * **It is a notice, not a consent request, and that is the whole change of round 10.** The
 * owner took OQ-7 option 2: stop asking. Nothing on this site stores or transmits anything
 * non-essential — the analytics injection is deleted and the three consent categories with
 * it (`lib/consent/state.ts`). PECR reg. 6 requires consent for non-essential storage and
 * access; there is none, so there is no consent to collect. `gs_consent` remains, exempt
 * under Sch. A1 para. 4, recording only that this notice has been seen.
 *
 * **Why keep a bar at all.** Because the visitor is still owed the information — UK GDPR
 * Art. 13 and PECR reg. 6(2)'s "clear and comprehensive information" — and because the
 * accurate statement ("we set one cookie, and it is the one remembering you saw this") is
 * worth making rather than assuming. What is *not* kept is a choice, because offering a
 * choice that changes nothing is the same defect as the two inert toggles this round removed:
 * it represents control the visitor does not have.
 *
 * **There is deliberately no Accept/Reject pair any more, and `PROJECT-RULES.md` §7 is not
 * weakened by that.** That rule forbids making reject harder than accept. Here there is no
 * accept: one control, one meaning, and nothing is stored until it is pressed. The rule
 * against a "not now" deferral is likewise intact — the button is not a deferral of an
 * unanswered question, there is no question. Both rules become live again the moment
 * analytics is wired up (`docs/_shared/BEFORE-LAUNCH.md` §"Analytics"), and the Accept/Reject
 * shape must come back with it.
 *
 * **Nothing renders on the server.** `show` starts false, so the first paint is identical
 * with and without the cookie and there is no hydration mismatch. The bar is
 * `position: fixed`, so appearing after mount shifts no layout (`PROJECT-RULES.md` §7).
 *
 * **It sits early in the DOM and low on the screen.** A screen reader meets it immediately
 * after the skip link, which is what "announced on appearance" asks for, without stealing
 * focus on load or trapping it. It is not `aria-modal` and there is no focus trap, so it is
 * escapable by tabbing — and it is bottom-anchored, so it cannot obscure the skip link,
 * which is fixed to the top.
 *
 * `reopen` is the footer's "Cookie notice" link: FOUNDATION requires a persistent way back
 * in. It listens for a plain custom event rather than exporting a setter, so the footer stays
 * a Server Component and costs nothing.
 *
 * **It takes no props.** It used to take `division`, purely to stamp the analytics event
 * context; that context went with the analytics. `RootShell` still knows the division and can
 * pass it again the day it means something.
 */
export function ConsentBanner() {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  // A constant id, not `useId()`. There is exactly one banner per document, so it cannot
  // collide, and `check-axe`'s INCOMPLETE_ALLOWED entry matches on the exact node target —
  // a generated id would change on any React or bundler change and silently stop matching,
  // which is an allowlist that quietly becomes unreachable.
  const headingId = 'gs-consent-heading';

  useEffect(() => {
    setShow(!noticeSeen());

    const reopen = () => setShow(true);
    window.addEventListener('gs:consent-reopen', reopen);
    return () => window.removeEventListener('gs:consent-reopen', reopen);
  }, []);

  /**
   * WCAG 2.2 SC 2.4.11 Focus Not Obscured. The bar is `position: fixed` against the bottom
   * edge at every width, so a control focused near the foot of the document scrolls under
   * it. `check-responsive` measured 220px of bar against 0px of reserve at 375px.
   *
   * **The measured height, not a modelled one** — the same lesson as `StickyCta`, whose
   * `calc()` estimate was 27px short once its labels wrapped. This bar's height still varies
   * with text wrapping at narrow widths. Publishing `offsetHeight` and letting CSS reserve it
   * is the only version that stays correct. Cleared when the bar goes, so nothing reserves
   * for an absent element.
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
  }, [show]);

  if (!show) return null;

  return (
    <div ref={ref} className={styles.bar} role="region" aria-labelledby={headingId}>
      <div className={styles.inner}>
        <p id={headingId} className={styles.text}>
          This site sets one cookie, <code className={styles.cookieName}>{COOKIE}</code>, which
          records that you have seen this notice. There is no analytics, no advertising and no
          third-party tracking of any kind, so there is nothing to opt out of.
        </p>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.choice}
            onClick={() => {
              markNoticeSeen();
              setShow(false);
            }}
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
