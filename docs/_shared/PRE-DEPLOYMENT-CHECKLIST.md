# Pre-deployment checklist — everything assumed, drafted, inferred or taken from elsewhere

**Written:** 7 September 2026. **Owner of every row below: Atik.**

> **GS-P00 reconciliation — 11 September 2026.** This is now a historical/provisional-content
> inventory, not the active owner-action register. `OWNER-ACTIONS.md` is authoritative. Under
> `GS-D002`, Group B does not create a requirement to supply or publish prices; B1-B4 are retained
> to locate implementation assumptions that a later phase must remove or rescope. Under `GS-D001`,
> D3/D4 and the portfolio/book-cover parts of Group E are not replacement-content requests; public
> portfolio evidence is deferred unless explicit permission is obtained. The Path Finder rows remain
> relevant to recommendation/scoping and honesty, independently of public price publication.
>
> **GS-P03 — 14 September 2026.** B1 and B2 are **removed from the build** (no price field, no price
> renderer, no `/digital/estimate`). The `/work` routes and every portfolio block are gone, so E2's
> `work/[slug]` and `ProjectGrid` call sites no longer exist, and G3's price sentence is replaced. The
> development dataset still holds the old seed services and projects (`GS-T007`).

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
| **A — Company facts only you can supply** | 8 | Addresses, numbers, mailboxes, insurance, public team. **6 of 8 closed at `GS-O004`** |
| **B — Prices and commercial terms** | 4 | Every price on the site is a placeholder |
| **C — The Q-P13 Path Finder rules** | 6 | Drafted 7 Sept 2026, all `[SEED]`, and now applied by the island |
| **D — Seed content in the CMS** | 6 | `isSeed: true` records and the marked strings |
| **E — Placeholder imagery** | 3 | What is drawn, and the surfaces left empty |
| **F — Taken or adapted from the live gridsmith.uk** | 3 | Provenance that was not recorded before |
| **G — Statements about the business no one confirmed** | 5 | Sentences asserting a fact about Gridsmith |
| **H — Environment and infrastructure** | 8 | Variables unset for production |
| **I — Legal, already tracked elsewhere** | 3 | Pointers, not new work |
| **Total** | **46** | |

**One row was removed on 7 September 2026: `I4`, the live site's Pakistan governing law.** The
owner's decision is that the live `gridsmith.uk` is authoritative for the **services** and the
**work process** and nothing else; its email addresses, refund policy, terms and governing law
are legacy and `docs/_legal/` is the only source. Those differences are therefore not
contradictions to resolve and do not belong on this register. `LIVE-SITE-EXTRACT.md` records
them as superseded. **`A3` is unaffected and survives on its own footing** — it is a mailbox
`CONSUMER-TERMS.md` §6.1 requires, not a divergence from the old site.

---

## Group A — Company facts only you can supply

> **`GS-O004` closed this group's first five rows on 16 September 2026 (`GS-R001`).** The owner
> supplied the facts and two of them were corroborated against the public Companies House
> register, which is what A1 and A2 had been asking for since 7 September. The rows are kept and
> annotated rather than deleted, because the question each one asked is the reason the answer is
> trustworthy. **A6 and A7 remain open**, and A7 is now its own owner action (`GS-O016`) so that
> closing `GS-O004` could not absorb it.

