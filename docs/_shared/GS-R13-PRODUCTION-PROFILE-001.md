# GS-R13-PRODUCTION-PROFILE-001 — gridsmith.uk static build profile

20 October 2026. Owner authority, quoted: *"implement and locally verify a gridsmith.uk static build
profile (host lock, indexing, production header policy, PHP denial), failing closed until the
production intake URL and legal PUBLISHABLE states exist. No push, deployment or provider write."*

Branch `claude/gs-r12-production-readiness-001`, worktree
`C:\Users\atikm\.codex\worktrees\gs-r12-production-readiness-001\Gridsmith Ltd`, based on `bf14f817`.
Nothing was pushed, dispatched, deployed or written to a provider. The only provider contact was
the static build's existing unauthenticated, read-only query of the Production Sanity dataset.

**Result: implemented and locally verified. The profile refuses to build today, by design.** It
waits for two inputs: the Production intake URL (H4-B production phase) and PUBLISHABLE on all
seven legal documents.

## 1. How to use it

| Purpose | Command | Output |
|---|---|---|
| Staging (unchanged default) | `GRIDSMITH_STAGING_ORIGIN=<staging> NEXT_PUBLIC_LEAD_INTAKE_URL=<Preview> npm run build:static` | `out/`, noindex |
| gridsmith.uk release | `GRIDSMITH_STATIC_PROFILE=production NEXT_PUBLIC_LEAD_INTAKE_URL=<recorded Production intake> npm run build:static` | `out/`, indexable. **Refused today**, listing every unmet input |
| Local rehearsal (verification only) | `GRIDSMITH_STATIC_PROFILE=production GRIDSMITH_PRODUCTION_REHEARSAL=1 NEXT_PUBLIC_LEAD_INTAKE_URL=<Preview> npm run build:static` | `build/production-rehearsal/`, **not deployable** |

The release command takes no staging origin, no legal-preview flag and no other intake. It reads
the Production intake only from `PRODUCTION_INTAKE_URL` in `lib/build/production.ts`. That constant
is `null` and changes only in the H4-B production phase's own reviewed commit.

A rehearsal accepts only the Preview intake. It waives exactly the unmet inputs (`INTAKE`, `LEGAL`)
and the not-deployable marker (`REHEARSAL`), and prints them; every other gate finding still refuses.
It writes outside `out/`, its `__deployment.json` says `deployable: false`, and its `.htaccess`
begins `Require all denied`, so an accidental upload serves nothing.

## 2. What the profile changes

| Concern | Staging (unchanged) | gridsmith.uk profile |
|---|---|---|
| Selection | default | `GRIDSMITH_STATIC_PROFILE=production` only; any other value refuses |
| Origin / canonical | staging hostname | `https://gridsmith.uk` |
| Indexing | noindex everywhere, `Disallow: /`, empty sitemap | Sitemap routes `index, follow`; `/press/contact/thank-you` and `/press/path-finder` keep their own noindex (`NOINDEX_PATHS`); 404 noindex; `Allow: /` + `Sitemap:`; sitemap lists exactly the eligible routes (53 today) |
| Host lock | exact staging host, else 403 | `www.gridsmith.uk` → 308 to the apex, then exact `gridsmith.uk`, else 403; HTTPS 308 |
| Script denial | dotfiles | dotfiles, plus `*.php`, `*.php[0-9]`, `.phtml`, `.phar`, `.pl`, `.cgi` → 403 (the document root has held WordPress) |
| Legacy URLs | `/privacy-policy`, `/terms-and-conditions` → branded 404 | 308 to `/legal/privacy` and `/legal/client-terms`, generated from `redirects/legacy.json` (the map `next.config.ts` reads) |
| Header policy | one shared builder, inside `<IfModule mod_headers.c>`, plus `X-Robots-Tag noindex` | same builder, no `X-Robots-Tag`, outside `<IfModule>`, so a missing module fails loudly instead of dropping headers |
| CSP `connect-src` | Preview Supabase origin | the Production intake origin only; the Preview origin is refused |
| Reviews | owner-staging presentation | none: `GRIDSMITH_REVIEW_PRESENTATION` is removed, so `listPublicReviews()` returns [] (no written Freelancer permission, LEG-08) |
| Legal | excluded | all seven routes required; build refused unless every document is PUBLISHABLE and migration-eligible |

## 3. Files

