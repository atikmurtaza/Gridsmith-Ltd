# GS-R13-H4B-PRODUCTION-INTAKE-READINESS-001 — Production lead-intake readiness

20 October 2026. Worktree `C:\Users\atikm\.codex\worktrees\gs-r12-production-readiness-001\Gridsmith Ltd`,
branch `claude/gs-r12-production-readiness-001`, based on `1c83b7c6` (GS-R13 profile).

**Result: READY FOR ONE OWNER-AUTHORISED OPERATION.** The package is prepared and locally proven.
Nothing was deployed, migrated, backed up or written to Production. `PRODUCTION_INTAKE_URL` stays
`null`. No push, no CI, no Hostinger action.

Provider contact in this phase, all reads, is listed in §A.3, including two side effects that
must be disclosed.

## A. Verified Production Supabase state

### A.1 Identity and status (CLI 2.119.0, read-only)

| Property | Production | Preview |
|---|---|---|
| Ref / name | `dqiutgmxillhsbzgnlsx` / "Gridsmith Project" | `qfgpwumvvtizeamkynes` / "gridsmith-preview" |
| Organisation | Gridsmith Org (`dxqntaccfhwaneknyage`), Free | same |
| Region / Postgres | eu-west-1 / 17.6.1.155 | eu-west-1 / 17.11.0.002 |
| Status | **INACTIVE at ~11:00 UTC** (hostname did not resolve) → **ACTIVE_HEALTHY by ~12:30 UTC** | same transition |
| Edge Functions | **0** | `gs-lead-intake` ACTIVE v8 (`verify_jwt=false`), `gs-notification-worker` ACTIVE v6 (`verify_jwt=true`) |
| Custom secrets | none (only the reserved DB URL) | the six H4-B names (values not read) |
| Provider backups | **none** (`backups: null`, PITR off) | — |
| API keys (names and types only) | legacy `anon` and `service_role` JWTs for this ref; `sb_publishable`, `sb_secret` | — |

**The status change was not caused by this session.** It ran only list/read commands. Either you
restored the projects or the cause is unknown. Please confirm. On the Free plan both projects
pause again after about 7 days without activity (GS-O025, §D).

### A.2 Database (one SELECT inside `begin transaction read only`; `scripts/production-inspect.sql`)

| Item | Value |
|---|---|
| Leads | **0** (no created-date range). The historical 63 were probe rows deleted at R7 |
| Ledger | 0001 `39647b54ac55`, 0002 `97012e3e15c4`, 0003 `375b08ff1cab`, 0004 `bd761ff9b9e4`: **all equal to the repository**. Pending: only `20261004184828_gs_host_h4b_private_intake.sql` (`b807e3ed6d4f`) |
| H4-B objects | `gridsmith_private` schema absent; no `gs_*` routines: no conflict |
| RLS | on for all 5 public tables; 0 policies |
| `anon`/`authenticated` grants | 0 table grants, 0 routine grants in `public` |
| Lead constraints | 18 |
| Views | `v_lead_funnel`, `v_path_finder_honesty`, both `security_invoker=true` |
| Extensions | pg_stat_statements, pgcrypto, plpgsql, supabase_vault, uuid-ossp (no pg_cron, no pg_net) |
| Auth / storage | 0 users; 0 buckets, 0 objects |
| Size | 11.4 MB |

No personal data was retrieved: the query returns counts, hashes and metadata only.

### A.3 Provider contact this phase (disclosure)

- Supabase CLI reads: projects list, functions list, backups list, secrets list (names and digests
  only), orgs list, API-key names and types (values held in memory and never printed), one
  read-only SQL query.
- **Side effect 1:** `db query --linked` prints "Initialising login role". The CLI creates or
  refreshes its standard short-lived login role for Management-API queries. That is a minor
  provider-side change, the same mechanism H4-B used on Preview.
- **Side effect 2 (unintended):** while checking that a module imported, I ran
  `scripts/check-edge-preview.mjs`, which executes at load. It ran the deployed **Preview** negative
  proof: 17 probes against the isolated Preview project, plus a service-key fetch into memory.
  Result: PASS, lead and outbox counts unchanged, nothing written. Production was not touched by it.
- Unauthenticated: DNS and HTTP checks of both project hostnames.