| # | Item | Where | What is there now | State |
|---|---|---|---|---|
| A1 | **Registered office string** | `scripts/seed-company-details.mjs` | `30 Briarfield Road, Farnworth, Bolton, BL4 0HD` | ✅ **CONFIRMED 16 Sep 2026** against the public register, read read-only: `30 Briarfield Road, Farnworth, Bolton, England, BL4 0HD`. Same premises and the **digit zero** — so the live site's `BL4 **O**HD` is the malformed one, as §11.3 suspected. The register's extra `England` component is not added here: the footer states the part of the UK separately, and the three `_legal/` instruments carry this exact string. **`GS-O004` additionally withdrew it from the marketing site** — it now renders only in the statutory footer (SI 2015/17 reg. 25(2)(c)) and in `_legal/`, enforced by `check:company` question 4 |
| A2 | **Company number** | `scripts/seed-company-details.mjs` | `17050842` | ✅ **CONFIRMED 16 Sep 2026** by the owner and by the register: `GRIDSMITH LTD`, **active**, incorporated 24 February 2026. The row was right that the live site cannot corroborate it — the live site publishes no company number at all — so the register was read instead |
| A3 | **Contact email** | `seed-company-details.mjs`, `CONSUMER-TERMS.md` §6.1/§18 | `contact@gridsmith.uk` | ✅ **CONFIRMED 16 Sep 2026.** The owner states the mailbox is **working and authorised for publication**. No gate can re-verify deliverability and none claims to; `check:company` question 2 asserts only that it is the single published address and that every `mailto:` points at it — which is the defect the live site has today (§11.2) |
| A4 | **Contact phone** | `seed-company-details.mjs` | `+44 7405 448534` | ✅ **SUPPLIED AND PUBLISHED 16 Sep 2026.** The same number the live site publishes, so the two artefacts corroborate. Displayed with separators, linked as `tel:+447405448534` — derived by `telHref` from the displayed string, so the read number and the dialled number cannot diverge. **No opening hours beside it**: the `businessHours` field is removed from the schema, not merely left empty |
| A5 | **Response commitment** | `seed-company-details.mjs` | *"We typically respond within 48 hours."* | ✅ **REPLACED 16 Sep 2026.** It was *"…and always by the end of the next business day"*, and `GS-O004` withdraws any guaranteed response time or SLA — *"always"* is an unqualified undertaking. The new value is **slower than non-negotiable #5's ceiling and is not a promise**, so the rule holds twice over. `check:company` question 5 refuses guarantee wording, SLA wording, "ASAP" and clock hours on the served pages |
| A6 | **PI insurer and cover limit** | `companyDetails.piInsurer`, `piCoverLimit` | unset | ⬜ **OPEN — `GS-O005`.** Nothing renders them, so the site makes no insurance claim |
| A7 | **ICO registration** | `companyDetails.icoRegistration` | unset | ⬜ **OPEN — now `GS-O016`.** Lifted into its own owner action so that closing `GS-O004` did not silently close it. Nothing renders it, so the site makes no claim either way |
| A8 | **Public team members** | ~~`companyDetails`~~ — it was never a company-details field | none | ✅ **ANSWERED 16 Sep 2026 — there are none.** New row, because this group had no entry for it and it turned out to be the group's only *live* defect: four `teamMember` records named `[SEED] Placeholder Name` carried `isPublic: true` in the development dataset, and the served `/about` published all four under *"Who you will work with"*. `Q-M9` is closed: the owner represents the company institutionally. The roster, `listPublicTeam` and the `TeamMember` type are deleted and the seed now writes `isPublic: false` |

**Not on this list, deliberately:** `vatNumber`. Its absence is a recorded compliance decision,
not a gap — `sanity/schemas/companyDetails.ts` and `check:vat:display` both enforce it.

---

## Group B — Public-price assumptions — **SUPERSEDED by `GS-D002`**

