/**
 * What a consent decision does — `GS-LAUNCH-026`. Fetched lazily by `ConsentController` on the
 * first interaction with the consent request, or when a stored grant or a provider's leftover cookie
 * must be acted on; never on a first visit to a build that offers nothing.
 *
 * **Every open page follows a change.** A decision made in one tab is posted on a
 * `BroadcastChannel`, and every other tab of the site that has this chunk loaded — any tab where a
 * provider is running — re-reads the cookie and applies it at once, so withdrawing in one tab stops
 * collection in all of them. The channel stores nothing on the device.
 */
import { ANALYTICS } from '@/lib/analytics/config';
import { applyAnalytics } from '@/lib/analytics/load';
import { choiceCovers, readChoice, storedValue, writeChoice, type Choice } from '@/lib/consent/decision';
import type { ConsentContext } from './ConsentController';

type Provider = 'ga4' | 'posthog';
const PROVIDERS: Provider[] = ['ga4', 'posthog'];
const box = (bar: HTMLElement, name: Provider) => bar.querySelector(`input[name="${name}"]`) as HTMLInputElement | null;
const now = () => Math.floor(Date.now() / 1000);

let channel: BroadcastChannel | null = null;
/** Joins the site's consent channel once per page; a message means "the decision changed". */
function listen(): BroadcastChannel | null {
  if (!channel && typeof BroadcastChannel === 'function') {
    channel = new BroadcastChannel('gs-consent');
    channel.onmessage = () => applyStored();
  }
  return channel;
}

/** The stored decision if it is current and covers what this build offers; otherwise none. */
function current(): Choice | null {
  const stored = readChoice(storedValue());
  return choiceCovers(stored, ANALYTICS, now()) ? stored : null;
}

function expand(bar: HTMLElement, open: boolean) {
  const panel = document.getElementById('gs-consent-panel');
  const customise = bar.querySelector('[data-consent="customise"]');
  if (!panel || !customise) return;
  panel.hidden = !open;
  customise.setAttribute('aria-expanded', String(open));
}

/** Brings the page into line with the stored decision; one that has lapsed or does not cover the offer grants nothing. */
export function applyStored(): void {
  listen();
  applyAnalytics(ANALYTICS, current());
}

export function act(action: string, { bar, close }: ConsentContext): void {
  if (action === 'customise') {
    const panel = document.getElementById('gs-consent-panel');
    expand(bar, !!panel && panel.hidden === true);
    return;
  }
  if (action !== 'accept' && action !== 'reject' && action !== 'save') return;
  const pick = (name: Provider) => {
    if (!ANALYTICS[name]) return null;
    if (action !== 'save') return action === 'accept';
    const input = box(bar, name);
    return !!(input && input.checked);
  };
  const choice: Choice = { ga4: pick('ga4'), posthog: pick('posthog'), at: now() };
  writeChoice(choice);
  applyAnalytics(ANALYTICS, choice);
  const tabs = listen();
  if (tabs) tabs.postMessage('changed');
  close();
  // Outside the bar, so the confirmation is still announced once the bar is hidden (4.1.3).
  const status = document.querySelector('[data-consent-status]');
  if (status) status.textContent = 'Cookie preferences saved.';
}

/** The footer's reopen: the choices open, showing what is currently granted, with focus moved in. */
export function reopen({ bar, show }: ConsentContext): void {
  const stored = current();
  for (const name of PROVIDERS) {
    const input = box(bar, name);
    if (input) input.checked = !!(stored && stored[name]);
  }
  expand(bar, true);
  show(true);
  bar.focus();
}
