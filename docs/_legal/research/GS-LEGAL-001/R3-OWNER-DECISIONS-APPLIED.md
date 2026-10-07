# GS-LEGAL-001-R3 — Owner decisions applied and final legal verification

**Date:** 7 October 2026. **Branch:** `claude/sweet-mendel-11qvli`. Started from `4d456892`, which was
verified identical to the GitHub remote HEAD with a clean tree before any change. **Status:** research
and owner-decision record. It is not legal advice, nobody has reviewed it as a solicitor would, and it
does not say that any document is compliant, approved, certified or enforceable in every circumstance.

**Scope held:**
- No document is `OWNER_ADOPTED` or `PUBLISHABLE`.
- No publication, deployment, DNS or `main` change.
- No Sanity write (development or Production), no Supabase write, no Production Edge change.
- No lead or `pg_dump` deleted. H4-H not started.

## 1. Environment limits that shape this record

The cloud environment's egress proxy refused, for both direct fetches and the fetch tool:
- legislation.gov.uk, gov.uk, ico.org.uk;
- Companies House (web and API);
- supabase.com, resend.com, hostinger.com;
- bailii.org.

Where a statute is cited below it is marked one of:
- **(a)** read at source by the GS-LEGAL-001 A–G agents on 6 October 2026, with a file reference; or
- **(b)** **PRIMARY SOURCE ACCESS BLOCKED**: web-search summaries only, externally unverified.

Provider facts came from:
- the connected Supabase and Vercel accounts (account-verified);
- Supabase's and Resend's public source repositories on GitHub (the provider's own text, not
  account-specific);
- web-search summaries (marked as such).

## 2. Owner decisions applied

| Decision | Applied as | Where |
|---|---|---|
| **O-1** Retention (a) + R8 modification | The schedule R1–R20 and the routine are adopted. R8 now returns or deletes unnecessary working material and keeps the final delivered set with the R5 contract record. **The routine is not operating**, so Privacy §8 is unchanged (§6). The 63-lead cleanup and the `pg_dump` replacement are prepared as a later phase, not run | `docs/_legal/operations/RETENTION-SCHEDULE.md` |
| **O-2** Provider facts | Investigated in the order the owner set (§5). Two facts are established (2, 8), five partly (1, 3, 4, 5, 7) and one needs the owner's account check (6); 12 checks are listed. **Privacy markers left in place**: nothing filled by assumption | §5 below |
| **O-3** Consumer workflow (a) | Adopted as the required process. Email acceptance; standard start by default; three-statement early start; 30-day default validity; "No VAT is charged"; "go ahead" is not acceptance; direct-to-printer rule with coordination; deferred-payment planning rule | `docs/_legal/operations/CONSUMER-CONTRACTING-WORKFLOW.md` |
| **O-4** Liability cap A + E | Bus 16: ordinary Scope = total fees paid and payable under it. Retainer or periodic Scope = the greater of (i) the fees paid and payable in the 12 months before the event giving rise to the claim and (ii) the fees payable for the first 12 months of that Scope (or, where the Scope has a fixed term shorter than 12 months, for that term), whether or not the Scope continues for that period, calculated at the periodic fee or rates stated in the Scope and, where it states only rates, using its estimate of time or, if it gives none, the average monthly fees paid and payable from the start of the Scope up to the event giving rise to the claim. This keeps the owner's formulation. It adds (a) a measurement rule for rates-only Scopes, (b) a reading of "whole term" as a **fixed** term, and (c) the notional-period words that give the start-up fix its purpose (final review R3-03 and narrow re-check). **Owner confirmation OC-1 (§12)** covers (c). A different cap only if prominently stated in a Scope. No floor, multiple, data super-cap or IP indemnity. Non-excludable liabilities preserved (Bus 16 ¶1) | `MSA-BUSINESS.md` 3.1 §16 |
| **O-5** Four wording changes | (1) Bus 2 fallback, under the default schedule, for clients who are individuals, partnerships or other unincorporated bodies: "we instead invoice each stage, and each month of work charged by time, before that work starts, and payment is due before the work starts (rather than within the 14 days in clause 5), so that no payment falls due after the work it pays for". It adds a time-charged estimate rule, a limit on time worked to time paid for, credit or refund of unused time, and timetable relief that is not a suspension. How it got here: R2's "invoiced in advance" still left 14-day terms (final review R3-01); a month-11 cut-off then leaked in four edge cases (narrow re-checks); prepayment removes deferral altogether, so there is nothing to count. (2) Cons 4 / Bus 5: "all due within the 12 months beginning with the date of [your/the] contract". (3) Cons 9: "Nothing in this paragraph reduces our responsibility for our own work, including under sections 15 and 17." Bus 13: "Neither this paragraph nor the client's approval of content reduces our responsibility for the work we create; that responsibility remains subject to clause 16." (4) Option E (O-4). Consumer and Business → **3.1** | Both drafts |
| **Printing** | Cons 6.1 adds: "Where your quotation includes it, we coordinate the print specification and files with the printer as part of our services, but we do not sell you the printed copies." Bus 13 adds the same model for business clients "unless the Scope expressly provides otherwise" | Both drafts |
| **C-1** VAT | Confirmed not registered. Documents stay VAT-neutral (`check:legal:adoption` forbids a status or number in a draft). The quotation template says "No VAT is charged." | Workflow §2 |
| **C-2** Contact channel | Confirmed WhatsApp/text only. No draft change. No legal requirement found that forces a voice line (§7, C-2) | — |
| **C-3** Registration wording | Verified as a legal question, not a style choice: **"registered in England and Wales"** (§7). The drafts already say this. The footer's "registered in England" (`GS-O004`) is recorded for the site remediation phase | §7 |
| **C-4** Drafted numbers | Kept. The 5-working-day figures remain "We aim to acknowledge…" targets, not guarantees | — |
| **C-5** Press copy | Both sentences approved. The rights-note sentence is already served. The printing sentence is a later site-phase change (not made: it is Press site copy, outside this legal commit) | §9 |
| **A-1** Development reseed | Not executed. Prepared (§8) | §8 |
| **A-2** Production cookie retest | Recorded as a mandatory pre-`PUBLISHABLE` / cutover check for the Cookie Policy on the gridsmith.uk origin | §8 |
| **P-1** Routine | Defined; not operating; Privacy §8 not changed | Retention schedule §2–§3 |
| **P-2** Rights chain | Verified role by role; replaced by role-specific requirements and a 7-item document inventory. **No term changed**: none is inaccurate or impossible if the documents are signed first | `docs/_legal/operations/RIGHTS-CHAIN.md` |
| **P-3** Freelancer | Retained as an operational precondition; separate from the review-display blocker; nothing scraped or reproduced | — |