| # | Item | Where | What is there now |
|---|---|---|---|
| B1 | **Every price on the site** | ~~`scripts/seed-content.mjs:90`, `pricingBlock.fromAmount`~~ | **REMOVED at `GS-P03`.** `pricingBlock`, `Price.tsx` and the seed pricing helper are deleted; `check:schemas` refuses any price field |
| B2 | **Every "from" price on every service page** | ~~the seeded `service` records~~ | **REMOVED at `GS-P03`.** Service pages lead to a contextual enquiry; the development dataset's stored prices are never projected |
| B3 | **Press budget bands** | `lib/path/seedConfig.ts` question 3 | **REVIEW FOR SCOPING ONLY.** A budget question may help route an enquiry, but must not imply published package prices and still requires owner validation |
| B4 | **The Press contact flow's budget bands** | `PressContactFlow.tsx` | **RETAIN AS NON-PRICE SHAPE-OF-ENGAGEMENT INPUT** unless a later owner decision changes it |

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
| C5 | **The island now gives a visitor a recommendation off these rules** | `components/divisions/press/PathFinder.tsx` (`K-06`/`K-07`, 7 Sept 2026). The result panel carries its own **"This recommendation is a placeholder"** line, so nobody is told they qualify or do not qualify on rules you have not seen | Replacing the rules is the same decision as C1; this row exists because until 7 Sept the seed rules were only *described* on the page and are now *applied* to a real visitor's answers |
| C6 | **Nothing is logged.** `APP-FLOW.md` §5 says every outcome logs to `press_path_results` and `K-08` built the table; the write path is **not built** | The table has zero policies and `app/api/rls-drift/route.ts` asserts live that `anon` can neither read nor write it | **A decision, not a gap.** An `anon` insert policy would break that standing live assertion and let any browser forge rows in the table non-negotiable #9 is audited from; a service-role route is a new credential in the request path — the same choice you already took separately for `K-10`. Until it is taken, *"if E and F never fire in production, the tool is broken"* has no measurement behind it |

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
| D5 | Seeded team members | `seed-content.mjs` | `[SEED] Placeholder Name` × 4. **`isPublic` did NOT decide whether anyone appears — it said `true` and four placeholder people were served on `/about`.** Corrected at `GS-R001` on both sides: the renderer and the query are deleted, and the seed writes `isPublic: false`. The four records remain in the development dataset and are now read by nothing. See A8 and `GS-O004` |
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
| E2 | Call sites | `about/page.tsx:137` (portrait). ~~`work/[slug]/page.tsx:104` (wide), `ProjectGrid.tsx:57` (card)~~ — deleted at `GS-P03` with the portfolio routes | as above |
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
| F2 | **The registered address and phone** | `seed-company-details.mjs` — see A1, A4 | ✅ **Both confirmed at `GS-O004`.** The address matches the register (which the live site's does not — its postcode carries a letter O), and the phone is the owner's supplied number and the live site's, agreeing. The four differences §11.3 lists are punctuation and a country component; none is substantive and the substantive one ran the other way |
| F3 | **Everything else on the live site** | **nothing** | The services list, the FAQs, the About copy, the Service Integrity list and the pricing language are **recorded in `LIVE-SITE-EXTRACT.md` and not adopted**. If any of it should carry over, that is a decision, and it lands here first. **The live legal copy is excluded entirely** — refund policy, terms, emails, consent banner and governing law are superseded by `docs/_legal/` and can never become a row here |

---

## Group G — Statements the site makes about the business that you did not supply

These are sentences in shipped copy that assert something about Gridsmith. Each was written to
fill a slot. **None is a metric, a credential, a price or a clause** — those are gated — but each
is still a claim.

| # | Claim | Where |
|---|---|---|
| G1 | *"Your book, published properly, and still yours."* and the Press positioning copy | `app/(press)/press/page.tsx` `COPY` |
| G2 | *"We are not your publisher. We are the people who make the book, and the rights stay where they started."* | same. It **is** consistent with `CONSUMER-TERMS` clause 10.1, which the page links to — but it is a marketing sentence, not the clause |
| G3 | ~~*"Every price here is a starting point, not a quotation"*~~ → *"Every engagement is scoped and quoted for the work in front of us, so no prices are published here."* | all three division landings (`GS-P03`). A statement of the `GS-D002` policy; confirm the wording under `GS-O006` |
| G4 | *"We take manuscripts as a link, never as an upload — nothing of yours ends up sitting on our servers."* | `app/(press)/press/contact/page.tsx`. **This one is an operational commitment**, and the flow is built to honour it — confirm you will keep it |
| G5 | The Path Finder's six outcome explanations and both guidance texts | `lib/path/seedConfig.ts` — also C3, listed here because they read as the company's voice rather than as data. Since `K-07` they are also spoken **to one visitor about their own book**, which is a different register from a row in a table |

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
| I2 | `K-17` — the consumer cancellation notice | `press/PROJECT-TRACKER.md`. **Open.** It is a decision about the *build's* notice under `CONSUMER-TERMS.md`; the live site's refund copy is superseded and bears on it not at all |
| I3 | `F-11` — `CONSUMER-TERMS` §5's headline is more generous than the §5.3 it defers to | `check:legal:parity` is green and correct to be green; the ceiling is in its docstring |

---

## The one thing that is not a row

**The positioning change.** The live site describes a digital agency; the build describes one
company trading as three divisions including a publishing arm that does not exist publicly
today. That is not a checklist item to tick — it is the decision the checklist sits inside, and
it is yours. `LIVE-SITE-EXTRACT.md` §11.1.
