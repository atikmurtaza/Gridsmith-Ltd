# Privacy Policy 2.1 — owner account evidence checklist

**Status:** prepared at `GS-LEGAL-001-R4` (7 October 2026); **evidence sweep at `GS-LEGAL-001-R5`** (same day). The R5
section below supersedes the per-check instructions: **only four owner checks remain**, and only one of
them needs a provider reply.
Privacy Policy 2.1 stays at `OWNER_REVIEW_REQUIRED` with its three `[OWNER DECISION]` markers (§6, §7,
§8) until these checks are answered and the retention routine operates
(`RETENTION-ACTIVATION-CHECKLIST.md`).

Source: the twelve checks in `../research/GS-LEGAL-001/R3-OWNER-DECISIONS-APPLIED.md` §5.2, expanded
so that each can be done without further explanation. What changes in the policy once they are answered
is in `../research/GS-LEGAL-001/R4-PRIVACY-2.2-CHANGE-PLAN.md`.

## R9 status (7 October 2026) — supersedes the R8 status below

- **Hostinger Terms of Service read directly** (revised 2026-09-29):
  - §1 "you"/"Customer" includes users with access;
  - §4 makes the Account-information entity "the owner of the Account and the data and Services
    contained therein".
- `HOSTINGER-PROCESSOR-CHAIN`: **residual documentation required.** No migration is needed.
- **Remaining owner item:** route A (the Account information lists Gridsmith Ltd) or route B (a
  documented processor chain)
  (`../research/GS-LEGAL-001/R9-RETENTION-HOSTINGER-REASSESSMENT.md` §3.4).

## R8 status (7 October 2026) — supersedes the R7 status below

- **Hostinger DPA re-read** (revised 2026-09-29): annexed to the Terms of Service; "Email Services"
  covered; Cloudflare is the CDN sub-processor; SCCs deemed signed on acceptance of the Terms.
- **Gridsmith's admin department manages the hosting account** (owner).
- **Remaining:** `HOSTINGER-PROCESSOR-CHAIN` element 7. The account's Hostinger customer of record is not
  Gridsmith Ltd (`../research/GS-LEGAL-001/R8-HOSTING-RETENTION-CLOSURE.md` §2.3).

## R7 status (7 October 2026) — supersedes the R6 "only remaining owner item" below

- **Hostinger's DPA** was read directly (revised 2026-09-29): SCCs Modules 2/3 and the UK Addendum
  (§9). The P-02 primary re-read is **closed**.
- No inter-company processor relationship (R7; R8 wording).
- **Remaining:** the R7 key elements (superseded and redacted; see R8 §2.3).
- P-07 (the Resend DPA primary re-read) is still not re-read here. It is non-blocking, because Privacy
  states Resend's safeguard generically.

## R6 status (7 October 2026) — supersedes the R5 status below

The owner's evidence closes E-1 to E-5 (`../research/GS-LEGAL-001/R6-PRIVACY-2.2-DRAFT.md` §2):

| Check | Result |
|---|---|
| **E-1** Hostinger | [R8: hosting-account history redacted on owner instruction. Current fact: Gridsmith's admin department manages the hosting account; the account's Hostinger customer of record is not Gridsmith Ltd (R8 record §2).] |
| **E-2** Hostinger | Website: France. Email hosting through Hostinger; product not named |
| **E-3** Resend | Free plan; 30 days; backups 7 days |
| **E-4** Supabase | Dashboard view window: the last day; Supabase decides actual retention. A support ticket is **optional** (provider-side retention only) |
| **E-5** Hostinger logs | Non-blocking; criteria wording |

**Only remaining owner item (R6):** [R8: hosting-account history redacted on owner instruction; see R8 record §2]; superseded by R8.

## R5 status (7 October 2026) — history

Evidence: `../research/GS-LEGAL-001/R5-PRIVACY-EVIDENCE.md`; clause plan:
`../research/GS-LEGAL-001/R5-PRIVACY-2.2-READINESS.md`.

