# Re-verification Report — Pass 5

**Date:** 26 August 2026. **Scope:** the six drafts plus `00-LEGAL-BASIS.md`.

**Method.** Every legal assertion re-derived from the primary instrument, fetched at
`legislation.gov.uk` during this pass. Every build assertion re-derived from the source file or
from a running server. **Nothing was verified against `02-CITATION-LEDGER.md`,
`03-REVISION-LOG.md` or `04-VERIFICATION-REPORT.md`** — a clause drafted from a ledger entry
agrees with it by construction.

Instruments read at source in this pass: SI 2002/1675 art. 4 · Late Payment of Commercial Debts
(Interest) Act 1998 s. 5A(1), (2), (2A) · PECR 2003 reg. 31 · PECR 2003 Sch. 1 para. 18(b)(ii) ·
DPA 2018 s. 157(1)–(6) · UK GDPR Art. 13(2) · CDPA 1988 ss. 90(3), 91(1) · SI 2002/2013 regs. 9
and 11 · SI 2013/3134 regs. 31 and 36.

Server-side observations: local dev server, `/press`, `/legal/client-terms`,
`/legal/business-client-terms`, `/legal/consumer-client-terms`, `/`.
`scripts/check-consumer-terms.mjs` was run green and then broken twice to establish reach.

**Counts:** 21 hold · 7 do not hold · 4 re-derivations against Pass 4 (all four of its known
errors confirmed, plus 1 new disagreement) · 0 unciteable ledger ids, 4 stale ledger/basis
records · 3 assertions with no citation at all.

---

## 1. Assertions that HOLD

Each was opened at source. Agreement with the ledger is not offered as evidence anywhere below.

**H-1 — `MSA-BUSINESS.md` 6.4, the statutory interest rate.** The clause says 8% per annum above
the Bank of England official dealing rate in force on 30 June (interest starting 1 Jul–31 Dec) or
31 December (1 Jan–30 Jun) immediately before interest starts to run, per **SI 2002/1675 art. 4**.
Art. 4 fetched: *"shall be 8 per cent per annum over the official dealing rate in force on the 30th
June … or the 31st December … immediately before the day on which statutory interest starts to
run."* Word-for-word. The round-7 correction — that the rate is the Order's, not the Act's, and is
fixed six-monthly rather than tracking base rate on the invoice date — is right on both limbs.

**H-2 — `MSA-BUSINESS.md` 6.4, the fixed sums.** 1998 Act **s. 5A(2)** fetched: (a) debt under
£1,000 → £40; (b) £1,000 or more but under £10,000 → £70; (c) £10,000 or more → £100. **s. 5A(2A)**
fetched: recovery costs above the fixed sum are recoverable as the difference. The clause states all
four correctly. The pre-round-7 singular *"the fixed statutory recovery sum"* did give away s. 5A(2A)
by omission, as the inline note says.

**H-3 — the PECR penalty chain, `00-LEGAL-BASIS.md` §2.1.** Re-derived link by link, and it is
correct: **reg. 31** — *"Schedule 1 provides for certain provisions of Parts 5 to 7 of the Data
Protection Act 2018 to apply with modifications for the purposes of enforcing these Regulations"* →
**Sch. 1 para. 18(b)(ii)**, which substitutes *"regulation 5, 6, 7, 8, 14, 19, 20, 21, 21A, 21B, 22,
23, 24 or 32B(4) or (5)"* for the words **"from 'section 35' to 'or 78'"** → those words appear only
in **s. 157(2)(a)**, the higher-maximum limb → **s. 157(5)**: *"£17,500,000 or 4% of the
undertaking's total annual worldwide turnover … whichever is higher."* reg. 6 is in the substituted
list. **£17.5m / 4% is right for a reg. 6 breach.** s. 157(6) puts the standard maximum at £8.7m /
2%, which is where every *other* PECR infringement lands.

