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
| **P-05** DPA and transfers | Supabase | **VERIFIED_PROVIDER + VERIFIED_ACCOUNT** (the Studio panel text is Supabase's own code: provider evidence) | See §3.1 | None |
| **P-06** backups | Supabase | **VERIFIED_PROVIDER** (no customer backups or PITR on Free); provider-held copies **PARTIALLY_VERIFIED** | `pricing.ts`: **Automatic backups — Free: false; Point-in-time recovery — Free: false.** `backups.mdx`: daily backups only for Pro/Team/Enterprise. Troubleshooting note (dated 2024): "We are currently taking up to 7 daily backups [for free projects] that will be available for you once you upgrade … we might no longer make daily backups for free projects". Account: organisation on `free` (re-verified) | No separate owner check; the backup question rides on the E-4 support ticket. Privacy states it by criteria: "may keep backup copies for a period it sets" |
| **P-07** DPA, entity, transfer | Resend | **PARTIALLY_VERIFIED** (provider, search summary) | Search summaries of resend.com/legal/dpa, the pre-signed DPA PDF "Updated on 12/31/2025", and resend.com/security/gdpr: the DPA is between **Plus Five Five, Inc.** and the customer; it is **pre-signed by Resend and fully executed on sign-up, for every account**; Resend is processor; **primary processing in the United States**. "UK SCCs" means the **EU SCCs as amended by the UK Addendum**, deemed entered into and incorporated for ex-UK transfers. Sub-processors include AWS, Cloudflare, Google, Supabase Inc., Vercel Inc., Snowflake, Tinybird and others (resend.com/legal/subprocessors) | No owner action; a primary re-read of the DPA from an unblocked environment remains |
| **P-08** sending domain and region | Resend | **VERIFIED_IMPLEMENTATION**; production domain **OPERATIONAL_NOT_YET_TRUE** | `lib/leads/notify.ts:14–33` and `PROJECT-TRACKER.md` Q-M20: the development sender is `onboarding@resend.dev`; `gridsmith.uk` is **deliberately unverified in Resend until deployment**, with the SPF merge a cutover step. Provider (search summary of resend.com/docs/dashboard/domains/regions): the region chosen for a domain controls where mail is **sent from**, not where it is **stored**; stored data is in the US | None now. **At cutover:** record the region chosen when `gridsmith.uk` is added. Privacy's US statement does not depend on it |
| **P-09** plan and log retention | Resend | **PARTIALLY_VERIFIED** (provider, search summary) | Search summaries of resend.com/pricing, /security and the knowledge base: **30 days on Free, Pro and Scale**, covering email content and metadata, delivery events, logs and metrics; flexible on Enterprise; stored in the US. Caveat: Supabase's published "1 day" did not match what was observed and is not a deletion period (§3.3), so a provider figure is not assumed to be a deletion period without an observation | Owner: plan name, and the date of the oldest email still listed (date only) |
| **P-10** Data Privacy Framework | Resend | **PARTIALLY_VERIFIED — EXTERNAL VERIFICATION REQUIRED** | Search summary of the official list entry `dataprivacyframework.gov/participant/8907`: **Plus Five Five, Inc.** (Resend), EU-U.S. DPF and **UK Extension: "Active – Re-certification under Review"**; original certification 20 Feb 2025; next due 3 Mar 2027; non-HR data. The register itself is unreachable here | **Non-blocking:** Privacy 2.2 names the **UK Addendum in Resend's DPA** (P-07), which does not depend on DPF status. Read the register directly only if the DPF is to be named |
| **P-11** Slack | — | **VERIFIED_IMPLEMENTATION** + **VERIFIED_ACCOUNT** (Vercel); remainder **NON-BLOCKING HOUSEKEEPING** | No `SLACK_*` key in any Vercel environment (live listing, R5). The only code reader is `lib/leads/notify.ts:54`, which runs only on a Next server. The static build strips it (`scripts/build-static.mjs:44`). Neither deployed Edge Function reads it. No workflow references `secrets.`. No `.env.local` in the repository | Housekeeping only: confirm no `SLACK_*` secret name in Supabase Preview Edge Function secrets, and in the owner's local `.env.local` if one exists. Also housekeeping: Vercel still holds inert `NEXT_PUBLIC_POSTHOG_*` and `NEXT_PUBLIC_GA4_ID` keys that no code reads |
| **P-12** Edge, API and database logs | Supabase | **VERIFIED_ACCOUNT** (content and observed retention); **VERIFIED_PROVIDER** (published figure); actual deletion period **OWNER_CHECK_REQUIRED** | See §3.3 | Owner: one Supabase support ticket asking for the actual storage period |

## 3. Findings that change the Privacy and retention position

### 3.1 Supabase — the processor contract and transfers (P-05)

- **Incorporated automatically.** The DPA "supplements and forms part of the Supabase Terms of Service
  … between the Customer and Supabase Pte. Ltd" and "is effective as of the Effective Date of the
  Agreement" (DPA v1). The Terms define the DPA by URL. The contracting entity is **Supabase Pte. Ltd., a
  Singapore corporate entity**, 65 Chulia Street, Singapore, unless the customer buys through a cloud
  marketplace, in which case it is Supabase, Inc. of Dover, Delaware (Terms v4 §1(j)). This
  organisation is self-serve, with no marketplace purchase recorded.
- **The Studio Documents panel** says: *"Our Data Processing Addendum is incorporated into our Terms of
  Service, so all organizations get its protections automatically. No separate signed DPA is needed.
  If you signed a DPA with us previously, that agreement remains binding."* (`DPA.tsx`).
- **Whether a separate DPA was ever signed is immaterial:** a DPA applies either way. The organisation
  is on the self-serve `free` plan, with no Enterprise order recorded.
- **UK transfers:** Schedule 2 §2 incorporates the **Approved Addendum, version B.1.0, issued under
  s.119A(1) DPA 2018**, for any transfer to which UK data protection laws apply. "Execution of this DPA
  shall have the same effect as signing the Approved Addendum". The importer is Supabase Pte. Ltd., and
  Modules 2 and 3 apply. (Schedule 2 §1.5–1.6 choose Irish law and courts for the **EU** SCCs. The law
  that governs the Approved Addendum for UK transfers was not read in R5 and is not relied on here.)
- **Location:** where the customer directs a region, data is "stored and primarily Processed in that
  region" (DPA §6.1). Both projects are in `eu-west-1` (account).
- **Sub-processors** (list dated 1 June 2026) include **Supabase, Inc.** (support), Amazon Web
  Services, Cloudflare, Google, Fly.io, Vercel, Sentry, OpenAI and others. The list gives names and
  purposes, not processing locations or incorporation. The US connection rests on **Supabase, Inc.**
  being the Delaware company named in Terms v4 §1(j), and on the US corporate names of the others (Inc.,
  LLC). So "US sub-processors" is supported as **US-incorporated
  sub-processors**; that processing takes place in the US is not stated.

### 3.2 Supabase — backups (P-06)

The Free plan has **no customer-accessible automatic backups and no PITR** (VERIFIED_PROVIDER). A 2024
troubleshooting note says Supabase is "currently" taking up to 7 daily backups of free projects and
"might no longer" do so. That is a dated, hedged statement, so provider-held copies are
**PARTIALLY_VERIFIED**. Privacy 2.2 therefore states it by criteria ("may keep backup copies of the
database for a period it sets"), and the E-4 support ticket also asks about backups.

### 3.3 Supabase — request logs carry client-IP fields and are held far longer than "1 day" (P-12)

**This finding corrects R3 and R4.**

- **Published figure:** `pricing.ts` lists **"Log retention (API & Database)" — Free: 1 day**. The logs
  guide says "Retention depends on your pricing plan" (`logs.mdx:65`) and gives no separate figure for
  Edge Function logs.
- **Observed, read-only, counts only:**
  - Production `dqiutgmxillhsbzgnlsx` still holds logs from **18 August 2026**, its first minutes
    (earliest 20:42 UTC; created 20:41). That covers `edge_logs`, `postgres_logs`, `postgrest_logs`,
    `auth_logs`, `storage_logs` and `realtime_logs`, and also 19 August, 10 and 25 September and
    2 October.
  - Preview `qfgpwumvvtizeamkynes` still holds logs from **2 October** (its creation day) and
    **4 October**, including 101 `function_edge_logs` and 190 `function_logs` rows.
  - On 7 October, that is **at least 49 days** of logs still held on a Free project.
- **Content (field names only; values not read):**
  - **Production, 19 August 2026:** all 79 `edge_logs` rows carry `request.headers.cf_connecting_ip`,
    `request.headers.x_real_ip`, `request.headers.cf_ipcountry` and `request.headers.user_agent`.
  - **Preview, 4 October 2026:** all 60 `edge_logs` rows carry `cf_connecting_ip` and `user_agent`, and
    all 101 `function_edge_logs` rows carry all four fields.
  - Rows **carrying client-IP header fields** are therefore held from at least 19 August, which is **49
    days** before 7 October.
  - Supabase's field reference lists these headers (and also `referer`) as captured in **API Gateway
    logs** (`edge_logs`). The `function_edge_logs` result is an account observation only.
- **Implementation:** with H4-B the visitor's browser posts the form directly to the Supabase Edge
  Function (`lib/leads/edge-client.ts:23`; `NEXT_PUBLIC_LEAD_INTAKE_URL` in
  `.github/workflows/hostinger-staging.yml`). So once H4-B is live, **the enquirer's own IP address and
  browser details reach Supabase's logs.**
- **Consequences:**
  1. The published "1 day" figure does not match what was observed and is **not a deletion period**.
     What it governs is unconfirmed; E-4 asks Supabase. It must **not** appear in Privacy 2.2 or in R14
     as a retention period. R3 and R4 recorded it as one.
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
| `R4-PRIVACY-2.2-CHANGE-PLAN.md`, `R3-OWNER-DECISIONS-APPLIED.md` | Supersession banner (R4 plan) and two one-line correction notes on the Supabase "1 day" figure (R3, after the §5.1 and §5.4 tables), as history annotations only |
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

One independent read-only reviewer checked this record and the files it lists against Supabase's saved
source files, the Privacy 2.1 text, the code and the owner decision.
- **Result:** 0 HIGH, 4 MEDIUM, 9 LOW (some LOW findings contain several points), all fixed in the
  follow-up commit.
- **MEDIUM:**
  1. "Visitors' IPs" overstated the evidence; now "client-IP header fields", with the sampled dates.
  2. "Access window" was not established; now "does not match what was observed; not a deletion
     period; unconfirmed (E-4)".
  3. The backup sentence relied on a dated, hedged note; now stated by criteria, with the question
     added to E-4.
  4. The §7 safeguard sentence covered EEA transfers that rest on adequacy; now limited to countries
     without UK adequacy regulations, with the Hostinger limb dependent on E-1.
- **LOW:** a misquote of the logs guide; header-capture scope; the governing-law note; the marketplace
  entity caveat; `DPA.tsx` reclassified as provider evidence; missing §10 dependencies; the rule and
  status-key wording reconciled; three rights-chain wording points; stale and incomplete references; the
  R3 and R4 "1 day" history annotated.
- **Confirmed correct by the reviewer:** every Supabase quote against the saved files; the sub-processor
  names; all ten "Current 2.1" quotations; the implementation claims; the proposed §8 periods against
  R1–R9 and R17; DPF non-reliance; H4-B as a publication prerequisite; the rights-chain handling of the
  owner decision; no claim of solicitor review, signature, adoption or publication.
- **Narrow re-check:** see §8a.

### 8a. Narrow re-check

A second read-only pass over the follow-up diff confirmed M1–M4 and L5–L12 fixed with nothing new
introduced, and found:
- a dangling `§8a` reference, fixed by this section;
- a miscount of the R3 notes in §7, fixed;
- two optional wording points (the rule paragraph's merged status keys, and template 01's "tick one").

Both optional points were applied. The rule paragraph now distinguishes adoption (NOT YET TRUE must
be true) from publication (READY — OPERATIONAL must be true). It does not say that adoption waits on
H4-B, because `check:legal:adoption` requires `H4-B-INTAKE-PROMOTED` to be listed at adoption and met
only at publication. The re-check also confirmed that no adopted draft and no seed differs from HEAD.

## 9. CI status (as observed on 7 October 2026)

| Run | Commit | Result | Cause |
|---|---|---|---|
| [37553732522](https://github.com/atikmurtaza/Gridsmith-Ltd/actions/runs/37553732522) | R4 `bddc905` | **failure** | `check:legal:parity`, the only failing command; see below |
| [37554454335](https://github.com/atikmurtaza/Gridsmith-Ltd/actions/runs/37554454335) | R4 `3c912cd` | **failure** | `check:legal:parity`: 258 problems against the **development** dataset |
| 37615086768 | R5 `0874d17` | in progress when this was written | Expected to fail the same command |
| 37616037618 | R5 `afb455c` | queued when this was written | Expected to fail the same command |

The R4 record left CI pending. In fact both R4 runs failed in the step "axe + security headers +
statutory record + responsive and legal checks", on **one of its 18 server-run commands**:
`check:legal:parity`. Every other command in that step passed, as did every static step, including
`check:legal:adoption` and `verify:static`.
- **Cause:** CI serves the development Sanity dataset, which still holds the pre-GS-LEGAL-001 legal
  documents (for example `/legal/privacy` at version "2.0" against the 2.1 draft).
- **History:** this has been the case since GS-LEGAL-001, which recorded that served parity against the
  development dataset is red until the legal documents are reseeded (owner decision D-24).
- **Not a regression.** It is the A-1 dependency, and it clears only when A-1 runs in a trusted
  environment with existing development credentials. The gate is not altered or bypassed.
- **Repository parity:** the draft-mode served run (real Next app, seeds answered locally) is green.

## 10. R6 addendum (7 October 2026)

R6 applied the owner's evidence. Nothing above is rewritten; these refinements govern where they differ.
See `R6-PRIVACY-2.2-DRAFT.md` §2–§5.
- **E-1:** [R8: hosting-account history redacted on owner instruction. Current fact: Gridsmith's admin department manages the hosting account; the account's Hostinger customer of record is not Gridsmith Ltd (R8 record §2).]
- **E-2:** the website is hosted in France. The mailbox is email hosting supplied through Hostinger;
  no product is named.
- **E-3:** Resend Free; 30 days; backups 7 days. Closed.
- **E-4:** the customer-accessible log window is the **last day** (owner dashboard and Supabase
  documentation). §3.3's API observation is not evidence of what a dashboard user sees. Provider-side
  retention is **not established**: one-day deletion cannot be asserted, and neither can 49 days.
- **E-5:** non-blocking; criteria wording.
- **Statute:** HMRC, CA 2006 s.388 and LA 1980 s.5 verified by the owner outside this environment.
- **Resend DPA:** incorporated into the customer agreement; Plus Five Five, Inc.
