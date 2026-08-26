# 01 — Factual Inventory

**Derived from the repository at commit `a322c272`, and from the running site, on 25 August 2026.**

This is the input to the citation ledger. Every fact below was re-derived from code, configuration,
migrations, or direct observation of the running application and the live database. **None of it was
read from the six legal drafts under audit** — deriving the inventory from its own subject would make
the check circular.

Two words are used strictly:

- **IMPLEMENTED** — the code exists at the cited line and does the stated thing.
- **SPECIFIED-BUT-NOT-BUILT** — a spec or docstring describes it; no code implements it.

An uncited claim is not made. Gaps are collected in §8 as numbered open questions rather than filled
with a plausible default.

**Observation method for §2**: dev server started via the Browser pane (`npm run dev`, Next 15.5.23,
`.env.local` loaded), then `document.cookie` / `localStorage` / `sessionStorage` / DOM / network read
directly in each of the three consent states.

---

## 1. Processors and data regions

### 1.1 Summary

| Processor | Role | Personal data reaching it | Region — as actually configured | Status |
|---|---|---|---|---|
| **Sanity** | Processor | **None.** Read-only, server-side, at build time | Project `spzu6y31`, dataset from `NEXT_PUBLIC_SANITY_DATASET` (currently `development`) — `sanity/project.ts:15`, `sanity/env.ts:31-40` | IMPLEMENTED. **Region not established** → OQ-1 |
| **Supabase** | Processor | Every lead-form field (§3) | Project ref `dqiutgmxillhsbzgnlsx` (`PROJECT_URL`, `.env.local`) — **region not established** → OQ-2 | IMPLEMENTED |
| **Vercel** | Processor | Request metadata for every visitor; lead payload transits the Server Action | `vercel.json:1-10` — framework + one cron. **No region pinned in config** → OQ-3 | IMPLEMENTED (hosting moved 20 Aug 2026) |
| **Resend** | Processor | Name, email, company, phone, division, lead type, service slug, record id | `https://api.resend.com/emails` — `lib/leads/notify.ts:101`. No region parameter sent → OQ-4 | IMPLEMENTED |
| **GA4 / Google** | Processor (contested; Google acts as controller for some purposes) → OQ-5 | Nothing observed — see §1.3 | `https://www.googletagmanager.com/gtag/js?id=…` — `lib/analytics/load.ts:74`. Measurement id `G-CB4NWWYRQ1` (`.env.local`) | Script **loads on grant but is never initialised** — §1.3 |
| **PostHog** | Processor | Nothing observed — see §1.3 | `https://eu.i.posthog.com` — `lib/analytics/config.ts:20`, enforced EU-only at `lib/analytics/load.ts:76-85` and `lib/analytics/posthog-region.ts:15-19` | Script **loads on grant but is never initialised** — §1.3 |
| **Slack** | Processor | Division, full name, lead type | `SLACK_LEADS_WEBHOOK` — `lib/leads/notify.ts:125-133` | **Code path live; variable unset, so it skips.** Undocumented processor → §1.4, OQ-6 |

### 1.2 Hostinger sweep

Repo-wide case-insensitive grep for `hostinger`. **No source, config, or script file matches.** All
matches are in documentation and all are already marked superseded:

| File:line | State |
|---|---|
| `docs/_shared/05-HANDOVER.md:77` | Explicitly superseded — "hosting moved to Vercel on 20 Aug" |
| `docs/_shared/05-HANDOVER.md:249` | Carries a "⚠ SUPERSEDED 20 Aug" banner |
| `docs/_shared/05-HANDOVER.md:254, 256, 280` | Inside the banner-marked superseded block |
| `docs/master/PROJECT-TRACKER.md:3087, 3091, 3106, 3115, 3117, 3144` | Inside an explicitly-marked superseded section |
| `docs/_shared/BEFORE-LAUNCH.md:44, 282` | §282 states the item "was stale on the day it was written" |

**No correction is required for the drafts on this point from the codebase side** — nothing in code
asserts Hostinger. Any Hostinger reference *inside* the drafts is a Pass 2 finding.

### 1.3 GA4 and PostHog do not initialise — observed, not inferred

This is the single most consequential processor finding. After **Accept**, on the running site:

- `lib/analytics/load.ts:74` injects `gtag/js?id=G-CB4NWWYRQ1`. **`window.gtag` is `undefined`** —
  no `gtag('js')` or `gtag('config')` call exists anywhere in the repository.
- `lib/analytics/load.ts:84` injects `eu.i.posthog.com/static/array.js`. **`window.posthog.__loaded`
  is `false`** — no `posthog.init()` call exists anywhere in the repository.
- **Consequence, observed: zero analytics cookies are set in any state.** No `_ga`, no `_ga_*`, no
  `ph_*`. `localStorage` and `sessionStorage` were empty in all three states.

