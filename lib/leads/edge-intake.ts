/** Portable HTTP boundary. Storage is injected; authoritative validation stays server-side. */
import { validateForm, type FormType } from './form-domain.ts';
import type { Lead } from './schema.ts';

// Includes JSON escaping overhead for every value the existing schemas accept.
export const INTAKE_BODY_BYTES = 65_536;
export type Admission = { outcome: 'accepted'; id: string } | { outcome: 'capacity' } | { outcome: 'conflict' };
export type IntakeStorage = (requestId: string, formType: FormType, lead: Lead) => Promise<Admission>;
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function createIntake(allowedOrigins: readonly string[], admit: IntakeStorage,
  wake?: () => void): (request: Request) => Promise<Response> {
  // Best-effort isolate burst relief, never presented as a global/per-person limit.
  let tokens = 20, lastRefill = performance.now();
  if (!allowedOrigins.length || allowedOrigins.some((origin) => {
    try { const url = new URL(origin); return url.origin !== origin ||
      (url.protocol !== 'https:' && !(url.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(url.hostname))); }
    catch { return true; }
  })) throw new Error('Exact approved intake origins required');
  return async (request) => {
    const origin = request.headers.get('Origin') ?? '';
    const allowed = allowedOrigins.includes(origin);
    const headers = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store',
      'Vary': 'Origin', 'X-Content-Type-Options': 'nosniff',
      ...(allowed ? { 'Access-Control-Allow-Origin': origin } : {}) };
    const reply = (status: number, value: unknown) => new Response(JSON.stringify(value), { status, headers });
    if (!allowed) return reply(403, { status: 'rejected' });
    if (request.method === 'OPTIONS') {
      if (request.headers.get('Access-Control-Request-Method') !== 'POST' ||
        (request.headers.get('Access-Control-Request-Headers') ?? '').split(',').some((name) =>
          name.trim() && name.trim().toLowerCase() !== 'content-type')) return reply(403, { status: 'rejected' });
      return new Response(null, { status: 204, headers: { ...headers,
        'Access-Control-Allow-Methods': 'POST', 'Access-Control-Allow-Headers': 'Content-Type' } });
    }
    if (request.method !== 'POST') return reply(405, { status: 'rejected' });
    if ((request.headers.get('Content-Type') ?? '').split(';')[0].trim().toLowerCase() !== 'application/json') {
      return reply(415, { status: 'rejected' });
    }
    const length = request.headers.get('Content-Length');
    if (length && (!/^\d+$/.test(length) || Number(length) > INTAKE_BODY_BYTES)) return reply(413, { status: 'rejected' });
    const tick = performance.now(); tokens = Math.min(20, tokens + (tick - lastRefill) / 500); lastRefill = tick;
    if (tokens < 1) return reply(429, { status: 'unavailable' });
    tokens--;
    let body: unknown;
    try {
      const reader = request.body?.getReader();
      if (!reader) return reply(400, { status: 'rejected' });
      const chunks: Uint8Array[] = []; let size = 0;
      for (;;) {
        const { done, value } = await reader.read(); if (done) break;
        size += value.length;
        if (size > INTAKE_BODY_BYTES) { await reader.cancel(); return reply(413, { status: 'rejected' }); }
        chunks.push(value);
      }
      const bytes = new Uint8Array(size); let offset = 0;
      for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
      body = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
    } catch { return reply(400, { status: 'rejected' }); }
    if (!body || typeof body !== 'object' || Array.isArray(body)) return reply(400, { status: 'rejected' });
    const input = body as Record<string, unknown>;
    if (Object.keys(input).some((key) => !['formType', 'requestId', 'fields'].includes(key)) ||
      typeof input.formType !== 'string' || !['contact', 'press'].includes(input.formType) || typeof input.requestId !== 'string' ||
      !uuid.test(input.requestId) || !input.fields || typeof input.fields !== 'object' || Array.isArray(input.fields)) {
      return reply(400, { status: 'rejected' });
    }
    const form = new FormData();
    for (const [key, value] of Object.entries(input.fields)) {
      if (key.length > 120 || !(typeof value === 'string' ||
        (Array.isArray(value) && value.every((item) => typeof item === 'string')))) return reply(400, { status: 'rejected' });
      for (const item of Array.isArray(value) ? value : [value]) form.append(key, item);
    }
    const formType = input.formType as FormType;
    const result = validateForm(formType, form);
    // Accepted legacy spam semantics: indistinguishable response, zero storage or wake work.
    if (result.status === 'trapped') return reply(202, { status: 'ok', id: crypto.randomUUID() });
    if (result.status === 'invalid') return reply(422, result);
    try {
      const admission = await admit(input.requestId, formType, result.lead);
      if (admission.outcome === 'capacity') return reply(503, { status: 'unavailable' });
      if (admission.outcome === 'conflict') return reply(409, { status: 'rejected' });
      // Wake failure never changes a committed admission; durable reconciliation owns recovery.
      try { wake?.(); } catch { /* Work remains durable. */ }
      return reply(202, { status: 'ok', id: admission.id });
    } catch { return reply(503, { status: 'unavailable' }); }
  };
}
