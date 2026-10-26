# GS-HOST-H4-B — Forms and external dynamic boundary

Date: 4 October 2026. Isolated worktree `gs-host-004`, branch `codex/gs-host-004`.
Starting SHA: `63e100f0da211d54e99008515c43cbbd1e595b19`.

## Result and authority

**PASS — local and isolated Preview H4-B acceptance only**, subject to the final scoped
verification and local commit receipt below. This is not a Hostinger release, full-site
accessibility/visual/performance RC, Production migration or cutover approval.

Owner explicitly approved only Preview `qfgpwumvvtizeamkynes`, existing non-production
mail configuration and marked synthetic messages to `contact@gridsmith.uk`. Production
`dqiutgmxillhsbzgnlsx` received no project-specific operation in H4-B. CLI project inventory
returned both project metadata; all database/function/secret calls target Preview explicitly.
Supabase connector remained unavailable; authenticated CLI **2.119.0** supplied the approved
path. Preview was verified ACTIVE_HEALTHY, Gridsmith Org Free, eu-west-1, PostgreSQL 17.11.

## Architecture and fallback

Static HTML/JS form → public Preview Edge `gs-lead-intake` → shared authoritative domain
validation → private `gs_intake_admit` transaction → existing lead + durable private outbox
→ authenticated `gs-notification-worker` → existing Resend allowance.

The existing normal Next adapters remain Server Actions using `submitLead` and the existing
`after()`/notifier. `submit.ts` and `notify.ts` are unchanged. The static build substitutes
only the adapters in its disposable copied source; the real UI and shared domain are retained.
No hostname heuristic selects the adapter. Static proof requires the exact Preview intake URL;
the deployed intake additionally refuses identities lacking the H4-B synthetic marker/domain.
Neither a Production endpoint nor live customer intake is enabled by this phase.

Hostinger serves only files: **zero persistent application Node processes**, zero new paid
services. No Hostinger upload, configuration, DNS, WordPress, main or push action occurred.

## Preserved form contract

Contact required: `full_name`, `email`; division defaults to `unsure`. Optional named fields:
`service_slug`, `company`, `role`, `phone`, `message`, `budget_band`, `timeline`, `source`,
`medium`, `campaign`, `referrer`, `landing_page`, `is_ai_referral`; `website` is the honeypot.
Names are trimmed, 1–200 characters; email remains the existing Zod email rule, maximum320.
Existing optional limits remain: service/company/campaign200, role/source/medium120, phone40,
message5000, budget/timeline80, referrer/landing500. Email case is preserved; no new lowercasing.
Blank optional named values become undefined and are omitted by JSON serialization.

Press uses the same identity/contact fields and `segment`, then the existing discriminated
branch contract in `pressLead.ts`:

- author: manuscriptStage, genre, wordCount, previouslyPublished, timeline; optional
  triedElsewhere and manuscriptLink.
- business: bookPurpose, whoWrites, companyName, approvalNeeded, timeline.
- memoir: manuscriptStage, intendedReadership, expectationsAcknowledged=true, timeline;
  optional manuscriptLink. UI option remains withheld while the approved statement is absent.
- content: formats, volumePerMonth, turnaroundNeeded, procurementProcess.
- production: workType, currentMaterial; optional manuscriptLink.

All existing enums, branch requirements, lengths and JSON payload ceiling **16,384 bytes**
are reused. Press optional blanks remain valid and omitted in stored JSON. Unknown field
names are discarded by named extraction; arbitrary browser JSON is never persisted.
String arrays support the existing repeated/multiselect values; envelope formType must be a
string. Transport rejects non-string field values and oversized/malformed envelopes.

Honeypot runs first in both domains: nonempty `website` receives legacy success-like behavior,
with **zero lead/outbox/worker/mail work**. `http://`, `https://`, `www.` in a name remain a
server-side visible rejection. Valid Contact confirms receipt; valid Press navigates to the
fixed `/press/contact/thank-you` acknowledgement. Invalid results identify fields; network,
capacity and database failure preserve answers and never show confirmed receipt.

## Public Edge contract and security review

`POST {formType:"contact"|"press",requestId:UUID,fields:{named:string|string[]}}`.
Only POST plus bounded CORS OPTIONS; JSON media type; streamed UTF-8 body maximum
**65,536 bytes**, including escaping overhead for accepted schema values. No arbitrary
error text, SQL, provider body, secret or request payload is reflected.

