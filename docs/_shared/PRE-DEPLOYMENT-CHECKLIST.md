# Pre-deployment checklist — everything assumed, drafted, inferred or taken from elsewhere

**Written:** 7 September 2026. **Owner of every row below: Atik.**

## What this is, and what it is not

This is a **register of things a machine cannot decide**. Every row is a value, a sentence or a
rule that exists in the tree because the build needed *something* there, and that was chosen by
a session rather than supplied by the owner.

**It is not a gate and it must not become one.** No check reads this file, and no check should:
a gate that failed on placeholder content would fail every build from now until launch, which
means it would be bypassed within a day and the bypass would outlive the placeholders. The
mechanisms that *are* gates already exist and are narrower on purpose —
`check:launch` refuses a `production` dataset carrying `[SEED]`, `check:content` refuses an
invented figure, `check:struck` refuses a struck rule left standing. This file covers the space
those cannot see: **content that is honest about being provisional and would ship anyway.**

**Nothing here is a production blocker in the deployment sense.** The site builds, the gates
pass and it can be deployed to a preview today. Every row is a thing that must be *true* before
the site describes the real business to the real public.

**Vercel Pro is not on this list and is not a blocker.** Hosting stays Vercel Hobby; a
Hostinger-held domain points DNS at the existing Vercel project when the owner chooses.

---

## Counts by group

| Group | Rows | What it is |
|---|---|---|
| **A — Company facts only you can supply** | 7 | Addresses, numbers, mailboxes, insurance |
| **B — Prices and commercial terms** | 4 | Every price on the site is a placeholder |
| **C — The Q-P13 Path Finder rules** | 4 | Drafted this session, all `[SEED]` |
| **D — Seed content in the CMS** | 6 | `isSeed: true` records and the marked strings |
| **E — Placeholder imagery** | 3 | What is drawn, and the surfaces left empty |
| **F — Taken or adapted from the live gridsmith.uk** | 3 | Provenance that was not recorded before |
| **G — Statements about the business no one confirmed** | 5 | Sentences asserting a fact about Gridsmith |
| **H — Environment and infrastructure** | 8 | Variables unset for production |
| **I — Legal, already tracked elsewhere** | 4 | Pointers, not new work |
| **Total** | **44** | |

---

## Group A — Company facts only you can supply

| # | Item | Where | What is there now | What is needed |
|---|---|---|---|---|
| A1 | **Registered office string** | `scripts/seed-company-details.mjs:40` | `30 Briarfield Road, Farnworth, Bolton, BL4 0HD` | Confirm against the Companies House register. The live site publishes a **different string** for the same premises — `30, Briarfield Road, Farnworth Bolton BL4 **O**HD` — with the **letter O in the postcode**. `LIVE-SITE-EXTRACT.md` §11.3 |
| A2 | **Company number** | `scripts/seed-company-details.mjs:38` | `17050842` | Confirm. It appears **nowhere on the live site**, so the two artefacts cannot corroborate each other and this session verified neither against the register |
| A3 | **Contact email** | `seed-company-details.mjs:47`, `CONSUMER-TERMS.md` §6.1/§18 | `contact@gridsmith.uk` | **Confirm it receives mail.** It is the address a consumer is told to use to serve a statutory cancellation notice, and it is published on none of the three live pages. Three addresses are in play across the estate — `LIVE-SITE-EXTRACT.md` §11.2 |
| A4 | **Contact phone** | not in the seed | absent | The live site publishes `+44 7405 448534`. Decide whether it appears on the new site; `companyDetails.contactPhone` exists and is unset |
| A5 | **Response commitment** | `seed-company-details.mjs` | *"We'll reply as soon as we can, and always by the end of the next business day."* | Confirm you will meet it. Non-negotiable #5 makes this the single source of truth and `Z-10` is the drill that tests it |
| A6 | **PI insurer and cover limit** | `companyDetails.piInsurer`, `piCoverLimit` | unset | Supply or decide they are not published. Fields exist because the specs expected them |
| A7 | **ICO registration** | `companyDetails.icoRegistration` | unset | Supply, or record that registration is not required |

**Not on this list, deliberately:** `vatNumber`. Its absence is a recorded compliance decision,
not a gap — `sanity/schemas/companyDetails.ts` and `check:vat:display` both enforce it.

