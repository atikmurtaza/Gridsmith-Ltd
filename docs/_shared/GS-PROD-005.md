# GS-PROD-005 — Operational cutover runbook and dry-run evidence

**Date:** 3 October 2026, Europe/London (observations began 2 October UTC).
**Result: PARTIAL PASS — procedure prepared; served Production simulation blocked.**
This document is a plan, not cutover authority. Production is **NOT READY** while `GS-O003`
remains open. No deployment, alias, DNS, environment, Firewall, plan, CMS or database change,
Production form submission or main merge is authorised by this document.

## 1. Baseline, authority and findings

Starting local HEAD and remote `staging/gs-press-001-press` independently matched
`9508412e1cc2396e4deafea30d08e3ab9d606b19`. Remote main:
`fbecbe01e7fb594c6163dab57514997cb248fc21`. GitHub CI:

| SHA | Run | Verified final result |
|---|---|---|
| `9508412e` | `37056516953` | SUCCESS, 48/48 steps |
| `e6f5691e` | `37045218030` | SUCCESS, 48/48 steps, final rerun |

Runtime lineage requires one qualification: `1542f508` is the last lead-pipeline fix, but
`7f6472b2` also changed Technical gate descriptions/messages/schema metadata and migration
manifest semantics to `GS-X002` only. `9508412e` contains the approved two-word Design note
correction. The complete reproducible runtime reference is **9508412e**, not a checkout of
1542f508 with just a copy edit. This phase changes documentation and one source comment only.

Closed decisions preserved: `GS-O005` owner scope/risk decision; `GS-O010`; `GS-O021` owner
decision, TikTok retained with no written permission recorded; `GS-O023`; `GS-T004` applied.
`GS-O024` PI cover stays deferred/non-blocking unless `GS-O003` advice changes that requirement.
`GS-O022` remains optional. No decision was reopened.

| Finding | State / consequence |
|---|---|
| GS-PROD-005-F1 | **GS-O003 OPEN**: legal publication and full cutover blocked. Seven legal routes currently 404. |
| GS-PROD-005-F2 | **GS-X002 OPEN**: only cad-drafting, engineering-drawings and technical-documentation withheld. Do not set professionalScopeConfirmed or migrate these records. Rest of site may proceed after other gates close. |
| GS-PROD-005-F3 | Vercel team dashboard says **Hobby**. Current official documentation restricts Hobby to personal/non-commercial use. The old PRE-DEPLOYMENT-CHECKLIST sentence saying Hobby is no blocker is historical and conflicts with current vendor terms. **GS-O026** records an owner hosting-plan decision before commercial cutover; no upgrade performed. |
| GS-PROD-005-F4 | Supabase Gridsmith Org is **free**; pause risk needs explicit choice **GS-O025**. Occasional leads are not a documented uptime guarantee. |
| GS-PROD-005-F5 | `NEXT_PUBLIC_SITE_URL` absent in Vercel; other required names present, secret values unproven by metadata. No custom Firewall rules. Cutover-time configuration required. |
| GS-PROD-005-F6 | Automatic approval review rejected the loopback-only local `next start` command with “blocked by policy”; no further reason. The owner-requested retry was rejected identically; no alternate server was used. Artifact checks below are not served HTTP checks. Full served dry-run remains outstanding. |

## 2. Hosting and deployment inventory (read-only)

Vercel project **gridsmith-ltd**, `prj_kfFxGWf0ai1VYAGICYfVvNn0QYYN`, team
`team_OVquiVuYynOepnUnaMAgcQnP` / atikmurtaza's projects, currently Hobby.
Source: `.vercel/project.json`, deployment connector, and authenticated dashboard reads.
Project connector schema mismatch and expired CLI token prevented project REST metadata reads;
dashboard inspection supplied environment scopes, domain assignments, protection and Firewall state.
No secret was revealed.

| Target | Deployment / SHA | State and aliases |
|---|---|---|
| Existing Production | `dpl_DmaCdGFLDUg1xKq5GtfFrw6eq4x9`, `fbecbe01`, source `redeploy`, 2 Oct 2026 12:39:08 UTC | READY; gridsmith-jcb1454za-atikmurtazas-projects.vercel.app; aliases gridsmith-ltd.vercel.app, gridsmith-ltd-atikmurtazas-projects.vercel.app, gridsmith-ltd-git-main-atikmurtazas-projects.vercel.app |
| Starting Preview | `dpl_4CXcvFkRcpjUVjphTVmc2Eei7zGa`, `9508412e`, staging/gs-press-001-press | READY; gridsmith-pnncfnwrc-atikmurtazas-projects.vercel.app; alias gridsmith-ltd-git-staging-gs-press-3b9626-atikmurtazas-projects.vercel.app |

The prior “only READY Production is the 3fbc518f scaffold” statement is now stale: the above
fbecbe01 redeploy exists. It was **not created by this phase**, is not the approved runtime,
and must not be treated as the new site's accepted rollback candidate without verification.
The Domains page lists only **gridsmith-ltd.vercel.app**, assigned to Production, valid.
Neither gridsmith.uk nor www.gridsmith.uk is attached.

Deployment Protection: **Require Log In ON / Standard Protection**, password protection OFF;
no automation bypass secret shown. Starting Preview unauthenticated GET returned **302 to login**
with **X-Robots-Tag: noindex**. Do not insist on a historical 401: the observed protection response
is 302. Existing Production `/robots.txt` returns 200, `x-gridsmith-dataset: production`,
`Disallow: /`. Standard Protection does not mean the Production domain is protected; retain
Preview protection and explicitly protect any pre-cutover Production candidate if required.

### DNS and Hostinger

