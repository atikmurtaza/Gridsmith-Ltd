# Before launch — everything Atik must change

**Written:** 21 August 2026 · **Branch:** `feat/a-01-a-10a-scaffold-ci`

This is the only homework list. Everything on it is a thing **only you can do** — a decision, a
credential, a registration, or a fact nobody else holds. Anything a developer could do is not on
this list; it is a tracker row.

It is in the order to do it in, not in order of importance. Several items have long lead times
and gate other items, so they are first even where they are cheap.

**Nothing on this site is live and nothing can go live by accident.** Two mechanisms stand in
the way and both are tested: `NEXT_PUBLIC_SANITY_DATASET` has no default, so a deploy with it
unset fails at build rather than serving placeholders; and `check:launch` refuses a `production`
dataset that carries a `[SEED]` marker or a published seed document. There are 119 published
seed documents in `development` today.

---

## ↻ Refreshed 21 August 2026, against `main`

**The list below was written on the branch, before CI had ever run on the default branch and
before the first production-target deploy existed.** Both have now happened and moved several
items. Read this block first; the numbered items keep their original numbering.

### Closed since it was written

| | What changed |
|---|---|
| **`Q-M18`** — a Supabase project | **Done.** `A-07` and `A-08` closed 19 Aug against the live database. The project's URL and publishable key are now GitHub repository **Variables** (`PROJECT_URL`, `PUBLISHABLE_KEY`) and reach CI. |
| **`Q-M19`** — GA4 and PostHog | **Done for development.** `A-09` closed 19 Aug. **The live ids are still outstanding** — see new item **22**. |
| **Item 21** — the 500 page | **Decided.** Recorded as `ACCEPTED` by you on 21 Aug; the accessibility statement discloses the gap. Not backlog, do not reopen it as one. |
| **Item 12** — Node 24 on the host | **Satisfied on Vercel.** Every build has run Node 24 and `check:node` passes via `preinstall`. Still open if the host changes — see item 11. |
| **CI itself** | Now runs on the default branch and `workflow_dispatch` is registered, closing the durability half of `M-P1-5`. This was the last thing standing between "the gates exist" and "the gates run". |

**The tracker's "What is blocked, and on whom" table is stale on both `Q-M18` and `Q-M19`** —
it still lists them as blockers while the rows they block are marked DONE. Believe the rows.

### Changed, not closed

| | What changed |
|---|---|
| **Item 13** — `NEXT_PUBLIC_SANITY_DATASET` | **Set, and set too early.** Vercel's Production environment has it at `production`, and the production dataset is empty, so the first production deploy failed at build with *"No companyDetails document in dataset `production`"*. That is `check:launch`'s guard working correctly on the first occasion it could. This item's own warning is the fix: *"Do not set it to `production` until the production dataset actually has content in it."* **Either finish item 16 or set it back to `development`.** Do not point Production at `development` and then launch. |
| **Item 11** — decide the host | **The facts moved underneath the decision.** The tracker records **Hostinger Business**, but every deployment in the programme is on **Vercel**, and Vercel is what built, failed and serves today. The privacy policy has to name the *actual* processor and region, so this is now a contradiction to settle rather than a preference to state. |
| **"All 21 gates are green"** in *What is already done* | **No longer true as written, and it never had been tested on `main`.** 21 gates is right. Today `/digital` exceeds its 1600ms mobile LCP ceiling in 2 runs of 4 — a real result against a measurement that can now be trusted, not flakiness. See `M-P1-10`; the decision is yours and nothing has been adjusted. |

### New — on no list before, and both block production

### 22. Set the live GA4 and PostHog ids in the platform environment

- **Status:** Blocks production
- **Where:** the hosting control panel
- **Your time:** 5 minutes, once the properties exist
- **Tracker:** `A-09`, `Q-M19`

`Q-M19` was resolved for **development**. CI runs against deliberate placeholders
(`G-CIPLACEHOLDER`, `phc_ci_placeholder_not_a_real_project_key`) and the row says in terms:
*"Live ids go in the platform environment at launch."* Nothing injects without them, and a
placeholder in production would send real visitor data to a property nobody owns. PostHog must
stay on the **EU** host.

