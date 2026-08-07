# App Flow — Gridsmith Design

---

## 1. Primary journeys

### J1 — Rachel (Engineering Design Manager) · **highest value**

```
Google: "cad drafting services uk" / "outsource engineering drawings"
  ↓
LANDS: /design/services/cad-drafting (service page, not homepage)
  ↓ scans: what you produce → standards named → pricing table
  ↓
/design/technical-engineering  [via in-page "See the full technical offer"]
  ↓ reads: drawing-type matrix → QA process → capacity model
  ↓
DECISION POINT — one of four:
  ├─ Drawing estimator          → sheets × discipline × complexity → range
  ├─ Request sample pack        → form → 3 drawings in inbox → nurture
  ├─ Trial Drawing Package      → contact flow, pre-filled, £-banded
  └─ Leaves to compare          → retargeting + insight nurture
  ↓
Contact flow (4 steps) → Slack alert <60s → reply by end of next business day
```
**Design consequence:** the service page must be a complete standalone funnel. Rachel may never see `/design/` at all. Every service page carries the standards strip, a pricing block, a process summary and two CTAs.

### J2 — Tom (Founder, rebrand)
```
Referral or /design/ → track fork (Brand & Visual)
  → /design/brand-visual → work grid → 2–3 case studies
  → pricing tiers → Design Sprint CTA → contact flow
```
Tom needs **visual proof before words**. Track A landing leads with work, not copy.

### J3 — Kai (Creator/studio)
```
Social/organic → /design/services/[brand-identity | game-assets]
  → packaged offer with visible price → direct contact, minimal steps
```
Kai abandons on friction. Track A service pages offer a 2-step short form as an alternative to the 4-step flow.

### J4 — Priya (Procurement, late stage)
```
Sent a link by Rachel → /design/ → footer → /legal/* and /about/
  → verifies company number, PI insurance, IP terms → approves
```
No CTA needed. Pure verification. If she cannot find these in 30 seconds the deal stalls.

## 2. Track fork logic

```
                    /design/ hero
                         ↓
        ┌────────── TRACK FORK ──────────┐
        │  "What kind of design?"        │
        │                                │
        │  [Brand & Visual]  [Technical  │
        │   identity, motion, & Engineering]
        │   3D, campaign      CAD, drawings,
        │                     documentation │
        └────────┬───────────────┬─────────┘
                 ↓               ↓
         Track A landing   Track B landing
                 │               │
                 └──── cookie: gs_design_track ────┘
                              ↓
              Returning visitor: hub reorders to
              show their track's work + services first.
              Fork remains visible and switchable.
```

Fork is a two-panel component, full-width, immediately below hero. Each panel: label, one-line descriptor, three example services, one representative image. Hover/focus raises the panel and dims the other. Keyboard: two focusable panels, arrow-key navigable.

**Anti-pattern to avoid:** do not make this a modal or interstitial. It must be skippable by scrolling — some visitors want to browse both.

## 3. Page flow — `/design/` hub

| Order | Block | Purpose | Primary action |
|---|---|---|---|
| 1 | Hero: positioning line + supporting sentence | Establish division | scroll |
| 2 | **Track fork** | Route | → track landing |
| 3 | Selected work (6, mixed tracks) | Proof | → case study |
| 4 | Standards & capability strip | Credibility (R4.4) | — |
| 5 | How we work — canonical six stages, condensed (`_shared/00-PROCESS.md`) | Reduce risk (R4.1) | — |
| 6 | Design Desk teaser | Retainer (O4) | → `/design/design-desk` |
| 7 | Clients + testimonial | Proof | — |
| 8 | FAQ (6, both tracks) | Objections | — |
| 9 | CTA band | Convert | → contact |

## 4. Page flow — Track B landing (`/design/technical-engineering/`)

