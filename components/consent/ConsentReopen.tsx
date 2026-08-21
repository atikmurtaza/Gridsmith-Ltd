'use client';
// A button, not a link: it changes state on this page and navigates nowhere.

import styles from './consent.module.css';

/**
 * The footer's persistent way back into the consent choice (`A-11`, FOUNDATION §Consent).
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
      Cookie preferences
    </button>
  );
}
