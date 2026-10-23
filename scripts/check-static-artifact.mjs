/** Additional export contract; never replaces the normal Next gates. */
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { artifactNoReviewProblems } from './review-public-rules.mjs';
import { LEGAL_DOCUMENT_SLUGS } from '../lib/legal/slugs.ts';
import { legalPreviewProfile } from './legal-preview-rules.mjs';
import { PRODUCTION_ORIGIN } from '../lib/build/production.ts';
import { sitemapPaths, LAUNCH_EXCLUDED_PATHS } from '../lib/build/route-manifest.ts';

// Requirements only: actual provider configuration is deliberately not generated or installed.
export const operatorErrorPolicy = {
  version: 1, providerAcceptance: 'UNVERIFIED', deployable: false, owner: 'operator',
  storage: 'outside-release-root', status: 500, errorUri: '/__gs_error.html',
  cacheControl: 'no-store, max-age=0',
  contentSecurityPolicy: "default-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'",
};
const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');
export function inspectOperatorError(files) {
  const problems = [];
  const html = files.get('error.html'), identity = files.get('identity.json');
  if (!html || !identity || files.size !== 2) problems.push('OPERATOR_ERROR: exactly two operator files required');
  try {
    const recorded = JSON.parse(identity?.toString('utf8'));
    if (JSON.stringify(recorded.policy) !== JSON.stringify(operatorErrorPolicy) ||
        recorded.configurationSha256 !== sha256(JSON.stringify(operatorErrorPolicy))) {
      problems.push('OPERATOR_ERROR: configuration identity differs');
    }
    if (!html || recorded.documentSha256 !== sha256(html)) problems.push('OPERATOR_ERROR: document bytes differ');
  } catch { problems.push('OPERATOR_ERROR: malformed or missing identity'); }
  return problems;
}

