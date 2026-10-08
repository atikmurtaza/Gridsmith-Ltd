# GS-LEGAL-001-R12-CI-FIX — Master/Digital contrast repair

8 October 2026. Local repair of `ea9a59df73ab3da6877c38e8c1b34d4cd2fc68a8`
on `claude/sweet-mendel-11qvli`. No deployment or legal publication is authorised.
Exact final commit and CI outcome are session-closeout evidence; this record does not
infer them from local success.

## Cause and scope

[Failed CI](https://github.com/atikmurtaza/Gridsmith-Ltd/actions/runs/37775747185),
attempt 2, measured Digital accessibility 0.96 in two of three mobile runs.
The normal-size callout description/count had effective contrast 4.14:1 and
3.45:1 on the dark backing. Its ancestor's 220ms opacity cross-fade exposed
partly composed text. Settled token contrast alone could not establish readability.
The approved settled palette is sufficient; the opacity transition is the defect.

Attempt 1's two Master failures concern the static paragraph above the drum:
“Selected reviews from our Freelancer profile, reproduced word for word.”
The artifact's reported text coordinates intersect carousel controls in its screenshot.
That supports a capture/compositor mismatch, but the exact original trigger remains
unconfirmed. The same baseline passed focused local runs; that does not disprove the
CI result. Separately, the drum's existing 40–50° word fade genuinely exposes
partly opaque text; its scene gate previously compared uncomposited foreground RGB.

Digital now changes label visibility and opacity together, with no opacity transition.
Transform choreography and the leader fade continue. Master holds words at opacity 1
until the existing 50° cutoff, then opacity 0 together. The cylinder, facets, canvas,
manual controls and focus promotion retain their motion. Review text/provenance,
anonymous fallback and all eleven accessible reviews are unchanged.

## Permanent regression proof

Existing served gates now measure the affected text, without a new workflow bypass:

- `check-reviews-ui`: 320/390/1440px, angles 0/40/45/49.9/50.1/60/90°,
  actual pointer dragging, far-side provenance focus, autoplay, pause, reduced motion,
  and native no-JS grid. Focus must reach its exact reading angle before capture.
- `check-digital-scene`: 412×823 and 1440×900, all five callouts in Hero/Final and
  desktop Map, hover/focus and reduced motion. Desktop Final converges after lazy
  chapter layout and checks the real state/viewport; mouse movement avoids the
  automation API's automatic scrolling of sticky descendants.
- `rendered-label-contrast`: glyph masks from transparent/black/white text captures,
  actual pixel backgrounds, composed ancestor opacity, a 5:1 safety floor, explicit
  nonempty subjects and a capture geometry guard. Unpainted perspective boxes do
  not count as measured glyphs. Every selected Digital callout and focused Master
  review must supply painted pixels.
- Animation-frame sampling begins before document rendering, includes hydration
  and interactions, and rejects any visible text with fractional ancestor opacity.
- Committed helper specimens prove readable, low-contrast, faded, empty and moved
  subjects; opacity sampling is proven to report both 0 subjects and 0.3 opacity.
- Master bare-scene capture explicitly hides every descendant with visibility,
  preserving the drum's 3D geometry. A permanent specimen proves the root-only
  visibility leak and geometry preservation. Background capture rejects changed
  text coordinates; the gate now records fractional opacity instead of crediting
  uncomposited text as readable.

No accessibility threshold, Lighthouse assertion, axe audit or incomplete allowance
was lowered or suppressed. No permanent CI sleep was added.

## Local measured evidence

Focused Master checks passed repeatedly, including the full review gate. Minimum
sampled caption contrast: 9.84:1 at 320/390px and 9.39:1 at 1440px. Every review
remains keyboard reachable; eleven provenance links, focus outlines, anonymous
captions, pause/autoplay, reduced-motion arrows and no-JS content pass.

Focused Digital checks passed repeatedly, including an independent run. Minimum
sampled callout contrast: 7.45:1. The complete focused matrix reaches 40 glyph
boxes on mobile and 70 on desktop; reduced mobile reaches 40. Initial/hydrated
and transitional frame samples contain only whole-opacity painted labels.

Local Linux Lighthouse 12.6.1: two batches of three mobile runs per route and one
batch of three desktop runs per route, for `/` and `/digital`. All 18 runs score
accessibility 1.00 and best practices 1.00; every configured assertion passes.
Mobile performance 0.98–1.00; LCP 874–960ms; CLS 0; TBT 68–160ms.
Desktop performance 1.00; LCP 595–630ms; CLS/TBT 0.

Full local `verify:static`, typecheck/lint, clean Next builds on Windows/Linux,
launch-build gate, tokens/theme/bundle gates and `git diff --check` pass.
Master scene: all 14 questions, 12 viewports, six chapters and twelve transit
positions, footer handoff, reduced motion and no-WebGL/software fallback pass.
The two affected widths also pass all 14 questions in the local Linux environment.
Master hero: 18 sizes pass. Digital scene: 2,012 text boxes across six sizes pass.
Responsive: 51 route/width combinations pass. Full axe: 76 analyses, zero
violations, plus two clean deferred-footer analyses; existing incomplete
classifications remain unchanged. The characterised SSR crash-shell gap M-P1-1
is unchanged; passing these gates does not claim universal WCAG acceptance.

Private static UI: 70 legal viewport/JS combinations, 102 legal navigation links,
20 no-JS pages and 41 axe analyses with zero violations pass. Company facts:
ten questions over 18 routes pass; VAT, legal overview routing, security headers
and redirects pass. Source/client/public secret scan: 266 sources, 48 chunks,
20 assets, two available secret values checked, clean. Static contract:
219 files and three available secret values checked, clean, including frozen
review anonymity predicates. The service-role value is unavailable to the
scanner; builds and test servers receive no private provider credentials.
Live Production RLS/mail and hosted acceptance are not exercised.

Reproduction uses a disposable local Debian Bookworm Docker environment with
Node 24.15.0 and Chrome 155.0.8059.39, using CI's Lighthouse version, three-run
collection, mobile 4G/devtools throttling, viewport and unchanged assertion matrix.
Only the local URLs are narrowed to the affected routes. Failed CI used Ubuntu
and Chrome 154; Windows served gates use Puppeteer's Chrome 148. Local evidence
therefore complements, rather than substitutes for, exact-SHA GitHub CI.

## R12 preservation and safety

The private development legal artifact was rebuilt: 62 routes, 219 files.
Seven development CMS legal records match the adopted source and fingerprints
before and after generation; no reseed or CMS mutation occurs. Served parity
matches six instruments, 107 clauses, 437 paragraphs and 107 clause references.
The draftless overview is covered by exact generated-content/adoption comparison
and its routing checks. Adoption selftest: 105 cases; seven OWNER_ADOPTED, zero
PUBLISHABLE. The legal drafts, adoption register and production manifest remain
byte-identical to the starting commit.

Offline production migration: 47 eligible records, ten excluded (seven legal and
three Technical), manifest in agreement, no provider read/write. Production
publication prerequisites, canonical routes, forms/Edge functions, permissions
and Hostinger architecture remain unchanged.

One independent read-only reviewer passed the final source, helper proofs,
Digital focused run and representative normal-style Master/Digital screenshots.
It found no remaining blocker; full suites and Lighthouse are primary-agent
evidence. Exact original Master capture trigger remains unconfirmed.

No Hostinger deployment/dispatch, gridsmith.uk/DNS change, Production Sanity or
Supabase call, Edge deployment, H4-B/H4-H action, main merge, purchase, migration
or legal publication occurs. If final CI passes, the exact next phase is separately
owner-authorised **GS-LEGAL-001-R13 private staging deployment and served acceptance**.
CI closure does not itself authorise that phase. STOP before deployment.
