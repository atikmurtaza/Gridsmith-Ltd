# CI approval packet — first exact-SHA CI run of the readiness candidate

Prepared 18 October 2026. **Not executed.** Nothing has been pushed. The exact commit SHA to approve
is stated in the approval request that accompanies this packet: it is the `HEAD` of the branch below,
whose parent is `ec1dd06ef32c2cc59a39345035f12117a35d310a` (the commit that adds this file cannot name
its own hash).

## 1. Branch

`claude/gs-r12-production-readiness-001` → pushed to `origin` (`atikmurtaza/Gridsmith-Ltd`, **public**)
as a **new** branch of the same name. No other branch is pushed. `main` (`fbecbe01`) and
`codex/gs-hostinger-artifact` (`bd8dd825`) are untouched.

## 2. Commit

The full SHA given in the approval request. Base chain on origin today:
`claude/sweet-mendel-11qvli` = `8fec6426…`. The push uploads **19 commits** on top of it:

- 2 owner commits that exist only locally today: `ddf9d9aa` (footer focus / live reduced motion),
  `e854ad87` (Press entrance contrast) — the agreed baseline.
- 17 readiness commits: `59efa2d4`…`ec1dd06e` (16) plus the commit adding this packet.

History note: the readiness commits after `7a1b662a` were rewritten locally (never pushed) to remove
production-site security-alert details and hosting-account specifics from a public repository; the
final tree is byte-identical to the redacted tree. Mapping: `3d91e567→45522cc7`,
`c6bb5030→e720c939`, `78052aac→ff2a0558`, `effa6177→ec1dd06e`.

## 3. Files (48 changed versus origin's `8fec6426`, plus this packet)

Workflows and config: `.gitattributes`, `.github/workflows/ci.yml`, `.github/workflows/hostinger-staging.yml`,
`config/browser-input.json`, `config/browser-provenance/{google-chrome-155.InRelease,google-chrome-155.Packages,google-linux-signing-key.asc}`,
`package.json`, `package-lock.json`.

Application: `components/chrome/chrome.module.css`, `components/consent/{ConsentBanner.tsx,bundle-size-probe.ts,consent.module.css}`,
`components/divisions/press/press-home.css`, `components/master/{MasterScene.tsx,scene.ts}`.

Scripts: `scripts/browser-input.mjs`, `scripts/browser-input.selftest.mjs`, `scripts/browser-launch.mjs`,
`scripts/check-bundle-size.mjs`, `scripts/check-dependency-overrides.mjs`, `scripts/check-dependency-overrides-ftp.mjs`,
`scripts/check-edge-ui.mjs`, `scripts/check-lhci.mjs`, `scripts/check-master-accessibility.mjs`,
`scripts/check-master-accessibility.selftest.mjs`, `scripts/check-press-scene.mjs`, `scripts/check-static-artifact.mjs`,
`scripts/check-static.selftest.mjs`, `scripts/extract-verified-browser.py`, `scripts/extract-verified-browser.selftest.py`,
`scripts/press-writing-contrast.mjs`, `scripts/source-files.mjs`.

Docs: `docs/_shared/{05-HANDOVER.md,AI-HANDOFF.md,PROJECT-STATUS.md,GS-R12-BROWSER-OPTION-A-IMPLEMENTATION.md}`,
`docs/master/DESIGN.md`, `docs/press/DESIGN.md`, `docs/_shared/GS-R12-PRODUCTION-READINESS-001/*` (10 files).

Public-content review of the push delta (+8,267 lines): no credentials, keys, tokens or private
keys (pattern scan; the one hit is a constructed test specimen); emails are the public business
address, synthetic test addresses and package metadata; the phone number is already public.

## 4. Workflow and event

`.github/workflows/ci.yml` ("CI"), event **`push`** (`on.push.branches: ['**']`). Runs job **`verify`**
only (`ubuntu-24.04`, `permissions: contents: read`, `persist-credentials: false`, no secrets — only
the public repository variable `GS_H4B_PREVIEW_PUBLISHABLE_KEY`). Job `hostinger-staging` has
`if: github.event_name == 'workflow_dispatch' && …` and is **skipped** on push. No `pull_request`
(no PR is opened), no `workflow_dispatch`. The registered "Smoke" workflow has no file on this branch,
so it cannot run from it. No `timeout-minutes` (GitHub default 360 min); historical runtime 70–85 min.