| Order | Block | Rationale |
|---|---|---|
| 1 | Hero: "An extension of your drawing office." + trial CTA | R6 language that resonates |
| 2 | **The three options** — in-house / freelancer / specialist partner, with honest trade-offs | R6: this is literally how the buyer frames the decision. Naming it first is disarming and high-trust |
| 3 | **Drawing-type matrix** — type × software × standard | R6: fastest capability check |
| 4 | Standards strip: BS 8888, Eurocodes, RIBA stages, ISO 128 | R4.4 |
| 5 | **QA process** — named checking stages, revision control, sign-off | R4.1, top vetting criterion |
| 6 | Delivery model — UK-managed, distributed production, UK timezone PM | R6: state it plainly, it is a known and accepted model |
| 7 | Capacity & scaling — how you flex | R6 |
| 8 | Pricing — per drawing / per sheet / day rate, with from-figures | R3, R6 |
| 8b | **Drawing estimator** — sheet count × discipline × complexity → range, no email gate | R3, SC-11 |
| 9 | **Sample pack request** | R4.2 |
| 10 | Technical case studies (4) | Proof |
| 11 | Trial Drawing Package — the entry offer | R4.3 |
| 12 | FAQ (6, technical objections) | SC-14 |
| 13 | CTA band | |

## 5. Page flow — Track A landing (`/design/brand-visual/`)

Work-first ordering: Hero → work grid (9) → services → process → packaged offers with prices → case studies (3 deep) → testimonials → FAQ → CTA.

## 6. Contact flow

```
STEP 1  Track
        [Brand & Visual] [Technical & Engineering] [Not sure]
STEP 2  Service           (options filtered by step 1)
STEP 3  Scope signals
        Track A: timeline, budget band, deliverables needed
        Track B: discipline, drawing count estimate, software, standard, deadline
STEP 4  Contact details + optional links to brief, redlines or sketches
        (links, not uploads — matches `fileRefs: z.string().url()` in SCHEMA.md
         and avoids holding client IP without a handling regime)
        ↓
   Confirmation screen with: what happens next, response-time commitment,
   calendar link for immediate booking
```

Rules:
- Progress indicator always visible; back always available; no data loss on back
- Budget is **banded radio buttons**, never free text
- "Not sure" on step 1 routes to a generalist pipeline and never blocks progress
- Service-page CTAs deep-link with steps 1–2 pre-filled (`?track=technical&service=cad-drafting`)
- Short-form variant (name, email, one message field) available on Track A service pages via a "Just send a message" link — for Kai

## 7. Sample pack flow

```
CTA → modal-free dedicated section
  → form: name, work email, company, role, discipline
  → validation: work email required (block free providers), Turnstile
  → success state: "Check your inbox — three drawings, 72-hour links"
  → email: 3 signed URLs + a one-paragraph note on what to look for in them
  → 3 days later: automated follow-up offering the Trial Drawing Package
```
Blocking free email domains is deliberate: it costs a small number of legitimate leads and removes a large number of competitor and student downloads.

## 8. States (required on every template)

| State | Requirement |
|---|---|
| Loading | Skeletons matched to final layout dimensions — zero CLS |
| Empty (filtered work, no results) | Illustrated empty state + "clear filters" + 3 suggested projects |
| Form error | Inline, field-level, `aria-describedby`, focus moved to first error |
| Submit failure | Preserve all input, show retry, surface a direct email fallback |
| Submit success | Dedicated page (not a toast) so it is trackable and shareable |
| 404 | Division-themed, with search and top 6 services |
| 500 | Static fallback, no JS dependency, email fallback visible |
| Offline | Cached shell via service worker (P2) |

## 9. Navigation

Header: `Gridsmith` wordmark (→ master) · `Design` (→ hub) · Brand & Visual · Technical & Engineering · Work · Design Desk · About · **[Start a project]**

Division switcher lives in the footer, not the header — visitors deep in a division should not be pulled sideways mid-funnel.

Mobile: hamburger + **persistent bottom CTA bar** showing the track-appropriate entry offer (FR-D19).

Breadcrumbs on all pages below hub level, with `BreadcrumbList` schema.
