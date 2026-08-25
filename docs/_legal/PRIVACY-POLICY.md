# Privacy Policy — DRAFT for solicitor review

> **[SEED - SOLICITOR REVIEW REQUIRED]**
> This is a draft prepared for a qualified UK solicitor to review, amend and adopt. It is not legal
> advice and must not be published unreviewed. `legalDocument.solicitorApproved` gates publication.

**Controller:** Gridsmith Ltd, a company registered in England & Wales (company number `[TK]`),
registered office `[TK]`.
**ICO registration:** `[TK]`
**Contact:** `[TK email]`
**Version:** 1.1 · **Effective from:** `[TK]` · **Status: DRAFT — not for publication until reviewed**

Drafted against UK GDPR and the Data Protection Act 2018 **as amended by the Data (Use and Access) Act
2025** — main provisions in force **5 February 2026**, the direct-complaints duty in force **19 June
2026** (SI 2026/82 regs. 2 and 3).
<!-- L-DUAA-COMMENCEMENT -->

**Revised 25 August 2026 against `02-CITATION-LEDGER.md`.** Several statements in version 1.0 described
controls the build does not have. Those have been corrected rather than softened; where the honest
answer is "not implemented", this draft says so.

---

## 1. Who we are
<!-- L-GDPR-13 -->
<!-- L-CA-82 -->
<!-- L-TDR-25 -->

Gridsmith Ltd is the data controller for personal data collected through gridsmith.uk. We operate three
trading divisions — Gridsmith Design, Gridsmith Digital and Gridsmith Press. All three are part of the
same company, and personal data is held once by Gridsmith Ltd rather than separately by each division.

`[TK]` company number, registered office and contact email — see `WEBSITE-TERMS.md` clause 1 and OQ-15.

## 1A. ICO registration and the data protection fee
<!-- L-DPA-FEE -->

**NEW — added at revision 1.1.** `[TK — is Gridsmith Ltd registered with the Information Commissioner
and paying the data protection fee, and what is the registration number? The `icoRegistration` field
exists in the Sanity `companyDetails` schema (`sanity/schemas/companyDetails.ts:47`) and is **never
populated and never rendered anywhere on the site** — 01-FACTUAL-INVENTORY.md §6.1, OQ-16.]`

Registration number: `[TK]`. Staff-number band and turnover band as notified to the Commissioner:
`[TK]`.
<!-- L-DPA-FEE — SI 2018/480 regs. 2-3 and Sch. 1. The duty falls on the controller unless all
processing is exempt processing; lead capture is not exempt processing. This is a fact about the
company, not the codebase, but the site has a field for it and shows nothing. -->

## 2. What we collect
<!-- L-GDPR-13 -->

| Category | Data | When |
|---|---|---|
| Enquiry data | Division, name, email, company, phone, message, engagement shape, timeline | When you submit an enquiry at `/contact` |
| Enquiry metadata | The date and time of your enquiry, and a record identifier we generate | Automatically, when the enquiry is stored |
| Communication data | Emails and messages between us | Throughout an enquiry or engagement |
| Client data | Contract, project and billing information | If you become a client |

**Corrections made at revision 1.1**, each traceable to `01-FACTUAL-INVENTORY.md` §3:

- **"Interaction data — pages viewed, referrer, device type, approximate location from IP" has been
  removed.** No such data is collected. `01-FACTUAL-INVENTORY.md` §1.3: neither Google Analytics 4 nor
  PostHog is ever initialised — `window.gtag` is `undefined` and `window.posthog.__loaded` is `false`
  even after Accept. No behavioural event, identifier or persisted storage is produced. See §6A.
- **"A random consent identifier … the policy version" has been removed.** No such record exists.
  `01-FACTUAL-INVENTORY.md` §4.3: the only consent record is a first-party cookie holding the granted
  category names, with **no timestamp, no version and no identifier**. See §11A.
- **`created_at` has been added.** It is stamped automatically on every submission
  (`0001_core.sql:27`) and a visitor would not think of it as a form field.
