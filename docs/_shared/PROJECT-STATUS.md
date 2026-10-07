> **GS-LEGAL-001-R5 (7 October 2026) — Privacy evidence reduced; owner checks remain:**
> - **Supabase:** the contract is verified; its request logs carry client-IP fields and are held ≥49 days.
> - **Owner checks:** four remain (E-1 to E-4).
> - **Privacy 2.2:** readiness prepared, not applied.
> - **Rights chain:** template 01 is required regardless of employment status.
> - **A-1:** deferred.
> - **Untouched:** no production change.
>
> Record: `docs/_legal/research/GS-LEGAL-001/R5-PRIVACY-EVIDENCE.md`.

> **GS-LEGAL-001-R4 (7 October 2026) — six legal documents OWNER_ADOPTED; nothing PUBLISHABLE:**
> - **Adopted:** Business 3.1, Consumers 3.1, Website Terms 2.1, Cookie 2.1, Accessibility 2.1, `/legal/client-terms` 2.1.
> - **Publication prerequisites (outstanding):** cutover authority and Privacy publishable; Cookie also A-2.
> - **Not adopted:** Privacy 2.1, which needs owner evidence P-01–P-12 and an operating retention routine.
> - **Not run:** the A-1 dev reseed (Sanity API blocked in the environment).
> - **Untouched:** no production, Hostinger, DNS or main change.
>
> Record: `docs/_legal/research/GS-LEGAL-001/R4-OWNER-ADOPTION.md`; this line supersedes the GS-LEGAL-001 state line below.

> **GS-LEGAL-001 (6 October 2026) — READY FOR OWNER LEGAL/COMMERCIAL DECISIONS; nothing published:** `GS-O003` (solicitor approval) is replaced by **`GS-O003-R`** — evidence-based review plus owner adoption per version (`lib/legal/adoption.ts`, `docs/_legal/GS-O003-R-REGISTER.json`; states RESEARCHED → VERIFIED → OWNER_REVIEW_REQUIRED → OWNER_ADOPTED → PUBLISHABLE; only the owner sets adoption). Six review workstreams (consumer, business, privacy, disclosures, competitor benchmark, adversarial) and an independent cross-check (G: 1 H, 8 M, 17 L; drafting defects fixed and re-verified) under `docs/_legal/research/GS-LEGAL-001/`. Redrafted: Client Terms for Consumers 3.0 (written acceptance with CCR reg. 14 acknowledgement, durable confirmation, standard/early start with three statements, stage-table proportionate amount, consumer exit after 14 days, no non-refundable deposits, services only, art. 60F instalment limit, GS-X002 boundary, consent-only portfolio, IP transfer with signed confirmation, model form), Client Terms for Business Clients 3.0 (formation/precedence, objective cancellation valuation, insolvency-qualified termination, consent-only portfolio, Art. 28 schedule, cap without self-referential saver), Website/Privacy/Cookie/Accessibility 2.1 (Hostinger, Information Commission, s. 164A, exact Resend contents). No VAT status, solicitor claim or AI disclaimer in any document. All seven at **OWNER_REVIEW_REQUIRED**; privacy holds three `[OWNER DECISION]` markers. `seed-legal.mjs` now generates the served text from the drafts; public `Basis:` lines removed; new `check:legal:adoption` (+ selftest 65) in `verify:static`/CI; struck rule `GS-O003-SOLICITOR-APPROVAL-GATE`. Site copy: `/contact` privacy link + no acknowledgement-email promise; Press rights note (owner to approve, D-20). Served parity against the development dataset is red until the legal documents are reseeded (owner decision D-24). Decisions D-1–D-30: `research/GS-LEGAL-001/GS-LEGAL-001-RECORD.md` §7. No Production, Hostinger, Sanity, Supabase, DNS, Vercel or main change; not pushed; H4-H not begun.

> **GS-HOST-H4-G (6 October 2026) — PASS, hosted staging release candidate:** The owner-approved GS-VIS-SEO-RC work (41a54998: Batch A metadata/copy, studio summaries, Portable Text links, R2/R4 scene framing, Design/Press default-open lists, the review drum, ServiceDetail numbering) was never merged into the hosting branch; reconciled per file (no item superseded except the old review card body and the 'every review' lede). Review drum carries the anonymous PublicReview card, gated on data-enhanced (no-JS flat list). GS-O027 executed narrowly (intro+sections on two group pages, guarded, backed up, read back exact). Path Finder intentionally withheld; legal links remain a GS-O003 blocker. Source 6615d97c, CI 37468717268 success, identity 28b841dd… (artifact bd8dd825) manually deployed, CDN flushed, auto-deployment OFF. Hosted: H4-D contract 0 failures, review/static UI gates, 117-check responsive matrix, numbering, full no-JS and axe pass; Preview leads0/outbox0. Owner review package in GS-HOST-H4-G.md. Next: owner review; H4-H cutover blocked by Freelancer permission, GS-O003, GS-X002, item 24.

> **GS-VIS-NUM-R5 (6 October 2026) — PASS; new hosted staging baseline:** Owner-reported decorative heading numbers on About/Approach came from GroupSections/Connect/ProcessRail; the owner-approved GS-VIS-001-R3 rule existed only in 41a54998 (VIS branch, never merged). Source 6f0ef7ce ports only R3's numbering hunks (About/Approach, Master chapters/process, Design/Digital/Press process numbering, Press journey bar, Path Finder no-JS prefixes); taxonomy, counts, progress, ratings and illustration numbers stay; no copy/metadata/form/review change. CI 37432618479 success; identity 997a2344… (artifact 8c3cad8a) validated, manually deployed (push alone did not deploy), CDN flushed, auto-deployment OFF after reload. Hosted: H4-D contract 0 failures (two temporary-domain exceptions unchanged), About/Approach 7 sizes x JS/no-JS clean, targeted H4-E regression identical (0 axe violations). H4-E remains accepted. Preview leads0/outbox0. Next: H4-G. See GS-VIS-NUM-R5.md.

