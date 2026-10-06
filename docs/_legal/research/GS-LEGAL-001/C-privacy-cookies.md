# GS-LEGAL-001 — Agent C: Privacy, cookies and marketing

**Review date:** 6 October 2026. **Subject:** `docs/_legal/PRIVACY-POLICY.md` (v2.0, effective 2 Sep 2026)
and `docs/_legal/COOKIE-POLICY.md` (v2.0, effective 2 Sep 2026). The served text in
`scripts/seed-legal.mjs` matches both drafts, including the Vercel reference (`seed-legal.mjs:168`).
**Repository:** `C:\Users\atikm\.codex\worktrees\gs-host-004\Gridsmith Ltd`, HEAD `f2b7539d`. The built artifact
is `build/h4d-ci-clean-artifact-6615d97c/` (source `6615d97c`). **Staging:**
`https://mediumaquamarine-wallaby-594070.hostingersite.com`, using GET/HEAD requests only. No form was submitted.

This is a research note, not legal advice. It does not claim the documents are "compliant", "approved" or
"enforceable". Where something could not be verified, this note says so.

**Method and its limits.** Facts come from the repository, the built artifact, `curl` against staging and
a public DNS lookup (`dns.google`, MX/TXT for gridsmith.uk). No Supabase, Sanity, Resend or Hostinger API was
called. Law comes from legislation.gov.uk "latest available" XML, fetched directly on 6 Oct 2026, and from
ico.org.uk pages fetched on the same day. WebFetch was rate-limited during the run, so the primary texts were
fetched with `curl` instead. Propositions whose text was **not re-fetched in this run** are marked
**NOT RE-FETCHED**. They rest on long-standing provisions and should be checked before reliance.

---

## 1. What the site actually does (facts established)

