# PRD — Gridsmith Master Layer

**Scope:** `gridsmith.co.uk` root — homepage, `/about`, `/approach`, `/work`, `/insights`, `/contact`, `/legal/*`, and the shared chrome (header, footer, division switcher, error pages).
**Not a fourth division.** This is the layer that makes three divisions read as one company.
**Traces to:** `_shared/00-MARKET-RESEARCH-BASIS.md`, `00-FOUNDATION.md`, `00-PROCESS.md`

---

## 1. Problem statement

The three division specs each solve a specific buyer's problem well. None of them answers the question a visitor to `gridsmith.co.uk` actually arrives with: **what is this company, and why would I use one firm for design, software and publishing rather than three specialists?**

That question has a real answer — the continuity principle: a client who stays gets faster, cheaper and better-served because Gridsmith accumulates context no single-discipline competitor holds. But it is only an answer if it is argued. Asserted, it reads as a conglomerate justifying itself.

There is a second, structural risk. Without a master layer, three good division sites sharing a deployment produce **three brands and no company**. Cross-division work — the best proof the model works — has nowhere to live. The legal identity has no home. And a buyer referred from one division to another crosses an invisible seam.

**Core job: make the one-company argument credible, route specialist buyers away from it in one click, and carry the group's identity, proof and legal obligations.**

## 2. The tension this layer must hold

Two audiences with opposite needs arrive at the same URL:

| | Ecosystem buyer | Specialist buyer |
|---|---|---|
| Arrives | Referral, brand search, LinkedIn, word of mouth | Organic search for a specific service |
| Wants | To understand what Gridsmith is | To get to the thing they searched for |
| Harmed by | Being dumped into a division before understanding the company | Being made to read ecosystem messaging first |
| Share of traffic | Minority | **Majority** |
| Share of value | **Majority** | Minority |

The founder's stated requirement is explicit: specialist discovery must be preserved — buyers searching a specific need should not have to navigate ecosystem messaging first.

**Resolution:** most specialist buyers never touch the master layer at all, because organic search lands them on a division service page (see the division app-flows — every one of them treats the service page as a standalone funnel). For those who do arrive at the root, the division routing block sits directly under the hero, above the ecosystem argument. The argument is for people who want it; the exit is for people who don't.

## 3. Objectives

| # | Objective | Metric | Target |
|---|---|---|---|
| M1 | Route visitors to the right division | % of root sessions reaching a division within 2 pageviews | ≥70% |
| M2 | Make the ecosystem argument land | `/approach` completion depth (scroll ≥75%) | ≥40% of `/approach` sessions |
| M3 | Convert generalist and multi-need enquiries | Root-originated leads as % of all leads | ≥15% |
| M4 | Surface cross-division proof | `/work` sessions viewing a multi-division case study | ≥30% |
| M5 | Support the group's credibility | Bounce on `/` | ≤40% |
| M6 | Satisfy legal obligation | Companies Act disclosure and policies present and current | Continuous |

## 4. Personas

### M-P1 — "The referred buyer"
Sent by an existing client. Arrives at the root with a name and no context. Wants to know: are these people real, are they any good, and can they do the specific thing I need.
- **Decisive content:** work, clients, the company's legitimacy signals.

### M-P2 — "The multi-need buyer" — **the reason this layer exists**
Needs more than one thing: a brand *and* a site, or a book *and* a launch page. Currently solving it with two or three vendors and finding the coordination expensive.
- **Decisive content:** the continuity argument, cross-division case studies, and a contact path that does not force them to pick a division.
- This buyer is the entire commercial case for the master brand. If the site cannot serve them, the group structure has no advantage over three separate companies.

### M-P3 — "The specialist buyer, arriving at the root"
Searched for the company, not the service. Wants out of the general messaging fast.
- **Decisive content:** the division routing block, above the fold or immediately below it.

### M-P4 — "The evaluator" (procurement, partner, journalist, potential hire)
Checking legitimacy, scale, credentials, terms.
- **Decisive content:** `/about`, `/legal/*`, company number, registered office, insurance position, team.

## 5. Functional requirements