### 23. Set `CRON_SECRET` and `SUPABASE_SERVICE_ROLE_KEY` in Vercel

- **Status:** Blocks a gate, not the build
- **Where:** the Vercel project's environment variables
- **Your time:** 2 minutes
- **Tracker:** `M-P1-3`

Both are unset, so **the RLS drift cron does not run**. That check exists because `A-07`'s leak
was visible only from outside, over HTTP, holding a public key — a migration read correctly
while the running system was wrong, so no source check can see the class it covers. Until
these are set, nothing is watching for that drift.

`SUPABASE_SERVICE_ROLE_KEY` goes **only** here, never in CI: `check-service-role-key` sweeps
the bundle *and* the served static assets to prove it never reaches a browser.

---

## How to read the status column

| | |
|---|---|
| **Blocks production** | The build or a gate fails, or the site would be unlawful. Not optional. |
| **Blocks a page** | A page renders an empty state or placeholder text until you do this. |
| **Improves** | The site works without it. |

---

## Start these now — they have lead times measured in weeks

### 1. Send the five legal documents to a solicitor

- **Status:** Blocks production
- **Where:** `docs/_shared/` → the live drafts are in Sanity Studio under **Legal document**, and
  the source they were generated from is `scripts/seed-legal.mjs`
- **Your time:** ~2 hours to read them and answer the `[DECISION]` markers, then hand over
- **Elapsed:** 2–6 weeks with a solicitor
- **Tracker:** `L-04`, `Q-M2`

Five documents exist and are drafted from **this build's actual facts** — the real processors,
the real cookie, the real consent categories, the real form fields. They are:
`/legal/privacy`, `/legal/cookies`, `/legal/terms`, `/legal/client-terms`,
`/legal/accessibility`.

Every clause names the instrument behind it, so the solicitor's job is a check rather than a
rewrite. **Every clause marked `[DECISION]` is yours, not theirs** — retention periods, the
liability cap, the point at which copyright transfers, payment terms, the pause-and-close
window. Each carries a working default so the page renders; none is a recommendation. Read
those first and decide them before the solicitor bills you to ask.

Until `solicitorApproved` is ticked in the Studio, every legal page renders a **DRAFT** banner
as the first thing on it and is `noindex`. That is deliberate and correct now, and unacceptable
at launch.

**The three worth deciding carefully:**

- **Clause 7.1, the liability cap.** The default is fees paid in the preceding 12 months. That
  is the common default and it is not obviously right for engineering drawings, where a
  deliverable can carry downstream manufacturing cost far exceeding the fee.
- **Clause 4.1, when copyright transfers.** The default is on final payment. Assignment on
  delivery is available and should be priced differently.
- **Clause 5.1, Press rights.** Already written the way you have described the offer — the
  author keeps copyright and gets their **own** ISBN. `/press` states this above the fold and
  links to the clause. If the clause changes, that page changes with it.

### 2. VAT registration

- **Status:** Blocks production
- **Where:** HMRC, then Sanity Studio → **Company details** → `vatNumber`
- **Your time:** 20 minutes to apply, 1 minute to paste the number in
- **Elapsed:** HMRC's timescale
- **Tracker:** `M-05`, and the tracker's "LAUNCH DEPENDENCY" box

The footer currently shows `[SEED] GB123456789`. It is deliberately not a real number and it is
deliberately the right shape, so the rendering path is exercised now rather than first seen on
launch day.

`check:launch` fails any production build where `vatNumber` is empty or carries a `[SEED]`
marker. The basis is reg. 6(1)(g) of the Electronic Commerce (EC Directive) Regulations 2002 —
**not** the Companies Act, which is why it is a separate obligation from the company number.

Replacing it is a content edit in the Studio. No deploy, no code change.

### 3. ICO registration

- **Status:** Blocks production
- **Where:** ico.org.uk, then clause 1.2 of the privacy policy
- **Your time:** 15 minutes
- **Elapsed:** a few days
- **Tracker:** `L-06`, `Q-M3`

