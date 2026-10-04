/** H4-B deploys to Preview only. Reserved project credentials remain inside Edge. */
declare const Deno: { env: { get(name: string): string | undefined } };
export const env = (name: string) => Deno.env.get(name) ?? '';
export const projectUrl = env('SUPABASE_URL').replace(/\/$/, '');
export const privateKey = env('SUPABASE_SERVICE_ROLE_KEY');
if (projectUrl !== 'https://qfgpwumvvtizeamkynes.supabase.co' || !privateKey) {
  throw new Error('H4-B requires the isolated Preview project');
}
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
    if (claims.role !== 'service_role' || claims.ref !== 'qfgpwumvvtizeamkynes') return false;
    const response = await fetch(`${projectUrl}/rest/v1/rpc/gs_notification_health`, {
      method: 'POST', headers: { apikey: privateKey, Authorization: authorization, 'Content-Type': 'application/json' },
      body: '{}', signal: AbortSignal.timeout(10000),
    });
    await response.body?.cancel();
    return response.ok;
  } catch { return false; }
}
