#!/usr/bin/env node
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { leadSchema, MAX_LEAD_PAYLOAD_BYTES } from '../lib/leads/schema.ts';
import { enquiryHref, readEnquiryContext } from '../lib/services/architecture.ts';

const valid = {
  division: 'design',
  full_name: 'Security Probe',
  email: 'security@gridsmith.invalid',
};

const parsed = leadSchema.parse({
  ...valid,
  status: 'won',
  notes: 'must never reach the insert',
  notified_at: '2099-01-01T00:00:00Z',
  crm_synced_at: '2099-01-01T00:00:00Z',
});
for (const protectedField of ['status', 'notes', 'notified_at', 'crm_synced_at', 'created_at']) {
  assert.equal(protectedField in parsed, false, `${protectedField} escaped schema stripping`);
}

const rejected = [
  { ...valid, email: 'not-an-email' },
  { ...valid, division: 'legal' },
  { ...valid, full_name: '   ' },
  { ...valid, message: 'x'.repeat(5001) },
  { ...valid, payload: { answer: 'x'.repeat(MAX_LEAD_PAYLOAD_BYTES) } },
  { ...valid, payload: [] },
];
for (const specimen of rejected) assert.equal(leadSchema.safeParse(specimen).success, false);

const submit = readFileSync('lib/leads/submit.ts', 'utf8');
assert.match(submit, /import ['"]server-only['"]/);
assert.match(submit, /process\.env\.SUPABASE_SERVICE_ROLE_KEY/);
assert.doesNotMatch(submit, /process\.env\.PUBLISHABLE_KEY/);
assert.match(submit, /JSON\.stringify\(\{ id, \.\.\.parsed\.data \}\)/);

/**
 * `GS-P03` — CTA context reaches the lead, and only well-formed context does.
 *
 * Every division CTA links to `/contact?division=…&service=…`. Three things must hold: the link
 * round-trips through the form's reader, malformed context is dropped rather than forwarded, and
 * the form and the Server Action both carry `service_slug` by name. The last two are source
 * assertions because the mapping is a named-field read and dropping it would be silent.
 */
const contextCases = [
  [enquiryHref('design', 'brand-identity'), { division: 'design', service: 'brand-identity' }],
  [enquiryHref('press'), { division: 'press' }],
  [enquiryHref(), {}],
  [enquiryHref('digital', 'Not A Slug'), { division: 'digital' }],
  ['/contact?division=legal&service=brand-identity', {}],
  ['/contact?division=press&service=%3Cscript%3E', { division: 'press' }],
  [`/contact?division=digital&service=${'a'.repeat(201)}`, { division: 'digital' }],
];
for (const [href, expected] of contextCases) {
  assert.deepEqual(readEnquiryContext(href.split('?')[1] ?? ''), expected, `enquiry context for ${href}`);
}
const action = readFileSync('lib/leads/action.ts', 'utf8');
assert.match(action, /service_slug: str\(formData, 'service_slug'\)/, 'the Server Action drops CTA service context');
const form = readFileSync('components/leads/ContactForm.tsx', 'utf8');
assert.match(form, /readEnquiryContext\(window\.location\.search\)/, 'the contact form never reads CTA context');
assert.match(form, /name="service_slug"/, 'the contact form never submits CTA service context');

console.log(`check-lead-security: protected fields stripped, ${rejected.length} malformed payloads rejected, ${MAX_LEAD_PAYLOAD_BYTES}-byte payload ceiling enforced, the insert uses the server-only service credential, and ${contextCases.length} CTA context cases round-trip or are dropped`);
