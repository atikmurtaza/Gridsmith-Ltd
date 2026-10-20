# GS-O025 — Supabase availability and notification maintenance

20 October 2026. Worktree `C:\Users\atikm\.codex\worktrees\gs-r12-production-readiness-001\Gridsmith Ltd`,
branch `claude/gs-r12-production-readiness-001`, based on `86fe6620`.

**Result: IMPLEMENTED AND LOCALLY PROVEN — NOT ACTIVE.** The workflow files exist on a non-default
branch. That alone schedules nothing: GitHub runs schedules only from `main`, and both jobs are
skipped until an owner-set repository variable enables them. No push, GitHub secret, variable,
schedule, Edge deployment or Supabase change was made.

## 1. Policy evidence (primary sources, read 20 Oct 2026)

**Supabase** ([Project Pausing](https://supabase.com/docs/guides/platform/free-project-pausing)):
- Free projects "that show low activity over a 7-day period" are paused.
- A project is inactive if it does not receive "sufficient user database activity over the past week".
- "Typically a few user requests to the database each day" is enough. No threshold is published,
  and the page warns that an occasionally used project may still be paused.
- Owners get a warning email "roughly one week before the pause" and a confirmation once it happens.
- A paused project can be restored for up to one year.
- Projects on a paid plan "cannot be paused".

**GitHub** ([schedule event](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows)):
- Schedules run only on the default branch.
- Runs "can be delayed during periods of high loads", and queued jobs "may be dropped".
- In a public repository, scheduled workflows are disabled after 60 days without repository
  activity. The docs do not say whether you are notified.
- Notifications go to "the user who last modified the cron syntax".

**Conclusion:** a 48-hour interval (3–4 requests a week) is likely **below** Supabase's stated norm
of "a few … each day", so the schedule is **twice daily**. Each run makes one authenticated
database session of 3 read-only statements: real user database activity, not a homepage request.
It is the documented kind of activity, but because the threshold is unpublished, it is **expected,
not guaranteed**, to prevent pausing. This is best effort, not uptime. The only guaranteed
exemption is a paid plan, which your zero-additional-cost decision rules out.

## 2. Design

| Part | What |
|---|---|
| Least-privilege role | `scripts/gs-o025-keepalive-role.sql`, applied once per project at activation (not a migration, so the H4-B migration step stays exactly one file). Creates `gridsmith_keepalive`: NOLOGIN until you set a password in the SQL editor; no superuser/createrole/createdb/replication/bypassrls; connection limit 2; `default_transaction_read_only=on`; `statement_timeout=5s`; `idle_in_transaction_session_timeout=10s`; no grants |
| Availability check | `.github/workflows/supabase-availability.yml` → `scripts/supabase-availability.sh`. Session pooler (IPv4, `gridsmith_keepalive.<ref>` on port 5432). The secret's provenance is checked first (user, ref, pooler host, port, database). One `psql` session with a 45 s timeout, no retry. It asserts it ran as the read-only keepalive role, and prints `ok` or a fixed error |
| Scheduled retries | `.github/workflows/notification-drain.yml` → `scripts/notification-drain.sh`. It calls only the private worker, never the public intake. The gateway's JWT check is passed with the publishable anon JWT; a separate `X-Gridsmith-Drain-Token` then authorises **`drain` only**. The worker refuses `health` (403) and refuses everything (409) unless Production is `live`. Secrets reach curl through stdin config, never the command line |
| Worker change | `lib/leads/edge-worker.ts`: optional `ScheduledDrain`; `drainTokenMatches` is a constant-time comparison requiring ≥32 characters. `lib/leads/edge-deployment.ts`: `scheduledDrainEnabled` is true only for Production in `live` mode. The operator path is unchanged |
| Hardening (both workflows) | `permissions: contents: read`; checkout with `persist-credentials: false`, sparse to the one script; `concurrency` group without cancellation; `timeout-minutes: 3`; `ubuntu-24.04`; schedule and `workflow_dispatch` only (no push/PR triggers, so forks never see secrets); secrets only in step `env`, never interpolated into `run` |

### What a leaked keepalive credential exposes (measured locally)

- Allowed: `select 1`-type queries, catalog metadata (already public in this repository), and
  temporary tables inside its own session (Postgres grants TEMP to every role; read-only is the
  role's default, and a session can override it).
- Refused: reading `public` tables ("permission denied for table"); `auth` and `storage` ("permission
  denied for schema"); any persistent write, even after `set transaction read write`; statements
  over 5 s.

## 3. Schedules (UTC)

| Workflow | Projects | Cron | Runs |
|---|---|---|---|
| Supabase availability | Production `dqiutgmxillhsbzgnlsx`, then Preview `qfgpwumvvtizeamkynes` (`max-parallel: 1`) | `23 5,17 * * *` | 05:23 and 17:23 daily |
| Production notification drain | Production only | `41 * * * *` | hourly at :41, only once Production is `live` |

Off-hour minutes reduce GitHub's start-of-hour congestion. Once live, the hourly drain is also
database activity for Production (claim RPC every hour), so it reinforces the availability check.
Preview has no scheduled drain: it is always synthetic-only and the worker refuses it there.

## 4. Required configuration (owner creates; none exists today)

| Kind | Name | Value | When |
|---|---|---|---|
| Secret | `GS_O025_PRODUCTION_DB_URL` | `postgresql://gridsmith_keepalive.dqiutgmxillhsbzgnlsx:<password>@aws-<n>-eu-west-1.pooler.supabase.com:5432/postgres` | Availability activation |
| Secret | `GS_O025_PREVIEW_DB_URL` | the same for `qfgpwumvvtizeamkynes` | Availability activation |
| Secret (optional) | `GS_O025_PRODUCTION_HEARTBEAT_URL`, `GS_O025_PREVIEW_HEARTBEAT_URL` | `https://hc-ping.com/<uuid>` per project | If you choose the heartbeat (§6) |
| Variable | `GS_O025_KEEPALIVE_ENABLED` | `true` | Availability activation |
| Edge secret (Production) | `GRIDSMITH_DRAIN_TOKEN` | random, ≥32 characters | Drain activation |
| Secret | `GS_PRODUCTION_DRAIN_TOKEN` | the same value | Drain activation |
| Secret | `GS_PRODUCTION_ANON_KEY` | Production legacy `anon` JWT (publishable, kept as a secret anyway) | Drain activation |
| Variable | `GS_PRODUCTION_DRAIN_ENABLED` | `true`, **only after `live`** | Drain activation |

No service-role key is stored in GitHub.

## 5. Usage estimates (per month)

| Item | Availability | Drain (after live) |
|---|---|---|
| Workflow runs | ~60 (2/day) | ~720 (24/day) |
| Jobs | ~120 (2 per run) | ~720 |
| Runner time | ~15–25 s per job → ≤ 120 billed minutes | ~10–15 s per job → ≤ 720 billed minutes |
| Cost | Standard GitHub-hosted runners are free for public repositories. If the repository became private, ~840 minutes against the Free account's 2,000 | — |
| Supabase | 2 pooler sessions per day per project, 6 trivial statements | ~720 Edge invocations (Free includes 500,000) and ~720 claim RPCs |
| Resend | none | only for real pending notifications (no extra mail) |


## 6. Failure reporting and missed runs

| Situation | How it surfaces |
|---|---|
| Paused project, rejected credential, wrong role, timeout, worker refusal, a `dead` or unconfirmed job, drain enabled before `live` | The job fails with an `::error::` line. GitHub emails the user who last edited the cron line (you, once you commit the activation). Check GitHub → Settings → Notifications → Actions → "Send notifications for failed workflows" |
| Manual run while the switch is off | The `switch-off` job **fails** with "switched off … nothing was checked" (it never looks green). It has no checkout, secret or permission. Scheduled runs never take this path |
| A run delayed or dropped by GitHub, or the schedule disabled after 60 days without repository activity | **No failed run exists**, so GitHub sends nothing. Covered by: (1) the optional Healthchecks.io heartbeat below; (2) Supabase's own warning email one week before any pause; (3) the monthly check in §7 |

**Independent no-cost alert (owner choice, not active):** a Healthchecks.io check per project. Its
free plan includes 20 checks and email alerts. The availability job pings the check's URL **only
after a successful database session**; Healthchecks emails you if a ping is overdue.

- Set the period to 12 h and the grace to 12 h, so an alert fires after about 24 h without success.
- This is the only measure that detects missing runs, because it does not depend on GitHub running.
- It is a new external service. It receives the runner's IP address and the ping time, and no
  personal data.
- The ping URL is checked to be `https://hc-ping.com/<uuid>` and is sent through stdin config.
- An undelivered ping is a warning, not a failure: the monitor itself will alert.

## 7. How to verify runs are actually happening

```bash
gh api repos/atikmurtaza/Gridsmith-Ltd/actions/workflows/supabase-availability.yml --jq .state
```
Expect `active` (not `disabled_inactivity`).

```bash
gh run list -R atikmurtaza/Gridsmith-Ltd -w supabase-availability.yml --event schedule -L 10
```
Expect about 2 successful runs per day; times may lag the cron by minutes, or occasionally more.

On Supabase, the read-only inspection query (`scripts/production-inspect.sql`) reports
`keepaliveStatementCalls`. It must grow between checks (3 per run per project); locally it went
0 → 6 over two runs. With the heartbeat, the Healthchecks dashboard shows the last ping per project.

Add these to the monthly retention review (next: 2 Nov 2026). Re-enable a disabled schedule with
`gh workflow enable supabase-availability.yml -R atikmurtaza/Gridsmith-Ltd`.

## 8. Activation procedure (owner-run; nothing here has been done)

Availability first; it does not depend on H4-B. Secret values are typed only into your own
terminal or the provider dashboards, never into chat or a file in the repository.

**0. Preconditions (read-only).** What pushing to `main` can trigger, checked on 20 Oct:

| Surface | Fact | Source |
|---|---|---|
| `main` (`fbecbe01`) workflows | Only `ci.yml`: push/PR/dispatch, `verify` only, no secrets, no deploy job, read-only token. A push to `main` starts **one** such run on main's older code. It may go red; it publishes nothing | `git show origin/main:.github/workflows/ci.yml` |
| New workflows | Schedule and dispatch only; no push trigger. The drain job is off (variable unset) | this branch |
| Vercel | 0 projects linked to the repository; no deployment since 3 Oct | API read |
| GitHub | 0 webhooks, 0 rulesets, no Pages | API read |
| Hostinger | **Not verifiable by Claude.** Confirm H2 (staging pulls only `codex/gs-hostinger-artifact`) and **H3 (gridsmith.uk Git not connected)**. If H3 is connected to `main`, **stop**: a push could deploy | your hPanel |

**1. Role in Production:**
```bash
npx --yes supabase@2.119.0 db query --linked --project-ref dqiutgmxillhsbzgnlsx --file scripts/gs-o025-keepalive-role.sql
```
Expect one row: `rolcanlogin=f`, settings `default_transaction_read_only=on`,
`idle_in_transaction_session_timeout=10s`, `statement_timeout=5s`, and `table_grants=0`.

**2. Role in Preview:** the same command with `--project-ref qfgpwumvvtizeamkynes`. Same expected row.

**3. Credentials:**
- Generate two passwords (one per project), 32+ letters and digits so nothing needs URL-encoding;
  your password manager will do.
- In each project's dashboard SQL editor:
  `alter role gridsmith_keepalive login password '<password>';`
- Take the pooler host from Dashboard → Connect → Session pooler (`aws-<n>-eu-west-1.pooler.supabase.com`).
- Build:
  `postgresql://gridsmith_keepalive.<ref>:<password>@aws-<n>-eu-west-1.pooler.supabase.com:5432/postgres`

**4. GitHub secrets** (`gh` reads the value from a prompt, not from the command line):
```bash
gh secret set GS_O025_PRODUCTION_DB_URL -R atikmurtaza/Gridsmith-Ltd
```
```bash
gh secret set GS_O025_PREVIEW_DB_URL -R atikmurtaza/Gridsmith-Ltd
```
Optional heartbeat: create two Healthchecks.io checks (12 h period, 12 h grace), then set
`GS_O025_PRODUCTION_HEARTBEAT_URL` and `GS_O025_PREVIEW_HEARTBEAT_URL` the same way.

**5. Switch:**
```bash
gh variable set GS_O025_KEEPALIVE_ENABLED -R atikmurtaza/Gridsmith-Ltd --body true
```
Do **not** set `GS_PRODUCTION_DRAIN_ENABLED`.

**6. Put the workflows on the default branch**: one fast-forward commit on `main` adding exactly
four files (both workflows and both scripts), from the reviewed commit:
```bash
git -C "<worktree>" fetch origin main
```
```bash
git -C "<worktree>" worktree add "<temp folder>" origin/main --detach
```
```bash
git -C "<temp folder>" checkout <reviewed commit> -- .github/workflows/supabase-availability.yml .github/workflows/notification-drain.yml scripts/supabase-availability.sh scripts/notification-drain.sh
```
```bash
git -C "<temp folder>" commit -m "ci(ops): GS-O025 Supabase availability and dormant notification drain"
```
```bash
git -C "<temp folder>" push origin HEAD:refs/heads/main
```
No force. Expect exactly one `CI` push run on `main` (verify-only) and the two new workflows listed
under Actions. The alternative is to make the release branch the default branch, which is a
repository-setting change with wider effects and is not recommended.

**7. Initial manual test:**
```bash
gh workflow run supabase-availability.yml -R atikmurtaza/Gridsmith-Ltd --ref main
```
```bash
gh run watch -R atikmurtaza/Gridsmith-Ltd
```
Expect `production` and `preview` green with `ok (read-only session as gridsmith_keepalive, 3
statements)`, plus "heartbeat sent" if configured. `switch-off` is skipped. This also proves `psql`
exists on the hosted runner.

**7a. If a job fails at "database session failed":** do not re-run. Diagnose the stored address
locally. Paste the same address you stored as the secret when prompted; it stays hidden:
```bash
bash scripts/diagnose-keepalive-url.sh
```
It prints only the address's shape and one category: DNS, POOLER ROUTING (wrong cluster, user or
ref), PASSWORD, NETWORK, CONNECTION LIMIT, TLS OR ACCESS POLICY, SQL PERMISSION, or OK. Fix that one
thing, re-set the secret, then make one re-run.

**8. Confirm real database activity:** run the inspection query on both projects (header of
`scripts/production-inspect.sql`, with each `--project-ref`). Expect `keepaliveRole.canLogin: true`
and `keepaliveStatementCalls ≥ 3`.

**9. Confirm scheduled execution:** after 24 h, `gh run list … --event schedule` shows at least 2
green runs, the workflow `state` is `active`, and `keepaliveStatementCalls` has grown by at least
6 on each project.

**10. Disable safely (any of these, in rising order):**
- Pause: `gh variable set GS_O025_KEEPALIVE_ENABLED -R atikmurtaza/Gridsmith-Ltd --body false`.
  Scheduled jobs skip, and a manual run fails "switched off".
- Stop: `gh workflow disable supabase-availability.yml -R atikmurtaza/Gridsmith-Ltd`.
- Revoke the credential: `alter role gridsmith_keepalive nologin;` in each project, then
  `gh secret delete GS_O025_PRODUCTION_DB_URL -R atikmurtaza/Gridsmith-Ltd` (and Preview).
- Remove: `drop role gridsmith_keepalive;` (it owns nothing) and a revert commit on `main`.

**Drain activation** happens later, only with H4-B deployed and in the same step as `live`:
1. Set the Production Edge secret `GRIDSMITH_DRAIN_TOKEN` (random, 32+ characters) and redeploy
   `gs-notification-worker`.
2. Set `GS_PRODUCTION_DRAIN_TOKEN` (same value) and `GS_PRODUCTION_ANON_KEY` (Production legacy
   anon JWT).
3. Set `GS_PRODUCTION_DRAIN_ENABLED=true`.
4. Run `gh workflow run notification-drain.yml -R atikmurtaza/Gridsmith-Ltd --ref main` and expect
   `claimed=0 … dead=0`.

Dispatching the availability workflow never triggers the drain: they are separate files, with no
`workflow_run` or call between them.

## 9. Local verification

| Check | Result |
|---|---|
| Role SQL on Supabase Postgres 17.6.1.167 | Created as specified; idempotent re-apply; privilege probes as listed in §2 |
| `supabase-availability.sh`, 13 branches | Positive `ok`; refusals for privileged role, nothing listening, bad ref, unset or non-URL secret, loopback outside selftest, transaction pooler, wrong project, service-role user, selftest remote host, wrong database. The "wrong password" probe was **inert**: the image trusts loopback, so password rejection belongs to the real pooler, and a failed session is proven by "nothing listening" |
| Drift detection | Role read-only default removed → the script fails "session was not the read-only … role"; restored → `ok` |
| `notification-drain.sh` against the **real** `createWorker` (loopback, stub store and mail) | live → `claimed=1 sent=1`, exit 0; not live → 409 failure; dead job → operator-review failure; wrong token → 401; server down → unreachable; short, unset or missing secrets; selftest remote URL — 9/9 correct |
| Edge selftest (round 1) | 58 profile cases, including the drain token, the scheduled path (401/409/403/200), `scheduledDrainEnabled`, and 18 workflow-YAML mutations (triggers, permissions, concurrency, activation gate, timeout, checkout credentials, run interpolation, schedule, swallowed failure) |
| Implementation mutations | 6/6 red: health via timer; drain while not live; short token; length mismatch; enabled outside Production; enabled in synthetic-only |
| Option A | `installationProblems` source scan of the new files gives 0 codes; `ci.yml`, `hostinger-staging.yml`, `package.json` and the lock are byte-identical to their pins |
| Keepalive verification signal | `keepaliveStatementCalls` 0 → 6 after two runs |
| `verify:static` | PASS |
| Manual-run guard (20 Oct, round 2) | `switch-off` job: runs only on `workflow_dispatch` with the switch off, `permissions: {}`, no checkout or secret, exits 1 with an explicit message. Structural test: 16 mutations per workflow red (incl. the guard's condition, exit code, permissions, injected secret, deletion, and the manual trigger removed) — 72 profile cases in total |
| Heartbeat (no network) | Not configured → `ok`; undelivered → `ok` plus warning; wrong host or malformed URL → fails as misconfiguration; database failure → no heartbeat attempted. The delivered path needs network: activation step 7 shows it |
| Pre-push trigger inspection | `main`: `ci.yml` only, verify-only, no secrets or deploy; Vercel 0 linked projects; GitHub 0 hooks. Hostinger H2/H3 not verifiable here |
| **Not run** | No GitHub run, secret, variable or schedule; no Supabase write; no Healthchecks account. `psql` on the hosted runner is proven by activation step 7 |

## 10. Readiness

- **Availability check: READY TO ACTIVATE** once you have confirmed H2/H3 and approved §8 steps
  0–10, which include the 4-file commit on `main`.
- **Heartbeat:** optional, your choice of a new external service.
- **Scheduled drain: ready, but stays off** until H4-B is deployed and Production is `live`.
- **H4-B:** must deploy from the GS-O025 commit or later, because the worker gained the drain-only
  path.

## 11. Activation result (20 October 2026, 23:40 UTC)

**ACTIVE on both projects.**
- Manual verification run 39516560037 (`dbde73d3`): Production and Preview successful, with
  `keepaliveStatementCalls` Production 0 → 4 and Preview 12 → 16.
- Earlier failures: the Production secret used pooler cluster `aws-0`. Supabase's pooler
  configuration gives `aws-1-eu-west-1` (LEDGER §12.6).
- Recovery tools are PowerShell, owner-run: `scripts/gs-o025-rotate-production-keepalive.ps1`
  (credential rotation, self-tested) and `scripts/diagnose-keepalive-url.sh` (diagnosis, now
  paste-tolerant).
- Pending: the 24-hour scheduled check for Production (§8 step 9). Heartbeat not configured. Drain
  off.
