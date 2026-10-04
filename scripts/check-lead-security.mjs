#!/usr/bin/env node
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { register } from 'node:module';
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
assert.match(action, /submitLead\(contactLeadFrom\(formData\)\)/, 'the Server Action bypasses shared named-field extraction');
const domain = readFileSync('lib/leads/form-domain.ts', 'utf8');
assert.match(domain, /service_slug: str\(formData, 'service_slug'\)/, 'shared extraction drops CTA service context');
const form = readFileSync('components/leads/ContactForm.tsx', 'utf8');
assert.match(form, /readEnquiryContext\(window\.location\.search\)/, 'the contact form never reads CTA context');
assert.match(form, /name="service_slug"/, 'the contact form never submits CTA service context');

console.log(`check-lead-security: protected fields stripped, ${rejected.length} malformed payloads rejected, ${MAX_LEAD_PAYLOAD_BYTES}-byte payload ceiling enforced, the insert uses the server-only service credential, and ${contextCases.length} CTA context cases round-trip or are dropped`);

/**
 * `GS-PROD-001` — bot protection, asserted on the real adapters with the network mocked.
 *
 * Runs under `--conditions=react-server` (the npm script) so `server-only` resolves as it does
 * in a Server Action. Credentials are dummies and `fetch` is a recorder answering HTTP 599, so
 * nothing can be written anywhere: a call that reaches the insert ends at `insert failed` before
 * `after()` or any mail.
 *
 * **The control case is what makes the trap readings evidence.** A clean, valid form must reach
 * `fetch` exactly once; only then does "the trapped form made zero calls" say the guard stopped
 * it rather than that nothing could have reached the network. (`CLAUDE.md`: a probe has to
 * satisfy the gate's predicate.)
 */
// `next/server` and `next/navigation` ship no `exports` map, so Node's ESM resolver needs the
// files Next's bundler resolves them to (the server entry for navigation, as in a Server Action).
register('data:text/javascript,' + encodeURIComponent(
  "const MAP = { 'next/server': 'next/server.js', 'next/navigation': 'next/dist/client/components/navigation.react-server.js' };" +
    ' export async function resolve(s, c, n) { return n(MAP[s] ?? s, c); }',
));
process.env.PROJECT_URL = 'https://lead-security.invalid';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'lead-security-dummy';
const calls = [];
globalThis.fetch = async (url) => {
  calls.push(String(url));
  return new Response(null, { status: 599 });
};
const { HONEYPOT_FIELD, isTrapped } = await import('../lib/leads/guard.ts');
const { submitLeadAction } = await import('../lib/leads/action.ts');
const { submitPressLeadAction } = await import('../lib/leads/pressAction.ts');

const formOf = (fields) => {
  const f = new FormData();
  for (const [k, v] of Object.entries(fields)) f.set(k, v);
  return f;
};
const clean = { division: 'design', full_name: 'Security Probe', email: 'security@gridsmith.invalid' };

// isTrapped: return values, each branch.
assert.equal(isTrapped(formOf(clean)), false, 'absent trap read as filled');
assert.equal(isTrapped(formOf({ ...clean, [HONEYPOT_FIELD]: '' })), false, 'empty trap read as filled');
assert.equal(isTrapped(formOf({ ...clean, [HONEYPOT_FIELD]: 'x' })), true, 'filled trap not detected');
assert.equal(isTrapped(formOf({ ...clean, [HONEYPOT_FIELD]: new Blob(['x']) })), true, 'file in trap not detected');

// Control: a clean submission reaches the insert (and fails there, harmlessly).
calls.length = 0;
const control = await submitLeadAction({ status: 'idle' }, formOf(clean));
assert.equal(calls.length, 1, 'control: a clean form did not reach the insert, so the trap readings below prove nothing');
assert.equal(control.status, 'error', 'control: the mocked insert did not fail as arranged');

// Trap on the main adapter: answers ok, zero network calls.
calls.length = 0;
const trapped = await submitLeadAction({ status: 'idle' }, formOf({ ...clean, [HONEYPOT_FIELD]: 'https://spam.example' }));
assert.equal(trapped.status, 'ok', 'a trapped submission must look like success to the bot');
assert.equal(calls.length, 0, 'a trapped submission reached the network');

// Trap on the Press adapter: redirects to the confirmation, zero network calls.
calls.length = 0;
let redirected = null;
try {
  await submitPressLeadAction({ status: 'idle' }, formOf({ ...clean, [HONEYPOT_FIELD]: 'x' }));
} catch (error) {
  redirected = String(error?.digest ?? error);
}
assert.match(redirected ?? '', /\/press\/contact\/thank-you/, 'a trapped Press submission did not redirect to the confirmation');
assert.equal(calls.length, 0, 'a trapped Press submission reached the network');

// A link in the name is refused visibly, before the insert.
calls.length = 0;
const linked = await submitLeadAction({ status: 'idle' }, formOf({ ...clean, full_name: 'Buy now www.spam.example' }));
assert.equal(linked.status, 'invalid', 'a link in the name field was accepted');
assert.ok(linked.errors.full_name, 'the link refusal is not attached to the name field');
assert.equal(calls.length, 0, 'a name carrying a link reached the network');
assert.equal(leadSchema.safeParse({ ...valid, full_name: 'Anne-Marie O’Neil' }).success, true, 'an ordinary name was refused');

// Both forms render the trap.
for (const file of ['components/leads/ContactForm.tsx', 'components/divisions/press/PressContactFlow.tsx']) {
  assert.match(readFileSync(file, 'utf8'), /<Honeypot \/>/, `${file} does not render the bot trap`);
}

console.log(`check-lead-security: bot trap — 4 isTrapped cases, control reached the insert once, trapped main/Press submissions made 0 network calls, a linked name refused before the insert, both forms render the trap`);
