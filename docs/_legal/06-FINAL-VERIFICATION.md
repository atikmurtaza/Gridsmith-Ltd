# 06 — Final Verification (Pass 6)

**Date: 26 August 2026.** Scope: all seven documents in `docs/_legal/`, with priority on round 8's
changes, which no pass had verified.

**Method, and it is the whole point of this pass.** Every legal assertion below was checked against
the **primary instrument, fetched in this pass**. `02-CITATION-LEDGER.md`, `03-REVISION-LOG.md`,
`04-VERIFICATION-REPORT.md` and `05-REVERIFICATION-REPORT.md` were read only to know *what to check*,
never as authority for whether it was right. A clause that agrees with the ledger proves nothing: it
was drafted from the ledger. Where this pass agrees with `04-` or `05-`, it says **re-derived**, not
*confirmed*.

**Instruments fetched at `legislation.gov.uk` in this pass:** SI 2013/3134 **regs. 29, 30, 36(1)–(6)** ·
CDPA 1988 **ss. 90, 91** · PECR 2003 **regs. 22(1), 23, Sch. A1 para. 5** · SI 2002/1675 **art. 4** ·
Late Payment of Commercial Debts (Interest) Act 1998 **s. 5A(2), (2A), (3)** · DPA 2018 **s. 164A**.
**Attempted and failed:** `ico.org.uk` storage-and-access guidance — **HTTP 403 again**, the third
consecutive pass to be refused.

**Build facts asked of the system, not inferred:** `scripts/check-consumer-terms.mjs` was **run
against a live dev server** started through the Browser pane; `lib/legal/slugs.ts`,
`lib/leads/schema.ts`, `lib/leads/action.ts`, `lib/leads/notify.ts`, `supabase/migrations/0001_core.sql`,
`scripts/check-axe.mjs`, `scripts/check-contrast.mjs`, `scripts/check-responsive.mjs` and
`package.json` were read and counted; every `/legal/*` route was fetched and its `Set-Cookie` headers
inspected.

---

## Counts

| | |
|---|---|
| Documents verified | 7 |
| Primary instruments fetched | 12 provisions across 6 instruments |
| Assertions re-derived and **HOLDING** | 18 |
| Assertions that **DO NOT HOLD** | 4 |
| Findings this pass derived **differently** from `04-`/`05-` | 3 |
| Ledger obligations with no clause | 1 (reg. 23) |
| Clauses citing an id that does not discharge them | 1 new (MSA 16.1) — round 8's two are correctly narrowed |
| Assertions with no citation | 2 |
| Ledger ids cited but absent from the ledger | **0** |
| Ledger entries never cited by any clause | **0** |

---

## 1. Assertions that HOLD

Each re-derived from the instrument or the file named. None of these was taken from a previous pass.

### 1.1 `CONSUMER-TERMS.md` §6 — the clause the whole round was for

- **reg. 36(2) is conjunctive.** Fetched verbatim: *"the consumer ceases to have the right to cancel
  a service contract under regulation 29(1) if the service has been fully performed, and performance
  of the service began—(a) after a request by the consumer in accordance with paragraph (1), **and**
  (b) with the acknowledgement that the consumer would lose that right once the contract had been
  fully performed by the trader."* Round 8's reading is **right**, and version 1.1's automatic-loss
  wording was wrong against the consumer. **New §6(a1) and the rewritten §6(d) state the law
  correctly**, including the consequence that a missing limb preserves the right.
- **reg. 36(4)** — fetched verbatim, two limbs (period ending when the trader is informed under
  reg. 32(2); proportion against full coverage). **§6(c) states both.**
- **reg. 36(5)** — fetched verbatim, total price agreed, or market value where the total price is
  excessive, judged by equivalent services from other traders. **§6(c) states it.**
- **reg. 36(4) is expressly *"subject to paragraph (6)"*.** §6(c) does not say so on its face, but
  **§6(e) closes it explicitly** — *"In that case (c) does not apply to you."* The structure holds.