- **`role`, `track`, `service_slug` and a `payload` field are accepted by the database schema but no
  form on the site sends them** (`01-FACTUAL-INVENTORY.md` §3.2). They are not listed above because
  nothing populates them. If a later form does, this table must be updated in the same change.
- **We do not capture your IP address or user-agent.** The application reads neither
  (`lib/leads/schema.ts:20-24`). Our hosting provider's own platform logging is separate — see §6B.

**We do not collect special category data**, and we ask that you do not include it in free-text fields.
The `message` field accepts up to 5,000 characters of free text and we cannot control what is written
in it.
<!-- L-GDPR-13 -->

**We do not accept file uploads through this website.** Where a brief, manuscript or drawing needs to
be shared, we ask for a link. This is deliberate — it avoids us holding your intellectual property
before there is a contract governing it.
<!-- NO LEDGER ENTRY: a data-minimisation design choice, not a statutory obligation. Retained because
it is true of the build and is a genuine limit on what we hold. -->

## 3. Lawful bases
<!-- L-GDPR-6 -->

| Purpose | Lawful basis |
|---|---|
| Responding to an enquiry | Art. 6(1)(b) — steps taken at your request before entering a contract; and, where an enquiry does not lead to a contract, Art. 6(1)(f) legitimate interests in responding to a request you made |
| Providing services under a contract | Art. 6(1)(b) — performance of a contract |
| Marketing emails to existing clients about similar services | Art. 6(1)(f) plus the PECR reg. 22(3) soft opt-in — **see §3A, this is not available for a bare enquiry** |
| Marketing emails to anyone else | Art. 6(1)(a) — consent |
| Accounting and tax records | Art. 6(1)(c) — legal obligation |
| Establishing or defending legal claims | Art. 6(1)(f) — legitimate interests |

<!-- L-GDPR-6 — the ledger records the status as "cannot tell": nothing in the repository documents a
lawful basis, and lib/leads/schema.ts:20-24 states a data-minimisation policy, not a basis. This table
is therefore a proposal for the solicitor and the owner to adopt, not a record of a decision already
taken. -->

**Rows removed at revision 1.1:** "Sending you a sample pack, estimate or assessment you requested" —
no such flow exists (`01-FACTUAL-INVENTORY.md` §7). "Analytics and performance measurement — consent" —
retained in §6A instead, where the fact that nothing is collected can be stated alongside it.

Where we rely on legitimate interests, we have assessed that our interest in operating and improving a
professional services business does not override your rights. `[TK — that assessment (an LIA) does not
exist in written form anywhere in the repository. Art. 5(2) accountability means it needs to.]`
You may object at any time — see §10.

## 3A. Marketing
<!-- L-PECR-22 -->

**NEW — added at revision 1.1.** We do not currently send marketing email of any kind; no mailing list
and no marketing send exists (`01-FACTUAL-INVENTORY.md` §3, §7). This section states the position that
will apply if that changes.

- **If you are an individual subscriber** — which includes most Gridsmith Press authors, and a sole
  trader using a personal address — PECR reg. 22 applies. We will not send you marketing email unless
  you have consented, or unless the reg. 22(3) soft opt-in applies: we obtained your details **in the
  course of a sale or negotiations for a sale to you**, the marketing is of similar services, and you
  were given a simple free means of refusing at the time and in every message since.
- **If you are a corporate subscriber** — the typical Gridsmith Design or Gridsmith Digital buyer —
  reg. 22 does not bind, but we will still identify ourselves and give a valid address in every
  message, and UK GDPR continues to apply to your personal data.
- **An enquiry that did not become a negotiation for a sale does not unlock the soft opt-in.**
  Submitting the contact form is not consent to marketing and we will not treat it as such.

<!-- L-PECR-22 — this is a real consumer/B2B divergence and is written to the two standards separately
rather than collapsed. Note CNV-3: the ledger records that the text of PECR reg. 23 (sender identity
and valid address for corporate subscribers) was NOT retrieved by Pass 2. The corporate-subscriber
sentence above is therefore drafted to the ledger's summary of reg. 23 and must be checked against the
provision before publication. -->

