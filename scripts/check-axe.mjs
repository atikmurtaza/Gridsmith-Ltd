#!/usr/bin/env node
/**
 * check-axe
 *
 * WCAG 2.2 AA is the floor — CLAUDE.md non-negotiable #10, Definition of Done "axe zero
 * violations".
 *
 * Runs the full axe-core ruleset against a real browser, which is a superset of the
 * accessibility audits Lighthouse performs. Both gates exist because they overlap rather
 * than duplicate: Lighthouse scores a curated subset and rolls it into a number, axe
 * reports every rule individually and does not average anything away.
 *
 * `/_kitchen-sink` is the important target — every primitive, every state, four themes.
 * The four route-group pages are checked too so a layout-level regression is caught.
 *
 * Expects a server already running at BASE_URL (`npm run start`).
 */
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { AxePuppeteer } from '@axe-core/puppeteer';
import { launch } from './browser-launch.mjs';

/**
 * The axe source is read and passed in explicitly rather than left to the adapter.
 *
 * @axe-core/puppeteer resolves axe-core from its own `import.meta.url`, which is a
 * file:// URL — and this project's path contains a space, so the URL carries `%20` and
 * the resolved path does not exist. `fileURLToPath` decodes it. Without this the gate
 * throws MODULE_NOT_FOUND on any checkout under a path with a space in it.
 */
const require = createRequire(fileURLToPath(import.meta.url));
const axeSource = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');

const BASE_URL = process.env.AXE_BASE_URL ?? 'http://127.0.0.1:3000';

/**
 * `status` is asserted, not assumed. The 404 is a route like any other: `M-07` puts real
 * content there and `M-04`/`L-05` put the statutory company disclosure on *every* page,
 * which is a legal requirement rather than a footer decoration. Until now `_not-found`
 * appeared in exactly one place in the entire repository — an exemption in
 * check-bundle-size — so the one route that ships a legal obligation was the one route no
 * gate measured. A 404 has to be requested by fetching something that does not exist, and
 * a gate that treats every non-200 as a measurement failure cannot audit it; hence the
 * expected status rather than a blanket `>= 400`.
 */
const ROUTES = [
  { path: '/', status: 200 },
  { path: '/design', status: 200 },
  { path: '/digital', status: 200 },
  { path: '/press', status: 200 },
  // Epic N routes, chosen to cover every distinct template rather than every URL: both
  // `groupPage` layouts, the insights hub, a legal document and the one route with a form.
  // `/work` and `/work/[slug]` were removed at `GS-P03` with the routes (`GS-D001`), and
  // `/digital/estimate` with the price table (`GS-D002`); `Table`'s scroll region is still
  // audited on a production route at `/about` and `/press/path-finder`.
  // `U-08`'s subject, and since `GS-P04` one per division rather than one in total: all three
  // divisions render the SAME template (`components/content/ServiceDetail.tsx`) under three
  // different themes, and what a shared template needs audited is exactly the part that is not
  // shared — the tokens each theme resolves. One route would audit the markup three times and
  // the palettes once.
  //
  // Each is the record that exercises every block: capabilities, included deliverables,
  // EXCLUDED deliverables, process, collaborators, related services and the CTA pair. A record
  // with fewer blocks would leave parts of the template unaudited on that theme.
  { path: '/design/services/technical-documentation', status: 200 },
  { path: '/digital/services/website-design-build', status: 200 },
  { path: '/press/services/publishing-preparation', status: 200 },
  { path: '/about', status: 200 },
  { path: '/approach', status: 200 },
  { path: '/insights', status: 200 },
  // The draft-status banner and the clause anchors are both here, and nowhere else.
  { path: '/legal/privacy', status: 200 },
  // The only master route with a client boundary besides the consent banner.
  { path: '/contact', status: 200 },
  // `K-13`. Press's only client boundary, and the site's only multi-step form. Audited at
  // step 1 only: steps 2-4 are `hidden` until a segment is chosen, and `hidden` removes them
  // from the accessibility tree, so what axe sees here is exactly what a visitor first meets.
  // The later steps reuse the same primitives the kitchen sink already audits.
  { path: '/press/contact', status: 200 },
  { path: '/press/contact/thank-you', status: 200 },
  // `K-05`. The static SSR decision table. A real <table> with a caption, a scrollable
  // focusable region and row headers, on the route that carries the ETH-04 honest outcomes —
  // the one page on the site where a screen-reader user losing the row/column relationship
  // would lose which outcome a criterion belongs to.
  { path: '/press/path-finder', status: 200 },
  { path: '/_kitchen-sink', status: 200 },
  // Composed master components. Separate from the kitchen sink so the primitive-layer
  // measurement stays a measurement of primitives — see the page's own docstring.
  { path: '/_master-sink', status: 200 },
  // `global-not-found`'s subject: an unmatched URL. It cannot be a committed route — a
  // committed route would match and return 200 — so the path itself is the subject and
  // the asserted 404 is what proves it reached the right document.
  { path: '/_gridsmith-404-probe', status: 404 },
  // `global-error`'s subject: app/(marketing)/gridsmith-error-probe/page.tsx, a committed
  // route that throws after hydration. Until it existed, no gate in this repository
  // referenced global-error at all and its Level A fix was evidenced only by a docstring.
  //
  // `themed: false` because global-error is deliberately unthemed and deliberately
  // carries no `data-division` — setting it would put the literal string into a client
  // chunk and fail check-theme-flash's strongest assertion, which is that no client chunk
  // can set the theme after hydration. The reasoning is in the boundary's own docstring.
  // The HTML responds 200; the throw happens in the browser afterwards.
  //
  // `expect` is what stops this probe going hollow. Without it the gate would audit
  // whatever the route renders — and if the throw ever stopped firing, axe would cheerfully
  // report the fallback paragraph as clean while global-error went unmeasured again. A
  // subject that silently stops being the subject is the failure this whole rule exists to
  // prevent, so the boundary has to identify itself.
  {
    path: '/gridsmith-error-probe',
    status: 200,
    themed: false,
    expect: { title: 'Something went wrong — Gridsmith Ltd', h1: 'Something went wrong', lang: 'en-GB' },
  },
];

/**
 * **The gate used to audit one state of one viewport, and call it the page.**
 *
 * 1280×900, scrolled to the document foot. The scroll was deliberate and correct — it
 * reaches StickyCta and RevealOnScroll, and auditing the top of a page is auditing less
 * of it. What nobody noticed is that it also means *no route is ever audited in the state
 * a visitor first meets*, and that the one width it used is the width where StickyCta is
 * `display: none`. So the bar was never evaluated in its real `position: fixed` form, at
 * any width, in any state.
 *
 * A Level A failure lived in that blind spot: four painted StickyCta specimens carrying
 * eight visible links that were simultaneously `inert` and `aria-hidden`. `inert` is
 * exactly what axe is built to skip, and scrolling to the foot flipped them live before
 * axe looked. **`check-axe` reporting `/_kitchen-sink` clean was a green result from a
 * check that did not measure the failing state** — the gate-blindness class, occurring
 * inside the gate written to close it.
 *
 * Both axes are now real: 375px is the width the Definition of Done names first and where
 * the mobile-only chrome exists at all, and scroll 0 is where every visitor starts.
 * Viewport-dependent WCAG 2.2 rules — `target-size` (2.5.8) most obviously — were being
 * evaluated at desktop width only.
 */
const VIEWPORTS = [
  { label: '375px', width: 375, height: 812 },
  { label: '1280px', width: 1280, height: 900 },
];

const PHASES = [
  { label: 'initial', scrollToFoot: false },
  { label: 'scrolled', scrollToFoot: true },
];

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];

/**
 * axe results come in three buckets, not two: `passes`, `violations`, and `incomplete` —
 * checks axe ran and could not resolve. This gate read `violations` alone, so every
 * `incomplete` was discarded without a word and the route printed `clean`.
 *
 * Eight of them were live: `color-contrast` on the `h1` of all four themed routes, at both
 * viewports. "axe could not determine whether this text meets 1.4.3" was being reported
 * as a pass. That is the same shape as a gate that measures nothing, one layer up — the
 * measurement was taken, declined, and thrown away.
 *
 * **So an incomplete now fails, unless it is listed here with a reason.** An allowlist
 * entry is a decision someone wrote down and can be re-examined; a silent discard is not.
 * Entries match on rule + route + exact node target, so allowlisting the h1 of the
 * placeholder pages cannot quietly cover a different element later.
 *
 * ## `targetPattern`, added at `GS-P06`, and why an exact target was not enough
 *
 * An entry may name `target` (exact, the default and still preferred) **or** `targetPattern`
 * (a RegExp over the same string). Exactly one of the two, asserted below — an entry with both
 * or neither is a hard failure, because a silently ignored key is how an allowlist stops
 * allowing and nobody notices.
 *
 * The Master review cylinder produces **73** `color-contrast` incompletes across two viewports
 * and two phases, and every target is a CSS-module selector: `.master_reviewCard__CkZfh:nth-
 * child(9) > figure > figcaption > .master_reviewName__TkgFK`. Two things make an exact list
 * wrong there rather than merely long. The hash changes whenever the stylesheet changes, so
 * every entry would rot on the next edit to an unrelated rule in the same file; and
 * `:nth-child(n)` is keyed to how many reviews the API returned that day, so the set is not
 * stable across a content change either. An allowlist that rots is worse than no allowlist:
 * it goes red for a reason unconnected to accessibility, and the fix people reach for is to
 * widen it.
 *
 * **The pattern is scoped to the cylinder and to nothing else.** It matches the CSS-module
 * prefix `master_review`, which only the review block emits, so a new incomplete anywhere else
 * on `/` — including anywhere else in `master.module.css` — still reports UNRESOLVED.
 */
// GS-DIG-001 — see digitalSceneTarget() for how a /digital decline earns this target.
const DIGITAL_SCENE = 'main.dg-home';
const DIGITAL_SCENE_TARGET = `${DIGITAL_SCENE} (pixel-measured by check:digital:scene)`;

