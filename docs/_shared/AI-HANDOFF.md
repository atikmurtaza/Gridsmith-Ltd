# AI handoff

## Execution

- **Task ID:** `GS-R001-R` / `GS-O008`
- **Task:** staging content, brand and experience remediation
- **Agent/model:** Claude Code (Opus 5)
- **Status:** COMPLETE IN REPOSITORY. The eleven owner findings from the `GS-R001` staging review
  are implemented; the owner's brand assets were supplied at the phase's owner gate, verified and
  integrated; the Master background mark is built. **`GS-O008` stays OPEN — AWAITING OWNER
  RE-REVIEW** and was not closed here. **No Supabase call of any kind. No production Sanity call.
  No DNS, Hostinger or `gridsmith.uk` change. No dependency added.**
- **Date:** 17 September 2026
- **Full evidence:** `docs/_shared/GS-R001-R-REMEDIATION.md` — this file is the summary and the
  next-phase recommendation; that one is the record.

## Repository state

- **Starting commit:** `82d55ede`
- **Ending commit:** `e59903ab` — one commit, the phase
- **Branches:** `staging/gs-r001-r-remediation` carries the candidate and is what Vercel builds as
  a **preview**; `main` is fast-forwarded to the same commit
- **Starting working tree:** clean, 0 ahead / 0 behind `origin/main`, no unrelated owner work
- **Starting CI:** run `35147103758` `success` on `5049f820`, the last recorded state

## Hard scope boundaries preserved

- **No Supabase call of any kind.** `GS-T004` is not applied.
- **No production Sanity call.** One `development` write through the existing `npm run seed`,
  which hardcodes the dataset and deletes only by provenance (`isSeed: true` **and** an `_id`
  beginning `seed-`, both required).
- **No deployment to production, no domain change, no DNS, no Hostinger.**
- **No dependency added.** GSAP, Three.js, WebGL and any icon library were all declined.
- The service architecture is unchanged: 3 divisions, 14 capability groups, 46 records, 81
  capabilities, no public pricing, no public portfolio, Technical Design still gated.
- `Q-P13` is not reopened and `SEED_RULES` is byte-identical.
- The canonical six process stages are not reworded.

---

## 1. Why this phase existed, and the finding that outlives it

`GS-R001` passed every gate it had, and the owner rejected what those gates were not asked about.

**Forty-five gates were green on a candidate carrying `[SEED]` markers on four public routes.**
Every gate that knew about seed content read the *dataset* and keyed off the *production* dataset
name — and every staging candidate is built from `development`. So the one environment a human
reviews was the one environment nothing checked.

`check:company` questions 7 and 8 close it by reading **served text**. Question 8 found a fifth
route within one run of being written: `/press/path-finder`, which no finding had raised and
which no dataset query could ever have reached, because its seed config is a TypeScript file.

## 2. `[SEED]` — classified, not stripped

The brief prohibits removing the marker as the fix, and the four answers were different:

| Content | Classification | Done |
|---|---|---|
| `/about`, `/approach` prose | synthetic filler | **rewritten** from approved architecture, process and commercial positions |
| The nine `/insights` posts | fabricated thought leadership | **stopped being articles** — nine editorial briefs, unpublishable by construction |
| Path Finder outcome copy | truthful but unapproved | marker removed, sentences kept, `SEED_RULES` untouched |
| `teamMember`, `faq` records | genuinely fabricated, rendered by nothing | **left as they are**, still marked |

**A marker in rendered text and a flag in a record are different things.** `isSeed: true` stays
everywhere it was — it is what `check:launch` reads to refuse promotion to production.

`post.status` is a closed list enforced on write; all three post queries filter
`status == "published"` by **strict equality, never `coalesce`**, because a document written
before the field existed has no status and coalescing would publish exactly the nine records the
field was added to stop. `listPostSlugs` feeds `generateStaticParams`, so an unpublished post has
**no page built for it at all** — verified in the build output.

## 3. The contact channel