## 3. Final documents

| Document | Previous | Final | State | Remaining blocker |
|---|---|---|---|---|
| Client Terms for Business Clients (`MSA-BUSINESS.md`) | 3.0 | **3.1** | `OWNER_REVIEW_REQUIRED` | Owner adoption only. Operationally, `RIGHTS-CHAIN.md` §3 documents before first use |
| Client Terms for Consumers (`CONSUMER-TERMS.md`) | 3.0 | **3.1** | `OWNER_REVIEW_REQUIRED` | Owner adoption only. Operationally, the workflow templates and `RIGHTS-CHAIN.md` §3 documents before first use |
| Website Terms (`WEBSITE-TERMS.md`) | 2.1 | 2.1 (unchanged) | `OWNER_REVIEW_REQUIRED` | Owner adoption only |
| Cookie Policy (`COOKIE-POLICY.md`) | 2.1 | 2.1 (unchanged) | `OWNER_REVIEW_REQUIRED` | Owner adoption; then the A-2 production retest before `PUBLISHABLE` |
| Accessibility Statement (`ACCESSIBILITY-STATEMENT.md`) | 2.1 | 2.1 (unchanged) | `OWNER_REVIEW_REQUIRED` | Owner adoption only |
| `/legal/client-terms` (seed) | 2.1 | 2.1 (unchanged) | `OWNER_REVIEW_REQUIRED` | Owner adoption only |
| Privacy Policy (`PRIVACY-POLICY.md`) | 2.1 | 2.1 (unchanged) | `OWNER_REVIEW_REQUIRED` | **Not adoptable.** Three `[OWNER DECISION]` markers stand: §6 (processor terms), §7 (transfer safeguard), §8 (retention). Needs the O-2 owner account checks, the retention routine activated (P-1) and the §7 correction in §5.4. Then version 2.2 |

Version references: the two client-terms drafts carry `**Version 3.1**` and `**Draft date: 7 October
2026**`. The served text, the seed, the migration manifest and the parity gate all read the version from
the draft. **Correction (final review R3-04):** the first version of this record said nothing else
hard-coded "3.0". That was false: `CLOUD-CONTINUATION.md` "Current Legal State" still listed 3.0 and a
6 October draft date for both. It is now updated. No code or gate hard-codes the version.

## 4. Primary-source verification