const INCOMPLETE_ALLOWED = [
  ...['g', 's'].map((glyph) => ({
    rule: 'color-contrast',
    routes: ['/design'],
    target: `[data-design-stage] [data-letter-${glyph}]`,
    why: 'GS-R002-R1: CI 35523226814 returned "Element content is too short to determine if it is actual text content" for these two single-letter construction glyphs. They are decorative identity artwork in an aria-hidden, non-focusable SVG, not service copy. check:design:scene asserts that boundary and their G/S hierarchy; semantic chapter copy remains pixel-contrast checked. This allows only these two incompletes, never violations. Remove if the glyphs become informational/interactive or axe resolves single-letter artwork.',
  })),
  {
    rule: 'color-contrast',
    routes: ['/design'],
    targetPattern: /^(#(?:design-title|brand-title|motion-title|technical-title|design-close)(?: > span)?|section\x5bdata-chapter="[0-4]"\x5d > \.ds-copy > \.ds-(?:kicker|intro|note)|a\x5bhref\$="#(?:brand-visual|motion-dimensional|technical-design)"\x5d|span\x5bdata-label="[0-4]"\x5d)$/,
    why: 'GS-R002 text shares a surface with decorative SVG. check:design:scene measures rendered background pixels under these text boxes at all five chapters and 20 viewports, with the same 2% thin-line tolerance as Master. Its contrast predicate is proven red by matching the headline colour to its background. Remove this entry if that pixel gate is removed or the scene no longer underlies the text. This does not allow any axe violation.',
  },
  {
    rule: 'color-contrast',
    routes: ['/design'],
    targetPattern: /^g\x5bdata-art="(?:technical|convergence)".* > text\x5b/,
    why: 'GS-R002 diagram labels are decorative SVG study details inside the aria-hidden, non-focusable stage, not service information or a usable engineering drawing. Semantic technical content and its scope gate remain HTML and are measured by check:design:scene. Remove this exemption if the diagram becomes informational or interactive.',
  },
  {
    rule: 'color-contrast',
    routes: ['/digital'],
    target: DIGITAL_SCENE_TARGET,
    why: 'GS-DIG-001: /digital copy shares the page with the persistent compass rail (a full-page positioned layer axe counts as overlapping despite pointer-events: none) and the chapter copy veil (a pseudo-element), so axe declines contrast for text inside main.dg-home. digitalSceneTarget() maps a decline to this target only for a node inside that region with one of the listed background/short-content reasons; its positive/negative proofs run every time. check:digital:scene measures rendered pixels under every visible, non-decorative text box in the region at every compass state across six viewports, and its contrast branch is proven red. Remove this entry if that gate is removed or the rail/veil no longer underlie the copy. This never allows a violation.',
  },
  // **Empty, and emptied on purpose at `M-04`.** The one entry here allowlisted
  // `color-contrast` incomplete on the `h1` of the four placeholder routes, and carried its
  // own removal condition: *"REMOVE THIS ENTRY at the first route with real chrome (Epic M):
  // the condition that produces it disappears the moment a header exists."* It did. With a
  // header and footer on every route the h1 no longer shares one rect with `main` and `body`
  // flush to the viewport edge, axe resolves a background box, and the run reports
  // `0 axe incomplete(s) allowed, 0 unresolved`.
  //
  // Leaving a spent entry behind is not harmless: an allowlist nobody can trip is an
  // allowlist nobody re-reads, and the next incomplete on the same rule and route would land
  // inside it silently. The summary line prints the count, so an entry that stops being
  // exercised is visible rather than inferred.
  //
  // **One entry again from `A-11`, and it is a different question from the one above.**
  {
    rule: 'color-contrast',
    // Epic N's seven routes are here for exactly the reason the entry already gives: the
    // banner is `position: fixed` in the shared layout, so every themed route reproduces it
    // and none of them is a new question. They are enumerated rather than the route filter
    // being widened to "any route", because the entry's whole value is that it matches on
    // rule + route + exact node — a wildcard would let a genuinely new incomplete on
    // `#gs-consent-heading` land inside it unread.
    routes: [
      '/', '/design', '/digital', '/press', '/_kitchen-sink', '/_master-sink', '/_gridsmith-404-probe',
      '/about', '/approach', '/insights',
      '/legal/privacy', '/contact',
      // K-13's two routes. They were added to the route list and not to this entry, so the
      // shared banner's incomplete — allowed on all sixteen other routes — reported UNRESOLVED
      // on eight combinations and the gate has been red since. Found at K-16 by running it.
      '/press/contact', '/press/contact/thank-you',
      // `K-05`, added to this list in the same commit as the route list. The banner is in the
      // shared layout, so this route reproduces the identical incomplete and is not a new
      // question — this is the K-13 direction, and it is decided here rather than discovered
      // by a red run two sessions later.
      '/press/path-finder',
      // `GS-P04`'s three service routes. `website-design-build` was already here from `U-08`;
      // the Design and Press ones went into `ROUTES` and not into this entry, and the gate went
      // red on seven combinations — **the K-13 pair again, in the same gate, two rows above a
      // comment describing it.** It was caught the way K-13's own note says it has to be: by
      // running the gate, because whether a new route needs an entry depends on what the route
      // renders and no static reading can know it. `check:lists` is green throughout, correctly:
      // it asserts this list ⊆ ROUTES, and the missing direction is the one it says it cannot see.
      //
      // Which combinations decline follows page LENGTH, as the reason below already records —
      // Design declined at all four, Press at three, Digital at three, and the colour pair is
      // identical on all three. That is the tell that this is axe declining on a fixed overlay
      // rather than a contrast defect. Zero violations on all three routes.
      '/design/services/technical-documentation',
      '/digital/services/website-design-build',
      '/press/services/publishing-preparation',
    ],
    target: '#gs-consent-heading',
    why:
      'The consent banner is position:fixed at the bottom edge, so at 375px its text rect ' +
      'intersects page content behind it and axe returns "background could not be determined ' +
      'because it partially overlaps other elements". Which viewport it declines at follows ' +
      'the page, not the rule — CORRECTED at U-08, where this sentence used to read "it ' +
      'resolves cleanly at 1280px". On the service page it is the other way round: 375px ' +
      'initial resolves and both 1280px states do not, because the page is short enough that ' +
      'the fixed bar sits over main content at the wider width too. The tell is not which ' +
      'viewport fires; it is that the answer moves with page LENGTH while the colour pair ' +
      'never changes. This is axe declining on a fixed overlay, not a contrast problem. ' +
      'Three fixes ' +
      'were tried and none changed it — an opaque background on .bar, on .inner, and on the ' +
      'text element itself; all three compute opaque in the browser (the canvas-raised triplet) and ' +
      'elementFromPoint at all four corners and the centre returns the text element, so ' +
      'nothing is actually on top of it. The pair is --ink on --canvas-raised, which ' +
      'check:contrast measures directly in its 128-cell permission matrix: --ink as body text ' +
      'is 15.42:1 at its worst cell across all four themes and all three surfaces. That is the ' +
      'gate that owns this question. REMOVE THIS ENTRY if axe-core learns to resolve fixed ' +
      'overlays, or if the banner stops being position:fixed.',
  },
  // `GS-R001-M`. The Master homepage's text over the WebGL scene. Replaces three entries —
  // the GS-R001-R line-art mark, the review cylinder and the cylinder's review dates — whose
  // subjects were all removed in this phase; an entry kept after its subject is gone is a
  // stated reason nothing checks.
  {
    rule: 'color-contrast',
    routes: ['/'],
    // Every text-bearing class on `/` comes from `components/master/home.module.css` (hashed
    // `home_*__*`) or is the hero `h1`, which axe names by id. Anything else declining on `/` —
    // chrome, a primitive, a future block — is not covered and lands UNRESOLVED.
    // The first selector must be one of those; what follows it — a space, an attribute selector, `>`, `.`, `:` —
    // is axe's own path through it (the studio arrows come back as `.home_studioLink__x[href$=…] > …`).
    // `\x5b` is an opening square bracket, written as an escape on purpose: `check:lists`
    // reads this file's arrays by counting brackets before it strips comments, so one
    // unbalanced bracket in a regex OR in a comment here runs the capture on into the next
    // array. Both happened at GS-R001-M, and each reported four foreign routes as missing.
    targetPattern: /^(#hero-title|\.home_[A-Za-z]+__[A-Za-z0-9_-]+)(\s|\x5b|>|\.|:|$)/,
    why:
      'GS-R001-M put the homepage over a fixed WebGL canvas — the Gridsmith mark as lit gold ' +
      'geometry, aria-hidden, pointer-events:none, z-index:-1 — and every section is ' +
      'transparent by design, so the scene is the page\u2019s surface. axe cannot compute a ' +
      'background it cannot see through a <canvas> and DECLINES to evaluate: incomplete, not a ' +
      'violation, the same class as the consent-banner entries above.\n' +
      '    What makes this entry earned rather than asserted: check:master:scene question 5 ' +
      'answers exactly the question axe declines. It screenshots / twice at five widths (2560, ' +
      '1440, 1024, 768, 375) and six chapter positions \u2014 once as served, once with every ' +
      'glyph transparent \u2014 and measures each text box\u2019s own colour against the ' +
      '98th-percentile luminance of the rendered scene behind it, 4.5:1 for body and 3:1 for ' +
      'large text. At GS-R001-M every box passed; the worst reading was 5.0:1 (1024px, ' +
      'context chapter). That gate was proven red on this question by moving the h1 over the ' +
      'mark (1.32:1), in scripts/prove-master-scene.mjs.\n' +
      '    check:reviews:ui question 9 asserts the premise for the reviews specifically: every ' +
      'review sits inside [data-chapter="reviews"], which is a chapter check:master:scene ' +
      'measures.\n' +
      '    REMOVE THIS ENTRY if the scene stops rendering on /, if any section on / gains an ' +
      'opaque background (axe would then resolve it itself), or if check:master:scene stops ' +
      'measuring text over the scene. Each of those removes the measurement this rests on.',
  },
  // `GS-R001-M` R1. The review cylinder's cards where axe names them by attribute rather than by
  // class: a date by its unique `datetime`, and the front card by `data-front`. Everything else
  // in a card is named by a `home_*` class and covered above. Same scene, same measurement.
  {
    rule: 'color-contrast',
    routes: ['/'],
    targetPattern: /^(time\x5bdatetime="\d{4}-\d{2}-\d{2}"\]|li\x5bdata-front=""\] > figure > .+)$/,
    why:
      'R1 put the reviews back on a CSS 3D cylinder over the WebGL scene: every card is turned to ' +
      'its own angle in one grid cell, so axe cannot resolve a background behind any of them and ' +
      'declines. Each card carries its own --canvas-veil surface. check:master:scene question 5 ' +
      'measures the text of every card that is actually painted — the front card and the visible ' +
      'side cards — against the rendered pixels behind it, at 11 widths; cards turned away are ' +
      'backface-hidden and have no pixels to measure. check:reviews:ui questions 9 and 10 assert ' +
      'the scope this depends on: every review, and every <time> on /, is inside the reviews ' +
      'chapter that gate reads.\n' +
      '    REMOVE THIS ENTRY if the reviews stop being a 3D cylinder over the scene, or if either ' +
      'scope assertion is removed.',
  },
  // `GS-R001-M` R1. The footer and header on `/`, transparent over the scene while it runs: the
  // footer so the reassembled mark is not cut off at the bottom of the page, the header so its
  // wrapped nav is not an opaque band across the hero mark at 320px. The `why` below was written
  // for the footer; the header is the same case — same stylesheet rule, same fallback behaviour,
  // and `check:master:scene` question 5 reads header text as well as footer text since R1.
  {
    rule: 'color-contrast',
    routes: ['/'],
    targetPattern:
      /^(\.chrome_(footer|statutory|navLink|wordmark)[A-Za-z]*__|nav\x5baria-label="(Company|Legal)"\] > \.chrome_footerGroupHeading__|a\x5bdata-division-accent="(design|digital|press)"\]$|a\x5bhref\$="(about|approach|insights|contact|terms|privacy|cookies|accessibility)"\]$|\.consent_reopen__)/,
    why:
      'R1 made the footer transparent on / while the scene is live (styles/themes/master-stage.css) ' +
      'because its opaque --canvas cut the reassembled mark in half — the owner\u2019s complaint. ' +
      'Its text now sits over the <canvas>, and axe declines exactly as it does for main. ' +
      'check:master:scene question 5 measures the footer\u2019s text too since R1, at every width ' +
      'and at the bottom of the page, where the footer is in view; the renderer dims the scene ' +
      'behind every footer text element it lists (scene.ts, TEXT). Under the no-WebGL fallback ' +
      'the footer keeps its opaque surface, and axe resolves it itself.\n' +
      '    REMOVE THIS ENTRY if the footer on / becomes opaque again, or if check:master:scene ' +
      'stops including the footer in question 5.',
  },
];

