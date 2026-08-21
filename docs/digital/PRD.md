# PRD — Gridsmith Digital

**Division:** Gridsmith Digital (trading division of Gridsmith Ltd)
**Scope:** `gridsmith.uk/digital/*`
**Sells:** websites, custom software, digital products, AI integration
**Traces to:** `_shared/00-MARKET-RESEARCH-BASIS.md`, `_shared/00-FOUNDATION.md`

---

## 1. Problem statement

The development-agency market has three structural problems the site must solve:

1. **Buyers cannot tell agencies apart.** Every dev shop claims the same things. Differentiation has to be structural, not adjectival.
2. **Buyers have been burned and now screen defensively.** R6-Digital: they actively look for vague deliverable lists, guaranteed outcomes, no ramp-period honesty, and large prepayment discounts as red flags. A site that reads as confident marketing triggers exactly these alarms.
3. **Price opacity kills conversion.** R3: transparent pricing lifts form submissions 20–35%; agency pricing calculators have moved lead conversion from under 2% to over 11%.

Gridsmith Digital's differentiator is **ownership**: the client owns the code, the data and the infrastructure. Nothing is rented from us. This is a verifiable structural claim, not a positioning adjective — and the site must make it verifiable rather than assert it.

**Core job of the site: convert a sceptical, comparison-shopping technical or operational buyer into a paid Diagnostic without a sales call.**

## 2. Objectives

| # | Objective | Metric | Target |
|---|---|---|---|
| O1 | Convert visitors to leads | Visitor→lead | ≥4% (SC-1); 6% stretch |
| O2 | Make the estimator the primary conversion path | Estimator completion → lead | ≥35% of estimator starts |
| O3 | Sell the Diagnostic, not the build | Diagnostic enquiries as % of Digital leads | ≥50% |
| O4 | Attach recurring revenue | Care Plan mentioned/selected in enquiry | ≥40% |
| O5 | Enable rep-free evaluation (R4.5) | Sessions reaching pricing + process + stack pages | ≥45% |
| O6 | Prove craft through the artifact | Lighthouse 100/100/100 on all Digital routes | Maintained |

## 3. Personas

### P1 — "Dan", Operations Director — **primary**
40–300 person business. A manual process (spreadsheets, email chains, a legacy Access database) is breaking. Not technical, but technically literate. Has authority up to ~£50k.
- **Evaluates on:** does this firm understand my process, or just software? Clear scope. Fixed price or predictable cost. What happens after launch.
- **Objections:** "How do I know the price won't double?" · "What if you disappear?" · "Who owns it?"
- **Buying move:** wants a small, defined, paid first step before committing.

### P2 — "Sarah", Founder / CTO-less startup
Needs an MVP or a platform build. Comparing agencies against hiring.
- **Evaluates on:** technical credibility, stack choices, speed, whether she'll be locked in.
- **Objections:** "Will I be able to take this in-house later?" · "Are you going to build it on something proprietary?"
- **Wants:** the actual stack named, the handover terms stated, and a realistic timeline including ramp.

### P3 — "Marcus", Marketing Lead (website buyer)
Needs a marketing site. Lower value, higher volume, faster cycle.
- **Evaluates on:** portfolio, price, timeline, CMS ease of use.
- **Wants:** a price range within 30 seconds.

### P4 — "Ellie", Technical Evaluator
Brought in to assess. Reads the stack page, checks the site's own performance, opens devtools.
- **Wants:** honest technical detail. Will detect and punish marketing fluff.
- **The site itself is the artifact she evaluates.** O6 exists for her.

## 4. Functional requirements

