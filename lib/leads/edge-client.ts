/** Static browser transport only. No schemas, privileged configuration or browser persistence. */
import type { FormState } from './form-domain.ts';
type Attempt = { body: string; requestId: string; pending?: Promise<FormState> };
const attempts = new Map<'contact' | 'press', Attempt>();

async function submit(formType: 'contact' | 'press', form: FormData): Promise<FormState> {
  const fields: Record<string, string | string[]> = Object.create(null);
  for (const [key, value] of form) {
    if (typeof value !== 'string') return { status: 'error', detail: 'request-rejected' };
    const previous = fields[key];
    fields[key] = previous === undefined ? value : [...(Array.isArray(previous) ? previous : [previous]), value];
  }
  const body = JSON.stringify(fields);
  let attempt = attempts.get(formType);
  if (attempt?.pending) return attempt.body === body ? attempt.pending : { status: 'error', detail: 'submission-pending' };
  if (!attempt || attempt.body !== body) {
    attempt = { body, requestId: crypto.randomUUID() }; attempts.set(formType, attempt);
  }
  if (attempt.pending) return attempt.pending;
  const current = attempt;
  current.pending = (async () => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_LEAD_INTAKE_URL!, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'omit',
        body: JSON.stringify({ formType, requestId: current.requestId, fields }), signal: AbortSignal.timeout(20000),
      });
      const reader = response.body?.getReader();
      if (!reader) throw new Error('Missing response');
      const decoder = new TextDecoder('utf-8', { fatal: true });
      let text = '', size = 0;
      for (;;) {
        const { done, value } = await reader.read(); if (done) break;
        size += value.length;
        if (size > 16_384) { await reader.cancel(); throw new Error('Oversized response'); }
        text += decoder.decode(value, { stream: true });
      }
      const result = JSON.parse(text + decoder.decode());
      if (response.status === 202 && result.status === 'ok' && typeof result.id === 'string' &&
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(result.id)) {
        if (formType === 'press') window.location.assign('/press/contact/thank-you');
        return { status: 'ok', id: result.id };
      }
      if (response.status === 422 && result.status === 'invalid' && result.errors && typeof result.errors === 'object' && !Array.isArray(result.errors) &&
        Object.keys(result.errors).length > 0 && Object.keys(result.errors).length <= 50 &&
        Object.values(result.errors).every((messages) => Array.isArray(messages) && messages.length > 0 && messages.length <= 10 &&
          messages.every((message) => typeof message === 'string' && message.length <= 1000))) {
        return { status: 'invalid', errors: result.errors };
      }
      return { status: 'error', detail: [429,503].includes(response.status) ? 'temporarily-unavailable' : 'request-rejected' };
    } catch { return { status: 'error', detail: 'network-unavailable' }; }
    finally { current.pending = undefined; }
  })();
  return current.pending;
}
export const submitContactEdge = (_previous: FormState, form: FormData) => submit('contact', form);
export const submitPressEdge = (_previous: FormState, form: FormData) => submit('press', form);