## B. Backup and restore readiness

**Method:** `scripts/backup-production-db.mjs` (new). It runs `pg_dump --format=custom` of `public` and
`gridsmith_private` from `postgres:17-alpine` over the IPv4 **session pooler**, the route proven at
GS-PROD-003-R1 (the direct host is IPv6-only). Then:

1. The dump is written to `%USERPROFILE%\gridsmith-backups\supabase-production-<UTC>.dump`, outside the
   repository, with the ACL restricted to the current user.
2. It is restored into a disposable local Supabase Postgres 17.6.1.167.
3. The restore is compared with the source: per-table row counts, the migration ledger, and an md5
   fingerprint of every lead row. A mismatch, or an unreadable restore, exits 1 with
   "RESTORE MISMATCH".
4. A receipt (counts and hashes, no data) is written beside the dump.

Docker runs with `--pull never`, so nothing is downloaded.

| Concern | Position |
|---|---|
| Scope | Schemas `public` + `gridsmith_private`: tables, data, constraints, RLS flags, policies, grants and routines in them. Not covered: `auth`, `storage`, roles, project settings, Edge Functions and secrets (the repository and §C.3 recreate those; auth and storage are empty) |
| Recovery limits | No provider backup or PITR on Free. This dump is the only point-in-time copy. Request logs and provider-held copies are outside it |
| Credentials | `GS_PRODUCTION_DB_URL` is read from the environment and passed to libpq as container variables, never on a command line; nothing is logged. You supply it (dashboard → Connect → Session pooler) |
| Encryption | NTFS ACL only. **Owner action:** confirm BitLocker on this disk, or move the dump into an encrypted archive. It will contain personal data once real leads exist |
| Retention | Record each dump in the retention log outside the repository. The adopted retention schedule decides when it is deleted, and deletion is your action (as at R8) |
| Guards (proven) | Refuses without `GS_PRODUCTION_BACKUP_CONFIRM=read-production`; a non-pooler host; the transaction pooler (6543); a user other than `postgres.dqiutgmxillhsbzgnlsx`; no password; an unset URL; loopback outside selftest; selftest with a remote host; selftest without its own output directory. **9/9 refused before any read** |
| Proof (local, `--selftest`) | Production-shaped source (Supabase image, all 5 migrations, 3 synthetic leads): 41,117-byte dump; restore equal on 7 tables, 5 ledger rows and the lead fingerprint. Deliberate failures: one restored lead deleted → `restoredEqual:false`, exit 1; restore skipped → mismatch, exit 1. Script restored byte-identical after each mutation |
| Restore procedure (real) | Into a disposable database: `pg_restore --no-owner -d postgres <dump>` (done by the script). Into **Production**, only after damage and only under separate approval: restore the affected objects from the dump; never overwrite real leads that postdate it |

## C. H4-B security and deployment readiness

### C.1 Review of the pathway (static and proof evidence)

| Area | Finding |
|---|---|
| Input schema / validation | Shared authoritative Zod domain (`form-domain.ts`, `schema.ts`, `pressLead.ts`). Envelope whitelist, 64 KiB streamed cap, non-string values rejected, unknown fields discarded. Edge selftest: 59 parity and adverse cases PASS |
| Server-only secrets | Service key, worker JWT and Resend key live only in Edge secrets. The static build strips private names, and the artifact gate scans markers, values and service-role JWT claims |
| Database permissions / RLS | Production today: RLS 5/5, 0 policies, 0 anon/authenticated grants. The migration's RPCs are SECURITY INVOKER, `search_path=pg_catalog`, with EXECUTE for `service_role` only. **Proven on the Supabase Postgres image** (real roles and default privileges): 40 assertions PASS, after aligning the disposable database's owner with hosted Supabase |
| Anonymous restrictions | anon/authenticated cannot read or write leads or the outbox, or execute the RPCs (same proof) |
| Abuse / rate limits | Honeypot (silent 202, zero work); URL-in-name refusal; isolate token bucket (20, 2/s); global admission ceilings of 5/15 min, 40/day, queue 50. **SEC-F4 remains an owner decision:** the ceilings are a cheap lockout vector |
| Duplicates | Same request UUID + same payload returns the existing lead; a changed payload conflicts (409) |
| Logging / errors | No application logging of content; fixed error bodies; `no-store`/`nosniff`. Supabase request logs record IP addresses, which the adopted Privacy Policy discloses |
| CORS / origin | Exact allowlist, echoed with `Vary: Origin`. **Production is now locked to exactly `["https://gridsmith.uk"]`** (www redirects to the apex). Origin is browser policy, not authentication |
| Domain restriction | The GS-R13 profile compiles only the recorded Production intake into the gridsmith.uk artifact; its CSP `connect-src` allows only that origin |
| Form integration | Unchanged forms; hydration-guarded submit; mailto fallback; no-JS submission unsupported and disclosed |
| Privacy / consent | No cookies or analytics; the adopted Privacy Policy (§6/§7) already describes the Edge intake, Ireland storage, edge-region processing and the Resend fields. The notification fields match §6. No legal text change |

