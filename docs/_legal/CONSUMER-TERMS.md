# Consumer Terms — DRAFT for solicitor review

> **[SEED - SOLICITOR REVIEW REQUIRED]**
> This is a draft prepared for a qualified UK solicitor to review, amend and adopt. It is not legal
> advice and must not be used unreviewed. `legalDocument.solicitorApproved` gates publication.

**Status: DRAFT. Not for use until reviewed and adopted by a qualified UK solicitor.**

**Version 1.1 — revised 25 August 2026 against `02-CITATION-LEDGER.md`.** Every clause carries an
inline comment naming the ledger entry it implements, or is flagged as having none. Clauses added at
this revision are marked **NEW**.

**Version 1.2 — revised 26 August 2026, round 8.** Two substantive corrections, each verified by
fetching the instrument rather than by accepting the finding that raised it: **§6** (reg. 36(2) makes
the loss of the cancellation right conditional on an acknowledgement as well as an express request —
the draft supplied only the request and stated the loss as automatic, against the consumer; and reg.
36(6) removes the §6(c) payment entirely where the information duties were not met) and **§10.3**
(the copyright assignment carried none of the CDPA s. 90(3) / s. 91 signed-writing language
`MSA-BUSINESS.md` 8.3 carries, so the consumer had the weaker transfer of the two). Clauses added or
rewritten at this revision are marked **NEW** or **REVISED**. One ledger entry was added to carry the
first — `L-CCR-36` — and `L-CDPA-90-91` now discharges §10.3, closing the `NO LEDGER ENTRY` flag it
stood under.

**For clients who are consumers** — individuals buying for purposes outside their trade, business, craft or profession. In practice this covers most individual authors and almost all memoir and legacy clients of Gridsmith Press.

**Do not use the Master Services Agreement with a consumer.** Several of its clauses — the liability cap, the deemed-acceptance provision, the exclusion of implied warranties — would be assessed against the Consumer Rights Act 2015 fairness test and are likely to fail. Using business terms with a consumer risks the terms being unenforceable and, separately, is the kind of behaviour the publishing market screens for.
<!-- L-CRA-57 — CRA 2015 s. 57: a term is not binding to the extent it would exclude or restrict
liability under s. 49 or s. 50, or prevent the consumer recovering the price paid. The MSA's clause
11.3 cap is void against a consumer to that extent. -->

## Who these terms govern

**These terms govern consumers** — individuals buying for purposes outside their trade, business,
craft or profession. In practice that is most individual authors and almost all memoir and legacy
clients of Gridsmith Press.

**They do not govern business clients.** If you are engaging us for a company, a partnership or your
own trade or profession, these are **not** your terms — yours are `MSA-BUSINESS.md`, at
`/legal/business-client-terms`. If you are not sure which you are, `/legal/client-terms` sets out the
difference and links to both.

> **[DECISION RECORDED] — owner, 26 August 2026. This document now has a route of its own.**
> <!-- L-CRA-57 -->
> It did not. Five legal slugs were declared and **both this document and `MSA-BUSINESS.md` mapped to
> the single `/legal/client-terms`**, whose seeded document mixed both regimes; nothing on the site
> distinguished a consumer author from a business buyer at any point. A Press author reading that page
> read terms drafted for a business, including a liability cap not binding on them under CRA 2015
> s. 57, **and could not tell.**
>
> Option (a) was taken: this document is published at **`/legal/consumer-client-terms`**,
> `MSA-BUSINESS.md` at `/legal/business-client-terms`, and `/legal/client-terms` survives as a
> disambiguation page carrying no operative clause rather than as a redirect — a redirect has to
> choose a target, and either choice lands one audience silently on the other's instrument.
>
> `/press` links here, to clause 10.1. `scripts/check-consumer-terms.mjs` asserts against the served
> pages that no consumer-facing route links to the business terms, that `/press` does link here, and
> that this document is still the consumer instrument. Each branch was proven by deliberate failure.
>
> **Still open, and it is `/contact`, not the legal routes.** One form still serves all three
> divisions (`01-FACTUAL-INVENTORY.md` §5.1), so nothing in the enquiry flow yet identifies which
> regime a buyer is in before an order is confirmed. `press/PRD.md` FR-P24 carries that requirement.

---

## 1. Who we are
<!-- L-CA-82 -->
<!-- L-TDR-25 -->
<!-- L-ECOM-6 -->
<!-- L-CCR-13 — Sch. 2 requires the trader's identity, geographical address and contact details before the consumer is bound. -->


