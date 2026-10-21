# GS-R14-001 — Resend verified sender and temporary-domain-first release

21 October 2026. Branch `claude/gs-r12-production-readiness-001`, worktree
`C:\Users\atikm\.codex\worktrees\gs-r12-production-readiness-001\Gridsmith Ltd`.

**Result:**
- Locally prepared and verified. **Nothing deployed, pushed or written to a provider.**
- The Resend, hPanel and Supabase readings below were read-only.
- The deployment and the Production Edge changes wait for one owner approval (§7).

Owner position recorded for this phase:
- the new site goes to Hostinger's temporary domain first;
- the WordPress site at gridsmith.uk and every DNS record stay untouched;
- the owner alone decides when gridsmith.uk is connected.

## 1. Current state (read-only, 21 Oct)

| Item | Reading |
|---|---|
| Temporary hostname | **`mediumaquamarine-wallaby-594070.hostingersite.com`**. hPanel lists it as its own website, separate from the `gridsmith.uk` WordPress website. It is the only origin in `hostinger-staging.yml`, `lib/build/hostinger.ts` and the review guard |
| Its Git deployment | Repository `Gridsmith-Ltd`; branch `codex/gs-hostinger-artifact` into `public_html`. Last deployment: manual, 6 Oct 2026, completed. **Auto-deployment is off** |
| Served now | `__deployment.json`: source `6615d97c`, identity `28b841dd…`, origin = the temporary hostname. `X-Robots-Tag: noindex, nofollow, noarchive`; HSTS; CSP; `Server: hcdn`. This is the rollback target: artifact commit `bd8dd825` |
| gridsmith.uk | WordPress (PHP 8.3, `wp-json`) on Hostinger; apex A records and the `www` CNAME to Hostinger's CDN. Untouched |
| Production intake | `synthetic-only`; origins `["https://gridsmith.uk"]`; sender `onboarding@resend.dev` (digest-verified); both functions v1 ACTIVE; leads 0, outbox 0 |
| Drain | `GS_PRODUCTION_DRAIN_ENABLED` is absent, and the code refuses scheduled drains outside `live` |
| A-2 cookie evidence (same stack) | `Set-Cookie` count 0 on `/`, `/design`, `/digital`, `/press`, `/contact`, `/press/contact`, `/about` and the 404 path of the temporary site |
| Chrome pin (BRW-03) | The `.79` package still downloads (HTTP 200, 143,638,568 B); Google stable is now `156.0.8078.47`. Still time-sensitive |

## 2. Resend sender

- **Verified:** the Resend dashboard (team "gridsmith") lists `gridsmith.uk` **Verified**.
- **DNS records:**
  - DKIM: `resend._domainkey` TXT is published.
  - Return-Path: `send.gridsmith.uk` is a CNAME to `send.forge.rmta.net`, which resolves to an MX and an SPF record.
  - Unchanged: the apex SPF (Hostinger only) and DMARC `p=none`. Resend's Verified status is the authority for these records.
- **The key covers the domain:** the Production key `gridsmith-production` has Sending access on **All domains**. It is in the same team, was created by contact@gridsmith.uk, and has been used once, for the 21 Oct smoke test.
- **The change needed:** one Edge secret, `LEAD_NOTIFICATION_FROM` = `Gridsmith <contact@gridsmith.uk>`. No redeploy is needed for the sender: Supabase's docs say *"Your functions read a new secret immediately, so you don't need to redeploy."* The value is not secret, so Claude can set it without a PowerShell step.

## 3. Changes made (local commit `418aeac3`)

