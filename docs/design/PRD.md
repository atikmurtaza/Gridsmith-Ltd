# PRD — Gridsmith Design

**Division:** Gridsmith Design (trading division of Gridsmith Ltd)
**Scope:** `gridsmith.co.uk/design/*`
**Status:** Approved for build
**Traces to:** `_shared/00-MARKET-RESEARCH-BASIS.md`, `_shared/00-FOUNDATION.md`

---

## 1. Problem statement

Gridsmith Design serves two buyers with nothing in common:

- **Track A — Brand & Visual:** founders, marketing leads, game studios, streamers buying identity, motion, 3D and campaign assets.
- **Track B — Technical & Engineering:** engineering managers and design leads at UK SMEs buying CAD, engineering drawings, technical illustration and documentation.

Presenting these on one undifferentiated page destroys credibility with both. A streamer sees P&ID drawings and assumes you are not a creative studio. An engineering manager sees esports overlays and assumes you are not serious about BS 8888. Research finding **R6-Design** confirms the technical buyer's vetting is standards-led and evidence-led; **R4.6** confirms 67% of B2B buyers judge vendor trustworthiness by site UX.

**The site's core job is to fork the visitor into the correct track within one interaction, then run two coherent, separately-optimised funnels under one brand.**

## 2. Objectives

| # | Objective | Metric | Target |
|---|---|---|---|
| O1 | Convert qualified visitors to leads | Visitor→lead | ≥4% (SC-1); 6% stretch |
| O2 | Route visitors correctly | % sessions reaching a track page within 2 pageviews | ≥75% |
| O3 | Win technical-buyer trust without a call | Track B self-serve depth: sessions viewing pricing + process + estimator or sample gate | ≥40% of Track B sessions |
| O4 | Sell the retained offer | Design Desk enquiries as % of all Design leads | ≥25% |
| O5 | Prove premium craft | Bounce on `/design/` | ≤35% |
| O6 | Capture AI-search demand | `is_ai_referral` sessions | tracked from day 1; ≥8% of organic by month 6 |

## 3. Personas

### P1 — "Rachel", Engineering Design Manager (Track B) — **primary revenue persona**
UK M&E contractor, 40–200 staff. Drawing office at capacity; a tender deadline is three weeks out. Has been burned by a freelancer who did not understand British Standards.
- **Evaluates on:** standards fluency (BS 8888, Eurocodes, RIBA stages), QA process, sample drawings, turnaround guarantees, ability to scale up and down.
- **Objections:** "Will offshore production meet UK standards?" · "Who owns the files?" · "What happens if quality slips mid-project?"
- **Buying move:** small paid trial before larger scope (R4.3).
- **Wants from the site:** evidence and specifics. Will read a pricing table. Will not read brand poetry.

### P2 — "Tom", Founder / Marketing Lead (Track A)
Series A SaaS or D2C brand, rebranding ahead of a launch.
- **Evaluates on:** portfolio quality, relevance of past clients, process clarity, timeline.
- **Objections:** "Is this in my budget?" · "How long?" · "Will I be dealing with juniors?"
- **Wants from the site:** visual proof, fast. Then process and price.

### P3 — "Kai", Creator / Game Digital (Track A)
Streamer or indie studio buying identity, overlays, key art, 3D assets.
- **Evaluates on:** aesthetic fit, speed, price clarity.
- **Wants:** packaged offers with visible prices.

### P4 — "Priya", Procurement / Ops (Track B, secondary)
Involved late. Checks insurance, contracts, IP, data handling, company legitimacy.
- **Wants:** legal disclosure, PI insurance confirmation, IP terms, GDPR statement. Absence of these kills late-stage deals.

## 4. User stories

**Track B**
- As Rachel, I want to see drawing types you produce so I know in 10 seconds whether you cover my discipline. `FR-D07`
- As Rachel, I want per-drawing and day-rate pricing so I can estimate without an email exchange. `FR-D12`
- As Rachel, I want to request sample drawings so I can vet standards competence — the fastest vetting method per R4.2. `FR-D14`
- As Rachel, I want your QA process documented so I can assess risk. `FR-D09`
- As Rachel, I want to start with a small paid trial. `FR-D13`
- As Priya, I want company number, PI insurance scope and IP terms findable in under 30 seconds. `FR-D22`

**Track A**
- As Tom, I want to see work for companies like mine, filterable. `FR-D08`
- As Tom, I want packaged offers with from-prices. `FR-D12`
- As Kai, I want to buy a defined sprint without a discovery call. `FR-D13`

**Both**
- As any visitor, I want to identify my track immediately without reading a menu. `FR-D02`
- As a mobile visitor, I want a persistent way to convert. `FR-D19`