- **reg. 36(6)** — fetched verbatim, both limbs, (a) Sch. 2 para. (l) or para. (n) information not
  given in accordance with Part 2, or (b) service not supplied on a para. (1) request. **§6(e) states
  both, in plain English, accurately.**
- **The reg. 31 / reg. 36(6) sibling point** — the same information failure that extends the period
  and the one that wipes out the payment — is correctly drawn. §5.1 and §6(e) are consistent.

**Verdict on §6 as it now stands: the law is correctly stated on every limb round 8 addressed.**
The section's defects are what it *omits* about which contracts it governs — §2.1 and §2.2 below.

### 1.2 `CONSUMER-TERMS.md` §10.3 — the copyright assignment

- **s. 90(3)** fetched verbatim: *"An assignment of copyright is not effective unless it is in writing
  signed by or on behalf of the assignor."* ✔ quoted correctly in the clause note.
- **s. 91(1)** fetched verbatim. The three elements — agreement made in relation to future copyright,
  signed by or on behalf of the prospective owner, prospective owner *"purports to assign"* — are all
  present in the redrafted 10.3, which now uses operative assigning words (*"assigns to you"*) rather
  than the promissory *"become yours"*. **Re-derived: round 8's diagnosis and its fix both hold**, and
  10.3 is now word-for-word the standard `MSA-BUSINESS.md` 8.3 sets.

### 1.3 `MSA-BUSINESS.md` 16.2 and PECR reg. 23

- **reg. 23** fetched. It opens *"A person shall neither transmit, nor instigate the transmission
  of…"*, is framed around *"the recipient of the communication"*, and **carries no "individual
  subscriber" limitation**.
- **reg. 22(1)** fetched: *"This regulation applies to the transmission of unsolicited communications
  by means of electronic mail to individual subscribers."* It **does** carry the limitation.
- **Round 8's proposition is re-derived and correct**, and clause 16.1's premise is sound. The
  defect round 8 fixed — an inline note telling a solicitor *not* to rely on the clause — is
  genuinely fixed. See §3.1 for the citation problem that remains.

### 1.4 `00-LEGAL-BASIS.md` §1

- **SI 2002/1675 art. 4** fetched verbatim: *"8 per cent per annum over the official dealing rate in
  force on the 30th June … or the 31st December … immediately before the day on which statutory
  interest starts to run."* The row quotes it accurately, and **`MSA-BUSINESS.md` 6.4 states it
  correctly** — including the two fixing dates and which interest periods each governs.
- **s. 5A(2)** fetched verbatim: **£40** under £1,000, **£70** from £1,000 to under £10,000, **£100**
  at £10,000 or more. **Three sums, re-derived.** `MSA-BUSINESS.md` 6.4 states all three.
- **s. 5A(2A)** fetched verbatim — the difference where reasonable recovery costs exceed the fixed
  sum. Stated in both the row and 6.4.
- **CDPA row** now names both s. 90(3) and s. 91 and no longer declares either unread. Correct.

### 1.5 Build facts — asked of the system

