import { createWorker, drainTokenMatches, type NotificationWork } from '../../../lib/leads/edge-worker.ts';
import { scheduledDrainEnabled } from '../../../lib/leads/edge-deployment.ts';
import { deployment, env, authorizeWorker, rpc } from '../_shared/runtime.ts';
declare const Deno: { serve(handler: (request: Request) => Promise<Response>): void };
// The recipient is checked against the approved inbox by the project profile in runtime.ts.
Deno.serve(createWorker(authorizeWorker, {
  claim: () => rpc<NotificationWork[]>('gs_notification_claim', { p_batch: 5 }),
  finish: (work, outcome) => rpc<'sent' | 'retry' | 'dead' | null>('gs_notification_finish', {
    p_id: work.id, p_lease: work.lease_token, p_outcome: outcome }),
  health: () => rpc('gs_notification_health'),
  // Preview marks every message; Production marks only the synthetic smoke-test identity.
}, { key: env('RESEND_API_KEY'), from: env('LEAD_NOTIFICATION_FROM'), to: deployment.recipient, synthetic: !deployment.production },
fetch, {
  // GS-O025 scheduled retries: the gateway still verifies a project JWT (the publishable anon key
  // suffices); this header token then permits `drain` only, and only in Production `live` mode.
  authorize: (request) => drainTokenMatches(request.headers.get('X-Gridsmith-Drain-Token'), env('GRIDSMITH_DRAIN_TOKEN')),
  enabled: scheduledDrainEnabled(deployment),
}));