> **GS-HOST-H4-E (6 October 2026) — PASS, verification only:** Full no-JS acceptance of the accepted Hostinger staging artifact (44e93c0b / 75d8bf40…, artifact 255d0e55), local and hosted: all 55 eligible routes x 390/768/1024/1440/1920 in cold JS-disabled contexts — 200, one h1, landmarks, noindex, no shell/overflow/broken asset; axe on the no-JS rendering 110 analyses, 0 violations (replay validity-proven). No blocker: navigation, skip link, disclosures and Press stage radios work natively; 11 reviews readable as a static list with provenance, ratings, no names; Path Finder shows all questions and outcomes; Contact and Press disclose the JS requirement with visible contact@gridsmith.uk links and disabled submission (no GET leak, proven). Artifact scans clean; GS-X002/GS-O003 gated; Preview leads0/outbox0; no submission, mail, deployment or source change; auto-deployment OFF. Recorded: footer/Press legal links 404 until GS-O003; /press/path-finder has no inbound link. See GS-HOST-H4-E.md.

> **H4-D-R2 closure (6 October 2026) — PASS with temporary-domain exceptions:** Hostinger temporary staging (mediumaquamarine-wallaby-594070.hostingersite.com) is the accepted hosted baseline at 44e93c0b / identity 75d8bf40… (artifact commit 255d0e55, tree = 73b872b4). Owner-approved HOSTINGER TEMPORARY-DOMAIN PROVIDER EXCEPTIONS: hCDN strips security/noindex headers from PNGs (bytes exact, no-transform honoured) and Hostinger serves its own robots.txt; staging-only, never production — BEFORE-LAUNCH item 24 requires re-verification on the production origin. Auto-deployment OFF (hPanel Redeploy turns it back on: switch off after every Redeploy). Live rollback proved with a validated 44e fixture (3829981a, b9f7eb2f…) and restored. Preview leads0/outbox0; no submissions/mail. Register 38 PASS / 4 PASS-with-exception / 0 PARTIAL/PENDING/FAIL. H4-E may begin. See GS-HOST-H4-D.md.

> **H4-D-R1 44e checkpoint (5 October 2026) — PARTIAL:** CI 37372379784 passed for 44e93c0b; artifact 73b872b4 (identity 75d8bf40…) validated and deployed to the temporary Hostinger site (auto-deployment found ON; owner decision pending). After a second site-specific flush, all nine PNGs are byte-identical with no-transform under every Accept variant; 190/200 files pass bytes+headers+cache; all routes, gated 404s, redirect, hosted UI/axe/no-JS/reviews/responsive pass; Preview leads0/outbox0, no new submissions or mail. Remaining, provider-edge: hCDN strips every security/noindex header from PNGs, and Hostinger replaces robots.txt with its temporary-domain file (non-Google agents allowed). Rollback not executed (gated on full pass). Register 37 PASS / 4 PARTIAL / 1 PENDING. Main/Production/DNS untouched; H4-E not started. See GS-HOST-H4-D.md.

> **H4-D-R1 hosted checkpoint (5 October 2026):** Source17f CI/publication passed and the first temporary Hostinger deployment completed. All55 HTML hashes, gated404/redirects, review UI, focused axe and four responsive viewports pass. Exactly two synthetic hosted enquiries each produced one delivered safe notification; exact cleanup restores Preview leads0/outbox0. PNG bytes/headers still fail full hosted acceptance. Source44e requests no-transform and corrects cold no-JS measurement; fresh CI37372379784 is running after a GitHub Actions outage delay. Corrected deployment/full HTTP/rollback remain pending. Main/Production/DNS untouched; H4-E not started. See GS-HOST-H4-D.md.

> **GS-HOST-H4-D-R1 current owner authority (5 October 2026):** Temporary Hostinger staging may display the frozen 11 approved Freelancer quotations with actual ratings, anonymous linked provenance, and only established flags. This supersedes the earlier requirement to complete H4-C before H4-D. Provider permission is still unresolved; review API/cache/refresh automation remains BLOCKED and final gridsmith.uk review publication remains BLOCKED. Hostinger is the active staging target; zero persistent application Node, no Production/DNS/main/Sanity writes. Implementation and hosted evidence are in progress.

> **GS-HOST-H4-C (5 October 2026): BLOCKED — owner confirmed no written Freelancer review-display permission is held.** Source read-only probe confirms 13/11/2 with James retained; both permanent IDs now explicitly/frozen withheld in local source, with synthetic proofs and safe ID-only live-gate logging. Official User Agreement §11 plus incorporated API terms is a material provider gate. No cache/refresh workflow/new normal or static build, no commit/push; H4-B Preview infrastructure and Production/Hostinger/main untouched. Evidence: `GS-HOST-H4-C.md`; owner dependency `GS-HOST-H4-C-R1`. H4-C-R1 provider request/decision matrix and local-change classification prepared for owner submission only; nothing sent or committed. Qualifying provider response and completed H4-C precede H4-D. STOP.

> **GS-HOST-H4-B (4 October 2026): PASS — local/isolated Preview only.** Static Contact/Press → shared domain → public Preview Edge → private atomic lead/outbox → authenticated bounded Edge worker → existing Resend. Safe synthetic Contact/Press/recovery delivery and exact cleanup passed (Preview leads/outbox0). Normal Next fallback and55-route noindex foundation retained. No-JS submission unsupported, explicitly deferred for H4-E/G acceptance. Migration/Edge/custom secrets changed only on `qfgpwumvvtizeamkynes`; Production and Hostinger/DNS/WordPress/main untouched, no push or GS-VIS/SEO integration. Current contract, receipts, recovery and unapplied Production plan: `GS-HOST-H4-B.md`. H4-C is the next separately authorised phase; H4-D–H pending. STOP.

> **GS-HOST-H4-A historical foundation (4 October 2026):** Local static compatibility PASS; technical form shells superseded by H4-B. Review-cache and hosting/cutover limits remain. Evidence: `GS-HOST-H4-A.md`.

> **GS-HOST-004 (4 October 2026): OPTION B — static Hostinger Business with existing external dynamic boundaries is architecturally feasible.** Dedicated source audit and a disposable three-route export/browser proof passed; Hostinger application Node target requirement is zero. Keep Next RSC/CMS/SEO at build and all browser scenes; move forms/private notifications to existing Supabase Free/Resend. Full migration, hosted HTTP/CDN/rollback and security/performance RC remain unproved. Owner rejects VPS/upgrades/new paid hosting/Vercel Pro and waiting for managed Node updates; this supersedes earlier host continuation recommendations, not their rejected-runtime evidence. GS-O003 and GS-X002 gates remain; GS-O025/GS-O026 open. No Production writes/deploy/DNS/WordPress/main/push. Concurrent GS-VIS/GS-SEO untouched. Local isolated branch codex/gs-host-004 from 9508412e; no commit. Evidence: `GS-HOST-004.md` and `GS-HOST-004-SERVER-DEPENDENCY-MATRIX.md`. **Next: H4-A only; not executed. STOP.**