So today the two providers receive **a script request only** (which carries the visitor's IP address
and user-agent to Google and PostHog as an inherent property of an HTTP request), and no behavioural
event, identifier, or persisted storage. `lib/analytics/load.ts:96-98` (`track`) pushes events into
`window.dataLayer` only; nothing consumes that queue. This is consistent with the docstring at
`lib/analytics/load.ts:88-95` ("the events are not lost between `A-09` and the day the ids arrive"),
but the drafts must describe the **current** state, not the intended one. → OQ-7

### 1.4 Processors referenced in code that nobody has documented

| Processor / credential | Cited | Note |
|---|---|---|
| **Slack** | `lib/leads/notify.ts:54, 125-133`; `.env.example` (`SLACK_LEADS_WEBHOOK`) | A live code path that transmits a lead's **full name** to Slack. Unset in `.env.local`, so it currently reports `skipped` (`notify.ts:122`). It is a processor the moment the variable is set. |
| `SUPABASE_SERVICE_ROLE_KEY` | `app/api/rls-drift/route.ts:55` | Used by the daily cron. **Not present in `.env.example`.** |
| `CRON_SECRET` | `app/api/rls-drift/route.ts:56` | **Not present in `.env.example`.** |

### 1.5 Fonts — observed

Fonts are **self-hosted** and served from the application origin
(`/_next/static/media/*.woff2`, observed in the network log on `/`). **No request to
`fonts.googleapis.com` or `fonts.gstatic.com` in any state.** No third-party font processor exists.

---

## 2. Cookies and client-side storage — observed on the running site

### 2.1 The complete inventory

**Exactly one cookie exists, in every state. No `localStorage` key. No `sessionStorage` key.**

| Name | Purpose | Duration | Party | Consent category | Cited |
|---|---|---|---|---|---|
| `gs_consent` | Records that a choice was made, and which categories were granted | `Max-Age=31536000` (365 days) | First | **None — strictly necessary.** Not gated; it is what stops the banner re-prompting | `lib/consent/state.ts:31-32, 46-52` |

Attributes as written: `Path=/`, `SameSite=Lax`, and `Secure` **only when `location.protocol` is
`https:`** (`lib/consent/state.ts:49-50`). Observed without `Secure` on local http, as designed.

Value format (`lib/consent/state.ts:34, 47-48`): the granted category names, comma-separated and
URL-encoded; the literal string `0` means an explicit reject. Observed values below.

### 2.2 The three observed states

| | State (a) before any choice | State (b) after **Accept** | State (c) after **Reject** |
|---|---|---|---|
| `document.cookie` | *empty* | `gs_consent=analytics_storage%2Cad_storage%2Cfunctionality_storage` | `gs_consent=0` |
| `localStorage` | *empty* | *empty* | *empty* |
| `sessionStorage` | *empty* | *empty* | *empty* |
| Injected scripts | *none* | `gs-ga4` → `googletagmanager.com/gtag/js?id=G-CB4NWWYRQ1`; `gs-posthog` → `eu.i.posthog.com/static/array.js` | *none* |
| Third-party hosts contacted | **none** | `www.googletagmanager.com`, `eu.i.posthog.com` | **none** |
| `window.gtag` | `undefined` | **`undefined`** | `undefined` |
| `window.posthog.__loaded` | n/a (absent) | **`false`** | n/a (absent) |
| `dataLayer` | one `['consent','update',{all denied}]` | denied default, then all-granted, then `gs_context`, then `gtm.dom` / `gtm.load` | denied default, then a second all-denied |

State (a) network log for `/`: only same-origin requests — HTML, two CSS chunks, five JS chunks, two
self-hosted `.woff2` files. **Zero third-party requests before a choice**, matching the claim in
`lib/analytics/load.ts:9-17`.

State (c): `_app-pages-browser_lib_analytics_load_ts.js` is fetched from the **application's own
origin** on the reject path (the dynamic import is resolved), but no third-party host is contacted and
no tag is injected. `components/consent/ConsentBanner.tsx:34-38` returns before the import on the
denied path; the chunk request observed is the dev-server module graph, not a consent breach.

**Provider keys were present in `.env.local`** (`NEXT_PUBLIC_GA4_ID`, `NEXT_PUBLIC_POSTHOG_KEY` both
set), and the page self-reported `{ga4: true, posthog: true, posthogHost: "https://eu.i.posthog.com"}`
via `window.__gsAnalyticsConfigured` (`lib/analytics/config.ts:34-39`). So the grant path was
genuinely exercised — this is not an absent-key skip.

---

## 3. Lead-form fields and what happens to them

### 3.1 Fields the visitor sees

Rendered by `components/leads/ContactForm.tsx`. Validated by `lib/leads/schema.ts`. Extracted by
`lib/leads/action.ts:36-54` (named fields only — never `Object.fromEntries`).

