# 04 — Verification Report (Pass 4)

**Date: 25 August 2026.** Independent verification of the six drafts in `docs/_legal/`.

**Method, and the one rule this pass was built on.** Every legal assertion below was checked
against the **primary source**, fetched during this pass — `legislation.gov.uk` at the current
in-force version, the W3C Recommendation, and the CMA's published commencement position. **The
citation ledger was not used as a source.** Where `02-CITATION-LEDGER.md` cites a provision, that
provision was opened and read; where a draft repeats the ledger, the agreement between them was
treated as proving nothing, because Pass 3 wrote the clause from the ledger.

Factual assertions about the build were re-derived from the repository — migrations, `lib/`,
`components/`, `scripts/`, `.env.local` — not from `01-FACTUAL-INVENTORY.md`.

**Two limits on this pass, stated up front.**
1. **The ICO guidance quoted at `COOKIE-POLICY.md` §4A was not independently retrieved.** Pass 3
   introduced it to close `CNV-1`. It is correctly labelled *"regulator guidance, not statute"* in
   both places it appears, which is the labelling this pass was asked to check, and that labelling
   **holds**. The accuracy of the quotations themselves is unverified and is carried into the
   verdict on that document.
2. The running site was not driven in a browser. Every build fact below was verified from source
   code, migrations and environment files, which is a stronger check for *what the code does* and a
   weaker one for *what a visitor observes*. Where the two can diverge, this report says so — see
   §2.12.

---

## 1. Assertions that HOLD

Verified at the primary source. Thirty-five items.

### Data protection — the DUAA baseline

**1.1 `L-DUAA-COMMENCEMENT` — both commencement dates.** Fetched
`https://www.legislation.gov.uk/uksi/2026/82/made`. The instrument is *The Data (Use and Access) Act
2025 (Commencement No. 6 and Transitional and Saving Provisions) Regulations 2026*. **Reg. 2 —
5 February 2026** — brings in a block including **s. 112** and **Schedules 12 and 13**. **Reg. 3 —
19 June 2026** — brings in **s. 103 and Schedule 10**, and those two only. Both dates and both
allocations are exactly as the ledger states. `00-LEGAL-BASIS.md` §2 is correct.

**1.2 `L-GDPR-44A` — Chapter V really was restructured.** Fetched
`https://www.legislation.gov.uk/eur/2016/679/chapter/V`. **Article 44 is marked omitted 5.2.2026.
Article 45 is marked omitted 5.2.2026.** (Article 48 was omitted earlier, 31.12.2020.) Newly in
force: **44A** (inserted 5.2.2026), **45A**, **45B**, **45C**, **47A**, **49A**; Arts. 46, 47 and 49
amended 5.2.2026. Art. 45B's test reads: the standard of protection *"is not materially lower than
the standard of the protection provided for data subjects by or under"* the UK regime. The ledger's
strongest single claim — that any clause citing "adequacy decisions" or Art. 45 cites repealed
text — **is correct**, and `PRIVACY-POLICY.md` §6C and `MSA-BUSINESS.md` 10.4 are drafted to the
right provisions.

*Completeness note, not a defect:* the ledger names 44A, 45A, 45B, 46 and 49 and does not mention
**45C** (monitoring of regulations), **47A** (further provision on safeguards) or **49A**
(restriction in the public interest). Nothing in the drafts turns on them.

**1.3 `L-DPA-164A` — the direct-complaints duty, as stated.** Fetched
`https://www.legislation.gov.uk/ukpga/2018/12/section/164A`. The controller must facilitate
complaints, *"providing a complaint form which can be completed electronically and by other means"*;
must *"acknowledge receipt of the complaint within the period of 30 days beginning when the
complaint is received"*; and must without undue delay make inquiries, respond, keep the complainant
informed of progress and inform them of the outcome. No small-organisation exemption appears. The
30-day figure in `PRIVACY-POLICY.md` §12, `CONSUMER-TERMS.md` §12.1, `WEBSITE-TERMS.md` §12A and
`MSA-BUSINESS.md` 10.5 is right.

**1.4 `L-GDPR-13` — including the new UK-only limb.** Fetched
`https://www.legislation.gov.uk/eur/2016/679/article/13`. Art. 13(2) now carries **sub-paragraph
(ca): *"the right to make a complaint to the controller under section 164A of the 2018 Act"***,
inserted **19 June 2026 by DUAA 2025 Sch. 10 para. 3(2)**. This is the specific amendment the ledger
asserted and it is real. Art. 13(2) reads (a) storage period, (b) access/rectification/erasure/
restriction/objection, (c) withdraw consent, **(ca)** complain to controller, (d) complain to the
Commissioner, (e) statutory/contractual requirement, (f) automated decision-making.

**1.5 `L-DPA-FEE` — the fee, and the £632,000 figure.** Fetched
`https://www.legislation.gov.uk/uksi/2018/480/regulation/2/made`. Reg. 2 requires payment within the
first 21 days of each charge period and notification of name, address, staff band, turnover band and
public-authority status. The bands are verbatim: staff *"less than or equal to 10"* / *"greater than
10 but less than or equal to 250"* / *"greater than 250"*; turnover *"less than or equal to
£632,000"* / *"greater than £632,000 but less than or equal to £36 million"* / *"greater than £36
million"*. The specific-looking £632,000 in the ledger **is the real figure**. (One mis-citation
attaches to this entry — §2.6.)

### PECR

**1.6 `L-PECR-6` — reg. 6 was substituted, and Sch. A1 was inserted.** Fetched
`https://www.legislation.gov.uk/uksi/2003/2426/regulation/6`. Current text: *"Subject to Schedule
A1, a person must not store information, or gain access to information stored, in the terminal
equipment of a subscriber or user."* The page records substitution **on 5 February 2026 by DUAA 2025
ss. 112(2) and 142(1) via S.I. 2026/82**. **Reg. 6A exists.** Every element of the ledger's claim is
confirmed at source, including that reg. 6 catches *access to* stored information and is not
limited to individual subscribers.

**1.7 Schedule A1's exceptions are as described.** Fetched
`https://www.legislation.gov.uk/uksi/2003/2426/schedule/A1`. Para. 2 consent · para. 3 transmission ·
**para. 4** *"strictly necessary for the provision of an information society service requested by
the subscriber or user"*, with examples including equipment security, fraud prevention, fault
detection and authentication · **para. 5** statistical purposes, requiring *"clear and comprehensive
information"* and *"a simple means of objecting, free of charge"*, and prohibiting sharing except to
assist improvements · **para. 6** appearance and functionality · para. 7 emergency location. The
`gs_consent` exemption claimed at `COOKIE-POLICY.md` §2 under **para. 4** is the right paragraph for
that cookie.

