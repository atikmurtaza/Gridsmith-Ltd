/** Local/noindex export proof; building never submits enquiries or sends mail. */
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { createClient } from '@sanity/client';
import { createStaticManifest } from '../lib/build/route-manifest.ts';
import { resolveBuildTarget } from '../lib/build/target.ts';
import { stagingReviewsAllowed, REVIEW_STAGING_ORIGIN } from '../lib/reviews/public-model.ts';
import { hostingerRules, prepareHostingerText } from '../lib/build/hostinger.ts';
import { SANITY_PROJECT_ID, SANITY_API_VERSION } from '../sanity/project.ts';
import { inspectStaticArtifact, readArtifact } from './check-static-artifact.mjs';
import { artifactReviewProblems } from './review-public-rules.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const staging = join(root, 'build/static-source');
const output = join(root, 'out');
const manifestFile = join(root, 'build/static-route-manifest.json');
const require = createRequire(join(root, 'package.json'));
const publication = JSON.parse(readFileSync(join(root, 'docs/_shared/GS-PROD-001-CMS-MANIFEST.json'))).entries;
const digest = (bytes) => createHash('sha256').update(bytes).digest('hex');
resolveBuildTarget(process.env.GRIDSMITH_BUILD_TARGET);
const intakeUrl = 'https://qfgpwumvvtizeamkynes.supabase.co/functions/v1/gs-lead-intake';
if (process.env.NEXT_PUBLIC_LEAD_INTAKE_URL !== intakeUrl) {
  throw new Error('H4-B static proof requires the explicit isolated Preview intake URL');
}

// Recursive cleanup is restricted to explicit generated paths in this checkout.
function removeGenerated(path) {
  if (![staging, output].includes(path) || relative(root, path).startsWith('..')) throw new Error('Unsafe static cleanup path');
  if (existsSync(path)) rmSync(path, { recursive: true });
}
const siteOrigin = process.env.GRIDSMITH_STAGING_ORIGIN ?? 'http://localhost:3236';
if (!stagingReviewsAllowed('owner-staging', siteOrigin) || new URL(siteOrigin).origin !== siteOrigin) {
  throw new Error('Explicit temporary/local staging origin required; gridsmith.uk is forbidden');
}
const environment = { ...process.env, GRIDSMITH_BUILD_TARGET: 'static', GRIDSMITH_STATIC_PROOF: '1',
  GRIDSMITH_STATIC_MANIFEST_PATH: manifestFile, GRIDSMITH_REVIEW_PRESENTATION: 'owner-staging', NEXT_PUBLIC_SANITY_DATASET: 'production',
  NEXT_PUBLIC_SITE_URL: siteOrigin, NEXT_PUBLIC_BUNDLE_SIZE_PROBE: '', GRIDSMITH_EXCLUDE_PROBES: '1' };
const privateNames = ['SUPABASE_SERVICE_ROLE_KEY', 'GRIDSMITH_WORKER_TOKEN', 'DIRECT_CONNECTION_STRING', 'RESEND_API_KEY',
  'SANITY_API_WRITE_TOKEN', 'SANITY_API_READ_TOKEN', 'VERCEL_TOKEN', 'FREELANCER_API_TOKEN',
  'FREELANCER_API_SECRET', 'SLACK_LEADS_WEBHOOK', 'CRON_SECRET'];
for (const key of [...privateNames, 'PROJECT_URL', 'PUBLISHABLE_KEY', 'VERCEL_ENV', 'VERCEL_URL',
  'VERCEL_PROJECT_PRODUCTION_URL', 'LEAD_NOTIFICATION_FROM', 'LEAD_NOTIFICATION_EMAIL']) delete environment[key];
const run = (args, cwd = root) => {
  const result = spawnSync(process.execPath, args, { cwd, env: environment, stdio: 'inherit', windowsHide: true });
  if (result.status !== 0) throw new Error(`Static build step failed (${result.status ?? 'no exit code'})`);
};
const client = createClient({ projectId: SANITY_PROJECT_ID, dataset: 'production',
  apiVersion: SANITY_API_VERSION, useCdn: false, perspective: 'published' });
