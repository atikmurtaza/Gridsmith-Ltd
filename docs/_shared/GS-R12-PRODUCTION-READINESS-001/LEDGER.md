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
| 11 | CI-01 | 1 | BLOCKED | No exact-SHA GitHub CI exists for this candidate | Push authority |
| 12 | BRW-RT-01 | 1 | BLOCKED | Option A never executed on Linux (APT closure, extraction, Chrome 155 launch, Lighthouse) | Phase-006 Docker / CI |
| 13 | Q5-01 | 1 | OWNER DECISION REQUIRED | Master Q5 red in the last two exact-SHA CI runs; capture/render disagreement UNRESOLVED | Classification protocol + one diagnostic CI run |
| 14 | BRW-155-01 | 3 | IN PROGRESS | Candidate CI measures on Chrome 155; all a11y/visual/LHCI evidence is Chrome 148/154 | First CI = new baseline |
| 15 | DEP-PROD-PROFILE | 1 | BLOCKED | No production (gridsmith.uk, indexable) static profile; build refuses any non-staging origin | Cutover phase |
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

**NOT READY — SPECIFIC TECHNICAL BLOCKERS**

The candidate is not "technically ready with only owner gates pending", because mandatory technical
evidence is missing or failing:

1. **CI-01** — no exact-SHA GitHub CI exists for any commit after `8fec6426`; local Windows runs
   are not CI evidence, and Lighthouse cannot run locally.
2. **BRW-RT-01** — the Option A browser path (now the only CI browser path) has never executed on
   Linux. Two defects that would have failed its first run were found and fixed here (BRW-EOL-01,
   BRW-02), which is a reason to expect more until it runs.
3. **Q5-01** — Master Q5 remains UNRESOLVED in CI (local passes on Chrome 148 and 155).
4. **Production delivery does not exist yet** — no production static profile, delivery channel,
   restore-proven backup or promoted intake (DEP-PROD-*, LEG-02, LEG-05), by design of the current
   phase gates.

Owner/legal/security decisions that will also be required before any release are listed in
[HANDOFF.md](HANDOFF.md). The shortest path to `TECHNICALLY READY — OWNER RELEASE GATES PENDING`:
complete DEP-PUSH-SAFETY → authorise one exact-SHA push (no dispatch) → classify its
Option A, Q5 and Lighthouse results on Chrome 155.

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