| Check | Classification | Owner action now |
|---|---|---|
| P-01 Hostinger entity | OWNER_CHECK_REQUIRED | **Yes — E-1 below** |
| P-02 Hostinger DPA / UK mechanism | PARTIALLY_VERIFIED (provider, search summary) | No; a primary re-read of hostinger.com/legal/dpa remains (any unblocked environment) |
| P-03 Hostinger location / products | PARTIALLY_VERIFIED (CDN active for staging: account) | **Yes — E-2 below** |
| P-04 Hostinger retention | PARTIALLY_VERIFIED (provider, search summary) | Optional (E-5): access-log period from support; otherwise Privacy uses criteria |
| P-05 Supabase DPA / transfers | VERIFIED_PROVIDER + VERIFIED_ACCOUNT | **None** |
| P-06 Supabase backups | VERIFIED_PROVIDER (no customer backups or PITR on Free); provider-held copies PARTIALLY_VERIFIED | None separately; the question rides on E-4 |
| P-07 Resend DPA | PARTIALLY_VERIFIED (provider, search summary) | No; primary re-read remains |
| P-08 Resend domain / region | VERIFIED_IMPLEMENTATION; production domain OPERATIONAL_NOT_YET_TRUE | None now; record the region when gridsmith.uk is added at cutover |
| P-09 Resend plan / retention | PARTIALLY_VERIFIED (provider, search summary) | **Yes — E-3 below** |
| P-10 DPF | PARTIALLY_VERIFIED — EXTERNAL VERIFICATION REQUIRED | None: non-blocking, because Privacy 2.2 relies on the UK Addendum, not the DPF |
| P-11 Slack | VERIFIED_IMPLEMENTATION + VERIFIED_ACCOUNT | NON-BLOCKING HOUSEKEEPING only |
| P-12 Supabase logs | VERIFIED_ACCOUNT (client-IP header fields present; logs held ≥49 days) | **Yes — E-4 below** |

### The four owner checks that remain

**E-1 (P-01) — Hostinger contracting entity**
- **Where to go:** hPanel → **Billing** → **Invoices** → open the latest Gridsmith invoice.
- **What to report:** the legal seller or company name shown in the issuer section (for example
  "Hostinger International Ltd", "Hostinger UK Limited" or "Hostinger Global S.à r.l.").
- **What not to share:** the rest of the invoice, card details, amounts or billing address.

**E-2 (P-03) — Hostinger server location and mailbox product**
- **Where to go:**
  - hPanel → **Websites** → the site → **Dashboard** (server or data-centre location).
  - hPanel → **Emails** → gridsmith.uk (product name).
- **What to report:** two values. The server location (country or city), and whether the mailbox is
  **Hostinger Email** or **Titan**.
- **What not to share:** FTP, SSH or database credentials, mailbox passwords, DNS record values.

**E-3 (P-09) — Resend plan and oldest email**
- **Where to go:** resend.com → **Settings → Billing** (plan); then **Emails**, scrolled to the end of
  the list.
- **What to report:** the plan name, the data-retention figure if the plan card shows one, and the
  **date** of the oldest email still listed.
- **What not to share:** recipients, subjects, message bodies, API keys or DNS values.
- **Why:** Supabase's published "1 day" did not match what was observed, and is not a deletion period.
  The oldest date shows whether Resend's "30 days" is a real deletion period.

**E-4 (P-12) — Supabase log storage period** (the only one that needs a provider reply)
- **Where to go:** supabase.com/dashboard → **Support** → new ticket, for the Gridsmith Org.
- **What to send:** "Our Free-plan projects dqiutgmxillhsbzgnlsx and qfgpwumvvtizeamkynes still return
  logs from 18 August and 2 October 2026 through the logs API, although the plan lists 1-day log
  retention. How long are project logs (including edge_logs, function_edge_logs and postgres_logs),
  which carry client-IP header fields, actually stored before deletion? What does the 1-day figure
  govern? Can we request deletion of logs older than a chosen period? And do you keep backup copies of
  Free-plan databases, and for how long?"
- **What to report:** Supabase's answer, quoted.
- **What not to share:** API keys, service-role keys, connection strings, or any log content.

**E-5 (P-04, optional) — Hostinger access-log period**
- **Where to go:** a Hostinger support chat.
- **What to ask:** "How many days are website/CDN access logs and Hostinger Email access logs kept for
  my account?"
- **What to report:** the days quoted. If you skip this, Privacy describes the period by criteria.

**Non-blocking housekeeping (P-11):** confirm that no secret **name** beginning `SLACK_` exists in
Supabase `gridsmith-preview` → Edge Functions → Secrets, or in a local `.env.local` if you have one;
report names only. Optionally remove the inert `NEXT_PUBLIC_POSTHOG_*` and `NEXT_PUBLIC_GA4_ID` keys
from Vercel. No code reads them.

**Everything below this point is the R4 checklist, kept as history.** Where it asks for more than the
R5 status above, the R5 status governs.

## Rules for every check

- **Never send a password, API key, token, webhook URL, recovery code or any other secret value.** None
  of the checks needs one. Where a screen shows a secret, **redact it before taking the screenshot** or
  report the fact in words instead.