**1.8 `L-PECR-22` — the individual-subscriber limit and the soft opt-in.** Fetched
`https://www.legislation.gov.uk/uksi/2003/2426/regulation/22`. Reg. 22(1) is expressly limited to
*"individual subscribers"*. Reg. 22(3)'s three conditions are exactly as the ledger and
`PRIVACY-POLICY.md` §3A state, including *"a simple means of refusing (free of charge except for the
costs of the transmission of the refusal) … at the time that the details were initially collected,
and … at the time of each subsequent communication"*. **Paras. (3A) and (5) exist and were inserted
5 February 2026 by DUAA 2025**; (3A) is the charity exemption and (5) defines "charity". The
consumer/B2B divergence the ledger builds on this is legally right.

**1.9 `CNV-3` resolved — PECR reg. 23 does what the drafts rely on it for.** Fetched
`https://www.legislation.gov.uk/uksi/2003/2426/regulation/23`, which Pass 2 could not retrieve. It
prohibits marketing email *"where the identity of the person on whose behalf the communication has
been sent has been disguised or concealed"* and *"where a valid address to which the recipient … may
send a request that such communications cease has not been provided"*. **It is not limited to
individual subscribers.** `MSA-BUSINESS.md` 16.1 and `PRIVACY-POLICY.md` §3A's corporate-subscriber
sentences are therefore correct as drafted, and `CNV-3` can be closed. Reg. 23 also incorporates
E-Commerce reg. 7 by reference, which no draft mentions and none needs to today.

### Company and e-commerce disclosure

**1.10 `L-TDR-24` — the registered-name duty on websites.** Fetched
`https://www.legislation.gov.uk/uksi/2015/17/regulation/24/made`. The sentence the ledger quotes —
*"Every company shall disclose its registered name on its websites"* — is real and is **reg. 24(2)**
(reg. 24(1) covers letters, invoices, order forms and the rest).

**1.11 `L-TDR-25` — the four particulars.** Fetched
`https://www.legislation.gov.uk/uksi/2015/17/regulation/25/made`. Reg. 25(1)(c) expressly names
*"its websites"*. Required: part of the UK in which registered, registered number, registered office
address, plus the exemption/CIC/investment-company cases. Reg. 25(3): any share-capital figure must
be paid-up. The footer's four particulars are the four the regulation asks for.

**1.12 `L-ECOM-6` — both limbs, and the lettering.** Fetched
`https://www.legislation.gov.uk/uksi/2002/2013/regulation/6/made`. **Reg. 6(1)(g) is the VAT-number
paragraph**, as the ledger says. Reg. 6(2) reads: *"Where a person providing an information society
service refers to prices, these shall be indicated clearly and unambiguously and, in particular,
shall indicate whether they are inclusive of tax and delivery costs."* The regulation binds *"a
person providing an information society service"* and **is not consumer-limited** — the ledger's
load-bearing correction to `00-LEGAL-BASIS.md` is right, and it is what carries the VAT-labelling
duty into Design and Digital.

**1.13 `L-ECOM-9-11` — reg. 9(1) is excludable between businesses.** Fetched
`https://www.legislation.gov.uk/uksi/2002/2013/regulation/9`. Reg. 9(1) opens *"Unless parties who
are not consumers have agreed otherwise"*. The mechanism `MSA-BUSINESS.md` clause 15.1 relies on
exists and works for reg. 9(1). (The clause names the wrong sub-paragraph of reg. 11 and misses a
carve-out — §2.4 and §2.5.)

### Consumer law

**1.14 `L-CRA-50` — the sharpest hook, verified.** Fetched
`https://www.legislation.gov.uk/ukpga/2015/15/section/50`. s. 50(1): a contract to supply a service
is treated as including *"anything that is said or written to the consumer, by or on behalf of the
trader, about the trader or the service"* if taken into account in deciding to enter the contract or
in any decision about the service afterwards. The ledger's use of this against live `[SEED]` content
is sound.

*One nuance the drafts should absorb:* **s. 50(2)** permits a statement to be qualified by
*"anything said or written to the consumer … at the same time"*. `WEBSITE-TERMS.md` §7's flat
assertion that *"a disclaimer does not undo it"* is right about a disclaimer on a separate terms
page and slightly over-stated as a general proposition.

**1.15 `L-CRA-57` — non-binding exclusions.** Fetched
`https://www.legislation.gov.uk/ukpga/2015/15/section/57`. s. 57(1) and (2): a term is not binding
to the extent it would exclude liability under **s. 49** or **s. 50**. s. 57(3): nor to the extent
it would restrict that liability so as to prevent the consumer *"recovering the price paid or the
value of any other consideration"*. s. 57(4) extends to terms excluding remedies or imposing onerous
conditions on pursuing them. The structural conclusion drawn from this across four documents — a
B2B cap applied to a Press author is void to that extent — **is correct at source.**

**1.16 `L-CCR-40` — express consent for additional payments.** Fetched
`https://www.legislation.gov.uk/uksi/2013/3134/regulation/40`. Verbatim: reg. 40(2) — *"There is no
express consent (if there would otherwise be) … if consent is inferred from the consumer not
changing a default option (such as a pre-ticked box on a website)"*; reg. 40(4) makes the payment
reimbursable. `CONSUMER-TERMS.md` §7.5 is accurate.

**1.17 `L-CCR-29` / reg. 36 — starting work inside the cancellation period.** Fetched
`https://www.legislation.gov.uk/uksi/2013/3134/regulation/36`. An express request is required;
**for an off-premises contract it must be on a durable medium**. On cancellation the consumer pays
*"in proportion to what has been supplied, in comparison with the full coverage of the contract"*.
Reg. 36(2) removes the right to cancel once the service is fully performed, **provided the consumer
acknowledged they would lose it**. `CONSUMER-TERMS.md` §6(a)–(d) implements all four elements,
including the acknowledgement, and is the strongest-drafted section in the whole set.

**1.18 `L-DMCC-230` — total price and the prominence rule.** Fetched
`https://www.legislation.gov.uk/ukpga/2024/13/section/230`. s. 230(2)(b) requires the total price;
**s. 230(4)** defines it to include *"any fees, taxes, charges or other payments that the consumer
will necessarily incur"* — so a consumer-facing price must be VAT-inclusive. Where the price cannot
be calculated in advance, the calculation information must be given *"with as much prominence as any
information that is set out in compliance with"* the total-price paragraph. s. 230(2)(g) requires
charges not in the total price, or the fact that they may be payable. `L-VAT-CONSUMER` is correctly
grounded.

**1.19 `L-DMCC-SCH20-13` — consumer reviews.** Fetched
`https://www.legislation.gov.uk/ukpga/2024/13/schedule/20`. Schedule 20 has **32 paragraphs**;
**paragraph 13** is the consumer-reviews entry. Sub-para. (1) covers submitting or commissioning *"a
fake consumer review"* or one *"that conceals the fact it has been incentivised"*. Sub-para. (3)(i)
covers *"failing to publish, or removing from publication, negative consumer reviews whilst
publishing positive ones (or vice versa)"* and giving greater prominence to positive ones. Paragraph
number, subject matter and the prominence limb all confirmed.