## 5. Functional requirements

| ID | Requirement | Priority | Traces |
|---|---|---|---|
| FR-D01 | Division hub at `/design/` with division positioning and both tracks visible above the fold | P0 | R6 |
| FR-D02 | **Track fork** — two-panel selector directly beneath hero, before any other content. Persists choice in `localStorage`; returning visitors land on their track's content ordering | P0 | O2 |
| FR-D03 | Track A landing `/design/brand-visual/` — full funnel | P0 | |
| FR-D04 | Track B landing `/design/technical-engineering/` — full funnel | P0 | |
| FR-D05 | Service pages at `/design/services/[slug]/`, minimum 10 at launch (5 per track) | P0 | R1 |
| FR-D06 | Portfolio `/design/work/` filterable by track, service, industry, year | P0 | R4.2 |
| FR-D07 | **Drawing-type matrix** on Track B — table of every drawing type × software × applicable standard | P0 | R6-Design |
| FR-D08 | Case study template with challenge/approach/outcome and ≥1 quantified metric enforced | P0 | R4 |
| FR-D09 | **QA process module** on Track B — named checking stages, revision control, who signs off | P0 | R4.1, R6 |
| FR-D10 | Process module — the canonical six stages from `_shared/00-PROCESS.md`, with Design detail lines and per-service durations | P0 | R4.1 |
| FR-D11 | **Standards strip** — BS 8888, Eurocodes, RIBA stages, ISO 128, AutoCAD/Revit/SolidWorks/Inventor named explicitly | P0 | R4.4 |
| FR-D12 | Pricing published on every service page: model, from-price, and what moves the number | P0 | R3, SC-6 |
| FR-D13 | Entry offer as primary CTA per track — Design Sprint (A) / Trial Drawing Package (B) | P0 | R4.3 |
| FR-D14 | **Sample pack request** — gated form releasing 3 redacted sample drawings; doubles as lead capture | P0 | R4.2 |
| FR-D15 | Design Desk retainer page with tiers, SLA turnaround times, and rollover policy | P0 | O4 |
| FR-D16 | Multi-step contact flow, track-aware, budget-banded | P0 | R3 |
| FR-D17 | Capacity/scaling statement — how you flex up and down | P1 | R6-Design |
| FR-D18 | UK-managed / distributed-production model stated plainly with QA implications | P1 | R6-Design |
| FR-D19 | Sticky mobile CTA bar on all templates | P0 | R1 |
| FR-D20 | FAQ per track, `FAQPage` schema | P0 | SC-14 |
| FR-D21 | **Drawing estimator** (Track B) — discipline × sheet count × complexity → indicative range, with what drives the number. Reuses the Digital `calculate.ts` pattern. Result is never gated behind an email | P0 | R3, SC-11 |
| FR-D25 | Insights hub filtered to Design topics | P2 | R1 |
| FR-D22 | Trust footer: company number, registered office, PI insurance scope, IP ownership statement, GDPR link | P0 | P4 |
| FR-D23 | Media protection: watermark, no right-click, no source downloads, display-res only | P0 | Brief |
| FR-D24 | NDA-safe case studies — anonymised client display with industry descriptor | P1 | |

## 6. Content requirements at launch

*Launch uses **seed content** per `_shared/00-FOUNDATION.md` §7 — structurally complete, visibly marked, and blocked from production builds. Real portfolio and real pricing replace it via the bulk import path once available. Volumes below are the seed volumes; they are also the real-content minimums.*

- 10 service pages (5 Track A, 5 Track B)
- 8 case studies (4 per track), each with ≥1 quantified metric
- 3 sample drawings, redacted, for the sample pack
- Drawing-type matrix populated with ≥20 rows
- 12 FAQ entries (6 per track)
- 3 insight articles seeded for organic

## 7. Non-functional requirements

Per `_shared/00-FOUNDATION.md` §7. Division-specific additions:
- Portfolio grid must render 60+ items without pagination jank — virtualised or paginated at 24
- Sample-pack PDFs served via signed, expiring URLs; never public paths
- Dark canvas requires verified 4.5:1 contrast on all body text and 3:1 on all UI borders

## 8. Out of scope for v1

Client portal · live drawing markup/review tool · e-commerce checkout for sprints · multi-language · 3D model viewer in browser · public rate card PDF download.

## 9. Launch criteria

All universal gates (`00-FOUNDATION.md` §7) plus:
- Track fork tested with 5 users from each buyer type; ≥80% self-select correctly
- Sample pack request → delivery automated and verified
- Drawing-type matrix reviewed for technical accuracy by a chartered engineer before publication — **hard gate; publishing a standards error here is unrecoverable reputationally**
