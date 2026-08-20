/**
 * **A permanent gate subject. Do not delete this route.**
 *
 * `M-P1-1`. It hangs until the platform kills the invocation, which is the only way to
 * produce a **platform** error on demand — `FUNCTION_INVOCATION_TIMEOUT`.
 *
 * It exists to separate two conclusions that look identical from outside. When
 * `public/500.html` did not appear on a server-render crash, the available readings were
 * *"the custom error page is not configured"* and *"the custom error page is configured and
 * this class of failure does not reach it"*. Those call for completely different work. This
 * route answers it: if the platform's own error path serves our document, the mechanism is
 * live and the server-render crash simply never gets there.
 *
 * Excluded at runtime like `gridsmith-lead-probe`, and for the same reason — the
 * `pageExtensions` rename cannot be used on a route handler (`M-P2-27`).
 */
export const dynamic = 'force-dynamic';
export const maxDuration = 5;

const EXCLUDED =
  process.env.VERCEL_ENV === 'production' || process.env.GRIDSMITH_EXCLUDE_PROBES === '1';

export async function GET(): Promise<Response> {
  if (EXCLUDED) return new Response(null, { status: 404 });
  await new Promise((resolve) => setTimeout(resolve, 60_000));
  return new Response('unreachable: the platform should have killed this invocation');
}
