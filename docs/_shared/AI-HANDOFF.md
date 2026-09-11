# AI handoff

## Execution

- **Task ID:** `GS-P01`
- **Task:** Dependency, database-boundary and application security hardening
- **Agent/model:** Codex
- **Status:** COMPLETE IN REPOSITORY; production migration/deployment deferred
- **Date:** 11 September 2026

## Repository state

- **Starting commit:** `b0f4fee7f3300f45d2bc663a2a73d48f43ac67a6`
- **Ending commit:** the single GS-P01 commit containing this handoff; use `git rev-parse HEAD`
- **Branch:** `main`, tracking `origin/main`
- **Starting working tree:** clean
- **Scope:** dependency patching, lead/database boundary, security headers, regression gates and
  control documentation only
- **Pushed:** YES when the GS-P01 commit is present on `origin/main`

## Dependency security

Initial `npm audit --omit=dev`: **1 critical, 2 high**.

| Package/path | Installed | Advisory and affected range | Treatment |
|---|---:|---|---|
| direct `next` | 15.5.23 | `GHSA-p293-qw3h-jr36`, `>=13.4.0 <15.5.24`, unauthenticated Windows-hosted RCE | patched to 15.5.25; Vercel is not Windows-hosted, but local Windows execution exists and compatible remediation was available |
| direct `next` | 15.5.23 | `GHSA-2xp9-vwfh-vxw4`, `>=10.0.0 <15.5.24`, unauthenticated AVIF image-optimizer RCE | patched to 15.5.25; no `next/image` import or AVIF configuration was found, so the vulnerable route was not shown reachable, but the production tree included it and a compatible patch existed |
| `next -> postcss` | 8.4.31 | high: `GHSA-6g55-p6wh-862q`, `<=8.5.11`; high: `GHSA-r28c-9q8g-f849`, `<=8.5.17`; moderate: `GHSA-qx2v-qp2m-jg93`, `<8.5.10`; moderate: `GHSA-fxqj-rqcc-2cmp`, `<=8.5.22` | scoped override to installed PostCSS 8.5.28; build-time processing is reachable, but repository CSS is trusted and no attacker-controlled source-map input was identified |
| `next -> sharp` | 0.34.5 | `GHSA-f88m-g3jw-g9cj`, `<0.35.0`; `GHSA-rgj7-g3m4-5g8c`, `<0.35.4` | scoped override to Sharp 0.35.4; no current `next/image` use was found, so the native decoder path was not shown reachable, but the vulnerable production dependency was straightforward to replace |

Final installed tree: Next.js `15.5.25`, PostCSS `8.5.28`, Sharp `0.35.4`. Final production
audit: **zero vulnerabilities**. No forced or framework-major upgrade was used.

## Lead and database boundary

Previous path: browser form -> Server Action/Zod -> PostgREST with publishable key -> `anon`
`INSERT` policy using `WITH CHECK (true)` -> asynchronous notification. Direct Data API callers
could bypass application validation and submit internal columns because table-level insert grants
covered every column.

Final repository path: browser form -> existing Server Action -> strict Zod object/JSON and 16 KiB
payload validation -> explicit parsed-field mapping -> PostgREST with
`SUPABASE_SERVICE_ROLE_KEY` from a `server-only` module -> asynchronous notification. Unknown fields,
including status, notes and notification/CRM timestamps, are stripped before insertion.

The pending migration:

- drops the anonymous lead-insert policy;
- revokes all `anon`/`authenticated` privileges on the five reviewed tables and the events sequence;
- enables RLS on `_gridsmith_migrations` with no public policy because only the direct privileged
  migration script needs it;
- adds bounded lead text, basic email-shape, JSON-object and 16 KiB payload constraints;
- revokes future default public table and sequence privileges for the migration role.

Read-only production aggregates confirmed all 63 existing lead rows satisfy every proposed
constraint. No lead-write or hostile-write verification was attempted against production.

## Supabase finding status

