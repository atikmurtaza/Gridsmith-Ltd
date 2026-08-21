/**
 * **A permanent gate subject. Do not delete this route.**
 *
 * The second of the two ways `app/global-error.tsx` can be reached, and the one that was
 * recorded as **unknown** — see that file's docstring and `gridsmith-error-probe`'s. The
 * sibling probe throws after hydration and proves the client path every CI run. This one
 * throws during server render, which is what `M-07`'s *"500 works without JS"* actually
 * depends on: if the boundary is not server-rendered, a visitor with no JS gets Next's
 * `<html id="__next_error__">` shell, which has no `lang` and no `<title>` — a Level A
 * failure on every server-side crash.
 *
 * Establishing it needed "a route that throws during render, a `next build && next start`,
 * and a read of the response". This is that route.
 *
 * `force-dynamic` because a route that throws at render cannot be prerendered — without it
 * the throw happens during `next build` and fails the build instead of producing a
 * response. The subject has to be a *request-time* failure, which is what a real 500 is.
 *
 * Excluded from production builds by the `pageExtensions` mechanism in `next.config.ts`,
 * like its sibling.
 */
export const dynamic = 'force-dynamic';

export default function SsrThrowProbe() {
  throw new Error('gridsmith-ssr-throw-probe: deliberate server-render throw, gate subject for global-error');
}