**H-4 — `MSA-BUSINESS.md` 8.3, future copyright.** **CDPA s. 91(1)** fetched: where by an agreement
made in relation to future copyright, *signed by or on behalf of the prospective owner*, the
prospective owner purports to assign it, the copyright vests in the assignee on coming into
existence. **s. 90(3)** fetched: *"An assignment of copyright is not effective unless it is in
writing signed by or on behalf of the assignor."* Clause 8.3 splits the two cases exactly as the
sections do — s. 91 for deliverables not yet existing, s. 90(3) for those that do. The round-7
correction was necessary and is correctly made.

**H-5 — `MSA-BUSINESS.md` 15.1/15.2, the excludable e-commerce set.** **reg. 9(1)** and **9(2)**
each open *"Unless parties who are not consumers have agreed otherwise"*; **reg. 9(3)** does not, and
so is not excludable — the clause says exactly that. **reg. 11(1)** opens with the same conditional
and it governs the paragraph entire; the instrument draws no (a)/(b) division for this purpose, so
the pre-round-7 *"11(1)(b)"* was citing a division that does not exist. **reg. 9(4)**: paragraphs (1)
and (2) do not apply to contracts concluded exclusively by email or equivalent individual
communications. **reg. 11(3)**: same for reg. 11(1). 15.2's belt-and-braces reasoning is correct.

**H-6 — `PRIVACY-POLICY.md` §2A, Art. 13(2)(e).** Art. 13(2) fetched and every sub-paragraph read in
order. 13(2)(e) requires the controller to state whether provision is a statutory or contractual
requirement or one necessary to enter a contract, whether the data subject is obliged to provide it,
and the consequences of not doing so. §2A answers all three limbs for the enquiry case and marks the
client case `[TK]` rather than guessing. **This limb genuinely had no clause before round 7** — I
searched the notice for each 13(1) and 13(2) limb independently and 13(2)(e) is the only one that was
unaddressed and unmarked.

**H-7 — `CONSUMER-TERMS.md` 5.1, the reg. 31 extension.** **SI 2013/3134 reg. 31** fetched. reg. 31(3):
the cancellation period ends 12 months after the day it would have ended under reg. 30; reg. 31(2)
cuts that short to 14 days after late information is received. *"extended — by up to 12 months"* is
accurate precisely because of the "up to".

**H-8 — `CONSUMER-TERMS.md` 6(c), the proportionate payment.** **reg. 36(4)** fetched: an amount for
the period supplied ending when the trader is informed of the cancellation, *"in proportion to what
has been supplied, in comparison with the full coverage of the contract."* 6(c) states this correctly.

**H-9 — `CONSUMER-TERMS.md` 6(a), the express request.** **reg. 36(1)**: the trader must not begin
supply before the end of the cancellation period unless the consumer has made an express request.
The separate-tick-box mechanism is a defensible implementation and is correctly flagged for the
solicitor.

**H-10 — the axe route count.** Counted from `scripts/check-axe.mjs` `ROUTES` directly:
`/`, `/design`, `/digital`, `/press`, `/work`, `/work/brand-website-and-launch-book`, `/about`,
`/approach`, `/insights`, `/legal/privacy`, `/contact`, `/_kitchen-sink`, `/_master-sink`,
`/_gridsmith-404-probe`, `/gridsmith-error-probe` = **15**, of which **4** are internal harness
routes and **11** are public. `ACCESSIBILITY-STATEMENT.md` §3 is right.

**H-11 — the axe axes.** `VIEWPORTS` = 2 (375×812, 1280×900). `PHASES` = 2 (`initial`,
`scrolled`, distinguished by `scrollToFoot`). 15 × 2 × 2 = **60 analyses**, and `check-axe.mjs:1081`
asserts `ROUTES.length * VIEWPORTS.length * PHASES.length`. The second axis **is** scroll position,
not consent. §3 is right, including its self-correction.

**H-12 — the contrast figures.** `scripts/check-contrast.mjs:45-46` reads `EXPECTED_PAIRS = 36`,
`EXPECTED_CELLS = 148`, hard-failed against. §3's "36 token pairs across 148 cells" is right.

