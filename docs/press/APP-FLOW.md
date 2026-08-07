# App Flow — Gridsmith Press

---

## 1. Primary journeys

### J1 — Margaret (first-time author) · **the trust journey**
```
Google: "self publishing services uk" / "how to publish my book"
  ↓ arrives already suspicious (R6-Press)
LANDS: /press/book-publishing
  ↓ FIRST THING SHE LOOKS FOR: is this a vanity press?
  ↓
/press/rights        ← "You keep 100% of rights and royalties" + contract clause
  ↓
/press/packages      ← full prices, full inclusions, full exclusions
  ↓
/press/books         ← real titles
  ↓
CLICKS OUT to Amazon to verify a book exists   ← the decisive moment
  ↓
RETURNS
  ↓
/press/assessment    ← £X, small, defined, low-risk first step
  ↓
Contact flow → reply by end of next business day
```
**Design consequence:** the journey's decisive event happens *off the site*. The books shelf must make leaving easy and returning obvious. Retailer links open in a new tab; the shelf preserves scroll position; a persistent "continue where you left off" is unnecessary but the page must not have moved.

**The site cannot shortcut this.** Attempting to convert Margaret before she has verified will read as pressure and lose her. Every block on the book-publishing landing exists to accelerate verification, not to bypass it.

### J2 — James (founder book) · **highest value**
```
Referral or LinkedIn → /press/ghostwriting
  ↓ reads: process → HIS TIME COMMITMENT PER STAGE  ← the decisive detail
  ↓ revision policy
  ↓ case studies of comparable founder books
  ↓
/press/packages (ghostwriting tier) → contact
```
James's decisive information is **how many hours of his life this costs**. Most ghostwriting sites hide it. Stating "roughly 12 hours of interviews across 6 weeks, plus two review passes of ~4 hours each" converts him.

### J3 — Nadia (content programme)
```
Organic/referral → /press/content-programmes
  → tiers, SLAs, samples, turnaround → contact
  → procurement follow-up: contracting terms, invoicing, capacity
```
Shortest, most transactional journey. Needs retainer structure visible immediately.

### J4 — Robert (memoir) · **the protective journey**
```
→ /press/book-publishing
  ↓ commercial-expectations statement shown BEFORE pricing (ETH-07)
  ↓ Path Finder → may recommend a smaller package or self-service
  ↓ contact, or leaves better informed
```
Robert is the journey where a non-conversion can be the right outcome. The flow is designed to inform, not to close.

### J5 — Path Finder entry (any persona)
```
→ /press/path-finder → 5 questions → recommendation
   ├─ Gridsmith service → pre-filled contact
   ├─ Self-service (KDP/IngramSpark) → honest short guide, no CTA
   └─ Not ready → "finish the draft, come back" + a free resource
```

## 2. Page flow — `/press/book-publishing/` group landing

Order is deliberate and inverted from normal conversion design. Trust first, sell last.

| Order | Block | Purpose |
|---|---|---|
| 1 | Hero: "Publishing for people whose book has a job to do." | Positioning, no hype |
| 2 | **What we are and are not** — not a traditional publisher, not a vanity press, here is the difference | R6-Press, FR-P05 |
| 3 | **The six ownership facts** — copyright yours · 100% of royalties yours · your own ISBN · you are the publisher of record · retail accounts in your name · we never touch sales income. Each with its contract clause | FR-P04, FR-P04a |
| 3b | **Platform compliance** — the platforms, what each one's spec demands, what we do to meet it | FR-P07a |
| 4 | **Realistic commercial expectations** — plain statement about typical sales | ETH-05, before pricing |
| 5 | Published books strip (8 covers) with retailer links | FR-P08 |
| 6 | Process — canonical six stages with durations (`_shared/00-PROCESS.md`) | FR-P14 |
| 7 | **Packages with full pricing** | FR-P06 |
| 8 | What is not included | ETH-03 |
| 9 | Named distribution platforms + honest note that you could use them directly, and what we add that doing it yourself does not | FR-P07 |
| 9b | Marketing is separate — priced separately, never bundled, no outcome promised | FR-P27, ETH-02 |
| 10 | Path Finder entry | FR-P09 |
| 11 | Manuscript Assessment — the entry offer | FR-P10 |
| 12 | Case studies (3) | |
| 13 | FAQ (8) including "Are you a vanity press?" answered directly | FR-P18 |
| 14 | CTA band | |

Blocks 2, 3, 4, 8 and 9 are all things a vanity press would never publish. Their presence *is* the conversion mechanism. Removing or softening them to "improve flow" defeats the entire division strategy.

## 3. Page flow — `/press/ghostwriting/`

| Order | Block |
|---|---|
| 1 | Hero + who it's for |
| 2 | How it works — 6 stages, each with **your time commitment named in hours** |
| 3 | "Will it sound like me?" — the voice-capture method explained concretely |
| 4 | Revision policy — number of rounds, what happens beyond, what it costs |
| 5 | Rights: you are the author, full stop |
| 6 | Comparable case studies (founder/executive books) |
| 7 | Pricing — banded by length and complexity, published |
| 8 | What we don't ghostwrite |
| 9 | FAQ |
| 10 | CTA |

