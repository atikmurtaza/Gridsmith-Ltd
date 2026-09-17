# `GS-R001-R` — staging content, brand and experience remediation

**Phase:** `GS-R001-R`
**Predecessor:** `GS-R001`, which produced a staging release candidate recorded **`RC TECHNICALLY
PASS`** and **not accepted by the owner**.
**Date:** 17 September 2026
**Evidence for:** `GS-O008`, which stays **OPEN — AWAITING OWNER RE-REVIEW**.

> **This document is the record. `AI-HANDOFF.md` is the summary.**

---

## 0. Why this phase exists, stated so it is not mistaken for a polish pass

`GS-R001` passed every gate it had and the owner rejected what those gates were not asked about.
That is the finding, and it is worth more than any individual fix below: **forty-five gates were
green on a candidate carrying `[SEED]` markers on four public routes**, because every gate that
knew about seed content read the *dataset* and keyed off the *production* dataset name, while
every staging candidate is built from `development`.

So the one environment a human reviews was the one environment nothing checked.

`check:company` questions 7 and 8 close that, and question 8 found a fifth route nobody had
raised — `/press/path-finder` — within one run of being written. §4.

---

## 1. What changed, in one table

| Area | Before | After |
|---|---|---|
| `/insights` | **9 published** `[SEED]`-marked agent-authored articles | **0 published.** 9 **editorial briefs**, `status: 'brief'`, served by nothing |
| `post` schema | no publication state | `status` (closed: `brief`/`draft`/`published`) + `brief` (`editorialBrief` object) |
| Post queries | every non-draft post | `status == "published"`, strict equality, in all three queries |
| `/about` | `[SEED]` intro + 2 `[SEED]` sections + **"The checkable facts"** table + `tel:` row | written copy, 4 brand sections, a **connection block**, one subordinate legal line |
| `/approach` | `[SEED]` intro + 4 `[SEED]` sections | written copy, **6** sections, the canonical six stages **unchanged** |
| `/press/path-finder` | 8 `[SEED]`-prefixed outcome strings | the same 8 sentences, unmarked. **`SEED_RULES` byte-identical** |
| Telephone | `tel:` on `/about`, `/contact`, `/press/contact`, footer | **no `tel:` anywhere.** WhatsApp + SMS on both contact routes and `/about`; text-only in the footer |
| `telHref` | the one derived href | **deleted**; `whatsAppHref` + `smsHref` replace it |
| Social | none | Freelancer (the one verified channel) + Email + WhatsApp + SMS. Everything else **omitted and reported** — `GS-O017` |
| Gates | 45 | **46** — `check:company` grew questions 7 and 8 rather than a new gate; `check:mark:field` is genuinely new, and its subject is a fixed scroll-driven layer no existing gate could see |
| Brand assets | **none in the repository** | 3 owner-supplied files in `public/brand/`, verified; the SVG is the header logo and the animation's geometry source |
| Master homepage | `HeroMark` only | plus a fixed background field carrying the logo's own geometry, scroll-driven, **zero JS** |
| `check:company` self-test | 35 cases | **57** |
| `check:struck` | 16 rules / 32 specimens | **18 rules / 36 specimens** |
| `check:schemas` closed lists | 6 | **7** |

**Not touched:** the service architecture (3 divisions, 14 capability groups, 46 records, 81
capabilities), the no-pricing position, the no-portfolio position, the Technical Design gate, the
Freelancer review pipeline, the Path Finder's decision rules, Supabase, the production Sanity
dataset, DNS, Hostinger and `gridsmith.uk`.

---

## 2. `[SEED]` — the classification, because removing a marker is not the fix

`GS-R001-R` §3 is explicit that stripping the prefix is prohibited. Every marked string was
classified first, and the four answers were different:

| Content | Classification | What was done |
|---|---|---|
| `/about` and `/approach` prose | **synthetic filler** — sentences that said nothing a reader could use | **rewritten**, from the approved architecture, the canonical process and the recorded commercial positions. No new company fact is asserted |
| The nine `/insights` posts | **fabricated thought leadership** | **not unmarked.** They stopped being articles. Nine editorial briefs replace them, unpublishable by construction |
| Path Finder outcome copy | **truthful explanatory paragraphs, unapproved** | marker removed, sentences kept, one wording alignment to `GS-D002` language |
| `teamMember` and `faq` seed records | **genuinely fabricated, and rendered by nothing** | **left exactly as they are**, `[SEED]`-marked. Neither has a query |

The distinction that made this tractable: **a marker in rendered text and a flag in a record are
different things.** `isSeed: true` stays everywhere it was — it is what `check:launch` reads to
refuse promotion to production, and it is still correct. What is withdrawn is the *label a
visitor sees*.

### 2.1 The editorial brief model

`post.status` is a closed three-value list enforced on **write** by `postStatusRule`, not only by
the Studio's dropdown — `check:schemas` refused the field until it was.

`lib/sanity/queries.ts` holds one constant, `PUBLISHED = 'status == "published"'`, used by all
three post queries. **Strict equality, never `coalesce(status, "published")`**: a document
written before the field existed has no `status`, and coalescing would publish precisely the nine
records the field was added to stop publishing.

`listPostSlugs` feeds `generateStaticParams`, so an unpublished post is not hidden — **no page is
built for it.** Verified in the build output: `/insights/[slug]` lists zero child paths.

Each brief carries premise, intended reader, central question, arguments, a suggested structure
and the research questions nobody has answered yet. **Everything in `research` is phrased as a
question**, which is the opposite of the nine articles it replaces. No excerpt, no body, no
author, no `publishedAt` — each of those is the owner's to write, and seeding a placeholder for
any of them is how the nine happened.

The nine topics are the owner's, from the `GS-R001-R` brief. Titles are refined for clarity;
**no subject was changed, added or dropped.**

---

## 3. The contact channel

**Superseded:** `GS-O004`'s `tel:` limb, and only that limb. The number is unchanged, still
published, and still the number the live `gridsmith.uk` shows.

| Surface | Treatment |
|---|---|
| `/contact`, `/press/contact` | *"The same number takes WhatsApp and text messages"*, each linked with its own scheme |
| `/about` | the connection block — Email, WhatsApp, Text message, Freelancer |
| Statutory footer | **text, not a link** |

The footer decision is the one worth defending. A WhatsApp link there would satisfy every rule in
`check:company` and still be wrong: that block is a Companies Act and e-commerce-regs disclosure,
it is on all 77 routes, and a messaging call-to-action inside a legal notice is marketing in a
place that is not marketing. reg. 6(1)(c) needs the number **readable**; clickable was never the
requirement, and the email beside it is a link.

`whatsAppHref` and `smsHref` are **derived from the displayed string**, for the reason `telHref`
was: a stored second copy is how the number you read and the number you reach stop being the same
number — the defect the live site already has with its two email addresses
(`LIVE-SITE-EXTRACT.md` §11.2). `wa.me` takes the international form with no `+`; `sms:` keeps it
per RFC 5724.

**No business hours, no SLA, no guarantee** — `GS-O004` unchanged. *"We typically respond within
48 hours"* remains the single source, and it now sits beside two asynchronous channels, which is
coherent in a way a telephone was not.

---

## 4. The gate that found a route nobody had raised

`check:company` question 8 refuses a placeholder marker in **served text**. On its first run it
went red on `/press/path-finder`.

That route was not in any finding. `GS-R001-STAGING-RC.md` §6.1 listed `/about`, `/approach` and
`/insights` — the three a person had noticed. The fourth had been serving `[SEED]` to every
visitor of every staging build since the Path Finder was built, and the reason nothing caught it
is structural rather than careless: **`check:launch`'s seed rule reads the dataset, and the Path
Finder's seed config is a TypeScript file, not a CMS record.** No dataset query could ever have
reached it.