You process personal data by automated means (the enquiry form), so the charge under the Data
Protection (Charges and Information) Regulations 2018 applies and no exemption is being relied
on. The privacy policy says the registration is pending and publishes the number once issued.

### 4. Professional indemnity insurance — check the scope, not just the cover

- **Status:** Blocks production
- **Where:** your broker
- **Your time:** one conversation
- **Elapsed:** days to weeks
- **Tracker:** `L-08`, `Q-M4`

**The specific thing to ask:** does the policy cover **engineering drawings and CAD work**? A
general "media and technology" policy commonly excludes them, and that exclusion would sit
directly across the highest-risk deliverable the company produces. Client Terms clause 8.1 is
written as an open item for exactly this reason and cannot be finalised until you have the
answer.

---

## Decisions that unblock pages

### 5. A real cross-division continuity example

- **Status:** Blocks a page — `/approach` renders an empty state where this belongs
- **Where:** Sanity Studio → **Continuity example**
- **Your time:** 30 minutes
- **Tracker:** `N-05`, `Q-M6`

**This one cannot be seeded and the schema will not let it be.** `verified` is hard-true: a
placeholder would have to assert that someone confirmed a story that did not happen, and the
spec calls an invented continuity example "the most damaging possible piece of content on the
site". So the block renders empty until you supply a real one.

What is needed: a client served across two or more divisions or over time, at least four rows
of what happened when, and the length of the relationship. Verifiable against your own project
records.

It matters more than its size suggests. `/approach` is where a buyer whose need spans two
divisions ends up, and the tracker calls this block *the decisive content* on that page.

### 6. The honest-limits section — when to use a specialist instead

- **Status:** Blocks a page — `/approach` shows placeholder text
- **Where:** Sanity Studio → **Group page** → `approach` → the section keyed `limits`
- **Your time:** 45 minutes of honest thinking
- **Tracker:** `N-04`, `Q-M7`

When should someone *not* use Gridsmith? Which jobs need a specialist agency, a chartered
engineer, a literary agent? The section is deliberately undesigned — plain prose on a sunken
background, no icons — and the layout value is locked in the schema so a later content edit
cannot prettify it. It looks unpolished because polishing it would sell the limits.

This is a credibility move, not a disclaimer. Write it as though talking someone out of a job
you would rather not take.

### 7. Who appears publicly

- **Status:** Blocks a page — `/about` lists four `[SEED] Placeholder Name` entries
- **Where:** Sanity Studio → **Team member**
- **Your time:** 30 minutes
- **Tracker:** `N-07`, `Q-M9`

`isPublic` defaults to **false** on purpose: a person appearing on a public website is a
decision someone makes, not the absence of one. The seeded entries are named
`[SEED] Placeholder Name` rather than something plausible, because a plausible invented name on
a public site is a fabricated credential.

Delete the seed records and add real ones. **Do not edit a seed record into a real one** —
that risks carrying `isSeed: true` into production and leaving fragments of placeholder copy in
a real biography.

### 8. Business hours and a phone number

- **Status:** Improves — the confirmation screen and `/contact` omit the lines while empty
- **Where:** Sanity Studio → **Company details** → `businessHours`, `contactPhone`
- **Your time:** 2 minutes
- **Tracker:** `N-12`, `Q-M5`

Note the constraint on what you write: **nothing on this site may promise a response faster than
the end of the next business day.** There is one source of truth for that sentence
(`responseCommitment`) and every page reads it, so changing it changes everywhere at once —
which is exactly why it must not be shortened casually.

### 9. Real prices

- **Status:** Blocks production
- **Where:** Sanity Studio → **Service** → `pricingModel` on each of the 30 services
- **Your time:** ~3 hours, and mostly thinking rather than typing
- **Tracker:** `S-03`

Every service currently shows `£0,000` with an `INDICATIVE` badge. The zeroes are the
convention for a figure that asserts nothing, and the schema will not let a service be published
without a pricing block at all — CLAUDE.md non-negotiable #3, enforced structurally.