| Assertion | Where asserted | Re-derived how | Result |
|---|---|---|---|
| Seven legal slugs, and their names | `WEBSITE-TERMS.md` decision block | `lib/legal/slugs.ts` read | **7**, and the seven names listed in the block match the file exactly |
| Vercel runs `next build`; `check:launch` is CI-only | `03-REVISION-LOG.md` round 8 §8 | `package.json` read | `build` = `next build`; `check:launch` appears **only** inside `verify:served` |
| 15 axe routes, 11 public + 4 internal | `ACCESSIBILITY-STATEMENT.md` §3, §4.1 | `check-axe.mjs` `ROUTES` counted | **15**; public = `/`, `/design`, `/digital`, `/press`, `/work`, `/work/brand-website-and-launch-book`, `/about`, `/approach`, `/insights`, `/legal/privacy`, `/contact` = **11**; internal = `_kitchen-sink`, `_master-sink`, `_gridsmith-404-probe`, `gridsmith-error-probe` = **4** |
| 2 viewports × 2 scroll states, 60 analyses | same | `VIEWPORTS` = 375/1280, `PHASES` = initial/scrolled | 15 × 2 × 2 = **60** ✔ |
| Six of seven legal pages outside the audit | `ACCESSIBILITY-STATEMENT.md` §4.3 | 7 slugs, `ROUTES` contains `/legal/privacy` only | **6 of 7** ✔ (this is Pass 4's route-split error, now correct in every place it appears) |
| 36 contrast pairs / 148 cells | `ACCESSIBILITY-STATEMENT.md` §3 | `check-contrast.mjs:45-46` | literals `36` / `148` ✔ |
| Responsive at 375 / 768 / 1440 | `ACCESSIBILITY-STATEMENT.md` §3 | `check-responsive.mjs:54` | `WIDTHS = [375, 768, 1440]` ✔ |
| Ten latent lead fields; **seven** read by the server, three not | `PRIVACY-POLICY.md` §6 | `schema.ts` + `action.ts` read line by line | **Exact.** Server reads `role`, `source`, `medium`, `campaign`, `referrer`, `landing_page`, `is_ai_referral` = 7. Not read: `track`, `service_slug`, `payload` = 3. `lead_type` is hardcoded `'enquiry'` in `action.ts:39`, not read from `FormData`. **This is Pass 5's correction of Pass 4's five-field undercount, and it is right.** |
| One cookie, `gs_consent`, first-party, 365 days, `SameSite=Lax`, no fourth "necessary" toggle | `COOKIE-POLICY.md` §1–3 | `lib/consent/state.ts` read; all nine routes fetched live | No route emits **any** `Set-Cookie` header. The only cookie is written client-side on a choice. ✔ |
| `/press` links to the consumer instrument and no consumer route links to the business terms | `CONSUMER-TERMS.md` decision block | **`node scripts/check-consumer-terms.mjs` run against a live server** | **Exit 0.** *"2 consumer-facing route(s), 51 link(s) scanned, 0 to /legal/business-client-terms"*; `/press` → `/legal/consumer-client-terms`, 200, carries `clause-10-1`. All seven legal slugs serve 200. |

### 1.6 Other instruments spot-checked

- **DPA 2018 s. 164A** fetched. (2) *"providing a complaint form which can be completed
  electronically and by other means"*; (3) acknowledge within **30 days**; (4) respond **without
  undue delay**. `PRIVACY-POLICY.md` §12 and `CONSUMER-TERMS.md` §12.1 are accurate on the 30 days
  and on the electronic-form duty. (See §2.4 for one omission.)
- **PECR Sch. A1 para. 5** fetched, including **(1)(d)** — clear and comprehensive information, *"a
  simple means of objecting, free of charge"*, **and the user does not object** — and (1)(c), the
  no-sharing limb. `COOKIE-POLICY.md` §4A's statement of the statute is **correct**.
- **CCR reg. 29(1)** and **reg. 30** fetched — see §2.1 and §2.2, where they defeat the draft.

### 1.7 Ledger integrity

- **39 entries** (`### L-…`) in `02-CITATION-LEDGER.md`. Every inline `L-` id used in the seven
  documents resolves to one. **Zero cited-but-absent.** **Zero entries with no clause citing them.**
- Round 8's two claimed narrowings both **re-derived as correct**:
  - **`WEBSITE-TERMS.md` clause 3** — `L-CDPA-90-91` covers ss. 90–91, which are *assignment*.
    Clause 3 asserts *subsistence* and grants a *licence*. Refusing to cite the entry there is right,
    and the reasoning in the note is right.
  - **`CONSUMER-TERMS.md` §10** — 10.1 and 10.2 transfer nothing so no formality is engaged; 10.4 is
    a licence granted **by** the consumer, which s. 90(3) does not govern (s. 90(3) governs
    assignments; s. 90(4) governs licences and binds successors). Correct.

---

## 2. Assertions that DO NOT HOLD

### 2.1 `CONSUMER-TERMS.md` §5 and §6 never say which contracts they govern — and reg. 29(1) does

**This is the most important finding in this pass, and it is in the section round 8 was written for.**

**reg. 29(1), fetched verbatim:** *"The consumer may cancel **a distance or off-premises contract** at
any time in the cancellation period…"*

`CONSUMER-TERMS.md` contains the words *"distance contract"* **zero times** and *"off-premises"*
**zero times** — grepped across the whole file. §5 states a 14-day cancellation right flatly, for
every consumer, in every case. Two consequences, in opposite directions:

- **Against Gridsmith:** an **on-premises** contract — a memoir or legacy client signing at a kitchen
  table or at Gridsmith's own address — attracts **no** reg. 29 right at all, and §5 grants one
  anyway. Under `L-CRA-50` a statement the consumer takes into account becomes a term, so the draft
  gives away a cancellation right the CCRs do not require, unqualified.
- **Against the consumer, and this is the serious half:** **reg. 36(1) requires that for an
  off-premises contract the express request to begin early be made *on a durable medium*.** §6(a)
  specifies one mechanism only — *"ticking the specific box on the order confirmation"* — which is a
  distance-contract mechanism. **Nothing in §6 states the durable-medium requirement.** An
  off-premises request taken any other way does not satisfy reg. 36(1), which means it is not a
  para. (1) request, which by **reg. 36(6)(b)** means the consumer **bears no cost at all** — and §6
  as drafted would tell them they owe a proportionate payment under (c). Round 8 fixed §6(d)'s
  misstatement against the consumer and left an adjacent one standing.

Press's memoir and legacy clients are precisely the population most likely to be contracted with in
person. The section is otherwise correct; it is unscoped.

### 2.2 §5's cancellation period is stated for services only — reg. 30(3) governs goods

**reg. 30 fetched.** For a service contract the period ends 14 days after **the day the contract is
entered into** (which §5 states, correctly). For a **sales contract**, it ends 14 days after the day
the goods come into the consumer's **physical possession**.

§10.6 and §10.7 contemplate ISBNs, printed books and platform submission; §8 contemplates delivery.
If any Press order includes the supply of **printed copies**, that element is a sales contract and its
cancellation period runs from delivery, not from contract. §5 states one rule for both and is wrong
for the goods element. **Not flagged anywhere in the document, in the ledger, or in either previous
pass.**

### 2.3 `PRIVACY-POLICY.md` §6 — two recipient rows understate what reaches the processor

- **Resend row.** Re-derived from `lib/leads/notify.ts:66-75`: the notification email carries
  `division`, **`lead_type`**, **`service_slug`** (where present), `full_name`, `email`, `company`,
  `phone`, and the record id. The row lists *"Division, name, email, company, phone, and a record
  id."* **`lead_type` and `service_slug` are missing.** This is Pass 5's F-7, **independently
  re-derived**, and round 8 declined to apply it on scope grounds. It remains open.
- **Slack row — new, and neither Pass 5 nor round 8 found it.** `notify.ts:128` transmits
  `` `New ${lead.division} lead: ${lead.full_name} (${lead.lead_type})` ``. The row discloses
  *"**Your full name** and the division"* only. **`lead_type` is missing from this row too.**

Two rows, same omitted field, same defect class — *an enumerated list in a privacy notice reads as
exhaustive* — which round 7 already swept once in §2 of this same document. Round 8 named F-7 so it
would not be lost and then fixed the class in neither row. The exposure is low today (`lead_type` is
not personal data on its own and is always `'enquiry'`), but the **recipient table is the one place in
a privacy notice a reader is entitled to treat as complete**, and the Slack row is attached to a
`[DECISION REQUIRED]` about making Slack a live processor.

### 2.4 Two assertions with no citation

- **`CONSUMER-TERMS.md` 7.4** — *"we may charge interest at `[TK]%` above the Bank of England base
  rate. **This reflects our actual cost and is not a penalty.**"* The clause carries **no `L-` id and
  no `NO LEDGER ENTRY` flag**. "Not a penalty" is a legal characterisation, and the governing
  provision — CRA 2015 Part 2, ss. 62–64 with Sch. 2 (the grey list expressly names a term requiring
  a consumer who fails to fulfil an obligation to pay a **disproportionately high sum in
  compensation**) — is nowhere cited on this clause. `L-CRA-57` is cited at §13, which is a different
  provision doing different work. Note also that the Late Payment of Commercial Debts (Interest) Act
  1998 is **unavailable** here — it applies only where both parties act in the course of a business —
  so 7.4 has no statutory scaffolding at all. The solicitor note beneath it is right but is not a
  citation.
- **`00-LEGAL-BASIS.md` §1, "Services disclosure" row** — the Provision of Services Regulations 2009
  row is retained with a `NO LEDGER ENTRY` flag saying it was never read. Honestly flagged, but it is
  a row in the requirements map asserting a requirement on no authority. Same status as the UCTA row,
  and both are correctly marked; recorded here for completeness rather than as a defect.

---

## 3. Ledger obligations with no clause · clauses citing ids that do not discharge them

### 3.1 PECR reg. 23 has no ledger entry, and `MSA-BUSINESS.md` 16.1 cites `L-PECR-22` for it

**Round 8 narrowed two of these and created a third.**

`MSA-BUSINESS.md` 16.1 does two things: it states that reg. 22 does not restrict marketing to a
corporate subscriber (**reg. 22** — discharged by `L-PECR-22`), and it undertakes that *"Gridsmith
will identify itself and give a valid address in every message"* (**reg. 23** — discharged by
nothing). The clause carries `<!-- L-PECR-22 -->` and nothing else.