Exact configured origins: `http://localhost:3236`, `http://127.0.0.1:3236`. No wildcard.
Production/protected hosted origins require later explicit configuration and verification.
CORS/Origin is browser policy **not authentication**: hostile clients can forge an Origin.
Intake intentionally has `verify_jwt=false`, because enquiries do not require user accounts.
Closed database privileges, schema checks, honeypot and atomic workload ceilings carry security.

Responses:202 `{status:"ok",id}` only after committed lead/outbox, or trapped spam;
422 `{status:"invalid",errors}`;409 conflict;503 temporary/database failure;429 isolate burst;
400 malformed;403 origin;405 method;413 body;415 media type. Errors use no-store and
nosniff; permitted origin alone is echoed with Vary: Origin. No cookie/session requirement.

Application console output remains absent; authenticated queue health and provider invocation
status supply operational evidence. No message, manuscript,
email body, secret header, IP/fingerprint or complete form body is logged by this implementation.
Managed provider request metadata is outside the application logging claim.
Browser bundles have no service-role, database, worker or Resend credential. The build strips
private env names; artifact scan checks markers, supplied values and service-role JWT claims.
No extra personal data or identity/rate-limit tables were added. Outbox contains operational
UUIDs, state/time/counters and a digest of normalized submission content, not visitor identity.

## Migration, privileges and atomic admission

Immutable applied migration: `20261004184828_gs_host_h4b_private_intake.sql`, runner SHA
`b807e3ed6d4f`. Preview custom ledger changed from4 to5, applied in one transaction after
checking the four prior migration hashes, empty leads and absence of the new schema.

New private schema tables: `intake_state` singleton and `notification_outbox`. Both RLS
enabled; public schema's existing5 tables retain closed privileges/RLS. New public RPCs:
`gs_intake_admit(uuid,text,jsonb)`, `gs_notification_claim(integer)`,
`gs_notification_finish(uuid,uuid,text)`, `gs_notification_health()`.
All postgres-owned, **SECURITY INVOKER**, `search_path=pg_catalog`. PUBLIC/anon/authenticated
EXECUTE revoked; only service_role granted. No anonymous or authenticated lead/outbox writes,
table reads or private schema use. Existing service-role lead privileges are reused.

Admission locks singleton before duplicate/capacity checks, inserts lead and outbox, updates
counters and commits atomically. Same request UUID + same normalized payload returns the
existing lead; changed normalized payload conflicts. Replay records live with the outbox;
deleting an enquiry removes that replay record, so a cleaned test receipt must never resume.

Defaults: **5 admissions/900 seconds**, **40/day UTC**, **50 outstanding** pending/processing/
retry. Queue full returns503 with no misleading success. Isolate token bucket20, refill2/sec
is only best-effort burst relief, never a global/per-person guarantee. No IP, hashed IP,
forwarded-header identity or fingerprint is stored. An attacker may exhaust the shared allowance;
monitor/recover rather than claim strong human identification or guaranteed spam prevention.

## Outbox, worker and reconciliation

States pending → processing → sent/retry/dead. Claims use SKIP LOCKED, batch≤5,
120-second lease and UUID lease token. Stale/wrong lease completion is refused. Persisted
finish result, not an estimated counter, drives worker reporting. Sent atomically records
`notified_at`. Five attempts or23h from first attempt is terminal; permanent provider failure
is dead immediately. Temporary/ambiguous failures retain the lead and durable retry. Backoff
60/300/900/3600/7200 seconds; the fifth failure becomes dead. Dead jobs need operator review;
normal recovery never edits rows manually. No notification-loss-free scheduler claim is made.

Private Edge worker requires gateway JWT verification plus service_role/Preview claims and
actual caller permission at the service-only PostgREST health RPC. Missing/anon/forged tokens
were denied. Automatic Edge service credential differed from project-issued CLI service JWT:
the original wake got gateway401. Preview-only `GRIDSMITH_WORKER_TOKEN` stores the **existing**
project-issued JWT; no new grants/access identity. Value stays server-side; digest verified.
Its authenticated wake succeeded after deployment; worker gateway verification was retained.

