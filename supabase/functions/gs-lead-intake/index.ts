import { createIntake, type Admission } from '../../../lib/leads/edge-intake.ts';
import { env, privateKey, projectUrl, rpc } from '../_shared/runtime.ts';
declare const Deno: { serve(handler: (request: Request) => Promise<Response>): void };
declare const EdgeRuntime: { waitUntil(work: Promise<unknown>): void };
const origins: string[] = JSON.parse(env('GRIDSMITH_ALLOWED_ORIGINS'));
// Use the existing project-issued service JWT accepted by the private worker gateway.
// The automatic Edge RPC credential can differ and was observed to receive gateway 401.
const workerToken = env('GRIDSMITH_WORKER_TOKEN');
if (!workerToken) throw new Error('Private worker wake credential required');
const handler = createIntake(origins, async (requestId, formType, lead) => {
  // This non-production phase permits only explicitly synthetic enquiry identities.
  if (!lead.full_name.startsWith('GS-HOST-H4-B ') || !lead.email.endsWith('@gridsmith.invalid')) {
    return { outcome: 'conflict' };
  }
  return rpc<Admission>('gs_intake_admit', { p_request_id: requestId, p_form: formType, p_lead: lead });
}, () => EdgeRuntime.waitUntil(fetch(`${projectUrl}/functions/v1/gs-notification-worker`, {
  method: 'POST', headers: { apikey: privateKey, Authorization: `Bearer ${workerToken}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ operation: 'drain' }), signal: AbortSignal.timeout(55000),
}).then(async (response) => { await response.body?.cancel(); }).catch(() => undefined)));
Deno.serve(handler);