**1.20 DMCCA Part 4 commencement — 6 April 2025.** Confirmed against **SI 2025/272** (*Digital
Markets, Competition and Consumers Act 2024 (Commencement No. 2) Regulations 2025*) and the CMA's
published position. Part 4 Chapter 1 commenced **6 April 2025**, **except ss. 232, 234 and 235**
(the private right of redress), and applies only to practices on or after that date. The ledger's
date is right; the three excepted sections are a detail no draft relies on.

### Accessibility

**1.21 `L-EQA-20` — both limbs, quoted.** Fetched
`https://www.legislation.gov.uk/ukpga/2010/15/schedule/2` and `.../section/20`. **Sch. 2 para. 2(2)**:
*"the reference in section 20(3), (4) or (5) to a disabled person is to disabled persons
generally"* — the anticipatory duty, exactly as `ACCESSIBILITY-STATEMENT.md` §1 and
`WEBSITE-TERMS.md` §15 describe it. **s. 20(7)**: a person subject to the duty *"is not … entitled
to require a disabled person … to pay to any extent A's costs of complying with the duty"*. The
customer-facing sentence in §5 — *"We will not charge you for it"* — is a correct statement of
s. 20(7).

**1.22 `L-WCAG-22` — status and version.** Fetched `https://www.w3.org/TR/WCAG22/`. Status: **W3C
Recommendation**. This version: `https://www.w3.org/TR/2024/REC-WCAG22-20241212/`, **12 December
2024**. The ledger's version string and date are exact. The legal characterisation in
`ACCESSIBILITY-STATEMENT.md` §2 — a technical specification adopted voluntarily, not a statutory
standard for a private-sector UK service, with the Equality Act duty being the actual obligation —
**is correct and is the single best-judged paragraph in the drafts.**

### The uncited assertions Pass 3 flagged (verified here for the first time)

**1.23 CDPA 1988 s. 90(3) exists and says what `MSA-BUSINESS.md` 8.3 claims.** Fetched
`https://www.legislation.gov.uk/ukpga/1988/48/section/90`. Verbatim: *"An assignment of copyright is
not effective unless it is in writing signed by or on behalf of the assignor."* **Survives.** (One
gap attaches — §4.1.)

**1.24 UCTA 1977 s. 3 applies to the MSA's liability clauses.** Fetched
`https://www.legislation.gov.uk/ukpga/1977/50/section/3`. s. 3(1) applies *"as between contracting
parties where one of them deals … on the other's written standard terms of business"* and imposes
the s. 11 reasonableness requirement. **s. 3(3), inserted by the CRA 2015, expressly removes
consumer contracts** to s. 62 CRA. So the B2B/consumer split the drafts assume is the split the
statute now draws. **Survives** — the flag at `MSA-BUSINESS.md` clause 11 and `00-LEGAL-BASIS.md` §1
is correct and can be upgraded from "asserted" to "verified".

**1.25 Provision of Services Regulations 2009 are in force and reg. 8 bites.** Fetched
`https://www.legislation.gov.uk/uksi/2009/2999/contents` and `.../regulation/8`. **In force**, shown
as current to 25 August 2026 with pending amendments from S.I. 2026/435. Reg. 8(1) requires the
provider to make available **(i)** *"the general terms and conditions, if any, used by the
provider"*, **(k)** *"the existence of any after-sales guarantee not imposed by law"*, and **(l)**
*"the price of the service, where a price is pre-determined by the provider for a given type of
service"*. **Survives** — `00-LEGAL-BASIS.md`'s PSR row is substantively right and needs a ledger
entry rather than a health warning.

**1.26 The Late Payment fixed sums are real, and there are three of them.** Fetched
`https://www.legislation.gov.uk/ukpga/1998/20/section/5A`. **£40** for a debt under £1,000; **£70**
for £1,000–£9,999; **£100** for £10,000 or more. **s. 5A(2A)** additionally entitles the supplier to
reasonable recovery costs above the fixed sum. **1.27 The 8% is real but is not in the Act.** s. 6
merely empowers the Secretary of State to set the rate by order; the rate is set by **The Late
Payment of Commercial Debts (Rate of Interest) (No. 3) Order 2002, SI 2002/1675, art. 4** — *"8 per
cent per annum over the official dealing rate"*, fixed by reference to the base rate on 30 June or
31 December for the following six months. The **figure survives; the citation does not** — §2.8.

### Facts about the build

Each re-derived from source, not from `01-FACTUAL-INVENTORY.md`.

**1.28 `gs_consent` is the only cookie the application writes.** `lib/consent/state.ts:31,50` is the
sole `document.cookie` assignment in the repository; a repo-wide grep for `document.cookie` returns
that file and nothing else. Attributes match `COOKIE-POLICY.md` §2 exactly: `Max-Age` 31,536,000
(365 days), `Path=/`, `SameSite=Lax`, `Secure` only over https. Value is the granted category names
comma-separated, or `0`. **No timestamp, no version, no identifier** — §7 of the cookie policy and
§11A of the privacy policy are accurate.

**1.29 Neither analytics library is ever initialised.** A repo-wide grep across `app/`, `components/`
and `lib/` for `gtag(`, `posthog.init` and `__loaded` returns **nothing**. `lib/analytics/load.ts`
contains one function, `inject()`, which appends a `<script src>` and does nothing else. There is no
configuration call anywhere. `PRIVACY-POLICY.md` §6A and `COOKIE-POLICY.md` §4 are correct on the
decisive point.

**1.30 `consent_events` does not exist.** The schema is two files —
`supabase/migrations/0001_core.sql` and `0002_view_security_invoker.sql`. The tables created are
`leads`, `sample_grants` and `events`. **There is no `consent_events` table**, and no migration
creates one.

**1.31 Retention is not implemented.** No `delete`, no purge, no `pg_cron`, no scheduled job over
`leads` appears in either migration. `vercel.json`'s only cron is `/api/rls-drift`, a security
re-test. `PRIVACY-POLICY.md` §7's flat statement that enquiry data accumulates indefinitely is
accurate.

**1.32 The RLS posture is as described.** `0001_core.sql:88-92`: RLS enabled on **all three** tables;
the only anon policy is `create policy "anon insert only" on leads for insert to anon with check
(true)`. No select, update or delete policy for anon anywhere. `PRIVACY-POLICY.md` §8 is accurate,
including that reads are service-role only.

**1.33 Slack is a live code path and is currently inert.** `lib/leads/notify.ts:121-133` posts
`` `New ${lead.division} lead: ${lead.full_name} (${lead.lead_type})` `` to `SLACK_LEADS_WEBHOOK`.
The variable is documented in `.env.example` and **is absent from `.env.local`**, so the branch
takes `status: 'skipped'` today. One environment variable away from live, with no code change — the
`[DECISION REQUIRED]` at `PRIVACY-POLICY.md` §6 states this correctly. Note the payload includes
`lead_type` as well as full name and division; the privacy policy's row names only the first two.