**Gridsmith Ltd**, company number `[TK]`, registered office `[TK]`, trading as **Gridsmith Press**. Contact: `[TK email]` · `[TK phone]`.

## 2. Your statutory rights
<!-- L-CRA-49 -->
<!-- L-CRA-51 -->
<!-- L-CRA-52 -->
<!-- L-CRA-57 -->


Nothing in these terms affects your rights under the Consumer Rights Act 2015, the Consumer Contracts (Information, Cancellation and Additional Charges) Regulations 2013, or any other consumer protection law.

Under the Consumer Rights Act 2015 we must provide our services **with reasonable care and skill**, within a reasonable time, and at a reasonable price where none has been agreed. **We cannot and do not exclude that.**

If we do not, you are entitled to ask us to perform the service again, or to a price reduction, depending on the circumstances.

## 3. Before you order
<!-- L-CCR-13 -->
<!-- L-DMCC-230 -->
<!-- L-VAT-CONSUMER -->


Before you place an order we will give you, in writing:

- a description of the services
- the **total price**, including VAT and all charges — no fee will be introduced later that was not disclosed here
<!-- L-VAT-CONSUMER — DMCCA 2024 s. 230 with CCRs Sch. 2: a price shown to a consumer must be the
total price inclusive of tax, or state how it will be calculated, with the calculation information as
prominent as the figure. This clause is correct as drafted. **The website is not.**
`[TK — 01-FACTUAL-INVENTORY.md §5.3: every price on /press is rendered by the same
components/content/Price.tsx as the B2B divisions and states no VAT treatment at all. So these terms
promise a tax-inclusive total that the page the consumer read did not show. **The display decision is
now taken — option (c), per-division rendering, owner, 26 August 2026; see WEBSITE-TERMS.md clause 5A.
Press prices will be shown inclusive, which is what this clause promises. The build task is M-P2-3 and
it is still NOT BUILT, so this `[TK]` stays open until it ships.**]` -->
- how and when you pay
- how long the work will take
- the number of revision rounds included, and the cost of further rounds
- what is **not** included
- your cancellation rights (§5 and §6)
- our complaints procedure (§12)
- the **model cancellation form**, which is at the end of these terms
- that where the contract is concluded electronically, we will confirm your order on a durable medium
<!-- L-CCR-13 — reg. 13 with Sch. 2, and reg. 16 (confirmation on a durable medium). Two Sch. 2 items
were missing from version 1.0 and are added here. -->

## 4. The contract
<!-- L-ECOM-9-11 -->
<!-- L-CRA-50 -->


The contract is formed when we confirm your order in writing. Before that point, a quotation or estimate is not binding on either of us.

Any estimate produced by a tool on our website is **indicative only** and does not form part of the contract.

`[TK — no such tool exists. 01-FACTUAL-INVENTORY.md §7 records the Press Path Finder and every
estimator as NOT BUILT. This sentence must go, or the tools must ship.]`

**4.1 NEW — ordering online.** Where you place an order through our website:

- we will tell you the technical steps to conclude the contract, whether the concluded contract will
  be filed and whether it will be accessible, the technical means to identify and correct input
  errors before you order, and the languages the contract may be concluded in;
- any button that places you under an obligation to pay will be labelled unambiguously to say so;
- we will acknowledge your order without undue delay and confirm it on a durable medium.
<!-- L-ECOM-9-11 — regs. 9, 11 and 12. These are MANDATORY for a consumer and cannot be excluded by
agreement, unlike the business position at MSA-BUSINESS.md clause 15. -->
<!-- L-CCR-13 — reg. 14 (the order button) and reg. 16 (durable medium). -->
<!-- Not engaged today: nothing can be ordered on the website. It becomes engaged the day it can. -->

## 5. Your right to cancel
<!-- L-CCR-29 -->


You have the right to cancel this contract within **14 days** without giving any reason.

The cancellation period ends 14 days after the day the contract is made.

To cancel, tell us clearly — email `[TK email]` or write to us. You may use the model cancellation form at the end of these terms, but you do not have to.

**If you cancel, we will refund all payments received from you within 14 days** of being told, using the same payment method, at no charge to you.