| ID | Requirement | Priority | Traces |
|---|---|---|---|
| FR-M01 | Homepage with hero, division routing, ecosystem argument, cross-division proof | P0 | M1, M2 |
| FR-M02 | **Division routing block** — three cards, immediately below hero, above the ecosystem argument | P0 | M3-P3, founder requirement |
| FR-M03 | `/approach` — the continuity argument, made with evidence not assertion | P0 | M2 |
| FR-M04 | **Canonical process** rendered on `/approach` — the six stages from `00-PROCESS.md` | P0 | R4.1 |
| FR-M05 | `/work` — master portfolio, all divisions, filterable, with **multi-division projects surfaced first** | P0 | M4 |
| FR-M06 | Case study template shared with divisions; renders division badges | P0 | |
| FR-M07 | `/about` — company, structure, people, legitimacy signals | P0 | M-P4 |
| FR-M08 | **Group structure disclosure** — that Design, Digital and Press are trading divisions of Gridsmith Ltd, stated plainly | P0 | Companies Act, honesty |
| FR-M09 | `/contact` — division-agnostic intake with "more than one" and "not sure" as first-class options | P0 | M-P2 |
| FR-M10 | `/insights` — hub across all divisions, filterable by division | P1 | R1 |
| FR-M11 | Shared header with division navigation | P0 | |
| FR-M12 | Shared footer with full Companies Act disclosure, policy links, division switcher | P0 | FR-M08 |
| FR-M13 | `/legal/terms`, `/legal/privacy`, `/legal/cookies`, `/legal/accessibility` | P0 | UK law |
| FR-M14 | **Cookie consent banner** — deny-by-default, reject as easy as accept | P0 | PECR |
| FR-M15 | 404 and 500 pages, master-themed, with division routing | P0 | |
| FR-M16 | Sitemap, robots, `llms.txt` covering all four route groups | P0 | R5 |
| FR-M17 | Redirect map from the existing site | P0 | Validation D-03 |
| FR-M18 | Response-time commitment stated on every confirmation screen: as soon as possible, always by end of next business day | P0 | Founder decision |
| FR-M19 | Search across services, work and insights | P2 | |
| FR-M20 | Careers page | P2 | |

## 6. The ecosystem argument (FR-M03) — content requirement

`/approach` is the page this whole layer exists for. It must argue, not assert. Structure:

1. **The problem, named honestly.** Multi-vendor coordination costs the client time, creates seams, and means nobody holds the whole picture.
2. **What Gridsmith does differently** — one contract, one team that retains context, three capabilities.
3. **The continuity principle, made concrete** — a worked example showing what changes between month 1 and month 18 of a relationship. Specific: fewer briefing hours, reused assets, faster turnarounds, decisions that don't get re-litigated.
4. **The canonical six-stage process.**
5. **The honest limits** — when you should use a specialist instead. Naming the cases where Gridsmith is the wrong answer is the move that makes the rest credible, and it mirrors the exclusions pattern already proven across the division specs.
6. **Cross-division case studies** as evidence.
7. **Structure disclosure** — one company, three divisions, why that is better for the client than three companies would be.

Point 5 is a requirement, not a suggestion. An ecosystem argument with no stated limits is a sales pitch.

## 7. Content requirements at launch

- Homepage, `/approach`, `/about`, `/contact` fully written
- **3 cross-division case studies** — seed initially, real as soon as available. Without these the argument on `/approach` is unevidenced
- Master `/work` populated from the shared project database (24 seed projects per `00-FOUNDATION.md` §7)
- 4 legal pages, drafted per `_legal/` and reviewed by a solicitor before deployment
- 6 group-level FAQs
- Team entries for whoever is public-facing

## 8. Non-functional requirements

Per `00-FOUNDATION.md` §8. Master-specific:
- The homepage is the most-linked page and the most likely to be judged. Lighthouse ≥98 performance.
- `/legal/*` must be readable, printable, and permalinked to specific clauses (`#section-id` on every clause) — division sites and contracts both reference clauses by number.

## 9. Out of scope for v1

Client portal · careers application system · investor or press area · multi-language · newsletter platform beyond a single signup · site-wide search (P2).

## 10. Launch criteria

Universal gates plus:
- Companies Act disclosure verified: registered name, number, place of registration, registered office
- All four legal pages published and reviewed by a solicitor
- Cookie banner verified: no non-essential cookie fires before consent
- Redirect map complete; zero unmapped indexed URLs
- Division routing tested: ≥70% of test users reach the correct division in one click
- No seed content visible with `NEXT_PUBLIC_ENV=production`