- Authoritative NS query: **hermes.dns-parking.com**, **artemis.dns-parking.com**, NS TTL 86400.
- Apex resolves to Hostinger CDN IPv4 and IPv6, TTL 60. Resolver sample: 89.116.109.136,
  195.200.9.29; authoritative-server sample: 195.200.9.162, 91.108.103.114. Answers vary with CDN
  location; these are observations, **not a DNS rollback zone export**.
- Apex AAAA sample: 2a02:4780:26:b2b5:995c:2d47:1aa0:265 and
  2a02:4780:34:152c:309c:2d58:457c:26ef.
- `www` CNAME = **www.gridsmith.uk.cdn.hstgr.net**, TTL 300. HTTPS www currently redirects to
  apex; apex GET 200, Server hcdn. Existing host is Hostinger.
- Mail MX: mx1.hostinger.com priority 5; mx2.hostinger.com priority 10. Preserve MX, SPF, DKIM,
  DMARC and unrelated TXT records. No mail DNS was altered.

**Exact owner check still needed:** export the configured Hostinger DNS zone and CDN routing
settings, not just resolved IP answers. Identify apex A/AAAA/ALIAS or provider-generated records,
www CNAME, TTLs, CAA, and any Hostinger CDN enablement dependency. At the authorised domain-add
step, copy the **project-specific** apex and www targets from Vercel's domain cards. They cannot
be determined authoritatively before the domains are attached; do not hardcode a generic Vercel IP.

Keep nameservers at Hostinger. Change only web routing records required by those cards; remove
conflicting Hostinger web A/AAAA records for the migrated hostnames (including stale IPv6).
Do not change mail records or domain registration. Configure www → apex as a permanent redirect,
preserving path/query, and verify TLS for **both** hostnames. Check restrictive CAA against Vercel's
current certificate requirements. No certificate-warning bypass. Wait for actual validation and
multi-resolver results; TTL is not a guarantee of instant propagation.

Preserve the Hostinger site, files, database, SSL and account for **at least seven days after a
stable switch** (proposed operational rollback window). Extend on any failure. Do not cancel a
hosting package that also provides mail or DNS. Removal needs owner acceptance, backups, no
remaining dependency and a separate explicit instruction.

## 3. Complete runtime/build environment matrix

Scope from Vercel dashboard, values left masked. P = Preview, R = Production, D = Development.
“Present” proves the name/scope only, never key validity, target project, sender verification or
value equality. Public identifiers marked Secret in the dashboard remain masked here.

| NAME | PURPOSE | PREVIEW REQUIRED? | PRODUCTION REQUIRED? | CURRENT SCOPE | EXPECTED SYSTEM | WRITE CAPABILITY | SECRET? | CUTOVER ACTION |
|---|---|---|---|---|---|---|---|---|
| NEXT_PUBLIC_SANITY_DATASET | CMS build selection | Yes: development | Yes: production | Separate D/P/R entries | Sanity spzu6y31 | None | No; P/R stored as Secret | Confirm R value through build header; keep P development |
| PROJECT_URL | Lead writer and drift-check API origin | Yes | Yes | Separate D/P/R | P qfgpwumvvtizeamkynes; R dqiutgmxillhsbzgnlsx | Address only | No; P/R masked | Owner-confirm R host; first smoke proves actual target |
| SUPABASE_SERVICE_ROLE_KEY | Server-only lead insertion | Yes | Yes | Separate P and R | Respective Supabase projects | Privileged DB API / RLS bypass | Yes | GS-O023 provenance remains accepted; runtime validity awaits smoke; never copy R to P |
| PUBLISHABLE_KEY | Anonymous drift probes | Optional unless probe run | Yes for cron | Separate D/P/R | Matching PROJECT_URL | No app-data grants currently | Publishable; stored Secret P/R | Confirm matching project, retain server-only usage |
| RESEND_API_KEY | Internal notification | Yes for end-to-end test | Yes | Separate D/P/R entries | Owner Resend account / verified sender | Send email | Yes | Confirm scope and validity without logging value |
| LEAD_NOTIFICATION_FROM | Sender address | Yes | Yes | Separate D/P/R | Verified Resend domain/address | Address only | No, metadata masked | Verify authenticated production sender; do not assume onboarding@resend.dev is acceptable |
| LEAD_NOTIFICATION_EMAIL | Internal recipient | Yes | Yes | Separate D/P/R | Owner inbox; P chosen contact@gridsmith.uk in GS-O010 | Address only | Private configuration | Confirm R recipient/inbox receipt; metadata cannot prove it |
| CRON_SECRET | Authenticate /api/rls-drift | No | Yes | R only | Vercel scheduled GET | Authorises refusal probes, which could write if security drifts | Yes | Keep R only; validate schedule/logs under cutover authority |
| NEXT_PUBLIC_SITE_URL | Metadata origin and indexing opt-in | No; normally absent | **Yes: https://gridsmith.uk** | **Absent** | Canonical apex | None | No | Add R only during authorised final RC; new build required |
| VERCEL_ENV | Indexing and probe exclusion | Platform preview | Platform production | System variables enabled | Vercel | None | No | Never manually force production on Preview |
| VERCEL_PROJECT_PRODUCTION_URL | Fallback metadata host | Platform fallback | Platform fallback | System managed, enabled | Vercel | None | No | Do not rely on fallback for final canonical |
| VERCEL_URL | Deployment host fallback | Platform fallback | Platform fallback | System managed, enabled | Vercel | None | No | No manual value required |
| NODE_ENV | Framework mode | Platform build | Platform build | Framework managed | Next/Node | None | No | Production build mode; not equivalent to VERCEL_ENV |
| GRIDSMITH_EXCLUDE_PROBES | Optional local probe exclusion | No | No, VERCEL_ENV already excludes | Not listed | Next configuration | None | No | Leave absent; verify probes 404 in Production |
| NEXT_PUBLIC_BUNDLE_SIZE_PROBE | Deliberate-failure fixture | No | **Must be absent/empty** | Not listed; config defaults empty | Offline gate only | None | No | Never enable in deployed environments |
| NEXT_BUILD_CPUS | Windows build worker limit | No | No | Not listed; local simulation 1 | Next build only | None | No | Leave platform default; not a performance-budget bypass |
| SLACK_LEADS_WEBHOOK | Optional notification fan-out | No | No | Absent | Slack (not configured) | Posts lead summary | Yes | Leave absent; no Slack activation authorised |
| DIRECT_CONNECTION_STRING | Migration/admin tooling only | No | **Not required by app/build** | R only | Production Postgres | Privileged SQL | Yes | Flag excess deployment capability; recommend later owner-authorised removal from Vercel after admin access is preserved |
| SANITY_API_WRITE_TOKEN | Seed/migration tooling only | No | **Not required by app/build** | R only | Sanity | CMS mutation | Yes | Same least-privilege removal recommendation; no removal now |
| VERCEL_OIDC_TOKEN | Platform identity | Not read by application | Not read by application | One shared P/R entry | Vercel tooling | Depends on relying service | Yes, short-lived identity | Owner inspect provenance; a manually stored shared token is not needed by this app. Do not delete platform-managed identity blindly |
| NEXT_PUBLIC_GA4_ID | Removed analytics | No | No | D/P/R | None | None in current app | Public ID | Obsolete; later authorised cleanup |
| NEXT_PUBLIC_POSTHOG_KEY | Removed analytics | No | No | D/P/R | None | None in current app | Public ingestion identifier | Obsolete; later authorised cleanup |
| NEXT_PUBLIC_POSTHOG_HOST | Removed analytics | No | No | D/P/R | None | None in current app | No | Obsolete; later authorised cleanup |

