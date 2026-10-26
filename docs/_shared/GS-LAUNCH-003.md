# GS-LAUNCH-003 — Linux acceptance preparation, residual security and accessibility

23 October 2026. **LOCAL PREPARATION COMPLETE; publication NO-GO.** Two verifier defects are
corrected and locally verified. Residual security and normal-runtime SSR accessibility remain open.
No push, remote CI dispatch, deployment, hosted-site change, Production provider write, live enquiry,
email, DNS or WordPress operation is authorised or performed. GS-LAUNCH-004 is not started.

## Source and preservation

Requested candidate: `codex/gs-launch-002`, commit
`cbdae0dd27be09983f3b01463d04ee57422d852e`, clean when inspected at
`C:\Users\atikm\.codex\worktrees\gs-launch-002\Gridsmith Ltd`.
The primary checkout is `codex/gs-launch-001` at
`f6cdd6daa2ac52788d029d72170b14011d2f899f`, with 14 pre-existing changed/untracked files.
Their identities and bytes are captured without resetting, cleaning, stashing or switching that checkout.

Work uses a separate managed worktree:
`C:\Users\atikm\.codex\worktrees\gs-launch-003\Gridsmith Ltd`, branch `codex/gs-launch-003`,
starting at the requested candidate. Required prior reports, reconciliation/evidence/floor records,
current control files, owner register, static production controls and Hostinger release procedures
were read as source evidence. Historical hosted/CI results are not acceptance of this candidate.

The Linux subject is a clone from a complete local `git bundle` containing that exact HEAD and
ancestry, with its local origin removed. It has no host checkout, home, credentials, Docker socket
or provider configuration mounted. Only the source bundle is mounted read-only. Dependency installation
and build outputs live in the disposable container. Logs are copied through the Docker CLI.

No application, dependency version, threshold, adopted legal text or publication state is changed.
Two verifier corrections and the missing shared/CI invocation are described below. The mocked-form
adjudication adds independent visibility and adverse assertions; it does not dismiss form-control
findings. Verified tooling and phase records are committed locally on this branch. No push or
remote acceptance is implied.

## Workflow triggers and side effects

Both workflow files were read in full, including commands, permissions and the reusable publication
path. There is no protected `environment:` declaration or mapped `secrets` in either workflow.

| Workflow/job | Trigger and authority | Network and mutation effects |
|---|---|---|
| `ci.yml` / `verify` | Push to every branch; PR opened/reopened; manual dispatch. Ubuntu 24.04; `contents: read`; checkout history retained, credentials not persisted. | Google browser/key GETs, npm install/lifecycle execution, public Sanity development reads, loopback checks, GitHub cache/artifact writes. No deploy command in this job. Notification caveat below. |
| `ci.yml` / `hostinger-staging` | Manual dispatch only, after verify succeeds, excluding `main` and `codex/gs-hostinger-artifact`; `contents: write`. | Calls the reusable Hostinger workflow. **Manual CI dispatch is not verification-only.** |
| `hostinger-staging.yml` / `build` | `workflow_call`; same source-branch exclusions; `contents: read`; serialized concurrency, no cancellation. | Installs dependencies, runs static gates, reads public Sanity production, generates/uploads a public static artifact. It embeds the recorded Production intake endpoint and exact temporary Hostinger origin; building does not submit it. |
| `hostinger-staging.yml` / `publish` | After build; `contents: write`. | Checks source SHA/dirty flag/site/intake identity, replaces generated files on `codex/gs-hostinger-artifact`, commits and pushes. This is remote artifact publication. Downstream Hostinger auto-deployment is **UNVERIFIED**, so this path must be treated as potentially hosted publication. |
| Vercel/external publishers | `vercel.json` declares Git deployment disabled. | That declaration does not verify GitHub Apps, dashboard links/hooks, other projects/accounts, Pages, external jobs, SSH/FTP or Hostinger configuration. Current external publisher safety is **UNVERIFIED**. |

