# Website Terms of Use — DRAFT for solicitor review

> **[SEED - SOLICITOR REVIEW REQUIRED]**
> This is a draft prepared for a qualified UK solicitor to review, amend and adopt. It is not legal
> advice and must not be published unreviewed. `legalDocument.solicitorApproved` gates publication.

**Version:** 1.1 · **Effective from:** `[TK]` · **Status: DRAFT**
**Revised 25 August 2026 against `02-CITATION-LEDGER.md`.** Every clause below carries an inline
comment naming the ledger entry it implements, or is flagged as having none.

These terms govern use of gridsmith.uk. They do **not** govern services we provide — those are covered
by the Master Services Agreement (business clients) or the Consumer Terms (individual clients).

> **[DECISION REQUIRED] — audience of this document.** These website terms are served at
> `/legal/terms` to **both** audiences (`01-FACTUAL-INVENTORY.md` §5.1: `/`, `/contact` and every
> `/legal/*` page mix consumer and business visitors). Options:
> **(a)** keep one instrument and mark each clause that diverges — as clause 11 does — which is what
> this draft does;
> **(b)** split into a consumer-facing and a business-facing terms of use, which requires a sixth
> legal slug (`lib/legal/slugs.ts` declares five).
> Consequence of (a): every limitation must be read down for consumers, and clause 11 is the only
> place that currently happens. Consequence of (b): build work, and a routing decision about how a
> visitor reaches the right one.

---

## 1. Who we are
<!-- L-CA-82 -->
<!-- L-TDR-24 -->
<!-- L-TDR-25 -->
<!-- L-ECOM-6 -->

This site is operated by **Gridsmith Ltd**, a company registered in England & Wales, company number
`[TK — 17050842 is seeded at scripts/seed-company-details.mjs but is not distinguished there from the
values explicitly marked [SEED]; owner confirmation required, OQ-15]`, registered office
`[TK — 30 Briarfield Road, Farnworth, Bolton, BL4 0HD, same confirmation required, OQ-15]`.

**VAT.** `[TK — the site currently renders the fabricated value "[SEED] GB123456789" in the footer of
every page (01-FACTUAL-INVENTORY.md §6.1). That is a false disclosure, and a false VAT number is a
worse defect than a missing one. See the decision below.]`

> **[DECISION REQUIRED] — the VAT number.** Options:
> **(a)** the company is VAT-registered: supply the real number, and it is disclosed here and in the
> footer under `L-ECOM-6` reg. 6(1)(g);
> **(b)** the company is not VAT-registered: **publish no VAT number at all** and remove the field
> from `companyDetails` rendering. reg. 6(1)(g) requires the number only "where the provider
> undertakes an activity subject to VAT".
> Consequence of doing neither: the running site continues to publish a fabricated registration
> number on every page. `check:launch-content` blocks a `production` dataset carrying it, so this
> cannot ship — but it is live in `development` today.

We trade as **Gridsmith Design**, **Gridsmith Digital** and **Gridsmith Press**. These are trading
divisions of Gridsmith Ltd, not separate companies. Any contract you enter is with Gridsmith Ltd.
<!-- L-CA-82 -->

Contact: `[TK email — contact@gridsmith.uk is recorded as a real address at
scripts/seed-company-details.mjs:44-49]` · `[TK phone — the companyDetails.contactPhone field exists in
the Sanity schema and is never populated; there is no telephone route on the site today, OQ-17]`
<!-- L-ECOM-6 -->

## 2. Acceptance
<!-- NO LEDGER ENTRY: browsewrap acceptance is a common-law contract-formation point, not a statutory
obligation in the ledger. Retained because deleting it would leave the terms with no stated basis for
binding a visitor at all. The solicitor should rule on whether use-implies-acceptance is adequate. -->

By using this site you accept these terms. If you do not accept them, please do not use the site.

## 3. Our content
<!-- NO LEDGER ENTRY: copyright subsistence and the scope of a permitted-use licence are CDPA 1988
matters. The ledger contains no CDPA entry — 00-LEGAL-BASIS.md §1 asserts CDPA s.90(3) but Pass 2
raised no entry for it. Retained; the solicitor should confirm the licence scope and whether the
text-and-data-mining bullet is effective against the UK TDM exception. -->

