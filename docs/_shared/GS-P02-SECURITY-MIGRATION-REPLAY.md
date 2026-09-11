# GS-P02 security migration replay and activation-readiness report

**Task:** `GS-P02` — security migration replay and deployment-readiness verification

**Date:** 12 September 2026

**Repository commit tested:** `daf192f1a6ce16f49bc0525ede6262fc198fcf8d`

**Production Supabase project:** `dqiutgmxillhsbzgnlsx` (`Gridsmith Project`)
**Decision:** `GS-T004` is **READY FOR CONTROLLED ACTIVATION**, but remains open in production.

This report is activation evidence, not authority to migrate or deploy production. GS-P02 changed no
production database, Supabase Auth, credentials, Vercel environment, deployment, Hostinger setting or
DNS record.

## State separation

| State | Result |
|---|---|
| Repository | Four migrations declare the hardened grants, RLS and lead constraints; the application uses a server-only writer. |
| Disposable replay | All four migrations applied and the intended effective access model was proved. |
| Supabase production | Still at migrations `0001`–`0003`; the GS-P01 migration is not applied, ledger RLS remains off, public grants remain, and the anonymous lead-insert policy remains. |

## Safe replay environment

Docker Desktop and the current Supabase CLI were used to create a disposable local Supabase stack
under the user's local temporary directory. The stack used dedicated ports `55321` and `55322` and a
unique project identifier. Existing CRM and attendance containers were not modified or stopped.

- Production was isolated throughout.
- No Supabase branch, hosted project, billing change or paid infrastructure was created.
- No production lead contents were copied into the replay database.
- All replay and application submissions used synthetic data only.
- The temporary stack and its generated local credentials were destroyed at the end of the task.

The current Supabase changelog was reviewed before replay. No current breaking change affected this
repository migration chain. The disposable stack ran Postgres 17 and PostgREST 16, consistent with
the current local Supabase toolchain.

## Complete clean replay

The repository runner, `scripts/migrate.mjs`, applied the chain in this order:

1. `0001_core.sql`
2. `0002_view_security_invoker.sql`
3. `0003_press_path_results.sql`
4. `20260911203125_gs_p01_security_hardening.sql`

The clean run completed without SQL errors. Running the same repository migration command again
applied zero migrations: the ledger and SHA checks provided runner-level repeatability.

The replay database contained the expected five reviewed tables:

- `_gridsmith_migrations`
- `leads`
- `sample_grants`
- `events`
- `press_path_results`

It also contained the expected lead constraints and indexes, the `events_id_seq` sequence, and both
reporting views with `security_invoker=true`.

## Representative upgrade replay

A second disposable database was brought to the representative pre-GS-P01 state by applying
`0001`–`0003`, then populated with two synthetic, constraint-compatible lead rows. Applying the
GS-P01 migration succeeded and retained both rows. This proved upgrade behaviour without moving or
reproducing production personal data.

The GS-P01 migration depends deliberately on:

- the migration ledger created by `scripts/migrate.mjs`;
- the objects created by migrations `0001`–`0003`;
- the established `postgres` migration role for default-privilege changes.

It does not depend on unrecorded production-only objects or data.

## Existing production-data compatibility

Read-only aggregate checks were run against the verified production project. The production table
contained 63 leads. Zero rows violated each proposed GS-P01 constraint, including trimming and length
bounds, the basic email shape, JSON object shape and the 16 KiB payload ceiling. No lead contents were
reported, copied or changed.

Result: **63/63 existing rows are compatible**.

## Effective access after replay

Effective behaviour was tested rather than inferred from migration text.

| Check | Replay result |
|---|---|
| RLS on all five reviewed tables | Enabled |
| Remaining policies on those tables | Zero |
| Direct `anon` reads/writes | Denied with PostgreSQL `42501` |
| Direct `authenticated` reads/writes | Denied with PostgreSQL `42501` |
| Anonymous PostgREST reads/inserts | Denied with HTTP `401` |
| Service-role lead insert | HTTP `201` |
| Service-role lead read | HTTP `200` |
| Anonymous migration-ledger access | Denied |
| Anonymous/authenticated access to reporting views | Denied |
| `events_id_seq` public access | Revoked |
| Future table/sequence public defaults | Revoked |

The absence of policies is intentional: these tables are server-only data surfaces after GS-P01.
RLS remains defense in depth behind the explicit privilege revocations.

## Application-boundary verification

The application was run against the disposable Supabase stack with notification-provider variables
explicitly blank. A synthetic public contact submission completed through the intended path:

public form → Next.js Server Action → strict Zod parsing and payload limit → explicit field mapping →
server-only service-role client → `leads`.

The page displayed the success state, exactly one row was persisted, its status used the database
default `new`, and protected/internal fields were not accepted from public input. The synthetic row
was deleted after inspection. Direct anonymous insertion remained denied.

## Migration quality review

### Transaction and partial application

`scripts/migrate.mjs` executes each migration file and its ledger insert in the same transaction. An
error rolls back that entire file, including its ledger record. Earlier successfully committed files
remain recorded and a later run can continue safely.

### Repeatability

The SQL file is not independently idempotent: a manual second execution would collide with its named
constraints. That is acceptable under the established repository runner, which refuses SHA drift and
skips already-recorded files. Production activation must use that runner or an equivalent reviewed
transactional process; operators must not paste and rerun the SQL blindly.

### Locking and rewrite

Adding validated `CHECK` constraints scans `leads` and requires an `ALTER TABLE` lock while the
constraints are installed. No table rewrite is expected. With 63 compatible rows, the operation is
suitable for a short, controlled low-traffic activation window, but it is not a zero-lock operation.

### Correction decision