**5.1 NEW — if we did not tell you about your cancellation right.** If we failed to give you the
cancellation information required by regulation 13 before you were bound, **your cancellation period
is extended — by up to 12 months**.
<!-- L-CCR-29 — reg. 31. This is the most expensive consequence in the consumer section and it follows
automatically from a reg. 13 omission, which is why it is stated to the consumer rather than left
implicit. -->

## 6. If you want us to start within the 14 days
<!-- L-CCR-29 -->
<!-- L-CCR-36 -->


**This section matters and we will draw your attention to it before you order.**

We know most people want work to begin promptly. But if we start during the 14-day cancellation period, the law requires us to make sure you understand what that means.

If you ask us to begin during the cancellation period:

- **(a)** you must ask us expressly, by ticking the specific box on the order confirmation. It is a
  separate box from accepting these terms, and we will not tick it for you;
- **(a1) REVISED — and you must acknowledge, in the same step, that you will lose your right to
  cancel once we have fully performed the service.** This is a second, separate confirmation from the
  request in (a). We will set it out in those words and we will not tick it for you either. **If you
  have not given it, (d) below does not apply to you and you keep your right to cancel.**
- **(b)** you still keep your right to cancel during the 14 days;
- **(c)** but if you cancel after we have started, **you must pay a proportionate amount for the work
  done up to the point you told us** — for the period the service was supplied, ending when you told
  us you were cancelling, and in proportion to what has been supplied against the full coverage of the
  contract. It is calculated on the total price agreed; if that price is excessive, it is calculated
  on the market value of the service supplied, judged against what other traders charge for the
  equivalent;
- **(d) REVISED — you lose the right to cancel only where all three of these are true:** the service
  has been **fully performed** within the 14 days, **and** performance began after your express
  request under (a), **and** it began with your acknowledgement under (a1). If any one of them is
  missing, **you keep the right to cancel.** We will tell you when we consider the service fully
  performed;
- **(e) NEW — and you pay nothing at all** for the service supplied in the cancellation period,
  in full or in part, if we failed to give you the cancellation information or the information about
  this payment that the law requires before you were bound, or if we supplied the service without your
  express request under (a). In that case (c) does not apply to you.

If you do not ask us to start early, we will begin after the 14 days have passed.

We will confirm all of this in your order confirmation email, in writing, before any work starts.
<!-- L-CCR-36 — revised 26 August 2026, round 8, reg. 36 read in full at source.
(a1) and the rewritten (d) implement **reg. 36(2)**, which makes the loss of the right conditional on
BOTH limbs: performance began "(a) after a request by the consumer in accordance with paragraph (1),
and (b) **with the acknowledgement that the consumer would lose that right** once the contract had
been fully performed by the trader." The previous (d) stated the loss as an automatic consequence of
full performance, which is the (b) limb omitted — and it stated it AGAINST the consumer, telling them
a right was gone that on these facts they may still have held.
(c) now states reg. 36(4)'s two limbs and reg. 36(5)'s calculation basis, which is the question the
solicitor note below asks about.
(e) implements **reg. 36(6)**: no cost at all where the Sch. 2 para. (l) cancellation information or
the para. (n) cost information was not given in accordance with Part 2, or where the service was not
supplied in response to a para. (1) request. It is the sibling of the reg. 31 consequence at §5.1 —
the same omission that extends the cancellation period by up to 12 months also wipes out the §6(c)
proportionate payment entirely.
`[TK — BUILD TASK, NOT A DRAFTING ONE. reg. 36(2)(b) is satisfied by an acknowledgement actually
given, not by a term reciting that one will be. The order flow must present the acknowledgement as a
second unticked control alongside the (a) request box, and must RECORD that it was given, with what
wording and when — the evidential position is the trader's to prove. Nothing on the site does this:
there is no order flow at all (01-FACTUAL-INVENTORY.md §7, and see clause 4.1, "not engaged today").
This task falls due the same day the (a) tick box does. Not built here; recorded so it is not built
without it.]` -->

> **For solicitor review:** this section implements regs 36–37 of the CCR 2013. Please confirm the
> express-request mechanism at (a), **the wording of the (a1) acknowledgement and how it is captured
> and evidenced**, and that the calculation method in (c) is defensible. This is the highest-frequency
> consumer exposure in the business.

## 7. Price and payment
<!-- L-VAT-CONSUMER -->
<!-- L-DMCC-230 -->
<!-- L-CCR-40 -->
<!-- L-CRA-51 -->


7.1 The total price is stated in your order confirmation and includes VAT where applicable.

