# Build Sequence — solo build with Claude Code

**Context:** one person, building from scratch in Claude Code to production, then populating the database and configuring services once the site is complete.

That last point changes the sequencing meaningfully. You are not building a site and filling it as you go — you are building an **empty machine that gets loaded at the end**. Everything below is arranged around that.

---

## 1. The launch model — decided

**Everything goes live at once, when all four sections are complete.** Nothing ships
partially. The single launch is after Stage 8, when real content is loaded.

The existing Press site stays up and trading throughout the build and comes down at launch.

This replaces the earlier staged-exposure plan ("launch with Master + Press, add Design and
Digital later"), and the replacement is not cosmetic — it removes the constraint that
shaped the entire build order. Three consequences follow.

**Stage 5 is no longer a launch milestone.** There is no first public launch, no partially
linked division routing block, no "opening shortly" state.

**Build order is now unconstrained by launch sequencing**, so it is ordered by **risk**
instead of revenue — see §2.

**Seed content carries all four sections right up to Stage 8.** No division needs real
content early. `O-01` (author consent) stays at Stage 4 because it gates real content, not
a cutover.

## 2. Why this order

### Why the shell first, not a division first
Route groups, tokens, primitives, CMS schemas, the lead pipeline, consent and CI are shared by all four workstreams. Building them once, completely, before any division page is written means:
- No rework when division two reveals a primitive was built wrong
- Claude Code works far better against a settled foundation than a shifting one — every subsequent session inherits stable conventions from `PROJECT-RULES.md`
- The seed data and import scripts exist before you need them, not after

### Ordering by risk — **PROPOSED, pending confirmation**

With launch sequencing gone, the ordering question changes from *what can we ship soonest*
to *what could fail, and how much time do we want left when it does*. Highest-unknown and
tightest-gated work goes earliest so failures surface with room to absorb them.

**Proposed: Master → Digital → Design → Press.**

**Master stays first, but not on risk grounds** — it is a structural dependency. Epics N, L
and G own the canonical `/work/[slug]`, the header, footer, consent layer and legal pages
that all three divisions link into. Within Master, front-load the risky items rather than
the visible ones: consent (`A-11`), the legal chain (`L-01`–`L-04`), and the division
routing user test (`H-05`, ≥70% one click) — that last one can invalidate the homepage's
central argument, and it is cheap to run early.

**Digital second, reversing the old order.** It carries the two hardest gates in the
programme: estimator calibration ≥8/10 against ten historical projects with clean final
prices — a gate that fails the *whole feature* if the data does not exist — and
**100/100/100**, the tightest performance requirement anywhere in the build.

The old sequence put Digital last on the reasoning that 100/100/100 is *easiest to hit on a
codebase already performance-tuned twice*. Under risk ordering that argument inverts: the
goal is not to make the gate easy to pass but to find out early whether it can be passed at
all. And there is now a measured reason to treat it as live rather than theoretical —
Epic A established that an **empty** Digital page measures 1520ms LCP against a 1600ms
ceiling on CI. Seventy-eight milliseconds of headroom, before the stack page, the estimator
island and the diagnostic exist. If that budget is unreachable, it is a specification
renegotiation, and the difference between discovering it in week 9 and week 18 is whether
there is time to renegotiate or only time to cut.

Building Digital's estimator first also de-risks Design's, which shares the 40KB
estimator-route budget and most of the interaction pattern.

**Design third.** Its hard gate — chartered engineer sign-off on the drawing matrix — is
external and can bounce, sending twenty rows of standards content back for revision. But it
is a review of content, not a discovery of whether the feature is buildable.

**Press last, and this is the real reversal.** Press was first under the old order because
it was the most *launchable*: least invented content, real published books, highest
existing revenue. Every one of those is a launch-readiness argument, and launch readiness
no longer sets the order. On risk, Press is the safest of the three — its gates (author
consents, the vanity-press user test, retailer links, ETH-04) are largely within the
founder's control, and its content already exists.

**The counter-argument, stated plainly:** Press carries the existing revenue and building it
last means its replacement is the last thing finished. Under a single launch that costs
nothing in trading terms — the current Press site keeps trading throughout — but it does
mean the section with real customers gets the least schedule slack if the programme
overruns. If that is the wrong trade, the alternative is Master → Digital → Press → Design,
which keeps the highest-risk work early while pulling Press out of the tail.

The original comparison that drove the old order, retained because the underlying facts
have not changed — only their relevance has:

| | Press | Design | Digital |
|---|---|---|---|
| Existing revenue | **Highest** | Medium | Lower |
| Real portfolio available now | **Books already published** | Client-consent dependent | Client-consent dependent |
| External gate before launch | Author consents | **Chartered engineer review** | **Estimator calibration on 10 past projects** |
| Content that must be invented | Least | Drawing matrix (20 rows) | Stack rationale, 15 lock-in assessments |
| Conversion machinery risk | Path Finder (moderate) | Matrix + estimator | **Estimator — highest risk in programme** |

Press's launch gate is *asking people you already work with for permission*. Design's is *booking a chartered engineer*. Digital's is *having ten historical projects with clean final prices*. The first is entirely within your control; the other two are not.

Read that table now as a **risk** table rather than a readiness one. The rows that matter
under the new model are "external gate before launch" and "conversion machinery risk", and
both put Digital first and Press last — the exact inverse of what the same table said when
the question was what to ship soonest.

One caveat from the old order survives and still binds: **the estimator against an
unsettled foundation is the highest-risk combination available.** That is why Digital moves
to second and not to first. Epic A is complete and gated, but Master's chrome, consent
layer and canonical case-study route are not, and the estimator sits on top of all three.

## 3. The sequence

### Stage 0 — Decisions and dependencies · **Week 0, before writing code**

Not a build stage. Do these in parallel with nothing else blocking them, because every one has an external lead time.

| Action | Why now |
|---|---|
| Send `_legal/` drafts to your solicitor | Longest lead time in the programme. Gates every legal page |
| Register with the ICO | Needed for the privacy policy |
| Confirm PI insurance covers engineering drawings | Design cannot launch without it |
| Request author consent for 12+ titles | Press's entire trust architecture depends on it |
| Crawl the existing site, export URLs | Redirect map |
| Book a chartered engineer for the drawing matrix | Design gate |
| Pull 10 past Digital projects with final prices | Digital estimator gate |
| Pull 8 past drawing jobs with final prices | Design estimator gate |
| Decide business hours and phone number | Confirmation screens |

**Every one of these is a phone call or an email.** They cost you an afternoon and they unblock months.

### Stage 1 — Foundation · **Weeks 1–3**

`master/PROJECT-TRACKER.md` Epic A + Epic M.

Build order within the stage:
1. Scaffold, TypeScript strict, Tailwind v4, CI gates — **set the CI gates on day one**, not at the end. Claude Code respects a failing build; it does not respect a comment saying "we'll optimise later"
2. Token layer, then all four themes
3. Four route groups with server-set `data-division`
4. All 24 primitives, with a `/_kitchen-sink` route
5. Sanity project, core schemas, `isSeed` on everything
6. Supabase, `leads`, RLS
7. Lead pipeline end to end
8. Consent management
9. Seed enforcement + production build check
10. Header, footer, statutory block, `companyDetails`

**Do not start a page until the kitchen-sink route renders every primitive correctly in all four themes.** This is the single highest-leverage discipline in the whole build. A primitive fixed in week 2 costs an hour; the same fix in week 12 touches forty files.

**Epic A exit gate.** Beyond the visual pass, `/_kitchen-sink` must clear both of these
in a **fresh context**, run from `.claude/agents/`:

- `rules-compliance` — zero violations of `master/PROJECT-RULES.md` and the `CLAUDE.md`
  non-negotiables
- `accessibility-audit` — zero WCAG 2.2 AA violations

A fresh context is the point: the model that just wrote 24 primitives is the worst
available reviewer of them. Nothing downstream of Epic A starts until both come back
clean.

### Stage 2 — Seed data and import tooling · **Week 4**

Unusual placement. Most people leave this to the end. Do it here:

- Seed script producing the volumes in `00-FOUNDATION.md` §7
- Bulk import script (`scripts/import-projects.ts`)
- Image ingest pipeline (watermark, resize, AVIF)

**Reasoning:** you said you'll load the database once the site is complete. That means the import path is on the critical path to launch, not after it. Building it now also means every page you write from week 5 onward is developed against realistic content volumes — 24 projects, not three — which is how layout defects surface early instead of on launch day.

### Stage 3 — Master layer · **Weeks 5–7**

`master/PROJECT-TRACKER.md` Epics N, L, G.

Homepage, division routing, `/approach`, `/about`, `/work`, canonical `/work/[slug]`, `/contact`, legal pages, redirects, sitemap.

**Gate:** division routing user test, ≥70% reach the correct division in one click. Ten people, informal, twenty minutes.

### Stage 4 — Press · **Weeks 8–11**

`press/PROJECT-TRACKER.md`.

Order within the stage matters here more than anywhere: **trust architecture before selling pages.** Books shelf, ownership facts module, platform compliance, packages, rights page — then the Path Finder, assessment and marketing pages. Build it the other way round and you get a vanity-press-shaped site that is hard to reverse.

**Gates:** rights wording matches the contract · author user test ("does this feel like a vanity press?") · all retailer links live · ETH-04 verification.

### Stage 5 — ~~First public launch~~ · **REMOVED**

There is no first launch. Everything goes live at once after Stage 8.

**The stage number is retained deliberately.** Stages 6–9 are not renumbered, because
"Stage 8" and "Stage 4" are referenced from `CLAUDE.md`, `00-FOUNDATION.md`, both
`PROJECT-TRACKER` files and this document's own timeline. Renumbering to close a gap would
silently invalidate every one of those references — a five-minute tidy that costs an
afternoon of stale cross-references later.

**What was lost, honestly.** The staged launch bought early validation of genuine
hypotheses — the ecosystem argument, the Path Finder, the pricing-transparency bet — three
to five months sooner. Under a single launch those stay untested until everything ships,
and the first real signal arrives at the end rather than the middle. The compensating
controls are the ones already specified and now carry more weight than they did:
the division routing user test (`H-05`, ten people), the Press author user test, and the
track fork test. **Run them earlier rather than later** — they are the only pre-launch
evidence the programme now has, and they cost an afternoon each.

### Stage 6 — Design · **Weeks 13–16**

Track fork, drawing matrix, standards strip, sample pack, drawing estimator, Design Desk.

**Gates:** chartered engineer sign-off on the matrix · track fork user test · estimator calibration ≥6/8.

Add Design to the division routing block on launch.

### Stage 7 — Digital · **Weeks 17–20**

Stack page, ownership guarantee, exclusions, Diagnostic, estimator, Care Plans.

**Gates:** estimator calibration ≥8/10 · ownership wording legal check · Lighthouse 100/100/100.

### Stage 8 — Real content load · **Week 21**

- Bulk import the real portfolio via the script built in Stage 2
- Replace seed pricing with confirmed pricing
- **Delete seed records** — never edit them into real ones
- Verify the production seed check passes with zero seed documents
- Re-run the full accessibility and performance pass on real content — image-heavy real portfolios behave differently from placeholder geometry

### Stage 9 — Post-launch optimisation · **ongoing**

Per each workstream's Phase 7.

## 4. Realistic timeline

Under the proposed risk order, with Stage 5 removed:

| Stage | Work | Weeks | Cumulative |
|---|---|---|---|
| 0 | Decisions | 0 | — |
| 1 | Foundation | 3 | 3 |
| 2 | Seed + import tooling | 1 | 4 |
| 3 | Master | 3 | 7 |
| 4 | **Digital** | 4 | 11 |
| 5 | ~~First launch~~ removed | — | — |
| 6 | **Design** | 4 | 15 |
| 7 | **Press** | 4 | 19 |
| 8 | Real content load + **single launch** | 1 | **20** |

**~20 weeks, about five months.** One week shorter than the staged plan, because the launch
week itself is absorbed into Stage 8 rather than spent separately.

The division names now sit under stage numbers that no longer match their old order —
Stage 4 is Digital, not Press. **`O-01` (author consent) stays at Stage 4 by calendar, not
by stage label**: it is a long-lead external request that gates real content at Stage 8, so
it is raised in week 8 regardless of which division is being built then. Confirm the order
before these labels are relied on anywhere.

Two honest caveats:
- **Content is the variable that slips.** The build estimates assume copy and case studies arrive when the tracker says. They usually do not. If anything overruns, it will be Epics E, O and X.
- **This assumes no client work interrupts.** Since Gridsmith is currently your revenue, it will. Add 30–50% if you are delivering client projects alongside.

## 5. Working with Claude Code on this

Some specifics, since that is the build environment:

**Give it the rules file, every session.** `PROJECT-RULES.md` for the workstream you are in, plus `_shared/00-FOUNDATION.md`. These were written to be read by an implementing agent — the "what an AI coding agent must not do here" sections exist precisely for this.

**Work in tracker-task units.** One task ID per session or per PR. `C-02: Drawing matrix component` is a good unit of work. "Build the Track B page" is not — it is nine tasks and the context will drift.

**Let CI be the arbiter.** The performance, accessibility and lint gates are specified as merge-blocking. That is what keeps quality from eroding across a twenty-week build where no human is reviewing every line. Do not add bypasses.

**Never let it invent content.** The rules files say this repeatedly because it is the failure mode with the worst consequences here — a fabricated case study metric, an invented BS standard, a made-up ISBN, a hallucinated contract clause. Insist on `[TK]` markers and check for them before every merge.

**Keep the specs as the source of truth, and update them when you deviate.** If you change something during the build, change the spec in the same commit. A spec that has silently drifted from the code is worse than no spec, because the next session will follow it.

## 6. Where you can compress if you need to

In rough order of what costs least to cut:

1. **Insights hubs** — P2 everywhere. Cut from launch entirely.
2. **Digital's live vitals badge** — nice, not load-bearing.
3. **Design's sample-pack follow-up automation** — do it manually at low volume.
4. **Press's Content Programme page** — fold into a service page initially.
5. **The Design drawing estimator** — it was added as an enhancement; the pricing tables still satisfy the requirement at a lower level.

What you should **not** cut, in any circumstance: consent management, the statutory footer, the legal pages, the seed production check, the estimator calibration gates, the ownership/rights wording checks, or the accessibility gates. Every one is either a legal exposure or a trust mechanism the specs are built around.
