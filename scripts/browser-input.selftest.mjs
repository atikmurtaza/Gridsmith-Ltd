#!/usr/bin/env node
/** Non-executable installer/credential fixtures; default mode needs no node_modules or browser. */
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire, registerHooks } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { installationProblems, consumerProblems, discoverConfiguration, approvedManifest, responseProblems, verifiedReceipt, acquisitionIdentity, acquireAuthenticatedInput, assertStableInput } from './browser-input.mjs';

const workflowNames = ['.github/workflows/ci.yml', '.github/workflows/hostinger-staging.yml'];
const base = {
  env: { PUPPETEER_SKIP_DOWNLOAD: 'true' },
  sources: [{ name: 'scripts/safe-fixture.mjs', text: 'export const safe = true;' }],
  workflows: Object.fromEntries(workflowNames.map((name) => [name, readFileSync(name, 'utf8')])),
  gitConfig: [['remote.origin.url', 'https://github.com/example/public.git']],
  npmConfig: { registry: 'https://registry.npmjs.org/', 'engine-strict': 'true', 'ignore-scripts': 'false', omit: '' },
  npmConfigFiles: ['engine-strict=true\n'], configPaths: [],
  packageSha256: '52d2bf941250a94c5c66a99641dcbceafd988899c34ee791fb2ece68c04c79a6',
  lockSha256: '23511604b1b228b8959baad335dd91ece95b09707d46719af6610433db8fc45c',
};
assert.deepEqual(installationProblems(base), []);
let cases = 1;
const reached = [{ label: 'approved installation controls', predicate: 'installationProblems returns []' }];
const fileSnapshot = Object.fromEntries(['dev', 'ino', 'size', 'mtimeNs', 'ctimeNs', 'mode', 'uid', 'gid', 'nlink'].map((key, index) => [key, BigInt(index)]));
assertStableInput(fileSnapshot, { ...fileSnapshot }, { ...fileSnapshot }); cases++;
for (const key of Object.keys(fileSnapshot)) {
  for (const where of ['descriptor', 'named path']) {
    const changed = { ...fileSnapshot, [key]: fileSnapshot[key] + 1n };
    assert.throws(() => assertStableInput(fileSnapshot, where === 'descriptor' ? changed : fileSnapshot, where === 'named path' ? changed : fileSnapshot), /RAW_INPUT_CHANGED/);
    reached.push({ label: `synthetic stat ${where} ${key} replacement`, predicate: 'RAW_INPUT_CHANGED' }); cases++;
  }
}
function rejected(label, code, change) {
  const input = structuredClone(base);
  change(input);
  const problems = installationProblems(input);
  assert.ok(problems.includes(code), `${label}: expected ${code}; got ${problems.join(',')}`);
  assert.ok(!problems.join(',').includes('SYNTHETIC_SECRET'), `${label}: credential value leaked`);
  reached.push({ label, predicate: code });
  cases++;
}

