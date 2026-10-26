# GS-INT-002 — Final integration / programme release candidate

## Authority and boundary

Verification date: 1 October 2026. A horizontal review of the assembled site — not a redesign.
Master (`989dbe23`, CI `36885902303`), Design + Digital remediation (`146f93a0`, CI `36810308636`),
Press (`GS-PRESS-001-RC`) and Shared (`GS-SHARED-001-RC`) are RC-verified subsystems and were not
reopened. Staging only: branch `staging/gs-press-001-press`, starting HEAD and remote
`989dbe23c89b24e6c8b126031ba9ee1e5e8ab95b`, main `fbecbe01e7fb594c6163dab57514997cb248fc21`
(untouched). No Sanity, Supabase, mail, DNS, production deployment or Vercel environment write; no
valid form submission.

**A PASS here means** the staging website is internally integrated and verified as the
pre-production programme baseline. It does not mean the production CMS is migrated, production forms
are tested, DNS is cut over, production is live, or the owner/legal gates are closed.

Method: a clean detached worktree at `989dbe23` with no `.env.local` (no mail, database or write
keys; `NEXT_PUBLIC_SANITY_DATASET=development`, as CI), `npm ci`, `.next` wiped before each build,
served on port 3210 (3000 was held by an unrelated process from an earlier session, left alone).
The baseline was built, served and crawled read-only first; the correction was then applied and the
full programme suite run on the candidate.

## Findings

| # | Finding | Class | Action |
|---|---|---|---|
| F1 | The Master group's metadata `description` / `og:description` / `twitter:description` said *"Design, Digital and Press are its trading divisions."* It is `/`'s description **and the inherited `og:`/`twitter:` description on `/about`, `/approach`, `/contact`, `/insights` and the legal routes** — so About's own description said "studios" while its link preview said "trading divisions". Public brand/SEO copy, not statutory | A — metadata | **Corrected** (below) |
| F2 | Gate gap: nothing asserted the taxonomy of served metadata, which is why F1 survived the Master RC's "studios" pass | A — gate | **`check:company` question 10** |
| F3 | Returning visitors see the cookie notice for **one frame** when the stylesheet arrives after the HTML | B — deferred polish | Recorded (§Cookie prepaint) |
| F4 | Legal routes visibly carry `[SEED - SOLICITOR REVIEW REQUIRED]` in the summary/description and the "Draft — not yet reviewed by a solicitor" panel | Expected development-CMS state, `GS-O003` | Migration/cutover item |
| F5 | About intro *"One company, three specialist divisions"* | C — stale development CMS | Migration item (no CMS write) |
| F6 | The two public lead forms have no bot protection beyond validation (§Forms) | Cutover decision (owner) | Recorded, not changed |

No other integration defect was found. Everything else below is a verified reading.

## Correction

