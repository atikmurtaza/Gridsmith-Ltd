# Accessibility Statement — DRAFT for review

> **[SEED - SOLICITOR REVIEW REQUIRED]**
> This is a draft prepared for a qualified UK solicitor to review, amend and adopt. It is not legal
> advice and must not be published unreviewed. `legalDocument.solicitorApproved` gates publication.

**Version:** 1.2 · **Last tested:** `[TK]` · **Status: DRAFT**

**Revision 1.2, 26 August 2026 — round 7.** One correction, in §4.3: the count of legal pages outside
the automated audit. **§3's evidence figures were re-verified against the gates and are unchanged** —
36 contrast pairs / 148 cells (`check-contrast.mjs:45-46`) and 15 axe routes, 11 public and 4
internal, at 2 viewports × 2 scroll states (`check-axe.mjs`). The client-terms route split added two
legal pages to the site and **no route to `check-axe.mjs`**, so it did not move §3's count; it moved
§4.3's. Nothing here claims screen-reader testing, because it still has not happened.

**Revised 25 August 2026.** Version 1.0 described testing that has not happened and features that do
not exist. Under `L-CRA-50` a written statement about the service becomes a term of a consumer
contract, and under `L-WCAG-22` an unearned conformance claim is a statement about the service that a
consumer may rely on. Every claim below is either evidenced or removed.

---

## 1. Our commitment
<!-- L-EQA-29 -->
<!-- L-EQA-20 -->

Gridsmith Ltd is committed to making gridsmith.uk usable by as many people as possible, including
people using screen readers, keyboard-only navigation, magnification, or reduced-motion settings.

We treat accessibility as part of building the site properly, not as an adjustment made afterwards.

Under the **Equality Act 2010 s. 29** we must not discriminate in providing a service to the public,
and under **s. 20 with Schedule 2** we owe a duty to make reasonable adjustments. That duty is
**anticipatory**: Sch. 2 para. 2(2) means it is owed to disabled people generally, not only to someone
who asks. We are not entitled to charge anyone for the cost of complying with it.
<!-- L-EQA-20 — s. 20(7): no charging for adjustments. Sch. 2 para. 2(2): the services duty is
anticipatory. -->

## 2. Conformance status
<!-- L-WCAG-22 -->

**What WCAG's status actually is here, stated precisely because it is easy to get wrong.** WCAG 2.2 is
a **W3C Recommendation** — a technical specification, not law. It is not a statutory standard for a
private-sector service in the United Kingdom: the Public Sector Bodies (Websites and Mobile
Applications) (No. 2) Accessibility Regulations 2018 bind public sector bodies, and **Gridsmith Ltd is
not one**. Our legal duty is the Equality Act duty at §1. **WCAG 2.2 Level AA is the standard we have
adopted** as the benchmark by which reasonable steps are conventionally evidenced — a voluntary
commitment whose value is evidential.

**Status: `[TK]` — and it cannot honestly be stated as "conformant" today.**

`[TK — the reason, stated plainly: WCAG 2.2 Level AA conformance requires that all Level A and Level AA
success criteria are satisfied. Automated tooling cannot establish that. The screen-reader pass has
never happened (§6), and six of our seven legal pages are outside the automated audit (§4). A claim of
AA conformance made on this evidence would be unearned. The choices are set out below.]`