/**
 * Every custom property the token layer declares, read off disk.
 *
 * Derived, not typed: a hardcoded list is an expectation that falls behind its subject,
 * and this gate exists because four hardcoded names covered only the theme layer. Reading
 * `styles/tokens.css` and the four theme files means a token added tomorrow is probed
 * tomorrow. Font-family tokens are excluded — they resolve to a stack containing a
 * `next/font` CSS variable that is empty until the font loads, which is a load-order fact
 * rather than a missing stylesheet, and `check-theme-flash` owns that question.
 *
 * **What deriving the list costs, stated because the proof found it.** This list comes
 * from the same files it is checking, so deleting `--text-2xl` from `tokens.css` deletes
 * the expectation along with the token and this probe stays green. That is the
 * expectation-derived-from-its-own-subject shape, and it is accepted here **because it is
 * not this probe's question.** Whether the token layer declares the right tokens is
 * `check:tokens`, which holds a hardcoded 39-token REQUIRED list for exactly that reason.
 * This probe answers a different one: *is the token layer reaching this route at all* —
 * the `/_not-found` defect, where every token was undefined because the stylesheet was
 * never linked. Against that, a derived list is correct and a hardcoded one would rot.
 *
 * Proven by deliberate failure on the real question: removing `import '@/styles/globals.css'`
 * from `app/(press)/layout.tsx` reports `--space-1`, `--text-xs`, `--text-2xl` and the rest
 * of the base layer resolving to nothing. The four-name probe this replaced saw none of
 * those — all four of its names lived in the theme layer.
 */
const declaredIn = (file) =>
  [...new Set([...readFileSync(file, 'utf8').matchAll(/^\s*(--[a-z0-9-]+)\s*:/gm)].map((m) => m[1]))]
    .filter((t) => !t.startsWith('--font-'));

/**
 * Base tokens apply everywhere; theme tokens are probed only on the division that
 * declares them.
 *
 * The union across all four themes is NOT the right list, and probing it says so loudly:
 * `--accent-design`, `--accent-digital` and `--accent-press` are declared by master alone
 * (master/PROJECT-RULES.md §1.1 — division accents appear on division cards, badges and
 * the footer switcher, all of which are master chrome). They correctly resolve to nothing
 * on `/design`, and a probe that flags that is reporting the design, not a defect.
 */
const TOKEN_NAMES = {
  base: declaredIn('styles/tokens.css'),
  byDivision: Object.fromEntries(
    ['master', 'design', 'digital', 'press'].map((d) => [d, declaredIn(`styles/themes/${d}.css`)]),
  ),
};

const tokenCount =
  TOKEN_NAMES.base.length +
  Math.min(...Object.values(TOKEN_NAMES.byDivision).map((t) => t.length));

if (TOKEN_NAMES.base.length === 0 || Object.values(TOKEN_NAMES.byDivision).some((t) => t.length === 0)) {
  console.error('check-axe: derived 0 token names from the base layer or a theme — the probe would measure nothing.');
  process.exit(1);
}

/**
 * Three structural assertions axe cannot make.
 *
 * axe-core keeps `duplicate-id` and `duplicate-id-active` behind its `deprecated` tag, so
 * no combination of WCAG tags reaches them — `axe.getRules(TAGS)` returns `duplicate-id-aria`
 * and nothing else in that family. The kitchen sink served 80 duplicate id attributes,
 * one radio group spanning four theme frames and one exclusive `<details>` group doing
 * the same, and every axe run reported zero violations.
 *
 * "The gate has no rule for it" is not the same as "the page is fine", so the assertion
 * moves here rather than waiting for axe to grow one back.
 */