**H-13 — `ACCESSIBILITY-STATEMENT.md` §4.3, six of seven legal pages unaudited.**
`lib/legal/slugs.ts` declares seven: `privacy`, `cookies`, `terms`, `client-terms`,
`business-client-terms`, `consumer-client-terms`, `accessibility`. `check-axe.mjs` `ROUTES`
contains `/legal/privacy` and no other legal path. **Six unaudited.** The round-7 correction from
"four of five" is right, and its observation that the split moved §4.3's count and not §3's is also
right.

**H-14 — the route split, as served.** Fetched from the running server:
`/legal/client-terms` serves `<h1>Client Terms — which ones apply to you` and links to **both**
instruments; `/legal/business-client-terms` serves `<h1>Client Terms — Business Clients`;
`/legal/consumer-client-terms` serves `<h1>Client Terms — Consumers`. Neither instrument links to
the other — each links to `/legal/client-terms` instead. `/press` links to
`/legal/consumer-client-terms#clause-10-1` (`app/(press)/press/page.tsx:114`). The structure the
MSA head and `CONSUMER-TERMS.md` head describe is the structure being served.

**H-15 — `COOKIE-POLICY.md` §1, accept/reject parity.** `components/consent/ConsentBanner.tsx`:
the Accept and Reject buttons are both `className={styles.choice}` — one class, one width, side by
side. Verified in the source, not in the ledger.

**H-16 — the corrected `lib/analytics/load.ts` docstring.** Read in full. The GA4 "already set the
cookie" assertion is gone; the docstring now records the measurement (`__gsAnalyticsConfigured`
reporting both ids present, `gs_consent` the only cookie in all three states) and carries the
standing instruction that an initialisation call must rewrite it and both policy sections in the
same commit. `COOKIE-POLICY.md` §4 and `PRIVACY-POLICY.md` §6A are word-identical on the
conditional, as they claim to be.

**H-17 — the conditional injection.** `lib/analytics/load.ts` guards each injection on its own id
and `lib/analytics/config.ts` defaults both to `''`. Stating the two-script sentence conditionally is
correct; stating the non-initialisation half unconditionally is also correct, because no
`gtag('config')` or `posthog.init()` call exists anywhere in the tree.

**H-18 — `PRIVACY-POLICY.md` §2, the seven server-read fields.** Re-derived from
`lib/leads/action.ts:36-54` against the eight inputs `components/leads/ContactForm.tsx` renders
(`division`, `full_name`, `email`, `company`, `phone`, `message`, `budget_band`, `timeline`). The
action reads from `FormData`, beyond those eight: **`role`, `source`, `medium`, `campaign`,
`referrer`, `landing_page`, `is_ai_referral` — seven.** `track`, `service_slug` and `payload` are in
`lib/leads/schema.ts` and are not read by the action. §2's list of ten and its split 7/3 are both
right, and `role` does belong with the seven.

**H-19 — `PRIVACY-POLICY.md` §2A's two required fields.** `lib/leads/schema.ts`: `full_name` is
`.trim().min(1)` and `email` is `z.email()`; every other renderable field is `.optional()`;
`division` defaults to `'unsure'`. `supabase/migrations/0001_core.sql` makes them the only NOT NULL
text columns. §2A is right that exactly two things are required.

**H-20 — the Slack code path.** `lib/leads/notify.ts:125-133` posts
`New ${lead.division} lead: ${lead.full_name}` to `SLACK_LEADS_WEBHOOK`. It is one unset environment
variable from live and it transmits a full name. `PRIVACY-POLICY.md` §6's decision block describes
this accurately.

**H-21 — the fabricated VAT number is live.** `curl` of `/` returns `[SEED] GB123456789` in the
served payload. `WEBSITE-TERMS.md` clause 1 and `00-LEGAL-BASIS.md` §1 are right that a false
disclosure is currently being published in `development`.

---

## 2. Assertions that DO NOT HOLD

**F-1 — `00-LEGAL-BASIS.md` §1 still carries the two citation defects round 7 corrected in the MSA,
and still declares them unverified.** Two rows:

> *Copyright / IP | Copyright, Designs and Patents Act 1988, **s.90(3)** | … `NO LEDGER ENTRY: Pass 2
> raised no CDPA entry and s. 90(3) was not read.`*

> *Late payment (B2B) | Late Payment of Commercial Debts (Interest) Act 1998 | Statutory interest at
> 8% + Bank of England base, plus a fixed recovery sum. `NO LEDGER ENTRY: … the Act was not read.`*

Both are now false as records **and wrong on the merits**. `L-CDPA-90-91` and `L-LATE-PAYMENT` exist;
both instruments were read at round 7 and again here. And this file still says *"8% + Bank of England
base"* (it is the **official dealing rate fixed at 30 June / 31 December**, per H-1) and *"a fixed
recovery sum"* singular (there are **three bands plus s. 5A(2A)**, per H-2). **The requirements map
that the drafts index still contains the errors the drafts were corrected for.** Correction: replace
both rows with the `L-CDPA-90-91` and `L-LATE-PAYMENT` citations and the corrected statements of
rate and sums, and drop the two `NO LEDGER ENTRY` flags.

**F-2 — `CONSUMER-TERMS.md` §10 declares a citation that now exists, and 10.3 fails the formality
the MSA's equivalent satisfies.** The section note says:

> *`NO LEDGER ENTRY: the ledger contains no CDPA 1988 entry, so the copyright position in 10.1-10.4
> has no citation.`*

`L-CDPA-90-91` exists as of round 7. More seriously: **10.3 — *"The cover and interior design we
produce become yours once you have paid in full"* — is an assignment of copyright in works that do
not exist when the contract is made.** `MSA-BUSINESS.md` 8.3 handles precisely that case with express
signed-writing and s. 91 future-copyright language. 10.3 has none of it. On the primary text
(H-4), a bare promise that rights "become yours" is not an effective assignment under s. 90(3), and
without s. 91 wording nothing vests on creation. **The consumer instrument gives a weaker IP transfer
than the business one, and nothing in the document says so.** Correction: this is for the solicitor
to draft, but it must be flagged as a defect rather than as a missing citation.

**F-3 — `CONSUMER-TERMS.md` §6(d) overstates the loss of the cancellation right, against the
consumer.** The draft:

> *"once the service has been **fully performed** within the 14 days, **you lose the right to cancel
> entirely.**"*

**reg. 36(2)** fetched: the right ceases if the service has been fully performed **and** performance
began *"(a) after a request by the consumer in accordance with paragraph (1), and (b) **with the
acknowledgement that the consumer would lose that right** once the contract had been fully performed
by the trader."* §6(a) supplies the express request. **Nothing in §6 requires the (b) acknowledgement**
— §6(d) presents loss of the right as an automatic consequence of full performance. As drafted the
clause tells a consumer they have lost a right that, on these facts, they may still hold. Correction:
condition (d) on the acknowledgement having been given, and make the acknowledgement a distinct step
in the order flow alongside the (a) tick box.

**F-4 — `CONSUMER-TERMS.md` §6 omits reg. 36(6), the sibling of the consequence §5.1 was added to
state.** **reg. 36(6)** fetched: the consumer *"bears no cost for supply of the service, in full or
in part, in the cancellation period"* if the trader failed to give the Sch. 2 para. (l) cancellation
information or the para. (n) cost information, or if the service was not supplied on a para. (1)
request. §5.1 was added at revision 1.1 precisely to state the expensive consequence of a reg. 13
omission (reg. 31). **The same omission also wipes out the §6(c) proportionate payment entirely, and
§6 does not say so.** Correction: state reg. 36(6) alongside §6(c), or accept that §6(c) reads as an
unconditional entitlement it is not.

**F-5 — `WEBSITE-TERMS.md`'s audience decision block is out of date on the build it reasons from.**

> *"**(b)** split into a consumer-facing and a business-facing terms of use, which requires a sixth
> legal slug (`lib/legal/slugs.ts` declares five)."*