No replay defect was found. Rewriting the unapplied GS-P01 migration or adding a corrective migration
would create noise without improving safety. **No migration correction is required.**

## Vercel environment evidence

The linked project is `gridsmith-ltd` (`prj_kfFxGWf0ai1VYAGICYfVvNn0QYYN`) and its configured Node
runtime is `24.x`.

Presence and scope were inspected without printing values:

| Variable group | Development | Preview | Production |
|---|---:|---:|---:|
| Public Supabase URL/key variables | Present | Present | Present |
| `SUPABASE_SERVICE_ROLE_KEY` | Absent | Absent | Present |

Development's public variables resolve to the production Supabase project. Preview's stored values
could not be read through the available tooling; however, the verified Supabase organisation has no
branch and no second accessible non-production project. Preview therefore **must be treated as
non-isolated unless a distinct target is positively proved**. No Preview submission was attempted and
the production service-role key must not be copied into Preview.

The production service-role variable is present, satisfying the server writer's production secret
dependency. No environment variable was added, changed, removed or exposed during GS-P02.

## Deployment evidence and limitation

No Preview or production deployment was created or promoted. The most recent GS-P01 production-target
deployment is `ERROR`, consistent with the intentional `check-launch-content` failure against the
empty production Sanity dataset. This is a production-content/deployment blocker, not a migration
replay defect.

Consequently:

- the server writer has been proved locally against an isolated backend;
- its production secret is present;
- a safe hosted Preview E2E test is blocked by missing backend isolation;
- production deployment remains blocked until verified real Sanity content and the wider release
  gates are ready.

## Served security headers

A clean production build was served locally and actual responses were checked on `/`, `/contact` and
a 404 route.

| Control | Result |
|---|---|
| Content-Security-Policy | Present and enforced |
| Referrer-Policy | Present |
| X-Content-Type-Options | Present |
| Framing policy | CSP `frame-ancestors` and `X-Frame-Options` present |
| Permissions-Policy | Present |
| Strict-Transport-Security | Present; effective when served over HTTPS |
| X-Powered-By | Absent |

The browser rendered meaningful content, showed no framework error overlay, and reported no page or
console errors. No current functionality was visibly broken. Final production verification must
still exercise the real Sanity, Supabase and notification origins over HTTPS.

## Controlled activation plan

This order avoids both failure windows: new code without its secret, and old browser code after
anonymous database insertion has been removed.

1. Complete the independent production-content and release gates so a production-target build can
   succeed; obtain explicit production-release and migration authority.
2. Confirm by presence/scope only that Production still contains the public Supabase variables and
   `SUPABASE_SERVICE_ROLE_KEY`. Do not rotate or expose the key merely for activation.
3. Prepare reviewed recovery SQL before the window. Record the pre-change migration ledger, grants,
   RLS and policy state using read-only queries.
4. Deploy the GS-P01 server-writer code while the old anonymous insert policy still exists. The old
   database remains compatible with both paths during this step.
5. Prove the deployed Server Action uses the server writer and persists one explicitly authorised
   synthetic probe; remove that probe through the privileged maintenance path. Do not infer this from
   a `200` response alone.
6. In a short controlled window, run the full repository migration command against Production. It
   should apply only `20260911203125_gs_p01_security_hardening.sql`.
7. Immediately verify the ledger/SHA, constraints, RLS, zero-policy state, grant revocations,
   anonymous read/insert denial and service-role persistence.
8. Run one authorised end-to-end synthetic website submission, confirm only the mapped public fields
   landed, then delete the probe. Monitor application/runtime errors.
9. Close `GS-T004` only after the production effective-access and application checks pass.

## Rollback and recovery conditions

Stop and recover if the deployed writer cannot persist, any required secret is absent, migration SHA
or ledger state differs, a constraint rejects current data, the migration does not complete as one
transaction, anonymous access remains possible, or ordinary enquiry submission fails after migration.

- Before the database migration: roll back the application deployment if necessary; the old database
  remains compatible with the old anonymous path.
- After the database migration: do not roll back to browser-only insertion while the database remains
  hardened. Prefer repairing/rolling forward the server writer.
- If application rollback is unavoidable, first restore the reviewed minimum prior lead privilege and
  policy transactionally, verify the restored path, and record the temporary exposure. Do not disable
  RLS broadly or restore unrelated table grants.
- If the migration itself fails, its per-file transaction should leave the GS-P01 schema and ledger
  unapplied. Verify this explicitly before retrying.

## Verification summary

- Complete clean migration replay: **PASS**
- Runner repeatability: **PASS**, second run applied zero migrations
- Representative pre-GS-P01 upgrade: **PASS**
- Production compatibility, aggregate read-only: **PASS**, 63/63
- Effective RLS/grants/policies: **PASS**
- Service-role access: **PASS**
- Application E2E against disposable backend: **PASS**
- `npm run verify:static`: **PASS**
- `npm run verify:build`: **PASS**, 69 pages and 67 bundle budgets
- Served header/browser verification: **PASS**
- `npm audit --omit=dev`: **PASS**, zero vulnerabilities
- GitHub CI for `daf192f1`: **PASS**
- Production migration: **NOT RUN — PROHIBITED IN GS-P02**
- Hosted Preview E2E: **BLOCKED — BACKEND ISOLATION NOT PROVED**
- Production deployment: **NOT RUN — PROHIBITED IN GS-P02**

## Decision

`GS-T004` remains **REMEDIATED IN REPOSITORY / OPEN IN PRODUCTION**. Its migration is **READY FOR
CONTROLLED ACTIVATION** under the sequence above. Overall Gridsmith production readiness remains
**NOT READY** because production content, external/owner gates, human acceptance and live release
verification remain incomplete.
