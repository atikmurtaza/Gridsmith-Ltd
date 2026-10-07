# GS-LEGAL-001-R5 — Privacy evidence resolution and owner IP status

**Date:** 7 October 2026. **Branch:** `claude/sweet-mendel-11qvli`, from R4 HEAD
`3c912cd294e56fd9816471b65999417a65c33707`.

**Result: PRIVACY EVIDENCE REDUCED — OWNER CHECKS REMAIN.**
- Privacy Policy 2.1 is unchanged: `OWNER_REVIEW_REQUIRED`, three `[OWNER DECISION]` markers, and no
  adoption fields.
- Privacy 2.2 is **not applied**.
- No adopted document was edited, so every `ownerAdoptedSha256` still matches.
- Nothing was published, deployed or written to Production.
- The retention routine is not operating, and no lead or `pg_dump` was deleted.

This record adds to R1–R4 and rewrites none of them. It is an evidence record, not legal advice, and
contains no claim of solicitor review.

## 1. Sources used, and what each is worth

| Source | Access | Used for | Weight |
|---|---|---|---|
| **Supabase's own public repository** (`github.com/supabase/supabase`, HEAD `454a2329`, 7 Oct 2026). Files: `apps/www/data/legal/customer-resources/data-processing-addendum/v1.mdx`, `apps/www/data/legal/terms/v4.mdx`, `apps/studio/.../Organization/Documents/DPA.tsx`, `apps/www/public/legal/subprocessor-list/June-1-2026.pdf`, `packages/shared-data/pricing.ts`, `apps/docs/content/guides/platform/backups.mdx`, `.../observability/log-field-reference.mdx`, `.../observability/logs.mdx` | Read in full (treeless clone; blobs fetched on demand) | Checks 5, 6, 12 | **Primary provider text**: the source the provider publishes its legal pages, dashboard and docs from |
| **Supabase connector** (read-only: `list_projects`, `get_organization`, `get_project`, `list_edge_functions`, `query_logs` returning counts and field *names* only, never values) | Live account | Checks 5, 6, 12 | **Account evidence** |
| **Supabase docs search** (`search_docs`) | Provider's own docs index | Check 12 | Primary provider text |
| **Vercel connector** (`filter_project_envs`, `decrypt=false`; key names only) | Live account | Check 11 | Account evidence |
| **This repository** (code, workflows, GS-HOST and GS-O010 records) | Read | Checks 3, 8, 11 | Implementation evidence; H4-D's hPanel reading is owner-account evidence |
| **Web search restricted to official domains** (resend.com, hostinger.com, dataprivacyframework.gov, gov.uk, legislation.gov.uk) | Result summaries only | Checks 1, 2, 4, 7, 9, 10; statute | **Search summary of an official page — not primary, not account evidence** |

**Blocked in this environment** (egress 403 for curl and the fetch tool, re-tested in R5):
hostinger.com, docs.hostinger.com, support.hostinger.com, supabase.com, resend.com,
dataprivacyframework.gov, legislation.gov.uk, gov.uk, ico.org.uk and public DNS resolvers. Neither
Resend nor Hostinger publishes its legal text in a public repository this session can reach. No
third-party mirror or proxy was used to get round the network policy.

## 2. Evidence resolution, checks 1–12