This is the fourth instance of `_shared/01-VALIDATION-REPORT.md`'s recurring shape — a gate
correct at the boundary it names and silent about the boundary that carries the cost.

**What was done is narrow.** The six `explanation` and two `externalGuidance` strings lost their
prefix; the sentences stand. `SEED_RULES` was asserted **byte-identical** before and after, and
`isSeed: true` on the config is untouched. `Q-P13` is not reopened.

---

## 5. Verification

### 5.1 The chain

| Check | Result |
|---|---|
| `verify:static` — 45 gates | **PASS** |
| `verify:build` on a wiped `.next` | **PASS** — 68 routes compared, all inside delta budgets; master **1.9KB of 15KB** |
| `verify:served` — 14 commands | **PASS** |
| `check:axe` | **76 analyses, 19 routes × 2 widths × 2 states, zero violations**; 138 incompletes allowed, **0 unresolved** |
| `check:mark:field` | **PASS** — 7 viewport/motion cases, 14 pieces, rendered in 5, animated in 2, static in 3, no horizontal overflow at any scroll position |
| `check:mark:guard` | **2** `animation-timeline` declarations, all inside their `@supports` — the count moved 1 → 2 with the new layer |
| `check:company` | **8 questions over 18 routes**, 18 statutory footers, **no `tel:` on any route** |
| `check:responsive` | PASS |
| `check:reviews:ui` | **10 cards on `/`, 0 on all three divisions** — unchanged |
| `check:launch` | 113 published seed documents on `development`; production tier correctly inert |
| `npx tsc --noEmit`, `eslint --max-warnings 0` | clean |

Lighthouse is CI's — it cannot run on Windows (`chrome-launcher`'s `destroyTmp` races Node 24's
`fs.rmSync`, a known and recorded environment fault).

### 5.2 Deliberate-failure proofs

**`check:schemas`, `post.status` — three branches, each red, subject restored byte-identical**
(SHA-256 captured before the first mutation and re-verified after):

| # | Injection | Named in the red |
|---|---|---|
| P1 | a fourth value `ready` in `POST_STATUSES` | `post.status allows "ready"` |
| P2 | `.custom(postStatusRule)` removed | `never calls .custom()` **and** the required-rule message, both |
| P3 | `draft` removed from the list | `no longer allows "draft"` **and** `refuses "draft", which it must accept` |

The closed-list **count moved 6 → 7**, which is what proves it is counted rather than printed.

**`check:company` questions 7 and 8 — fired on served content, in one build:**

| # | Q | Injection into `/contact` | Named in the red |
|---|---|---|---|
| P4 | 7 | `Or call us.` | `CALL-CTA-IMPERATIVE` **and** `CALL-CTA-OR-CALL`, both |
| P5 | 8 | `[SEED] Placeholder.` | `SEED-MARKER` **and** `PLACEHOLDER-WORD`, both |

Problem count moved **0 → 4**; exit code `1`. **A red carries its own validity proof** — the gate
named the injection, so the injection reached it. The subject was restored from bytes captured
before the mutation, verified by SHA-256 (`d4ddcc2f…`, identical), and a residue grep found
nothing.

Every rule limb is additionally proven by **return value** in the 57-case self-test, which is the
structural probe: each `CALL_RULES` and `PLACEHOLDER_RULES` entry has a specimen asserted to fire
**and to be the only rule that fires**.

**`check:mark:field` — seven branches, each red, each naming its own injection.** Subjects
restored from bytes captured before the first mutation and verified by SHA-256 (`70395797…` for
`master.module.css`, `05b32fa1…` for `BackgroundMark.tsx`, `4bab981b…` for `chrome.module.css`),
with a residue grep after each:

| # | Injection | Named in the red |
|---|---|---|
| F1 | `animation-timeline: scroll()` restored — **the original defect** | *did NOT move at 50% scroll … timeline INACTIVE* on 1024 and 1440 |
| F2 | narrow-width suppression removed | *field display is "block"; expected display:none* on 375 and 767 |
| F3 | reduced-motion guard removed | *moved at 50% scroll … must be static here* |
| F4 | one sphere deleted | *13 piece(s) … expected 14* on all five rendered cases |
| F5 | `aria-hidden` removed | *field is not aria-hidden* |
| F6 | logo path pointed at a file that does not exist | *is not /brand/gridsmith-logo.svg* |
| F7 | logo box made non-square | *24x38.3906, not square* |

**F5 caught a defect in this gate, on its first run, and the fix is recorded because the defect
is the interesting part.** The element selector was
`[class*="field"][aria-hidden="true"]` — so removing the attribute stopped the element matching
and the gate reported *"not in the document at all"* rather than *"not aria-hidden"*. It was
still a red, caught by the hollow-subject guard, but **the branch it was written to prove had
never executed.** That is `A-GATE-4-3` in miniature, found by proving the gate rather than by
reading it. The selector is now `div[class*="field"]` and F5 was re-run: it names the right
branch.

**Two clean cases are as load-bearing as the firing ones**, and both were written because the
naive rule would have been wrong:

- *the noun "phone" alone is not an invitation* — a page may need to say the number is not a
  phone line, and a rule firing on the noun would refuse the sentence that explains the decision;
- *the surviving published number with no call invitation* — the number itself is not struck, so
  `check:struck` must not fire on a line naming it.

**`check:struck`** — two new rules, each with an annotated specimen, a separate unannotated
branch case, and a *not-a-subject* case. `ZERO-SUBJECT` count moved **16 → 18** deliberately.

### 5.3 What the self-test caught that reading did not

The `PLACEHOLDER — the GS-R001 staging string itself` case was written asserting **one** problem
and failed: the real string `[SEED] Placeholder standfirst…` trips **two** rules. The gate was
right and the assertion was wrong. It now asserts both by name — and a count moving 1 → 2 on one
input is a second demonstration that these are counted.

---

### 5.4 A `rgb(` literal in a gate's own prose

`lint:colors` went red on `scripts/check-axe.mjs` — the allowlist entry's justification quoted a
measured card background as an `rgb()` literal. The gate is right: colour belongs in the token
files and nowhere else, and it does not make an exception for a comment. The prose was reworded
to describe the measurement instead of quoting a colour function. **No exemption was added.**

---

## 6. `check:struck` refused a history rewrite, correctly

`GS-R001-R-SEED-POSTS` went red on `master/PROJECT-TRACKER.md`'s `S-01` row — *"45 FAQs, 9 posts,
4 team"* — which is a **historical record of what ran on 21 August**, not a standing rule.

Striking it in place would have rewritten history, which the brief forbids. The row is left
**verbatim** and a new `S-01a` row beneath it records the supersession, which both preserves the
record and gives the gate its annotated subject. `S-02` was closed in the same edit: it specified
24 seed projects, which `GS-P03` removed at `GS-D001` and nobody had marked closed.

---

## 7. What was deliberately NOT done

- **No dependency was added for the animation.** GSAP (46.1KB gz, measured and rejected at
  `N-01`), Three.js and WebGL were all declined; the effect is `animation-timeline` and a
  stylesheet, and the homepage JS delta is unchanged at **1.9KB of 15KB**.
- **The brand geometry was not modified.** No trace, no approximation, no recolour of the
  supplied files. The animation transcribes coordinates from the verified vector; the static
  logo is served byte-for-byte as supplied.
- **No favicon was created.** §22: the favicon is a separate decision, and there is none to
  keep — `OWNER-ACTIONS.md` carries it.
- **No Open Graph image was composed.** The 3D render is now available for one, but background,
  wordmark and margins are brand choices nobody has made.
