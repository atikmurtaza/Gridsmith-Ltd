# PRD — Gridsmith Press

**Division:** Gridsmith Press (trading division of Gridsmith Ltd)
**Scope:** `gridsmith.uk/press/*`
**Sells:** book publishing services, ghostwriting, editorial, content programmes
**Traces to:** `_shared/00-MARKET-RESEARCH-BASIS.md`, `_shared/00-FOUNDATION.md`

---

## 1. Problem statement

Press faces a market condition neither other division does: **the buyer arrives already suspicious.**

R6-Press is unambiguous. Authors are repeatedly warned that "many of them are vanity presses looking to take advantage of aspiring writers," and are advised to verify legitimacy before engaging. The screening behaviours they are taught are specific: check independent ratings, be cautious of vague promises, guaranteed fame, unexplained fees, and pressure to purchase without reviewing terms.

This inverts normal conversion design. On most service sites, enthusiasm converts. Here, **enthusiasm is a warning sign.** A site that promises bestseller outcomes, uses aspirational hero imagery, or obscures its pricing will be correctly identified as a vanity press and discarded.

The site's core job is therefore: **be transparently, verifiably not a vanity press — and only then, sell.**

**The structural answer is stronger than any accreditation.** Gridsmith Press is a service business, not a publisher: the author holds the copyright, the author receives 100% of royalties, the author's own ISBN is used, the author is the publisher of record, the retail accounts are in the author's name, and Gridsmith operates no imprint and never touches sales income. A vanity press's entire business model depends on holding at least one of those. Stating all six plainly, and being verifiably checkable on each, is the credibility argument — and it is why no trade body accreditation is being pursued.

The capability argument sits on top: Gridsmith takes an author from draft to a book that meets the published specification of every platform they want to sell on. Marketing is a separate, separately-priced service.

The second job is commercial: individual authors are the volume and the case studies; **B2B and founder books are the margin, the repeat business and the payment reliability.** The site must serve both without letting the individual-author funnel dilute the B2B positioning.

## 2. Objectives

| # | Objective | Metric | Target |
|---|---|---|---|
| O1 | Convert visitors to leads | Visitor→lead | ≥4% (SC-1); 6% stretch |
| O2 | Establish legitimacy fast | Sessions viewing rights/pricing/process | ≥55% |
| O3 | Grow the high-margin segment | B2B & founder-book share of leads | ≥35% |
| O4 | Sell the entry offer | Manuscript Assessment share of leads | ≥30% |
| O5 | Build recurring revenue | Content Programme enquiries | ≥15% of leads |
| O6 | Feed the other divisions | Press leads flagged for Design/Digital follow-on | ≥25% |

## 3. Personas

### P1 — "Margaret", First-time author
Has a finished or near-finished manuscript. Has read the warnings. Has probably had a bad experience with a company that quoted vaguely and charged more later.
- **Evaluates on:** who owns the rights, who keeps royalties, exactly what is included, exactly what it costs, whether real books exist that she can go and buy.
- **Objections:** "Is this a vanity press?" · "Will I own my book?" · "What are the hidden costs?" · "Can I see books you've actually published?"
- **Converts on:** verifiable specifics. Nothing else.

### P2 — "James", Founder / Executive — **highest value**
Writing a credibility book. Time-poor, budget-comfortable. Wants the book to exist and to be good; does not want to write it himself.
- **Evaluates on:** quality of past books, the ghostwriting process, how much of his time it takes, whether the book will sound like him.
- **Objections:** "How many hours does this cost me?" · "Will it sound like me or like a template?" · "What if I hate the draft?"
- **Converts on:** a clearly specified process with named time commitments and revision rights.

### P3 — "Nadia", Marketing / Comms Lead
Buying whitepapers, reports, an ongoing content programme. Corporate procurement follows.
- **Evaluates on:** samples, turnaround, capacity, contracting.
- **Wants:** retainer structure, SLAs, invoicing terms.

### P4 — "Robert", Legacy / memoir author
Personal project, often older, often the least commercially sophisticated and therefore the most vulnerable to predatory selling.
- **Ethical obligation:** the site must be **more** protective toward this persona, not more persuasive. No urgency tactics, no scarcity, no upsell pressure. A clear statement of what he will and will not get commercially.

## 4. Functional requirements

