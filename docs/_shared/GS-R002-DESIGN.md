# GS-R002 — Gridsmith Design

19 September 2026. Implementation and staging review candidate. Production release is not authorised.

## Reconstruction and authority

Started from clean `staging/gs-r001-m-master-redesign`, `eda5f3aeeae0d55f41e0eca65ddce5e1e12e880f`.
The reported R1 implementation `555cbf1d` is its predecessor. Remote refs independently matched:
accepted staging `eda5f3ae`, main `fbecbe01e7fb594c6163dab57514997cb248fc21`.
Both predecessor CI runs were verified successful: `35399627164`, `35397951081`.
New branch: `staging/gs-r002-design`; no main fast-forward is authorised by Master acceptance.

Read CLAUDE, programme protocol/status/handoff/owner register, service architecture, Design
rules/PRD/flow/design, GS-P00 onward reconciliation and GS-R001/R/M/R1 evidence before implementation.
Historical amber, split-track, pricing, portfolio and restricted animation requirements are superseded
only to the extent expressly authorised by the GS-R002 brief. Security and production gates remain.

**GS-O008: APPROVED**, by the owner in this phase's brief. The R1 Master animation, dark/gold
language, narrative, typography and composition are accepted as the current Master direction.
Minor Master refinements are deferred to final cross-division comparison/polish. This is not
acceptance of all future division redesigns. **GS-O020: CLOSED — PUBLISH** remains unchanged.
No Master homepage implementation or Master-stage token file is changed.

## Approved family colour architecture

Master: warm near-black and existing metallic gold. Master owns gold; divisions borrow gold.
Design: deep navy/cobalt plus the exact Master gold. Digital's future direction: deep teal plus
Gridsmith gold. Press's future direction: **#426953** and complementary green derivatives plus
Gridsmith gold. Digital and Press are frozen in implementation this phase.

Design environment: night `#071426`, navy `#163A70`, cobalt `#3268B2`, light paper `#F4F1E9`.
Night ink `#F4F1E9`, muted `#B8C6D8`, subtle `#9DADC2`; raised night `#10233B`.
Paper ink `#163052`, muted `#425874`. Blue highlight `#9ABCE4` is material/construction linework.
Inherited material: gold `#E0BD70`, highlight `#FFF3B9`, mid `#A17C36`, deep `#5C421C`.
These are the existing Master-stage values, transcribed from the supplied logo. No Design gold.
Gold marks resolution, a small number of character/technical nodes and the quote CTA. It is never
small text on paper. Cobalt is material/linework, not small text on navy.

The shared footer switcher's legacy family swatches remain unchanged across the frozen themes;
their eventual cross-division reconciliation is explicitly deferred, not a new palette decision.

## Capability evidence and GS-O019

Read-only live research on 19 September 2026: `https://madalphadesigners.com/index.php`,
`https://madalphadesigners.com/packages.php`, `https://madalphadesigners.com/portfolio.php`.
The homepage and packages page visibly name the capabilities below. Portfolio yielded no useful
capability text and no portfolio assets were copied. The web search tool returned no usable result;
the evidence below was obtained by direct HTTP and rendered browser reads of the owner's site.

| Capability | Existing source/CMS position | Classification and decision |
|---|---|---|
| Identity, naming support, logo, guidelines | Brand Identity Systems | Accurately represented; retain |
| Graphic/print/digital collateral and reports | Graphic Design & Collateral | Accurately represented; retain |
| Packaging, campaign/social, presentation | Three existing Brand & Visual records | Accurately represented; retain |
| Stream logo/identity | Gaming & Streamer Creative + Brand Identity Systems | Child deliverable; not a duplicate new service |
| Screens, alerts, panels, overlays | Gaming record's general stream-graphics set | Represented but vague; enumerate |
| Banners, cam screens/webcam frames, chat boxes | Live MAD Alpha labels; vague/absent in CMS | Evidenced missing child deliverables; enumerate |
| Emotes, subscriber badges | Existing emotes/badges row | Represented; clarify subscriber badges |
| Thumbnails | Existing owner-confirmed Gridsmith record | Retain existing authority; not attributed to new MAD Alpha research |
| Intro/outro, animated overlays/logos/banners/emotes | Generic Motion assets | Evidenced child deliverables; name in both scoped streamer delivery and Motion discipline |
| Digital/custom illustration, characters | Illustration | Accurately represented; character study demonstrates it |
| Iconography, infographics | Iconography & Infographics | Accurately represented |
| Technical illustration | Illustration + Technical Documentation | Intentional existing scope split, not an accidental duplicate |
| Motion graphics, 2D/3D animation | Motion Graphics + Animation | Accurately represented; no new parent service |
| 3D models, product/concept/presentation renders | 3D Modelling + Product Visualisation | Accurately represented; no engineering validation implied |
| CAD, drawings, schematics, manuals/spec-sheet layout | Three Technical records | Production-gated; retain professional-scope/PI controls |
| Standalone functioning UI/UX/web/game systems | Digital architecture | Belongs elsewhere; Design contributes visual craft |
| Book cover/interior craft | Press engagement, Design execution | Preserve ownership split |
| Campaign management, media placement | Master engagement | Design owns campaign creative only |
| Technical SEO; editorial/content SEO | Digital; Press | Belongs elsewhere |
| Prices, packages, discounts, guarantees, volume/turnaround claims | MAD Alpha commercial material | Rejected; no Gridsmith authority |
| Clients, testimonials, portfolio, contact/company identity | MAD Alpha material | Rejected; no reuse or public portfolio dependency |
| Architecture/engineering certification or professional sign-off | No approved evidence | Unsupported; never claimed |