- **No social channel was guessed.** §9.
- **`Q-P13` is not reopened**; `SEED_RULES` is byte-identical.
- **The six canonical process stages are not reworded.** `_shared/00-PROCESS.md` fixes them, and
  the owner's `Understand → Scope → Create → Review → Deliver → Continue` reading *is* what the
  six already are — so `/approach` explains the mapping rather than substituting labels.
- **Stage 6's *"SEO improvements"* in a division-neutral description is still open** — an owner
  content decision (`F1`), carried from `GS-R001-STAGING-RC.md` §8 item 10.
- **No redirect activated.** No DNS, no Hostinger, no `gridsmith.uk` change, no production
  deployment.
- **No Supabase call of any kind.** `GS-T004` not applied.
- **No production Sanity call.** One `development` write, through the existing provenance-bounded
  `npm run seed`.
- **No dependency added.** No icon library, no animation library, no stock photography.
- **The favicon decision is untouched** — and there is no favicon to touch. §8.

---

## 8. The brand assets, verified before use

The owner supplied three files to `public/brand/` at the gate. **None was trusted on its
filename**, which is what the brief asked for and what the SVG's own `<desc>` made necessary —
it calls itself a *"recreation"* of the supplied logo.

| File | Intrinsic | Colour | Alpha | Bytes |
|---|---|---|---|---|
| `gridsmith-logo.png` | 1536×1536 | RGBA 8-bit, non-interlaced, no `sRGB`/`iCCP` chunk | **real**, 0–255 | 669,476 |
| `gridsmith-logo-3d.png` | 2400×2400 | RGBA 8-bit, `sRGB` intent 3, `gAMA` 0.45455 | **real**, 0–255 | 3,317,305 |
| `gridsmith-logo.svg` | `viewBox 307.5 303 920 920` | vector, gradients, **no embedded raster** | n/a | 4,134 |

### 8.1 They are the same mark, and that was measured rather than eyeballed

A first visual overlay was *misleading*: the PNG's mark occupies 48% of its frame and the SVG's
80%, so at equal display size they appear offset and differently proportioned. That is framing,
not geometry.

Each file was rendered to an alpha mask, **normalised to its own bounding box**, and compared
shape to shape:

| Measurement | Result |
|---|---|
| Content aspect ratio | PNG **1.0293**, SVG **1.0302**, 3D **1.0302** |
| Shape IoU, PNG vs SVG | **0.9624** |
| Shape IoU, SVG vs 3D | **0.9883** |
| XOR area | **1.84%** of frame, 268 regions, largest 231px |
| XOR after 1 erosion | 40px (3.3% survive) |
| **XOR after 2 erosions** | **0px** |

The erosion test is the one that decides it. A structural difference — a missing sphere, a rod
in the wrong place, a changed proportion — survives erosion as a solid blob. **Nothing
survived**, so every disagreement between the raster and the vector is a sub-2px antialiasing
rim. The SVG is the mark.

**All three are the mark alone.** No wordmark, no lockup, no "Gridsmith" text in any of them.

### 8.2 The SVG is separable, exactly as the animation needs

`#cylinders` holds six `<rect id="cylinder-N">` with literal `x/y/width/height`; `#spheres`
holds eight `<use id="sphere-N">` with literal `translate()` and a shared `r="75"` circle.
Fourteen independently addressable pieces with exact coordinates — so the animation transcribes
numbers rather than tracing an image, and **no brand geometry was estimated by eye.**

### 8.3 Which asset is used where, and why the PNG is not the primary one

The owner asked that `gridsmith-logo.png` be primary **unless inspection establishes another is
technically more appropriate**. It does.

| | PNG | SVG |
|---|---|---|
| Bytes | 669,476 | **4,134** |
| Mark's share of frame | 48% | 80% |
| At 3× density | resamples | exact |

The header logo renders at ~24px on **all 77 routes, above the fold**, on a programme where
`Q-M16` measured an *empty* page at 1520ms against Digital's 1600ms LCP ceiling. 654KB to draw
24 pixels — half of it transparent padding — fails that arithmetic by two orders of magnitude.