| File | Change |
|---|---|
| `lib/build/production.ts` | `PRODUCTION_INTAKE_URL` = `https://dqiutgmxillhsbzgnlsx.supabase.co/functions/v1/gs-lead-intake`, from the EXEC-001 evidence (`34e036aa`). The gridsmith.uk profile still refuses: its legal inputs are unmet |
| `lib/build/hostinger.ts` | Staging rules accept the Preview or the recorded Production intake origin for `connect-src`; anything else throws. The Preview output is byte-identical (both hash pins unchanged) |
| `scripts/build-static.mjs` | Staging may build against the Production intake **only** with the exact temporary origin. `__deployment.json` records `intakeOrigin` |
| `lib/leads/edge-deployment.ts` | Production accepts `["https://gridsmith.uk", "<temporary origin>"]` **only while `synthetic-only`**. `live` with the temporary origin, any other order, extra origins and HTTP are all refused |
| `.github/workflows/hostinger-staging.yml` | Builds with the Production intake; the publish step also requires `intakeOrigin` = Production |
| `scripts/browser-input.mjs` | The Option A pin for the workflow moved to `4e436c2a…` (the reviewed change) |
| Selftests | Edge profile 76 cases (+5); static: the Production-intake rules equal the Preview rules except `connect-src`, plus 4 refusals |

**Mutation proofs:**
- Edge: dropping the synthetic-only condition fails the selftest with "Production live with the temporary domain".
- Rules: disabling the intake-origin check fails it at the first unknown origin.
- Both files were restored byte-identical (sha256 compared).

**Process note:** a `git stash` was included by mistake in one command. It was found at once and popped back. The entry was identified by its message first, and the unrelated GitHub Desktop stash is untouched. All 8 changed files were restored before anything ran on them.

## 4. Release candidate (local, Windows, Node 24.15.0)

| Check | Result |
|---|---|
| `verify:static` | **EXIT=0** (logged line read directly) |
| `build:static` (clean `.next`; production dataset; Production intake; temporary origin) | EXIT=0: 55 routes, 204 files, 29,600,799 B. Source `418aeac3`, `sourceModified: false`; identity `8ef4c3a0…` |
| `check:static:artifact` | PASS (static contract, 55 routes, 204 files) |
| `.htaccess` / bundle | `connect-src 'self' https://dqiutgmxillhsbzgnlsx.supabase.co`; 0 Preview references in HTML/JS; the intake URL is in the client chunk. `noindex` header, exact host lock, HTTPS 308 |
| `check:static:ui` (loopback file server) | PASS: 14 pages; scenes, reviews, Path Finder, navigation, reduced motion, skip link, 404. Focused axe: 13 analyses, **0 violations**. No-JS: 13 pages |
| User-facing source since the last green CI (`17080169`, run 39378746236) | **No change** under `app`, `components`, `styles`, `public` or `sanity`. The desktop/mobile Lighthouse, responsive, axe and scene gates that passed there cover the rendered site. Lighthouse cannot run on Windows |

CI evidence for `418aeac3` itself needs a push (§7). The CI artifact, not this local one, is the
one that deploys.

## 5. What the temporary site will and will not be

- **The same as gridsmith.uk will be:** production CMS content; the Production intake; the security headers and CSP; extensionless routing; the branded 404.
- **Deliberately different on the temporary domain:**
  - noindex everywhere, with an empty sitemap and `Disallow: /`;
  - canonicals on the temporary origin;
  - the host lock covers only the temporary hostname, so nothing redirects to gridsmith.uk;
  - the owner-staging review presentation (H4-D-R1) is shown. gridsmith.uk will show none until written Freelancer permission (LEG-08).
- **Legal routes are not served** (they are excluded, as on the current staging site). Footer `/legal/*` links return the branded 404 until owner decision D-1.
- **Enquiries:**
  - Real visitors get the form's "request rejected" message (409, nothing stored).
  - Only the marked synthetic identity is admitted.
  - `live` mode and the drain are untouched.

## 6. Blockers and owner decisions