| Field | Required | Validation | Personal data | Column (`leads`) | Sent to Resend | Cited |
|---|---|---|---|---|---|---|
| `division` | Yes (defaults `unsure`) | enum `design\|digital\|press\|unsure` | No | `division division_t not null` | **Yes** | `schema.ts:17,26`; `0001_core.sql:28`; `notify.ts:67` |
| `full_name` | **Yes** | trim, 1–200 chars | **Yes** | `full_name text not null` | **Yes** | `schema.ts:32`; `0001_core.sql:32`; `notify.ts:72` |
| `email` | **Yes** | email format, ≤320 | **Yes** | `email text not null` | **Yes** | `schema.ts:33`; `0001_core.sql:33`; `notify.ts:73` |
| `company` | No | ≤200 | Yes (in a sole-trader case) | `company text` | **Yes** | `schema.ts:35`; `0001_core.sql:34`; `notify.ts:74` |
| `phone` | No | ≤40 | **Yes** | `phone text` | **Yes** | `schema.ts:38`; `0001_core.sql:36`; `notify.ts:75` |
| `message` | No | ≤5000 | **Yes** (free text — may contain anything) | `message text` | **No — deliberately withheld** | `schema.ts:38`; `0001_core.sql:37`; `notify.ts:56-61` |
| `budget_band` | No | ≤80 | No | `budget_band text` | No | `schema.ts:39`; `0001_core.sql:38` |
| `timeline` | No | ≤80 | No | `timeline text` | No | `schema.ts:40`; `0001_core.sql:39` |

`budget_band` options are **engagement shapes, not money bands** — `not-sure` / `small` / `project` /
`programme` (`ContactForm.tsx:62-67`), a deliberate decision documented at `ContactForm.tsx:49-61`.

### 3.2 Fields accepted by the schema but not on the form

`lib/leads/schema.ts` accepts, and `leads` stores, several fields the rendered form never sends:
`track` (`:28`), `service_slug` (`:29`), `role` (`:36`), `payload` jsonb (`:46`). `role` **is** read by
the action (`action.ts:45`) but has no rendered input. These are latent columns for later forms.

### 3.3 Data captured that a visitor would not call a form field

| Item | Personal data | Where | Status |
|---|---|---|---|
| `referrer` | Contextual | `schema.ts:51` → `leads.referrer` | Accepted from a hidden input (`action.ts:51`). **No hidden input is rendered** by `ContactForm.tsx`, so it is currently always null |
| `landing_page` | Contextual | `schema.ts:52` → `leads.landing_page` | Same — accepted, not currently populated |
| `source` / `medium` / `campaign` | Campaign metadata | `schema.ts:48-50` | Same — accepted, not currently populated |
| `is_ai_referral` | Derived flag | `schema.ts:53` | Same — accepted, not currently populated |
| `created_at` | **Timestamp of the enquiry** | `0001_core.sql:27` — `timestamptz not null default now()` | **IMPLEMENTED and automatic.** A visitor would not think of this as a field |
| `id` (UUID) | Identifier | Generated server-side, `submit.ts:77` | IMPLEMENTED |
| `status`, `notified_at`, `crm_synced_at`, `notes` | Internal | `0001_core.sql:47-50` | Columns exist. `notified_at` is **never stamped** (`submit.ts:29-31`) |
| **IP address** | **Yes** | — | **NOT captured by the application.** No code reads a client IP. `schema.ts:20-24` states the policy explicitly. Vercel's own platform logging is outside the repo → OQ-8 |
| **User-agent** | **Yes** | — | **NOT captured by the application.** Same citation |
| **Honeypot** | — | — | **NOT IMPLEMENTED.** No honeypot, no rate limit, no CAPTCHA anywhere in `lib/leads/` or `ContactForm.tsx` |

### 3.4 Storage, transmission, retention, RLS

**Storage.** Single `POST` to `${PROJECT_URL}/rest/v1/leads` (`submit.ts:79-90`) using the
**publishable (anon) key**, deliberately not a service role (`submit.ts:12-20`), with
`Prefer: return=minimal` (`submit.ts:87`) because no anon SELECT policy exists.

**Onward transmission — exactly what the Resend notification contains** (`notify.ts:62-81`):

```
Subject: New {division} lead — {full_name}
Division / Type / Service (if set) / Name / Email / Company (if set) / Phone (if set)
(blank line)
Record: {uuid}
```

**The `message` body is deliberately excluded** (`notify.ts:56-61`). Sent from
`LEAD_NOTIFICATION_FROM` to `LEAD_NOTIFICATION_EMAIL` — currently `onboarding@resend.dev` →
`contact@gridsmith.uk` (`.env.local`). `notify.ts:12-20` records that this dev sender **only delivers
to the Resend account owner's own address**. The Slack message, if enabled, carries
`New {division} lead: {full_name} ({lead_type})` (`notify.ts:128`).

The send runs in `after()` (`submit.ts:98`), so it does not block the response and its outcome is not
returned to the visitor.