**`gridsmith-logo-3d.png` is kept and deliberately unused.** At 3.2MB it belongs nowhere on a
rendered route. The one surface it would suit is an Open Graph card, which a crawler fetches
once and a visitor never does — and that is a **composition decision nobody has taken**
(background, whether a wordmark appears, safe margins). It stays with `GS-O007`.

**Neither PNG was modified.** Not cropped, not resized, not recompressed. Nothing needed to be,
because nothing renders them.

### 8.4 The logo is a CSS background, not an `<img>`

The mark is **decorative**: the word "Gridsmith" beside it is the link's accessible name and
says exactly what the mark says, so an `<img>` would carry `alt=""` — and a decorative image
with an empty alt belongs in the stylesheet. Three consequences, all wanted: no markup to get
wrong; no accessibility surface, so the link's accessible name is **unchanged** from what
`check-axe` has asserted since `M-03`; and `@next/next/no-img-element` never arises, with **no
rule disabled** to achieve it.

`next/image` was rejected on the `Link`-primitive precedent: it is a client component, this is a
**shared layout**, and the cost lands in every route's chunk. An SVG has nothing to optimise
anyway.

**The favicon is untouched, and there is none.** `GS-R001-R` §22 says to keep the existing
favicon and not to derive one from the logo. There was never one to keep: the repository held
**zero image files** before this phase. Creating one is a separate decision and is recorded as
such in `OWNER-ACTIONS.md`; it was not done here.

---

## 8A. The Master background mark

**Master only, and `/` only.** Mounted in the page rather than the route group's layout, because
`/about`, `/approach`, `/contact` and `/insights` share that layout and are not the Master
experience. Design, Digital and Press are untouched — `GS-R001-R` §19.

**The geometry is the logo's own**, transcribed from the verified SVG: eight sphere centres, one
radius, six rod rectangles. **The rendering is not the logo's**: the supplied mark is polished
gold with radial gradients and specular highlights, and reproduced at full saturation behind
body copy it would be an unreadable page. The pieces draw as **1px `--line` hairlines** — the
same rule every border on this site uses, and the same device `HeroMark` uses for its drafting
sheet. The static logo is served **unmodified**; this layer never claims to be it.

**Zero JavaScript.** `animation-timeline: scroll(root)`, one `@keyframes` block shared by all
fourteen pieces, each carrying its own `--dx`/`--dy`/`--dr` — the pattern `HeroMark` already
uses. The homepage JS delta is **1.9KB of 15KB**, unchanged. GSAP was measured at 46.1KB gz and
rejected at `N-01`; the reference page the owner pointed at uses WebGL, which is several times
that again. Neither was added.

Each piece moves **outward along its own line from the mark's centre**, 190–320 units against a
735-unit mark. A random direction per piece is the "generic SaaS blobs" failure the brief rules
out by name; a shared centre makes it read as one object opening.

| Scroll | State |
|---|---|
| 0% — hero | composed: the recognisable mark |
| 50% — mid-page | separated and reoriented |
| 100% — closing CTA | recomposed |

| Condition | Treatment |
|---|---|
| ≥1024px | the full narrative |
| 768–1023px | **composed and static** — the identity without the motion |
| <768px | **`display: none`** |
| `prefers-reduced-motion: reduce` | **composed and static**, by the `@supports`/media guard, not a slowed animation |
| No scroll-timeline support | same, by the same mechanism |

**Every state resolves to the assembled mark**, because the markup carries the composed position
and the keyframe's ends are `transform: none`.

Mobile is `display: none` rather than a compromise: `01-VALIDATION-REPORT.md` §18 measured **no
region of this page free of text at any scroll position** at 375px, so every pixel of geometry
would sit under the reading column on the devices least able to spare the compositor work.