Sanity project/API version are committed constants, not missing environment variables. There is no
DATABASE_URL consumer, no browser Supabase client, no analytics initialisation and no required Slack
integration. CLI-only `GS_PRODUCTION_CMS_CONFIRM`, script selectors such as BASE_URL/AXE_BASE_URL,
VERIFY_PORT, and deliberate-failure flags are verification/migration inputs, not deployed runtime
requirements. Do not migrate local `.env.local`: it retains historical Production/admin credentials.

Only missing required named Production variable observed: **NEXT_PUBLIC_SITE_URL**. No required
runtime variable is Preview-only. The database targets are separately scoped. Equality or correctness
of masked values is **UNVERIFIED**. Shared OIDC configuration and unused R write credentials need
the named cleanup review; the analytics entries are obsolete. None was changed.

## 4. Production data snapshots

### Sanity

Fresh unauthenticated raw read from **spzu6y31 / production**: **47 public documents**,
companyDetails 1, groupPage 2, services Design **13**, Digital **17**, Press **14**.
Technical **0**, legal **0**, seed flags / [SEED] **0**, unexpected public documents **0**.
Every document deep-equals `buildPayload().docs` after removing only `_rev`, `_createdAt`,
`_updatedAt`: **47/47**. References **87**, dangling **0**. Existing migration preflight clean.
An authenticated **read-only count query**, with the existing local token held only in memory,
confirmed **59 total = 47 non-system + 12 system**, drafts **0**, seeds **0**. Anonymous absence
alone was not used to claim there were no drafts. No CMS writes; no credential passed to the build.

### Supabase

Production **dqiutgmxillhsbzgnlsx**, Gridsmith Project, eu-west-1, **ACTIVE_HEALTHY**.
Gridsmith Org **dxqntaccfhwaneknyage**, plan **free** (live organisation metadata).
Aggregate-only queries: **63 leads**, no lead PII read.

| Ledger entry | Stored source hash |
|---|---|
| 0001_core.sql | 39647b54ac55 |
| 0002_view_security_invoker.sql | 97012e3e15c4 |
| 0003_press_path_results.sql | 375b08ff1cab |
| 20260911203125_gs_p01_security_hardening.sql | bd761ff9b9e4 |

RLS **5/5**: `_gridsmith_migrations`, `events`, `leads`, `press_path_results`, `sample_grants`.
Public-schema policies **0**; anon/authenticated/PUBLIC table/view grants **0**.
Service role **7 privileges on each of 5 tables and 2 views**, BYPASSRLS true, leads INSERT true.
`events_id_seq` grants postgres/service_role only. Both views `security_invoker=true`.
Security advisor: **5 INFO rls_enabled_no_policy**, no other findings (deny-all by design).
These are catalog/read proofs; they do not prove the deployed Production credential can insert.

Default ACL inspection is a separate, future-object limitation: postgres public-function defaults
still grant anon/authenticated EXECUTE, and supabase_admin defaults include public-role privileges
for future tables, sequences and functions. This does not contradict the zero effective public
privileges measured on existing application tables/views. Do not claim all provider defaults are
revoked; review the creating role and effective grants whenever a later migration adds objects.
No default ACL was changed in this phase.

## 5. Supabase reliability decision — GS-O025

Current official production guidance says Free projects with low activity during a seven-day
period may pause; the pricing page describes pausing after one week of inactivity. A static
website's page views do not necessarily contact Supabase, and occasional form writes are not a
documented guarantee against pausing. The existing daily RLS security check has a genuine purpose,
but must not be represented as guaranteed pause protection or turned into artificial keepalive.

**A — remain Free:** owner explicitly accepts possible form unavailability, checks pause notices
and project health, maintains exports, and owns restoration. Dashboard restoration is available
for 90 days after pausing; later recovery uses downloadable logical backup/storage into a new
project, with connection/credential changes and fresh verification. Recovery is not instant.