const inventory = () => client.fetch(`*[_type in ["companyDetails", "groupPage", "service", "post", "legalDocument"]
  && !(_id in path("drafts.**")) && (_type != "service" || published == true)
  && (_type != "post" || status == "published")]{_id, _type, _rev, "slug":slug.current,
  division, published, status, "isSeed":coalesce(isSeed,false)}`);
const replaceOnce = (file, before, after) => {
  const path = join(staging, file), source = readFileSync(path, 'utf8');
  if (source.split(before).length !== 2) throw new Error(`Static preparation premise changed: ${file}`);
  writeFileSync(path, source.replace(before, after));
};

removeGenerated(output); // A failed build cannot leave a stale apparently-good artifact.
removeGenerated(staging);
mkdirSync(staging, { recursive: true });
run(['scripts/check-node-version.mjs']);
run(['scripts/check-launch-content.mjs', '--build']);
const manifest = createStaticManifest(await inventory(), publication);
writeFileSync(manifestFile, JSON.stringify(manifest, null, 2) + '\n');
for (const name of ['app', 'components', 'lib', 'styles', 'sanity', 'public', 'redirects', 'scripts',
  'lighthouse', 'package.json', 'package-lock.json', 'next.config.ts', 'postcss.config.mjs',
  'tsconfig.json', 'css.d.ts', 'eslint.config.mjs', '.gitignore']) cpSync(join(root, name), join(staging, name), { recursive: true });
symlinkSync(join(root, 'node_modules'), join(staging, 'node_modules'), process.platform === 'win32' ? 'junction' : 'dir');
// The disposable tree is nested under an ignored build directory. Explicit content
// roots avoid auto-discovery traversing sibling builds or dropping this tree.
replaceOnce('styles/globals.css', '@import "tailwindcss";',
  '@import "tailwindcss" source(none);\n@source "../app";\n@source "../components";\n@source "../lib";');
const exclusions = [];
for (const name of ['app/api', 'app/gridsmith-lead-probe', 'app/gridsmith-timeout-probe',
  'app/(marketing)/%5Fkitchen-sink', 'app/(marketing)/%5Fmaster-sink',
  'app/(marketing)/gridsmith-error-probe', 'app/(marketing)/gridsmith-ssr-throw-probe']) {
  const path = join(staging, name);
  if (!existsSync(path)) throw new Error(`Normal verification subject missing: ${name}`);
  rmSync(path, { recursive: true }); exclusions.push(name);
}
for (const division of ['design', 'digital', 'press']) replaceOnce(
  `app/(${division})/${division}/services/[slug]/page.tsx`,
  'export const generateStaticParams = route.generateStaticParams;',
  'export const dynamicParams = false;\nexport const generateStaticParams = route.generateStaticParams;');
for (const name of ['app/sitemap.ts', 'app/robots.ts']) {
  const path = join(staging, name), source = readFileSync(path, 'utf8');
  if (/export const dynamic\b/.test(source)) throw new Error(`Static metadata premise changed: ${name}`);
  writeFileSync(path, source + "\nexport const dynamic = 'force-static';\n");
}
for (const [kind, folder] of [['post', 'app/(marketing)/insights/[slug]'], ['legalDocument', 'app/(marketing)/legal/[slug]']]) {
  if (!manifest.routes.some((route) => route.eligible && route.contentType === kind)) {
    rmSync(join(staging, folder), { recursive: true }); exclusions.push(folder);
  } else {
    const file = join(staging, folder, 'page.tsx');
    writeFileSync(file, readFileSync(file, 'utf8') + '\nexport const dynamicParams = false;\n');
  }
}
// Replace only the adapters in the disposable export tree. The real forms remain,
// while the Server Action/runtime graph cannot enter the static browser bundle.
for (const [file, edge, action] of [['lib/leads/action.ts', 'submitContactEdge', 'submitLeadAction'],
  ['lib/leads/pressAction.ts', 'submitPressEdge', 'submitPressLeadAction']]) writeFileSync(join(staging, file),
  `export { ${edge} as ${action} } from './edge-client';\nexport type { FormState } from './form-domain';\n`);
