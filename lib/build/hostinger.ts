import { REVIEW_STAGING_ORIGIN } from '../reviews/public-model.ts';
import { PRODUCTION_ORIGIN, PREVIEW_INTAKE_URL, PRODUCTION_INTAKE_URL } from './production.ts';
import { readFileSync } from 'node:fs';

type LegacyRedirect = { source: string; destination: string; permanent: boolean };
const legacyRedirects: LegacyRedirect[] = JSON.parse(
  readFileSync(new URL('../../redirects/legacy.json', import.meta.url), 'utf8'));

/** Encode quoted whitespace without changing the review's DOM text or layout. */
export function prepareHostingerText(path: string, text: string) {
  if (path === 'robots.txt') return text.trimEnd() + '\n';
  if (!path.endsWith('.html')) return text;
  return text.replace(/(<blockquote\b[^>]*><p>)([\s\S]*?)(<\/p><\/blockquote>)/g,
    (_, start: string, quote: string, end: string) => start + quote.replace(/[ \t]+(?=\r?$)/gm,
      whitespace => [...whitespace].map(character => character === ' ' ? '&#32;' : '&#9;').join('')) + end);
}

const routing = `RewriteCond %{THE_REQUEST} \\s/+(.+?)/+[?\\s]
RewriteRule ^(.+)/$ /$1 [R=308,L,NE]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME}.html -f
RewriteRule ^(.+)$ $1.html [L]
`;

/** One header policy for both profiles, so staging and production cannot drift apart. */
function headerPolicy(noindex: boolean, connect: string, dataset: string) {
  return `${noindex ? 'Header always set X-Robots-Tag "noindex, nofollow, noarchive"\n' : ''}Header always set X-Content-Type-Options "nosniff"
Header always set X-Frame-Options "DENY"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
Header always set Permissions-Policy "camera=(), geolocation=(), microphone=(), payment=(), usb=(), browsing-topics=()"
Header always set Strict-Transport-Security "max-age=31536000"
Header always set Content-Security-Policy "default-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; object-src 'none'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://cdn.sanity.io; font-src 'self'; connect-src 'self' ${connect}; media-src 'self' https://cdn.sanity.io; worker-src 'self' blob:; manifest-src 'self'"
Header always set X-GridSmith-Sanity-Dataset "${dataset}"
Header always set Cache-Control "no-cache"
<FilesMatch "\\.(?:svg|png|jpe?g|webp|avif|glb|gltf|bin|woff2?)$">
Header always set Cache-Control "public, max-age=300, must-revalidate, no-transform"
</FilesMatch>
<FilesMatch "(?:(?:[.-][a-f0-9]{8,}|^[a-f0-9]{8,})\\.(?:js|css)|^[a-f0-9]{8,}[^/]*\\.woff2)$">
Header always set Cache-Control "public, max-age=31536000, immutable"
</FilesMatch>
`;
}

const types = `<IfModule mod_mime.c>
AddType application/javascript .js
AddType text/css .css
AddType font/woff2 .woff2
AddType model/gltf-binary .glb
AddType model/gltf+json .gltf
AddType image/svg+xml .svg
</IfModule>
<IfModule mod_deflate.c>
AddOutputFilterByType DEFLATE text/html text/plain text/css application/javascript application/json image/svg+xml
</IfModule>
`;