## 4. Page flow — `/press/books/` shelf

Grid of real covers. Each card: cover, title, author, year, format, **retailer links**.

Filters: format · genre/category · year · service used.

Card behaviour: cover click → `/press/books/[slug]` (detail with the case study link). Retailer link → external, new tab, `rel="noopener"`, `retailer_click` event fired.

Broken-link state: retailer name renders as plain grey text with a small "temporarily unavailable" note. **Never a dead hyperlink.**

Empty state (filtered): "No titles match — clear filters" with 3 suggested titles.

## 5. Path Finder flow

```
STEP 1  Where is your manuscript?
        [Just an idea] [Partial draft] [Finished draft] [I need it written for me]
STEP 2  What is the book for?
        [Business credibility] [Personal legacy] [Commercial sales] [Academic/professional]
STEP 3  Budget
        [Under £500] [£500–£3k] [£3k–£10k] [£10k–£30k] [£30k+] [Not sure yet]
STEP 4  How involved do you want to be?
        [Do it all for me] [Collaborate closely] [I'll do most of it myself]
STEP 5  Timeline
        [Within 3 months] [3–6 months] [6–12 months] [No deadline]
   ↓
RECOMMENDATION — one of:
  ┌───────────────────────────────────────────────────────────┐
  │ A  Full Publishing Package        → service page + CTA     │
  │ B  Ghostwriting                   → service page + CTA     │
  │ C  Manuscript Assessment first    → entry offer + CTA      │
  │ D  Content Programme              → service page + CTA     │
  │ E  Self-service (KDP/IngramSpark) → honest guide, NO CTA   │
  │ F  Not ready — finish the draft   → free resource, NO CTA  │
  └───────────────────────────────────────────────────────────┘
```

Outcomes E and F are functional requirements, not fallbacks. Under £500 budget with a partial draft **must** return E or F. A visitor who receives E and leaves has had a good experience with Gridsmith Press and will say so — which, in a market this suspicious, is the highest-value marketing asset available.

Every outcome logs to `press_path_results`. If E and F never fire in production, the tool is broken.

## 6. Contact flow

```
STEP 1  Which describes you?
        [Author with a manuscript] [Business or founder] [Memoir / legacy] [Ongoing content]
STEP 2  Branch:
        Author   → stage, genre, word count, timeline, what you've tried
        Business → book purpose, who writes it, timeline, internal approval needed
        Memoir   → stage, timeline, intended readership (family / public)
        Content  → volume, formats, turnaround, contracting requirements
STEP 3  Budget band + manuscript link (not upload — see TECH-SPEC §9)
STEP 4  Contact details
        ↓
   Confirmation: what happens next, response commitment, and — only here — the
   cross-division prompt (FR-P20)

CONSUMER PATH (author / memoir segments) — at order confirmation, not enquiry:
   ┌────────────────────────────────────────────────────────────────┐
   │  Your 14-day cancellation right                                │
   │  You can cancel within 14 days for any reason and get a         │
   │  full refund.                                                   │
   │                                                                 │
   │  ☐  I want you to start work before the 14 days are up.        │
   │     I understand that if I cancel after you've started, I pay   │
   │     for the work done, and that once the service is fully       │
   │     performed I lose the right to cancel.                       │
   │     (separate box — never bundled with accepting the terms)     │
   └────────────────────────────────────────────────────────────────┘
   → timestamped record written to `consumer_consents`
   → repeated verbatim in the confirmation email
```

Rules:
- Path Finder arrivals pre-fill steps 1–3.
- Memoir branch shows the commercial-expectations statement inline before the budget question (ETH-07).
- **No urgency, scarcity, or slot-limitation language anywhere in this flow** (ETH-01).
- Budget banded, never free text.
- Cross-division prompt appears on the confirmation screen only. Never mid-funnel — upselling a suspicious buyer mid-decision is exactly the behaviour they are screening for.

## 7. States

| State | Requirement |
|---|---|
| Path Finder, JS off | Static decision table renders all six outcomes with their criteria |
| Path Finder result | Real URL, shareable, `noindex` |
| Broken retailer link | Plain text + note. Never a dead link |
| Books shelf loading | Fixed 2:3 skeletons — zero CLS |
| Books shelf empty (filtered) | Clear filters + 3 suggestions |
| Packages table on mobile | Horizontal scroll in a bordered container, first column pinned, scroll affordance visible |
| Form error | Field-level, `aria-describedby`, focus to first error |
| Submit failure | Preserve input, retry, email fallback |
| Sample report request | Success page explaining the 72h link expiry |
| 404 / 500 | Themed, static, email fallback |

## 8. Navigation

Header: `Gridsmith` · `Press` · Book Publishing · Ghostwriting · Content · **Books** · Packages · **[Start with an assessment]**

Two deliberate choices:
- **Books and Packages are in the primary nav.** These are the verification pages. Burying them signals concealment.
- **The primary CTA is the assessment, not "get a quote."** A small paid defined step is the low-risk entry a suspicious buyer will take (R4.3).

Mobile: hamburger + persistent bottom bar with **[Packages & prices]** and **[Start an assessment]**. Prices in the mobile bar is unusual and correct here — the first question every Press visitor has is what it costs.