`aria-hidden` on the container, `role="presentation"` on the `<svg>`, `pointer-events: none`,
`position: fixed` at `z-index: 0` under content at `z-index: 1`, `overflow: hidden`. It holds no
focusable element, never participates in layout, and cannot occlude the review cylinder or the
consent bar. **The Freelancer carousel is unaffected** — 96s ring, 10 cards, measured unchanged.

### 8A.1 The defect that reported itself healthy

The first build used `animation-timeline: scroll()`. That means `scroll(nearest)`, resolved
against the nearest ancestor **scroll container** — and `.field` is `position: fixed`, which has
none. **The timeline resolved to nothing and the animation never advanced.**

Every probe an implementer would reach for said it was working:

| Probe | Reported |
|---|---|
| `CSS.supports('animation-timeline: scroll()')` | `true` |
| computed `animationName` | `gsFieldPiece` |
| computed `animationTimeline` | `scroll()` |
| `getAnimations().length` | `1` |
| `.playState` | `running` |
| `.effect.getKeyframes()` | the three correct transforms |
| **rendered `transform` at 50% scroll** | **`none`** |

Only the last row is the truth, and `currentTime === null` is the only diagnostic that names the
cause. **A screenshot cannot see it either**, because at scroll 0 the correct state *is* `none`.
`scroll(root)` fixes it. `check:mark:field` exists because of it and asserts the **rendered
matrix**, never the animation's own report.

### 8A.2 Contrast — measured, then allowlisted, in that order

The layer made `check:axe` return `elmPartiallyObscuring` on the `h1` and the hero intro:
*"background color could not be determined because it partially overlaps other elements."* That
is axe **declining to evaluate**, not a violation — but an unresolved contrast result on the
largest text on the site is not something to allowlist on assertion.

Three things were tried, and two were wrong in ways worth not repeating:

1. **An opaque `--canvas` hero band.** Did **not** resolve it — axe locates the SVG shapes
   geometrically rather than respecting an opaque ancestor. **Kept anyway**, because it is right
   on its own terms: the site's largest text now sits on a clean canvas at every width and every
   motion setting, and the brief asks for geometry *around* the hero.
2. **Enlarging the layer's box to 300vh**, on the theory that the `h1` straddled its bottom edge
   (at 1280×800 the `h1` runs 454–816px in an 800px viewport). It made it **worse** — three
   declines instead of two — which is what established that the container box is not the trigger.
3. **Adding `--line` to `check:contrast`'s `SURFACES`**, so the pair is measured rather than
   allowlisted. This produced the measurement below and was then **reverted**: it forces
   `except` restrictions back into `USE`, and that file records a deliberate position that *a
   token needing a restriction to be safe is a token whose value is wrong*.

**The measurement, which is what makes the allowlist entry earned.** Every foreground token
against `--line`, all four themes: `--ink` and `--ink-muted` clear the 4.5:1 body floor;
`--ink-subtle` does **not** (4.14–4.39:1) and neither does Digital's `--accent` (4.00:1). On
Master the only text tokens over the geometry are `--ink` and `--ink-muted`. The one
`--ink-subtle` text on `/` is `.reviewSource`, inside review cards `check:reviews:ui` measures
as **opaque**, so the geometry never reaches it. Worst case for hero text is `--ink` over a
`--line` hairline: **~13.9:1 against a 4.5:1 floor.**

The entry names its own removal conditions: if the mark stops rendering on `/`, if it is drawn
in anything other than `--line`, or if any `--ink-subtle` or `--accent` text is placed over it.

## 9. Social channels — checked, and none can be verified

`GS-R001-R` §9 says to inspect repository evidence first, verify publicly identifiable official
accounts if the protocol allows, and **omit and report** what cannot be confirmed. All three
steps ran.

| Source | Result |
|---|---|
| Repository | **nothing.** No social URL in `companyDetails`, the schema, the seed or `LIVE-SITE-EXTRACT.md` |
| The live `gridsmith.uk` | **nothing.** Read read-only: the only external links on `/`, `/about-us/`, `/contact/` and `/services/` are one `mailto:` and one `tel:` |
| Public search | **every result is a different company** |

