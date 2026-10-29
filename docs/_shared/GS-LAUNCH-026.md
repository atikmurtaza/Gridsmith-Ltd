# GS-LAUNCH-026 — compliance, accessibility, reviews, analytics and legal revisions

28–29 October 2026 (Europe/London). **CONDITIONAL: the candidate is implemented and verified locally; the seven legal revisions await the owner's re-adoption; analytics and reviews are built and dormant; three motion changes await the owner's visual confirmation; nothing is deployed or published.**

Owner packet: [GS-LAUNCH-026-OWNER-REVIEW.md](GS-LAUNCH-026-OWNER-REVIEW.md). Structured results: [GS-LAUNCH-026-EVIDENCE.json](GS-LAUNCH-026-EVIDENCE.json). Revision set: [`docs/_legal/proposed/GS-LAUNCH-026/`](../_legal/proposed/GS-LAUNCH-026/PROPOSAL.json).

## 1. Source identity

- **Start:** `codex/gs-launch-023` at `a78166efa1ace69426fad710d1be49d7f5c2f8b9`, the accepted integrated source of the approved temporary preview (artifact identity `9f7e8e7f79fd11f2ab51486c81a888dc9b36ba5c0175a2b5fdb358943c7e3afe`). That preview is unchanged.
- **Work:** `codex/gs-launch-026` in `C:\Users\atikm\.codex\worktrees\gs-launch-026\Gridsmith Ltd`.
- **End:** the commit carrying this record, the head of `codex/gs-launch-026` at handover; draft PR [#4](https://github.com/atikmurtaza/Gridsmith-Ltd/pull/4) into `codex/gs-launch-023`, not `main`.
- Not modified: the primary checkout (dirty, `codex/gs-launch-001`) and the GS-LAUNCH-023/024/025 worktrees.

## 2. GS-LAUNCH-025 preserved

GS-LAUNCH-025's work was uncommitted in its own worktree. It was copied privately first (`task-evidence/gs-launch-026/gs-launch-025-preservation/`: tracked patch SHA-256 `748758f19ed5…`, per-file SHA-256 list, untracked copies), reviewed, and integrated **byte-identical** as `d0e6fab4`: the adoption and static selftests no longer freeze today's register, the production CMS migration validates legal payloads by exact canonical parity and `--read-production` checks legal content or required absence, and the retention procedure references Privacy 2.7. The 025 worktree was left as it was.

## 3. Legal cross-references

A draft writes `[visible words](target)` inside a paragraph or list item. The generator (`scripts/seed-legal.mjs`) turns it into a Portable Text link only for an allowlisted target — the seven `/legal/…` routes, `/contact`, `mailto:contact@gridsmith.uk` and `https://ico.org.uk/` — and **throws** on any other target, a link in a heading or table, a repeated target in one paragraph, malformed syntax or a document linking to itself. The renderer is the existing safe-href path (`components/content/Blocks.tsx`); the one external link opens in a new tab and says so to screen readers. Links never nest.

`check:legal:parity` (served) reduces link syntax to its words, ignores only the renderer's exact "(opens in a new tab)" suffix, and adds **branch E**: every served clause carries exactly the draft's links, words and target, and no others. The adopted texts contain no links, so the adopted generation is byte-identical before and after (`LEGAL_DOCUMENTS` JSON SHA-256 `2558fc21…`).

| Document | Links | Targets |
|---|---|---|
| Website Terms | 6 | Privacy, Cookie, Accessibility, Business and Consumer terms, email |
| Client Terms — which apply | 3 | Business and Consumer terms, email |
| Business Client Terms | 3 | Consumer terms, email ×2 |
| Consumer Client Terms | 5 | Business terms, Privacy ×2, email ×2 |
| Privacy Policy | 4 | Cookie ×2, ico.org.uk, email |
| Cookie Policy | 5 | Privacy ×4, email |
| Accessibility Statement | 3 | Contact page, email ×2 |
| **Total** | **29** | no self-links |

Four documents change **only** by links: `check:legal:adoption` proves each one word-identical, clause by clause, to its adopted text. Three change substantively (sections 9, 13 and 17).

## 4. Proposed versions and fingerprints

Not adopted, not PUBLISHABLE, not published. `PROPOSAL.json` binds each file to its hash and to the adoption it revises; the build refuses a set that does not.

| Document | Adopted | Proposed | Change | Proposed SHA-256 |
|---|---|---|---|---|
| Privacy Policy | 2.7 `822dd473…` | 2.8 | substantive | `f054f126665d51539574bf1a27c552f25a6e2dc99f6b92ebd93c738833dc2c8b` |
| Cookie Policy | 2.4 `e853438e…` | 2.5 | substantive | `9dbe02e24e4f03942912d3e8c400bb30bf2efe6cc99fba30a55827a2546d1d7c` |
| Accessibility Statement | 2.4 `774b1e20…` | 2.5 | substantive | `e7b7f71e34c44db2202c9f41c1a09073c46ef25e05f34127c1263750d7da211f` |
| Website Terms | 2.3 `e63d8cd2…` | 2.4 | links only | `5a89cec4ea564a64bbcc55f692cccb94f421011f86233b7e62916d2a0d977571` |
| Client Terms — which apply | 2.3 `008c0580…` | 2.4 | links only | `1aae31572444d6c543fddbab71b66138ffb06ba516d4d10d836835a474cdfa6a` |
| Business Client Terms | 3.3 `89f63c91…` | 3.4 | links only | `e7f1a7c1a1b64d66349aa4f3c806d4953ed739e5f36ceb6bd26724948168c0de` |
| Consumer Client Terms | 3.4 `a73f6df8…` | 3.5 | links only | `aeed75437292bd352ba86951061e4519fab44503881985249d56093d6b88488c` |

Consumer workflow 3.5: `278a41851a18ecc68c988ca3a1cc024efd0e7c8a557da63180dd79ba91178796`; the cancellation form is byte-identical. The owner-preview build displays the proposal, marked **"NOT YET ADOPTED"**, only when `GRIDSMITH_LEGAL_PROPOSAL` names it; every other profile serves the adopted texts.

**Independent review.** Two read-only reviewers (implementation-against-text, and UK law) checked the three substantive drafts before they were finalised. Their findings were verified against the code and the live libraries and applied: GA4 Enhanced measurement and PostHog heatmaps not switched off; PostHog session storage undisclosed; the Freelancer copy and "other internal files" statements inaccurate; statements of configuration made as if already done; IP receipt understated; circular PostHog retention; US adequacy misstated; consent-record basis implying records Gridsmith does not hold; and in the Accessibility Statement an unsupported "no failures", focus order claimed as tested, and the 2.2.2 gaps below. One point is left to the owner rather than changed: the adopted 2.7 sentence that applicable transfer arrangements are required before access begins (owner packet §2, point 7).

## 5. Accessibility audit coverage

`scripts/audit-wcag.mjs` against the static owner-preview candidate, Chrome (Puppeteer 25.14.0), axe-core 4.13.0 with the WCAG 2.0/2.1/2.2 A and AA tags: **all 61 routes** on 28 October, and all 61 routes again on 29 October after the motion and text changes.

| Check | How |
|---|---|
| Automated rules | axe at 1440, 768, 375 and 320 px with the notice closed, and at 1440 with it showing; the deferred Digital footer is revealed before analysis |
| Reflow (1.4.10) | 320 CSS px (≡ 400% of 1280): no horizontal scroll, nothing wider than the viewport |
| Text spacing (1.4.12) | WCAG's spacing values applied; clipped or overlapping text recorded |
| Target size (2.5.8) | every target under 24 px measured for the spacing exception, at 1440 and 375 |
| Keyboard (2.1.1, 2.1.2, 2.4.7, 2.4.11) | full Tab traversal at 1440 and 375: visible focus ring; focus **entirely** hidden by fixed or sticky elements; no trap |
| Structure (1.3.1, 2.4.1, 2.4.2, 3.1.1) | one `h1`, heading order, landmarks, skip link, unique titles, `lang` |
| Motion (2.2.2, 2.3.3) | running CSS animations with and without reduced motion, and whether the screen still changes 7 s after load (two screenshots; sees canvas and script motion too) |
| No JavaScript | content, `h1` and `main` present, no overflow |
| Consent UI | `check:consent` (section 17) |

The audit tool is not a CI gate; its report is evidence. **29 October, final candidate, 61 routes:** 4,221 keyboard stops with no missing focus ring, no focus entirely obscured, no trap; no reflow overflow at 320 px; no text-spacing clipping; no target under 24 px without spacing; one `h1`, landmarks, skip link, `en-GB` and a unique title on every route; content, `h1` and `main` without JavaScript; nothing running or changing under reduced motion. Still changing 7 s after load: `/design`, `/digital` and `/press` only, each now with a working pause control (verified by its scene gate, section 7). axe: two raw contrast flags, both position artefacts verified individually (section 7). The audit's Chrome has no WebGL, so `/` shows its static fallback there; the home sway is evidenced by `check:master:accessibility` (selftest and served, with WebGL).

## 6. WCAG 2.2 A/AA results

"Pass" means no failure was found by the checks named; it is not a conformance claim. "Manual" means the criterion needs human judgement or assistive technology that was not used.

| Criterion | Result | Basis |
|---|---|---|
| 1.1.1 Non-text content | Pass (automated); Manual for alt-text quality | axe; decorative-glyph classifier in `check:axe` |
| 1.2.1–1.2.5 Time-based media | Not applicable | no `<video>`, `<audio>` or `<iframe>` in any built page |
| 1.3.1 Info and relationships | Pass | axe; structure check |
| 1.3.2 Meaningful sequence | Manual | not reviewed by hand |
| 1.3.3 Sensory characteristics | Manual | — |
| 1.3.4 Orientation | Pass | no orientation lock in the source; portrait and landscape widths render |
| 1.3.5 Identify input purpose | Not applicable | no personal-data fields (no enquiry forms) |
| 1.4.1 Use of colour | Manual | — |
| 1.4.2 Audio control | Not applicable | no audio |
| 1.4.3 Contrast (minimum) | Pass | axe at four widths; undetermined nodes on `/`, `/design`, `/digital`, `/press` are pixel-measured by `check:master:scene`, `check:design:scene`, `check:digital:scene` and Press pixel contrast; the two raw axe flags are position artefacts (section 7) |
| 1.4.4 Resize text | Pass | 320 px reflow; text spacing |
| 1.4.5 Images of text | Manual | logo exempt |
| 1.4.10 Reflow | Pass | 61 routes at 320 px |
| 1.4.11 Non-text contrast | Pass for focus indicators (chrome accent measured); Manual otherwise | `check:contrast` |
| 1.4.12 Text spacing | Pass | 61 routes at 1440 and 375 |
| 1.4.13 Content on hover or focus | Pass | no content appears on hover or focus; the header menu opens on activation and closes with Escape |
| 2.1.1 Keyboard | Pass | traversal; consent request operated by keyboard |
| 2.1.2 No keyboard trap | Pass | traversal |
| 2.1.4 Character key shortcuts | Not applicable | only arrow keys inside the Tabs widget |
| 2.2.1 Timing adjustable | Not applicable | no time limits |
| 2.2.2 Pause, stop, hide | **Fixed**, then Pass | section 7: Master sway now rests within 4.5 s; Digital rings turn only beside a working Pause; Design has a Pause motion control; Press already had Pause the sequence; nothing moves under reduced motion |
| 2.3.1 Three flashes | Manual | no flashing content known |
| 2.4.1 Bypass blocks | Pass | skip link and landmarks on 61 routes |
| 2.4.2 Page titled | Pass | 61 unique titles |
| 2.4.3 Focus order | Manual | traversal recorded the order; its logic was not reviewed by hand |
| 2.4.4 Link purpose | Pass (automated); Manual | axe |
| 2.4.5 Multiple ways | Pass | header navigation and footer index on every page |
| 2.4.6 Headings and labels | Manual | structure present |
| 2.4.7 Focus visible | **Fixed**, then Pass | section 7 |
| 2.4.11 Focus not obscured (minimum) | Pass | traversal measures fixed/sticky overlap; consent bar reserves its height |
| 2.5.1 Pointer gestures | Pass | no multipoint or path gestures required |
| 2.5.2 Pointer cancellation | Pass | native links and buttons only |
| 2.5.3 Label in name | Manual | — |
| 2.5.4 Motion actuation | Not applicable | none |
| 2.5.7 Dragging movements | Not applicable | the only drag is in the review carousel, which is not shown and has rotate buttons |
| 2.5.8 Target size (minimum) | Pass | 61 routes at 1440 and 375; the consent text's inline "Cookie Policy" link is the inline exception |
| 3.1.1 Language of page | Pass | `en-GB` on 61 routes |
| 3.1.2 Language of parts | Manual | — |
| 3.2.1 On focus / 3.2.2 On input | Pass (consent UI scripted); Manual elsewhere | `check:consent` |
| 3.2.3 Consistent navigation / 3.2.4 Consistent identification | Pass | one shared header and footer |
| 3.2.6 Consistent help | Pass | contact links in the same footer position on every page |
| 3.3.1 / 3.3.3 / 3.3.4 Error identification, suggestion, prevention | Not applicable | no forms submitting data |
| 3.3.2 Labels or instructions | Pass | consent choices: fieldset, legend, labelled checkboxes |
| 3.3.7 Redundant entry / 3.3.8 Accessible authentication | Not applicable | no multi-step forms or sign-in |
| 4.1.2 Name, role, value | Pass (automated); Manual with AT | axe; `aria-expanded`/`aria-controls` on Customise |
| 4.1.3 Status messages | Pass | "Cookie preferences saved." in a `role="status"` region |

## 7. Accessibility issues fixed

1. **2.4.7 Focus visible, the 13 Design service pages.** The header and footer focus rule is `outline: 2px solid var(--chrome-accent)`; Design mapped the token to `--ds-gold`, which only the `/design` landing loads, so on every service page the outline computed to `none`. `styles/themes/chrome.css` now falls back to the theme's own `--accent` (the same gold). `check:axe` asserts the token resolves on every route; proven red on the pre-fix build. The 29 October audit records no missing focus ring on any route. Commit `186fa2b4`.
2. **2.2.2 Pause, Stop, Hide (Level A), three scenes.** Found by the independent review: the audit's first motion check read only CSS animations, which cannot see WebGL or script motion.
   - **Home:** the gold mark swayed for as long as the hero or close was on screen. It now sways for 3 s after the scene starts or the last scroll and eases onto the approved key pose by 4.5 s, then the render loop stops (`components/master/scene.ts`, +~80 B in the lazy chunk). `check:master:accessibility:selftest` asserts it rests on the exact still pose within 5 s of start and of a scroll; proven red by the pre-fix scene, a never-ending sway and a scroll that never re-arms.
   - **Digital:** the compass rings turned in every state and ignored Pause motion, which is hidden outside the Hero and Final demos. They now turn only while a demo plays, beside its control, and Pause stops them (CSS only); a visitor's Pause is kept across returns to the Hero. `check:digital:scene` `pauseStop()` plus three `--prove` faults.
   - **Design:** the wave and the animated mascot moved for as long as the story was on screen with no control. The hero now has a "Pause motion" text button that shows the approved static narrative (the Save-Data state); "Play motion" rebuilds the scene. `check:design:scene` `pauseControl()` measures pixels (the mascot moves inside an SVG image) with two `--prove` faults.
   All three are visible changes to owner-approved designs, made under the accessibility-first rule and raised in the owner packet §6.

Not failures, verified individually: axe's contrast flags on `/digital` at 320 px (the footer "Cookie notice" button, 9.01:1 when unobscured) and `/press` at 768 px (links scrolled beneath the sticky bar, 16.84:1 and 7.25:1) — re-checked with each node scrolled clear, axe reports nothing; Digital's full-stage chapter links and Press's visually hidden radio inputs, whose focus indicator is drawn on a child or label (the harness now measures there).

## 8. Manual accessibility testing still outstanding

Screen readers (NVDA, JAWS, VoiceOver, TalkBack); speech recognition and switch access; physical phones and tablets; forced-colour/high-contrast modes; browser zoom in real browsers (the audit emulates the equivalent viewport); testing with disabled users; human review of alt text, link purpose, headings, reading and focus order, sensory language and flashing (criteria marked Manual above). None was carried out; none is claimed.

## 9. Accessibility Statement 2.4 → 2.5

States what was tested in plain language and for which pages (every page of a pre-release version except error pages, in Chrome); keeps **not claiming full conformance**; records the two problems found and corrected; describes the pause mechanisms; lists the assistive-technology and manual reviews not yet done; links the contact routes. Review date 29 October 2026, next review by 29 April 2027. Its claims are only as true as the published build: it describes this candidate.

## 10. Freelancer reviews: permission

Freelancer's User Agreement §11 (last modified 5 June 2025) says feedback belongs to Freelancer and may not be used off the platform without its written permission. **No written permission is held** (owner, separately pursuing it). This task did not contact Freelancer and did not fetch review content; the only request was an HTTP status check of the public profile link (200).

**Finding for the owner:** this repository is public and already contains review copies — `lib/reviews/staging-approved.ts` (11 texts with star ratings, no names, since `9d2facae`) and `scripts/seed-content.mjs` (six texts with first names, one username and the type of work) — and the publicly readable development dataset holds six testimonial records built from that seed. Options A–C are in the owner packet §5. Nothing was deleted.

## 11. Review UI readiness and visibility

The accessible cylinder carousel is complete and **not visible anywhere**. `lib/reviews/source.ts` returns the frozen set only when `lib/reviews/activation.ts` records all four limbs: written permission (date and reference), a fresh check of the source profile, the owner's activation decision, and the SHA-256 of the exact review set the permission covers. The live record is all null, so the homepage section renders nothing — exactly as at `a78166ef`. `check:reviews:selftest` covers the live refusal (four codes), a synthetic complete record, and seven single-limb defects; the static build's existing review-suppression proofs are unchanged. The carousel already has rotate buttons and a pause control (2.2.2, 2.5.7) for when it is shown.

## 12. Reviewer masking and source link

A displayed review would show `******` in place of the reviewer's name (hidden from assistive technology; the accessible text is "Reviewer name withheld"), a fixed-length mask so no name length can be inferred. Each card links to `https://www.freelancer.com/u/GridsmithLTD`, opening in a new tab and announced as such. The link resolved (HTTP 200) on 28 October 2026; the activation record still requires its own dated re-check.

## 13. Privacy Policy 2.7 → 2.8

- **Recipients by category** (UK GDPR Art. 13(1)(e) permits categories): website and email hosting provider, content management provider, database and email delivery providers used for earlier enquiries, payment providers and our bank, our external accountant, delivery agencies; **freelancing platforms** added as independent-controller recipients. Names of any recipient on request. **Google and PostHog stay named**: a consent choice has to identify the third parties.
- **Hosting location**: "France" becomes "the European Economic Area".
- **Freelancer-held records**: no separate client database; platform records are copied only where the work or the law needs it (files to work on, briefs for agencies, payments in the accounts, the review copies); platform-held records follow the platform's rules. It does not say Gridsmith processes no personal data.
- **Review copies** described as they are today: 11 with text and ratings, six earlier copies with first names or a username, in the public repository and a publicly readable development dataset; future display only with permission, without names, linked, and after a policy update.
- **Optional analytics** (§5): applies only when a cookie request offers it; what each provider receives (IP address used for approximate location — GA4 does not store it, PostHog set to discard it — page addresses without queries or fragments, referrer, browser and device, a random identifier); page views only; data-processing terms and data-sharing settings settled before switching on; GA4 user- and event-level data deleted once two months old (aggregates longer); PostHog one year under its free plan; withdrawal in every open page; how to ask about records before withdrawing.
- **Cookie choices**: kept only in the visitor's `gs_consent` cookie; Gridsmith keeps dated versions of the request and policies, not individual choices (lawful-basis table and §8).
- **Transfers**: US adequacy covers only organisations certified under the UK Extension; Pakistan not covered; "required data protection test" (adopted wording) kept; content management added to the arrangements needing verification.
- Links to the Cookie Policy and ico.org.uk.

## 14. Provider and country disclosure decisions

| Item | Decision | Reason |
|---|---|---|
| Hostinger, Sanity, Supabase, Resend, PayPal/Stripe/Square, HSBC, Patel & Co. | Category | Art. 13(1)(e) allows "recipients or categories of recipients"; names available on request |
| Google, PostHog | Named | consent must identify the third parties that set or read the cookies (ICO, 29 April 2026) |
| WhatsApp, Freelancer.com | Named | the visitor or client chooses the service, which processes under its own terms |
| France | "European Economic Area" | the safeguard (UK adequacy) is the same for the whole EEA |
| United States, Pakistan | Kept | the safeguard explained depends on the destination; omitting them would hide material transfer information |

`check:legal:adoption` accepts a category in place of a provider name only where the category wording is specific (selftest specimens prove a vague replacement is refused).

## 15. GA4

Implemented, consent-gated, **dormant**: no identifier is configured, so every page builds as today's notice. With `NEXT_PUBLIC_GA4_MEASUREMENT_ID` set, `gtag.js` is fetched only after the visitor allows GA4 (Consent Mode v2 *basic*). The first commands are `consent default` with every signal denied, then `consent update` granting only `analytics_storage`; `ad_storage`, `ad_user_data` and `ad_personalization` stay denied; Google signals and ad personalisation off; page location and referrer sent **without query or fragment**; the site sends its own page views on client-side navigation (so Enhanced measurement is switched off in the property); cookies expire with the choice (`cookie_expires` = what the 180-day choice has left) and `cookie_update: false` stops renewal. Withdrawal sets `ga-disable-<id>`, sends a denied update and expires `_ga*`. The static build refuses a malformed identifier, one whose served policies do not describe GA4, and any identifier until the register records `ANALYTICS-READY` (proven red). Owner account steps: owner packet §4.

## 16. PostHog

Implemented the same way, **dormant**, EU Cloud only (`eu.i.posthog.com`, assets from `eu-assets.i.posthog.com`; posthog-js 1.441.2 measured). `array.js` loads only after the visitor allows PostHog. It starts **opted out by default with persistence off** and is opted in explicitly (no `$opt_in` event); its consent marker is a cookie. Without this, the library's own default (opted in when no marker exists) meant that `reset()` or our storage clean-up after an opt-out silently resumed capture in that page — found in the library source and fixed. Cookie persistence; cookie expiry from the choice's remaining time; `person_profiles: identified_only`; page views on history changes; autocapture, rage clicks, heatmaps, dead clicks, web vitals, exception capture, session recording, surveys, feature flags, campaign parameters, URL fragments, text and attribute capture and external dependency loading all off **by name**, so the project's remote settings cannot switch them on; URL-valued properties reduced to paths in `before_send`. Withdrawal opts out and removes PostHog's cookies and storage.

## 17. Cookie consent UI and behaviour

| | Notice mode (no identifiers; today) | Consent mode (identifiers configured) |
|---|---|---|
| Bar | unchanged text, one "Got it" | names the offered services; Accept all / Reject optional (same class, size and weight) / Customise |
| Choices | none — nothing to choose | one **unticked** checkbox per offered provider, with what it does and stores; Save preferences |
| Stored | `gs_consent=1` after Got it, 365 days | `gs_consent=v2:g<0/1/->:p<0/1/->:<unix time>`, **180 days** |
| Before a choice | nothing | nothing loaded, nothing stored |
| Footer | "Cookie notice" reopens it | "Cookie settings" reopens it with current choices ticked and focus inside |
| Re-ask | — | when the record does not cover the offered providers, or after 180 days |
| Other open tabs | — | follow a change at once (`BroadcastChannel`, which stores nothing) |
| No JavaScript | notice hidden | request hidden; nothing can run |

Earlier records (`1`, `0`, the round-10 category values, malformed or lapsed `v2`) are treated as no decision in consent mode and any leftover analytics cookies are removed. The consent bar stays a Server Component; the client behaviour is a small controller plus lazily loaded chunks, inside the shared-baseline budget (shared baseline 2.8 KB gz, consent banner 1.9 of 3 KB, Master lazy scene 7.4 of 8 KB, Design scene chunk unchanged at 7.9 KB; all 69 routes within their delta budgets).

**Consent record.** No server-side consent log: `PROJECT-RULES.md` §6's `consent_events` prerequisite and the same limb in `docs/_legal/compliance/ANALYTICS-ACTIVATION.md` are struck in place and registered (`check:struck` rule 22, 7 annotated lines). The ICO leaves the method to the controller; the owner instructed that no unnecessary data system be created; consent is shown by the Git-versioned request and policies and each visitor's own record. Owner to confirm (packet §2 point 6).

**CSP.** With identifiers configured, the build adds exactly the offered provider's hosts to `script-src`, `connect-src` and `img-src` (Next headers and the generated `.htaccess`); unconfigured output is byte-identical to before.

## 18. Network and privacy tests

| Run | Result |
|---|---|
| `check:consent`, notice mode, static candidate | PASS on the final candidate, 15 scenarios: seven fresh routes request and store nothing analytic; Got it, reload, footer reopen; legacy and empty stored values; mobile; reduced motion; no JS |
| `check:consent`, consent mode, stubbed providers | PASS, 26 scenarios: seven fresh routes; equal prominence; reject; accept + navigation across the studios; identifiers expiring no later than the choice; new session; customise each; keyboard withdrawal from the footer; **withdrawal in one tab stopping another open tab**; change one provider; seven legacy, malformed, partial and lapsed stored values; mobile 375; reduced motion; no JS |
| `prove:consent` | **7/7** probes red on their own branch — analytics before a choice, a pre-ticked box, GA4 ignoring withdrawal, cookies surviving withdrawal, PostHog ignoring withdrawal, a decision not reaching other tabs, identifiers outliving the decision — and the clean control green |
| `check:consent --live` (real `gtag.js` and `array.js`; collection blocked in the browser) | PASS, 26 scenarios, with PostHog genuinely sending: real cookies `_ga`, `_ga_<id>`, `ph_<key>_posthog`, `__ph_opt_in_out_<key>`; four `ph_` session-storage entries; nothing in local storage; no identifier outlives the 180-day choice. After withdrawal: 0 new collection requests in the same tab (2 retries of a pre-withdrawal batch, recorded apart) and 0 in another open tab; cookies and storage removed |

Nothing reached Google or PostHog in any run: stub mode answers every request in the browser, live mode aborts every collection request. Two live-mode findings about the test itself, both now handled in the gate: the real PostHog drops every event from automated headless Chrome as a bot (UA string, `userAgentData` brands and `navigator.webdriver`), so `--live` presents an ordinary browser; and because collection requests are aborted, PostHog retries each failed batch — including, after a withdrawal, a batch captured before it — so retries are recorded apart and only first attempts count as collection. The identifiers are syntactically valid test values belonging to no account, and that build is never deployed. CI runs notice mode against the static candidate and consent mode against its own throwaway build.

## 19. Legal and CMS migration readiness

Unchanged gates: seven OWNER_ADOPTED (the adopted 22–25 October texts), zero PUBLISHABLE; the production migration dry run reports 47 eligible and 10 gated (seven legal, three Technical) with no writes. If the owner adopts the GS-LAUNCH-026 set, a later task integrates it the way GS-LAUNCH-014 did (proposal files replace `current/`, the previous register is preserved, the register records the new authority and fingerprints); publication preparation and cutover remain separately authorised. No production Sanity write occurred.

## 20. Commits and draft PR

On `codex/gs-launch-026`, from `a78166ef`:

| Commit | Change |
|---|---|
| `d0e6fab4` | GS-LAUNCH-025 corrections, integrated byte-identical |
| `04b404d2` | legal cross-reference links; owner-preview proposal mode; parity branch E |
| `fa3006d4` | review display gated on a complete permission record; reviewer names masked |
| `186fa2b4` | 2.4.7 Design service focus ring; WCAG audit harness |
| `120f9a20` | the seven proposed legal texts, diffs and `PROPOSAL.json` |
| `adb08c0c` | consent-gated GA4 and PostHog, gates, proofs, CI steps, struck consent-log rule |
| `12207741` | `check:contrast` resolves the chrome fallback introduced in `186fa2b4` |
| `1ee4c101` | 2.2.2 fixes: home sway, Digital rings, Design pause control; their gates; audit harness |
| `62a71b45` | re-pinned, reviewed browser-input fingerprints for the changed workflows and `package.json` |
| (this commit) | this record, the owner packet, the evidence file and the control-file pointers |

Draft PR [#4](https://github.com/atikmurtaza/Gridsmith-Ltd/pull/4), `codex/gs-launch-026` → `codex/gs-launch-023`. Not merged; no auto-merge; nothing dispatched.

## 21. CI

- Push of `1ee4c101` (run 40805835277): **failed at its first step**, `browser-input.selftest` — `INSTALL_WORKFLOW_CHANGED`: the guard pins the workflows and `package.json`, which this task changed. The other failing steps (Lighthouse summaries, dependency audit) ran after it under `if: always()`. Fixed by reviewed re-pinning in `62a71b45`.
- CI for the final head was **running at handover**. Its exact-SHA result is the arbiter and must be read from PR #4 (and recorded by the next task) before the owner is asked to approve any artifact. No result is claimed here.

## 22. Owner-review release readiness

**Local candidate: ready for the owner's review; publication to the temporary preview: awaiting exact owner approval.** Locally verified: `verify:static` PASS; clean `verify:build` PASS (all size budgets); `verify:served` 20 of 21 PASS with `check:axe` re-run PASS after its allowlist fix (Lighthouse skipped on Windows, CI runs it); the consent suite (stub, 7 proofs, live); the static owner-preview build with `check:static:artifact` PASS (61 routes, 213 files), served legal parity PASS (7 documents, 110 clauses, 430 paragraphs, 29 cross-references) and notice-mode consent PASS; the full WCAG audit. The CI-built artifact from the exact head is the candidate the owner would approve; its identity comes from that run (section 21), not from this local build. Not published anywhere.

## 23. Genuine remaining blockers

1. **Owner re-adoption** of the seven GS-LAUNCH-026 texts (or a decision to keep the adopted ones), after deciding the review-copy option (A/B/C), which changes Privacy §2A if A or B comes first.
2. **Owner visual confirmation** of the three motion changes (home, Digital, Design), or a request for an alternative that still meets 2.2.2.
3. **Publication authority** for all seven at gridsmith.uk cutover (unchanged; with DIRECT-CONTACT-VERIFIED and the other recorded prerequisites).
4. **Freelancer written permission** before any review is shown.
5. **Analytics accounts** configured and `ANALYTICS-READY` recorded before identifiers are set (only if analytics is to run at launch).
6. A new, artifact-specific owner approval before this candidate replaces the temporary preview.

Recorded, not blocking: three deliberate-failure proofs in the scene suites are inert on the current build **independently of this task's changes** — Digital `prove:digital:scene` "map timing" (its 1.5 s label delay no longer delays the map's completion: ~300 ms complete with or without the old ring behaviour restored), Design `prove:design:scene` "G2 removed-surface" (no failure with the new button shown or hidden; the run stops there, so the Design proofs after it did not run), and Master `prove:master:scene` "s4r" (found by the mapping review). These suites are not in CI. Re-pointing them is a separate task.

## 24. Minimum owner actions

1. Decide A, B or C for the public review copies (owner packet §5).
2. Confirm or query the three motion changes (packet §6).
3. Review the candidate and reply with the adoption wording in the packet §2 — or ask for changes.
4. When ready: approve publication of the exact CI artifact to the temporary preview, after confirming auto-deployment is still OFF that day.
5. Only when analytics should run: the account steps in the packet §4.

## 25. Recommended next launch task

**GS-LAUNCH-027 — integrate the owner's GS-LAUNCH-026 decisions:** on the owner's adoption reply, replace `docs/_legal/current/` with the exact proposed files and record the new adoption in the GS-O003-R register (as GS-LAUNCH-014 did); apply the chosen review-copy option (adjusting Privacy §2A before adoption if A or B comes first); record the owner's answer on the three motion changes; then, with the owner's artifact-specific approval and a same-day auto-deploy-OFF check, publish the exact CI artifact to the temporary preview. Publication at gridsmith.uk, analytics identifiers and reviews each stay behind their own recorded authority.

## Not performed

No deployment, publication dispatch, Hostinger change, DNS, mail, WordPress or gridsmith.uk change; no production Sanity or Supabase write; no adoption or PUBLISHABLE state set; no contact with Freelancer, Google, PostHog or any support team, and no message drafted to them; no customer data read; no analytics account created; no review content fetched; nothing deleted.