`lib/legal/slugs.ts` declares **seven**. The five-slug era ended on 26 August 2026 with the
client-terms split, and this block is the same five-slug assumption that
`ACCESSIBILITY-STATEMENT.md` §4.3 was corrected for at round 7 — the sweep found one instance of the
class and stopped. The option's stated cost is also now understated: option (b) would need an
eighth and ninth slug, not a sixth, and it would sit alongside a split that has already been done
once and could be modelled on. Correction: re-derive the block against seven slugs, and note that
`/legal/client-terms` now demonstrates the disambiguation pattern option (b) would reuse.

**F-6 — `MSA-BUSINESS.md` 16.2's inline note contradicts a closure recorded in two other drafts.**
The note under clause 16 reads:

> *`CNV-3: the text of PECR reg. 23 … was NOT retrieved by Pass 2 and must be read before this
> clause is relied on.`*

`PRIVACY-POLICY.md` §3A records CNV-3 as **CLOSED at round 7**, having fetched reg. 23 and
established that it *"carries no 'individual subscriber' limitation"* — which is the very proposition
MSA 16.1 rests on. So the MSA tells its solicitor not to rely on a clause that the privacy notice
says is now soundly based. One of the two is stale; on the round-7 record it is the MSA. Correction:
close the note in MSA 16.2 and cite the reg. 23 reading. (I did not independently re-fetch reg. 23 in
this pass — see §5, N-3.)

**F-7 — `PRIVACY-POLICY.md` §6's Resend row is an incomplete enumeration of the same class round 7
swept in §2.** The row states the email carries *"Division, name, email, company, phone, and a record
id."* `lib/leads/notify.ts:62-81` also puts **`lead_type`** and **`service_slug`** into the body.
Neither is personal data today (`lead_type` is always `'enquiry'`; `service_slug` is one of the three
fields no form sends), so the exposure is nil — but §2's defect was *"an enumerated list in a privacy
notice reads as exhaustive"*, and this is the same list-shape in the same document, unswept.
Correction: complete the enumeration, or state it as non-exhaustive.

---

## 3. Findings re-derived differently from `04-VERIFICATION-REPORT.md`

**R-1 — the PECR penalty inversion. CONFIRMED.** Pass 4 §2.1/§4.5 proposed £8.7m / 2%, reading
para. 18(b)(ii) as modifying s. 157(2) as a whole. It modifies **paragraph (a) of** subsection (2)
— the substituted words *"from 'section 35' to 'or 78'"* occur only in (2)(a) — and (2)(a) is the
higher-maximum limb. Re-derived independently at H-3 across four instruments. **£17.5m / 4% stands.
Pass 4 inverted the tiering.**

**R-2 — the axe route split. CONFIRMED.** Counted from `ROUTES` at H-10: 15 total, 11 public,
4 internal. Pass 4's count was wrong.

**R-3 — the axe viewports and the second axis. CONFIRMED.** `VIEWPORTS` has 2 entries, not 3, and
`PHASES` is scroll position, not consent state (H-11). Consent *is* asserted by `check-axe.mjs`,
but as a separate per-route check outside the analysis product. Pass 4 was wrong on both.

**R-4 — the lead-field undercount. CONFIRMED.** Pass 4 §2.11 said *"two of which the server action
reads from submitted form data"*. `action.ts:36-54` reads **seven** (H-18). Undercount of five,
exactly as the round-7 note says.

**R-5 — NEW disagreement.** Pass 4's sweep of the five-slug assumption was incomplete. Round 7
corrected `ACCESSIBILITY-STATEMENT.md` §4.3 from "four of five" to "six of seven" and recorded the
reasoning carefully — but the identical assumption survives in `WEBSITE-TERMS.md`'s audience
decision block (F-5). `CLAUDE.md`'s *fix the class, not the instance* was not applied to the
five-slug fact. F-7 is a second, milder instance of the same pattern in `PRIVACY-POLICY.md`.

---

## 4. Ledger obligations with no clause · clauses citing ids that do not discharge them

