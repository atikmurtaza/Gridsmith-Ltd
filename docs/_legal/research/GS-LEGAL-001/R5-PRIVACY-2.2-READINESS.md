# Privacy Policy 2.2 — clause readiness (R5; NOT applied)

**Phase:** `GS-LEGAL-001-R5`, 7 October 2026. **Nothing here is applied.**
`docs/_legal/PRIVACY-POLICY.md` remains **2.1**: Draft date 6 October 2026, three `[OWNER DECISION]`
markers, `OWNER_REVIEW_REQUIRED`, no adoption fields.

This file supersedes the *status* column of `R4-PRIVACY-2.2-CHANGE-PLAN.md`, which stays as history.
The evidence is `R5-PRIVACY-EVIDENCE.md` (§ numbers below refer to it). The check numbers P-01 to P-12
are those of `../../operations/PRIVACY-EVIDENCE-CHECKLIST.md`.

**Rule for applying it.** A clause goes into 2.2 only when every factual dependency in its row is
verified and any operational statement in it is already true. Square brackets `[…]` in proposed
wording are values still to be supplied. None is to be filled by inference. Privacy 2.2 as a whole can
reach `OWNER_ADOPTED` only once **no** row is open, because `check:legal:adoption` refuses markers and
Draft dates at adoption. Its `PUBLISHABLE` prerequisites are `CUTOVER-AUTHORITY` and
`H4-B-INTAKE-PROMOTED`.

**Status key:**
- **READY:** every fact is verified; it can be applied in the 2.2 drafting phase.
- **READY — OPERATIONAL:** the facts are verified, but the clause describes the H4-B intake, which runs
  in Production only after promotion. It may be drafted now, and publication waits for
  `H4-B-INTAKE-PROMOTED`.
- **PRIMARY RE-READ:** it rests on a search summary of the provider's official page. A direct read
  from an unblocked environment is needed; no owner account check is needed.
- **OWNER CHECK:** needs an owner check from the checklist.
- **NOT YET TRUE:** describes an operation that does not yet happen.

---

## 1. Header

| | |
|---|---|
| **Current 2.1** | `**Version 2.1**` · `**Draft date: 6 October 2026**` |
| **Proposed 2.2** | `**Version 2.2**` · `**Draft date: [date of the 2.2 phase]**`. Once the owner adopts, the header becomes `**Effective date: …**` |
| **Evidence** | State model (`lib/legal/adoption.ts`; `check:legal:adoption`) |
| **Status** | Applied with the rest, in one legal phase |
| **Remaining dependency** | Every row below |

## 2. §2 ¶3 — technical logs

| | |
|---|---|
| **Current 2.1** | "Our enquiry database does not store your IP address or browser details; our providers may keep technical request logs, as described in section 6." |
| **Proposed 2.2** | "Our enquiry database does not store your IP address or browser details. Our providers' own systems do record them: when you submit a form, the logs of Supabase, which receives it, record your IP address, approximate country and browser details, and our hosting provider records the same kind of technical information about each request to the website. Sections 6 to 8 say more." |
| **Evidence** | §3.3: account-verified `cf_connecting_ip`, `x_real_ip`, `cf_ipcountry` and `user_agent` in `edge_logs` and `function_edge_logs`. Browser-to-Supabase posting (`lib/leads/edge-client.ts:23`). The host processing IP and browser details is the existing §2 wording |
| **Status** | **READY — OPERATIONAL** |
| **Remaining dependency** | `H4-B-INTAKE-PROMOTED` before publication |

## 3. §6 — Hostinger entry