`GS-O004`'s `tel:` limb is superseded and only that limb. The number is unchanged and still
published; it is now **WhatsApp and SMS**, each named and linked with its own scheme, and
**text-only in the statutory footer** — that block is a legal disclosure on all 77 routes, not a
contact surface, and reg. 6(1)(c) needs the number readable rather than clickable.

`check:company` question 3 refuses a `tel:` href on **any** route; question 7 refuses the wording.

## 4. The brand assets, verified before use

Three files, all **the mark alone** — no wordmark, no lockup. The SVG's own `<desc>` calls itself
a *"recreation"*, so it was measured rather than trusted: alpha masks, each normalised to its own
bounding box, compared shape to shape.

| Measurement | Result |
|---|---|
| Content aspect ratios | PNG **1.0293**, SVG **1.0302**, 3D **1.0302** |
| Shape IoU, PNG vs SVG | **0.9624** |
| XOR after two erosions | **0 pixels** |

A structural difference survives erosion as a blob. Nothing survived, so the vector **is** the
raster's geometry and nothing was estimated by eye.

**The SVG is primary on measurement**, which is the exception the owner's instruction allowed:
4,134 bytes against 669,476, and the header logo renders at ~24px on all 77 routes above the
fold. It is a **CSS background on `.wordmark::before`**, because the mark is decorative — the
word beside it is the accessible name — and a decorative image belongs in the stylesheet. No rule
was disabled to avoid `no-img-element`; the element simply does not exist.

**Neither PNG is modified and neither is rendered.** The 3D render is kept for a social card
nobody has designed yet. **No favicon was created** — §22 forbids deriving one, and there has
never been one to keep.

## 5. The Master background mark

Master only, `/` only. The logo's own eight spheres and six rods, transcribed from the verified
vector, drawn as **1px `--line` hairlines** — the geometry is exact, the rendering is not the
logo's, and the static logo is served unmodified. Composed at the hero, separated mid-page,
recomposed at the closing CTA.

`animation-timeline: scroll(root)`, one shared `@keyframes`, per-piece custom properties.
**Zero JavaScript**; the homepage delta is unchanged at **1.9KB of 15KB**. `display: none` below
768px, static at 768–1023 and under `prefers-reduced-motion`, animated at 1024+. `aria-hidden`,
no focusables, no pointer events, no layout participation. The Freelancer cylinder is unaffected.

### The defect that reported itself healthy

The first build used `animation-timeline: scroll()` — which means `scroll(nearest)`, resolved
against the nearest ancestor **scroll container**. A `position: fixed` element has none, so the
timeline resolved to nothing and the animation never advanced.

`CSS.supports` said true. `getAnimations()` returned one animation. `playState` was `running`.
The keyframes were correct. **The rendered transform at 50% scroll was `none`**, and
`currentTime === null` was the only diagnostic that named the cause. A screenshot cannot see it
either, because at scroll 0 the correct state *is* `none`.

`check:mark:field` exists because of it and asserts the **rendered matrix**, never the
animation's own report. Seven branches, each proven red; subjects restored from bytes captured
beforehand and verified by SHA-256.

**Proving that gate found a defect in that gate.** Its element selector required
`aria-hidden="true"`, so removing the attribute stopped the element matching and it reported
*"not in the document"* rather than *"not aria-hidden"* — a red, but **the branch it was written
to prove had never executed**. `A-GATE-4-3` in miniature, found by proving rather than by reading.

### Contrast — measured, then allowlisted, in that order

axe returned `elmPartiallyObscuring` on the `h1` and hero intro: it **declined to evaluate**, not
a violation. Three fixes were tried; two were wrong and are recorded as such. What settled it was
measuring every foreground token against `--line` in all four themes: `--ink` and `--ink-muted`
clear the body floor, `--ink-subtle` (4.14–4.39:1) and Digital's `--accent` (4.00:1) do not, and
on Master the only text over the geometry is `--ink` and `--ink-muted`. Worst case **~13.9:1
against a 4.5:1 floor**. The allowlist entry names its own removal conditions.

The hero also got an opaque `--canvas` band. It did **not** resolve the axe result — that was the
theory it was added on — but it is kept because it is right on its own terms.

## 6. Social channels — checked, and none can be verified