| # | Decision | Recommendation |
|---|---|---|
| D-1 | Legal on the temporary domain | **Keep them excluded for this deployment.** Each document's PUBLISHABLE state needs CUTOVER-AUTHORITY, and serving adopted-but-unpublished terms on a public URL is a publication decision. The alternative is the R12 adopted-development legal-preview profile, which uses development content throughout |
| D-2 | The seven PUBLISHABLE decisions, LEG-10 effective dates, POL-01 phone policy | Decide in `LEGAL-PUBLICATION-APPROVAL.md` before cutover |
| D-3 | Cookie sequencing | **Option 1:** accept today's same-stack A-2 evidence (§1), then repeat `curl -sI` on gridsmith.uk immediately after the switch |
| D-4 | `live` intake and the drain (`GS_PRODUCTION_DRAIN_ENABLED`) | After the sender test passes, at cutover; optional heartbeat first |
| D-5 | Security residuals (extract-zip ×2, braces, sprintf-js), BRW-03 durable Chrome source, Q5-01 protocol | As in RELEASE-DECISION-PACK; BRW-03 is the most time-sensitive |
| D-6 | `main` CI content parity (run 39433946390) | Unchanged: green only when the release branch merges at cutover |
| D-7 | Freelancer permission (LEG-08), GS-X002 (Technical) | Unchanged; neither blocks the temporary deployment |

## 7. The approval this phase asks for

One approval, covering only the steps below. Each step has a stop gate.
- **Production Edge (project `dqiutgmxillhsbzgnlsx`):**
  1. Redeploy both functions from `418aeac3` or its docs-only descendant.
  2. Set `GRIDSMITH_ALLOWED_ORIGINS` to gridsmith.uk plus the temporary origin.
  3. Set `LEAD_NOTIFICATION_FROM` to `Gridsmith <contact@gridsmith.uk>`.
  - Mode stays `synthetic-only`.
- **Release CI:**
  4. Push the branch at the named SHA.
  5. Dispatch CI on it. The `hostinger-staging` job publishes one artifact commit to `codex/gs-hostinger-artifact`; auto-deploy is off, so this alone deploys nothing.
- **Temporary-domain deployment:**
  6. In hPanel, for the temporary website only: Redeploy; then turn auto-deployment off and confirm it after a reload; flush that site's cache.
- **Hosted acceptance:**
  7. `__deployment.json` identity equals the CI artifact; routes, assets, headers, noindex, no redirect to gridsmith.uk; `check:static:ui` against the hosted origin; the `h4d-r2` acceptance wrapper.
  8. **One** marked synthetic enquiry through the hosted Contact form. The owner confirms that the email from `contact@gridsmith.uk` arrived; then that lead is deleted by id with the synthetic predicates.

**Rollback:**
- Site: restore artifact `bd8dd825`'s files in a new artifact commit, Redeploy, flush, and verify identity `28b841dd`.
- Edge: set the origins back to `["https://gridsmith.uk"]` and the sender back to `onboarding@resend.dev`. Both are accepted by the new code.
- Functions: redeploy `e3e14701`.

**Not covered:** gridsmith.uk, DNS, WordPress, `main`, legal publication, `live` mode, the drain, any Sanity or database schema change.

## 8. Connecting gridsmith.uk later (for the cutover phase; not authorised)

1. All D-2 decisions are made, and the seven documents are PUBLISHABLE with the legal CMS write done. The `GRIDSMITH_STATIC_PROFILE=production` build passes, with Production intake and legal inputs met.
2. Back up the WordPress site (files and database) and record the current DNS records; this is the rollback.
3. Choose the attachment method in hPanel. Either point the gridsmith.uk website's Git deployment at the production artifact, or connect gridsmith.uk to the temporary website as its domain. Both replace what WordPress serves; DNS can stay at Hostinger.
4. Switch Edge origins to `["https://gridsmith.uk"]` only, then `live` and the drain (separate approval).
5. Immediately: A-2 `curl -sI` on gridsmith.uk, BEFORE-LAUNCH item 24 header and image checks, and hosted acceptance on the real origin.
6. Rollback: restore WordPress and its document root, and set the Edge back to `synthetic-only`.