| # | Fact | Evidence | Confidence |
|---|---|---|---|
| F1 | **One cookie, `gs_consent=1`**, first party, `Max-Age=31536000` (365 days), `Path=/`, `SameSite=Lax`, and `Secure` when the page is served over https. It is written **only when the visitor presses "Got it"**. Before that click nothing is stored. Without JavaScript the notice is hidden and nothing is stored. The cookie is read for presence only. | `lib/consent/state.ts:39-60`; `components/consent/ConsentBanner.tsx:110-135` | High |
| F2 | **No localStorage, sessionStorage or IndexedDB use** anywhere in `components/`, `lib/`, `app/` or `supabase/`. A grep for `localStorage|sessionStorage|indexedDB|document.cookie` found only the `gs_consent` read/write. The form client keeps an in-memory `Map` (`lib/leads/edge-client.ts:4`), which is not persisted. | repository grep | High |
| F3 | **The server sets no cookies.** HEAD/GET on `/`, `/contact`, `/press/contact` and `/favicon.ico` returned no `Set-Cookie`. The response headers are `platform: hostinger`, `Server: hcdn` and `x-hcdn-*`, i.e. Hostinger's CDN. | curl, 6 Oct 2026 | High for staging; production host not yet live |
| F4 | **No third-party request on page load.** The only external origins in the artifact's HTML/JS/CSS are outbound links (facebook, instagram, linkedin, x, tiktok, youtube, reddit, freelancer, wa.me), `schema.org` identifiers, and library URLs inside comments or error strings (tailwindcss.com, react.dev, nextjs.org, github.com). The CSP sets `script-src 'self' 'unsafe-inline'`, `font-src 'self'`, and `connect-src 'self' https://qfgpwumvvtizeamkynes.supabase.co`. It also allows `img-src`/`media-src https://cdn.sanity.io`, but **nothing in the artifact references cdn.sanity.io**. | artifact grep; `.htaccess` | High |
| F5 | **Fonts are self-hosted** (`font-src 'self'`). Sanity is read at build time only. | CSP; artifact | High |
| F6 | **Forms.** `/contact` takes a division (required, default `unsure`), name (required), email (required), and optional company, phone, message, budget band (engagement *shape*, not money) and timeline. A hidden `service_slug` is added when the visitor arrives from a CTA. `/press/contact` takes a segment plus segment answers (manuscript stage, genre, word count, previously published, "what have you tried", timeline; book purpose, who writes, company name, approval needed; formats, volume, turnaround, procurement; work type, current material), an optional **manuscript link** (a URL, never an upload), a required budget band, and name, email and optional company, phone and message. The memoir segment is withheld until the ETH-07 statement exists. | `components/leads/ContactForm.tsx:160-212`; `components/divisions/press/PressContactFlow.tsx:340-445`; `lib/leads/pressLead.ts`; `lib/leads/form-domain.ts` | High |
| F7 | **The schema accepts attribution fields** (`source`, `medium`, `campaign`, `referrer`, `landing_page`, `is_ai_referral`, `role`), but **neither form renders inputs for them**. Exception: `landing_page` is read by the Press mapping, and no input was found for it either. In practice these fields are null. | `lib/leads/schema.ts:62-67`; form components | Medium (no rendered input found) |
| F8 | **Transport.** With JavaScript, the browser POSTs JSON (`credentials: 'omit'`) to a Supabase Edge Function (`gs-lead-intake`). The function validates the submission, writes `public.leads` plus `gridsmith_private.notification_outbox` through `gs_intake_admit`, and wakes `gs-notification-worker`. | `lib/leads/edge-client.ts`; `supabase/functions/**`; migration `20261004184828_gs_host_h4b_private_intake.sql` | High |
| F9 | **Database region.** Storage is in **eu-west-1 (Ireland)**: Preview project `qfgpwumvvtizeamkynes` and Production project `dqiutgmxillhsbzgnlsx`. | `docs/_shared/GS-O010-R2.md:10-11` (recorded, not re-queried) | Medium-high |
| F10 | **Edge Function execution region is not pinned.** Supabase documents that Edge Functions "automatically execute in the region closest to the user making the request". The browser client sends no region header or parameter, so a submission from outside Europe is likely to be *processed in transit* outside the UK/EEA (for example us-east-1) before it is stored in Ireland. | `https://supabase.com/docs/guides/functions/regional-invocation` (fetched 6 Oct 2026); `edge-client.ts:23-26` | High (documented behaviour); provider-side detail unverified |
| F11 | **The notification email** goes through `https://api.resend.com/emails` to **one recipient**, `LEAD_NOTIFICATION_EMAIL`, which the function requires to be `contact@gridsmith.uk`. The body contains division, lead type, service slug, **name, email, company and phone**, plus the record id. **It never includes the message, budget, timeline, Press answers or manuscript link.** Mail is retried up to 5 attempts within 23 hours. | `lib/leads/edge-worker.ts:12-21`; `supabase/functions/gs-notification-worker/index.ts:5-6`; migration `gs_notification_claim` | High |
| F12 | **No email is sent to the enquirer.** There is no acknowledgement or autoresponder. | `edge-worker.ts` (single `to`) | High |
| F13 | **No IP address or user agent is stored by the application.** Neither `leads` nor the outbox has such a column. The intake reads only `Origin`, `Content-Type` and `Content-Length`. Provider-side logs are a separate question: Hostinger access logs, the Supabase API gateway and Edge logs, and Resend logs are outside the repository and their contents and retention are **unknown**. | migrations; `edge-intake.ts:19-45` | High for the app; provider logs unknown |
| F14 | **The honeypot** is the field `website` inside a `hidden` container. If it is filled, the server returns a normal-looking 202 and **stores nothing and sends nothing**. | `lib/leads/guard.ts`; `edge-intake.ts:72-73` | High |
| F15 | **Rate limiting is a single global counter row** (`intake_state`: window/day counts and limits) with **no personal data**, plus a per-isolate token bucket held in memory. The outbox stores `request_id` (a random UUID made by the browser), **`request_digest` = SHA-256 of the form type and the lead JSON** (a pseudonymous fingerprint of personal data), state, attempts, timestamps and failure category. Outbox rows cascade-delete with their lead. | migration `…h4b_private_intake.sql:5-38, 57` | High |
| F16 | **No retention or deletion mechanism exists** for `leads`, the outbox, or the notification emails in the mailbox. `press_path_results.expires_at` defaults to 90 days, but no purge job exists and the table has no writer in the static build. `events` and `sample_grants` have no writer either. | migrations; repository grep | High |
| F17 | **Personal data already held:** Production holds **63 leads**, the latest created 11 Sep 2026, per `GS-PROD-003.md:79`. Their provenance and the notice shown at collection are not established here. | docs (not re-queried) | Medium |
| F18 | **Staging intake currently accepts only synthetic identities.** Names must start with `GS-HOST-H4-B ` and emails must end `@gridsmith.invalid`; anything else gets 409. So real staging submissions are rejected today. | `supabase/functions/gs-lead-intake/index.ts:12-15` | High |
| F19 | **Email hosting.** gridsmith.uk MX is `mx1/mx2.hostinger.com` and SPF is `include:_spf.mail.hostinger.com`, so the `contact@gridsmith.uk` mailbox is hosted by Hostinger. Resend is **not** yet in SPF, so the production sender domain is not yet configured for Resend. | public DNS via dns.google, 6 Oct 2026 | High |
| F20 | **Direct contact routes.** `/contact` offers email, **WhatsApp** (`https://wa.me/447405448534`, no prefilled text) and **SMS** (`sms:`). These channels route the person's data through Meta/WhatsApp or their mobile carrier, not through the site. | `app/(marketing)/contact/page.tsx:93-118`; `lib/company/companyDetails.ts:46-56` | High |
| F21 | **Freelancer reviews.** 11 entries contain review text and a rating, with **no reviewer name and no country**, labelled "Verified Freelancer review" and linked to `https://www.freelancer.com/u/GridsmithLTD`, where the original reviews (with reviewer usernames) are public. Display is gated to the staging origin. | `lib/reviews/staging-approved.ts`; `lib/reviews/public-model.ts` | High |
| F22 | **Privacy link at the point of collection.** `/press/contact` links to `/legal/privacy` beside the identity fields. **`/contact` has no privacy link in the form**; only the footer has one. | `PressContactFlow.tsx:446-449`; `ContactForm.tsx` | High |
| F23 | **Legal pages return 404 on staging.** `/legal/privacy` and `/legal/cookies` give 404 because legal content was not migrated (`GS-O003`). | curl, 6 Oct 2026 | High |
| F24 | **No marketing pipeline exists.** No newsletter form, no list and no marketing sender. The `lead_type` enum includes `newsletter`, but `gs_intake_admit` rejects anything other than `enquiry`. | `0001_core.sql:22`; `…h4b_private_intake.sql:51` | High |
| F25 | **The `/contact` confirmation says "reply to the acknowledgement"**, but no acknowledgement is sent (F12). This is a factual inaccuracy in UI copy, not in the policies. | `ContactForm.tsx:121-124` | High |

---

## 2. (a) Factual-parity table

Key: **MATCH** = the statement is supported by the implementation. **MISMATCH** = the implementation contradicts it.
**UNSUPPORTED** = nothing in the repository or the observed system shows it; it may be true offline (owner). **MISSING** = a fact
the reader is owed that the policy does not state.

### 2.1 Privacy Policy v2.0

