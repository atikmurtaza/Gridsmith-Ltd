'use client';
// A button, not a link: it changes state on this page and navigates nowhere.

import styles from './consent.module.css';

/**
 * The footer's persistent way back to the cookie notice (`A-11`, FOUNDATION §Consent).
 *
 * **Labelled "Cookie notice", not "Cookie preferences", since round 10.** There are no
 * preferences: the consent categories were removed with the analytics injection that was the
 * only thing consuming them (`lib/consent/state.ts`). A control named for a choice it does
 * not offer is the same misrepresentation the round removed from the banner itself.
 *
 * It dispatches an event rather than importing anything from the banner, which is the
 * whole point: the footer stays a Server Component and this component's chunk contains one
 * `dispatchEvent` call, not a copy of the banner.
 */
export function ConsentReopen() {
  return (
    <button
      type="button"
      className={styles.reopen}
      onClick={() => window.dispatchEvent(new Event('gs:consent-reopen'))}
    >
      Cookie notice
    </button>
  );
}
