import { createWorker, type NotificationWork } from '../../../lib/leads/edge-worker.ts';
import { env, authorizeWorker, rpc } from '../_shared/runtime.ts';
declare const Deno: { serve(handler: (request: Request) => Promise<Response>): void };
const recipient = env('LEAD_NOTIFICATION_EMAIL');
if (recipient && recipient !== 'contact@gridsmith.uk') throw new Error('H4-B recipient must match owner-approved test routing');
Deno.serve(createWorker(authorizeWorker, {
  claim: () => rpc<NotificationWork[]>('gs_notification_claim', { p_batch: 5 }),
  finish: (work, outcome) => rpc<'sent' | 'retry' | 'dead' | null>('gs_notification_finish', {
    p_id: work.id, p_lease: work.lease_token, p_outcome: outcome }),
  health: () => rpc('gs_notification_health'),
}, { key: env('RESEND_API_KEY'), from: env('LEAD_NOTIFICATION_FROM'), to: recipient, synthetic: true }));