Read, not string-matched, `L-PECR-22`'s fields are:

- **provision:** *"reg. 22(1)–(3); reg. 22(3A) and 22(5) inserted 5 Feb 2026"* — **reg. 23 is not in
  the provision field.**
- **what it requires:** reg. 22(1), (2), (3) and (3A) only. **No statement of reg. 23's requirement.**
- reg. 23 appears **once**, in a parenthesis in the *applies to* cell.

reg. 23's verified text exists in exactly one place in the ledger: **`CNV-3`, in the COULD NOT VERIFY
section**, marked CLOSED. That is a good record and a bad citation home — it is the section a
solicitor reads to find out what was *not* established.

**This is precisely the defect round 8 identified and refused to commit at `WEBSITE-TERMS.md`
clause 3 — a clause citing an id that does not discharge it.** The fix is one new entry,
`L-PECR-23`, promoting the text already in `CNV-3`; the reading has been done twice and holds.

### 3.2 `CONSUMER-TERMS.md` 10.3 and `MSA-BUSINESS.md` 8.3 assign more than the cited authority reaches

Both clauses operatively assign *"all copyright **and other intellectual property rights**"*, and
both notes concede that **ss. 90–91 govern copyright only** — registered designs, trade marks and
unregistered design right each carry their own assignment formalities. So the operative words claim a
transfer the cited sections cannot effect.