**B — upgrade to Pro:** minimum documented tier removing inactivity pausing, **from USD 25/month**
for the organisation, first project included; additional projects/compute/usage can add cost.
Because the organisation currently contains both Production and Preview, review the actual
checkout estimate for both projects before purchase. No upgrade performed. No documented Free
plan switch guarantees no pause; no keepalive proposed or implemented.

Owner must choose A or B before cutover. Pro is a recommendation for reliability, not an assumed
purchase. This decision is separate from Vercel's commercial-plan issue.

## 6. Firewall plan (not enabled)

Current dashboard: **No Custom Rules Yet**, no IP blocking rules, no system bypass rules.
Vercel DDoS protection exists; no form rate-limit rule is configured.

Source trace: `/contact` → `submitLeadAction`; `/press/contact` → `submitPressLeadAction`;
both → server-only `submitLead`, Zod → service-role PostgREST insert → asynchronous `after()`
notification. Honeypot `website` returns fake success without writing; URL in name is rejected.
No public REST contact endpoint. `/api/rls-drift` is authenticated GET and attempts anonymous
write-refusal probes; **do not invoke it during a read-only phase**. Lead/timeout probe handlers
return 404 in Production. Path Finder is withheld and exposes no production writer.

**Proposed rule:** `GS contact POST rate limit`: method **POST**, fixed window **60 seconds**,
limit **10 requests per source IP**, action **Default 429**. This is a proposed starting policy,
not a measured ideal. No CAPTCHA/Challenge for a form action, no country bans, no broad IP bypass.
Leave GET/HEAD, assets and the authenticated GET cron unaffected.

The visible form routes are `/contact` and `/press/contact` (including trailing-slash requests).
Server Actions are not a path-based authorisation boundary: a valid action reference can be
addressed through another route. Since this app has no other legitimate public POST workflow,
match **all POST paths on the production hostnames** to cover replayed actions as well as the
two normal form paths. Do not rely solely on `Next-Action` header presence: progressive-enhancement
form POSTs can use a different transport shape. Revisit this scope before adding another POST API.

Apply to apex, www and every publicly reachable Production deployment alias; keep unused
deployment URLs protected. Preview should remain authenticated and outside this rule by hostname.
For a safe future proof, use a temporarily authorised exact Preview hostname condition with its
isolated database; remove that test condition after recording the result. No global trusted-IP
exclusion: it would invalidate the proof and can become a permanent bypass.

Official capability check: fixed windows 10s–10min on Hobby/Pro; IP counting supported;
Hobby 1 rate-limit rule / 3 total custom rules, Pro 40. Thus the single rule fits Hobby's
technical limit; **commercial use still requires resolving GS-O026**. Limits count per region,
not as a global exact ceiling. Pro rate limiting is usage-priced; owner reviews pricing dialog.

Safe future test: send an invalid, missing-name/email payload (never a valid lead) through the
actual generated form action on isolated Preview; 11 sequential attempts in one 60s window,
same IP/region and away from the window boundary. Confirm at least one **Firewall-attributed 429**,
normal GET remains 200, database/mail delta zero, and POST works after the window resets.
Use the current build's action, not a fabricated action ID. Repeat on the protected Production
candidate only with explicit refusal-probe authority and the same invalid payload. Test legitimate
forms once under the smoke procedure, not by flooding them. Review NAT/shared-network effects
before changing the proposed limit. Do not enable or publish a rule in this phase.

## 7. Build and indexing dry-run

Fresh isolated worktree at 9508412e, initially no `.next` and **no `.env.local`**, shared installed
dependencies via a junction. Node 24. Build variables only:

```powershell
$env:NEXT_PUBLIC_SANITY_DATASET = 'production'
$env:VERCEL_ENV = 'production'
$env:NEXT_PUBLIC_SITE_URL = 'https://gridsmith.uk'
$env:NEXT_BUILD_CPUS = '1' # existing Windows worker limit
npm run build
```

**Build PASS**, 67/67 generation jobs (jobs are not 67 public pages). Prebuild's Production tier
measured five statutory fields, no published seeds, no unconfirmed published Technical records.
No Supabase/Resend/admin token was loaded; build reads public Sanity only.

Generated artifact inspection with runnable Node assertions:

- **55 rendered HTML pages** (44 service pages + 11 other pages), **7 legal 404 artifacts**;
  no Technical static pages, no production `.probe` specimen pages.
- Canonical URLs correct on **55/55**, including apex root without a trailing slash;
  Open Graph URLs use the Production origin. Twitter card/title/description are text metadata,
  not a separately configured URL; no invented Twitter image or URL requirement.
- **55 parsed Organisation JSON-LD blocks**, all `url=https://gridsmith.uk`.
- Existing company-fact rule functions applied to those generated pages: **0 problems** for
  disclosure, email, telephone, office placement, response copy, team, call language, placeholders,
  social links and taxonomy. This is explicitly **artifact verification**, not `check:company`
  served acceptance. Historical withheld Path Finder and thank-you remain noindex/nofollow.
- Production robots: `Allow: /`, sitemap `https://gridsmith.uk/sitemap.xml`.
- Sitemap **60 URLs**, all Production origin: 53 indexable available pages plus **7 gated legal
  URLs currently 404**. Technical, thank-you and withheld Path Finder absent. This known legal
  dependency must be resolved before indexing; the sitemap is not fully launch-valid today.
- Four fresh imports of `lib/seo/site.ts`: production+URL indexable; production without URL,
  preview+URL, preview without URL all non-indexable. Preview's public response independently
  confirms protection and noindex; no staging indexing was enabled.
- Build redirect manifest has the two intended legacy 308s before the normal slash 308.
  HTTP status/Location/query preservation requires the served check; not claimed from regex alone.

Production artifact hashes (SHA-256):

