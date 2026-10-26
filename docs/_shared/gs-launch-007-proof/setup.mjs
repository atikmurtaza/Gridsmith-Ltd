/** Prepares only a disposable loopback copy. The original denied rehearsal stays byte-identical. */
import assert from 'node:assert/strict';
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';

assert.equal(process.platform, 'linux');
assert(existsSync('/.dockerenv') && process.env.GS_LOCAL_PROOF === 'GS-LAUNCH-007');
assert.equal(resolve('.'), '/work/repo');
const base = 'build/gs-launch-007', source = 'build/production-rehearsal';
const identity = JSON.parse(readFileSync(`${source}/__deployment.json`));
assert.equal(identity.rehearsal, true); assert.equal(identity.deployable, false);
assert.equal(identity.sourceModified, false); assert.equal(identity.contactMode, 'direct');
const original = readFileSync(`${source}/.htaccess`, 'utf8');
assert(/^Require all denied$/m.test(original));
let rules = original;
const adaptations = [
  ['Require all denied\n', ''],
  ['RewriteCond %{HTTPS} !=on\nRewriteRule ^ https://gridsmith.uk%{REQUEST_URI} [R=308,L,NE]\n', ''],
  ['!^gridsmith\\.uk$', '!^127\\.0\\.0\\.1:(?:3236|3200)$'],
  ['https://gridsmith.uk', 'http://127.0.0.1:3236'],
  ['RewriteEngine On\n', 'RewriteEngine On\nRewriteRule ^induced-500$ - [R=500,L]\n'],
];
for (const [before, after] of adaptations) {
  assert(rules.includes(before), `Simulation premise missing: ${before}`);
  rules = rules.replaceAll(before, after);
}
mkdirSync(base, { recursive: true });
const destination = resolve(base, 'site');
assert.equal(destination, '/work/repo/build/gs-launch-007/site');
if (existsSync(destination)) rmSync(destination, { recursive: true });
cpSync(source, destination, { recursive: true });
writeFileSync(`${destination}/.htaccess`, rules);
assert.equal(readFileSync(`${source}/.htaccess`, 'utf8'), original);
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
writeFileSync(`${base}/simulation.json`, JSON.stringify({ localOnly: true,
  artifactIdentity: identity.artifactIdentity, adaptations,
  originalRulesSha256: sha(original), simulationRulesSha256: sha(rules) }, null, 2) + '\n');
console.log('Loopback-only static simulation prepared; original rehearsal still denied.');
