> **GS-PROD-004B (2 October 2026) — TikTok mark retained by owner decision; `/design` scope note corrected:** **`GS-O021` CLOSED BY OWNER DECISION** — the owner reviewed the brand-use concern and chose to keep the TikTok mark (owner-accepted risk); **no written TikTok permission is recorded or claimed**; the `GS-PROD-004A` text-link prototype was rejected and discarded, so the TikTok implementation is byte-identical to the approved baseline (served build: footer and `/about` marks, link and accessible name unchanged). `/design` Technical note: "…professional-scope ~~and insurance~~ confirmation." (owner-approved two-word deletion; `check:design:scene` PASS, scope note 6.69:1). `e6f5691e`'s CI failure was `/press` mobile TBT 207.7ms vs 200 on a docs-only commit, with every route uniformly slower in that run than in `7f6472b2`'s (runner variance); the job was re-run, no gate altered. `GS-X002` OPEN (Technical only), `GS-O024` deferred, `GS-O003` OPEN. No production write; main untouched. Evidence: `docs/_shared/GS-PROD-004B.md`.

> **GS-PROD-004A (2 October 2026) — owner-gate reduction + `GS-X002` review pack; OWNER ACTION REQUIRED, no production write:** Baseline `7f6472b2` CI `37010155414` and `028bd1d5` CI `37006558824` both success 48/48. **`GS-O021`:** no TikTok permission on record, so the fallback the record itself names is prepared **locally and uncommitted** — the `TikTok` entry removed from `platformMarks.ts`; the footer shows the plain word "TikTok" (same link and accessible name, 13.26:1, no 375px overflow) and `/about` keeps its label with an empty icon slot; awaits owner visual approval. **`GS-X002`:** self-contained reviewer brief `docs/_shared/GS-X002-REVIEW-PACK.md` (exact public copy, 76 strings verified verbatim; boundaries; questions A–E; closure evidence; no legal or insurance review); stays OPEN. **Finding:** `/design`'s Technical note still says services "remain subject to professional-scope and insurance confirmation" — proposed deletion of "and insurance" awaits owner copy approval. **`GS-O003` handoff:** three facts made explicit (insurance not a launch prerequisite; not a claim of zero liability; MSA §12 broader than the public scope). Blocker register reconciled in `PROJECT-STATUS.md`. Main, deployment, DNS, Sanity and Supabase untouched. Evidence: `docs/_shared/GS-PROD-004A.md`.