This is **correctly flagged in both documents** as a solicitor question, and the direction is
commercially safe for the client (Gridsmith over-promising, not under-delivering) — but it is
substantively an over-claim against `CLAUDE.md` non-negotiable #6, and it is the one place in this set
where the flag and the operative text point in different directions. It should be resolved by drafting,
not carried forward again.

### 3.3 Ledger obligations with no clause — status

Round 8 discharged no-clause item 6 (`L-CRA-57`, one route for two audiences) on the client-terms
split. **Re-derived and correct**: the gate runs green against served pages. What survives — `/contact`
serving one form to all three divisions — is correctly stated as surviving. No-clause item 11's
correction to *"six of the seven"* is re-derived and correct.

The one genuine remaining gap is §3.1 above. **UCTA 1977 remains unread**, `MSA-BUSINESS.md` 11.3 and
`WEBSITE-TERMS.md` 11 both carry `NO LEDGER ENTRY` flags saying so, and that is the honest state — the
reasonableness test cannot be closed without the Act.

---

## 4. Findings this pass derived DIFFERENTLY from `04-` or `05-`

1. **§2.1 and §2.2 — the contract-type scoping of `CONSUMER-TERMS.md` §5–§6.** Neither pass, nor
   round 8, tested the drafts against **reg. 29(1)**. Every pass verified what §6 *says* about
   reg. 36; none asked which contracts reg. 36 reaches. Pass 5 rated §6 as the round's target and
   round 8 rewrote it; the omission survived both because it is an absence, not an error.
