/**
 * Lighthouse CI — desktop. A-10b, axis one of two.
 *
 * **This is the craft claim.** Digital's 100/100/100 is what a prospect runs in their own
 * browser on their own laptop when they are deciding whether the people who built this
 * site can build theirs. It is measured on the conditions that claim describes, and it is
 * honest on them. Nothing here has been relaxed.
 *
 * The category score is the assertion because the category score is the claim. A prospect
 * reads "100", not a millisecond figure.
 *
 * The engineering question — does this hold on a mid-range phone on 4G — is a different
 * question with a different answer, and it is asked by lighthouserc.mobile.cjs. Trying to
 * make one gate answer both is what produced a desktop-only run standing in for a spec
 * that says "on 4G throttle".
 *
 * SEO and best-practices remain ratcheted below 1.0 with named owners:
 *
 *   seo 0.90            `meta-description` — descriptions come from
 *                       `seoBlock.metaDescription` in Sanity. Writing placeholder ones to
 *                       turn the gate green would be fabricated marketing copy
 *                       (CLAUDE.md non-negotiable #2). Ratchets to 1.0 at N-01, which is
 *                       when Digital's third 100 actually lands.
 *
 *   best-practices 0.96 `errors-in-console` — /favicon.ico 404s on every route. The fix is
 *                       a real brand mark, a founder decision and not one to invent
 *                       (master/PROJECT-RULES.md §11). See Q-M15.
 *
 * Both measure accurately at a lower bar, which is different from a gate that measures
 * nothing. Neither may be lowered further.
 */
const { ORIGIN_DESKTOP: ORIGIN, ROUTES, pattern } = require('./lighthouse/routes.cjs');

module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npm run start -- -p 3200',
      startServerReadyPattern: 'Ready in|started server',
      url: ROUTES.map((r) => ORIGIN + r.path),
      // Three runs and a median. A single cold run against assertions pinned to an exact
      // measured value fails the build on variance rather than on a regression.
      numberOfRuns: 3,
      settings: {
        preset: 'desktop',
        chromeFlags: '--no-sandbox --headless=new',
      },
    },
    assert: {
      assertMatrix: ROUTES.map((r) => ({
        matchingUrlPattern: pattern(ORIGIN, r.path),
        aggregationMethod: 'median',
        assertions: {
          'categories:performance': ['error', { minScore: r.perf }],
          'categories:accessibility': ['error', { minScore: 1 }],
          'categories:seo': ['error', { minScore: 0.9 }],
          'categories:best-practices': ['error', { minScore: 0.96 }],
        },
      })),
    },
    upload: { target: 'filesystem', outputDir: '.lighthouseci/desktop' },
  },
};