**1.34 No IP address or user-agent is captured.** `lib/leads/schema.ts` — the complete Zod schema —
contains no IP, user-agent, or fingerprint field. The Resend notification body
(`notify.ts:66-77`) carries division, lead type, service slug, name, email, company, phone and the
record id, and **deliberately omits `message`**, exactly as `PRIVACY-POLICY.md` §6 states.

**1.35 The fabricated VAT number, the five legal slugs, the axe coverage, the testimonials, and the
response commitment.** `scripts/seed-company-details.mjs:43` — `vatNumber: '[SEED] GB123456789'`,
described in its own docstring as *"a deliberately invalid placeholder, not a blank"*.
`lib/legal/slugs.ts` declares exactly **five** slugs — `privacy`, `cookies`, `terms`,
`client-terms`, `accessibility` — so both the MSA and the Consumer Terms do map to one route, and
`ACCESSIBILITY-STATEMENT.md` §4.3 is right that **`/legal/privacy` is the only legal route in
`check-axe.mjs`'s `ROUTES`**. `components/master/Testimonials.tsx` confirms six reviews carrying
`isSeed: false`, `verified: true` and a per-card `sourceUrl` — a stronger provenance position than
the ledger credits, though it leaves the selection question at `OQ-20` untouched.
`companyDetails.responseCommitment` is genuinely single-sourced: it is declared once in the Sanity
schema and read in four render sites, with no hardcoded duplicate anywhere.

*Also verified, with a caveat:* `COOKIE-POLICY.md` §5's *"no request is made to Google Fonts or any
other font host"* **holds for the visitor**. `styles/fonts/*.ts` use `next/font/google`, which
downloads and self-hosts the files at build time, so no runtime request leaves the browser. The
bullet's heading *"No third-party fonts"* overstates the provenance while the operative privacy
claim beneath it is true.

---

## 2. Assertions that DO NOT HOLD

Fifteen items. The first three are the ones that matter.

### 2.1 `CLAUDE.md`'s PECR penalty figure is wrong — and it is wrong in the direction that matters

**What is claimed.** `CLAUDE.md`, non-negotiable #7: *"Never fire a non-essential cookie before
consent. **PECR penalties are now up to 4% of turnover.**"* Stated as fact, with no citation.
`00-LEGAL-BASIS.md` §2.1 repeats `£17.5m or 4%` and — correctly — marks it `[CORRECTED — the figures
are unverified]`, asking that it be confirmed *"before this figure is repeated anywhere, including
in `CLAUDE.md` itself"*. It has now been confirmed, and it does not survive.

**What the primary source says.** DUAA 2025 **Sch. 13** (in force 5 Feb 2026, per SI 2026/82 reg. 2 —
§1.1) substitutes a new **Schedule 1 into PECR**, which applies DPA 2018 Part 6 enforcement. Fetched
`https://www.legislation.gov.uk/uksi/2003/2426/schedule/1/paragraph/18`. Paragraph 18 modifies
DPA 2018 s. 157 for PECR purposes: **s. 157(1) is omitted**, and **s. 157(2) — the *standard*
maximum amount — is modified to cover infringements of "regulation 5, 6, 7, 8, 14, 19, 20, 21, 21A,
21B, 22, 23, 24 or 32B(4) or (5)"**. A new subsection applies the **higher** maximum to one thing
only: *"In relation to an infringement of section 142(8B) of this Act, the maximum amount of the
penalty … is the higher maximum amount."* s. 142(8B) is a confidentiality breach concerning
information notices — not a cookie failure.

Fetched `https://www.legislation.gov.uk/ukpga/2018/12/section/157`: **higher maximum = £17,500,000
or 4%**; **standard maximum = £8,700,000 or 2%**, whichever is higher, of total annual worldwide
turnover.

**The correction.** **A breach of PECR reg. 6 — the cookie rule the non-negotiable is about — carries
the *standard* maximum: £8.7m or 2% of turnover.** The 4% ceiling is unavailable for it. The
sentence in `CLAUDE.md` should read *up to 2% of turnover*, or drop the figure. `00-LEGAL-BASIS.md`
§2.1's `[TK]` can be closed with this answer.

The architectural conclusion is unaffected, exactly as §2.1 of that file predicted — but the number
is precisely the kind `CLAUDE.md` itself says is worse than no number, and it is in `CLAUDE.md`.

### 2.2 `ACCESSIBILITY-STATEMENT.md` publishes two contrast figures the gate contradicts

**What the draft says.** §3, under *"Automatically tested on every code change, blocking merge"*:
*"**Contrast**: 29 token pairs across 101 cells over four themes, checked against WCAG ratios."*
`CLAUDE.md` states the same two numbers as `check:contrast`'s literals.

**What the gate says.** `scripts/check-contrast.mjs:45-46`:

```
const EXPECTED_PAIRS = 36;
const EXPECTED_CELLS = 148;
```

with hard failures at lines 288 and 352 if the measured counts differ.

**The correction.** **36 pairs and 148 cells, not 29 and 101.** `CLAUDE.md`'s own arbitration rule —
*"Where a gate and the prose disagree, the gate is the source of truth and the prose gets
corrected"* — resolves this against the draft and against `CLAUDE.md`'s own paragraph. Both need
updating.

This one is not cosmetic. It is a specific, checkable number in a document that, once published to a
Press author, becomes a term of the contract under CRA 2015 s. 50 (§1.14) — and it is wrong.

### 2.3 `ACCESSIBILITY-STATEMENT.md`'s "14 routes" is wrong twice over

**What the draft says.** §3: *"**axe-core** across **14 routes** × 3 viewports × 2 consent phases"*.

**What the source says.** `scripts/check-axe.mjs`'s `ROUTES` array contains **15** entries:
`/`, `/design`, `/digital`, `/press`, `/work`, `/work/brand-website-and-launch-book`, `/about`,
`/approach`, `/insights`, `/legal/privacy`, `/contact`, `/_kitchen-sink`, `/_master-sink`,
`/_gridsmith-404-probe`, `/gridsmith-error-probe`.

**The correction, and the second problem.** The count is **15**. More importantly, **four of the
fifteen are internal harness pages** — a primitives kitchen sink, a composed-components sink, a 404
probe and a deliberately-throwing error probe. A reader of a public accessibility statement takes
"14 routes" to mean fourteen pages they could visit. **The number of public pages audited is ten.**
State it as *"ten public routes plus five internal probe routes"*, or as *"fifteen routes, of which
ten are public"* — but not as a bare count that reads as public coverage it does not have.

The claim as drafted is more favourable than the evidence, in the one document whose entire revision
rationale was removing claims more favourable than the evidence.

### 2.4 The excludable part of E-Commerce reg. 11 is misidentified

**What is claimed.** `L-ECOM-9-11`: *"regs. 9(1) and 11(1)(b) may be excluded by agreement where the
parties are not consumers."* `MSA-BUSINESS.md` clause 15.1 contracts on exactly that basis:
*"regulations 9(1) and 11(1)(b) … do not apply."*

