# GS-R12-PRODUCTION-READINESS-001 — handoff

**Decision: BLOCKED — REQUIRED OWNER OR EXTERNAL ACTION** (see [LEDGER.md](LEDGER.md) §3, §8). Exact-SHA CI [39378746236](https://github.com/atikmurtaza/Gridsmith-Ltd/actions/runs/39378746236) is green on `17080169`.
Two owner-approved pushes: 18 Oct `d3d5ba46` (CI 39151214971, failed at Option A provision) and 20 Oct `17080169` (CI 39378746236, **success**, all 57 steps). `hostinger-staging` was skipped both times; nothing was published or deployed. No provider, DNS or Docker action was taken.

**20 Oct, GS-R12-FINAL-RELEASE-PREPARATION-001:** consolidated owner decisions are in [RELEASE-DECISION-PACK.md](RELEASE-DECISION-PACK.md); results are in LEDGER §9. Production CMS 47/47 equals the repository payload; the production-dataset staging artifact builds (identity `7e0b5ffd…`) and passes `check:static:ui`. Google's stable Chrome is now `.84`, so the `.79` pin (BRW-03) is time-sensitive. Decision unchanged.

**20 Oct, GS-R13-PRODUCTION-PROFILE-001 (owner-authorised, local):** the gridsmith.uk static profile is implemented and refuses to build until the Production intake URL and all seven PUBLISHABLE states exist. The rehearsal and staging regression are verified locally. Record: [GS-R13-PRODUCTION-PROFILE-001.md](../GS-R13-PRODUCTION-PROFILE-001.md); LEDGER §10.

**20 Oct, GS-R13-H4B-PRODUCTION-INTAKE-READINESS-001 (local):** the Production intake package (restore-proven backup tool, Production-capable Edge profile, exact deploy/test/cleanup/rollback steps) is ready for one approval; nothing deployed. Production is verified read-only: leads 0, ledger 0001–0004, H4-B absent. Record: [GS-R13-H4B-PRODUCTION-INTAKE-READINESS-001.md](../GS-R13-H4B-PRODUCTION-INTAKE-READINESS-001.md); legal decisions in [LEGAL-PUBLICATION-APPROVAL.md](LEGAL-PUBLICATION-APPROVAL.md); LEDGER §11.

**20 Oct, GS-O025 (local, not active):** twice-daily read-only Supabase availability check for both projects (least-privilege `gridsmith_keepalive` role) and an hourly, live-only, drain-only notification workflow. Both are dormant until you activate them; the H4-B deployment must now use the GS-O025 commit. Record: [GS-O025-SUPABASE-AVAILABILITY.md](../GS-O025-SUPABASE-AVAILABILITY.md); LEDGER §12.

**20 Oct, GS-O025 round 2:** the keep-alive is ready to activate. Manual runs fail loudly when switched off; an optional Healthchecks.io heartbeat detects missed runs. The single 10-step procedure is in GS-O025 §8 and needs your Hostinger H2/H3 confirmation before its 4-file `main` commit.

**20 Oct, GS-O025 activation (16:49 UTC):** the four files are on `main` (`dbde73d3`). Preview's keep-alive passes with real activity; Production's still fails at login, and every provider-side cause has been ruled out. Next: you run `bash scripts/diagnose-keepalive-url.sh` on the Production address. `main`'s red CI is dataset drift exposed by any push, not caused by the files (LEDGER §12.4).

**20 Oct, 23:40 UTC, GS-O025 ACTIVE:** both keep-alive jobs pass (run 39516560037; Production calls 0 → 4, Preview 12 → 16). The root cause was the Production secret using pooler cluster `aws-0` instead of `aws-1`. Owner tools are now PowerShell one-liners (`gs-o025-rotate-production-keepalive.ps1`, `gs-r13-backup-production.ps1`). Next: the H4-B approval (LEDGER §12.6).

**21 Oct, GS-R13-H4B-PREP-002:** the intake execution plan is final (H4-B record §G). Your manual part is two PowerShell commands, each with one hidden prompt (backup: database password; secrets: Resend key). Claude does the gate, the one-transaction migration, the deploy, probes, synthetic test and cleanup. The sender for the test is `onboarding@resend.dev`; gridsmith.uk must be verified in Resend before `live`.

**21 Oct, 00:39 UTC, GS-R13-H4B-EXEC-001 PASS:** the Production intake is deployed in `synthetic-only` mode with the drain off. Steps: a restore-proven backup, migration `b807e3ed6d4f`, six digest-verified secrets, both functions from `e3e14701`, 22 negative probes, and one synthetic notification you received; the lead was then deleted (leads 0, outbox 0). `live`, the drain, Resend domain verification, the website and any push each need their own approval. Record: H4-B record §H; LEDGER §12.8.

**21 Oct, GS-R14-001 (local):** Resend has verified gridsmith.uk. The temporary-domain release candidate (`418aeac3`, Production intake, noindex) passes locally. Deployment and the Production Edge sender/origin change wait for one approval; record [GS-R14-001](../GS-R14-001-TEMPORARY-DOMAIN-RELEASE.md) §7.

## Where things are

- Worktree: `C:\Users\atikm\.codex\worktrees\gs-r12-production-readiness-001\Gridsmith Ltd`
- Branch: `claude/gs-r12-production-readiness-001` — on origin at `17080169`; the docs commit recording run 2 is local only
- Base: `e854ad87` (tree `be9cf685`). Owner checkout and the Option A worktree were never modified.
- State file for resuming: [checkpoint.json](checkpoint.json)

## Local commits on the branch

| SHA | What |
|---|---|
| `59efa2d4` | `.gitattributes`: keep hash-pinned Option A provenance bytes exact (fixes a guaranteed CI failure) |
| `fe72bdbc` | Option A browser provisioning imported byte-for-byte from the reviewed worktree |
| `e6390bd6` | Consent footer-focus effect without down-levelled syntax (shared baseline 2.9143 → 2.8732KB; behaviour unchanged) |
| `0784d7d3` | Static artifact secret scan recognises Supabase `sb_secret_` keys |
| `8c1fd41e` | Offline assertions for the delivered Hostinger security-header/CSP policy |
| `6b441ad3` | Security overrides: tmp 0.2.7, uuid 11.1.1, basic-ftp 6.2.3 + consumer regression `check:deps:overrides`; Option A pins moved |
| `98672fe2` | Option A `--version` predicate accepts real Linux Chrome's channel token (fixes a likely first-run CI failure) |
| `bb2343fd` | Lint fix for the regression script |
| `cf2cd083` | Independent-review fixes: numeric HSTS check; root stop, consumer check and lock-wide check in `check:deps:overrides` |
| `e2744e54` | `check:press:scene` settles state-cue labels before measuring (timing defect; failed deterministically on this tree) |
| `d3013441` | `check:edge:ui` waits for the thank-you title instead of racing the router |
| `7a1b662a` | Lock-wide override check also counts npm-aliased copies (second independent review) |
| `e720c939` | **Owner decision BLD-01:** shared-baseline budget 2.8 → 2.9KB, reason recorded; stale probe re-sized so the assertion stays provably reachable |
| `ff2a0558` | `check:deps:overrides` FTP behaviour isolated in a child; one reported re-run only for a Windows native node.exe crash |
| `ec1dd06e`, `d3d5ba46` | Readiness docs and approval packet 1 (pushed with the first run) |
| `493e3cad` | **Local.** GnuPG 2.4 `KEYEXPIRED` no longer treated as a verdict (cause of run 39151214971) |
| `e4dfe8f8` | **Local.** Loader/provider closure fixed for Ubuntu 24.04 merged `/usr` before it could fail (LEDGER §7) |
| `d9cb6c15` | **Local.** Independent-review follow-up to `e4dfe8f8` (stricter ownership, re-measure, 9 more tests) |

Local acceptance on the final tree: everything passes (`size` after the owner's BLD-01 budget decision); Master Q8 passed
once the host was idle; Lighthouse cannot run on Windows. Details in BUILD-REGRESSION.md.

## Reports

[SECURITY.md](SECURITY.md) (B) · [BROWSER-CI.md](BROWSER-CI.md) (C) · [A11Y-Q5.md](A11Y-Q5.md) (D) ·
[APP-HOSTING-SECURITY.md](APP-HOSTING-SECURITY.md) (E) · [BUILD-REGRESSION.md](BUILD-REGRESSION.md) (F) ·
[RUNBOOK.md](RUNBOOK.md) (G) · decision in [LEDGER.md](LEDGER.md) §3 (H).

## Owner decisions needed, in the order that unblocks the most

1. ~~**BLD-01**~~ — **decided 18 Oct 2026:** budget raised to 2.9KB to keep the SC 2.4.11 fix; `size` passes.
2. ~~**CI-01**~~ — **done:** CI 39378746236 green; BRW-RT-01 and Q5-01 PASS on the exact SHA. Confirm the Hostinger panel state (not received with the second approval).
3. **BRW-03** — a durable authenticated source for the pinned Chrome `.deb` (Google prunes old
   stable builds).
4. **Security residuals** — dispositions for extract-zip ×2, braces, sprintf-js (no published fixes).
5. **Q5-01** — agree the classification protocol; consider the proposed `CAPTURE INVALID` verifier
   addition.
6. Publication/cutover set (only when moving to production): LEG-01/02/04–11/14, POL-01 (phone
   number policy vs GS-O004), SEC-F4, SEC-F5, ACC-08, DEP-WP-ROLLBACK-TARGET, BPH-05.

## Resume

Read `checkpoint.json`, then `git -C <worktree> log --oneline e854ad87..HEAD` and `git status`.
Re-run order if needed: `npm ci` (with `PUPPETEER_SKIP_DOWNLOAD=true`) → `npm run verify:static` →
clean build + build gates → `with-server` served list → `check-master-accessibility`. Leave `CI`
unset on Windows; Lighthouse self-skips there.
