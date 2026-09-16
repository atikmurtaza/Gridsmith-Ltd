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
 * best-practices remains ratcheted below 1.0 with a named owner:
 *
 *   best-practices 0.96 `errors-in-console` — /favicon.ico 404s on every route. The fix is
 *                       a real brand mark, a founder decision and not one to invent
 *                       (master/PROJECT-RULES.md §11). See Q-M15, `GS-O007`.
 *
 * It measures accurately at a lower bar, which is different from a gate that measures
 * nothing. It may not be lowered further.
 *
 * ## The SEO category is no longer a single number, and that is `GS-R001`
 *
 * **It was `categories:seo >= 0.9`, and it went red at 0.66 the moment the site stopped
 * being indexable.** `G-04` made indexing a deliberate act: `app/robots.ts` serves
 * `Disallow: /` and every page carries `noindex, nofollow` unless this is a Vercel
 * production deployment with an explicit `NEXT_PUBLIC_SITE_URL`. Lighthouse's
 * `is-crawlable` audit is then **correctly** 0 — the page really is blocked from indexing —
 * and it carries ~4.04 of the category's weight, which is the whole of the 1.00 -> 0.66 drop.
 *
 * **Lowering the floor to 0.66 was the wrong fix and is what this block exists to refuse.**
 * A 0.66 floor would also accept a missing title, a missing description, a broken canonical
 * and unreadable link text, which are the things the assertion is for. Removing the
 * `noindex` was equally wrong: that is the safety property, not a score problem.
 *
 * So the category assertion applies **only when the build is actually indexable**, and
 * otherwise every SEO audit that still means something is asserted individually at 1, with
 * `is-crawlable` — and only `is-crawlable` — turned off. **That is stricter than what it
 * replaced**, not weaker: the old 0.9 floor tolerated exactly one failing audit, and the
 * ratchet note it carried named `meta-description` as the one it was tolerating. All four
 * route groups now declare a description, and it is asserted at 1 below.
 *
 * Measured on CI run `35144458922`, 12 runs across 4 routes: every audit below scored **1**
 * on every run and `is-crawlable` scored **0** on every run. The exclusion is one audit
 * wide, and it closes itself — set `NEXT_PUBLIC_SITE_URL` on a production deployment and
 * the category assertion returns with no edit here.
 *
 * **The condition is read from this process's own environment, which is legitimate here and
 * would not be elsewhere.** `CLAUDE.md` warns that a gate inferring the state of a system it
 * does not run in is asserting against something it cannot see — `check-axe` did exactly
 * that about Resend. This config **starts the server itself** through `startServerCommand`,
 * so the build being measured inherits this environment by construction. There is no second
 * machine to be wrong about.
 */
const { ORIGIN_DESKTOP: ORIGIN, ROUTES, pattern } = require('./lighthouse/routes.cjs');

/**
 * The same two conditions `lib/seo/site.ts` uses, and deliberately a copy rather than an
 * import: this file is CommonJS run by the `lhci` binary, which does not type-strip TypeScript.
 * If they ever disagree the symptom is loud — the category assertion fires on a page whose
 * `is-crawlable` is 0, or the audit list runs against an indexable page and passes trivially.
 */
const INDEXABLE =
  process.env.VERCEL_ENV === 'production' && Boolean((process.env.NEXT_PUBLIC_SITE_URL || '').trim());

/**
 * Every SEO audit that still means something on a page nobody is allowed to index, each at 1.
 * `is-crawlable` is off because the page is `noindex` on purpose; nothing else is excused.
 */
const SEO_ASSERTIONS = INDEXABLE
  ? { 'categories:seo': ['error', { minScore: 0.9 }] }
  : {
      'document-title': ['error', { minScore: 1 }],
      'meta-description': ['error', { minScore: 1 }],
      canonical: ['error', { minScore: 1 }],
      'crawlable-anchors': ['error', { minScore: 1 }],
      'robots-txt': ['error', { minScore: 1 }],
      'link-text': ['error', { minScore: 1 }],
      hreflang: ['error', { minScore: 1 }],
      'is-crawlable': 'off',
    };

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
          // Neither axis asserted that the page it measured actually loaded. A route that
          // 404s is still collected, and a themeless Next 404 page scores 1.0 on
          // accessibility and clears every LCP, CLS and TBT ceiling — so a renamed route
          // would have turned this gate green by measuring nothing. check-axe and
          // check-responsive do guard status, but they run in a later CI step.
          'http-status-code': ['error', { minScore: 1 }],

          'categories:performance': ['error', { minScore: r.perf }],
          'categories:accessibility': ['error', { minScore: 1 }],
          'categories:best-practices': ['error', { minScore: 0.96 }],
          ...SEO_ASSERTIONS,
        },
      })),
    },
    upload: { target: 'filesystem', outputDir: '.lighthouseci/desktop' },
  },
};