// H4-D-R1 uses a frozen sanitised source; no provider retrieval enters either UI build.
const sharp = require('sharp');
const logoSource = readFileSync(join(root, 'public/brand/gridsmith-logo-3d.png'));
const preparedLogo = await sharp(logoSource).resize(1080, 1080).webp({ quality: 75 }).toBuffer();
writeFileSync(join(staging, 'public/brand/gridsmith-logo-3d-1080.webp'), preparedLogo);
const logoMetadata = await sharp(preparedLogo).metadata();
try {
  run([require.resolve('next/dist/bin/next'), 'build'], staging);
  const after = createStaticManifest(await inventory(), publication);
  if (JSON.stringify(after) !== JSON.stringify(manifest)) throw new Error('CMS revisions changed during static generation');
  if (siteOrigin === REVIEW_STAGING_ORIGIN) writeFileSync(join(staging, 'out/.htaccess'), hostingerRules(siteOrigin));
  for (const [path, bytes] of readArtifact(join(staging, 'out'))) {
    if (path.endsWith('.html') || path === 'robots.txt') {
      writeFileSync(join(staging, 'out', path), prepareHostingerText(path, bytes.toString('utf8')));
    }
  }
  const files = readArtifact(join(staging, 'out'));
  const knownSecrets = privateNames.map((name) => process.env[name]).filter((value) => value?.length >= 8);
  const result = inspectStaticArtifact(files, manifest, publication, knownSecrets, siteOrigin);
  result.problems.push(...artifactReviewProblems(files, JSON.parse(readFileSync(join(root, 'docs/_shared/GS-HOST-H4-D-REVIEW-BASELINE.json')))));
  if (result.problems.length) throw new Error(result.problems.join('\n'));
  cpSync(join(staging, 'out'), output, { recursive: true });
  const fileManifest = [...files].map(([path, data]) => ({ path, bytes: data.length, sha256: digest(data) }));
  const sourceSha = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8', windowsHide: true }).stdout.trim();
  const untracked = spawnSync('git', ['ls-files', '--others', '--exclude-standard', '-z'], { cwd: root, encoding: 'utf8', windowsHide: true }).stdout.split('\0');
  const sourceModified = Boolean(spawnSync('git', ['status', '--porcelain', '--untracked-files=no'], { cwd: root, encoding: 'utf8', windowsHide: true }).stdout.trim()) ||
    untracked.some((path) => /^(?:app|components|lib|styles|sanity|public|redirects|scripts|lighthouse)\//.test(path));
  const deployment = { phase: 'GS-HOST-H4-D-R1', sourceSha, sourceModified, siteOrigin, artifactIdentity: digest(JSON.stringify(fileManifest)), files: fileManifest };
  writeFileSync(join(output, '__deployment.json'), JSON.stringify(deployment) + '\n');
  const finalResult = inspectStaticArtifact(readArtifact(output), manifest, publication, knownSecrets, siteOrigin);
  if (finalResult.problems.length) throw new Error(finalResult.problems.join('\n'));
  writeFileSync(join(root, 'build/static-receipt.json'), JSON.stringify({ phase: 'GS-HOST-H4-D-R1', stagingOnly: true, siteOrigin,
    buildNode: process.version,
    sourceSha, sourceModified, manifest, exclusions, ...finalResult, knownSecretValuesChecked: knownSecrets.length,
    image: { sourceBytes: logoSource.length, sourceSha256: digest(logoSource), deliveryBytes: preparedLogo.length,
      deliverySha256: digest(preparedLogo), width: logoMetadata.width, height: logoMetadata.height,
      format: logoMetadata.format, quality: 75, alpha: logoMetadata.hasAlpha },
    files: fileManifest, manifestSha256: digest(JSON.stringify(fileManifest)) }, null, 2) + '\n');
  console.log(`Static proof: ${finalResult.htmlRoutes} routes; ${finalResult.fileCount} files; ${finalResult.totalBytes} bytes. Output: out/`);
  console.log('Owner-authorised staging artifact only. Hosted verification and production permission gates remain separate.');
} finally {
  removeGenerated(staging); // Discard raw provider fetch cache and copied source; never deploy/archive it.
}