- **Report what the account or the provider says, not what a web search says.** A search result or a
  third-party article is not evidence for these checks. A provider's own written reply, a document
  downloaded from the account, or a screenshot of the account is.
- Redact anything that identifies a person other than the owner, such as names or email addresses in
  an invoice, a log or a support thread. Account IDs and project refs may stay.
- Save each piece of evidence outside this repository, in the company document store. Report back the
  answer and the file name, and the answer is then recorded in the repository.
- If a screen or reply does not answer the question, report "not shown" or "no answer". **Do not infer
  an answer.**

## Already re-verified read-only from a connected account (R4, 7 October 2026)

The Supabase connector, used read-only, confirms the following. Nothing was mutated.
- Organisation `dxqntaccfhwaneknyage` "Gridsmith Org" is on plan `free`.
- Projects `dqiutgmxillhsbzgnlsx` ("Gridsmith Project", Production) and `qfgpwumvvtizeamkynes`
  ("gridsmith-preview") are both in region `eu-west-1`.
- Production has **no Edge Functions**.
- Preview runs `gs-lead-intake` v8 and `gs-notification-worker` v6.

The connector exposes none of the following, so P-05, P-06, P-11 (the Supabase part) and P-12 remain
owner checks:
- the organisation's Documents panel;
- the backup schedule;
- Edge Function secret names;
- log-retention settings.

No Hostinger or Resend connector is attached to this session.

## Summary — which marker each check closes

| Privacy 2.1 marker or text | Checks that answer it | Also needs |
|---|---|---|
| **§6 marker** — processor terms accepted on the accounts used | P-02, P-05, P-07 | — |
| **§7 marker** — the transfer safeguard per provider | P-02, P-07, P-10 (Supabase is already known: UK Addendum in its DPA, subject to P-05) | — |
| **§8 marker** — retention periods and a deletion routine | P-04, P-06, P-09, P-12 | The retention routine **operating** (`RETENTION-ACTIVATION-CHECKLIST.md`) |
| §2 ¶3 — "technical request logs" | P-03, P-04, P-09, P-12 | — |
| §6 — the Hostinger entry | P-01, P-03 | — |
| §7 ¶2 — where Resend processes the notification | P-08 | — |
| No marker — Slack housekeeping (closes R3 O-2 item 8) | P-11 | — |

## The checks

### P-01 — Hostinger contracting entity

| Field | Value |
|---|---|
| Provider | Hostinger |
| Dashboard area | hPanel → **Billing** → open any recent invoice for the hosting or email plan |
| Fact needed | The exact legal name and address of the seller on the invoice (for example "Hostinger UK Limited" or "Hostinger International Ltd") |
| Why it matters | The party to the processing contract (UK GDPR Art. 28(3)), and whether contracting with a non-UK entity is itself a transfer that needs a safeguard. R3's search summaries (not evidence) suggested the DPA names Hostinger International Ltd (Cyprus) as data importer, while UK customers may contract with Hostinger UK Limited |
| Acceptable evidence | A screenshot or PDF of the invoice header showing the seller |
| Report | "Seller: [legal name], [country]", plus the invoice date |
| Redaction | **Yes**: redact the card digits, the billing address if it is personal, and the amount if preferred. The seller block must stay readable |
| Resolves | §6 (Hostinger entry); input to the §7 marker |

### P-02 — Hostinger DPA and transfer mechanism

| Field | Value |
|---|---|
| Provider | Hostinger |
| Dashboard area | hPanel → **Help / Support** chat or ticket (a written reply is required) |
| Fact needed | (a) Does the data processing agreement at hostinger.com/legal/dpa apply to this account? (b) For transfers outside the UK/EEA, does it include the UK International Data Transfer Addendum to the EU SCCs, or the UK IDTA? |
| Why it matters | Art. 28(3) needs a processing contract; Arts 44–46 need a named safeguard for any restricted transfer from the UK |
| Acceptable evidence | Hostinger's written reply (chat transcript or email), saved as PDF |
| Report | (a) yes / no; (b) "UK Addendum" / "IDTA" / "neither" / "no answer"; the date of the reply |
| Redaction | Redact the account email if preferred; nothing secret should appear. **Do not paste any password or login link into the chat** |
| Resolves | **§6 marker** (Hostinger limb); **§7 marker** (Hostinger limb) |

Suggested wording for the request: *"For my account [account email or ID]: (1) Does the Data Processing
Agreement at hostinger.com/legal/dpa apply to the services on this account? (2) For personal data
transferred outside the UK or EEA, does it include the UK International Data Transfer Addendum to the EU
Standard Contractual Clauses, or the UK International Data Transfer Agreement? Please reply in writing."*