| Check | Provider | Classification | Evidence | Remaining action |
|---|---|---|---|---|
| **P-01** contracting entity | Hostinger | **OWNER_CHECK_REQUIRED** | Search summary of hostinger.com/legal/dpa: the DPA is made with **Hostinger International Ltd (Cyprus), Hostinger UK Limited or Hostinger Global S.à r.l. (Luxembourg)**, depending on the account; the data importer for transfers is Hostinger International Ltd. No invoice or account record is in the repository | Owner: the issuer name on one invoice |
| **P-02** DPA and UK transfer mechanism | Hostinger | **PARTIALLY_VERIFIED** (provider, search summary) | Search summaries of hostinger.com/legal/dpa and the Terms: the DPA is **annexed to and incorporated into the Terms of Service** for "Covered Services", including hosting and email. The data importer is Hostinger International Ltd. For UK transfers the **UK International Data Transfer Addendum (B1.0) is deemed entered into and incorporated by reference**. Sub-processors: AWS EMEA SARL, Google Cloud EMEA Ltd, Cloudflare Inc., MailChannels Corp., Proofpoint Inc., Anthropic Ireland Ltd, spectra tech UAB, Vonage B.V. | No owner support request: the contract documents answer it. A **primary re-read** of hostinger.com/legal/dpa from an unblocked environment remains before the safeguard is printed |
| **P-03** location and products | Hostinger | **PARTIALLY_VERIFIED** | **CDN: VERIFIED_ACCOUNT** for the staging add-on domain (hPanel CDN panel "Active", `docs/_shared/GS-HOST-H4-D.md` §§110, 168–170). For gridsmith.uk the CDN is **OPERATIONAL_NOT_YET_TRUE** (cutover). Server location and mailbox product: no repository record, and DNS lookups are blocked | Owner: site server location and mailbox product (one hPanel visit) |
| **P-04** retention | Hostinger | **PARTIALLY_VERIFIED** (provider, search summary) | **Email:** deleted mail stays in Trash up to 30 days and is then permanently deleted; Hostinger Email access logs are available for 30 days; mailboxes are not included in website backups. **Website backups (Business plan):** daily kept 7 days, weekly kept 6 weeks. The static site's files hold no personal data. **Website and CDN access logs: no retention period published.** The hPanel 7-day filter is a viewing window, not a retention period. All of this is product-specific and depends on P-03 | Owner (optional): ask Hostinger support for the access-log retention period. Without an answer, Privacy describes it by criteria ("for a period Hostinger sets") rather than inventing a figure |
| **P-05** DPA and transfers | Supabase | **VERIFIED_PROVIDER + VERIFIED_IMPLEMENTATION + VERIFIED_ACCOUNT** | See §3.1 | None |
| **P-06** backups | Supabase | **VERIFIED_PROVIDER** (plan); internal copies PARTIALLY_VERIFIED | `pricing.ts`: **Automatic backups — Free: false; Point-in-time recovery — Free: false.** `backups.mdx`: daily backups only for Pro/Team/Enterprise. Troubleshooting note (dated 2024): "We are currently taking up to 7 daily backups [for free projects] that will be available for you once you upgrade … we might no longer make daily backups for free projects". Account: organisation on `free` (re-verified) | None. Privacy states the conservative position: Supabase may keep backup copies for up to 7 days |
| **P-07** DPA, entity, transfer | Resend | **PARTIALLY_VERIFIED** (provider, search summary) | Search summaries of resend.com/legal/dpa, the pre-signed DPA PDF "Updated on 12/31/2025", and resend.com/security/gdpr: the DPA is between **Plus Five Five, Inc.** and the customer; it is **pre-signed by Resend and fully executed on sign-up, for every account**; Resend is processor; **primary processing in the United States**. "UK SCCs" means the **EU SCCs as amended by the UK Addendum**, deemed entered into and incorporated for ex-UK transfers. Sub-processors include AWS, Cloudflare, Google, Supabase Inc., Vercel Inc., Snowflake, Tinybird and others (resend.com/legal/subprocessors) | No owner action; a primary re-read of the DPA from an unblocked environment remains |
| **P-08** sending domain and region | Resend | **VERIFIED_IMPLEMENTATION**; production domain **OPERATIONAL_NOT_YET_TRUE** | `lib/leads/notify.ts:14–33` and `PROJECT-TRACKER.md` Q-M20: the development sender is `onboarding@resend.dev`; `gridsmith.uk` is **deliberately unverified in Resend until deployment**, with the SPF merge a cutover step. Provider (search summary of resend.com/docs/dashboard/domains/regions): the region chosen for a domain controls where mail is **sent from**, not where it is **stored**; stored data is in the US | None now. **At cutover:** record the region chosen when `gridsmith.uk` is added. Privacy's US statement does not depend on it |
| **P-09** plan and log retention | Resend | **PARTIALLY_VERIFIED** (provider, search summary) | Search summaries of resend.com/pricing, /security and the knowledge base: **30 days on Free, Pro and Scale**, covering email content and metadata, delivery events, logs and metrics; flexible on Enterprise; stored in the US. Caveat: Supabase's advertised "1 day" proved to be an access window, not a deletion period (§3.3), so a provider figure is not assumed to be a deletion period without an observation | Owner: plan name, and the date of the oldest email still listed (date only) |
| **P-10** Data Privacy Framework | Resend | **PARTIALLY_VERIFIED — EXTERNAL VERIFICATION REQUIRED** | Search summary of the official list entry `dataprivacyframework.gov/participant/8907`: **Plus Five Five, Inc.** (Resend), EU-U.S. DPF and **UK Extension: "Active – Re-certification under Review"**; original certification 20 Feb 2025; next due 3 Mar 2027; non-HR data. The register itself is unreachable here | **Non-blocking:** Privacy 2.2 names the **UK Addendum in Resend's DPA** (P-07), which does not depend on DPF status. Read the register directly only if the DPF is to be named |
| **P-11** Slack | — | **VERIFIED_IMPLEMENTATION** + **VERIFIED_ACCOUNT** (Vercel); remainder **NON-BLOCKING HOUSEKEEPING** | No `SLACK_*` key in any Vercel environment (live listing, R5). The only code reader is `lib/leads/notify.ts:54`, which runs only on a Next server. The static build strips it (`scripts/build-static.mjs:44`). Neither deployed Edge Function reads it. No workflow references `secrets.`. No `.env.local` in the repository | Housekeeping only: confirm no `SLACK_*` secret name in Supabase Preview Edge Function secrets, and in the owner's local `.env.local` if one exists. Also housekeeping: Vercel still holds inert `NEXT_PUBLIC_POSTHOG_*` and `NEXT_PUBLIC_GA4_ID` keys that no code reads |
| **P-12** Edge, API and database logs | Supabase | **VERIFIED_ACCOUNT** (content and observed retention); **VERIFIED_PROVIDER** (published figure); actual deletion period **OWNER_CHECK_REQUIRED** | See §3.3 | Owner: one Supabase support ticket asking for the actual storage period |

