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
 * `force-dynamic` because it writes. Excluded from production builds by the `pageExtensions`
 * mechanism in `next.config.ts`, like the other probes.
 *
 * **It sits at the app root rather than inside `(marketing)`, and only a deployment showed
 * why.** In the route group, `next build` succeeded locally and on Vercel's builder — the
 * route table printed, the artefacts were written — and then Vercel's output collection failed
 * with `ENOENT ... (marketing)/gridsmith-lead-probe/route_client-reference-manifest.js`. Next
 * does not emit that manifest for a route handler, but a route group containing client
 * components makes the collector expect one. Nothing local reaches this step: `next start`
 * reads `.next` in place and never enumerates it. The URL is unchanged, so every gate that
 * measures this route still does; a route handler takes nothing from a layout, so leaving the
 * group costs it nothing.
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