| File | Change |
|---|---|
| `lib/build/production.ts` (new) | `PRODUCTION_ORIGIN`, `PREVIEW_INTAKE_URL`, `PRODUCTION_INTAKE_URL = null`, `productionInputProblems()` |
| `lib/build/hostinger.ts` | Shared `headerPolicy()`/routing; `productionHostingerRules()`. The staging output is **byte-identical** (sha256 `5f35938f…` production dataset, `0cbdf3c5…` development), asserted in the selftest |
| `lib/build/route-manifest.ts` | `indexable` option; `NOINDEX_PATHS` as the one list |
| `lib/build/static-routes.ts` | Accepts an indexable manifest only under the production profile, production dataset and gridsmith.uk origin |
| `lib/seo/site.ts` | `INDEXABLE` for a static build = the production profile at `https://gridsmith.uk`; otherwise unchanged |
| `scripts/build-static.mjs` | Profile selection, input refusal, rehearsal, production rules, review absence, profile fields in `__deployment.json` and the receipt (staging identity fields unchanged) |
| `scripts/check-static-artifact.mjs` | Production branches: `PROFILE`, `LEGAL`, `INDEX`, `ROBOTS`, `SITEMAP`, `HTACCESS`, `REHEARSAL` |
| `scripts/review-public-rules.mjs` | `artifactNoReviewProblems()` (rendered HTML and RSC only) |
| `scripts/check-static-ui.mjs` | Reads the served profile: indexable pages, 0 review cards, loopback only for production |
| `scripts/check-static.selftest.mjs` | GS-R13 section, 39 adverse proofs |

## 4. Verification (local Windows, Node v24.15.0, Chrome 148 Puppeteer)

| Check | Result |
|---|---|
| Typecheck, lint | PASS |
| `check:static:selftest` | PASS: 141 foundation proofs unchanged; **GS-R13 39 adverse proofs** (inputs ×8, rules ×6 throws plus PHP/host/www predicate sets, artifact ×21, reviews ×4); staging rules hash-pinned |
| Implementation mutations, each against the selftest, originals restored byte for byte | **10/10 red**: PHP rule dropped; noindex header in production; unescaped host lock; legal check weakened; Preview accepted as production intake; production noindex/nofollow accepted; deliberate noindex not enforced; sitemap unchecked; rehearsal identity accepted; rendered reviews unchecked. No-op control green |
| Real build refusals (7 paths) | intake unset → 1 INTAKE + 7 LEGAL lines; Preview intake → same; production + staging origin; rehearsal without profile; rehearsal with a non-Preview intake; unknown profile; production + legal preview. Each refused before any build; `out/` untouched |
| Rehearsal build (production dataset) | EXIT 0: 55 routes, 204 files, waived exactly INTAKE ×1, LEGAL ×8, REHEARSAL ×1. Artifact: sitemap routes `index, follow`, thank-you/path-finder/404 noindex, canonical `https://gridsmith.uk…`, `robots.txt` Allow + Sitemap, 53 sitemap URLs, 0 review markup, `.htaccess` starts `Require all denied` |
| `check:static:ui` on the rehearsal (loopback) | PASS: 14 pages with the expected robots meta each, 13 axe analyses 0 violations, 13 no-JS pages, reviews 0 (JS and no-JS) |
| Staging regression (same directory, rebuilt after the change) | `.htaccess` byte-identical; **every JS chunk byte-identical**; HTML/RSC differ only by build ID; one CSS chunk changed name with identical size |
| That CSS difference | A rebuild of the unchanged source (`bf14f817`, separate checkout) produced the same new CSS name and differed elsewhere by **rule order only** (sorted rule sets equal: the consent-bar and `@font-face` blocks swap). This is pre-existing Next chunk-order variance between builds, not this change. Cross-checkout JS names are path-dependent and were not compared. Normalised HTML/RSC across checkouts: 77/113 equal as line multisets; the rest differ only in RSC reference numbering (`$L1e` vs `$L21`) |
| `verify:static` (37 steps) | PASS |
| Hosted behaviour | **Not run.** No upload: `.htaccess` semantics on Hostinger (LiteSpeed/hCDN), the www/HTTPS order and the PHP denial are verified only as rule text and extracted predicates |

## 5. Not established

- Hostinger serving behaviour of the production rules (needs an authorised upload; RUNBOOK §5).
- Whether hCDN strips headers from PNGs on gridsmith.uk (SEC-F3, BEFORE-LAUNCH item 24).
- That the Production intake will accept `https://gridsmith.uk` (H4-B production phase).
- HSTS `includeSubDomains`/preload and COOP/CORP (SEC-F9, owner decision).
- CI evidence for this change: it is local only until a separately approved push.

## 6. What unblocks a real release build

1. H4-B production phase: deploy the intake to Production, allow `https://gridsmith.uk`, record the
   evidence, set `PRODUCTION_INTAKE_URL` in the same commit.
2. Legal: the owner sets each document PUBLISHABLE (register), `migrate-production-cms
   --write-manifest`, and the guarded production CMS write of the seven legal documents.
3. Then `GRIDSMITH_STATIC_PROFILE=production … npm run build:static`, in CI on the release SHA (a
   workflow input for this profile does not exist yet and needs its own reviewed change).
