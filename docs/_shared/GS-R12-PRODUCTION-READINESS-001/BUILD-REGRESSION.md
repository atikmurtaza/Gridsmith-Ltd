# F. Build and regression report

## 1. Environment and identity

| Item | Value |
|---|---|
| Host | Windows 11, Git Bash; **not** CI-equivalent (CI is `ubuntu-24.04`) |
| Node / npm | v24.15.0 / 11.12.1 (engines `>=24.15.0 <25`) |
| Browser for local gates | Puppeteer cache Chrome for Testing **148.0.7778.97** (same version CI used before Option A); `CI` unset so the uncontrolled Windows path is used |
| Extra forward check | System Chrome **155.0.8059.80** for the Master scene only |
| Env | `NEXT_PUBLIC_SANITY_DATASET=development`, `GRIDSMITH_REVIEW_PRESENTATION=owner-staging`, `NEXT_PUBLIC_SITE_URL=http://localhost:3000`, `PROJECT_URL=<Preview>`; no `.env.local`, no secrets |
| Network | Tokenless read-only GETs to the Sanity **development** dataset (build, `check:launch`, `check:service-content:dataset`); npm registry reads for install/audit. No Production read |
| Main run tree | `bb2343fd` + untracked docs. Later commits `cf2cd083` (test-only), `e2744e54` (Press gate wait) were verified by their own targeted runs (§3) |

## 2. Results — CI-ordered local run (`bb2343fd`)

| # | Step | Result | Time | Notes |
|---|---|---|---|---|
| 1 | `browser-input.selftest` | PASS | — | 406 JS cases + 140-case Python selftest |
| 2 | `verify:static` (61 gates, incl. new `check:deps:overrides`) | PASS | 91 s | typecheck, ESLint (0 warnings), contrast/tokens/headings, legal adoption + selftests, struck rules, lists, schemas, RLS (static), lead security, CMS dry run, static selftest |
| 3 | Master lifecycle selftest | PASS | 1 s | |
| 4 | `next build` (clean `.next`) | PASS | 57 s | 73 static pages |
| 5–7 | `lint:secrets`, `check:tokens`, `check:theme` | PASS | 1 s each | |
| 8 | `size` | **FAIL** at the old 2.8KB budget → **PASS** after the owner raised it to 2.9KB (18 Oct) | 2 s | Shared-baseline assertion only: 2.8732KB (**BLD-01**). All 69 route budgets, consent banner (2.1/3KB), Master 7.8/15KB pass |
| 9 | 18 served gates (`with-server`) | 16 PASS, 2 FAIL | 56 min | see below |
| 10 | `check-master-accessibility` | PASS | 65 s | 12 consent (footer focus, SC 2.4.11) + 2 live reduced-motion |
| 11 | `--manual-scroll-only` | PASS | 9 s | |
| — | LHCI desktop/mobile | SKIPPED | — | chrome-launcher EPERM on Windows (`lhci-availability.mjs`); CI-only |

### Served gates

| Gate | Result | Key reading |
|---|---|---|
| `check:axe` | PASS | 76 analyses (19 routes × 375/1280 × initial/scrolled), **0 violations**; 893 incompletes each allow-listed to a pixel gate, 0 unresolved |
| `check:security-headers` | PASS | 3 routes; CSP, framing, referrer, MIME, permissions, HSTS; no X-Powered-By (Next server, not the static host — see report E) |
| `check:redirects` | PASS | 5 legacy URLs one 308 → 200; WordPress defaults 308 → 404 |
| `check:launch` | PASS | development dataset: statutory fields present; production-only refusals (seed, Technical) correctly not applied |
| `check:responsive` | PASS | 17 fixed bottom bars below 768px covered by scroll-padding (SC 2.4.11) |
| `check:consumer-terms` | PASS | 206 links, 0 to business terms from consumer routes |
| `check:legal:parity` | PASS | 6 documents, 107 clauses, 437 paragraphs word-for-word |
| `check:vat` | PASS | 17 routes; no VAT labelling or number |
| `check:press:type` | PASS | 45 blocks within 52ch |
| `check:press:scene` | **FAIL → fixed** | `pr-au-voice contrast` — gate timing defect, fixed in `e2744e54` (§3) |
| `check:path:live` | PASS | 7 answer sets, 0 CTAs carry answer data |
| `check:service-content:dataset` | PASS | 88 services / 47 records |
| `check:reviews:ui` | PASS | cylinder, keyboard, reduced motion |
| `check:company` | PASS | 10 questions over 18 routes |
| `check:master:scene` | **FAIL → PASS in isolation** | Q8 software-WebGL blocking 217 ms during host contention (my concurrent lint/selftests and review agents); isolated re-run **all 14 questions PASS** (184 ms); Chrome 155 run 32 ms |
| `check:master:hero` | PASS | 18 sizes |
| `check:design:scene` | PASS | 25 sizes + R2 lifecycle |
| `check:digital:scene` | PASS | compass contrast min 7.45:1; map timing 703/297 ms |