### C.2 Changes made (minimal, required by H4-B's own Production plan step 3)

The deployed functions were deliberately Preview-only in three places: a project guard, a fixed
synthetic-identity admission, and fixed synthetic marking. They are replaced by one project
profile, `lib/leads/edge-deployment.ts`:

- **Preview:** unchanged behaviour. Synthetic-only always; asking for `live` refuses.
- **Production:** requires `GRIDSMITH_INTAKE_MODE` = `synthetic-only` (smoke test) or `live` (cutover);
  unset or unknown stops the function. Origins must be exactly `["https://gridsmith.uk"]`.
- **Recipient:** must be `contact@gridsmith.uk` in both projects (or empty, in which case mail is
  unconfigured and the worker returns 503).
- **Unknown projects** are refused. The worker's JWT check uses the running project's ref.
- **Labelling:** the synthetic identity (`GS-HOST-H4-B …` at `@gridsmith.invalid`) is labelled
  `[SYNTHETIC H4-B TEST]` in every project. Real Production enquiries are not.
- **Operator script:** `scripts/reconcile-preview-outbox.mjs` takes `--production` for aggregate
  health/drain on the approved Production ref only. `package.json` is unchanged, because Option A
  pins its bytes.

**Proof:**
- Edge selftest: 59 existing cases plus **25 profile cases**.
- **7/7 implementation mutations red**, each one turning the selftest red with the original restored
  byte for byte: origin lock removed; Production defaulting to live; admission gate open; marker
  loosened; recipient lock removed; smoke test unlabelled; operator guard opened.
- Typecheck covers `supabase/functions/**`. `verify:static` PASS.
- **Not run:** a Deno bundle of the functions. There is no local Deno; the Supabase deploy bundles
  them and reports errors.

### C.3 Deployment package (not executed)

All commands run from this worktree at the reviewed local commit. The CLI bundles local files, so
**no push is needed**. Pinned CLI: `npx --yes supabase@2.119.0`. Secret values are entered by you
into your own terminal, never into chat or a file in the repository.

