# GS-PROD-001 — Production preparation / launch-blocker closure

## Authority and boundary

1 October 2026. Starting point: the verified programme baseline `GS-INT-002`, HEAD and remote
`staging/gs-press-001-press` = `87e61d3365b20b361ebf3cf9914e99b24e7618ca` (CI `36909143672`, 47/47),
main `fbecbe01e7fb594c6163dab57514997cb248fc21` (untouched). Master, Design, Digital, Press, Shared and
the integration architecture are frozen; nothing visible was redesigned.

**Not done in this phase, by instruction:** no production CMS migration, no Sanity or Supabase write
(development or production), no Vercel environment change, no DNS change, no merge to `main`, no valid
form submission, no production deployment. The only production read was one unauthenticated count of
the production dataset (0 documents).

**A PASS here means** the source-side launch blockers that can be settled before the CMS migration are
settled, the migration is specified and scripted (dry run), and every remaining gate is named with its
owner action. It does **not** mean production is migrated, forms are proven, or cutover is ready.

## Owner decisions applied

1. **Brand language = studio; legal/statutory language = trading division** (the phase brief).
2. **`/terms-and-conditions/` → `/legal/client-terms`** (asked and answered in this phase; it closes
   the redirect limb of `GS-O007` — `LIVE-SITE-EXTRACT.md` §13.3 option 1).

## A. Brand terminology — every remaining occurrence classified

`GS-INT-002`'s inventory (served text and metadata of all 66 routes) is the list; each sentence was
read, not searched-and-replaced.

| Where | Sentence | Class | Action |
|---|---|---|---|
| Approach intro | *"…the same six whichever division does the work."* | brand | → **studio** |
| Approach §one-company | *"Gridsmith Design, Gridsmith Digital and Gridsmith Press are trading divisions of Gridsmith Ltd, not separate companies."* | statutory/legal relationship | kept |
| Approach §one-company | *"Where a project needs two divisions…"* | brand | → **two studios** |
| Approach §continuity | *"…a real relationship that moved between divisions."* | brand | → **between studios** |
| Approach §limits | *"Three divisions is not every discipline."* | brand | → **Three studios** |
| About §structure | *"All three are trading divisions of Gridsmith Ltd."* | statutory/legal relationship | kept |
| About §structure | *"Most clients arrive needing one division."* | brand | → **one studio** |
| About §role | *"…run it through the division that does that kind of work."* | brand | → **the studio** |
| About intro | *"One company, three specialist divisions"* — **development CMS only**; the repository already says "studios" | stale CMS | not written (no CMS tidy); the migration builds from the repository, and its preflight refuses the stale wording (proven below) |
| Design — campaign creative (×2) | *"a separate cross-division Gridsmith engagement"*, *"as a separate cross-division engagement"* | brand | → **cross-studio** |
| Digital — technical SEO | *"…scoped as one engagement across both divisions."* | brand | → **both studios** |
| Press — content SEO | *"…scoped together across the two divisions."* | brand | → **two studios** |
| Shared footer (every route) | *"One UK company. Design, Digital and Press are its trading divisions."* | statutory/legal relationship beside the reg. 25(2) disclosure (owner-approved at `GS-SHARED-001-RC`) | kept |
| `/press/contact/thank-you` | *"Gridsmith Press is one of three trading divisions of Gridsmith Ltd."* | legal-entity statement | kept |
| Studio metadata, `/digital` close notes, `/` disclosure | *"…is a trading division of Gridsmith Ltd."* / *"…are trading divisions of Gridsmith Ltd, registered in England…"* | statutory clause | kept |
| `/legal/*` | instrument text | `_legal/` | not amended |

The About/Approach and service edits are in the **repository sources** (`scripts/seed-content.mjs`,
`scripts/service-content.mjs`) — the migration source. The development CMS still carries the old
wording, so staging renders it until migration, by design: writing development merely to tidy it was
excluded. `docs/_shared/GS-P05-OWNER-CONTENT-REVIEW.md` was regenerated (its source hash guard requires
it); the diff is exactly the four service sentences.

**Gates.** `check:company` question 10 is preserved unchanged (it governs served metadata, which was
already clean). The new copy is protected where it lives: the migration preflight refuses any
"division(s)"/"department(s)" in migrated brand copy outside *"trading division(s) of Gridsmith Ltd"*.
Proven red against the real source by restoring *"one division"* in About (`grouppage-about: brand copy
says "division"`), restored byte-identical; the selftest also refuses the stale development intro
verbatim and accepts the statutory relationship sentence.