| Clause | Statement (abridged) | Implementation | Verdict |
|---|---|---|---|
| Header | Version 2.0, effective 2 Sep 2026 | Predates the hosting move to Hostinger, s.164A (19.6.2026, already before), and the regulator rename (30.9.2026) | **MISMATCH (stale)**: needs a new version |
| Header | "Trading divisions: Gridsmith Design…" | Owner rule: legal text = trading division | MATCH |
| Opening | Gridsmith Ltd is the controller | Sole operator of the forms and DB | MATCH |
| §1 | Covers visiting, contacting, quotations, clients, projects, complaints | Also: WhatsApp/SMS contact (F20) and reviews displayed (F21) | MATCH, but **MISSING** the reviews and WhatsApp/SMS channels |
| §2 | name; email | Required on both forms | MATCH |
| §2 | telephone where provided; company | Optional fields | MATCH |
| §2 | division or service of interest | `division` radio, hidden `service_slug`, Press `segment` | MATCH |
| §2 | enquiry, project requirements, budget and timeline | `message`, `budget_band`, `timeline` | MATCH |
| §2 | (not stated) the Press answers (genre, word count, manuscript stage, publishing history, what was tried, book purpose, etc.) and a **manuscript link** | Stored in `leads.payload` | **MISSING**: the category is arguably within "project requirements", but the manuscript link (which may give access to a full manuscript) should be named |
| §2 | correspondence and project communications; quotation/contract/invoice/payment records; project materials | No site mechanism; offline business processes | UNSUPPORTED by the site; plausible. **OWNER CONFIRMATION REQUIRED** (D9) |
| §2 | dates and records associated with enquiries | `created_at`, `notified_at`, outbox timestamps | MATCH |
| §2 | (not stated) technical submission records: request id and a SHA-256 fingerprint of the submission, held to prevent duplicate submissions | outbox (F15) | **MISSING** (minor; covered by an accurate general sentence) |
| §2 | technical request information processed by "our hosting provider" | Hostinger/hCDN logs exist at the provider; content and retention unknown. The application stores no IP or user agent (F13). | MATCH in substance; provider **MISSING** by name; retention **OWNER CONFIRMATION REQUIRED** (D1) |
| §2 | Do not intentionally ask for special-category data through "our general contact form" | Neither form asks for it. Free text, the Press "what have you tried" field and manuscript links can contain it, and the memoir segment (when enabled) is likely to. | MATCH as worded; **MISSING** a request not to send it, and coverage of the Press form |
| §3 | Purposes | Consistent with the forms and business | MATCH |
| §4 | Contract / steps before contract | Quote requests (Art 6(1)(b)) | MATCH |
| §4 | Legal obligation for accounting/tax | Offline | UNSUPPORTED by site; normal |
| §4 | Legitimate interests listed | Enquiry handling (business enquiries), security | MATCH |
| §4 | Consent for "certain direct marketing" | **No marketing exists** (F24) | UNSUPPORTED (accurate as conditional). **OWNER CONFIRMATION REQUIRED** (D7) |
| §4 | Consequence of not providing information | Name and email are required to submit | MATCH (Art 13(2)(e)) |
| §5 | No GA, PostHog, pixels, heatmaps, session recording | None in the artifact; CSP `script-src 'self'` (F4) | MATCH |
| §6 | **Vercel** for hosting and server execution | **Retired.** Hosting is Hostinger (hCDN, F3); server execution is Supabase Edge Functions (F8) | **MISMATCH** |
| §6 | (not stated) **Hostinger**: website hosting/CDN and the `contact@gridsmith.uk` mailbox | F3, F19 | **MISSING** |
| §6 | Supabase "for database services" | Database **and** Edge Functions (intake and notification worker) | MATCH, incomplete; add server functions |
| §6 | Resend for transactional email notifications | Internal notification only, to `contact@gridsmith.uk`; carries name, email, company, phone and division but not the message (F11) | MATCH. The policy should say what is sent and that it goes only to Gridsmith |
| §6 | **Sanity** for website content management | Build-time CMS. **No visitor or enquiry data reaches Sanity** (F5) | **MISMATCH as a recipient of visitor data**; keep only if described as holding site content (and any business personal data in that content) |
| §6 | Professional advisers | Offline | UNSUPPORTED by site; normal |
| §6 | (not stated) WhatsApp/Meta and mobile carriers when someone uses those routes | F20 | **MISSING** |
| §6 | Providers process only what is needed and are bound by contractual obligations | DPAs are not evidenced in the repository | **UNSUPPORTED**. **OWNER CONFIRMATION REQUIRED** (D3) |
| §6 | Do not sell personal data | No such flow | MATCH |
| §7 | "Some providers may process data outside the UK"; relies on whatever mechanism applies | Storage in Ireland (EEA); Edge Function execution near the visitor and possibly outside the UK/EEA (F10); Resend is US-headquartered, so its sending region and mechanism are unknown | **MISSING**: Art 13(1)(f) requires the fact of the transfer and the safeguard relied on, not a generic statement |
| §8 | Retention by criteria; "no automated deletion schedule for general enquiries" | No deletion mechanism (F16) | MATCH (honest). A concrete period is still **OWNER CONFIRMATION REQUIRED** (D2) |
| §9 | Reasonable technical and organisational measures | RLS on all tables, private schema, service-role-only RPCs, CSP, HSTS, honeypot, no IP storage | MATCH |
| §10 | Rights list | — | MATCH. **MISSING**: the absolute right to object to direct marketing, the response time, and the regulator's current name |
| §10 | Complaint to "the UK Information Commissioner's Office" | Office abolished 30 Sep 2026; the regulator is now the **Information Commission** (L9) | **MISMATCH (law changed)** |
| §11 | An enquiry does not subscribe you to marketing | No list or marketing (F24) | MATCH |
| §11 | Marketing emails identify the sender and allow opt-out | No marketing is sent | UNSUPPORTED (conditional; acceptable) |
| §12 | Points to the Cookie Policy | — | MATCH |
| §13 | Complaint by email, subject "Data Protection Complaint"; acknowledge within 30 days; investigate; outcome without undue delay | Owner process (not systematised) | MATCH to s.164A(3)-(4). **MISSING** "keep you informed of progress" (s.164A(5)(b)) and a non-email route (post) |
| §13 | Complain to the regulator "whether or not you first complain to us" | Legally accurate (s.165 has no exhaustion rule). The regulator generally expects people to raise it with the organisation first. | MATCH, with a nuance |
| §14–15 | Changes; contact with registered office | — | MATCH |
| Publication | Notice available when data is collected | **`/legal/privacy` is 404 on staging** (F23). `/contact` has no in-form link (F22). | **MISMATCH at launch** if forms go live before the notice. Launch blocker. |

