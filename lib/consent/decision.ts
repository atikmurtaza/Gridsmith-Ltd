/**
 * The consent request's stored decision — `GS-LAUNCH-026`. Separate from `state.ts` so only the
 * lazily fetched `consentActions` chunk carries it. Same cookie name and scope as the notice; its
 * own, shorter lifetime (`docs/_legal/compliance/ANALYTICS-ACTIVATION.md`: a choice lasts 180 days,
 * a notice acknowledgement 365 and never authorises analytics).
 *
 * **Changing what a provider is used for must change the record's version** (`v2` → `v3`): the
 * record says which providers were allowed, not for what, so only a new prefix makes every earlier
 * decision count as no decision and asks again, as the Cookie Policy promises.
 */
import { COOKIE } from './state.ts';

/** A recorded analytics decision. `null` for a provider the site did not offer when it was made. */
export type Choice = { ga4: boolean | null; posthog: boolean | null; at: number };
/** The providers a decision must cover: those the build offers. */
export type Offered = { ga4: unknown; posthog: unknown };

/** 180 days. The analytics identifiers a grant allows expire with it (`lib/analytics/load.ts`). */
export const CHOICE_MAX_AGE = 60 * 60 * 24 * 180;

const RECORD = /^v2:g([01-]):p([01-]):(\d{9,11})$/;
const decision = (c: string) => (c === '-' ? null : c === '1');
const mark = (v: boolean | null) => (v === null ? '-' : v ? '1' : '0');

/** A stored value, decoded. Absent, notice-only, legacy and malformed values are all no decision. */
export function readChoice(value: string | null | undefined): Choice | null {
  const m = value ? RECORD.exec(value) : null;
  return m ? { ga4: decision(m[1]), posthog: decision(m[2]), at: Number(m[3]) } : null;
}

export function encodeChoice(c: Choice): string {
  return `v2:g${mark(c.ga4)}:p${mark(c.posthog)}:${c.at}`;
}

/** Seconds a decision has left at `now` (unix seconds); 0 once it has lapsed. */
export function remaining(c: Choice, now: number): number {
  return Math.max(0, c.at + CHOICE_MAX_AGE - now);
}

/** A decision counts only while it is current and answers for every provider the build offers. */
export function choiceCovers(c: Choice | null, offered: Offered, now: number): boolean {
  return !!c && remaining(c, now) > 0 && (!offered.ga4 || c.ga4 !== null) && (!offered.posthog || c.posthog !== null);
}

/** This document's consent cookie value, if any. */
export function storedValue(): string | null {
  const entry = document.cookie.split('; ').find((c) => c.startsWith(`${COOKIE}=`));
  return entry ? entry.slice(COOKIE.length + 1) : null;
}

/** Records a decision for 180 days. */
export function writeChoice(c: Choice): void {
  const secure = location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${COOKIE}=${encodeChoice(c)}; Max-Age=${CHOICE_MAX_AGE}; Path=/; SameSite=Lax${secure}`;
}