| Artifact | SHA-256 |
|---|---|
| robots.txt.body | bfb691b9e8f1b419d506c3dde44e446be5dc6752dc8382619dcf7d12771e5e08 |
| sitemap.xml.body | 17e01e74d15a579df35918cb3bdbd85065e011c9238844a8aa8d75fd98552a72 |
| routes-manifest.json | 0afbffedb2c9c33f3ac4c17c94f2d1a055839db057d29cbd9358eac803b3a156 |

`verify:static` PASS; `lint:secrets` source/name sweep PASS (232 sources, 44 chunks, 19 public
assets; **0 secret values loaded**, so value-by-value scan not claimed). `check:launch:build`
Production PASS; `check:service-content:dataset` PASS **against its hardcoded development dataset**.
It is not a Production parity proof: the independent 47/47 payload comparison in §4 is that proof.
No gate weakened, no visual matrix rerun, no Production Lighthouse claimed.

**Outstanding:** automatic approval review blocked starting the local loopback server. Therefore
served `check:company`, `check:redirects`, `check:launch`, legal parity and direct route/probe HTTP
checks were **not run on this simulation**. Expected legal/Technical failures are documented,
not labelled observed gate failures. Do not relabel this phase PASS until those required checks
are run in an authorised safe context and unexpected failures are resolved. The standard full
served gate will remain red on missing gated content until its authorised migration; do not bypass it.

## 8. Route and redirect cutover matrix

All current authorised service routes are in the existing CMS manifest
`GS-PROD-001-CMS-MANIFEST.json` (`eligible:true` service entries), avoiding a second service list.
The exact generated route/status inventory is in `GS-PROD-005-ROUTES.json`.

| Surface | Expected now / cutover |
|---|---|
| /, /about, /approach, /contact, /insights | 200; Insights intentionally empty, no fabricated posts |
| /design, /digital, /press | 200; frozen owner-approved experience |
| /design/services/<13 eligible slugs> | 200 |
| /digital/services/<17 eligible slugs> | 200 |
| /press/services/<14 eligible slugs> | 200 |
| /press/contact | 200, three-step intake; submit only under smoke authority |
| /press/contact/thank-you | 200; noindex/nofollow, absent from sitemap |
| /press/path-finder | 200 withheld historical preview, noindex/nofollow; not a public offering, not in sitemap |
| /legal/privacy, cookies, terms, client-terms, business-client-terms, consumer-client-terms, accessibility | 404 now; all 7 must be 200 after GS-O003 and approved legal migration |
| /design/services/cad-drafting, engineering-drawings, technical-documentation | 404 until GS-X002 and separate migration; only these 3 service routes gated |
| Unknown routes, removed /work and /digital/estimate, unknown service/post slugs | Intentional styled 404; verify status, lang/title, focus and assets |
| /robots.txt, /sitemap.xml | 200; indexing state per §7 |
| /api/rls-drift | Unauthenticated 404; scheduled authenticated GET only |
| /gridsmith-lead-probe, /gridsmith-timeout-probe, /_kitchen-sink, /_master-sink and other .probe specimens | 404 in Production; never call a valid write probe |

Live WordPress sitemap was re-read in this phase; it still lists exactly these eight URLs:

| Existing URL | Required transition | Destination after legal migration |
|---|---|---|
| / | No redirect | 200 / |
| /privacy-policy/ (also without slash) | One 308 → /legal/privacy | 200; currently gated 404 |
| /terms-and-conditions/ (also without slash) | One 308 → /legal/client-terms | 200; currently gated 404 |
| /hello-world/ | Slash 308 → /hello-world | Intentional 404 |
| /category/uncategorized/ | Slash 308 → /category/uncategorized | Intentional 404 |
| /uicore-cd/ui-cd-to/ | Slash 308 → /uicore-cd/ui-cd-to | Intentional 404 |
| /uicore-cd/ui-cd-wp/ | Slash 308 → /uicore-cd/ui-cd-wp | Intentional 404 |
| /?uicore-tb=it-business-footer | No redirect; query retained | 200 / |

Normal `/about/` and service trailing slashes: one 308 to slashless 200. `/` does not redirect.
Legacy query example: `/terms-and-conditions/?ref=old-footer` →
`/legal/client-terms?ref=old-footer`. No redirect-semantic change made. Legacy fragments are not
sent to the server; old home anchors land on the new home without a server fragment redirect.

## 9. Exact future order of operations — DO NOT EXECUTE from this record

1. **Owner:** close GS-O003 on dated solicitor evidence and resolve resulting factual actions;
   preserve GS-O005/O021/O024 decisions. Choose GS-O025 A/B and resolve GS-O026 commercial hosting.
   Obtain GS-O009 explicit final RC/cutover authority, named operator, mailbox observer and rollback
   decision-maker; confirm who can access Hostinger, Vercel, Supabase, Sanity and Resend.
2. **Agent after separate approval:** recheck git/remote SHAs, provider identity, data posture,
   plan, env scopes and DNS. Resolve §7 served-verification gap. No uncontrolled CMS edit during RC.
3. **Owner + agent:** capture current DNS zone/CDN configuration and Hostinger files/database backup;
   preserve existing hosting. Export Production Sanity and take a fresh Production database backup
   outside the repository; verify restore into a disposable database. Record checksums, not PII.
4. **Agent under migration authority:** migrate solicitor-reviewed legal content through a reviewed
   manifest, not the old draft seeder. If GS-X002 evidence is absent, keep all three Technical records
   absent. If it has arrived, use its separately approved Technical migration. Recompute parity,
   seeds, references and legal route content/approval. Do not run the current 47-doc rollback after
   extending the manifest: it would delete the existing authorised catalogue.