Mail settings: `RESEND_API_KEY`, `LEAD_NOTIFICATION_FROM`, `LEAD_NOTIFICATION_EMAIL`;
allowed origins: `GRIDSMITH_ALLOWED_ORIGINS`; wake: `GRIDSMITH_WORKER_TOKEN`. Supabase automatic
reserved project credentials stay inside Edge. Existing key/from read privately; recipient fixed
to owner-approved `contact@gridsmith.uk`; custom configured values verified by digest only.
Temporary secret files had restricted ACLs and were removed; no credentials enter source/logs.

Minimal notification includes division/type/name/email, optional service/company/phone and lead
UUID, excluding message/manuscript details. Preview subject/body explicitly say synthetic/H4-B.
Resend stable idempotency key `gridsmith-notification/<outboxUUID>`, request timeout8s. Documented
Resend keys last24h; worker23h retry horizon is deliberately shorter. Duplicate delivery is
bounded by lease/idempotency semantics, not claimed impossible across every provider failure.

Immediate post-commit `EdgeRuntime.waitUntil` is an optimisation; outbox is authoritative.
Preview Vault exists; pg_cron/pg_net available but uninstalled. Brief §§28/59 allow explicit wake
with durable fallback: choose authenticated manual reconciliation without installing scheduling
extensions or creating a paid dependency. No unattended periodic draining is configured.

Operator commands (authenticated pinned CLI; exact Preview guards; aggregates only):
`npm run edge:preview:health`; `npm run edge:preview:drain`. Health checks intake OPTIONS,
pending/processing/retry/dead/sent counts, oldest outstanding age, mail configuration. Repeat drain
is safe; missing configuration fails before claim. An expired processing lease becomes eligible
on the next drain. Review dead/retry counts and intake responsiveness under the later GS-O025
operations plan; no fake business writes as keepalive. Current script is Preview-only.

## Local, adverse and browser proofs

- `verify:static`: all registered source gates, including permanent Edge/selftest subjects.
- Edge selftest:59 domain/HTTP/mail cases, normal-adapter parity, every supported Press branch,
  blank optionals, browser retry/concurrency/redirect and malformed-response assertions.
- Disposable PostgreSQL17:40 actual assertions (RLS/grants, transaction rollback from injected
  outbox failure, full queue/rate failure, replay/conflict, stale leases, sent/retry/dead,
  concurrent admissions2 accepted/8 capacity, valid escaped input >32KiB, exact cleanup).
- Deployed Preview:17 method/origin/body/schema/spam/private-worker/public-privilege probes;
  durable counts unchanged, no mail work. Anonymous UPDATE/DELETE probes are deliberately absent
  because lack of SELECT makes filtered PostgREST probes inert; SELECT/INSERT/RPC denial is proved.
- Static UI1440×900 and390×844: real Contact/author controls, keyboard traversal, first invalid
  field focus, retained answers, network and503 summaries, Back/Next focus after errors, polite
  pending announcement, one POST on double-submit, confirmation and Press redirect.10 focused
  axe analyses, zero violations; only existing fixed consent-heading contrast incompletes,
  retained by exact node/reason and checked against the opaque computed colour pair.
- H4-A regression:55 eligible routes, gated Technical/legal exclusions, no API/test exports,
  noindex and secret/action scan;14 representative hydrated pages/scenes/navigation/404,
 13 focused axe analyses and13 no-JS primary-content routes. This is not full-site WCAG RC.
- Clean normal development build:73/73 pages and69 routes within JS budgets; source actions
  retained. Served GET smoke13 paths plus security-header3-route and redirect gates pass.
  No normal/Production form was submitted. No remote CI/push or Hostinger Lighthouse claim.

## Preview E2E and exact cleanup receipt

Static Contact and author Press were submitted through the deployed public Edge. UUIDs saved
before dispatch; browser DevTools body retrieval initially failed after202. Exact request lookup
proved committed state; retry used the same saved UUID, creating no duplicate. Press blank
manuscriptLink/triedElsewhere were accepted and omitted in persisted payload. Both normal
confirmation paths rendered. A wake401 left durable pending work, then authenticated reconciliation
and the corrected immediate wake recovered it. All jobs completed once, attempts1.