| Subject | Repository treatment | Live state after GS-P01 |
|---|---|---|
| `_gridsmith_migrations` / `GS-T004` | RLS enabled, public grants revoked in migration | **OPEN** until controlled migration; live RLS remains disabled and public grants remain |
| `leads` | public policy removed, public grants revoked, durable constraints added | **OPEN** until migration; live anon insert policy remains |
| `sample_grants` | public grants revoked; RLS/no-policy server-only model retained | **OPEN** until migration; live broad grants are latent behind RLS |
| `events` | public grants and sequence privileges revoked; RLS/no-policy model retained | **OPEN** until migration; live broad grants are latent behind RLS |
| `press_path_results` | public grants revoked; RLS/no-policy server-only model retained | **OPEN** until migration; live broad grants are latent behind RLS |

Supabase project `dqiutgmxillhsbzgnlsx` remained `ACTIVE_HEALTHY`. Current Supabase security
advisors still report the live migration ledger as RLS-disabled and the three intentional
RLS/no-policy server-only tables as informational. No development branch exists.

## Application security

- Added an enforced staged CSP with bounded base, form, frame, object, image, font, connection,
  media, worker and manifest sources. Next-compatible inline script/style allowances remain until a
  nonce-based policy is separately justified and tested.
- Added `Referrer-Policy`, `X-Content-Type-Options`, `X-Frame-Options`, `Permissions-Policy` and
  one-year HSTS; disabled `X-Powered-By`.
- Added source and served regression gates, wired into local verification and CI.
- Lead and RLS probes are now non-mutating. The live drift route suppresses write-refusal probes
  until the migration ledger is no longer publicly readable, so application deployment before the
  migration cannot create leads through the old policy.
- Added `SUPABASE_SERVICE_ROLE_KEY` to `.env.example` as server-only. No value was printed or
  committed. Local and Vercel presence was not assumed.

## Verification

| Check | Result |
|---|---|
| Baseline production audit | **PASS reproduced** — 1 critical, 2 high, exact advisories recorded above |
| `npm run verify:static` | **PASS** — 37-gate chain including lead/RLS security checks |
| `npm run verify:build` | **PASS** from a clean `.next`, `NEXT_BUILD_CPUS=1`; 69 pages generated, 67 route bundle budgets passed |
| Served security headers | **PASS** on `/`, `/contact` and a 404 response |
| Lead-security deliberate failure | **PASS** — publishable-key substitution made the gate fail; subject restored byte-for-byte and passed |
| Header deliberate failure | **PASS** — invalid MIME-header value failed on all three routes; subject restored byte-for-byte, rebuilt and passed |
| Production data compatibility | **PASS read-only** — 63/63 leads satisfy proposed constraints |
| Migration clean replay | **NOT RUN** — Docker unavailable and no non-production Supabase branch; production mutation prohibited |
| `npm run lint:secrets` | **PASS** — source, client chunks and public assets scanned; service-role value absent locally, so name/boundary checks apply |
| `git diff --check` | **PASS** |
| Final `npm audit --omit=dev` | **PASS** — zero vulnerabilities |
| Full `verify:served` | **NOT RUN** — the notification probe can call a configured external provider; GS-P01 did not expand into notification delivery |
| Lighthouse axes | **LOCAL SKIP** on Windows by established harness rule; GitHub/Linux CI remains authoritative |

## Remote changes

- **GitHub:** one GS-P01 commit pushed to `main` when release checks complete
- **Supabase schema/data/RLS/Auth/credentials:** none
- **Vercel:** none; CLI authentication unavailable, so remote environment presence remains unverified
- **Hostinger/DNS/`gridsmith.uk`:** none

## Findings and programme state

- `GS-T006`: **REMEDIATED** in repository and lockfile; zero production audit findings.
- `GS-T004`: **REMEDIATED IN REPOSITORY / OPEN LIVE** pending controlled migration and deployment
  coordination.
- Lead direct-write boundary: **REMEDIATED IN REPOSITORY / OPEN LIVE** until migration and
  server-only environment are activated together.
- Security headers: **REMEDIATED IN REPOSITORY / UNDEPLOYED**.
- Notification retry/reconciliation, delivery, SEO, content, service definitions, commercial
  presentation and production release remain explicitly outside GS-P01.
- No new owner action is required. Existing `GS-O002` through `GS-O005` are unchanged.
- Production readiness remains **NOT READY**.

## Recommended next phase

Prepare the owner-approved service-definition/content architecture phase, while scheduling the
GS-P01 migration and server-only environment activation as one controlled pre-release operation.
Do not begin production deployment automatically.