5. **Agent:** final clean Production-dataset build at the exact intended release SHA; final static,
   service, company, legal, redirect, security, metadata, accessibility and applicable CI gates.
   Require exact-SHA Linux CI SUCCESS. Record production-specific checks separately from development
   CI. If Technical is intentionally withheld, review that known route expectation explicitly;
   never silently weaken the standard full gate.
6. **Owner:** confirm Production PROJECT_URL/key provenance and mail configuration. Set
   NEXT_PUBLIC_SITE_URL=https://gridsmith.uk in **Production only**. Confirm R dataset production,
   CRON_SECRET, sender/domain status and inbox. Keep Preview isolated/protected. Review excess
   tooling credentials separately; never copy local .env files into Vercel.
7. **Owner + agent after approval:** review and configure §6 Firewall rule; verify its plan/cost,
   invalid-payload refusal proof and legitimate GET access. No challenge that breaks form submissions.
8. **Agent under explicit deployment authority:** create the exact Production candidate without
   assigning the public custom domains. Use the currently documented deployment-without-domain-
   assignment workflow; do not promote the development-dataset Preview. Record READY, SHA,
   Production build env, dataset header and deployment ID. Maintain authentication for pre-cutover
   access and exclude a public indexable candidate from unintended exposure. Do not assume a normal
   Production deploy leaves existing production aliases unchanged; review the assignment option.
9. **Owner/agent:** verify the candidate through authenticated access: all authorised pages,
   legal/Technical states, assets, redirects, company facts, metadata, JSON-LD, robots and sitemap.
   Preview must still require authentication and return noindex. Inspect build/runtime errors.
   Do not submit a valid lead yet; valid candidate testing would be the first Production lead.
10. **Owner:** confirm release decision, restore-ready Hostinger and exact DNS rollback instructions.
    Add/verify apex + www in Vercel on the intended Production candidate; obtain their actual DNS
    targets and verification records. Configure permanent www → apex with path/query preservation.
    Reconfirm the Production alias points to the approved deployment, not fbecbe01 or Preview.
11. **Owner or expressly authorised DNS operator:** change the required Hostinger web records only;
    preserve NS and mail. Reconcile old AAAA/CDN routing. Verify authoritative and at least two
    recursive resolvers plus IPv4/IPv6. Wait for valid TLS on both domains. Abort on wrong target.
12. **Agent:** check HTTPS apex/www, home, all studios, all 44 services (or the explicitly enlarged
    set), all 7 legal routes, unknown-route 404, redirects/query/slash handling, assets, canonical,
    robots, sitemap and JSON-LD. Check desktop/phone keyboard/focus and critical accessibility.
    Run deployment/domain-specific Lighthouse only now; no pre-switch claim substitutes for it.
13. **Owner + agent under explicit form authority:** perform exactly one primary synthetic form
    smoke (§10), correlate the Production row, deployment log and actual inbox receipt, confirm
    Preview has no marker. Then perform one Press smoke. Reconcile any uncertain result before retry.
14. **Agent:** confirm cron schedule/security behaviour and logs under explicit probe authority,
    no public data access, zero unexpected exceptions, expected Firewall outcomes. Analytics/Slack
    are absent; no activation or invented traffic report. Begin §13 monitoring.
15. **Owner:** accept the cutover only after every mandatory observation is green. Keep Hostinger
    intact for the rollback window; record candidate ID, exact SHA, aliases, DNS export and test IDs.
    If any abort condition fires, use §11. Do not merge main merely to close the record; main merge
    is a separate explicitly authorised release action with its auto-deployment effect considered.

## 10. First Production lead and email smoke — NOT SUBMITTED

Prerequisites: legal routes published, public domain resolves to the approved deployment, correct
Production key provenance recorded, owner monitoring intended inbox, and explicit one-test authority.
Create a unique UTC run suffix at execution, e.g. `20261003T120000Z` is a **format example only**.
Do not place credentials or real customer data in fields, screenshots or logs.

**Primary:** browser `https://gridsmith.uk/contact?division=digital` after confirming rendered
Digital selection. Name `GS CUTOVER CONTACT <run>`; email `gs-cutover-<run>@example.invalid`;
message `SYNTHETIC CUTOVER TEST <run> — no client enquiry; authorised verification only.`;
company/phone/budget/timeline optional, leave blank/default; honeypot website empty. Submit once.
Expect inline success and exactly one Production `leads` row, division digital, lead_type enquiry,
payload `{}`, no fabricated service slug, default status new. `notified_at` remains null by design;
it is **not a delivery receipt**. No confirmation email goes to the synthetic sender address.

Expected internal email: configured Production recipient, verified Production sender, subject
`New digital lead — GS CUTOVER CONTACT <run>`, matching record UUID. The enquiry message must not
be copied into email; `notify.ts` sends identity/classification/record ID. Require owner inbox
receipt and Resend delivery status, not just API acceptance or success UI. Record both timestamps.

**Press:** still valuable because it covers a different adapter, branch payload and redirect.
Use `/press/contact`, segment author, manuscriptStage idea, genre `Synthetic test`, wordCount
unknown, previouslyPublished no, timeline no-deadline, triedElsewhere and manuscriptLink blank.
Name `GS CUTOVER PRESS <run>`; email `gs-cutover-press-<run>@example.invalid`; same synthetic
message. Submit once. Expect `/press/contact/thank-you`, division press, lead_type enquiry,
payload segment author and the above answers (no undefined optional values), one row and one
internal email `New press lead — GS CUTOVER PRESS <run>`.

Record before/after aggregate counts in both projects and marker-filtered UUID/classification
counts, never other lead data. Required: exactly one row per authorised test in Production and
**zero matching markers in Preview**. Unrelated real activity may change total counts, so deltas
alone are insufficient. Correlate Vercel deployment ID and request time with the Production row
to prove UI → Production deployment → Production PROJECT_URL/service-role credential → insert.
Catalog deny-all/public-grant checks plus service-role insertion establish the intended privilege
boundary; never test RLS by enabling public access.