### 2.2 Cookie Policy v2.0

| Clause | Statement | Implementation | Verdict |
|---|---|---|---|
| Header | Version 2.0, effective 2 Sep 2026 | — | MATCH (needs a version bump only with the changes in §4.2) |
| §1 | No analytics, advertising, retargeting, heatmap or session-recording cookies or scripts | F4 | MATCH |
| §1 | Only "limited first-party storage needed for the operation or presentation of the website" | One cookie; no web storage (F1, F2) | MATCH |
| §2 | `gs_consent`: records the notice "has been seen **or** dismissed" | Written **only on "Got it"**. Seeing the notice alone stores nothing (F1). | **MISMATCH (minor wording)**: say "when you select *Got it*" |
| §2 | Up to 365 days | `Max-Age=31536000` | MATCH |
| §2 | Provider Gridsmith Ltd | First party | MATCH |
| §2 | No marketing profile, analytics or advertising identifier | Value is `1` | MATCH |
| §2 | (not stated) the exemption relied on; `SameSite=Lax`/`Secure`; not set without JavaScript | F1 | **MISSING** (good practice; the exemption should be named) |
| §3 | No analytics consent; the notice is informational | Banner: "This site sets one cookie… nothing to opt out of" | MATCH |
| §4 | Browser controls; the notice reappears if the cookie is removed | `noticeSeen()` checks presence | MATCH. **MISSING**: the footer "Cookie notice" control reopens it |
| §5 | Future analytics: review PECR and UK GDPR; consent or simple objection under a statutory exception | Consistent with PECR Sch A1 paras 2, 5 and 6 (L1–L3) | MATCH |
| §6 | "The website's actual behaviour should match this policy" | — | MATCH (aspirational; consider "is intended to") |
| §7 | Contact | — | MATCH |
| — | (not stated) The server/CDN sets no cookies; outbound links set cookies only once you visit those sites | F3, F4 | **MISSING** (helpful) |
| — | Hostinger CDN security features (bot protection or challenge pages) could set cookies on the production host | Not observed on staging | **OWNER CONFIRMATION REQUIRED** (D5): re-test the production host at cutover |

---

## 3. Current law: proposition register (all sources retrieved 6 Oct 2026)