The last row is the finding. *Gridsmith Studio* — a surface-pattern designer in Seattle — holds
the Instagram, Facebook and LinkedIn handles; `joingridsmith.com` (energy) and `gridsmith.io`
(tabletop terrain) are two further unrelated businesses. **None is Gridsmith Ltd, company
17050842.**

Linking any of them would put a third party's business on Gridsmith's About page. Nothing was
guessed. **`GS-O017`** is the owner action, and adding a channel is a one-line change once a URL
is confirmed.

**Freelancer is the exception and it is not a search result.**
`https://www.freelancer.com/u/GridsmithLTD` is the profile `GS-O014` approved as the attribution
target for the homepage reviews, and the account the official API returns them from. It is the
only platform presence this programme holds evidence for.

**The icons are inline SVG in the site's own geometric register, not brand logos.** Three
independent reasons: there is no icon dependency in this build and adding one for four glyphs
fails non-negotiable #8 before it reaches the taste question; brand logos are third-party marks
with their own usage terms; and a platform's own colour would be the first hardcoded colour on
the site.

---

## 10. Registered office — the owner's requested treatment was already the implemented one

`GS-R001-R` §7 asks for the least intrusive compliant treatment, and warns against blindly
removing a required disclosure. **No conflict was found, and no clause needed interpreting.**

SI 2015/17 reg. 25(2)(c) requires the registered office **on the company's websites**
(`_legal/02-CITATION-LEDGER.md` `L-TDR-25`). `GS-O004` had already withdrawn it from everywhere
except the statutory footer and the `_legal/` instruments, and `check:company` question 4 asserts
**position, not presence** — the address may appear inside the `<footer>` element and anywhere on
a `/legal/` route, and nowhere else. Measured this phase: **18 routes carry it, none outside
those two places.**

So the footer *is* the restrained legal treatment §7 describes. What this phase removed is the
**second, promotional copy**: `/about`'s *"The checkable facts"* table, which presented the
registered particulars as a credibility argument.

`Gridsmith Ltd — registered in England` is what the marketing surfaces say. The company number
appears discreetly in one subordinate line at the foot of `/about` and in the homepage structure
statement, both as prose rather than as a card.

**The distinction `GS-R001-R` §6 draws is between a disclosure and a pitch.** `GroupStructure` on
the homepage survives it — it names which legal entity a client contracts with, in one sentence,
because getting that wrong has contractual consequences. `/about`'s table did not survive it,
because it was arguing that being incorporated is a reason to hire Gridsmith.

**Nothing about compliance changed.** Moving the footer disclosure would be a compliance decision
rather than a content one, and it belongs with `GS-O003`.

---

## 11. Programme state after this phase

| ID | State |
|---|---|
| `GS-O008` | **OPEN — AWAITING OWNER RE-REVIEW.** Not closed by this phase and not closeable by an agent |
| `GS-O016` | **CLOSED** — the owner confirms ICO registration and that the fee is being paid. Recorded as compliance evidence; **not** used as marketing copy, and no number, tier or renewal date invented |
| `GS-O007` | **BRAND-ASSET LIMB CLOSED.** The owner supplied the logo at the gate; it is verified, integrated and gate-asserted. What remains under this ID is small and named: a favicon decision, an Open Graph card composition, and the one redirect row — now cutover hygiene rather than a blocker |
| `GS-O017` | **NEW** — confirm or supply official social channel URLs, or confirm none exist |
| `Q-P13` | unchanged, still open |
| `GS-O003` `GS-O005` `GS-O010` `GS-T004` `GS-T005` `GS-X001` `GS-X002` `GS-R002` `GS-R003` | unchanged |

**RC status: not re-declared.** `GS-R001`'s `TECHNICALLY PASS` was never the disputed part.
