# App Flow — Gridsmith Master Layer

---

## 1. Primary journeys

### M-J1 — Referred buyer
```
Name mentioned → google "gridsmith" → /
  ↓ hero: what this company is, one sentence
  ↓ division routing block  ← most leave here, correctly
  ↓ (if staying) selected work → /about → legitimacy check
  ↓
Either: division hub → division funnel
Or:     /contact with "more than one" selected
```

### M-J2 — Multi-need buyer · **the reason this layer exists**
```
/ → reads hero, does NOT click a division card (their need spans two)
  ↓ ecosystem argument block → /approach
  ↓ the continuity worked example  ← the decisive content
  ↓ the honest limits section      ← the credibility move
  ↓ cross-division case study
  ↓
/contact → STEP 1: "More than one" → generalist pipeline → Atik personally
```
**Design consequence:** the homepage must not force a division choice. A visitor who needs brand *and* website must have a path that does not require picking one. That path is the ecosystem block → `/approach` → `/contact`.

### M-J3 — Specialist buyer at the root
```
/ → division routing block → division hub  (target: within one click)
```
Nothing else on the homepage should compete with this above the second scroll.

### M-J4 — Evaluator
```
/ → /about → team, structure, company number
  → /legal/terms, /legal/privacy
  → footer: registered office, company number, insurance position
```
No conversion event. Pure verification. Must be completable in under 90 seconds.

## 2. Homepage structure

| Order | Block | Purpose | Primary action |
|---|---|---|---|
| 1 | Hero — one sentence on what Gridsmith is. **Not a services list.** | Orient | scroll |
| 2 | **Division routing — three cards** | Route (M-J3) | → division hub |
| 3 | The one-company argument, condensed (3 short points) | Frame (M-J2) | → `/approach` |
| 4 | Selected work — 6, mixed, **at least 1 cross-division** | Proof | → `/work/[slug]` |
| 5 | The six-stage process, condensed | Reduce risk | → `/approach` |
| 6 | Clients and testimonial | Proof | — |
| 7 | Group structure statement — three divisions, one company, one contract | Honesty + legal | → `/about` |
| 8 | Latest insights (3) | Authority | → `/insights` |
| 9 | CTA band — "Tell us what you need" | Convert | → `/contact` |

**Block 2 must be above the second viewport on every breakpoint.** This is the founder's specialist-discovery requirement made testable.

## 3. Division routing block (FR-M02)

```
┌──────────────────┬──────────────────┬──────────────────┐
│  DESIGN          │  DIGITAL         │  PRESS           │
│                  │                  │                  │
│  Brand, visual,  │  Websites,       │  Books, ghost-   │
│  motion, 3D,     │  software,       │  writing,        │
│  engineering     │  products,       │  content         │
│  drawings & CAD  │  AI integration  │  programmes      │
│                  │                  │                  │
│  → Design        │  → Digital       │  → Press         │
└──────────────────┴──────────────────┴──────────────────┘
        Not sure, or need more than one? → Tell us what you need
```

- Three equal cards, each a real `<a>`, each carrying that division's accent as a top rule
- The "not sure / more than one" line sits directly beneath and is **not visually subordinate** — it is M-J2's entry point and M-J2 is the highest-value journey
- Hover/focus: card raises, accent rule wipes in, siblings drop to 60% opacity
- Mobile: stacked cards, full width, the "not sure" line immediately after

## 4. `/approach` flow

| Order | Block |
|---|---|
| 1 | The problem: what multi-vendor coordination actually costs |
| 2 | What Gridsmith does differently — one contract, retained context, three capabilities |
| 3 | **The continuity worked example** — month 1 vs month 18, with specifics |
| 4 | The six-stage process, full |
| 5 | **When you should use a specialist instead** — the honest limits |
| 6 | Cross-division case studies (2–3) |
| 7 | Structure: one company, three divisions, what that means for your contract and invoicing |
| 8 | CTA → `/contact` |

Block 5 is a hard requirement. An ecosystem argument with no stated limits reads as a pitch, and this page's entire job is to be believed.

## 5. `/work` — master portfolio

Grid of all projects, all divisions.

- **Default sort surfaces multi-division projects first**, then featured, then recency. These are the proof the model works and they are the reason this page exists rather than three division grids.
- Filters: division (multi-select), industry, year, service. URL state.
- Cards show division badges — a project tagged Design + Digital shows both.
- Clicking a card goes to `/work/[slug]` (the canonical URL — see TECH-SPEC §2).
- Empty state: clear filters + three suggested projects.

## 6. `/contact` flow

The master contact form is deliberately **not** a division form.

```
STEP 1  What do you need?
        [Design] [Digital] [Publishing] [More than one] [Not sure yet]
STEP 2  Branch:
        Single division  → hand off to that division's question set
        More than one    → which combination + what is driving the timing
        Not sure         → describe the outcome you want, free text, no taxonomy
STEP 3  Scope signals — budget band, timeline
STEP 4  Contact details
        ↓
   Confirmation screen
```

**Confirmation screen copy (FR-M18) — exact commitment, used site-wide:**

> Thanks — we've got it.
> We'll reply as soon as we can, and always by the end of the next business day.
> If it's urgent, call [number] during [hours].

No template anywhere on the site may promise faster. This wording is the ceiling.

Rules:
- "More than one" and "Not sure yet" are equally weighted with the division options — never styled as fallbacks
- Both route to a generalist pipeline handled personally, not to a division queue
- Budget banded, never free text
- Division-specific forms remain on division sites; this form exists for the people those forms would fail

## 7. States

| State | Requirement |
|---|---|
| Consent banner | Appears on first visit, keyboard-escapable, does not obscure skip link, does not shift layout (reserve space or overlay) |
| `/work` empty (filtered) | Clear filters + 3 suggestions |
| `/work` loading | Skeletons at final dimensions, zero CLS |
| Form error | Field-level, `aria-describedby`, focus to first error |
| Submit failure | Preserve input, retry, direct email fallback |
| 404 | Master-themed, search box, division routing block repeated, top 6 services |
| 500 | Static, no JS dependency, email and phone visible |
| Seed content in production | Build fails — see TECH-SPEC §6 |

## 8. Navigation

**Header:** `Gridsmith` wordmark → `/` · Design · Digital · Press · Work · Approach · About · **[Tell us what you need]**

Inside a division, the header switches to that division's navigation, with the wordmark still returning to `/`.

**Footer (every page):**
- Division switcher — three links
- Company: About · Approach · Insights · Contact · Careers
- Legal: Terms · Privacy · Cookies · Accessibility · Cookie preferences
- **Statutory disclosure block:** Gridsmith Ltd · registered in England & Wales · company number [TK] · registered office [TK] · VAT number [TK when registered]

The statutory block is a legal requirement under the Companies Act 2006 disclosure regulations, not a design element. It appears on every page including division pages.
