# GS-LAUNCH-009 — Security remediation and verification recovery

25 October 2026 (Europe/London). **Local remediation; publication HOLD.**

Baseline: `628f502ad5cf1658418964e4456790926844952c`, `codex/gs-launch-008`.
Branch: `codex/gs-launch-009`. Worktree:
`C:\Users\atikm\.codex\worktrees\gs-launch-009\Gridsmith Ltd`.
The phase commit is the commit containing this report:
`git log -1 --format=%H -- docs/_shared/GS-LAUNCH-009.md`.
Exact file hashes, raw audit objects, command receipts and statuses are recorded in
`GS-LAUNCH-009-EVIDENCE.json`; raw logs remain under ignored `build/gs-launch-009/`.

## Verification recovery

GS-LAUNCH-008 had no installed dependency tree. Its late sitemap fixture imports TypeScript at
`scripts/check-static.selftest.mjs:569`; TypeScript was already correctly declared as a development
dependency and locked at 6.0.3. No source repair or new dependency was necessary. A fresh independent
local clone at `C:\Users\atikm\AppData\Local\Temp\gs-launch-009-local`, detached at the exact
baseline, installed its unchanged lockfile with Node 24.15.0/npm 11.12.1. The entire unchanged
static selftest then passed, including the sitemap fixture that had stopped GS-LAUNCH-008.

The GS-LAUNCH-007 Windows junction still points to the primary checkout's `node_modules`.
It was neither removed nor installed through. Both this independent clone and the phase worktree
use their own ordinary dependency directories. Final verification uses a fresh `npm ci` in the
phase worktree, not the baseline clone or the shared junction. Puppeteer's automatic download is
disabled throughout installation.

No Docker create/run was retried. The existing Ubuntu WSL distribution was inspected without
changing its configuration: Ubuntu 26.04, Python 3.14.4, no Linux Node or Apache. The authenticated
browser policy permits Ubuntu 24.04 or local Debian 12. Ubuntu 26.04 is outside that policy.
No OS-policy, loader, browser-identity or archive check was relaxed. Windows browser-control
fixtures use the explicit supported `--python` option and bundled Python 3.12.14; the first attempt
using Windows' unavailable `python3` alias is retained as FAIL, followed by the explicit-interpreter
run. Synthetic browser-control fixtures are not an authenticated browser execution.

## Compatible dependency changes

| Dependency | Before | After | Basis |
|---|---|---|---|
| Direct/Sanity Zod 4 | 4.4.3 | 4.6.6 | First patched release; satisfies Sanity consumers' existing `^4.4.3` ranges. Direct requirement now pins the verified minimum. |
| LHCI → Express 4.22.3 → body-parser | 1.20.8 | 1.20.9 | First 1.x patch; Express accepts `~1.20.5`. No Express migration or override. |
| get-it/jsdom/dts-plugin → Undici 7 | 7.29.1 | 7.30.1 | First patch for three newly reported advisories; existing compatible ranges retained. Existing dts-plugin scoped pin advances to 7.30.1. |
| GitHub Actions tooling → Undici 6 | 6.28.1, two copies | 6.29.1 | First 6.x patch for its two applicable advisories; existing `^6.23.0` ranges retained. |

Only those five installed package entries change in the lockfile. No new dependency, new override,
major framework upgrade, audit suppression or validation-schema edit is introduced. Browser input
and fixture package/lock digests advance to the reviewed final bytes; signed Google provenance,
browser version/inventory, consumer checks and workflow digests remain unchanged.

The fresh baseline audit has moved since GS-LAUNCH-008: it includes Undici findings already present
in the starting lockfile. Those small compatible patches are included to meet this phase's
zero-production-findings objective; they are not attributed to the Zod/body-parser updates.

Primary sources, checked during this phase:

- [Zod constrained collections](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5),
  [unpatched v3 status](https://github.com/colinhacks/zod/issues/6653).
- [body-parser compressed input](https://github.com/advisories/GHSA-27r3-jxmh-p828),
  [1.20.9 release](https://github.com/expressjs/body-parser/releases/tag/1.20.9).
- Undici [SSE retained state](https://github.com/advisories/GHSA-4qv8-2p9j-2685),
  [mixed-case integrity](https://github.com/advisories/GHSA-f72v-6w45-q472),
  [excess content encodings](https://github.com/advisories/GHSA-xjj6-f33q-929c).

### Permanent compatibility and adverse subjects

The existing dependency-consumer gate is extended, rather than adding a competing gate.
It reads each real consumer's resolution and checks every locked body-parser/Undici copy, including
aliased/nested adverse fixtures and both patched Undici major versions. Existing lead-security,
Press branch, Edge mocked-transport and Freelancer validation tests cover application callers;
no live form or intake is activated or contacted.

Small Zod array/max/length, set/map and overwrite-order specimens preserve ordinary validation
and assert early constrained-collection rejection. Running the permanent array fixture against the
independent old installation reports three visited elements where zero is required. No large
allocation or production-schema change is involved.

LHCI's actual Express parser receives a deflate frame and, only after its parser callback,
1,024 trailing bytes. Both ordinary completion and preservation of a second raw-body hash consumer
are asserted over loopback. These compatibility subjects also pass on the baseline Windows runtime:
they do not constitute reproduction of the old denial of service. The old version is rejected
separately by the permanent installed/lock minimum-version predicates.

Undici specimens cover both installed majors: bounded SSE retained-item counts, five accepted
identity codings, six refused gzip codings followed by premature EOF, and v7 mixed-case correct/
incorrect integrity plus stronger-hash precedence. The existing dts-plugin Agent option and fetch
interfaces are exercised against loopback. No external endpoint or untrusted archive is used.
Adverse runs and their exact limits are retained in the evidence, including an initial SSE fixture
property error corrected from `event.data` to the actual `event.options.data`. That initial error
is not credited as a vulnerability proof. Old v7 integrity runs reach a missing-rejection assertion
and then encounter Windows native teardown status `0xC0000409`; the assertion and the native fault
are reported separately. The old decoder subject produces an unhandled socket error. No failed
or native-crash result is relabelled PASS.

## Residual toolchain risks and owner decisions

`chromium-bidi@14.0.0` requires Zod `^3.24.1` and retains `3.25.76`. There is no published v3 patch.
Zod 4's bundled `zod/v3` code is not fixed merely by the outer package version changing. No consumer
is forced across that major boundary and no claim of complete Zod remediation is made.

Both extract-zip advisories remain active with no patched 2.x release:
[GHSA-jmr9-qjv8-65gv](https://github.com/advisories/GHSA-jmr9-qjv8-65gv) and
[GHSA-7pqw-9j4j-h8q3](https://github.com/advisories/GHSA-7pqw-9j4j-h8q3).
The [upstream proposed fix](https://github.com/max-mapper/extract-zip/pull/160) remains open.
Puppeteer/core 24.43.1 → browser tooling 2.13.2 → extract-zip 2.0.1 remains installed.
LHCI 0.15.1 → Lighthouse 12.6.1 independently retains puppeteer-core 24.

Current Puppeteer 25.16.0 has a different extraction implementation and Zod 4 consumer, but it is a
major API/tooling migration. LHCI still pins Lighthouse 12.6.1, so updating only top-level Puppeteer
would leave the old chain. No compatible complete replacement was established in this phase.
Do not apply audit's suggested LHCI downgrade, arbitrary transitive replacements or a v3-to-v4
Zod override. A coupled browser/Lighthouse migration requires its own compatibility programme.

Remaining findings concern build/test machines, not a Node server installed on Hostinger.
The website remains static and direct-contact only. Controlled clean installs suppress automatic
browser ZIP download; browser input remains independently authenticated; use isolated unprivileged
builds without privileged credentials and reviewed inputs. Those controls constrain exposure;
they do not patch the installed code or make arbitrary archive/BiDi input safe.

No risk acceptance is recorded. Any later owner disposition must name the residual Zod and both
extract-zip advisories, remaining invocation/input paths, controls, maintenance owner and review
date/trigger. Exact-source remote CI, publisher safety, hosted/manual acceptance and all legal/
cutover approvals remain separate. GS-LAUNCH-007's passes cannot verify this changed lockfile.

## Final verification matrix and exact bindings

All credited current checks ran on Windows with Node 24.15.0/npm 11.12.1 in the independent phase
worktree. The baseline-recovery proof used its separate exact-baseline clone. Raw commands, UTC
start/end times, exit codes and log SHA-256 values are retained in the evidence JSON. Windows
Lighthouse's zero exit means SKIPPED and is recorded as NOT RUN.

| Check | Final result | Evidence/limit |
|---|---|---|
| Fresh final `npm ci` | PASS | 1,568 packages; unchanged final lockfile; own ordinary dependency directory. |
| Production audit | PASS | Zero findings, exit 0; baseline had two high affected entries. |
| Full audit | FAIL | Nine high affected entries, exit 1; baseline had 18 entries (11 high, seven moderate). Three residual advisory IDs, not nine independent vulnerabilities. |
| Complete `npm run verify:static` | PASS | Full aggregate, including previously interrupted TypeScript/sitemap subject. Static foundation: 141 rejection proofs; direct-contact/error: 23 adverse cases. |
| Legal selftests/adoption | PASS | 125 adoption cases, 39 parity assertions; seven coherent OWNER_ADOPTED documents. Offline predicates; hosted parity not run. |
| Company facts | PASS | 82 selftest cases; served browser company gate not run. |
| Application validation/consumer tests | PASS | Existing lead/Press/Edge mocked fixtures plus 19 dependency resolutions and new adverse collection/HTTP/SSE/integrity tests. |
| Browser-authentication fixtures | PASS | 411 installed-control cases plus 161 Python extraction fixtures; zero actual browser/installer calls. |
| Clean normal `npm run verify:build` | PASS | `.next` was absent before build; Next 15.5.28, secret/token/theme checks and all 69 normal-route/lazy-scene budgets pass. |
| Production publication refusal | PASS, expected refusal | Actual builder exits 1 for all seven non-PUBLISHABLE documents. No deployable artifact created. |
| Fresh denied static rehearsal | PASS | 54 routes, 199 files, 28,695,308 bytes; all file-manifest hashes checked. |
| Contact/error artifact inspection | PASS | Approved native links, zero forms, one H1/main and meaningful lang/title on 404/500; 500 has no script; ordinary 500 mapping retained. Unserved HTML inspection, not keyboard/axe/HTTP acceptance. |
| Browser/keyboard/no-JS/reduced-motion/axe/scenes | NOT RUN | No permitted authenticated browser runtime. No prior candidate's pass is substituted. |
| Apache/Hostinger HTTP | NOT RUN | Apache is absent; existing simulation requires a separately permitted isolated Linux container. Actual Hostinger remains UNVERIFIED. |
| Desktop/mobile Lighthouse | NOT RUN | Existing Windows skip executes; approved Linux browser OS unavailable. No score is inferred. |
| Exact-SHA remote CI/manual/hosted acceptance | NOT RUN / UNVERIFIED | No push, dispatch or deployment; no human assistive-technology/device acceptance. |

The original Zod/body-parser-only aggregate passed before the Undici discovery and is retained as
superseded evidence. The final aggregate/build/audits above use the final fresh Undici installation.
Automatic review rejected a compound command containing conditional recursive `.next` cleanup.
That command did not execute. An independent absence check then established the directory did not
exist; the clean build ran without deletion. No rejected delete or Docker operation was retried.

Exact SHA-256 bindings:

- Final `package.json`: `97854c2b19e9ca55d5a793bfb5a768ce28d2856d7c44159ebdccfff2b64dad31`.
- Final `package-lock.json`: `f45a725650c64e81bc8d580569e012ad07ca3d254e8ffaa63fb22c6cc57a6fa3`.
- Verified effective source inventory: `6183608babaa0b274b6d799c1b554cb032992c97ed79e127744b9964cc422b88`.
  Defined as SHA-256 of `JSON.stringify` over sorted non-doc Git-tracked path/SHA-256 pairs;
  inventory and individual control/predicate hashes are bound in the evidence JSON.
- Fresh rehearsal identity: `ea5e6e16d4c65a6bebfbce274397175e487f93d535481896b071d68b3a390626`.
  Its actual build metadata is baseline source SHA plus `sourceModified:true`, because verification
  preceded the local commit. The separate source inventory identifies the exact tested candidate;
  do not describe this as a clean-commit artifact or exact-SHA CI. It remains `rehearsal:true`,
  `deployable:false`, direct contact, no intake origin, and `Require all denied`.

The final local commit adds these tested source bytes and the phase documentation. Its SHA is
resolved by the command at the start of this report and reported in the final handoff. Documentation
does not enter the effective source inventory. App/components/lib/styles/Sanity/public sources,
workflows, canonical legal texts/register and all original scene/contrast/Lighthouse predicates
remain unchanged against the baseline. Zero known-secret values were supplied to the fresh artifact
comparison; marker/source scans are not a certification against an unavailable secret inventory.

### Exact continuation commands for an owner-authorised Linux job

These commands were **not executed here**. They require a new, permitted, unprivileged Ubuntu 24.04
or Debian 12 environment, Node 24.15.0/npm 11.12.1, Python 3.12+, required signed-distribution browser
libraries, Apache, fresh exact source at `/work/repo`, no installed dependencies, and no credentials
or environment files. Set `GS_LAUNCH_009_SHA` to the reported local phase commit. Transfer the local
source under the approved job authority; no Git push or CI dispatch is implied. Do not retry the
previously rejected container creation without renewed permission/policy clearance.

```sh
set -eu
cd /work/repo
test "$(git rev-parse HEAD)" = "${GS_LAUNCH_009_SHA:?exact phase commit required}"
test -z "$(git status --porcelain)"
test ! -e node_modules
test ! -e .next
test "$(node --version)" = v24.15.0
test "$(npm --version)" = 11.12.1
export PUPPETEER_SKIP_DOWNLOAD=true NEXT_TELEMETRY_DISABLED=1 NEXT_BUILD_CPUS=1
export NEXT_PUBLIC_SANITY_DATASET=development NEXT_PUBLIC_SITE_URL=http://localhost:3000
mkdir -p build/gs-launch-009
node scripts/browser-input.selftest.mjs
node scripts/browser-input.mjs install-controls
node scripts/browser-input.mjs provision > build/gs-launch-009/browser-provision.json
export GS_BROWSER_JOB_DIR="$(node -p "require('./build/gs-launch-009/browser-provision.json').GS_BROWSER_JOB_DIR")"
export PUPPETEER_EXECUTABLE_PATH="$(node -p "require('./build/gs-launch-009/browser-provision.json').PUPPETEER_EXECUTABLE_PATH")"
export CHROME_PATH="$PUPPETEER_EXECUTABLE_PATH"
npm ci --no-audit --no-fund
node scripts/browser-input.selftest.mjs --installed
node scripts/browser-input.mjs check
npm audit --omit=dev --json > build/gs-launch-009/audit-production.json
if npm audit --json > build/gs-launch-009/audit-full.json; then
  full_audit_exit=0
else
  full_audit_exit=$?
fi
printf '%s\n' "$full_audit_exit" > build/gs-launch-009/audit-full.exit
npm run verify:static
npm run verify:build
GRIDSMITH_STATIC_PROFILE=production GRIDSMITH_PRODUCTION_REHEARSAL=1 npm run build:static
```

For the existing unchanged Apache simulation, that separately permitted job must also satisfy its
committed disposable-container guard and `/work/repo` path. Run
`GS_LOCAL_PROOF=GS-LAUNCH-007 node docs/_shared/gs-launch-007-proof/setup.mjs`, then
`apache2 -t -f /work/repo/docs/_shared/gs-launch-007-proof/apache.conf` and start Apache with
`apache2 -f /work/repo/docs/_shared/gs-launch-007-proof/apache.conf -DFOREGROUND` in a separate owned
session. Against that same new denied artifact, run sequentially:

```sh
STATIC_BASE_URL=http://127.0.0.1:3236 node scripts/check-hostinger-http.mjs --local-production
STATIC_BASE_URL=http://127.0.0.1:3236 node scripts/check-static-ui.mjs
GRIDSMITH_BUILD_TARGET=static GRIDSMITH_PRODUCTION_REHEARSAL=1 node scripts/check-lhci.mjs desktop
node scripts/lhci-report.mjs desktop
GRIDSMITH_BUILD_TARGET=static GRIDSMITH_PRODUCTION_REHEARSAL=1 node scripts/check-lhci.mjs mobile
node scripts/lhci-report.mjs mobile
GS_LOCAL_PROOF=GS-LAUNCH-007 node docs/_shared/gs-launch-007-proof/contrast.mjs
GS_LOCAL_PROOF=GS-LAUNCH-007 node docs/_shared/gs-launch-007-proof/negative-proofs.mjs
```

Retain commands, effective environment, exits, timestamps and hashed raw reports; preserve failed
runs separately, verify all original artifact hashes and source restoration, and stop only owned
processes. A successful Linux run would still not supply CI, hosted acceptance or publication authority.

## Readiness and next task

**Publication HOLD remains.** No deployable all-seven artifact or owner acceptance is created.
Seven canonical texts remain byte-identical and OWNER_ADOPTED, zero PUBLISHABLE; the entire legal
register and publication prerequisites are unchanged. Direct email/WhatsApp/SMS, Hostinger-only
static architecture, disabled intake/forms/analytics/reviews and three Technical exclusions remain.

The phase must not be called fully release-verified while authenticated browser/Lighthouse and
Hostinger HTTP regressions lack a permitted environment. Subsequent legal-publication preparation
is **not cleared as the next release stage** on partial verification. Existing nonpublishing owner
fact questions remain recorded by GS-LAUNCH-008; this phase neither edits those texts nor adopts
corrections.

One recommended next task: **complete exact-source verification on an authorised Ubuntu 24.04 or
Debian 12 environment with the unchanged authenticated browser path and Apache, and obtain the
explicit residual-toolchain disposition before the legal-publication preparation gate.**
Do not begin GS-LAUNCH-010 automatically.

No push, CI dispatch, hosted deployment, provider enquiry/write, production CMS/Supabase operation,
WordPress replacement, DNS/email change or live enquiry occurred. The older rehearsal remains
nondeployable and is not promoted.