> **[DECISION REQUIRED] — what to publish as the conformance status.** Options:
> **(a)** *"Partially conformant with WCAG 2.2 Level AA"*, with §4's known limitations listed and
> dated. Honest today, and the only option available without new testing.
> **(b)** *"Conformant"* — **not available**: it would be a false statement about the service under
> `L-CRA-50`, and for a consumer it engages the DMCCA 2024 misleading-action provisions
> (`L-DMCC-230`'s sibling s. 226).
> **(c)** Do the screen-reader pass and the outstanding route coverage first, then state the status the
> evidence supports. This is the only route to (a) becoming something stronger.
> Consequence of (a): the statement names its own gaps, which is more credible than a claim of
> perfection and is also the position the evidence supports.

## 3. What we have done — and what is evidenced
<!-- L-EQA-20 -->

**Automatically tested on every code change, blocking merge** (`package.json`, all gates blocking):

- **axe-core** across **15 routes — 11 public pages plus 4 internal test-harness routes** — at
  **2 viewports (375px and 1280px) × 2 scroll states (initial and scrolled)**, 60 analyses in all,
  plus link resolution, computed theme and skip link
<!-- Corrected 26 Aug 2026. The previous "14 routes × 3 viewports × 2 consent phases" was wrong in
three ways: the route count, the viewport count, and the description of the second axis, which is
scroll position and not consent. Counted from scripts/check-axe.mjs — ROUTES (15 entries, of which
/_kitchen-sink, /_master-sink, /_gridsmith-404-probe and /gridsmith-error-probe are internal),
VIEWPORTS (2) and PHASES (2); the gate itself asserts ROUTES × VIEWPORTS × PHASES analyses at
check-axe.mjs:1081. Consent state IS asserted, but as a separate per-route check, not as an axis. -->
- **Contrast**: 36 token pairs across 148 cells over four themes, checked against WCAG ratios
<!-- Corrected 26 Aug 2026 from EXPECTED_PAIRS / EXPECTED_CELLS at scripts/check-contrast.mjs:45-46,
which the gate hard-fails against. The published figures were 29 and 101. -->

- **Heading structure**
- **Responsive behaviour** at 375 / 768 / 1440, including WCAG 2.2 target size and focus-not-obscured
- **Theme flash and token loading**
- **Lighthouse** on two axes — desktop category scores, and mobile LCP / CLS / TBT under 4G throttling

**Design decisions that are true of the build:**

- Semantic HTML — real headings, lists, tables, buttons and links
- A visible focus indicator on every interactive element, verified by the automated focus checks
- Motion limited to opacity and transform, and disabled entirely when `prefers-reduced-motion` is set
- Colours are declared as tokens and never hardcoded; CI blocks a hardcoded colour

**Claims removed at revision 1.1, each because the thing described does not exist:**

- *"Data tables (the drawing matrix, the publishing packages comparison) built as real tables"* —
  neither the drawing matrix nor the packages comparison is built (`01-FACTUAL-INVENTORY.md` §7).
- *"All interactive tools — the project estimator, the drawing estimator, the publishing path finder —
  … with progress and results announced to assistive technology"* — **none of the three tools exists**,
  and announcement is precisely what no automated gate can verify.
- *"Meaningful alternative text on all images"* — not asserted as a blanket claim; axe detects a
  missing `alt`, not a meaningless one.
- *"Pricing and key information readable without JavaScript"* — not verified by any gate.
- *"plus manual keyboard and screen reader testing before release"* — **see §6. It has not happened.**

## 4. Known limitations
<!-- L-EQA-20 -->
<!-- L-WCAG-22 -->

Stated because a statement that names its gaps is worth more than one that claims perfection.

1. **No screen-reader testing has been carried out.** See §6. Announcement, reading order as spoken,
   and the consent banner's behaviour under a screen reader are untested by anyone.
2. **No assistive-technology testing of any other kind** — no magnifier, voice control or switch
   testing has been done.
3. **Six of our seven legal pages are outside the automated audit.** The automated audit covers
   `/legal/privacy` and no other legal page. It does **not** cover `/legal/cookies`, `/legal/terms`,
   `/legal/client-terms`, `/legal/business-client-terms`, `/legal/consumer-client-terms` or
   `/legal/accessibility` — including this page. `[TK — adding the six routes to the audit is a small
   change and should be done before this statement is published, so that the coverage claimed in §3 is
   the coverage that exists. OQ-18.]`
<!-- Corrected 26 Aug 2026, round 7. The lead sentence said "four of our five legal pages" while the
list beneath it named six routes — the sentence was written against the five-slug era and the list was
updated when the client-terms routes were split, leaving the two inconsistent. Counted from
lib/legal/slugs.ts, which declares SEVEN slugs: privacy, cookies, terms, client-terms,
business-client-terms, consumer-client-terms, accessibility. One is audited, six are not.
Note what the split did NOT change: check-axe.mjs's ROUTES contains /legal/privacy and no other legal
path, so adding two slugs to the site added two UNAUDITED pages and left §3's route count at 15. -->
4. **Interaction-to-Next-Paint is not measured.** It is a field metric and cannot be asserted in a lab
   run; we use Total Blocking Time as the proxy. Real INP has to come from field data we do not yet
   have.
5. `[TK — add anything found by the screen-reader pass when it happens, with a date for fixing it.]`

Candidates to assess if introduced later: third-party embedded content; complex data tables on very
small screens; PDF documents provided for download.

## 5. Feedback
<!-- L-EQA-20 -->

If you encounter a barrier, tell us: `[TK email]`.

Please include the page, what you were trying to do, and the assistive technology you were using.

> **[DECISION REQUIRED] — the response time published here.** Version 1.0 promised acknowledgement
> within **5 working days**. Options:
> **(a)** keep 5 working days;
> **(b)** align with the response commitment used everywhere else on the site — *"as soon as we can,
> and always by the end of the next business day"* — which is the single source of truth in
> `companyDetails.responseCommitment`;
> **(c)** state a different period here and accept two commitments in circulation.
> `CLAUDE.md` requires one source of truth for response commitments, so **(c) is inconsistent with the
> project's own rule**. Whatever is chosen must also match `PRIVACY-POLICY.md` §12 and
> `CONSUMER-TERMS.md` §12.

If you need information from this site in another format — large print, plain text, or read aloud —
ask and we will provide it. We will not charge you for it.
<!-- L-EQA-20 — s. 20(7): the provider is not entitled to require the disabled person to pay the costs
of complying with the duty. This sentence is the customer-facing statement of that. -->

## 6. Testing
<!-- L-EQA-20 -->
<!-- L-WCAG-22 -->

**Automated:** axe-core and the gates listed at §3, on every build, blocking merge.

**Manual keyboard testing:** `[TK — date, and by whom.]`

**Screen-reader testing: none. It has never been performed.**

This is stated plainly because the alternative is to imply it. `docs/_shared/05-HANDOVER.md:79` records
that it requires *"a human with NVDA or VoiceOver"* over the master pages and the consent banner, and
that **it never happened**; and that the automated gates *"cover focus order, target, paint, landmarks
and roles; they do not cover announcement, and no lab check does."*

- Last full manual test: **none**
- Next scheduled review: `[TK]`
- `[TK — when will the screen-reader pass happen, and who will do it? OQ-19. Until it does, §2 cannot
  say more than "partially conformant", and §3 cannot claim manual testing.]`

---

**`[TK]` items:** conformance status · contact email · manual keyboard test date and tester ·
screen-reader pass date and tester · next review date · the **six** uncovered legal routes · anything
the screen-reader pass finds.

**`[DECISION REQUIRED]` items:** the published conformance status (§2) · the feedback response time
(§5).