for (const value of [undefined, '', 'false', '0', 'off', 'TRUE']) {
  rejected(`global skip ${String(value)}`, 'PUPPETEER_SKIP_REQUIRED', (input) => { input.env.PUPPETEER_SKIP_DOWNLOAD = value; });
}
for (const name of ['PUPPETEER_SKIP_CHROME_DOWNLOAD', 'PUPPETEER_CHROME_SKIP_DOWNLOAD', 'PUPPETEER_SKIP_CHROME_HEADLESS_SHELL_DOWNLOAD',
  'PUPPETEER_CHROME_HEADLESS_SHELL_SKIP_DOWNLOAD', 'PUPPETEER_BROWSER', 'PUPPETEER_CACHE_DIR', 'PUPPETEER_CHROME_VERSION']) {
  rejected(name, 'PUPPETEER_ENV_OVERRIDE', (input) => { input.env[name] = 'false'; });
}
for (const name of ['GH_TOKEN', 'GITHUB_TOKEN', 'NPM_TOKEN', 'NODE_AUTH_TOKEN', 'NPM_AUTH_TOKEN', 'YARN_NPM_AUTH_TOKEN', 'LHCI_TOKEN',
  'npm_config_//registry.npmjs.org/:_authToken', 'GIT_TOKEN', 'GIT_PASSWORD']) {
  rejected(name, 'INSTALL_CREDENTIAL_ENV', (input) => { input.env[name] = 'SYNTHETIC_SECRET'; });
}
for (const name of ['GIT_CONFIG', 'GIT_CONFIG_COUNT', 'GIT_CONFIG_KEY_0', 'GIT_CONFIG_VALUE_0', 'GIT_CONFIG_PARAMETERS', 'GIT_CONFIG_GLOBAL',
  'GIT_ASKPASS', 'SSH_ASKPASS', 'GIT_SSH', 'GIT_SSH_COMMAND', 'GIT_PROXY_COMMAND', 'GIT_HTTP_PROXY_AUTHMETHOD',
  'GIT_SSL_CERT', 'GIT_SSL_KEY', 'GIT_SSL_CAINFO', 'GIT_SSL_NO_VERIFY', 'SSH_AUTH_SOCK', 'SSH_AGENT_PID']) {
  rejected(name, 'GIT_AUTH_ENV', (input) => { input.env[name] = 'SYNTHETIC_SECRET'; });
}
const safeIsolation = structuredClone(base);
Object.assign(safeIsolation.env, { GIT_CONFIG_NOSYSTEM: '1', GIT_CONFIG_SYSTEM: '/dev/null', GIT_CONFIG_GLOBAL: '/dev/null' });
assert.deepEqual(installationProblems(safeIsolation), []);
cases++;
for (const name of ['NODE_OPTIONS', 'LD_PRELOAD', 'LD_LIBRARY_PATH', 'LD_AUDIT', 'NODE_TLS_REJECT_UNAUTHORIZED', 'NODE_EXTRA_CA_CERTS',
  'SSL_CERT_FILE', 'SSL_CERT_DIR', 'CURL_CA_BUNDLE', 'REQUESTS_CA_BUNDLE', 'HTTP_PROXY', 'HTTPS_PROXY', 'ALL_PROXY',
  'https_proxy', 'npm_config_proxy', 'npm_config_https_proxy', 'npm_config_cafile', 'npm_config_ca', 'npm_config_strict_ssl', 'npm_config_node_options']) {
  rejected(name, 'INSTALL_TRANSPORT_OR_LOADER_OVERRIDE', (input) => { input.env[name] = 'SYNTHETIC_SECRET'; });
}
for (const name of ['LHCI_COLLECT__CHROME_PATH', 'LHCI_COLLECT__SETTINGS__CHANNEL', 'LHCI_CONFIG_PATH', 'LHCITEST_MOCK_LHR']) {
  rejected(name, 'LIGHTHOUSE_ENV_OVERRIDE', (input) => { input.env[name] = 'synthetic'; });
}
rejected('missing paired executable', 'BROWSER_PATH_ENV_CONFLICT', (input) => { input.env.CHROME_PATH = '/synthetic/chrome'; });
rejected('conflicting executable pair', 'BROWSER_PATH_ENV_CONFLICT', (input) => {
  input.env.CHROME_PATH = '/synthetic/chrome'; input.env.PUPPETEER_EXECUTABLE_PATH = '/synthetic/other';
});
const paired = structuredClone(base);
Object.assign(paired.env, { CHROME_PATH: '/synthetic/chrome', PUPPETEER_EXECUTABLE_PATH: '/synthetic/chrome' });
assert.deepEqual(installationProblems(paired), []);
cases++;
for (const name of ['packageSha256', 'lockSha256']) rejected(name, 'PACKAGE_OR_LOCK_CHANGED', (input) => { input[name] = '0'.repeat(64); });
for (const key of ['_auth', '//registry.npmjs.org/:_authToken', '_password', 'username', 'always-auth']) {
  rejected(key, 'NPM_CONFIG_CREDENTIAL', (input) => { input.npmConfigFiles.push(`${key}=SYNTHETIC_SECRET`); });
}
for (const key of ['node-options', 'script-shell', 'onload-script', 'proxy', 'https-proxy', 'ca', 'cafile', 'strict-ssl', 'userconfig', 'globalconfig']) {
  rejected(key, 'NPM_CONFIG_EXECUTION_OVERRIDE', (input) => { input.npmConfigFiles.push(`${key}=SYNTHETIC_SECRET`); });
}
rejected('empty source scan', 'INSTALL_SOURCE_SCAN_EMPTY', (input) => { input.sources = []; });
for (const text of ['npx puppeteer browsers install chrome', 'puppeteer browsers install chrome-headless-shell',
  'npx @puppeteer/browsers install chrome', 'npm exec --package=@puppeteer/browsers -- browsers install chrome',
  'import { install as renamed } from "@puppeteer/browsers"; renamed({});',
  'await import("puppeteer/internal/node/install.js");', 'downloadBrowsers();', 'new BrowserFetcher().download();', 'createBrowserFetcher();']) {
  rejected(text, 'EXPLICIT_BROWSER_INSTALLER', (input) => { input.sources[0].text = text; });
}
for (const text of ['unset PUPPETEER_SKIP_DOWNLOAD', 'process.env.PUPPETEER_SKIP_DOWNLOAD = false;',
  'process.env["PUPPETEER_SKIP_DOWNLOAD"] = "0";', 'delete process.env.PUPPETEER_SKIP_DOWNLOAD;',
  'PUPPETEER_SKIP_DOWNLOAD=false npx anything', 'PUPPETEER_SKIP_DOWNLOAD: "off"']) {
  rejected(text, 'DOWNLOAD_SKIP_REACTIVATION', (input) => { input.sources[0].text = text; });
}
const readingSkip = structuredClone(base);
readingSkip.sources[0].text = 'const skip = process.env.PUPPETEER_SKIP_DOWNLOAD;';
assert.deepEqual(installationProblems(readingSkip), []); cases++;
for (const text of ['import p from "puppeteer";', 'const p = require("puppeteer-core");', 'puppeteer.launch();']) {
  rejected(text, 'UNGUARDED_BROWSER_CONSUMER', (input) => { input.sources[0].text = text; });
}
for (const path of ['/synthetic/work/.puppeteerrc.json', '/synthetic/.config/puppeteerrc.js', '/synthetic/home/.config/puppeteer/config']) {
  rejected(path, 'PUPPETEER_DISCOVERABLE_CONFIG', (input) => { input.configPaths = [path]; });
}
for (const name of workflowNames) {
  rejected(`${name} missing`, 'INSTALL_WORKFLOW_MISSING', (input) => { delete input.workflows[name]; });
  rejected(`${name} permissions`, 'INSTALL_WORKFLOW_PERMISSIONS', (input) => {
    input.workflows[name] = input.workflows[name].replace('      contents: read', '      contents: write');
  });
  rejected(`${name} skip`, 'INSTALL_WORKFLOW_SKIP', (input) => {
    input.workflows[name] = input.workflows[name].replace("PUPPETEER_SKIP_DOWNLOAD: 'true'", "PUPPETEER_SKIP_DOWNLOAD: 'false'");
  });
  rejected(`${name} persistence`, 'INSTALL_WORKFLOW_CREDENTIAL_PERSISTENCE', (input) => {
    input.workflows[name] = input.workflows[name].replace('persist-credentials: false', 'persist-credentials: true');
  });
  rejected(`${name} guard order`, 'INSTALL_WORKFLOW_GUARD_ORDER', (input) => {
    input.workflows[name] = input.workflows[name].replace('node scripts/browser-input.mjs install-controls', 'node scripts/unexpected.mjs');
  });
  rejected(`${name} command change`, 'INSTALL_WORKFLOW_CHANGED', (input) => {
    input.workflows[name] = input.workflows[name].replace('run: npm ci', 'run: npm ci --ignore-scripts');
  });
  rejected(`${name} secret mapping`, 'INSTALL_WORKFLOW_SECRET_MAPPING', (input) => {
    input.workflows[name] += '\n# ${{ secrets.SYNTHETIC_SECRET }}\n';
  });
}
rejected('workflow count', 'INSTALL_WORKFLOW_COVERAGE', (input) => { input.workflows['unexpected.yml'] = ''; });
rejected('zero workflows', 'INSTALL_WORKFLOW_COVERAGE', (input) => { input.workflows = {}; });
for (const key of ['http.https://github.com/.extraheader', 'http.extraheader', 'credential.helper', 'credential.https://github.com.username',
  'core.askpass', 'core.sshcommand', 'core.gitproxy', 'url.ssh://git@github.com/.insteadof', 'url.https://github.com/.pushinsteadof',
  'http.cookiefile', 'http.savecookies', 'http.proxy', 'http.proxyauthmethod', 'http.sslcert', 'http.sslkey', 'http.sslcainfo', 'http.sslcapath', 'http.sslverify']) {
  rejected(key, 'GIT_AUTH_CONFIG', (input) => { input.gitConfig.push([key, 'SYNTHETIC_SECRET']); });
}
for (const url of ['https://user:SYNTHETIC_SECRET@github.com/example/repo.git', 'git@github.com:example/repo.git',
  'ssh://git@github.com/example/repo.git', 'https://github.com/example/repo.git?token=SYNTHETIC_SECRET', '/synthetic/repo.git']) {
  rejected('credential or SSH remote', 'GIT_AUTH_REMOTE', (input) => { input.gitConfig.push(['remote.other.pushurl', url]); });
}
for (const [key, value] of [['registry', 'https://other.invalid/'], ['engine-strict', 'false'], ['ignore-scripts', 'true'], ['omit', 'dev optional']]) {
  rejected(key, 'NPM_INSTALL_POLICY', (input) => { input.npmConfig[key] = value; });
}

