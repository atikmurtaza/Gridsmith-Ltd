# App Flow — Gridsmith Digital

---

## 1. Primary journeys

### J1 — Dan (Ops Director) · **primary revenue journey**
```
Google: "custom software for [process]" / "replace spreadsheet with app"
  ↓
LANDS: /digital/software or /digital/services/internal-tools
  ↓ reads: the problem framing → what you build → pricing model
  ↓
/digital/estimate   ← the pivotal moment
  ↓ 6 inputs, ~90 seconds, sees a range and what drives it
  ↓
Result page: £X–£Y, breakdown, assumptions, exclusions, confidence
  ↓ shares URL internally for budget approval  ← free distribution
  ↓
"Book a Diagnostic — £2,500, 2 weeks, you own the spec either way"
  ↓
Contact flow, pre-filled from the estimate → Slack <60s → reply by end of next business day
```
**Design consequence:** the estimate result page must be designed as an *internal-forwarding artifact*. It is read by people who never visited the site. It therefore needs: what Gridsmith is, what the estimate covers, what it excludes, and a clear next step — all standalone.

### J2 — Sarah (Founder, MVP)
```
Referral → /digital/ → /digital/products → /digital/stack (long dwell)
  → ownership guarantee module → case studies
  → estimator → Diagnostic
```
Sarah's decisive page is `/digital/stack`. She is checking whether you build on things she could hire for later. **Name real technologies. Naming nothing reads as hiding something.**

### J3 — Marcus (Marketing Lead, website)
```
Organic/referral → /digital/websites → price range within 30 seconds
  → portfolio → short contact form
```
Marcus is the fastest cycle and lowest value. Give him a visible price band on the group landing itself so he does not need the estimator.

### J4 — Ellie (Technical Evaluator)
```
Sent a link → opens devtools → checks Lighthouse → reads /digital/stack
  → checks whether the site does what it claims
  → reports back internally
```
No conversion event. Her output is a yes/no to a colleague. **The entire O6 requirement (100/100/100) exists for this journey.** She is invisible in analytics and decisive in outcome.

## 2. Estimator flow

```
ENTRY  /digital/estimate  or  any "Estimate this" CTA
   ↓
   Static pricing bands visible immediately (SSR, no JS needed)
   ↓
STEP 1  What are you building?
        [Marketing site] [Web app] [Internal tool] [MVP / product] [AI integration]
   ↓
STEP 2  Scale
        contextual to step 1 — pages, user roles, or integration count
   ↓
STEP 3  Design
        [Use our existing brand] [Refresh it] [Create from scratch]
   ↓
STEP 4  Content & data
        [Ready] [Partly ready] [Needs creating] · existing data to migrate?
   ↓
STEP 5  Integrations
        multi-select: payments, CRM, auth/SSO, email, accounting, custom API, none yet
   ↓
STEP 6  Timeline & support
        [Standard] [Compressed]  ·  ongoing support: [None] [Care] [Care+] [Partner]
   ↓
RESULT  (no email required — this is the trust move)
        ┌──────────────────────────────────────┐
        │  £24,000 – £38,000                   │
        │  Confidence: Medium                  │
        │  Ongoing: £900 – £1,600 / month      │
        │                                      │
        │  BREAKDOWN         What drives it    │
        │  Discovery & spec  £2.5k – £4k       │
        │  Design            £4k  – £8k        │
        │  Build             £14k – £22k       │
        │  Launch & handover £3.5k – £4k       │
        │                                      │
        │  ASSUMPTIONS (5)                     │
        │  NOT INCLUDED (6)                    │
        │                                      │
        │  [Book a Diagnostic — £2,500]        │
        │  [Email me this summary]             │
        │  [Copy shareable link]               │
        └──────────────────────────────────────┘
```

