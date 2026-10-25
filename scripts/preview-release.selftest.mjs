/** Permanent value-based proofs for every release and publication predicate. */
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { acceptanceProblems, approvalProblems, ACCEPTANCE_COMMANDS } from './preview-release.mjs';
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
let proofs = 1;
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
console.log(`Preview release predicates PASS: ${proofs} positive/adverse proofs; zero acceptance checks and every failed command reject; no synthetic approval is written.`);