**Duplicates:** application has no idempotency key; a second submission can create another UUID.
Expected one per click, not guaranteed deduplication. On timeout or ambiguous outcome, inspect the
marker first; do not retry until reconciled. Success UI proves insert, not mail: `after()` failures
are not returned to the visitor and notification outcomes are not durably stored/logged by this
pipeline. Owner receipt/Resend are mandatory evidence.

**Cleanup:** only after evidence is retained and the later phase explicitly authorises deletion,
delete the exact two captured UUIDs with matching synthetic name/email/run conditions, in a
transaction that refuses an unexpected row count. Never delete by a broad email-domain pattern or
clear leads. Re-read marker count zero; preserve unrelated rows. Record minimal UUID/status receipt.
Mailbox owner may remove those exact synthetic emails under their normal retention workflow.
No cleanup, submission, mail send or Production write occurs in GS-PROD-005.

## 11. Rollback by failure class

| Failure | Trigger / immediate action | Alias vs DNS | Data and recovery verification |
|---|---|---|---|
| Application | Critical 5xx, broken primary journey/assets or critical accessibility: stop release and submissions; return to a **verified** prior compatible Vercel deployment if one exists | Alias rollback sufficient for app-only failure when domain/TLS works. Otherwise restore Hostinger web routing from zone/CDN snapshot | Preserve new leads; do not restore DB for code failure. Verify home, services, legal, metadata, assets, forms on restored target |
| DNS/TLS | Wrong A/AAAA/CNAME, domain attached to wrong project, invalid certificate, www loop | Restore exact configured Hostinger records/CDN state; Vercel alias alone cannot correct DNS | Keep both hosts intact during cache convergence; test authoritative + recursive resolvers, IPv4/IPv6, apex/www TLS. No instant-propagation promise |
| Forms | Wrong project, no row after success, duplicate from one click, or inability to submit | Halt valid tests; reconcile marker before retry. Alias rollback only to a credential-compatible verified build; otherwise return web routing to Hostinger after confirming its intake still works | Preserve both databases; wrong-project write is an incident, not an automatic delete. Verify no Preview marker and correct Production classification before re-opening |
| CMS | Wrong dataset, seed/legal/Technical exposure, unexpected document/parity drift | Stop public release; alias to a known safe built snapshot if available, else Hostinger DNS rollback | Sanity-backed pages are built snapshots; reverting CMS alone does not fix deployed HTML. Restore only reviewed affected content from backup under separate authority, rebuild and verify |
| Database | Paused/unavailable project, unexpected grants/policies/ledger, failed inserts | Do not weaken RLS. Owner restore/upgrade or incident action; application alias cannot fix a shared database outage. Use verified Hostinger intake if returning traffic | No automatic backup restore over live leads. Export/reconcile post-cutover writes first. Recheck health, ledger, grants, RLS and one authorised smoke |
| Email | Missing expected internal delivery, bounce or wrong recipient | Stop acceptance; preserve inserted row, inspect Resend/domain/configuration/inbox. Alias rollback only if configuration/code cause is resolved by that target; DNS rollback usually does not fix Resend | Do not resubmit lead just to resend mail. Owner manually reconciles captured enquiries; any resend requires authority. Receipt plus matching UUID required before acceptance |

Before the first successful cutover there may be **no verified prior Vercel release of this
approved site**. fbecbe01 being READY is not enough. Hostinger preservation is therefore essential.
During DNS rollback, visitors may reach both hosts; reconcile both intake paths and avoid duplicate
handling. Never roll back migration 0004 or restore weaker grants as part of website rollback.

## 12. Objective abort thresholds

STOP before switching, or halt acceptance and rollback as appropriate after switching, on any:

1. Candidate not READY, SHA differs from approved full SHA, CI not SUCCESS, or alias targets another deployment.
2. GS-O003 still open; any of the seven legal routes not 200 after its authorised migration.
3. Any gated Technical record/route public before GS-X002, any seed marker or unexpected CMS record.
4. Canonical/og/Organisation URLs use another origin; final robots disallows the intended launch;
   Preview becomes indexable/unprotected; sitemap contains a URL outside apex or any unintended 404.
5. Any critical route, asset, form or approved legacy redirect fails its exact status/target expectation;
   query lost, redirect loop/chain, invalid TLS or divergent stale Hostinger IPv6 routing.
6. Production smoke writes to Preview/other project, returns success without exactly one matching
   Production row, or writes duplicate rows from one authorised submission.
7. Expected email is not delivered within **5 minutes** of the synthetic insert (proposed acceptance
   timeout, not a public response promise), bounces, or reaches the wrong inbox. Reconcile, never blind retry.
8. RLS fewer than 5 expected tables; public table/view grant or policy appears; service-role INSERT
   absent; view not security_invoker; ledger/hash mismatch; Supabase not ACTIVE_HEALTHY.
9. Any critical accessibility regression, client secret exposure, unexpected real-data disclosure,
   unexpected valid write during verification, or unapproved provider/security configuration change.
10. Firewall fails invalid-payload proof, blocks ordinary GET, or prevents one legitimate smoke;
    owner hosting-plan/backup/access prerequisites unresolved.

These thresholds are operator decisions for this proposed runbook; no thresholds in existing gates
have been relaxed. No cumulative error percentage substitutes for one wrong-project write.

## 13. Monitoring with existing systems