7.2 **No charge will be added that was not disclosed before you ordered.** If the work you want changes, we will tell you the new price in writing and you decide whether to proceed.

7.3 Payment is as set out in the order confirmation — usually an initial payment and a balance on delivery.

7.4 If a payment is late we may charge interest at `[TK]% above the Bank of England base rate`. This reflects our actual cost and is not a penalty.

7.5 **NEW — no charge you did not agree to.** We will not add any payment beyond what you agreed
unless you have **expressly agreed to it**. We will never use a pre-ticked box or a default option you
have to turn off, and if we ever charged you that way you would be entitled to the money back.
<!-- L-CCR-40 — reg. 40: an additional payment requires express consent; consent inferred from a
default the consumer must reject does not count and the payment is recoverable. Recorded here so that
the estimator, when built, is not built with a default-on option. reg. 41 also caps any helpline at
basic rate — `[TK — there is no telephone contact route today (OQ-17); if one is added it must not be
a premium-rate number.]` -->

> **For solicitor review:** the interest rate must be a genuine pre-estimate of loss, not a deterrent, or it risks being an unfair term.

## 8. What we will do
<!-- L-CRA-49 -->
<!-- L-CRA-52 -->


8.1 We will provide the services described in your order confirmation, with reasonable care and skill.

8.2 We will keep you informed and give you the opportunities to review your work that are set out in the confirmation.

8.3 We will tell you promptly if anything will take longer than expected, and why.

8.4 **We advise; you decide.** The book is yours. Where we recommend an editorial change and you disagree, your decision stands.

## 9. What we need from you
<!-- NO LEDGER ENTRY: the consumer's own obligations and the originality confirmation at 9.3 are commercial terms. Retained, and deliberately softer than MSA Schedule C9, which carries a full warranty and indemnity — that asymmetry is intentional and must survive review. -->


9.1 Your manuscript, materials, feedback and approvals within the timescales agreed.

9.2 If you cannot meet a timescale, tell us — we will reschedule where we can. Long delays may affect availability and we will be honest with you about that.

9.3 You confirm that the work is yours, that it does not copy anyone else's work, that it is not defamatory, and that it does not contain unlawful material.

## 10. Your rights in your book
<!-- L-CDPA-90-91 — added 26 August 2026, round 8. The previous note here said "the ledger contains no
CDPA 1988 entry". That entry exists as of round 7 and 10.3 is the clause it discharges. ss. 90 and 91
were re-read at source in round 8 rather than taken from the entry. -->
<!-- NO LEDGER ENTRY for 10.1, 10.2 and 10.4: those are not assignments. 10.1 and 10.2 are statements
that Gridsmith takes nothing — no transfer occurs, so no formality is engaged — and 10.4 is a limited
licence granted BY the consumer TO Gridsmith, which s. 90(3) does not govern (it governs assignments).
Retained as commercial terms. -->
<!-- L-CRA-50 — 10.1, 10.2, 10.5 and 10.6 are all repeated on the Press pages; anything said there becomes a term, so the two must not drift apart. -->


**10.1 You keep 100% of the copyright in your work. We never own any part of it.**

**10.2 You keep 100% of all royalties and sales income. We take no royalty, no commission, and no share of your sales.** We are paid only the fees in your order confirmation.

10.3 **REVISED — the cover and interior design.** On payment in full, Gridsmith **assigns to you all
copyright and other intellectual property rights in the cover and interior design we produce for your
book.** This assignment is made in writing and signed by or on behalf of Gridsmith, and takes effect on
receipt of final payment. Where that design does not exist when these terms are agreed, this clause is
an agreement in relation to **future copyright** within the meaning of **section 91 of the Copyright,
Designs and Patents Act 1988**, made and signed by Gridsmith as prospective owner, so that the
copyright vests in you on coming into existence without any further act of assignment. Where the
design already exists, the assignment is made in writing and signed as **section 90(3)** of that Act
requires.
<!-- L-CDPA-90-91 — revised 26 August 2026, round 8. ss. 90 and 91 fetched and read at source in this
round, not taken from the ledger entry. The defect being corrected ran AGAINST THE CONSUMER: version
1.1 said only that the design would "become yours once you have paid in full". That is a bare promise
that rights will pass. **s. 90(3): "An assignment of copyright is not effective unless it is in writing
signed by or on behalf of the assignor."** A cover and interior design does not exist when the contract
is made, so the operative section is **s. 91(1)**, which vests future copyright in the assignee on
creation only where the agreement is "made in relation to future copyright, and signed by or on behalf
of the prospective owner" and the prospective owner "purports to assign" it. The old wording did
neither: it did not purport to assign, and it named no signed-writing basis. So the CONSUMER
instrument gave a weaker transfer than `MSA-BUSINESS.md` 8.3 gives a business client, in the document
whose entire selling proposition (10.1, 10.6, and `/press`) is that the author owns everything. This
clause is now the same language as 8.3.
`[TK — the same two questions 8.3 records, carried across deliberately rather than resolved, because
neither section answers them and this pass is not the place to decide them: (i) whether an
electronically executed agreement is "signed" for s. 90(3) and s. 91(1) — which matters more here than
in the MSA, since a consumer order is the case most likely to be concluded by a click; (ii) whether
"other intellectual property rights", which are not copyright, are validly assigned by these words —
ss. 90 and 91 govern copyright only, and registered designs, trade marks and unregistered design right
each have their own assignment formalities. A cover design is a plausible registered-design subject,
so (ii) is not academic here.]` -->

