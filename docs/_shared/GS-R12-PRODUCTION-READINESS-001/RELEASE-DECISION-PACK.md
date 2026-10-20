# GS-R12-FINAL-RELEASE-PREPARATION-001 — release decision pack

20 October 2026. Branch `claude/gs-r12-production-readiness-001`, worktree
`C:\Users\atikm\.codex\worktrees\gs-r12-production-readiness-001\Gridsmith Ltd`.

Nothing in this phase was pushed, dispatched, deployed or written to a provider. Provider checks
were unauthenticated public reads or read-only API GETs. Ledger: [LEDGER.md](LEDGER.md) §9. Earlier
reports: [SECURITY.md](SECURITY.md), [BROWSER-CI.md](BROWSER-CI.md),
[APP-HOSTING-SECURITY.md](APP-HOSTING-SECURITY.md), [RUNBOOK.md](RUNBOOK.md).

**Final status: BLOCKED — REQUIRED OWNER OR EXTERNAL ACTION.** No technical defect is open in the
candidate. A gridsmith.uk release artifact cannot be built yet, because its inputs are owner
decisions or provider work that has not been authorised (§E).

Evidence labels: *CI* = GitHub Actions on the exact SHA · *local* = this Windows host ·
*public read* = unauthenticated request any visitor could make · *API read* = authenticated GET.

## A. Technical status

