import { REVIEW_STAGING_ORIGIN } from '../reviews/public-model.ts';

/** Hostinger HTTP cache policy; unrelated to prohibited review-data caching. */
export function hostingerRules(origin: string) {
  if (origin !== REVIEW_STAGING_ORIGIN) throw new Error('Exact isolated Hostinger staging origin required');
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
RewriteCond %{THE_REQUEST} \\s/+(.+?)/+[?\\s]
RewriteRule ^(.+)/$ /$1 [R=308,L,NE]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME}.html -f
RewriteRule ^(.+)$ $1.html [L]
<IfModule mod_headers.c>
Header always set X-Robots-Tag "noindex, nofollow, noarchive"
Header always set X-Content-Type-Options "nosniff"
Header always set X-Frame-Options "DENY"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
Header always set Permissions-Policy "camera=(), geolocation=(), microphone=(), payment=(), usb=(), browsing-topics=()"
Header always set Strict-Transport-Security "max-age=31536000"
Header always set Content-Security-Policy "default-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; object-src 'none'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://cdn.sanity.io; font-src 'self'; connect-src 'self' https://qfgpwumvvtizeamkynes.supabase.co; media-src 'self' https://cdn.sanity.io; worker-src 'self' blob:; manifest-src 'self'"
Header always set X-GridSmith-Sanity-Dataset "production"
Header always set Cache-Control "no-cache"
<FilesMatch "\\.(?:svg|png|jpe?g|webp|avif|glb|gltf|bin|woff2?)$">
Header always set Cache-Control "public, max-age=300, must-revalidate"
</FilesMatch>
<FilesMatch "(?:(?:[.-][a-f0-9]{8,}|^[a-f0-9]{8,})\\.(?:js|css)|^[a-f0-9]{8,}[^/]*\\.woff2)$">
Header always set Cache-Control "public, max-age=31536000, immutable"
</FilesMatch>
</IfModule>
<IfModule mod_mime.c>
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
}