| # | Step | Command / action | Expected evidence |
|---|---|---|---|
| 0 | Preconditions | `npx --yes supabase@2.119.0 projects list -o json`, then the inspection query (header of `scripts/production-inspect.sql`) | Production ACTIVE_HEALTHY; leads 0; ledger 4 equal; no private schema |
| 1 | Backup | `$env:GS_PRODUCTION_DB_URL='<session pooler URL>'; $env:GS_PRODUCTION_BACKUP_CONFIRM='read-production'; node scripts/backup-production-db.mjs` | `restoredEqual: true`, dump path and sha256 |
| 2 | Migration | `npm run migrate` (reads your `.env.local` `DIRECT_CONNECTION_STRING`; applies pending files in one transaction each) | Exactly `20261004184828_gs_host_h4b_private_intake.sql` applied, sha `b807e3ed6d4f`. That file's header says "Production application prohibited". It is immutable (hash-pinned), so the approval itself must supersede that line |
| 3 | Verify migration | Inspection query again | Ledger 5; `privateSchema` 1; 4 `gs_*` routines; anon/authenticated routine grants 0; leads 0 |
| 4 | Secrets | `npx --yes supabase@2.119.0 secrets set --project-ref dqiutgmxillhsbzgnlsx --env-file <temp file outside the repo, owner-only ACL, deleted after>` holding `GRIDSMITH_INTAKE_MODE=synthetic-only`, `GRIDSMITH_ALLOWED_ORIGINS=["https://gridsmith.uk"]`, `LEAD_NOTIFICATION_EMAIL=contact@gridsmith.uk`, `LEAD_NOTIFICATION_FROM=<the verified sender Preview uses>`, `RESEND_API_KEY=<yours>`, `GRIDSMITH_WORKER_TOKEN=<Production legacy service_role JWT>` | `secrets list` shows the six names |
| 5 | Deploy | `npx --yes supabase@2.119.0 functions deploy gs-lead-intake --project-ref dqiutgmxillhsbzgnlsx`, then the same for `gs-notification-worker` (`verify_jwt` comes from `supabase/config.toml`) | `functions list`: intake ACTIVE `verify_jwt=false`, worker ACTIVE `verify_jwt=true` |
| 6 | Health | `node scripts/reconcile-preview-outbox.mjs health --production` | `mailConfigured: true`, queue all 0, `intakeResponsive: true` (OPTIONS from `https://gridsmith.uk` → 204) |
| 7 | Negative probes (no writes) | POSTs to `https://dqiutgmxillhsbzgnlsx.supabase.co/functions/v1/gs-lead-intake`: Origin `https://example.invalid` → 403; GET → 405; `text/plain` → 415; malformed → 400; invalid fields → 422; honeypot → 202 with no storage; a real-looking identity in `synthetic-only` mode → 409. Then anon REST `select` on `leads` → denied | Counts unchanged (inspection query) |
| 8 | Synthetic E2E | One Contact POST, Origin `https://gridsmith.uk`, saved request UUID, `full_name` `GS-HOST-H4-B Production smoke`, `email` `smoke@gridsmith.invalid`. Then `health --production` (and `drain --production` if pending) | 202 `{id}`; outbox sent 1; you confirm one `[SYNTHETIC H4-B TEST]` email at contact@gridsmith.uk |
| 9 | Cleanup | Delete exactly that lead by id with the synthetic predicates (`full_name like 'GS-HOST-H4-B %' and email like '%@gridsmith.invalid'`); the outbox row cascades | Leads 0, outbox 0; admission counters intentionally kept |
| 10 | Hold | Mode stays `synthetic-only` until cutover. Then, under its own approval: `GRIDSMITH_INTAKE_MODE=live`, set `PRODUCTION_INTAKE_URL` in a local commit, and rebuild the gridsmith.uk artifact | — |

**Rollback:**
- **Functions:** the website does not use them yet, so removing them has no visitor impact.
  Run `functions delete gs-lead-intake` and `functions delete gs-notification-worker` with
  `--project-ref dqiutgmxillhsbzgnlsx`, and unset the six custom secrets.
- **Migration:** it is additive. Only with no pending or retry jobs, and under approval, run the
  documented empty-schema rollback: drop the 4 RPCs, the 2 tables and the schema, and delete the
  ledger row. Never delete real leads or edit earlier history.
- **Data damage:** restore from the step 1 dump, under approval.

**Evidence to retain:** backup receipt; inspection JSON before and after; `functions list`;
`secrets list` names; health JSON; probe statuses; the E2E request, lead and outbox ids; your mail
confirmation; cleanup counts.

## D. Remaining technical blockers

1. **Free-plan pause (GS-O025, owner decision):** a Free project pauses after about 7 days without
   requests, and its hostname then stops resolving. With rare enquiries, the live intake would go
   dark and only the mailto fallback would remain. Your settled position is zero additional cost,
   so the options are:
   - accept the risk with a monitoring and resume routine; or
   - revisit the cost decision and use a paid plan.

   H4-B rules out fake writes as a keepalive. This must be decided before `live`.
2. **No unattended outbox drain:** a retry only progresses on the next submission's wake or a manual
   `drain --production`. Accept this, with operator review (GS-O025), or approve a scheduled drain as
   a separate change.
3. **Sender:** `LEAD_NOTIFICATION_FROM` must be a sender Resend has verified. Public DNS for
   gridsmith.uk shows no Resend records, so the Preview sender is presumably another verified
   identity. Confirm which.