2. **§2.3, Slack row.** Pass 5 found F-7 on the Resend row and stopped there. Reading `notify.ts` end
   to end rather than checking the field named in the finding shows the same omission one row down.
   **The finding was raised as an instance; it is a class, and the class was not swept.**
3. **`00-LEGAL-BASIS.md`'s late-payment row overstates its own correction.** The row says
   *"'8% + Bank of England base' describes a floating rate the statute does not create."* Art. 4
   creates **exactly** 8 per cent per annum **over the official dealing rate** — which is the Bank of
   England's official dealing rate. What version 1.0 got wrong was the **fixing date** (six-monthly at
   30 June / 31 December, not the rate on the invoice date), not the formula. `MSA-BUSINESS.md` 6.4
   itself, correctly, says *"8% per annum above the Bank of England official dealing rate"*. The map
   and the clause now characterise the same correct rule differently, and the map's version reads as
   though the 8% margin were itself wrong. **The law in both is right; the map's account of what was
   wrong is not.** Round 8 rewrote this row and `05-` did not reach it.

---

## 5. Minor findings

- **`CONSUMER-TERMS.md` §6(a1) is labelled `REVISED`** but is a **new** clause; the document's own
  header says new clauses are marked `NEW`. Cosmetic, but a reviewer diffing 1.1 against 1.2 will look
  for a predecessor that does not exist.
- **`CONSUMER-TERMS.md` §12.1** states s. 164A as *"acknowledge within 30 days and respond"* and omits
  **s. 164A(4)'s "without undue delay"**, which is the operative standard for the response itself.
- **`PRIVACY-POLICY.md` §11A cites `L-07`**, which is a `FOUNDATION` build-requirement id, not a
  ledger entry. It reads as a citation in a document where every other `L-` id is one.
- **`COOKIE-POLICY.md` §4A's eight ICO quotations remain unverified.** `ico.org.uk` returned
  **HTTP 403 to this pass as well** — three consecutive passes refused. They are the entire evidential
  base of a `[DECISION REQUIRED]`, they rest on a single unrepeatable 25 Aug retrieval, and no ledger
  entry backs them. Round 8's flag is correct and the item is unchanged.
- **`check-consumer-terms.mjs` branch B** accepts a bare link to `/legal/consumer-client-terms`; the
  decision block says `/press` links *"to clause 10.1"*. Branch C asserts the anchor exists on the
  target but not that `/press` uses it. Narrow, and the gate is otherwise the best-constructed one in
  the repository.

---

## 6. The `[TK]`s in the four revised documents — fact, or legal gap?

The question that decides the verdicts. **Every `[TK]` in the four documents was read.**