/** Hostinger HTTP cache policy; unrelated to prohibited review-data caching. */
export function hostingerRules(origin: string, dataset: 'production' | 'development' = 'production',
  intakeOrigin = new URL(PREVIEW_INTAKE_URL).origin) {
  if (origin !== REVIEW_STAGING_ORIGIN) throw new Error('Exact isolated Hostinger staging origin required');
  // GS-R14: the temporary domain may use the Production intake; nothing else may enter connect-src.
  if (![PREVIEW_INTAKE_URL, PRODUCTION_INTAKE_URL].some((url) => url && new URL(url).origin === intakeOrigin)) {
    throw new Error('Staging rules require the Preview or recorded Production intake origin');
  }
  return `# GS-HOST-H4-D-R1: static files only; no PHP or Node application runtime.
Options -Indexes -MultiViews
DirectoryIndex index.html
ErrorDocument 404 /404.html
RewriteEngine On
RewriteRule (^|/)\\.(?!well-known/) - [F,L]
RewriteCond %{HTTP_HOST} !^mediumaquamarine-wallaby-594070\\.hostingersite\\.com$ [NC]
RewriteRule ^ - [F,L]
RewriteCond %{HTTPS} !=on
RewriteRule ^ https://mediumaquamarine-wallaby-594070.hostingersite.com%{REQUEST_URI} [R=308,L,NE]
# Legal successors remain gated: legacy requests must return the branded 404.
RewriteRule ^(?:privacy-policy|terms-and-conditions)/?$ - [R=404,L]
${routing}<IfModule mod_headers.c>
${headerPolicy(true, intakeOrigin, dataset)}</IfModule>
${types}`;
}

/** `redirects/legacy.json` is the one map; `next.config.ts` reads the same file. */
function legacyRules() {
  return legacyRedirects.map(({ source, destination, permanent }) => {
    const path = /^\/([a-z0-9-]+)\{\/\}\?$/.exec(source)?.[1];
    if (!path || !permanent || !/^\/legal\/[a-z-]+$/.test(destination)) throw new Error(`Unsupported legacy redirect ${source}`);
    return `RewriteRule ^${path}/?$ ${destination} [R=308,L]\n`;
  }).join('');
}

/**
 * GS-R13: the gridsmith.uk policy. Indexable; exact host lock, with www folded into the apex;
 * PHP and other script extensions refused, because the document root has held WordPress; and
 * headers outside `<IfModule>`, so a missing module fails loudly instead of dropping them.
 */
export function productionHostingerRules(intakeOrigin: string | null, dataset: 'production' = 'production',
  { rehearsal = false } = {}) {
  const preview = intakeOrigin === new URL(PREVIEW_INTAKE_URL).origin;
  if (intakeOrigin !== null && (!/^https:\/\/[a-z0-9]{20}\.supabase\.co$/.test(intakeOrigin) || preview !== rehearsal)) {
    throw new Error('Production rules require the Production Supabase intake origin (Preview only in a rehearsal)');
  }
  if (dataset !== 'production') throw new Error('Production rules require the production dataset');
  const host = new URL(PRODUCTION_ORIGIN).host, hostPattern = host.replaceAll('.', '\\.');
  // A rehearsal proves the profile locally; uploaded by mistake, it serves nothing.
  return `${rehearsal ? '# REHEARSAL: not deployable. Unmet production inputs were waived locally.\nRequire all denied\n' : ''}# GS-R13-PRODUCTION-PROFILE-001: ${host} static files only; no PHP or Node application runtime.
Options -Indexes -MultiViews
DirectorySlash Off
DirectoryIndex index.html
ErrorDocument 404 /404.html
ErrorDocument 500 /500.html
RewriteEngine On
RewriteRule (^|/)\\.(?!well-known/) - [F,L]
RewriteRule \\.(?:php[0-9]?|phtml|phar|pl|cgi)(?:/|$) - [F,L,NC]
RewriteCond %{HTTP_HOST} ^www\\.${hostPattern}$ [NC]
RewriteRule ^ ${PRODUCTION_ORIGIN}%{REQUEST_URI} [R=308,L,NE]
RewriteCond %{HTTP_HOST} !^${hostPattern}$ [NC]
RewriteRule ^ - [F,L]
RewriteCond %{HTTPS} !=on
RewriteRule ^ ${PRODUCTION_ORIGIN}%{REQUEST_URI} [R=308,L,NE]
${legacyRules()}${routing}${headerPolicy(false, intakeOrigin ?? '', dataset)}${types}`;
}
