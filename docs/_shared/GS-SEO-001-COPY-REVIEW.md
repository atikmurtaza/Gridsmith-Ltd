# GS-SEO-001 — Master / About / Approach: owner copy review

> **R1 (4 October 2026): the owner decision pack is at [the end of this file](#gs-seo-001-r1--owner-copy-decision-pack)
> and supersedes the draft below wherever they differ** — chiefly the Design summary (Technical
> Design kept), the About and Approach meta descriptions, the Approach boundary and example-journey
> wording, and the Master close. The draft is kept unchanged as the record of what was proposed first.

**4 October 2026. OWNER COPY REVIEW — nothing implemented.** No runtime file, Sanity dataset,
deployment or branch was changed; this document is the only output. Batch A of the
`GS-PROD-006` rewrite programme.

**Read against:** the current publication source at `9508412e` —
`app/(marketing)/page.tsx` + `components/master/Home.tsx` (Master), `components/chrome/nav.ts`
(studio summaries), `scripts/seed-content.mjs` `groupPageDocs` (About and Approach — the
repository payload migrated to Production at `GS-PROD-002`), `components/content/Connect.tsx`,
`components/shared/StudioMap.tsx`, `components/shared/ProcessRail.tsx`,
`lib/process/canonical.ts`, `lib/services/architecture.ts`. Discovery baseline:
`GS-PROD-006-SEO.md`, `-CONTENT.md`, `-GROWTH.md` and `GS-PROD-006-SEARCH-INTENT.json`, which
exist **only on branch `codex/gs-prod-006-discovery` (`a9f6a0d9`)**, not on this branch.

## How to read this

Each page is set out **top to bottom as a visitor meets it**. Conventions inside the page copy:

| Mark | Meaning |
|---|---|
| *(unchanged)* | Current wording kept exactly |
| **LOCKED** / **FIXED** | Not open to this review — locked H1, canonical six stages (`00-PROCESS.md`), statutory disclosure |
| *(from source)* | Rendered from a single source of truth (`companyDetails`, `CANONICAL_PROCESS`, API) — shown so the page reads whole |
| `[anchor](/path)` | Proposed contextual link |
| ⟨NEW⟩ | Text or block that does not exist today |

Rationale, search intent and layout risk come **after** each page, not inside it.

## Locked and preserved

- Master H1: **"Most companies start over with every supplier. You shouldn’t have to."**
- Thesis: one company · three specialist studios · one continuing relationship.
- The six stage names **and** their descriptions (`00-PROCESS.md`: *"not open for revision,
  rewording or 'improvement'"*). Only the prose around them is proposed.
- Statutory "trading divisions of Gridsmith Ltd" sentences on `/` and in the footer.
- Studio thesis lines, the Master CTA label **Discuss Your Requirements**, the Freelancer reviews
  (verbatim, API-sourced), the approved private-examples sentence, `responseCommitment`.
- No prices, no response-time promise beyond the `companyDetails` sentence, no statistics,
  client names, portfolio, testimonials beyond the existing verifiable reviews, credentials,
  awards or engineering claims.

---

# Page 1 — Master (`/`)

## Objective

Tell a prospective client, within one screen, that Gridsmith is one company with three
distinct studios; let them pick a studio or describe a problem; explain what Gridsmith itself
does across the studios (roadmap, strategy, programme management, partnership) without
presenting Master as a fourth delivery studio; show the process and verifiable evidence; close
with an enquiry that says what to send and what happens next.

## Search intent

| | |
|---|---|
| **Primary intent** | Branded navigation and cross-studio supplier evaluation — "who is Gridsmith and is it the right kind of company for work that spans disciplines" |
| **Secondary topics** | Design, digital and publishing under one company; continuity between suppliers; digital roadmap / discovery; cross-studio programme management; ongoing partnership |
| **Entity / service language** | Gridsmith Ltd · Gridsmith Design / Digital / Press · specialist studios · brand and visual design · websites and software · writing and publishing · digital roadmap · programme management |
| **Searcher stage** | Awareness → evaluation (branded and referral visitors first; then buyers comparing ways to staff a multi-discipline project) |

Master does **not** compete for broad service phrases ("brand identity design UK", "bespoke
software") — those belong to studio and service pages (`GS-PROD-006-CONTENT` §Intent ownership).

## Metadata

| Field | Current | Proposed |
|---|---|---|
| Title | `Gridsmith Ltd` | **`Gridsmith Ltd — design, digital and publishing studios`** (54 chars) |
| Meta description | `One UK company. Design, Digital and Press are its three specialist studios.` | **`One UK company with three specialist studios: brand and visual design, websites and software, writing and publishing. Brief once; the context stays.`** (148 chars) |
| `og:title` / `og:description` | same as above (group default) | same as the proposed title / description |
| H1 | **LOCKED** | **LOCKED** — unchanged |
| Canonical | `https://gridsmith.uk` | unchanged |

## Page copy, in order

---

**Gridsmith Ltd — Design · Digital · Press** *(unchanged kicker)*

# Most companies start over with every supplier. You shouldn’t have to.

**LOCKED**

Design, digital and publishing studios in one company. Start with what you need now, and the
context carries into whatever comes next.

**[ Discuss Your Requirements ]** → `/contact`  ·  See the three studios → `#studios` *(both unchanged)*

---

**01 · The studios**

## Start with the studio the work needs

**01 [Gridsmith Design](/design)**
Visual and technical form: brand identity, graphic design, illustration, motion and 3D.
*From line to form.* *(thesis unchanged)*

**02 [Gridsmith Digital](/digital)**
Working systems: websites, software, apps, automation and AI, built and kept running.
*When one thing changes, the right things follow.* *(thesis unchanged)*

**03 [Gridsmith Press](/press)**
Words and publishing: writing, editing, book production, audiobooks, content and book marketing.
*Clear writing is a series of decisions.* *(thesis unchanged)*

Not sure which studio, or need more than one? [Describe the project](/contact) and we will work
out which studios it needs.

---

**02 · One relationship**

## Gridsmith brings three specialist studios together under one relationship.

*(unchanged heading)*

Each studio works to its own discipline and its own standards. What they share is the context
that matters: your business, your goals and the work already done together.

Gridsmith Design, Gridsmith Digital and Gridsmith Press are trading divisions of Gridsmith Ltd,
registered in England as company number 17050842. They are not separate companies. Work that
spans two studios is one engagement, one scope and one invoice. *(unchanged — statutory)*

### What Gridsmith does across the studios

**Digital roadmap & discovery**
Work out what needs to change, and in what order, before deciding what to build.

**Strategy & advisory**
Turn a business requirement into a direction: which disciplines it needs, in what sequence, and
what can wait.

**Programme management**
One point of coordination when work runs across Design, Digital and Press: one scope, one set
of decisions.

**Ongoing partnership**
For clients with continuing work: priorities reviewed, context kept, and the right studio
brought in when it is needed.

[How an engagement works, stage by stage](/approach)  ·  [About Gridsmith](/about)

---

**03 · Process**

## Six stages, whichever studio does the work

What happens inside each stage depends on the work. The order does not, and neither do the
points where you decide: approving the scope, reviewing the work and accepting the delivery.

01 Consultation · 02 Planning & Scope · 03 Approval & Start · 04 Design, Development & Updates ·
05 Delivery · 06 Support *(if applicable)* — **FIXED**

[What happens at each stage](/approach)

---

**04 · Reviews**

## What clients have said, where you can check it

*(unchanged)*

Every review clients have left on our Freelancer profile, reproduced word for word. Nothing is
selected, shortened or rewritten. *(unchanged)*

⟨NEW, optional⟩ Some of our work cannot be shown publicly, either because we do not hold
permission to publish it or because it is confidential. Relevant examples may be discussed
privately where we are permitted to share them. *(the approved `PRIVATE_EXAMPLES_NOTICE`, verbatim)*

Read every review on our Freelancer profile ↗ *(unchanged)*

*[review carousel — verbatim reviews from source]*

---

**05 · Start**

## Tell us what you need.

*(unchanged heading)*

One form for all three studios. Say what you are trying to do, what already exists and any date
you are working to — a rough outline is enough. If it spans more than one studio, choose that
option; it is the first one on the form.

⟨NEW⟩ Your enquiry starts stage 1, Consultation: a conversation about the requirement before
any scope or quote.

**[ Discuss Your Requirements ]** → `/contact`

We typically respond within 48 hours. *(from source — `companyDetails.responseCommitment`)*

---

*[footer — unchanged, statutory]*

## Heading outline

```
H1  Most companies start over with every supplier. You shouldn’t have to.   (LOCKED)
H2  Start with the studio the work needs
  H3  Gridsmith Design · H3 Gridsmith Digital · H3 Gridsmith Press
H2  Gridsmith brings three specialist studios together under one relationship.
  H3  What Gridsmith does across the studios
H2  Six stages, whichever studio does the work
H2  What clients have said, where you can check it
H2  Tell us what you need.
```

## Internal links

`/design`, `/digital`, `/press` (studio names), `/contact` ×3 (hero CTA, "Describe the
project", close CTA), `/approach` ×2 (two distinct anchors — engagement overview and stage
detail), `/about`. All already exist today in some form; the change is anchor wording, not
volume. No service-level links from Master — studios own service discovery.

## CTA

Primary **Discuss Your Requirements** (unchanged, `ENQUIRY_CTA.master`). The close now says
what to include (aim, what exists, date — matching the form's own fields), that a rough outline
is enough, that multi-studio work has its own option, and what happens next (Consultation). No
urgency, no scarcity.

## Structured data

Keep `Organization` (same `companyDetails` source as the footer). Optional, not required for
this copy: `WebSite` on `/` and a stable Organization `@id` (`GS-PROD-006-S8`). No `FAQPage`,
`Review`, `AggregateRating`, `LocalBusiness` or `Service` here. The Freelancer reviews stay
visible prose only — marking them up as `Review` would be self-serving markup Google ignores.

## Rationale — changed blocks

| Block | CURRENT | PROBLEM | PROPOSED | SEARCH / CONVERSION PURPOSE |
|---|---|---|---|---|
| Title | `Gridsmith Ltd` | Brand-only; says nothing in a results page to someone who does not already know the name (`S6`) | `Gridsmith Ltd — design, digital and publishing studios` | Names the three kinds of work in searchers' words ("publishing", not "Press") while staying branded |
| Meta | `One UK company. Design, Digital and Press are its three specialist studios.` | Accurate but inward-facing: studio names a stranger cannot decode | Plain-language disciplines + the continuity benefit | A snippet a buyer can act on; also becomes the share card |
| Hero intro | "Design, digital and publishing expertise under one roof. Start with what you need today — and keep the context when you need something else." | "Expertise under one roof" is the most common agency phrase there is; "studios" and "company" are the actual structure | "Design, digital and publishing studios in one company. Start with what you need now, and the context carries into whatever comes next." | States the structure in its own vocabulary; 6 characters **shorter** than today, so the hero gate is not pressured |
| Studios H2 | "Where would you like to start?" | Friendly but carries no information for a scanner or a crawler; reads as a menu prompt | "Start with the studio the work needs" | Tells the reader the studios are separate disciplines and that the work decides — the routing logic in one line |
| Studio summaries (`nav.ts`) | "Brand, visual, illustration, motion, 3D and technical design." / "Websites, software, apps, automation and AI, built and kept running." / "Writing, editing, book production, publishing, audiobooks and marketing." | Lists without a governing idea, so the three blur; **"technical design" implies engineering design responsibility**, which Gridsmith does not take and whose services are gated (`GS-X002`); "marketing" reads as the Master-owned digital marketing engagement | Each opens with the studio's job — *visual and technical form · working systems · words and publishing* — then its disciplines | Differentiates the studios at a glance; removes a claim conflict. **Cascades** — see Layout risks |
| "Not sure…" line | "Not sure, or need more than one? Tell us what you need." | Anchor duplicates the close heading; doesn't say what happens | "…[Describe the project](/contact) and we will work out which studios it needs." | Lowers the barrier for undecided buyers; anchor names the action |
| One-relationship lede | "Each has its own expertise, people and standards, while sharing the context that matters…" | "Its own people" asserts separate staffing per studio — a team claim nothing in the record supports (`GS-O004`, no public team) | "Each studio works to its own discipline and its own standards. What they share is the context…" | Same argument, no unverifiable claim |
| Capabilities H3 + lines | "Across all three studios" + four approved lines | Label does not say these are things Gridsmith itself does; "a clear direction across the right specialist areas" is generic | "What Gridsmith does across the studios" + concrete verbs (order, sequence, what can wait; one scope, one set of decisions) | Establishes Master's own offer — roadmap, strategy, programme management, partnership — without becoming a fourth studio |
| Links under capabilities | "How three studios work as one company" · "About Gridsmith" | First anchor restates the section, not the destination | "How an engagement works, stage by stage" · "About Gridsmith" | Anchor describes `/approach` |
| Process H2 + lede | "How we work" / "The same six stages in all three studios…" | H2 duplicates `/approach`'s H1 (two pages, one heading intent) | "Six stages, whichever studio does the work" + the three client decision points | Distinct heading; tells the reader where they are involved |
| Process link | "The six stages in full" | Fine, slightly vague | "What happens at each stage" | Names what the reader gets |
| Reviews | unchanged | — | Optional private-examples sentence (approved wording) | Answers "where is your portfolio?" honestly, beside the evidence that does exist |
| Close lede | "One form, all three studios. If what you need spans more than one of them, that is the first option on it." | Says nothing about what to send or what happens next | What to include + "rough outline is enough" + Consultation as next step | Reduces enquiry anxiety; better-briefed enquiries |

## Layout risks — Master

1. **Hero:** the intro is shorter than today (134 vs 140 characters), so `check:master-hero`
   question 4 (CTA inside 110% of a 360×740 first screen) should not move. Re-run it anyway.
2. **Studio summaries are 20–24 characters longer** and `nav.ts` `summary` is a **single source**:
   it also feeds About's `StudioMap` and the first sentence of `/design`, `/digital` and `/press`
   metadata descriptions. Adopting it changes three studio-route descriptions outside this batch.
   Options: adopt (recommended — the "technical design" wording is a claim issue on all four
   surfaces), or keep `summary` and change only the word "technical design" now.
3. **Studio summaries and the thesis lines were frozen at `GS-MASTER-001-RC`.** Theses are kept;
   the summary change needs explicit owner release of that freeze.
4. Capability lines and the close lede grow by one to two lines each. The scene reads
   `data-chapter` positions, so no retiming is needed, but `check:master:scene` (questions 5 and
   14, text contrast over the scene and over the fallback) must be re-run because text will sit
   over different parts of the mark.
5. Optional private-examples sentence adds ~3 lines to the reviews head (max 48rem).
6. `/` mobile LCP margin is already tight (programme record); copy-only changes should not move
   it, but the exact-SHA Lighthouse run is the arbiter.

---

# Page 2 — About (`/about`)

## Objective

Establish a checkable company identity and explain the operating model: who Gridsmith is, why
it is built as three studios in one company, what work it brings together, how that helps a
client, and what it holds itself to in delivery — without making registration the personality of
the page and without a team section.

## Search intent

| | |
|---|---|
| **Primary intent** | Verify company identity and suitability — "is Gridsmith a real, coherent company I can contract with?" |
| **Secondary topics** | Why one company with three studios; what work it brings together; delivery values; how to see evidence without a public portfolio |
| **Entity / service language** | Gridsmith Ltd · registered in England · company number 17050842 · three specialist studios · one contract · Gridsmith Design / Digital / Press |
| **Searcher stage** | Trust validation (mid-evaluation, often arriving from a studio or service page) |

## Metadata

| Field | Current | Proposed |
|---|---|---|
| Title | `About — Gridsmith Ltd` | **`About Gridsmith Ltd — one company, three specialist studios`** (59 chars) |
| Meta description | `One company, three specialist studios: Gridsmith Design, Gridsmith Digital and Gridsmith Press.` | **`Gridsmith Ltd is a company registered in England with three specialist studios — Design, Digital and Press — under one contract and one relationship.`** (149 chars) |
| `og:title` / `og:description` | inherited `Gridsmith Ltd` / group description | the proposed title / description |
| H1 | `About Gridsmith` | unchanged |

## Page copy, in order

---

**About** *(place label, unchanged)*

# About Gridsmith

Gridsmith Ltd is one company with three specialist studios: Design for visual and technical
form, Digital for working systems, Press for words and publishing. Work with one or several — it
is the same relationship either way.

---

**02**

## What Gridsmith is

*(unchanged heading)*

Gridsmith Design creates brand identities, graphic design, illustration, motion and 3D
visualisation. Gridsmith Digital builds websites, software, apps and automation, and keeps them
running afterwards. Gridsmith Press writes, edits and prepares books and business content for
publication, along with the content and promotion around them.

All three belong to one company, Gridsmith Ltd. Whichever studio you work with, the contract,
the invoice and the company answerable to you are the same.

Most work starts with one studio. The structure earns its keep when a second need appears — a
website after a new identity, a launch site for a book — and nobody has to brief the work from
the beginning again.

---

**03**

## One company, three studios

*(unchanged — `StudioMap`)*

**Gridsmith Ltd** — One company · one contract

01 [Gridsmith Design](/design) — Visual and technical form: brand identity, graphic design, illustration, motion and 3D.
02 [Gridsmith Digital](/digital) — Working systems: websites, software, apps, automation and AI, built and kept running.
03 [Gridsmith Press](/press) — Words and publishing: writing, editing, book production, audiobooks, content and book marketing.

*(summaries from `nav.ts` — the same proposal as Master)*

---

**04**

## Why it is built this way

*(unchanged heading)*

Different work needs different specialists. A brand identity, a production web application and
an edited manuscript are different crafts, and treating them as one is how work ends up strong
in one discipline and thin in the rest.

The usual alternative is a separate supplier for each: a designer who has never seen the
website, a developer working from brand guidelines nobody explained, a writer briefed by
neither. Each may be good at their job. What goes wrong is at the joins, and coordinating them
quietly becomes your job.

So the specialists stay specialists, and the relationship does not restart when the medium
changes. *(unchanged)*

---

**05** *(paired with 06)*

## How we take on work

We work out what the requirement is, say which discipline it belongs to, scope it for your
situation rather than from a menu, and run it through the studio that does that kind of work.
Where it spans two, joining them up is our job.

Every engagement is quoted against its own written scope. That is why there is no price list
here: the number follows the requirement, and the requirement comes first.

⟨NEW⟩ The six stages behind this — from the first conversation to optional support — are set
out in [how a Gridsmith project runs](/approach).

**06**

## What we hold ourselves to

Decisions can be explained. If we cannot say why a design, a system or a sentence is the way it
is, it is not finished.

Work is built to be handed over. Files, code and documents should make sense to whoever picks
them up next, including you.

Accessibility is part of the brief from the start, not an upgrade that arrives later.

Bad news travels early. We would rather tell you something is a bad idea at the start than
deliver it well and watch it fail.

---

**07** ⟨NEW section, optional⟩

## Evidence you can check

There is no public portfolio here. Some of our work cannot be shown publicly, either because we
do not hold permission to publish it or because it is confidential. Relevant examples may be
discussed privately where we are permitted to share them.

What can be checked publicly: the reviews clients have left on our
[Freelancer profile](https://www.freelancer.com/u/GridsmithLTD), reproduced word for word on
our home page, and the company itself on the public register under the number at the foot of
this page.

---

**08** *(today 07)*

## Getting in touch

*(unchanged heading)*

The [enquiry form](/contact) is the easiest route if there is any detail to share; every channel
below reaches the same place. We typically respond within 48 hours. *(last sentence from source)*

**[ Discuss Your Requirements ]** → `/contact`

### Directly
Email · WhatsApp · Text message *(unchanged, from source)*

### Platforms
*(unchanged, from source)*

Gridsmith Ltd is registered in England, company number 17050842. The full statutory details,
including the registered office, are in the footer of every page. *(unchanged)*

---

## Heading outline

```
H1  About Gridsmith
H2  What Gridsmith is
H2  One company, three studios
H2  Why it is built this way
H2  How we take on work          ┐ paired
H2  What we hold ourselves to    ┘
H2  Evidence you can check       (new, optional)
H2  Getting in touch
  H3  Directly · H3 Platforms
```

## Internal links

Studios (map, unchanged) · `/approach` from "How we take on work" (new — anchor "how a Gridsmith
project runs") · `/contact` from Getting in touch (anchor "enquiry form", was "the contact
page") · Freelancer profile (external, new on this page). No link farm: one new internal link.

## CTA

**Discuss Your Requirements** in Getting in touch (unchanged). The trust section deliberately has
no CTA — it answers a question rather than pushing.

## Structured data

`Organization` already renders site-wide from `companyDetails`; nothing to add. Optional:
`AboutPage` as the `WebPage` type — harmless, no rich-result effect, low priority. No `Person`
(no public team), no `LocalBusiness` (registered office is not a customer premises).

## Rationale — changed blocks

| Block | CURRENT | PROBLEM | PROPOSED | SEARCH / CONVERSION PURPOSE |
|---|---|---|---|---|
| Title | `About — Gridsmith Ltd` | Generic; identical pattern to every "About" result | `About Gridsmith Ltd — one company, three specialist studios` | Answers the identity query in the result itself |
| Meta | "One company, three specialist studios: Gridsmith Design…" | Repeats names, no checkable fact | Registered in England + three studios + one contract | Trust-validation searchers get the checkable fact first, without the page leading with it |
| Intro | "One company, three specialist studios. Work with one of them or all three — it stays the same relationship either way." | Correct but says nothing about what each studio is | Names each studio's job in one clause | A reader knows what Gridsmith does before scrolling |
| What Gridsmith is ¶1 | "…3D visualisation and technical drawing…" | **"Technical drawing" describes the `GS-X002`-gated CAD/engineering-drawing services**, which are not published; it is a public claim the site cannot yet stand behind | Published disciplines only (technical illustration is covered by "illustration") | Removes a gated claim; keeps identity specific |
| What Gridsmith is ¶2 | "All three are trading divisions of Gridsmith Ltd…" | Statutory phrase in brand prose; the statutory disclosure already sits in the footer and at the foot of this page | "All three belong to one company, Gridsmith Ltd…" | Studio taxonomy in public copy; legal wording stays where the law puts it |
| What Gridsmith is ¶3 | "Some need two — occasionally at the start, more often a year later." | A claim about client patterns no record supports | Illustrative examples, no frequency claim | Same point, no unverifiable pattern |
| Why ¶1–2 | "genuinely different crafts…", "Nothing is wrong with any of them individually" | Filler intensifier; slightly long | Trimmed | Tighter, same argument |
| "What we actually do" | heading + two paragraphs | "Actually" is defensive; no route onward to the process | "How we take on work" + link to `/approach` | Hands the evaluator to the decision page |
| "How we approach the work" | heading + "Three things show up in everything we make…" | Heading competes with `/approach`'s intent; the three values covered design and technical work only; the honesty line was detached | "What we hold ourselves to" — four short commitments covering all three studios | Answers "what does it value in delivery?" directly |
| New: Evidence you can check | — | The obvious buyer question (no portfolio) is unanswered on the identity page | Approved private-examples sentence + where to check reviews and the register | Legitimate trust without invented proof |
| Getting in touch note | "The form on the contact page reaches the same place as all of these…" | Anchor "the contact page" describes the URL, not the thing | "The enquiry form…" | Clearer anchor; same facts |

## Layout risks — About

1. **New section 07** renders through the existing `prose` layout (content only) but shifts the
   Connect band's number from 07 to 08 (computed automatically). Optional — the page works
   without it.
2. **Links inside group-page prose do not render today.** `components/content/Blocks.tsx`
   flattens spans and drops link annotations (`GS-PROD-006-S4`). The `/approach` link in 05 and
   the Freelancer link in 07 need either the S4 renderer fix (proven on a permanent specimen) or
   to be cut. The Connect `/contact` link is component code and works.
3. `StudioMap` summaries grow by ~20 characters (same cascade as Master).
4. Pair 05/06: 06 becomes four short paragraphs; the pair is two columns on desktop, so check
   the column balance at 1440px.
5. Connect note wording is in `Connect.tsx`, which only `/about` renders today; still re-check
   before editing.

---

# Page 3 — Approach (`/approach`)

## Objective

Make the engagement process genuinely useful: what to bring, what the written scope contains,
the six fixed stages and where the client decides, how two studios hand over, what continuity
means, and when Gridsmith is the wrong choice — ending in a low-pressure first step.

## Search intent

| | |
|---|---|
| **Primary intent** | Understand the engagement process and responsibilities — "how does working with Gridsmith actually go?" |
| **Secondary topics** | Consultation; written scope (inclusions, exclusions, timeline, pricing basis); approval before work; review points; delivery and acceptance; optional support; multi-studio handover; limits |
| **Entity / service language** | consultation · written scope · approval · review points · delivery · support (if applicable) · Gridsmith Design / Digital / Press |
| **Searcher stage** | Evaluation → decision |

## Metadata

| Field | Current | Proposed |
|---|---|---|
| Title | `How we work — Gridsmith Ltd` | **`How we work: the six stages of a project — Gridsmith Ltd`** (56 chars) |
| Meta description | `One company, three studios, one process — and an honest account of when to use a specialist instead.` | **`How a Gridsmith project runs: consultation, a written scope, approval, work with agreed review points, delivery and optional support — and when to go elsewhere.`** (160 chars) |
| `og:title` / `og:description` | inherited `Gridsmith Ltd` / group description | the proposed title / description |
| H1 | `How we work` | unchanged |

## Page copy, in order

---

**Approach** *(place label, unchanged)*

# How we work

Six stages, the same six whichever studio does the work. The short version: we find out what
you need before we tell you what it costs, and nothing starts until you have approved a written
scope.

---

**02**

## We start with the requirement, not the service

*(unchanged heading)*

Most enquiries arrive as a solution — a new website, a rebrand, a book. Sometimes that is right.
Often the need behind it is different enough that building what was asked for would waste your
money.

So the first conversation is about the business and the problem, not about what we sell. It is
also where we say if the work belongs somewhere other than Gridsmith. That happens, and telling
you early costs both of us less than telling you late.

⟨NEW⟩ It helps to bring what you are trying to achieve, who it is for, what already exists —
files, systems, a draft, a brand — any date you are working to, and who decides on your side.
None of it needs to be polished.

---

**03** *(paired with 04)*

## One brief, even across studios

[Gridsmith Design](/design), [Gridsmith Digital](/digital) and [Gridsmith Press](/press) are
studios of one company, Gridsmith Ltd — not three suppliers who have never spoken. One contract
covers work that spans them.

Where a project needs two studios, coordinating them is our job. You brief it once, and the
second studio starts from the decisions the first has already made.

**04**

## Everything is scoped for the specific job

*(unchanged heading)*

There are no packages on this site and no price list, because the work does not come in fixed
sizes. Instead you get a written scope: what is included and what is not, the timeline, how the
work is priced, and what we need from you and when.

That document is where disagreements should happen. A scope you have read and questioned is
worth more than a number you accepted quickly.

---

**05**

## The six stages

*(unchanged heading)*

The same six, whatever the work. Stage 1 is understanding the requirement, stage 2 is writing
the scope, stage 3 is your approval, stage 4 is the work itself, stage 5 is delivery against the
scope, and stage 6 happens only if continuing makes sense for you.

Review is not a stage of its own because it is not a moment. It runs through stage 4, at points
agreed when the scope is written rather than whenever someone remembers.

⟨NEW⟩ Where the work needs more than one studio, the handover happens inside stage 4 — same
scope, same review points — rather than as a new project.

**FIXED — the six-stage rail, verbatim from `CANONICAL_PROCESS`:**

> **01 Consultation** — Understanding the business, project goals, target audience, and current digital presence
> **02 Planning & Scope** — Clear project scope, timeline, pricing structure and required deliverables prepared before work begins
> **03 Approval & Start** — Work begins once scope is confirmed and the agreed initial payment is received
> **04 Design, Development & Updates** — The project is developed with regular updates, feedback opportunities and clear communication throughout
> *By the studio or studios the work needs: Design · Digital · Press*
> **05 Delivery** — Final deliverables reviewed, completed and provided according to the agreed scope
> **06 Support (if applicable)** — Ongoing support, maintenance, SEO improvements and digital assistance where required

---

**06**

## What continuity means in practice

An illustration, not a client story. A business commissions a
[new brand identity](/design/services/brand-identity-systems) from Design. A year later it needs
[a website](/digital/services/website-design-build). Digital starts from the identity files and
the reasoning behind them, so the decisions already made — the audience, the tone, what was ruled
out — do not have to be rediscovered. When the site needs copy, Press writes it to the same brief.

We do not publish client relationships without permission, so this is described rather than
shown. Relevant examples may be discussed privately where we are permitted to share them.

---

**07** *(sunken, deliberately plain)*

## When to use a specialist instead

*(unchanged heading)*

Three studios is not every discipline. If your work needs a structural engineer, a chartered
accountant, a solicitor or a specialist agency with a decade in one narrow field, that is who you
should be talking to, and we will say so. *(unchanged)*

⟨NEW⟩ Technical illustration is visual work. If a project needs engineering design,
calculation, certification or sign-off, it needs a qualified professional who takes that
responsibility; we do not.

The same applies inside our own range. Some work is too small to justify what it would cost to
scope properly, and some is far enough outside what we do well that taking it on would not be
fair to you.

---

⟨NEW⟩ If this is how you want to work, the first stage is a conversation, and a rough outline is
enough to start it. We typically respond within 48 hours. *(last sentence from source)*

**[ Discuss Your Requirements ]** → `/contact` *(unchanged)*

---

## Heading outline

```
H1  How we work
H2  We start with the requirement, not the service
H2  One brief, even across studios          ┐ paired
H2  Everything is scoped for the specific job ┘
H2  The six stages
  H3  Consultation · Planning & Scope · Approval & Start ·
      Design, Development & Updates · Delivery · Support (if applicable)
H2  What continuity means in practice
H2  When to use a specialist instead
```

## Internal links

Studios ×3 in "One brief" (studio names as anchors) · two service links in the continuity
illustration (brand identity, website build — the pair the intent map proposes linking to
`/approach`) · `/contact` CTA. Deliberately **not** linking the Press copywriting service in the
same paragraph — three service links in four sentences reads as a link farm. Reciprocal links
from service pages to `/approach` belong to Batch E.

## CTA

**Discuss Your Requirements** (unchanged), now preceded by one line that frames the first step as
the Consultation stage, says a rough outline is enough, and states the response sentence from
source. No pressure language.

## Structured data

None added. Not `HowTo` (this is not a task the reader performs, and Google no longer shows
HowTo results) and not `FAQPage` (retired, `GS-PROD-006-SEO`). `Organization` continues
site-wide.

## Rationale — changed blocks

| Block | CURRENT | PROBLEM | PROPOSED | SEARCH / CONVERSION PURPOSE |
|---|---|---|---|---|
| Title | `How we work — Gridsmith Ltd` | Bare; does not say what the reader will learn | `How we work: the six stages of a project — Gridsmith Ltd` | Matches "how does it work / process" evaluation intent |
| Meta | "One company, three studios, one process — and an honest account…" | Abstract; repeats Master's message | The stages in plain words + "when to go elsewhere" | Snippet previews the actual answer |
| Intro | "…we find out what you actually need before we tell you what it costs." | Good; omits the client's main safeguard | Adds "nothing starts until you have approved a written scope" | States the key decision point up front (stage 3, unchanged fact) |
| Requirement ¶3 | — | Page never says what to bring | What to bring, explicitly unpolished | Better-prepared consultations; lowers barrier |
| "One company, three studios" | heading + "…are trading divisions of Gridsmith Ltd, not separate companies…" | Same H2 as About's studio map; statutory phrase in brand prose | "One brief, even across studios"; studio wording; how the second studio starts | Distinct heading; explains the handoff benefit |
| Scope ¶1 | "…what is included, what is not, what we need from you and when." | Omits the timeline and pricing basis that stage 2 itself lists | Adds timeline and how the work is priced | Aligns with the fixed stage 2 description; no price disclosed |
| Six-stages ¶1 | "…stages 3 and 4 are making it…" | **Inaccurate:** stage 3 is Approval & Start, not making | Each stage named for what it is | Accuracy against `00-PROCESS.md` |
| Six-stages ¶3 | — | Multi-studio handover undescribed | Handover inside stage 4 | Answers "how are handoffs managed?" (intent map user problem) |
| "A worked example" | heading + "…We will not illustrate it with an invented one." | Heading promises an example the page does not give | Labelled illustration + approved private-examples sentence | Shows the mechanism without inventing a client — **owner decision, see below** |
| Limits ¶2 | — | The engineering boundary is stated only on gated Technical pages | One sentence: no engineering design, calculation, certification or sign-off | Trust through boundaries; consistent with non-negotiable 12 |
| Closing | CTA only | No explanation of the first step | One line + response sentence | Conversion clarity without pressure |

## Layout risks — Approach

1. **Closing line** is new page code (`app/(marketing)/approach/page.tsx`) — a paragraph above the
   CTA in the closing band. This is the only proposal on the three pages that adds a rendered
   element outside existing content slots; it can be dropped if the owner wants zero visual change.
2. **Links in prose do not render today** (`Blocks.tsx`, `GS-PROD-006-S4`): the studio and service
   links in 03 and 06 depend on the renderer fix, as on About.
3. Process band body grows from two to three paragraphs above the rail.
4. Pair 03/04 grows slightly; check column balance at 1440px.

---

# Cross-page checks (section 14 of the brief)

| Check | Result |
|---|---|
| Keyword stuffing | None. "Studio(s)" is the structural noun and appears where the structure is the subject; no exact-match phrases inserted |
| Repetition | "One company, three studios" was an H2 on both About and Approach — Approach's renamed. "How we work" was H2 on `/` and H1 on `/approach` — `/`'s renamed. "Tell us what you need" remains `/`'s close H2 and `/contact`'s H1: kept deliberately, the close leads to that page |
| Duplicate intent | `/` = choose/evaluate; `/about` = verify identity; `/approach` = understand process. Titles and metas now distinct in substance, not just wording |
| Generic language | Removed "expertise under one roof", "clear direction across the right specialist areas", "genuinely", "actually" |
| Unsupported claims | Removed "its own people", "more often a year later", "technical drawing", "technical design". New commitments in About 06 restate existing approved positions; **owner to confirm they describe practice** |
| Metadata length | Titles 54–59 chars; descriptions 148–160 chars. Google may rewrite either |
| Headings | One H1 per page, H2/H3 without level jumps; every H2 now says something on its own |
| CTAs | Same approved label everywhere; each now carries what to send and what happens next |
| Anchors | Every proposed anchor names its destination ("How an engagement works, stage by stage", "how a Gridsmith project runs", "enquiry form", "new brand identity", "a website") |

# Owner decisions needed

1. **Studio summaries** (`nav.ts`, frozen at `GS-MASTER-001-RC`): adopt the proposed three, or
   change only "technical design". Adopting also changes the `/design`, `/digital`, `/press`
   metadata descriptions.
2. **Approach continuity illustration:** accept a clearly labelled illustration, or keep the
   current honest-absence paragraph (then rename the heading — "A worked example" promises
   content that is not there).
3. **About "Evidence you can check"** section: include or omit.
4. **About "What we hold ourselves to":** confirm all four commitments describe actual practice
   for all three studios (the accessibility line in particular).
5. **Master private-examples sentence** in the reviews chapter: include or omit.
6. **Approach closing line** (the only new rendered element): include or omit.
7. Out of this batch's scope but visible during review: Master owns the owner-confirmed campaign
   management engagement (`SERVICE-ARCHITECTURE.md` §13, `GS-O011`/`GS-O012`). It is not on
   `/` today and is **not** added here; say if a fifth capability line is wanted.

# Implementation notes (for the later, authorised phase)

- **Sources:** Master copy in `components/master/Home.tsx` and `app/(marketing)/page.tsx`;
  `/` metadata via the group `DESCRIPTION` (also the default `og:description` for every Master
  route) or a page-level override; summaries in `components/chrome/nav.ts`; About/Approach body
  in `scripts/seed-content.mjs` `groupPageDocs` → Production Sanity via the guarded migration
  script (a write that needs its own authority); About/Approach metadata in their `page.tsx`;
  Connect note in `components/content/Connect.tsx`.
- **Prerequisite for in-prose links:** `GS-PROD-006-S4` (link marks in `Blocks.tsx`, proven on a
  permanent specimen; `check-axe` resolves every same-origin link).
- **Gates to re-run:** `check:master-hero`, `check:master:scene`, `check:company` (question 10
  taxonomy on titles/descriptions/OG), `check:launch`, `check:axe`, `check:responsive`, the
  exact-SHA Lighthouse run.

## Out-of-scope observation

`components/leads/ContactForm.tsx` labels the Design option "Design — brand, 3D, CAD,
drawings". CAD and engineering drawings are the `GS-X002`-gated services. Recorded for the
contact/Batch F review, not changed here.

---
---

# GS-SEO-001-R1 — Owner copy decision pack

**4 October 2026. Review only — nothing implemented.** No runtime source, `nav.ts`,
`seed-content.mjs`, Sanity, commit, push or deploy. This section **supersedes the draft above**
where they differ.

## Owner guidance applied

| Ref | Guidance | Effect on the draft |
|---|---|---|
| A | Master H1 locked | No change |
| B | Remove "expertise under one roof", "its own people", "more often a year later" | Approved — kept as drafted |
| C | "Studios" in public brand copy; "trading divisions" only where statutory | Kept. The `/` disclosure paragraph and the footer are the statutory uses that remain |
| D | Stage 3 correction | Approved — kept |
| E | Any worked example is an illustration / example journey, never a case study | Example retitled and labelled in its first sentence |
| F | **Technical Design is an approved Design discipline**; `GS-X002` blocks only `cad-drafting`, `engineering-drawings`, `technical-documentation` | **Draft reversed.** "Technical design" restored to the Design summary and About; the boundary is stated as a responsibility limit, not by removing the discipline |
| G | About meta should lead with what Gridsmith does | Rewritten |
| H | Approach meta ~145–155 characters | 152 characters |
| I | Keep contextual links; renderer fix is a small prerequisite | Links kept, shown as `[anchor → /destination]` |

---

## Seven decisions

### 1. Design / Digital / Press studio summaries (`nav.ts`)

| | |
|---|---|
| **Options** | **1A** keep current · **1B** GS-SEO-001 draft (drops "technical design") · **1C** R1 wording |
| **1A CURRENT** | Design: *Brand, visual, illustration, motion, 3D and technical design.* · Digital: *Websites, software, apps, automation and AI, built and kept running.* · Press: *Writing, editing, book production, publishing, audiobooks and marketing.* |
| **1B** | *Visual and technical form: brand identity, graphic design, illustration, motion and 3D.* — **rejected by guidance F** |
| **1C R1** | Design: *Visual and technical form: brand, illustration, motion, 3D and technical design.* · Digital: *Working systems: websites, software, apps, automation and AI, built and kept running.* · Press: *Words and publishing: writing, editing, book production, audiobooks, content and book marketing.* |
| **RECOMMENDATION** | **1C** — 1B **PRE-RESOLVED AGAINST BY OWNER GUIDANCE F** |
| **Why** | Each line now opens with the studio's job, so the three read as distinct disciplines at a glance. Technical Design stays, in the same term `/design` already uses publicly. Press's "marketing" becomes "content and book marketing", so it no longer reads as the Master-owned digital marketing engagement |
| **Content affected** | Master studio index · About `StudioMap` · the first sentence of `/design`, `/digital`, `/press` meta descriptions (`summary` + "…is a trading division of Gridsmith Ltd.", about 137–152 characters) |
| **Layout / technical** | +19, +17, +24 characters. Studio rows on `/` and the About map wrap at most one extra line — **LOW**. The frozen-at-`GS-MASTER-001-RC` status needs owner release |

### 2. Approach continuity block

| | |
|---|---|
| **Options** | **2A** keep honest absence: *"The clearest way to show what continuity is worth is a real relationship that moved between studios. We will not illustrate it with an invented one."* — retitled, because "A worked example" promises what it does not give · **2B** labelled example journey (full text in the Approach copy below) |
| **RECOMMENDATION** | **2B** — presentation format **PRE-RESOLVED BY OWNER GUIDANCE E**; whether to keep it at all is the owner's call |
| **Why** | Continuity is the reason the company is built this way. A labelled journey shows the mechanism, which an absence cannot. The first sentence says it is not a client project or an actual engagement, so it cannot be read as evidence |
| **Content affected** | Approach section 06 (heading and body) |
| **Layout / technical** | Existing `continuity` layout, about 90 words — **LOW**. Two service links need the renderer prerequisite |

### 3. About — "Evidence you can check" section

| | |
|---|---|
| **Options** | **3A** include (new `prose` section) · **3B** omit |
| **RECOMMENDATION** | **3A** |
| **Why** | "Where is your work?" is the obvious identity-page question. The answer uses only the approved private-examples statement and two publicly checkable sources: the Freelancer reviews and the Companies House register |
| **Content affected** | About gains section 07; Getting in touch becomes 08 |
| **Layout / technical** | Rendered through an existing layout; numbering is computed automatically — **LOW**. The Freelancer link needs the renderer prerequisite |

### 4. About — "What we hold ourselves to"

| | |
|---|---|
| **Options** | **4A** four commitments as drafted · **4B** same, without the accessibility line · **4C** keep the current paragraph (*"Three things show up in everything we make…"*) |
| **RECOMMENDATION** | **4A, subject to owner confirmation** that every line describes practice in all three studios |
| **Why** | Answers "what does it value in delivery?" for Press as well as Design and Digital. Every line restates a position already in the approved About copy; none is new. The accessibility line is the one most likely to be tested by a client, so it needs explicit confirmation |
| **Content affected** | About section 06 |
| **Layout / technical** | Four short paragraphs in the right half of a two-column pair — **LOW**; check column balance at 1440px |

### 5. Master — private-examples sentence in the Reviews chapter

| | |
|---|---|
| **Options** | **5A** include · **5B** omit |
| **RECOMMENDATION** | **5B omit** |
| **Why** | The statement already appears on every studio landing (`PRIVATE_EXAMPLES_NOTICE`) and would now be on About (3A). The Reviews chapter is evidence that does exist, and it reads stronger without a caveat beside it. It also keeps the Master page restrained |
| **Content affected** | None if 5B |
| **Layout / technical** | 5A would add about 3 lines over the gold scene and require a `check:master:scene` contrast re-run — avoided by 5B |

### 6. Approach — closing line above the CTA

| | |
|---|---|
| **Options** | **6A** include · **6B** CTA alone (current) |
| **RECOMMENDATION** | **6A** |
| **Why** | It says what the first step is (a conversation), that a rough outline is enough, and when to expect a reply, using the single `responseCommitment` source. No pressure language |
| **Content affected** | Approach closing band |
| **Layout / technical** | The only new rendered element on the three pages: one paragraph in page code — **LOW** |

### 7. Campaign management on Master

| | |
|---|---|
| **Options** | **7A** no change in this batch · **7B** add a fifth "Across the studios" line for the owner-confirmed campaign-management engagement (`SERVICE-ARCHITECTURE.md` §13) |
| **RECOMMENDATION** | **7A** |
| **Why** | It is confirmed, but four lines is the approved restrained Master offer, and campaign management needs its own copy decisions (channels, boundaries, no performance promises). Better handled as a separate brief than tacked on here |
| **Content affected** | None |
| **Layout / technical** | None |

---

## Master — complete proposed copy (R1)

| Field | Proposed |
|---|---|
| SEO title | `Gridsmith Ltd — design, digital and publishing studios` (54) |
| Meta description | `One UK company, three specialist studios: brand, visual and technical design; websites and software; writing and publishing. Brief once; the context stays.` (155) |
| `og:title` / `og:description` | Same as title / meta |
| Canonical | `https://gridsmith.uk` (unchanged) |

---

**Gridsmith Ltd — Design · Digital · Press** — *UNCHANGED*

# Most companies start over with every supplier. You shouldn’t have to.

**UNCHANGED LOCKED COPY**

Design, digital and publishing studios in one company. Start with what you need now, and the
context carries into whatever comes next.

**[ Discuss Your Requirements ]** → `/contact` · **See the three studios** → `#studios` — *UNCHANGED labels*

---

**01 · The studios**

## Start with the studio the work needs

**01 [Gridsmith Design → /design]**
Visual and technical form: brand, illustration, motion, 3D and technical design.
*From line to form.* — *UNCHANGED*

**02 [Gridsmith Digital → /digital]**
Working systems: websites, software, apps, automation and AI, built and kept running.
*When one thing changes, the right things follow.* — *UNCHANGED*

**03 [Gridsmith Press → /press]**
Words and publishing: writing, editing, book production, audiobooks, content and book marketing.
*Clear writing is a series of decisions.* — *UNCHANGED*

Not sure which studio, or need more than one? [Describe the project → /contact] and we will work
out which studios it needs.

---

**02 · One relationship**

## Gridsmith brings three specialist studios together under one relationship.

*UNCHANGED*

Each studio works to its own discipline and its own standards. What they share is the context
that matters: your business, your goals and the work already done together.

Gridsmith Design, Gridsmith Digital and Gridsmith Press are trading divisions of Gridsmith Ltd,
registered in England as company number 17050842. They are not separate companies. Work that
spans two studios is one engagement, one scope and one invoice. — *UNCHANGED (statutory)*

### What Gridsmith does across the studios

**Digital roadmap & discovery** — Work out what needs to change, and in what order, before
deciding what to build.

**Strategy & advisory** — Turn a business requirement into a direction: which disciplines it
needs, in what sequence, and what can wait.

**Programme management** — One point of coordination when work runs across Design, Digital and
Press: one scope, one set of decisions.

**Ongoing partnership** — For clients with continuing work: priorities reviewed, context kept,
and the right studio brought in when it is needed.

[How an engagement works, stage by stage → /approach] · [About Gridsmith → /about]

---

**03 · Process**

## Six stages, whichever studio does the work

What happens inside each stage depends on the work. The order does not, and neither do the
points where you decide: approving the scope, reviewing the work and accepting the delivery.

01 Consultation · 02 Planning & Scope · 03 Approval & Start · 04 Design, Development & Updates ·
05 Delivery · 06 Support *(if applicable)* — *UNCHANGED (canonical)*

[What happens at each stage → /approach]

---

**04 · Reviews** — *UNCHANGED (decision 5B)*

## What clients have said, where you can check it

Every review clients have left on our Freelancer profile, reproduced word for word. Nothing is
selected, shortened or rewritten.

Read every review on our Freelancer profile ↗ — *(review carousel, verbatim from source)*

---

**05 · Start**

## Tell us what you need.

*UNCHANGED*

One form for all three studios. Say what you are trying to do, what already exists and any date
you are working to — a rough outline is enough. Your enquiry starts with Consultation: a
conversation about the requirement before any scope or quote.

**[ Discuss Your Requirements ]** → `/contact` — *UNCHANGED label*

We typically respond within 48 hours. — *from `companyDetails.responseCommitment`*

*(footer — unchanged, statutory)*

### Why this version is better — Master

- **It says what Gridsmith is in searchable words.** The result title and description name the
  three kinds of work; today the title is the company name alone.
- **The studios read as three different jobs.** Visual and technical form, working systems, words
  and publishing. Technical Design keeps its place in Design.
- **Master's own offer is concrete.** Order, sequence, what can wait, one point of coordination.
  It reads as relationship work, not a fourth studio.
- **Every unsupported or generic line is gone:** "expertise under one roof", "its own people".
- **The close tells a visitor what to send and what happens next**, without pressure.
- **Nothing locked moved:** the H1, the statutory paragraph, the canonical stages, the reviews,
  the CTA labels.

---

## About — complete proposed copy (R1)

| Field | Proposed |
|---|---|
| SEO title | `About Gridsmith Ltd — one company, three specialist studios` (59) |
| Meta description | `Gridsmith is one UK company with three studios — design, digital and publishing — under one contract, so work moves between them without starting over.` (151) |
| `og:title` / `og:description` | Same as title / meta (today inherited: `Gridsmith Ltd` / group description) |
| H1 | `About Gridsmith` — unchanged |

**Why the meta changed (guidance G):** the description leads with what Gridsmith is and why the
structure matters. "Without starting over" echoes the Master proposition. Registration moves out
of the snippet, and the page body and foot carry it as a trust fact.

---

**About**

# About Gridsmith

One company, three specialist studios: Design for visual and technical form, Digital for working
systems, Press for words and publishing. Work with one or several — it is the same relationship.

---

**02 · What Gridsmith is**

Gridsmith Design covers brand and visual work, illustration, motion, 3D visualisation and
technical design. Gridsmith Digital builds websites, software, apps and automation, and keeps
them running afterwards. Gridsmith Press writes, edits and prepares books and business content
for publication, along with the content and promotion around them.

All three belong to one company, Gridsmith Ltd. Whichever studio you work with, the contract,
the invoice and the company answerable to you are the same.

Most work starts with one studio. The structure earns its keep when a second need appears — a
website after a new identity, a launch site for a book — and nobody has to brief the work from
the beginning again.

---

**03 · One company, three studios** — *(studio map component, unchanged; summaries per decision 1C)*

**Gridsmith Ltd** · One company · one contract
01 [Gridsmith Design → /design] — Visual and technical form: brand, illustration, motion, 3D and technical design.
02 [Gridsmith Digital → /digital] — Working systems: websites, software, apps, automation and AI, built and kept running.
03 [Gridsmith Press → /press] — Words and publishing: writing, editing, book production, audiobooks, content and book marketing.

---

**04 · Why it is built this way**

Different work needs different specialists. A brand identity, a production web application and
an edited manuscript are different crafts, and treating them as one is how work ends up strong in
one discipline and thin in the rest.

The usual alternative is a separate supplier for each: a designer who has never seen the website,
a developer working from brand guidelines nobody explained, a writer briefed by neither. Each may
be good at their job. What goes wrong is at the joins, and coordinating them quietly becomes your
job.

So the specialists stay specialists, and the relationship does not restart when the medium
changes. — *UNCHANGED*

---

**05 · How we take on work** *(paired with 06)*

We work out what the requirement is, say which discipline it belongs to, scope it for your
situation rather than from a menu, and run it through the studio that does that kind of work.
Where it spans two, joining them up is our job.

Every engagement is quoted against its own written scope. That is why there is no price list
here: the number follows the requirement, and the requirement comes first.

The six stages behind this — from the first conversation to optional support — are set out in
[how a Gridsmith project runs → /approach].

**06 · What we hold ourselves to** *(decision 4)*

Decisions can be explained. If we cannot say why a design, a system or a sentence is the way it
is, it is not finished.

Work is built to be handed over. Files, code and documents should make sense to whoever picks
them up next, including you.

Accessibility is part of the brief from the start, not an upgrade that arrives later.

Bad news travels early. We would rather tell you something is a bad idea at the start than
deliver it well and watch it fail.

---

**07 · Evidence you can check** — *OPTIONAL (decision 3, recommended include)*

There is no public portfolio here. Some of our work cannot be shown publicly, either because we
do not hold permission to publish it or because it is confidential. Relevant examples may be
discussed privately where we are permitted to share them.

What can be checked publicly: the reviews clients have left on our
[Freelancer profile → https://www.freelancer.com/u/GridsmithLTD], reproduced word for word on
our home page, and the company itself on the public register under the number at the foot of
this page.

---

**08 · Getting in touch**

The [enquiry form → /contact] is the easiest route if there is any detail to share; every channel
below reaches the same place. We typically respond within 48 hours. — *last sentence from source*

**[ Discuss Your Requirements ]** → `/contact` — *UNCHANGED label*

**Directly:** Email · WhatsApp · Text message — *UNCHANGED, from source*
**Platforms:** *UNCHANGED, from source*

Gridsmith Ltd is registered in England, company number 17050842. The full statutory details,
including the registered office, are in the footer of every page. — *UNCHANGED (page-controlled
trust line; the footer itself is not controlled by this page)*

### Why this version is better — About

- **The intro says what each studio does**, instead of only that there are three.
- **Technical Design is named as a Design discipline**, in the same term `/design` uses.
- **The legal structure is explained in plain words** — one company, one contract, one invoice.
  "Trading divisions" stays in the statutory places.
- **The unsupported pattern claim is gone** ("more often a year later").
- **Delivery values cover all three studios**, not just design and technical work.
- **The portfolio question is answered honestly** with checkable sources.
- **The page hands on to `/approach`** instead of ending in parallel.

### Optional content decisions — About

| Item | Recommendation |
|---|---|
| Section 07 "Evidence you can check" | Include (3A) |
| Section 06 accessibility commitment | Keep, if the owner confirms it describes practice (4A); otherwise 4B |
| Freelancer link in 07 | Keep; appears once the renderer prerequisite lands |

---

## Approach — complete proposed copy (R1)

| Field | Proposed |
|---|---|
| SEO title | `How we work: the six stages of a project — Gridsmith Ltd` (56) |
| Meta description | `How a Gridsmith project runs: consultation, a written scope you approve, agreed review points, delivery and optional support — and when to go elsewhere.` (152) |
| `og:title` / `og:description` | Same as title / meta |
| H1 | `How we work` — unchanged |

---

**Approach**

# How we work

Six stages, the same six whichever studio does the work. The short version: we find out what you
need before we tell you what it costs, and nothing starts until you have approved a written
scope.

---

**02 · We start with the requirement, not the service**

Most enquiries arrive as a solution — a new website, a rebrand, a book. Sometimes that is right.
Often the need behind it is different enough that building what was asked for would waste your
money.

So the first conversation is about the business and the problem, not about what we sell. It is
also where we say if the work belongs somewhere other than Gridsmith. That happens, and telling
you early costs both of us less than telling you late.

**Preparation guidance (new):** It helps to bring what you are trying to achieve, who it is for,
what already exists — files, systems, a draft, a brand — any date you are working to, and who
decides on your side. None of it needs to be polished.

---

**03 · One brief, even across studios** *(paired with 04)*

[Gridsmith Design → /design], [Gridsmith Digital → /digital] and [Gridsmith Press → /press] are
studios of one company, Gridsmith Ltd — not three suppliers who have never spoken. One contract
covers work that spans them.

Where a project needs two studios, coordinating them is our job. You brief it once, and the
second studio starts from the decisions the first has already made.

**04 · Everything is scoped for the specific job**

There are no packages on this site and no price list, because the work does not come in fixed
sizes. Instead you get a written scope: what is included and what is not, the timeline, how the
work is priced, and what we need from you and when.

That document is where disagreements should happen. A scope you have read and questioned is
worth more than a number you accepted quickly.

---

**05 · The six stages**

*Explanatory copy (proposed):*

The same six, whatever the work. Stage 1 is understanding the requirement, stage 2 is writing the
scope, stage 3 is your approval, stage 4 is the work itself, stage 5 is delivery against the
scope, and stage 6 happens only if continuing makes sense for you.

Review is not a stage of its own because it is not a moment. It runs through stage 4, at points
agreed when the scope is written rather than whenever someone remembers.

**Cross-studio handoff (new):** Where the work needs more than one studio, the handover happens
inside stage 4 — same scope, same review points — rather than as a new project.

*Canonical stages — UNCHANGED, FIXED (`lib/process/canonical.ts`, `00-PROCESS.md`):*

| # | Stage | Description |
|---|---|---|
| 01 | Consultation | Understanding the business, project goals, target audience, and current digital presence |
| 02 | Planning & Scope | Clear project scope, timeline, pricing structure and required deliverables prepared before work begins |
| 03 | Approval & Start | Work begins once scope is confirmed and the agreed initial payment is received |
| 04 | Design, Development & Updates | The project is developed with regular updates, feedback opportunities and clear communication throughout — *By the studio or studios the work needs: Design · Digital · Press* |
| 05 | Delivery | Final deliverables reviewed, completed and provided according to the agreed scope |
| 06 | Support *(if applicable)* | Ongoing support, maintenance, SEO improvements and digital assistance where required |

---

**06 · What continuity looks like: an example journey** *(decision 2B)*

This is an illustration of how work moves between studios. It is not a client project and does
not describe an actual engagement.

A business commissions a [new brand identity → /design/services/brand-identity-systems] from
Design. Later it needs [a website → /digital/services/website-design-build]. Digital starts from
the identity files and the reasoning behind them, so the decisions already made — the audience,
the tone, what was ruled out — do not have to be rediscovered. When the site needs copy, Press
writes it to the same brief.

We do not publish client relationships without permission. Relevant examples may be discussed
privately where we are permitted to share them.

---

**07 · When to use a specialist instead** *(sunken, deliberately plain)*

Three studios is not every discipline. If your work needs a structural engineer, a chartered
accountant, a solicitor or a specialist agency with a decade in one narrow field, that is who you
should be talking to, and we will say so. — *UNCHANGED*

**Technical design boundary (R1):** Technical design at Gridsmith prepares technical visual
material from the design information you supply. It does not include engineering design or
calculations; no engineering certification, approval, stamping or regulated sign-off is offered,
and we do not act as a responsible designer. Where a project needs those, it needs a qualified
engineer, and we will say so.

The same applies inside our own range. Some work is too small to justify what it would cost to
scope properly, and some is far enough outside what we do well that taking it on would not be
fair to you.

---

**Closing (decision 6A):** If this is how you want to work, the first stage is a conversation,
and a rough outline is enough to start it. We typically respond within 48 hours. — *last sentence
from source*

**[ Discuss Your Requirements ]** → `/contact` — *UNCHANGED label*

### Why this version is better — Approach

- **Accurate:** each stage is described as what it is. Stage 3 is approval, not "making it".
- **Useful before the first call:** what to bring, and that it need not be polished.
- **Says where the client decides:** approving the scope, review points in stage 4, and
  acceptance at delivery.
- **Explains the cross-studio handoff**, which is the question the page exists to answer.
- **The example is honest:** labelled as an illustration in its first sentence, never evidence.
- **Technical Design is kept and bounded:** a plain responsibility limit that reuses `/design`'s
  own gate wording ("no engineering certification or regulated sign-off is offered").
- **The close names the first step** instead of a bare button.

---

## Technical Design wording

| | `nav.ts` Design `summary` |
|---|---|
| **CURRENT** | `Brand, visual, illustration, motion, 3D and technical design.` |
| **GS-SEO-001 draft** | `Visual and technical form: brand identity, graphic design, illustration, motion and 3D.` — **withdrawn** |
| **R1 RECOMMENDED** | `Visual and technical form: brand, illustration, motion, 3D and technical design.` |

**Why the draft was wrong.** It dropped "technical design" because `GS-X002` is open. But
`GS-X002` gates three service **records**, not the discipline. `/design` already presents
Technical Design publicly: a chapter titled "Technical Design" with its own gate note. Removing
the term from the summary would make the Master, About and `/design` metadata contradict the
studio's own page, and would weaken Design to brand and visual work only.

**How R1 stays inside the line:**

1. **It preserves the discipline.** "Technical design" stays in the one-source summary, and with
   it in `/design`'s meta description. "Visual and technical form" frames the studio around both
   halves.
2. **It publishes no gated service.** The summary links to `/design` only. `cad-drafting`,
   `engineering-drawings` and `technical-documentation` are not linked, not named, and stay 404
   and out of the Production sitemap. Nothing here changes the `GS-X002` publication state.
3. **It implies no engineering responsibility.** "Technical design" here is a studio discipline
   in a list, not an offer of design responsibility. The responsibility limit is stated where a
   buyer evaluates engagements: the Approach boundary paragraph, plus `/design`'s existing note.
   No insurance, certification, qualification or engineering credential is stated or implied.
   The Approach sentence says the opposite of each.

**Consistent R1 wording elsewhere:** About intro "Design for visual and technical form" · About §02
"…3D visualisation and technical design" · Master meta "brand, visual and technical design".

---

## Contact form / GS-X002

**Current option (unchanged, not modified):** `components/leads/ContactForm.tsx:64` —
`{ value: 'design', label: 'Design — brand, 3D, CAD, drawings' }`

**Why it may conflict.** Two of its four words — "CAD" and "drawings" — are the names of two of
the three gated records (`cad-drafting`, `engineering-drawings`). On a form label they read as
services Gridsmith currently offers, while Production publishes 0 Technical services. Taken alone,
"drawings" sits closer to "engineering drawings" than to the broad discipline. Two things soften
this. `/design` already names "CAD, technical illustration and documentation" in its Technical
Design chapter, under its gate note. And a form label routes an enquiry rather than describing a
service. So this is a **consistency risk, not a clear breach**.

**Batch F options (not implemented):**

| Option | Label | Assessment |
|---|---|---|
| **F-A** keep | `Design — brand, 3D, CAD, drawings` | Consistent with `/design`'s chapter copy; leaves the gated record names on a conversion surface |
| **F-B** (recommended) | `Design — brand, visual, 3D, technical design` | Keeps technical enquiries routable to Design under the approved discipline name; names no gated record; matches `nav.ts` R1 |
| **F-C** | `Design — brand, illustration, motion, 3D` | Removes technical — **contrary to guidance F**, loses legitimate enquiries |

The submitted value (`design`) is unchanged in every option, so routing, storage and
notifications are unaffected. Batch F should still search the tests for the label text before
changing it.

---

## Implementation prerequisites and impact (after approval — no code written)

| System | What would change |
|---|---|
| **NAV.TS** | `components/chrome/nav.ts` — three `summary` strings (1C). Cascades automatically to the Master studio index, About `StudioMap`, and the `DESCRIPTION` of `app/(design\|digital\|press)/layout.tsx` (`summary` + statutory sentence). Theses unchanged |
| **SEED / CMS CONTENT** | `scripts/seed-content.mjs` `groupPageDocs` — About and Approach `intro`, section headings and bodies, the new About `evidence` section, link `markDefs`. The `blocks()` helper emits `markDefs: []` and plain spans today, so it needs link-capable paragraphs. Then **Production Sanity** via the guarded `scripts/migrate-production-cms.mjs` (dry run → backup → `--write` → read-back), which needs its own write authority. Document ids, slugs and count (47) are unchanged |
| **RUNTIME COPY (page code)** | `app/(marketing)/page.tsx` hero intro · `components/master/Home.tsx` (studios H2 and "not sure" line, relationship lede, capabilities H3 and lines, link anchors, Process H2/lede/link, close lede) · `components/content/Connect.tsx` note (rendered only by `/about`) · `app/(marketing)/approach/page.tsx` closing line (6A) |
| **METADATA** | `/`: title, description and OG via page-level metadata. The group `DESCRIPTION` in `app/(marketing)/layout.tsx` is also the default `og:description` for every Master route, so either override per page or change it knowingly. `/about` and `/approach`: `title`, `description`, `openGraph` in their `page.tsx`. Re-run `check:company` question 10 (studio taxonomy) |
| **PORTABLE TEXT RENDERER** — prerequisite | `components/content/Blocks.tsx` renders link annotations (internal `<a>`, external with new-tab announcement as `Connect` does). The `PortableBlock` type and the group-page GROQ projection carry `markDefs` (absent in `lib/sanity/queries.ts` today). Proven on a permanent specimen. `check-axe` already resolves every same-origin link (discovery S4). Small and self-contained, but a runtime change with its own gate proof |
| **INTERNAL LINKS** | Master: `/design`, `/digital`, `/press`, `/contact` ×3, `/approach` ×2, `/about` (page code — no renderer dependency). About: `/approach`, `/contact`, Freelancer profile (external). Approach: `/design`, `/digital`, `/press`, `/design/services/brand-identity-systems`, `/digital/services/website-design-build`. The About/Approach prose links depend on the renderer |
| **NO CHANGE** | Master H1 and kicker · CTA labels (`ENQUIRY_CTA`) · `CANONICAL_PROCESS` and `ProcessRail` · `StudioMap` component · Reviews copy and carousel · `/` statutory paragraph and footer · `ContactForm` · scene, CSS, layout, typography, palette · canonicals · structured data · the three gated Technical records |

**Gates after implementation:** `check:master-hero`, `check:master:scene`, `check:company`,
`check:launch`, `check:axe`, `check:responsive`, `check:cms:migration` (dry run), the exact-SHA
Lighthouse run.

---

## Layout risk

### Master (characters, current → proposed)

| Block | Current | R1 | Δ | Risk |
|---|---|---|---|---|
| Hero intro | 140 | 134 | −6 | **LOW** — shorter; `check:master-hero` Q4 (CTA in first screen at 360×740) not pressured |
| Studios H2 | 30 | 36 | +6 | **LOW** |
| Design / Digital / Press summaries | 61 / 68 / 72 | 80 / 85 / 96 | +19 / +17 / +24 | **LOW** — at most one extra line per row |
| "Not sure…" line | 55 | 111 | +56 | **LOW** — one extra line |
| Relationship lede | 157 | 169 | +12 | **LOW** |
| Capabilities H3 + four lines | 22 + 294 | 37 + 416 | +137 | **MEDIUM** — about one extra line per item, over the gold scene; re-run `check:master:scene` Q5 contrast |
| Process H2 | 11 | 42 | +31 | **LOW** — may set on two lines |
| Process lede | 127 | 183 | +56 | **LOW** |
| Reviews | — | — | 0 | none (5B) |
| Close lede | 106 | 246 | +140 | **MEDIUM** — two to three extra lines in the final chapter where the scene resolves to the front-on mark; contrast and footer-lift re-check |

### About / Approach openings

| Block | Current | R1 | Δ | Risk |
|---|---|---|---|---|
| About intro (Opening lead) | 118 | 193 | +75 | **LOW** — spacious opening, one or two extra lines |
| Approach intro (Opening lead) | 144 | 195 | +51 | **LOW** |
| About new section 07 | — | ~90 words | new | **LOW** — existing layout; numbering auto-computed |
| Approach process band body | 2 ¶ | 3 ¶ | +1 ¶ | **LOW** |
| Approach closing line | — | 1 ¶ | new element | **LOW** |

No HIGH risk. No layout redesign proposed.

---

## Recommended approval set

```
APPROVE 1C   Studio summaries — R1 wording, Technical Design kept (releases the GS-MASTER-001-RC freeze on summaries only)
APPROVE 2B   Approach continuity — labelled example journey (not a case study)
APPROVE 3A   About — include "Evidence you can check"
APPROVE 4A   About — four delivery commitments, on owner confirmation the accessibility line is practice
APPROVE 5B   Master — omit the private-examples sentence
APPROVE 6A   Approach — closing line above the CTA
APPROVE 7A   Master — no campaign-management line in this batch
APPROVE      Master, About, Approach R1 copy and metadata as set out above
APPROVE      Portable Text link rendering as the implementation prerequisite for About/Approach links
DEFER        Contact form label to Batch F (recommendation F-B)
```

---

## GS-SEO-001-I1 — local implementation note (uncommitted)

Approved Batch A implemented locally with owner overrides (accessibility wording; Technical Design
boundary). **Local rendering of `/about` and `/approach`:** these routes read `groupPage` from the
Sanity `development` dataset, which still holds the old copy, and no dataset may be written in this
phase. The local build therefore loads a read-only `fetch` interceptor kept **outside the
repository** (session scratchpad, `local-grouppages.mjs`, via `NODE_OPTIONS=--import=…`) that
answers only the two `groupPage` GET reads from `scripts/seed-content.mjs` `groupPageDocs`; every
other request passes through. Build log: exactly one `about` and one `approach` read served. The
repository carries no prototype hack; Production renders the new copy only after an authorised
guarded migration.