Two things to keep when you replace them:

- **The `INDICATIVE` badge stays**, including on real prices. Every price on this site is a
  starting point until a scope is agreed — the Terms of Use say so — and a badge that appeared
  only on placeholders would teach readers that an unbadged price is a quotation.
- **`variables` needs at least two entries** and the schema enforces it. A price with no stated
  variables is a quote pretending to be a price.

**VAT:** once registered, prices to businesses are quoted excluding VAT and prices to consumers
including it, and each quotation must say which. Client Terms clause 3.1 carries this and is
flagged to be revisited on the day the number is issued.

### 10. Budget bands on the enquiry form

- **Status:** Improves
- **Where:** `components/leads/ContactForm.tsx`, the `BUDGETS` constant
- **Your time:** 5 minutes, once item 9 is done
- **Depends on:** item 9

The form currently asks about the *shape* of the engagement — "a small, well-defined piece of
work", "a full project", "an ongoing programme" — rather than money. That was deliberate: money
bands would have been the first hard numbers on the site, and a reader would reasonably have
read them as what you charge. Once real prices exist, money bands qualify a lead better. Swap
them then, not before.

---

## Deployment — do these on the day, in this order

### 11. Decide the host, and say so in the privacy policy

- **Status:** Blocks production
- **Where:** clause 4.1 of the privacy policy
- **Your time:** the decision you have already half made
- **Tracker:** the tracker's Hosting section

Two providers appear in this repository's configuration — Vercel and Hostinger — and the tracker
records **Hostinger Business** as the decision. The privacy policy has to name the actual
processor and its region, so this has to be settled before it is published. It is flagged
`[DECISION]` in the draft.

### 12. Set Node to 24 on the host

- **Status:** Blocks production — **every deploy fails at install otherwise**
- **Where:** the hosting control panel
- **Your time:** 2 minutes

`check:node` runs via `preinstall`, so a host on any other major version fails before the build
starts. This is the first thing to get wrong and the easiest to fix.

### 13. Set `NEXT_PUBLIC_SANITY_DATASET` in the platform environment

- **Status:** Blocks production
- **Where:** the hosting control panel
- **Your time:** 2 minutes

There is **no default**, deliberately. An unset variable is a build error rather than a silent
fallback — because the fallback used to be `development`, and a deploy with it unset would have
published `[SEED] GB123456789` as the company's VAT registration number on every page.

Set it to `development` for staging and `production` for live. Do not set it to `production`
until the production dataset actually has content in it.

### 14. Merge the Resend SPF record — do not add a second one

- **Status:** Blocks production email
- **Where:** `gridsmith.uk` DNS
- **Your time:** 10 minutes
- **Tracker:** `Q-M20`

`gridsmith.uk` **already has an SPF record** serving the existing site's mail. Resend's
`include:` must be **merged into it**. A second SPF record is a `permerror` under RFC 7208 §4.5
and silently breaks all your existing mail — not just the new notifications.

Also change the sender from Resend's shared `onboarding@resend.dev` to
`notifications@gridsmith.uk` once the domain is verified. Until then, a "sent" result proves the
pipeline works and proves nothing about deliverability: the shared sender only delivers to the
Resend account owner.

### 15. Authorise the Sanity Studio CORS origin

- **Status:** Blocks the Studio, not the site
- **Where:** an interactive `npx sanity login` then the command in `SETUP.md`
- **Your time:** 5 minutes

Needs a browser login, which is why it has never been done from a session.

### 16. Populate the production dataset, and never by copying `development`

- **Status:** Blocks production
- **Your time:** this is item 5–9's output
- **Tracker:** `FOUNDATION` §"Replacing seed content"

**Seed records are deleted, not edited into real ones.** Editing one risks carrying
`isSeed: true` into production or leaving placeholder fragments inside a real case study. The
seed script and the import path are deliberately separate.

`check:launch` will refuse a production build that contains a published seed document, so this
is enforced rather than remembered. Today's count in `development` is 119.

---

## Things that need a person, not a decision

### 17. A screen-reader pass

