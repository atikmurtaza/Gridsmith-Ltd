#!/usr/bin/env node
/** Reviewed installation controls; source scanning is not a sandbox for arbitrary lifecycle code. */
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { appendFileSync, chmodSync, closeSync, constants, existsSync, fstatSync, lstatSync, mkdtempSync, openSync, readFileSync, realpathSync, writeFileSync, writeSync } from 'node:fs';
import { get } from 'node:https';
import { homedir, tmpdir } from 'node:os';
import { dirname, isAbsolute, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { sourceFiles } from './source-files.mjs';

const sha256 = (text) => createHash('sha256').update(text).digest('hex');
// Expectations are outside the workflow subjects; changing a workflow requires explicit review here.
const WORKFLOWS = {
  '.github/workflows/ci.yml': 'cc045be9166eb3b3d3f2ed90ac23fee93efada79bde45a8fd14f3b7d37045dec',
  '.github/workflows/hostinger-staging.yml': 'f0aa0c3f012aebedf6768550e1da170400b674119eadc5c9d8d9c7cc0004b98d',
};
const PACKAGE_SHA256 = '97854c2b19e9ca55d5a793bfb5a768ce28d2856d7c44159ebdccfff2b64dad31';
const LOCK_SHA256 = 'f45a725650c64e81bc8d580569e012ad07ca3d254e8ffaa63fb22c6cc57a6fa3';
const GUARD_SUBJECTS = new Set(['scripts/browser-input.mjs', 'scripts/browser-input.selftest.mjs']);
const SAFE_GIT_ENV = {
  GIT_CONFIG_NOSYSTEM: '1', GIT_CONFIG_SYSTEM: '/dev/null', GIT_CONFIG_GLOBAL: '/dev/null',
};
const CONFIG_NAMES = [
  '.puppeteerrc', ...['json', 'yaml', 'yml', 'js', 'ts', 'cjs', 'mjs'].map((ext) => `.puppeteerrc.${ext}`),
  '.config/puppeteerrc', ...['json', 'yaml', 'yml', 'js', 'ts', 'cjs', 'mjs'].map((ext) => `.config/puppeteerrc.${ext}`),
  ...['js', 'ts', 'cjs', 'mjs'].map((ext) => `puppeteer.config.${ext}`),
  'package.yaml', ...['json', 'yaml', 'yml', 'js', 'ts', 'cjs', 'mjs'].map((ext) => `.config/config.${ext}`),
];

export const controlledBrowser = process.platform === 'linux' || Boolean(process.env.CI);

/** Returns control identifiers only; configuration and credential values never enter errors. */
export function installationProblems({ env, sources, workflows, gitConfig, npmConfig, npmConfigFiles = [], configPaths,
  packageSha256, lockSha256 }) {
  const problems = new Set();
  const fail = (condition, code) => { if (condition) problems.add(code); };
  fail(env.PUPPETEER_SKIP_DOWNLOAD !== 'true', 'PUPPETEER_SKIP_REQUIRED');
  for (const [name, value] of Object.entries(env)) {
    if (value === undefined || value === '') continue;
    fail(/^PUPPETEER_/.test(name) && !['PUPPETEER_SKIP_DOWNLOAD', 'PUPPETEER_EXECUTABLE_PATH'].includes(name), 'PUPPETEER_ENV_OVERRIDE');
    fail(/^(?:GH_TOKEN|GITHUB_TOKEN|NPM_TOKEN|NODE_AUTH_TOKEN|NPM_AUTH_TOKEN|YARN_NPM_AUTH_TOKEN|LHCI_TOKEN)$/.test(name)
      || /^(?:npm_config_.*(?:_auth|token|password)|GIT_TOKEN|GIT_PASSWORD)$/i.test(name), 'INSTALL_CREDENTIAL_ENV');
    fail((/^GIT_CONFIG_/.test(name) && SAFE_GIT_ENV[name] !== value)
      || /^GIT_SSL_/.test(name)
      || /^(?:GIT_CONFIG|GIT_ASKPASS|SSH_ASKPASS|GIT_SSH|GIT_SSH_COMMAND|GIT_PROXY_COMMAND|GIT_HTTP_PROXY_AUTHMETHOD|SSH_AUTH_SOCK|SSH_AGENT_PID)$/.test(name), 'GIT_AUTH_ENV');
    fail(/^(?:NODE_OPTIONS|LD_PRELOAD|LD_LIBRARY_PATH|LD_AUDIT|NODE_TLS_REJECT_UNAUTHORIZED|NODE_EXTRA_CA_CERTS|SSL_CERT_FILE|SSL_CERT_DIR|CURL_CA_BUNDLE|REQUESTS_CA_BUNDLE|HTTPS?_PROXY|ALL_PROXY)$/i.test(name)
      || /^npm_config_(?:proxy|https_proxy|cafile|ca|strict_ssl|node_options|script_shell|onload_script)$/i.test(name), 'INSTALL_TRANSPORT_OR_LOADER_OVERRIDE');
    fail(/^LHCI_COLLECT__|^LHCI_.*CONFIG|^LHCITEST_/.test(name), 'LIGHTHOUSE_ENV_OVERRIDE');
  }
  fail(Boolean(env.PUPPETEER_EXECUTABLE_PATH || env.CHROME_PATH)
    && (!isAbsolute(env.PUPPETEER_EXECUTABLE_PATH ?? '') || env.PUPPETEER_EXECUTABLE_PATH !== env.CHROME_PATH), 'BROWSER_PATH_ENV_CONFLICT');
  fail(packageSha256 !== PACKAGE_SHA256 || lockSha256 !== LOCK_SHA256, 'PACKAGE_OR_LOCK_CHANGED');
  for (const text of npmConfigFiles) {
    for (const line of text.split(/\r?\n/)) {
      const key = line.match(/^\s*([^#;][^=\s]*)\s*=/)?.[1] ?? '';
      fail(/(?:_auth|token|password|username|always-auth)/i.test(key), 'NPM_CONFIG_CREDENTIAL');
      fail(/^(?:node-options|script-shell|onload-script|proxy|https-proxy|ca|cafile|strict-ssl|userconfig|globalconfig)$/i.test(key), 'NPM_CONFIG_EXECUTION_OVERRIDE');
    }
  }
  fail(configPaths.length > 0, 'PUPPETEER_DISCOVERABLE_CONFIG');
  fail(sources.length === 0, 'INSTALL_SOURCE_SCAN_EMPTY');
  for (const { name, text } of sources) {
    // These two files contain non-executable adverse source strings and the predicates that inspect them.
    if (GUARD_SUBJECTS.has(name)) continue;
    fail(/@puppeteer\/browsers|puppeteer\/(?:internal\/)?(?:node\/)?install|\b(?:downloadBrowsers|createBrowserFetcher|BrowserFetcher)\b|\bpuppeteer\s+(?:browsers\s+)?install\b|\bbrowsers\s+install\b/.test(text), 'EXPLICIT_BROWSER_INSTALLER');
    fail(/(?:unset\s+PUPPETEER_SKIP_DOWNLOAD|delete\s+process\.env(?:\.PUPPETEER_SKIP_DOWNLOAD|\[['"]PUPPETEER_SKIP_DOWNLOAD['"]\])|process\.env(?:\.PUPPETEER_SKIP_DOWNLOAD|\[['"]PUPPETEER_SKIP_DOWNLOAD['"]\])\s*=(?!=)|PUPPETEER_SKIP_DOWNLOAD\s*[:=]\s*(?:['"]?(?:false|0|off)\b|['"]{2}))/.test(text), 'DOWNLOAD_SKIP_REACTIVATION');
    fail(name !== 'scripts/browser-launch.mjs'
      && /(?:from\s*|(?:require|import)\s*\()\s*['"]puppeteer(?:-core)?['"]|\bpuppeteer\.launch\s*\(/.test(text), 'UNGUARDED_BROWSER_CONSUMER');
  }
  fail(Object.keys(workflows).length !== Object.keys(WORKFLOWS).length, 'INSTALL_WORKFLOW_COVERAGE');
  for (const [name, expected] of Object.entries(WORKFLOWS)) {
    const source = workflows[name];
    if (typeof source !== 'string') { problems.add('INSTALL_WORKFLOW_MISSING'); continue; }
    fail(sha256(source) !== expected, 'INSTALL_WORKFLOW_CHANGED');
    const jobName = name.endsWith('/ci.yml') ? 'verify' : 'build';
    const job = source.match(new RegExp(`^  ${jobName}:\\r?\\n([\\s\\S]*?)(?=^  [a-z][a-z-]*:|$(?![\\s\\S]))`, 'm'))?.[1] ?? '';
    fail(!/^permissions:\r?\n  contents: read\s*$/m.test(source)
      || !/^    permissions:\r?\n      contents: read\s*(?:\n      actions: read\s*)?$/m.test(job), 'INSTALL_WORKFLOW_PERMISSIONS');
    fail(!/^      PUPPETEER_SKIP_DOWNLOAD: ['"]true['"]\s*$/m.test(job), 'INSTALL_WORKFLOW_SKIP');
    fail(!/^          persist-credentials: false\s*$/m.test(job), 'INSTALL_WORKFLOW_CREDENTIAL_PERSISTENCE');
    fail(/\$\{\{\s*secrets(?:\.|\[)|secrets:\s*inherit/.test(source), 'INSTALL_WORKFLOW_SECRET_MAPPING');
    const beforeInstall = job.slice(0, job.indexOf('- run: npm ci'));
    fail(!beforeInstall.includes('node scripts/browser-input.selftest.mjs')
      || !beforeInstall.includes('node scripts/browser-input.mjs install-controls'), 'INSTALL_WORKFLOW_GUARD_ORDER');
  }
  for (const [key, value] of gitConfig) {
    fail(/^(?:http(?:\..*)?\.extraheader|credential(?:\..*)?\.(?:helper|username)|core\.(?:askpass|sshcommand|gitproxy)|url\..*\.(?:insteadof|pushinsteadof)|http(?:\..*)?\.(?:cookiefile|savecookies|proxy|proxyauthmethod|sslcert|sslkey|sslcainfo|sslcapath|sslverify))$/i.test(key), 'GIT_AUTH_CONFIG');
    if (/^remote\..*\.(?:url|pushurl)$/i.test(key)) {
      let publicHttps = false;
      try { const url = new URL(value); publicHttps = url.protocol === 'https:' && !url.username && !url.password && !url.search && !url.hash; } catch { /* invalid remote is rejected */ }
      fail(!publicHttps, 'GIT_AUTH_REMOTE');
    }
  }
  fail(npmConfig.registry !== 'https://registry.npmjs.org/' || npmConfig['engine-strict'] !== 'true'
    || npmConfig['ignore-scripts'] !== 'false' || npmConfig['omit'].split(/[\s,]+/).includes('optional'), 'NPM_INSTALL_POLICY');
  return [...problems];
}

export function discoverConfiguration(start = resolve('.'), home = homedir(), global = join(process.env.XDG_CONFIG_HOME || join(home, '.config'), 'puppeteer')) {
  const found = [];
  let directory = resolve(start);
  while (true) {
    for (const name of CONFIG_NAMES) if (existsSync(join(directory, name))) found.push(join(directory, name));
    const pkg = join(directory, 'package.json');
    if (existsSync(pkg)) {
      let data;
      try {
        data = JSON.parse(readFileSync(pkg, 'utf8'));
        if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error();
      } catch { throw new Error('PUPPETEER_CONFIG_UNREADABLE'); }
      if (Object.hasOwn(data, 'puppeteer') || Object.hasOwn(data, 'cosmiconfig')) found.push(pkg);
    }
    const parent = dirname(directory);
    if (directory === resolve(home) || parent === directory) break;
    directory = parent;
  }
  for (const name of ['config', ...['json', 'yaml', 'yml', 'js', 'ts', 'cjs', 'mjs'].map((ext) => `config.${ext}`)]) {
    if (existsSync(join(global, name))) found.push(join(global, name));
  }
  return found;
}

export function assertInstallControls() {
  const files = sourceFiles('browser-input', /\.(?:mjs|cjs|js|jsx|ts|tsx|py|sh|ps1|json|ya?ml)$/, ['.github'])
    .filter((name) => name !== 'package-lock.json');
  const sources = files.map((name) => {
    if (!lstatSync(name).isFile()) throw new Error('INSTALL_SOURCE_NOT_REGULAR');
    return { name, text: readFileSync(name, 'utf8') };
  });
  // Capture subprocess output internally; failure diagnostics contain no Git/npm values.
  const capture = (command, args) => {
    try { return execFileSync(command, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: 30_000 }).trim(); }
    catch { throw new Error('INSTALL_TOOL_OBSERVATION_FAILED'); }
  };
  const envProblems = installationProblems({ env: process.env, sources: [], workflows: {}, gitConfig: [],
    npmConfig: { registry: '', 'engine-strict': '', 'ignore-scripts': '', omit: '' }, configPaths: [],
    packageSha256: PACKAGE_SHA256, lockSha256: LOCK_SHA256 });
  if (envProblems.some((code) => /ENV|CREDENTIAL|TRANSPORT|LOADER/.test(code))) {
    throw new Error(envProblems.filter((code) => /ENV|CREDENTIAL|TRANSPORT|LOADER/.test(code)).join(','));
  }
  const gitConfig = capture('git', ['config', '--includes', '--null', '--list']).split('\0').filter(Boolean).map((row) => {
    const separator = row.indexOf('\n');
    return [separator < 0 ? row : row.slice(0, separator), separator < 0 ? '' : row.slice(separator + 1)];
  });
  const npmConfig = Object.fromEntries(['registry', 'engine-strict', 'ignore-scripts', 'omit'].map((key) => [key, capture('npm', ['config', 'get', key])]));
  const npmConfigFiles = [...new Set(['.npmrc', capture('npm', ['config', 'get', 'userconfig']), capture('npm', ['config', 'get', 'globalconfig'])])]
    .filter((name) => existsSync(name)).map((name) => readFileSync(name, 'utf8'));
  const workflows = Object.fromEntries(Object.keys(WORKFLOWS).map((name) => [name, readFileSync(name, 'utf8')]));
  const problems = installationProblems({ env: process.env, sources, workflows, gitConfig, npmConfig, npmConfigFiles,
    configPaths: discoverConfiguration(), packageSha256: sha256(readFileSync('package.json')),
    lockSha256: sha256(readFileSync('package-lock.json')) });
  if (problems.length) throw new Error(problems.join(','));
  return { sourceFiles: sources.length, workflows: Object.keys(workflows).length, checkoutCredentials: 'absent', skipDownload: true };
}

export function consumerProblems(kind, expectedPath, options = {}) {
  const problems = [];
  if (!expectedPath || !isAbsolute(expectedPath)) problems.push('BROWSER_EXECUTABLE_REQUIRED');
  if (options.executablePath !== undefined && options.executablePath !== expectedPath) problems.push('BROWSER_EXECUTABLE_CONFLICT');
  if (options.channel !== undefined) problems.push('BROWSER_CHANNEL_CONFLICT');
  if (options.headless === 'shell') problems.push('BROWSER_SHELL_FORBIDDEN');
  if (options.browser !== undefined && options.browser !== 'chrome') problems.push('BROWSER_PRODUCT_CONFLICT');
  if (options.env !== undefined) problems.push('BROWSER_LAUNCH_ENV_OVERRIDE');
  if (kind === 'lighthouse' && (options.chromePath !== undefined || options.settings?.chromePath !== undefined
    || options.settings?.channel !== undefined)) problems.push('LIGHTHOUSE_CONFIG_OVERRIDE');
  return problems;
}

const REPOSITORY = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const MANIFEST = join(REPOSITORY, 'config/browser-input.json');
const MANIFEST_SHA256 = '20ac446b365c2e9f08d83355f66e99f78c4065c93c49099c45ebd4754be0cb54';
const KEY_SHA256 = '54dea5f6c2a26091578cf52a999cebc6b64df478d37ad4dce96376b711e3b27c';
const RAW_IDENTITY = Object.freeze({ bytes: 143638568, sha256: 'b7726070ca707965e9a17b38e4f15ba283bf6f65c339626c092862af7b19badc' });
const INPUT_INVENTORY_SHA256 = 'ac8ee7b56e5142440aa41752d92f527f96e83fd04b02ef15db4d902907efa103';
const TREE_INVENTORY_SHA256 = '4f28e2ae13232283f20be83aac974e379e7a274815041d4785e4498e1fd7eb49';

export function approvedManifest(bytes) {
  if (bytes.length !== 229589 || sha256(bytes) !== MANIFEST_SHA256) throw new Error('UNREVIEWED_BROWSER_MANIFEST');
  return JSON.parse(bytes.toString('utf8'));
}

/** A successful subprocess is evidence only after every required typed claim is checked. */
export function verifiedReceipt(receipt, mode, manifest, job, nowUnix = Math.floor(Date.now() / 1000)) {
  const require = (condition, code) => { if (!condition) throw new Error(code); };
  const keys = (value, expected, code) => require(value !== null && typeof value === 'object' && !Array.isArray(value)
    && Object.keys(value).length === expected.length && expected.every((name) => Object.hasOwn(value, name)), code);
  const integer = (value) => Number.isSafeInteger(value) && value >= 0;
  const digest = (value) => typeof value === 'string' && /^[a-f0-9]{64}$/.test(value);
  keys(receipt, ['schemaVersion', 'result', 'mode', 'manifestSha256', 'authentication', 'raw', 'extraction', 'filesystem', 'loader', 'browser'], 'RECEIPT_SCHEMA');
  require(['authenticate', 'extract', 'check'].includes(mode) && receipt.schemaVersion === 1 && receipt.result === 'PASS'
    && receipt.mode === mode && receipt.manifestSha256 === MANIFEST_SHA256, 'RECEIPT_IDENTITY');
  const auth = receipt.authentication, provenance = manifest.provenance;
  keys(auth, ['keySha256', 'inReleaseSha256', 'packagesSha256', 'primaryFingerprint', 'signerFingerprint', 'signedReleaseDate',
    'package', 'signatureHashId', 'checkedAtUnix', 'signatureVerified', 'keyStatusVerified'], 'RECEIPT_AUTH_SCHEMA');
  for (const name of ['keySha256', 'inReleaseSha256', 'packagesSha256', 'primaryFingerprint', 'signerFingerprint', 'signedReleaseDate']) {
    require(typeof auth[name] === 'string' && auth[name] === provenance[name], 'RECEIPT_AUTH_IDENTITY');
  }
  require(auth.signatureVerified === true && auth.keyStatusVerified === true
    && typeof auth.signatureHashId === 'string' && manifest.keyStatusPolicy.allowedSignatureHashIds.includes(auth.signatureHashId), 'RECEIPT_SIGNATURE');
  require(integer(auth.checkedAtUnix) && integer(nowUnix) && Math.abs(auth.checkedAtUnix - nowUnix) <= 300
    && auth.checkedAtUnix >= Date.parse(provenance.signedReleaseDate) / 1000
    && auth.checkedAtUnix >= provenance.signerCreatedUnix && auth.checkedAtUnix < provenance.signerExpiresUnix, 'RECEIPT_AUTH_CLOCK');
  keys(auth.package, ['name', 'version', 'architecture', 'path', 'bytes', 'sha256'], 'RECEIPT_PACKAGE_SCHEMA');
  require(auth.package.name === manifest.product && auth.package.version === manifest.packageVersion
    && auth.package.architecture === manifest.architecture && auth.package.path === new URL(manifest.source.url).pathname.split('/deb/')[1]
    && auth.package.bytes === RAW_IDENTITY.bytes && auth.package.sha256 === RAW_IDENTITY.sha256
    && manifest.source.bytes === RAW_IDENTITY.bytes && manifest.source.sha256 === RAW_IDENTITY.sha256, 'RECEIPT_PACKAGE_IDENTITY');
  if (mode === 'authenticate') {
    require(['raw', 'extraction', 'filesystem', 'loader', 'browser'].every((name) => receipt[name] === null), 'RECEIPT_PREACQUISITION_SCOPE');
    return receipt;
  }
  keys(receipt.raw, ['sha256', 'bytes', 'stable'], 'RECEIPT_RAW_SCHEMA');
  require(receipt.raw.sha256 === RAW_IDENTITY.sha256 && receipt.raw.bytes === RAW_IDENTITY.bytes && receipt.raw.stable === true, 'RECEIPT_RAW_IDENTITY');
  keys(receipt.extraction, ['packageMemberCount', 'subtreeMemberCount', 'selectedMemberCount', 'selectedRegularBytes', 'inputInventorySha256'], 'RECEIPT_EXTRACTION_SCHEMA');
  for (const name of ['packageMemberCount', 'subtreeMemberCount', 'selectedMemberCount', 'selectedRegularBytes']) {
    require(integer(receipt.extraction[name]) && receipt.extraction[name] === manifest.runtime.inventoryBinding[name], 'RECEIPT_EXTRACTION_INVENTORY');
  }
  require(receipt.extraction.inputInventorySha256 === INPUT_INVENTORY_SHA256, 'RECEIPT_INPUT_INVENTORY');
  const executable = join(job, 'runtime', manifest.runtime.executable);
  const executableSha256 = manifest.runtime.expectedMembers.find((member) => member.path === manifest.runtime.executable)?.sha256;
  keys(receipt.filesystem, ['root', 'executable', 'executableSha256', 'inventorySha256', 'memberCount', 'noFollow', 'ownership', 'treeVerified'], 'RECEIPT_FILESYSTEM_SCHEMA');
  require(receipt.filesystem.root === join(job, 'runtime') && receipt.filesystem.executable === executable
    && receipt.filesystem.executableSha256 === executableSha256 && receipt.filesystem.inventorySha256 === TREE_INVENTORY_SHA256
    && receipt.filesystem.memberCount === manifest.runtime.expectedMembers.length && receipt.filesystem.noFollow === true
    && receipt.filesystem.ownership === 'current-effective-uid' && receipt.filesystem.treeVerified === true, 'RECEIPT_FILESYSTEM_IDENTITY');
  keys(receipt.loader, ['interpreter', 'providers', 'elfMembers', 'missing', 'environmentClean'], 'RECEIPT_LOADER_SCHEMA');
  require(receipt.loader.environmentClean === true && receipt.loader.elfMembers === manifest.runtime.expectedMembers.filter((member) => member.elf).length
    && Array.isArray(receipt.loader.missing) && receipt.loader.missing.length === 0 && Array.isArray(receipt.loader.providers), 'RECEIPT_LOADER_EVIDENCE');
  const provider = (value, soname) => {
    keys(value, [...(soname ? ['soname'] : []), 'path', 'realPath', 'sha256', 'package', 'version', 'architecture'], 'RECEIPT_PROVIDER_SCHEMA');
    for (const name of ['path', 'realPath']) {
      require(typeof value[name] === 'string' && value[name].startsWith('/') && !/[\\\x00-\x20\x7f]/.test(value[name])
        && !value[name].includes('//') && !value[name].split('/').some((part) => part === '.' || part === '..')
        && manifest.runtime.trustedOsLibraryRoots.some((root) => value[name].startsWith(`${root}/`)), 'RECEIPT_PROVIDER_PATH');
    }
    require(digest(value.sha256) && typeof value.package === 'string' && /^[a-z0-9][a-z0-9+.-]*(?::amd64)?$/.test(value.package)
      && typeof value.version === 'string' && /^[0-9][a-zA-Z0-9.+:~_-]*$/.test(value.version)
      && value.architecture === 'amd64' && (!soname || value.soname === soname), 'RECEIPT_PROVIDER_IDENTITY');
  };
  provider(receipt.loader.interpreter);
  require(receipt.loader.interpreter.path === manifest.runtime.interpreter, 'RECEIPT_INTERPRETER');
  require(receipt.loader.providers.length >= manifest.runtime.requiredSonames.length && receipt.loader.providers.length <= 512, 'RECEIPT_PROVIDER_COVERAGE');
  const seen = new Set();
  for (const value of receipt.loader.providers) {
    require(value !== null && typeof value === 'object' && typeof value.soname === 'string'
      && /^[a-zA-Z0-9_+.-]+\.so(?:\.[0-9]+)*$/.test(value.soname) && !seen.has(value.soname), 'RECEIPT_PROVIDER_COVERAGE');
    seen.add(value.soname); provider(value, value.soname);
  }
  require(manifest.runtime.requiredSonames.every((soname) => seen.has(soname)), 'RECEIPT_PROVIDER_COVERAGE');
  const interpreterProvider = receipt.loader.providers.find((value) => value.soname === manifest.runtime.interpreter.split('/').at(-1));
  require(interpreterProvider && Object.keys(receipt.loader.interpreter).every((key) => interpreterProvider[key] === receipt.loader.interpreter[key]), 'RECEIPT_INTERPRETER_CONFLICT');
  keys(receipt.browser, ['product', 'version', 'output', 'executable', 'executableSha256', 'exitCode'], 'RECEIPT_BROWSER_SCHEMA');
  require(receipt.browser.product === 'Google Chrome' && receipt.browser.version === manifest.browserVersion
    && receipt.browser.output === `Google Chrome ${manifest.browserVersion}` && receipt.browser.executable === executable
    && receipt.browser.executableSha256 === executableSha256 && receipt.browser.exitCode === 0, 'RECEIPT_BROWSER_IDENTITY');
  return receipt;
}

export function acquisitionIdentity(receipt, manifest, job, nowUnix) {
  verifiedReceipt(receipt, 'authenticate', manifest, job, nowUnix);
  return RAW_IDENTITY;
}

export async function acquireAuthenticatedInput(manifest, job, authenticate, acquire, nowUnix) {
  const identity = acquisitionIdentity(await authenticate(), manifest, job, nowUnix);
  await acquire(identity);
}

// Keep the descriptor/path replacement predicate executable in platform-independent fixtures.
export function assertStableInput(before, after, named) {
  if (['dev', 'ino', 'size', 'mtimeNs', 'ctimeNs', 'mode', 'uid', 'gid', 'nlink']
    .some((key) => before[key] !== after[key] || before[key] !== named[key])) throw new Error('RAW_INPUT_CHANGED');
}

export function responseProblems({ status, encoding, length }, expectedBytes) {
  const problems = [];
  if (status !== 200) problems.push('INPUT_HTTP_STATUS_OR_REDIRECT');
  if (encoding && encoding !== 'identity') problems.push('INPUT_HTTP_ENCODING');
  if (length !== String(expectedBytes)) problems.push('INPUT_HTTP_LENGTH');
  return problems;
}

function assertRuntimeEnvironment() {
  const report = process.report.getReport().header;
  if (process.platform !== 'linux' || process.arch !== 'x64' || !report.glibcVersionRuntime) throw new Error('BROWSER_PLATFORM_REQUIRED');
  const release = readFileSync('/etc/os-release', 'utf8');
  const os = Object.fromEntries(release.split('\n').filter((line) => line.includes('=')).map((line) => {
    const index = line.indexOf('='); return [line.slice(0, index), line.slice(index + 1).replace(/^"|"$/g, '')];
  }));
  if (!(os.ID === 'ubuntu' && os.VERSION_ID === '24.04') && !(os.ID === 'debian' && os.VERSION_ID === '12' && !process.env.GITHUB_ACTIONS)) {
    throw new Error('BROWSER_OS_POLICY');
  }
  const envProblems = installationProblems({ env: process.env, sources: [], workflows: {}, gitConfig: [],
    npmConfig: { registry: '', 'engine-strict': '', 'ignore-scripts': '', omit: '' }, configPaths: [],
    packageSha256: PACKAGE_SHA256, lockSha256: LOCK_SHA256 })
    .filter((code) => /ENV|CREDENTIAL|TRANSPORT|LOADER|PUPPETEER_SKIP_REQUIRED/.test(code));
  if (envProblems.length) throw new Error(envProblems.join(','));
  if (Object.keys(process.env).some((name) => /^(?:LD_|GLIBC_TUNABLES$|GCONV_PATH$|LOCPATH$)/.test(name))) throw new Error('ALTERNATE_LOADER_ENVIRONMENT');
  if (discoverConfiguration(REPOSITORY).length) throw new Error('PUPPETEER_DISCOVERABLE_CONFIG');
}

function regularInput(path) {
  if (!path || !isAbsolute(path) || realpathSync(path) !== path || !lstatSync(path).isFile()) throw new Error('BROWSER_INPUT_REGULAR_REALPATH');
  trustedDirectory(dirname(path));
  return path;
}

function trustedDirectory(path) {
  if (!isAbsolute(path) || realpathSync(path) !== path) throw new Error('BROWSER_PARENT_REALPATH');
  let current = path;
  while (true) {
    const info = lstatSync(current);
    const stickyTemporary = current === '/tmp' && info.uid === 0 && (info.mode & 0o1000);
    if (!info.isDirectory() || ![0, process.geteuid()].includes(info.uid) || ((info.mode & 0o022) && !stickyTemporary)) {
      throw new Error('BROWSER_UNTRUSTED_PARENT');
    }
    const parent = dirname(current);
    if (parent === current) return;
    current = parent;
  }
}

function python(mode, job, manifest) {
  const key = regularInput(join(job, 'current-google-key.asc'));
  const args = ['-I', '-B', '-S', join(REPOSITORY, 'scripts/extract-verified-browser.py'), mode,
    '--manifest', MANIFEST, '--current-key', key];
  if (mode !== 'authenticate') args.push('--raw', regularInput(join(job, 'browser.deb')), '--root', join(job, 'runtime'));
  let output;
  try {
    output = execFileSync('python3', args,
    { cwd: REPOSITORY, encoding: 'utf8', timeout: 130_000, maxBuffer: 2 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'] });
  } catch (error) {
    // Only the verifier's bounded error identifier is retained; arbitrary tool output is discarded.
    let code = 'BROWSER_VERIFIER_FAILED';
    try { const result = JSON.parse(String(error.stdout)); if (/^[A-Z0-9_]+$/.test(result.error)) code = result.error; } catch { /* bounded fallback */ }
    throw new Error(code);
  }
  let receipt;
  try { receipt = verifiedReceipt(JSON.parse(output), mode, manifest, job); }
  catch (error) { throw new Error(/^RECEIPT_[A-Z_]+$/.test(error.message) ? error.message : 'BROWSER_VERIFIER_RECEIPT'); }
  writeFileSync(join(job, `${mode}-receipt.json`), JSON.stringify(receipt) + '\n', { mode: 0o600 });
  return receipt;
}

function copyOpened(source, destination, bytes, expectedDigest) {
  const input = openSync(regularInput(source), constants.O_RDONLY | constants.O_NOFOLLOW);
  try {
    const before = fstatSync(input, { bigint: true });
    const named = lstatSync(source, { bigint: true });
    if (!before.isFile() || before.size !== BigInt(bytes)) throw new Error('RAW_INPUT_SIZE');
    if (before.uid !== BigInt(process.geteuid()) || (before.mode & 0o077n) !== 0n || before.nlink !== 1n
      || before.dev !== named.dev || before.ino !== named.ino) throw new Error('RAW_INPUT_PRIVATE_IDENTITY');
    const data = readFileSync(input);
    const after = fstatSync(input, { bigint: true });
    const finalName = lstatSync(source, { bigint: true });
    assertStableInput(before, after, finalName);
    if (data.length !== bytes || sha256(data) !== expectedDigest) throw new Error('RAW_INPUT_DIGEST');
    writeFileSync(destination, data, { flag: 'wx', mode: 0o600 });
  } finally { closeSync(input); }
}

async function download(url, destination, bytes, expectedDigest) {
  await new Promise((resolveDownload, rejectDownload) => {
    const output = openSync(destination, 'wx', 0o600);
    const hasher = createHash('sha256');
    let length = 0, finished = false;
    const finish = (error) => {
      if (finished) return;
      finished = true; clearTimeout(timer); closeSync(output);
      if (error) rejectDownload(error); else resolveDownload();
    };
    const request = get(url, { headers: { 'accept-encoding': 'identity' }, timeout: 30_000 }, (response) => {
      const problems = responseProblems({ status: response.statusCode, encoding: response.headers['content-encoding'], length: response.headers['content-length'] }, bytes);
      if (problems.length) { response.destroy(); finish(new Error(problems.join(','))); return; }
      response.on('data', (chunk) => {
        try {
          length += chunk.length;
          if (length > bytes) throw new Error('INPUT_STREAM_BOUND');
          hasher.update(chunk);
          let offset = 0;
          while (offset < chunk.length) {
            const written = writeSync(output, chunk, offset);
            if (written === 0) throw new Error('INPUT_WRITE_FAILED');
            offset += written;
          }
        } catch (error) { response.destroy(); finish(error); }
      });
      response.on('error', () => finish(new Error('INPUT_STREAM_FAILED')));
      response.on('aborted', () => finish(new Error('INPUT_STREAM_ABORTED')));
      response.on('end', () => finish(length === bytes && hasher.digest('hex') === expectedDigest ? undefined : new Error('INPUT_LENGTH_OR_DIGEST')));
    });
    const timer = setTimeout(() => { request.destroy(); finish(new Error('INPUT_TOTAL_TIMEOUT')); }, 180_000);
    request.on('timeout', () => { request.destroy(); finish(new Error('INPUT_IDLE_TIMEOUT')); });
    request.on('error', () => finish(new Error('INPUT_TLS_OR_TRANSPORT_FAILED')));
  });
}

export function verifyBrowser(expectedPath) {
  assertRuntimeEnvironment();
  const manifest = approvedManifest(readFileSync(MANIFEST));
  const job = regularJob(process.env.GS_BROWSER_JOB_DIR);
  const expected = join(job, 'runtime', manifest.runtime.executable);
  if (expectedPath !== expected || process.env.PUPPETEER_EXECUTABLE_PATH !== expected || process.env.CHROME_PATH !== expected) {
    throw new Error('BROWSER_EXECUTABLE_SELECTION');
  }
  return regularInput(python('check', job, manifest).filesystem.executable);
}

function regularJob(path) {
  if (!path || !isAbsolute(path) || realpathSync(path) !== path) throw new Error('BROWSER_JOB_REQUIRED');
  const info = lstatSync(path);
  if (!info.isDirectory() || info.uid !== process.geteuid() || (info.mode & 0o777) !== 0o700) throw new Error('BROWSER_JOB_PRIVATE_ROOT');
  trustedDirectory(path);
  return path;
}

async function provisionBrowser() {
  assertInstallControls(); assertRuntimeEnvironment();
  const manifest = approvedManifest(readFileSync(MANIFEST));
  if (process.env.GS_BROWSER_JOB_DIR || process.env.PUPPETEER_EXECUTABLE_PATH || process.env.CHROME_PATH) throw new Error('BROWSER_ALREADY_PROVISIONED');
  trustedDirectory(tmpdir());
  const job = mkdtempSync(join(tmpdir(), 'gs-verified-browser-')); chmodSync(job, 0o700);
  const raw = join(job, 'browser.deb'), key = join(job, 'current-google-key.asc');
  if (process.env.GS_BROWSER_CURRENT_KEY_PATH) copyOpened(process.env.GS_BROWSER_CURRENT_KEY_PATH, key, 19640, KEY_SHA256);
  else await download(manifest.provenance.keyUrl, key, 19640, KEY_SHA256);
  await acquireAuthenticatedInput(manifest, job, () => python('authenticate', job, manifest), async (identity) => {
    if (process.env.GS_BROWSER_RAW_PATH) copyOpened(process.env.GS_BROWSER_RAW_PATH, raw, identity.bytes, identity.sha256);
    else await download(manifest.source.url, raw, identity.bytes, identity.sha256);
  });
  const executable = regularInput(python('extract', job, manifest).filesystem.executable);
  Object.assign(process.env, { GS_BROWSER_JOB_DIR: job, PUPPETEER_EXECUTABLE_PATH: executable, CHROME_PATH: executable });
  verifyBrowser(executable);
  const values = { GS_BROWSER_JOB_DIR: job, PUPPETEER_EXECUTABLE_PATH: executable, CHROME_PATH: executable };
  if (process.env.GITHUB_ACTIONS === 'true') {
    const output = regularInput(process.env.GITHUB_ENV);
    if (Object.values(values).some((value) => /[\r\n]/.test(value))) throw new Error('BROWSER_ENV_OUTPUT');
    appendFileSync(output, Object.entries(values).map(([name, value]) => `${name}=${value}\n`).join(''));
  }
  console.log(JSON.stringify({ result: 'PASS', ...values, rawSha256: manifest.source.sha256, manifestSha256: MANIFEST_SHA256 }));
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const mode = process.argv[2];
    if (mode === 'install-controls') console.log(JSON.stringify(assertInstallControls()));
    else if (mode === 'check') console.log(JSON.stringify({ result: 'PASS', executable: verifyBrowser(process.env.PUPPETEER_EXECUTABLE_PATH) }));
    else if (mode === 'provision') await provisionBrowser();
    else throw new Error('BROWSER_INPUT_MODE_REQUIRED');
  } catch (error) {
    console.error(`browser-input: ${error.message}`);
    process.exitCode = 1;
  }
}