**Retention: NOT IMPLEMENTED.** Repo-wide grep for retention, purge, erasure, anonymisation, or a
scheduled delete over `leads` found **no implementation**. The only `delete from leads` in the
repository is `scripts/rls-drift-proof.mjs:61`, scoped to `email like '%@gridsmith.invalid'` — test
rows only. The one cron in `vercel.json:4-9` is `/api/rls-drift`, which is an RLS check, not a
retention job. → OQ-9

**RLS posture — verified against the live database, not the migrations.** Queried as `anon` with the
publishable key on 25 Aug 2026:

| Query | Result |
|---|---|
| `GET /rest/v1/leads?select=*&limit=1` | `200 []` — RLS enforced, no rows returned |
| `GET /rest/v1/sample_grants?select=*&limit=1` | `200 []` |
| `GET /rest/v1/events?select=*&limit=1` | `200 []` |
| `GET /rest/v1/v_lead_funnel?select=*&limit=1` | `401` — `permission denied for view v_lead_funnel` |

This matches the declared state: RLS on all three tables (`0001_core.sql:85-87`); a single anon policy,
`insert only` on `leads` (`0001_core.sql:92`); no anon SELECT/UPDATE/DELETE anywhere
(`0001_core.sql:94-97`); and the view revoked and set `security_invoker`
(`0002_view_security_invoker.sql:29-31`).

---

## 4. Consent categories, verbatim

### 4.1 The categories

Three, declared at `lib/consent/state.ts:13` as Google Consent Mode v2 names used verbatim:

| Machine string (verbatim) | UI label (verbatim) | Default | Cited |
|---|---|---|---|
| `analytics_storage` | `Analytics` | `false` | `state.ts:13, 18`; `ConsentBanner.tsx:13` |
| `ad_storage` | `Advertising` | `false` | `state.ts:13, 19`; `ConsentBanner.tsx:14` |
| `functionality_storage` | `Preferences` | `false` | `state.ts:13, 20`; `ConsentBanner.tsx:15` |

**Every category defaults to denied** (`DENIED`, `state.ts:17-21`). **There is deliberately no fourth
"strictly necessary" toggle** — `state.ts:9-11` gives the reasoning.

**Only `analytics_storage` gates anything.** `ad_storage` and `functionality_storage` are declared and
default-denied but **no code branches on them** — `ConsentBanner.tsx:34-38` and `load.ts:67` both test
`analytics_storage` alone. `state.ts:5-7` states that `ad_storage` is declared because Consent Mode
requires it and nothing on the site sets an ad cookie. → OQ-10

### 4.2 Granularity and the banner

- **Accept** grants all three at once (`ALL_GRANTED`, `ConsentBanner.tsx:40-44, 176`).
- **Reject** denies all three (`ConsentBanner.tsx:179`).
- **Preferences** opens three independent checkboxes → **Save choices** (`ConsentBanner.tsx:153-174`).
  So per-category granularity exists, one level in.
- Accept and Reject share one CSS class and one width (`ConsentBanner.tsx:176, 179` — both
  `styles.choice`); Preferences is a third, visually distinct control (`styles.preferences`).
- **No Escape-to-dismiss**, deliberately (`ConsentBanner.tsx:65-68`). Nothing is stored until a button
  is pressed.
- Withdrawal route: a persistent footer control, `Cookie preferences`
  (`components/consent/ConsentReopen.tsx:13-22`), rendered at `Footer.tsx:77`. Verified present in the
  live footer text.

### 4.3 The consent record

| Question | Answer | Cited |
|---|---|---|
| What is stored? | The granted category names only, or `0` for reject. **No timestamp, no version, no identifier, no record of the banner text shown** | `state.ts:47-50` |
| Where? | A first-party cookie in the visitor's browser | `state.ts:50` |
| How long? | 365 days | `state.ts:32` |
| Server-side audit trail? | **NONE** | — |

**`consent_events` does not exist.** Grep across the repository returns matches in `docs/` only
(`docs/master/SCHEMA.md`, `PROJECT-RULES.md`, `IMPLEMENTATION-PLAN.md`, `PROJECT-TRACKER.md`,
`05-HANDOVER.md`) plus one comment reference at `lib/leads/schema.ts:22`. **There is no
`consent_events` table in either migration and no code writes one.** `L-07` is
**SPECIFIED-BUT-NOT-BUILT**. There is therefore **no evidence of consent retained anywhere** beyond
the visitor's own cookie, which they can delete. → OQ-11

---

## 5. Routes: which exist, and who they are for

### 5.1 Every route in `app/**`

