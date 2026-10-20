# GS-R12-PRODUCTION-READINESS-001 — production-readiness ledger

Isolated worktree `C:\Users\atikm\.codex\worktrees\gs-r12-production-readiness-001\Gridsmith Ltd`,
branch `claude/gs-r12-production-readiness-001`, based on `e854ad87` (tree `be9cf685`). Local commits
only: nothing pushed, no CI triggered, no provider, DNS, Hostinger, Vercel, Sanity, Supabase or
WordPress write, no Docker run. Machine-readable state: [checkpoint.json](checkpoint.json). Handoff:
[HANDOFF.md](HANDOFF.md).

**Evidence labels used throughout.** *static* = source reading; *synthetic* = selftest/fixture;
*local runtime* = this Windows host (Node v24.15.0, npm 11.12.1, Puppeteer Chrome 148.0.7778.97);
*CI* = a GitHub Actions run (none exists for this candidate); *staging* / *production* = hosted
(none performed). Historical receipts are cited with their commit and date and are never relabelled
as current.

**Classes.** 1 = mandatory technical release blocker · 2 = mandatory owner/legal/security decision ·
3 = nonblocking warning · 4 = post-release enhancement.

**Statuses.** NOT STARTED · IN PROGRESS · PASS · FAIL · BLOCKED · OWNER DECISION REQUIRED · NOT APPLICABLE.

## 1. Register (dependency order)

The order is: things that would make the very first CI run of this candidate fail or lie (1–6), then
locally executable acceptance (7–10), then items that need an external run or owner authority
(11–18), then owner/legal decisions (19–38), then warnings and enhancements.

| # | ID | Class | Status | Title | Owner approval |
|---|---|---|---|---|---|
| 1 | BRW-EOL-01 | 1 | PASS | Option A manifest hash pin would fail on every checkout (CRLF pin vs `eol=lf`) | — |
| 2 | BLD-01 | 1+2 | PASS | Shared-baseline bundle budget exceeded by the SC 2.4.11 footer-focus fix — owner raised the budget to 2.9KB | Decided 18 Oct |
| 3 | SEC-TMP-02 | 1 | PASS (local) | `tmp` GHSA-ph9p-34f9-6g65 / GHSA-52f5-9888-hmc6 — scoped override | Confirm remediation |
| 4 | SEC-UUID-03 | 1 | PASS (local) | `uuid` GHSA-w5hq-g745-h8pq — scoped override | Confirm remediation |
| 5 | SEC-FTP-04 | 1 | PASS (local) | `basic-ftp` GHSA-c475-qrg2-pj4r — scoped override | Confirm remediation |
| 6 | SEC-PIN-07 | 1 | PASS | Option A package/lock/workflow hash pins must move with any manifest/workflow change | — |
| 7 | SEC-F8 | 3 | PASS | Static artifact secret scan missed Supabase `sb_secret_` keys | — |
| 8 | SEC-F6 | 3 | PASS | Delivered Hostinger header/CSP policy had no offline assertion | — |
| 9 | ACC-03 / LEG-15 | 1 | PASS (local) | Fresh local served acceptance (axe, responsive, legal parity, scenes, company) on the final tree | — |
| 10 | ACC-04 | 1 | PASS (local) | Local static-artifact acceptance (private legal-preview profile) | — |
| 10a | BRW-02 | 1 | PASS (synthetic) | Option A `--version` predicate rejected real Linux Chrome output | — |
| 10b | GATE-PRESS-01 | 1 | PASS | `check:press:scene` state-cue loop measured mid-transition (failed deterministically on this tree) | — |
| 10c | GATE-EDGE-01 | 3 | PASS | `check:edge:ui` raced the router for the thank-you title | — |
| 10e | GATE-DEPS-01 | 3 | PASS | `check:deps:overrides` FTP harness hit a native node.exe crash (0xC0000409) ~1% of Windows runs, with the original basic-ftp too | — |
| 10d | REVIEW-01 | 3 | PASS | Independent review: 3 confirmed low findings in new test code, all fixed (`cf2cd083`) | — |
| 11 | CI-01 | 1 | **PASS (CI 39378746236, `17080169`)** | ~~No exact-SHA GitHub CI exists for this candidate~~ — exact-SHA CI green, §8 | — |
| 12 | BRW-RT-01 | 1 | **PASS (CI 39378746236)** | ~~Option A never executed on Linux~~ — authenticate, extract, loader closure, `--version`, Puppeteer and LHCI on Chrome 155, §8 | — |
| 13 | Q5-01 | 1 | **PASS on exact SHA (CI 39378746236)** | All 14 `check:master:scene` questions pass on Chrome 155 / Linux with the protected verifier byte-unchanged; the earlier Chrome 154 capture disagreement did not recur; its cause is not claimed resolved, §8 | Watch the next runs |
| 14 | BRW-155-01 | 3 | IN PROGRESS | Candidate CI measures on Chrome 155; all a11y/visual/LHCI evidence is Chrome 148/154 | First CI = new baseline |
| 15 | DEP-PROD-PROFILE | 1 | **PASS (local, fails closed)** | ~~No production (gridsmith.uk, indexable) static profile~~ — implemented in GS-R13-PRODUCTION-PROFILE-001; refuses until the Production intake URL and 7 PUBLISHABLE states exist; rehearsal verified, §10 | Inputs: H4-B, legal |
| 16 | DEP-PROD-CHANNEL | 1 | BLOCKED | No production deployment channel/credentials | Cutover phase |
| 17 | DEP-PROD-ROLLBACK | 1 | BLOCKED | No restore-proven WordPress/DNS backup; rollback rehearsal absent | Owner backup |
| 18 | LEG-02 | 1 | BLOCKED | Lead intake (H4-B) Preview-only; Privacy §2/§6/§7 describes a production intake that does not exist | H4-B production phase |
| 19 | SEC-ZIP-01 | 2 | OWNER DECISION REQUIRED | `extract-zip` ×2 advisories, no published fix | Risk disposition |
| 20 | SEC-BRACES-05 | 2 | OWNER DECISION REQUIRED | `braces` advisory, no published fix | Risk disposition |
| 21 | SEC-SPRINTF-06 | 2 | OWNER DECISION REQUIRED | `sprintf-js` advisory, no published fix | Risk disposition |
| 22 | DEP-PUSH-SAFETY | 2 | OWNER DECISION REQUIRED | Provider push safety UNVERIFIED (Apps, Vercel Git, other sites) | Owner checklist |
| 23 | LEG-01 | 2 | OWNER DECISION REQUIRED | CUTOVER-AUTHORITY unmet on all 7 legal documents (7 OWNER_ADOPTED, 0 PUBLISHABLE) | Cutover authority |
| 24 | LEG-03 | 2 | BLOCKED | PRIVACY-PUBLISHABLE co-publication prerequisite (derived) | Follows LEG-01/02 |
| 25 | LEG-04 | 1 | BLOCKED | A-2 production cookie retest (Cookie Policy asserts server sets no cookies) | At cutover |
| 26 | LEG-05 / LEG-06 | 1 | BLOCKED | Production profile must ship 7 legal routes; footer/form legal links 404 on production content today | Cutover phase |
| 27 | LEG-07 | 2 | OWNER DECISION REQUIRED | Path Finder ships as a noindex "Withheld preview" with `[SEED]` rules in every static profile | Approve rules or exclude |
| 28 | LEG-08 | 2 | OWNER DECISION REQUIRED | Freelancer written permission not held; reviews fail closed off staging | Provider grant or scope |
| 29 | LEG-09 | 2 | OWNER DECISION REQUIRED | GS-X002 review for 3 Technical services (exclusion enforced) | Keep exclusion or review |
| 30 | LEG-10 | 2 | OWNER DECISION REQUIRED | Adopted effective dates predate any possible publication | Keep or re-date |
| 31 | LEG-11 | 2 | OWNER DECISION REQUIRED | Interim transparency while adopted privacy notice is unpublished | Decide |
| 32 | LEG-14 | 2 | OWNER DECISION REQUIRED | Rights-chain template 01 unsigned; contracting checklist | Owner signature |
| 33 | POL-01 | 2 | OWNER DECISION REQUIRED | Brief says "no public phone number"; site publishes one under GS-O004 | Confirm policy |
| 34 | SEC-F4 | 2 | OWNER DECISION REQUIRED | Global enquiry ceiling is an unauthenticated lockout vector; honeypot is the only bot defence | Choose mitigation |
| 35 | SEC-F5 | 2 | OWNER DECISION REQUIRED | "Private" staging and legal preview are publicly reachable (noindex only) | Accept or add HTTP auth |
| 36 | ACC-08 | 2 | OWNER DECISION REQUIRED | No screen-reader, physical-device or native-zoom testing ever performed | When and who |
| 37 | DEP-WP-ROLLBACK-TARGET | 2 | OWNER DECISION REQUIRED | Current production/rollback site has open provider security alerts (details held by the owner outside this public repository) | Patch or accept window |
| 38 | BPH-05 | 2 | OWNER DECISION REQUIRED | Production-profile export not re-run (needs read of the Production public dataset) | Permit read |
| 39 | DEP-VERCEL-RESIDUAL | 3 | OWNER DECISION REQUIRED | Residual Vercel production deployment and cron (GS-O026) | Retire or keep |
| 40 | DEP-DISPATCH-PUBLISH | 3 | NOT STARTED | `workflow_dispatch` on any non-main branch publishes staging with no approval gate | Optional hardening |
| 41 | DEP-MAIN-UNPROTECTED | 3 | NOT STARTED | No branch protection or required checks | Optional |
| 42 | ACC-07 / ACC-09 / ACC-10 | 3 | NOT STARTED | Axe contrast incompletes, carousel resume, focus-ring/target-size not measured | — |
| 43 | LEG-12 / LEG-13 | 3 | NOT STARTED | Status-register drift (solicitor rows); latent Slack recipient branch and sitemap legal list | — |
| 44 | SEC-AUDIT-08 | 3 | PASS (local) | Audit evidence dated; no CI audit step | — |
| 45 | BPH-06 / BPH-07 | 3 | NOTED | Windows vs CI measurement conditions; threshold-edge LCP/TBT margins | — |
| 46 | SEC-F7 / SEC-F9 / ACC-06 / ACC-11 | 4 | NOT STARTED | CSP inline hashes; COOP/CORP/HSTS scope; ErrorDocument 500; returning-visitor notice frame | — |

