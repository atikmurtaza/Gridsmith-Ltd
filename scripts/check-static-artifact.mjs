/** Additional export contract; never replaces the normal Next gates. */
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { artifactReviewProblems } from './review-public-rules.mjs';

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

export function inspectStaticArtifact(files, manifest, publication, knownSecrets = [], siteOrigin = 'http://localhost:3236') {
  const problems = [];
  const bad = (code, detail) => problems.push(`${code}: ${detail}`);
  const expected = manifest.routes.filter((route) => route.eligible);
  if (manifest.version !== 1 || manifest.target !== 'static' || manifest.dataset !== 'production' || manifest.indexable !== false) bad('PROFILE', 'invalid/indexable manifest');
  // Independent subjects: deleting a manifest entry cannot delete its expectation.
  for (const path of ['/', '/about', '/approach', '/contact', '/insights', '/design', '/digital',
    '/press', '/press/contact', '/press/contact/thank-you', '/press/path-finder']) {
    if (!expected.some((route) => route.path === path)) bad('MANIFEST', 'required fixed route missing');
  }
  for (const entry of publication.filter((item) => ['service', 'legalDocument'].includes(item.type))) {
    const path = entry.type === 'service' ? `/${entry.division}/services/${entry.slug}` : `/legal/${entry.slug}`;
    const route = manifest.routes.find((item) => item.path === path);
    if (!route || route.eligible !== entry.eligible || route.gate !== entry.gate || route.sourceId !== entry.id) bad('PUBLICATION', 'reviewed inventory disagreement');
    if (!entry.eligible && [...files.keys()].some((name) => name.startsWith(`${path.slice(1)}.`) || name.startsWith(`${path.slice(1)}/`))) bad('GATED', 'excluded route or sidecar emitted');
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
    if (!/<meta\b[^>]*name="robots"[^>]*content="[^\"]*noindex/i.test(text)) bad('NOINDEX', 'route missing noindex');
    if (route.path === '/' && !/application\/ld\+json/.test(text)) bad('STRUCTURED', 'Organization data missing');
    if (['/contact', '/press/contact'].includes(route.path)) {
      const kind = route.path === '/contact' ? 'contact' : 'press';
      if (!new RegExp(`<form\\b[^>]*data-edge-form="${kind}"`).test(text) || /data-static-contact-shell/.test(text) ||
          /<form\b[^>]*\baction=/i.test(text) || !/<noscript>[^]*JavaScript is required[^]*mailto:/i.test(text)) bad('FORM', 'functional Edge form/no-JS disclosure missing or runtime binding present');
    }
    if (route.path === '/press/contact/thank-you' && (!/That has reached us/.test(text) || /data-static-contact-shell/.test(text))) bad('FORM', 'fixed accepted confirmation missing');
  }
  const notFound = files.get('404.html')?.toString('utf8');
  if (!notFound || !/<h1(?:\s|>)/i.test(notFound) || !/Gridsmith/i.test(notFound) || !/noindex/.test(notFound)) bad('404', 'branded noindex document missing');
  const robots = files.get('robots.txt')?.toString('utf8');
  if (!robots || !/Disallow:\s*\/\s*(?:\n|$)/i.test(robots) || /^Allow:/im.test(robots)) bad('ROBOTS', 'temporary crawl policy missing');
  const sitemap = files.get('sitemap.xml')?.toString('utf8');
  if (!sitemap || !/<urlset\b/.test(sitemap) || /<loc>/.test(sitemap)) bad('SITEMAP', 'temporary sitemap must be empty');
  let totalBytes = 0;
  for (const [name, data] of files) {
    totalBytes += data.length;
    const text = data.toString('utf8');
    if (/\.(?:html|css|js|txt|xml|json|svg)$/.test(name) &&
        (/[ \t]+(?=\r?$)/m.test(text) || /(?:\r?\n){2,}$/.test(text))) bad('WHITESPACE', 'generated text cannot pass publication whitespace check');
    if (/\.html$/.test(name) && !allowedHtml.has(name)) bad('EXTRA', 'unmanifested HTML emitted');
    if (/(?:^|\/)(?:api|gridsmith-[^/]*probe|%5Fkitchen-sink|%5Fmaster-sink|_kitchen-sink|_master-sink)(?:[/.]|$)/i.test(name) ||
        /(?:^|\/)(?:\.env[^/]*|node_modules|\.next|package(?:-lock)?\.json)(?:\/|$)/.test(name)) bad('RUNTIME', 'server/test/source artifact emitted');
    if (/22108992|22100632|Varnika/i.test(text)) bad('WITHHELD', 'withheld marker present');
    if (/SUPABASE_SERVICE_ROLE_KEY|GRIDSMITH_WORKER_TOKEN|RESEND_API_KEY|SANITY_API_WRITE_TOKEN|DIRECT_CONNECTION_STRING|VERCEL_TOKEN|FREELANCER_API_(?:TOKEN|SECRET)|Freelancer-OAuth-V1|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|postgres(?:ql)?:\/\/|\bre_[A-Za-z0-9_]{24,}/.test(text) ||
        knownSecrets.some((value) => value.length >= 8 && data.includes(Buffer.from(value)))) bad('SECRET', 'privileged marker/value present');
    for (const token of text.match(/eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g) ?? []) {
      try { if (JSON.parse(Buffer.from(token.split('.')[1], 'base64url')).role === 'service_role') bad('SECRET', 'privileged JWT present'); } catch { /* Not a JSON JWT. */ }
    }
    if (/\/_next\/image\?url=/.test(text)) bad('IMAGE', 'runtime optimiser URL present');
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
  const result = inspectStaticArtifact(readArtifact(resolve('out')), manifest, publication, secrets, JSON.parse(readFileSync('build/static-receipt.json')).siteOrigin ?? 'http://localhost:3236');
  result.problems.push(...artifactReviewProblems(readArtifact(resolve('out')), JSON.parse(readFileSync('docs/_shared/GS-HOST-H4-D-REVIEW-BASELINE.json'))));
  if (result.problems.length) { console.error(result.problems.join('\n')); process.exitCode = 1; }
  else console.log(`Static contract PASS: ${result.htmlRoutes} routes, ${result.fileCount} files, ${result.totalBytes} bytes; ${secrets.length} supplied secret values checked.`);
}
