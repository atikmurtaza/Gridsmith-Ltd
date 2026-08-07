# Build Sequence — solo build with Claude Code

**Context:** one person, building from scratch in Claude Code to production, then populating the database and configuring services once the site is complete.

That last point changes the sequencing meaningfully. You are not building a site and filling it as you go — you are building an **empty machine that gets loaded at the end**. Everything below is arranged around that.

---

## 1. The recommendation, in one line

**Build the whole application shell first, launch with Master + Press, then add Design and Digital as content becomes available.**

Not four sequential projects. One application, staged public exposure.

## 2. Why this order

### Why the shell first, not a division first
Route groups, tokens, primitives, CMS schemas, the lead pipeline, consent and CI are shared by all four workstreams. Building them once, completely, before any division page is written means:
- No rework when division two reveals a primitive was built wrong
- Claude Code works far better against a settled foundation than a shifting one — every subsequent session inherits stable conventions from `PROJECT-RULES.md`
- The seed data and import scripts exist before you need them, not after

### Why Press launches first
Press has the least invented content and the most real proof:

| | Press | Design | Digital |
|---|---|---|---|
| Existing revenue | **Highest** | Medium | Lower |
| Real portfolio available now | **Books already published** | Client-consent dependent | Client-consent dependent |
| External gate before launch | Author consents | **Chartered engineer review** | **Estimator calibration on 10 past projects** |
| Content that must be invented | Least | Drawing matrix (20 rows) | Stack rationale, 15 lock-in assessments |
| Conversion machinery risk | Path Finder (moderate) | Matrix + estimator | **Estimator — highest risk in programme** |

Press's launch gate is *asking people you already work with for permission*. Design's is *booking a chartered engineer*. Digital's is *having ten historical projects with clean final prices*. The first is entirely within your control; the other two are not.

### Why Digital is last despite being the flagship
Two reasons. The estimator carries a hard calibration gate that fails the whole feature if the data isn't there, and Digital's Lighthouse 100/100/100 requirement is easiest to hit on a codebase that has already been performance-tuned twice.

There is a counter-argument worth stating: Digital is the division you most want to be selling, and shipping it last delays that by months. If you decide to move it up, move it to second — never first, because the estimator against an unsettled foundation is the highest-risk combination available.

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
4. All 21 primitives, with a `/_kitchen-sink` route
5. Sanity project, core schemas, `isSeed` on everything
6. Supabase, `leads`, RLS
7. Lead pipeline end to end
8. Consent management
9. Seed enforcement + production build check
10. Header, footer, statutory block, `companyDetails`

**Do not start a page until the kitchen-sink route renders every primitive correctly in all four themes.** This is the single highest-leverage discipline in the whole build. A primitive fixed in week 2 costs an hour; the same fix in week 12 touches forty files.

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

### Stage 5 — **First public launch** · **Week 12**

Ship Master + Press. Design and Digital exist as routes but are not yet linked from the division routing block, or are shown as "opening shortly" with a contact path.

**Why launch here rather than waiting:** you get real traffic, real conversion data and real feedback on the master brand argument three to five months earlier than a big-bang launch. The specs contain a lot of hypotheses (the ecosystem argument, the Path Finder, the pricing transparency bet) and every week they stay untested is a week of building on unvalidated assumptions.

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

| Stage | Weeks | Cumulative |
|---|---|---|
| 0 Decisions | 0 | — |
| 1 Foundation | 3 | 3 |
| 2 Seed + import tooling | 1 | 4 |
| 3 Master | 3 | 7 |
| 4 Press | 4 | 11 |
| **5 First launch** | 1 | **12** |
| 6 Design | 4 | 16 |
| 7 Digital | 4 | 20 |
| 8 Content load | 1 | 21 |

**~21 weeks, about five months**, at a genuine full-time pace with Claude Code doing the implementation and you doing direction, review and content.

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