No reviewed workflow directly changes DNS, mail configuration, Supabase schema, secrets, CMS content
or WordPress. Absence of such commands does not establish provider-side trigger safety.

`check:axe` POSTs to loopback `/gridsmith-lead-probe` for validation and notification composition.
The route never inserts a lead, but its notification mode sends real Resend/Slack requests **if those
channels are configured**. The Linux server has neither those variables nor `.env` files; the actual
served response confirms notification `skipped (unconfigured)`. No host environment is inherited by
`docker exec`. Current CI maps a Preview publishable key but the current invoked suite does not use
it for a live RLS probe. No privileged production variable or test credential is required locally.

The separate authenticated `/api/rls-drift` GET includes attempted anonymous INSERTs and is not a
read-only operation. Neither reviewed workflow invokes it. It, live Edge/database/preview/outbox
proofs, seeds/migration writes and live reviews are excluded from this task's execution.

Static/source/transport fixtures can run offline after dependency installation. Normal/static builds,
launch and dataset checks read public Sanity; npm/browser acquisition use public repositories. Thus
the complete run is **provider-write-free, not wholly offline**. Lifecycle scripts retain their normal
behavior in isolation; source scanning is not a sandbox for arbitrary dependency code.

## Browser acquisition and local Linux environment

Linux/amd64 Docker Desktop engine is available. No WSL feature, host installation, Docker daemon,
context, service, network or global configuration was changed. Existing cached base:
`node@sha256:f22d6a1f082c02f292e86929b5b0442ac2e5eaf438a5dea9b1566601c3e05940`
(Debian 12, Node 24.15.0, npm 11.12.1). The container has a 6 GiB limit, four CPUs, bounded PIDs,
no-new-privileges and dropped capabilities except those needed for its disposable package setup.
Tests run as the unprivileged `node` user. No host port is published.

Browser shared libraries/fonts are installed only inside that container from the image's signed
Debian sources; package inventory and setup logs are retained. The initial browser fixture fails
because Debian Python 3.11.2 lacks `tarfile.data_filter`/`FilterError`; a signed Debian patch update
still lacks that API. No extractor fallback or validation bypass is added. The already cached
Debian-12 Python 3.12.15 runtime from
`python@sha256:edd0b3ec946cc68bd20e39480bd03929016d0fb6254cbf870cd3bc55ea25116d`
is copied into this container only; the temporary copy-source container is removed. The original
failures and superseding successful Linux fixtures are retained separately.

`PUPPETEER_SKIP_DOWNLOAD=true` is effective before `npm ci`. The unchanged pre-install gate binds
package/lock/workflow hashes, checks Git/npm/credential/configuration controls and rejects explicit
unguarded installers. Provisioning authenticates the fixed signing-key/InRelease/Packages chain,
current key status and exact package identity before extraction. HTTP redirects, changed lengths,
hashes and unsafe archive members fail closed. Private roots, directory-relative no-follow writes,
complete input/output inventories, ELF closure and OS-package attribution are retained.

Actual authenticated acquisition and post-install executable verification **PASS** for Chrome
`155.0.8059.79`, package `155.0.8059.79-1`, 143638568 bytes, SHA-256
`b7726070ca707965e9a17b38e4f15ba283bf6f65c339626c092862af7b19badc`.
Manifest SHA-256: `20ac446b365c2e9f08d83355f66e99f78c4065c93c49099c45ebd4754be0cb54`.
Puppeteer and Lighthouse enforce their executable paths separately. No floating/system Chrome or
ordinary ZIP downloader is substituted. Debian local acceptance does not establish Ubuntu CI acceptance.

## Residual dependency security

Fresh audits use the exact candidate lockfile, followed by clean Linux installation. Production
audit: **PASS, zero findings**. Full audit: **FAIL, 17 high affected package entries**, zero critical,
moderate or low findings, from **three underlying advisories**, all in toolchain dependencies.
No waiver, suppression, dependency substitution or major upgrade is applied.

