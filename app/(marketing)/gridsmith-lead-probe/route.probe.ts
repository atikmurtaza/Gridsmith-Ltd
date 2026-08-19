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
 * **One row per valid POST, and they accumulate.** Invalid payloads never reach the database,
 * so only the gate's single valid case inserts. Pruning probe rows needs a privileged
 * connection, which CI must not hold — it belongs to the same job as `M-P2-12`'s drift check,
 * which already has the credential.
 */
export const dynamic = 'force-dynamic';

export async function POST(request: Request): Promise<Response> {
  const body: unknown = await request.json().catch(() => null);
  const result = await submitLead(body);
  return Response.json(result, { status: result.status === 'ok' ? 201 : 200 });
}