**GS-O019: RESOLVED — capability detail.** The owner expressly authorises evidence-led expansion in
GS-R002. Two existing services gain explicit child deliverables; no commercial question is left
open for this scope. Associated-business portfolio permissions are neither requested nor inferred:
GS-D001 excludes those assets, so that historical question is unnecessary for this phase.

Canonical groups unchanged: Brand & Visual; Illustration; Motion; 3D & Visualisation; Technical.
Visitor-facing chapters: Brand / Visual (first group); Motion / Dimensional (middle three);
Technical Design (last group). Gaming's canonical owner remains Brand & Visual even though the
motion chapter links its relationship to illustration and animation.
Counts before/after: 5 Design groups; 16 Design records; 31 Design capability references (including
the intentionally separate technical-illustration scopes); programme 14 groups / 46 records /
81 capability references. The content source and regenerated owner review remain in agreement.
Design deliverable rows move from **70 to 72** (two parent records each move from four to five rows).
The scope remains **16 service records / 31 capability references** before and after.

| Canonical group | Service records | Final deliverable rows |
|---|---|---|
| Brand & Visual | Brand Identity Systems; Graphic Design & Collateral; Packaging Design; Campaign & Social Creative; Presentation Design; Gaming & Streamer Creative | 27 |
| Illustration | Illustration; Iconography & Infographics; Technical Illustration | 12 |
| Motion | Motion Graphics; 2D & 3D Animation | 9 |
| 3D & Visualisation | 3D Modelling; Product Visualisation | 8 |
| Technical | CAD Drafting; Engineering Drawings & Schematics; Technical Documentation & Manuals | 16 |

`scripts/update-design-deliverables.mjs` defaults to dry-run, targets exactly two development IDs,
checks provenance, and uses revision preconditions. Applied only to `spzu6y31/development`.

## From Line to Form — implementation

Original SVG studies, semantic server-rendered content, a lazy Design-only scroll controller and
CSS. No added dependency, canvas, Three.js, GSAP, WebGL or image/video payload. SVG earns its use
through editable vector construction, a shaded character and a diagrammatic building. The
illustrated shading is not described as an actual 3D renderer.

One surviving cubic path changes shape across five chapters. The original workspace uses
artboards, guides, rulers, anchors and a selected typographic form without copying a proprietary UI.
G/S construction resolves into the owner's exact mark geometry and inherited gold. The character
develops from sketch to clean line art, flat colour, shaded form and exposed rig. Its joints
interpolate into structural corners while the surviving path hands into exploded
building layers, assembly, drawing/dimension lines, a branched electrical route, a distinct dashed
water route and coordinated layers. The final canvas recalls mark, character, vector, building and
dimensional object before the contextual quote action.

The technical drawing is a deliberately simplified conceptual assembly. It specifies no loading,
member size, circuit rating, pipe diameter, certification or construction suitability. A visible
scope/insurance gate accompanies it. It is not sold as architectural or building-services design.

Desktop pointer response is restricted to the completed character and bounded to a few pixels /
degrees. Mobile uses deterministic scroll poses, no hover or device-orientation permission.
The G/S paths themselves interpolate into offset geometric frames before the gold mark resolves.
Native scrolling is never set by the renderer. Continuous values bypass React state. Frames run
only while interpolation settles; hidden/offscreen work stops. Listeners, observers, idle callbacks
and animation frames clean up. Reduced motion, save-data, low-memory and failed imports retain
five server-rendered static chapter studies and all content/links. Decorative SVG is aria-hidden.