- Contact request `f9561d81-5b8a-4a28-9c05-a216e29537e0`; lead
  `803f8e90-2963-46c0-8914-b9b170cf61c3`; outbox `32c6500a-b83c-4bca-a7d6-e7bcff9befcc`.
- Press request `febf363a-3850-415b-9ec8-d367ecb92f52`; lead
  `199297a3-148e-4901-8e81-5211d1520e58`; outbox `3e8e249c-ea7c-4ddd-8db1-39e26466a92d`.
- Deliberate missed-wake direct private RPC request `852e829b-36ea-4327-9d3b-c26b1c5ee4f4`;
  lead `22a08cde-9767-4cfe-91de-1d21df3e5669`; outbox `e7112dd3-9fec-4fb5-8423-8a6429ce1832`.
  Pending/attempts0/notified=false → authenticated drain claimed1/sent1 → replay claimed0.

Resend matching records: Contact `01a1087a-07f1-7a14-9752-8106252b7e09`, Press
`01a10881-e3a2-7565-8469-f3da39baa709`, recovery `01a10911-e14b-7be8-aa22-395de6306648`.
All **last_event=delivered**, approved recipient and synthetic subject/body verified; exact lead
UUID matched privately. No raw provider response or email content is persisted. Provider delivery
is not a claim that the owner personally read the inbox. Replay drained zero jobs; no second
matching notification was needed or generated by the completed replay.

Cleanup checked exact request/lead IDs, synthetic predicates, sent state and notified timestamp,
then deleted only those3 leads with FK cascade. Exact recorded IDs absent; Preview leads0/outbox0,
pending/retry/dead0. Aggregate admission counters intentionally remain; no broad counter reset.
Live receipt marked closed; `--resume` refuses it because replay records were removed.

## Performance and limitations

Final export201 files, **10,813,188 bytes**;41 JS files **935,855 raw /302,217 individually
gzipped bytes**. H4-A911,366/293,388: delta **+24,489 raw /+8,829 gzip** across the entire export,
not per-visit transfer. Unique non-legacy script gzip Contact112,913B, Press contact113,874B.
Contact was H4-A's technical shell105,757B: +7,156B restores functional forms; normal H4-A
Contact111,168B is a historical comparison, not today's matched build measurement.

Preview pg_stat_statements aggregate for the5 PostgREST admission calls: mean9.07ms/max28.03ms;
the direct missed-wake admission executed in85.10ms. Separate statement preparation/other queries
are not included in these numbers. CLI admission wall18,892ms includes CLI startup/auth/network,
not database execution alone. Authenticated worker drain wall4,529ms includes operator credential
retrieval/provider work; email delivery timing is separate and no page/Lighthouse implication.
Final deployed negative browser-policy/HTTP probes ranged126–1165ms (11 samples; request/body wall
timing, not accepted-form latency). Accepted browser latency was not separately recorded.
Secret-free timing sources: `build/h4b-e2e-receipt.json` databaseTiming and
`build/h4b-preview-negative-receipt.json` responseMs; final artifact figures and content manifest
digest: `build/h4b-performance-receipt.json`. Hostinger/CDN,
real-GPU, Linux Lighthouse and complete static performance budgets remain H4-E/G work.

No-JS form submission **unsupported**, honestly disclosed with email alternative. No native
cross-origin POST, correction or confirmation flow is claimed. Submit is hydration guarded;
Press cannot traverse its JS steps without JS. Under brief §73 this alone does not fail H4-B;
the H4-E/H4-G owner acceptance decision must retain this precise limitation.

## Future Production plan — NOT applied

Separate explicit authority is required before any Production change:

1. Verify Production metadata, current migration ledger/hash and closed grants/RLS, existing
   lead constraints/service privileges, no conflicting schema/function, operator/readiness gates;
   take and restore-prove the authorised backup. Do not assume Preview counts are Production counts.
2. Apply only immutable migration `20261004184828_gs_host_h4b_private_intake.sql` in a transaction
   through the established runner; verify ledger hash,2 private tables/RLS,4 invoker RPCs,
   PUBLIC/anon/authenticated denial and unchanged pre-existing lead data.