**Id coverage is complete in both directions.** All 41 inline `L-` ids used across the seven files
resolve to a ledger heading, and all 39 ledger entries (two headings carry two ids each) are cited by
at least one clause. **No id is cited that the ledger does not carry; no entry is uncited.** Checked
by extraction and set difference, then each round-5/6/7 id read against the clause citing it.

Reading rather than string-matching produced two clause/id mismatches, both already reported:

- **F-2** — `CONSUMER-TERMS.md` 10.3 makes a copyright assignment and declares that no CDPA entry
  exists. `L-CDPA-90-91` is the entry that discharges it, and is not cited.
- **F-1** — `00-LEGAL-BASIS.md`'s two `NO LEDGER ENTRY` flags name obligations that both now have
  entries.

**Four ledger/basis records are stale** — none creates an unclaused obligation, but each misreports
the state of the work:

| Record | Says | Actually |
|---|---|---|
| `02-CITATION-LEDGER.md` CNV-3 | reg. 23 not retrieved, Pass 3 must read it | read and closed at round 7 (`PRIVACY-POLICY.md` §3A); see F-6 |
| `02-CITATION-LEDGER.md` CNV-1 | *"No ICO guidance page was fetched … no entry in this ledger rests on ICO guidance"* | still true of the **ledger**, but `COOKIE-POLICY.md` §4A now carries eight direct ICO quotations that no ledger entry backs; see N-1 |
| `02-CITATION-LEDGER.md` no-clause item 6 | *"no additional clause can fix it while there is one slug. OQ-13"* | the routes were split on 26 Aug; the obligation is discharged |
| `02-CITATION-LEDGER.md` no-clause item 11 | *"four of the five legal routes are outside the axe gate"* | six of seven (H-13) |

**`L-DPA-164A`, the ledger's number-one unclaused obligation, now has clauses** —
`WEBSITE-TERMS.md` 12A, `PRIVACY-POLICY.md` §12, `MSA-BUSINESS.md` 10.5, `CONSUMER-TERMS.md` 12.1 —
but the **build** gap it names is untouched: there is still no complaints route and no electronic
complaint form. It is correctly `[TK]` in all four places.

---

## 5. Assertions with no citation at all

**N-1 — the eight ICO quotations at `COOKIE-POLICY.md` §4A.** Sourced in prose to *Guidance on the
use of storage and access technologies*, chapter "What are the exceptions?", retrieved 25 August
2026 — but **no ledger entry carries them**, and CNV-1 still records that the ledger rests on no ICO
guidance. **I could not re-verify them: `ico.org.uk` returned HTTP 403 to this pass.** They are
verbatim-quoted, load-bearing for a `[DECISION REQUIRED]` worth the difference between consent and
the para. 5 exception, and currently rest on a single unrepeatable retrieval. They must be
re-checked against the live page by whoever publishes, and given a ledger entry.

**N-2 — the UCTA 1977 reasonableness test.** `MSA-BUSINESS.md` 11 and `WEBSITE-TERMS.md` 11 both
carry `NO LEDGER ENTRY` flags saying UCTA was never read. It still has not been. The consumer side
of the same question is fully cited at `L-CRA-57`; the business side — which is what caps Gridsmith's
exposure at 11.3 — is asserted, not verified. Correctly flagged, still open.

**N-3 — PECR reg. 23.** Round 7 says it was read; F-6 shows one document still says it was not. I
did not fetch it in this pass, so I record the closure as **claimed, not re-derived**.

Two further items are asserted-and-flagged rather than uncited, and are noted so they are not lost:
the **Provision of Services Regulations 2009** row in `00-LEGAL-BASIS.md` §1, which was never read;
and **CNV-6**, DMCCA ss. 226/227, referenced in `L-DMCC-230` and `L-WCAG-22` and never individually
fetched — `ACCESSIBILITY-STATEMENT.md` §2 option (b) relies on s. 226 by name.

---

## 6. The gate — `scripts/check-consumer-terms.mjs`