| Window | Operator checks and evidence |
|---|---|
| First 15 minutes | Owner and agent present: apex/www TLS and target, critical GETs/redirects, Vercel errors and Firewall decisions, both smoke UUIDs, Resend delivery and inbox receipt, Production health and Preview marker absence. Recheck after the switch and after each smoke. |
| First hour | Repeat at 30 and 60 minutes: Production errors, failed actions, DNS convergence incl. IPv6, Supabase health/resource usage, Resend failures, missing/duplicate synthetic records; lightweight phone/desktop checks. No repeated valid leads. |
| First 24 hours | Owner checks at about 4h, 12h and 24h: Vercel errors/available 404 and Firewall traffic, Supabase status/usage/pause notices, mail deliverability, domain/indexing state, and existing 04:00 UTC cron execution/result. Free Supabase log retention is short; save redacted incident evidence promptly. No uptime claim from missing logs. |
| First 7 days | Daily owner review of the above, any real enquiry backlog and delivery issues; repeat lightweight performance measurements if a symptom appears. At day 7 confirm stability, backups and rollback closure before considering Hostinger removal. Extend window if unresolved. |

Use Vercel logs/Firewall/available Observability, Supabase dashboard/advisors and Resend plus owner
inbox. No new paid monitoring or analytics. Available request/404 visibility depends on the plan;
do not claim full static access logging or Search Console evidence if unavailable. Check public
robots/sitemap and Preview headers for unintended indexing; search appearance lags configuration.
Notifications are not durably reconciled by the app, so logs alone cannot prove every email arrived.
Monitoring is a procedure, **not a newly scheduled automation** and not an artificial keepalive.

## 14. Owner action matrix

| Category | Required action / evidence |
|---|---|
| OWNER MUST DO BEFORE CUTOVER | GS-O025 choose Free risk acceptance or Pro; GS-O026 resolve commercial Vercel hosting; GS-O003 solicitor evidence and resulting actions; confirm production sender/recipient/key provenance; DNS zone/CDN export and operator access; verified backups; name monitoring/rollback owner; explicit GS-O009 final release authority |
| OWNER MUST DO DURING CUTOVER | Approve final candidate ID/SHA and domain switch; perform or explicitly delegate Hostinger/Vercel changes; observe actual mail receipt; decide abort/rollback promptly; accept results and preserve Hostinger window |
| AGENT CAN DO AFTER OWNER APPROVAL | Targeted legal/Technical migration for evidence received; final RC and served checks; scoped env/Firewall/domain configuration; Production deployment; expressly authorised DNS operations; two synthetic smokes and exact-row cleanup; redacted evidence and monitoring reads |
| EXTERNAL PARTY REQUIRED | Solicitor GS-O003 / GS-X001; suitable professional GS-X002 review of the three Technical records. GS-X002 is not an insurance or regulated-signoff prerequisite for the rest of the site |

### Remaining work classification

- **FULL CUTOVER BLOCKERS:** GS-O003 and legal publication; GS-O026 commercial hosting resolution;
  required served Production dry-run evidence; final owner RC/cutover approval.
- **TECHNICAL-SERVICE-ONLY BLOCKER:** GS-X002, then explicit migration of its three reviewed records.
- **CUTOVER-TIME ACTIONS:** GS-O025 decision, fresh backups, final CI/build/data checks, env value
  confirmation and site URL, Resend sender/inbox confirmation, Firewall proof, candidate/alias/domain
  configuration, DNS/TLS, legal/redirect acceptance, smokes, cleanup and monitoring ownership.
- **DEFERRED / OPTIONAL:** GS-O024 PI cover as already decided, GS-O022 official Freelancer mark,
  authorised removal of obsolete analytics/admin deployment variables, analytics/Slack activation
  (not requested), paid monitoring (not requested). No keepalive.

## 15. Sources and release receipt

Official pages retrieved on 3 October 2026 (London); web search returned no usable results, so
the public primary-source pages were fetched directly. Vendor facts were not inferred from memory:

- https://supabase.com/pricing — Free pause, Pro from USD 25, project/usage pricing and log retention.
- https://supabase.com/docs/guides/platform/going-into-prod.md — low activity / seven days and Pro guarantee.
- https://supabase.com/changelog.md and its linked
  https://supabase.com/changelog/27497-paused-free-plan-projects-are-restorable-for-90-days — restoration.
- https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting.md — fixed window, IP key, 429/log actions, per-region counters and plan limits (page last_updated 2026-08-28).
- https://vercel.com/docs/plans/hobby.md — personal/non-commercial restriction.
- https://vercel.com/docs/domains/working-with-domains/add-a-domain.md — use project domain-card DNS values.
- https://resend.com/docs/dashboard/domains/introduction — domain verification; use actual sender-domain records, never replace existing mail records by copying an old generic SPF instruction.

Repository evidence: lib/seo/site.ts, app/robots.ts, app/sitemap.ts, next.config.ts,
redirects/legacy.json, lib/leads/{action,pressAction,submit,notify,schema,guard,pressLead}.ts,
app/api/rls-drift/route.ts, sanity/{env,project}.ts, migration manifest and existing gates.

Release commit is the commit adding this record. The final full SHA and its GitHub CI run are
recorded in the handoff response, avoiding a self-referential commit hash. Starting worktree's
untracked .codex/, AGENTS.md and public/brand/design/preview.html were untouched. Work used an
isolated codex/gs-prod-005 worktree and publishes **only to staging/gs-press-001-press**.
No runtime change except a non-executing provenance comment; no production operation performed.

**Next phase, not executed:** GS-X002 arrives first → separately authorised Technical migration;
GS-O003 first → separately authorised legal migration, Technical stays absent;
both → final Production RC after scoped migrations and remaining operational prerequisites.
Neither evidence alone authorises cutover. GS-PROD-005 remains PARTIAL PASS until the served
dry-run gap is closed; do not use the requested PASS closing formula prematurely.