All content on this site — text, images, drawings, book covers, code, design and layout — is owned by
Gridsmith Ltd or our clients, and is protected by copyright.

You may view it and print or download extracts for your own non-commercial reference. You may not:

- reproduce, republish or redistribute it commercially
- remove or alter any watermark, copyright notice or attribution
- use it to train, fine-tune or evaluate any machine learning model without our written permission
- systematically extract or scrape it

Portfolio and sample work is shown for assessment purposes. **It remains the property of Gridsmith Ltd
or the relevant client**, and no licence to use it is granted by its appearance here.

## 4. Sample materials
<!-- NO LEDGER ENTRY: no ledger obligation covers sample-pack supply. Retained as a contractual term.
[TK] — 01-FACTUAL-INVENTORY.md §7 records the sample-request flow as SPECIFIED-BUT-NOT-BUILT: there is
no sample-request route on the site. This clause describes a service that does not exist yet. -->

Where we provide sample drawings, sample reports or other materials on request, they are supplied for
the purpose of assessing our work only. They must not be reused, circulated, or presented as your own
or anyone else's work. Sample materials are redacted and watermarked, and access links expire.

## 5. Estimating tools
<!-- L-CRA-51 -->
<!-- L-CRA-52 -->
<!-- L-DMCC-230 -->

**`[TK]` — none of these tools exists.** `01-FACTUAL-INVENTORY.md` §7 records the estimator, the
drawing estimator and the Press Path Finder as **NOT BUILT**. This clause must either be removed until
they ship, or retained with the site not referring to them. A term describing a facility the site does
not provide is itself a statement about the service (`L-CRA-50`).

This site provides estimating and guidance tools, including a project estimator, a drawing estimator
and a publishing path finder.

**Their output is indicative only.** It is not a quotation, not an offer, and does not bind either of
us. Actual pricing follows a consultation and a written scope. Ranges are based on typical projects and
your actual project may fall outside them.
<!-- L-CRA-51 — for a consumer, where the contract does not fix the price, only a reasonable price is
payable; an indicative figure is not binding on the consumer either way. -->

We give no warranty that any estimate will match a final price.

**If you are a consumer**, an indicative figure does not become the price you must pay, and it does not
become a price ceiling in your favour either: where no price is agreed, the Consumer Rights Act 2015
s. 51 entitles you to pay only a reasonable price.
<!-- L-CRA-51 -->

## 5A. Prices shown on this site
<!-- L-ECOM-6 -->
<!-- L-VAT-B2B -->
<!-- L-VAT-CONSUMER -->
<!-- L-DMCC-230 -->

**NEW — added at revision 1.1. No clause previously addressed this and it is a live failure.**
`01-FACTUAL-INVENTORY.md` §5.3: every price on every division landing page is rendered by
`components/content/Price.tsx` and **"No VAT treatment is stated anywhere"** — no "inc. VAT", no
"exc. VAT", no footnote. The gap is recorded in the codebase as `M-P2-3` and is NOT BUILT.

Prices shown on this site carry an `INDICATIVE` badge and, where applicable, a "What moves it: …"
line. `[TK — VAT treatment sentence, per the decision below]`