## 3. Findings that change the Privacy and retention position

### 3.1 Supabase — the processor contract and transfers (P-05)

- **Incorporated automatically.** The DPA "supplements and forms part of the Supabase Terms of Service
  … between the Customer and Supabase Pte. Ltd" and "is effective as of the Effective Date of the
  Agreement" (DPA v1). The Terms define the DPA by URL, and "Supabase" as **Supabase Pte. Ltd., a
  Singapore corporate entity**, 65 Chulia Street, Singapore (Terms v4).
- **The Studio Documents panel** says: *"Our Data Processing Addendum is incorporated into our Terms of
  Service, so all organizations get its protections automatically. No separate signed DPA is needed.
  If you signed a DPA with us previously, that agreement remains binding."* (`DPA.tsx`).
- **Whether a separate DPA was ever signed is immaterial:** a DPA applies either way. The organisation
  is on the self-serve `free` plan, with no Enterprise order recorded.
- **UK transfers:** Schedule 2 §2 incorporates the **Approved Addendum, version B.1.0, issued under
  s.119A(1) DPA 2018**, for any transfer to which UK data protection laws apply. "Execution of this DPA
  shall have the same effect as signing the Approved Addendum". The importer is Supabase Pte. Ltd.
  Modules 2 and 3 apply; Irish law and courts govern the SCCs.
