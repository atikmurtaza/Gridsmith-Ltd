/** H4-B Edge runtime. The project profile decides what it may do; reserved credentials stay inside Edge. */
import { edgeDeployment } from '../../../lib/leads/edge-deployment.ts';
declare const Deno: { env: { get(name: string): string | undefined } };
export const env = (name: string) => Deno.env.get(name) ?? '';
// Throws for any project other than the approved Preview or Production one (GS-R13-H4B).
export const deployment = edgeDeployment(env);
export const projectUrl = env('SUPABASE_URL').replace(/\/$/, '');
export const privateKey = env('SUPABASE_SERVICE_ROLE_KEY');
if (!privateKey) throw new Error('Edge service credential required');
export async function rpc<T>(name: string, body: Record<string, unknown> = {}): Promise<T> {
  const response = await fetch(`${projectUrl}/rest/v1/rpc/${name}`, { method: 'POST',
    headers: { apikey: privateKey, Authorization: `Bearer ${privateKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body), signal: AbortSignal.timeout(10000) });
  if (!response.ok) throw new Error('Private operation unavailable');
  return response.json();
}
/** Project-issued service JWTs may differ from the automatic Edge JWT.
 * Gateway signature verification stays enabled; PostgREST additionally proves
 * the supplied caller can execute the existing service-only health RPC.
 */
export async function authorizeWorker(request: Request): Promise<boolean> {
  const authorization = request.headers.get('Authorization') ?? '';
  try {
    if (!authorization.startsWith('Bearer ')) return false;
    const claims = JSON.parse(atob(authorization.slice(7).split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    if (claims.role !== 'service_role' || claims.ref !== deployment.ref) return false;
    const response = await fetch(`${projectUrl}/rest/v1/rpc/gs_notification_health`, {
      method: 'POST', headers: { apikey: privateKey, Authorization: authorization, 'Content-Type': 'application/json' },
      body: '{}', signal: AbortSignal.timeout(10000),
    });
    await response.body?.cancel();
    return response.ok;
  } catch { return false; }
}