**Hard rules:**
- Result is never gated behind an email. Gating destroys the trust the tool creates and, per R3, the tool's value *is* the trust.
- "NOT INCLUDED" is displayed with equal prominence to the price. This is the anti-vagueness move R6-Digital says buyers screen for.
- Every step is skippable with a "not sure" option that widens the range and lowers `confidence` rather than blocking progress.
- Abandonment at any step still logs the partial input.

## 3. Page flow — `/digital/` hub

| Order | Block | Purpose |
|---|---|---|
| 1 | Hero: "Built to be owned, not rented." + estimator CTA | Positioning + primary action |
| 2 | Four service groups | Route |
| 3 | **Ownership guarantee** — 4 contractual commitments | The differentiator, stated as terms not claims |
| 4 | Live vitals badge + "this site scores X" | Proof by artifact (O6) |
| 5 | Selected work (6) | Proof |
| 6 | Process — canonical six stages with durations and client time (`_shared/00-PROCESS.md`) | R4.1 |
| 7 | **What we don't do** | R6-Digital anti-vagueness |
| 8 | Diagnostic offer | Entry conversion (O3) |
| 9 | Care Plan teaser | Recurring (O4) |
| 10 | FAQ (8) | Objections |
| 11 | CTA band | |

## 4. Page flow — Diagnostic page (`/digital/diagnostic/`)

The most important single page on the Digital site, because O3 targets 50% of leads arriving here.

| Order | Block |
|---|---|
| 1 | What it is: 2 weeks, fixed £, you own the output regardless of what happens next |
| 2 | Why it exists: honest explanation that scoping is real work and free proposals are guesswork |
| 3 | What you receive: itemised deliverable list |
| 4 | **A real sample deliverable** — redacted, downloadable, from an actual engagement |
| 5 | What happens after: three honest paths — we build it, you build it, you shelve it |
| 6 | Price and timeline |
| 7 | Who it is for / not for |
| 8 | FAQ |
| 9 | CTA |

Block 5 is the conversion mechanism. Explicitly stating "you can take the spec and build it elsewhere" is counterintuitive and is exactly what makes it credible.

## 5. Contact flow

```
STEP 1  What do you need?
        [Website] [Software] [Product/MVP] [AI integration] [Not sure]
        — skipped entirely if arriving from an estimate
STEP 2  Where are you?
        [Just exploring] [Have a defined need] [Have a spec] [Need to start now]
STEP 3  Scope signals
        budget band · timeline · existing systems · team size
        — pre-filled from estimate where available, shown as editable
STEP 4  Contact details + optional link to an existing brief or spec
        (link, not upload — matches `briefRefs: z.string().url()` in SCHEMA.md)
        ↓
   Confirmation: what happens next, response-time commitment, booking link
```

Rules:
- Arriving from an estimate collapses the flow to 2 steps. The estimate already answered 1 and 3.
- Budget banded, never free text.
- "Just exploring" never disqualifies — it routes to a nurture sequence rather than a sales call, which is honest and preserves the relationship.

## 6. States

| State | Requirement |
|---|---|
| Estimator loading | Static pricing table already visible; island hydrates without shifting layout (CLS ≤0.02) |
| Estimator, JS disabled | Static bands table + "contact us for a scoped estimate" — pricing information never JS-locked |
| Estimate not found (expired id) | Explain the 90-day expiry, offer to re-estimate, preserve nothing |
| Work grid, no results | Empty state + clear filters + 3 suggested projects |
| Form error | Field-level, `aria-describedby`, focus to first error |
| Submit failure | Preserve all input, retry, email fallback |
| Vitals badge, stale data | Badge hidden entirely — never show stale numbers |
| 404 / 500 | Themed, static, email fallback visible |

## 7. Navigation

Header: `Gridsmith` · `Digital` · Websites · Software · Products · Work · Stack · **[Estimate a project]**

The primary header CTA is the estimator, not "contact". This is deliberate: the estimator converts better (R3) and pre-qualifies. Contact remains available in the footer and on every page body.

Mobile: hamburger + persistent bottom bar with **[Estimate]** and **[Talk to us]** split 60/40.
