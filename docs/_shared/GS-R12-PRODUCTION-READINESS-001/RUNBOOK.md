# G. Deployment and rollback runbook

**Nothing in this runbook has been executed by this phase.** It is the exact procedure to follow
once the owner grants each authority it names. Every step that writes to GitHub, Hostinger, DNS,
Supabase, Sanity, Vercel or WordPress is owner-gated. Provider facts below are point-in-time
observations (GitHub read-only GETs 18 Oct 2026; Hostinger/Vercel dashboards 13 Oct 2026,
`GS-R12-OWNER-PREFLIGHT-001`) and must be re-read immediately before use.

## 1. What exists today

| Surface | Fact | Source |
|---|---|---|
| Production `gridsmith.uk` | Hostinger-hosted **WordPress**; Git not connected; document root UNVERIFIED; open provider security alerts (details held by the owner outside this public repository). Nothing in this repository deploys to it. | OWNER-PREFLIGHT 13 Oct |
| Staging | `https://mediumaquamarine-wallaby-594070.hostingersite.com`, existing hosting account, `public_html`, static files only. Hostinger Git panel pulls the generated-only branch `codex/gs-hostinger-artifact`. | HOSTINGER-STAGING-WORKFLOW.md |
| Staging last-known-good | artifact commit `bd8dd825`, identity `28b841dd974216e4…`, source `6615d97c`, CI `37468717268` (6 Oct), 200 files, `sourceModified: false` | GS-HOST-H4-G |
| Staging auto-deploy | OFF at 13 Oct 11:11–11:20Z. **hPanel "Redeploy" silently turns it back ON.** | H4-D, H4-G |
| Vercel `gridsmith-ltd` | No Git connection, no deploy hooks, cron Disabled (dashboard). Project and historical deployments retained; API/CLI deploy not disabled. `main`'s `vercel.json` still declares the `/api/rls-drift` cron and lacks `git.deploymentEnabled: false`. | OWNER-PREFLIGHT, H4-D |
| GitHub | 0 webhooks, 0 rulesets, no branch protection anywhere, environments `Preview`/`Production` exist unprotected and unused, 0 secrets, actions unpinned. Several GitHub Apps are installed (details held by the owner outside this public repository); their permissions and push/deploy behaviour are UNVERIFIED. | live GETs 18 Oct |

### Trigger matrix (`.github/workflows/ci.yml`, candidate)

| Event | Runs | Can publish? |
|---|---|---|
| `push` to any branch (incl. a new one) | `verify` only, `contents: read` | **No** (hostinger caller requires `workflow_dispatch`) |
| `pull_request` opened/reopened | `verify` | No |
| `workflow_dispatch` on a non-main, non-artifact branch | `verify`, then `hostinger-staging` build + publish (`contents: write`) to `codex/gs-hostinger-artifact` | **Yes** — goes live only if Hostinger auto-deploy is ON or someone clicks Redeploy |

`workflow_dispatch` is **not** a CI-only action. Never use it to "just run CI".

### Why the current artifact cannot reach production by accident

`build-static.mjs` refuses any origin other than loopback or the exact staging origin;
`lib/build/hostinger.ts` throws for any other origin and its `.htaccess` returns 403 to any other
`Host`; noindex, `Disallow: /` and an empty sitemap are enforced by `check-static-artifact`; lead
intake is pinned to the isolated Preview Supabase project. Uploading this artifact to
`gridsmith.uk` would 403 every request. **There is therefore no production release artifact yet**
(ledger DEP-PROD-PROFILE, LEG-05).

## 2. Pre-push read-only recheck (run immediately before any authorised push)

All GETs; none mutates anything.

```bash
git -C "<worktree>" status --short
```

```bash
git -C "<worktree>" rev-parse HEAD HEAD^{tree}
```

```bash
git ls-remote origin
```

```bash
gh api repos/atikmurtaza/Gridsmith-Ltd/hooks
```

```bash
gh api "repos/atikmurtaza/Gridsmith-Ltd/deployments?per_page=5"
```

```bash
gh run list -R atikmurtaza/Gridsmith-Ltd -L 5
```

Plus, by the owner in the dashboards: Hostinger staging auto-deploy is OFF (confirm after a page
reload); `gridsmith.uk` Git still unconnected; Vercel `gridsmith-ltd` still has no Git connection;
each GitHub App's repository access and push/deploy behaviour recorded (ledger DEP-PUSH-SAFETY).

## 3. Exact-SHA CI (owner authority: CI-01)

1. Owner names the exact SHA and tree to be tested (the final candidate; see HANDOFF).
2. Push that branch **once**. No PR open/reopen, no `workflow_dispatch`, no second branch name at
   the same SHA (duplicate runs), no retry-until-green.