4. **SEC-F4** (lockout vector) and **SEC-F5** remain owner decisions.
5. The GS-R13 profile still waits for the legal PUBLISHABLE states (§E.1).
6. **Sequencing defect (new):** the GS-R13 build needs all seven documents PUBLISHABLE, but the
   Cookie Policy's A-2 prerequisite can only be evidenced on gridsmith.uk serving that build, so the
   two gates wait on each other. Options are in the legal approval document; no gate was changed.

## E. Consolidated owner decisions

### E.1 Legal

One document: [LEGAL-PUBLICATION-APPROVAL.md](GS-R12-PRODUCTION-READINESS-001/LEGAL-PUBLICATION-APPROVAL.md).
It lists all seven documents, each approved or withheld individually. **None is approved today.**

### E.2 Hostinger read-only checklist (for you; Claude cannot sign in)

| # | Check in hPanel | Record |
|---|---|---|
| H1 | Staging site → Git: auto-deployment **OFF**, confirmed again after a page reload | on/off, time |
| H2 | Staging Git branch is `codex/gs-hostinger-artifact`; last deployment commit | branch, commit |
| H3 | gridsmith.uk → Git: **not connected** | yes/no |
| H4 | gridsmith.uk → File Manager: the document root path, and whether `public_html` holds WordPress | path |
| H5 | Backups: which daily/weekly backups exist for gridsmith.uk (files and database) and the latest date | list |
| H6 | DNS zone: confirm the 15 Oct change (SOA serial `2026101501`) was expected | yes/no |
| H7 | Any other Git or automatic deployment on the account that could deploy to gridsmith.uk | list |

### E.3 Security advisories (no change since the ledger)

Re-checked today: `npm audit` gives 21 entries / 4 IDs, production 0. GHSA-jmr9-qjv8-65gv and
GHSA-7pqw-9j4j-h8q3 (extract-zip), GHSA-vfj7-8cjw-p6xm (braces) and GHSA-hp3w-g68c-fv3c (sprintf-js)
have no fixed release. The dispositions drafted in RELEASE-DECISION-PACK §B are **not approved**.

### E.4 Durable Chrome (BRW-03)

Still outstanding. Google stable is `155.0.8059.84`; CI pins `.79`, which may be pruned. The
recommendation (R1, re-pin when CI is next needed) is in RELEASE-DECISION-PACK §E.2. **Not
decided.**

## F. Next owner-controlled action

One operation, Production Supabase only, after you have done H1–H7 above or alongside them. Suggested
approval (short form):

> Approve GS-R13-H4B-EXEC-001 on dqiutgmxillhsbzgnlsx only: restore-proven backup; migration b807e3ed6d4f; 6 secrets in synthetic-only mode; deploy both H4-B functions from commit <SHA>; one marked synthetic test to contact@gridsmith.uk; delete that test lead. No live mode, push or site change.

Before approving, decide D.1 (pause) and D.3 (sender).

> **Update (GS-O025, 20 Oct):**
> - The worker gained a drain-only scheduled path, so `<SHA>` must be the GS-O025 commit or later,
>   not `86fe6620`.
> - `GRIDSMITH_DRAIN_TOKEN` is **not** part of this operation. It is set at drain activation, with
>   `live`.
> - D.1 now has a best-effort mitigation ready to activate:
>   [GS-O025-SUPABASE-AVAILABILITY.md](GS-O025-SUPABASE-AVAILABILITY.md).
> - D.2 has a scheduled hourly drain, which runs only in `live` mode.
>
> **Update (20 Oct, 16:49 UTC):**
> - The package was rechecked against `e77700ba`: no code drift, migration `b807e3ed6d4f`, and
>   Production unchanged (leads 0, ledger 0001–0004, H4-B absent).
> - **New prerequisite:** Production's keep-alive job must pass first. It proves the Production
>   session-pooler host that step 1's backup also uses, and it keeps Production awake for the
>   operation.
> - Approval wording, once that passes: "Approve GS-R13-H4B-EXEC-001 on dqiutgmxillhsbzgnlsx only:
>   restore-proven backup; migration b807e3ed6d4f; 6 secrets in synthetic-only mode; deploy both
>   H4-B functions from e77700ba or later; one marked synthetic test to contact@gridsmith.uk;
>   delete that test lead. No live mode, drain, push or site change."