## B. Form bot protection

**Existing (`GS-INT-002` F6):** Zod bounds and the server-only writer only.

**Implemented — the smallest server-enforced design:**

1. **Honeypot.** `components/leads/Honeypot.tsx` renders `<div hidden><label>…<input name="website"
   tabIndex={-1} autoComplete="off"></label></div>` in both forms (`ContactForm`, `PressContactFlow`).
   `hidden` removes it from rendering, the tab order and the accessibility tree, and browsers do not
   autofill a non-rendered field, while its value still submits (the property the Press flow's hidden
   steps already rely on). `lib/leads/guard.ts` `isTrapped()` is checked **first** in both Server
   Action adapters (`lib/leads/action.ts`, `lib/leads/pressAction.ts`); a filled trap answers exactly as
   a success does (`ok` / redirect to the Press confirmation) and writes nothing, sends nothing.
2. **Basic abuse validation.** `leadSchema.full_name` refuses a web address (`https?://`, `www.`) —
   a spam signature, never a name. Visible, field-level, correctable (`Your name cannot contain a web
   address`), through the existing accessible error path; both forms reach it via `submitLead`.

**Not implemented, deliberately:**

- **Timing check.** Every form page is static: the server has no per-visitor render time, and a client
  timestamp is the visitor's clock (skew would reject real people). A trap that can fire on a human is
  worse than none.
- **Application rate limit.** No store in this stack holds one reliably across serverless instances
  without recording visitor IPs, which `PROJECT-RULES.md` §6 and the privacy notice exclude. It belongs
  in **Vercel Firewall** (configuration, owner/cutover): a rate-limit rule on `POST` to `/contact` and
  `/press/contact` (Server Actions post to the page path), e.g. a few requests per minute per IP, action
  *deny* (429). No code, no stored IP.
- **Cloudflare Turnstile.** A third-party script with CSP (`script-src`/`frame-src`/`connect-src`),
  privacy-notice (`_legal/`, solicitor) and per-environment key consequences, for no observed spam yet.
  It is the escalation if spam passes the layers above; it would need site/secret keys per environment
  (Preview test keys, Production real keys), the secret server-only.

**Client impact.** No new state, effect or script; one static `<div hidden>` per form. Measured on the
clean build: `/contact` 8.1 → 8.5KB, `/press/contact` 9.2 → 9.6KB gz (budgets 15 / 20KB). The extra
~0.4KB is webpack chunk overhead — the honeypot is the module that tipped the two routes' shared form
primitives into their own split chunk (`7743-…`, loaded by those two routes only). `/`, every studio
landing page and both lazy scenes are byte-identical (Master `2588.a867b59e…` 6.2KB, Design
`9276.d57f0630…` 7.9KB). No LCP path is touched.

**Gate — `check:lead-security`, extended (not a new gate).** Runs the real adapters under
`--conditions=react-server` with dummy credentials and `fetch` mocked to answer HTTP 599, so nothing can
be written anywhere. A **control** (clean form) must reach the insert exactly once — that is what makes
the trap readings evidence. Asserted: four `isTrapped` return values (absent, empty, string, file);
trapped main submission → `ok`, 0 network calls; trapped Press submission → redirect to the
confirmation, 0 calls; linked name → `invalid` on `full_name`, 0 calls; an ordinary name with an
apostrophe and hyphen accepted; both forms render `<Honeypot />`.
**Deliberate failures (each restored byte-identical):** guard removed from `action.ts` → *"a trapped
submission must look like success"*; from `pressAction.ts` → *"did not redirect to the confirmation"*;
schema refine neutralised → *"a link in the name field was accepted"*; `isTrapped` narrowed to strings
→ *"file in trap not detected"*; `<Honeypot />` removed from the Press form → *"does not render the bot
trap"*.

**Forms safety.** No valid submission was made anywhere; every submission in this phase was in-process
with mocked network. Preview behaviour for a valid submission is unchanged (`error` before any insert —
no service-role key on Preview).

## C. Legacy redirects