## 5. External deployment hooks

| Hook | Status | Evidence |
|---|---|---|
| Repository webhooks | **None** | `gh api …/hooks` → 0 (18 Oct) |
| Rulesets / branch protection | None | GET (18 Oct) |
| GitHub Pages | None | 404 (18 Oct) |
| GitHub environments | `Preview`, `Production` exist, 0 protection rules, **not referenced** by the workflows | GET (18 Oct) |
| Vercel | **0 projects linked to this repository**; the one project (`gridsmith-ltd`) shows no Git link; `vercel.json` `git.deploymentEnabled: false` | Vercel API read (18 Oct) |
| Hostinger staging | Pulls only `codex/gs-hostinger-artifact`; auto-deploy OFF | **13 Oct observation — UNVERIFIED today** (no read API here) |
| Hostinger production (`gridsmith.uk`) | Git not connected | **13 Oct observation — UNVERIFIED today** |
| Other installed GitHub Apps | Permissions and push/deploy behaviour | **UNKNOWN** (installation API not readable with this token) |

## 6. Why this is safe, and what is not verified

Safe by repository configuration: a push event cannot reach the publishing job; the verify job has a
read-only token and no secrets; Vercel has no project linked to the repo; there are no webhooks.
**Not verified:** today's Hostinger panel state (auto-deploy and branch for staging; Git for
production) and the behaviour of the other installed GitHub Apps. The owner should confirm both
immediately before approving. A push to a public repository also **publishes** the 19 commits; that
cannot be undone by deleting the branch.

## 7. Expected tests (in order; a failing step stops the job)

1. Option A: `browser-input.selftest` (406 JS + 140 Python), `install-controls`, `provision`
   (downloads the pinned Chrome `.deb` and key from `dl.google.com`), `npm ci`, `browser-input check`.
   **First Linux execution ever** — a failure here ends the run early and is itself the evidence.
2. `typecheck`, `lint`, 35 static/selftest steps including `check:deps:overrides` (FTP branch runs in
   a child; no retry on Linux).
3. `build`, `lint:secrets`, `check:tokens`, `check:theme`, `size` (expected PASS at 2.8732 vs 2.9KB).
4. LHCI desktop and mobile on Chrome 155 (first real exercise of the `uuid` override's LHCI path).
5. 18 served gates incl. `check:master:scene` (Q5 diagnostic on Chrome 155), Press, Design, Digital,
   axe, responsive, legal parity.

External reads during CI: npm registry, `dl.google.com`, Sanity **development** dataset (tokenless),
the isolated Preview Supabase project via the publishable key (no service-role key in CI, so served
lead checks cannot write rows or send mail).

## 8. Expected artifacts

`lighthouseci-reports`, `design-scene-evidence`, `master-scene-evidence` (Q5 PNG/JSON if Q5 fails).
No deployment artifact (`hostinger-static` is built only by the skipped staging job).

## 9. Rollback / recovery

- Nothing deploys, so there is nothing to roll back on any site.
- If anything unexpected happens (e.g. a provider reacts to the push): stop and report; with separate
  owner authority, cancel the run (`gh run cancel`), delete the remote branch, and if staging changed,
  apply the documented staging rollback (RUNBOOK §4). Production WordPress is outside every path.
- Publication of the commits to the public repository is irreversible.

## 10. Owner approval wording

> I approve pushing branch `claude/gs-r12-production-readiness-001` at commit `<full SHA from the
> request>` to `origin` (atikmurtaza/Gridsmith-Ltd) as a new branch, publishing its 19 commits
> including `ddf9d9aa` and `e854ad87`. This authorises exactly one push-event CI run of
> `.github/workflows/ci.yml` (verify job only). No `workflow_dispatch`, no pull request, no retry,
> no other branch, no deployment, no provider or DNS change. I have confirmed in Hostinger that
> staging auto-deploy is OFF and production Git is not connected.