> **GS-PROD-004B (2 October 2026) — TikTok mark retained by owner decision; `/design` scope note corrected:** **`GS-O021` CLOSED BY OWNER DECISION** — the owner reviewed the brand-use concern and chose to keep the TikTok mark (owner-accepted risk); **no written TikTok permission is recorded or claimed**; the `GS-PROD-004A` text-link prototype was rejected and discarded, so the TikTok implementation is byte-identical to the approved baseline (served build: footer and `/about` marks, link and accessible name unchanged). `/design` Technical note: "…professional-scope ~~and insurance~~ confirmation." (owner-approved two-word deletion; `check:design:scene` PASS, scope note 6.69:1). `e6f5691e`'s CI failure was `/press` mobile TBT 207.7ms vs 200 on a docs-only commit, with every route uniformly slower in that run than in `7f6472b2`'s (runner variance); the job was re-run, no gate altered. `GS-X002` OPEN (Technical only), `GS-O024` deferred, `GS-O003` OPEN. No production write; main untouched. Evidence: `docs/_shared/GS-PROD-004B.md`.

> **GS-PROD-004A (2 October 2026) — owner-gate reduction + `GS-X002` review pack; OWNER ACTION REQUIRED, no production write:** Baseline `7f6472b2` CI `37010155414` and `028bd1d5` CI `37006558824` both success 48/48. **`GS-O021`:** no TikTok permission on record, so the fallback the record itself names is prepared **locally and uncommitted** — the `TikTok` entry removed from `platformMarks.ts`; the footer shows the plain word "TikTok" (same link and accessible name, 13.26:1, no 375px overflow) and `/about` keeps its label with an empty icon slot; awaits owner visual approval. **`GS-X002`:** self-contained reviewer brief `docs/_shared/GS-X002-REVIEW-PACK.md` (exact public copy, 76 strings verified verbatim; boundaries; questions A–E; closure evidence; no legal or insurance review); stays OPEN. **Finding:** `/design`'s Technical note still says services "remain subject to professional-scope and insurance confirmation" — proposed deletion of "and insurance" awaits owner copy approval. **`GS-O003` handoff:** three facts made explicit (insurance not a launch prerequisite; not a claim of zero liability; MSA §12 broader than the public scope). Blocker register reconciled in `PROJECT-STATUS.md`. Main, deployment, DNS, Sanity and Supabase untouched. Evidence: `docs/_shared/GS-PROD-004A.md`.