The eight live WordPress URLs (`LIVE-SITE-EXTRACT.md` §13.1, read from the site's own `wp-sitemap.xml`):

| Old URL | Destination | Status | Reason |
|---|---|---|---|
| `/` | `/` | 200 | same address |
| `/privacy-policy/` | `/legal/privacy` | **308**, one hop | same instrument class; `PRIVACY-POLICY.md` is its successor |
| `/terms-and-conditions/` | `/legal/client-terms` | **308**, one hop | owner decision: the old combined instrument has three successors; the disambiguation page routes each reader |
| `/hello-world/` | — | 308 → `/hello-world` → 404 | WordPress default post; no successor (a redirect to `/` would be a soft 404) |
| `/category/uncategorized/` | — | 308 → slashless → 404 | default taxonomy archive of the above |
| `/uicore-cd/ui-cd-to/` | — | 308 → slashless → 404 | theme template published by accident |
| `/uicore-cd/ui-cd-wp/` | — | 308 → slashless → 404 | the same |
| `/?uicore-tb=it-business-footer` | `/` | 200 | a query on `/`; Next matches the pathname |

Sources are `/privacy-policy{/}?` and `/terms-and-conditions{/}?` (with or without the slash). Query
strings are preserved (`/terms-and-conditions/?ref=x` → `/legal/client-terms?ref=x`).

**No chains.** Next 15 unshifts its own `/:path+/ → /:path+` redirect ahead of every custom redirect
(`next/dist/lib/load-custom-routes.js`), and every legacy URL ends in `/`, so a plain `redirects()` entry
is two hops. `next.config.ts` sets `skipTrailingSlashRedirect: true` and re-adds the identical rule
**after** the legacy map. No middleware. The flag also inlines `__NEXT_MANUAL_TRAILING_SLASH` into the
client router's `normalizePathTrailingSlash`, which then leaves hrefs as written — this site's internal
hrefs carry no trailing slash, and the measured route deltas did not move (`/` 5.6KB, studios unchanged).

**Gate — `check:redirects`** (served; in `verify:served` and CI). Expectations written in the gate, not
read from `legacy.json`: 5 legacy forms are one 308 to their destination which answers 200 itself;
4 WordPress defaults take the site-wide slash 308 once and then 404 (the same as any unknown slashed URL; no redirect to an unrelated page); `/` and the theme query 200; `/about/`, `/legal/privacy/` and a service URL
with a slash are still one 308 to a 200 (the re-added rule works). Its four lists are registered in
`check:lists` as unrelated (disjoint URL classes).

## D–F. Owner gates

### `GS-O003` — solicitor review

**Open.** No dated written review exists in the repository or the register. Required from the owner /
solicitor before legal documents migrate (`OWNER-ACTIONS.md` `GS-O003`): the legal set (`docs/_legal/`
privacy, cookies, website terms, business MSA, consumer terms, accessibility, plus the client-terms
disambiguation) reviewed by a UK solicitor; a **dated written review and a closed decision list**
covering consumer cancellation, portfolio permission/defaults, quotation wording, liability and privacy
actions; the reviewed text supplied as the migration source (it replaces `seed-legal.mjs`'s internal
drafts). The `[SEED - SOLICITOR REVIEW REQUIRED]` development markers stay. **Blocks:** legal-document
migration and cutover. Does not block the non-legal migration (47 documents).

### `GS-O010` — Preview isolation

**Open.** Vercel environment re-read today, names and targets only (no value decrypted):

| Variable | Current targets |
|---|---|
| `SUPABASE_SERVICE_ROLE_KEY`, `CRON_SECRET` | Production only |
| `DIRECT_CONNECTION_STRING`, `SANITY_API_WRITE_TOKEN`, `VERCEL_OIDC_TOKEN` | one shared entry, Preview + Production |
| `PROJECT_URL`, `PUBLISHABLE_KEY`, `RESEND_API_KEY`, `LEAD_NOTIFICATION_FROM`, `LEAD_NOTIFICATION_EMAIL`, `NEXT_PUBLIC_SANITY_DATASET` | separate Development / Preview / Production entries |
| `NEXT_PUBLIC_GA4_ID`, `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST` | all three; read by no code |
| `NEXT_PUBLIC_SITE_URL` | not set |

**Exact change plan (owner, Vercel dashboard; no value in chat or source):**
1. Provision a non-production Supabase project (free tier; explicit approval if it would cost), apply
   `supabase/migrations` to it (`npm run migrate` with that project's connection string, locally).
2. Preview `PROJECT_URL` and `PUBLISHABLE_KEY` → the isolated project; add a **Preview-scoped**
   `SUPABASE_SERVICE_ROLE_KEY` from the isolated project.
3. Remove `DIRECT_CONNECTION_STRING` from Preview (the runtime never reads it; scripts run locally) —
   split the shared record so Production keeps it only if wanted, or remove it from Vercel entirely.
4. Remove `SANITY_API_WRITE_TOKEN` from Preview (runtime never reads it) — same split.
5. Preview mail: `LEAD_NOTIFICATION_EMAIL` → a test inbox; `RESEND_API_KEY` → a separate Resend key
   (or a test key); `LEAD_NOTIFICATION_FROM` on a verified sender.
6. Redeploy Preview; one synthetic submission per form; verify the row in the isolated table and the
   mail in the test inbox; record. **Blocks:** cutover (forms unproven), not the CMS migration.

### `GS-O021` — TikTok logo permission

**Open; no permission is claimed.** The TikTok mark renders in **the shared footer's social row on
every route** and in **About's Connect section**, from `lib/company/social.ts:77` (the channel) and
`components/chrome/platformMarks.ts:31` (the simple-icons path). Cutover options:
- **A** — written permission from TikTok covering this use received and filed (and, if supplied, the
  official asset replaces the simple-icons path); the mark stays.
- **B** — before cutover, remove the TikTok branded mark: render the TikTok channel as a text link (or
  drop the channel), keeping `check:company`'s `SOCIAL_URLS` in step. Visible change → owner review.
**Blocks:** cutover only.

### `GS-O022` — Freelancer asset

**Optional.** Provisional simple-icons mark stays; the official review source (`lib/reviews/
freelancer.ts`, server-side, no credential) is unchanged. Does not block migration or cutover; no
unofficial asset substituted.

### `GS-O005` — professional scope (Technical)

**Open** (`OWNER-ACTIONS.md`: ACTIONABLE NOW, no broker/insurer confirmation recorded). The three
Technical services — `cad-drafting`, `engineering-drawings`, `technical-documentation` — are **not
eligible**; `check:launch` refuses them on production and the migration excludes them. Two eligible
services (`technical-illustration`, `3d-modelling`) referenced a Technical service in
`relatedServices`; the reference is dropped in the production payload rather than left dangling.

## G. Production CMS migration manifest

`docs/_shared/GS-PROD-001-CMS-MANIFEST.json` — generated by `scripts/migrate-production-cms.mjs`,
57 entries, **47 eligible**. Development today: 121 documents (114 seed); production: **0** (read
today, unauthenticated).

| Type | Production id | Slug | Source | Gate | Eligible |
|---|---|---|---|---|---|
| `companyDetails` | `companyDetails` (singleton) | — | `seed-company-details.mjs` (owner-confirmed facts, `GS-O004`) | — | **1** |
| `groupPage` | `grouppage-about`, `grouppage-approach` | `about`, `approach` | `seed-content.mjs` (studio wording) | — | **2** |
| `service` Design | `service-design-<slug>` | 16 slugs | `service-content.mjs` (`GS-O013` approved with remediation) | 3 Technical → `GS-O005` | **13** of 16 |
| `service` Digital | `service-digital-<slug>` | 17 | same | — | **17** |
| `service` Press | `service-press-<slug>` | 14 | same | — | **14** |
| `legalDocument` | `legal-<slug>` | the 7 legal slugs | the solicitor-reviewed text | `GS-O003` | **0** of 7 |

**Never migrated:** `faq` (45, `[SEED]`, unrendered), `teamMember` (4, `[SEED]`, unrendered), `post` (9
editorial briefs, `status: brief`), `testimonial` (6 — reviews come from Freelancer, not the CMS), any
development-only or probe record. **Insights stays empty** (no post is created). No
`pathFinderConfig` (the Path Finder is withheld). **Assets:** none — 0 Sanity assets in either dataset;
brand and platform marks are repository static files (`public/brand/`, `platformMarks.ts`); the only
external source is the Freelancer profile, read at runtime. No client portfolio asset.
**IDs/slugs:** production ids drop the `seed-` prefix (no dot, `isSeed: false`), slugs are unchanged
from the repository (so the 47 service URLs are unchanged), `relatedServices` references are rewritten
to production ids; services → capability groups are code (`lib/services/architecture.ts`), not
references.

## Migration script — `scripts/migrate-production-cms.mjs`

| Mode | Effect |
|---|---|
| default (`npm run check:cms:migration`, in `verify:static` and CI) | builds the payload from the repository, runs the preflight and an 11-case selftest, asserts the committed manifest equals what the source produces. Offline; nothing read or written |
| `--write-manifest` (`npm run cms:migration:manifest`) | regenerates the manifest (a reviewed diff) |
| `--read-production` | one unauthenticated count of production. Read-only |
| `--write` / `--rollback` | refused unless **all** of `--dataset=production`, `GS_PRODUCTION_CMS_CONFIRM=write-production`, `SANITY_API_WRITE_TOKEN` and `--backup=<existing export file>`. **Not executed** |

**Preflight** refuses: a `seed-` or dotted id, `isSeed` not false, a `[SEED]` marker, brand "division"
wording, a Technical service, a legal document, a dangling reference, a lost record (counts 1 / 2 /
13·17·14 written in the script), duplicate ids or slugs. **Selftest** asserts each refusal by return
value plus the clean payload and the statutory sentence passing. **Idempotency:** `--write` refuses a
production dataset holding any id outside the manifest, then `createOrReplace`s the manifest ids — a
re-run is a no-op. **Rollback mapping:** the manifest's eligible ids; `--rollback` deletes exactly those.
Both read back unauthenticated (expected count, seed 0). **No dev/prod confusion:** the dataset is the
constant `PRODUCTION_DATASET`, must also be named on the command line, and the script never reads
`development`. Guard proofs: `--write` with nothing set → 4 refusals; `--rollback --dataset=development`
→ refused; both before any request.

### Backup / export (process; not run — production is empty)

Outside the repository, with a Sanity CLI login that can read both datasets:

```
npx sanity dataset export development  %USERPROFILE%\gridsmith-backups\sanity-development-YYYYMMDD.tar.gz
npx sanity dataset export production   %USERPROFILE%\gridsmith-backups\sanity-production-YYYYMMDD.tar.gz
```

The production export is the `--backup=` file the write mode requires. Never commit either archive.

### Migration sequence (the next phase, not executed)

1. Owner approvals in hand (non-legal content: done — studio terminology applied, `GS-O013` closed).
2. `npm run check:cms:migration` green; `node scripts/migrate-production-cms.mjs --read-production` = 0.
3. Both exports above.
4. `GS_PRODUCTION_CMS_CONFIRM=write-production SANITY_API_WRITE_TOKEN=… node scripts/migrate-production-cms.mjs --write --dataset=production --backup=<production export>` (an editor token, revoked afterwards).
5. Verify: the script's read-back; `NEXT_PUBLIC_SANITY_DATASET=production npm run build` on a clean
   `.next` with `BEFORE-LAUNCH.md` §16's five-point record (`/legal/*` will be absent until `GS-O003`).
6. Legal documents follow separately after `GS-O003`, through a manifest extension reviewed then.

## Production environment checklist (names and targets — never values)

| Name / setting | Production | Preview | Note |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://gridsmith.uk`, **at cutover** | unset | enables `robots`/`sitemap` with `VERCEL_ENV=production` |
| Sanity project | `spzu6y31` (code, `sanity/project.ts`) | same | not an env var |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` (after migration) | `development` | `check:launch` is the deploy `prebuild` |
| `SANITY_API_WRITE_TOKEN` | remove from Vercel | **remove** | runtime never reads it; migration runs locally |
| `DIRECT_CONNECTION_STRING` | remove from Vercel (or Production only) | **remove** | runtime never reads it |
| `PROJECT_URL`, `PUBLISHABLE_KEY` | production Supabase | isolated project | `GS-O010` |
| `SUPABASE_SERVICE_ROLE_KEY` | present | **add, isolated** | server-only; `lint:secrets` scans bundles |
| `RESEND_API_KEY`, `LEAD_NOTIFICATION_FROM`, `LEAD_NOTIFICATION_EMAIL` | verified `gridsmith.uk` sender, SPF merged (`BEFORE-LAUNCH.md` §14) | test key / test inbox | |
| `CRON_SECRET` | present | — | `/api/rls-drift` cron |
| `NEXT_PUBLIC_GA4_ID`, `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST` | **remove** | **remove** | analytics removed 26 Aug |
| Review integration | none to set | none | Freelancer profile URL in code, no credential |
| Vercel target | production branch `main`, Node 24 (`BEFORE-LAUNCH.md` §12) | branch deploys, SSO protection on | |
| Vercel Firewall | rate-limit rule on `POST /contact`, `POST /press/contact` | optional | bot protection layer 3 |
| Production alias | `gridsmith.uk` (+ `www`) added to the project **at cutover** | — | |
| DNS | Hostinger → Vercel **at cutover**; keep the WordPress records for rollback | — | `GS-O009` |
| Sanity Studio CORS | production origin (`BEFORE-LAUNCH.md` §15) | — | |
| Indexing | after cutover: robots allows, sitemap lists 65 pages, Search Console | `noindex` | |

## Security

`npm audit --omit=dev` **0 vulnerabilities**. `lint:secrets` (client-bundle secret scan) **PASS** and
`check:security-headers` **PASS** on the clean build. No secret is client-side: the
honeypot needs none; the migration token is read from the environment by name, never printed. No
credential was read, decrypted, rotated or printed in this phase.

## Classification

| Item | Classification |
|---|---|
| Studio terminology (source) | **CLOSED** |
| Stale About intro in development | **READY FOR MIGRATION** — the repository source migrates; preflight refuses the stale string |
| Bot protection (honeypot + name validation) | **CLOSED** (code); Vercel Firewall rate limit **READY FOR OWNER ACTION** at cutover |
| Legacy redirects incl. `/terms-and-conditions/` | **CLOSED** |
| `GS-O007` redirect limb | **CLOSED** (owner decision this phase) |
| Non-legal CMS content (47 docs) | **READY FOR MIGRATION** |
| `GS-O003` | **BLOCKS MIGRATION** (legal documents only) and **BLOCKS CUTOVER** |
| `GS-O005` | **BLOCKS MIGRATION** (3 Technical services only); does not block cutover — they are simply not published |
| `GS-O010` | **READY FOR OWNER ACTION**; **BLOCKS CUTOVER** |
| `GS-O021` | **READY FOR OWNER ACTION** (A or B); **BLOCKS CUTOVER** |
| `GS-O022` | **OPTIONAL** |
| Production env checklist | **READY FOR OWNER ACTION** at cutover |
| Cookie prepaint frame, mixed-colour parser guard | deferred (unchanged) |

## Verification

Local: clean detached worktree at `87e61d33` + this change, no `.env.local`, `npm ci`, `.next` wiped,
development dataset, port 3210. The exact SHA, CI run, Lighthouse and protected Preview are recorded in
the release handoff (the commit cannot contain its own hash), as in the previous RCs.

- `verify:static` **PASS** (incl. extended `check:lead-security`, new `check:cms:migration`,
  `check:lists` with the redirect gate's four lists registered, `check:service-content` owner-document
  parity after regeneration, `check:company:selftest` 77 cases unchanged).
- `verify:build` **PASS** — `/` 5.6KB of 15, `/contact` 8.5 of 15, `/design` 3.9 of 25, `/digital`
  5.6 of 15, `/press` 4.6 of 20, `/press/contact` 9.6 of 20; shared baseline 2.7KB; Master scene (lazy)
  6.2KB of 8 and Design scene (lazy) 7.9KB of 8, both chunks byte-identical to the baseline;
  `lint:secrets` PASS.
- `verify:served` — 19 of 20 commands PASS first run: axe 76 analyses zero violations (+2 deferred
  footer), security headers, `check:launch` (development; 114 seed / 3 Technical refused on production
  only), responsive 51 combinations, consumer terms, legal parity **6 / 94 / 339**, VAT, Press type and
  scene, Path Finder live, service content + development dataset, reviews UI, **company 10 questions over
  18 routes**, Master scene 14 questions, Master hero, Design scene, Digital scene. Lighthouse
  desktop/mobile skipped on Windows by design (CI measures them). The 20th, `check:redirects`, was red
  on its own expectation for the WordPress defaults (it expected a direct 404; the correct behaviour is
  the site-wide slash 308 then 404, as for any unknown slashed URL). Expectation corrected; re-run
  **PASS** — 5 legacy forms one 308 to a 200 (query kept), 4 defaults one slash 308 then 404, 2 root
  forms 200, 3 slashed URLs one 308 to a 200.
- `check:redirects` deliberate failures, mutating the served `.next/routes-manifest.json` and restoring
  it byte-identical: the framework's order (slash rule first) → red, *"/privacy-policy/: redirects to
  /privacy-policy, expected /legal/privacy"* (the chain this change removes); the terms row deleted →
  red on the three terms forms; the slash rule deleted → red, 7 problems.
- `npm audit --omit=dev` 0; production dataset read: 0 documents.