async function domIntegrity(page, route, themed = true, expect = null) {
  // Axe finishes in a helper tab. Closing it need not restore this page's focus
  // before activeElement is read; :focus only paints in the focused document.
  await page.bringToFront();
  await page.waitForFunction(() => document.hasFocus(), { timeout: 5000 });
  const found = await page.evaluate(({ tokenNames, themed, expect }) => {
    const frameOf = (el) => el.closest('[data-division]')?.dataset.division ?? '(root)';
    const problems = [];

    const byId = new Map();
    for (const el of document.querySelectorAll('[id]')) {
      byId.set(el.id, (byId.get(el.id) ?? 0) + 1);
    }
    for (const [id, n] of byId) {
      if (n > 1) problems.push(`duplicate id "${id}" × ${n}`);
    }

    const spread = (selector, attr, label) => {
      const frames = new Map();
      for (const el of document.querySelectorAll(selector)) {
        const name = el.getAttribute(attr);
        if (!name) continue;
        (frames.get(name) ?? frames.set(name, new Set()).get(name)).add(frameOf(el));
      }
      for (const [name, set] of frames) {
        if (set.size > 1) problems.push(`${label} "${name}" spans ${set.size} theme frames: ${[...set].join(', ')}`);
      }
    };

    // One `name` across two frames means one group across two themes: choosing in one
    // clears the other, and only the last `checked`/`open` in the document survives.
    spread('input[type="radio"]', 'name', 'radio group');
    spread('details[name]', 'name', 'exclusive details group');

    // A11Y-4 / A11Y-26 — the linked-card overlay must not cover its siblings.
    //
    // `.cardLinked`'s heading link paints an `::after` at `inset: 0` so the whole card is
    // one target. Every OTHER interactive element in the card has to be lifted above it,
    // or it is tabbable and focusable but cannot be clicked. axe cannot see this: it is
    // a paint-order fact, not a semantic one, and 24 green analyses coexisted with it.
    //
    // The overlay is on a pseudo-element, which `elementFromPoint` returns as its
    // originating element — so a covered control reports the TITLE LINK at its own centre.
    // That is the test, and it needs no knowledge of z-index values or stacking rules.
    //
    // **This has a permanent subject on /_kitchen-sink** — the "second link, button and
    // input" specimen — committed for exactly this reason. Before it existed the fix was
    // proven by a runtime injection that was then discarded, so the selector matched
    // nothing in CI and deleting it would have kept every gate green.
    for (const card of document.querySelectorAll('[class*="cardLinked"]')) {
      const titleLink = card.querySelector(':is(h1,h2,h3,h4,h5,h6) a');
      if (!titleLink) continue;
      for (const el of card.querySelectorAll('a, button, input, select, textarea, summary, [tabindex]')) {
        if (el === titleLink || titleLink.contains(el)) continue;
        // `elementFromPoint` hit-tests the VIEWPORT, not the document: an element below
        // the fold returns null and the check silently passes. That is how the first
        // version of this assertion reported clean against a deliberately broken
        // selector — the specimen sits far down /_kitchen-sink and was never in view.
        el.scrollIntoView({ block: 'center', inline: 'center', behavior: 'instant' });
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        const top = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
        if (!top) continue;
        if (top && top !== el && !el.contains(top) && titleLink.contains(top)) {
          problems.push(
            `linked-card overlay covers <${el.tagName.toLowerCase()}> in the ${frameOf(el)} frame — ` +
              'it is focusable but not clickable (A11Y-4)',
          );
        }
      }
    }

    // Every route must be themed. check-theme-flash asserts this from the prerendered
    // HTML for the four route groups, which is the right place for it — but it reads the
    // raw file, and the 404's raw file is a streaming shell that the parser resolves.
    // Reading the parsed DOM here is what covers the routes that gate cannot see, and it
    // is how a themeless page would be caught at all.
    //
    // **This assertion used to be `if (!document.body.dataset.division)` and nothing
    // else, and it was green while /_not-found rendered with no theme at all.** The
    // attribute was present — RootShell writes it server-side — but the stylesheet that
    // gives `[data-division]` any meaning was never linked on that route, so every token
    // was undefined. `outline: 2px solid var(--ink)` became invalid at computed-value
    // time, which discards the UA focus ring too: measured `outlineStyle: "none"`.
    //
    // Asserting the attribute tests the input to theming. Only a computed value tests the
    // result. That distinction is the fourth defect of this shape in this programme, and
    // the first to occur in a gate written to catch the third.
    // `themed: false` is the global-error boundary, which is deliberately unthemed and
    // carries no data-division by design. Everything above this line still applies to it —
    // ids, groups, the linked-card overlay — and the document-level assertions below run
    // for every route regardless.
    if (themed && !document.body.dataset.division) {
      problems.push('<body> carries no data-division — this page renders with no theme');
    }
    // The boundary must identify itself — see the ROUTES entry that sets this.
    if (expect) {
      if (document.title !== expect.title) {
        problems.push(`expected document.title "${expect.title}", got "${document.title}" — the render path this route exists to reach did not render`);
      }
      const h1 = document.querySelector('h1')?.textContent?.trim();
      if (h1 !== expect.h1) problems.push(`expected <h1> "${expect.h1}", got "${h1 ?? '(none)'}"`);
      if (document.documentElement.lang !== expect.lang) {
        problems.push(`expected lang "${expect.lang}", got "${document.documentElement.lang || '(none)'}" — WCAG 3.1.1, Level A`);
      }
      if (document.querySelectorAll('main').length !== 1) {
        problems.push(`expected exactly one <main>, found ${document.querySelectorAll('main').length}`);
      }
    }

    // **The state of the unmade choice — V2, round 10.**
    //
    // V1 asserted that a *denied* Consent Mode default was queued on first render. Its
    // subject is gone: there are no consent categories, because there is nothing
    // non-essential to consent to, and `lib/consent/state.ts` no longer touches `dataLayer`
    // at all (OQ-7 option 2). Left as it was, that check would have failed every route; had
    // it been written to tolerate an empty queue it would have gone hollow instead — green
    // while measuring nothing.
    //
    // So it is inverted rather than deleted, and it now asserts the thing the decision
    // created: **no Consent Mode signal is emitted at all, in any category, on any route.**
    // A signal reappearing means a category reappeared, and a category reappearing without
    // the banner, the cookie policy and BEFORE-LAUNCH moving with it is exactly the drift
    // this round removed. The queue is still the right place to look: it is where a Google
    // tag reads its default from, so a stray push is not cosmetic.
    if (themed) {
      const signals = (window.dataLayer ?? []).filter(
        (e) => Array.isArray(e) && e[0] === 'consent',
      );
      for (const entry of signals) {
        problems.push(
          `a Consent Mode signal was queued: ${JSON.stringify(entry)}. There are no consent ` +
            'categories on this site — nothing non-essential is stored or transmitted, so ' +
            'there is nothing to signal (round 10, OQ-7 option 2). If analytics is being ' +
            'wired up, BEFORE-LAUNCH §"Analytics" is the task and this assertion changes ' +
            'with it, in the same commit as the banner and the cookie policy',
        );
      }
    }

    // M-02 / A11Y-21 — the skip link, and it is four assertions because it fails four ways.
    //
    // **axe overlaps on exactly one of the four, and the proof establishes which check
    // fires** (`A-GATE-4-3`'s class). `best-practice` is in TAGS, so axe's `skip-link` rule
    // does run and does catch a missing target — deleting `id="main"` from `/design` fired
    // both, and crediting that run to this code alone would have been the mistake. The other
    // three assertions are outside anything axe evaluates, and each was proven alone:
    //
    //   · **not first.** A `<button>` inserted before the link in RootShell fired this and
    //     axe reported `/` clean at both viewports. A skip link that is not first is not a
    //     bypass — the blocks it exists to skip are already behind it.
    //   · **off screen while focused.** The link's first version carried
    //     `transition: transform 150ms`, so focus landed while it was still translated out
    //     of view. Measured at `(8,-56) 134×48` on all six themed routes with axe clean
    //     everywhere. That is the state this design deliberately creates and therefore the
    //     one that can break: anything that stops `:focus` winning leaves a bypass mechanism
    //     the user can reach and cannot see (2.4.7, 2.4.11 in effect). The transition was
    //     removed rather than the assertion relaxed.
    //   · **cannot take focus.** Unproven in isolation — no cheap subject produces it without
    //     also tripping one of the above. Recorded rather than claimed.
    if (themed) {
      const FOCUSABLE = 'a[href], button, input, select, textarea, summary, [tabindex]:not([tabindex="-1"])';
      const onScreen = (el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0 && r.bottom > 0 && r.right > 0 && r.top < innerHeight && r.left < innerWidth;
      };
      const first = document.body.querySelector(FOCUSABLE);
      const href = first?.getAttribute('href') ?? '';
      if (!first || first.tagName !== 'A' || !href.startsWith('#')) {
        problems.push(
          `the first focusable element in <body> is ${first ? `<${first.tagName.toLowerCase()}> "${first.textContent.trim().slice(0, 40)}"` : '(none)'}, ` +
            'not a same-page skip link — WCAG 2.4.1',
        );
      } else if (!document.getElementById(href.slice(1))) {
        problems.push(`the skip link targets "${href}", which no element on this page has — WCAG 2.4.1`);
      } else {
        const active = document.activeElement;
        first.focus();
        if (document.activeElement !== first) {
          problems.push('the skip link did not take focus — it cannot be reached by keyboard');
        } else if (!onScreen(first)) {
          const r = first.getBoundingClientRect();
          problems.push(
            `the skip link is off-screen while focused (${Math.round(r.left)},${Math.round(r.top)} ${Math.round(r.width)}×${Math.round(r.height)}) — ` +
              'a bypass mechanism the user can reach and cannot see. WCAG 2.4.7',
          );
        }
        if (active instanceof HTMLElement) active.focus();
        else first.blur();
      }
    }

    if (!themed) return problems;

    const bodyStyle = getComputedStyle(document.body);

    // An unlinked stylesheet makes every custom property resolve to the empty string.
    // This is the check that would have caught it: it needs no colour table and no
    // per-theme expectation, so it cannot drift from the tokens it is guarding.
    //
    // **It used to probe four hardcoded names — --canvas, --ink, --line, --accent — all
    // four of which live in styles/themes/*.css.** Nothing probed a value declared only in
    // styles/tokens.css, and `--text-2xl` is one of those: it is the token whose absence
    // rendered the 404's h1 at 16px in the original defect. The probe passed on the theme
    // layer and would have said nothing about the base layer. It was adequate only because
    // an @import bundles both into one emitted file — an accident of the build, not a
    // property of the check. Split the CSS output and the original defect reopens silently.
    //
    // The list is now every token name read off disk from tokens.css and the theme files,
    // passed in from Node. It cannot fall behind what exists, because it is derived from
    // what exists rather than typed here.
    const division = document.body.dataset.division;
    const probeList = [...tokenNames.base, ...(tokenNames.byDivision[division] ?? [])];
    if (probeList.length === tokenNames.base.length) {
      problems.push(`no theme token list for division "${division}" — nothing theme-specific was probed`);
    }
    for (const token of probeList) {
      if (!bodyStyle.getPropertyValue(token).trim()) {
        problems.push(`${token} resolves to nothing — the token layer is not loaded on this route`);
      }
    }

    // And this is the check that catches the tokens being present but not reaching the
    // page. `--canvas` is read back through a probe so both sides are serialised by the
    // same engine — comparing a hex token to a computed colour triplet otherwise needs a
    // colour parser in the gate, which is a second thing to get wrong.
    const probe = document.createElement('span');
    probe.style.color = 'var(--canvas)';
    document.body.append(probe);
    const canvas = getComputedStyle(probe).color;
    probe.remove();

    if (bodyStyle.backgroundColor !== canvas) {
      problems.push(
        `body background is ${bodyStyle.backgroundColor} but --canvas is ${canvas} — ` +
          'the theme is declared and not applied',
      );
    }

    return problems;
  }, { tokenNames: TOKEN_NAMES, themed, expect });

  if (found.length === 0) return 0;

  console.error(`  ${route.padEnd(16)} ${found.length} DOM integrity problem(s)`);
  for (const p of found.slice(0, 12)) console.error(`      ${p}`);
  if (found.length > 12) console.error(`      …and ${found.length - 12} more`);
  return found.length;
}

/** Browser-side identity normalization for axe's two single-character artwork incompletes. */
function designGlyphTarget({ target, html, reason }) {
  if (reason !== 'Element content is too short to determine if it is actual text content') return target;
  const captured = new DOMParser().parseFromString(html, 'text/html').body.firstElementChild;
  for (const letter of ['g', 's']) {
    if (!captured?.matches(`text[data-letter-${letter}]`) || captured.textContent.trim() !== letter.toUpperCase()) continue;
    const selector = `[data-design-stage] .ds-stage-art > svg[aria-hidden="true"][focusable="false"] > g[data-art="identity"] > .ds-letters > text[data-letter-${letter}]`;
    const matches = document.querySelectorAll(selector);
    if (matches.length !== 1 || matches[0].textContent.trim() !== letter.toUpperCase()) return target;
    if (matches[0].closest('svg').querySelector('a,button,input,select,textarea,[tabindex]')) return target;
    return `[data-design-stage] [data-letter-${letter}]`;
  }
  return target;
}

/**
 * GS-DIG-001: /digital's text shares its page with the persistent compass rail (a positioned
 * full-page layer axe counts as overlapping even with pointer-events: none) and the chapter
 * copy veil (a pseudo-element). axe therefore declines colour contrast on text it cannot see
 * behind. Those declines are normalised to one allowlist target ONLY when the node is inside
 * the region check:digital:scene measures by rendered pixels and the reason is one of these
 * background/short-content declines. Anything else — a node in the chrome, a missing node, a
 * different reason — keeps its own target and reports UNRESOLVED.
 */
const DIGITAL_SCENE_REASONS = [
  "Element's background color could not be determined because it is overlapped by another element",
  "Element's background color could not be determined because it partially overlaps other elements",
  "Element's background color could not be determined due to a pseudo element",
  "Element's background color could not be determined because element contains an image node",
  'Element content is too short to determine if it is actual text content',
  'Element content contains only non-text characters',
];
function digitalSceneTarget({ target, reason, scope, reasons, canonical }) {
  if (!reasons.includes(reason)) return target;
  let node = null;
  try { node = document.querySelector(target); } catch { return target; }
  return node?.closest(scope) ? canonical : target;
}

