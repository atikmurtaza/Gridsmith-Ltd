#!/usr/bin/env node
/** Served security-header regression check. Expects `next start` at BASE_URL. */
const BASE_URL = process.env.HEADER_BASE_URL ?? 'http://127.0.0.1:3000';
const ROUTES = [
  ['/', 200],
  ['/contact', 200],
  ['/_gridsmith-security-header-probe', 404],
];

const required = {
  'referrer-policy': 'strict-origin-when-cross-origin',
  'x-content-type-options': 'nosniff',
  'x-frame-options': 'DENY',
  'strict-transport-security': 'max-age=31536000',
};
const cspDirectives = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
];
const permissionDirectives = ['camera=()', 'geolocation=()', 'microphone=()', 'payment=()', 'usb=()'];
const problems = [];

for (const [path, expectedStatus] of ROUTES) {
  const response = await fetch(`${BASE_URL}${path}`, { redirect: 'manual' }).catch(() => null);
  if (!response) {
    problems.push(`${path}: request failed`);
    continue;
  }
  if (response.status !== expectedStatus) {
    problems.push(`${path}: HTTP ${response.status}, expected ${expectedStatus}`);
  }
  for (const [name, expected] of Object.entries(required)) {
    if (response.headers.get(name) !== expected) {
      problems.push(`${path}: ${name} was ${JSON.stringify(response.headers.get(name))}, expected ${JSON.stringify(expected)}`);
    }
  }
  const csp = response.headers.get('content-security-policy') ?? '';
  for (const directive of cspDirectives) {
    if (!csp.includes(directive)) problems.push(`${path}: CSP is missing ${directive}`);
  }
  const permissions = response.headers.get('permissions-policy') ?? '';
  for (const directive of permissionDirectives) {
    if (!permissions.includes(directive)) problems.push(`${path}: Permissions-Policy is missing ${directive}`);
  }
  if (response.headers.has('x-powered-by')) problems.push(`${path}: X-Powered-By is exposed`);
}

if (problems.length) {
  console.error(`\ncheck-security-headers: ${problems.length} problem(s)\n`);
  for (const problem of problems) console.error(`  ${problem}`);
  console.error('');
  process.exit(1);
}

console.log(`check-security-headers: ${ROUTES.length} served routes carry the required CSP, framing, referrer, MIME, permissions and HSTS policy; X-Powered-By is absent`);
