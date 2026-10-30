#!/usr/bin/env node
/**
 * with-consent-build — `GS-LAUNCH-026`. Builds the site offering both optional analytics providers
 * under TEST identifiers, then runs the given commands against it through `with-server.mjs`.
 *
 * Every other served gate measures a build that offers no analytics, which is the notice. This is
 * the only build in which the consent request, its choices and the providers' loading exist, and it
 * is never deployed: the identifiers are syntactically valid and belong to nobody, and
 * `check:consent` answers every Google and PostHog request inside the browser, so nothing reaches
 * either provider. The same identifiers must be present when the server starts, because
 * `next.config.ts` derives the CSP's analytics hosts from them.
 *
 *   node scripts/with-consent-build.mjs "npm run check:consent" "npm run prove:consent"
 */
import { spawnSync } from 'node:child_process';

const commands = process.argv.slice(2);
if (!commands.length) {
  console.error('with-consent-build: nothing to run. Pass one or more commands.');
  process.exit(1);
}
const env = {
  ...process.env,
  NEXT_PUBLIC_GA4_MEASUREMENT_ID: 'G-GS026TEST0',
  NEXT_PUBLIC_POSTHOG_KEY: 'phc_GS026TestIdentifierNotARealProjectKey00',
};
delete env.NEXT_PUBLIC_POSTHOG_HOST;
// Only `npm` needs a shell (it is `npm.cmd` on Windows). The commands go to with-server as an argument
// array, never through a shell, so each quoted command arrives whole.
const step = (file, args, shell) => {
  const result = spawnSync(file, args, { stdio: 'inherit', env, shell });
  if (result.status !== 0) process.exit(result.status ?? 1);
};
step('npm', ['run', 'build'], process.platform === 'win32');
step(process.execPath, ['scripts/with-server.mjs', ...commands], false);