| Document | `[TK]`s | Owner facts | Build tasks | **Legal questions wearing a `[TK]`** |
|---|---|---|---|---|
| `CONSUMER-TERMS.md` | 22 | 12 (email, phone, address, ADR provider, testimonial provenance, interest rate figure) | 8 (VAT display `M-P2-3`, reg. 36(2)(b) capture, estimator reference, electronic complaint form) | **2** — the CDPA electronic-signature and non-copyright-IP questions at 10.3 |
| `WEBSITE-TERMS.md` | 13 | 9 (company number, registered office, VAT number, email, phone, business hours) | 4 (sample flow, estimator tools, VAT sentence, testimonial claim) | **0** |
| `MSA-BUSINESS.md` | 11 | 5 (liability cap figure, PI insurance figure, standards codes) | 3 (VAT sentence, complaint form, DPAs) | **2** — the same two CDPA questions at 8.3, plus processor regions (owner facts) |
| `00-LEGAL-BASIS.md` | 1 | 1 | 0 | **0** |

**Judgement on the four legal questions.** The two CDPA questions (at 10.3 and 8.3) are the same pair,
carried twice. They are **genuinely open questions of law that ss. 90–91 do not answer**, they are
captioned *"for the solicitor"* in both places, and they are recorded in `L-CDPA-90-91`. They are
therefore *correctly* escalated — but they are **not `[TK]`s**, because a `[TK]` in this set means *a
fact nobody has*. Marking a live legal question with the marker used for a missing phone number risks
it being triaged as clerical. **Reclassify, do not resolve.**

**No `[TK]` in the four documents conceals a drafting gap.** Every one is a fact, a build task, or a
correctly-escalated legal question. The two substantive gaps found in this pass (§2.1, §2.2) carry **no
marker at all** — which is exactly why they survived three passes.

---

## 7. VERDICT per document

| Document | Verdict | Reason |
|---|---|---|
| **`WEBSITE-TERMS.md`** | ✅ **Ready for a solicitor** | Every open item is an owner fact (`[TK]` company number, registered office, VAT number, contact details — all OQ-15/OQ-17) or an owner choice (4 × `[DECISION REQUIRED]`). Round 8's slug correction is re-derived and right. Clause 3's `NO LEDGER ENTRY` narrowing is correct reasoning, correctly recorded. The UCTA flag at clause 11 is the honest state of an unread Act. |
| **`ACCESSIBILITY-STATEMENT.md`** | ✅ **Ready for a solicitor** | Every count in it was re-derived from the gates in this pass and every one is right: 15 routes, 11 public / 4 internal, 2 viewports × 2 scroll states, 60 analyses, 36 pairs / 148 cells, 375/768/1440, six of seven legal routes uncovered. Open items are the screen-reader pass date and reviewer identity — owner facts. **This is the most reliably-sourced document in the set.** |
| **`COOKIE-POLICY.md`** | ✅ **Ready for a solicitor, with one instruction** | The statute is stated correctly against Sch. A1 para. 5 fetched in this pass, including (1)(c) and (1)(d). Open items are two `[DECISION REQUIRED]`s. **The instruction: §4A's eight ICO quotations must be marked to the solicitor as unverified regulator guidance resting on one unrepeatable retrieval** — they read as authority and no entry backs them. That is disclosure, not redrafting. |
| **`00-LEGAL-BASIS.md`** | ✅ **Ready for a solicitor, with one correction** | Every round-8 row was re-derived from the instrument and every one states the law correctly. The single correction is §4.3: the late-payment row's *account of what was previously wrong* overstates it and now differs in characterisation from `MSA-BUSINESS.md` 6.4, which it indexes. A map that disagrees with its own clause is the exact failure round 8 fixed here, reintroduced one layer up. **It does not misstate the law**, which is why this is a correction and not a hold. |
| **`MSA-BUSINESS.md`** | ⚠️ **Needs one more pass — narrow** | 16.2's note is fixed and 16.1's premise is sound, both re-derived. **The one blocker is §3.1: clause 16.1's reg. 23 undertaking is cited to `L-PECR-22`, an entry whose provision field is reg. 22 only, with reg. 23's verified text stranded in `CNV-3`.** One new ledger entry closes it; no clause changes. 8.3's over-assignment of non-copyright IP (§3.2) should be resolved rather than carried a third time. UCTA remains correctly flagged, not a blocker. |
| **`PRIVACY-POLICY.md`** | ⚠️ **Needs one more pass — narrow** | Substantively excellent and re-derived correct on the hard part (the seven-of-ten lead-field analysis is exact). **The blocker is §2.3: two rows of the recipient table understate what reaches the processor** — Resend (`lead_type`, `service_slug`) and Slack (`lead_type`). Pass 5 found one, round 8 deferred it, and the second was never found. A recipient table is the one enumeration in a privacy notice that must be complete, and this is the third appearance of the same defect class in this document. |
| **`CONSUMER-TERMS.md`** | 🔴 **Needs another pass — substantive** | Round 8's own work on §6 and §10.3 is **correct on every limb**, re-derived at source. But the section is unscoped: **reg. 29(1) confines the whole right to distance and off-premises contracts and the document never says so (§2.1); reg. 36(1)'s durable-medium requirement for off-premises requests is absent from §6, and its absence flips reg. 36(6)(b) — no cost at all — against the drafted position in §6(c); and reg. 30(3) gives goods a different cancellation period that §5 does not state (§2.2).** Add §2.4's uncited 7.4. These are gaps in the highest-frequency consumer exposure in the business, in the clause this round existed to fix. |