- **Status:** Blocks production
- **Who:** a human with NVDA or VoiceOver
- **Time:** ~2 hours
- **Tracker:** `M-02` stays un-DONE until this happens

**This has never been done and no automated check can do it.** The gates cover focus order,
target size, paint, landmarks, roles, contrast and duplicate IDs; they do not cover
*announcement* — whether what a screen reader says makes sense.

Cover: the header and division switcher, the footer's statutory block, the consent banner, the
enquiry form's error states, and one legal page's clause anchors.

### 18. A favicon, or a decision not to have one

- **Status:** Improves — Lighthouse best-practices is capped at 0.96 without it
- **Your time:** whatever a brand mark takes
- **Tracker:** `Q-M15`

`/favicon.ico` 404s on every route. A brand mark is a brand decision and is not being invented.
Either supply one, or confirm that shipping without it is acceptable and the assertion stays at
0.96 permanently.

### 19. Real images

- **Status:** Improves
- **Where:** Sanity Studio, once real work exists
- **Tracker:** `S-04`, `G-07`

Every image slot currently renders a CSS-drawn geometric placeholder at the correct aspect
ratio. There is no image file anywhere on the site — no request, no LCP image, nothing to
delete when real work arrives.

**Do not fill these with stock photography or with renders of work that was not done.** The
prohibition on fabricated drawings, book covers and software screenshots is absolute. An empty
placeholder is honest; an invented portfolio is not, and it is the failure that would be
hardest to walk back.

When real images do arrive they will move the LCP measurement, which currently has about 80ms
of headroom on Digital. Expect that conversation.

### 20. The existing Press site's URL inventory

- **Status:** Blocks a launch-day SEO outcome, not the build
- **Your time:** an export or a crawl of the existing site
- **Tracker:** `G-08`, `Q-M8`

The existing Press site is live and trading and **comes down at launch**. Every indexed URL
404s on day one unless it is mapped. `redirects/legacy.json` is committed empty and already
wired in, so this is populating a file the mechanism reads — data, not architecture. Unmappable
URLs go to the nearest Press hub, never to `/` and never to a 404.

Supply the inventory before the site is switched off, not after.

### 21. Decide what to do about the 500 page

- **Status:** A known WCAG Level A gap, currently an accepted risk
- **Your decision**
- **Tracker:** `M-P1-1`

When the server fails to render a page — an uncaught error, not a normal 404 — the framework
serves a minimal document with **no `lang` attribute**, which fails WCAG 3.1.1 at Level A. It
affects only server-side crashes.

**No application-level fix exists** and this has been tested rather than assumed: a static
`public/500.html` was deployed and two failures were induced on a preview; neither served it.
The remaining routes are an edge layer that can rewrite a 5xx response body, or a recorded
acceptance. The accessibility statement discloses the gap either way, which is the honest
position while it stands.

---

## What is already done, so you do not go looking for it

- The site is complete and every route works: homepage (all nine blocks), `/work` and 24 case
  studies, `/about`, `/approach`, `/insights` and nine articles, `/contact` with a working
  enquiry pipeline, five legal pages, and real landing pages for all three divisions.
- **The six testimonials are real.** They are your public Freelancer reviews, reproduced word
  for word, each linking back to the profile so a reader can check them. They are the one piece
  of content on the site that is not placeholder, and they are marked `isSeed: false`
  accordingly. **Do not let anyone reword them** — a paraphrased review is an invented one.
- The enquiry pipeline works end to end and has been verified against the live database and a
  real email send, not against the source it was written from.
- Consent is compliant and gated: nothing is stored and nothing is requested before a choice,
  asserted on every route on every build.
- 21 gates run on every commit. All are green.

---

## The one thing to remember

Every number on this site today is either zeroed (`£0,000`, `[SEED] 00%`) or measured by a gate
in this repository. **When you replace a zero with a real figure, you are making a claim** — and
the whole verification apparatus in this repository exists because a specific-looking number
that nobody can trace is worse than no number at all: it stops anyone asking where it came from.

Replace them deliberately, one at a time, and know the source of each.