| ID | Requirement | Priority | Traces |
|---|---|---|---|
| FR-DG01 | Hub at `/digital/` with positioning and four service groups | P0 | |
| FR-DG02 | Service group landings: `/digital/websites/`, `/digital/software/`, `/digital/products/`, `/digital/ai-integration/` | P0 | |
| FR-DG03 | Service pages `/digital/services/[slug]/`, ≥10 at launch | P0 | R1 |
| FR-DG04 | **Build estimator** — interactive, multi-input, produces a real range and a downloadable scope summary | P0 | R3 |
| FR-DG05 | Estimator output converts directly into a pre-filled Diagnostic enquiry | P0 | O2, O3 |
| FR-DG06 | **Ownership guarantee module** — code, data, infrastructure, repo access, handover terms, stated as contractual commitments | P0 | Positioning |
| FR-DG07 | **Stack transparency page** `/digital/stack/` — every technology used, why, and what it means for the client | P0 | P2, P4 |
| FR-DG08 | **"What we don't do" section** — explicit exclusions | P0 | R6-Digital |
| FR-DG09 | Diagnostic offer page `/digital/diagnostic/` — the entry product, priced, with a sample deliverable | P0 | R4.3 |
| FR-DG10 | Care Plan page `/digital/care/` — tiers, SLA, response times, what is and is not included | P0 | O4 |
| FR-DG11 | Pricing on every service page: model, from-price, and what moves the number | P0 | SC-6 |
| FR-DG12 | **Ramp-period honesty module** — realistic timelines including discovery and iteration | P0 | R6-Digital |
| FR-DG13 | Process module — the canonical six stages from `_shared/00-PROCESS.md`, with Digital detail lines, durations and client time commitment | P0 | R4.1 |
| FR-DG14 | Portfolio `/digital/work/` filterable by service, industry, stack | P0 | R4.2 |
| FR-DG15 | Case study template with before/after and ≥1 quantified metric | P0 | R4 |
| FR-DG16 | Multi-step contact flow, estimator-aware | P0 | |
| FR-DG17 | Sticky mobile CTA | P0 | R1 |
| FR-DG18 | FAQ with `FAQPage` schema, objection-led | P0 | SC-14 |
| FR-DG19 | Live performance badge — real Core Web Vitals of this site, fetched from CrUX | P1 | O6 |
| FR-DG20 | Trust footer: company number, registered office, IP/ownership statement, GDPR, security posture | P0 | |
| FR-DG21 | Insights hub filtered to Digital topics | P2 | |
| FR-DG22 | Open-source / public work links where they exist | P2 | P4 |

## 5. The estimator (FR-DG04) — detailed requirement

The single highest-leverage component on the site (R3). Requirements:

- **Inputs:** project type · scale (pages / user roles / integrations) · design need (use existing brand / new brand) · content status · integrations required · timeline urgency · ongoing support needed
- **Output:** a **range**, not a point estimate, with the range width honestly reflecting uncertainty
- Must show **what drives the number** — each input's contribution visible, so the buyer learns rather than just receives a price
- Must **never require an email to see the result.** Gating the result destroys the trust the tool creates. Email is requested *after* the result, to send a written scope summary.
- Result page is a real URL, shareable — buyers forward these internally to get budget approval, which is a free distribution mechanism
- Ranges must be honestly wide where uncertainty is real. A falsely precise estimator that is later contradicted by the proposal is worse than no estimator.
- Every estimator completion logs inputs to `digital_estimates` regardless of whether the user converts — this is market-demand data

## 6. Content requirements at launch

*Launch uses **seed content** per `_shared/00-FOUNDATION.md` §7 — structurally complete, visibly marked, and blocked from production builds. Real portfolio and real pricing replace it via the bulk import path once available. Volumes below are the seed volumes; they are also the real-content minimums.*

- 4 service group landings, 10 service pages
- 8 case studies, each with a quantified metric and a named stack
- Stack page covering ≥15 technologies with honest rationale
- Diagnostic sample deliverable (redacted real example, not a mockup)
- 15 FAQs, objection-led
- 3 insight articles
- "What we don't do" list, minimum 6 items

## 7. Non-functional requirements

Per `_shared/00-FOUNDATION.md` §7, with one raised bar:

**Digital routes must score 100/100/100 in Lighthouse, not ≥95.** For a division selling software craft, the site's own measurable quality is the primary proof (R4.6). This is a launch gate specific to this division.

Estimator must be fully keyboard operable and function with JavaScript enabled only — but the page must render a static pricing table as a `<noscript>` and SSR fallback so the pricing information is never JS-dependent for crawlers or assistive tech.

## 8. Out of scope for v1

Client portal · live project dashboards · self-serve checkout · client login · multi-language · booking-calendar embed on every page (one link on the confirmation screen only).

## 9. Launch criteria

Universal gates plus:
- Estimator tested against 10 historical real projects; output range must contain the actual final price in ≥8 of 10. **If it fails this, the estimator does not ship** — a wrong estimator is worse than none.
- Lighthouse 100/100/100 on all Digital templates
- Ownership guarantee wording reviewed against the actual client contract — the site must not promise terms the contract does not give
