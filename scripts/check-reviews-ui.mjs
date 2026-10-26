#!/usr/bin/env node
/** GS-LEGAL-FINAL-001: reviews remain suppressed pending written permission and separate authority. */
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { artifactNoReviewProblems } from './review-public-rules.mjs';
import { APPROVED_STAGING_REVIEWS } from '../lib/reviews/staging-approved.ts';

const artifactDir = process.argv.find((a) => a.startsWith('--artifact-dir='))?.slice('--artifact-dir='.length);
const routes = ['/', '/design', '/digital', '/press', '/legal/privacy', '/legal/cookies', '/legal/terms',
  '/legal/client-terms', '/legal/business-client-terms', '/legal/consumer-client-terms', '/legal/accessibility'];
if (artifactDir) {
  const files = new Map();
  const collect = (dir, prefix = '') => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const key = prefix + entry.name, path = join(dir, entry.name);
      if (entry.isDirectory()) collect(path, key + '/');
      else if (/\.(html|txt|json|js|map)$/.test(key)) files.set(key, readFileSync(path));
    }
  };
  collect(artifactDir);
  collect('.next/static', '_next/static/');
  for (const route of routes) assert(files.has((route === '/' ? 'index' : route.slice(1)) + '.html'), `Missing HTML subject: ${route}`);
  assert.deepEqual(artifactNoReviewProblems(files), []);
  console.log(`check-reviews-ui: PASS — ${files.size} built HTML/payload/script/metadata files; all 11 route subjects present; no review text or presentation. HTTP delivery unverified.`);
} else {
  const { launch } = await import('./browser-launch.mjs');
  const browser = await launch();
  try {
    const page = await browser.newPage();
    const requested = [];
    page.on('request', (request) => { if (/freelancer\.com\/api\//.test(request.url())) requested.push(request.url()); });
    for (const route of routes) {
      const response = await page.goto((process.env.BASE_URL ?? 'http://localhost:3000') + route, { waitUntil: 'networkidle0' });
      assert(response?.ok(), `Route not served: ${route}`);
      assert.equal(await page.$$eval('[data-reviews-carousel], [data-review-key]', (nodes) => nodes.length), 0, route);
      const html = await page.content();
      assert(!APPROVED_STAGING_REVIEWS.some((review) => html.includes(review.reviewText.slice(0, 45))), route);
    }
    assert.deepEqual(requested, []);
    console.log('check-reviews-ui: PASS — 11 served routes contain no review content or presentation and fetch no Freelancer API.');
  } finally { await browser.close(); }
}
