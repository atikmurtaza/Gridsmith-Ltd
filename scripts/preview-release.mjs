/** Package an acceptance-bound copy; the pending candidate is never edited or uploaded. */
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { cpSync, existsSync, readFileSync, writeFileSync, readdirSync, lstatSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { ownerPreviewIdentityAllowed } from '../lib/build/target.ts';

export const ACCEPTANCE_COMMANDS = [
  ['scripts/check-hostinger-http.mjs', '--local-owner-preview'], ['scripts/check-static-ui.mjs', '--legal-preview'],
  ['scripts/check-lhci.mjs', 'desktop'], ['scripts/lhci-report.mjs', 'desktop'],
  ['scripts/check-lhci.mjs', 'mobile'], ['scripts/lhci-report.mjs', 'mobile'],
];
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const read = path => JSON.parse(readFileSync(path));
export function normalVerificationPassed(jobs) {
  const normal = jobs.find(job => job.name === 'verify');
  assert(normal, 'Normal verification job missing');
  if (normal.status !== 'completed') return false;
  assert.equal(normal.conclusion, 'success', 'Normal verification did not pass');
  return true;
}
export function acceptanceProblems(identity, receipt, audits, sourceSha, runId) {
  const problems = [];
  if (!ownerPreviewIdentityAllowed(identity) || identity.deployable !== false || identity.sourceModified !== false ||
      identity.sourceSha !== sourceSha) problems.push('CANDIDATE');
  if (receipt.sourceSha !== sourceSha || receipt.artifactIdentity !== identity.artifactIdentity ||
      receipt.platform !== 'linux' || receipt.runId !== runId || !/^\d+$/.test(runId ?? '') ||
      receipt.candidateIdentitySha256 !== sha(JSON.stringify(identity) + '\n')) problems.push('EXACT_ACCEPTANCE');
  if (receipt.checks?.length !== ACCEPTANCE_COMMANDS.length || ACCEPTANCE_COMMANDS.some((args, i) =>
    receipt.checks[i]?.exitCode !== 0 || JSON.stringify(receipt.checks[i]?.command?.slice(1)) !== JSON.stringify(args))) problems.push('CHECKS');
  for (const audit of audits) {
    if (audit?.metadata?.vulnerabilities?.total !== 0 || !audit.vulnerabilities || Object.keys(audit.vulnerabilities).length) problems.push('SECURITY');
  }
  if (audits.length !== 2) problems.push('AUDITS');
  return problems;
}
export function approvalProblems(identity, approval, approvedArtifact, approvalHash, rawApproval) {
  const problems = [];
  if (!ownerPreviewIdentityAllowed(identity) || identity.deployable !== true || identity.releaseStatus !== 'ACCEPTANCE_PASSED') problems.push('RELEASE');
  if (identity.artifactIdentity !== approvedArtifact || approval.artifactIdentity !== approvedArtifact ||
      approval.sourceSha !== identity.sourceSha || approval.acceptanceRunId !== identity.acceptance?.runId) problems.push('EXACT_APPROVAL');
  if (approval.status !== 'OWNER_APPROVED' || !approval.owner?.trim() || !Number.isFinite(Date.parse(approval.approvedAt)) ||
      !/^[a-f0-9]{64}$/.test(approvalHash ?? '') || sha(rawApproval) !== approvalHash) problems.push('OWNER_APPROVAL');
  if (approval.siteOrigin !== identity.siteOrigin || approval.artifactBranch !== 'codex/gs-hostinger-artifact' ||
      approval.rootSeparationVerified !== true || approval.autoDeployment !== false ||
      !/^[a-f0-9]{64}$/.test(approval.destinationEvidenceSha256 ?? '')) problems.push('DESTINATION');
  if (!/^[a-f0-9]{40}$/.test(approval.previousArtifactSha ?? '') ||
      !/^[a-f0-9]{64}$/.test(approval.rollbackEvidenceSha256 ?? '')) problems.push('ROLLBACK');
  return problems;
}
function verifyFiles(directory, identity, tracked = false) {
  assert(Array.isArray(identity.files) && identity.files.length > 0);
  assert.equal(sha(JSON.stringify(identity.files)), identity.artifactIdentity);
  for (const file of identity.files) {
    assert(!file.path.split('/').some(part => ['..', '.', ''].includes(part)) && !/^[\/]|\\|:|\0/.test(file.path));
    const bytes = readFileSync(`${directory}/${file.path}`);
    assert.equal(bytes.length, file.bytes, file.path); assert.equal(sha(bytes), file.sha256, file.path);
  }
  const actual = tracked ? spawnSync('git', ['-C', directory, 'ls-files', '-z'], { encoding: 'utf8' }).stdout.split('\0').filter(Boolean).sort() : readdirSync(directory, { recursive: true }).filter(path => {
    const stat = lstatSync(`${directory}/${path}`); assert(!stat.isSymbolicLink(), 'Release symlink forbidden'); return stat.isFile();
  }).map(path => path.replaceAll('\\', '/')).sort();
  assert.deepEqual(actual, [...identity.files.map(file => file.path), '__deployment.json'].sort(), 'Release has extra or missing files');
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const mode = process.argv[2], sourceSha = spawnSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).stdout.trim();
  const directory = mode === 'prepare' ? 'build/owner-preview-candidate' : 'build/owner-preview-release';
  const identity = read(`${directory}/__deployment.json`); verifyFiles(directory, identity);
  assert.equal(identity.sourceSha, sourceSha, 'Release and workflow must use the same commit');
  if (mode === 'prepare') {
    assert.equal(process.env.GITHUB_ACTIONS, 'true', 'Release acceptance requires GitHub Actions');
    // Acceptance can run beside normal CI; neither result substitutes for the other.
    const deadline = Date.now() + 120 * 60_000;
    for (;;) {
      const response = await fetch(`https://api.github.com/repos/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}/jobs`, {
        headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}`, Accept: 'application/vnd.github+json' } });
      assert(response.ok, 'Cannot verify normal CI prerequisite');
      const jobs = await response.json();
      if (normalVerificationPassed(jobs.jobs)) break;
      assert(Date.now() < deadline, 'Normal verification timed out');
      console.log('Preview checks passed; waiting for the same-run normal verification prerequisite.');
      await new Promise(done => setTimeout(done, 30_000));
    }
    const receipt = read('build/gs-launch-018/acceptance.json');
    assert.deepEqual(acceptanceProblems(identity, receipt, ['production', 'full'].map(name =>
      read(`build/gs-launch-018/audit-${name}.json`)), sourceSha, process.env.GITHUB_RUN_ID), []);
    for (const check of receipt.checks) assert.equal(sha(readFileSync(`build/gs-launch-018/${check.log}`)), check.logSha256);
    assert(!existsSync('build/owner-preview-release'), 'Never overwrite an existing accepted release');
    const accepted = { ...identity, deployable: true, releaseStatus: 'ACCEPTANCE_PASSED', acceptance: {
      sourceSha, artifactIdentity: identity.artifactIdentity, evidenceSha256: sha(JSON.stringify(receipt)), runId: receipt.runId } };
    cpSync(directory, 'build/owner-preview-release', { recursive: true });
    writeFileSync('build/owner-preview-release/__deployment.json', JSON.stringify(accepted));
    const archive = `owner-preview-${sourceSha}.zip`;
    const zipped = spawnSync('zip', ['-q', '-r', `../${archive}`, '.'], { cwd: 'build/owner-preview-release' });
    assert.equal(zipped.status, 0, 'Release ZIP failed');
    const verified = spawnSync('python3', ['-I', '-c', `import hashlib,json,pathlib,sys,zipfile
root=pathlib.Path('build/owner-preview-release')
identity=json.loads((root/'__deployment.json').read_bytes())
names=[f['path'] for f in identity['files']]+['__deployment.json']
with zipfile.ZipFile(sys.argv[1]) as archive:
 files=[f for f in archive.infolist() if not f.is_dir()]
 assert sorted(f.filename for f in files)==sorted(names)
 for f in files:
  assert archive.read(f)==(root/f.filename).read_bytes(), f.filename
print('ZIP entries and every archived byte match the accepted release')`, `build/${archive}`], { encoding: 'utf8' });
    assert.equal(verified.status, 0, `Release ZIP verification failed: ${verified.stderr}`);
    writeFileSync('build/gs-launch-018/release.json', JSON.stringify({ sourceSha, artifactIdentity: identity.artifactIdentity,
      runId: receipt.runId, archive, archiveSha256: sha(readFileSync(`build/${archive}`)),
      files: [...identity.files, { path: '__deployment.json', bytes: Buffer.byteLength(JSON.stringify(accepted)), sha256: sha(JSON.stringify(accepted)) }] }, null, 2));
    console.log(`Accepted owner preview: ${sourceSha}; artifact ${identity.artifactIdentity}`);
  } else {
    assert.equal(mode, 'authorize');
    assert.equal(process.env.ACCEPTED_RUN_ID, identity.acceptance?.runId);
    assert(/^\d+$/.test(process.env.ACCEPTED_RUN_ID ?? ''));
    const response = await fetch(`https://api.github.com/repos/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.ACCEPTED_RUN_ID}`, {
      headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}`, Accept: 'application/vnd.github+json' } });
    assert(response.ok, 'Cannot verify accepted workflow run');
    const run = await response.json();
    assert.equal(run.head_sha, sourceSha); assert.equal(run.conclusion, 'success');
    assert.equal(run.path, '.github/workflows/ci.yml');
    const raw = process.env.OWNER_PREVIEW_APPROVAL ?? '';
    const approval = JSON.parse(raw);
    assert.deepEqual(approvalProblems(identity, approval, process.env.APPROVED_ARTIFACT, process.env.APPROVAL_SHA256, raw), []);
    const previous = spawnSync('git', ['-C', 'deployment', 'rev-parse', 'HEAD'], { encoding: 'utf8' });
    assert.equal(previous.status, 0); assert.equal(previous.stdout.trim(), approval.previousArtifactSha, 'Rollback branch changed');
    const oldIdentity = read('deployment/__deployment.json');
    assert.equal(oldIdentity.siteOrigin, identity.siteOrigin);
    verifyFiles('deployment', oldIdentity, true);
    console.log('Exact owner approval, accepted bytes, destination and rollback receipt verified.');
  }
}
