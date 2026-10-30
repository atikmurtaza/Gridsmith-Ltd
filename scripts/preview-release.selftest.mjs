/** Permanent value-based proofs for every release and publication predicate. */
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { acceptanceProblems, approvalProblems, ACCEPTANCE_COMMANDS, normalVerificationPassed, waitForNormalVerification } from './preview-release.mjs';
import { ownerPreviewIdentityAllowed } from '../lib/build/target.ts';
const sha = text => createHash('sha256').update(text).digest('hex');
const identity = { profile: 'owner-preview', siteOrigin: 'https://mediumaquamarine-wallaby-594070.hostingersite.com',
  dataset: 'production', legalPreview: true, contactMode: 'direct', intakeOrigin: null, rehearsal: false,
  deployable: false, releaseStatus: 'ACCEPTANCE_PENDING', sourceModified: false, sourceSha: 'a'.repeat(40), artifactIdentity: 'b'.repeat(64) };
const receipt = { sourceSha: identity.sourceSha, artifactIdentity: identity.artifactIdentity, platform: 'linux', runId: '123',
  candidateIdentitySha256: sha(JSON.stringify(identity) + '\n'), checks: ACCEPTANCE_COMMANDS.map(args => ({ command: ['node', ...args], exitCode: 0 })) };
const audit = { metadata: { vulnerabilities: { total: 0 } }, vulnerabilities: {} };
const inspect = (id = identity, rec = receipt, audits = [audit, audit]) => acceptanceProblems(id, rec, audits, identity.sourceSha, '123');
assert.deepEqual(inspect(), []);
assert(normalVerificationPassed([{ name: 'verify', status: 'completed', conclusion: 'success' }]));
assert.equal(normalVerificationPassed([{ name: 'verify', status: 'in_progress', conclusion: null }]), false);
assert.throws(() => normalVerificationPassed([]), /job missing/);
for (const conclusion of ['failure', 'cancelled', 'skipped', null]) {
  assert.throws(() => normalVerificationPassed([{ name: 'verify', status: 'completed', conclusion }]), /did not pass/);
}
let proofs = 8;
for (const [id, rec, audits, code] of [
  [{ ...identity, sourceModified: true }, receipt, [audit, audit], 'CANDIDATE'],
  [{ ...identity, deployable: true }, receipt, [audit, audit], 'CANDIDATE'],
  [identity, { ...receipt, sourceSha: 'c'.repeat(40) }, [audit, audit], 'EXACT_ACCEPTANCE'],
  [identity, { ...receipt, artifactIdentity: 'c'.repeat(64) }, [audit, audit], 'EXACT_ACCEPTANCE'],
  [identity, { ...receipt, candidateIdentitySha256: 'c'.repeat(64) }, [audit, audit], 'EXACT_ACCEPTANCE'],
  [identity, { ...receipt, platform: 'win32' }, [audit, audit], 'EXACT_ACCEPTANCE'],
  [identity, { ...receipt, runId: '124' }, [audit, audit], 'EXACT_ACCEPTANCE'],
  [identity, { ...receipt, checks: [] }, [audit, audit], 'CHECKS'],
  [identity, receipt, [audit], 'AUDITS'],
  [identity, receipt, [audit, {}], 'SECURITY'],
  [identity, receipt, [audit, { metadata: { vulnerabilities: { total: 9 } }, vulnerabilities: { package: {} } }], 'SECURITY'],
]) { assert(inspect(id, rec, audits).includes(code), code); proofs++; }
for (let index = 0; index < ACCEPTANCE_COMMANDS.length; index++) for (const change of [{ exitCode: 1 }, { command: ['node', 'unexpected'] }]) {
  const rec = structuredClone(receipt); Object.assign(rec.checks[index], change);
  assert(inspect(identity, rec).includes('CHECKS')); proofs++;
}
const accepted = { ...identity, deployable: true, releaseStatus: 'ACCEPTANCE_PASSED', acceptance: {
  sourceSha: identity.sourceSha, artifactIdentity: identity.artifactIdentity, evidenceSha256: 'c'.repeat(64), runId: '123' } };
assert(ownerPreviewIdentityAllowed(accepted)); proofs++;
for (const field of ['sourceSha', 'artifactIdentity', 'evidenceSha256', 'runId']) {
  const changed = structuredClone(accepted); changed.acceptance[field] = '';
  assert(!ownerPreviewIdentityAllowed(changed)); proofs++;
}
const approval = { status: 'OWNER_APPROVED', owner: 'synthetic-test-only', approvedAt: '2026-10-25T00:00:00Z',
  sourceSha: identity.sourceSha, artifactIdentity: identity.artifactIdentity, acceptanceRunId: '123',
  siteOrigin: identity.siteOrigin, artifactBranch: 'codex/gs-hostinger-artifact', rootSeparationVerified: true,
  autoDeployment: false, destinationEvidenceSha256: 'd'.repeat(64), previousArtifactSha: 'e'.repeat(40), rollbackEvidenceSha256: 'f'.repeat(64) };