10.4 We use your manuscript only to produce your book. That permission ends when we deliver.

10.5 Where we set up distribution, **the accounts are in your name and under your control**, so your royalties are paid to you directly. We never hold an account on your behalf and we never receive your sales income.

10.6 **You are the publisher.** Your ISBN is registered to you, not to us. We do not run an imprint and we do not put our name on your book as publisher. Where it is part of your order, we will help you obtain your own ISBN and complete the registration — but it is yours, permanently, and it stays yours whatever happens between us.

10.7 **Platform standards.** Where your order includes publishing to particular platforms — Amazon KDP, IngramSpark, Draft2Digital, Apple Books, Kobo or others — we prepare your files to each platform's current specification, so they are accepted first time. Platform requirements change over time; we guarantee they meet the specification on the day we submit.

10.8 We will only show your book in our portfolio **if you give us written permission**, and you can withdraw that permission at any time.
<!-- L-GDPR-6 — your name is personal data; written permission is the basis relied on. -->
<!-- L-DMCC-SCH20-13 — where we show reviews or testimonials anywhere on our site, they are real, they
are not incentivised, and we do not suppress negative ones to give prominence to positive ones. `[TK —
01-FACTUAL-INVENTORY.md §6.5 records that six real public Freelancer reviews are shown on the
homepage. Whether that is a selected subset with negative reviews omitted is a decision no gate can
observe, and whether the reviewers consented to being quoted is unconfirmed. OQ-20.]` -->

## 11. What we do not promise
<!-- L-DMCC-SCH20-13 -->
<!-- L-CRA-50 -->


We will produce your book to a professional standard. **We do not and cannot promise how it will sell.**

This applies equally if you buy book marketing from us. Marketing is a separate service with its own price, and buying it does not come with any promise of sales, reviews, rankings or coverage.

We make no promise about sales figures, income, reviews, rankings, bestseller status, media coverage or any other commercial outcome. Most independently published books sell modestly. Anyone who tells you otherwise is not being straight with you.

## 12. If something goes wrong
<!-- L-CCR-13 — Sch. 2 requires the complaints-handling policy to be given before the consumer is bound. -->
<!-- L-DMCC-230 — s. 230 makes any departure from a published complaint-handling practice material information. -->


**Complaints procedure**

1. Tell us: `[TK email]`, or call `[TK phone]`.
2. We will acknowledge within **5 working days**.
3. We will investigate and respond within **`[TK]` working days**, explaining what we found and what we propose.
4. If you are not satisfied, we will tell you what you can do next.

Your rights under the Consumer Rights Act 2015 apply regardless of this procedure. You may also be able to use `[TK — alternative dispute resolution provider, if we join one]`.

**12.1 NEW — complaints about how we handle your personal data** follow a separate statutory procedure
set out in our Privacy Policy §12. We must acknowledge such a complaint within 30 days and respond.
<!-- L-DPA-164A — DPA 2018 s. 164A, inserted by DUAA 2025 s. 103, in force 19 June 2026. `[TK — there
is no complaints route and no electronic complaint form on the site (01-FACTUAL-INVENTORY.md §5.1).
s. 164A requires us to facilitate complaints "by taking steps such as providing a complaint form which
can be completed electronically and by other means".]` -->

