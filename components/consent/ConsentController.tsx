'use client';
// Client Component because the visitor's decision lives in a cookie that must be read without
// making any route dynamic, and the optional analytics it governs run only in the browser.

import { useEffect } from 'react';
import { markNoticeSeen } from '@/lib/consent/state';
import { BUNDLE_SIZE_PROBE } from './bundle-size-probe';

/** Published to CSS so the focus reserve is the bar's real height — see `reserve` below. */
const RESERVE_VAR = '--consent-block-size';
/** A stored grant, or a cookie a provider may have left: either is a reason to fetch the actions. */
const ACT_ON_LOAD = /gs_consent=v2:g1|gs_consent=v2:g.:p1|(?:^|; )(?:_ga|ph_|__ph)/;

export type ConsentContext = { bar: HTMLElement; show: (open: boolean) => void; close: () => void };

/**
 * The behaviour of `ConsentBanner`'s server-rendered markup (`GS-LAUNCH-026`). It renders nothing.
 *
 * **First-load JS holds only what every route needs**: whether the bar stays shown (the prepaint
 * script has already hidden it for a visitor whose stored choice suffices), the notice's one
 * control, focus return, and the 2.4.11 reserve. Everything a consent decision does — the choices,
 * writing the decision, the confirmation, starting or stopping a provider — is `consentActions.ts`,
 * fetched on the first interaction or when a stored grant or a provider's leftover cookie must be
 * acted on. The shared baseline is budgeted to the byte (`check-bundle-size.mjs`).
 *
 * - **Accept all / Reject optional / Save preferences** write one decision for every offered
 *   provider, apply it at once, hide the bar and announce "Cookie preferences saved."
 * - **Customise** is a disclosure (`aria-expanded`) for the per-provider choices, unticked unless
 *   the visitor has granted that provider before.
 * - **Reopen** (the footer control's `gs:consent-reopen` event) shows the bar — in consent mode
 *   with the choices open and focus moved into it; closing returns focus to the control that
 *   opened it, or to `main` if the bar held focus with no opener.
 *
 * WCAG 2.2 SC 2.4.11, unchanged from `ddf9d9aa`: the bar is fixed to the bottom edge, so its
 * measured height is published as a reserve and a focused footer control is revealed on rewrap.
 */
export function ConsentController() {
  useEffect(() => {
    // The committed shared-baseline probe: empty and eliminated unless the build sets it.
    if (BUNDLE_SIZE_PROBE) (window as unknown as Record<string, string>).__gsBundleProbe = BUNDLE_SIZE_PROBE;
    const heading = document.getElementById('gs-consent-heading');
    const bar = heading && (heading.closest('[role="region"]') as HTMLElement | null);
    if (!bar) return;
    const root = document.documentElement.style;
    let opener: HTMLElement | null = null;
    const actions = () => import('./consentActions');

    const reserve = (resized?: boolean) => {
      if (bar.hidden) {
        root.removeProperty(RESERVE_VAR);
        return;
      }
      root.setProperty(RESERVE_VAR, bar.offsetHeight + 'px');
      // Reopening or rewrapping must also reveal a control that already has focus.
      const active = document.activeElement;
      if (active && active.closest('footer') && (resized || active.getBoundingClientRect().top < innerHeight)) {
        active.scrollIntoView({ block: resized ? 'center' : 'nearest' });
      }
    };
    const show = (open: boolean) => {
      bar.hidden = !open;
      reserve(true);
    };
    const close = () => {
      const within = bar.contains(document.activeElement);
      show(false);
      const back = opener && opener.isConnected ? opener : within ? document.getElementById('main') : null;
      opener = null;
      if (back) back.focus();
    };
    const context: ConsentContext = { bar, show, close };

    show(!bar.hidden);
    if (ACT_ON_LOAD.test(document.cookie)) void actions().then((m) => m.applyStored());

    const onClick = (event: Event) => {
      const target = event.target as Element | null;
      const control = target && target.closest('[data-consent]');
      const action = control && control.getAttribute('data-consent');
      if (action === 'ok') {
        markNoticeSeen();
        close();
      } else if (action) void actions().then((m) => m.act(action, context));
    };
    const onReopen = () => {
      opener = document.activeElement instanceof HTMLElement && document.activeElement !== document.body
        ? document.activeElement : null;
      // The notice has nothing to choose, so focus stays on the footer control (2.4.11 above).
      if (bar.getAttribute('data-consent-mode') === 'consent') void actions().then((m) => m.reopen(context));
      else show(true);
    };

    const observer = new ResizeObserver(() => reserve());
    const onResize = () => reserve(true);
    observer.observe(bar);
    observer.observe(document.body);
    bar.addEventListener('click', onClick);
    window.addEventListener('gs:consent-reopen', onReopen);
    window.addEventListener('resize', onResize);
    return () => {
      observer.disconnect();
      bar.removeEventListener('click', onClick);
      window.removeEventListener('gs:consent-reopen', onReopen);
      window.removeEventListener('resize', onResize);
      root.removeProperty(RESERVE_VAR);
    };
  }, []);

  return null;
}