const reviewedManifest = readFileSync(new URL('../config/browser-input.json', import.meta.url));
assert.equal(approvedManifest(reviewedManifest).browserVersion, '155.0.8059.79'); cases++;
assert.throws(() => approvedManifest(reviewedManifest.subarray(1)), /UNREVIEWED_BROWSER_MANIFEST/); cases++;
const changedManifest = Buffer.from(reviewedManifest);
changedManifest[0] ^= 1;
assert.throws(() => approvedManifest(changedManifest), /UNREVIEWED_BROWSER_MANIFEST/); cases++;
const manifest = approvedManifest(reviewedManifest), receiptJob = resolve('/synthetic/verified-job');
const fixtureNow = Date.parse('2026-10-15T12:00:00Z') / 1000;
const executable = join(receiptJob, 'runtime', manifest.runtime.executable);
const executableSha256 = manifest.runtime.expectedMembers.find((row) => row.path === manifest.runtime.executable).sha256;
const osProvider = { path: '/usr/lib/x86_64-linux-gnu/libc.so.6', realPath: '/usr/lib/x86_64-linux-gnu/libc.so.6',
  sha256: 'a'.repeat(64), package: 'libc6:amd64', version: '2.36-9+deb12u10', architecture: 'amd64' };
const authReceipt = {
  schemaVersion: 1, result: 'PASS', mode: 'authenticate', manifestSha256: '20ac446b365c2e9f08d83355f66e99f78c4065c93c49099c45ebd4754be0cb54',
  authentication: { ...Object.fromEntries(['keySha256', 'inReleaseSha256', 'packagesSha256', 'primaryFingerprint', 'signerFingerprint', 'signedReleaseDate']
    .map((key) => [key, manifest.provenance[key]])), signatureHashId: '8', checkedAtUnix: fixtureNow,
  signatureVerified: true, keyStatusVerified: true, package: { name: manifest.product, version: manifest.packageVersion,
    architecture: manifest.architecture, path: new URL(manifest.source.url).pathname.split('/deb/')[1], bytes: manifest.source.bytes, sha256: manifest.source.sha256 } },
  raw: null, extraction: null, filesystem: null, loader: null, browser: null,
};
const fullReceipt = {
  ...structuredClone(authReceipt), mode: 'check', raw: { sha256: manifest.source.sha256, bytes: manifest.source.bytes, stable: true },
  extraction: { ...Object.fromEntries(['packageMemberCount', 'subtreeMemberCount', 'selectedMemberCount', 'selectedRegularBytes']
    .map((key) => [key, manifest.runtime.inventoryBinding[key]])), inputInventorySha256: 'ac8ee7b56e5142440aa41752d92f527f96e83fd04b02ef15db4d902907efa103' },
  filesystem: { root: join(receiptJob, 'runtime'), executable, executableSha256,
    inventorySha256: '4f28e2ae13232283f20be83aac974e379e7a274815041d4785e4498e1fd7eb49',
    memberCount: 259, noFollow: true, ownership: 'current-effective-uid', treeVerified: true },
  loader: { interpreter: { ...osProvider, path: manifest.runtime.interpreter, realPath: '/usr/lib/x86_64-linux-gnu/ld-linux-x86-64.so.2' },
    providers: manifest.runtime.requiredSonames.map((soname) => ({ ...osProvider, soname })), elfMembers: 11, missing: [], environmentClean: true },
  browser: { product: 'Google Chrome', version: manifest.browserVersion, output: `Google Chrome ${manifest.browserVersion}`, executable, executableSha256, exitCode: 0 },
};
Object.assign(fullReceipt.loader.providers.find((value) => value.soname === manifest.runtime.interpreter.split('/').at(-1)), fullReceipt.loader.interpreter);
for (const mode of ['authenticate', 'extract', 'check']) {
  const receipt = mode === 'authenticate' ? authReceipt : { ...fullReceipt, mode };
  assert.equal(verifiedReceipt(receipt, mode, manifest, receiptJob, fixtureNow), receipt); cases++;
  reached.push({ label: `typed ${mode} receipt`, predicate: 'verifiedReceipt accepts complete synthetic evidence' });
}
const closureReceipt = structuredClone(fullReceipt);
closureReceipt.loader.providers.push({ ...osProvider, soname: 'libpcre2-8.so.0' });
assert.equal(verifiedReceipt(closureReceipt, 'check', manifest, receiptJob, fixtureNow), closureReceipt); cases++;
assert.deepEqual(acquisitionIdentity(authReceipt, manifest, receiptJob, fixtureNow), { bytes: manifest.source.bytes, sha256: manifest.source.sha256 }); cases++;
assert.throws(() => acquisitionIdentity(fullReceipt, manifest, receiptJob, fixtureNow), /RECEIPT_IDENTITY/); cases++;
const acquisitionEvents = [];
await acquireAuthenticatedInput(manifest, receiptJob, () => { acquisitionEvents.push('authenticate'); return authReceipt; }, (identity) => {
  acquisitionEvents.push('acquire'); assert.deepEqual(identity, { bytes: manifest.source.bytes, sha256: manifest.source.sha256 });
}, fixtureNow);
assert.deepEqual(acquisitionEvents, ['authenticate', 'acquire']); cases++;
for (const failure of [() => { throw new Error('SYNTHETIC_AUTH_FAILURE'); }, () => ({ result: 'PASS' })]) {
  let acquired = false;
  await assert.rejects(() => acquireAuthenticatedInput(manifest, receiptJob, failure, () => { acquired = true; }, fixtureNow), /SYNTHETIC_AUTH_FAILURE|RECEIPT_SCHEMA/);
  assert.equal(acquired, false); cases++;
  reached.push({ label: 'failed authentication prevents acquisition', predicate: 'acquire callback unreachable after actual authentication rejection' });
}
function receiptRejected(label, code, mutate, original = fullReceipt, mode = 'check') {
  const receipt = structuredClone(original); mutate(receipt);
  assert.throws(() => verifiedReceipt(receipt, mode, manifest, receiptJob, fixtureNow), (error) => error.message === code, label);
  reached.push({ label, predicate: code }); cases++;
}
for (const name of Object.keys(fullReceipt)) receiptRejected(`missing ${name}`, 'RECEIPT_SCHEMA', (receipt) => { delete receipt[name]; });
receiptRejected('unknown receipt field', 'RECEIPT_SCHEMA', (receipt) => { receipt.extra = true; });
receiptRejected('comma-joined field names are not a schema', 'RECEIPT_SCHEMA', (receipt) => { delete receipt.raw; delete receipt.result; receipt['raw,result'] = null; });
for (const [key, value] of [['schemaVersion', '1'], ['result', true], ['mode', 'extract'], ['manifestSha256', 'a'.repeat(64)]]) {
  receiptRejected(`receipt identity ${key}`, 'RECEIPT_IDENTITY', (receipt) => { receipt[key] = value; });
}
for (const section of ['authentication', 'raw', 'extraction', 'filesystem', 'loader', 'browser']) {
  const code = { authentication: 'AUTH', raw: 'RAW', extraction: 'EXTRACTION', filesystem: 'FILESYSTEM', loader: 'LOADER', browser: 'BROWSER' }[section];
  for (const value of [null, [], true, 'PASS']) receiptRejected(`${section} wrong type`, `RECEIPT_${code}_SCHEMA`, (receipt) => { receipt[section] = value; });
  for (const key of Object.keys(fullReceipt[section])) receiptRejected(`${section}.${key} missing`, `RECEIPT_${code}_SCHEMA`, (receipt) => { delete receipt[section][key]; });
  receiptRejected(`${section} unknown field`, `RECEIPT_${code}_SCHEMA`, (receipt) => { receipt[section].extra = true; });
}
for (const name of ['keySha256', 'inReleaseSha256', 'packagesSha256', 'primaryFingerprint', 'signerFingerprint', 'signedReleaseDate']) {
  receiptRejected(`authentication ${name}`, 'RECEIPT_AUTH_IDENTITY', (receipt) => { receipt.authentication[name] += 'wrong'; });
}
for (const [key, value] of [['signatureVerified', false], ['keyStatusVerified', 'true'], ['signatureHashId', '2'], ['signatureHashId', 8]]) {
  receiptRejected(`signature ${key}`, 'RECEIPT_SIGNATURE', (receipt) => { receipt.authentication[key] = value; });
}
for (const value of [null, '123', -1, NaN, Infinity, fixtureNow - 301, fixtureNow + 301]) {
  receiptRejected('invalid or stale authentication time', 'RECEIPT_AUTH_CLOCK', (receipt) => { receipt.authentication.checkedAtUnix = value; });
}
for (const name of Object.keys(fullReceipt.authentication.package)) {
  receiptRejected(`package ${name}`, 'RECEIPT_PACKAGE_IDENTITY', (receipt) => { receipt.authentication.package[name] = 'wrong'; });
  receiptRejected(`missing package ${name}`, 'RECEIPT_PACKAGE_SCHEMA', (receipt) => { delete receipt.authentication.package[name]; });
}
receiptRejected('authenticate receipt overclaims extraction', 'RECEIPT_PREACQUISITION_SCOPE', (receipt) => { receipt.filesystem = {}; }, authReceipt, 'authenticate');
for (const name of ['sha256', 'bytes', 'stable']) receiptRejected(`raw ${name}`, 'RECEIPT_RAW_IDENTITY', (receipt) => { receipt.raw[name] = 'wrong'; });
for (const name of ['packageMemberCount', 'subtreeMemberCount', 'selectedMemberCount', 'selectedRegularBytes']) {
  for (const value of [String(fullReceipt.extraction[name]), 0, null]) receiptRejected(`extraction ${name}`, 'RECEIPT_EXTRACTION_INVENTORY', (receipt) => { receipt.extraction[name] = value; });
}
receiptRejected('input inventory wrong', 'RECEIPT_INPUT_INVENTORY', (receipt) => { receipt.extraction.inputInventorySha256 = '0'.repeat(64); });
for (const name of Object.keys(fullReceipt.filesystem)) receiptRejected(`filesystem ${name}`, 'RECEIPT_FILESYSTEM_IDENTITY', (receipt) => { receipt.filesystem[name] = 'wrong'; });
for (const [key, value] of [['environmentClean', 'true'], ['elfMembers', '11'], ['missing', ['libmissing.so']], ['missing', {}], ['providers', {}]]) {
  receiptRejected(`loader ${key}`, 'RECEIPT_LOADER_EVIDENCE', (receipt) => { receipt.loader[key] = value; });
}
receiptRejected('missing interpreter', 'RECEIPT_PROVIDER_SCHEMA', (receipt) => { receipt.loader.interpreter = null; });
receiptRejected('provider resource bound', 'RECEIPT_PROVIDER_COVERAGE', (receipt) => { receipt.loader.providers = Array(513).fill(receipt.loader.providers[0]); });
receiptRejected('unsafe provider name', 'RECEIPT_PROVIDER_COVERAGE', (receipt) => { receipt.loader.providers[0].soname = '../libevil.so'; });
receiptRejected('wrong interpreter', 'RECEIPT_INTERPRETER', (receipt) => { receipt.loader.interpreter.path = '/usr/lib/wrong-loader'; });
receiptRejected('interpreter provider conflicts with loader', 'RECEIPT_INTERPRETER_CONFLICT', (receipt) => { receipt.loader.interpreter.sha256 = 'b'.repeat(64); });
for (const key of ['path', 'realPath', 'sha256', 'package', 'version', 'architecture']) {
  receiptRejected(`provider missing ${key}`, 'RECEIPT_PROVIDER_SCHEMA', (receipt) => { delete receipt.loader.providers[0][key]; });
}
receiptRejected('provider unknown field', 'RECEIPT_PROVIDER_SCHEMA', (receipt) => { receipt.loader.providers[0].unknown = true; });
for (const action of [(receipt) => receipt.loader.providers.pop(), (receipt) => receipt.loader.providers.push(receipt.loader.providers[0]),
  (receipt) => { receipt.loader.providers[1] = receipt.loader.providers[0]; }, (receipt) => { receipt.loader.providers[0].soname = 'wrong.so'; }]) {
  receiptRejected('provider coverage or duplicate', 'RECEIPT_PROVIDER_COVERAGE', action);
}
for (const value of [null, [], {}]) receiptRejected('malformed provider', 'RECEIPT_PROVIDER_COVERAGE', (receipt) => { receipt.loader.providers[0] = value; });
for (const name of ['path', 'realPath']) for (const value of ['/tmp/evil.so', '/usr/lib/../evil.so', '/usr/lib//evil.so', '/usr/lib/evil\n.so', 'relative.so']) {
  receiptRejected(`provider ${name} containment`, 'RECEIPT_PROVIDER_PATH', (receipt) => { receipt.loader.providers[0][name] = value; });
}
for (const [key, value] of [['sha256', 'a'.repeat(63)], ['package', 'unknown package'], ['version', ''], ['architecture', 'arm64']]) {
  receiptRejected(`provider ${key} identity`, 'RECEIPT_PROVIDER_IDENTITY', (receipt) => { receipt.loader.providers[0][key] = value; });
}
for (const name of Object.keys(fullReceipt.browser)) receiptRejected(`browser ${name}`, 'RECEIPT_BROWSER_IDENTITY', (receipt) => { receipt.browser[name] = 'wrong'; });
for (const encoding of [undefined, 'identity']) {
  assert.deepEqual(responseProblems({ status: 200, encoding, length: '17' }, 17), []); cases++;
}
for (const status of [301, 302, 307, 308, 404]) {
  assert.deepEqual(responseProblems({ status, encoding: 'identity', length: '17' }, 17), ['INPUT_HTTP_STATUS_OR_REDIRECT']); cases++;
}
assert.deepEqual(responseProblems({ status: 200, encoding: 'gzip', length: '17' }, 17), ['INPUT_HTTP_ENCODING']); cases++;
for (const length of [undefined, '0', '16', '18', '017', 17]) {
  assert.deepEqual(responseProblems({ status: 200, encoding: 'identity', length }, 17), ['INPUT_HTTP_LENGTH']); cases++;
}

