import { readFileSync } from 'node:fs';
import type { NextConfig } from 'next';

type LegacyRedirect = { source: string; destination: string; permanent: boolean };

/**
 * Legacy redirect map — master/TECH-SPEC.md §5, tracker G-02.
 *
 * Currently empty and intentionally so: the programme is greenfield, there is no
 * existing site to crawl, and G-01/G-02 are BLOCKED pending a separate decision. The
 * file and the wiring exist now so the mechanism is testable before it is needed —
 * adding entries later is a data change, not a config change.
 */
const legacyRedirects: LegacyRedirect[] = JSON.parse(
  readFileSync(new URL('./redirects/legacy.json', import.meta.url), 'utf8'),
);

if (!Array.isArray(legacyRedirects)) {
  throw new Error('redirects/legacy.json must contain an array');
}

const nextConfig: NextConfig = {
  async redirects() {
    return legacyRedirects;
  },
};

export default nextConfig;