| ID | Topic | Authority / exact provision | Source URL | Type | Conclusion | Conf. | Owner decision? |
|---|---|---|---|---|---|---|---|
| L1 | Storage and access rule | PECR reg 6(1) as **substituted by DUAA 2025 s.112(2)**, in force **5 Feb 2026** (SI 2026/82 reg 2(w)). The prohibition is "Subject to Schedule A1". | https://www.legislation.gov.uk/uksi/2003/2426/regulation/6 | Primary | The old reg 6(4) wording is replaced. The exemption reference is now Sch A1, not reg 6(4). | High | No |
| L2 | Strictly necessary exemption | PECR **Sch A1 para 4(1)** applies where storage is "strictly necessary for the provision of an information society service requested". **Para 4(2)(e)(ii)** covers "maintaining a record of selections made on a website". | https://www.legislation.gov.uk/uksi/2003/2426/schedule/A1 | Primary | `gs_consent` records the visitor's own selection on the notice and has no other use, so it **falls within para 4** on the better view. It is not consent-dependent. | Medium-high | No |
| L3 | Appearance exception (fallback) | **Sch A1 para 6** covers storage whose sole purpose is to adapt appearance/function to the user's preference, provided there is clear and comprehensive information and a simple, free means of objecting | same | Primary | If para 4 were doubted, para 6 would cover suppressing the notice. The Cookie Policy's information plus browser deletion probably meets it. Naming para 4 as the primary basis is the cleaner position. | Medium | No |
| L4 | Statistical-purposes exception | **Sch A1 para 5** requires the data not to be shared except to assist improvements, plus clear information and a simple free objection | same | Primary | Not engaged today. Cookie Policy §5 already anticipates it correctly. | High | Only if analytics returns |
| L5 | ICO cookie guidance | ICO, *Guidance on the use of storage and access technologies* — **finalised 29 Apr 2026**. "Strictly necessary" section: cookies "used as part of a cookie consent mechanism… can be exempt", including persistent ones, if "sufficient information in a prominent location" is given and they are used **solely** for that purpose. Example period: 90 days. "Managing consent" section: decide whether a default duration is appropriate and document the decision. | https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-the-use-of-storage-and-access-technologies/what-are-the-exceptions/ ; …/how-do-we-manage-consent-in-practice/ | Official guidance | Supports the exemption for `gs_consent`. 365 days is not prohibited, but the ICO expects a **documented justification** for the period. | High | **Yes, minor** (D6: keep 365 days with a recorded reason, or shorten) |
| L6 | PECR penalties | PECR **Sch 1 para 18** modifies DPA 2018 **s.157** so that breaches of regs **6** and **22** (among others) carry the **higher maximum** (s.157(2)(a)). Inserted by DUAA s.115 / Sch 13, in force 5 Feb 2026. | https://www.legislation.gov.uk/uksi/2003/2426/schedule/1 | Primary | Confirms the CLAUDE.md non-negotiable #7 figure basis. The cash amount in s.157 was **NOT RE-FETCHED**. | High (structure) | No |
| L7 | Email marketing | PECR **reg 22(1)–(3)**. It applies to "individual subscribers"; it requires consent or the **soft opt-in** (details obtained "in the course of the sale or negotiations for the sale", similar products/services, simple free refusal at collection and in every message). Reg 22(3A) is for charities only. | https://www.legislation.gov.uk/uksi/2003/2426/regulation/22 | Primary | Gridsmith sends no marketing (F24). An enquiry that becomes a quote can amount to "negotiations", so the soft opt-in *could* later be available, but only if a refusal option is offered **at collection**. Today's forms offer none, so **soft opt-in is not available for existing enquiries**. Reg 23 (sender identity) was **NOT RE-FETCHED**. | High | **Yes** (D7) |
| L8 | Information to provide | UK GDPR **Art 13(1)–(2)** as amended. (1)(f) now refers to Art 45A regulations and Art 46/47 safeguards. **(2)(ca) the right to complain to the controller under DPA s.164A** was inserted **19 Jun 2026**. (2)(d) now names complaint "to the Commission" under s.165 (30 Sep 2026). (2)(f) refers to ADM under Art 22C. | https://www.legislation.gov.uk/eur/2016/679/article/13 | Primary | The notice must cover identity/contact, purposes and legal basis, legitimate interests, recipients, the **transfer facts and safeguard**, retention or criteria, rights, the **two complaint rights**, whether provision is required, and ADM (none). Gaps today: transfers (specific), regulator name, recipients accuracy. | High | No |
| L9 | Regulator | DUAA **s.117** (Information Commission; mostly in force 20 Aug 2025, SI 2025/904), **s.118** (abolition of the Information Commissioner) and **s.119** (transfer of functions) in force **30 Sep 2026** (SI 2026/1015, made 10 Sep 2026) | https://www.legislation.gov.uk/ukpga/2025/18/section/118 ; https://www.legislation.gov.uk/uksi/2026/1015/made | Primary | "UK Information Commissioner's Office" is now an outdated name. The ico.org.uk home page still uses the "ICO" branding (observed 6 Oct 2026). Use "the Information Commission (ico.org.uk)". | High (law); medium (brand) | No |
| L10 | Controller complaints | DPA 2018 **s.164A** (in force 19 Jun 2026; SI 2026/82 reg 3(a)): facilitate complaints, e.g. a form "which can be completed electronically and by other means"; acknowledge within 30 days; without undue delay take appropriate steps (including enquiries and **informing the complainant about progress**) and give the outcome. | https://www.legislation.gov.uk/ukpga/2018/12/section/164A | Primary | §13 is close. Add progress updates and a non-electronic route. | High | No |
| L11 | ICO complaints guidance | ICO, *How to deal with data protection complaints* (published 12 Feb 2026, updated 8 May 2026): an email address alone can be enough; tell people at collection (privacy notice) that they may complain to you and to the regulator | https://ico.org.uk/for-organisations/how-to-deal-with-data-protection-complaints/how-do-we-prepare-to-handle-data-protection-complaints/ | Official guidance | The email route is acceptable. Adding the postal address is cheap and matches "and by other means". | High | No |
| L12 | Lawful bases | UK GDPR **Art 6(1)(ea)** "recognised legitimate interest" (in force 5 Feb 2026). Art 6(1)(b) and (f) are unchanged. | https://www.legislation.gov.uk/eur/2016/679/article/6 | Primary | Not needed for enquiry handling. The current Art 6(1)(b)/(f) analysis stands. | High | No |
| L13 | Access requests | **Art 15(1A)** (a reasonable and proportionate search; inserted with retrospective effect to 1 Jan 2024). **Art 12(3)** now refers to "the applicable time period (see Article 12A)". | https://www.legislation.gov.uk/eur/2016/679/article/15 ; …/article/12 | Primary | Optional: state "we aim to respond within one month". **Art 12A text NOT RE-FETCHED**; the one-month baseline is from the pre-DUAA Art 12(3) and should be checked. | Medium | No |
| L14 | International transfers | **Art 45A/45B** (in force 5 Feb 2026). **DPA 2018 Sch 21 para 5(1)(a)** specifies EEA states as adequate. **SI 2023/1028 reg 3** (the UK–US data bridge) covers transfers to US organisations on the DPF list participating in the **UK Extension**. legislation.gov.uk shows it with no revocation annotation observed. | https://www.legislation.gov.uk/ukpga/2018/12/schedule/21/paragraph/5 ; https://www.legislation.gov.uk/uksi/2023/1028/regulation/3 | Primary | Storage in **Ireland is covered** by EEA adequacy. **Edge execution outside the UK/EEA (F10) and Resend (US)** each need either (a) the recipient on the DPF UK Extension list or (b) Art 46 safeguards (IDTA or the UK Addendum to the EU SCCs). Which applies is a **provider fact not verified here**. | High (law); unknown (facts) | **Yes** (D4) |
| L15 | Processors | UK GDPR Art 28(3) requires a written contract with processor terms. **NOT RE-FETCHED** (unchanged in substance by DUAA as far as reviewed). | https://www.legislation.gov.uk/eur/2016/679/article/28 | Primary | Hostinger, Supabase and Resend are processors. Their standard DPAs must be accepted or in force. Not evidenced in the repository. | Medium | **Yes** (D3) |
| L16 | Records / breach | Art 30 (records; the Art 30(5) under-250 carve-out does not apply to processing that is not occasional, and enquiry handling is regular); Art 33 (notify the regulator within 72 hours unless unlikely to result in risk); Art 34 (inform individuals if high risk). **NOT RE-FETCHED.** | https://www.legislation.gov.uk/eur/2016/679/article/30 ; …/33 ; …/34 | Primary | Internal obligations. The privacy notice need not detail them. Gridsmith should keep a short Art 30 record and a breach log. | Medium | **Yes** (D10) |
| L17 | Indirect collection (reviews) | Art 14 (information where data is not obtained from the data subject); Art 14(5)(b) (disproportionate effort). **NOT RE-FETCHED** in this run. Art 13(5)–(7)'s new disproportionate-effort wording was observed for Art 13 only. | https://www.legislation.gov.uk/eur/2016/679/article/14 | Primary | Anonymised review text plus a rating, linked to a public profile where the reviewer is named, is **probably personal data of the reviewer (indirectly identifiable)**, though low-risk. A short notice section plus a removal route is the proportionate response. | Medium | **Yes** (with the Freelancer permission blocker) |
| L18 | Direct-marketing objection | Art 21(2)–(4): absolute right to object to direct marketing, "explicitly brought to the attention… clearly and separately". **NOT RE-FETCHED.** | https://www.legislation.gov.uk/eur/2016/679/article/21 | Primary | Add a separate sentence. Low stakes while there is no marketing. | Medium | No |
| L19 | ADM | Arts 22A–22D (in force 5 Feb 2026; Art 13(2)(f) now refers to 22C) | Art 13 annotation (above) | Primary | Gridsmith makes no solely automated significant decisions. An optional one-line statement is good practice, not required. | High | No |
| L20 | Data protection fee | Data Protection (Charges and Information) Regulations 2018. **NOT RE-FETCHED.** | https://www.legislation.gov.uk/uksi/2018/480 | Primary | A controller processing personal data electronically normally owes the fee unless exempt. Registration status is unknown. | Medium | **Yes** (D11) |