**Verdict: it asserts what the drafts rely on, it is reached, and it is wired into CI. Two stated
limits, one unguarded adjacent claim.**

**Is it reached?** Yes, proven, not assumed.

- Run green against a live server: `2 consumer-facing route(s), 51 link(s) scanned, 0 to
  /legal/business-client-terms`. A non-zero link count from a loop-incremented counter is evidence
  the scan reached real markup.
- **Branch A broken deliberately** — `BUSINESS_TERMS` repointed at `/legal/consumer-client-terms`.
  It fired: *"/press links to /legal/consumer-client-terms#clause-10-1 — the BUSINESS terms, on a
  route a consumer reads"*, exit 1. So branch A executes against real `href`s on the served page.
- **Branch C broken deliberately** — the `clause-10-1` anchor assertion repointed. It fired
  independently: *"does not carry the anchor clause-10-1, which /press links into"*, exit 1. The
  hollow-subject guard is live.
- Both probes reverted; `git status` over `scripts/` is clean.
- Wired at `package.json:33` (`verify:served`, behind `scripts/with-server.mjs`) and
  `.github/workflows/ci.yml:208`. It is not an orphan script.

**Does it assert what the drafts rely on?** The MSA head and `CONSUMER-TERMS.md` head both say the
gate asserts *"against the served pages that no consumer-facing route links here"*, that `/press`
does link to the consumer instrument, and that the consumer instrument is still the consumer
instrument. All three are branches A, B and C, and all three are asserted against fetched HTML rather
than against `CLIENT_TERMS_COUNTERPART` — which would be a gate reading its own subject. The
`EXPECTED_ROUTES = 2` literal and the `counted.links === 0` floor are both correct applications of
the rules in `CLAUDE.md`.

**Limits, two stated and one not:**

1. *Stated.* `CONSUMER_ROUTES` is hand-kept and cannot discover a Press route it is not told about.
   The `EXPECTED_ROUTES` literal makes forgetting to *shorten* the list fail loudly, but forgetting
   to *lengthen* it when Press grows a route fails silently — the new route is simply never fetched.
   That asymmetry is real and is not stated in the docstring.
2. *Stated.* `/legal/client-terms` is deliberately excluded, correctly, since its job is to link to
   both.
3. **Not guarded.** Nothing asserts that `/legal/business-client-terms` serves the **business**
   instrument, and nothing asserts that `/legal/client-terms` links to **both** and carries no
   operative clause. Both are load-bearing in the drafts — `MSA-BUSINESS.md`'s head and
   `lib/legal/slugs.ts` state the disambiguation page as the reason a redirect was rejected. Branch C
   is the hollow-subject guard for one of the three pages; the other two have none. If the
   disambiguation document lost its link to the consumer instrument, every branch would still pass and
   a consumer following the footer would land on the business terms in two hops.

One cosmetic defect: branch C's failure message hardcodes the string `clause-10-1` separately from
the predicate, so a changed predicate reports the old anchor name — visible in the probe output above.

---

## 7. VERDICT, per document

| Document | Verdict |
|---|---|
| `WEBSITE-TERMS.md` | **Needs another pass** |
| `PRIVACY-POLICY.md` | **Solicitor-ready** |
| `COOKIE-POLICY.md` | **Solicitor-ready, conditionally** |
| `ACCESSIBILITY-STATEMENT.md` | **Solicitor-ready** |
| `MSA-BUSINESS.md` | **Needs another pass** |
| `CONSUMER-TERMS.md` | **Needs another pass** |
| `00-LEGAL-BASIS.md` | **Needs another pass** |

**`WEBSITE-TERMS.md` — needs another pass.** Its open `[TK]`s (company number, registered office,
VAT number, email, phone, effective date) are all correctly-marked owner facts and none of them
blocks a solicitor. Its `[DECISION REQUIRED]`s (VAT number, and the VAT display block, now partly
resolved) are correctly-marked owner choices and none blocks a solicitor either. **What blocks it is
F-5:** the audience decision block reasons from a five-slug build that no longer exists, and asks the
solicitor to weigh option (b) against a cost that is now wrong. A solicitor cannot be asked to decide
a structural question on a false statement of what the structure is.