### P-03 — Hostinger server location and mailbox product

| Field | Value |
|---|---|
| Provider | Hostinger |
| Dashboard area | hPanel → **Websites** → the site → **Dashboard / Server details** (data-centre location); hPanel → **Emails** → the gridsmith.uk mailbox (product name) |
| Fact needed | The data-centre country for the website; whether the mailbox is **Hostinger Email** or **Titan** (or another product); whether the CDN is enabled |
| Why it matters | Art. 13(1)(e)–(f): recipients and transfers must be described accurately. The policy currently says only "hosts our email mailbox" |
| Acceptable evidence | Screenshots of the two screens |
| Report | "Website server: [country]; CDN: on/off; Mailbox: [product]" |
| Redaction | None usually needed; redact any visible password, FTP or SSH credential |
| Resolves | §6 (Hostinger entry); §2 ¶3; §7 ¶2 (CDN) |

### P-04 — Hostinger log and mailbox-backup retention

| Field | Value |
|---|---|
| Provider | Hostinger |
| Dashboard area | Support ticket (written reply). hPanel shows only filter windows (7 days for site access logs; 30 days for email access logs), which are not retention periods |
| Fact needed | How many days Hostinger keeps (a) website access logs, (b) CDN logs, (c) email access logs, (d) mailbox backups, and (e) deleted mail |
| Why it matters | Art. 13(2)(a) (state the period or the criteria); retention rows R12, R3 and R18 |
| Acceptable evidence | Hostinger's written reply |
| Report | Days for each of (a)–(e), or "no answer" for any it does not give |
| Redaction | As P-02 |
| Resolves | **§8 marker** (provider-held periods); §2 ¶3 |

### P-05 — Supabase DPA panel and TIA

| Field | Value |
|---|---|
| Provider | Supabase |
| Dashboard area | supabase.com/dashboard → Organization **"Gridsmith Org"** → **Documents** (or Legal Documents) |
| Fact needed | (a) Whether the DPA panel says the DPA is incorporated into the terms and no separate signed DPA is needed; (b) whether a separate (PandaDoc) DPA was ever signed, and its date; (c) whether a Transfer Impact Assessment can be downloaded |
| Why it matters | Art. 28(3); Art. 46 (R3 found from Supabase's own terms that its DPA includes the UK Addendum; this confirms it applies to this organisation) |
| Acceptable evidence | Screenshot of the Documents panel; the downloaded TIA PDF (kept outside the repository) |
| Report | (a) yes / no, quoting the panel text; (b) "never signed" / "signed on [date]"; (c) downloaded yes / no |
| Redaction | None usually needed; redact any member email addresses other than the owner's |
| Resolves | **§6 marker** (Supabase limb); **§7 marker** (Supabase limb) |

### P-06 — Supabase backups on the Free plan

| Field | Value |
|---|---|
| Provider | Supabase |
| Dashboard area | Each project (`dqiutgmxillhsbzgnlsx` Production; `qfgpwumvvtizeamkynes` Preview) → **Database → Backups**; if that screen does not say, a support ticket |
| Fact needed | Whether daily backups exist on the Free plan, and for how many days they are kept |
| Why it matters | Retention row R14: a deleted lead survives in backups for that period, and Privacy §8 should say so |
| Acceptable evidence | Screenshot of the Backups screen for each project, or Supabase's written reply |
| Report | Per project: "backups: none / [n] daily, kept [n] days" |
| Redaction | None usually needed. **Do not screenshot Settings → API keys** |
| Resolves | **§8 marker** (backup limb) |

### P-07 — Resend DPA

| Field | Value |
|---|---|
| Provider | Resend |
| Dashboard area | resend.com → **Settings → Documents** (DPA download) |
| Fact needed | The DPA's date and version; the contracting entity (R3's search summaries named Plus Five Five, Inc.; not evidence); whether it includes the UK Addendum or the UK IDTA, or relies on the Data Privacy Framework and its UK Extension |
| Why it matters | Art. 28(3); Art. 46 |
| Acceptable evidence | The downloaded DPA PDF (kept outside the repository) and the clause numbers that answer the question |
| Report | "DPA dated [date]; entity [name]; transfer mechanism: [UK Addendum / IDTA / DPF + UK Extension / other], clause [x]" |
| Redaction | None usually needed |
| Resolves | **§6 marker** (Resend limb); **§7 marker** (Resend limb) |

### P-08 — Resend sending region and domain