---

## Group B — Prices and commercial terms

| # | Item | Where | What is there now |
|---|---|---|---|
| B1 | **Every price on the site** | `scripts/seed-content.mjs:90`, `pricingBlock.fromAmount` | **`0`**. `fromAmount` is a number so it cannot carry a `[SEED]` prefix; the honesty mechanism is the visible `INDICATIVE` badge (`components/content/Price.tsx`) and `FOUNDATION` §7.5 |
| B2 | **Every "from" price on every service page** | the seeded `service` records | Non-negotiable #3 forbids publishing a service page without a price, so **a real figure is required per service before any service page goes live**, not merely desirable |
| B3 | **Press budget bands** | `lib/path/seedConfig.ts` question 3 | The six bands are `APP-FLOW.md` §5's, not invented — but they imply a price range the company has never quoted. Confirm they describe real engagements |
| B4 | **The Press contact flow's budget bands** | `PressContactFlow.tsx` | Diverge from `SCHEMA.md` §6 — an open question recorded at `K-13`, not a decision. Four shape-of-engagement values, not money bands |

---

## Group C — The Q-P13 Path Finder rules, drafted this session

**All of `lib/path/seedConfig.ts` is `[SEED]` and `isSeed: true`.** It exists to unblock `K-05`
and `K-04`, which were blocked on `Q-P13` with no owner. Read the file's docstring: it is
explicit about which parts were specified and which were invented.