## 2. Entries

Each entry: issue and impact · evidence · dependencies · fix · status · commands and actual result ·
remaining risk · owner approval · references.

### BRW-EOL-01 — Option A manifest pin vs line-ending normalisation · class 1 · **PASS**
- **Issue/impact:** `config/browser-input.json` is pinned (`MANIFEST_SHA256 20ac446b…`, 229,589 bytes) by the hash of its CRLF bytes. `.gitattributes` `* text=auto eol=lf` would commit and check it out as LF (`d4e9cc89…`), so `install-controls`/`provision` fail `CONFIG_FROZEN_IDENTITY` on every CI checkout.
- **Evidence:** static; byte counts (3,216 CR); `scripts/extract-verified-browser.py:28-29`, `scripts/browser-input.mjs:172`.
- **Fix:** `.gitattributes` `-text -whitespace` for the manifest and `config/browser-provenance/**` (`59efa2d4`). Reviewed bytes unchanged.
- **Result:** `git show HEAD:config/browser-input.json | sha256sum` = `20ac446b…`. Independent review: no finding.
- **Remaining risk:** none known; first Linux checkout is the runtime confirmation.

### BLD-01 — shared-baseline bundle budget · class 1 + 2 · **PASS (owner decision, 18 Oct 2026)**
- **Issue/impact:** `ddf9d9aa` (footer-focus SC 2.4.11 fix) raised the shared baseline every route pays to **2.9143KB** against `SHARED_BASELINE_BUDGET_KB = 2.8`. `npm run size` exits 1, so the candidate's CI `verify` would fail at `size`. Previous local passes measured a build whose `node_modules` was a junction outside the build directory, which chunks differently; CI's last `size` pass (`8fec6426`) predates `ddf9d9aa`.
- **Evidence:** local runtime, clean in-tree builds: `e854ad87`-equivalent 2.9143KB (117 B gz over); with `8fec6426`'s `ConsentBanner.tsx` 2.8KB (pass); exact method replicates `check-bundle-size`.
- **Fix applied:** `e6390bd6` removes down-levelled syntax (default parameter, optional chaining) from the effect: **2.8732KB**, 75 B gz over. Behaviour unchanged: `check-master-accessibility` 14/14 + manual-scroll PASS. A further `lib/consent/state.ts` template-literal change re-chunked the banner and made the total worse; reverted.
- **Owner decision:** (a) raise the budget to 2.9KB (keeps the required window below `FLOOR_TOLERANCE_KB` 3.0; accessibility outranks a byte budget per non-negotiable #10; 27 B headroom at 2.8732), or (b) reduce behaviour (e.g. drop body `ResizeObserver`, which the earlier independent review added to stop a reflow scroll jump) and re-verify.
- **Decision taken (owner, 18 Oct 2026):** keep the fix; `SHARED_BASELINE_BUDGET_KB` 2.8 → **2.9**, reason recorded beside the constant in `scripts/check-bundle-size.mjs`; the problem message now prints two decimals (a 0.1KB window is unreadable at one). Still strictly below `FLOOR_TOLERANCE_KB` 3.0 (the guard passes).
- **Probe re-calibrated:** the committed deliberate-failure probe had silently become invalid — with the baseline at 2.87KB its 1,480-character payload lifted `shared` to 3.8986KB, so the floor check fired instead of this assertion. Re-sized to 64 characters on measurement (64 → 2.9494KB, 80 → 2.9611, 160 → 3.0227): with the probe on, `size` fails with "shared baseline is 2.95KB, over its 2.9KB budget" (the floor check did not exit first).
- **Result:** clean in-tree build, probe off: `npm run size` **PASS** (2.8732KB; 27 B gz headroom). Lazy Master scene 7.1/8KB and Design scene 7.9/8KB now reached and pass.

### SEC-TMP-02 / SEC-UUID-03 / SEC-FTP-04 — fixable advisories · class 1 · **PASS (local)**
- **Fix:** scoped overrides (`6b441ad3`): `@lhci/cli` → `tmp 0.2.7`, `uuid 11.1.1`; `typeid-js` → `uuid 11.1.1`; `get-uri` → `basic-ftp 6.2.3`.
- **Result:** `npm ci` PASS (1568 packages, lock `eb854741…` unchanged); `npm audit --omit=dev` 0; full audit 21 entries / 4 IDs (was 30 / 8). `check:deps:overrides` (new, in `verify:static` + `ci.yml`): consumer-rooted versions, lock-wide copies, behaviour through consumers incl. 4 FTP branches; red controls recorded.
- **Remaining risk:** LHCI's `uuid.v4` path is first exercised for real by CI Lighthouse (cannot run on Windows). Owner should confirm the remediation (no acceptance involved). Details: [SECURITY.md](SECURITY.md).

### SEC-PIN-07 — Option A pins · class 1 · **PASS**
- Pins for `ci.yml`, `package.json`, lock (and the selftest base) moved with the change (`6b441ad3`); `browser-input.selftest` 406 cases PASS; independent integrity reviewer recomputed blob hashes, no finding.

### BRW-02 — Linux `--version` channel token · class 1 · **PASS (synthetic) / runtime pending**
- **Issue/impact:** exact match on `Google Chrome 155.0.8059.79`; real branded Linux Chrome run directly in the verifier's clean environment prints `… unknown` (stable prints an empty token), so `provision` would fail its first real run.
- **Fix:** `98672fe2`; only `''`, `' '`, `' unknown'` accepted; receipt keeps canonical identity. HEAD predicate shown to reject both real forms; 5 new fixtures; Python selftest 140 PASS. Independent review: "canonical output" concern rejected as a documented choice.
- **Remaining risk:** not observed against the real binary until BRW-RT-01.

### SEC-F8, SEC-F6 — scanner and header-policy assertions · class 3 · **PASS**
- `0784d7d3` (`sb_secret_` pattern; proven red without it) and `8c1fd41e` + `cf2cd083` (header/CSP assertions; HSTS compared numerically after independent review; 10 mutation proofs red, 3 longer HSTS values accepted).

### ACC-03 / LEG-15 / ACC-04 — local acceptance · class 1 · **PASS (local)** — see §2.1

### GATE-PRESS-01 — Press state-cue timing · class 1 · **PASS**
- `check:press:scene` failed `pr-au-voice contrast` in the served suite and again in isolation. Replay: 1.02 / 2.89 / 4.95:1 on the same sequence; mid-transition foreground; settled 7.39:1. The state-cue loop measured immediately after the click while the selection loop above waits 800 ms. Fix `e2744e54` (same wait; predicate/threshold unchanged; ratio now reported). Two consecutive full runs PASS.

### GATE-EDGE-01 — thank-you title race · class 3 · **PASS**
- `check:edge:ui` asserted the title right after the URL changed. Fix `d3013441` (bounded wait before the unchanged assertion). Two consecutive runs PASS.

### GATE-DEPS-01 — native crash in the FTP loopback harness · class 3 · **PASS (contained)**
- Found while re-running `verify:static` after the budget change: exit 127 in Git Bash = Windows status **0xC0000409** (`STATUS_STACK_BUFFER_OVERRUN`, native fail-fast in node.exe v24.15), no stderr, no diagnostic report. Localised to the FTP section (FTP-only variant crashed; non-FTP variant clean). Rates: original basic-ftp 5.3.1 5/200; 6.2.3 with per-case servers ≈1/30; tracked-socket teardown 1/150–1/200; single server pair 12/1000 — so a Node/Windows runtime fault in this loopback socket sequence, not the override and not an assertion.
- Containment: the FTP behaviour runs in a child (`scripts/check-dependency-overrides-ftp.mjs`); exactly one re-run only for Windows status 0xC0000409, reported in the output; an assertion failure, any other status, or a second crash fails the gate. Branch proofs with stand-in children: assertion → exit 1, no re-run; one crash → reported re-run, pass; two crashes → exit 1 "native crash on both attempts". 1,000-run gate stress: see BUILD-REGRESSION.
- Not claimed: the native cause inside node.exe; whether it occurs on Linux CI (Node 24.21).

### REVIEW-01 — independent review of this branch · class 3 · **PASS**
- 3 reviewers (correctness, CI/pin integrity, security) + per-finding refutation over all commits to `bb2343fd`: 11 raised, 3 confirmed (all low, all in new test code: HSTS digit-shape regex; unbounded root climb; nested-consumer blind spot), fixed in `cf2cd083`. No finding in app code, pins or Option A integration. A second review of `cf2cd083`/`e2744e54`/`d3013441` confirmed both waits move the sample to the intended settled state without weakening their predicates, and found one more low gap (npm-aliased lock entries), fixed in `7a1b662a`.

## 2.1 Local acceptance summary (Windows, Chrome 148, development dataset)

| Area | Result |
|---|---|
| Option A synthetic selftests | PASS (406 JS + 140 Python) |
| `verify:static` (61 gates) | PASS on `bb2343fd` and on final `e2744e54` |
| Build + secrets/tokens/theme | PASS |
| Bundle budgets | 69 routes PASS; shared baseline 2.8732KB vs **2.9KB** (owner decision BLD-01) PASS; lazy scenes PASS |
| 18 served gates | 16 PASS first time; Press failed (gate defect, fixed, 2× PASS); Master Q8 failed under host contention, PASS isolated (all 14 questions) |
| Footer focus / live reduced motion | 15/15 PASS |
| Static export (legal-preview) | artifact 62 routes / 218 files PASS; static UI 21 pages + 41 axe analyses 0 violations PASS; edge UI PASS ×2 |
| `npm audit` | production 0; full 21 entries / 4 IDs (no published fixes) |
| Lighthouse | not runnable on Windows; CI-only |
| CI / staging / production | **not run** |

Full tables: [BUILD-REGRESSION.md](BUILD-REGRESSION.md).

## 3. Final production-readiness decision

**BLOCKED — REQUIRED OWNER OR EXTERNAL ACTION** (20 October 2026; superseded the 18 October
"NOT READY — SPECIFIC TECHNICAL BLOCKERS" after CI 39378746236, §8).

Exact-SHA CI is green on `17080169`. That run closes CI-01, BRW-RT-01 and Q5-01 with Linux and Chrome
155 evidence.

What remains cannot be produced in this phase without owner authority or external action:

1. **Production delivery.** It needs four things, each in its own owner-authorised phase:
   - a production static profile, built from a read of the Production dataset (BPH-05);
   - a delivery channel and cutover authority (DEP-PROD-CHANNEL, CUTOVER-AUTHORITY);
   - a restore-proven backup and a rollback target (DEP-PROD-ROLLBACK, DEP-WP-ROLLBACK-TARGET);
   - the promoted lead intake (LEG-02, H4-B).
2. **Legal and publication.** The cutover legal routes and the cookie retest (LEG-04, LEG-05/06);
   7 documents are OWNER_ADOPTED and 0 PUBLISHABLE (§4).
3. **Owner decisions.** Security advisories with no published fix (extract-zip ×2, braces, sprintf-js);
   BRW-03, a durable Chrome input; POL-01, SEC-F4/F5, ACC-08.

No technical defect is open in the candidate. It is not "technically ready", because no production
artifact or channel exists that can be verified. Those depend on the owner actions above.

### CI-01 — exact-SHA CI · class 1 · **BLOCKED**
- No run exists for any commit after `8fec6426` (last: 38009171819, FAILURE on Q5 only). Pushing creates the branch and starts `verify` only; `workflow_dispatch` publishes and must not be used. Needs owner push authority after DEP-PUSH-SAFETY. Procedure: [RUNBOOK.md](RUNBOOK.md) §2–3.

### BRW-RT-01 — Option A Linux runtime · class 1 · **BLOCKED**
- Never executed on Linux (gpg, `.deb` extraction, loader closure, `chrome --version`, consumers). Phase-006 Docker diagnostic remains PREPARATION CLEARED — OWNER DOCKER APPROVAL REQUIRED; not run. Owner chooses that route or treats the first authorised CI run as the first observation. [BROWSER-CI.md](BROWSER-CI.md).

### Q5-01 — Master Q5 · class 1 + 2 · **OWNER DECISION REQUIRED (UNRESOLVED)**
- Capture/compositor disagreement in both CI failures; not reproduced locally before or now; protected verifier unchanged; passes all 14 questions on Chrome 148 and 155 locally. Protocol and a proposed classification-only verifier addition in [A11Y-Q5.md](A11Y-Q5.md).

### Remaining rows
Entries 15–46 are documented with evidence and proposed fixes in [RUNBOOK.md](RUNBOOK.md)
(deployment/rollback), [APP-HOSTING-SECURITY.md](APP-HOSTING-SECURITY.md) (SEC-F1–F9),
[A11Y-Q5.md](A11Y-Q5.md) (ACC-*), [SECURITY.md](SECURITY.md) (residual advisories) and §4 below
(legal/publication). None was changed in this phase except where marked PASS.

## 4. Legal, privacy and publication gates (Phase G)

Technical validation only. No legal text was edited, adopted, approved or published, and no claim
of legal compliance is made.

| Document | State | Unmet publication prerequisites |
|---|---|---|
| Privacy 2.3 | OWNER_ADOPTED (8 Oct 2026) | CUTOVER-AUTHORITY, H4-B-INTAKE-PROMOTED |
| Cookies 2.1 | OWNER_ADOPTED (7 Oct) | CUTOVER-AUTHORITY, PRIVACY-PUBLISHABLE, A-2-PRODUCTION-COOKIE-RETEST |
| Website Terms 2.1, Accessibility 2.1, `/legal/client-terms` 2.1, Consumers 3.1, Business Clients 3.1 | OWNER_ADOPTED (7 Oct) | CUTOVER-AUTHORITY, PRIVACY-PUBLISHABLE |

**7 OWNER_ADOPTED, 0 PUBLISHABLE** — unchanged by this phase.

| Category | Status |
|---|---|
| Technical validation completed | `check:legal:adoption` (fingerprints, versions, authority, prerequisites, no markers), `check:legal:selftest`, `check:legal:adoption:selftest`, `check:launch:selftest`, `check:static:selftest` (production profile emits zero legal routes; private preview exact seven-document parity) — PASS in `verify:static` on this tree; served `check:legal:parity`, `check:consumer-terms`, `check:launch`, `check:company` — see §2.1 |
| Owner legal review | GS-O003-R: evidence-based review plus owner adoption per version; no solicitor review is claimed |
| Approved for publication | **None** |
| Not approved for publication | All seven; Technical Design ×3 (GS-X002); Freelancer review display beyond temporary staging (no written permission); Path Finder (labelled "Withheld preview", noindex, `[SEED]` rules) |

Observed facts the owner should know:

- The production-content static profile ships 55 routes and **excludes** `/legal/*` (branded noindex
  404), so footer Terms/Privacy/Cookies/Accessibility links and the form privacy links 404 there
  today, and the artifact gate deliberately accepts that while legal is gated (LEG-06).
- **POL-01:** the brief says "no public phone number"; the site publishes `+44 7405 448534`
  ("WhatsApp or text", footer and Organization JSON-LD) under recorded owner decision GS-O004.
  Not changed — the owner must confirm which policy stands.
- Response wording is "We typically respond within 48 hours." — not a fixed guarantee; unchanged.
- No analytics; one strictly necessary cookie (`gs_consent`); the notice is information only.
- Intake notification fields match the Privacy §6 Resend sentence; a latent, unset Slack branch in
  the Next fallback path is undisclosed (LEG-13).
- Status-register drift: PROJECT-STATUS's blocker table still names the superseded solicitor gate
  (LEG-12). Not edited here because the owner checkout carries uncommitted changes to that file.

## 5. Controlled CI gate preparation (18 October 2026)

**Verified locally**

- Branch `claude/gs-r12-production-readiness-001`, clean tree, linear history on `e854ad87`; owner
  checkout and the Option A worktree unchanged.
- Bundle (BLD-01): `size` PASS at 2.8732KB vs the owner-approved 2.9KB; probe payload absent from
  every built file; probe on → the shared-baseline assertion fires at 2.95KB; floor-tolerance guard
  intact; consent/footer-focus code unchanged since `e6390bd6`.
- Crash containment (GATE-DEPS-01): FTP behaviour in a child; one reported re-run only when
  `process.platform === 'win32'` and status is exactly `0xC0000409`; Linux gets no retry.
- Dependencies: `npm ls` exit 0 (two known optional-platform extraneous entries);
  **`npm audit signatures`: 1,567 packages with verified registry signatures, 429 attestations**;
  lock `eb854741…`.

**Public-repository exposure fixed (EXPOSE-01, class 2 → PASS)**

The repository is public. The readiness docs stated the live production site's provider security
alert count and named installed GitHub Apps and the hosting plan; none of that was previously in
the repository. Redacted to neutral wording (details held outside the repository) and folded into
the original local commit by a non-interactive autosquash rebase of never-pushed commits: final
tree byte-identical (`b0d175d1`), the phrases appear in 0 commits on the branch. SHA mapping:
`3d91e567→45522cc7`, `c6bb5030→e720c939`, `78052aac→ff2a0558`, `effa6177→ec1dd06e`. The push
delta (48 files, +8,267 lines) was scanned: no credentials or keys.

**Deployment-trigger audit (read-only, 18 Oct)** — see [APPROVAL-PACKET.md](APPROVAL-PACKET.md) §4–6:
push runs `verify` only; publishing requires `workflow_dispatch`; 0 webhooks/rulesets/Pages;
environments unused; 0 secrets; default token read-only; **Vercel: 0 projects linked to the repo**.
UNVERIFIED today: Hostinger staging auto-deploy/branch and production Git (13 Oct observations), and
the other installed GitHub Apps' behaviour.

**No local change is needed for a CI-only run**: the existing push path is already CI-only.

### Release gates

| Gate | Status | Evidence / blocker |
|---|---|---|
| Security remediation | **PASS (local)** | 4 fixable IDs remediated; production audit 0; full audit 4 IDs with no published fix |
| Advisory decisions (extract-zip ×2, braces, sprintf-js) | **OWNER DECISION REQUIRED** | SECURITY.md §3 |
| Bundle budgets | **PASS** | Owner decision BLD-01 |
| Browser Option A runtime | **BLOCKED** | Needs the first CI run (or approved phase-006 route) |
| Master Q5 acceptance | **BLOCKED** | Needs CI evidence on Chrome 155; local 14/14 on 148 and 155 |
| Complete CI acceptance | **BLOCKED** | Push approval pending (APPROVAL-PACKET) |
| Local acceptance | **PASS** | §2.1 |
| Legal publication clearance | **OWNER DECISION REQUIRED** | 7 OWNER_ADOPTED, 0 PUBLISHABLE (§4) |
| Provider deployment safety | **OWNER DECISION REQUIRED** | Hostinger panel + GitHub Apps confirmation |
| Production configuration | **BLOCKED** | No production profile/channel (DEP-PROD-*) |
| Backup and rollback readiness | **BLOCKED** | No restore-proven backup (DEP-PROD-ROLLBACK); staging rollback documented |
| Owner deployment authorisation | **OWNER DECISION REQUIRED** | Not requested; nothing deploys |

## 6. First exact-SHA CI run (owner-approved push, 18 October 2026)

- **Approval:** owner approved pushing `claude/gs-r12-production-readiness-001` at
  `d3d5ba462f0b0e26f505dfb466d486bb6991bef1` (19 commits, incl. `ddf9d9aa`, `e854ad87`) for exactly one
  push-event CI run. Preconditions rechecked immediately before: HEAD matched, clean tree, branch
  absent on origin, 0 webhooks, 0 queued runs, 0 PRs, Vercel 0 linked projects. One push with an
  explicit single-branch refspec.
- **Run:** [CI 39151214971](https://github.com/atikmurtaza/Gridsmith-Ltd/actions/runs/39151214971),
  event `push`, head `d3d5ba46…`, conclusion **failure**; `hostinger-staging` **skipped** (nothing
  published). No other run was triggered.
- **First Linux evidence for Option A:** `browser-input.selftest` **PASS** (including the Python
  selftest's Linux-only filesystem fixtures, never run before); `install-controls` **PASS**;
  `provision` **FAIL** `SIGNATURE_INVALID` after ~1 s; all later steps skipped, so there is **no**
  new evidence for typecheck/build/size/LHCI/served gates or Q5 from this run.
- **BRW-RT-02 — root cause (fixed locally, `493e3cad`):** reproduced offline with GnuPG 2.4.9 using
  the committed key and InRelease — `gpgv` reports `GOODSIG`/`VALIDSIG` from the pinned signer subkey
  (SHA-256) plus one `KEYEXPIRED` line per retired, unused Google subkey; the parser treated
  `KEYEXPIRED` as fatal. GnuPG documents `KEYEXPIRED` as emitted for unused expired subkeys and
  `EXPKEYSIG` as the expired-signing-key verdict (still fatal). Verbatim 2.4.9 output is now a
  permanent positive fixture (the old predicate rejects it) with an `EXPKEYSIG` negative.
  Python selftest 142 PASS; browser-input selftest PASS.
- **Next stage reachability (read-only, 18 Oct):** pinned `.deb` URL `200`, exactly 143,638,568
  bytes, no redirect; live signing key byte-identical to the pin.

## 7. Offline diagnosis of the next Option A stage (19–20 October 2026)

Nothing was pushed or dispatched; no Docker, WSL or Linux host was used. The fix for run
39151214971 (`493e3cad`) moves CI past authentication into stages that have **never** run on real
Linux: the retained Debian 12 receipts record 0 extractions, 0 loader/provider observations and 0
browser executions. Before asking for another push, those stages were predicted from code and
verified against primary sources: glibc-2.39 `elf/rtld.c`, dpkg-1.22.6 `src/query/main.c`, the
Ubuntu noble `libc6` file list and `libc.preinst` (Launchpad glibc `ubuntu/noble-updates`). Three
independent predictors were used, each prediction then went to an adversarial refuter, and every
verdict was checked against the code.

| ID | Class | Verdict | Mechanism (all inside `verify_loader`, provision step) |
|---|---|---|---|
| BRW-RT-03 | 1 | **REAL → fixed `e4dfe8f8`** | First action: ownership of the interpreter path `/lib64/ld-linux-x86-64.so.2`. On noble, libc6 registers its files only under `/usr` and its preinst adds the DEP17 M8 protective diversion of exactly that path. `dpkg-query -S` therefore prints `diversion by libc6 from:/to:` lines with no owner line and still exits 0 (diversions count as found). The single-owner regex rejects this: `LOADER_PACKAGE_OWNERSHIP`. Debian 12's libc6 owns the path directly, so this could never appear there |
| BRW-RT-04 | 1 | **REAL → fixed `e4dfe8f8`** | ld.so ran with argv[0] = its realpath. rtld sets `l_name = argv[0]` and prints `"<PT_INTERP> => <argv[0]>"` when they differ, so `chrome` gives `/lib64/ld-linux-x86-64.so.2 => /usr/lib/x86_64-linux-gnu/ld-linux-x86-64.so.2 (0x…)` and fails as `LOADER_OUTPUT_MALFORMED`. Members without PT_INTERP name the loader by its realpath, so a regex-only fix would split one loader into two identities (`LOADER_PROVIDER_CONFLICT` / `PROVIDER_INTERPRETER_CONFLICT` / Node `RECEIPT_INTERPRETER_CONFLICT`) |
| BRW-RT-05 | 1 | **REAL (mechanism) → fixed `e4dfe8f8`** | About 350 uncached `dpkg-query --search` runs plus about 130 `--show` runs, one after another, and each `--search` reads the whole file database. They share the 120 s deadline with acquisition and extraction (`RESOURCE_WALL_LIMIT`). How long one query takes on the runner image is unmeasured |
| ELF parsing on real members | — | **REFUTED by execution** | A refuter ran the committed `elf_identity` and pass 1 of `archive_inventory` read-only over the retained authenticated `.deb` (sha256 `b7726070…`), with CPython 3.14 on Windows and no Chrome execution. All 11 ELF members equal the manifest's `elf` blocks; the inventory hash equals the pinned `INPUT_INVENTORY_SHA256` (`ac8ee7b5…`) |
| Chrome 155 launch / engine change | 3 | Not a new failure | Already BRW-155-01 (new CI baseline) |

**Fix (`e4dfe8f8`, tightened in `d9cb6c15` after an independent three-lens review):**

- Ownership is asked of each resolved file, plus its `/lib` alias only when `/lib` resolves to
  `/usr/lib`; never of the printed symlink path.
- Any diversion line rejects, as do two owners, no owner, a query failure, and a package row that is
  not installed, not amd64, unrequested, duplicated or missing.
- ld.so runs with argv[0] = the interpreter path, as `ldd` passes it, while the resolved, attributed
  file is what executes.
- Ownership costs two `--search` and two `--show` runs per verification, whatever the library
  count: the loader is attributed before it runs, then one batch covers the rest.
- Every file is measured again after attribution, and the loader's two attributions must agree
  (`LOADER_PROVIDER_CHANGED`).
- The receipt shape is unchanged for `browser-input.mjs`.

**Review (`e4dfe8f8`, semantics / security / fixture-validity lenses, read-only, private copies):**

- None of the three reviewers found a defect that would fail the first run, and each checked its
  reading against rtld.c and dpkg.
- They raised 11 low findings: a weakened alias-diversion case; the unchecked merged-`/usr`
  assumption; the lost hash-to-version binding; several untested branches (alias owner, `--show`
  identity, cross-member conflict, missing NEEDED, full provider list); the stubbed resolver; and the
  "two runs" record.
- All 11 were applied in `d9cb6c15`. On Linux, the selftest now also runs the real resolver against
  the host's own loader and `/lib`.

**Proof:**

- Python selftest 142 → **161** (162 on Linux) with an Ubuntu 24.04 host model: `rtld_trace` follows
  rtld.c and `dpkg_search` follows dpkg's `searchoutput`/`searchfiles`, with the noble diversion.
- **14 re-injected defects** in private copies each turn it red:
  - realpath argv[0] → `LOADER_OUTPUT_MALFORMED`;
  - printed path queried → `LOADER_PACKAGE_OWNERSHIP`;
  - per-library queries, or the loader run before attribution → the call-sequence assertion;
  - alias owners rejected, alias without merged `/usr`, any status accepted, architecture unchecked,
    the cross-member conflict dropped, NEEDED unchecked, no re-measure, or the loader identity not
    compared → their own tests;
  - rows not bound, or missing rows → a verifier `KeyError`, which `main()` reports as
    `VERIFIER_UNEXPECTED_FAILURE`, so it still fails closed.
- `browser-input.selftest` PASS (Python 161); `verify:static` PASS on `d9cb6c15`.

**Still unobserved until a Linux run:**

- Real `dpkg-query` and ld.so timing on the image.
- Extraction pass 2 writing with CPython 3.12.3's `tarfile` data filter.
- `OutputTree` on the real tree.
- The real `chrome --version`.
- Puppeteer/LHCI launches.
- Every served gate and Q5.

Each consumer launch repeats a full verification; that costs minutes, not a failure.

## 8. Second exact-SHA CI run — green (owner-approved push, 20 October 2026)

**Approval and push**

- The owner approved one fast-forward push `d3d5ba46` → `17080169288b06e1cb3d54f72479ef68e4ad9d07`
  and exactly one push-event CI run (verify job only).
- The approval text reached me cut off at 300 characters, before its Hostinger-confirmation clause.
  The cut was caused by the length of my own reply button.
- Preconditions rechecked immediately before the push: `HEAD` matched, clean tree, remote head
  `d3d5ba46`, fast-forward, 0 webhooks, 0 queued or in-progress runs, 0 PRs.
- One push with an explicit refspec, no force.
- Run: [CI 39378746236](https://github.com/atikmurtaza/Gridsmith-Ltd/actions/runs/39378746236), the
  only run for that SHA. Conclusion **success**, 06:09–07:39 UTC. `hostinger-staging` **skipped**,
  so nothing was published or deployed.

**Option A on Linux (first complete execution; BRW-RT-01 → PASS)**

- `browser-input.selftest` PASS, Python **174** tests, including the Linux filesystem fixtures and
  the real-resolver check against the runner's own loader.
- `install-controls` PASS.
- `provision` PASS in about 25 s: authentication, raw `b7726070…`, both archive passes, tree
  write and verify, loader/provider closure, `chrome --version`.
- `browser-input check` PASS in about 10 s.
- Every browser consumer reported `Chrome/155.0.8059.79` / `HeadlessChrome/155.0.0.0`.
- BRW-RT-03/04/05, the defects fixed offline in `e4dfe8f8`/`d9cb6c15`, did not occur. The 120 s
  deadline left wide margin.

**Gates on the exact SHA (CI-01 → PASS)**

- All 57 `verify` steps succeeded: TypeScript, ESLint, 35 static and selftest steps (including
  `check:deps:overrides`), Build, tokens, theme, `size` and the served gates.
- **`size`:** 69 routes within their delta budgets. Shared baseline 2.8KB of 2.9KB, consent banner
  2.1/3KB, Master scene 7.1/8KB, Design scene 7.9/8KB.
- **Lighthouse desktop**, median of 3 runs over 11 routes: performance, accessibility and best
  practices **1.0** on every route, so Digital holds 100/100/100. SEO 0.66 everywhere, as expected
  from the staging `noindex` (not asserted). LCP 572–686 ms, TBT 0 ms, CLS 0.000.
- **Lighthouse mobile** (4G, 4× CPU): LCP **902–1075 ms** against budgets of 1750–2000 ms; TBT 69–93 ms;
  CLS ≤ 0.0001.
- **axe:** 76 analyses, 0 violations.
- `check:master:hero` (18 sizes), `check:design:scene` (25 sizes + R2), `check:press:scene`,
  `check:digital:scene` and `check:reviews:ui` all PASS.

**Master Q5 (Q5-01 → PASS on exact SHA)**

- `check:master:scene` on `Chrome/155.0.8059.79, linux`: "all 14 questions pass".
- Worst scene-text contrast per position ≥ 6.0:1 at every one of the 12 viewports; transit worst
  6.0:1.
- Fallback read top to bottom: worst 9.3:1. Software WebGL: 0 ms blocking beyond 50 ms per task.
- The protected verifier `scripts/check-master-scene.mjs` is byte-identical to the baseline
  (`98210eaf…`). No threshold, retry or suppression was changed.
- No failure evidence was produced, so the `master-scene-evidence` artifact is absent.
- The two earlier CI failures (Chrome 154) were a capture/compositor disagreement. It did not recur
  on Chrome 155. One green run is not proof the cause is gone, so watch the next runs.

**Artifacts retained:** `lighthouseci-reports`, `design-scene-evidence`.

### Release gates (20 October 2026)

| Gate | Status | Evidence / blocker |
|---|---|---|
| Security remediation | **PASS** | Exact-SHA CI incl. `check:deps:overrides`; production audit 0 |
| Advisory decisions | **OWNER DECISION REQUIRED** | 4 IDs with no published fix (SECURITY.md §3) |
| Bundle budgets | **PASS** | CI `size` |
| Browser Option A runtime | **PASS** | CI provision/check/consumers on Chrome 155 |
| Master Q5 acceptance | **PASS (exact SHA)** | All 14 questions, protected verifier unchanged |
| Complete CI acceptance | **PASS** | CI 39378746236 success |
| Local acceptance | **PASS** | §2.1 |
| Legal publication clearance | **OWNER DECISION REQUIRED** | 7 OWNER_ADOPTED, 0 PUBLISHABLE (§4) |
| Provider deployment safety | **OWNER DECISION REQUIRED** | Hostinger panel confirmation was not received this round |
| Production configuration | **BLOCKED** (owner authority) | No production profile or channel (BPH-05, CUTOVER-AUTHORITY) |
| Backup and rollback readiness | **BLOCKED** (owner authority) | No restore-proven backup (DEP-PROD-ROLLBACK) |
| Owner deployment authorisation | **OWNER DECISION REQUIRED** | Not requested; nothing deploys |

## 9. Final release preparation (GS-R12-FINAL-RELEASE-PREPARATION-001, 20 October 2026)

Decision pack: [RELEASE-DECISION-PACK.md](RELEASE-DECISION-PACK.md). Decision unchanged:
**BLOCKED — REQUIRED OWNER OR EXTERNAL ACTION.** Nothing was pushed, dispatched, deployed or
written to a provider. Raw outputs are in the ignored `build/` directory of this worktree
(`cms-audit-2026-10-20.json`, `build-static-prod-2026-10-20.log`, `static-receipt.json`,
`static-ui-prod-2026-10-20.log`, `static-ui-receipt.json`). They are local and are not committed.

**Starting state:** HEAD `f9d443aa` (tree `2c2f107a`), clean; `origin` branch head `17080169` (the
CI-green SHA). The `f9d443aa` delta is 5 docs files. Owner checkout untouched.

| ID | Requirement | Status | Evidence / command | Remaining risk / next |
|---|---|---|---|---|
| FRP-01 | Repository verification | PASS | `git status`, `git rev-parse`, `git ls-remote origin` | — |
| FRP-02 | Advisory re-check | PASS (no change) | `npm audit --json`: 21 entries / 4 IDs; `--omit=dev` 0; `npm view` latest braces 3.0.3, extract-zip 2.0.1, sprintf-js 1.1.3 (all affected); `npm ls` paths. New: puppeteer 25 drops extract-zip, but `@lhci/cli` 0.15.1 (latest) → lighthouse 12.6.1 → puppeteer-core ^24 keeps a copy | Owner dispositions, pack §B |
| FRP-03 | Chrome source durability (BRW-03) | **OWNER DECISION REQUIRED, now time-sensitive** | `curl -I` pinned `.deb`: 200, 143,638,568 B, no redirect. Live signed index `dists/stable/main/binary-amd64/Packages` lists `155.0.8059.84-1`, not `.79` | Pool pruning makes the next CI fail closed at download. Recommended R1 re-pin, pack §E.2 |
| FRP-04 | Production CMS read-only audit (BPH-05 read) | PASS | `node build/cms-audit.mjs` (unauthenticated, published perspective): 47 docs, 47/47 deep-equal to `buildPayload()`, 0 foreign/missing/markers/suspicious keys/dangling refs; fingerprint `d0dc7ef2…`. Probes: one changed field and one dropped expectation gave `differ` 1 and `foreign` 1; injected `[SEED]`, `isSeed`, `priceFrom` and a dangling `_ref` each fired | The audit cannot see drafts or system documents without a token |
| FRP-05 | Production-dataset static build (BPH-05) | PASS (local) | `GRIDSMITH_STAGING_ORIGIN=<staging> NEXT_PUBLIC_LEAD_INTAKE_URL=<preview> npm run build:static`: EXIT 0; 55 routes, 204 files, 29,600,827 B, identity `7e0b5ffd…`, problems 0, `sourceModified: false`, `/legal/*` and insights excluded | Windows build: the release artifact must come from the CI publish job |
| FRP-06 | Static UI on that artifact | PASS (local) | Plain file server on 127.0.0.1:3236 (scratch `build/serve-out.mjs`), `npm run check:static:ui`: 14 pages, 13 axe analyses with 0 violation rules, 13 no-JS pages | Not hosting-specific: no `.htaccess` was applied |
| FRP-07 | Legal approval pack | PASS (prepared) | `check:legal:adoption` PASS; per-document table in pack §C; company facts identical in all six drafts; artifact pages link 4–5 `/legal/*` routes that do not ship | Owner approves or withholds each document |
| FRP-08 | GitHub trigger audit | PASS (API read) | 0 hooks, 0 rulesets, Pages 404, environments without rules, 0 secrets, 3 publishable variables, default token `read`, `main` unprotected; `smoke.yml` registered but on no current branch. Installed-app listing needs a GitHub App token (403) | App behaviour still UNVERIFIED |
| FRP-09 | Vercel | PASS (API read) | `gridsmith-ltd`: latest deployment 3 Oct (Preview), none from the 18 or 20 Oct pushes; no production target; SSO protection on | Retire or keep: owner (D10) |
| FRP-10 | Supabase read-only | BLOCKED | The connector lists only an unrelated organisation (2 projects). Production `dqiutgmxillhsbzgnlsx` and Preview `qfgpwumvvtizeamkynes` are not visible | Owner D5, or reconnect the connector |
| FRP-11 | Hostinger panel | BLOCKED | hPanel redirected to sign-in; Claude may not enter credentials | Owner D1 |
| FRP-12 | DNS/TLS/HTTP | PASS (public read) | `nslookup` A/AAAA/NS/MX/TXT/DMARC/DKIM; `openssl s_client`: apex/www LE valid to 16 Dec 2026, staging wildcard to 7 Dec; `curl -I`: production WordPress 200, www/http 301; staging headers present and `__deployment.json` = `6615d97c`/`28b841dd…` | SOA serial `2026101501` = zone changed 15 Oct; owner to confirm |
| FRP-13 | Production build inputs | BLOCKED (owner authority/inputs) | Pack §E.1 | Recommended next action, pack §H |
| FRP-14 | Lead intake, production E2E | BLOCKED | No production intake (H4-B Preview-only). Test plan: after D8, one owner-approved enquiry from `https://gridsmith.uk/contact` with marked synthetic content → row in `leads` + outbox → Resend to contact@gridsmith.uk → owner confirms receipt → delete exactly that row by id and record before/after counts | Needs D5 backup first |
| FRP-15 | Backup and rollback | BLOCKED | Pack §F.3; public DNS baseline recorded | D2–D5; no rehearsal |

## 10. GS-R13-PRODUCTION-PROFILE-001 (owner-authorised, 20 October 2026)

Record: [GS-R13-PRODUCTION-PROFILE-001.md](../GS-R13-PRODUCTION-PROFILE-001.md). Local only: no push,
deployment or provider write.

| ID | Requirement | Status | Evidence | Remaining |
|---|---|---|---|---|
| R13-01 | gridsmith.uk profile: host lock, indexing, header policy, PHP denial | **PASS (local)** | `productionHostingerRules`, profile in `build-static.mjs`; selftest 39 adverse proofs; 10/10 implementation mutations red | Hosted behaviour unverified |
| R13-02 | Fails closed until the Production intake URL exists | **PASS** | `PRODUCTION_INTAKE_URL = null`; the real build refuses with `INTAKE` (7 refusal paths proven) | Set in the H4-B production phase |
| R13-03 | Fails closed until all seven legal documents are PUBLISHABLE | **PASS** | Refusal lists 7 `LEGAL` lines; artifact gate `LEGAL` | Owner legal decisions |
| R13-04 | Rehearsal proves the Next export is indexable and correct | **PASS (local)** | 55 routes; `check:static:ui` 14 pages, 13 axe 0 violations; 53 sitemap URLs | Not deployable by construction |
| R13-05 | Staging profile unchanged | **PASS (local)** | `.htaccess` hash-pinned and identical; all JS chunks identical; CSS/HTML differences reproduced by a rebuild of the unchanged source | CI not run |
| R13-06 | Release from CI | NOT STARTED | `hostinger-staging.yml` builds staging only | Reviewed workflow input, after the inputs exist |

Consequences for earlier rows: DEP-PROD-PROFILE and SEC-F1 become PASS (local, fails closed).
LEG-05/06 (legal routes in the production artifact) are now enforced by the profile rather than
merely missing. FRP-13's inputs are reduced to the H4-B intake URL and the legal states.

## 11. GS-R13-H4B-PRODUCTION-INTAKE-READINESS-001 (20 October 2026)

Record: [GS-R13-H4B-PRODUCTION-INTAKE-READINESS-001.md](../GS-R13-H4B-PRODUCTION-INTAKE-READINESS-001.md).
Nothing deployed or written to Production; `PRODUCTION_INTAKE_URL` stays `null`.

| ID | Requirement | Status | Evidence | Remaining |
|---|---|---|---|---|
| H4BP-01 | Production Supabase state | **PASS (read-only)** | ACTIVE_HEALTHY; leads 0; ledger 0001–0004 equal to the repository; H4-B absent; RLS 5/5, 0 policies, 0 anon/auth grants; 0 functions; no provider backups | Status flipped INACTIVE → ACTIVE during the session, not by this session; owner to confirm |
| H4BP-02 | Backup method | **PASS (local proof)** | `scripts/backup-production-db.mjs`: 9/9 refusals; selftest restore equal (7 tables, ledger, lead fingerprint); 2 mismatch modes red | Real backup needs your pooler URL and approval; dump encryption at rest is your action |
| H4BP-03 | Production-capable Edge functions | **PASS (local)** | `lib/leads/edge-deployment.ts`; selftest 25 profile cases; 7/7 mutations red | Deno bundle at deploy time |
| H4BP-04 | Migration on Supabase Postgres | **PASS (local)** | 40-assertion proof on Postgres 17.10 and on Supabase 17.6.1.167 | Production application needs approval |
| H4BP-05 | Deployment package | **PASS (prepared)** | Record §C.3: steps 0–10, rollback, evidence | Not executed |
| H4BP-06 | Free-plan pause | **OWNER DECISION (GS-O025)** | Both projects were paused today | Decide before `live` |
| H4BP-07 | Sender identity | **OWNER INPUT** | No Resend DNS on gridsmith.uk | Confirm the verified sender |
| H4BP-08 | Legal ↔ profile sequencing | **OWNER DECISION** | Cookies A-2 vs the all-seven profile requirement | Options in LEGAL-PUBLICATION-APPROVAL.md |
| H4BP-09 | Unintended Preview probe run | **RECORDED** | `check-edge-preview.mjs` executed on import; 17 read-only probes PASS, counts unchanged | — |

Consequences for earlier rows: SEC-F2 / SEC-INTAKE-PROD moves from BLOCKED to READY FOR APPROVAL;
LEG-02 still waits for the deployment and `live` mode.

## 12. GS-O025 — Supabase availability and notification maintenance (20 October 2026)

Record: [GS-O025-SUPABASE-AVAILABILITY.md](../GS-O025-SUPABASE-AVAILABILITY.md). Implemented and proven
locally; **not active**. No push, secret, variable, schedule, Edge or Supabase change.

| ID | Requirement | Status | Evidence | Remaining |
|---|---|---|---|---|
| O25-01 | Policy check | PASS | Supabase pausing page: "sufficient user database activity", "typically a few user requests to the database each day"; GitHub: default branch only, 60-day public-repo disablement, runs may be dropped | Threshold unpublished: best effort only |
| O25-02 | Least-privilege availability check, both projects, twice daily | PASS (local) | Role SQL; script with 13 branches; read-only and drift proofs; counter 0 → 6 | Activation steps 1–6 (incl. the `main` decision) |
| O25-03 | Scheduled retry drain, separate and live-only | PASS (local) | Drain-only token; 409 when not live; 9/9 script branches against the real worker; 6/6 mutations red | After H4-B and `live` |
| O25-04 | Workflow safety | PASS (local) | 18 YAML mutations red; Option A scan 0 codes; pins unchanged | First hosted run |
| O25-05 | Monitoring | PASS (prepared) | Failure emails; monthly `state`/`run list`/counter checks | Owner adds to the monthly review |

GS-O025 itself stays OPEN until the availability check is activated and verified (owner).

### 12.1 GS-O025 activation readiness (20 October 2026, round 2)

- **Reported contradiction checked:** both workflows already had `workflow_dispatch`. The real gap was
  that a manual run with the switch off skipped the job and looked green. Each workflow now has a
  `switch-off` job (dispatch only, `permissions: {}`, no checkout or secret) that fails with an
  explicit message.
- **Missed-run detection:** an optional, no-cost Healthchecks.io heartbeat after each successful
  session. It is the only measure that catches dropped schedules and the 60-day disablement
  (owner choice, new external service).
- **Activation procedure:** one 10-step procedure (record §8), with pre-push trigger inspection.
  `main` runs only verify-only `ci.yml`; Vercel has 0 linked projects; Hostinger H2/H3 must be
  confirmed by you before the 4-file `main` commit.
- **Proof:** Edge selftest 72 profile cases (16 mutations per workflow); heartbeat branches with no
  network; `verify:static` PASS.
- **Re-checked:** the Chrome `.79` pin is still downloadable (stable is `.84`); the same 4 advisory
  IDs; production audit 0.