**What the primary source says.** Fetched
`https://www.legislation.gov.uk/uksi/2002/2013/regulation/11/made`. Reg. 11 opens: *"**Unless parties
who are not consumers have agreed otherwise**, where the recipient of the service places his order
through technological means, a service provider shall — (a) acknowledge receipt … (b) make available
… technical means allowing him to identify and correct input errors …"* The conditional governs
**the whole of paragraph (1)**, both limbs. Reg. 9(2) is likewise excludable on the same words.

**The correction.** The excludable set is **regs. 9(1), 9(2) and 11(1) in full** — not "11(1)(b)".
Clause 15.1 as drafted disapplies less than the parties can disapply, and cites a sub-paragraph
division the regulation does not draw. (Clause 15.2's voluntary undertaking to acknowledge receipt
is unaffected and remains sensible.)

### 2.5 Neither the ledger nor any draft mentions the email carve-out that may make clause 15 unnecessary

**What the primary source says.** **Reg. 9(4)**: *"The requirements of paragraphs (1) and (2) above
shall not apply to contracts concluded exclusively by exchange of electronic mail or by equivalent
individual communications."* **Reg. 11(3)** is in identical terms for reg. 11(1).

**Why it matters here.** `MSA-BUSINESS.md` clause 3.1 has work beginning on *"a written Scope"*, and
`01-FACTUAL-INVENTORY.md` §7 records that nothing can be ordered on the website. A Gridsmith
contract concluded by exchanging emails is **already outside regs. 9(1), 9(2) and 11(1)** by
operation of reg. 9(4) and reg. 11(3), without any agreement to exclude them.

**The correction.** Add reg. 9(4) / reg. 11(3) to `L-ECOM-9-11`, and put the point to the solicitor:
clause 15 may be belt-and-braces over a carve-out that already applies. This is an omission from the
ledger, not an error in it — but it is the kind that leads a solicitor to bill for a clause the
statute did not require.

### 2.6 `L-DPA-FEE` cites the wrong Schedule

**What the ledger says.** *"reg. 2 (duty to pay), reg. 3 (amount), **Sch. 1 (tiers)**."*

**What the primary source says.** Fetched
`https://www.legislation.gov.uk/uksi/2018/480/contents/made`. SI 2018/480 has one Schedule, and it
is titled **"EXEMPT PROCESSING"** — two paragraphs, interpretation and exempt processing. The bands
are in **reg. 2(3)(b) and (c)** (§1.5); the charge amounts are in **reg. 3**.

**The correction.** *"reg. 2 (duty to pay and the bands), reg. 3 (amount), Sch. 1 (exempt
processing)."* Sch. 1 is in fact the more useful citation than the ledger realised — it is what
decides whether the fee is owed at all, which is the open question at `OQ-16`.

### 2.7 `L-CCR-29` overstates what triggers the 12-month extension, and understates its length

**What the ledger says.** *"**If the trader did not give the cancellation information required by
reg. 13, the period is extended — by up to 12 months (reg. 31).**"* Its status line calls this
something that *"follows automatically from a reg. 13 omission"*.

**What the primary source says.** Fetched
`https://www.legislation.gov.uk/uksi/2013/3134/regulation/31`. Reg. 31(1): *"This regulation applies
if the trader does not provide the consumer with the information on the right to cancel required by
**paragraph (l) of Schedule 2**, in accordance with Part 2."* Reg. 31(3): otherwise *"the
cancellation period ends at the end of 12 months after the day on which it would have ended under
regulation 30."*

**The correction, two parts.** (a) The trigger is failure to give **the Sch. 2 para. (l)
right-to-cancel information specifically** — not any reg. 13 omission. Omitting, say, the complaints
policy from the Sch. 2 list does not extend the cancellation period. (b) Where the information is
never given, the extension is a **flat 12 months added to the ordinary period** — i.e. 12 months and
14 days in total — not *"up to"* 12 months. "Up to" is accurate only for reg. 31(2), where late
provision cuts it to 14 days from receipt.

`CONSUMER-TERMS.md` §5.1's **customer-facing text is fine as drafted** — it names "the cancellation
information required by regulation 13", which is how Sch. 2 para. (l) is in fact delivered. It is
the ledger's general framing, and the inline comment repeating it, that need tightening.

### 2.8 `MSA-BUSINESS.md` 6.4 attributes the 8% to the wrong instrument

**What the clause says.** *"Gridsmith may charge statutory interest and compensation under the **Late
Payment of Commercial Debts (Interest) Act 1998** — interest at 8% above the Bank of England base
rate, plus the fixed statutory recovery sum."*

**What the primary source says.** Fetched `https://www.legislation.gov.uk/ukpga/1998/20/section/6`:
*"The Secretary of State shall by order made with the consent of the Treasury set the rate of
statutory interest…"* — **the Act sets no rate.** The 8% is in **SI 2002/1675 art. 4** (§1.27).

**The correction.** Cite the Act **and** the Order. And note the mechanic the clause elides: the rate
is fixed by reference to the base rate in force on 30 June or 31 December and holds for the
following six months — not the base rate on the day the invoice falls due.

### 2.9 `MSA-BUSINESS.md` 6.4's "the fixed statutory recovery sum" — there are three, plus costs

**What the primary source says.** s. 5A(2) (§1.26): **£40 / £70 / £100** by debt band. **s. 5A(2A)**
adds *"a sum equivalent to the difference between the fixed sum and those costs"* where reasonable
recovery costs exceed the fixed sum.

**The correction.** The definite singular is wrong, and the clause gives away s. 5A(2A) by not
mentioning it. Draft it as *"the fixed sum under s. 5A(2) appropriate to the debt, and any further
reasonable recovery costs under s. 5A(2A)."*

### 2.10 `WEBSITE-TERMS.md` §3's machine-learning bullet is unenforceable in part — and the draft's own open question is now answered

**What the draft says.** §3 prohibits using site content *"to train, fine-tune or evaluate any
machine learning model without our written permission"*, and its comment asks the solicitor to
*"confirm … whether the text-and-data-mining bullet is effective against the UK TDM exception."*

**What the primary source says.** Fetched
`https://www.legislation.gov.uk/ukpga/1988/48/section/29A`. s. 29A permits copying for computational
analysis by a person with lawful access, *"for the sole purpose of research for a non-commercial
purpose"*, with acknowledgement. **s. 29A(5)**: *"To the extent that a term of a contract purports to
prevent or restrict the making of a copy which, by virtue of this section, would not infringe
copyright, that term is unenforceable."*

**The correction.** The bullet is **unenforceable to the extent it restricts non-commercial research
TDM by someone with lawful access**, and **fully effective against commercial model training**,
which is the case that actually concerns Gridsmith. Answer the question in the comment rather than
asking it, and consider narrowing the bullet to commercial training so the clause does not carry a
limb a court will strike.

### 2.11 `PRIVACY-POLICY.md` §2's "accepted by the schema but not sent" list is incomplete

