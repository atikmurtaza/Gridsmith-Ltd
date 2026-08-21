#!/usr/bin/env node
/**
 * check-lhci
 *
 * Runs one Lighthouse CI axis, or declares itself explicitly unavailable.
 *
 * On Windows the gate cannot execute at all — see `lhci-availability.mjs` for the cause.
 * It is made **explicitly unavailable** rather than left to fail, because a check that is
 * known to go red for a reason unrelated to the code trains everyone to wave red results
 * through, and the next failure that matters gets waved through with it. A loud SKIPPED
 * that names its own removal condition is safer than a familiar failure.
 *
 * The skip is guarded in both directions. It may never apply on CI, and it may never apply
 * off Windows — reaching it under either condition is a hard failure, because that would
 * mean the gate had quietly stopped running where it counts. A skip that can spread is not
 * a skip, it is a hole.
 *
 * Usage: node scripts/check-lhci.mjs <desktop|mobile>
 */
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { isCI, isWindows, lhciSkipped, UNAVAILABLE_ON_WINDOWS } from './lhci-availability.mjs';

const axis = process.argv[2];
if (axis !== 'desktop' && axis !== 'mobile') {
  console.error('check-lhci: name the axis — desktop or mobile.');
  process.exit(1);
}

if (lhciSkipped) {
  // Belt and braces. `lhciSkipped` already encodes both conditions; assert them again at
  // the point of use so a future edit to that expression cannot silently widen the skip.
  if (isCI || !isWindows) {
    console.error(
      `\ncheck-lhci (${axis}): reached the skip path with CI=${isCI} platform=${process.platform}.` +
        '\nThis skip exists only for local Windows. On CI, or on any other platform, it is a' +
        '\nbug — the gate must run. Failing rather than skipping.\n',
    );
    process.exit(1);
  }

  console.log(
    `\n  ⚠  SKIPPED — Lighthouse ${axis} does not run on Windows.\n` +
      `     ${UNAVAILABLE_ON_WINDOWS.reason}\n` +
      `     ${UNAVAILABLE_ON_WINDOWS.where}\n` +
      `     ${UNAVAILABLE_ON_WINDOWS.removeWhen}\n`,
  );
  process.exit(0);
}

// Resolved from node_modules rather than PATH: `npm run` adds .bin to PATH but a direct
// `node scripts/check-lhci.mjs` does not, and the gate should behave the same either way.
const bin = join('node_modules', '.bin', isWindows ? 'lhci.cmd' : 'lhci');

const result = spawnSync(bin, ['autorun', `--config=lighthouserc.${axis}.cjs`], {
  shell: true,
  stdio: 'inherit',
});
process.exit(result.status ?? 1);