| # | Item | What is invented | What is not |
|---|---|---|---|
| C1 | **The thirteen decision rules** | **All of them.** This is `Q-P13` | Rule `p10` — `APP-FLOW.md` §5's *"under £500 with a partial draft must return E or F"* is a functional requirement, and replacing it is a spec change rather than a content edit |
| C2 | **The five questions and 21 option labels** | nothing — verbatim from `APP-FLOW.md` §5 | the `questionKey` and option **slugs** are invented, because the spec gives labels and not keys. Renaming one is a data migration once results are logged |
| C3 | **The six outcome explanations and both `externalGuidance` texts** | **all of the prose**, each `[SEED]`-prefixed in the rendered string | the six keys (closed at `K-01`) and the six titles (`APP-FLOW.md` §5's A–F box). Amazon KDP and IngramSpark are named because `APP-FLOW.md` §5 names them |
| C4 | **The route that publishes them** | `app/(press)/press/path-finder/page.tsx` renders the criteria table and **says on the page** that the criteria are placeholders | `PROJECT-RULES.md` §6 requires all six outcomes and their criteria without JS; that requirement is met, with seed criteria |

**The honesty guarantee is real even though the rules are seed.** `check:path:selftest` drives a
complete answer set through the shipped evaluator for each of the six outcomes and reads the key
returned, so both non-Gridsmith outcomes are proven **reachable** rather than merely present.
Replacing the rules must keep that true — the six cases fail loudly if a replacement shadows an
honest outcome.

---

## Group D — Seed content in the CMS

| # | Item | Where | Count |
|---|---|---|---|
| D1 | Published seed documents in the `development` dataset | measured by `check:launch` against the served site | **121** — the number the *system* reports, not a count of `isSeed: true` literals in `seed-content.mjs` (which is 11, one per `_type` block). `check:launch` refuses any of them on `production` |
| D2 | `[SEED]`-marked strings in shipped code and seed scripts | 154 occurrences across 41 files; the shipped-code ones are `seedConfig.ts` (15), the `_master-sink` probe (8), `about`, `work/[slug]`, `path-finder`, `ContactForm`, `PressContactFlow`, `Price`, `Testimonials`, `SelectedWork` | **154** total, of which most are prose explaining the policy rather than seeded values |
| D3 | Seeded client names | `seed-content.mjs:180` | Fictional by convention (`Northfield Engineering`, `Halcyon Press`) — `FOUNDATION` §7.2. **Delete rather than edit**; §"Replacing seed content" |
| D4 | Seeded metrics | every seeded `project` | `[SEED] 00%` / `[SEED] 00 days` — zeroed digits, never a plausible number |
| D5 | Seeded team members | `seed-content.mjs:307` | `[SEED] Placeholder Name`; `isPublic` decides whether anyone appears at all |
| D6 | **The production dataset is empty** | `NEXT_PUBLIC_SANITY_DATASET` | Everything above lives in `development`. `production` holds nothing, including **no `companyDetails` singleton** — so the statutory footer has no source until it is seeded there. `check:launch` refuses a `production` dataset whose contact email is empty or whose fields carry `[SEED]` |

**Testimonials are the exception and must not be swept with the rest.**
`seed-content.mjs:262` — six real, verbatim, attributed, traceable Freelancer reviews. Never
reworded, never `[SEED]`. Do not delete them with the seed.

---

## Group E — Placeholder imagery

**Every visual surface in the tree is already filled, and none of them uses a photograph.**

| # | Surface | What renders | Source and licence |
|---|---|---|---|
| E1 | Project and post cards (`3:2`), case-study lead media (`16:9`), portraits (`1:1`), book covers (`2:3`) | `components/content/Placeholder.tsx` — a bordered box with a CSS `repeating-linear-gradient` hatch, drawn from tokens | **Generated block. Written in this repository, no third-party licence involved.** There is no file, no `<img>`, no Sanity asset and no network request |
| E2 | Call sites | `about/page.tsx:137` (portrait), `work/[slug]/page.tsx:104` (wide), `ProjectGrid.tsx:57` (card) | as above |
| E3 | `public/` | **one file, `500.html`** — no images at all | n/a |

### Why no Unsplash or Pexels photograph was added, stated plainly because it is a deviation

The brief allows *"Unsplash, Pexels, or generated blocks"*. **Generated blocks were taken, and
the other two are ruled out by rules already written in this repository** — so adding one would
have required striking a rule rather than filling a surface:

1. `CLAUDE.md` *The feel*: **"stock photography ... read as templated in 2026 and are
   prohibited."**
2. `00-FOUNDATION.md` §"Seed content" item 7: *"Images are abstract or clearly generic. No
   fabricated engineering drawings, no fabricated book covers, no fabricated screenshots. **Use
   neutral geometric placeholders at correct aspect ratios.***"
3. Performance. `Placeholder`'s own docstring records the measurement: 24 photographic cards is
   24 requests and a contended LCP on the route with the tightest budget in the programme, and
   `Q-M16` already has an empty page at 1520ms against Digital's 1600ms. There is no headroom.
4. Deletion. Seed records are deleted rather than edited; an uploaded placeholder asset would
   outlive the record referencing it.

**Surfaces with no imagery at all, and why — none of them is an empty surface waiting for a
picture:**

- **`Media` (`components/primitives/Media.tsx`)** — the one primitive no gate has ever
  evaluated. Deliberately excluded from `/_kitchen-sink` because rendering it needs *real*
  imagery, and fabricating some would be non-negotiable #2. It is exercised at `D-01` against
  real assets. `00-FOUNDATION.md` records this and it is unchanged.
- **Press book covers** — the `2:3` ratio exists in `Placeholder` and has no call site, because
  `/press/books` (`R-02`) is not built. An unbuilt route is not an empty surface.
- **The Press sample assessment report** — `K-10`, blocked. `TECH-SPEC.md` §9 requires a
  *redacted real document*; there has been no assessment, so there is nothing to redact.

**If you want photography, that is a decision to strike rule 1 and 2 above** — it is a
positioning change, not a content gap, and `check:struck` is where a struck rule gets
registered.

---

## Group F — Taken or adapted from the live `gridsmith.uk`

Full record and verbatim source: `docs/_shared/LIVE-SITE-EXTRACT.md`.

| # | Item | Where in the build | Status |
|---|---|---|---|
| F1 | **The six process stage names and descriptions** | `docs/_shared/00-PROCESS.md`, and every route that renders the canonical process | Already in the build, near-verbatim from the live `HOW IT WORKS`. **The provenance was recorded nowhere until now.** Confirm you want them; also note stage 6 names *"SEO improvements"* inside a description that claims to be division-neutral |
| F2 | **The registered address and phone** | `seed-company-details.mjs` — see A1, A4 | Adapted, with four differences from the live string |
| F3 | **Everything else on the live site** | **nothing** | The services list, the FAQs, the About copy, the Service Integrity list and the pricing language are **recorded in `LIVE-SITE-EXTRACT.md` and not adopted**. If any of it should carry over, that is a decision, and it lands here first |

---

## Group G — Statements the site makes about the business that you did not supply

These are sentences in shipped copy that assert something about Gridsmith. Each was written to
fill a slot. **None is a metric, a credential, a price or a clause** — those are gated — but each
is still a claim.

| # | Claim | Where |
|---|---|---|
| G1 | *"Your book, published properly, and still yours."* and the Press positioning copy | `app/(press)/press/page.tsx` `COPY` |
| G2 | *"We are not your publisher. We are the people who make the book, and the rights stay where they started."* | same. It **is** consistent with `CONSUMER-TERMS` clause 10.1, which the page links to — but it is a marketing sentence, not the clause |
| G3 | *"Every price here is a starting point, not a quotation"* | same. Depends on B1/B2 being true when real prices land |
| G4 | *"We take manuscripts as a link, never as an upload — nothing of yours ends up sitting on our servers."* | `app/(press)/press/contact/page.tsx`. **This one is an operational commitment**, and the flow is built to honour it — confirm you will keep it |
| G5 | The Path Finder's six outcome explanations and both guidance texts | `lib/path/seedConfig.ts` — also C3, listed here because they read as the company's voice rather than as data |

---

## Group H — Environment and infrastructure

All from `.env.example`. **Unset today; each must be decided before production.**

| # | Variable | State | Note |
|---|---|---|---|
| H1 | `NEXT_PUBLIC_SANITY_DATASET` | `development` | Set to `production` at Stage 8 **and not before**. Required, no default — an unset value is a build error by design (`M-P1-2`) |
| H2 | `SANITY_API_WRITE_TOKEN` | unset | `npm run seed:company` only. Lives in `.env.local`, gitignored |
| H3 | `PROJECT_URL` | unset | Supabase, server-only |
| H4 | `PUBLISHABLE_KEY` | unset | Supabase, server-only |
| H5 | `DIRECT_CONNECTION_STRING` | unset | **Carries the database password.** Never `NEXT_PUBLIC_`, never in a client component; `lint:secrets` asserts it |
| H6 | `RESEND_API_KEY`, `LEAD_NOTIFICATION_FROM`, `LEAD_NOTIFICATION_EMAIL` | unset | Unset is a **skip**; set-but-broken is a **failure**. Dev sends from Resend's shared sender and only to the account owner — **a green dev run proves the pipeline, not deliverability** |
| H7 | `SLACK_LEADS_WEBHOOK` | unset | Optional |
| H8 | `SUPABASE_SERVICE_ROLE_KEY` | **stated by the owner to be in the Vercel environment; not measured here** | `K-10`'s write path depends on it. `CLAUDE.md`'s remote-subject rule applies: a gate reading the runner's `process.env` is guessing about the server. Ask the deployment, do not infer |

**Resend's SPF include must be MERGED into `gridsmith.uk`'s existing record.** A domain may have
one SPF record; a second is a permerror (RFC 7208 §4.5) and silently breaks the live site's mail.
This one is easy to get wrong once and hard to notice.

---

## Group I — Legal, tracked elsewhere and repeated here only as pointers

| # | Item | Where it lives |
|---|---|---|
| I1 | All seven `_legal/` instruments are **drafts pending solicitor review** | `L-04`, `BEFORE-LAUNCH.md` |
| I2 | `K-17` — the consumer cancellation notice | `press/PROJECT-TRACKER.md`. **Open, and this session did not resolve it.** `LIVE-SITE-EXTRACT.md` §11.4 compares the live refund summary to both instruments and stops there |
| I3 | `F-11` — `CONSUMER-TERMS` §5's headline is more generous than the §5.3 it defers to | `check:legal:parity` is green and correct to be green; the ceiling is in its docstring |
| I4 | The live site elects **the law of Pakistan** (T&Cs §13) while both build instruments elect England & Wales | `LIVE-SITE-EXTRACT.md` §11.4. Largest single divergence found; sits underneath every other live clause |

---

## The one thing that is not a row

**The positioning change.** The live site describes a digital agency; the build describes one
company trading as three divisions including a publishing arm that does not exist publicly
today. That is not a checklist item to tick — it is the decision the checklist sits inside, and
it is yours. `LIVE-SITE-EXTRACT.md` §11.1.