`app/(marketing)/layout.tsx` — one `DESCRIPTION` constant for `description` and `openGraph.description`:
*"One UK company. Design, Digital and Press are its three specialist studios."* ("three specialist
studios" is the approved wording of Master chapter 02 and About's own description.) Non-visual: no
rendered text, layout, palette, scene or copy on any page changes. Statutory wording is untouched.

**Gate — `check:company` question 10 (`taxonomyProblems`).** On every non-legal route of the gate's
18, the served `<title>`, `description`, `og:title/description` and `twitter:title/description` may
not say "division(s)"/"department(s)" outside the exact statutory clause (*"Gridsmith X is a trading
division of Gridsmith Ltd."* / *"A trading division of Gridsmith Ltd."*). `/legal/` routes are exempt
(instrument summaries are legal context, as question 4 exempts them). A coverage guard fails the run
unless `og:description` was read on every non-legal route.

- **Self-test** (`check:company:selftest`, 68 → 77 cases): the corrected text and both clause forms
  are clean; the old description fires (the plural is not the clause); `description`, `og:description`,
  `twitter:title` and `<title>` are each read; "department" fires; other division wording beside the
  clause still fires; legal exemption; the count moves (two offending values = two problems).
- **Deliberate failure:** the new gate against the served, unfixed `989dbe23` build — **red on
  question 10 alone**, 11 problems (`/` description, og, twitter; og + twitter on `/about`,
  `/approach`, `/contact`, `/insights`), questions 1–9 clean in the same run. A red reading carries
  its own validity: the injected quantity is the real defect.

## Brand taxonomy — every public occurrence classified

Served text and metadata of all 66 public routes, crawled.

| Occurrence | Where | Class |
|---|---|---|
| "studio(s)" — Studios index, nav, footer *Studios*, About/Approach/Contact/Insights copy, metadata | site-wide | A — correct |
| *"Gridsmith Design, Gridsmith Digital and Gridsmith Press are trading divisions of Gridsmith Ltd, registered in England…"* | `/` legal disclosure | B — statutory |
| *"One UK company. Design, Digital and Press are its trading divisions."* | shared footer, every route (beside the reg. 25(2) disclosure) | B — legal-relationship statement in the statutory footer, owner-approved at `GS-SHARED-001-RC`. Changing it is visible: owner option, not a defect |
| *"Gridsmith X is a trading division of Gridsmith Ltd."* / *"A trading division of Gridsmith Ltd."* | studio metadata; `/digital` close notes | B — statutory clause (approved at `GS-MASTER-001-RC`) |
| *"Gridsmith Press is one of three trading divisions of Gridsmith Ltd."* | `/press/contact/thank-you` | B — entity statement in the cross-studio prompt; visible, owner option |
| legal instruments (*"across all three divisions"*, *"Gridsmith division or service"*, *"not separate legal entities"*) | `/legal/*` | B — `_legal/`, not amended |
| *"One company, three specialist divisions"* | About intro | C — development CMS only; the seed says "studios" |
| *"Most clients arrive needing one division"*, *"run it through the division that does that kind of work"*, *"whichever division does the work"*, *"Where a project needs two divisions"*, *"moved between divisions"*, *"Three divisions is not every discipline"* | About / Approach section copy (seed **and** development CMS — they agree) | D — inconsistency in CMS copy, `groupPage` tier 3 *"written copy, not yet owner-read"*. Owner copy decision before migration; not changed here (visible) |
| *"a separate cross-division Gridsmith engagement"*, *"across both divisions"*, *"across the two divisions"* | 3 service pages (Design campaign creative, Digital technical SEO, Press content SEO) | D — CMS service copy; owner copy decision before migration |

"department(s)" appears nowhere.

## Canonical studio source

`STUDIOS` in `components/chrome/nav.ts` is the one source of label, href, summary and thesis. Read by:
Master studio index (`Home.tsx`), About structure map, header (Master nav + `Gridsmith / {Studio}`),
footer Studios index and its `Organization.brand`, `global-not-found` links, and the first sentence of
each studio layout's metadata (`studio(x).summary`). The studio landing pages' own `description`s
(e.g. *"Visual identity, illustration, motion, 3D and technical drawing. One connected design
practice."*) are each studio's approved page copy, not copies of the summary — no duplicate summary is
maintained anywhere. No abstraction added.

## Master role and service ownership

Master publishes four restrained lines — digital roadmap & discovery, strategy & advisory, programme
management, ongoing partnership — with no studio catalogue, links or prices. Delivery lives in the
studios: Design 16 services (brand & visual, illustration, motion, 3D & visualisation, technical),
Digital 17 (web, software, apps, automation & AI, operate — incl. technical SEO, hosting
coordination & maintenance), Press 14 (writing, editing, production, publishing, audio, marketing —
incl. content SEO). Cross-studio boundaries are stated in the service records: Press *Cover Design
Coordination* (Design creates covers), Digital technical SEO ↔ Press content SEO scoped together,
campaigns as a cross-studio engagement. No contradictory ownership found.

**Press boundaries.** No guaranteed placement, sales, rankings, reviews or acceptance; "What you do
not get" rows disclaim ranking guarantees, publicity/sales outcomes, printing quality ("the printer or
platform produces the physical book"); no Audible, ACX or Spotify mention anywhere; no in-house
printing claim. **Technical Design.** *"Gridsmith does not provide certified engineering design,
structural design or any regulated engineering…"*, *"Certification, stamping or regulatory sign-off —
not offered"*, visualisation *"implies no engineering responsibility"*; the production publication gate
for Technical services (`GS-O005`/`GS-X002`) is unchanged.

## Company and contact facts

Served on all 66 public routes (crawl) and asserted by `check:company` over 18:
Gridsmith Ltd · company number 17050842 (66/66 routes) · registered in England · email
`contact@gridsmith.uk` (the only address published; the legacy Gmail is on `FORBIDDEN_EMAILS`) ·
WhatsApp or text **+44 7405 448534** (`wa.me/447405448534`, `sms:+447405448534`) · **no `tel:` link on
any route**, no "call us", no business hours · response wording *"We typically respond within 48
hours."* everywhere it appears (one source, `companyDetails.responseCommitment`) · registered office
in the statutory footer and the legal instruments only. Contact entry points converge on one writer:
`/contact` (Master/header/footer/About, and `?division=…&service=…` from 47 service pages and the
three studios) and Press's own `/press/contact` journey — both call `submitLead`.

## Reviews

Official source: the Freelancer profile, read server-side (`lib/reviews/freelancer.ts`), 24 h cache,
`/` revalidates daily, no stored copy, no credential. `check:reviews:live` (read-only, today):
**13 returned, 11 published, 2 withheld** — both name a third-party business (`GS-O015`,
`namedThirdParty`). Placement is Master-only (cylinder with Previous / Next / Pause, counter, keyboard,
reduced-motion still grid); `check:reviews:ui` asserts absence on the three studios. Withheld text is
filtered before render, so it is absent from HTML, the RSC payload, client chunks, metadata and JSON-LD
(the `Organization` record carries no rating or review).

## Navigation and footer

Header: Master routes — `Design · Digital · Press | Approach · About · Contact` (Master is the frame,
not a fourth studio); phones — a `Menu` disclosure with the same seven links. Studio routes —
`Gridsmith / {Studio}` plus that studio's enquiry, no sibling links (owner decision 2). Footer on all
66: brand + contact + response line, **Studios / Company / Legal** groups (current studio
`aria-current`), 8 approved social channels, 20 links; decorative footer mark `none` on `/`,
`block` elsewhere (`/design` keeps its own R2 handoff). Insights is listed only when a published post
exists (none today). **117 distinct internal link targets, all 200**; no link to a probe, admin or
staging route.

**Social.** Facebook, Instagram, LinkedIn, X, TikTok, YouTube, Reddit, Freelancer — the `GS-O017`
set, each `target="_blank" rel="noopener noreferrer"` with `aria-label="Gridsmith on {Platform} (opens
in a new tab)"`, marks `aria-hidden`. No placeholder or Gmail. **`GS-O021`** (TikTok written logo
permission) and **`GS-O022`** (official Freelancer asset) remain open — the TikTok and Freelancer marks
are not treated as cleared.

## Route inventory

| Class | Count | Routes |
|---|---|---|
| Master | 1 | `/` |
| Studio | 3 | `/design`, `/digital`, `/press` |
| Service | 47 | `/design/services/*` 16 · `/digital/services/*` 17 · `/press/services/*` 14 (the 13 pre-expansion Press slugs preserved + `audiobook-production-support`, the sole new route) |
| Shared | 7 | `/about`, `/approach`, `/insights`, `/contact`; Press journeys `/press/contact`, `/press/contact/thank-you` (not in sitemap), `/press/path-finder` (withheld historical preview: `noindex` in every environment, unlinked, not in sitemap) |
| Legal | 7 | `/legal/{privacy,cookies,terms,accessibility,client-terms,business-client-terms,consumer-client-terms}` |
| 404 | 1 | `global-not-found` — `en-GB`, one H1, header/footer, `noindex` |
| System | — | `robots.txt` (`Disallow: /` unless production + `NEXT_PUBLIC_SITE_URL`), `sitemap.xml` (empty unless indexable), `manifest.webmanifest`, icons |
| API / probes | 7 | `/api/rls-drift` (Vercel Cron, 404 without `CRON_SECRET`); `/gridsmith-lead-probe`, `/gridsmith-timeout-probe` (404 on production); page probes `/_kitchen-sink`, `/_master-sink`, `/gridsmith-error-probe`, `/gridsmith-ssr-throw-probe` (absent from production builds via `pageExtensions`; present on Preview behind SSO) |

**65 public pages + 404.** Every page: one H1, `lang="en-GB"`, self-canonical, no duplicate title or
description. Redirects: `redirects/legacy.json` is empty by decision; the live WordPress site has 8 URLs
(`LIVE-SITE-EXTRACT.md` §13) and `/terms-and-conditions/` needs an owner target before cutover.

## Metadata / SEO

Titles distinct on all 65 (`… — Gridsmith Ltd` / `… — Gridsmith {Studio}`); descriptions distinct on
all 65; canonical = own path; `robots` `noindex, nofollow` on this build (and the Preview), switched only
by production + `NEXT_PUBLIC_SITE_URL` (not set in Production today — correct pre-cutover); Open Graph
`website`, `en_GB`, site name per group, no image (`GS-O007` supplies no OG asset); Twitter `summary`;
JSON-LD `Organization` (legal name, number, address, email, phone, three `Brand`s, no rating) on every
route. `og:title` is the group name rather than the page title — a deliberate group default, not a
defect, and not changed (no SEO rewrite). Only F1 needed correction.

## CMS boundary (read-only; no write of any dataset)

| Dataset | State (unauthenticated read, today) |
|---|---|
| `development` | 121 published documents (114 `isSeed`), 0 drafts, 0 assets: `companyDetails` 1 · `groupPage` 2 · `legalDocument` 7 (v2.0, seed) · `service` 47 (16/17/14) · `post` 9 (editorial briefs, unpublished) · `testimonial` 6 (genuine, unrendered) · `faq` 45 and `teamMember` 4 (`[SEED]`, unrendered) |
| `production` | **empty** — no documents (consistent with every production-target build failing, `GS-T005`) |

**Development vs the repository seed** — every string over 25 characters in the 72 rendered-type documents (`companyDetails`, `groupPage`, `legalDocument`, `service`, `post`, `testimonial`) compared
with `seed-content.mjs`, `service-content.mjs`, `seed-legal.mjs`, `seed-company-details.mjs` and
`lib/process/canonical.ts`: **one difference** — the About intro (F5). Company facts in the singleton
match `check:company`'s `FACTS`.

## Legal

6 reviewed documents / 94 clauses / 339 paragraphs (`check:legal:parity`, plus the `client-terms`
disambiguation page). Routes 200, linked from the footer Legal group on every route, one H1, contents
navigation, company and contact facts present, readable and overflow-free at all six walk sizes.
Deferred: the legal list-semantics migration; solicitor review (`GS-O003`) — the served instruments
are the 2.0 internal drafts and say so.

## Insights

Empty and honest: `listPosts` serves no `status: 'brief'` document, `PostList` renders its empty state
under a standfirst that describes no article, and the footer omits the Insights link. No article was
written. (`/insights` stays in the production sitemap's static list.)

## Cross-route browser walk

Chromium (Puppeteer), the served baseline build. 14 routes (`/`, three studios, About, Approach,
Insights, Contact, Press contact, a service from each studio, `/legal/privacy`, the 404) × **320×568,
390×844, 768×1024, 1024×768, 1440×900, 1920×1080**, each scrolled top to bottom: **84 readings, zero
horizontal overflow, exactly one visible H1, header, footer and one `<main>` on every one, no runtime
or console error.** No-JS and reduced motion (390 and 1440, all 14 routes): no overflow, H1/footer/main
present; without JS the cookie notice is absent by design. Keyboard (first 40 stops on 7 routes at 390
and 1440): skip link first, every stop on screen with a visible indicator (`/digital`'s compass links
draw theirs on their number/label, `digital.css:527`). One reading at 390 placed focus on `/digital`'s
first compass link while its nav was momentarily inert; ten targeted repeats (390 and 1440, 45 stops,
with and without delay) never reproduced it and focus was never lost — recorded as a transient, not a
defect. Mobile `Menu` opens the seven Master links on `/`, `/about` and `/legal/privacy`.

## Cookie prepaint (F3)

Measured: returning visitor (`gs_consent=1`), every stylesheet delayed 1500 ms, a `requestAnimationFrame`
recorder from document start. On 6 of 8 route × width samples the first rendered frame (~1.54 s) shows
the notice — `hidden=false`, 82–218 px tall — for **exactly one frame**, then the inline check hides it;
on the other 2 it never shows. Mechanism: the inline script after the notice is script-blocked by the
pending stylesheet, and when the stylesheet lands Chromium can paint once before the parser resumes.
First visits are unaffected (the notice is server-rendered); no-JS never shows it. **Classification B —
acceptable deferred polish**: a single ~16 ms frame, only on late CSS, only for returning visitors, no
accessibility, consent or legal consequence (it is a notice, not a consent request). A fix would put
the cookie test in `<head>` (shared `RootShell`) and is not taken in an integration RC.

## Mixed-colour parser guard

Measured on the served build: text computing to a non-`rgb()` colour (`color(srgb …)`) occurs on
`/design` only (two label spans), whose gate already parses it correctly. `/`, `/digital`, `/press`
and `/about` have none at 390 or 1440, scrolled through. The unguarded parser in
`check-digital-scene.mjs` / `check-master-scene.mjs` therefore still measures nothing it misreads —
**still latent; defensive hardening, deferred** (does not affect any current reading).

## Forms and `GS-O010` (read-only; no submission)

Both forms (`/contact`, `/press/contact`) post a Server Action → `submitLead` (Zod `leadSchema`, named
fields only) → Supabase REST insert with the service-role key → `after()` Resend notification.
**Bot protection (F6): none beyond validation** — Zod length/format bounds and the server-only writer;
no honeypot, no Turnstile, no rate limit (the `leads.status` enum has a `spam` value for after-the-fact
triage). Not changed here: Turnstile is a third-party script with CSP and privacy-notice consequences.
An owner decision before cutover — a server-side honeypot, Turnstile, or a Vercel Firewall rate limit
on the two form routes (configuration only).
Vercel environment, names and targets only (no value read):

| Variable | Targets |
|---|---|
| `SUPABASE_SERVICE_ROLE_KEY`, `CRON_SECRET` | **Production only** |
| `DIRECT_CONNECTION_STRING`, `SANITY_API_WRITE_TOKEN`, `VERCEL_OIDC_TOKEN` | **one shared entry, Preview + Production** |
| `PROJECT_URL`, `PUBLISHABLE_KEY`, `RESEND_API_KEY`, `LEAD_NOTIFICATION_FROM/EMAIL`, `NEXT_PUBLIC_SANITY_DATASET` | separate Preview / Production / Development entries (values not compared) |
| `NEXT_PUBLIC_GA4_ID`, `NEXT_PUBLIC_POSTHOG_*` | still set in all three; unread by any code since analytics was removed — cleanup |
| `NEXT_PUBLIC_SITE_URL` | **not set** (so Production is not indexable — correct until cutover) |

Consequence on Preview today: a valid submission returns `error` at `submitLead` (no service-role key)
**before** any insert or mail, so Preview cannot write leads or send lead mail through the forms; the
runtime reads neither `DIRECT_CONNECTION_STRING` nor `SANITY_API_WRITE_TOKEN` (scripts only), but both
production credentials are present in every Preview build environment.

**Required before a valid-submission test:** an isolated non-production Supabase target for Preview
(`PROJECT_URL`, `PUBLISHABLE_KEY` and a distinct Preview service-role key); Preview
`DIRECT_CONNECTION_STRING` and `SANITY_API_WRITE_TOKEN` removed or replaced with non-production
credentials; Preview mail to a test recipient (or a test Resend key); then one submission per form on
Preview, verified in the isolated table and inbox, and only then the production smoke submission after
cutover. Until then `GS-O010` stays open.

## Security

`npm audit --omit=dev`: **0**. Dev-only advisories remain in tooling (Puppeteer/LHCI/Sanity CLI
chains; nested `undici@7.29.0` under `@sanity/cli-build`) — no production path, no churn.
`lint:secrets` (bundle scan) PASS; `check:security-headers` PASS (CSP `default-src 'self'`,
`frame-ancestors 'none'`, `X-Frame-Options DENY`, HSTS, `nosniff`); probes excluded from production;
`/api/rls-drift` 404 without the cron secret; Preview SSO-protected and `noindex` (verified at the
Preview step). No credential rotated, read or printed.

## Owner gates

| Gate | Integration RC | CMS migration | Production cutover |
|---|---|---|---|
| `GS-O003` solicitor confirmation | no | **blocks legal-document migration** (drafts carry `[SEED]`; production refuses them) | **blocks** |
| `GS-O010` Preview isolation / valid submission | no | no | **blocks** (forms must be proven before launch) |
| `GS-O021` TikTok written logo permission | no | no | **blocks** (or the TikTok mark is removed before launch) |
| `GS-O022` official Freelancer asset | no | no | does not block — provisional mark; optional replacement |

Also before cutover: owner copy decisions D (About/Approach/service "division" wording), the
`/terms-and-conditions/` redirect target, form bot protection (F6), and the existing launch items (`BEFORE-LAUNCH.md` — ICO, PI
scope for Technical (`GS-O005`), SPF merge, Studio CORS).

## Production CMS migration plan (not executed)

**Never by copying `development`** (`BEFORE-LAUNCH.md` §16): every development record this repo writes
is `isSeed: true` (except the six testimonials and `companyDetails`), and `check:launch` — now the
`prebuild` of every deploy — refuses a production dataset with a published seed document.

- **Inventory to create in `production`:** `companyDetails` (genuine, `seed-company-details.mjs` facts:
  Gridsmith Ltd, 17050842, England, registered office, `contact@gridsmith.uk`, +44 7405 448534,
  *"We typically respond within 48 hours."*); `groupPage` ×2 — About (intro **"studios"**) and Approach,
  after the D copy decision; `service` ×47 with their slugs (16/17/14, incl. the 14 Press slugs), minus
  the 3 Technical services `check:launch` refuses on production until `GS-O005` confirms professional scope; `legalDocument` ×7 — the solicitor-reviewed text,
  no `[SEED]` marker, after `GS-O003`. No `pathFinderConfig` document exists in either dataset
  (`/press/path-finder` is withheld, `noindex`, unlinked). **Not migrated:** `faq`, `teamMember`, `post`
  briefs, `testimonial` (unrendered — reviews come from Freelancer), any `isSeed` record. Assets: none
  (0 in either dataset). References: services → capability groups are code (`lib/services/
  architecture.ts`), not documents; no cross-document references to rewrite.
- **Preflight:** schema deployed and identical (`check:schemas`); `production` confirmed empty; owner
  approvals for D copy, `GS-O003`, `GS-O005`; import script reviewed to write non-seed ids with
  `isSeed: false` and no dotted ids (unauthenticated reads hide them).
- **Backup/export:** `sanity dataset export production` (expected empty) and `development` to dated
  archives before any write.
- **Migration:** one reviewed import into `production` only; no write to `development`.
- **Verification:** an unauthenticated count equal to the import; `check:launch` live tier on
  `NEXT_PUBLIC_SANITY_DATASET=production npm run build` (`BEFORE-LAUNCH.md` §16 five-point record:
  live tier applies, seed count 0 with non-zero total, real statutory values, no `[SEED]`, exit 0);
  `check:service-content:dataset`; `check:legal:parity`; the served suite against a production-dataset
  Preview.
- **Rollback:** delete the imported ids (or restore the pre-import export); production is not live, so
  no visitor is affected.

## Cutover readiness (not executed)

**Production is NOT READY.** Required, in order: production CMS migration (above); `GS-O010`
isolation + a valid submission per form; `GS-O003` solicitor-reviewed legal text; `GS-O021` (or the
TikTok mark removed); owner copy decisions; redirect map (8 legacy URLs, `/terms-and-conditions/`
target); Production env verified (`SUPABASE_SERVICE_ROLE_KEY`, `CRON_SECRET`, Resend with verified
`gridsmith.uk` sender and merged SPF, `NEXT_PUBLIC_SANITY_DATASET=production`, stale analytics vars
removed); merge to `main` → production build READY → smoke on the `*.vercel.app` production URL; then
DNS/alias of `gridsmith.uk` from Hostinger to Vercel.

- **Rollback:** Vercel has **no READY production deployment** (every production build since `GS-P00`
  has failed on the empty dataset), so the first rollback is DNS back to Hostinger (keep the WordPress
  site and its DNS records until the new site is accepted); afterwards, Vercel instant rollback.
- **Post-cutover smoke:** the served gates against `https://gridsmith.uk` (axe, company, legal parity,
  security headers, reviews UI, responsive), one valid submission per form, statutory footer, 404,
  redirects.
- **Indexing:** set `NEXT_PUBLIC_SITE_URL=https://gridsmith.uk` on Production only, redeploy, confirm
  `robots.txt` allows and `sitemap.xml` lists the 65 pages; submit to Search Console.
- **Monitoring:** Vercel runtime errors/logs, the `rls-drift` cron (needs `CRON_SECRET`), Resend
  delivery, Freelancer review retrieval (`check:reviews:live` pins 13/11/2 — a new review makes it red
  until read), field INP/LCP (no analytics: Search Console CWV).

## Local verification (candidate = `989dbe23` + this change)

Clean worktree, `.next` wiped, Windows, development dataset, no mail/database/write keys.

- `git diff --check` clean. `verify:static` **PASS** (incl. `check:company:selftest` 77 cases).
- `verify:build` **PASS** — 69 routes within their delta budgets; `/` **5.6KB of 15KB**; Master scene
  (lazy) **6.2KB of 8KB**, chunk `2588.a867b59ef65395fa.js` byte-identical to `989dbe23`; Design scene
  (lazy) **7.9KB of 8KB** — identical to the baseline build: no client JS changed.
- `verify:served` **PASS** — axe 76 analyses (19 routes × 375/1280 × initial/scrolled) zero violations,
  deferred footer 2 analyses clean; security headers 3 routes; `check:launch` (development: 5 statutory
  fields; 114 seed / 3 unconfirmed Technical services refused on production only); responsive 51
  combinations; consumer terms; legal parity **6 / 94 / 339**; VAT 17 routes; Press type and scene;
  Path Finder live; service content against the dataset; reviews UI; **company 10 questions over 18
  routes**; Master scene all 14 questions at 12 viewports (software WebGL 187ms blocking locally — the
  known local-load variance; CI measures it); Master hero; Design scene; Digital scene. Lighthouse
  desktop/mobile skipped on Windows by design — CI measures them.
- Served candidate `/`: `description`, `og:description`, `twitter:description` = the corrected text;
  withheld review text in 0 bytes of `/` (HTML + RSC payload) and 0 client chunks.
- `check:reviews:live` 13 / 11 / 2; `npm audit --omit=dev` 0.
- Not re-run: `prove-master-scene`, `check:design:scene --prove`, `check:digital:scene --prove` — no
  scene, selector or scene gate changed.

## Exact-SHA release receipt

The final commit cannot contain its own hash. As in the Design/Press/Shared/Master RCs, the final SHA,
remote/main checks, CI run, Master and Digital Lighthouse runs and the protected Preview are recorded in
the release handoff and `node_modules/.cache/gs-int-002/final-release-receipt.json`. The programme
baseline is verified only when that CI run succeeds.