3. Prepare separately reviewed Production-capable adapters: today's project guards, synthetic
   identity restriction, fixed recipient and synthetic marking intentionally prohibit reuse as-is.
   Deploy intake public/worker JWT-private to the authorised project only. Configure approved
   sender/recipient, Resend key, exact hosted origins and valid existing worker JWT server-side.
   Review account quotas and GS-O025 reconciliation/monitoring/recovery before enabling live intake.
4. Compile explicit approved public endpoint into the no-secret artifact; prove served browser
   CORS/CSP, transaction, outbox/worker, bounded failures and separately approved mail smoke.
   Production syntax/migrations/functions/secrets/form/mail were **not** exercised here.

Reversal: unset static profile and run normal Next build/start with its established environment;
source Server Actions/notifier remain available. Stop selecting the Edge adapter. For Preview
disable/delete only named H4-B functions under later cleanup authority and remove named custom
secrets only if no other consumer. Private schema is additive: retain pending work for recovery;
never drop it while unresolved jobs exist. A separately authorised empty-schema rollback may
drop the4 RPCs,2 tables/schema and remove the exact custom ledger row after verified backup;
never delete real leads or alter prior migration history. This rollback was documented, not run.
Reverting the focused local source commit restores H4-A technical shells; normal fallback remains.

## Remaining phases and final receipt

H4-C reviews/build-time data/fallback; H4-D build/deploy transaction and freshness;
H4-E full local/static/accessibility/security/SEO/budgets including no-JS decision;
H4-F separately authorised isolated Hostinger HTTP/CDN/recovery proof; H4-G exact hosted RC;
H4-H separately authorised cutover/WordPress backup/rollback. GS-O003, GS-O025, GS-O026 and
Technical-only GS-X002 remain explicit. No owner action newly required by completed H4-B.

H4-C may begin only in its own authorised phase after the final H4-B local receipt. STOP.

## Primary sources checked

Official Supabase changelog and Resend list/retrieve/idempotency documentation were retrieved
over HTTPS on4 October2026 (web tool returned no usable content). No relevant breaking change
was found for the pinned CLI deployment/request path; actual Preview proof remains authority.
Resend24h policy: `https://resend.com/docs/dashboard/emails/idempotency-keys`;
delivery metadata: `https://resend.com/docs/api-reference/emails/list-emails` and its retrieve API.
Supabase: `https://supabase.com/changelog.md`. No claim of current blanket Free-tier reliability.

## Final acceptance receipt

- Final `verify:static` exit0; pinned Node24.21.0,57 registered gates agree with CI.
  Final static selftest130 independent adverse proofs; Edge59 cases and client adapter assertions.
- Final local PostgreSQL proof40 assertions/clean exact subjects; immutable migration SHA remains
  `b807e3ed6d4f240bde9ae80873de588cb9855aed025081b037d7a8043b42f0b3`.
- Final static build55 routes/201 files/10,813,188B; final artifact contract exit0. All actual
  Preview service/worker token and Resend values plus a private-build sentinel absent from export.
  Content manifest SHA256 `990efcd3fd0a33c306433cc877f2def0ea8271ab3cd43c7f2e3750c11b70d60b`.
- Final mocked form UI10 axe analyses, zero violations; consent-heading incompletes exact scoped
  adjudication/computed opaque ratio17.72:1. Browser regression14 paths/13 axe/13 no-JS pages pass.
- Final clean normal build73 pages/69 route budgets; served13 GET paths, headers and redirects pass.
  Existing fallback/domain sources unchanged: submit.ts, notify.ts, schema.ts, pressLead.ts, guard.ts.
- Preview intake ACTIVE v7 verify_jwt=false; worker ACTIVE v5 verify_jwt=true. Final17 negative
  probes pass with durable counts unchanged0. Database security advisor: no issues. Resend matching
  synthetic notification count is exactly1 each for Contact/Press/recovery, all delivered.
- Live proof receipt closed; deliberate `--live --resume` refuses before browser/transport work.
  Source/Preview security, accessibility, all30 brief criteria and content/rules/style reviews
  completed independently; identified focus, receipt and secret-scan gaps corrected and rechecked.
- No staging/push/main/Production/Hostinger boundary is inferred from these local results. One
  focused local commit follows the scoped index/secret/whitespace review; git supplies its SHA.
  Three original prototype harnesses remain intentionally untracked and excluded. Owner actions
  unchanged because no new owner action is needed. Later H4 phases remain unexecuted.