**`PRIVACY-POLICY.md` — solicitor-ready.** Everything I re-derived in it holds: §2A against Art. 13(2)(e)
at source, §2's ten fields and 7/3 split against `action.ts` and `schema.ts`, §6A against `load.ts`
and `config.ts`, §2A's two required fields against the schema and the migration, §6's Slack row
against `notify.ts`. Its `[TK]`s are owner facts (regions, ICO number, retention period) or build
tasks it correctly names as build tasks (the complaint form, the purge job, the ROPA, the LIA); its
four `[DECISION REQUIRED]`s are owner choices with consequences stated. F-7 is a real defect but it is
an incomplete enumeration of two non-personal fields — worth correcting, not worth blocking on, and
the solicitor will see the row.

**`COOKIE-POLICY.md` — solicitor-ready, conditionally.** §1, §2 and §4 hold against the source and
the served site. The condition is **N-1**: §4A's eight ICO quotations are the evidential base of a
decision block, they are backed by no ledger entry, and `ico.org.uk` refused this pass. Send it with
that flagged, and re-verify the quotations against the live guidance page before publication — which
is in any case what the document's own standing instruction requires of the cookie tables.

**`ACCESSIBILITY-STATEMENT.md` — solicitor-ready.** Every evidential figure re-derived from the gate
that measures it (H-10 to H-13) and all four hold. Its two `[DECISION REQUIRED]`s (conformance status,
feedback response time) are exactly the owner choices a solicitor should be asked about, and its
`[TK]`s are dates and testers. The document's honesty about the missing screen-reader pass is the
thing that makes it publishable.

**`MSA-BUSINESS.md` — needs another pass.** The round-7 corrections at 6.4, 8.3 and 15.1 are all
correct at source (H-1, H-2, H-4, H-5) and the document is otherwise in good shape; its `[TK]`s are
owner facts (cap figure, PI limit) and its one `[DECISION REQUIRED]` (whether clause 15 survives) is a
proper solicitor question. **F-6 blocks it**: clause 16.2 instructs the reader not to rely on clause
16.1 pending a reading of reg. 23 that two other drafts record as done. That is a one-line fix, but a
solicitor who follows the instruction will duplicate work and may conclude 16.1 is unsound.

**`CONSUMER-TERMS.md` — needs another pass, and it is the weakest of the six.** Three findings, and
two of them are substantive law rather than bookkeeping: **F-3** tells a consumer they have lost a
cancellation right that reg. 36(2) may leave intact; **F-2** gives a consumer a copyright assignment
that on s. 90(3) and s. 91 does not bite, while the business instrument's equivalent does; **F-4**
omits reg. 36(6). Its version header still says 1.1 though it was edited on 26 August. Section 6 is,
by its own words, *"the highest-frequency consumer exposure in the business"*.

**`00-LEGAL-BASIS.md` — needs another pass.** **F-1**: the requirements map that indexes all six
drafts still states the Late Payment rate and the fixed sum in the two forms round 7 corrected, and
still marks both CDPA and the 1998 Act as unread with `NO LEDGER ENTRY`. Its marketing row still
carries the CNV-3 caveat. This is a map that now disagrees with the territory it maps, and it is the
first file a solicitor will read.

---

## The single most important thing still wrong

**`CONSUMER-TERMS.md` §6(d) misstates when a consumer loses the right to cancel, and it misstates it
against the consumer.** reg. 36(2) makes the loss conditional on **both** an express request *and*
an acknowledgement that the right would be lost on full performance; the draft supplies the first and
presents the loss as automatic. Every other finding in this report is a stale record, an incomplete
list, or a citation to be added. This one is a clause that would tell a real Press author, in the
document written for them, that a statutory right is gone when it may not be — in the section the
draft itself identifies as the highest-frequency consumer exposure in the business.

---

*End of Pass 5. No draft was edited. No fix was applied. Nothing was committed.*
