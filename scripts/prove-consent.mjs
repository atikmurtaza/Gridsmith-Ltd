#!/usr/bin/env node
/**
 * prove:consent — `GS-LAUNCH-026`. Runs `check:consent` once per committed probe against the same
 * served site and requires each run to FAIL with the message of the branch the probe targets, then
 * one clean run to pass. A probe that does not turn its branch red is reported as the finding:
 * either the branch is broken or the probe stopped being a subject. Needs `BASE_URL`/`AXE_BASE_URL`
 * from `with-server.mjs`; the consent probes need a build that offers both providers.
 */
import { spawnSync } from 'node:child_process';

const EXPECTED = {
  preconsent: /analytics requested before a choice/,
  preticked: /an optional provider is pre-ticked/,
  'sticky-ga': /collection request\(s\) after withdrawing|GA4 collected after being withdrawn/,
  'keep-cookies': /analytics cookies remain after withdrawing|GA4 cookies remain after withdrawal/,
  'sticky-posthog': /withdraw: \d+ collection request\(s\) after withdrawing/,
  'no-broadcast': /collection continued in another open tab/,
  'long-cookies': /analytics cookies outlive the decision/,
};
const run = (args) => spawnSync(process.execPath, ['scripts/check-consent.mjs', ...args], { encoding: 'utf8', env: process.env });
const failures = [];
for (const [probe, message] of Object.entries(EXPECTED)) {
  const result = run([`--probe=${probe}`]);
  const output = `${result.stdout}\n${result.stderr}`;
  const fired = result.status === 1 && message.test(output);
  console.log(`prove:consent ${probe}: exit ${result.status}, ${fired ? 'fired' : 'DID NOT FIRE'} (${message})`);
  if (!fired) failures.push(probe);
}
const clean = run([]);
console.log(`prove:consent clean control: exit ${clean.status}`);
if (clean.status !== 0) failures.push('clean control');
if (failures.length) {
  console.error(`prove:consent: ${failures.length} branch(es) not proven: ${failures.join(', ')}`);
  process.exit(1);
}
console.log(`prove:consent: ${Object.keys(EXPECTED).length} probes each turned their own branch red; the clean control passed`);