| Advisory / installed leaf | Actual dependency consumers and input boundary | Compatible remediation disposition |
|---|---|---|
| [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm), `braces@3.0.3`, affected `<=3.0.3` | Next ESLint plugin → fast-glob → micromatch; Sanity CLI/codegen → globby → fast-glob/micromatch; codegen's nested chokidar → braces. The Next plugin's glob call depends on `settings.next.rootDir`, absent here. Sanity typegen/watch accepts configured query/schema paths; current scripts/workflows do not invoke it. No public-request pattern path was identified; this is not a proof of global unreachability. | Primary advisory lists no patched version; registry latest remains 3.0.3. Maintainer dispute does not withdraw the active advisory. Future 3.0.4 would satisfy the current ranges, but no such available fix is claimed. **OWNER APPROVAL REQUIRED** for any residual acceptance or separately reviewed replacement/fork. |
| [GHSA-jmr9-qjv8-65gv](https://github.com/advisories/GHSA-jmr9-qjv8-65gv), `extract-zip@2.0.1`, affected `<=2.0.1` | Puppeteer → `@puppeteer/browsers@2.13.2` → extract-zip; LHCI/`@lhci/utils` → Lighthouse 12.6.1 → puppeteer-core 24.43.1 → same browser installer. Ordinary ZIP installation accepts archive symlink targets. | No patched release; registry latest remains 2.0.1. Authenticated DEB provisioning and download suppression constrain the selected path but do not fix the vulnerable package. **OWNER APPROVAL REQUIRED**; residual remains unaccepted. |
| [GHSA-7pqw-9j4j-h8q3](https://github.com/advisories/GHSA-7pqw-9j4j-h8q3), same leaf/consumers | Archive duplicate symlink/file entries can cause a final-component write outside the destination. Explicit installer/API use remains possible outside the controlled workflow. | No patched release. [Upstream PR 160](https://github.com/max-mapper/extract-zip/pull/160) remains open and is not proof that both archive advisories are fixed. Future 2.0.2 would fit the parent range but is not an available remediation. **OWNER APPROVAL REQUIRED**. |

Installed `npm explain braces extract-zip --json` retains the actual transitive paths, not only
lockfile speculation. The existing regression gate passes all eleven remediated consumer resolutions
and temporary-file, UUID, loopback FTP, Markdown, Vite, sanitization and IP behavior tests. Separate
normal-behavior smoke tests exercise the actual braces expansion and browser consumer's ZIP extractor.
Those normal tests do not prove advisory remediation. Two abandoned diagnostic attempts are failures:
the first hit package export restrictions; the second expected the wrong exception for an oversized
pattern. Neither is credited as vulnerability reproduction, mitigation or absence of vulnerability.

Blind npm suggestions to downgrade LHCI/Sanity or upgrade Puppeteer across a major do not establish
compatibility or removal of every consumer. Aliasing braces to another glob implementation, aliasing
extract-zip to a different API, using an unmerged patch or maintaining a fork would be a separately
reviewable toolchain change; none is necessary merely to collect this evidence and none is applied.

For an approved replacement: bind exact source/version/integrity and all consumer resolutions;
retain normal glob/watch/archive behavior and permanent bounded fixtures for each advisory branch;
prove authenticated provisioning/download suppression, lint/build/browser/scene and both Lighthouse
axes; rerun production/full audits and exact-SHA CI. An owner risk decision must name all three
advisories, remaining invocation paths, controls, maintenance owner and review trigger. It is pending.

## M-P1-1 normal-runtime crash shell

**FAIL / unresolved accessibility blocker.** The permanent request-time SSR throw probe still
returns HTTP 500 with `<html id="__next_error__">` and no `lang`, H1 or main. This is independently
distinguished from the hydrated client-error boundary and from a branded 404/static error document.

Next 15.5.28's `getErrorRSCPayload` constructs that empty shell, then supplies GlobalError in the
router payload for hydration. The [tagged upstream source](https://raw.githubusercontent.com/vercel/next.js/v15.5.28/packages/next/src/server/app-render/app-render.tsx)
and installed `next/dist/server/app-render/app-render.js` agree. The application's unchanged
`app/global-error.tsx` already supplies `lang="en-GB"`, title, main and H1 and follows the
[supported Next 15 convention](https://nextjs.org/docs/15/app/api-reference/file-conventions/error).
Adding attributes there cannot alter the initial shell. A segment error boundary and a Vercel
public/500 document previously failed to cover this path; neither is blindly retried.

No supported minimal app-level correction was established. An `app/layout.tsx`, client language
patch, suppression flag, private Next patch or weaker probe would not safely close the requirement.
Known service failures can render accessible expected-error results, but do not cure generic
uncaught SSR crashes. A supported upstream framework fix must pass the existing normal/client/no-JS
SSR probes; an independently served proxy/host 500 document requires separate architecture and
hosting authority plus end-to-end 500/no-JS/recovery/security proof. Static hosting has its own
error-response acceptance and cannot be cited as a repair of normal Next runtime.

No application change is made; assertions and the permanent subject remain intact. Normal route,
hydrated error and adverse-control results are reported separately from this failure.

## Live-motion verifier correction

The original Linux served batch is **FAIL**, one of nineteen commands: the dedicated Master
accessibility gate passes twelve consent/focus cases but times out at both live-motion readiness
subjects. The other eighteen commands complete successfully, including all fourteen Master scene
questions, seven Design viewport stories and the Digital regression matrix. The original aggregate
is never relabelled green.

Actual diagnosis in an owned local server proves ordinary `/` selects the intended software-GPU
fallback with no active GL program; `/?scene=software` selects ready/SwiftShader with an active
program. The original gate never selected that already-existing test affordance. Its first
standalone diagnostic raced the original server's shutdown and failed connection; it provides no
application evidence and is superseded by the owned-server comparison.

The correction only adds the same explicit software Chrome flags used by `check-master-scene`
and selects `/?scene=software` for the two motion visits. Consent routes, twelve focus subjects,
both motion widths, live preference toggles, actual uniforms, resources, scroll assertions and
all thresholds remain unchanged. The application and ordinary software-GPU fallback are unchanged;
the independent full Master scene test still proves that fallback. The corrected full focused
run and static/consumer regression are recorded separately. This is a test-subject reachability
repair, not a repair of M-P1-1 or a physical GPU certification.

Ordinary CI previously invoked only the deterministic Master accessibility lifecycle selftest.
The existing live gate is now exposed as `check:master:accessibility` and included in both
`verify:served` and CI's served list. This adds no new provider path. Package/CI file hashes in
`browser-input.mjs` and the selftest's independent package expectation move with that reviewed
invocation; dependencies, lifecycle hooks, lock/browser identity and guard predicates do not change.
Two independent read-only reviews confirm the exact diff and Git-normalized LF hashes:
package `c3887b334f93f77ef7a4ee66c1639d2c1395f676b4cff039adb10940c320f9c4`,
CI `346a08373d6f8eb8b5dca02981980c0a916db63f0388535f2fcf68eed1bee9cc`.
The preparation helper's initial CRLF-written identities are explicitly retained as NOT ACCEPTED;
normalization and review occur before Linux verification or commit. Final install-controls, clean installation, static/parity checks and the new npm invocation are
verified separately against these final bytes; their results are identified in the command matrix.

## Mocked-form incomplete adjudication

The initial static-browser/mocked-form aggregate is **FAIL**: static UI passes, but the mocked-form
script rejects axe's `elmPartiallyObscured` result on contact's successful desktop submission.
Its raw receipt identifies `#gs-consent-heading` as both the subject and its related obscuring node;
there are zero violations. The old adjudication only recognised `elmPartiallyObscuring`. This is a
specific fixed-banner incomplete, not evidence that an input or message can be dismissed.

The existing gate now persists raw results before any assertion and admits only that exact heading's
self-reference with a nonempty related-node list containing no foreign element. The old accepted
reason remains. Seven committed positive/adverse assertions cover rule, target, reason and missing
or foreign related nodes. Every violation and every other incomplete still fails. Adjudication also
requires a fully visible rectangle, cumulative ancestor opacity one, opaque foreground/background,
five actual hit-tested points above other content, and the unchanged 4.5:1 ratio. A real 4×4 overlay
at a sampled point must fail the same geometry reader and is removed in `finally`; this is a
nonzero in-viewport adverse subject. An independent read-only accessibility review confirms the scope.

The corrected Linux proof **PASS**: four mocked form/width paths, ten focused axe states, zero
violations, with eight banner incompletes independently adjudicated. Actual contrast is 18.3535:1
on Master and 17.7155:1 on Press, with visible/unobscured/opaque results and the adverse overlay
rejected. No form-control incomplete is accepted. Validation, success, network, capacity, idempotency,
keyboard/focus and no-JS outcomes use the in-memory handler; no live Edge or customer submission occurs.
The first failed aggregate and raw diagnostics remain retained, not relabelled green.

## Linux verification results

Exact commands, timestamps, exit codes and SHA-256 of retained raw logs are collected in
`build/gs-launch-003/runs.jsonl`; the committed portable summary is
`GS-LAUNCH-003-EVIDENCE.json`. A zero characterisation exit does not turn M-P1-1 into a pass.

| Question | Current result |
|---|---|
| Clean dependency install with lifecycle scripts/optional packages | PASS, `npm ci --no-fund --no-audit`, 1572 installed packages. |
| Full static verification, legal hashes/adoption and adverse fixtures | PASS, `npm run verify:static`. |
| Clean normal Next 15.5.28 build | PASS, `rm -rf .next && npm run build`, no privileged variables or env files. |
| Secret/token/theme/bundle checks | PASS, all 69 route budgets; unchanged ceilings, repeated after final pin/invocation changes. |
| Browser acquisition, installation controls, installed consumer fixtures/identity | PASS on Linux with the recorded Python/runtime prerequisites. |
| Served axe/cookies/headers/redirects/legal/responsive/Press/content | PASS for those questions: 76 normal analyses + 2 deferred-footer analyses, zero violations/zero unresolved; 51 overflow combinations, 17 fixed bars, 7 legal documents/109 clauses/406 paragraphs, 11 review-suppression subjects, 10 fact questions over 18 routes. M-P1-1 remains separately FAIL. |
| Master/Design/Digital scenes and actual reduced-motion/focus behavior | PASS: all 14 Master questions at 12 viewports; hero at 4 phone/tablet + 14 desktop sizes; Design 7 sizes; Digital 2004 text boxes across 6 sizes. Corrected focused gate passes 12 consent/focus + 2 actual WebGL motion cases. Original aggregate remains FAIL; only the failed question is superseded. |
| Permanent bundle adverse probe and fresh restored build | PASS: clean probe-on build rejects specifically at shared baseline 2.96 KB > unchanged 2.9 KB ceiling, below the separate 3.0 KB floor tolerance; source subjects byte-identical. Fresh probe-off build restores all 69 passing budgets. |
| Lighthouse desktop/mobile and raw report retention | PASS, 33 runs/11 routes per axis; raw JSON/HTML and medians retained. This is Linux, not a substituted Windows pass. |
| Production-profile refusal/nondeployable rehearsal/static UI/mocked forms | PASS for their named questions, repeated against final tooling: Production refuses with exit one; rehearsal exits zero, `deployable: false`, deny-all `.htaccess`, 7 legal/3 Technical exclusions. Static UI: 13 pages, 13 axe analyses/zero violations and 13 no-JS subjects. Mocked forms: 4 paths, 10 axe states/zero violations; no live submissions. |
| Remote exact-SHA CI, hosted security/intake/manual acceptance | UNVERIFIED; no remote execution authority. |

The original source baseline, interim motion correction and final tooling bytes are separate
subjects in the receipt. Full scenes and Lighthouse measured the unchanged application/lock/browser
with the interim motion correction. Final package/CI hashes add only gate invocation; the final pass
reinstalls cleanly, repeats full static/installed-consumer checks, clean build/69 budgets, the full
new live npm gate, audits, guarded refusal, rehearsal, static UI and corrected mocked forms. No
application, dependency or performance-budget change justifies relabelling or repeating unrelated
scene/Lighthouse measurements. Neither local pass is remote exact-SHA acceptance.

## Exact command and evidence map

All Linux commands run in `/work/repo`, as `node`, with `HOME=/home/node`,
`PUPPETEER_SKIP_DOWNLOAD=true`, `NEXT_TELEMETRY_DISABLED=1`,
`NEXT_PUBLIC_SANITY_DATASET=development`, `NEXT_PUBLIC_SITE_URL=http://localhost:3000` and the
three verified browser variables recorded in the receipt. Container setup alone uses root.
The portable JSON records every full Docker argv, UTC timestamp, elapsed time, exit code, expected
exit, raw-log path and SHA-256, including unsuccessful prerequisites/diagnostics. Ignored raw evidence
is retained under `build/gs-launch-003/`; it is not a deployable bundle or part of the commit.

| Exact command / subject | Retained run or evidence |
|---|---|
| `npm ci --no-fund --no-audit` | `clean-install` and `final-clean-install` receipts; lifecycle and optional packages enabled. |
| `npm audit --omit=dev --json`; `npm audit --json` | Initial and `audit-final-production` / `audit-final-full` logs; full audit's nonzero exit is retained. |
| `npm explain braces extract-zip --json` | Installed consumer-path log; advisory API and registry JSON snapshots retained separately. |
| `node scripts/browser-input.mjs provision`; `node scripts/browser-input.mjs check` | Authenticated provisioning log, authentication/extraction/check JSON and final installed fixtures. |
| `npm run verify:static`; `node scripts/browser-input.selftest.mjs --installed`; `node scripts/check-master-accessibility.selftest.mjs` | Initial and final source-verification logs; deterministic positive/adverse fixtures. |
| `rm -rf .next && npm run build && npm run size && npm run lint:secrets && npm run check:tokens && npm run check:theme` | `final-clean-build`; deletion is confined to the disposable clone's `.next`. |
| `rm -rf .next && NEXT_PUBLIC_BUNDLE_SIZE_PROBE=1 npm run build`; `npm run size` | `bundle-adverse-build` and expected-red `bundle-adverse-size`; `bundle-subject-integrity`; `restored-normal-build`. |
| `node scripts/with-server.mjs` with each command in the paragraph below | `served-acceptance` raw log; all nineteen individual outcomes retained, aggregate exit one. |
| `A11Y_EVIDENCE_DIR=build/master-accessibility-final node scripts/with-server.mjs "npm run check:master:accessibility"` | `final-ci-live-gate`, full focused results JSON and screenshots. |
| `npm run check:lhci:desktop`; `node scripts/lhci-report.mjs desktop`; corresponding `mobile` commands | Four Lighthouse logs and both full raw report directories. |
| `GRIDSMITH_STATIC_PROFILE=production NEXT_PUBLIC_LEAD_INTAKE_URL=https://dqiutgmxillhsbzgnlsx.supabase.co/functions/v1/gs-lead-intake npm run build:static` | Initial and final refusal logs, expected exit one; no submission. |
| `GRIDSMITH_STATIC_PROFILE=production GRIDSMITH_PRODUCTION_REHEARSAL=1 NEXT_PUBLIC_LEAD_INTAKE_URL=https://qfgpwumvvtizeamkynes.supabase.co/functions/v1/gs-lead-intake npm run build:static` | Initial/final rehearsal logs, receipt and complete artifact hashes; no submission. |
| `python3 build/gs-launch-003/static-browser.py` | Owned loopback-only static server runs `node scripts/check-static-ui.mjs` and `node scripts/check-edge-ui.mjs` without `--live`; outer/inner logs and both receipts retained. |

The nineteen served commands, each individually quoted to `with-server.mjs`, are:
`npm run check:axe`, `npm run check:security-headers`, `npm run check:redirects`,
`npm run check:launch`, `npm run check:responsive`, `npm run check:consumer-terms`,
`npm run check:legal:parity`, `npm run check:vat`, `npm run check:press:type`,
`npm run check:press:scene`, `npm run check:path:live`, `npm run check:service-content:dataset`,
`npm run check:reviews:ui`, `npm run check:company`, `npm run check:master:scene`,
`npm run check:master:hero`, `node scripts/check-master-accessibility.mjs`,
`npm run check:design:scene`, `npm run check:digital:scene`. Despite its historical `:live` name,
Path Finder uses the served local probe; no production intake, CMS or database write occurs.

## Lighthouse measurements

Commands: `npm run check:lhci:desktop`, `node scripts/lhci-report.mjs desktop`,
`npm run check:lhci:mobile`, `node scripts/lhci-report.mjs mobile`. All four exit zero.
Lighthouse 12.6.1 with the verified Chrome 155 executable; 11 routes × 3 runs on each axis.
Desktop median benchmarkIndex 3999; mobile 3982. This local hardware is not GitHub's runner.
Mobile uses the unchanged 1638.4 kbps/150 ms RTT/4× CPU DevTools profile and the required
TLS HTTP/2 proxy; the report measures h2 on 651 requests, two render-critical resources per run.

Every route's median performance/accessibility/best-practices category score is **100/100/100**
on both axes. Desktop category assertions and the individual applicable SEO assertions pass;
mobile asserts accessibility and LCP/CLS/TBT, rather than a performance-category threshold.
Raw SEO is **66** because the local development site is deliberately non-indexable: `is-crawlable`
is zero, while title, description, HTTP status, link text, anchors, robots, hreflang and canonical
score one. This is not production-origin SEO or indexing acceptance.

| Route | Desktop LCP ms | Mobile LCP ms | Mobile TBT ms |
|---|---:|---:|---:|
| `/` | 609 | 921 | 32 |
| `/design` | 669 | 930 | 33 |
| `/digital` | 584 | 871 | 26 |
| `/press` | 644 | 1029 | 35 |
| `/press/services/publishing-preparation` | 606 | 908 | 28 |
| `/press/contact` | 647 | 915 | 29 |
| `/about` | 582 | 904 | 31 |
| `/approach` | 601 | 917 | 28 |
| `/insights` | 602 | 887 | 24 |
| `/contact` | 604 | 905 | 29 |
| `/legal/privacy` | 603 | 912 | 31 |

Rounded medians above; exact measurements and all runs are in the evidence JSON/raw reports.
Desktop TBT medians are zero. Design's median CLS is approximately 0.0001; other medians are zero.
All unchanged per-route mobile budgets pass. Scored normal pages do not cover or excuse the
known inaccessible SSR crash shell. INP, physical devices/GPUs and assistive technology remain
outside this automated local evidence.

## Release integrity and remaining gates

Seven canonical documents remain exact OWNER_ADOPTED versions, zero PUBLISHABLE; their individual
hashes and unchanged register are retained in the machine receipt. Legal wording, adoption process,
effective-date mechanism and publication prerequisites remain closed/preserved. Three GS-X002 Technical
records remain excluded; review and analytics activation remain prohibited. Current company facts
are England and Wales and “We aim to respond as soon as practicable.” Public Path Finder remains withheld.
The nondeployable artifact and local static browser checks supplement these source checks; they
do not certify the current hosted site.

No confidential client material or overseas-company ownership detail was identified in the
inspected public source/query surfaces. Project/client/team readers and public portfolio routes
remain excluded; CMS service/group/article bodies and assets can still carry arbitrary content.
Existing artifact/private-register marker checks and facts/review checks establish their named
boundaries, not a general confidentiality classifier. Artifact integrity and the existing private-marker/facts/review checks pass. A general human
confidentiality review of arbitrary CMS-derived content/assets and owner confirmation remain
**UNVERIFIED**; no whole-site confidentiality certification is claimed.

| Release gate | Status / owner |
|---|---|
| Residual toolchain advisories | FAIL; owner/security must approve a separately reviewed remediation or explicitly decide residual risk. No acceptance here. |
| Normal-runtime SSR crash shell | FAIL; engineering/owner must select and verify a supported framework or serving-boundary remedy before normal-runtime acceptance. |
| Ubuntu exact-SHA CI and durable performance acceptance | UNVERIFIED; engineering after exact execution authority/provider preflight. Local Debian results remain local. |
| Provider Git/App/webhook/Pages/hosting safety | UNVERIFIED; owner/provider administrator must supply current account/project/branch/hook/installation evidence. |
| Hosted/CDN/security/cookies/redirects and production-origin intake/sender/drain | UNVERIFIED; hosting/operator/owner; no synthetic live submissions or provider writes in this phase. |
| WordPress recovery, DNS/mail baseline and cutover rollback | UNVERIFIED; owner/hosting operator, hashed backup plus isolated restore and approved rollback window. |
| All-seven publication/channel/cutover authority | OWNER APPROVAL REQUIRED; exact artifact and existing register prerequisites, no status promotion here. |
| Devices, assistive technology and integrated owner visual acceptance | UNVERIFIED; owner/agreed human testers. Automated Chromium results do not certify WCAG conformance or physical GPU behavior. |
| Applicable agency/data-access/transfer/rights execution | OWNER APPROVAL REQUIRED before relevant access; public adoption is separate. |

## Requirements for later remote CI authority

1. Name the exact reviewed source SHA and branch, one push-triggered verify run, permitted GitHub
   cache/report uploads and Google/npm/public Sanity reads, with explicit no deploy/publication limits.
2. Prove current linked GitHub Apps, subscribed events, deployment hooks, Pages, Vercel projects/accounts,
   Hostinger source/artifact branch mappings and auto-deploy settings. Source YAML and old screenshots
   cannot close this gate. If this cannot be established, stop before pushing or dispatching.
3. Prove no notification/privileged/cron credentials or env files reach the runner/server; Preview
   public-key mapping is not a requirement for the current offline source/browser checks. Keep live
   RLS, Edge, outbox, CMS writes and reviews excluded.
4. Bind reviewed package/lock/workflow/browser metadata and supported Python prerequisites; preserve
   read-only installation permissions, nonpersistent credentials and download suppression. Retain raw
   browser/Lighthouse receipts, exact run SHA, statuses and logs. Decide the unresolved security and
   SSR acceptance boundaries explicitly rather than relying on a green characterisation.
5. **Do not use the current manual dispatch as a verification-only alternative.** It also authorises
   the reusable artifact publisher in source. Dispatch needs separate explicit artifact-branch and
   possible downstream publication authority, or a separately reviewed workflow change.

Next single recommended task: a separately authorised **M-P1-1 serving-boundary remediation design**.
Select a supported upstream Next fix or an independently served host/proxy 500 response, identify the
exact implementation/hosting scope, and define normal/client/no-JS SSR, status, recovery and security
proofs before implementation. Do not add a root layout, patch private framework code or weaken the
permanent probe. Residual toolchain acceptance remains an independent owner decision; it is not granted
by that design task. No recommendation authorises GS-LAUNCH-004 or any remote/provider action.
