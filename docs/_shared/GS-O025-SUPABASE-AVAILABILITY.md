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

## 6. Failure reporting

- **Any failure** (paused project, rejected credential, wrong role, timeout, worker refusal, a `dead`
  or unconfirmed job, drain enabled before `live`) fails the job with an `::error::` line. GitHub
  then emails the user who last edited the cron line (your account, when you commit the
  activation). Check GitHub → Settings → Notifications → Actions → "Send notifications for failed
  workflows".
- **Silent failure modes** produce no failed run: the 60-day schedule disablement and GitHub dropping
  scheduled runs under load. The backstops are:
  1. Supabase's own warning email, one week before any pause;
  2. a check added to the existing monthly review (§7).

## 7. How to verify runs are actually happening

```bash
gh api repos/atikmurtaza/Gridsmith-Ltd/actions/workflows/supabase-availability.yml --jq .state
```
Expect `active` (not `disabled_inactivity`).

```bash
gh run list -R atikmurtaza/Gridsmith-Ltd -w supabase-availability.yml --event schedule -L 10
```
Expect about 2 successful runs per day.

On Supabase, the read-only inspection query (`scripts/production-inspect.sql`) now reports
`keepaliveStatementCalls`. It must grow between checks (3 per run per project). Locally it went
0 → 6 over two runs.

Add these three checks to the monthly retention review (next: 2 Nov 2026). Re-enable a disabled
schedule with `gh workflow enable supabase-availability.yml -R atikmurtaza/Gridsmith-Ltd`.

## 8. Activation (owner-approved, in order; not done)

**Availability: can go before H4-B, because it does not depend on it.**

1. Apply the role to each project:
   ```bash
   npx --yes supabase@2.119.0 db query --linked --project-ref <ref> --file scripts/gs-o025-keepalive-role.sql
   ```
   Expect one row: `rolcanlogin=f`, the three settings, `table_grants=0`.
2. In each project's SQL editor, run
   `alter role gridsmith_keepalive login password '<generated, 32+ characters>';`, then create the two
   URL secrets (§4).
3. **Put the two workflows and two scripts on `main`.** Schedules only run there, and the jobs check
   out their script from the scheduled ref. `main` is still `fbecbe01`, and pushing to it starts
   that branch's own (older) CI once. This is a separate decision: a 4-file commit on `main`, or
   making the release branch the default.
4. Set `GS_O025_KEEPALIVE_ENABLED=true`.
5. Verify: `gh workflow run supabase-availability.yml -R atikmurtaza/Gridsmith-Ltd --ref main`. Expect
   both jobs green with `ok` lines, and `keepaliveStatementCalls` above 0 on both projects.
6. After 24 hours: at least 2 runs with `--event schedule`, all green.

**Drain: only after the H4-B deployment, and only when Production switches to `live`.**

1. Set `GRIDSMITH_DRAIN_TOKEN` on Production, then redeploy `gs-notification-worker` from the
   reviewed commit.
2. Create `GS_PRODUCTION_DRAIN_TOKEN` and `GS_PRODUCTION_ANON_KEY`. Set
   `GS_PRODUCTION_DRAIN_ENABLED=true` in the same step that sets `GRIDSMITH_INTAKE_MODE=live`.
3. Verify: `gh workflow run notification-drain.yml -R atikmurtaza/Gridsmith-Ltd --ref main`. Expect
   `claimed=0 … dead=0` and green. Enabled early, it fails loudly with "not in live mode" and
   processes nothing (proven).

**Rollback:** set either variable to anything but `true` (jobs skip), or
`gh workflow disable <file>`. `alter role gridsmith_keepalive nologin` revokes the credential. Unset
`GRIDSMITH_DRAIN_TOKEN` to disable the drain path in the worker.

## 9. Local verification

| Check | Result |
|---|---|
| Role SQL on Supabase Postgres 17.6.1.167 | Created as specified; idempotent re-apply; privilege probes as listed in §2 |
| `supabase-availability.sh`, 13 branches | Positive `ok`; refusals for privileged role, nothing listening, bad ref, unset or non-URL secret, loopback outside selftest, transaction pooler, wrong project, service-role user, selftest remote host, wrong database. The "wrong password" probe was **inert**: the image trusts loopback, so password rejection belongs to the real pooler, and a failed session is proven by "nothing listening" |
| Drift detection | Role read-only default removed → the script fails "session was not the read-only … role"; restored → `ok` |
| `notification-drain.sh` against the **real** `createWorker` (loopback, stub store and mail) | live → `claimed=1 sent=1`, exit 0; not live → 409 failure; dead job → operator-review failure; wrong token → 401; server down → unreachable; short, unset or missing secrets; selftest remote URL — 9/9 correct |
| Edge selftest | 58 profile cases, including the drain token, the scheduled path (401/409/403/200), `scheduledDrainEnabled`, and 18 workflow-YAML mutations (triggers, permissions, concurrency, activation gate, timeout, checkout credentials, run interpolation, schedule, swallowed failure) |
| Implementation mutations | 6/6 red: health via timer; drain while not live; short token; length mismatch; enabled outside Production; enabled in synthetic-only |
| Option A | `installationProblems` source scan of the new files gives 0 codes; `ci.yml`, `hostinger-staging.yml`, `package.json` and the lock are byte-identical to their pins |
| Keepalive verification signal | `keepaliveStatementCalls` 0 → 6 after two runs |
| `verify:static` | PASS |
| **Not run** | No GitHub run, secret or schedule; no Supabase write; `psql` presence on the hosted runner is assumed from the runner image (activation step 5 proves it) |

## 10. Readiness

**Availability check: ready to activate** after your approval of §8 steps 1–6, including the
`main` decision.

**Scheduled drain: ready, but must stay off** until H4-B is deployed and Production is `live`. The
H4-B deployment must now use the commit containing this change, because the worker gained the
drain-only path; the H4-B record's approval wording is updated to say so.