---

## 4. (b) Clause-by-clause legal assessment

### 4.1 Privacy Policy

- **Header / version.** Must change: the hosting, regulator and processor facts have moved since 2 Sep 2026. Issue as v2.1 with a new effective date. *Conf. high.*
- **Controller identity (Opening, §15).** Meets Art 13(1)(a). No DPO is required or claimed (Art 13(1)(b) "where applicable"). *High.*
- **§1 Scope.** Adequate. Add the WhatsApp/SMS channels and reviews shown on the site so that the Art 14 point (L17) has a home. *Medium.*
- **§2 Data collected.** Accurate. It should name the Press answers and the **manuscript link**, and the technical submission record (F15). The special-category sentence should also ask people not to send health or similar details unless needed, because free text and manuscript links can carry it. Art 9 data received unsolicited still needs a condition if it is kept. *Medium.*
- **§3–4 Purposes and bases.** Lawful in substance (Art 6(1)(b) and (f)). Art 13(1)(c) needs purposes **and** the legal basis for each. A short purpose→basis table is the clearest way to meet it, and ICO practice expects it. The "consent… certain direct marketing" line is acceptable as a conditional. Under PECR reg 22, if marketing ever starts, consent or a valid soft opt-in captured *at collection* is required, and the current forms capture neither. *High.*
- **§5 Analytics.** Accurate (F4). *High.*
- **§6 Recipients.** **Fails Art 13(1)(e) accuracy**: it names Vercel (retired), omits Hostinger (host, CDN and mailbox) and Supabase Edge Functions, and lists Sanity as if it received visitor data. The sentence "providers… are subject to their own contractual and data-protection obligations" is unsupported until the DPAs are confirmed (L15). *High.*
- **§7 International.** **Below Art 13(1)(f)**: it states no fact and no safeguard. Required: say storage is in Ireland (EEA, adequacy); say that request processing and email delivery may occur outside the UK/EEA (F10, F11); and name the safeguard (DPF UK Extension or IDTA/Addendum), plus how to get a copy. The "may process" hedge is not a substitute where the transfer is known to be possible. *High (law); facts owner-dependent.*
- **§8 Retention.** Art 13(2)(a) allows criteria "if that is not possible" to give a period. A period *is* possible for enquiries, so ICO practice and the storage-limitation principle (Art 5(1)(e), **NOT RE-FETCHED**) favour a stated period. **Any stated period must be implemented**: a manual review or a scheduled deletion of `leads` (cascading the outbox) and of notification emails in the mailbox. Today nothing deletes (F16), and 63 production rows already exist (F17). *High.*
- **§9 Security.** Adequate and not overstated. Optionally add that a notifiable breach will be reported to the Information Commission and, where required, to the people affected. *Medium.*
- **§10 Rights.** The list is complete for Arts 15–21, but three changes are needed. Rename the regulator (L9). Add the absolute right to object to direct marketing as a separate sentence (L18). Add the response-time expectation (L13, UNVERIFIED detail). *High.*
- **§11 Marketing.** Accurate. Keep it conditional. Do not claim soft opt-in capability (L7). *High.*
- **§12 Cookies.** Fine. *High.*
- **§13 Complaints.** Meets s.164A(3)–(4) in substance. Add progress updates (s.164A(5)(b)) and a postal route ("other means", s.164A(2)). This also satisfies Art 13(2)(ca). The 30-day acknowledgement is a statutory ceiling, so do not promise faster. Non-negotiable #5 concerns enquiry response time, not this. *High.*
- **§14–15.** Fine.
- **Point-of-collection delivery.** Art 13 requires the information "at the time when personal data are obtained". `/contact` lacks an in-form link (F22) and the notice is currently 404 on staging (F23). **Forms must not accept real submissions until `/legal/privacy` is live**, and `/contact` should carry the same link as Press. *High.*

### 4.2 Cookie Policy

- **§1–3.** Accurate. `gs_consent` is exempt under **Sch A1 para 4(2)(e)(ii)** (L2). The ICO's finalised 2026 guidance accepts persistent consent-mechanism cookies as exempt if prominent information is given and the cookie has no other use (L5). The banner names the cookie, and the code reads it for presence only, so both conditions are met. *Medium-high.*
- **"seen or dismissed"** should be "dismissed (when you select *Got it*)" (F1). *High.*
- **Duration.** 365 days is lawful in principle, but L5 expects the period to be considered and documented. Option A: keep 365 days and record the reason (the notice carries no choice that could become stale, so re-showing it yearly serves the visitor). Option B: shorten to 6 months. **Conservative recommendation: A, with the reason recorded in the policy file history.** *Medium.*
- **§4.** Add the footer "Cookie notice" control. *High.*
- **§5.** Correct against the new Sch A1 paras 2, 5 and 6. *High.*
- **Add** that the server sets no cookies and that outbound links do not set cookies until the visitor goes to those sites. Re-verify on the production host (D5). *High.*

### 4.3 Marketing (PECR reg 22)

Gridsmith sends no electronic marketing (F24). No change is required beyond keeping §11 conditional. If the owner wants to email past enquirers about new services, the forms must first offer a refusal at collection (soft opt-in) or an unticked opt-in. **OWNER CONFIRMATION REQUIRED (D7).**

