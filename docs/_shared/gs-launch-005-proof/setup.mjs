/** Prepares only the labelled disposable container; never uploads or modifies a hosted site. */
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { inspectOperatorError, readArtifact } from '../../../scripts/check-static-artifact.mjs';

const docker = (...args) => execFileSync('docker', args, { encoding: 'utf8', windowsHide: true });
assert.equal(docker('inspect', '--format', '{{index .Config.Labels "gridsmith.task"}}', 'gs-launch005-proof').trim(), 'GS-LAUNCH-005');
assert.deepEqual(inspectOperatorError(readArtifact('ops/hostinger-error')), []);
const original = readFileSync('build/production-rehearsal/.htaccess', 'utf8');
const identity = JSON.parse(readFileSync('build/production-rehearsal/__deployment.json'));
assert.equal(identity.rehearsal, true); assert.equal(identity.deployable, false);
let rules = original;
const changes = [
  ['Require all denied\n', ''],
  ['RewriteCond %{HTTPS} !=on\nRewriteRule ^ https://gridsmith.uk%{REQUEST_URI} [R=308,L,NE]\n', ''],
  ['!^gridsmith\\.uk$', '!^127\\.0\\.0\\.1:3354$'],
  ['https://gridsmith.uk', 'http://127.0.0.1:3354'],
];
for (const [before, after] of changes) {
  const count = rules.split(before).length - 1; assert(count > 0, before);
  rules = rules.replaceAll(before, after);
}
writeFileSync('build/gs-launch-005/simulation.htaccess', rules);
writeFileSync('build/gs-launch-005/colocated.htaccess', 'ErrorDocument 500 /500.html\nRewriteEngine On\nRewriteRule ^induced-500$ - [R=500,L]\n');
docker('exec', 'gs-launch005-proof', 'mkdir', '-p', '/proof/site', '/proof/rehearsal', '/proof/fallback', '/proof/co-located');
for (const folder of ['site', 'rehearsal']) docker('cp', 'build/production-rehearsal/.', `gs-launch005-proof:/proof/${folder}/`);
for (const [source, destination] of [
  ['build/gs-launch-005/simulation.htaccess', '/proof/site/.htaccess'],
  ['build/gs-launch-005/colocated.htaccess', '/proof/co-located/.htaccess'],
  ['ops/hostinger-error/error.html', '/proof/fallback/error.html'],
  ['ops/hostinger-error/error.html', '/proof/co-located/500.html'],
  ['docs/_shared/gs-launch-005-proof/apache.conf', '/proof/apache.conf'],
]) docker('cp', source, `gs-launch005-proof:${destination}`);
docker('exec', 'gs-launch005-proof', 'chown', '-R', 'node:node', '/proof');
const syntax = docker('exec', '--user', 'node', 'gs-launch005-proof', 'apache2', '-t', '-f', '/proof/apache.conf');
const sha = b => createHash('sha256').update(b).digest('hex');
writeFileSync('build/gs-launch-005/setup.json', JSON.stringify({ localOnly: true, syntax, syntaxCheckExit: 0,
  simulatorConfigurationSha256: sha(readFileSync('docs/_shared/gs-launch-005-proof/apache.conf')),
  originalRulesSha256: sha(original), simulationRulesSha256: sha(rules), adaptations: changes,
  originalArtifactIdentity: identity.artifactIdentity }, null, 2) + '\n');
console.log('Labelled local simulation prepared; original rehearsal untouched. Start Apache as node, then run verify.mjs alone.');
