/** H4-B Preview-only operator recovery. Never run by CI or a browser. */
import { execFileSync } from 'node:child_process';

export const PREVIEW_REF = 'qfgpwumvvtizeamkynes';
export function supabase(args) {
  if (args.filter((value) => value === '--project-ref').length !== 1 ||
      args[args.indexOf('--project-ref') + 1] !== PREVIEW_REF ||
      args.some((value) => ['--db-url', '--local', '--debug', '--prune'].includes(value))) {
    throw new Error('H4-B CLI commands require the exact isolated Preview project');
  }
  // Only non-secret arguments enter the process command line. API keys stay in memory.
  const quote = (value) => "'" + value.replaceAll("'", "''") + "'";
  try {
    const output = process.platform === 'win32'
      ? execFileSync('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command',
        `& npx.cmd --yes supabase@2.119.0 ${args.map(quote).join(' ')}; exit $LASTEXITCODE`], { encoding: 'utf8', windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] })
      : execFileSync('npx', ['--yes', 'supabase@2.119.0', ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    return output;
  } catch { throw new Error('Preview CLI operation failed; provider output suppressed to protect credentials'); }
}

export function previewServiceKey() {
  try {
    const keys = JSON.parse(supabase(['projects', 'api-keys', '--project-ref', PREVIEW_REF, '--output', 'json']));
    const key = keys.find((item) => item.name === 'service_role')?.api_key;
    if (!key) throw new Error();
    const claims = JSON.parse(Buffer.from(key.split('.')[1], 'base64url'));
    if (claims.role !== 'service_role' || claims.ref !== PREVIEW_REF) throw new Error();
    return key;
  } catch { throw new Error('Preview private worker credential unavailable or provenance failed'); }
}

export async function reconcile(operation) {
  if (!['health', 'drain'].includes(operation)) throw new Error('Choose health or drain; this command operates only on H4-B Preview');
  const project = `https://${PREVIEW_REF}.supabase.co`;
  const response = await fetch(`${project}/functions/v1/gs-notification-worker`, {
    method: 'POST', headers: { Authorization: `Bearer ${previewServiceKey()}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ operation }), signal: AbortSignal.timeout(60_000),
  });
  if (!response.ok) throw new Error(`Preview worker unavailable (${response.status}); no raw response retained`);
  const result = await response.json();
  if (result.status !== 'ok') throw new Error('Unexpected private worker result');
  // Deliberately print only aggregate numbers/booleans, never a whole provider response.
  const safe = { operation, project: PREVIEW_REF };
  for (const key of ['claimed', 'sent', 'retry', 'dead', 'unconfirmed', 'mailConfigured']) {
    if (typeof result[key] === 'number' || typeof result[key] === 'boolean') safe[key] = result[key];
  }
  if (operation === 'health') {
    safe.queue = Object.fromEntries(['pending', 'processing', 'retry', 'dead', 'sent', 'oldest_pending_seconds']
      .filter((key) => typeof result.queue?.[key] === 'number').map((key) => [key, result.queue[key]]));
    const intake = await fetch(`${project}/functions/v1/gs-lead-intake`, { method: 'OPTIONS',
      headers: { Origin: 'http://localhost:3236', 'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'content-type' }, signal: AbortSignal.timeout(15_000) });
    safe.intakeResponsive = intake.status === 204;
  }
  return safe;
}
if (process.argv[1]?.endsWith('reconcile-preview-outbox.mjs')) {
  try { console.log(JSON.stringify(await reconcile(process.argv[2]))); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}