> **GS-PROD-003-R1 (2 October 2026) — owner scope decision + `GS-T004` applied; PARTIAL PASS:** **`GS-O005` CLOSED BY OWNER SCOPE / RISK DECISION** — Gridsmith does not currently carry PI cover for the Technical/CAD services and will not make it a launch prerequisite (deferred, non-blocking `GS-O024`); scope stays limited (drafting/preparation to a client's brief; no design, calculation, approval, certification, stamping, sign-off or responsible-designer role); **not a claim of zero liability** and never advertised as insured or uninsured; contract wording stays with `GS-O003` (solicitor note added: `MSA-BUSINESS.md` §12/§16 and the PI-limit `[TK]` under UCTA s. 11(4)(b); no clause drafted). `professionalScopeConfirmed` now means only that `GS-X002` has confirmed limited scope — messages, schema description, manifest gate (`GS-X002`) and specs updated, old wording struck and registered (`check:struck` `GS-O005-PI-COVER-PUBLICATION-GATE`); `check:launch` selftest forbids PI/GS-O005 wording (proven red by isolated mutation). **`GS-X002` retained** (owner choice): a claims review independent of insurance, now the only gate on the 3 Technical services — **not migrated**, Production Sanity stays 47. Technical copy re-checked clean, unchanged. **`GS-T004` APPLIED:** `GS-O023` closed on owner provenance (key re-entered from `dqiutgmxillhsbzgnlsx`); verified `pg_dump` backup outside the repo (restore test 5 tables / 63 leads); `npm run migrate` applied exactly 0004 (`bd761ff9b9e4`); Production now equals Preview (RLS 5/5, 0 policies, 0 public grants, 18 lead constraints, identical definition hash); leads 63, row fingerprint unchanged; anon PostgREST 401; service-role write remains a cutover smoke-test proof. No deployment, alias, DNS, Sanity write, lead or form action; main untouched. Evidence: `docs/_shared/GS-PROD-003-R1.md`.

> **GS-PROD-003 (2 October 2026) — Production database security parity + `GS-O005`; OWNER ACTION REQUIRED, no production write:** Against runtime `1542f508` (docs `7969dcbd`, no runtime change). **`GS-T004` not applied.** Migration 0004 (`20260911203125_gs_p01_security_hardening.sql`, runner SHA `bd761ff9b9e4`) read in full: drops the `leads` "anon insert only" policy, revokes `anon`/`authenticated` on the 5 tables + `events_id_seq`, enables ledger RLS, adds 17 validated CHECKs on `leads`, revokes future `postgres` defaults — security-only/non-destructive, no DML. Preview recomputed as the post-0004 state (RLS 5/5, 0 policies, 0 public grants, 18 `leads` constraints, 5 indexes, views `security_invoker`). Production read-only: ledger 0001–0003 (SHAs match), ledger RLS off, 1 policy, full `anon`/`authenticated` grants, 63 leads, **0 rows violating each of the 17 checks**; only 0004 pending. **Stopped on the credential condition:** Production `SUPABASE_SERVICE_ROLE_KEY` and `PROJECT_URL` are Vercel `sensitive` (write-only), and the only READY production deployment is the `3fbc518f` scaffold with no lead code, so no server-side proof exists without a Production deployment — new owner action `GS-O023` (re-enter from the Gridsmith Project, or explicitly defer proof to the cutover smoke test). No backup taken (not eligible). The removed anon policy has no consumer in any deployable build (server-only writer since `daf192f1`). **`GS-O005` = C, external/broker confirmation** (written PI coverage for CAD drafting, drawing preparation and technical documentation; `GS-X002` also gates `professionalScopeConfirmed`); Technical copy reviewed clean (explicit no-design/no-calculation/no-certification/no-sign-off exclusions), no copy change proposed; not migrated — Production Sanity stays 47 (Technical 0, legal 0). Supabase free-plan pause recorded only. No deployment, alias, DNS, env, Supabase/Sanity write, lead or form action; main untouched. Evidence: `docs/_shared/GS-PROD-003.md`.

> **GS-O010-R2 (2 October 2026) — Preview isolation and end-to-end form proof; `GS-O010` CLOSED:** New free Supabase project `gridsmith-preview` (`qfgpwumvvtizeamkynes`, eu-west-1, Gridsmith Org) with the four repository migrations and the runner's ledger (RLS on all 5 tables, 0 policies, 0 anon/authenticated grants). Vercel Preview `PROJECT_URL`/`PUBLISHABLE_KEY` → that project; a Preview-only `SUPABASE_SERVICE_ROLE_KEY` (owner-entered); Preview `LEAD_NOTIFICATION_EMAIL` = `contact@gridsmith.uk` (owner choice); `DIRECT_CONNECTION_STRING`/`SANITY_API_WRITE_TOKEN` Production-only since R1. Production project `dqiutgmxillhsbzgnlsx` was **paused** (free plan) and was restored on owner approval for read-only snapshots — a cutover-readiness item. **Runtime defect found by the first valid Press submission and fixed at `1542f508`:** a blank optional answer (manuscript link, `triedElsewhere`) reached `leadSchema.payload` as `undefined`, which `z.json()` rejected on a key no step renders — every author/memoir/production enquiry without a link failed; payload values are now `z.json().optional()` (stored row unchanged, no visible UX change), and `check:press:contact:selftest` composes each segment through `leadSchema` (red on author/memoir/production before, business/content controls; 34/34 after). Proof through the SSO-protected, noindex Preview UI: one `/contact` and one `/press/contact` synthetic submission landed only in Preview (correct division/segment, no duplicate); owner confirmed exactly those two notifications; honeypot and invalid (URL in name) wrote and sent nothing; Production 63 leads before and after, 0 rows in the test window, 0 markers; synthetic rows deleted (Preview 0). Confirm the Production service-role value before cutover (edited by the owner this phase). No Production deployment, alias, DNS, Sanity write (47/0 legal/0 Technical) or main change. Evidence: `docs/_shared/GS-O010-R2.md`.

> **GS-PROD-002 (1–2 October 2026) — controlled production CMS migration:** The first authorised production-content write. Against application SHA `c1dee128` (no runtime source change), one guarded `--write` of the 47 eligible documents (companyDetails 1, About/Approach group pages 2, services Design 13 / Digital 17 / Press 14) into Sanity `production`, after `verify:static` + dry run PASS, production read empty (0 public; 12 system docs only), and exports of both datasets outside the repository (production export = the `--backup`). Independent read-back: 47 documents, ids/slugs exactly the manifest, **47/47 deep-equal to the repository payload**, 87 references 0 dangling, 0 seed / `[SEED]` / Technical / legal / FAQ / team / post / testimonial; studio wording, statutory clause kept; development untouched (every `_rev` equal to its backup). Clean production-dataset build: `check:launch` live tier applying, seed 0, statutory fields present, EXIT=0 (`BEFORE-LAUNCH.md` §16, items 3–4 qualified in the record). Served locally: `check:launch` PASS, smoke + axe (0 violations, 12 analyses) + keyboard PASS; `check:company`/`axe`/`responsive`/`redirects`/`legal:parity` red only on the not-migrated `/legal/*` and Technical routes (no gate altered). **Legal not migrated (`GS-O003`); 3 Technical not migrated (`GS-O005`); Insights empty; footer `/legal/*` links 404 on production content until `GS-O003`.** No deployment, alias, DNS, Supabase, env or form action; `GS-O010` (next) and `GS-O021` open. Evidence: `docs/_shared/GS-PROD-002.md`.

> **GS-INT-002 (1 October 2026) — final integration / programme RC:** A horizontal review of the assembled staging site (Master `989dbe23`, Design + Digital `146f93a0`, Press and Shared RCs — none reopened). One integration defect: the Master group's metadata said *"Design, Digital and Press are its trading divisions."* — `/`'s description and the inherited `og:`/`twitter:` description on About, Approach, Contact, Insights and legal — public brand copy, now *"One UK company. Design, Digital and Press are its three specialist studios."* (`app/(marketing)/layout.tsx`; non-visual). New `check:company` question 10: titles, `description`, `og:*`, `twitter:*` use the studio taxonomy and only the exact statutory clause says "trading division" (`/legal/` exempt); self-test 77 cases; red on question 10 alone against the unfixed `989dbe23` (11 problems). Recorded, not changed: footer / thank-you / `/` disclosure "trading divisions" (statutory, owner-approved); About/Approach/service "division" copy in seed + development CMS (owner copy decision before migration); About intro (development CMS); cookie notice one frame on late CSS for returning visitors (deferred polish); mixed-colour parser still latent; no form bot protection (cutover decision); Preview carries the shared `DIRECT_CONNECTION_STRING` and `SANITY_API_WRITE_TOKEN`, service role production-only (`GS-O010`). Production dataset empty; migration plan and cutover sequence in the record. `GS-O003`/`GS-O010`/`GS-O021` block cutover, `GS-O022` does not. The programme baseline is verified only when this RC's exact-SHA CI succeeds, recorded in the receipt. Staging only; main, production, DNS, Sanity and Supabase untouched; no valid submission; production NOT READY. Evidence: `docs/_shared/GS-INT-002.md`.

> **GS-MASTER-001-RC (1 October 2026):** The owner-reviewed local Master candidate `GS-MASTER-001-F` (15 files, byte-identical through the Design/Digital cycle) is committed with one owner-approved correction, `GS-MASTER-001-RC-R1`: without WebGL (no-JS, Save-Data, ≤2 cores / ≤2 GB, software WebGL, failed import) the static fallback mark was `position: fixed`, so every line of `/` scrolled across it at about 1:1 (35–60 text boxes below AA per size at phone/tablet widths, 3–12 on desktop; the same at `146f93a0` — a baseline defect from `GS-R001-M` R1, ungated because question 5 measures only the WebGL scene). The fallback layer is now `position: absolute` (also under `scripting: none`): the branded hero composition, then normal readable content; no fallback closing mark, by owner decision. WebGL path unchanged. `check:master:scene` question 14 reads the fallback top to bottom with question 5's method (fixed candidate worst 7.5:1); probe `s14` re-fixes the layer and is red on 14 alone (1.13:1). Frozen: H1 *"Most companies start over with every supplier. You shouldn’t have to."*, canonical studio summaries/theses in `nav.ts`, relationship language, restrained Master offer, the WebGL story (assembled → exploded → reassembled → chain → still ring → front-on mark), review cylinder, footer-aware lift, mobile hero. Programme baseline recorded: Design + Digital remediation verified at `146f93a0` (CI `36810308636`, 47/47; `/digital` mobile LCP median 1725 of 1750). Deferred: About intro "three specialist divisions" (development CMS — CMS migration), `/` metadata "trading divisions" (shared layout — integration review). Master is verified only when this RC's exact-SHA CI succeeds, recorded in the receipt. Staging only; main, production, DNS and production CMS/database untouched; next phase is the final integration / programme RC. Evidence: `docs/_shared/GS-MASTER-001-RC.md`.

> **GS-DES-002-M1-RC (30 September 2026):** The owner approved the Design maintenance exposed when `GS-DIG-002-RC`'s exact-SHA CI (run `36734877438`, `f7e45436`) first reached `check:design:scene` on Linux and failed `detail 2.75` 1440×900 touch: *Technical Design* 3.40:1 against 4.5 (Digital's mobile LCP passed in that run: 1748 / 1745 / 1733ms, median 1745 against 1750). `GS-DES-002-M1` — the enhanced-story kicker carries its chapter surface (`--ds-surface`, following G1's paper in expanded phone disclosures); `-R1` — the Technical building **detail** recedes to 0.2 while its copy crosses it (`TECHNICAL.copyOver [2.66, 2.76]`, `copyClear [2.84, 2.90]`), outline and rig untouched; `-R2` — CSS-only landscape stage containment (`min(88%, 1056px)`, hero `min(100%, 1200px)`, `min-width: 761px` and `min-aspect-ratio: 3/2`), geometry identical up to 2133×1200. Frozen. `check:design:scene` samples 2.6 / 2.75 / 2.8 in transit across its 25 sizes and 2.8 in the detail pass; `--prove` 31 red. RC correction is gate-only: the R1 proof's 1920×1080 subject was inert (large text, 3:1; 3.13 unreceded) and moves to 2048×1152 (2.27:1). Lazy Design scene 8,121 B gz of 8,192 (not raised). Digital, Press, shared chrome and the local Master candidate (`GS-MASTER-001-F`, uncommitted, excluded) unchanged. Whether the programme gate is restored is decided by this RC's exact-SHA CI, recorded in the receipt. Staging only; main, production, DNS and production CMS/database untouched; no launch or next phase authorised. Evidence: `docs/_shared/GS-DES-002-RC.md` §GS-DES-002-M1-RC.

> **GS-DIG-002-RC (30 September 2026):** The owner approved the Digital remediation — `GS-DIG-002` (content-led Route Map pacing: hold `max(44svh, 24rem)`, map ~709ms / complete ~300ms against a 250ms floor), `GS-DIG-002-R1` (the shared footer deferred with `content-visibility: auto` on `/digital` only, `.dg-home ~ footer`; `check:axe` sets aside findings inside a skipped footer, reveals it and analyses the rendered footer through the same `record()` accounting, proven red on a 2.5:1 button) and `GS-DIG-002-R2` (Hero and Route Map are separate chapters: the Hero owns its first screen and a `data-transit` hand-off ends its demo before Route Map copy arrives; `check:digital:scene` `opening` asserts it). Frozen hierarchy: Hero → Route Map → 01 Web → 02 Software → 03 Apps → 04 Automation → 05 Operate. RC corrections are gate/dependency only: the deferred-footer proof's regex had lost its `\s` escapes (fixed), and production `undici` 7.29.0 → 7.29.1 by a single lock entry (no `package.json`, framework or Sanity change; production audit 0). The local Master candidate (`GS-MASTER-001-F`) stays uncommitted and excluded. `GS-DES-002-RC`'s own SHA `4df670d2` still failed CI on `/digital` mobile LCP; whether the programme gate is restored is decided by this RC's exact-SHA CI, recorded in the receipt. Staging only; main, production, DNS and production CMS/database untouched; no launch or next phase authorised. Evidence: `docs/_shared/GS-DIG-001-DIGITAL.md` §GS-DIG-002-RC.

> **GS-DES-002-RC (30 September 2026):** The owner visually approved the complete Gridsmith Design experience after `GS-DES-002`, `-R1` and `-R2`: continuous content-led native scrolling (copy arrives, dwells and leaves with the page; transformations only while copy passes; no chapter blink), G/S → mark → the supplied genuine 3D logo (`/_next/image` WebP, ~41.7 KB, never the 3.3 MB PNG) → structure → canonical mascot → technical construction → completed building → final 3D logo, and the R2 footer handoff (≥768px the stage stays pinned, the story runs on under the footer and one continuous function glides the final mark into the footer slot; the shared footer mark is hidden on `/design` only; phones ride away natively). That result is frozen. RC corrections: the G2 note paper now applies at every stacked height (R1 made the ≤650px premise false), the stage caption is whole or hidden (never scroll-held part-faded), and `check:axe` maps R2's footer declines on `/design` to one allowance backed by a new pixel-measured `footer-contrast`; `check:design:timeline:selftest` is wired into `verify:static` and CI. The local Master candidate (`GS-MASTER-001-F`) is uncommitted and excluded. `GS-O010` open (no valid submission); `undici` production advisory recorded for a separate dependency patch. Staging only; main, production, DNS and production CMS/database untouched; no launch or next phase authorised. Evidence and receipt convention: `docs/_shared/GS-DES-002-RC.md`.

> **GS-SHARED-001-RC (28 September 2026):** The owner visually approved the shared experience *The Frame and the Sheet* (B1, B1-R1, B1-R2, B2): shared header/footer, transparent browser identity, About, Approach, Insights, Legal, Contact, 404 and global error. RC corrections are implementation/gate only — chrome palette under `check:contrast`, footer JSON-LD escaping (`jsonLdHtml`), global error selected by `data-frame` (no client `data-division`), generated CTA arrows, the `/` scene axe entry re-pointed, Approach rail line as a border, legal Contents heading and print gold corrected. Legal parity 6/94/339 unchanged. `GS-O010` open (no valid submission); TikTok logo permission is a final production gate (`GS-O021`); Freelancer mark provisional (`GS-O022`); `GS-O003` open. Staging only; main, production, DNS and production CMS/database untouched; no launch or next phase authorised. Evidence and the exact-SHA receipt convention: `docs/_shared/GS-SHARED-001-RC.md`.

> **GS-PRESS-001-RC (27 September 2026):** Owner-approved R3 visuals and D architecture remain frozen (6 territories / 14 services / 29 capabilities / 43 catalogue rows). Narrow accessibility, contact-button, motion-lifecycle, process-label, withholding and performance corrections are documented in `docs/_shared/GS-PRESS-001-RC.md`. Local verification and exact-SHA CI/protected Preview are distinct gates; final acceptance is determined by that record's release receipt convention. Production, main, DNS and production CMS/database remain untouched. No launch or next phase is authorised.

> **GS-DIG-001-RC current authority (25 September 2026):** The owner approved the Digital redesign *Systems in Agreement* (one persistent five-point compass: Hero → Route Map → chapter/process background → Final) and its two R3-G corrections — Route Map callouts arrive with the compass (complete ≈290ms into the map state, no numbers-only interval under continuous scroll) and an enlarged environmental background compass (1.7× desktop, 1.9× tablet, 1.12× phone) — then authorised RC, a dedicated `staging/gs-dig-001-digital` branch, CI and protected Preview. RC corrections are gate/theme only: `check:contrast` now measures the delivered Digital palette (single source `styles/themes/digital-stage.css`), the legacy `#1B5FFF` Digital accent is retired in every theme (footer switcher rule only), `.codex/` is classified in the source inventory, Digital motion is on the duration token scale, and `check:digital:scene` measures rendered contrast, state, map timing, reduced motion, Save-Data and no-JS. Development CMS carries the approved B2 wording; production Sanity/Supabase, `main`, DNS, Hostinger and gridsmith.uk are untouched and no next division is authorised. The exact implementation SHA, CI run and Preview are recorded in the receipt section of `docs/_shared/GS-DIG-001-DIGITAL.md`. Authoritative evidence: that file.

> **GS-R002-RC-G2 current authority (24 September 2026):** The owner approved paper behind the closed Technical scope note and resuming staging release. G2 is implemented only in the enhanced stacked layout (width <=760px, height >650px); rendered note contrast passes across 24 viewport combinations (local minimum 6.69:1; Linux CI minimum 6.62:1; corrected 760x800 6.69:1). G1 disclosures/H1 and lifecycle checks remain passing. Implementation c4781b0af64733313a78ea7c557a9d1393f7bb32 passes CI 35940710523 and exact-SHA protected Preview verification. The subsequent documentation checkpoint exposed an axe-helper focus race on the unchanged kitchen-sink skip link. The gate now restores and asserts document focus, with permanent positive/negative proofs and no application change. The final verification checkpoint requires successful exact-SHA CI and Preview; its receipt is recorded in the release handoff. Original mascot, exact Inter G/S, persistent building-to-logo, metallic finish, continuous wave and copy are preserved; only the approved reading surfaces amend R2. Main and production remain untouched; no next division is authorised. Authoritative evidence: `docs/_shared/GS-R002-RC-DESIGN.md`.

> **GS-R002-R1 current owner remediation (20 September 2026):** The verified GS-R002 candidate was **not visually approved**. R1 preserves From Line to Form and the service architecture, with Design-only Oxford Navy `#0A192E` / Imperial British Gold `#D4AF35`, earlier hero progress, left/right/left choreography, corrected G/S hierarchy, an original visor/quiff character, four-storey technical study and returning-wave convergence. Owner visual acceptance remains pending. Master (GS-O008 approved), Digital and Press remain frozen; Master polish is deferred. GS-O019 resolved and GS-O020 CLOSED — PUBLISH remain unchanged. Staging only; main and production untouched. Current evidence: `docs/_shared/GS-R002-R1-DESIGN.md`. Earlier status and palette entries below are historical and superseded where they conflict.

# AI handoff

> **Current execution, 19 September 2026: GS-R002 — Design.** Implementation complete; owner-review candidate on `staging/gs-r002-design` from `eda5f3ae`. Master accepted (GS-O008), minor polish deferred; no main fast-forward. GS-O019 capability detail resolved without new top-level services. Full current record and protected Preview: `GS-R002-DESIGN.md`. The branch-tip CI check is authoritative for final verification; do not infer approval from local passes. The handoff below is the preserved predecessor.

## Execution

- **Task ID:** `GS-R001-M` / `GS-O008`
- **Task:** Master experience redesign, and its remediation round R1
- **Agent/model:** Claude Code (Opus 5)
- **Status:** COMPLETE IN REPOSITORY. The owner rejected the Master homepage's visual direction
  at `GS-O008`; `/` is redesigned. **`GS-O008` stays OPEN — AWAITING OWNER RE-REVIEW.** No
  Supabase call of any kind. No production Sanity call. No DNS, Hostinger or `gridsmith.uk`
  change. **No dependency added.**
- **Date:** 18 September 2026
- **Full evidence:** `docs/_shared/GS-R001-M-MASTER-REDESIGN.md`. The previous handoff
  (`GS-R001-R`) is in git history and `GS-R001-R-REMEDIATION.md`.

## R1 — remediation after the owner's review (18 September 2026)

The owner reviewed the candidate and asked for six things; all are done. **`GS-O008` stays OPEN.**
Record: `GS-R001-M-MASTER-REDESIGN.md` §R1.

| Item | What changed |
|---|---|
| Hero at every size and zoom | Measured first: a fixed 665px column and a viewport-scaled headline gave **7 lines from 1745px up** and the CTA below the fold at **8 of 13** sizes. Now one fluid frame, a headline sized by its column and capped by height: **3–4 lines, CTA in the first screen, at all 14 sizes** (1229–3200px). New gate `check:master:hero` |
| Joint close-up → exploded view | The mark opens into space — every piece scaled out from its place in the logo, fixed depths and tilts, a scroll-driven drift |
| Final CTA obstruction | The footer was an opaque slab over the mark. Transparent on `/` while the scene runs; the scene dims only behind text |
| Mobile veils | The full-width 92% bands are gone. The renderer dims the gold **only behind text** (up to 32 feathered rectangles). The header, whose wrapped nav was a band across the hero mark at 320px, is transparent on `/` too |
| Reviews | The cylinder is back, redesigned: CSS 3D ring, every review whole, auto-steps every 6s, pause on hover/focus, **Pause rotation**, Previous/Next, still grid under reduced motion |
| `GS-O020` | **CLOSED — PUBLISH.** `EXPECTED` 13 / 11 / 2; approval covers this review only |

**Verification on the final source:** `verify:static` **48 gates PASS**; clean `verify:build` PASS —
`/` delta **4.9KB of 15KB**, lazy scene **5.9KB of 8KB**, no dependency added; `verify:served` PASS —
`check:axe` **zero violations, 0 unresolved**; `check:master:scene` **11 questions × 11 viewports ×
7 positions**; `check:master:hero` **14 sizes**; `check:reviews:ui` PASS; `check:mark:cls` **0.0000**.
**Proofs:** `scripts/prove-master-scene.mjs`, 23 probes over three gates — 21 red on their own
question in one run, the other two red alone (§R1.9); s5, s10 and h5 re-proven after the final
layout change (§R1.10).

**R1 outcome:** commit `555cbf1d`; **CI `35397951081` `success`**, every step. Lighthouse `/`
(GPU-less runner, so the fallback path): desktop **1.00 / LCP 554ms / TBT 0ms / CLS 0.000**, mobile
**0.99 / LCP 1,636ms / TBT 81ms / CLS 0.000**. Preview `dpl_YWENAtfds2QUp8knd6UrcDFJXimu` **READY**
(target `null`) at the same branch alias — 302 to Vercel SSO, `noindex`. `main` untouched at
`fbecbe01`; `gridsmith.uk` unchanged on Hostinger.

## Repository state

- **Starting commit:** `fbecbe01`, `main`, clean, 0 ahead / 0 behind
- **Starting CI:** runs `35288782657` (`main`) and `35288781001` (branch), both `success`
- **Branch:** `staging/gs-r001-m-master-redesign` (Vercel preview). **`main` not pushed** — it stays at
  `fbecbe01`; a `main` push starts a production-target build and this phase forbids production
  deployment. Fast-forward it when the owner accepts `/`
- **Phase commits:** `07406d60` (the redesign), `c69fcdde` (declines software WebGL — CI's first
  finding), `e298f576` (fallback as vector shapes — CI's second finding); this record follows.
- **CI:** run `35308394477` on `07406d60` **failure** (Lighthouse desktop `/` 0.66, TBT 41,960ms);
  `35314676312` on `c69fcdde` **failure** (mobile LCP 3,385ms); **`35318073725` on `e298f576`
  `success`**, all steps. Lighthouse, median of 3, on a GPU-less runner — so **the fallback path**,
  which is what a GPU-less visitor receives: desktop `/` **1.00 perf / 1.00 a11y / LCP 578ms /
  TBT 0ms / CLS 0.000**; mobile `/` **0.99 / 1.00 / LCP 1,631ms (≤1,800) / TBT 88ms / CLS 0.000**.
  SEO 0.66 is the deliberate `noindex`. The WebGL path's cost on a real GPU is not lab-measured
  by anything available to this phase.
- **Staging:** preview `dpl_HbdjFaGDUSYsEJetzcb3oUuD224J`, **`READY`**, target `null`, at
  **`https://gridsmith-ltd-git-staging-gs-r001-7c084d-atikmurtazas-projects.vercel.app/`** — HTTP
  302 to Vercel SSO with `x-robots-tag: noindex`. `gridsmith.uk`: HTTP 200, `platform: hostinger`,
  unchanged.

## Scope held

- **Master homepage only.** Design, Digital and Press routes untouched; `/about`, `/approach`,
  `/contact`, `/insights` and legal keep the white Master theme.
- **Digital not researched** — owner: *"for digital i will tell later."*
- **Press and Design research is capability evidence only** (`GS-O018`, `GS-O019`); no public
  Press or Design content changed.
- Preserved: no visitor-visible `[SEED]`, About/Approach remediation, editorial-brief Insights,
  no call CTA, WhatsApp/SMS, eight social links, ICO unpublished, no pricing, no portfolio, the
  Technical Design gate, Freelancer filtering.

## What was built

1. **A gold stage** (`styles/themes/master-stage.css`) from the logo's own gradient stops —
   `#E0BD70` accent, `#0B0907` canvas, `#F5EEDD` ink — applied to `/` only via
   `[data-stage="master"]`, measured by `check:contrast` as a fifth palette (worst text cell
   6.39:1).
2. **`MasterScene`** — a fixed WebGL layer ray-tracing the logo's 8 spheres and 6 bars
   analytically as polished gold with inter-reflection, in one fragment shader. Six chapter poses
   over four formations (logo, split, chain, ring); lighting rotates with scroll; subtle pointer
   tilt; renders only on change. **Lazy 5.2KB gz** against Three.js's ~150KB; GSAP not needed.
   Reduced motion: one still hero frame. No WebGL, **software-only WebGL**, a draw blocking >100ms,
   failure or low capability: the logo as inline vector shapes (`FallbackMark`). CI found both
   cases the hard way: TBT 41,960ms (software WebGL), then mobile LCP 3,385ms (an image fallback).
3. **The page** — hero (left-set type, mark right), a typographic **studio index** instead of
   three cards, *One relationship* (continuity + structure disclosure merged), the six stage
   names on one rail, still reviews under a held heading, and a close where the mark resolves
   front-on. Approved copy carried word for word; three structural additions, no claims.

## Verification

`verify:static` **47 gates PASS** · `verify:build` PASS on a wiped `.next` (68 routes; `/` delta
**4.4KB of 15KB**, was 1.9KB; lazy scene **5.2KB of 8KB**) · `verify:served` PASS: `check:axe`
**zero violations, 0 unresolved**; `check:master:scene` **5 widths × 6 chapters +
reduced motion + no-WebGL + software-WebGL (9 questions)**; `check:reviews:ui`, `check:company` (9 questions), `check:responsive`,
legal parity, Press type, Path Finder — all PASS; `check:mark:cls` **0.0000** at 375/768/1440 ·
`npm audit --omit=dev` 0 vulnerabilities · Lighthouse: CI (Windows cannot run it).

**Gates proven by deliberate failure, and what proving them found** (`GS-R001-M-MASTER-REDESIGN.md`
§8): the scene gate's first run found **44 real readability failures** the visual review had
passed — fixed in the design, not the thresholds; it then exposed its own defect (hiding content
by `visibility` let gold text count as the mark); the model self-test's first red was an ordered
comparison of an unordered bar; the proof harness twice credited or missed reds it had not
measured (a digit parser, then an occupied port read as a green). Each is fixed and recorded.
`scripts/prove-master-scene.mjs` is committed and re-runnable.

## Findings and programme state

- **`GS-O008`: OPEN — AWAITING OWNER RE-REVIEW of the redesigned `/`.**
- **`GS-O020`: CLOSED — PUBLISH** (owner decision at R1). The pinned set is 13 / 11 / 2.
- **`GS-O018`, `GS-O019` (new, not blocking):** Press and Design capability gaps.
- Unchanged: `GS-T004`, `GS-T005`, `GS-O003`, `GS-O005`, `GS-O010`, `GS-X001`, `GS-X002`,
  `GS-R002`, `GS-R003`, the three `GS-R001` human tests.
- **RC status:** `GS-R001`'s TECHNICALLY PASS stands. **Production readiness: NOT READY.**

## Recommended next phase

Recommendation only. **Do not begin it from this handoff alone.**

**`GS-O008` — owner re-review of the redesigned Master homepage on staging.** It is an **owner
task, not an agent phase.**

- **Owner action required first?** Yes — this *is* the owner task: re-review `/` after R1.
- **What the owner decides:** accept or reject `/`; whether the gold stage extends to the other
  Master routes; whether Master and Design read as too close; whether the reviews chapter shows
  enough of the mark.
- **Then:** a **NEW** session, **Claude Code (Opus 5)**, effort **small** if accepted (extend the
  stage to the other Master routes if asked, move `EXPECTED` per `GS-O020`) or **scoped by the
  rejections** if not.

`GS-T004` activation stays in a separately authorised production-release phase, and
`gridsmith.uk` cutover behind `GS-O009`. **An accepted `/` is not authorisation for either.**
