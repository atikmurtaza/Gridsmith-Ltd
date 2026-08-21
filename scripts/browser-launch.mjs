#!/usr/bin/env node
/**
 * The one place Chrome is launched from.
 *
 * `--no-sandbox` is required on GitHub's runners: the Chrome sandbox needs user
 * namespaces `ubuntu-latest` restricts under AppArmor, and without it Chrome aborts with
 * `FATAL … No usable sandbox!` and a raw stack trace rather than a readable error.
 * `--disable-dev-shm-usage` avoids the 64MB `/dev/shm` that makes it crash again later,
 * under load rather than at startup.
 *
 * **This is a module rather than a constant because the flags were already known and
 * still went missing.** They were added to `check-axe`'s main launch and to
 * `check-responsive` when the runner first rejected them, and the docstring that recorded
 * it said "the four browser launch sites" — counting the two Lighthouse configs and the
 * two gates. `check-axe` has three launches, not one: the two analytics-grant launches
 * were written later, as bare `puppeteer.launch()`, and inherited nothing.
 *
 * CI's first real run showed the shape exactly. The 28 route/viewport audits all passed
 * on the guarded launch, then the process aborted seconds later on an unguarded one in
 * the same file — so the failure looked like a late crash rather than a missing flag, and
 * the first 28 clean results were evidence for the wrong conclusion. `M-P2-33`.
 *
 * A fifth call site added tomorrow gets the flags by importing this. One added with a
 * bare `puppeteer.launch()` does not, which is why `check:control`'s sibling rule applies:
 * grep for `puppeteer.launch(` before assuming this file covers everything.
 */
import puppeteer from 'puppeteer';

export const CHROME_ARGS = ['--no-sandbox', '--disable-dev-shm-usage'];

export const launch = (options = {}) =>
  puppeteer.launch({ headless: true, ...options, args: [...CHROME_ARGS, ...(options.args ?? [])] });
