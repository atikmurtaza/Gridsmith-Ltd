# GS-R12-PRODUCTION-READINESS-001 — handoff

**Decision: NOT READY — SPECIFIC TECHNICAL BLOCKERS** (see [LEDGER.md](LEDGER.md) §3).
Nothing was pushed, published or deployed; no provider, DNS or Docker action was taken.

## Where things are

- Worktree: `C:\Users\atikm\.codex\worktrees\gs-r12-production-readiness-001\Gridsmith Ltd`
- Branch: `claude/gs-r12-production-readiness-001` (local only; not on origin)
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

Local acceptance on the final tree: everything passes (`size` after the owner's BLD-01 budget decision); Master Q8 passed
once the host was idle; Lighthouse cannot run on Windows. Details in BUILD-REGRESSION.md.

## Reports

[SECURITY.md](SECURITY.md) (B) · [BROWSER-CI.md](BROWSER-CI.md) (C) · [A11Y-Q5.md](A11Y-Q5.md) (D) ·
[APP-HOSTING-SECURITY.md](APP-HOSTING-SECURITY.md) (E) · [BUILD-REGRESSION.md](BUILD-REGRESSION.md) (F) ·
[RUNBOOK.md](RUNBOOK.md) (G) · decision in [LEDGER.md](LEDGER.md) §3 (H).

## Owner decisions needed, in the order that unblocks the most

1. ~~**BLD-01**~~ — **decided 18 Oct 2026:** budget raised to 2.9KB to keep the SC 2.4.11 fix; `size` passes.
2. **DEP-PUSH-SAFETY + CI-01** — complete the provider checklist, then authorise one push of the
   final SHA (no dispatch). That run is also the first Linux execution of Option A (BRW-RT-01) and
   the Q5 diagnostic on Chrome 155 (Q5-01).
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