export function readArtifact(root) {
  if (!existsSync(root)) throw new Error('Static artifact missing; nothing scanned');
  const files = new Map();
  const visit = (folder, prefix = '') => {
    for (const entry of readdirSync(folder, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const path = `${prefix}${entry.name}`;
      if (entry.isSymbolicLink()) throw new Error('Symlink in deployment artifact');
      if (entry.isDirectory()) visit(join(folder, entry.name), `${path}/`);
      else if (entry.isFile()) files.set(path, readFileSync(join(folder, entry.name)));
    }
  };
  visit(root); return files;
}

export function inspectStaticArtifact(files, manifest, publication, knownSecrets = [], siteOrigin = 'http://localhost:3236', contactMode = 'edge') {
  const problems = [];
  const bad = (code, detail) => problems.push(`${code}: ${detail}`);
  if (!['edge', 'direct'].includes(contactMode)) bad('CONTACT', 'unknown contact mode');
  const expected = manifest.routes.filter((route) => route.eligible);
  let preview = false;
  try { preview = legalPreviewProfile(manifest.legalPreview, manifest.dataset, siteOrigin); }
  catch { bad('PROFILE', 'invalid legal preview boundary'); }
  // GS-R13: indexable means the gridsmith.uk production profile, and nothing else may be.
  const production = manifest.indexable === true;
  if (manifest.version !== 1 || manifest.target !== 'static' || (!preview && manifest.dataset !== 'production') ||
      (production ? preview || siteOrigin !== PRODUCTION_ORIGIN : manifest.indexable !== false)) bad('PROFILE', 'invalid/indexable manifest');
  if (production && LEGAL_DOCUMENT_SLUGS.some((slug) => !expected.some((route) => route.path === `/legal/${slug}` && route.contentType === 'legalDocument'))) {
    bad('LEGAL', 'production requires all seven PUBLISHABLE legal documents');
  }
  const legal = expected.filter((route) => route.contentType === 'legalDocument');
  if ((preview || legal.length > 0) && (legal.length !== 7 ||
      LEGAL_DOCUMENT_SLUGS.some((slug) => !expected.some((route) => route.path === `/legal/${slug}`)))) {
    bad('LEGAL', 'legal output must include all seven canonical documents together');
  }
  // Independent subjects: deleting a manifest entry cannot delete its expectation.
  for (const path of ['/', '/about', '/approach', '/contact', '/insights', '/design', '/digital',
    '/press', '/press/contact', '/press/contact/thank-you']) {
    if (!expected.some((route) => route.path === path)) bad('MANIFEST', 'required fixed route missing');
  }
  for (const entry of publication.filter((item) => ['service', 'legalDocument'].includes(item.type))) {
    const path = entry.type === 'service' ? `/${entry.division}/services/${entry.slug}` : `/legal/${entry.slug}`;
    const route = manifest.routes.find((item) => item.path === path);
    const legal = preview && entry.type === 'legalDocument';
    if (!route || route.eligible !== (legal || entry.eligible) || route.gate !== (legal ? 'GS-O003-R-PREVIEW' : entry.gate) ||
        route.sourceId !== (preview ? `seed-${entry.id}` : entry.id)) bad('PUBLICATION', 'reviewed inventory disagreement');
    if (!legal && !entry.eligible && [...files.keys()].some((name) => name.startsWith(`${path.slice(1)}.`) || name.startsWith(`${path.slice(1)}/`))) bad('GATED', 'excluded route or sidecar emitted');
  }
  for (const path of LAUNCH_EXCLUDED_PATHS) {
    if (manifest.routes.some((route) => route.path === path) || [...files.keys()].some((name) => name.startsWith(path.slice(1) + '.') || name.startsWith(path.slice(1) + '/'))) bad('EXCLUDED', 'withheld Path Finder emitted');
  }
  const htmlPath = (path) => path === '/' ? 'index.html' : `${path.slice(1)}.html`;
  const allowedHtml = new Set([...expected.map((route) => htmlPath(route.path)), '404.html', '500.html']);
  const htmlSizes = {};
  for (const route of expected) {
    const data = files.get(htmlPath(route.path));
    if (!data) { bad('ROUTE', 'eligible route missing'); continue; }
    const text = data.toString('utf8'); htmlSizes[route.path] = data.length;
    const canonical = text.match(/<link\b[^>]*rel="canonical"[^>]*href="([^"]+)"/i)?.[1];
    let canonicalValid = false;
    try { const url = new URL(canonical); canonicalValid = url.origin === siteOrigin && url.pathname === route.path; } catch { /* Missing/malformed canonical is a failure. */ }
    if (!/<h1(?:\s|>)/i.test(text) || !/<title>[^<]+<\/title>/i.test(text) ||
        !/<meta\b[^>]*name="description"[^>]*content="[^\"]+"/i.test(text) ||
        !canonicalValid) bad('SEO', 'heading/title/description/exact staging canonical missing');
    const robotsMeta = text.match(/<meta\b[^>]*name="robots"[^>]*content="([^"]*)"/i)?.[1];
    // Production: a sitemap route must be indexable, and a non-sitemap route keeps its own noindex.
    if (production && route.sitemap) {
      if (!robotsMeta || /noindex|nofollow/i.test(robotsMeta) || !/\bindex\b/i.test(robotsMeta)) bad('INDEX', `${route.path}: production sitemap route not indexable`);
    } else if (!/noindex/i.test(robotsMeta ?? '')) bad(production ? 'INDEX' : 'NOINDEX', `${route.path}: route missing noindex`);
    if (preview && route.contentType === 'legalDocument' &&
        (!text.includes('ADOPTED, NOT YET PUBLISHED.') || /\[TK|\[SEED|\[OWNER DECISION|Basis:|prerequisitesMet|adoptionAuthority/.test(text))) {
      bad('LEGAL', 'adopted review notice missing or internal material rendered');
    }
    if (route.path === '/' && !/application\/ld\+json/.test(text)) bad('STRUCTURED', 'Organization data missing');
    if (['/contact', '/press/contact'].includes(route.path)) {
      const kind = route.path === '/contact' ? 'contact' : 'press';
      if (contactMode === 'direct') {
        if (!/data-static-contact-shell/.test(text) || !/href="mailto:[^"\s]+@[^"\s]+"/.test(text) ||
            !/href="https:\/\/wa.me\/\d+"/.test(text) || /<form\b/i.test(text)) bad('CONTACT', 'direct email/WhatsApp contact missing or a form remains');
      } else if (!new RegExp(`<form\\b[^>]*data-edge-form="${kind}"`).test(text) || /data-static-contact-shell/.test(text) ||
          /<form\b[^>]*\baction=/i.test(text) || !/<noscript>[^]*JavaScript is required[^]*mailto:/i.test(text)) bad('FORM', 'functional Edge form/no-JS disclosure missing or runtime binding present');
    }
    if (route.path === '/press/contact/thank-you' && (contactMode === 'direct'
      ? /That has reached us/.test(text) || !/This website does not collect enquiries through a form/.test(text)
      : !/That has reached us/.test(text) || /data-static-contact-shell/.test(text))) bad('FORM', 'contact confirmation does not match contact mode');
  }
  const notFound = files.get('404.html')?.toString('utf8');
  if (!notFound || !/<h1(?:\s|>)/i.test(notFound) || !/Gridsmith/i.test(notFound) || !/noindex/.test(notFound)) bad('404', 'branded noindex document missing');
  const robots = files.get('robots.txt')?.toString('utf8');
  const sitemap = files.get('sitemap.xml')?.toString('utf8');
  if (production) {
    const error = files.get('500.html')?.toString('utf8') ?? '';
    if (!/<html\b[^>]*\slang="en(?:-GB)?"/i.test(error) || !/<title>[^<]+<\/title>/i.test(error) ||
        !/<main\b/.test(error) || !/<h1\b/.test(error) || !/href="\/"/.test(error) ||
        !/noindex/.test(error) || /::vercel:|nothing you sent has been lost/i.test(error)) bad('500', 'accessible truthful static error document missing');
    if (!robots || !/^Allow:\s*\/\s*$/im.test(robots) || /^Disallow:/im.test(robots) ||
        !robots.includes(`Sitemap: ${PRODUCTION_ORIGIN}/sitemap.xml`)) bad('ROBOTS', 'production crawl policy missing');
    const locs = [...(sitemap ?? '').matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]).sort();
    const want = sitemapPaths(manifest).map((path) => new URL(path, PRODUCTION_ORIGIN).toString()).sort();
    if (!sitemap || !/<urlset\b/.test(sitemap) || JSON.stringify(locs) !== JSON.stringify(want)) bad('SITEMAP', 'production sitemap must list exactly the eligible routes');
    const rules = files.get('.htaccess')?.toString('utf8') ?? '';
    if (!rules.includes('RewriteCond %{HTTP_HOST} !^gridsmith\\.uk$ [NC]') ||
        !rules.includes('RewriteRule \\.(?:php[0-9]?|phtml|phar|pl|cgi)(?:/|$) - [F,L,NC]') ||
        /noindex|<IfModule mod_headers/i.test(rules) || !/^Header always set Content-Security-Policy /m.test(rules) ||
        !/^ErrorDocument 500 \/500.html$/m.test(rules)) {
      bad('HTACCESS', 'production host lock, PHP denial or header policy missing');
    }
    let deployment = null;
    try { deployment = files.has('__deployment.json') ? JSON.parse(files.get('__deployment.json')) : null; } catch { bad('REHEARSAL', 'unreadable deployment identity'); }
    if (/^Require all denied$/m.test(rules) || (deployment && deployment.deployable !== true)) bad('REHEARSAL', 'rehearsal artifact is not deployable');
  } else {
    if (!robots || !/Disallow:\s*\/\s*(?:\n|$)/i.test(robots) || /^Allow:/im.test(robots)) bad('ROBOTS', 'temporary crawl policy missing');
    if (!sitemap || !/<urlset\b/.test(sitemap) || /<loc>/.test(sitemap)) bad('SITEMAP', 'temporary sitemap must be empty');
  }
  let totalBytes = 0;
  for (const [name, data] of files) {
    if (/(?:^|\/)(?:ops|hostinger-error)(?:\/|$)/.test(name) || name === '__gs_error.html' ||
        data.includes(Buffer.from('<title>Page unavailable — Gridsmith Ltd</title>'))) {
      bad('OPERATOR_ERROR', 'independent fallback must not enter the website artifact');
    }
    totalBytes += data.length;
    const text = data.toString('utf8');
    if (contactMode === 'direct' && /\.(?:html|js|txt|json)$/.test(name) &&
        /supabase\.co|gs-lead-intake|data-edge-form|::vercel:/.test(text)) bad('CONTACT', 'intake/Preview transport or obsolete hosting marker in direct-contact artifact');
    if (/\.(?:html|css|js|txt|xml|json|svg)$/.test(name) &&
        (/[ \t]+(?=\r?$)/m.test(text) || /(?:\r?\n){2,}$/.test(text))) bad('WHITESPACE', 'generated text cannot pass publication whitespace check');
    if (/\.html$/.test(name) && !allowedHtml.has(name)) bad('EXTRA', 'unmanifested HTML emitted');
    if (/(?:^|\/)(?:api|gridsmith-[^/]*probe|%5Fkitchen-sink|%5Fmaster-sink|_kitchen-sink|_master-sink)(?:[/.]|$)/i.test(name) ||
        /(?:^|\/)(?:\.env[^/]*|node_modules|\.next|package(?:-lock)?\.json)(?:\/|$)/.test(name)) bad('RUNTIME', 'server/test/source artifact emitted');
    if (/22108992|22100632|Varnika/i.test(text)) bad('WITHHELD', 'withheld marker present');
    if (/SUPABASE_SERVICE_ROLE_KEY|GRIDSMITH_WORKER_TOKEN|RESEND_API_KEY|SANITY_API_WRITE_TOKEN|DIRECT_CONNECTION_STRING|VERCEL_TOKEN|FREELANCER_API_(?:TOKEN|SECRET)|Freelancer-OAuth-V1|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|postgres(?:ql)?:\/\/|\bre_[A-Za-z0-9_]{24,}|\bsb_secret_[A-Za-z0-9_-]{20,}/.test(text) ||
        knownSecrets.some((value) => value.length >= 8 && data.includes(Buffer.from(value)))) bad('SECRET', 'privileged marker/value present');
    for (const token of text.match(/eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g) ?? []) {
      try { if (JSON.parse(Buffer.from(token.split('.')[1], 'base64url')).role === 'service_role') bad('SECRET', 'privileged JWT present'); } catch { /* Not a JSON JWT. */ }
    }
    if (/\/_next\/image\?url=/.test(text)) bad('IMAGE', 'runtime optimiser URL present');
    if (/ownerAdoptedSha256|adoptionAuthority|prerequisitesMet|ownerConfirmations/.test(text)) bad('PRIVATE', 'internal legal register material emitted');
    if (/api\.sanity\.io\/[\s\S]{0,80}data\/query/.test(text)) bad('CMS-RUNTIME', 'CMS query transport emitted');
    if (/\$ACTION_|Next-Action|createServerReference\(/.test(text)) bad('ACTION', 'Next Server Action transport emitted');
    if (/\.(?:html|css|svg)$/.test(name)) {
      const resource = (value) => {
        if (!value || /^(?:#|data:|blob:|https?:|\/\/)/i.test(value)) return;
        try {
          const path = decodeURIComponent(new URL(value, `http://static.invalid/${name}`).pathname).slice(1);
          if (!files.has(path)) bad('ASSET', 'local resource missing');
        } catch { bad('ASSET', 'malformed local resource URL'); }
      };
      for (const tag of text.matchAll(/<([a-z][\w:-]*)\b([^>]*)>/gi)) {
        const attributes = new Map([...tag[2].matchAll(/([\w:-]+)\s*=\s*(?:"([^\"]*)"|'([^']*)')/g)]
          .map((attr) => [attr[1].toLowerCase(), attr[2] ?? attr[3]]));
        resource(attributes.get('src')); resource(attributes.get('poster'));
        const href = attributes.get('href');
        if (tag[1].toLowerCase() === 'a' && href?.startsWith('/')) {
          const url = new URL(href, siteOrigin), target = htmlPath(url.pathname);
          const gatedLegal = !preview && manifest.routes.some((route) =>
            route.path === url.pathname && !route.eligible && route.contentType === 'legalDocument');
          if (!files.has(target) && !files.has(url.pathname.slice(1)) && !gatedLegal) bad('LINK', 'internal link has no exported destination');
          if (url.hash && files.has(target) && !files.get(target).toString('utf8').includes(`id="${url.hash.slice(1)}"`)) bad('LINK', 'internal link fragment has no target');
        }
        if (['image', 'use'].includes(tag[1].toLowerCase()) ||
            (tag[1].toLowerCase() === 'link' && /^(?:stylesheet|icon|apple-touch-icon|manifest|preload|modulepreload)$/i.test(attributes.get('rel') ?? ''))) {
          resource(attributes.get('href') ?? attributes.get('xlink:href'));
        }
        const srcset = attributes.get('srcset');
        if (srcset && !srcset.startsWith('data:')) for (const candidate of srcset.split(',')) resource(candidate.trim().split(/\s+/)[0]);
      }
      for (const match of text.matchAll(/url\(\s*["']?([^\s)"']+)/g)) resource(match[1]);
    }
  }
  if (!files.size) bad('COUNT', 'zero files scanned');
  if (![...files.keys()].some((name) => /^_next\/static\/.*\.js$/.test(name))) bad('CHUNKS', 'no client JavaScript scanned');
  return { problems, fileCount: files.size, totalBytes, htmlRoutes: Object.keys(htmlSizes).length, htmlSizes };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const manifest = JSON.parse(readFileSync('build/static-route-manifest.json', 'utf8'));
  const publication = JSON.parse(readFileSync('docs/_shared/GS-PROD-001-CMS-MANIFEST.json', 'utf8')).entries;
  const secrets = ['SUPABASE_SERVICE_ROLE_KEY', 'GRIDSMITH_WORKER_TOKEN', 'RESEND_API_KEY', 'SANITY_API_WRITE_TOKEN',
    'DIRECT_CONNECTION_STRING', 'VERCEL_TOKEN', 'FREELANCER_API_TOKEN', 'FREELANCER_API_SECRET']
    .map((name) => process.env[name]).filter((value) => value?.length >= 8);
  const receipt = JSON.parse(readFileSync('build/static-receipt.json'));
  const result = inspectStaticArtifact(readArtifact(resolve('out')), manifest, publication, secrets,
    receipt.siteOrigin ?? 'http://localhost:3236', receipt.contactMode ?? 'edge');
  result.problems.push(...artifactNoReviewProblems(readArtifact(resolve('out'))));
  if (result.problems.length) { console.error(result.problems.join('\n')); process.exitCode = 1; }
  else console.log(`Static contract PASS: ${result.htmlRoutes} routes, ${result.fileCount} files, ${result.totalBytes} bytes; ${secrets.length} supplied secret values checked.`);
}