**What the draft says.** *"`role`, `track`, `service_slug` and a `payload` field are accepted by the
database schema but no form on the site sends them."*

**What the source says.** `lib/leads/schema.ts` also accepts **`source`, `medium`, `campaign`,
`referrer`, `landing_page`, `is_ai_referral`** — and `lib/leads/action.ts:51-52` **reads `referrer`
and `landing_page` out of the submitted `FormData`**. `components/leads/ContactForm.tsx` renders no
input for any of them, so nothing populates them from the site today; but the server action will
accept and store them from any client that posts them.

**The correction.** Either complete the list, or replace the enumeration with the general statement —
*"the database schema accepts several attribution and routing fields that no form on this site
sends"* — since an enumerated list in a privacy notice reads as exhaustive and this one is not.
Attribution URLs in `referrer` / `landing_page` are also the fields most likely to become personal
data if they ever start arriving.

### 2.12 The "two scripts are requested" claim is environment-dependent and is stated unconditionally

**What the drafts say.** `COOKIE-POLICY.md` §4 and `PRIVACY-POLICY.md` §6A both state flatly that on
Accept *"two scripts are requested — `googletagmanager.com/gtag/js` and
`eu.i.posthog.com/static/array.js`."*

**What the source says.** `lib/analytics/load.ts:70-83` guards both injections:
`if (GA4_ID) inject(...)` and `if (POSTHOG_KEY) { … inject(...) }`. `lib/analytics/config.ts` derives
both from `NEXT_PUBLIC_*` variables defaulting to `''`. In `.env.local` both **are** set, so the
observation the drafts record is a true observation **of the development environment**. In an
environment where they are unset, **zero** scripts are requested on Accept and the paragraph is
wrong in the visitor's favour.

**The correction.** Say what determines it: *"where analytics ids are configured for the
environment, accepting requests two scripts…"* This matters at publication, because the live
platform environment is a different set of variables from `.env.local` and nobody has set them yet.

### 2.13 The repository contradicts the drafts on whether GA4 sets a cookie once loaded

`lib/analytics/load.ts`'s own docstring states: *"A script that is present and told not to record has
already made the request and, **for GA4, already set the cookie**."* Both drafts assert the opposite —
that after Accept *"no analytics cookie is set"*.

The drafts are consistent with the observation recorded in `01-FACTUAL-INVENTORY.md` §1.3 (no
configuration call, so `window.gtag` never exists and the tag never self-configures), and that is
the better view. But **a published cookie policy should not rest on a proposition the codebase
contradicts in a comment**, and this pass did not drive a browser to settle it. Resolve the
contradiction — fix the docstring or fix the policy — before publication, and re-run the §2/§3/§4
cookie tables in a browser as the policy's own standing instruction already requires.

### 2.14 Two minor mis-descriptions of provisions that are otherwise correctly used

- `L-DMCC-230` heads s. 230 *"material information in an invitation to purchase"*. Its actual
  heading is **"Omission of material information from invitation to purchase"**. The substance in
  the entry is right.
- `L-CA-82 / L-TDR-24` quotes *"Every company shall disclose its registered name on its websites"* as
  reg. 24. It is **reg. 24(2)**; reg. 24(1) is the letters-and-invoices limb.

### 2.15 Every URL cited in the ledger that this pass tested resolved to the provision claimed

Nineteen distinct `legislation.gov.uk` URLs and the W3C Recommendation were fetched. **No
unresolvable URL and no URL pointing at the wrong provision was found.** One 404 was encountered
during this pass —`.../uksi/2018/480/schedule/1/made` — but that URL appears in **this report's
investigation**, not in the ledger, and the correct path was reached via the contents page. The
ledger's link hygiene is good.

---

## 3. Ledger obligations with no clause in any draft

**Mechanically: none.** All 33 ledger headings (31 obligations plus the `L-DUAA-COMMENCEMENT`
baseline and the combined `L-CA-82`/`L-TDR-24` entry) were grepped against the six drafts, and each
appears in at least one. Placement is sensible throughout: `L-CCR-13/29/40` only in
`CONSUMER-TERMS.md`, `L-WCAG-22` only in `ACCESSIBILITY-STATEMENT.md`, `L-GDPR-RIGHTS` and
`L-GDPR-5-1e` only in `PRIVACY-POLICY.md`.

**On reading, one obligation inside a cited entry has no clause anywhere:**

**3.1 UK GDPR Art. 13(2)(e) — statutory or contractual requirement, and the consequences of not
providing.** `L-GDPR-13` is cited in four documents, and the entry's own "what it requires" field
lists this limb. Verified at source (§1.4): Art. 13(2)(e) requires the controller to state *"whether
the provision of personal data is a statutory or contractual requirement, or a requirement necessary
to enter into a contract, as well as whether the data subject is obliged to provide the personal
data and of the possible consequences of failure to provide such data."*

**`PRIVACY-POLICY.md` contains no such statement.** §2 lists what is collected, §3 lists lawful
bases, and neither says that providing name and email is a contractual precondition of receiving a
response, nor what happens if you decline. This is a one-sentence addition and is the only Art. 13
limb missing from the notice. It is not marked `[TK]`, so nobody is currently tracking it.

**The remaining obligations are cited but expressly not discharged — which is correct drafting, not a
gap.** Each names its own failure and marks it `[TK]` or `[DECISION REQUIRED]`, so a solicitor sees
it:

| Obligation | Cited at | Why not discharged |
|---|---|---|
| `L-DPA-164A` | 4 drafts | No complaints route, no electronic form. **Build task.** |
| `L-GDPR-5-1e` | Privacy §7 | No period stated, no purge job exists |
| `L-GDPR-28` | Privacy §6, MSA 10.3 | No DPA recorded for any processor |
| `L-GDPR-44A` | Privacy §6C, MSA 10.4 | Four processor regions unestablished |
| `L-VAT-CONSUMER` / `L-VAT-B2B` | 4 drafts | `M-P2-3` not built; VAT sentence is `[TK]` |
| `L-ECOM-6` reg. 6(1)(g) | 4 drafts | Footer publishes `[SEED] GB123456789` |
| `L-DPA-FEE` | Privacy §1A | Owner fact, unknown |
| `L-PECR-CONSENT-EVIDENCE` | Cookie §7, Privacy §11A | `consent_events` not built |
| `L-GDPR-30` | Privacy §12A | No ROPA; correctly noted as internal, to be deleted from the published version |
| `L-CRA-57` | 4 drafts | The one-slug problem — **routing task, no clause can fix it** |

Two of these — `L-DPA-164A` and `L-CRA-57` — are build and routing tasks that **no amount of
drafting will close**, and both are correctly identified as such by Pass 3.

*Minor and non-blocking:* `L-PECR-6`'s **Sch. A1 para. 6** (appearance and functionality) is inside a
cited entry and no draft engages it. `COOKIE-POLICY.md` §3 records that no preference cookie exists,
so nothing turns on it today — but para. 6 is the provision that would govern the inert
`functionality_storage` toggle if it ever gained a subject, and §4B's options should mention it.