for (const kind of ['puppeteer', 'lighthouse']) {
  assert.deepEqual(consumerProblems(kind, '/synthetic/chrome'), []);
  assert.ok(consumerProblems(kind, undefined).includes('BROWSER_EXECUTABLE_REQUIRED'));
  assert.ok(consumerProblems(kind, 'relative/chrome').includes('BROWSER_EXECUTABLE_REQUIRED'));
  for (const [options, code] of [[{ executablePath: '/synthetic/other' }, 'BROWSER_EXECUTABLE_CONFLICT'],
    [{ channel: 'stable' }, 'BROWSER_CHANNEL_CONFLICT'], [{ headless: 'shell' }, 'BROWSER_SHELL_FORBIDDEN'],
    [{ browser: 'firefox' }, 'BROWSER_PRODUCT_CONFLICT'], [{ env: {} }, 'BROWSER_LAUNCH_ENV_OVERRIDE']]) {
    assert.ok(consumerProblems(kind, '/synthetic/chrome', options).includes(code)); cases++;
  }
  cases += 3;
}
for (const options of [{ chromePath: '/synthetic/other' }, { settings: { chromePath: '/synthetic/other' } }, { settings: { channel: 'stable' } }]) {
  assert.ok(consumerProblems('lighthouse', '/synthetic/chrome', options).includes('LIGHTHOUSE_CONFIG_OVERRIDE')); cases++;
}

