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
| **O-2** Provider facts | Investigated in the order the owner set (§5). Three facts established, two partly, three need owner account checks; 11 checks are listed. **Privacy markers left in place**: nothing filled by assumption | §5 below |
| **O-3** Consumer workflow (a) | Adopted as the required process. Email acceptance; standard start by default; three-statement early start; 30-day default validity; "No VAT is charged"; "go ahead" is not acceptance; direct-to-printer rule with coordination; deferred-payment planning rule | `docs/_legal/operations/CONSUMER-CONTRACTING-WORKFLOW.md` |
| **O-4** Liability cap A + E | Bus 16: ordinary Scope = total fees paid and payable under it. Retainer or periodic Scope = the greater of (i) fees paid and payable in the 12 months before the event and (ii) fees payable for the first 12 months of the Scope (or its whole term, if shorter). A different cap only if prominently stated in a Scope. No floor, multiple, data super-cap or IP indemnity added. Non-excludable liabilities preserved (Bus 16 ¶1) | `MSA-BUSINESS.md` 3.1 §16 |
| **O-5** Four wording changes | (1) Bus 2 fallback: "any stage or month whose payment would otherwise fall due outside that limit is invoiced in advance instead". (2) Cons 4 / Bus 5: "all due within the 12 months beginning with the date of [your/the] contract". (3) Cons 9: "Nothing in this paragraph reduces our responsibility for our own work, including under sections 15 and 17." Bus 13: "Nothing in this paragraph reduces our responsibility for the work we create, subject to clause 16." (4) Option E (O-4). Consumer and Business → **3.1** | Both drafts |
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
the draft. Nothing else in the repository hard-codes "3.0" for these documents (searched).

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
| 11 | Housekeeping | Supabase gridsmith-preview → Edge Functions → Secrets; GitHub → Settings → Secrets and variables → Actions; local `.env.local` | No `SLACK_*` in any | Closes O-2(8) completely |

### 5.3 Effect on the Privacy Policy

- **§6 marker** (processor terms accepted): stays until checks 2, 5 and 7 answer it.
- **§7 marker** (safeguard per provider): stays until checks 2, 7 and 10 answer it. The R3 answer for
  Supabase is already "the UK Addendum in Supabase's DPA".
- **§8 marker** (retention): stays until the routine operates (`RETENTION-SCHEDULE.md` §3) and checks 4,
  6 and 9 set R12–R14.

### 5.4 Correction to apply with Privacy 2.2 (prepared; not applied)

§7 currently says: "Our email-notification provider may also process the notification outside the UK."

The evidence is that Resend stores all account data, including email metadata and logs, in the United
States. Once check 8 confirms the sending region, replace that sentence with:

> "Our email-notification provider, Resend, processes the notification and keeps its delivery records in
> the United States."

Name its safeguard from checks 7 and 10. Not applied now: Privacy cannot be adopted until all three
markers are resolved, and the wording rests on a search summary that check 8 can confirm.

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

<!-- R3:GATES -->

## 11. Final independent review

<!-- R3:REVIEW -->

## 12. Adoption package

The owner adopts a document by recording `ownerAdoptedOn` (date) and `ownerAdoptedVersion` (the exact
version) for its entry in `docs/_legal/GS-O003-R-REGISTER.json`, and setting its state to
`OWNER_ADOPTED`. **No script or agent does this.** On adoption, the draft's `**Draft date: …**` header
becomes `**Effective date: …**` (no earlier than the adoption date), and `check:legal:adoption` decides
whether it may move to `PUBLISHABLE`.

| Document | Version | Canonical path | Material changes from previous version | Remaining markers | Remaining external evidence | Recommended owner action |
|---|---|---|---|---|---|---|
| Client Terms for Business Clients | **3.1** | `docs/_legal/MSA-BUSINESS.md` | Bus 2: deferred-payment fallback. Bus 5: "within the 12 months beginning with the date of the contract". Bus 13: direct-to-printer model; N-2 tie-in "subject to clause 16". Bus 16: option E retainer cap | None | None for adoption. Before first use: `RIGHTS-CHAIN.md` §3 documents | Adopt 3.1 |
| Client Terms for Consumers | **3.1** | `docs/_legal/CONSUMER-TERMS.md` | Cons 4: "within the 12 months beginning with the date of your contract". Cons 6.1: print coordination without selling printed copies. Cons 9: N-2 tie-in "including under sections 15 and 17" | None | None for adoption. Before first use: the workflow templates (`operations/CONSUMER-CONTRACTING-WORKFLOW.md`) and `RIGHTS-CHAIN.md` §3 documents | Adopt 3.1 |
| Website Terms | 2.1 | `docs/_legal/WEBSITE-TERMS.md` | None since GS-LEGAL-001 | None | None | Adopt 2.1 |
| Cookie Policy | 2.1 | `docs/_legal/COOKIE-POLICY.md` | None since GS-LEGAL-001 | None | A-2 production cookie retest before `PUBLISHABLE` | Adopt 2.1; retest at cutover |
| Accessibility Statement | 2.1 | `docs/_legal/ACCESSIBILITY-STATEMENT.md` | None since GS-LEGAL-001 | None | None | Adopt 2.1 |
| `/legal/client-terms` (disambiguation) | 2.1 | `scripts/seed-legal.mjs` (no draft) | None since GS-LEGAL-001 | None | None | Adopt 2.1 |
| Privacy Policy | 2.1 | `docs/_legal/PRIVACY-POLICY.md` | — | **Three `[OWNER DECISION]` markers** (§6, §7, §8) | §5.2 checks 1–11; routine operating (`RETENTION-SCHEDULE.md` §3); §5.4 correction | **Do not adopt yet** |

**What the adoption phase will do after owner approval:**
1. Record the owner's adoption entries exactly as given.
2. Switch the adopted drafts' header to the effective date.
3. Run `check:legal:adoption`, `verify:static`, the migration dry run and `--write-manifest` (the
   manifest embeds the register state).
4. With the A-1 reseed authorised, reseed development and run served parity.
5. Leave publication to the cutover phase.