| Area | Status | Evidence |
|---|---|---|
| Exact-SHA Linux CI | **PASS** (CI) | [Run 39378746236](https://github.com/atikmurtaza/Gridsmith-Ltd/actions/runs/39378746236) on `17080169`: all 57 `verify` steps; `hostinger-staging` skipped |
| Browser provisioning (Option A) | **PASS** (CI) | Authenticated Chrome 155.0.8059.79, provision about 25 s; every consumer on 155 |
| Master Q5 | **PASS** (CI) | All 14 questions; protected verifier `98210eaf…` unchanged. One green run; watch the next ones |
| Lighthouse | **PASS** (CI) | Desktop perf/a11y/best-practices 1.0 on 11 routes; mobile LCP 902–1075 ms, TBT 69–93 ms |
| Accessibility | **PASS** (CI) | 76 axe analyses, 0 violations. No screen-reader or device testing has ever been done (ACC-08) |
| Bundle budgets | **PASS** (CI) | 69 routes; shared baseline 2.8 of 2.9KB (owner decision BLD-01) |
| Dependency security | **PASS** for production (local, today) | `npm audit --omit=dev`: 0. Full audit: 21 entries / 4 advisory IDs with no fixed release (§B) |
| Production CMS | **PASS** (public read, today) | 47 published documents (companyDetails 1, groupPage 2, services Design 13 / Digital 17 / Press 14). **47/47 deep-equal** to the repository payload; 0 foreign, 0 missing, 0 `[SEED]`/`[TK]`/placeholder strings, 0 `isSeed`, 0 price/ISBN/client/testimonial keys, 0 dangling references; legal 0, Technical 0. id/rev fingerprint `d0dc7ef2…`. Each branch of the audit was made to fire on an injected probe |
| Production-dataset static artifact | **PASS** (local) | Built from `f9d443aa` (app tree identical to CI-green `17080169`; the delta is 5 docs files): 55 routes, 204 files, identity `7e0b5ffd…`, artifact gate 0 problems, `sourceModified: false`. Staging origin, noindex, Preview intake (§E) |
| Static UI on that artifact | **PASS** (local) | `check:static:ui` against a plain local file server: 14 pages, 13 focused axe analyses with 0 violation rules, 13 no-JS pages, 404, skip link, reduced motion. The gate itself states that full AA acceptance is not established |
| Lead intake | **PASS on Preview only** (historical) | H4-B on the isolated Preview project; no production intake exists (LEG-02) |
| Security headers (delivered) | **PASS for staging** (public read, today) | Staging serves CSP, HSTS, X-Frame-Options DENY, X-Robots-Tag noindex. No production policy exists yet (SEC-F1) |
| Staging | **Unchanged since 6 Oct** (public read) | Serves `6615d97c` / identity `28b841dd…` / 200 files. The candidate is **not** on staging |
| Production | **WordPress, untouched** (public read) | `gridsmith.uk` 200, served via Hostinger CDN; `www` and `http` 301 to `https://gridsmith.uk/`; Let's Encrypt certificate for apex + www, valid until 16 Dec 2026 |
| Backup and rollback | **BLOCKED** | No restore-proven WordPress/DNS backup (§F) |

## B. Remaining security decisions (no fixed release exists for any of them)

All four are in **dev-only** dependencies. "Dev-only" is not treated as harmless: these run in CI
and on developer machines. None is in the static artifact (production dependency audit: 0).

| ID | Advisory | Package / path | Reachable today? | Mitigation in place | Fix? | Recommendation |
|---|---|---|---|---|---|---|
| SEC-ZIP-01a | GHSA-jmr9-qjv8-65gv (high) | extract-zip 2.0.1 ← @puppeteer/browsers 2.13.2 ← puppeteer 24.43.1 | **CI: no.** `PUPPETEER_SKIP_DOWNLOAD=true`, and CI 39378746236 used the Option A Chrome, so no ZIP was extracted. **Local:** only when `npm ci` runs without that variable and the Chrome-for-Testing revision is not cached; the input is Google's archive over HTTPS | Option A in CI; HTTPS source | None in 2.x. Puppeteer 25 / @puppeteer/browsers 3.x drop extract-zip, but `@lhci/cli` 0.15.1 (latest) pins lighthouse 12.6.1, which needs puppeteer-core ^24, so a second copy would remain | **Accept, scoped:** "CI keeps `PUPPETEER_SKIP_DOWNLOAD=true` and Option A; developers set it locally". Review 20 Jan 2027, or when @lhci/cli moves to lighthouse 13 |
| SEC-ZIP-01b | GHSA-7pqw-9j4j-h8q3 (high) | same | same | same | same | Same decision as 01a (one package, two mechanisms) |
| SEC-BRACES-05 | GHSA-vfj7-8cjw-p6xm (high) | braces 3.0.3 ← micromatch ← fast-glob ← @next/eslint-plugin-next; and ← chokidar ← @sanity/codegen | **No caller found** with untrusted patterns: ESLint globs and Sanity codegen read owner-authored config only; no typegen/watch command | Patterns are repository-authored | None (3.0.3 is latest and affected). Audit's "fix" is a downgrade to eslint-config-next 14, which is incompatible with pinned Next 15 | **Accept, scoped:** "glob patterns stay repository-authored". Review 20 Jan 2027 or on an upstream fix |
| SEC-SPRINTF-06 | GHSA-hp3w-g68c-fv3c (moderate) | sprintf-js 1.0.3 ← argparse 1.0.10 ← js-yaml 3 ← @lhci/utils; and ← @vercel/frameworks ← @sanity/cli | **No caller found:** js-yaml is used as a library; no argparse CLI or custom format template is reachable | — | None (1.1.3 latest, affected) | **Accept, scoped:** "no YAML CLI, no custom argparse templates". Review 20 Jan 2027 |

**Draft owner decision (not taken; copy only if you agree):**

> I accept, until 20 January 2027 or an upstream fix (whichever is first), the four dev-only
> advisories GHSA-jmr9-qjv8-65gv, GHSA-7pqw-9j4j-h8q3, GHSA-vfj7-8cjw-p6xm and GHSA-hp3w-g68c-fv3c,
> on the conditions in RELEASE-DECISION-PACK §B. Production dependencies must stay at 0 advisories.

## C. Legal approvals (per document; approve or withhold each separately)

All seven are OWNER_ADOPTED and **none is PUBLISHABLE**. `check:legal:adoption` passes today:
fingerprints, versions and authority match and there are no markers. Every document names Gridsmith
Ltd, company number 17050842, registered office 30 Briarfield Road, Farnworth, Bolton, BL4 0HD, and
contact@gridsmith.uk, and these match `companyDetails` in production. This is a technical
consistency check, not legal advice or a compliance certificate.

| Document | Route | Version / effective date | Unmet publication prerequisites | Owner action |
|---|---|---|---|---|
| Privacy Policy | `/legal/privacy` | 2.3 / 8 Oct 2026 | CUTOVER-AUTHORITY, H4-B-INTAKE-PROMOTED (HOSTINGER-PROCESSOR-CHAIN met) | Publish / withhold, after production intake exists |
| Cookie Policy | `/legal/cookies` | 2.1 / 7 Oct | CUTOVER-AUTHORITY, PRIVACY-PUBLISHABLE, A-2-PRODUCTION-COOKIE-RETEST | Publish / withhold; the retest is run on gridsmith.uk at cutover |
| Website Terms of Use | `/legal/terms` | 2.1 / 7 Oct | CUTOVER-AUTHORITY, PRIVACY-PUBLISHABLE | Publish / withhold |
| Client terms (disambiguation, no operative clause) | `/legal/client-terms` | 2.1 / 7 Oct | CUTOVER-AUTHORITY, PRIVACY-PUBLISHABLE | Publish / withhold |
| Client Terms for Business Clients | `/legal/business-client-terms` | 3.1 / 7 Oct | CUTOVER-AUTHORITY, PRIVACY-PUBLISHABLE | Publish / withhold |
| Client Terms for Consumers | `/legal/consumer-client-terms` | 3.1 / 7 Oct | CUTOVER-AUTHORITY, PRIVACY-PUBLISHABLE | Publish / withhold |
| Accessibility Statement | `/legal/accessibility` | 2.1 / 7 Oct | CUTOVER-AUTHORITY, PRIVACY-PUBLISHABLE | Publish / withhold |

Observed facts to decide alongside:

- **Footer and form links.** Every page of the production-dataset artifact links `/legal/privacy`,
  `/terms`, `/cookies` and `/accessibility`, and the contact pages also link `/client-terms`. The
  artifact ships no `/legal/*` route, so those links reach the branded 404 (LEG-06). A gridsmith.uk
  release must ship the routes, or the owner must accept the 404s in writing.
- **Effective dates** (7/8 Oct) will predate publication (LEG-10): keep them or re-date at
  publication.
- **Interim transparency:** production WordPress serves its own privacy page today. The adopted
  notice describes an intake that is not live in production (LEG-11).
- **POL-01:** the brief says "no public phone number", but the site publishes `+44 7405 448534`
  under owner decision GS-O004. Confirm which policy stands.
- **Out of scope for publication until decided:** Path Finder ships noindex with `[SEED]` rules
  (LEG-07); Freelancer reviews need written permission (LEG-08); the 3 Technical services need
  GS-X002 (LEG-09).

## D. Provider permissions requested (each separate; none requested to run now)

| # | Action | Provider | Why | Read or write |
|---|---|---|---|---|
| D1 | Confirm in hPanel: staging Git auto-deploy OFF (after a reload); gridsmith.uk Git still not connected; record the production document root; list the available backups | Hostinger (owner) | DEP-PUSH-SAFETY, §F. hPanel needs a sign-in, which Claude may not do | Read |
| D2 | Download a full WordPress backup (files + database) and restore it privately to prove it | Hostinger (owner) | DEP-PROD-ROLLBACK | Read, then a private restore |
| D3 | Export the DNS zone from hPanel | Hostinger (owner) | DNS rollback baseline. Public baseline recorded in §F | Read |
| D4 | Export the Production Sanity dataset (needs a read token) | Sanity (owner) | CMS rollback. The repository payload already reproduces all 47 documents | Read |
| D5 | `pg_dump` of Production Supabase `dqiutgmxillhsbzgnlsx` before the H4-B migration | Supabase (owner) | The connector here sees only an unrelated organisation | Read |
| D6 | Re-pin Chrome to the current stable build (BRW-03), then one push for exact-SHA CI | GitHub | §E.2 | Push |
| D7 | Staging release of the candidate: `workflow_dispatch` + hPanel Redeploy + auto-deploy OFF | GitHub + Hostinger | RUNBOOK §4 | Write (staging) |
| D8 | H4-B production: migration, Edge functions and secrets on Production Supabase | Supabase | LEG-02 | Write (production) |
| D9 | Cutover: upload the production artifact to a sibling directory and switch the document root | Hostinger | RUNBOOK §5 | Write (production) |
| D10 | Retire or keep the residual Vercel project (no deployment since 3 Oct, no production target, SSO protection on) | Vercel | DEP-VERCEL-RESIDUAL | Write |

## E. Production build

### E.1 What exists and what differs from production

> **Update (GS-R13-PRODUCTION-PROFILE-001, 20 Oct):** the gridsmith.uk profile now exists and
> refuses to build until inputs 2 and 3 below exist. Its rehearsal is verified locally. See
> [the record](../GS-R13-PRODUCTION-PROFILE-001.md). The right-hand column below is now implemented,
> except the intake, which the build refuses to guess.

| Property | Staging profile (exists, built today) | gridsmith.uk profile (GS-R13: implemented, fails closed) |
|---|---|---|
| Command | `GRIDSMITH_STAGING_ORIGIN=https://mediumaquamarine-wallaby-594070.hostingersite.com NEXT_PUBLIC_LEAD_INTAKE_URL=https://qfgpwumvvtizeamkynes.supabase.co/functions/v1/gs-lead-intake npm run build:static` | `GRIDSMITH_STATIC_PROFILE=production NEXT_PUBLIC_LEAD_INTAKE_URL=<recorded Production intake> npm run build:static`: refused today |
| CMS | Production dataset, public read, published perspective; a revision change during the build fails it | Same |
| Origin / host lock | Staging hostname; `.htaccess` returns 403 for any other `Host` | `gridsmith.uk` (decide how `www` redirects) |
| Indexing | noindex meta and header, `Disallow: /`, empty sitemap (asserted by the artifact gate) | Indexable, real sitemap, no `X-Robots-Tag` |
| Intake | Preview Edge function (synthetic-only admission) | Production Edge function URL — **not deployed** (D8) |
| CSP `connect-src` | Preview Supabase origin | Production Supabase origin |
| Legal routes | Excluded (0 PUBLISHABLE) | The 7 routes once PUBLISHABLE (§C) |
| Reviews | Owner-staging presentation | Fail closed without written Freelancer permission (LEG-08) |
| Secrets | None; private variables are stripped from the build environment | None needed (every public value is `NEXT_PUBLIC_*`) |

**Artifact manifest (local reference, not a release):** `build/static-receipt.json` (ignored
directory): source `f9d443aa`, Node v24.15.0 on Windows, production dataset, 55 routes, 204 files,
29,600,827 bytes, identity `7e0b5ffd63b4566ccabbc234c38b523d6cb524d337357fcf07a939f4a40ee72a`. A
release artifact must come from the CI publish job on the release SHA, which binds `sourceSha` to
`github.sha`. This one proves the profile builds against today's production content.

**Inputs a gridsmith.uk build needs, with their owners:**

1. ~~Owner authority to implement the production profile~~: done in GS-R13-PRODUCTION-PROFILE-001
   (local, not pushed).
2. Production intake URL and allowed origin (D8; H4-B authority).
3. The PUBLISHABLE state for each legal document (§C).
4. Decisions on Path Finder, Freelancer reviews and Technical services (LEG-07/08/09).
5. Production document root and upload channel (D1, D9).

Nothing is fabricated to fill these. The build refuses to run without them, by design.

### E.2 Durable Chrome input (BRW-03): now time-sensitive

Public reads today: the pinned `.deb` URL still returns 200 with exactly 143,638,568 bytes. But
Google's signed stable index now lists **155.0.8059.84-1**, not the pinned `.79`. Old pool files
are pruned after a new stable ships, so the next CI run may fail closed at download. That failure
is safe, but it blocks every future CI run.

Controls verified in code: redirects are rejected, the size and SHA-256 are checked on download and
on the copied override, the committed InRelease/Packages snapshot is verified with gpgv, and every
step fails closed. CI depends on one mutable external location (`dl.google.com` pool).

| Option | Durable? | Cost | Recommendation |
|---|---|---|---|
| R1 — re-pin to the current stable whenever CI is next needed: new snapshot, new hashes, `inventoryBinding`/ELF blocks regenerated with `extract-verified-browser.py`, selftests, one CI run as the new baseline | No (repeat each time) | One reviewed change per release; no new infrastructure, secrets or redistribution | **Recommended** |
| R2 — Actions cache keyed by SHA-256, fed through the existing `GS_BROWSER_RAW_PATH` | No: caches are evicted after 7 days unused, and CI runs rarely | Workflow change, Option A pin move | Not recommended |
| R3 — mirror the `.deb` as a release asset or artifact | Yes | Public redistribution of a proprietary binary from a public repository; licensing unconfirmed | **Not without owner and licence review** |
| R4 — move to Chrome for Testing, which keeps versioned archives | Yes | Different product, no GPG signature (trust-on-first-use hash), Option A rewrite, new evidence baseline | Later, if R1 becomes a burden |

No Chrome upgrade, mirror or upload was made.

## F. Deployment and rollback

### F.1 Topology (verified today, unless marked)

1. **Source:** GitHub `atikmurtaza/Gridsmith-Ltd` (public). 0 webhooks, 0 rulesets, `main` not
   protected, environments `Preview` and `Production` without protection rules, 0 secrets,
   variables are publishable values only, default workflow token read-only (API read).
2. **CI:** `ci.yml` runs `verify` on every push and on PR open/reopen, with `contents: read`.
   `smoke.yml` is registered but exists on no current branch.
3. **Publication:** only `workflow_dispatch` on a non-main, non-artifact branch runs
   `hostinger-staging`, which builds and commits to `codex/gs-hostinger-artifact` (now `bd8dd825`).
   **A push cannot publish.**
4. **Staging upload:** Hostinger pulls `codex/gs-hostinger-artifact` only if auto-deploy is ON or
   someone clicks Redeploy, and **Redeploy turns auto-deploy back ON**. Current state: UNVERIFIED
   (needs D1).
5. **Staging validation:** `check-hostinger-http.mjs` and `check:static:ui` against the staging
   origin, plus a synthetic Preview submission.
6. **Production:** WordPress on Hostinger. No repository path deploys there. Vercel: 3 projects on
   the team; `gridsmith-ltd` has no production deployment, and its latest Preview is from 3 Oct
   (the 18 and 20 Oct pushes created none), with SSO protection on (API read).
7. **DNS/TLS (public read):** NS `hermes`/`artemis.dns-parking.com`; apex A ×2 and AAAA ×2 on
   Hostinger; `www` CNAME to the Hostinger CDN; MX `mx1`/`mx2.hostinger.com`; SPF
   `include:_spf.mail.hostinger.com ~all`; DMARC `p=none`; DKIM `hostingermail-a` CNAME; SOA serial
   `2026101501`, so the zone changed on 15 Oct, after the 13 Oct observations: the owner should
   confirm that change. Certificates: apex/www Let's Encrypt to 16 Dec 2026; staging wildcard to
   7 Dec 2026. The default plan needs **no DNS change**.
8. **Rollback:** see F.3.

### F.2 Controlled launch procedure

As [RUNBOOK.md](RUNBOOK.md) §4–§5, in order, each step behind its own approval:
D1 → D2/D3/D4/D5 (backups restore-proven) → production profile implemented and locally verified →
D8 (H4-B production) → legal PUBLISHABLE decisions → D6 (re-pin + exact-SHA CI on the release SHA)
→ D7 (staging release and staging acceptance) → D9 (cutover to a sibling directory, document-root
switch, CDN purge) → post-cutover checks (every route 200, legacy 308, robots/sitemap indexable,
headers on every file type including PNG, no `Set-Cookie`, one real enquiry reaches
contact@gridsmith.uk) → monitoring window.

### F.3 Rollback (no part of it has been rehearsed)

| Trigger | Action | Verify after |
|---|---|---|
| Static site broken (routes, assets, headers) | Switch the document root back to the retained WordPress root; purge CDN | WordPress home and contact page 200 |
| Intake failing | Keep the static site; the `mailto:` fallback is on the page; disable the intake worker under H4-B authority | Mailbox receipt |
| WordPress root damaged | Restore files and DB from the D2 backup | Home, contact, wp-admin sign-in by the owner |
| DNS/TLS problem | Re-import the D3 zone export, or reissue the certificate | `nslookup`, certificate dates as in F.1 |
| CMS damaged | `migrate-production-cms --write` from the repository payload (47/47 equal today) or the D4 export | The audit in LEDGER §9 returns 47/47 |
| Staging bad | New commit restoring `bd8dd825` files on the artifact branch, then Redeploy, then auto-deploy OFF | `__deployment.json` identity `28b841dd…` |

Propagation: DNS TTL 600 s is irrelevant to the default plan (no DNS change). CDN purge is
immediate but unmeasured. **A written plan is not a tested rollback:** D2 is the restore proof.

## G. Final checklist

| Item | Status |
|---|---|
| Linux CI (exact SHA) | PASS |
| Browser provisioning | PASS (durability: OWNER DECISION REQUIRED, BRW-03) |
| Master Q5 | PASS |
| Lighthouse | PASS |
| Accessibility (automated) | PASS; manual/AT testing OWNER DECISION REQUIRED (ACC-08) |
| Dependency security, production | PASS |
| Dependency security, dev advisories | OWNER DECISION REQUIRED (§B) |
| Static build (production dataset, staging profile) | PASS (local) |
| Production CMS integrity | PASS (public read) |
| gridsmith.uk production profile | PASS (local, fails closed; GS-R13). Release build BLOCKED on the intake URL and legal states |
| Lead intake, production | BLOCKED (H4-B, D8) |
| Legal publication | OWNER DECISION REQUIRED (§C) |
| Security headers, production | PASS as policy text (GS-R13); hosted delivery BLOCKED (no upload) |
| Hosting push safety | OWNER DECISION REQUIRED (D1) |
| Staging (candidate) | BLOCKED (D7, not authorised) |
| Backup | BLOCKED (D2–D5) |
| Rollback | BLOCKED (not rehearsed) |
| Owner release authorisation | OWNER DECISION REQUIRED |

## H. Recommended next action

### H.0 Launch sequence (current, 20 Oct, after GS-O025 round 2)

Every step is owner-gated and approved on its own. "Proves" is the evidence that must exist before
the next step.

| # | Operation | Depends on | Proves | Record |
|---|---|---|---|---|
| 1 | Hostinger read-only checks H1–H7 (yours) | — | No Git path from `main` to gridsmith.uk; backups listed; the 15 Oct DNS change was expected | GS-R13-H4B §E.2 |
| 2 | **GS-O025 keep-alive activation**, including the 4-file `main` commit | 1 (H2/H3) | Both projects get twice-daily authenticated activity; first manual run green | GS-O025 §8 |
| 3 | **GS-R13-H4B-EXEC-001**: backup, migration, secrets, deploy, synthetic test, cleanup (`synthetic-only`) | 2 recommended, so Production stays awake; sender and pause decisions | Production intake works end to end; restore-proven backup | GS-R13-H4B §C.3, §F |
| 4 | One push of the release branch for **exact-SHA CI** of the release candidate | 3 (the worker commit is final) | Linux CI green on that SHA. The Chrome `.79` pin was still downloadable on 20 Oct; if it has been pruned, re-pin first (§E.2) | RUNBOOK §2–3 |
| 5 | **Staging release** of that SHA (`workflow_dispatch`, hPanel Redeploy, auto-deploy back off) | 4 | Hosted behaviour on Hostinger: headers, routes, forms against Preview | RUNBOOK §4 |
| 6 | **Legal decisions** (seven lines plus the Cookies sequencing option) and CUTOVER-AUTHORITY | 3 (H4-B-INTAKE-PROMOTED needs live intake at cutover) | PUBLISHABLE states can be recorded | LEGAL-PUBLICATION-APPROVAL |
| 7 | WordPress/DNS backup, restore-proven (D2/D3) | 1 | A rollback target | RUNBOOK §5 |
| 8 | Set `PRODUCTION_INTAKE_URL` (local commit), legal CMS write, **GS-R13 production build** | 3, 6 | The gridsmith.uk artifact passes its gate | GS-R13 record §6 |
| 9 | **Cutover**: sibling directory, document-root switch, `GRIDSMITH_INTAKE_MODE=live`, drain enabled, A-2 cookie retest, post-cutover checks | 5, 7, 8 | Live site; rollback by switching the document root back | RUNBOOK §5, GS-O025 §8 (drain) |

Still open alongside: the 4 dev-only advisory dispositions (§B), BRW-03 (§E.2), SEC-F4, SEC-F5,
ACC-08, POL-01.

> **Update (20 Oct, after GS-R13-H4B):**
> - **D5 + D8:** the Production intake package, with restore-proven backup tooling, is ready for
>   one approval: [record](../GS-R13-H4B-PRODUCTION-INTAKE-READINESS-001.md) §F.
> - **Legal:** the seven decisions are in one document,
>   [LEGAL-PUBLICATION-APPROVAL.md](LEGAL-PUBLICATION-APPROVAL.md), which records a Cookies/profile
>   sequencing defect.
> - **Decide first:** the Free-plan pause (GS-O025) and the sender.

> **Update (20 Oct, after GS-R13):** the profile is done. The longest-lead item is now the
> Production lead intake (H4-B production, D5 then D8), whose recorded URL is the profile's
> remaining technical input. Do the D1 Hostinger confirmations first.

*Original recommendation, now completed:* the longest-lead item, and the one every later step
waited on, was the gridsmith.uk build profile.
It is local engineering, and it can be built and verified without any provider write. Suggested
wording:

> Authorise GS-R13-PRODUCTION-PROFILE-001: implement and locally verify a gridsmith.uk static
> build profile (host lock, indexing, production header policy, PHP denial), failing closed until
> the production intake URL and legal PUBLISHABLE states exist. No push, deployment or provider
> write.

In parallel, and only you can do it: action D1 (the Hostinger read-only confirmations and the
backup list).