const fixture = mkdtempSync(join(tmpdir(), 'gs-browser-input-selftest-'));
assert.equal(dirname(fixture), resolve(tmpdir()));
try {
  const work = join(fixture, 'work'), global = join(fixture, 'global');
  mkdirSync(work); mkdirSync(global);
  assert.deepEqual(discoverConfiguration(work, fixture, global), []); cases++;
  mkdirSync(join(work, '.config'));
  for (const path of [join(work, '.puppeteerrc.json'), join(fixture, '.puppeteerrc.js'), join(global, 'config'),
    join(work, '.config/puppeteer.config.js'), join(work, '.config/puppeteer.config.cjs')]) {
    writeFileSync(path, 'throw new Error("NON_EXECUTABLE_CONFIG_FIXTURE");');
    assert.ok(discoverConfiguration(work, fixture, global).includes(path)); cases++;
    rmSync(path);
  }
  for (const key of ['puppeteer', 'cosmiconfig']) {
    writeFileSync(join(fixture, 'package.json'), JSON.stringify({ [key]: {} }));
    assert.ok(discoverConfiguration(work, fixture, global).includes(join(fixture, 'package.json'))); cases++;
  }
  writeFileSync(join(fixture, 'package.json'), '{"synthetic":"malformed');
  assert.throws(() => discoverConfiguration(work, fixture, global), /PUPPETEER_CONFIG_UNREADABLE/); cases++;
} finally { rmSync(fixture, { recursive: true, force: true }); }

