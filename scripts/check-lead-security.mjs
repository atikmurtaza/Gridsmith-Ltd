#!/usr/bin/env node
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { leadSchema, MAX_LEAD_PAYLOAD_BYTES } from '../lib/leads/schema.ts';

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

console.log(`check-lead-security: protected fields stripped, ${rejected.length} malformed payloads rejected, ${MAX_LEAD_PAYLOAD_BYTES}-byte payload ceiling enforced, and the insert uses the server-only service credential`);