> **[DECISION TAKEN — option (c). Owner, 26 August 2026.]** *Was `[DECISION REQUIRED]`. The options
> and their consequences are left standing below so the solicitor can see what was weighed.*
>
> **Decided:** option **(c)** — add the net/gross field to `pricingBlock` and render per division:
> inclusive on `/press`, labelled-exclusive on `/design` and `/digital`.
> **Reasoning:** it is the only option that satisfies the consumer-inclusive requirement
> (`L-VAT-CONSUMER`, Press) and the B2B labelling requirement (`L-VAT-B2B`, Design and Digital)
> **simultaneously**. (a) and (b) each fix one audience by breaking the other.
> **Not implemented.** This records the decision only. The rendering change is `M-P2-3`, a build
> task, and remains NOT BUILT — so both audiences still fail today, and the `[TK]` above stays open
> until it ships. **The second-order point below is unaffected and still open:** if the company is
> not VAT-registered there is no VAT to state and the correct label is different again.
>
> **[DECISION REQUIRED — as it stood] — VAT display, and it splits by audience.**
> `L-VAT-B2B` (SI 2002/2013 reg. 6(2)) requires that a price **state its treatment** — a VAT-exclusive
> price is permitted for Design and Digital, provided it says so.
> `L-VAT-CONSUMER` (DMCCA 2024 s. 230 with the CCRs Sch. 2) requires a price shown to a **consumer** to
> be the **total price inclusive of tax**, or to state how it will be calculated, with the calculation
> information given as much prominence as the figure.
> **Press is consumer-facing and uses the same `Price` component as the B2B divisions.** Options:
> **(a)** label everything "exc. VAT" — fixes Design and Digital, **breaks Press**;
> **(b)** show everything inclusive — compliant everywhere, but misstates the commercial position for
> B2B buyers who recover VAT;
> **(c)** add the net/gross field to `pricingBlock` (`sanity/schemas/objects.ts:81-95`) and render per
> division: inclusive on `/press`, labelled-exclusive on `/design` and `/digital`. This is `M-P2-3`.
> Option (c) is the only one that satisfies both entries. Until it is built, both audiences fail, and
> they fail for different reasons.
> **Second-order:** if the company is not VAT-registered (see clause 1), there is no VAT to state and
> the correct label is different again. The two decisions are linked.

## 6. Enquiries
<!-- L-ECOM-9-11 -->
<!-- L-CRA-50 -->

Submitting an enquiry does not create a contract. It is an invitation for us to respond.

**Our response commitment: we will reply as soon as we can, and always by the end of the next business
day.** Business days are Monday to Friday excluding England and Wales bank holidays.
<!-- L-CRA-50 — this is a written statement about the service which a consumer may take into account,
and is therefore a term of any consumer contract that follows. It is single-sourced from
companyDetails.responseCommitment (01-FACTUAL-INVENTORY.md §6.2) and is genuine. -->
<!-- L-ECOM-9-11 — regs. 9 and 11 are not engaged today: no contract is concluded by electronic means
on this site (the estimator is NOT BUILT). They become mandatory for consumers, and disapplicable by
agreement between businesses, the moment an order can be placed online. -->

`[TK — "business days" is referred to here and the companyDetails.businessHours field is never
populated (OQ-17). Either populate it or state the hours in this clause.]`

## 7. Accuracy
<!-- L-CRA-50 -->
<!-- L-DMCC-230 -->

We take care to keep information on this site accurate and current, but we do not warrant that it is
complete or error-free. Pricing, availability and service descriptions may change.

Where content is marked as indicative, illustrative or placeholder, it should not be relied on.

> **`[TK]` — this clause cannot do the work being asked of it.** `01-FACTUAL-INVENTORY.md` §6.5
> records that `[SEED]` content is **live on the running site today**: case-study metrics render as
> `[SEED] 00%`, selected work is `[SEED]`-prefixed, team members are `[SEED] Placeholder Name`, prices
> are `£0,000`. Under `L-CRA-50` each of those is a written statement about the trader or the service
> which a consumer may take into account, and a disclaimer does not undo it. The mitigation is
> `check:launch-content`, which refuses a `production` dataset carrying `[SEED]` markers — a build
> gate, not a term. This clause must not be relied on as the answer to seed content.

## 8. Availability
<!-- NO LEDGER ENTRY: no statutory obligation governs uptime for a free marketing website. Retained;
for consumers it is read subject to clause 11 and the CRA 2015. -->

We aim to keep the site available but do not guarantee uninterrupted access. We may suspend, withdraw
or change any part of it without notice.

## 9. Links
<!-- L-DMCC-SCH20-13 -->

Links to other websites are provided for convenience. We have no control over their content and accept
no responsibility for it.