Initial route delta budget remains **25KB gzip above the 100.2KB framework floor**. Lazy Design
controller budget **8KB gzip**. No global animation dependency. Existing Lighthouse Design mobile
LCP <=2000ms, TBT <=200ms, CLS <=0.05 and desktop performance >=0.95 remain unchanged.

## Verification and review

Implementation candidate for owner visual review. A green automated result is not owner acceptance.

- Static suite, lint, typecheck and clean production build: passed locally. The configured verification and CI lists both contain 49 leaf gates.
- General axe: 76 analyses (19 routes, two widths, initial/scrolled), zero violations and zero unresolved results. Existing Master/consent exceptions remain; Design SVG-overlap exceptions are restricted to text also measured by the rendered pixel gate and decorative diagram labels. The existing SSR error-shell Level A limitation (M-P1-1) remains characterised, not approved.
- General responsive: 51 combinations across 17 routes; no overflow. Company, legal, content/dataset parity, price-absence and security-header gates passed. Local header and review checks need their own base-URL variables when using a non-default server port; both were rerun against the actual server after connection-refused failures.
- Master: 11 viewports  x  six chapters plus the footer, all 11 scene questions; 14 hero sizes. Master, Digital, Press, shared chrome and dependency files have no implementation diff from the accepted staging parent.
- Design: 20 viewports  x  five chapters, plus line/flat/shaded/rig states, building layers, pointer response and closing resolution. Tests measure geometry, visible copy/art, actual path changes and rendered contrast under text. The 2% thin-line/antialiasing tolerance follows the Master pixel gate; it is not an aesthetic approval.
- Responsive sizes: 1280 x 720, 1366 x 768, 1440 x 900, 1536 x 864, 1600 x 900, 1920 x 1080, 2048 x 1152, 2560 x 1440; zoom-equivalent 1229 x 691, 1745 x 982, 2133 x 1200, 2400 x 1350, 2844 x 1600, 3200 x 1800; mobile 320 x 568, 360 x 800, 375 x 812, 390 x 844, 412 x 915, 430 x 932.
- Six browser-only faults proven red: CTA hidden, horizontal overflow, scene hidden, chapter removed, protagonist hidden, unreadable headline. Visual inspection also caught missing light-chapter fallback headings: the new fallback contrast check reproduced 1.00:1 before the inherited colour was corrected. A no-JavaScript specificity conflict also left paper chapters transparent; the noscript paper background now overrides the enhanced layout, and the fallback suite passes.
- Reduced-motion, no-JavaScript and save-data modes: five server-rendered studies, semantic headings and links, no overflow; each chapter's text is measured on desktop and mobile. Keyboard inspection confirms skip-first navigation and a visible 3px gold CTA outline.
- Bundle: 103.4KB total initial Design module scripts, **3.2KB route delta / 25KB budget**; **2.5KB lazy / 8KB budget**. Master 4.9KB delta and 5.9KB lazy. All 68 route budgets pass. No added dependencies.
- Secret scan: source, built chunks and served assets pass. The local service-role key is absent, so that value-specific check is unavailable; the structural checks and two other configured secret values were checked. No secret values were printed.
- Screenshots: local `node_modules/.cache/gs-r002-final-screens/`, five chapter images at every size, plus six fallback strips and desktop/mobile contact sheets. These were personally inspected; owner acceptance is still required.
- Lighthouse: intentionally unavailable locally on Windows due the existing Chrome cleanup fault. Full final-source verification and desktop/mobile Lighthouse are required on Ubuntu CI before handoff. Immutable CI/deployment results are attached to the staging commit on GitHub and reported in the session handoff; local green results are not substituted for those measurements.