- **Location:** where the customer directs a region, data is "stored and primarily Processed in that
  region" (DPA §6.1). Both projects are in `eu-west-1` (account).
- **Sub-processors** (list dated 1 June 2026) include **Supabase, Inc.** (support), Amazon Web
  Services, Cloudflare, Google, Fly.io, Vercel, Sentry, OpenAI and others. The list gives names and
  purposes, not processing locations. So "US sub-processors" is supported as **US-incorporated
  sub-processors**; that processing takes place in the US is not stated.

### 3.2 Supabase — backups (P-06)

The Free plan has **no customer-accessible automatic backups and no PITR**. Supabase's own note says it
may currently keep up to 7 daily backups of free projects at its discretion. A deleted lead may
therefore survive in a provider-held copy for up to about 7 days. That is a statement Privacy can make
without an account check.

### 3.3 Supabase — logs keep visitors' IP addresses, for far longer than "1 day" (P-12)

**This finding corrects R3 and R4.**

- **Published figure:** `pricing.ts` lists **"Log retention (API & Database)" — Free: 1 day**. The logs
  guide says retention "is based on your project's pricing plan" and does not give a separate figure
  for Edge Function logs.
- **Observed, read-only, counts only:**
  - Production `dqiutgmxillhsbzgnlsx` still holds logs from **18 August 2026**, its first minutes
    (earliest 20:42 UTC; created 20:41). That covers `edge_logs`, `postgres_logs`, `postgrest_logs`,
    `auth_logs`, `storage_logs` and `realtime_logs`, and also 19 August, 10 and 25 September and
    2 October.
  - Preview `qfgpwumvvtizeamkynes` still holds logs from **2 October** (its creation day) and
    **4 October**, including 101 `function_edge_logs` and 190 `function_logs` rows.
  - On 7 October, that is **at least 49 days** of logs still held on a Free project.
- **Content (field names only):** every sampled `edge_logs` and `function_edge_logs` row carries
  `request.headers.cf_connecting_ip`, `request.headers.x_real_ip`, `request.headers.cf_ipcountry` and
  `request.headers.user_agent`. The provider's field reference lists the same headers as captured.
- **Implementation:** with H4-B the visitor's browser posts the form directly to the Supabase Edge
  Function (`lib/leads/edge-client.ts:23`; `NEXT_PUBLIC_LEAD_INTAKE_URL` in
  `.github/workflows/hostinger-staging.yml`). So once H4-B is live, **the enquirer's own IP address and
  browser details reach Supabase's logs.**
- **Consequences:**
  1. The "1 day" figure is the plan's access window, not a deletion period. It must **not** appear in
     Privacy 2.2 or in R14 as a retention period. R3 and R4 recorded it as one.
  2. "Our enquiry database does not store your IP address" stays literally true of the `leads` table,
     but Privacy 2.2 must say plainly that Supabase's own logs record it.
  3. **Deleting a lead does not delete these logs.** The retention cleanup (Part C) and the monthly
     routine cannot reach them on the Free plan. This is recorded in `RETENTION-ACTIVATION-CHECKLIST.md`.
  4. Which IP addresses the August `edge_logs` record was not examined (values were not read). The
     August pipeline wrote from a server (`PROJECT-TRACKER.md` A-08), so they may be server addresses
     rather than visitors'. Nothing here asserts either.

### 3.4 Resend — US processing is the provider's own statement (P-07, P-08, P-09)

Resend's DPA and security pages (search summaries) state that primary processing and storage are in the
**United States**, whatever sending region is chosen. Privacy §7 ¶2 can therefore name the US. The
safeguard is the **UK Addendum in Resend's DPA**, which is pre-signed and in force for every account.

## 4. Statutory retention periods (one more attempt)

