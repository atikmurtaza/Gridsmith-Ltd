'use client';
// A button, not a link: it changes state on this page and navigates nowhere.

import styles from './consent.module.css';

/**
 * The footer's persistent way back to the cookie notice (`A-11`, FOUNDATION §Consent).
 *
 * **Labelled "Cookie notice", not "Cookie preferences", since round 10, while there is nothing to
 * choose.** A control named for a choice it does not offer is the same misrepresentation the round
 * removed from the banner itself. `GS-LAUNCH-026`: when the build offers optional analytics the
 * footer passes "Cookie settings", because then it reopens real choices, and withdrawing consent
 * must be as easy as giving it.
 *
 * It dispatches an event rather than importing anything from the banner, which is the
 * whole point: the footer stays a Server Component and this component's chunk contains one
 * `dispatchEvent` call, not a copy of the banner.
 */
export function ConsentReopen({ label }: { label: 'Cookie notice' | 'Cookie settings' }) {
  return (
    <button
      type="button"
      className={styles.reopen}
      onClick={() => window.dispatchEvent(new Event('gs:consent-reopen'))}
    >
      {label}
    </button>
  );
}