---

## 5. (c) Required changes with proposed wording

The wording below is original drafting for owner adoption. `[TK: …]` marks a fact the owner must supply. Do not
publish with any `[TK]` present.

### 5.1 Privacy Policy, v2.1

**Header**: "Version 2.1 · Effective date: [TK: date of publication]".

**§1, add bullets:** "- message us by WhatsApp or text; or" / "- read client reviews shown on our website (see section 2A)."

**§2, replace the enquiry bullet and add a technical bullet:**
> - the details you give in an enquiry, such as your project requirements, rough budget and timeline and, for
>   publishing enquiries, answers about your book or content (for example its stage, length, genre and purpose)
>   and any link you choose to share to a manuscript or other material;
> - technical records of each form submission, such as when it was made, a random reference and a coded
>   fingerprint of the submission that we use to recognise and ignore accidental duplicate submissions;

**§2, replace the special-category sentence:**
> We do not ask for sensitive information such as health, religious or political details. Please do not include
> it in an enquiry or in material you link to unless it is needed for the work you are asking about. If you do,
> we will use it only for that purpose.

**§2A (new). Reviews shown on our website:**
> Our website may show reviews that clients left for us on Freelancer.com. We show the review text and rating
> only, without the reviewer's name or other details, and link to our Freelancer profile, where the original
> review appears. We do this in our legitimate interest in showing prospective clients genuine feedback. If you
> wrote one of these reviews and would like it removed from our website, email contact@gridsmith.uk and we will
> remove it.

(Production display remains subject to the separate Freelancer permission blocker. This section is only needed
if reviews are shown.)

**§4: add a purpose → basis table:**

| What we do | Lawful basis |
|---|---|
| Reply to an enquiry and prepare a quotation | Steps you ask us to take before a contract; for enquiries made on behalf of a business, our legitimate interest in responding to business enquiries |
| Deliver and manage a project | Performing our contract with you |
| Keep accounting, tax and contract records | Legal obligation; legitimate interests (defending legal claims) |
| Keep the website and forms secure and filter spam | Legitimate interests (protecting our systems and visitors) |
| Handle complaints and rights requests | Legal obligation |
| Direct marketing (we do not currently send any) | Consent, or a lawful exception if it applies to that message |

**§6: replace the provider list:**
> - **Hostinger** — hosts the website and its content delivery network, and hosts our email mailbox
>   (contact@gridsmith.uk). Like any web host, it processes technical information about each request to
>   the website, such as your IP address and browser details.
> - **Supabase** — runs the server functions that receive our enquiry forms and stores enquiries in a
>   database located in Ireland.
> - **Resend** — sends us an internal email when an enquiry arrives. That email contains your name, email
>   address, company and phone number (if given) and the studio you chose. It does not contain your message or
>   other answers, and it is sent only to us.
> - professional advisers, such as accountants, where necessary.
>
> Our website content is managed in **Sanity**, but your enquiries are not sent to Sanity.
>
> If you contact us by **WhatsApp** or text message, your message is carried by WhatsApp (Meta) or your mobile
> network under their own terms, as well as reaching us.

Replace the sentence "These providers process only… obligations" with:
> We use these providers under written terms that require them to protect personal data and to use it only to
> provide their service to us. [TK: confirm DPAs accepted — D3]