| # | Proposition | Authority | Access | Result | Confidence | Draft affected |
|---|---|---|---|---|---|---|
| 1 | Company tax records: keep 6 years from the end of the accounting period, longer in stated cases | FA 1998 Sch. 18 paras 21–22; HMRC CH14600; GOV.UK | **(b) blocked** | Supports R5/R6 | Medium-high | None (operational schedule) |
| 2 | Accounting records: a private company preserves them 3 years from the date made | CA 2006 s. 388(4)(a) | **(b) blocked** | Holds. **Correction:** R2 cited (4)(b), which is the public-company limb. The HMRC period governs | Medium | None |
| 3 | Limitation: contract and tort 6 years; deed 12; latent damage the later of 6 years or 3 from knowledge, 15-year longstop; s. 32 postponement | Limitation Act 1980 ss. 2, 5, 8, 14A, 14B, 32 | **(b) blocked**; never read in the repository | Holds. No adopted period shown wrong. Practical points: sign the client rights instrument as simple writing, not a deed; R7 "relied on" lasts while rights subsist | High (2, 5, 8); medium-high (14A, 14B, 32) | None |
| 4 | Website disclosure: "the part of the United Kingdom in which [the company] is registered" | SI 2015/17 reg. 25 | **(a)** `02-CITATION-LEDGER.md:315-325`; `D-ecommerce-disclosures.md:46, 57, 78` | Holds | High | None (drafts already compliant in form) |
| 4b | Registration categories are England and Wales (or Wales), Scotland, Northern Ireland; there is no "England" category | CA 2006 s. 9(2)(b), ss. 86–88 | **(b) blocked** | Holds. "Registered in England and Wales" is the correct formulation for an English registered office | Medium-high | None; footer (site phase) |
| 5 | Rights chain: first ownership s. 11; assignment s. 90(3); future copyright s. 91; waiver s. 87; employee exceptions ss. 79(3), 82; computer-generated ss. 9(3), 178 | CDPA 1988 | **(a)** for ss. 9(3), 11, 78, 79, 81, 84, 87, 90, 91, 178 (`B-business-terms.md:53`, `G-final-cross-check.md:33`, ledger 794–807). **(b)** for ss. 77, 80, 82, 94, 95 | No term inaccurate; operational documents required | High on (a); medium-high on (b) | None |

**Still externally unverified:** items 1, 2, 3, 4b, and the (b) part of item 5. None of them changed a
published or proposed-for-adoption clause in R3.

## 5. Provider evidence (O-2)

### 5.1 Facts