| Field | Value |
|---|---|
| Provider | Resend |
| Dashboard area | resend.com → **Domains** → the domain used as `LEAD_NOTIFICATION_FROM` → **Region** |
| Fact needed | The sending domain (gridsmith.uk, a subdomain, or `resend.dev`) and its region (for example us-east-1 or eu-west-1) |
| Why it matters | Art. 13(1)(f): where the notification is processed. R3 found Resend stores account data, including logs, in the United States whatever the sending region (search summary, to be confirmed by P-07) |
| Acceptable evidence | Screenshot of the domain's detail page |
| Report | "Sending domain: [domain]; region: [region]" |
| Redaction | **Yes: redact DNS record values (DKIM keys) if shown**, and never open or screenshot **API Keys** |
| Resolves | §7 ¶2 |

### P-09 — Resend plan and log retention

| Field | Value |
|---|---|
| Provider | Resend |
| Dashboard area | resend.com → **Settings → Billing** (plan); **Emails** (date of the oldest email still listed) |
| Fact needed | The plan name; the log/email retention the account shows; the date of the oldest email still visible |
| Why it matters | Retention row R13; Art. 13(2)(a) |
| Acceptable evidence | Screenshot of the plan; screenshot of the bottom of the Emails list showing the oldest date |
| Report | "Plan: [name]; retention shown: [n] days; oldest email listed: [date]" |
| Redaction | **Yes: redact recipient addresses and subjects in the Emails list** (they are lead notifications to the owner and may include enquirer names) |
| Resolves | **§8 marker** (Resend limb); §2 ¶3 |

### P-10 — Data Privacy Framework listing for Resend

| Field | Value |
|---|---|
| Provider | Resend (Plus Five Five, Inc.), via the US Department of Commerce's public list |
| Dashboard area | Not an account: dataprivacyframework.gov → **Participant Search** → "Plus Five Five" |
| Fact needed | Whether the listing is **Active**, and whether it covers the **UK Extension** |
| Why it matters | Whether the UK–US data bridge can be named as Resend's safeguard |
| Acceptable evidence | Screenshot of the listing page, dated. This is the official list itself, not a search result, so it counts as evidence |
| Report | "Active: yes / no; UK Extension: yes / no; date checked" |
| Redaction | None |
| Resolves | **§7 marker** (Resend limb) |

### P-11 — Slack webhook housekeeping

| Field | Value |
|---|---|
| Provider | Slack (no Slack account is needed for this check); Supabase; GitHub; the owner's machine |
| Dashboard area | Supabase `gridsmith-preview` → **Edge Functions → Secrets** (names only); GitHub → repository → **Settings → Secrets and variables → Actions** (names only); the local `.env.local`, if any |
| Fact needed | Whether any secret **name** beginning `SLACK_` exists in any of the three |
| Why it matters | R3 established that no deployed code path reads `SLACK_LEADS_WEBHOOK` (Vercel, the Hostinger static build, both Edge Functions and the workflows). This closes the last places a stray value could sit, so that Slack can stay out of Privacy §6 |
| Acceptable evidence | Screenshot of each secrets list showing **names only**, or a statement in words |
| Report | "SLACK_* present: none / [name] in [place] (removed on [date])" |
| Redaction | **Secret values must never be revealed or sent.** Both screens show names only; do not click "reveal". For `.env.local`, report in words; do not send the file |
| Resolves | No marker. Confirms that Slack is not a recipient (§6 stays without Slack) |

### P-12 — Supabase Edge Function log retention

| Field | Value |
|---|---|
| Provider | Supabase |
| Dashboard area | Project `qfgpwumvvtizeamkynes` (and Production once H4-B is promoted) → **Logs → Edge Functions**: the earliest time selectable; or a support ticket |
| Fact needed | How long Edge Function invocation logs (which may include caller IP addresses) are kept on the Free plan |
| Why it matters | Privacy §2 ¶3 names provider logs; retention row R14 |
| Acceptable evidence | Supabase's written reply, or a Supabase document that states a retention period. A log explorer's selectable time range is a filter window, not a retention period (as for P-04), and is **not** acceptable on its own. Also report whether the API log entries carry a client IP field (plan item 3a) |
| Report | "[n] days / hours" |
| Redaction | **Yes: redact IP addresses and request bodies in any log line shown** |
| Resolves | §2 ¶3; **§8 marker** (Supabase log limb) |

## How to report back

One message listing P-01 … P-12, each with the answer and the evidence file name, in the form
`P-08 — Sending domain: [domain]; region: [region]; evidence: [file name]`. (The brackets are for the
owner to fill; no answer is assumed.)
The next legal phase records the answers, applies `R4-PRIVACY-2.2-CHANGE-PLAN.md`, and re-runs the
gates. It does not adopt Privacy 2.2 until the owner adopts it.