## 4. How we use it
<!-- L-GDPR-13 -->

- To respond to enquiries and provide the response we have committed to
- To prepare scopes, estimates and proposals
- To deliver services and support
- To keep accounting records
- To meet legal obligations

**We do not sell personal data. We do not share it with advertisers. We do not use it to train any
model.**

## 5. Automated decision-making
<!-- L-GDPR-13 -->

We do not make decisions producing legal or similarly significant effects about you by automated means.

`[TK — version 1.0 described a project estimator, a drawing estimator and a publishing path finder.
None of them is built (01-FACTUAL-INVENTORY.md §7). The reference has been removed. If they ship, this
section must be rewritten in the same change, because their output is a statement about the service.]`

## 6. Who we share it with
<!-- L-GDPR-13 -->
<!-- L-GDPR-28 -->
<!-- L-GDPR-44A -->

| Recipient | Purpose | Personal data reaching it | Region |
|---|---|---|---|
| **Vercel** | Website hosting; your enquiry passes through the server action | Everything you submit, in transit; request metadata for every visitor | `[TK — no region is pinned in `vercel.json`. OQ-3]` |
| **Supabase** | The enquiry database | Every field of your enquiry | `[TK — OQ-2. The live project ref is `dqiutgmxillhsbzgnlsx` and its region is **not established**. It must not be assumed to be in the UK or EU.]` |
| **Resend** | The email that notifies us of your enquiry | Division, name, email, company, phone, and a record id. **Your message is deliberately not included** (`lib/leads/notify.ts:56-61`) | `[TK — OQ-4]` |
| **Slack** | Internal notification that an enquiry arrived | **Your full name** and the division | `[TK — OQ-6. See the decision below.]` |
| **Sanity** | Content management for the site's own pages | **None.** Read-only and server-side at build time | `[TK — OQ-1]` |
| Our accountants | Bookkeeping and statutory accounts | Client billing data | `[TK]` |

<!-- L-GDPR-28 — Art. 28(3) requires a written contract binding on each processor. The ledger records
the status as "cannot tell": **no DPA is recorded in the repository for any processor.** Every row
above needs one before publication. -->

**Corrections made at revision 1.1.** Version 1.0 asserted regions — "EU/UK region", "EU region",
"EU/US", "US" — for six recipients. **None of those was established.** `01-FACTUAL-INVENTORY.md`
OQ-1 to OQ-4 record that the Sanity, Supabase, Vercel and Resend regions are all unestablished, and
OQ-2 states explicitly that the Supabase region "must not be assumed to be EU". Asserting a region we
have not verified is exactly the misstatement the transfer disclosure exists to prevent, so each is now
`[TK]`.

> **[DECISION REQUIRED] — Slack.** `lib/leads/notify.ts:125-133` is a **live code path** that
> transmits an enquirer's full name to Slack. It is currently inert only because the
> `SLACK_LEADS_WEBHOOK` environment variable is unset; setting that variable makes Slack a processor
> immediately, with no code change and no further decision. Options:
> **(a)** delete the code path — Slack never appears in this notice;
> **(b)** keep it but leave it unset — it must still be disclosed here as a recipient we may add, and
> the variable must be treated as a change requiring a DPA and a notice update;
> **(c)** enable it — then a DPA under `L-GDPR-28`, a region under `L-GDPR-44A`, and this row all have
> to be completed first.
> Consequence of doing nothing: an undocumented processor is one environment variable away from live.