> **[DECISION REQUIRED] — the acknowledgement and response times in §12.** Version 1.0 promised
> acknowledgement within 5 working days and a substantive response within `[TK]` working days. Options:
> **(a)** keep 5 working days — a genuine service commitment, and under `L-CRA-50` a term of the
> contract once a consumer takes it into account;
> **(b)** align with the site-wide response commitment (*"always by the end of the next business
> day"*), which `CLAUDE.md` requires to be single-sourced;
> **(c)** state the statutory 30-day maximum for data protection complaints and a separate, faster
> figure for service complaints.
> Whatever is chosen must match `PRIVACY-POLICY.md` §12 and `ACCESSIBILITY-STATEMENT.md` §5. Three
> documents currently promise 5 working days independently, which is three sources of truth for one
> commitment.

## 13. Our responsibility to you
<!-- L-CRA-57 -->
<!-- L-CRA-49 -->


13.1 If we fail to comply with these terms, we are responsible for loss or damage you suffer that is a foreseeable result of our breaking the contract or failing to use reasonable care and skill.

13.2 **We do not limit our liability in any way that the law does not allow.** That includes death or personal injury caused by our negligence, fraud, and breach of your statutory rights.

13.3 We are not responsible for losses that were not foreseeable when the contract was made.

> **For solicitor review:** deliberately no monetary cap here. A cap against a consumer would be assessed under the CRA 2015 fairness test and, for a service of this value, would be difficult to defend. Please advise whether any cap is safely includable.

## 14. Ending the contract
<!-- L-CCR-29 -->


14.1 Your 14-day cancellation right is at §5 and §6.

14.2 After that, either of us may end the contract by written notice. You pay for work done up to that point; we refund anything paid for work not done.

14.3 If we end the contract because of something you have done, you pay for work done. If we end it for our own reasons, we will refund you in full for work not delivered and help you find another provider.

## 15. Personal data
<!-- L-GDPR-13 -->
<!-- L-DPA-164A -->


We handle your data as described in our Privacy Policy. We do not sell it, do not share it with advertisers, and do not use your manuscript for any purpose other than producing your book.

**15.1 NEW — marketing.** As an individual you are an *individual subscriber* under PECR reg. 22. We
will not send you marketing email unless you have consented, or unless we obtained your details in the
course of negotiating a sale to you and the marketing is of similar services — and in every case there
will be a simple, free way to refuse in every message.
<!-- L-PECR-22 — reg. 22(2) and the reg. 22(3) soft opt-in, which binds here in a way it does not for a
corporate client. Not engaged today: no marketing send exists. -->

## 16. General
<!-- NO LEDGER ENTRY: boilerplate. Retained. 16.4 is deliberately non-exclusive as to jurisdiction, unlike MSA clause 14.7. -->


16.1 We may transfer this contract to another business, but your rights are unaffected and we will tell you.

16.2 If a court finds part of these terms unlawful, the rest continues to apply.

16.3 If we do not insist on something immediately, we can still do so later.

16.4 These terms are governed by the law of England and Wales. If you live in Scotland or Northern Ireland, you may bring proceedings there.

---

## Model Cancellation Form
<!-- L-CCR-29 -->
<!-- L-CCR-13 — Sch. 2 requires the model cancellation form to be provided with the pre-contract information. -->


*Complete and return this form only if you wish to withdraw from the contract.*

To: Gridsmith Ltd, `[TK address]`, `[TK email]`

I/We hereby give notice that I/We cancel my/our contract for the supply of the following service:

Ordered on / received on: ____________________
Name of consumer: ____________________
Address of consumer: ____________________
Signature (only if on paper): ____________________
Date: ____________________

---

**`[TK]` items:** company number · registered office · contact email and phone · late payment interest
rate (7.4) · complaint response time (12) · ADR provider if any · the estimator reference at clause 4,
since no such tool exists · the VAT-inclusive price the site does not currently show (3, 7.1) · the
electronic complaint form (12.1) · whether the six testimonials shown on the site are a complete or
selected set, and whether the reviewers consented (10.8) · **the reg. 36(2)(b) acknowledgement
capture, which is a build task and not a drafting one (6)** · **the two CDPA formality questions
carried across from `MSA-BUSINESS.md` 8.3 (10.3)**.

**`[DECISION REQUIRED]` items:** the complaint acknowledgement and response times (12). *The routing
question — how a consumer reaches this document at all — was `[DECISION REQUIRED]` and is closed: the
owner took option (a) on 26 August 2026 and this document has its own route. See the head of the
document.*