## 3. Failures investigated

### `check:press:scene` — `pr-au-voice contrast` (gate defect, fixed)

- Reproduced in isolation (deterministic on this host), so not contention.
- Fresh-page measurement: 7.39:1 settled. In the gate's sequence the state-cue loop clicks a label
  and samples immediately, inside the label's `transition: color/background-color 0.15s`. Replay of
  the full gate with instrumentation recorded **1.02:1, 2.89:1, 4.95:1** on successive runs with a
  mid-transition foreground `rgb(60,78,66)` (settled ≈ `rgb(31,52,40)`). The visible frame is
  readable dark green on gold.
- The gate's own selection loop already waits 800 ms after each click; the state-cue loop did not.
- Fix (`e2744e54`): same 800 ms settle wait; predicate and threshold unchanged; assertion message now
  includes the measured ratio. Helper negative proofs (1:1, translucent, hidden, out-of-scope) still
  run at gate start.
- After: **two consecutive full `check:press:scene` runs PASS**.
- Not a visitor-facing defect: the 150 ms crossfade between selected/unselected states is
  transitional; the settled state is 7.39:1.

### `check:master:scene` Q8 — timing under contention

217 ms vs the limit with other processes running; 184 ms isolated (pass, narrow margin on this
host's software WebGL); 32 ms on Chrome 155. Classified as host load, not an application change.
Margin noted as a warning for slow runners (BPH-07).

### `size` — BLD-01 (owner decision taken)

Owner raised `SHARED_BASELINE_BUDGET_KB` to 2.9KB on 18 Oct 2026. Clean in-tree build, probe off:
`npm run size` **PASS** (2.8732KB). Probe on (re-sized to 64 characters): fails with "shared baseline
is 2.95KB, over its 2.9KB budget", proving the assertion is reachable in its 0.1KB window.

### `check:edge:ui` — thank-you title race (gate defect, fixed)

One run on the exported artifact failed `assert(title includes 'That has reached us')` right after
the URL changed, although the exported `press/contact/thank-you.html` carries that title; an
instrumented replay read the correct title immediately. Next's client router can apply the title
after the URL. Fix (`d3013441`): bounded wait for the title before the unchanged assertion. After:
two consecutive full runs PASS.

### `check:deps:overrides` — native node.exe crash in the FTP harness (contained)

An exit 127 in a later `verify:static` run was Windows status `0xC0000409` (native fail-fast in
node.exe v24.15, no stderr). Localised to the loopback FTP sequence and reproduced with the
**original** basic-ftp 5.3.1 (5/200) as well as 6.2.3 (≈1%), so it is a runtime fault, not the
override. Contained in `ff2a0558`: FTP behaviour runs in a child; one reported re-run only for that
exact Windows status; assertion failures, other statuses or a second crash still fail. Branch
proofs with stand-in children passed; **1,000 gate runs: 0 failures, 9 contained re-runs**.
`verify:static` then PASS on the `ff2a0558` tree (61 gates; parity with `ci.yml`).

## 4. Static export (private legal-preview profile) — run on `e2744e54`, then `d3013441`

Env: `GRIDSMITH_LEGAL_PREVIEW=adopted-development`, `NEXT_PUBLIC_SANITY_DATASET=development`,
`NEXT_PUBLIC_LEAD_INTAKE_URL=<isolated Preview gs-lead-intake>`; served by a loopback-only plain
file server mirroring the `.htaccess` resolution (no headers applied — see report E, SEC-HDR-PARITY).

| Step | Result | Reading |
|---|---|---|
| `verify:static` on final HEAD (`e2744e54`) | PASS | 95 s |
| `build:static` | PASS | 111 s; "Owner-authorised staging artifact only" |
| `check:static:artifact` | PASS | **62 routes, 218 files, 32,826,256 bytes**; 0 supplied secret values (pattern scan only) |
| `check:static:ui --legal-preview` | PASS | 21 pages: scenes, reviews, Path Finder, navigation, reduced motion, skip link, 404; focused axe **41 analyses, 0 violation rules**; no-JS 20 pages; seven development legal documents match adopted content and fingerprints exactly |
| `check:edge:ui` (in-memory Edge transport) | PASS ×2 after `d3013441` | 4 accepted paths; 10 focused axe analyses; pending/value/error/focus/redirect |

Historical comparison: 62 routes / 216 files (R3, 10 Oct), 217 (R12-STABILITY), 219 (R12-PRESS-FIX);
today 218. The file count follows content and probe exclusions; the artifact gate, not the count,
is the acceptance criterion.

## 5. Not run here

- Lighthouse desktop/mobile (Windows limitation); last CI measurement `8fec6426` (Chrome 154):
  desktop performance 1.0 on all 11 routes; mobile LCP 900–1088 ms vs budgets 1750–2000; TBT
  81–108 ms; CLS 0. Not candidate evidence.
- Production-profile static export (needs a read of the Production public dataset — owner decision
  BPH-05).
- Any CI, staging or production test.
