# CI approval packet 2 — second exact-SHA CI run (Option A fixes)

Prepared 20 October 2026. **Not executed.** The first approval (packet 1) was consumed by run
39151214971. This packet asks for one more push of the same branch. The exact SHA is stated in
the approval request; it is the branch `HEAD`, and the commit adding this file cannot name its own hash.

## 1. Branch and push

`claude/gs-r12-production-readiness-001` on `origin` (`atikmurtaza/Gridsmith-Ltd`, **public**).
It is currently at `d3d5ba462f0b0e26f505dfb466d486bb6991bef1` (checked read-only on 20 Oct). The
push is a plain **fast-forward** of that branch: no force, no other branch, no tag. `main` and
`codex/gs-hostinger-artifact` are untouched.

## 2. Commits added on top of `d3d5ba46`

| Commit | What |
|---|---|
| `493e3cad` | GnuPG 2.4 `KEYEXPIRED` for unused retired subkeys is no longer a verdict; `EXPKEYSIG` stays fatal (cause of run 39151214971) |
| `e4dfe8f8` | Loader/provider closure on Ubuntu 24.04 merged `/usr`: ownership of the resolved file (noble's libc6 DEP17 diversion), ld.so argv[0] = interpreter path, two batched ownership queries (LEDGER §7) |
| `d9cb6c15` | Independent-review follow-up: any diversion rejects, `/lib` alias only on merged `/usr`, files re-measured after attribution; selftest 161 (162 on Linux) |
| the requested SHA | Readiness docs: LEDGER §6–§7, checkpoint, HANDOFF, this packet |

Files: `scripts/extract-verified-browser.py`, `scripts/extract-verified-browser.selftest.py`,
`docs/_shared/GS-R12-PRODUCTION-READINESS-001/*`. No workflow, package, lock, manifest, provenance or
application file changes, so the hash pins in `browser-input.mjs` are unchanged. The delta must be
re-scanned for credentials before the push (packet 1 §3 method).

## 3. Workflow, event and hooks (read-only checks, 20 Oct)

- **Workflow:** same as packet 1 §4. Event `push` runs job `verify` only. `hostinger-staging`
  requires `workflow_dispatch` and is skipped.
- **Repository:** hooks 0, rulesets 0, Pages none, Actions secrets 0, default token `read`, open
  PRs 0, queued or in-progress runs 0. The only run on the branch is 39151214971.
- **Vercel:** 0 projects linked to the repository.
- **Not verifiable from here:** the Hostinger panel (staging auto-deploy and branch; production
  Git) and the other installed GitHub Apps. The owner should confirm these again.

## 4. What the run is expected to show

Provision now passes authentication and reaches stages never run on Linux, in this order: raw
download and identity, `dpkg-deb` streams, two archive passes, writing the tree, the loader/provider
closure (fixed offline), `chrome --version`, then `npm ci`, `check`, the static gates, the build, LHCI
and the served gates, including the Q5 diagnostic on Chrome 155.

Any first failure is itself the evidence. The run stops there and the result is diagnosed offline.
There is no retry, no dispatch and no further push without new approval.

Possible next failure points, with no known defect: runner timing for `dpkg-query`/ld.so; the CPython
3.12.3 `tarfile` data filter on real members; the real `--version` output; Puppeteer/LHCI with branded
Chrome 155.

## 5. Artifacts and rollback

As packet 1 §8–§9. Nothing deploys. Publishing the commits to the public repository is irreversible.

## 6. Owner approval wording

> I approve one fast-forward push of branch `claude/gs-r12-production-readiness-001` from
> `d3d5ba46` to `<full SHA from the request>` on `origin` (atikmurtaza/Gridsmith-Ltd), publishing the
> commits listed in APPROVAL-PACKET-2. This authorises exactly one push-event CI run of
> `.github/workflows/ci.yml` (verify job only). No force push, no `workflow_dispatch`, no pull
> request, no retry, no other branch, no deployment, no provider or DNS change. I have confirmed in
> Hostinger that staging auto-deploy is OFF and production Git is not connected.