> **GS-PROD-003-R1 (2 October 2026) — owner scope decision + `GS-T004` applied; PARTIAL PASS:** **`GS-O005` CLOSED BY OWNER SCOPE / RISK DECISION** — Gridsmith does not currently carry PI cover for the Technical/CAD services and will not make it a launch prerequisite (deferred, non-blocking `GS-O024`); scope stays limited (drafting/preparation to a client's brief; no design, calculation, approval, certification, stamping, sign-off or responsible-designer role); **not a claim of zero liability** and never advertised as insured or uninsured; contract wording stays with `GS-O003` (solicitor note added: `MSA-BUSINESS.md` §12/§16 and the PI-limit `[TK]` under UCTA s. 11(4)(b); no clause drafted). `professionalScopeConfirmed` now means only that `GS-X002` has confirmed limited scope — messages, schema description, manifest gate (`GS-X002`) and specs updated, old wording struck and registered (`check:struck` `GS-O005-PI-COVER-PUBLICATION-GATE`); `check:launch` selftest forbids PI/GS-O005 wording (proven red by isolated mutation). **`GS-X002` retained** (owner choice): a claims review independent of insurance, now the only gate on the 3 Technical services — **not migrated**, Production Sanity stays 47. Technical copy re-checked clean, unchanged. **`GS-T004` APPLIED:** `GS-O023` closed on owner provenance (key re-entered from `dqiutgmxillhsbzgnlsx`); verified `pg_dump` backup outside the repo (restore test 5 tables / 63 leads); `npm run migrate` applied exactly 0004 (`bd761ff9b9e4`); Production now equals Preview (RLS 5/5, 0 policies, 0 public grants, 18 lead constraints, identical definition hash); leads 63, row fingerprint unchanged; anon PostgREST 401; service-role write remains a cutover smoke-test proof. No deployment, alias, DNS, Sanity write, lead or form action; main untouched. Evidence: `docs/_shared/GS-PROD-003-R1.md`.

> **GS-PROD-003 (2 October 2026) — Production database security parity + `GS-O005`; OWNER ACTION REQUIRED, no production write:** Against runtime `1542f508` (docs `7969dcbd`, no runtime change). **`GS-T004` not applied.** Migration 0004 (`20260911203125_gs_p01_security_hardening.sql`, runner SHA `bd761ff9b9e4`) read in full: drops the `leads` "anon insert only" policy, revokes `anon`/`authenticated` on the 5 tables + `events_id_seq`, enables ledger RLS, adds 17 validated CHECKs on `leads`, revokes future `postgres` defaults — security-only/non-destructive, no DML. Preview recomputed as the post-0004 state (RLS 5/5, 0 policies, 0 public grants, 18 `leads` constraints, 5 indexes, views `security_invoker`). Production read-only: ledger 0001–0003 (SHAs match), ledger RLS off, 1 policy, full `anon`/`authenticated` grants, 63 leads, **0 rows violating each of the 17 checks**; only 0004 pending. **Stopped on the credential condition:** Production `SUPABASE_SERVICE_ROLE_KEY` and `PROJECT_URL` are Vercel `sensitive` (write-only), and the only READY production deployment is the `3fbc518f` scaffold with no lead code, so no server-side proof exists without a Production deployment — new owner action `GS-O023` (re-enter from the Gridsmith Project, or explicitly defer proof to the cutover smoke test). No backup taken (not eligible). The removed anon policy has no consumer in any deployable build (server-only writer since `daf192f1`). **`GS-O005` = C, external/broker confirmation** (written PI coverage for CAD drafting, drawing preparation and technical documentation; `GS-X002` also gates `professionalScopeConfirmed`); Technical copy reviewed clean (explicit no-design/no-calculation/no-certification/no-sign-off exclusions), no copy change proposed; not migrated — Production Sanity stays 47 (Technical 0, legal 0). Supabase free-plan pause recorded only. No deployment, alias, DNS, env, Supabase/Sanity write, lead or form action; main untouched. Evidence: `docs/_shared/GS-PROD-003.md`.

> **GS-O010-R2 (2 October 2026) — Preview isolation and end-to-end form proof; `GS-O010` CLOSED:** New free Supabase project `gridsmith-preview` (`qfgpwumvvtizeamkynes`, eu-west-1, Gridsmith Org) with the four repository migrations and the runner's ledger (RLS on all 5 tables, 0 policies, 0 anon/authenticated grants). Vercel Preview `PROJECT_URL`/`PUBLISHABLE_KEY` → that project; a Preview-only `SUPABASE_SERVICE_ROLE_KEY` (owner-entered); Preview `LEAD_NOTIFICATION_EMAIL` = `contact@gridsmith.uk` (owner choice); `DIRECT_CONNECTION_STRING`/`SANITY_API_WRITE_TOKEN` Production-only since R1. Production project `dqiutgmxillhsbzgnlsx` was **paused** (free plan) and was restored on owner approval for read-only snapshots — a cutover-readiness item. **Runtime defect found by the first valid Press submission and fixed at `1542f508`:** a blank optional answer (manuscript link, `triedElsewhere`) reached `leadSchema.payload` as `undefined`, which `z.json()` rejected on a key no step renders — every author/memoir/production enquiry without a link failed; payload values are now `z.json().optional()` (stored row unchanged, no visible UX change), and `check:press:contact:selftest` composes each segment through `leadSchema` (red on author/memoir/production before, business/content controls; 34/34 after). Proof through the SSO-protected, noindex Preview UI: one `/contact` and one `/press/contact` synthetic submission landed only in Preview (correct division/segment, no duplicate); owner confirmed exactly those two notifications; honeypot and invalid (URL in name) wrote and sent nothing; Production 63 leads before and after, 0 rows in the test window, 0 markers; synthetic rows deleted (Preview 0). Confirm the Production service-role value before cutover (edited by the owner this phase). No Production deployment, alias, DNS, Sanity write (47/0 legal/0 Technical) or main change. Evidence: `docs/_shared/GS-O010-R2.md`.

> **GS-O010-R1 (2 October 2026) — Preview isolation, stopped for owner action:** Against application SHA `c1dee128` (no source change). From source: both forms reach `submitLead`, which reads only `PROJECT_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `LEAD_NOTIFICATION_FROM/EMAIL` and `SLACK_LEADS_WEBHOOK` (unset); the build reads only `NEXT_PUBLIC_SANITY_DATASET`. **`DIRECT_CONNECTION_STRING` and `SANITY_API_WRITE_TOKEN` are now Production-only in Vercel** (Preview scope removed; no value read or changed). Preview has no service-role key, so a Preview submission errors and writes nothing. **Stopped before any submission:** the Supabase connector now sees only an unrelated "Food" organisation, not the Gridsmith project's, so no isolated project can be provisioned in the right organisation; Preview mail has no designated test sink. `GS-O010` **OPEN** — owner provisions the isolated project in the Gridsmith organisation (or reconnects the connector) and designates a Preview test inbox/key. No deployment beyond the automatic Preview, no alias, DNS, Supabase, Sanity or form action. Evidence: `docs/_shared/GS-O010-R1.md`.

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

# Gridsmith production programme status

> **GS-PRESS-001-D current Press authority (26 September 2026):** The owner visually approved R3's Publishing Desk. Press content architecture is being formalised on `staging/gs-press-001-press`: six territories, 14 canonical service records and 29 approved capabilities replace the historical four/13/22 Press model. The 13 old URLs are preserved and an audiobook route is added. RC, production CMS migration, production deploy and cutover remain unauthorised. See `GS-PRESS-001-D.md`.

> **19 September 2026 — GS-R002 superseding status:** Design is implemented as an owner-review candidate on `staging/gs-r002-design`, based on accepted `eda5f3ae`. **GS-O008 APPROVED** by the owner; minor Master polish deferred to final cross-division comparison. **GS-O020 CLOSED — PUBLISH** preserved. **GS-O019 resolved for capability detail**; two development-only service records expanded, no group/count change. Main remains `fbecbe01`; production remains NOT READY. The older GS-R001-M status below is historical. Current evidence: `GS-R002-DESIGN.md`.

**Programme:** controlled production readiness

**Status:** ACTIVE — **`GS-R001-M` is complete in the repository.** The owner reviewed the
`GS-R001-R` candidate and **rejected the Master homepage's visual direction** — the grid, the three
coloured division boxes and the line-art background animation. `GS-R001-M` redesigned the Master
homepage only. **`GS-O008` remains OPEN — AWAITING OWNER RE-REVIEW**, and is not closeable by an
agent.

**Current task:** `GS-R001-M` / `GS-O008` — Master experience redesign, **remediation round R1
complete**: fluid hero (3–4 lines and the CTA above the fold at 14 desktop/zoom sizes), an
exploded-view chapter, no opaque surface over the scene on `/` (footer, header and mobile veils
gone; the scene dims only behind text), the review cylinder restored and redesigned, `GS-O020`
closed as PUBLISH.
Evidence: `docs/_shared/GS-R001-M-MASTER-REDESIGN.md`

**Current commit:** `fbecbe01` at task start; the phase commit and CI are recorded in
`AI-HANDOFF.md`.

**Branches:** `staging/gs-r001-m-master-redesign` carries the candidate and is what Vercel builds
as a **preview**. **`main` was not pushed** this phase (it would start a production-target build);
it stays at `fbecbe01` until the owner accepts `/`.

**What `GS-R001-M` changed.** `/` is a **gold stage** derived from the owner's logo
(`styles/themes/master-stage.css`, measured as a fifth palette) with a **WebGL scene of the mark**
behind the whole page — the logo's eight spheres and six bars ray-traced as polished gold,
travelling through six chapters (declined on software WebGL, where the static logo shows): assembled → split into its two halves → a macro close-up of the
joint → the six bars laid end to end as the process → a ring for the reviews → reassembled
front-on at the close. **No dependency added** — no Three.js, no GSAP: a 5.2KB lazy renderer. The
three coloured cards became a typographic **studio index**; the review cylinder became still
reviews under a held heading; group structure merged into the continuity chapter; Latest insights
removed from Home. Design, Digital and Press untouched. No `GS-R001-R` content, legal, contact,
social or review-safety work reopened.

**Verification:** `verify:static` **47 gates PASS**; `verify:build` PASS on a wiped `.next`
(68 routes, `/` delta **4.4KB of 15KB**, lazy scene **5.2KB of 8KB**); `verify:served` PASS —
`check:axe` **zero violations, 0 unresolved**, `check:master:scene` **all 9 questions at 5 widths ×
6 chapters**, `check:mark:cls` **0.0000** at 375/768/1440. `npm audit --omit=dev`: 0
vulnerabilities. **CI `35318073725` `success`** on `e298f576` after two red runs whose findings
changed the design (software WebGL froze the page; an image fallback became a late LCP).
Lighthouse `/` on the GPU-less runner (the fallback path): desktop **1.00 / LCP 578ms / TBT 0ms**,
mobile **0.99 / LCP 1,631ms / TBT 88ms**, CLS 0.000 both.

**Staging:** `dpl_HbdjFaGDUSYsEJetzcb3oUuD224J` **READY** at
`gridsmith-ltd-git-staging-gs-r001-7c084d-atikmurtazas-projects.vercel.app` — SSO-protected,
`noindex`. `gridsmith.uk` unchanged on Hostinger.

**New owner actions:** `GS-O018` (Press capability gaps), `GS-O019` (Design capability gaps).
**`GS-O020` CLOSED — PUBLISH** at R1; the pinned review set is 13 / 11 / 2.

**RC status:** `GS-R001`'s **TECHNICALLY PASS** stands. **Production readiness: NOT READY.**

**Last updated:** 18 September 2026 (`GS-R001-M`)

## Service architecture (GS-P03)

`docs/_shared/SERVICE-ARCHITECTURE.md` is the ADR and the service model.

- **Master** is the relationship layer, not a production studio. Engagement models are recorded but
  have no CMS type or route until approved copy exists.
- **Design:** Brand & Visual · Illustration · Motion · 3D & Visualisation · Technical.
- **Digital:** Web · Software · Apps & Interactive · Automation & Intelligence · Operate & Improve.
- **Press:** Writing · Editorial · Publishing · Content & Promotion.
- Capability groups are closed, division-bound architecture (`lib/services/architecture.ts`);
  individual services are CMS content.
- Cross-division boundaries (cover design, website copy, SEO, digital marketing) are recorded and
  enforced by the division-bound group rule.
- Contextual CTAs: **Discuss Your Requirements** / **Get a Design Quote** / **Discuss Your Project** /
  **Discuss Your Book or Content**, universal **Contact Gridsmith**. All reach the one enquiry form,
  carrying division and service context, through the unchanged GS-P01 server-only writer.

## Commercial-model state

| Control | State |
|---|---|
| Public price fields (`service.pricingModel`, `pricingBlock`, package prices) | **REMOVED**; `check:schemas` refuses any price field |
| Price renderers (`Price.tsx`, service cards, service page) | **REMOVED** |
| Digital estimator `/digital/estimate` | **REMOVED from launch**; non-price scoper deferred |
| Public portfolio (`/work`, homepage and landing work blocks, `/approach` grid) | **REMOVED** |
| `project`, `book`, `publishingPackage` types | **DORMANT** for future consented use |
| Press Path Finder | **UNCHANGED** |
| Technical Design publication gate | **ACTIVE** — production refuses unconfirmed technical services |
| Development Sanity dataset | **RECONCILED at GS-P04**, untouched by GS-P05 and by GS-P06. Neither made a Sanity call of any kind. The six genuine testimonial records remain and are no longer read by anything rendered |
| Per-service routes | **ALL THREE DIVISIONS** since GS-P04 — one shared template, 46 pages |
| Route count | **77**, unchanged by GS-P06. `/` is still prerendered static and now revalidates every 24 hours |
| Approved service catalogue | `lib/services/catalogue.ts` — 81 services, coverage gate-enforced |
| Digital Marketing / campaign management | **CONFIRMED** as a cross-division engagement; no fourth discipline, no new group, type or route |
| Marketing channel services | **CONFIRMED at GS-P05** (`GS-O012`) — 8 of 9; six new engagement rows, no new architecture |
| Paid media | **RESOLVED at GS-P06** (`GS-O013`) — denying media buying contradicted the channels already confirmed. One nineteenth engagement row; catalogue unchanged at 81; `Media buying` stays in `UNCONFIRMED_CHANNEL_SERVICES` on the narrower reading that no service **record** may claim it |
| Freelancer reviews | **12** available, **10 published**, 2 withheld. `GS-O015` **CLOSED at GS-R001**: the two stay withheld, and the withholding moved from a hardcoded id list to `namedThirdParty`, a deterministic rule that reaches reviews nobody has seen. `check:reviews --live` pins the set a person has read, so a new review makes it red rather than reaching the homepage unread |
| Freelancer review retrieval | **ACTIVATED at GS-P06** — official API, no credential, 24h cache, no stored copy, `/` revalidates daily. `GS-O014` closed |
| Freelancer review placement | **MASTER ONLY** (`GS-O014` amendment). Division review blocks removed; `TestimonialList`, both testimonial queries and the `TestimonialCard` type deleted. `check:reviews-ui` asserts presence on `/` and absence on all three divisions in one run |
| Master review presentation | **Still reviews since `GS-R001-M`** — a held heading beside the list; nothing moves by itself, so SC 2.2.2 has no subject and there is no pause control. Verbatim, attribution on each, one profile link. `check:reviews:ui` questions 3, 4 and 9 rewritten |
| Service copy remediation | **IMPLEMENTED at GS-P06** in `scripts/service-content.mjs` — media-buying denial, ownership absolutes, hosting-resale prohibition, categorical accessibility claim, combative guarantees and five accusatory summaries. `check:service-content` question 4 refuses eleven struck phrasings |
| Brand assets | **SUPPLIED AND VERIFIED at `GS-R001-R` (`GS-O007`)** — `public/brand/` holds the owner's `gridsmith-logo.svg`, `gridsmith-logo.png` and `gridsmith-logo-3d.png`. All three are the **mark alone**; measured against each other before use (shape IoU 0.9624 PNG-vs-SVG, **zero XOR pixels surviving two erosions**). The **SVG** is the header logo on all 77 routes and the geometry source for the Master animation; neither PNG is modified and neither is rendered. **No favicon** — there never was one, and `GS-R001-R` §22 forbids deriving one |
| Master background mark | **REPLACED at `GS-R001-M`.** The `GS-R001-R` hairline layer was rejected at `GS-O008` and deleted. `/` now carries `MasterScene`: a fixed WebGL layer ray-tracing the logo's 8 spheres and 6 bars as polished gold, six chapter poses, lazy (5.2KB gz), renders only on change, reduced motion = one still hero frame, no-WebGL or software-only WebGL = the logo as inline vector shapes (never an LCP candidate). `aria-hidden`, no focusables, no pointer events, outside `<main>`. Gate: `check:master:scene` (9 questions, rendered pixels) and its self-test |
| Base token layer | **41 tokens**, was 39 — `--dur-cycle` / `--dur-cycle-narrow` added for the ambient loop |
| Company and contact facts | **SUPPLIED AND IMPLEMENTED at `GS-R001` (`GS-O004`)** — `Gridsmith Ltd` · `17050842` · **registered in England** · `contact@gridsmith.uk` · `+44 7405 448534` · **no business hours** · *"We typically respond within 48 hours."* · registered office in the statutory footer and `_legal/` only · **no public team**. One source (`companyDetails`), asserted on the served pages by `check:company` |
| Insights content model | **EDITORIAL BRIEFS since `GS-R001-R`.** `post.status` is a closed list (`brief`/`draft`/`published`) enforced on write; all three post queries filter `status == "published"` by **strict equality, never `coalesce`**. Nine briefs carry premise, reader, central question, arguments, structure and research questions. `/insights/[slug]` builds **zero** pages, so an unpublished post has no URL rather than a hidden one |
| Public contact channels | **EMAIL, WHATSAPP, SMS since `GS-R001-R`.** `tel:` is **prohibited on every route** and `telHref` is deleted; `whatsAppHref` and `smsHref` replace it, both derived from the displayed number. The statutory footer renders the number as **text**, because that block is a legal disclosure and not a contact surface. No hours, no SLA, no guarantee — `GS-O004` unchanged |
| Public team members | **NONE.** `Q-M9` answered. `/about` was publishing four `[SEED] Placeholder Name` records because the seed set `isPublic: true`; the query, the type, the renderer and its CSS are deleted and the type is dormant |
| SEO surface | **BUILT at `GS-R001`** (`G-04`, `G-05`) — `robots.ts`, `sitemap.ts`, per-route canonicals, Open Graph, `Organization` JSON-LD. **Default is `Disallow: /`, an empty sitemap and `noindex` on every page**; indexing needs a Vercel production deployment **and** an explicit `NEXT_PUBLIC_SITE_URL` |
| Legacy URL inventory | **COLLECTED at `GS-R001`** (`G-01`) — **eight URLs**, read from the live site's own `wp-sitemap.xml`. Four are WordPress/theme defaults. `redirects/legacy.json` stays empty: cutover is prohibited and one row is an owner decision (`LIVE-SITE-EXTRACT.md` §13) |
| Gate count (`GS-R001-M`) | **47** — `check:master:scene:selftest` added to the static chain; `check:master:scene` replaces `check:mark:field` in the served chain; `check:mark:guard` retired with its subject. `check:contrast` measures **5 palettes** (44 pairs, 185 cells); `check:struck` **19 rules / 38 specimens** (`GS-R001-M-DIVISION-CARDS`) |
| Gate count | **46** at `GS-R001-R`, was 45 — `check:mark:field` is new (7 viewport/motion cases over the background layer, reading the **rendered transform** rather than the animation's own report). `check:company` grew questions 7 and 8 rather than a new gate appearing over the same subject — `check:company` grew **questions 7 and 8** (call channel, placeholder markers in served text) rather than a 46th gate appearing over the same subject. Its self-test moved 35 → **57** cases. Question 8 found `/press/path-finder` serving `[SEED]`, a route no finding had raised |
| Legacy gate count note | **45**, was 43 — `check:company` (served, six questions) and `check:company:selftest` (35 cases) |
| Struck-rule registry | **18 rules**, was 16 — `GS-R001-R-CALL-CHANNEL` and `GS-R001-R-SEED-POSTS`, each annotated in place, specimen-proven, and each with its own deliberate-failure branch and a *not-a-subject* case. `ZERO-SUBJECT` count moved 16 → 18 |
| Previous struck-rule registry | **16 rules**, was 13 — `GS-O004-BUSINESS-HOURS-FIELD`, `GS-O004-RESPONSE-GUARANTEE`, `GS-O004-PUBLIC-TEAM-ROSTER`, each annotated in place and specimen-proven |
| Freelancer review project titles | **ANONYMISED** — 6 by hand at GS-P04, and all 12 mechanically by the GS-P05 pipeline, from Freelancer's closed skill taxonomy. No quote altered |

## Development content state (GS-P04)

**Sanity project `spzu6y31`, dataset `development`** — positively identified before any mutation,
and distinct from the `production` dataset name the launch gate keys off.

| | Before | After |
|---|---|---|
| Published documents | 140 | 132 |
| `service` | 30, no capability group, all priced | 46, all grouped, no price field exists |
| `project` | 24 | 0 |
| `testimonial` (genuine, `isSeed: false`) | 6 | 6, titles anonymised |
| `companyDetails` (genuine) | 1 | 1 |
| Sanity `system.*` | 12 | 12 |
| Drafts | 0 | 0 |

46 obsolete seed documents were deleted **by provenance, never by type**: a candidate had to carry
both `isSeed: true` and an `_id` beginning `seed-`, and a disagreement between the two markers
stops the run. Genuine records match neither and were never candidates. The run is idempotent — a
second immediately afterwards deleted nothing and wrote the same 119.

**The production dataset was not read, not written and not contacted.**

## Supabase state

**Project:** `dqiutgmxillhsbzgnlsx` (`Gridsmith Project`) — unchanged by GS-P03, GS-P04, GS-P05,
GS-P06 and **GS-R001**, none of which made a Supabase call of any kind.

Production still records migrations `0001`–`0003`; the GS-P01 security migration is **not applied**.
~~`GS-T004` remains **REMEDIATED IN REPOSITORY / OPEN IN PRODUCTION / READY FOR CONTROLLED ACTIVATION**.~~
**Superseded 2 October 2026 (`GS-PROD-003-R1`): `GS-T004` APPLIED IN PRODUCTION** — ledger 0001–0004
(`bd761ff9b9e4`), structure equal to Preview, 63 leads unchanged (row fingerprint equal before/after).
GS-P03 made no Supabase call. The lead schema, RLS and migrations are unchanged; the Server Action
additionally maps the already-existing, already-bounded `service_slug` column.

## Vercel state

**Project `gridsmith-ltd` has no custom domain and `live: false`.** `gridsmith.uk` points at
Hostinger, so **a production-target deployment cannot replace the live site**, and every one since
`GS-P00` has ended `ERROR` on the empty production Sanity dataset (`GS-T005`).

`GS-R001` cut the staging release candidate as a **branch preview**, which builds against the
`development` dataset and reached **`READY`**: `dpl_J9Xwajt5jHME5tH7CqVcASvGzAa5`, target `null`,
at `gridsmith-ltd-git-staging-gs-r001-8a292a-atikmurtazas-projects.vercel.app`. The `main` push
produced production-target `dpl_FD1MW6Pj7bjar77Razf5aYsxrCbx`, state **`ERROR`** — `check:launch`
refusing the empty production dataset through the `prebuild` hook, which is `GS-T005` and is the
gate working. Nothing published. **Vercel Authentication is enabled for every deployment
except custom domains**, so the candidate answers 401 to a crawler; `app/robots.ts` serves
`Disallow: /` and every page carries `noindex, nofollow` as the second and third locks. All three
read one `INDEXABLE` constant, so they cannot disagree.

**The documented production switch is one variable:** `NEXT_PUBLIC_SITE_URL=https://gridsmith.uk`
on the Production environment. Until it is set on a production deployment nothing is indexable,
the sitemap is empty, and canonicals resolve to the deployment's own origin — which is correct for
a preview and avoids pointing production URLs at a site this build does not serve.

~~Preview remains non-isolated at the **database** level (`GS-O010`), which is why no synthetic lead
was submitted.~~ Superseded 2 October 2026: Preview writes only to `gridsmith-preview`
(`qfgpwumvvtizeamkynes`) and both forms are proven end to end (`GS-O010-R2`).

## Production state

| Control | State |
|---|---|
| Production readiness | **NOT READY** — distinct from the RC status, which is **TECHNICALLY PASS** |
| `GS-T004` live remediation | **APPLIED — `GS-PROD-003-R1`, 2 Oct 2026.** 0004 via `npm run migrate` after a verified backup; RLS 5/5, 0 policies, 0 `anon`/`authenticated` grants, 18 lead constraints; leads 63 unchanged. Service-role runtime write proven only at the cutover smoke test |
| Production deployment authorisation | **NOT AUTHORISED** |
| `gridsmith.uk` cutover | **PROHIBITED until a dedicated production-release phase** |
| Latest completed phase | `GS-R001` when its commit and push are complete |
| Next recommended phase | See `AI-HANDOFF.md` — recommendation only |

## Authoritative decisions

- `GS-D001` — public portfolio evidence requiring unavailable client/author permission is not a
  production dependency. **Implemented at GS-P03.**
- `GS-D002` — public fixed, starting, indicative, package or estimator-generated prices are not a
  production dependency. **Implemented at GS-P03.**

## Active blockers

> **Current register — reconciled at `GS-PROD-004A`, updated at `GS-PROD-004B` (2 October 2026). This table is authoritative;
> the lists beneath it are history and are superseded where they differ.**
>
> | Class | Item | What closes it |
> |---|---|---|
> | **Blocking full cutover** | `GS-O003` — solicitor review of the legal set (legal content not in Production) | dated written review; legal migration |
> | | Firewall / cutover controls (Vercel Firewall rule, `NEXT_PUBLIC_SITE_URL`, domain, `GS-T005` production build) | cutover phase |
> | **Blocking Technical services only** | `GS-X002` — professional review of the three Technical records | written review per `GS-X002-REVIEW-PACK.md` §6 |
> | **Cutover verification** | Production form smoke test (also proves the Production service-role key) | one controlled submission at cutover |
> | | Supabase free-plan pause decision (Production was paused once) | owner decision: plan or accepted risk |
> | **Deferred / accepted decisions** | `GS-O024` — PI insurance for Technical/CAD | non-blocking unless `GS-O003` advice says otherwise |
> | | `GS-O021` — TikTok mark retained by owner decision; **no written TikTok permission recorded** (owner-accepted brand-use risk) | closed — not a cutover blocker |
> | **Optional** | `GS-O022` — official Freelancer mark | — |
>
> Done at `GS-PROD-004B`: the `/design` Technical note no longer mentions insurance ("…remain subject to
> professional-scope confirmation."). Closed and not to be reopened: `GS-O005` (owner scope/risk
> decision), `GS-O021` (owner decision, permission not obtained), `GS-O010`, `GS-O023`,
> `GS-T004` (0004 applied; 63 leads, fingerprint unchanged).

### Owner blockers

- `GS-O003` — complete solicitor review and resolve legal launch actions.
- ~~`GS-O005` — confirm engineering/CAD professional-indemnity scope.~~ **Closed by owner
  scope/risk decision** at `GS-PROD-003-R1`; PI cover deferred, non-blocking (`GS-O024`). Not a claim
  of zero liability (`GS-O003`).
- ~~`GS-O023`~~ — closed at `GS-PROD-003-R1` (owner provenance stated).
- `GS-O007` — **brand-asset limb CLOSED at GS-R001-R.** The owner supplied the logo; it is
  verified, integrated and gate-asserted. Three narrow decisions remain: a favicon (there has
  never been one), an Open Graph card composition, and the one redirect row — now cutover
  hygiene rather than a blocker.
- ~~`GS-O010` — provision an isolated non-production Supabase target for Preview.~~ **CLOSED**
  2 October 2026 (`GS-O010-R2`).
- *(`GS-O017` was raised and closed inside `GS-R001-R` — see the closed list below.)*

### Technical blockers

- ~~`GS-T004` — controlled production activation of the GS-P01 security migration.~~ Applied at `GS-PROD-003-R1`.
- `GS-T005` — production Sanity dataset/content path incomplete; seed content must never be promoted.
- Notification reconciliation and live RLS-drift scheduling/credential verification remain later
  operational work.

### Closed in GS-R001-R

- `GS-O017` — **raised and closed in the same phase, on owner-supplied evidence.** The owner
  identified `github.com/atikmurtaza/gridsmith-working` — their own earlier implementation — as
  where the social links are configured. **Eight channels published**, each resolved before
  publication: Facebook, Instagram, LinkedIn, X, TikTok, YouTube, Reddit and Freelancer.
  **It corrected an earlier conclusion in the same phase**: a generic search had attributed
  `facebook.com/gridsmith` and `linkedin.com/company/gridsmith` to an unrelated Seattle design
  studio, and both are Gridsmith Ltd's. Two configured links were **not** published — a Gmail
  compose link to the superseded legacy address, and a Reddit share permalink carrying tracking
  parameters, normalised to the canonical profile. `check:company` question 9 asserts all eight
  on `/about` and refuses any unapproved social host on any route. **COMPLETED.**
- `GS-O016` — **the owner confirms Gridsmith Ltd is registered with the ICO and is paying the
  applicable data-protection fee.** Recorded as owner-supplied compliance evidence and
  **published nowhere**: `GS-R001-R` §12 forbids turning it into marketing copy, and
  `companyDetails.icoRegistration` stays **unset** because the owner supplied the position and
  not the number. The registration number, renewal date and fee tier were **not invented**; if
  a later legal gate needs the number it is one owner fact and one field. **This does not
  advance `GS-O003`** and no broader privacy readiness is marked complete from it. **COMPLETED.**

### Closed in GS-R001

- `GS-O004` — **operational company and contact facts supplied, implemented and gate-asserted.**
  One canonical source, six surfaces, and **two facts corroborated against the public Companies
  House register**, which closes checklist rows `A1` and `A2` that had been open since 7 September
  as *"confirm against the register"*. The register gives `GRIDSMITH LTD`, **active**, incorporated
  24 February 2026, registered office `30 Briarfield Road, Farnworth, Bolton, England, BL4 0HD` —
  the same premises as the seed, with the **digit zero**, so the live site's `BL4 **O**HD` is the
  malformed one. **COMPLETED.**

  **Its load-bearing limb was the one nobody had asked about.** The served `/about` was publishing
  four people named `[SEED] Placeholder Name` under the heading *"Who you will work with"*. The
  schema defaults `isPublic` false and the seed set it `true` on all four records, so **nothing in
  the source was wrong** and six phases, an accessibility audit and a content audit went past it.
  `Q-M9` is answered — no public team — and it is enforced by deleting the query and the renderer
  rather than by a boolean anyone can flip.
- `GS-O015` — **the two reviews stay withheld, and the withholding now reaches reviews nobody has
  seen. COMPLETED.** A hardcoded list of two ids became `namedThirdParty`, a deterministic rule
  that withholds any body naming a business other than Gridsmith. It does **not** attempt to
  detect disparagement — that is the unreliable classification the owner ruled out — so it
  over-withholds by design. Measured live: the same **10 published, 2 withheld**, each named by
  the business it matched, with no collateral withholding of the other ten. The manual list
  remains as the human-review limb for what no rule reaches, and `check:reviews --live` pins the
  set a person has read so a new review makes it red rather than reaching the homepage unread.

### Closed in GS-P06

- `GS-O013` — **approved with remediation, and closed because the remediation is implemented in
  the canonical content source**, not in a review document. Six classes of correction; the service
  architecture, the 46 records, the 81 capabilities, the no-pricing and no-portfolio positions and
  the Technical Design gate are all unchanged. **COMPLETED.**
- `GS-O014` — **approved with the Master-only amendment, and closed on verified implementation.**
  The pipeline is live on `/`, the division review blocks are gone, and the one-source property is
  real: the CMS reader, its type and its component were deleted in the same commit. **COMPLETED**,
  with the published *count* carried forward as `GS-O015` rather than silently absorbed.

### Closed in GS-P05

- `GS-O012` — eight of the nine marketing channel services confirmed as current capabilities and
  represented as six new `DIGITAL_MARKETING_ENGAGEMENT` rows; no new division, group, CMS type,
  route or orchestration. `Media buying` was not confirmed and is not inferred. **COMPLETED.**
- **The `GS-P04` 12-vs-6 review finding, corrected.** Twelve reviews verified independently
  against `freelancer.com/u/GridsmithLTD` and the official API. The repository's six were an
  incomplete ingestion, not the whole of the evidence, and the owner's figure was right. No owner
  action is owed; `GS-P04`'s record is preserved and annotated rather than overwritten.

### Closed in GS-P04

- `GS-O006` — every listed Design, Digital and Press service approved. **COMPLETED.** Copy
  acceptance moved to `GS-O013` rather than being closed with the list.
- `GS-O011` — Digital Marketing confirmed as a cross-division engagement; review project titles
  anonymised. **COMPLETED.** Narrow remainders are `GS-O012` and `GS-O013`.
- `GS-T007` — development dataset reconciled under the owner’s explicit authorisation: 46 obsolete
  seed documents deleted by provenance, 119 written, genuine records preserved, run idempotent.
  **CLOSED.**

### Closed in GS-P03

- `GS-O002` — service inventory supplied and recorded. **COMPLETED.**
- `GS-T001` — pricing required by schema and renderers. **CLOSED in repository.**
- `GS-T002` — price-producing Digital estimator. **CLOSED** — route removed.
- `GS-T003` — public work/case-study/book surfaces and gates. **CLOSED in repository** — routes and
  blocks removed, types dormant, gate lists updated.

### External-review blockers

- `GS-X001` — solicitor review of the legal instruments and the impact of `GS-D001`/`GS-D002`.
- `GS-X002` — professional review appropriate to engineering/CAD claims and the drawing matrix.
  **Retained at `GS-PROD-003-R1`** as the only gate on the three Technical services (claims review,
  independent of insurance; the drawing-matrix limb has no subject). `OWNER-ACTIONS.md`.

### Human-acceptance blockers

- `GS-R001` — **PARTIALLY DISCHARGED, 16 September 2026.** Keyboard, responsive (375/768/1440/wide),
  Chromium, content and accessibility-automation passes are done and recorded in
  `GS-R001-STAGING-RC.md` §7. **Three items remain and are not claimed as done: a real
  screen-reader pass, a physical-device touch pass, and Firefox/Safari** — none of those engines
  or tools is available in this environment, and `check:axe` passing is not a screen-reader test.
- `GS-R002` — owner acceptance of all four sections together before production release.
- `GS-R003` — live post-cutover verification before any `PRODUCTION READY` declaration.

## Detailed registers

- **Staging release-candidate evidence: `docs/_shared/GS-R001-STAGING-RC.md`**
- Service model and reconciliation: `docs/_shared/SERVICE-ARCHITECTURE.md`
- GS-P02 evidence and activation plan: `docs/_shared/GS-P02-SECURITY-MIGRATION-REPLAY.md`
- Owner dependencies: `docs/_shared/OWNER-ACTIONS.md`
- Current phase handoff and verification: `docs/_shared/AI-HANDOFF.md`
- Permanent agent controls: `docs/_shared/AI-DEVELOPMENT-PROTOCOL.md`
- Dependency ordering: `docs/_shared/02-BUILD-SEQUENCE.md` (GS-P00 section is authoritative)
- Historical detail: division project trackers and `docs/_shared/05-HANDOVER.md`