**§7: replace in full:**
> Enquiries submitted through our forms are stored in Ireland, which the UK recognises as providing adequate
> protection. Because the servers that receive a form submission run close to the person sending it, a
> submission made from outside the UK or Europe may be processed briefly in that region before it is stored.
> Our email-notification provider may also process the notification outside the UK. [TK: name the region(s)]
> Where data is transferred outside the UK, we rely on [TK: "UK adequacy regulations, including the UK–US data
> bridge for providers certified to it" / "the UK International Data Transfer Agreement or Addendum included in
> the provider's terms"]. You can ask us for details of these safeguards at contact@gridsmith.uk.

*(Alternative if the owner pins the Edge Function region to eu-west-2 London or eu-west-1 Ireland. That is an
engineering change; see §7 item E1. The second sentence can then be deleted.)*

**§8: replace the "do not currently operate" paragraph** (once the owner chooses periods, D2):
> Enquiries that do not lead to a project are deleted [TK: e.g. 12 months] after our last contact with you.
> Records of client projects, contracts and invoices are kept for [TK: e.g. six years after the end of the
> financial year in which the project ended], which reflects accounting requirements and the time in which legal
> claims can be brought. Internal email notifications about enquiries are deleted on the same timetable as the
> enquiry.

(Only publish this once a deletion routine actually exists. Until then, keep the honest v2.0 wording.)

**§10: replace the last two paragraphs:**
> To exercise a right, email contact@gridsmith.uk or write to us at the address in section 15. We may ask for
> information to confirm your identity. We will respond without undue delay and within the time the law
> allows, normally one month. [verify Art 12A — L13]
>
> **You can object at any time to the use of your personal data for direct marketing, and we will stop.**
>
> We do not make decisions about you based solely on automated processing.
>
> You can also complain to the **Information Commission**, the UK data protection regulator
> (ico.org.uk).

**§13: replace the numbered list and the last line:**
> You can complain to us about how we handle your personal data by email to contact@gridsmith.uk (subject
> "Data Protection Complaint") or by post to the address in section 15. We will:
> 1. acknowledge your complaint within 30 days of receiving it;
> 2. look into it and keep you informed of our progress; and
> 3. tell you the outcome without undue delay.
>
> You also have the right to complain to the Information Commission (ico.org.uk). The regulator usually
> expects people to raise a concern with the organisation first, but you do not have to.

### 5.2 Cookie Policy, v2.1

**§2 table, Purpose cell:**
> Records that you have dismissed the cookie notice (by selecting *Got it*), so that it does not keep
> reappearing. It holds the value `1` and nothing else.

**§2, add after the table:**
> This cookie is strictly necessary to remember the choice you made on our website, so it does not need your
> consent (Privacy and Electronic Communications Regulations 2003, Schedule A1, paragraph 4). It is set only
> when you select *Got it*, only on gridsmith.uk, and is not used for any other purpose. Our web server does not
> set any cookies, and we do not use local storage or similar technologies in your browser.

**§4, add:**
> You can show the notice again at any time using the "Cookie notice" link in the footer.

**New §4A. Links to other websites:**
> Our pages link to social media and other websites, such as LinkedIn, Instagram and Freelancer.com. Those
> websites do not set cookies through our pages. They may set their own cookies if you follow a link and visit
> them, under their own policies.

**Header:** Version 2.1 with a new effective date.

---

## 6. (d) Open facts — OWNER CONFIRMATION REQUIRED

| ID | Question | Why it matters | Options / conservative recommendation |
|---|---|---|---|
| D1 | **Hostinger:** account data-centre location for the website and the mailbox; access-log contents and retention; hCDN log retention | Art 13(1)(e)/(f); §2 "technical request information" | Get these from hPanel or Hostinger's DPA. Until then, describe the logs generically (as drafted) and state no period. |
| D2 | **Retention periods** for (a) non-converted enquiries, (b) client records, (c) notification emails in the mailbox, (d) the **63 existing Production leads** (F17; provenance and the notice shown at the time?) | Art 5(1)(e); Art 13(2)(a); §8 | Conservative: 12 months for (a) with a quarterly manual purge of `leads` (which cascades the outbox) and the mailbox; about 6 years for (b), subject to the tax/accounting workstream. Review the 63 rows now and delete any that are stale or test data. |
| D3 | Are the **Hostinger, Supabase and Resend DPAs** accepted or in force on the accounts used? | Art 28; §6 "written terms" sentence | Accept the providers' standard DPAs before go-live and keep copies. |
| D4 | **Transfer mechanism and regions:** the Resend sending region and whether Resend Inc. is on the DPF UK Extension list; the Supabase Edge execution region (F10) and its transfer terms | Art 13(1)(f); Arts 44–49 | Conservative: pin the Edge Functions to a UK/EEA region (E1) and choose a Resend EU sending region if available. Name the IDTA/Addendum or DPF basis in §7. |
| D5 | **Production host cookie re-test** (Hostinger security, bot protection or CDN features) | Cookie Policy accuracy | Run `curl -I` plus a browser check on gridsmith.uk at cutover and amend if any provider cookie appears. |
| D6 | `gs_consent` **duration** | ICO L5: document the default | Keep 365 days with a recorded reason, or shorten to 6 months. |
| D7 | Is **any marketing email** sent or planned (newsletters, "new service" emails to past enquirers or clients)? | PECR reg 22; §11 | If yes: add a refusal option at collection on both forms *before* relying on the soft opt-in, or use opt-in consent. If no: keep §11 as is. |
| D8 | **WhatsApp:** personal WhatsApp or WhatsApp Business? Are chats backed up (for example to Google Drive or iCloud)? | §6 recipients; retention | Describe as drafted. Keep chats to business use and apply the same retention. |
| D9 | Offline records actually kept: quotation, contract, invoice and payment systems (accounting software? bank?) | §2/§6 completeness | List any accounting or payment provider that holds client personal data. |
| D10 | Art 30 record and breach log exist? | Internal accountability | Create a one-page record of processing and a breach log (not published). |
| D11 | Is Gridsmith **registered and paying the data protection fee**? | DP (Charges and Information) Regs 2018 (L20) | Check the public register and register if not exempt. |
| D12 | **Reviews:** if shown in production (after Freelancer permission), adopt §2A? | Art 14 (L17) | Yes, as drafted. |

---

## 7. Related findings outside the two policies (for engineering / other agents)

- **E1. Edge Functions run near the visitor (F10).** Pinning the region (Supabase supports the `x-region`
  header and a `forceFunctionRegion` query parameter; a header would add a CORS preflight item) would keep all
  processing in the UK/EEA and simplify §7. This is an engineering decision; no code was changed here.
- **E2. `/contact` has no privacy-notice link at the point of collection (F22).** Add the same sentence and link
  the Press flow uses.
- **E3. No real submission should be accepted while `/legal/privacy` is 404 (F23).** Today staging rejects
  real identities anyway (F18). This must hold at cutover: legal pages go live before or with the forms.
- **E4. UI copy says "reply to the acknowledgement" (F25), but no acknowledgement is sent (F12).** Either
  change the copy or add an acknowledgement. An acknowledgement email would itself be a processor flow to
  disclose.
- **E5. CSP allows `https://cdn.sanity.io` for images and media, but nothing uses it (F4).** Consider removing
  it so the policy statement "no third-party requests" cannot drift silently.
- **E6. `docs/_legal/LEGAL-LAUNCH-CHECKLIST.md:88` still lists Vercel** as a processor (stale, same defect as
  §6). Not edited here, per the brief.
- **E7. `leads.request_digest` (SHA-256 of the submission) is pseudonymous personal data.** It cascades on
  lead deletion, so the retention routine in D2 covers it automatically. No action beyond D2.

## 8. Sources (all retrieved 6 Oct 2026)

Primary: legislation.gov.uk — PECR reg 6, reg 22, Sch A1, Sch 1; UK GDPR Arts 6, 12, 13, 15, 45A; DPA 2018
s.164A and Sch 21 para 5; DUAA 2025 ss.117–118; SI 2026/1015; SI 2023/1028 reg 3. Official guidance: ICO
storage-and-access technologies guidance (finalised 29 Apr 2026: exceptions and managing consent); ICO "How
to deal with data protection complaints" (updated 8 May 2026); ico.org.uk home page (naming). Provider
documentation (secondary, factual): Supabase "Regional Invocations". Secondary search result used only to
locate SI 2026/1015: rpclegal.com / mayerbrown.com commencement notes. Not relied on as authority.