async function proveDigitalSceneTargets(browser) {
  const page = await browser.newPage();
  try {
    await page.setContent('<main class="dg-home"><h2 id="inside">Copy</h2></main><footer><p id="outside">Footer</p></footer>');
    const base = { scope: DIGITAL_SCENE, reasons: DIGITAL_SCENE_REASONS, canonical: DIGITAL_SCENE_TARGET };
    let cases = 0;
    const check = async (input, expected) => {
      const actual = await page.evaluate(digitalSceneTarget, { ...base, ...input });
      if (actual !== expected) throw new Error(`Digital scene classification proof failed: ${actual} != ${expected}`);
      cases += 1;
    };
    for (const reason of DIGITAL_SCENE_REASONS) await check({ target: '#inside', reason }, DIGITAL_SCENE_TARGET);
    await check({ target: '#outside', reason: DIGITAL_SCENE_REASONS[0] }, '#outside');
    await check({ target: '#inside', reason: 'A different incomplete reason' }, '#inside');
    await check({ target: '#missing', reason: DIGITAL_SCENE_REASONS[0] }, '#missing');
    await check({ target: 'div:::bad', reason: DIGITAL_SCENE_REASONS[0] }, 'div:::bad');
    console.log(`check-axe: Digital scene classification ${cases} positive/negative proofs PASS`);
  } finally {
    await page.close();
  }
}

/** Prove that selector animation is accepted, while changed semantics remain unresolved. */
async function proveDesignGlyphTargets(browser) {
  const page = await browser.newPage();
  try {
    await page.setContent('<div data-design-stage><div class="ds-stage-art"><svg aria-hidden="true" focusable="false"><g data-art="identity"><g class="ds-letters"><text data-letter-g transform="translate(0 0)">G</text><text data-letter-s>S</text></g></g></svg></div></div>');
    const reason = 'Element content is too short to determine if it is actual text content';
    let cases = 0;
    const check = async (input, expected) => {
      const actual = await page.evaluate(designGlyphTarget, { reason, ...input });
      if (actual !== expected) throw new Error(`Glyph classification proof failed: ${actual} != ${expected}`);
      cases += 1;
    };
    for (const letter of ['g', 's']) {
      // The captured transform no longer exists in the live DOM.
      await check({ target: 'text[transform="translate(8 22)"]', html: `<text data-letter-${letter} transform="translate(8 22)">${letter.toUpperCase()}</text>` }, `[data-design-stage] [data-letter-${letter}]`);
    }
    for (const html of ['<span data-letter-g>G</span>', '<text>G</text>', '<text data-letter-g>Unrelated copy</text>']) {
      await check({ target: '#unrelated', html }, '#unrelated');
    }
    const glyph = { target: '#unresolved', html: '<text data-letter-g>G</text>' };
    await check({ ...glyph, reason: 'Different incomplete reason' }, '#unresolved');
    await page.evaluate(() => document.querySelector('svg').removeAttribute('aria-hidden'));
    await check(glyph, '#unresolved');
    await page.evaluate(() => { const svg = document.querySelector('svg'); svg.setAttribute('aria-hidden', 'true'); svg.querySelector('text').setAttribute('tabindex', '0'); });
    await check(glyph, '#unresolved');
    console.log(`check-axe: decorative glyph classification ${cases} positive/negative proofs PASS`);
  } finally {
    await page.close();
  }
}

/** The focus check must own the foreground, and still reject a hidden focused link. */
async function proveSkipLinkFocus(browser) {
  const page = await browser.newPage();
  let helper;
  try {
    await page.setViewport({ width: 1280, height: 900 });
    await page.goto(`${BASE_URL}/_kitchen-sink`, { waitUntil: 'networkidle0' });
    helper = await browser.newPage();
    await helper.bringToFront();
    const background = await page.evaluate(() => {
      const link = document.querySelector('a[href="#main"]');
      link.focus();
      return !document.hasFocus() && document.activeElement === link &&
        !link.matches(':focus') && link.getBoundingClientRect().bottom < 0;
    });
    if (!background) throw new Error('Skip-link proof did not establish the unfocused-page precondition');
    if (await domIntegrity(page, 'focus proof: foreground') !== 0) {
      throw new Error('DOM integrity must restore foreground focus before measuring the skip link');
    }
    const hidden = await page.addStyleTag({ content: 'a[href="#main"]:focus { transform: translateY(-200%) !important; }' });
    if (await domIntegrity(page, 'focus proof: deliberately hidden') !== 1) {
      throw new Error('DOM integrity must reject the hidden focused skip link');
    }
    await hidden.evaluate((element) => element.remove());
    if (await domIntegrity(page, 'focus proof: restored') !== 0) {
      throw new Error('Skip-link proof did not restore the clean browser specimen');
    }
    console.log('check-axe: foreground restoration and hidden focused skip-link proofs PASS');
  } finally {
    await helper?.close();
    await page.close();
  }
}

/** Every launch in this file goes through `browser-launch.mjs`. See its docstring — M-P2-33. */
const browser = await launch();
await proveDesignGlyphTargets(browser);
await proveDigitalSceneTargets(browser);
if (process.argv.includes('--prove-glyphs-only')) {
  await browser.close();
  process.exit(0);
}
await proveSkipLinkFocus(browser);
if (process.argv.includes('--prove-focus-only')) {
  await browser.close();
  process.exit(0);
}
let total = 0;
/** Cookies present after every route load, with no interaction. Filled before close. */
let cookiesSeen = [];
/**
 * Requests to third-party analytics hosts, across every route load with no interaction.
 *
 * **The cookie check and this one answer different questions and neither implies the other.**
 * A tag can make its request and set nothing (PostHog's array.js does exactly that until it
 * initialises), and a cookie can be set by first-party code with no request at all. PECR is
 * about storage; `PROJECT-RULES.md` §6 is stricter and says the scripts must not be
 * *injected* — "not loaded-and-suppressed". Only the network answers that.
 *
 * Hosts rather than a keyword: `googletagmanager.com` in a page's own text is not a request.
 */
const ANALYTICS_HOSTS = ['googletagmanager.com', 'google-analytics.com', 'posthog.com', 'i.posthog.com'];
const analyticsRequests = [];
/** path → the routes that link to it. Filled per page load, resolved once at the end. */
const linkedFrom = new Map();
let analyses = 0;
let incompleteAllowed = 0;
const allowedSeen = new Set();

/**
 * Exactly one of `target` / `targetPattern`, asserted before any audit runs.
 *
 * An entry with both, or with neither, would be silently skipped by the matcher and the
 * incomplete it was written for would report UNRESOLVED — or worse, a typo'd `target` on an
 * entry that also had a pattern would look like it was doing the matching when the pattern
 * was. A key nobody reads is how an allowlist stops allowing, and this is the cheapest place
 * to find out.
 */
for (const [i, a] of INCOMPLETE_ALLOWED.entries()) {
  const keys = [a.target !== undefined, a.targetPattern !== undefined].filter(Boolean).length;
  if (keys !== 1) {
    console.error(
      `\ncheck-axe: INCOMPLETE_ALLOWED entry ${i} (${a.rule}) names ` +
        `${keys === 0 ? 'neither target nor targetPattern' : 'both target and targetPattern'}. ` +
        'Exactly one is required — the matcher would otherwise ignore the entry silently.\n',
    );
    process.exit(1);
  }
}

try {
  for (const route of ROUTES) {
    for (const viewport of VIEWPORTS) {
      const page = await browser.newPage();
      page.on('request', (req) => {
        const host = new URL(req.url()).hostname;
        if (ANALYTICS_HOSTS.some((h) => host === h || host.endsWith(`.${h}`))) {
          analyticsRequests.push(`${route.path} → ${req.url()}`);
        }
      });
      await page.setViewport({ width: viewport.width, height: viewport.height });

      const response = await page.goto(`${BASE_URL}${route.path}`, { waitUntil: 'networkidle0' });

      // A route that did not load as expected is a measurement failure, not zero
      // violations. Reporting "0 violations" for a page that never rendered is precisely
      // the unearned-confidence failure the gate rules in CLAUDE.md exist to prevent.
      // 304 is a load, not a failure: puppeteer reuses its cache across pages in one
      // browser, so a revisited route legitimately returns Not Modified.
      const status = response ? response.status() : 0;
      const ok = status === route.status || (route.status === 200 && status === 304);
      if (!ok) {
        console.error(`\ncheck-axe: ${route.path} returned ${status || 'no response'}, expected ${route.status}.`);
        console.error('Cannot audit this route. Fix the route or the base URL.\n');
        process.exit(1);
      }

      for (const phase of PHASES) {
        if (phase.scrollToFoot) {
          // StickyCta only un-hides itself past 40% scroll depth and RevealOnScroll only
          // reveals on intersection, so an audit taken at scroll position zero never sees
          // either. The `initial` phase before this one is what sees everything else.
          await page.evaluate(async () => {
            window.scrollTo(0, document.body.scrollHeight);
            await new Promise((r) => setTimeout(r, 400));
          });
        }

        const where = `${route.path} @ ${viewport.label} ${phase.label}`;
        const { violations, incomplete } = await new AxePuppeteer(page, axeSource).withTags(TAGS).analyze();
        analyses += 1;

        // `incomplete` is axe saying "I could not determine a result here" — not "this
        // passed". It was destructured away and never printed, so eight unresolved
        // 1.4.3 evaluations were being reported as `clean` on every run. A result the
        // tool declined to give is not a pass, and discarding it silently is the same
        // unearned confidence as a gate that measures nothing.
        for (const inc of incomplete) {
          for (const node of inc.nodes) {
            let target = node.target.join(' ');
            // Attribute-based axe selectors can change before the async audit returns.
            // Match the captured node plus its current, strictly decorative DOM boundary.
            if (route.path === '/design' && inc.id === 'color-contrast') {
              target = await page.evaluate(designGlyphTarget, {
                target, html: node.html,
                reason: node.any?.[0]?.message ?? node.all?.[0]?.message ?? '',
              });
            }
            if (route.path === '/digital' && inc.id === 'color-contrast') {
              target = await page.evaluate(digitalSceneTarget, {
                target,
                reason: node.any?.[0]?.message ?? node.all?.[0]?.message ?? '',
                scope: DIGITAL_SCENE, reasons: DIGITAL_SCENE_REASONS, canonical: DIGITAL_SCENE_TARGET,
              });
            }
            const allowed = INCOMPLETE_ALLOWED.find(
              (a) =>
                a.rule === inc.id &&
                a.routes.includes(route.path) &&
                (a.target !== undefined ? a.target === target : a.targetPattern.test(target)),
            );
            if (allowed) {
              incompleteAllowed += 1;
              // The reason is printed once at the end, not 24 times inline — a wall of
              // repeated prose is how a reader learns to scroll past this gate's output,
              // and the loud Lighthouse-skip banner has to stay readable.
              allowedSeen.add(allowed);
              console.log(`  ${where.padEnd(40)} incomplete ${inc.id} on ${target} — allowed`);
            } else {
              total += 1;
              console.error(
                `  ${where.padEnd(40)} UNRESOLVED ${inc.id} on ${target} — axe could not ` +
                  'determine a result and this combination is not in INCOMPLETE_ALLOWED',
              );
              const reason = node.any?.[0]?.message ?? node.all?.[0]?.message ?? '(no message)';
              console.error(`      ${reason}`);
            }
          }
        }

        if (violations.length === 0) {
          console.log(`  ${where.padEnd(40)} clean`);
        } else {
          const count = violations.reduce((n, v) => n + v.nodes.length, 0);
          total += count;
          console.error(`  ${where.padEnd(40)} ${count} violation(s) across ${violations.length} rule(s)`);
          for (const v of violations) {
            console.error(`      [${v.impact ?? 'n/a'}] ${v.id} — ${v.help}`);
            for (const node of v.nodes.slice(0, 3)) {
              console.error(`        ${node.target.join(' ')}`);
            }
            if (v.nodes.length > 3) console.error(`        …and ${v.nodes.length - 3} more`);
          }
        }
      }

      // Ids and grouping attributes are properties of the served markup, not of scroll
      // position, so once per page load is the honest amount.
      total += await domIntegrity(page, `${route.path} @ ${viewport.label}`, route.themed !== false, route.expect ?? null);

      // Every same-origin link the page actually renders, collected for the resolve pass
      // below. Collected from the DOM rather than from a nav config, because the question
      // is whether the SERVED page links somewhere real — a config-derived list would pass
      // while the markup pointed elsewhere, and would say nothing about links in content.
      for (const href of await page.evaluate(() =>
        [...document.querySelectorAll('a[href]')]
          // A bare fragment resolves against the current URL, so `#main` would otherwise
          // report the page as linking to itself — which is how the 404 probe first
          // appeared here. The skip link is asserted separately in domIntegrity.
          .filter((a) => !a.getAttribute('href').startsWith('#'))
          .map((a) => a.href)
          .filter((h) => h.startsWith(location.origin))
          .map((h) => new URL(h).pathname),
      )) {
        (linkedFrom.get(href) ?? linkedFrom.set(href, new Set()).get(href)).add(route.path);
      }

      await page.close();
    }
  }
  // Collected while the browser is still open — `browser.close()` takes the profile with
  // it, and reading cookies afterwards returns undefined rather than an empty list, which
  // would have made this assertion measure nothing and pass.
  cookiesSeen = await browser.cookies();
} finally {
  await browser.close();
}