| Proposition | R5 evidence | Status |
|---|---|---|
| HMRC: company records kept **6 years from the end of the last financial year they relate to**, longer for multi-period transactions, long-lived assets, late returns or an open compliance check | Search summary of GOV.UK "Running a limited company: company and accounting records" and HMRC CH14600 | **UNVERIFIED at source**; consistent with R3 |
| Companies Act 2006 **s.388(4)(a)**: a private company preserves accounting records for **3 years** from the date made | Search summary of legislation.gov.uk s.388 and GOV.UK | **UNVERIFIED at source**; consistent with R3 |
| Limitation Act 1980 **s.5**: simple contract, **6 years** from accrual | Search summary of legislation.gov.uk s.5 | **UNVERIFIED at source** |
| Copyright title documents: kept while the rights are relied on, plus 6 years (R7) | Reasoning in `RETENTION-SCHEDULE.md` R7, resting on s.5 and on each infringement being a fresh cause of action | Owner policy, not a statutory period |

Primary hosts remain blocked, so the **UNVERIFIED** markers stay. The summaries all come from the
official sites and match R3. Nothing suggests a period is wrong.

## 5. Owner IP decision (R5)

The owner decided that, for the Gridsmith rights chain, **employee copyright ownership is not relied
on** for work created by Atik Murtaza, even though payroll or employment-related records may exist.
- **Template 01** assigns Atik Murtaza's relevant existing and future Gridsmith-related IP, including
  pre-incorporation work and any work whose employee ownership cannot safely be established, with the
  moral-rights waiver.
- **No statement is made** that he is or is not legally an employee.
- **Template 02** may later govern employee-created work prospectively, but only if a written contract
  of service with suitable IP provisions is actually verified. It must not contradict template 01.
- **Nothing is signed.** Template 01 has been updated to carry this position (clause 1.3, option C, and
  the template 02 interaction note). The operational record is in `../../operations/RIGHTS-CHAIN.md`
  §4 and `../../operations/rights-chain/README.md`.

## 6. Development Sanity (A-1)

**DEFERRED TO A TRUSTED ENVIRONMENT WITH EXISTING DEVELOPMENT CREDENTIALS.** No new token is requested
and A-1 is not run here. The draft-mode parity proof remains valid repository verification. It does
not substitute for eventual parity against the development dataset.

## 7. Records changed

| File | Change |
|---|---|
| `../../operations/PRIVACY-EVIDENCE-CHECKLIST.md` | R5 status per check; manual owner checks reduced to four |
| `R5-PRIVACY-2.2-READINESS.md` (new) | Clause-by-clause plan: current wording, proposed wording, evidence, status, dependency. It supersedes the status column of `R4-PRIVACY-2.2-CHANGE-PLAN.md`, which stays as history |
| `../../operations/RETENTION-SCHEDULE.md` | R12–R14 corrected to the R5 evidence (R14 "1 day" removed as a retention period). Periods unchanged |
| `../../operations/RETENTION-ACTIVATION-CHECKLIST.md` | Part F: R12–R14 status; logs survive lead deletion |
| `../../operations/RIGHTS-CHAIN.md`, `rights-chain/README.md`, `01-…`, `02-…` | Owner IP decision; execution order |
| Status files | CLAUDE.md, CLOUD-CONTINUATION, OWNER-ACTIONS, PROJECT-STATUS, GS-LEGAL-001-RECORD §14, register state record |

## 7a. Adopted-text check

Before any record was written, the five adopted drafts and `/legal/client-terms` were scanned for
statements about Supabase, Resend, Hostinger, sub-processors, logs, IP addresses, retention, the United
States or Ireland. None makes a provider, log or location claim that the R5 evidence contradicts. The
only related statement is the Cookie Policy's "our web server does not set any cookies", which is
already gated by `A-2-PRODUCTION-COOKIE-RETEST`. **No adopted document needs to change, so the STOP
condition did not arise.**

## 8. Independent review

See §8a, written after the review.
