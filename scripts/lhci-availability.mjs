/**
 * Whether Lighthouse CI can run in this environment, and why not when it cannot.
 *
 * One module rather than the same condition written in two places. `check-lhci.mjs` uses
 * it to decide whether to run, and `with-server.mjs` uses it to decide whether to print
 * the skip banner. If those two ever disagreed, the summary would report something other
 * than what happened — which is the same class of defect as a gate that measures nothing.
 */
export const isWindows = process.platform === 'win32';

/** GitHub Actions, and every other CI provider, sets CI=true. */
export const isCI = Boolean(process.env.CI);

export const UNAVAILABLE_ON_WINDOWS = {
  reason:
    "chrome-launcher's destroyTmp races Node 24's fs.rmSync on Windows: every audit " +
    'completes, then cleanup of the temp Chrome profile fails with EPERM and the process ' +
    'exits 1. Deterministic across three consecutive runs, with an unchanged lockfile — ' +
    'the runtime is the only variable.',
  where: 'Lighthouse runs on ubuntu-latest in CI, where this does not occur.',
  removeWhen:
    'A chrome-launcher release fixes the cleanup race. Remove this skip and re-verify ' +
    'locally — see 01-VALIDATION-REPORT.md §13 E12.',
};

/** True when the LHCI gates cannot run here and skipping is legitimate. */
export const lhciSkipped = isWindows && !isCI;