| | |
|---|---|
| **Current 2.1** | "**Hostinger**, which hosts the website and its content delivery network, and hosts our email mailbox (contact@gridsmith.uk). Like any web host, it processes technical information about each request to the website." |
| **Proposed 2.2** | "**Hostinger** ([P-01: contracting entity]), which hosts the website and its content delivery network, and provides our email mailbox (contact@gridsmith.uk) through [P-03: Hostinger Email / Titan]. Like any web host, it processes technical information about each request to the website." |
| **Evidence** | §2 P-01 (the DPA's three possible entities, search summary); P-03 (CDN active for staging, account) |
| **Status** | **OWNER CHECK** |
| **Remaining dependency** | P-01 and P-03. The gridsmith.uk CDN is enabled at cutover |

## 4. §6 — Supabase entry

| | |
|---|---|
| **Current 2.1** | "**Supabase**, which runs the server functions that receive our enquiry forms and stores enquiries in a database located in Ireland." |
| **Proposed 2.2** | "**Supabase** (Supabase Pte. Ltd., Singapore), which runs the server functions that receive our enquiry forms and stores enquiries in a database located in Ireland. Supabase uses its own sub-processors, including companies based in the United States. It keeps technical logs of each request, including IP addresses and browser details, and may keep backup copies of the database for up to seven days." |
| **Evidence** | §3.1 (Terms v4 entity; DPA §6; sub-processor list 1 June 2026); §3.2 (backups); §3.3 (logs); region `eu-west-1` (account) |
| **Status** | **READY — OPERATIONAL** |
| **Remaining dependency** | `H4-B-INTAKE-PROMOTED`. Before H4-B, Production has no Edge Functions (account, R4 and R5) |

## 5. §6 — Resend entry

| | |
|---|---|
| **Current 2.1** | "**Resend**, which sends us an internal email when an enquiry arrives. That email contains your name, email address, company and phone number (if given), the studio and service you asked about, the type of enquiry and our reference for it. It does not contain your message or your other answers, and it is sent only to us." |
| **Proposed 2.2** | Keep the current text, and add: "Resend keeps the email and its delivery records for 30 days." |
| **Evidence** | §2 P-09: 30 days on Free, Pro and Scale (search summary of resend.com) |
| **Status** | **PRIMARY RE-READ + OWNER CHECK** |
| **Remaining dependency** | P-09: the plan name, and the date of the oldest email still listed. If emails older than 30 days are still listed, the sentence becomes "for a period Resend sets" |

## 6. §6 — the processor-terms marker

| | |
|---|---|
| **Current 2.1** | "We use these providers under written terms that require them to protect personal data and to use it only to provide their service to us. [OWNER DECISION: confirm that the Hostinger, Supabase and Resend data processing terms are accepted on the accounts used before adopting this sentence.]" |
| **Proposed 2.2** | "We use these providers under written terms that require them to protect personal data and to use it only to provide their service to us." (marker removed) |
| **Evidence** | **Supabase:** incorporated automatically into the Terms ("No separate signed DPA is needed"), verified at provider and implementation level (§3.1). **Resend:** "pre-signed … fully executed once you sign up", for every account (search summary). **Hostinger:** the DPA is annexed to and incorporated into the Terms of Service for hosting and email (search summary) |
| **Status** | **PRIMARY RE-READ** (Hostinger, Resend); Supabase READY |
| **Remaining dependency** | A direct read of hostinger.com/legal/dpa and of Resend's DPA. No owner support request is needed, because the contracts apply by acceptance of the providers' terms |

## 7. §7 ¶1 — where enquiries are stored

| | |
|---|---|
| **Current 2.1** | "Enquiries submitted through our forms are stored in Ireland, which the UK recognises as providing adequate protection for personal data." |
| **Proposed 2.2** | "Enquiries submitted through our forms are stored in Ireland, which the UK recognises as providing adequate protection for personal data. Supabase, which provides that database, is a Singapore company and uses sub-processors that include US companies. Any access to our enquiries from outside the UK and Europe is covered by the UK International Data Transfer Addendum to the EU standard contractual clauses in Supabase's data processing agreement." |
| **Evidence** | §3.1: DPA Schedule 2 §2 (Approved Addendum B.1.0, s.119A(1) DPA 2018), importer Supabase Pte. Ltd., §6.1 region rule, `eu-west-1`. The Ireland adequacy limb is unchanged from 2.1 (R3) |
| **Status** | **READY** |
| **Remaining dependency** | None for this sentence |

## 8. §7 ¶2 — processing outside the UK

| | |
|---|---|
| **Current 2.1** | "The servers that receive a form submission run close to the person sending it, so a submission made from outside the UK or Europe may be processed briefly in that region before it is stored. Our email-notification provider may also process the notification outside the UK." |
| **Proposed 2.2** | Keep the first sentence. Replace the second with: "Our email-notification provider, Resend, processes the notification and keeps its delivery records in the United States. Our hosting provider's content delivery network may serve the website from locations outside the UK and Europe." |
| **Evidence** | First sentence: R3 (Edge Functions run in the nearest region, and the intake pins none). Resend US: provider-stated in its DPA and security pages, whatever sending region is chosen (§3.4, search summaries). CDN: active for staging (account, H4-D); non-UK/EEA edges (R3, search summary) |
| **Status** | **PRIMARY RE-READ** (Resend, Hostinger CDN) |
| **Remaining dependency** | Direct reads. The gridsmith.uk CDN is enabled at cutover |

## 9. §7 — the safeguard marker

| | |
|---|---|
| **Current 2.1** | "Where personal data is transferred outside the UK, we rely on [OWNER DECISION: name the safeguard confirmed for each provider, for example UK adequacy regulations including the UK-US data bridge for a provider certified to it, or the UK International Data Transfer Agreement or Addendum in the provider's terms]. You can ask us for details of these safeguards at contact@gridsmith.uk." |
| **Proposed 2.2** | "Where personal data is transferred outside the UK, we rely on the UK International Data Transfer Addendum to the EU standard contractual clauses, which is included in the data processing agreements of Supabase, Resend and Hostinger. You can ask us for details of these safeguards at contact@gridsmith.uk." |
| **Evidence** | **Supabase:** verified (§3.1). **Resend:** "UK SCCs" = EU SCCs as amended by the UK Addendum, deemed incorporated (search summary). **Hostinger:** UK IDTA Addendum B1.0 deemed incorporated (search summary). **The DPF and UK Extension are deliberately not relied on:** the register is unreachable here (P-10), and the Addendum is an independent mechanism |
| **Status** | Supabase **READY**; Resend and Hostinger **PRIMARY RE-READ** |
| **Remaining dependency** | Direct reads of the Hostinger and Resend DPAs |

## 10. §8 ¶2 — retention, and the third marker

| | |
|---|---|
| **Current 2.1** | "We do not currently delete general enquiries automatically. We use the criteria above, and we review the enquiries we hold and delete those we no longer need. [OWNER DECISION: set retention periods for enquiries, client records and notification emails, with a deletion routine, before adopting this section.]" |
| **Proposed 2.2** | See the wording box below. It replaces ¶2 in full; ¶1 (the criteria) and ¶3 (accounting records) are kept |
| **Evidence** | Periods: owner-adopted R1–R9 and R17 (`RETENTION-SCHEDULE.md`). Supabase logs and backups: §3.2–§3.3. Resend: P-09. Hostinger mail: P-04 (search summary). Statute: §4 (UNVERIFIED at source) |
| **Status** | **NOT YET TRUE** (the routine is not operating); **OWNER CHECK** (P-04 optional, P-09, P-12); **PRIMARY RE-READ** (statute) |
| **Remaining dependency** | `RETENTION-ACTIVATION-CHECKLIST.md` Part F in full; P-09 and P-12 answers; the statutory re-read |

**Proposed §8 ¶2 wording:**

> We keep enquiries that do not lead to a project, and the internal email that tells us about them,
> until our first monthly check after 12 months from when we received them or from our last contact
> with you, and spam until our first monthly check after 30 days. If your enquiry leads to a project, we
> keep the project and contract records for six years after the end of the financial year in which the
> project ends, because of tax law and the time within which legal claims can be brought. Documents that
> prove who owns work we created, such as signed transfers and waivers, are kept for as long as those
> rights are relied on and for six years after that. Complaints are kept with the project record or, if
> there is none, for two years after they are closed. We return or delete project working files within
> 90 days after a project ends unless we agree otherwise with you, and we keep the final delivered
> version with the project record. We check monthly for records that have reached the end of their
> period and delete them.
>
> Our providers keep some records for their own periods, and deleting an enquiry does not shorten them:
> - Supabase keeps technical request logs, including IP addresses, for [P-12: the period Supabase
>   confirms, or "a period it sets"], and may keep backup copies of the database for up to seven days;
> - Resend keeps notification emails and their delivery records for [P-09: 30 days];
> - Hostinger keeps deleted email for up to 30 days and keeps website and mailbox access records for
>   [P-04: the period, or "periods it sets"].

## 11. Unchanged

| Clause | Why |
|---|---|
| §2 ¶1–¶2 (data collected) | No new evidence affects them |
| §2A (reviews) | "may show" stays accurate; Freelancer permission is a separate blocker |
| §6 (Sanity, WhatsApp, advisers, legal disclosure) | No new evidence |
| §6 (Slack) | Correctly absent: P-11 found no `SLACK_*` key anywhere checkable, and no deployed reader |
| §9 to §15 | No new evidence |

## 12. Adoption-text safety

No adopted document was edited. The five adopted drafts and `/legal/client-terms` make no claim about
provider logs, retention or locations that the R5 evidence contradicts; the scan is in
`R5-PRIVACY-EVIDENCE.md` §7a. Their `ownerAdoptedSha256` values are unchanged.