const authorize = (id, ap) => { const raw = JSON.stringify(ap); return approvalProblems(id, ap, identity.artifactIdentity, sha(raw), raw); };
assert.deepEqual(authorize(accepted, approval), []); proofs++;
assert(authorize(identity, approval).includes('RELEASE')); proofs++;
for (const [field, value, code] of [
  ['artifactIdentity', '', 'EXACT_APPROVAL'], ['sourceSha', '', 'EXACT_APPROVAL'], ['acceptanceRunId', '', 'EXACT_APPROVAL'],
  ['status', 'PENDING', 'OWNER_APPROVAL'], ['owner', '', 'OWNER_APPROVAL'], ['approvedAt', '', 'OWNER_APPROVAL'],
  ['siteOrigin', 'https://gridsmith.uk', 'DESTINATION'], ['artifactBranch', 'main', 'DESTINATION'],
  ['rootSeparationVerified', false, 'DESTINATION'], ['autoDeployment', true, 'DESTINATION'],
  ['destinationEvidenceSha256', '', 'DESTINATION'], ['previousArtifactSha', '', 'ROLLBACK'], ['rollbackEvidenceSha256', '', 'ROLLBACK'],
]) { assert(authorize(accepted, { ...approval, [field]: value }).includes(code), code); proofs++; }
assert(approvalProblems(accepted, approval, identity.artifactIdentity, '0'.repeat(64), JSON.stringify(approval)).includes('OWNER_APPROVAL')); proofs++;

// Exercise the actual asynchronous prerequisite path; fake time makes bounded refusals observable.
const job = (status = 'completed', conclusion = 'success') => ({ jobs: [{ name: 'verify', status, conclusion }] });
const api = (body, status = 200, headers = {}) => new Response(JSON.stringify(body), { status, headers });
async function poll(sequence, error, expectedDelays) {
  let time = 0, calls = 0; const delays = [];
  const result = waitForNormalVerification('https://example.invalid/jobs', 'test-only', {
    now: () => time,
    delay: async ms => { delays.push(ms); time += ms; },
    request: async (_url, options) => {
      assert(options.signal instanceof AbortSignal); assert.equal(options.headers.Authorization, 'Bearer test-only');
      const item = sequence[calls++]; assert(item, 'poll made an unexpected request');
      if (item instanceof Error) throw item;
      return typeof item === 'function' ? item(() => { time = 120 * 60_000; }) : item;
    },
  });
  if (error) await assert.rejects(result, error); else await result;
  assert.equal(calls, sequence.length);
  if (expectedDelays) assert.deepEqual(delays, expectedDelays);
  proofs++;
}
await poll([api(job('in_progress', null)), api({}, 502, { 'x-github-request-id': 'ABC:123' }), new Error('network'), api(job())], null, [30_000, 30_000, 30_000]);
for (const status of [408, 429, 500, 503]) await poll([api({}, status), api(job())], null, [status === 429 ? 60_000 : 30_000]);
await poll([api({}, 429, { 'retry-after': '90' }), api(job())], null, [90_000]);
await poll([api({}, 429, { 'retry-after': 'Thu, 01 Jan 1970 00:02:00 GMT' }), api(job())], null, [120_000]);
await poll([api({}, 403, { 'x-ratelimit-remaining': '0', 'x-ratelimit-reset': '95' }), api(job())], null, [95_000]);
await poll([api({}, 403, { 'retry-after': '75', 'x-ratelimit-remaining': '12' }), api(job())], null, [75_000]);
await poll([api({}, 403, { 'x-ratelimit-remaining': '0' }), api(job())], null, [60_000]);
await poll([api({}, 403, { 'retry-after': 'invalid' })], /HTTP 403/);
for (const status of [401, 403, 404]) await poll([api({}, status)], /HTTP/);
await poll(Array.from({ length: 6 }, () => api({}, 503)), /HTTP 503/);
await poll(Array.from({ length: 6 }, () => new Error('network')), /network retries exhausted/);
await poll([api({}, 429, { 'retry-after': '7200' })], /timed out/);
await poll([setDeadline => { setDeadline(); return api(job()); }], /timed out/);
await poll([setDeadline => ({ ok: true, json: async () => { setDeadline(); return job(); } })], /timed out/);
await poll([api({ jobs: [] })], /job missing/);
await poll([api({})], /find/);
await poll([new Response('invalid JSON')], /JSON/);
for (const conclusion of ['failure', 'cancelled', 'skipped', null]) await poll([api(job('completed', conclusion))], /did not pass/);

console.log(`Preview release predicates PASS: ${proofs} positive/adverse proofs; zero acceptance checks and every failed command reject; no synthetic approval is written.`);