| Route | Route group / division | Audience | Basis |
|---|---|---|---|
| `/` | `(marketing)` — master | **Both** | Routes to all three divisions; `components/master/DivisionRouting.tsx` |
| `/about` | `(marketing)` — master | Both | Statutory/company page; renders VAT number at `about/page.tsx:66` |
| `/approach` | `(marketing)` — master | Both | The canonical six stages |
| `/contact` | `(marketing)` — master | **Both** | One form for all three divisions; `contact/page.tsx:13`, `ContactForm.tsx:42-47` |
| `/work` | `(marketing)` — master | Both | Case studies |
| `/work/[slug]` | `(marketing)` — master | Both | |
| `/insights` | `(marketing)` — master | Both | |
| `/insights/[slug]` | `(marketing)` — master | Both | |
| `/legal/[slug]` | `(marketing)` — master | **Both** | Seven slugs — see §5.2. `business-client-terms` and `consumer-client-terms` are audience-specific; `client-terms` is the disambiguation page |
| `/design` | `(design)` | **Largely B2B** | Copy targets workshops, contractors, product manufacture — `design/page.tsx:34-47` |
| `/digital` | `(digital)` | **Largely B2B** | Websites, software, AI — `digital/page.tsx` metadata |
| `/press` | `(press)` | **Consumer-facing** | Sells to individual authors — "Your book, published properly, and still yours"; "Tell us about the book" — `press/page.tsx:44-57` |
| `/api/rls-drift` | none | Machine (cron) | `vercel.json:4-9` |
| `/global-not-found` (404) | app root | Both | |
| `/global-error` | app root | Both | |

**Probe routes**, excluded from production builds via `pageExtensions` (`next.config.ts:59-63`):
`/_kitchen-sink`, `/_master-sink`, `/gridsmith-error-probe`, `/gridsmith-ssr-throw-probe`. Two route
handlers, `/gridsmith-lead-probe` and `/gridsmith-timeout-probe`, are **excluded at runtime instead,
not by the build** (`next.config.ts:51-57`) → OQ-12.

**Routes mixing both audiences**: `/`, `/contact`, and every `/legal/*` page. `/contact` is the
sharpest case — one form, one set of terms, and a consumer author choosing "Press" uses the identical
flow as a business buyer choosing "Digital".

**SPECIFIED-BUT-NOT-BUILT**: the estimator, the Press Path Finder, the books shelf, the Design track
fork, and all `/design/*`, `/digital/*`, `/press/*` sub-routes. No route below a division landing page
exists (`design/page.tsx:19-24`, `press/page.tsx:20-23`).

### 5.2 The legal routes — seven slugs, six drafts

`lib/legal/slugs.ts:14-20` declares exactly five, and `generateStaticParams` builds only these
(`legal/[slug]/page.tsx:46-48`):

| Slug | Seeded title | Corresponding draft |
|---|---|---|
| `privacy` | `Privacy Policy` | `PRIVACY-POLICY.md` |
| `cookies` | `Cookie Policy` | `COOKIE-POLICY.md` |
| `terms` | `Terms of Use` | `WEBSITE-TERMS.md` |
| `client-terms` | `Client Terms — which ones apply to you` | **Neither.** A disambiguation page carrying no operative clause; it says which instrument governs whom and links to both |
| `business-client-terms` | `Client Terms — Business Clients` | `MSA-BUSINESS.md` |
| `consumer-client-terms` | `Client Terms — Consumers` | `CONSUMER-TERMS.md` |
| `accessibility` | `Accessibility Statement` | `ACCESSIBILITY-STATEMENT.md` |

Cited: `scripts/seed-legal.mjs:83-84, 147-148, 184-185, 221-222, 286-287`.

**This was: one `Client Terms` document and two client-terms drafts.** The seeded `client-terms`
mixed both audiences in one instrument — clause 1.1 on the Companies Act, clause 2.1 on **Consumer
Rights Act 2015 s. 50** — and no route, slug or CMS document separated a consumer contract from a
business one. A Press author read a B2B liability cap that **s. 57 makes not binding on them** and
could not tell. **OQ-13 / D-10 is CLOSED by the owner's decision of 26 August 2026** — option (a),
with a disambiguation page in place of a redirect. See `03-REVISION-LOG.md` and `lib/legal/slugs.ts`.

Each instrument now states in its summary — the first prose on the page — who it governs and who it
does not. `/press` links to `/legal/consumer-client-terms#clause-10-1`, and
`scripts/check-consumer-terms.mjs` asserts against the **served** pages that no consumer-facing route
links to `/legal/business-client-terms`, that `/press` does link to the consumer instrument, and that
the consumer instrument is still itself. Each branch was proven by deliberate failure.

**Residual, and it is a drafting question rather than a routing one:** the business instrument still
carries consumer-facing material at 2.1, 6.1, 10.1 and 11.1, because `CLAUDE.md` forbids amending
clauses outside a solicitor review. Flagged for the `L-04` review.

All seven render a **DRAFT — NOT YET REVIEWED BY A SOLICITOR** banner while `solicitorApproved` is
false, and are `noindex` in that state (`legal/[slug]/page.tsx:62, 87-94`).

### 5.3 Pricing, as the code actually renders it

`components/content/Price.tsx` is the only price renderer, reached via
`components/content/ServiceList.tsx:47`, which appears on the three division landing pages.

What it renders (`Price.tsx:52-69`):

- A lead word by model — `Fixed price` / `From` / `Typically` / `Retainer from` / `Day rate from`
  (`Price.tsx:37-44`)