**Removed at revision 1.1: the "delivery partners" row and its note.** Version 1.0 stated *"Gridsmith
Ltd works with affiliated production entities outside the UK … This is a real transfer and cannot be
omitted."* `[TK — nothing in the repository or the inventory establishes that such entities exist, who
they are, what data reaches them, or where. It is retained as an open item rather than as an assertion,
because a privacy notice must not describe a transfer it cannot particularise — and must not omit one
that is real. The owner must confirm which it is.]`

## 6A. Analytics — what actually happens today
<!-- L-PECR-6 -->
<!-- L-GDPR-13 -->

**NEW — added at revision 1.1, and it corrects version 1.0's most consequential inaccuracy.**

Version 1.0 said we collect "pages viewed, referrer, device type, approximate location from IP" with
consent. **We do not.** Observed on the running site in all three consent states
(`01-FACTUAL-INVENTORY.md` §1.3, §2.2):

- Before you make a choice, **no third-party request is made at all**.
- If you **accept**, two scripts are requested — `googletagmanager.com/gtag/js` and
  `eu.i.posthog.com/static/array.js`. Requesting a script sends your IP address and browser
  user-agent to Google and to PostHog, because every HTTP request does. That is the whole of what
  they receive.
- **Neither library is ever initialised.** No `gtag('config')` call and no `posthog.init()` call
  exists anywhere in our code. No analytics cookie is set, no event is recorded, no identifier is
  created, and nothing is stored in your browser.
- If you **reject**, no third-party request is made and no script is injected.

So today there is no analytics dataset, and no analytics retention period, because there is nothing to
retain. **This section must be rewritten the day either library is initialised**, and that change also
turns on `L-PECR-CONSENT-EVIDENCE` — see §11A.

## 6B. Our hosting provider's own logs
<!-- L-GDPR-13 -->
<!-- L-GDPR-30 -->

**NEW — added at revision 1.1.** Our application does not record your IP address or user-agent. Our
hosting provider records request metadata as part of running the platform. `[TK — what Vercel retains,
in which region, and for how long. OQ-8. This is a disclosure we owe under Art. 13 and it cannot be
written from the repository.]`

## 6C. International transfers
<!-- L-GDPR-44A -->

**REWRITTEN at revision 1.1 — version 1.0 cited repealed law.** It said transfers rely on "UK adequacy
regulations where available, or the International Data Transfer Agreement / UK Addendum". Articles 44
and 45 of the UK GDPR were **omitted on 5 February 2026** by the DUAA 2025, and Chapter V was
restructured. The applicable provisions are now Art. 44A (general principles), Art. 45A (transfers
approved by regulations), **Art. 45B (the "data protection test")**, Art. 46 (appropriate safeguards,
substantially amended) and Art. 49 (derogations).

Where we transfer your personal data outside the United Kingdom, we do so only where the transfer is
approved by regulations under Art. 45A, or subject to appropriate safeguards under Art. 46, or within
an Art. 49 derogation. Art. 45B asks whether the standard of protection in the receiving country or
for the receiving organisation is **not materially lower** than the UK standard.

`[TK — which mechanism is relied on, for which recipient. This cannot be completed until §6's regions
are established. The ledger records this as "the largest single unknown".]`

## 7. How long we keep it
<!-- L-GDPR-5-1e -->
<!-- L-GDPR-13 -->

**Version 1.0 published a retention table. None of it was implemented, and most of it still is not.**
`01-FACTUAL-INVENTORY.md` §3.4: *"Retention: NOT IMPLEMENTED."* There is no purge, no anonymisation and
no scheduled delete over the `leads` table anywhere in the repository. The only cron on the deployment
is `/api/rls-drift`, which is a security check. Enquiry data currently accumulates indefinitely.

| Data | Retention | State |
|---|---|---|
| Enquiries that do not become clients | `[TK]` | **Nothing implemented.** OQ-9 |
| Client records | `[TK]` | Held outside this website |
| Contracts | `[TK]` | Held outside this website |
| Consent choice | 365 days | Implemented — it is the `Max-Age` on the `gs_consent` cookie in your own browser |
| Analytics | Not applicable | Nothing is collected — see §6A |

> **[DECISION REQUIRED] — the enquiry retention period, and who builds the deletion.** Art. 13(2)(a)
> requires this notice to state either a period or the criteria for determining one, and Art. 5(1)(e)
> requires data not to be kept longer than necessary. Options:
> **(a)** state a period (for example 24 months from last contact) **and build the job that enforces
> it** — a stated period with no deletion mechanism is a statement we cannot honour, and Art. 5(2)
> requires us to be able to demonstrate compliance;
> **(b)** state criteria rather than a period, which is permitted, but the criteria still have to be
> applied by someone;
> **(c)** delete nothing and state nothing — not available; it fails Art. 13(2)(a) outright.
> Consequence: option (a) is a build task nobody currently owns. Publishing this notice with a period
> in it, and no job, converts a build gap into a published misstatement.

## 8. Security
<!-- L-GDPR-32 -->

- Data is encrypted in transit.
- The enquiry database uses **row-level security**: the public website can insert an enquiry and
  cannot read one back. This was verified against the live database on 25 August 2026 — an anonymous
  read of the enquiry table returns no rows, and the analytics view is revoked
  (`01-FACTUAL-INVENTORY.md` §3.4).
- That security posture is **re-tested automatically every day** by a scheduled check, which is a
  concrete instance of the Art. 32(1)(d) duty to test the effectiveness of our measures.
- The website writes enquiries using a restricted publishable key, never a privileged service key.
- Access is limited to those who need it.

**Stated honestly:** there is **no honeypot, no rate limit and no CAPTCHA** on the enquiry form
(`01-FACTUAL-INVENTORY.md` §3.3). That is an availability and abuse exposure on the one endpoint an
anonymous visitor can write to. `[TK — whether to build one before launch.]`

**Removed at revision 1.1:** "encrypted … at rest" (not verified anywhere in the repository) and
"We do not store payment card details — payments are handled by our payment provider" (**no payment
provider exists and no payment is taken on this site**).

## 9. Your rights
<!-- L-GDPR-RIGHTS -->

You have the right to: be informed · access · rectification · erasure · restrict processing · data
portability · object · not be subject to solely automated decision-making · withdraw consent at any
time.

To exercise any of these, contact `[TK email]`. We will respond **without undue delay and in any event
within one month** of receiving your request, and we will tell you promptly if we need up to two
further months because the request is complex or because we have received a number of requests.

There is no charge unless a request is manifestly unfounded or excessive.

<!-- L-GDPR-RIGHTS — Arts. 12, 15-18, 20, 21. Stated honestly: no erasure mechanism exists in the
build (01-FACTUAL-INVENTORY.md §3.4), so an Art. 17 request is executed by hand against the database.
`[TK — who does that, and what record is kept that it was done? Nothing in the repository records a
process.]` -->

## 10. Objecting to legitimate interests
<!-- L-GDPR-RIGHTS -->

If we rely on legitimate interests, you can object. For direct marketing, we will stop immediately and
without question. For other purposes, we will stop unless we can demonstrate compelling grounds that
override your rights.

## 11. Cookies
<!-- L-PECR-6 -->

See our Cookie Policy. In short: **exactly one cookie exists on this site**, `gs_consent`, which
records the choice you made so we do not ask again. Nothing non-essential is placed until you have made
a choice, and you can change that choice at any time from the **Cookie preferences** link in the
footer.

## 11A. Our record of your consent
<!-- L-PECR-CONSENT-EVIDENCE -->
<!-- L-PECR-6-CONSENT -->

**NEW — added at revision 1.1, replacing an inaccurate statement in version 1.0.** Version 1.0 said we
keep "a random consent identifier, your choice, which categories you selected, and the version of this
policy in force … for 24 months". **No such record exists.**

What actually exists (`01-FACTUAL-INVENTORY.md` §4.3): a first-party cookie in your own browser holding
the names of the categories you granted, or the single character `0` if you refused. **No timestamp, no
version, no identifier, and no server-side record.** The `consent_events` table described in our
internal specification **has not been built**. You can delete the cookie, and then no record of your
choice exists anywhere.

> **[DECISION REQUIRED] — consent evidence.** Art. 7(1) requires a controller relying on consent to be
> **able to demonstrate** that consent was given. Options:
> **(a)** build the server-side consent record (`L-07`, `consent_events`) before any analytics library
> is initialised;
> **(b)** rely on the **PECR Sch. A1 para. 5 statistical-purposes exception** instead of consent for
> analytics, which removes the demonstrability problem for that purpose entirely — see
> `COOKIE-POLICY.md` §4A, where the same decision is set out with the ICO's published conditions;
> **(c)** leave it as it is.
> Option (c) is currently defensible for one reason only: **nothing consent-gated collects anything
> today** (§6A), so there is no consent-based processing to demonstrate. That defence evaporates on the
> day either analytics library is initialised, and the code that initialises it will not know that.

## 12. Complaints
<!-- L-DPA-164A -->

**Data protection complaints procedure** — required since **19 June 2026** (DPA 2018 s. 164A, inserted
by DUAA 2025 s. 103, commenced by SI 2026/82 reg. 3).

If you are unhappy with how we have handled your personal data:

1. `[TK — an electronic complaint form. s. 164A requires us to facilitate the making of complaints
   "by taking steps such as providing a complaint form which can be completed electronically and by
   other means". 01-FACTUAL-INVENTORY.md §5.1 lists every route on the site: **there is no complaints
   route and no complaint form.** `/contact` is a sales enquiry form, and its message field is
   deliberately withheld from the notification email — it is not a complaints channel. This is the
   ledger's number-one unclaused obligation and it is a build task, not a drafting one.]`
2. Or email `[TK email]` with "Data protection complaint" in the subject, or write to us at our
   registered office.
3. **We will acknowledge receipt within 30 days** — the statutory maximum. `[DECISION REQUIRED]` see
   below.
4. We will then, without undue delay, make appropriate inquiries, take appropriate steps to respond,
   keep you informed of progress, and tell you the outcome.

> **[DECISION REQUIRED] — the acknowledgement window.** s. 164A sets **30 days** as the outer limit.
> Version 1.0 promised **5 working days**. Options:
> **(a)** promise 5 working days — better service, and a published commitment that binds us; for a
> consumer it is also a statement about the trader under `L-CRA-50`;
> **(b)** promise 30 days — the statutory floor, always achievable, and a weaker signal;
> **(c)** promise 5 working days as a target and 30 days as the guarantee.
> Whichever is chosen must match `CONSUMER-TERMS.md` §12 and `ACCESSIBILITY-STATEMENT.md` §5, which
> currently promise 5 working days each. Note `CLAUDE.md`'s standing rule: **never promise a response
> faster than end of next business day**, and one source of truth for response commitments.

You can complain to the Information Commissioner's Office at any time, and you do not have to come to
us first. ICO: ico.org.uk · 0303 123 1113.

## 12A. Our record of processing
<!-- L-GDPR-30 -->

**NEW — added at revision 1.1.** `[TK — no record of processing activities (ROPA) exists.
01-FACTUAL-INVENTORY.md is the closest thing to one. The Art. 30(5) exemption for organisations under
250 staff does **not** obviously apply here, because it is lost where processing "is not occasional",
and lead capture is continuous and automated: every submission writes a row and fires a notification.
A ROPA is an internal document and does not belong in this published notice — this section exists so
the obligation is not lost, and should be deleted from the published version once the ROPA exists.]`
<!-- L-GDPR-30 — Art. 30(1) and 30(5). CNV-2: legislation.gov.uk records an outstanding unapplied
amendment to Art. 30(4) from SI 2026/386; nothing here relies on 30(4). -->

## 13. Changes
<!-- NO LEDGER ENTRY: notifying policy changes is good practice and supports the Art. 5(1)(a)
transparency principle, but Pass 2 raised no discrete obligation. Retained. -->

We will post any changes here with an updated version number and effective date. Material changes will
be notified to clients directly.

---

**`[TK]` items to complete before publication:** company number · registered office · ICO registration
number and bands · contact email · effective date · the four processor regions (Sanity, Supabase,
Vercel, Resend) · the transfer mechanism relied on for each · Vercel's platform log retention · the
enquiry retention period **and the job that enforces it** · the electronic complaint form · the written
legitimate-interests assessment · the process for handling an erasure request · whether affiliated
production entities exist and what reaches them · whether a honeypot or rate limit is built before
launch · the ROPA.

**`[DECISION REQUIRED]` items:** Slack (§6) · the enquiry retention period (§7) · consent evidence
versus the statistical-purposes exception (§11A) · the complaint acknowledgement window (§12).