| # | Fact | Status | Evidence |
|---|---|---|---|
| 1 | **Hostinger DPA** | PARTLY ESTABLISHED | Search summaries of Hostinger's DPA and Terms: the DPA is incorporated into the Terms of Service; acceptance is treated as signing the EU SCCs (Modules 2/3); Hostinger acts as processor. **Contracting entity unclear**: UK customers contract with Hostinger UK Limited, while the DPA names Hostinger International Ltd (Cyprus) as importer. No UK Addendum or IDTA was found. Sub-processors include AWS, Google Cloud, Cloudflare, MailChannels, Proofpoint, Anthropic Ireland, Spectra Tech, Vonage |
| 2 | **Supabase DPA** | ESTABLISHED (current terms) | Supabase's own Terms v3/v4 and dashboard text (read from its public repository): the DPA "is incorporated into this Agreement"; "No separate signed DPA is needed". Contracting entity **Supabase Pte. Ltd. (Singapore)**. Transfers use EU SCCs (Modules 2/3) **plus the UK Addendum (B.1.0)**, with a TIA available under Organization → Documents. Data is stored in the customer-chosen region. **Account-verified:** organisation "Gridsmith Org" on the **Free** plan; both projects in **eu-west-1** |
| 3 | **Resend DPA** | PARTLY ESTABLISHED | Search summaries: the DPA is pre-signed and executed on sign-up (Settings → Documents); entity **Plus Five Five, Inc.** (US); SCCs; DPF and UK Extension certification announced 13 March 2025. The current DPF listing and any UK Addendum in the DPA are unverified |
| 4 | **Transfer safeguard per flow** | PARTLY ESTABLISHED | **Supabase:** stored in Ireland, but the processor is a Singapore entity with US sub-processors, so the safeguard to name is the **UK Addendum in Supabase's DPA**. Edge Functions run in the region closest to the caller: the intake sends no region pin; a `forceFunctionRegion` option exists (later implementation choice). **Resend:** sending region is a per-domain setting (default us-east-1) per Resend's public API spec; Resend's region page (search summary) says all account data, including email metadata and logs, is **stored in the United States**. Safeguard: the UK Extension if the listing is active, otherwise the DPA's clauses. **Hostinger:** server location is chosen per site in hPanel; the CDN has non-UK/EEA edges |
| 5 | **Resend log retention** | PARTLY ESTABLISHED | 30 days on Free, Pro and Scale per Resend's pricing and security pages (search summaries; third-party pages disagree) |
| 6 | **Hostinger access-log and mailbox-backup retention** | OWNER ACCOUNT CHECK REQUIRED | Only hPanel filter windows (7 days for site logs; 30 days for email access logs) and a 30-day trash rule were found; no stated retention period |
| 7 | **Supabase backups and logs** | PARTLY ESTABLISHED | API and database logs: **1 day on Free** (Supabase's own pricing source; plan account-verified). Backups: not documented for Free; a help note says up to 7 daily backups at Supabase's discretion |
| 8 | **`SLACK_LEADS_WEBHOOK`** | ESTABLISHED | **Vercel:** no such key in production, preview or development (Vercel API, 7 Oct 2026). **Hostinger static build:** stripped by `scripts/build-static.mjs:42-46`; no persistent Node. **Edge Functions:** the deployed `gs-lead-intake` v8 and `gs-notification-worker` v6 read only `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `GRIDSMITH_ALLOWED_ORIGINS`, `GRIDSMITH_WORKER_TOKEN`, `LEAD_NOTIFICATION_EMAIL`, `RESEND_API_KEY`, `LEAD_NOTIFICATION_FROM`, and call only Supabase RPC/functions and `api.resend.com`. Production Supabase has no Edge Functions. **GitHub workflows** reference no `secrets.`. The only reader in the code, `lib/leads/notify.ts:54`, runs only on a Next server. Residual housekeeping only (5.2, item 11) |

> **R5 correction (7 October 2026):** the Supabase "1 day" figure is the published plan figure, not a deletion period. Logs carrying client-IP header fields were observed held ≥49 days (`R5-PRIVACY-EVIDENCE.md` §3.3).

### 5.2 Owner account checks

| # | Provider | Where to look | Report | Why |
|---|---|---|---|---|
| 1 | Hostinger | hPanel → Billing → any invoice → seller | Exact contracting entity | Art. 28(3) party; whether the contract itself is a restricted transfer |
| 2 | Hostinger | Written request to support: "Does the DPA at hostinger.com/legal/dpa apply to account [x]? Does it include the UK Addendum or IDTA for transfers outside the UK/EEA?" | Yes/no each; keep the reply | Art. 28(3); Arts 44–46 |
| 3 | Hostinger | hPanel → Websites → [site] → server location; Emails → product (Hostinger Email or Titan) | Country; product | Art. 13(1)(e)–(f) |
| 4 | Hostinger | Support request | Website and CDN access-log retention (days); mailbox backup retention (days) | Art. 13(2)(a); R12, R3, R18 |
| 5 | Supabase | Dashboard → Organization "Gridsmith Org" → Documents | Whether the DPA panel shows "incorporated… no separate signed DPA"; whether a PandaDoc DPA was ever signed (date); download the TIA | Art. 28(3); Art. 46 |
| 6 | Supabase | Support ticket for `dqiutgmxillhsbzgnlsx` and `qfgpwumvvtizeamkynes` | Whether daily backups exist on Free, and for how many days | R14 |
| 7 | Resend | Dashboard → Settings → Documents → download the DPA | Its date; whether it includes the UK Addendum or IDTA | Art. 28(3); Art. 46 |
| 8 | Resend | Dashboard → Domains → the `LEAD_NOTIFICATION_FROM` domain → Region | Region and sender domain (or `resend.dev`) | Art. 13(1)(f) |
| 9 | Resend | Dashboard → Settings → Billing → plan; resend.com/pricing retention; oldest email date | Plan and retention days | R13; Art. 13(2)(a) |
| 10 | DPF | dataprivacyframework.gov/list → "Plus Five Five" | Active (yes/no); UK Extension (yes/no) | Whether the UK–US data bridge can be named |
| 12 | Supabase | Dashboard → project → Logs → Edge Functions, or a support ticket | Edge Function log retention on the Free plan (days) | Privacy §2 ¶3; R14 |
| 11 | Housekeeping | Supabase gridsmith-preview → Edge Functions → Secrets; GitHub → Settings → Secrets and variables → Actions; local `.env.local` | No `SLACK_*` in any | Closes O-2(8) completely |

### 5.3 Effect on the Privacy Policy

- **§6 marker** (processor terms accepted): stays until checks 2, 5 and 7 answer it.
- **§7 marker** (safeguard per provider): stays until checks 2, 7 and 10 answer it. The R3 answer for
  Supabase is already "the UK Addendum in Supabase's DPA".
- **§8 marker** (retention): stays until the routine operates (`RETENTION-SCHEDULE.md` §3) and checks 4,
  6 and 9 set R12–R14.

### 5.4 Privacy 2.2 change list (prepared; not applied)

Privacy 2.1 cannot be adopted until all three markers are resolved. These corrections go in at the same
time, as Privacy 2.2. Each is confirmed or sharpened by the §5.2 check named.

| § | 2.1 says | 2.2 must say (from R3 evidence) | Confirm with |
|---|---|---|---|
| §2 ¶3 | "our providers may keep technical request logs, as described in section 6" | Name the logs: Hostinger (site, CDN and mailbox access logs); Supabase (API and database logs, which include IP addresses, kept 1 day on the Free plan; Edge Function log retention to confirm with check 12); Resend (delivery metadata) | Checks 3, 4, 9, 12 |
| §6, Hostinger | "hosts our email mailbox" | The actual mailbox product (Hostinger Email or Titan) and the contracting entity | Checks 1, 3 |
| §6, Supabase | "stores enquiries in a database located in Ireland" | Keep. Add that Supabase (Supabase Pte. Ltd., Singapore) keeps platform logs for its own short period and uses sub-processors | Check 5 |
| §6, Resend | notification contents as stated | Keep. Add that Resend keeps delivery records for its stated period | Check 9 |
| §6 marker | "[OWNER DECISION: confirm … data processing terms are accepted …]" | "We use these providers under written terms that require them to protect personal data and to use it only to provide their service to us." (marker removed) | Checks 2, 5, 7 |
| §7 ¶1 | Ireland adequacy as the Supabase position | Data is stored in Ireland. Supabase is a Singapore company with US sub-processors, so access from outside the UK is covered by the UK Addendum in Supabase's data processing agreement | Check 5 |
| §7 ¶2 | "Our email-notification provider may also process the notification outside the UK." | "Our email-notification provider, Resend, processes the notification and keeps its delivery records in the United States." Also: Hostinger's content delivery network serves pages from locations outside the UK and Europe | Checks 8, 3 |
| §7 marker | "[OWNER DECISION: name the safeguard …]" | Supabase: UK Addendum. Resend: UK Extension to the EU–US Data Privacy Framework (UK–US data bridge) if check 10 confirms it is active, otherwise the clauses in its DPA. Hostinger: the mechanism check 2 confirms | Checks 2, 7, 10 |
| §8 marker | "[OWNER DECISION: set retention periods …]" | R2 §5.4 wording as amended by `RETENTION-SCHEDULE.md` §3 | Routine operating; checks 4, 6, 9 |

> **R5 correction (7 October 2026):** the Supabase "1 day" figure is the published plan figure, not a deletion period. Logs carrying client-IP header fields were observed held ≥49 days (`R5-PRIVACY-EVIDENCE.md` §3.3).

"Our enquiry database does not store your IP address" (§2) stays: it is literally accurate, because the
intake code stores none.

## 6. Retention (O-1)

| Topic | Status |
|---|---|
| Final schedule | R1–R20 in `RETENTION-SCHEDULE.md` |
| R8 modification | Applied: the final delivered set is kept with R5; working material, superseded drafts, unnecessary client material and personal data are returned or deleted within 90 days |
| 63-lead later action | Prepared as a controlled cleanup phase (`RETENTION-SCHEDULE.md` §4); not run; no Production read or write in R3 |
| `pg_dump` later action | Replace or delete obsolete exports after the authorised deletion run (R17); not deleted in R3 |
| Routine activation | **Not operating** |
| Privacy wording | §8 unchanged, marker kept; activation conditions in `RETENTION-SCHEDULE.md` §3 |

## 7. Company disclosures and contact

**C-3.** SI 2015/17 reg. 25 requires "the part of the United Kingdom in which [the company] is registered"
(read at source by D). Companies Act 2006 s. 9(2)(b) allows only three answers for where the registered
office is situated: England and Wales (or Wales), Scotland, or Northern Ireland (search summary; s. 9 not
read at source by any agent). The address-line "England" on the register overview, which `GS-O004`
relied on, is not the jurisdiction (D report). No record captured the register's jurisdiction field or
the certificate's wording.

**Conclusion:** "registered in England and Wales" is the correct formulation (medium-high). "Registered
in England" is imprecise rather than false, but names no statutory category.
- **Drafts:** all six already say "a private limited company registered in England and Wales". Unchanged.
- **Templates:** use it.
- **Footer** (`placeOfRegistration: 'England'`, `GS-O004`): change in the site remediation phase. Not
  changed here.

A one-line confirmation from the certificate of incorporation would close the residual medium.

**C-2.** CCR Sch. 2(c) asks for the trader's telephone number "where available". The published number
is displayed and described as WhatsApp or text. The PSR reg. 7(2)(b) point remains UNVERIFIED (G).
R3 found no legal requirement forcing a voice channel. Email (contact@gridsmith.uk) and post stay the
formal written routes.

## 8. Deferred and prepared actions

**A-1 development reseed.** Not required for adoption. `GS-O003-R` gates `PUBLISHABLE` on the register
and `check:legal:adoption`, not on served parity. CI's served `check:legal:parity` against the development
dataset stays red until the reseed. **Ready to execute after adoption decisions fix the versions:**
`npm run seed` with `.env.local` holding a development write token. The script hardcodes
`DATASET = 'development'` and refuses production. It writes every seed document, including the seven
`seed-legal-*` documents generated from the drafts, and deletes obsolete seed by provenance. There is no
legal-only variant; a narrower write would need a separately authorised script. **No publication effect**
(Hostinger builds read the production dataset).

**A-2 production cookie retest.** At cutover, against https://gridsmith.uk:
- `curl -I` on `/` and a legal route: no `Set-Cookie` before interaction;
- in a browser, only `gs_consent` (value `1`, 365 days) after *Got it*.

It is a mandatory pre-`PUBLISHABLE` check for the Cookie Policy. Amend the policy if Hostinger features
set cookies.

**Separate work (not R3):**
- the 63-lead cleanup and retention automation (`RETENTION-SCHEDULE.md` §2, §4);
- the footer registration wording and the Press printing copy (site phase);
- Edge Function region pinning (implementation option, §5.1 row 4);
- the Hostinger `/contact/*` and `/about/*` HTTP 500 defect;
- Freelancer review permission;
- `GS-X002`;
- H4-H.

## 9. Press copy (C-5)

- **"These summarise our client terms, which govern if anything here differs."** Approved; already served
  (`components/divisions/press/PressHome.tsx`).
- **"Printing is done by a printer you contract with and pay directly; we coordinate the specification
  with them."** Approved for the site phase. It replaces `PressHome.tsx:176–177` ("Printing is carried out
  by a supplier agreed in the scope; we coordinate paperback and hardback specifications with them rather
  than printing in-house."). Also review `:159` ("…the printing supplier agreed in the scope").

## 10. Gates and the draft-mode served check

All gates were run locally on Node 24.21.0, the version the repository requires, installed from the npm
registry into the session scratchpad.

| Gate | Result |
|---|---|
| `verify:static` (incl. `typecheck`, `lint`, `check:claims`, `check:struck`, `check:lists`, `check:cms:migration`) | **PASS**, exit 0, on the final tree |
| `check:legal:adoption` | **PASS**: 6 drafts, 7 documents, register coherent, all `OWNER_REVIEW_REQUIRED` |
| `check:legal:adoption:selftest` | **69/69**. New cases: the looser 3.0 period wording fails (consumer and business), and deleting "no interest or fee" fails (consumer and business). Proven against `HEAD` 3.0 text: both drafts red on the tightened rule. The adopted-specimen helper now replaces the draft date by pattern and throws if nothing was replaced. The old literal "6 October 2026" replace had silently stopped producing a specimen once the date moved; it went red here rather than passing |
| Migration dry run | **PASS**: 47 eligible; 10 gated (`GS-X002`, `GS-O003-R`); manifest in agreement. No regeneration needed: the manifest embeds register **state**, which did not change |
| `check:legal:parity` (draft mode) | **PASS**: 6 documents, 107 clauses, 429 paragraphs word for word, 107 clauses reachable |
| `check:consumer-terms` (draft mode) | **PASS**: 2 routes, 202 links, 0 to the business terms; `/press` reaches `#clause-10-1` |
| `git diff --check` | Clean |
| Forbidden content and markers | No solicitor, "fully compliant", "certified" or AI-draft claims; no `[SEED]`, `[TK]`, `[DECISION REQUIRED]` or `[OWNER DECISION]` in the six adoptable documents; no VAT number or status; no `tel:`; portfolio use consent-only; Technical wording inside `GS-X002`. Privacy keeps its three `[OWNER DECISION]` markers by design |

**Draft mode, and how its validity was established.** Sanity is unreachable from this environment, and
the development dataset still serves v2.0 (A-1 not run). So the served gates ran against the **real Next
application** (`next dev`), whose Sanity reads were answered locally:
- a scratchpad proxy terminated `*.api.sanity.io` with a throwaway certificate authority;
- it evaluated each GROQ query with `groq-js` over the repository's own seed documents (the seven legal
  documents generated from the drafts, the services, the group pages and company details);
- every other host was refused.

No Sanity dataset was read or written, and the harness is not committed.

**It was proven a valid subject:**
- with the drafts already at 3.1 but the mock still loaded with 3.0, `check:legal:parity` went **red with
  8 problems**: the version branch on both documents, and branch B on exactly the six edited clauses
  (Bus 2, 5, 13, 16; Cons 4, 9);
- it went green only after the mock reloaded the 3.1 drafts.

CI's served `check:legal:parity` against the development dataset stays red until A-1.


## 11. Final independent review

**Reviewer independence.** Each review below was a fresh agent with no part in drafting. It read the
changed clauses, the surrounding clauses, the owner decisions, the recorded authority (A–G, the citation
ledger), the cross-document references and the operational templates, and it ran the adoption gates.

| Pass | Scope | HIGH | MEDIUM | LOW | NOTE | Outcome |
|---|---|---|---|---|---|---|
| **Final independent adversarial review** | All R3 changes: consumer rights, formation, early start, cancellation and refunds, payment, deferred payments, B2B liability, IP and moral rights, privacy factuality, retention, disclosures, cross-document consistency, versions, template/terms parity, gate | 0 | 5 | 10 | 9 | All justified findings fixed (below) |
| **Narrow re-check 1** | The fixes for R3-01–R3-08 | 0 | 4 | 12 | — | Fixed |
| **Narrow re-check 2** | The re-drafted Bus 2, Bus 13 and Bus 16 | 0 | 3 | 5 | — | Bus 2 rebuilt as prepayment; Bus 16 notional period made explicit (OC-1) |
| **Narrow re-check 3** | The final Bus 2 and Bus 16 | 0 | 0 | 7 | — | **PASS.** Five LOW wording fixes applied (below); two recorded only |

**Fixes, by finding:**

- **Medium findings:**
  - **R3-01 / re-checks — Bus 2 deferred-payment fallback.** Under the default schedule, a client who is
    an individual, partnership or other unincorporated body now pays each stage, each month of time
    work, any Change Order price and any third-party cost **before** it starts or is committed. So no
    payment falls due after the work it pays for, and art. 60F(2) has nothing to count. Earlier forms
    ("invoiced in advance"; a month-11 cut-off) left edge cases.
  - **R3-02 — consumer slippage.** Workflow rule 1: consumers pay at or before the start of the work
    each payment covers, and supplier costs are collected before Gridsmith pays them.
  - **R3-03 — Bus 16 option E.** "Paid and payable" is used consistently. Limb (ii) adds a rates-only
    measurement rule and a fixed-term reading, plus "whether or not the Scope continues for that period"
    (owner confirmation OC-1, §12).
  - **R3-04 — record and continuation.** The false "searched" claim is corrected, and the continuation
    table is updated to 3.1.
  - **R3-05 — Privacy 2.2.** The change list is complete (§5.4). It is not applied.
- **Low findings:**
  - **R3-06:** workflow rule 1 period wording.
  - **R3-07:** the gate now requires the "no interest or fee" limb; selftest 69.
  - **R3-08:** Bus 13 tie-in reworded.
  - **R3-09 / R3-10:** printing — no commission arrangement, orders placed after the cancellation period,
    and a business goods-supply Scope must carry an approved goods clause and name clause 13.
  - **R3-11:** anchors fixed and §10/§11 filled.
  - **R3-12:** retention periods stated as the monthly routine achieves them.
  - **R3-13:** design and database right added to the rights chain, marked UNVERIFIED.
  - **R3-14:** "No VAT is charged on our fees; supplier costs are shown including any VAT the supplier
    charges."
  - **R3-15:** the workflow is not for use until Consumer 3.1 is adopted and Privacy is `PUBLISHABLE`.
- **Notes taken:**
  - template notes marked "remove this note";
  - a payment received before acceptance is refunded within 14 days if no acceptance follows;
  - the run log's retention is stated;
  - the Technical longstop is noted on R5;
  - adoption step 1 limited to transcribing the owner's instruction.
- **Narrow re-check 3, five LOW fixes applied:**
  - Bus 2 now covers Change Order prices and third-party costs;
  - unused prepaid time is refunded within 14 days;
  - Bus 5 says "Unless the Scope or clause 2 says otherwise";
  - Bus 16 spreads a whole-project estimate evenly;
  - Bus 16 treats a period under a month as one month.

  These are wording only, and the gates were re-run on them.
- **Recorded only (all pre-existing, not introduced by R3):**
  - the "payment schedule" / "payment arrangement" terminology;
  - the undefined "periodic Scope";
  - the conflict between Bus 1 "names the clause" and Bus 16 "stated prominently";
  - the routes to a payment after supply under Bus 3, 4, 6.2, 7 and 18.

**Verdict of the last pass:** "Both §2 and §16 achieve what they set out to do, and the routes that
still allow a payment after the work were all there before this commit."


## 12. Adoption package

The owner adopts a document by recording `ownerAdoptedOn` (date) and `ownerAdoptedVersion` (the exact
version) for its entry in `docs/_legal/GS-O003-R-REGISTER.json`, and setting its state to
`OWNER_ADOPTED`. **No script or agent does this.** On adoption, the draft's `**Draft date: …**` header
becomes `**Effective date: …**` (no earlier than the adoption date), and `check:legal:adoption` decides
whether it may move to `PUBLISHABLE`.

| Document | Version | Canonical path | Material changes from previous version | Remaining markers | Remaining external evidence | Recommended owner action |
|---|---|---|---|---|---|---|
| Client Terms for Business Clients | **3.1** | `docs/_legal/MSA-BUSINESS.md` | Bus 2: default-schedule fallback (individual and unincorporated clients pay each stage or month before it starts). Bus 5: "within the 12 months beginning with the date of the contract". Bus 13: direct-to-printer model; N-2 tie-in (client approval does not reduce our responsibility, which remains subject to clause 16). Bus 16: option E retainer cap | None | None for adoption. Before first use: `RIGHTS-CHAIN.md` §3 documents | Adopt 3.1, confirming OC-1 |
| Client Terms for Consumers | **3.1** | `docs/_legal/CONSUMER-TERMS.md` | Cons 4: "within the 12 months beginning with the date of your contract". Cons 6.1: print coordination without selling printed copies. Cons 9: N-2 tie-in "including under sections 15 and 17" | None | None for adoption. Before first use: the workflow templates (`operations/CONSUMER-CONTRACTING-WORKFLOW.md`) and `RIGHTS-CHAIN.md` §3 documents | Adopt 3.1 |
| Website Terms | 2.1 | `docs/_legal/WEBSITE-TERMS.md` | None since GS-LEGAL-001 | None | None | Adopt 2.1 |
| Cookie Policy | 2.1 | `docs/_legal/COOKIE-POLICY.md` | None since GS-LEGAL-001 | None | A-2 production cookie retest before `PUBLISHABLE` | Adopt 2.1; retest at cutover |
| Accessibility Statement | 2.1 | `docs/_legal/ACCESSIBILITY-STATEMENT.md` | None since GS-LEGAL-001 | None | None | Adopt 2.1 |
| `/legal/client-terms` (disambiguation) | 2.1 | `scripts/seed-legal.mjs` (no draft) | None since GS-LEGAL-001 | None | None | Adopt 2.1 |
| Privacy Policy | 2.1 | `docs/_legal/PRIVACY-POLICY.md` | — | **Three `[OWNER DECISION]` markers** (§6, §7, §8) | §5.2 checks 1–12; routine operating (`RETENTION-SCHEDULE.md` §3); §5.4 correction | **Do not adopt yet** |

**Owner confirmation with adoption of Business 3.1, OC-1:** Bus 16 (ii) now says the fees for the first
12 months are counted "whether or not the Scope continues for that period". That is the notional first 12
months, which gives the retainer start-up fix its purpose: on a 2-month rolling retainer, limb (i) and the
actual fees would both be only 2 months' fees. The owner's formulation did not say this expressly. If the
owner intends the fees for the months actually run, the words come out before adoption (version 3.2).

> **R4 addendum (7 October 2026): OC-1 — CONFIRMED BY OWNER.** For a rolling retainer, limb (ii) uses the
> fees for the notional first 12 months of the Scope even where the Scope ends earlier. The wording above
> is kept unchanged and Business 3.1 is adopted with it (`R4-OWNER-ADOPTION.md` §3). This addendum is the
> only R4 change to this record.

**What the adoption phase will do after owner approval:**
1. Transcribe into the register exactly the adoption the owner instructs, and nothing more. The agent
   never chooses a date or version.
2. Switch the adopted drafts' header to the effective date.
3. Run `check:legal:adoption`, `verify:static`, the migration dry run and `--write-manifest` (the
   manifest embeds the register state).
4. With the A-1 reseed authorised, reseed development and run served parity.
5. Leave publication to the cutover phase.