3. Confirm the `hostinger-staging` job is **skipped**.
4. Record per-step outcomes. Expected on first run:
   - Option A prefix (`browser-input.selftest`, `install-controls`, `provision`, `check`) is its
     first Linux execution (ledger BRW-RT-01). Any failure there is classified before anything else.
   - `size` should pass: 2.8732KB vs the owner-raised 2.9KB budget (27 B gz headroom).
   - Every browser gate now runs on Chrome **155.0.8059.79**; treat its visual/LHCI numbers as a
     new baseline (BRW-155-01). Master Q5 is classified under the agreed protocol (Q5-01).
5. Download and retain `master-scene-evidence`, Lighthouse and design artifacts.

## 4. Staging release (owner authority: R13, separately)

As documented and live-proven in HOSTINGER-STAGING-WORKFLOW.md:

1. Only after exact-SHA CI is green for that SHA: `workflow_dispatch` CI on the candidate branch.
2. Verify the publish job's `__deployment.json` binding (`sourceSha == github.sha`,
   `siteOrigin`, `sourceModified: false`).
3. In hPanel: Redeploy the staging site from `codex/gs-hostinger-artifact`; flush only the
   temporary site's cache.
4. Verify `__deployment.json` identity, routes, forms (synthetic Preview submission only),
   assets and headers on the staging origin (`check-hostinger-http.mjs`).
5. **Turn auto-deploy OFF and confirm after a reload.**
6. Keep the Actions archive and artifact commit as the new rollback point.

Note: the reusable workflow builds the production-dataset profile only. The R12 private
legal-preview artifact has no publication path (ledger DEP-R13-PATH): either a reviewed workflow
input that preserves the source-binding checks, or an owner-approved manual procedure.

### Staging rollback (documented; proven live 5 Oct, fixture `3829981a` → restore `255d0e55`)

1. Restore the last accepted artifact files as a **new commit** on `codex/gs-hostinger-artifact`
   (never force-push).
2. hPanel Redeploy; flush the temporary site's cache.
3. Verify `__deployment.json` identity plus routes, forms and assets.
4. Auto-deploy OFF; confirm after reload.

## 5. Production cutover (owner authorities: CUTOVER-AUTHORITY, H4-B, H4-H, DNS)

**Prerequisites, all unmet today:** a production static profile and artifact gate (DEP-PROD-PROFILE,
LEG-05/06); production lead intake promoted (LEG-02); legal documents PUBLISHABLE (LEG-01/03);
Path Finder, Freelancer and Technical decisions (LEG-07/08/09); a production delivery channel with
scoped credentials (DEP-PROD-CHANNEL); exact-SHA CI green on the release SHA; BEFORE-LAUNCH
item 24 checks.

Design (GS-HOST-004 §cutover, not yet executed), made concrete:

1. **Backup (owner, before anything else):** WordPress files, database, uploads, `.htaccess`, CDN
   settings; DNS zone export; SSL/certificate inventory; record the production document root.
   **Restore-prove the backup privately** before proceeding (DEP-PROD-ROLLBACK).
2. Decide the open provider security alerts on the current site: resolve first, or accept WordPress as the rollback
   target for a bounded window (DEP-WP-ROLLBACK-TARGET).
3. Build the production artifact from the exact CI-green SHA with the production profile; run its
   artifact gate; retain receipt and hashes.
4. Upload to a **sibling directory** on the same Hostinger site (no DNS change needed if the same
   site serves both).
5. Switch by document-root change or directory rename (near-atomic). Purge CDN.
6. Verify on `https://gridsmith.uk`: every route 200, legacy 308s, branded 404, robots/sitemap
   indexable, canonical origin, full header set on every file type including PNG (hCDN stripping),
   `curl -sI` shows no `Set-Cookie` (A-2 cookie retest, LEG-04), consent notice, a real enquiry
   through production intake reaching `contact@gridsmith.uk`.
7. Monitor for the agreed window: Hostinger access/error logs, intake health
   (`gs_notification_health`), mailbox receipt.

### Production rollback

By failure class, within the agreed window:

| Failure | Action |
|---|---|
| Static site broken (routes/assets/headers) | Switch the document root/rename back to the retained WordPress root; purge CDN; verify WordPress home + contact page. |
| Intake failing | Static site stays; `mailto:` fallback is already on the page; disable the intake worker under H4-B authority; inform the owner. |
| WordPress root also damaged | Restore files + DB from the restore-proven backup taken in step 1. |
| DNS/SSL issue | Re-import the exported zone / reissue certificate from the recorded inventory. |

No DNS change is part of the default plan; if the owner chooses one, a DNS rollback step with the
exported zone and TTL plan must be added before cutover.

## 6. Optional hardening (owner choice; not required for the static site to function)

- Bind the publish job to a protected GitHub environment with a required reviewer; align the
  hostinger build job to `ubuntu-24.04`; SHA-pin actions (each requires updating the Option A
  `WORKFLOWS` pins in `scripts/browser-input.mjs`).
- Branch protection on `main` with `verify` required and force-push disallowed.
- Retire or explicitly keep the residual Vercel project and cron (GS-O026).