/**
 * **Every same-origin link on every audited route resolves.**
 *
 * `M-03` is what made this necessary. `APP-FLOW.md` §8 specifies a header carrying `Work`,
 * `Approach`, `About` and a contact CTA, none of which have routes until Epic N — so the
 * spec, followed literally, puts four 404s in the chrome of every page on the site. The
 * decision was to ship only the links whose routes exist, and a decision like that survives
 * exactly as long as something checks it. Nothing did: axe has no rule for a link that
 * 404s, `check-responsive` never requests one, and a header is the one component where a
 * dead link is on every page rather than one.
 *
 * The 404 probe's path is excluded by name — it is the one route in ROUTES that MUST 404,
 * and it is never linked from anywhere, so its presence here would mean something linked
 * to it.
 */
const linkProblems = [];
for (const [path, from] of [...linkedFrom].sort()) {
  if (path === '/_gridsmith-404-probe') {
    linkProblems.push(`${path} is linked from ${[...from].join(', ')} — that path exists to 404`);
    continue;
  }
  const res = await fetch(`${BASE_URL}${path}`, { redirect: 'manual' });
  if (res.status >= 400) {
    linkProblems.push(`${path} → ${res.status}, linked from ${[...from].sort().join(', ')}`);
  }
}
if (linkProblems.length > 0) {
  console.error(`
check-axe: ${linkProblems.length} link(s) do not resolve:`);
  for (const p of linkProblems) console.error(`      ${p}`);
  total += linkProblems.length;
}

/**
 * **The footer's legal links are on every route, not just on one — `M-P2-22`.**
 *
 * The resolve pass above answers "does every link that exists point somewhere real". This
 * answers the opposite question, and nothing asked it before: **does a link that must exist
 * exist at all.** For eleven rounds it did not — the only link to a legal document anywhere
 * in the site's chrome was one on the Press landing page, so the privacy notice and the
 * cookie policy were reachable by URL and effectively by nothing else. No gate fired,
 * because a missing link is not a broken one.
 *
 * E-commerce regs reg. 6 requires the particulars *easily, directly and permanently
 * accessible*, and the ICO's expectation is a cookie policy reachable from the footer.
 * "Permanently" is why this asserts **every** audited route rather than a sample: a footer
 * group that renders on the master route group and not on a division's would satisfy any
 * spot check and none of the regulation.
 *
 * **The expected paths are hardcoded, deliberately.** The question is whether the delivered
 * footer *declares* these links, so the expectation must come from outside the subject —
 * deriving it from `LEGAL_FOOTER_SLUGS` would mean deleting a slug deletes the expectation
 * with it and this stays green having measured less (CLAUDE.md, `check:tokens`).
 *
 * `/gridsmith-error-probe` is excluded and that exclusion is asserted, not assumed: it
 * throws after hydration, so `global-error` replaces the whole document, footer included.
 * If it ever *does* carry the footer, the boundary stopped firing and the probe went hollow.
 */
const FOOTER_LEGAL_PATHS = [
  '/legal/terms',
  '/legal/privacy',
  '/legal/cookies',
  '/legal/accessibility',
];
const FOOTER_EXEMPT = '/gridsmith-error-probe';
const footeredRoutes = ROUTES.map((r) => r.path).filter((p) => p !== FOOTER_EXEMPT);
const footerProblems = [];
for (const path of FOOTER_LEGAL_PATHS) {
  const from = linkedFrom.get(path) ?? new Set();
  const missing = footeredRoutes.filter((r) => !from.has(r));
  if (missing.length > 0) {
    footerProblems.push(
      `${path} is not linked from ${missing.length} of ${footeredRoutes.length} route(s): ${missing.join(', ')}`,
    );
  }
  if (from.has(FOOTER_EXEMPT)) {
    footerProblems.push(
      `${path} is linked from ${FOOTER_EXEMPT} — global-error did not replace the document, so that probe is no longer its subject`,
    );
  }
}
if (footerProblems.length > 0) {
  console.error(`
check-axe: ${footerProblems.length} footer legal link problem(s):`);
  for (const p of footerProblems) console.error(`      ${p}`);
  total += footerProblems.length;
} else {
  console.log(
    `check-axe: ${FOOTER_LEGAL_PATHS.length} footer legal link(s) present on all ${footeredRoutes.length} footered route(s)`,
  );
}

/**
 * **No non-essential storage before consent — `A-11`, and it is a legal assertion.**
 *
 * PECR: no non-essential cookie, script or pixel may fire before an affirmative choice, and
 * the penalty ceiling is 4% of turnover (CLAUDE.md non-negotiable #7). `PROJECT-RULES.md` §6
 * says "not loaded-and-suppressed — not injected". Nothing gated that.
 *
 * The browser is the only place this is answerable. A source sweep can show that no GA4
 * snippet is imported today; it cannot show that nothing *sets a cookie at runtime*, which is
 * the thing the regulator cares about and the thing an added dependency changes silently.
 *
 * Every route was just loaded with a fresh browser and no interaction, so the only cookies
 * present are ones something set unprompted. The allowlist is empty and should stay that way:
 * `gs_consent` itself is strictly necessary but is only written on a click, so a run that
 * never clicks must not see it either. **A cookie here is a finding, not a configuration.**
 *
 * **Round 10 makes the analytics half unconditional.** There is no longer a state in which an
 * analytics host may be contacted — the injection is deleted and the categories with it — so
 * "before any consent" is now a description of when this sweep runs, not a qualifier on the
 * claim. The notice path below covers after the press, and expects the same silence.
 */
if (analyticsRequests.length > 0) {
  total += analyticsRequests.length;
  console.error(`\ncheck-axe: ${analyticsRequests.length} analytics request(s) before any consent:`);
  for (const r of analyticsRequests) console.error(`      ${r}`);
  console.error(
    '      Round 10 removed the analytics injection entirely (OQ-7 option 2): there is no' +
      '\n      consent state in which any analytics host is contacted. A request here means' +
      '\n      something re-added a tag — BEFORE-LAUNCH §"Analytics" is the task, and it has' +
      '\n      prerequisites (L-07, the dataLayer shim) that come first.',
  );
}

const cookiesBeforeConsent = cookiesSeen;
if (cookiesBeforeConsent.length > 0) {
  total += cookiesBeforeConsent.length;
  console.error(
    `\ncheck-axe: ${cookiesBeforeConsent.length} cookie(s) set before any consent was given:`,
  );
  for (const c of cookiesBeforeConsent) console.error(`      ${c.name}=${c.value} (${c.domain})`);
  console.error(
    '      PECR requires prior consent for non-essential storage — PROJECT-RULES §6,' +
      '\n      CLAUDE.md non-negotiable #7. Nothing may be set on load.',
  );
}

/**
 * **The lead validation contract — `A-08`, hardened at GS-P01.**
 *
 * Exercised over HTTP against `app/gridsmith-lead-probe/route.ts`. GS-P01 deliberately removed
 * the live insert from this probe: CI must not hold the service-role key and a verification run
 * must not create production data. `check:lead-security` owns the insert-boundary assertions.
 *
 * Every rejection case is a real validation boundary rather than a sample: a malformed email,
 * a division outside the enum, a blank required field, a body over the length cap, and a
 * request that is not an object at all. Each must be refused before any database call.
 */
const LEAD_PROBE = `${BASE_URL}/gridsmith-lead-probe`;
const VALID_LEAD = { division: 'design', full_name: 'Pipeline Probe', email: 'pipeline@gridsmith.invalid' };
const REJECTED = [
  ['a malformed email', { ...VALID_LEAD, email: 'nope' }],
  ['a division outside the enum', { ...VALID_LEAD, division: 'legal' }],
  ['a blank required field', { ...VALID_LEAD, full_name: '   ' }],
  ['a body over the length cap', { ...VALID_LEAD, message: 'x'.repeat(5001) }],
  ['a request that is not an object', 'nonsense'],
];