Where we link to a retailer to allow you to verify a published book, we receive no commission. Those
links exist so you can check our work independently.
<!-- L-DMCC-SCH20-13 — the no-commission statement is the disclosure limb: an incentivised or
commissioned recommendation presented as independent is a banned practice. This statement must remain
true; if an affiliate link is ever introduced it must be disclosed. -->

## 10. Your conduct
<!-- L-GDPR-32 -->

You must not misuse this site — no attempts to gain unauthorised access, no malicious code, no denial
of service, no automated scraping, and no submission of false information through our forms.
<!-- L-GDPR-32 — Art. 32(1) security. Note the build-side gap the ledger records: there is no
honeypot, no rate limit and no CAPTCHA on the enquiry endpoint (01-FACTUAL-INVENTORY.md §3.3), which
is the one path an anonymous visitor may write to. A contractual prohibition is not a technical
measure and does not satisfy Art. 32. -->

## 11. Liability
<!-- L-CRA-57 -->
<!-- L-CRA-49 -->

Nothing in these terms limits our liability for death or personal injury caused by negligence, for
fraud or fraudulent misrepresentation, or for anything else that cannot lawfully be limited.

**If you are a business user**, and subject to the paragraph above, we exclude liability for loss
arising from use of this site, including loss of profit, business, data or goodwill, and any indirect
or consequential loss.
<!-- NO LEDGER ENTRY for the B2B reasonableness test: 00-LEGAL-BASIS.md §1 asserts UCTA 1977 applies to
B2B limitations, and Pass 2 raised no ledger entry for UCTA. The exclusion is retained and flagged so
the solicitor can supply the citation and test it. -->

**If you are a consumer**, nothing in these terms affects your statutory rights, and the exclusion in
the paragraph above does not apply to you.
<!-- L-CRA-57 — a term is not binding to the extent it would exclude or restrict liability under
CRA 2015 s. 49 or s. 50, or prevent recovery of the price paid. A B2B-shaped exclusion applied to a
consumer is void to that extent, so it is disapplied here expressly rather than left to be read down. -->

## 12. Data protection
<!-- L-GDPR-13 -->
<!-- L-PECR-6 -->

See our Privacy Policy and Cookie Policy.

## 12A. Data protection complaints
<!-- L-DPA-164A -->

**NEW — added at revision 1.1.** Since **19 June 2026** we have been under a duty to facilitate the
making of data protection complaints, to acknowledge receipt within 30 days, and to respond. The
procedure is at **Privacy Policy §12**.
<!-- L-DPA-164A — DPA 2018 s. 164A, inserted by DUAA 2025 s. 103, in force 19 June 2026 per SI 2026/82
reg. 3. It commenced after this document's previous revision date, which is why no clause existed. -->

## 13. Changes
<!-- NO LEDGER ENTRY: unilateral variation of published website terms. Retained. For consumers a
unilateral variation clause is assessed for fairness under CRA 2015 Part 2; the solicitor should
confirm this formulation survives that test. -->

We may amend these terms. The version in force is the one published here at the time you use the site.

## 14. Law and jurisdiction
<!-- NO LEDGER ENTRY: choice of law and jurisdiction, and the consumer protective jurisdiction rule.
Pass 2 raised no entry. Retained. -->

These terms are governed by the law of England and Wales. The courts of England and Wales have
exclusive jurisdiction, save that if you are a consumer resident elsewhere in the UK you may bring
proceedings in your own jurisdiction.

## 15. Accessibility
<!-- L-EQA-29 -->
<!-- L-EQA-20 -->

We have a duty under the Equality Act 2010 to make reasonable adjustments, and that duty is
**anticipatory** — it is owed to disabled people generally, not only to someone who asks. Our current
position, including what has and has not been tested, is set out in our Accessibility Statement.

---

**`[TK]` items in this document:** company number · registered office · VAT number (or its removal) ·
contact email · contact phone · business days/hours · effective date · whether clause 5 (estimating
tools) survives given none of the tools is built · clause 4's sample-request flow, which is also not
built · the VAT-treatment sentence in clause 5A.