The live `gridsmith.uk` links **no social account at all** (only a `mailto:` and a `tel:`, read
read-only from four of its pages). A public search returns **three unrelated companies**:
Gridsmith Studio, a surface-pattern designer in Seattle, holds the Instagram, Facebook and
LinkedIn handles; `joingridsmith.com` and `gridsmith.io` are two more. **None is Gridsmith Ltd.**

Nothing was guessed. `/about` links the four verified channels — email, WhatsApp, SMS, and the
Freelancer profile `GS-O014` already approved. **`GS-O017`** is the owner action.

## 7. Registered office — no conflict was found

`GS-R001-R` §7 warned this might conflict with a legal requirement. It does not. SI 2015/17
reg. 25(2)(c) requires the registered office **on the company's websites**, and `GS-O004` had
already confined it to the statutory footer and the `_legal/` instruments. `check:company`
question 4 asserts **position, not presence**, and measured 18 routes carrying it with none
outside those two places.

What this phase removed is the **second, promotional copy** — `/about`'s "The checkable facts"
table. The distinction is between a **disclosure** and a **pitch**: the homepage structure
statement survives because it names which legal entity a client contracts with; the table did not
because it argued that being incorporated is a reason to hire Gridsmith.

## Verification

`verify:static` **46 gates PASS** · `verify:build` PASS on a wiped `.next` (68 routes, all inside
delta budgets, master **1.9KB of 15KB**) · `verify:served` **15 commands PASS** · `check:axe`
**76 analyses, zero violations, 0 unresolved** · `check:mark:field` 7 cases PASS · `npm audit
--omit=dev` clean · no dependency added. Lighthouse is CI's — it cannot run on Windows.

Counts that moved, each deliberately, which is what proves they are counted rather than printed:
gates 45 → **46**; `check:company` self-test 35 → **57** cases; `check:struck` 16 → **18** rules
and 32 → **36** specimens; `check:schemas` closed lists 6 → **7**; `check:mark:guard`
`animation-timeline` declarations 1 → **2**.

## Findings and programme state

- **Closed:** `GS-O016` (ICO position, recorded and published nowhere), and `GS-O007`'s
  brand-asset limb.
- **New:** `GS-O017` — official social channel URLs, or confirmation there are none.
- **Narrowed:** `GS-O007` — a favicon decision, an Open Graph card composition, and the one
  redirect row, which is now cutover hygiene rather than a launch blocker.
- **Remaining:** `GS-T004`, `GS-T005`, `GS-O003`, `GS-O005`, `GS-O010`, `GS-O017`, `GS-X001`,
  `GS-X002`, `GS-R002`, `GS-R003`, `Q-P13`, the three `GS-R001` human tests (screen reader,
  physical device, non-Chromium), and the production content listed in the remediation record.
- **`GS-O008`: AWAITING OWNER RE-REVIEW.** Not closed here and not closeable by an agent.
- **RC status:** `GS-R001`'s **TECHNICALLY PASS** stands. **Production readiness: NOT READY.**

## Recommended next phase

Recommendation only. **Do not begin it from this handoff alone.**

**`GS-O008` — owner re-review of the remediated staging candidate.** It is an **owner task, not
an agent phase**. The candidate is built, gated and deployed; what it needs is a person to read
all four sections and say whether the site now describes their business.

- **Owner action required first?** Yes — this *is* the owner task.
- **Exact information/action required:** (1) accept or reject section by section; (2) the
  `GS-O017` social URLs, or confirmation there are none; (3) whether a favicon is wanted; (4) the
  Open Graph card decision. Items 2–4 are independent and none blocks the others.
- **Session:** **NEW.** This one's context is content remediation, brand assets and a scroll
  animation; the next is whatever the review returns.
- **Agent/model:** Claude Code (Opus 5).
- **Effort:** small if the review accepts; scoped by the rejections if it does not.

**`GS-T004` production activation stays in a separately authorised production-release phase**,
and `gridsmith.uk` cutover stays behind `GS-O009`. Technical-group content stays gated on
`GS-O005` / `GS-X002`. **Do not treat an accepted RC as authorisation for either.**