const leadProblems = [];
let notifyBranch = 'not run';
const postLead = async (body) => {
  const res = await fetch(LEAD_PROBE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return { status: res.status, json: await res.json().catch(() => null) };
};

/**
 * **The notification half — and the gate states the limit of its own green result.**
 *
 * Which branch runs depends on the environment, and **both are real assertions rather than a
 * skip**: with no `RESEND_API_KEY` the outcome must be `skipped`, with one it must be `sent`.
 * A configured provider that returns anything else is a failure. There is no path where this
 * measures nothing.
 *
 * ⚠ **A `sent` here does not mean the mail is deliverable.** Development sends from
 * `onboarding@resend.dev`, Resend's shared sender, which **only delivers to the account
 * owner's own address**. This proves the pipeline composes, authenticates and is accepted. It
 * proves nothing about delivery to an arbitrary recipient, and it must not be read as a
 * verified production path — `gridsmith.uk` is not verified in Resend and will not be until
 * deployment, when Resend's `include:` has to be **merged into the existing SPF record**. A
 * second SPF record is a `permerror` under RFC 7208 §4.5 and silently breaks the live site's
 * mail.
 */
{
  const notifyRes = await fetch(`${LEAD_PROBE}?mode=notify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(VALID_LEAD),
  });
  const notifyJson = await notifyRes.json().catch(() => null);
  const outcomes = notifyJson?.notifications ?? [];
  const resend = outcomes.find((o) => o.channel === 'resend-internal');
  // **The SERVER's configuration, not this process's.** The gate and the app are separate
  // processes; deciding "configured" from `process.env` here asserts against a state this
  // process does not observe, and during A-08's proof that produced a confidently wrong
  // message — "not configured" about a server that was configured and failing.
  const configured = notifyJson?.configured === true;
  const wanted = configured ? 'sent' : 'skipped';

  if (!resend) {
    leadProblems.push('the notify path returned no resend-internal outcome — the fan-out did not run');
  } else if (resend.status !== wanted) {
    leadProblems.push(
      `Resend is ${configured ? 'configured' : 'not configured'} so its outcome must be ` +
        `"${wanted}", and it was "${resend.status}"${resend.detail ? ` (${resend.detail})` : ''}. ` +
        'Unset is a skip; set-but-broken is a failure, because a provider that silently stops ' +
        'working is how a pipeline is found to have been dropping notifications for a month',
    );
  }
  notifyBranch = `${wanted} (${configured ? 'configured' : 'unconfigured'})`;
}

{
  const ok = await postLead(VALID_LEAD);
  if (ok.status !== 200 || ok.json?.status !== 'valid') {
    leadProblems.push(`a valid lead did not pass validation — returned ${ok.status} ${JSON.stringify(ok.json)}`);
  }

  for (const [label, body] of REJECTED) {
    const bad = await postLead(body);
    if (bad.json?.status !== 'invalid') {
      leadProblems.push(
        `${label} was not rejected — returned ${bad.status} ${JSON.stringify(bad.json)}. ` +
          'the server boundary must reject it before the service-role insert is attempted',
      );
    }
  }
}

if (leadProblems.length > 0) {
  total += leadProblems.length;
  console.error(`
check-axe: ${leadProblems.length} problem(s) on the lead pipeline (A-08):`);
  for (const p of leadProblems) console.error(`      ${p}`);
}

/**
 * **The notice path — round 10, and it replaces the `A-09` grant path because the grant is
 * gone.**
 *
 * What used to be here ran a fresh context, clicked Accept, asserted a request to each
 * configured provider on an EU host, then ran a second context, clicked Reject, and asserted
 * silence. Every premise of that sequence has been removed: `lib/analytics/load.ts` is
 * deleted, `NEXT_PUBLIC_GA4_ID` and `NEXT_PUBLIC_POSTHOG_KEY` are inert, there is no Accept
 * and no Reject, and `window.__gsAnalyticsConfigured` is no longer published. The owner took
 * OQ-7 option 2 (`docs/_legal/03-REVISION-LOG.md` round 10): stop asking, because the two
 * libraries loaded on consent and never initialised.
 *
 * **Deleting the block outright was the wrong move and this is why.** The old sequence's real
 * value was not "does Accept load GA4" — it was that a *committed subject* existed for the
 * one legally load-bearing claim on this site. Take it away and the only surviving assertions
 * about analytics are the no-interaction sweeps, which say nothing about what happens after a
 * click. So the subject is kept and the assertion is inverted: **an interaction with the
 * notice must contact nobody, in every state including the one that used to be a grant.**
 *
 *   1. fresh context, no cookie  -> the notice is there, offers NO category control,
 *                                   zero analytics requests, zero cookies
 *   2. press the one control     -> notice gone, exactly one cookie (`gs_consent`), still
 *                                   zero analytics requests, storage still empty
 *   3. reload, same context      -> notice stays gone; the cookie is what stops it
 *   4. fresh context, a LEGACY   -> notice not shown, cookie NOT rewritten, still zero
 *      pre-round-10 cookie value     analytics requests
 *
 * **Step 4 is the migration assertion and it has no other home.** Cookies written before this
 * round carry `analytics_storage,ad_storage,functionality_storage` — names that now name
 * nothing. `noticeSeen()` reads presence only, so a stale grant cannot switch anything on;
 * this proves that in the browser rather than by reading the predicate, and it proves the
 * cookie is left as the visitor's own record rather than silently rewritten.
 *
 * **Step 1's "no category control" is a subject-state assertion, not decoration.** A banner
 * that quietly regrew a checkbox would leave every other assertion here green while the
 * cookie policy said there were no categories. Assert the state, not the existence.
 *
 * **This gate needs no id configured, and that is the point.** The old one failed when
 * nothing was configured, because an unconfigured environment was where it went hollow. The
 * claim is now "nobody is contacted", which is exercised identically in every environment —
 * the `M-P1-6` premise-from-the-wrong-system problem disappears rather than being managed.
 */
const LEGACY_COOKIE = 'gs_consent=analytics_storage%2Cad_storage%2Cfunctionality_storage';
const noticeProblems = [];

{
  const browser2 = await launch();
  try {
    // ---- Steps 1-3: a first visit, the press, and the reload.
    const context = await browser2.createBrowserContext();
    const page = await context.newPage();
    const seen = [];
    page.on('request', (req) => {
      const host = new URL(req.url()).hostname;
      if (ANALYTICS_HOSTS.some((h) => host === h || host.endsWith(`.${h}`))) seen.push(req.url());
    });

    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });

    const first = await page.evaluate(() => {
      const bar = document.getElementById('gs-consent-heading')?.closest('[role="region"]');
      return {
        present: Boolean(bar),
        categoryControls: bar ? bar.querySelectorAll('input, select').length : -1,
        buttons: bar ? [...bar.querySelectorAll('button')].map((b) => b.textContent.trim()) : [],
      };
    });

    if (!first.present) {
      noticeProblems.push(
        'no cookie notice on a first visit with no cookie — the subject of this whole block ' +
          'is not there (A-11, components/consent/ConsentBanner.tsx)',
      );
    } else {
      if (first.categoryControls > 0) {
        noticeProblems.push(
          `the notice offers ${first.categoryControls} form control(s). There are no consent ` +
            'categories (round 10): a control here offers the visitor a choice that changes ' +
            'nothing, which is the misrepresentation this round removed',
        );
      }
      if (first.buttons.length !== 1) {
        noticeProblems.push(
          `the notice has ${first.buttons.length} button(s) [${first.buttons.join(', ')}]; ` +
            'expected exactly one. Two would mean an accept/reject pair has come back with ' +
            'nothing for it to accept or reject',
        );
      }
    }
    if (seen.length > 0) {
      noticeProblems.push(`first visit: ${seen.length} analytics request(s) before any press`);
    }
    const cookiesFirst = await page.cookies();
    if (cookiesFirst.length > 0) {
      noticeProblems.push(
        `first visit: ${cookiesFirst.length} cookie(s) before any press — ` +
          cookiesFirst.map((c) => c.name).join(', '),
      );
    }

    const pressed = await page.evaluate(() => {
      const bar = document.getElementById('gs-consent-heading')?.closest('[role="region"]');
      const b = bar?.querySelector('button');
      if (!b) return false;
      b.click();
      return true;
    });
    if (!pressed) {
      noticeProblems.push('the notice has no control to press — nothing can be acknowledged');
    } else {
      await new Promise((r) => setTimeout(r, 1500));

      if (seen.length > 0) {
        noticeProblems.push(
          `${seen.length} analytics request(s) AFTER acknowledging the notice — ` +
            `${seen.join(', ')}. Acknowledging a notice contacts nobody; there is nothing ` +
            'consent-gated left to load (round 10, OQ-7 option 2)',
        );
      }

      const after = await page.evaluate(() => ({
        gone: !document.getElementById('gs-consent-heading'),
        local: Object.keys(localStorage).length,
        session: Object.keys(sessionStorage).length,
      }));
      if (!after.gone) noticeProblems.push('the notice is still shown after being acknowledged');
      if (after.local > 0 || after.session > 0) {
        noticeProblems.push(
          `after the press: ${after.local} localStorage and ${after.session} sessionStorage ` +
            'key(s). This site uses neither, in any state',
        );
      }

      const cookiesAfter = await page.cookies();
      if (cookiesAfter.length !== 1 || cookiesAfter[0].name !== 'gs_consent') {
        noticeProblems.push(
          `after the press: expected exactly one cookie, gs_consent — got [${cookiesAfter
            .map((c) => `${c.name}=${c.value}`)
            .join(', ')}]. COOKIE-POLICY.md §2 gives that as the COMPLETE list`,
        );
      }

      // Step 3 — the reload. The cookie's only job is to stop the notice returning, and
      // that job is what makes it strictly necessary under Sch. A1 para. 4.
      await page.reload({ waitUntil: 'networkidle0' });
      const stillGone = await page.evaluate(() => !document.getElementById('gs-consent-heading'));
      if (!stillGone) {
        noticeProblems.push(
          'the notice reappeared on reload with gs_consent set — it would show on every page ' +
            'view, and the cookie would then have no strictly-necessary purpose to rest on',
        );
      }
    }
    await context.close();

    // ---- Step 4: a visitor carrying a pre-round-10 cookie.
    const legacyContext = await browser2.createBrowserContext();
    const legacyPage = await legacyContext.newPage();
    const legacySeen = [];
    legacyPage.on('request', (req) => {
      const host = new URL(req.url()).hostname;
      if (ANALYTICS_HOSTS.some((h) => host === h || host.endsWith(`.${h}`))) {
        legacySeen.push(req.url());
      }
    });
    // Written through the page rather than via setCookie, so the value is exactly what the
    // old `writeConsent()` wrote — encoded commas included.
    await legacyPage.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
    await legacyPage.evaluate((v) => {
      document.cookie = `${v}; Max-Age=31536000; Path=/; SameSite=Lax`;
    }, LEGACY_COOKIE);
    await legacyPage.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 1000));

    const legacy = await legacyPage.evaluate(() => ({
      shown: Boolean(document.getElementById('gs-consent-heading')),
      cookie: document.cookie,
    }));
    if (legacy.shown) {
      noticeProblems.push(
        'a visitor carrying a pre-round-10 gs_consent is asked again. Presence is the only ' +
          'thing that value means now (lib/consent/state.ts, noticeSeen)',
      );
    }
    if (!legacy.cookie.includes('analytics_storage')) {
      noticeProblems.push(
        `a pre-round-10 gs_consent was rewritten on sight — now "${legacy.cookie}". It is the ` +
          "visitor's own record of what they were shown and is left alone; the removed " +
          'category names are read by nothing, so a stale grant cannot enable anything',
      );
    }
    if (legacySeen.length > 0) {
      noticeProblems.push(
        `${legacySeen.length} analytics request(s) for a visitor whose old cookie GRANTED ` +
          `analytics_storage — ${legacySeen.join(', ')}. This is the state that would fail ` +
          'silently if the removed category were still read anywhere',
      );
    }
    await legacyContext.close();
  } finally {
    await browser2.close();
  }
}

if (noticeProblems.length > 0) {
  total += noticeProblems.length;
  console.error(`
check-axe: ${noticeProblems.length} problem(s) on the cookie-notice path (A-11, round 10):`);
  for (const p of noticeProblems) console.error(`      ${p}`);
}

/**
 * **What a server-render crash actually serves, characterised — `M-07`.**
 *
 * `app/global-error.tsx` and `gridsmith-error-probe` both recorded the SSR path as
 * **unknown** and refused to assert it in either direction, because it could not be induced
 * without editing a file. `app/(marketing)/gridsmith-ssr-throw-probe/page.probe.tsx` is now
 * that file, committed, and the answer is measured:
 *
 *   status 500 · `<html id="__next_error__">` · **no `lang`** · no `<h1>` · no `<main>` ·
 *   `<title>` "Gridsmith Ltd", leaked from route metadata rather than the boundary's own
 *
 * The `global-error` chunk is preloaded but the boundary renders only after hydration, so
 * **a visitor with JavaScript disabled gets the bare shell.** `APP-FLOW.md` §7 says the 500
 * "works without JS". It does not. Missing `lang` is WCAG 3.1.1, **Level A**.
 *
 * A segment-level `app/(marketing)/error.tsx` was tried and does not change any of it — the
 * shell is still what the HTML contains. There is no app-level fix; the remedy is
 * architectural and is raised as `M-P1-1`, not decided here.
 *
 * **So this is a characterisation, not an approval.** It asserts today's behaviour so the
 * behaviour cannot drift in silence — most importantly so that a Next upgrade which starts
 * server-rendering the boundary is *noticed*. **When this fires because `lang` appeared,
 * the fix is to delete the characterisation and assert the Level A requirement directly.**
 * **The `lang` branch of this characterisation had never executed.** Its regex was
 * written `/<html[^>]*\blang="/` with a literal U+0008 where the two characters `\b`
 * were meant — the same defect as `check:rls`, a third instance, and invisible in every
 * rendering. The lookahead could not match, so `lang` was `false` unconditionally and
 * agreed with `CHARACTERISED` for the wrong reason: the one branch whose whole purpose is
 * to fire when Next starts server-rendering the boundary could never have fired. Found by
 * `scripts/check-control-chars.mjs` on its first run, not by reading. Repaired to `\s`
 * and re-measured against a real `next build && next start`: the served shell is
 * `<html id="__next_error__">` with a leaked `<title>Gridsmith Ltd` and no `lang`, so the
 * characterisation above is unchanged — but it is now measured rather than assumed. The
 * branch was proven to distinguish: it returns `false` on the served shell and `true` on
 * the same shell with `lang="en-GB"` added, where the old regex returned `false` on both.
 * It is written to be deleted.
 *
 * **Not deleted on 21 Aug, and the attempt is recorded so it is not repeated blind.** The move
 * to Vercel was recorded as making `M-P1-1`'s remedy available — a static error document
 * served outside Next's render path — which would have made `lang` appear and retired this
 * block. `public/500.html` was deployed and two failures induced on the preview: a real
 * platform error (a killed invocation, 504) and this server-render crash (500). **Neither
 * served it.** The characterisation below is therefore still exactly true, and is still the
 * only thing standing between a silent change and a noticed one.
 */
const SSR_CRASH = '/gridsmith-ssr-throw-probe';
const crashRes = await fetch(`${BASE_URL}${SSR_CRASH}`);
const crashHtml = await crashRes.text();
const crashFacts = {
  status: crashRes.status,
  shell: /<html[^>]*id="__next_error__"/.test(crashHtml),
  lang: /<html[^>]*\slang="/.test(crashHtml),
  h1: /<h1[\s>]/.test(crashHtml),
  main: /<main[\s>]/.test(crashHtml),
};
const CHARACTERISED = { status: 500, shell: true, lang: false, h1: false, main: false };
for (const [key, expected] of Object.entries(CHARACTERISED)) {
  if (crashFacts[key] !== expected) {
    total += 1;
    console.error(
      `
check-axe: ${SSR_CRASH} served ${key}=${crashFacts[key]}, characterised as ${expected}.` +
        `
      The server-render crash path has CHANGED. If lang is now present, Next is` +
        `
      server-rendering global-error: delete this characterisation and assert the` +
        `
      Level A requirement instead (M-P1-1). If it moved the other way, it is a` +
        `
      regression. Either way this is not a pass.`,
    );
  }
}

// `process.exitCode`, not `process.exit()`, from here down. The link pass above leaves
// undici's connection pool open, and exiting through it aborts the process on Windows —
// `Assertion failed: !(handle->flags & UV_HANDLE_CLOSING)`, which was observed on this gate
// and measured returning 127 on its sibling. An abort's status is not the 1 the gate meant.
const EXPECTED = ROUTES.length * VIEWPORTS.length * PHASES.length;
if (analyses !== EXPECTED) {
  console.error(`\ncheck-axe: ran ${analyses} of ${EXPECTED} analyses. Nothing may be skipped.\n`);
  process.exitCode = 1;
}

if (total > 0) {
  console.error(`\ncheck-axe: ${total} problem(s). WCAG 2.2 AA is the floor, not a target.\n`);
  process.exitCode = 1;
}

if (!process.exitCode) {
  console.log(
    `\ncheck-axe: ${analyses} analyses — ${ROUTES.length} routes × ` +
      `${VIEWPORTS.map((v) => v.label).join('/')} × ${PHASES.map((p) => p.label).join('/')} — ` +
      `zero violations (${TAGS.join(', ')})`,
  );
  console.log('check-axe: no duplicate ids, no radio or exclusive-details group spanning theme frames');
  // The count comes from the same predicate the browser branched on (`route.themed !== false`),
  // not from the pages themselves — a themed route either reports a skip-link problem or
  // verified all four assertions, so there is no third outcome for this line to hide.
  console.log(
    `check-axe: ${linkedFrom.size} distinct same-origin link target(s) across ${ROUTES.length} routes — every one resolves`,
  );
  console.log(
    `check-axe: no Consent Mode signal was queued in dataLayer on any of ` +
      `${ROUTES.filter((r) => r.themed !== false).length} themed route(s) × ${VIEWPORTS.length} ` +
      'viewport(s) — there are no consent categories to signal (round 10). This is the STATE of ' +
      'the site, which the storage and request assertions below do not cover',
  );
  console.log(
    `check-axe: lead validation — a valid payload is accepted and ${REJECTED.length} malformed ` +
      'boundaries are refused without writing to the database; check:lead-security owns the ' +
      'server-only insert assertions',
  );
  console.log(
    `check-axe: lead notification — asserted "${notifyBranch}". ` +
      'A "sent" proves the pipeline composes and is accepted, NOT deliverability: development ' +
      "sends from Resend's shared onboarding@resend.dev, which only delivers to the account " +
      'owner. gridsmith.uk is unverified until deployment, when the SPF include must be MERGED ' +
      'into the existing record — a second record is a permerror and breaks the live mail',
  );
  console.log(
    'check-axe: cookie-notice path — the notice is present with no category control and one ' +
      'button; acknowledging it contacts no analytics host and leaves exactly gs_consent with ' +
      'empty local/session storage; it stays dismissed on reload; and a pre-round-10 cookie ' +
      'granting analytics_storage is neither re-prompted, rewritten, nor acted on',
  );
  console.log(
    'check-axe: zero cookies set and zero requests to ' +
      `${ANALYTICS_HOSTS.length} analytics host(s) across every route load with no ` +
      'interaction — nothing stored and nothing injected before consent (PECR, PROJECT-RULES §6)',
  );
  console.log(
    `check-axe: ${SSR_CRASH} still serves the characterised crash shell ` +
      '(500, __next_error__, no lang/h1/main) — a KNOWN Level A gap, M-P1-1, not an approval',
  );
  console.log(
    `check-axe: skip link verified on ${ROUTES.filter((r) => r.themed !== false).length} themed route(s) ` +
      `× ${VIEWPORTS.length} viewport(s) — first focusable, target present, focusable, on screen when focused`,
  );
  console.log(
    `check-axe: ${tokenCount}+ tokens probed for a computed value on every route ` +
      `(${TOKEN_NAMES.base.length} base + the division's own); ` +
      `${incompleteAllowed} axe incomplete(s) allowed, 0 unresolved`,
  );
  for (const a of allowedSeen) {
    console.log(
      `\n  ALLOWED INCOMPLETE — ${a.rule} on ` +
        `${a.target !== undefined ? `"${a.target}"` : `/${a.targetPattern.source}/`} ` +
        `at ${a.routes.join(', ')}\n    ${a.why}`,
    );
  }
  console.log('');
}