---

## 4. Assertions with no citation at all

Pass 3's flagging discipline here is good: the drafts carry explicit `NO LEDGER ENTRY` comments at
every uncited legal statement, which is what made this sweep tractable. Eight items, verified at
source.

**4.1 CDPA 1988 s. 90(3) — SURVIVES, with one gap.** Verified verbatim (§1.23). `MSA-BUSINESS.md`
8.3's citation is correct and the clause is drafted to satisfy it. **The gap: clause 8.3 assigns
rights in deliverables that do not yet exist at signature.** That is an assignment of **future**
copyright, governed by **CDPA s. 91**, not s. 90(3). s. 91 also requires signed writing, so the
clause's form is likely adequate — but the citation is incomplete and s. 91's "prospective owner"
mechanics should be confirmed. Raise a ledger entry covering **s. 90(3) and s. 91**. The
electronic-execution question the draft raises is separate and remains properly open.

**4.2 UCTA 1977 — SURVIVES.** Verified (§1.24). s. 3 applies to the MSA's clause 11 limitations
because the MSA is written standard terms of business; s. 3(3) confirms the consumer side sits under
CRA 2015 s. 62 instead. Upgrade `00-LEGAL-BASIS.md` §1's *"treat the reasonableness test as
asserted, not verified"* to verified, and raise a ledger entry so `MSA-BUSINESS.md` clause 11 stops
being the only major liability clause in the set with no citation. The solicitor note attached to
11.3 — that a cap at fees paid may be unreasonable for an engineering drawing set — is a sound
question to be asking under s. 11.

**4.3 Provision of Services Regulations 2009 — SURVIVES.** Verified in force and reg. 8 read
(§1.25). `00-LEGAL-BASIS.md`'s PSR row is substantively correct. Two consequences the drafts have
not drawn: reg. 8(1)(l)'s price obligation is **a fourth instrument** reaching the same VAT/price
display problem as `L-ECOM-6`, `L-DMCC-230` and the CCRs; and reg. 8(1)(i) requires the general
terms and conditions to be made available, which `/legal/*` already does. Raise a ledger entry;
delete the health warning.

**4.4 Late Payment of Commercial Debts (Interest) Act 1998 — FIGURES SURVIVE, CITATION FAILS.**
See §1.26, §1.27, §2.8 and §2.9. 8% is real but lives in SI 2002/1675, not the Act; the "fixed
recovery sum" is three sums plus s. 5A(2A) costs. `00-LEGAL-BASIS.md`'s `[TK]` asking whether these
figures survive is now answered: the numbers do, the attribution does not.

**4.5 The PECR £17.5m / 4% ceiling — DOES NOT SURVIVE.** See §2.1. This is the one item in this
section that fails outright, and it is the one repeated as fact in `CLAUDE.md`. The correct standard
maximum for a reg. 6 breach is **£8.7m or 2% of total annual worldwide turnover**, whichever is
higher.

**4.6 Contracts (Rights of Third Parties) Act 1999 — SURVIVES, uncited and unflagged.**
`MSA-BUSINESS.md` 14.4 names the Act by statute. It is accurate and the exclusion is standard, but it
is the one named statutory reference in the drafts carrying **neither a ledger id nor a `NO LEDGER
ENTRY` flag** — it sits under a comment reading only *"boilerplate. Retained."* Flag it for
consistency with the discipline applied everywhere else.

**4.7 Common-law and boilerplate positions — correctly flagged, not verified, and appropriately
so.** Browsewrap acceptance (`WEBSITE-TERMS.md` §2), copyright subsistence and licence scope (§3),
sample-pack supply (§4), uptime (§8), unilateral variation (§13), choice of law and the consumer
protective jurisdiction rule (§14, `MSA-BUSINESS.md` 14.7, `CONSUMER-TERMS.md` 16.4), order of
precedence, change control, confidentiality, deemed acceptance and termination. Each carries an
explicit *no ledger entry* comment naming what it is and asking the solicitor to rule. **These are
correctly handled** — they are contract-drafting questions rather than statutory obligations, and
`00-LEGAL-BASIS.md` does not overstate them. One to draw out: `CONSUMER-TERMS.md` 16.4's
non-exclusive jurisdiction for Scottish and Northern Irish consumers is a **deliberate asymmetry**
against MSA 14.7's exclusive jurisdiction, and the solicitor should be told it is deliberate.

**4.8 `MSA-BUSINESS.md` Schedule A2's named standards — correctly flagged as unverifiable here.**
BS 8888, BS EN ISO 128, "relevant Eurocodes" and the RIBA Plan of Work are named as examples with a
`[TK]` invoking `CLAUDE.md`'s prohibition on inventing standards codes. **This pass did not verify
them** — they are behind BSI paywalls and, more importantly, the question is not whether the codes
exist but whether Gridsmith works to them, which is an owner fact. The flag is the right disposition.

---

## 5. VERDICT, one per document

### `WEBSITE-TERMS.md` — **ready for a solicitor**

Every `[TK]` is an **owner fact** — company number, registered office, VAT number or its removal,
contact email and phone, business hours, effective date — or a **build fact the draft correctly
refuses to assert** (clause 5's estimating tools and clause 4's sample flow, both marked as
describing services that do not exist). Nothing is a legal gap disguised as a marker. Clause 5A's
VAT `[DECISION REQUIRED]` sets out three options with their consequences and identifies option (c) as
the only one satisfying both audiences; that analysis is correct at source (§1.12, §1.18).

**Give the solicitor two corrections with it:** §3's machine-learning bullet is unenforceable to the
extent it restricts CDPA s. 29A non-commercial research TDM and should probably be narrowed to
commercial training (§2.10) — the draft asks this question and it is now answered; and §7's *"a
disclaimer does not undo it"* should acknowledge CRA s. 50(2) (§1.14). Neither blocks review.

### `PRIVACY-POLICY.md` — **needs another pass**

Substantively the strongest of the six on the law — Chapter V, s. 164A, Art. 7(1) and the retention
position are all drafted to correctly-verified provisions, and the revision-1.1 corrections removed
real inaccuracies. Three defects stop it here:

1. **Art. 13(2)(e) has no clause anywhere in the notice** (§3.1). This is the only missing Art. 13
   limb, it is one sentence, and — unlike every other gap — **nothing is tracking it**.
2. §2's enumerated "accepted but not sent" list omits six fields, two of which the server action
   actively reads from submitted form data (§2.11).
3. §6A states the two-script behaviour unconditionally when it is conditional on environment
   variables that are unset on the platform the notice will be published from (§2.12).

All three are quick. The document's many `[TK]`s are correctly-marked owner facts and unresolved
build decisions and are **not** the reason for this verdict.

### `COOKIE-POLICY.md` — **needs another pass**