| ID | Requirement | Priority | Traces |
|---|---|---|---|
| FR-P01 | Hub at `/press/` with positioning and three service groups | P0 | |
| FR-P02 | Group landings: `/press/book-publishing/`, `/press/ghostwriting/`, `/press/content-programmes/`, `/press/book-marketing/` | P0 | |
| FR-P03 | Service pages `/press/services/[slug]/`, ≥10 at launch | P0 | R1 |
| FR-P04 | **Rights & Royalties module** — plain-English statement that the author retains 100% of rights and royalties, with the contract clause referenced | P0 | R6-Press |
| FR-P05 | **"What we are and are not"** — explicit statement that Press is not a traditional publisher and not a vanity press, with an honest explanation of the differences | P0 | R6-Press |
| FR-P06 | **Full package pricing published** — every package, every price, every inclusion, every exclusion. No "from" hiding, no quote-only packages | P0 | R3, R6-Press |
| FR-P07 | **Named distribution** — the actual platforms books are published to (Amazon KDP, IngramSpark, Draft2Digital, Kobo, Apple Books) explained honestly, including that authors could use them directly | P0 | R6-Press |
| FR-P07a | **Platform compliance module** — for each named platform, what its specification requires (trim, bleed, spine, colour profile, metadata, category and keyword rules) and what Gridsmith does to meet it. This is the concrete answer to "why not just do it myself" | P0 | Positioning |
| FR-P04a | **"You are the publisher" module** — the ISBN is registered to the author, Gridsmith operates no imprint, Gridsmith's name does not appear as publisher. Gridsmith assists in obtaining the author's own ISBN | P0 | R6-Press |
| FR-P27 | **Marketing as a separate package** — `/press/book-marketing/`, priced separately, never bundled, and carrying the no-outcome statement prominently | P0 | Founder model, ETH-02 |
| FR-P08 | **Published books shelf** — real titles with retailer links so a visitor can verify independently | P0 | R6-Press, R4.2 |
| FR-P09 | **Publishing Path Finder** — 5-question tool that recommends a path, including recommending self-service platforms when that is genuinely the right answer | P0 | R3, ethics |
| FR-P10 | Manuscript Assessment entry offer, priced, with a sample report | P0 | R4.3, O4 |
| FR-P11 | Ghostwriting process module with **named author time commitment per stage** | P0 | P2 |
| FR-P12 | Revision policy stated explicitly — how many rounds, what happens beyond | P0 | R6-Press |
| FR-P13 | Content Programme page with retainer tiers and SLAs | P0 | O5 |
| FR-P14 | Process module — the canonical six stages from `_shared/00-PROCESS.md`, with Press detail lines and per-service durations | P0 | R4.1 |
| FR-P15 | Case studies with author testimonial and a verifiable published title | P0 | R4 |
| FR-P16 | Multi-step contact flow, segment-aware (author / business / memoir) | P0 | |
| FR-P17 | Sticky mobile CTA | P0 | R1 |
| FR-P18 | FAQ, objection-led, `FAQPage` schema — **must include the vanity-press question directly** | P0 | SC-14 |
| FR-P19 | Credentials strip: company number, years trading, titles published to date, platforms published to, and the author-ownership statement. **No imprint is claimed, because none is operated** | P0 | R4.4 |
| FR-P20 | Cross-division prompt on the confirmation screen only — never mid-funnel | P1 | O6 |
| FR-P21 | Sample chapter / sample report request | P1 | R4.2 |
| FR-P22 | Insights hub filtered to Press topics | P2 | |
| FR-P23 | Trust footer with company number, registered office, contract summary link, GDPR | P0 | |
| FR-P24 | **Consumer terms path** — individual author and memoir segments are served the Consumer Terms, not the business MSA. The contact flow must identify which applies before an order is confirmed | P0 | CRA 2015, `_legal/00-LEGAL-BASIS.md` §3 |
| FR-P25 | **14-day cancellation notice** — consumer segments see the cancellation right stated before pricing, in plain language | P0 | CCR 2013 |
| FR-P26 | **Early-start express request** — a separate, unbundled checkbox at order confirmation where the client asks work to begin inside the 14 days, with the loss-of-rights wording and a timestamped record | P0 | CCR 2013 regs 36–37 |

## 5. Ethical requirements (division-specific, P0)

These are requirements, not guidance. Press sells to people who can be harmed by bad selling.

| ID | Requirement |
|---|---|
| ETH-01 | No countdown timers, no scarcity claims, no "only X slots left", ever |
| ETH-02 | No claims or implications about sales volume, bestseller status, or income |
| ETH-03 | Every package price includes the total; no fee is introduced after enquiry |
| ETH-04 | The Path Finder must recommend a cheaper or self-service route when that is genuinely correct, including recommending nobody |
| ETH-05 | Realistic commercial expectations stated plainly on the book-publishing landing — most self-published books sell modestly |
| ETH-06 | No testimonial may be used without written permission and verifiable attribution |
| ETH-07 | Memoir/legacy buyers see the commercial-expectations statement before any pricing |
| ETH-08 | The early-start checkbox is never pre-ticked, never bundled with terms acceptance, and never presented in a way that pressures a decision |

ETH-04 and ETH-05 will feel commercially counterproductive. They are the mechanism by which P1 and P4 decide you are legitimate, and legitimacy is the binding constraint on this division's conversion rate.

## 6. Content requirements at launch

*Launch uses **seed content** per `_shared/00-FOUNDATION.md` §7 — structurally complete, visibly marked, and blocked from production builds. Real portfolio and real pricing replace it via the bulk import path once available. Volumes below are the seed volumes; they are also the real-content minimums.*

- 3 group landings, 10 service pages
- 8 case studies, each linked to a **real, purchasable title**
- Published books shelf: ≥12 titles with live retailer links
- Full package matrix: every package, price, inclusion, exclusion
- Sample Manuscript Assessment report, redacted, real
- 18 FAQs including the vanity-press question answered directly
- Rights & royalties statement, reviewed against the actual author contract
- 3 insight articles

## 7. Non-functional requirements

Per `_shared/00-FOUNDATION.md` §7, plus:
- Book cover imagery is the primary visual content — image optimisation matters more here than in Digital. Covers must be crisp at 2x without breaking LCP.
- Retailer links must be checked automatically; a dead link on the books shelf is a legitimacy failure. Weekly automated link check with alerting.

## 8. Out of scope for v1

Author portal · manuscript upload and tracking · e-commerce for books · print-on-demand integration · royalty dashboards · multi-language · course or membership products.

## 9. Launch criteria

Universal gates plus:
- Rights & royalties wording signed off against the real author contract — **hard gate**
- All ≥12 retailer links verified live
- Path Finder tested to confirm it does recommend self-service routes where appropriate (ETH-04) — verified by running the 3 scenarios where it should
- Vanity-press FAQ answer reviewed by someone outside the business for credibility