[GS-R002 CI runs](https://github.com/atikmurtaza/Gridsmith-Ltd/actions?query=branch%3Astaging%2Fgs-r002-design). The branch is the staging delivery; no production deployment or main merge is part of this phase.

Production boundary: no production deploy, main push, production Sanity write, Supabase mutation,
GS-T004 application, Hostinger/DNS change or indexing activation is authorised. Hosted lead
submissions remain prohibited while Preview backend isolation is unproved (GS-O010).

Next phase: **GS-R002 owner visual review**, continued session. Owner action required. Requested
coding model for follow-up fixes: GPT-5.6 Sol, high reasoning. Do not begin another division.

## Independent live boundary verification

19 September 2026, read-only: exact Supabase project `dqiutgmxillhsbzgnlsx` (Gridsmith Project)
returned ACTIVE_HEALTHY. Its public migration ledger contains only `0001_core.sql`,
`0002_view_security_invoker.sql`, `0003_press_path_results.sql`; GS-T004 remains unapplied.
Unauthenticated Sanity `spzu6y31/production` count query returned HTTP 200, **0 documents**.
`https://gridsmith.uk` returned HTTP 200, `server: hcdn`, `platform: hostinger`, no Next asset
references; NS records remain `hermes.dns-parking.com` / `artemis.dns-parking.com`. No changes
were sent to these systems. These snapshots verify current state, not general production readiness.

## Dependency audit

Production dependencies: **0 findings**. Full graph: **27 affected development packages**
(12 high / 13 moderate / 2 low). No dependencies or lockfile changed in GS-R002.
`GS-R002-DEPENDENCY-AUDIT.md` records advisory identifiers, ranges, exact installed paths and
proposed upstream/root fixes. This is an unresolved tooling exposure, not a silently accepted
risk, a production dependency finding, or a reason to run force-fix during a Design implementation.

## Staging delivery

Current owner-review [Design Preview](https://gridsmith-ltd-git-staging-gs-r002-design-atikmurtazas-projects.vercel.app/design).
The branch alias follows the latest READY candidate; use its deployment metadata and the
[branch CI runs](https://github.com/atikmurtaza/Gridsmith-Ltd/actions?query=branch%3Astaging%2Fgs-r002-design)
to match the exact SHA. The immutable first implementation evidence below is retained for history.


Implementation commit: `405f34652df76c9f76394614e98997ee69dd5ea9`, pushed normally to
`staging/gs-r002-design`. Remote main was rechecked after the push and remains
`fbecbe01e7fb594c6163dab57514997cb248fc21`.

Implementation Preview: [Design](https://gridsmith-g2ixldwkm-atikmurtazas-projects.vercel.app/design),
Vercel deployment `dpl_DvkaE2xurDgrP77R2jo14HfXizeG`, READY, target null (Preview), exact
implementation SHA. Authenticated fetch returned HTTP 200, development dataset, five chapters,
16 Design service links and the technical-scope gate. The response carries `X-Robots-Tag: noindex`
and `robots=noindex, nofollow`. Unauthenticated access redirects to Vercel SSO (302).
No hosted form submission was made. The existing local axe notification probe ran as part of the
local programme checks; this is not evidence of hosted backend isolation or real intake readiness.

Final local Design sweep passed all 20 viewports plus detail, pointer, closing and three fallback
modes after the no-JavaScript paper-background fix. All six deliberate browser faults were caught.
The final clean build and source/bundle secret scan passed. No test budget or threshold was lowered.

### Owner review checklist

1. Hero and original creative workspace.
2. G/S construction into the Gridsmith identity.
3. Character construction and restrained pointer response.
4. Building assembly, drafting, electrical and water sequence.
5. Continuity and pacing between chapters.
6. Convergence and quote CTA.
7. Navy/cobalt and inherited gold palette.
8. Mobile composition and scroll behaviour.
9. Family relationship to the approved Master direction.

### First CI finding and remediation

Run [35461004185](https://github.com/atikmurtaza/Gridsmith-Ltd/actions/runs/35461004185)
on `405f3465` passed static/build/desktop Lighthouse but failed Design mobile LCP: median
2691ms, all three runs 2683-2703ms, against the unchanged 2000ms limit. Its LCP element was
`#gs-consent-heading`, the shared notice mounted after hydration. TBT was 77ms and CLS 0.
Desktop Design was performance 1.00, accessibility 1.00, best practices 0.96, LCP 575ms,
TBT 0ms and CLS 0. SEO 0.66 is expected for protected noindex staging.

Design's two-line headline is now one text block, with a stronger 18vw mobile scale (capped at
5rem; the short-screen size stays bounded). The scene is repositioned below the mobile copy.
The shared notice, its content, timing and accessibility behaviour are unchanged. This preserves
the large server-rendered headline as the main visible content. A local Lighthouse API diagnostic
with the same mobile/h2 settings reported the H1 as LCP, 1916ms, TBT 56ms and CLS 0; that single
local sample is diagnostic only, not a replacement for CI's three-run median.

The normal Windows LHCI launcher remains explicitly unavailable. The diagnostic used the installed
Lighthouse API with an externally managed Puppeteer browser, avoiding the launcher's cleanup race.
No CI configuration, performance budget, consent setting or scoring assertion was changed.