The legal spine is right: reg. 6 as substituted, Sch. A1 para. 4 for `gs_consent`, Art. 7(3) parity,
and §7's honest admission that Art. 7(1) is not satisfied. §2's cookie table matches
`lib/consent/state.ts` attribute for attribute (§1.28), and correcting version 1.0's five phantom
cookies was the right call.

Held back by three things:

1. §4's unconditional two-script claim (§2.12), in the document where a visitor will read it most
   literally.
2. `lib/analytics/load.ts`'s docstring asserts GA4 sets a cookie once present, contradicting §2's
   *"complete list"* and §4's *"no analytics cookie is set … in any state"* (§2.13). One of the two
   is wrong and this pass could not settle it from source.
3. **The ICO quotations in §4A were not independently verified by this pass.** They are the
   evidential basis for a `[DECISION REQUIRED]` that determines whether the site runs analytics on
   consent or on the para. 5 exception. They are correctly labelled as regulator guidance rather
   than statute — which was the specific thing this pass was asked to check, and it **holds** — but
   the quotations themselves need a second reader before that decision is taken on them.

§4B's treatment of the two inert toggles is exactly right and should survive review unchanged.

### `ACCESSIBILITY-STATEMENT.md` — **needs another pass**

Ironic and unambiguous. This is the document whose entire revision rationale was *"Every claim below
is either evidenced or removed"*, and whose §2 contains the single best-reasoned legal paragraph in
the set (§1.22). Its §3 evidence list then publishes **two specific numbers that its own gates
contradict**:

- *"29 token pairs across 101 cells"* against `EXPECTED_PAIRS = 36` / `EXPECTED_CELLS = 148` (§2.2);
- *"14 routes"* against 15 entries, **only ten of which are public pages** (§2.3).

Under CRA 2015 s. 50 — verified at §1.14 and invoked by this document's own preamble — those are
written statements about the service that a consumer may take into account. The route count in
particular claims public coverage the gate does not provide.

Everything else is right: §4's four known limitations are accurate (`/legal/privacy` really is the
only legal route in `ROUTES` — §1.35), §6's refusal to imply screen-reader testing is correct, and
the §2 `[DECISION REQUIRED]` correctly rules out "conformant". Fix the two numbers and this becomes
the strongest document in the set.

### `MSA-BUSINESS.md` — **needs another pass**

Four citation defects, none fatal, all cheap:

1. **6.4** attributes the 8% rate to the 1998 Act; it is SI 2002/1675 art. 4 (§2.8).
2. **6.4** says *"the fixed statutory recovery sum"*; there are three bands plus s. 5A(2A) recovery
   costs, which the clause gives away by omission (§2.9).
3. **15.1** disapplies *"regulations 9(1) and 11(1)(b)"*; the excludable set is regs. 9(1), 9(2) and
   the whole of 11(1) (§2.4) — and **regs. 9(4) and 11(3) may already exclude all of it** for a
   contract concluded by email, which is how Gridsmith actually contracts (§2.5).
4. **8.3** cites CDPA s. 90(3) correctly but assigns future copyright, which is **s. 91** (§4.1).

Two positives worth recording: clause 11's UCTA basis **is verified** (§1.24) and can lose its health
warning; and 16.1's corporate-subscriber position **is verified** against PECR reg. 23 (§1.9), closing
`CNV-3`.

The one-slug `[DECISION REQUIRED]` at the head is correctly stated, correctly grounded in a verified
s. 57 (§1.15), and correctly identified as unfixable by drafting — `lib/legal/slugs.ts` really does
declare five slugs (§1.35). It is a routing decision for the owner, not a reason to withhold the
document from a solicitor.

### `CONSUMER-TERMS.md` — **ready for a solicitor**

The best-drafted instrument in the set against the law as verified. §6 implements every element of
reg. 36 including the acknowledgement limb at reg. 36(2) that is most often missed (§1.17). §7.5 is
an accurate statement of reg. 40 including the pre-ticked-box exclusion (§1.16). §3's Sch. 2 list is
complete and includes the model cancellation form, which is appended. §13's deliberate absence of a
monetary cap is right under s. 57 (§1.15). §15.1's individual-subscriber position is right under
reg. 22 (§1.8).

Every `[TK]` is an owner fact — company number, registered office, email, phone, ADR provider,
interest rate, complaint response time — or a correctly-flagged build fact (clause 4's non-existent
estimator, §3's VAT-inclusive price the site does not yet show, §12.1's missing complaint form).
**None is a legal gap.**

**One precision note to pass on:** §5.1's inline comment describes reg. 31 as following from *"a
reg. 13 omission"* generally; the trigger is the Sch. 2 para. (l) cancellation information
specifically, and where it is never given the extension is a flat 12 months rather than *"up to"*
12 months (§2.7). **The customer-facing sentence itself is fine** — this is a comment-level
correction and does not hold the document back.

---

## Summary

| Section | Count |
|---|---|
| 1 — Assertions that HOLD | **35** |
| 2 — Assertions that DO NOT HOLD | **15** |
| 3 — Ledger obligations with no clause | **1** (Art. 13(2)(e)); 10 further cited-but-not-discharged, all correctly flagged |
| 4 — Assertions with no citation | **8** — 6 survive verification, 1 survives with an incomplete citation, **1 fails** (the PECR ceiling) |

**Ready for a solicitor:** `WEBSITE-TERMS.md`, `CONSUMER-TERMS.md`.
**Needs another pass:** `PRIVACY-POLICY.md`, `COOKIE-POLICY.md`, `ACCESSIBILITY-STATEMENT.md`,
`MSA-BUSINESS.md`.

**The three findings to act on first**, because each is a specific number or provision that is wrong
rather than merely absent:

1. **`CLAUDE.md`'s "PECR penalties are now up to 4% of turnover" is wrong** — a reg. 6 breach
   carries the standard maximum, 2% or £8.7m. It is stated as fact in the project's own governing
   file (§2.1, §4.5).
2. **`ACCESSIBILITY-STATEMENT.md` publishes 29/101 where the gate holds 36/148**, and `CLAUDE.md`
   repeats the wrong pair (§2.2).
3. **`ACCESSIBILITY-STATEMENT.md`'s "14 routes" is 15, of which only 10 are public pages** (§2.3).

All three are instances of the same class `CLAUDE.md` names: *a specific-looking number that no gate
verifies is worse than no number, because it stops anyone re-deriving it.* Two of them are in
`CLAUDE.md` itself.

**The ledger came through well.** Of 33 entries, every commencement date, every substituted or
omitted provision, every quoted phrase tested, and every URL tested was correct. Its four defects
(§2.4, §2.6, §2.7, §2.14) are precision errors in entries whose substance is right, and its two
open items `CNV-3` and — for the penalty ceiling — `CNV-1`'s neighbourhood are now closed by this
pass. Pass 2's decision to treat `00-LEGAL-BASIS.md` as an unverified assertion rather than a source
was correct and is what kept the PECR figure flagged long enough to be caught here.

---

*End of verification report. Nothing in `_legal/` was edited by this pass, and nothing was
committed.*
