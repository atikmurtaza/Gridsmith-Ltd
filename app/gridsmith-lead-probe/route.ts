import { notifyConfigured, notifyLead } from '@/lib/leads/notify';
import { leadSchema } from '@/lib/leads/schema';
import { submitLead } from '@/lib/leads/submit';

/**
 * **A permanent gate subject. Do not delete this route.**
 *
 * `A-08`'s pipeline cannot be verified by importing it: `lib/leads/submit.ts` carries
 * `server-only`, which throws outside a bundler with the react-server condition — correctly,
 * because that import is what stops the module and its credentials reaching a client bundle.
 * So the pipeline is exercised the way it will actually run: through the Next runtime, over
 * HTTP, against the real Supabase project.
 *
 * That is also the stronger form. `A-07` established that the RLS posture is only observable
 * from outside — a view that looked correct in SQL was serving lead data to `anon`. A probe
 * that called the function in-process would prove the function; this proves the deployment.
 *
 * `force-dynamic` because it writes.
 *
 * ## This probe is excluded from production at RUNTIME, and it is the only one that is
 *
 * The other probes are pages and are excluded by the `pageExtensions` rename in
 * `next.config.ts` — the mechanism exists because a page kept in the build and 404'd at
 * runtime still ships its client chunk, and `/_kitchen-sink`'s is 5.8KB of primitives.
 *
 * **That mechanism cannot be used on a route handler, and only a deployment showed why.**
 * With the file named `route.probe.ts`, Next does not emit
 * `route_client-reference-manifest.js` for it; with the file named `route.ts`, it does.
 * Vercel's output collection expects that file for every app route entry either way, so the
 * deployment failed with `ENOENT ... route_client-reference-manifest.js` while `next build`
 * itself succeeded — locally, and on Vercel's own builder, printing a full route table
 * immediately before the failure. Verified by building both ways and listing
 * `.next/server/app/gridsmith-lead-probe/`. Page probes are unaffected:
 * `gridsmith-error-probe` gets its `page_client-reference-manifest.js` under the custom
 * extension without complaint.
 *
 * The runtime guard below costs nothing here for the same reason the rename was needed
 * there: **a route handler has no client chunk to ship.** The trade the `pageExtensions`
 * docstring rejected for pages does not apply to this file.
 *
 * `GRIDSMITH_EXCLUDE_PROBES` is honoured alongside `VERCEL_ENV` so the two exclusion
 * mechanisms answer to the same switch.
 */

const EXCLUDED =
  process.env.VERCEL_ENV === 'production' || process.env.GRIDSMITH_EXCLUDE_PROBES === '1';

/** 404 rather than 403: an excluded probe should be indistinguishable from an absent one. */
function excluded() {
  return new Response(null, { status: 404 });
}

/**
 * ## The rest of the original docstring
 *
 * **It also sits at the app root rather than inside `(marketing)`.** That move was made first,
 * on the theory that the route group was the cause — the ENOENT named the grouped path. It was
 * not the cause: the identical error came back at the ungrouped path, which is what sent the
 * investigation to the file extension. The move is kept because a route handler takes nothing
 * from a layout and the URL is unchanged, but **it fixed nothing and is recorded as such** —
 * a plausible fix that is not the fix is exactly the kind of thing a later reader will
 * otherwise credit.
 *
 * **One row per valid POST, and they accumulate.** Invalid payloads never reach the database,
 * so only the gate's single valid case inserts. Pruning probe rows needs a privileged
 * connection, which CI must not hold — it belongs to the same job as `M-P1-3`'s drift check,
 * which already has the credential.
 *
 * ## Two modes, and the difference is stated rather than hidden
 *
 * `POST /gridsmith-lead-probe` runs the **production path**: validate, insert, return. The
 * notification is scheduled with `after()` and is deliberately not awaited, so its outcome
 * cannot appear in the response — that is the behaviour being asserted, not a limitation.
 *
 * `POST /gridsmith-lead-probe?mode=notify` calls `notifyLead` directly and returns its
 * outcomes. **This is not the production path** and the gate labels it as such. It exists
 * because the branches — configured, unset, broken — are otherwise unobservable from outside,
 * and an unobservable branch is one nobody proves.
 */
export const dynamic = 'force-dynamic';

export async function POST(request: Request): Promise<Response> {
  if (EXCLUDED) return excluded();

  const body: unknown = await request.json().catch(() => null);

  if (new URL(request.url).searchParams.get('mode') === 'notify') {
    const parsed = leadSchema.safeParse(body);
    if (!parsed.success) return Response.json({ status: 'invalid' }, { status: 200 });
    return Response.json(
      // `configured` is the SERVER's view, not the caller's — see notifyConfigured().
      { configured: notifyConfigured(), notifications: await notifyLead(parsed.data, 'probe-no-insert') },
      { status: 200 },
    );
  }

  const result = await submitLead(body);
  return Response.json(result, { status: result.status === 'ok' ? 201 : 200 });
}