**`[TK]` and `[DECISION REQUIRED]` did not hold any document back.** Every verdict above turns on
something else.

---

## 8. What a solicitor should be told to look at first

In this order.

1. **`CONSUMER-TERMS.md` §5 and §6 — which contracts does this govern?** The clause states the law
   correctly and never says who it is for. Distance, off-premises and on-premises are three different
   regimes under reg. 29(1), and the section is drafted as if there were one. Ask specifically:
   how is a Press memoir client contracted with, and if ever in person, how is the reg. 36(1)
   durable-medium request captured? **This is the question that decides whether §6 works.**
2. **`MSA-BUSINESS.md` 11.3 and `WEBSITE-TERMS.md` 11 — UCTA 1977.** The Act has never been read in
   this project. The consumer side of the same question is fully cited at `L-CRA-57`; the business
   side — the clause that caps Gridsmith's entire exposure — is asserted. It is honestly flagged in
   both documents, and it is the largest genuinely-uncited liability in the set.
3. **The CDPA formality pair, at `CONSUMER-TERMS.md` 10.3 and `MSA-BUSINESS.md` 8.3.** Two questions,
   both carried twice: whether an electronically executed agreement is *"signed"* for ss. 90(3) and
   91(1) — decisive for a consumer order concluded by a click — and whether *"other intellectual
   property rights"* are assigned at all by words that rely on sections governing copyright only. The
   clauses currently promise more than the cited authority can deliver.
4. **`PRIVACY-POLICY.md` §6 — the processors, and the Slack decision.** Two rows understate what is
   transmitted; **no DPA is recorded in the repository for any processor**; and **four processor
   regions are unestablished**, which under `L-GDPR-44A` (Arts. 44 and 45 omitted 5 Feb 2026, the
   Art. 45B data protection test now governing) is the largest single unknown in the ledger. Slack is
   one unset environment variable away from becoming a live undisclosed processor.
5. **`COOKIE-POLICY.md` §4A — the para. 5 decision, on quotations nobody has been able to re-check.**
   The statute is verified; the regulator's gloss is not, and `ico.org.uk` has refused three passes.
   The choice between consent and the statistical-purposes exception should not be made on it until
   someone opens the page in a browser.
6. **The `[SEED]` VAT number, `[SEED] GB123456789`, live in the footer of every page today.** A false
   VAT disclosure is a worse defect than a missing one, it is flagged in two documents, and **the
   gate that would catch it does not run on Vercel** — `check:launch` is CI-only; the only thing
   currently stopping a production deploy is an unrelated `companyDetails` throw.

---

*Nothing was edited, fixed or committed in this pass. Every finding above is reported, not applied.*