const pythonIndex = process.argv.indexOf('--python');
const pythonInterpreter = pythonIndex === -1 ? 'python3' : process.argv[pythonIndex + 1];
assert.ok(pythonInterpreter && (pythonIndex === -1 || resolve(pythonInterpreter) === pythonInterpreter), 'explicit Python interpreter must be absolute');
const extractionSubjects = spawnSync(pythonInterpreter, ['-I', '-B', '-S', fileURLToPath(new URL('./extract-verified-browser.selftest.py', import.meta.url))], {
  encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: 120_000, maxBuffer: 1_048_576,
});
assert.equal(extractionSubjects.error, undefined, 'extraction subjects could not run');
assert.equal(extractionSubjects.signal, null, 'extraction subjects were interrupted');
assert.equal(extractionSubjects.status, 0, 'extraction subjects failed');
process.stdout.write(extractionSubjects.stdout);

// This mode runs only after normal installation; default pre-install subjects remain dependency-free.
if (process.argv.includes('--installed')) {
  const installUrl = import.meta.resolve('puppeteer/internal/node/install.js');
  const puppeteerPackage = JSON.parse(readFileSync(new URL(import.meta.resolve('puppeteer/package.json')), 'utf8'));
  assert.equal(puppeteerPackage.version, '25.14.0');
  for (const consumer of ['puppeteer', 'puppeteer-core']) {
    const require = createRequire(import.meta.resolve(`${consumer}/package.json`));
    assert.equal(JSON.parse(readFileSync(require.resolve('@puppeteer/browsers/package.json'), 'utf8')).version, '3.2.5');
    cases++;
  }
  assert.equal(process.env.PUPPETEER_SKIP_DOWNLOAD, 'true', 'installed proof requires the real effective skip environment');
  const { getConfiguration } = await import('puppeteer/internal/getConfiguration.js');
  const effectiveConfiguration = await getConfiguration();
  assert.equal(effectiveConfiguration.skipDownload, true);
  assert.equal(effectiveConfiguration.chrome.skipDownload, true);
  assert.equal(effectiveConfiguration['chrome-headless-shell'].skipDownload, true);
  cases++;
  const state = { requests: [], resolutions: [], observations: 0 };
  globalThis.__gsBrowserInstallerSelftest = state;
  const moduleUrl = (text) => `data:text/javascript,${encodeURIComponent(text)}`;
  const configurationUrl = import.meta.resolve('puppeteer/internal/getConfiguration.js');
  const browsersUrl = pathToFileURL(createRequire(installUrl).resolve('@puppeteer/browsers')).href;
  const replacements = {
    '@puppeteer/browsers': moduleUrl(`export {Browser,detectBrowserPlatform} from ${JSON.stringify(browsersUrl)};
      export const resolveBuildId=async(browser)=> {globalThis.__gsBrowserInstallerSelftest.resolutions.push(browser);return 'synthetic';};
      export const install=async(options)=>{globalThis.__gsBrowserInstallerSelftest.requests.push(options.browser);return {buildId:'synthetic',path:'/synthetic/non-executable'};};`),
    '../getConfiguration.js': moduleUrl(`import {getConfiguration as actual} from ${JSON.stringify(configurationUrl)};
      export const getConfiguration=()=>{globalThis.__gsBrowserInstallerSelftest.observations++;return actual();};`),
  };
  const hooks = registerHooks({ resolve(specifier, context, nextResolve) {
    if (context.parentURL === installUrl && Object.hasOwn(replacements, specifier)) return { url: replacements[specifier], shortCircuit: true };
    return nextResolve(specifier, context);
  } });
  const oldCwd = process.cwd();
  const changedNames = /^(?:PUPPETEER_.*|HOME|XDG_CONFIG_HOME|APPDATA|LOCALAPPDATA|npm_config_loglevel)$/;
  const oldEnvironment = Object.fromEntries(Object.entries(process.env).filter(([name]) => changedNames.test(name)));
  const installerFixture = mkdtempSync(join(tmpdir(), 'gs-browser-installer-selftest-'));
  try {
    const home = join(installerFixture, 'home'), work = join(home, 'work'), xdg = join(home, 'config');
    mkdirSync(home); mkdirSync(work); mkdirSync(xdg);
    for (const name of Object.keys(process.env).filter((name) => changedNames.test(name))) delete process.env[name];
    Object.assign(process.env, { HOME: home, XDG_CONFIG_HOME: xdg, APPDATA: xdg, LOCALAPPDATA: xdg, npm_config_loglevel: 'error' });
    process.chdir(work);
    assert.deepEqual(discoverConfiguration(work, home, join(xdg, 'puppeteer')), []);
    const { downloadBrowsers } = await import(installUrl);
    for (const [environment, expected] of [
      [{ PUPPETEER_SKIP_DOWNLOAD: 'true' }, []],
      [{ PUPPETEER_SKIP_DOWNLOAD: 'false' }, ['chrome', 'chrome-headless-shell', 'firefox']],
      [{ PUPPETEER_SKIP_DOWNLOAD: 'false', PUPPETEER_CHROME_SKIP_DOWNLOAD: 'true' }, ['chrome-headless-shell', 'firefox']],
      [{ PUPPETEER_SKIP_DOWNLOAD: 'false', PUPPETEER_CHROME_HEADLESS_SHELL_SKIP_DOWNLOAD: 'true' }, ['chrome', 'firefox']],
      [{ PUPPETEER_SKIP_DOWNLOAD: 'false', PUPPETEER_FIREFOX_SKIP_DOWNLOAD: 'true' }, ['chrome', 'chrome-headless-shell']],
    ]) {
      for (const name of Object.keys(process.env).filter((name) => name.startsWith('PUPPETEER_'))) delete process.env[name];
      Object.assign(process.env, environment);
      const configuration = await getConfiguration();
      assert.equal(configuration.skipDownload, environment.PUPPETEER_SKIP_DOWNLOAD === 'true');
      assert.equal(Boolean(configuration.chrome.skipDownload), !expected.includes('chrome'));
      assert.equal(Boolean(configuration['chrome-headless-shell'].skipDownload), !expected.includes('chrome-headless-shell'));
      assert.equal(Boolean(configuration.firefox.skipDownload), !expected.includes('firefox'));
      state.requests = []; state.resolutions = [];
      const before = state.observations;
      await downloadBrowsers();
      assert.equal(state.observations, before + 1);
      assert.deepEqual(state.resolutions, expected);
      assert.deepEqual(state.requests, expected); cases++;
    }
    console.log(JSON.stringify({ automaticDownloadObservation: 'PASS', module: installUrl, realEnvironmentMapping: true,
      chromeAndShellAdverseControls: true, browserExecutions: 0, realInstallerCalls: 0 }));
  } finally {
    process.chdir(oldCwd);
    for (const name of Object.keys(process.env).filter((name) => changedNames.test(name))) delete process.env[name];
    Object.assign(process.env, oldEnvironment);
    hooks.deregister(); delete globalThis.__gsBrowserInstallerSelftest;
    rmSync(installerFixture, { recursive: true, force: true });
  }
}
console.log(`browser-input.selftest: ${cases} positive/adverse installation and consumer cases; source and workflow zero-count controls reached.`);
console.log(JSON.stringify({ scope: 'deterministic synthetic source selftests; no browser or installation', reached }));
