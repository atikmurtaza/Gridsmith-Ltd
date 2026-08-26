/**
 * AI-referral detection (`A-09`, FOUNDATION §"AI-referral detection").
 *
 * Pure and dependency-free so it can be unit-checked without a browser — see `demo()` at
 * the foot of this file, which runs under `node lib/analytics/referral.ts`.
 *
 * **The 22% conversion premium in `R1` is not measured and nothing here assumes it.**
 * FOUNDATION states it as the reason the flag exists — "must be measured, not assumed" —
 * so this classifies traffic and makes no claim about what the classification is worth.
 *
 * **Unreferenced since round 8, deliberately.** The analytics injection was deleted with the
 * consent categories (OQ-7 option 2 — `lib/consent/state.ts`), so nothing imports this file
 * today. It is kept because it is design work the specs name, not because it runs: wiring
 * analytics up is `docs/_shared/BEFORE-LAUNCH.md` §"Analytics" and starts from here.
 */

/**
 * Hosts whose traffic counts as AI-referred. Matched on the **registrable host**, never on
 * a substring of the whole URL: `?next=https://chatgpt.com` in a query string is not a
 * referral from ChatGPT, and a substring test would count it as one.
 */
const AI_HOSTS = [
  'chatgpt.com',
  'perplexity.ai',
  'gemini.google.com',
  'claude.ai',
  'copilot.microsoft.com',
];

/** UTM sources that mean the same thing when a referrer is stripped. */
const AI_UTM_SOURCES = ['chatgpt', 'perplexity', 'gemini', 'claude', 'copilot'];

const hostMatches = (host: string) =>
  AI_HOSTS.some((h) => host === h || host.endsWith(`.${h}`));

export function isAiReferral(referrer: string, search: string): boolean {
  const utm = new URLSearchParams(search).get('utm_source')?.toLowerCase() ?? '';
  if (AI_UTM_SOURCES.includes(utm)) return true;
  if (!referrer) return false;
  try {
    return hostMatches(new URL(referrer).hostname.toLowerCase());
  } catch {
    // A referrer that is not a URL is not a referral. Throwing here would take the whole
    // analytics init with it, which is a worse outcome than an unclassified visit.
    return false;
  }
}

/** `document.referrer` is same-origin on internal navigation; that is not a traffic source. */
export function trafficSource(referrer: string, origin: string): string {
  if (!referrer) return 'direct';
  try {
    const host = new URL(referrer).hostname.toLowerCase();
    return new URL(origin).hostname.toLowerCase() === host ? 'internal' : host;
  } catch {
    return 'direct';
  }
}

/**
 * One runnable check, per the repository's rule that non-trivial logic leaves one behind.
 * `node lib/analytics/referral.ts` — Node 24 strips the types.
 */
function demo(): void {
  const ok = (label: string, actual: unknown, expected: unknown) => {
    if (actual !== expected) throw new Error(`${label}: expected ${expected}, got ${actual}`);
  };
  ok('chatgpt referrer', isAiReferral('https://chatgpt.com/c/abc', ''), true);
  ok('subdomain', isAiReferral('https://www.perplexity.ai/', ''), true);
  ok('gemini', isAiReferral('https://gemini.google.com/app', ''), true);
  // The case a substring match gets wrong.
  ok('host in query', isAiReferral('https://example.com/?next=https://chatgpt.com', ''), false);
  // ...and the case a naive endsWith gets wrong.
  ok('lookalike host', isAiReferral('https://notchatgpt.com/', ''), false);
  ok('utm only', isAiReferral('', '?utm_source=Perplexity'), true);
  ok('no referrer', isAiReferral('', ''), false);
  ok('junk referrer', isAiReferral('android-app://x', ''), false);
  ok('direct', trafficSource('', 'https://gridsmith.uk'), 'direct');
  ok('internal', trafficSource('https://gridsmith.uk/design', 'https://gridsmith.uk'), 'internal');
  ok('external', trafficSource('https://google.com/', 'https://gridsmith.uk'), 'google.com');
  // `demo()` is never reachable from the app: it runs only under
  // `node lib/analytics/referral.ts`. The no-console rule exists to keep output out of
  // production, and this cannot reach it.
  // eslint-disable-next-line no-console
  console.log('referral: 11 assertions passed');
}

if (process.env.NODE_ENV === undefined && import.meta.url.endsWith('referral.ts')) demo();