- The amount as `£{n.toLocaleString('en-GB')}` (`Price.tsx:34`), or the literal **`£0,000`** when the
  amount is zero — the repository's placeholder convention (`Price.tsx:33`)
- An **unconditional `INDICATIVE` badge** on every price, real or seeded (`Price.tsx:61`, reasoning at
  `Price.tsx:12-18`)
- Optionally "What moves it: …" and a note

**No VAT treatment is stated anywhere.** The rendered price carries no "inc. VAT", no "exc. VAT", and
no footnote about VAT. `sanity/schemas/objects.ts:75-79` records this as a known gap (`M-P2-3`):
*"No net/gross field yet … consumer-facing prices must display VAT-inclusive and B2B prices must state
their treatment."* The `pricingBlock` schema has `currency` (GBP only) and no net/gross field
(`objects.ts:81-95`). Because `/press` is consumer-facing (§5.1) and renders prices through the same
component, this affects consumer pricing directly. → OQ-14

---

## 6. Other legally load-bearing facts

### 6.1 Statutory company details — what the running site actually renders

`components/chrome/Footer.tsx:69-84` renders, and the live footer was read verbatim:

> Gridsmith Ltd · registered in England & Wales · company number 17050842 · registered office
> 30 Briarfield Road, Farnworth, Bolton, BL4 0HD · VAT number **[SEED] GB123456789**
>
> Cookie preferences
>
> contact@gridsmith.uk

**Source: CMS, not hardcoded.** Every value comes from the Sanity `companyDetails` singleton
(`Footer.tsx:47`, `lib/company/companyDetails.ts:36-56`). A missing singleton **throws and fails the
build** (`companyDetails.ts:49-55`).

The values currently in the `development` dataset are seeded by `scripts/seed-company-details.mjs:34-53`:

| Field | Seeded value | Real or placeholder |
|---|---|---|
| `legalName` | `Gridsmith Ltd` | Real |
| `companyNumber` | `17050842` | Presented as real → OQ-15 |
| `placeOfRegistration` | `England & Wales` | Real |
| `registeredOffice` | `30 Briarfield Road, Farnworth, Bolton, BL4 0HD` | Presented as real → OQ-15 |
| `tradingAddress` | `''` — same as registered office, so the footer omits the line | `seed-company-details.mjs:41-42` |
| `vatNumber` | **`[SEED] GB123456789`** | **PLACEHOLDER — currently rendered on every page** |
| `contactEmail` | `contact@gridsmith.uk` | **Real** — explicitly marked so at `seed-company-details.mjs:44-49` |
| `tradingNames` | `Gridsmith Design`, `Gridsmith Digital`, `Gridsmith Press` | Real |
| `responseCommitment` | see §6.2 | Real |

**Fields defined in the schema but never seeded — absent from the site entirely**:
`contactPhone`, `businessHours`, `piInsurer`, `piCoverLimit`, **`icoRegistration`**
(`sanity/schemas/companyDetails.ts:41-47`). → OQ-16, OQ-17

### 6.2 The response commitment

One source of truth, `companyDetails.responseCommitment`, read once and passed down
(`contact/page.tsx:40, 55, 62`; `ContactForm.tsx:76, 88`). No component holds a second copy
(`ContactForm.tsx:85-87`). The current string, verbatim
(`scripts/seed-company-details.mjs:51-52`):

> **We'll reply as soon as we can, and always by the end of the next business day.**

### 6.3 VAT registration

**Not registered, or at least not recorded.** The seeded value is the marked placeholder
`[SEED] GB123456789`, and `sanity/schemas/companyDetails.ts:11-18` states registration is pending and
the field carries no Sanity `required` rule for that reason. `check:launch-content` is the gate that
refuses a `production` dataset with an empty or seeded VAT number
(`sanity/env.ts:10-21`, `next.config.ts:89-107`). → OQ-15

### 6.4 Accessibility conformance evidence that actually exists

**Gates that run** (`package.json:11-40`), all blocking:

| Gate | What it measures |
|---|---|
| `check:axe` | axe-core over **15 routes (11 public, 4 internal) × 2 viewports (375px/1280px) × 2 scroll states (initial/scrolled)** = 60 analyses, plus link resolution, computed theme, and skip link (`scripts/check-axe.mjs:48-95, 120-128, 1081-1136`). **Corrected 26 Aug 2026** — counted from `ROUTES`/`VIEWPORTS`/`PHASES`; the second axis is scroll position, not consent |
| `check:contrast` | 36 token pairs / 148 cells across four themes (`EXPECTED_PAIRS`/`EXPECTED_CELLS`, `check-contrast.mjs:45-46`). **Corrected 26 Aug 2026** from 29/101 |
| `check:headings` | Heading structure |
| `check:responsive` | 375 / 768 / 1440, incl. WCAG 2.2 target size and focus-not-obscured |
| `check:theme` | Theme flash / token loading |
| `check:lhci:desktop` / `:mobile` | Two-axis Lighthouse |

**Routes actually audited by axe** (`check-axe.mjs:48-74`): `/`, `/design`, `/digital`, `/press`,
`/work`, `/work/brand-website-and-launch-book`, `/about`, `/approach`, `/insights`,
**`/legal/privacy`**, `/contact`, `/_kitchen-sink`, `/_master-sink`, `/_gridsmith-404-probe`, plus
`/gridsmith-error-probe`.

**Six of the seven legal routes are NOT audited** — `/legal/cookies`, `/legal/terms`,
`/legal/client-terms`, `/legal/business-client-terms`, `/legal/consumer-client-terms` and
`/legal/accessibility` do not appear in `ROUTES`; only `/legal/privacy` does. → OQ-18
*Corrected 26 August 2026, round 8, counted from `lib/legal/slugs.ts` (seven) against
`check-axe.mjs` `ROUTES`. It read "four of the five" — the client-terms split on 26 Aug added two
slugs, and both new routes landed outside the gate.*

**What has NOT been tested — stated plainly:**

- **The screen-reader pass has never happened.** `docs/_shared/05-HANDOVER.md:49, 79, 217, 244-247`
  and `docs/_shared/BEFORE-LAUNCH.md:361-370`. `05-HANDOVER.md:79` is explicit: it needs *"a human with
  NVDA or VoiceOver, over `M-02`, `M-03`, `M-04` and the consent banner. **It never happened**"*, and
  *"the gates cover focus order, target, paint, landmarks and roles; they do not cover announcement,
  and no lab check does."* `M-02` remains un-DONE. → OQ-19
- **No assistive-technology testing of any kind** — no magnifier, voice control, or switch testing is
  referenced anywhere.
- **INP cannot be asserted in CI** — it is a field metric; TBT is the lab proxy (`CLAUDE.md`,
  Performance budgets).

### 6.5 The real state of `[SEED]` content

**`[SEED]` content is live on the running site today**, in the `development` dataset:

- **The VAT number in the footer of every page** reads `[SEED] GB123456789` — observed.
- Case-study metrics render as `[SEED] 00%` (`app/(marketing)/work/[slug]/page.tsx:145`;
  `sanity/schemas/objects.ts:18`).
- Selected-work records are `[SEED]`-prefixed (`components/master/SelectedWork.tsx:20`).
- Team records are named `[SEED] Placeholder Name` (`app/(marketing)/about/page.tsx:48`).
- All prices are indicative placeholders, `£0,000` where zeroed (`ContactForm.tsx:53`, `Price.tsx:33`).
- **Testimonials are the exception** — `components/master/Testimonials.tsx:16` states six are real
  public Freelancer reviews, not seed. → OQ-20

The barrier between this and production is `NEXT_PUBLIC_SANITY_DATASET`. There is **no default**; an
unset variable is a build error (`sanity/env.ts:31-39`), and `check:launch-content` refuses a
`production` dataset carrying `[SEED]` markers or an empty VAT number.

**All five legal documents currently carry `solicitorApproved: false`** and render the DRAFT banner
(`legal/[slug]/page.tsx:87-94`). The drafts also use a `[DECISION]` marker for owner choices
(`scripts/seed-legal.mjs:13`) — e.g. the seeded cookie policy asserts *"Analytics data: retained for 14
months"* (`seed-legal.mjs:128`), which is a `[DECISION]` default, not a configured setting. **Nothing
in the codebase configures a GA4 retention period**, and per §1.3 GA4 is not initialised at all. → OQ-21

---

## 7. Quick IMPLEMENTED vs SPECIFIED-BUT-NOT-BUILT index

| Thing | State |
|---|---|
| Consent banner, three categories, default-denied, reject parity, reopen | IMPLEMENTED |
| Consent-gated script injection | IMPLEMENTED |
| GA4 / PostHog **initialisation and event capture** | **NOT BUILT** (§1.3) |
| `consent_events` audit trail (`L-07`) | **NOT BUILT** |
| Lead capture → Supabase → Resend | IMPLEMENTED |
| Slack notification | Code path IMPLEMENTED; unconfigured |
| Lead **retention / erasure** | **NOT IMPLEMENTED** |
| `notified_at` stamping / speed-to-lead | **NOT BUILT** (`submit.ts:29-31`) |
| Honeypot / rate limit / CAPTCHA | **NOT BUILT** |
| IP / user-agent capture | **Deliberately absent** |
| RLS: anon insert-only on `leads` | IMPLEMENTED — **verified live** |
| Five legal routes with draft banner | IMPLEMENTED |
| Separate consumer vs business terms | **NOT BUILT** (§5.2) |
| VAT net/gross on prices (`M-P2-3`) | **NOT BUILT** |
| Estimator / Path Finder / division sub-routes | **NOT BUILT** |
| Screen-reader pass | **NEVER PERFORMED** |

---

## 8. Open questions for the owner

Each is a fact the drafts will need that **could not be established** from the repository or the
running site. None has been filled with a default.

1. **Sanity data region.** `sanity/project.ts:15` fixes project `spzu6y31`; nothing in the repository
   records which region that project's dataset is hosted in. Which region, and is a DPA in place?
2. **Supabase region for the project actually in use.** `PROJECT_URL` points at project ref
   `dqiutgmxillhsbzgnlsx`. That project is **not** in the Supabase account reachable from this
   session (which holds only `ovnrjyntwaswpyhgcebe`, `eu-west-1`, INACTIVE). The live project's region
   is therefore **unestablished** and must not be assumed to be EU.
3. **Vercel region and function region.** `vercel.json` pins no region. Where do the Server Actions
   execute, and where are Vercel's logs (which capture visitor IPs) retained and for how long?
4. **Resend region and DPA.** `notify.ts:101` posts to `api.resend.com` with no region parameter.
   Where does Resend store the notification and its recipient data?
5. **GA4 controller/processor position and the Google Ads data-sharing settings** — these are account
   settings, not code, and cannot be read from the repository.
6. **Slack**: is it intended to be enabled? If so it becomes a processor receiving enquirers' names,
   and needs to appear in the privacy notice and a DPA before `SLACK_LEADS_WEBHOOK` is set.
7. **Should the drafts describe GA4/PostHog as they are (script loaded, never initialised, no data
   collected, no analytics cookie) or as intended?** A cookie policy listing `_ga` and `ph_*` cookies
   today would describe cookies that do not exist. This is a choice about whether to document
   current or planned behaviour, and it changes the cookie table materially.
8. **Vercel platform logging.** The application captures no IP or user-agent, but the hosting platform
   does. What is retained, where, and for how long?
9. **Lead retention period.** Nothing is implemented and nothing is scheduled. What period should the
   privacy notice state, and who will build the deletion job?
10. **`ad_storage` and `functionality_storage` gate nothing.** Should the banner keep offering two
    toggles that control no behaviour? Offering a switch that does nothing is itself a
    representation to the visitor.
11. **No consent audit trail exists.** The only record of a consent choice is a cookie in the
    visitor's own browser, with no timestamp and no version. Is that acceptable, or must `L-07` be
    built before launch?
12. **`/gridsmith-lead-probe` and `/gridsmith-timeout-probe`** are route handlers excluded at
    *runtime*, not removed from the production build (`next.config.ts:51-57`). Confirm they cannot
    accept a real submission on the live site.
13. **One `Client Terms` route, two client-terms drafts.** `MSA-BUSINESS.md` and `CONSUMER-TERMS.md`
    both map to `/legal/client-terms`, and the seeded document mixes Companies Act and Consumer Rights
    Act bases in one instrument. Should there be a sixth slug, and how does a visitor get routed to
    the right one — particularly a Press author, who is a consumer?
14. **VAT treatment on displayed prices.** No price on the site states inclusive or exclusive. Press
    is consumer-facing and uses the same `Price` component. What treatment applies per division, and
    who builds `M-P2-3`?
15. **Are `companyNumber` 17050842 and registered office `30 Briarfield Road, Farnworth, Bolton,
    BL4 0HD` confirmed correct?** They are written into a file named `seed-company-details.mjs`
    alongside a value explicitly marked `[SEED]`, so the file itself does not distinguish which of its
    values are verified. And: **what is the VAT number, or has registration completed?**
16. **ICO registration.** `icoRegistration` exists in the schema (`companyDetails.ts:47`) and is
    **never populated or rendered anywhere**. Is Gridsmith Ltd registered with the ICO and paying the
    data protection fee, and what is the registration number?
17. **`contactPhone` and `businessHours`** are schema fields that are never populated. Is there a
    telephone contact route, and what are the business hours the response commitment refers to?
18. **Six of the seven legal routes are not covered by the accessibility gate** (corrected
    26 August 2026 from "four of the five"). Should `/legal/cookies`, `/legal/terms`,
    `/legal/client-terms`, `/legal/business-client-terms`, `/legal/consumer-client-terms` and
    `/legal/accessibility` be added to `check-axe.mjs:48-74` before the accessibility statement
    claims automated coverage? The two client-terms instruments are the documents a buyer is most
    likely to read before deciding, and both are outside the gate.
19. **The screen-reader pass.** It has never happened. The accessibility statement cannot honestly
    describe manual testing until it does. When, and by whom?
20. **Testimonials.** `Testimonials.tsx:16` says six are real public Freelancer reviews. Confirm the
    reviewers consented to being quoted on the company website, and that the attributions shown are
    accurate.
21. **Analytics retention.** The seeded cookie policy states 14 months as a `[DECISION]` default. No
    code configures any retention. Confirm the intended GA4 and PostHog retention settings.

---

*End of inventory. Facts only — no corrections, no drafting, no legal citation. Those are Pass 2 and
Pass 3.*
