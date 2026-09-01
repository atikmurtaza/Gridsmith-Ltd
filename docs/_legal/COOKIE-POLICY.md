# Cookie Policy — DRAFT for solicitor review

> **[SEED - SOLICITOR REVIEW REQUIRED]**
> This is a draft prepared for a qualified UK solicitor to review, amend and adopt. It is not legal
> advice and must not be published unreviewed. `legalDocument.solicitorApproved` gates publication.

**Version:** 1.3 · **Effective from:** `[TK]` · **Status: DRAFT**

Drafted against PECR 2003 **reg. 6 as substituted, and new Schedule A1 as inserted, by the Data (Use
and Access) Act 2025 s. 112 and Sch. 12 — in force 5 February 2026** (SI 2026/82 reg. 2).
<!-- L-DUAA-COMMENCEMENT -->
<!-- L-PECR-6 -->

**Revised 25 August 2026.** Version 1.0's cookie tables listed six cookies. **Five of them do not
exist.** The inventory observed the running site in all three consent states and found exactly one
cookie, no `localStorage` key and no `sessionStorage` key. An inaccurate cookie table is itself a
compliance failure, so the tables below now describe only what was observed.

**Revised 26 August 2026 — revision 1.3, and it is a change to the site, not only to this document.**
The owner has taken the decision left open at §4A and §4B: **the analytics scripts and all three
consent categories have been removed from the site.** They were loading on consent and never
initialising, so consent was being collected for two libraries that recorded nothing while every
accepting visitor's IP address and user-agent still reached Google and PostHog. There is now no
non-essential storage, no non-essential access and no third-party request in any state, so **there is
no consent to collect** and the banner has become a notice. `docs/_legal/03-REVISION-LOG.md` round 10
records the decision and its reasoning.

---

## 1. Our position
<!-- L-PECR-6 -->
<!-- L-PECR-6-CONSENT -->

We place **no non-essential cookie, script or tracking technology on your device at all** — not
before a choice, not after one, and there is no choice to make. This site makes **no third-party
request of any kind, in any state** — verified by reading the network log on the running site.

**We do not ask you to accept or reject cookies, because there is nothing to accept or reject.** What
appears at the foot of the page on your first visit is a notice, not a request: it tells you about the
single cookie described at §2 and offers one control, which dismisses it.
<!-- L-PECR-6 — reg. 6(1) bites on storing information in, or gaining access to information stored in,
terminal equipment. The only such storage is the Sch. A1 para. 4 cookie at §2, so no reg. 6(2) consent
is engaged. -->
<!-- L-PECR-6-CONSENT — the Accept/Reject parity requirement under UK GDPR Arts. 4(11) and 7(3) is not
engaged while no consent is sought, and the buttons it governed have been removed with the categories.
It becomes live again the moment any non-essential storage returns; the build task that would do that
(`docs/_shared/BEFORE-LAUNCH.md` §"Analytics") carries the requirement, and the banner's own source
comment records that the identically-treated Accept/Reject pair must come back with it. -->

## 2. Strictly necessary — no consent required
<!-- L-PECR-6 -->

| Cookie | Purpose | Duration | Party |
|---|---|---|---|
| `gs_consent` | Records that you have seen the cookie notice, so it is not shown again | 365 days | First-party |

That is the **complete** list. There is no session cookie and no CSRF cookie on this site — version 1.0
listed `__Host-session` and `csrf_token` and **neither exists**.

`gs_consent` is set with `Path=/`, `SameSite=Lax`, and `Secure` when the page is served over HTTPS. Its
value is the single character `1`. It carries no identifier, no timestamp and nothing about you.

This cookie is exempt from the consent requirement under **Schedule A1 paragraph 4** — it is strictly
necessary for the service you requested, because it is the thing that stops the notice appearing on
every page. It does not track you and it is not read by anyone else.

**If you visited before 26 August 2026** your browser may still hold a `gs_consent` whose value lists
the old category names, or the single character `0`. Those names now name nothing: no part of this site
reads the value, only whether the cookie is there. We deliberately **do not overwrite it** — it is your
own record of what you were shown — and it expires on its own within 12 months. Deleting it at any time
does no more than bring the notice back once.
<!-- L-PECR-6 — Sch. A1 para. 4 (strictly necessary for an information society service requested by
the user). -->

## 3. Functional — consent required
<!-- L-PECR-6 -->

**None, and no toggle either.** Version 1.0 listed `gs_design_track`; it does not exist. No functional
or preference cookie is set by this site in any state.

**The "Preferences" toggle (`functionality_storage`) has been removed at revision 1.3.** Version 1.2
recorded it as offered, defaulting to denied, and controlling nothing — which was accurate and was the
problem. A control that changes nothing is a representation to you about what you can control, so it
is gone rather than explained. The `[TK]` that stood here is closed by the decision at §4B.

## 4. Analytics — what actually happens
<!-- L-PECR-6 -->
<!-- L-GDPR-13 -->

**There is no analytics on this site.** Not disabled, not consent-gated, not awaiting an
identifier — removed. No Google Analytics, no PostHog, no product analytics, no heatmaps, no session
recording, no pixel of any kind. Nothing measures your visit.

| If you | What happens |
|---|---|
| arrive for the first time | No third-party request. No cookie until you dismiss the notice. |
| **dismiss the notice** | `gs_consent` is set (§2). No third-party request. |
| **do not dismiss it** | Nothing is stored. The notice stays; nothing else changes. |
| return later | No third-party request, in any state. |

**Why this changed, stated plainly rather than as a claim of virtue.** Until 26 August 2026 this site
loaded Google Analytics and PostHog when a visitor accepted, and **neither library was ever
initialised** — no configuration call existed, so no cookie was set, no event was recorded and no
identifier was created. But requesting a script sends your IP address and user-agent to the host that
serves it, as every HTTP request does. So the arrangement transmitted something about every accepting
visitor to two third parties and measured nothing in return. Version 1.2 recorded that as *"a defect
in the build, not a claim of virtue"*. The defect has been removed by deleting the scripts.

Version 1.0 listed `_ga`, `_ga_*` and `ph_*` cookies with 24-month and 12-month durations. **None of
them ever existed on this site**, and the code that could have created them is now gone too.

<!-- Rewritten 26 August 2026, revision 1.3, round 10. The previous text described a conditional
two-script injection on grant and is superseded by the removal, not corrected: lib/analytics/load.ts,
config.ts and posthog-region.ts are deleted and the three consent categories with them. PRIVACY-POLICY.md
§6A changes in the same commit and says the same thing; §2 and §4 of this document and that section
change together or not at all.
The measurement this rests on is 03-REVISION-LOG.md round 6 (local production build, both ids
confirmed present on the served page via `window.__gsAnalyticsConfigured`, all three states observed,
`gs_consent` the only cookie in any of them) plus the round 10 re-measurement in the same three states
after the removal. It was settled by loading the site, not by reading source, both times.
**If analytics is ever re-introduced, this section, PRIVACY-POLICY.md §6A and §2's cookie table are
rewritten in the same commit as the code** — at that point `_ga`, `_ga_*` and a PostHog identifier
begin to exist and every table here becomes an understatement. See docs/_shared/BEFORE-LAUNCH.md
§"Analytics" for the prerequisites, which are not optional. -->

## 4A. The 2026 statistical-purposes exception
<!-- L-PECR-6 -->

**REWRITTEN at revision 1.1.** Version 1.0 said the DUAA exemption was "narrow and untested" and
declined it in one paragraph. The exception is now in force and the regulator has published its
position on it, so the choice deserves to be made on the actual conditions.

**What the statute says.** PECR Sch. A1 **para. 5** permits storage or access **without consent** where
the sole purpose is collecting information for statistical purposes about how the service or website is
used, **with a view to making improvements to it**; the user must be given clear and comprehensive
information about the purpose and **"a simple means of objecting, free of charge"**; and para. 5(1)(c)
requires that the information collected **is not shared with anyone except to help make those
improvements**.

**What the regulator says** — *regulator guidance, not statute*. Information Commissioner's Office,
*Guidance on the use of storage and access technologies*, chapter **"What are the exceptions?"**,
retrieved from `ico.org.uk` on **25 August 2026**. Its published position, in its own words:

- The exception is *"essentially for analytics purposes"* but *"is not a broad exception that covers
  all types of analytics technologies or ways you can use them. It is about how your service is used,
  not about who uses it."*
- **A third-party analytics provider is permitted**: *"The exception recognises that you can: develop
  your own analytics solution; or use a third-party analytics provider."* But the provider *"can only:
  act on your behalf; and use the information to help you improve your service"*, and — importantly —
  *"To rely on the exception, your third party provider must be a processor, not a joint controller"*.
- The output must be aggregate: *"You must ensure that the information resulting from the storage or
  access is aggregate statistical information that you cannot use to identify people."*
- It **excludes**, and consent is required for: *"logs or recordings of individual visitors to your
  website and the actions they took"*; measuring advertisement performance; connecting a visitor ID to
  site activity; *"tracking or profiling individual visitors or categories of visitors (eg based on
  their IP address or the pages they visited)"*; and cross-service monitoring. It *"does not apply to
  purposes related to online advertising"*.
- On objection: *"You could provide it through your existing consent mechanism. For example, by having
  your 'statistical purposes' or 'appearance' toggles on by default, with the ability for users to
  change them to off at any time."* And if someone objects, *"you must stop storing or accessing
  information on their device"*. Browser settings alone are not a sufficient signal.

> **[DECISION REQUIRED] — consent, or the para. 5 exception, for analytics.**
> **(a) Keep requiring consent** (version 1.0's position). Consequence: analytics runs only for
> visitors who accept, so coverage is partial and skewed; and the day a library is initialised,
> Art. 7(1) demands we can **demonstrate** consent, which today we cannot — there is no consent
> record beyond a cookie in the visitor's own browser (see `PRIVACY-POLICY.md` §11A). Choosing (a)
> makes building `consent_events` a prerequisite.
> **(b) Rely on para. 5 for analytics.** Consequence: the toggle becomes objection rather than
> consent, and may default **on**; coverage becomes complete; the Art. 7(1) demonstrability problem
> disappears for this purpose. But it is only available if **every** one of the ICO's conditions
> holds: aggregate output only, no individual tracking or profiling, no advertising purpose, no
> session replay, the provider engaged as a **processor** and not a joint controller, and information
> plus a simple free objection given up front.
> **The specific facts that bear on (b) here:**
> - **PostHog session replay would defeat it outright** — the ICO names *"logs or recordings of
>   individual visitors"* as requiring consent. Replay must be off, and stay off.
> - **Google Analytics 4's controller/processor position is an account-settings question, not a code
>   question**, and it is unresolved (OQ-5). If Google is a joint controller for any Ads
>   data-sharing setting, the ICO's condition is not met for GA4.
> - **`ad_storage` cannot ride on para. 5 at all** — the exception *"does not apply to purposes
>   related to online advertising"*.
> **(c) Split them:** para. 5 for a strictly aggregate first-party measurement setup, consent for
> anything else. This is the position that matches the ICO guidance most closely, and it is the most
> work.
> **Whichever is chosen, note that today it is moot** — nothing collects anything (§4). The decision
> has to be made **before** the libraries are initialised, not after, because the banner's behaviour
> and this policy both change with it.

**[STILL OPEN, and deliberately deferred — 26 August 2026, revision 1.3.]** The owner's decision at
§4B removed the analytics libraries rather than choosing between (a), (b) and (c), so **this question
is not answered and must not be read as answered**. It becomes live again, and must be settled, before
any analytics is re-introduced — `docs/_shared/BEFORE-LAUNCH.md` §"Analytics" names it as a
prerequisite alongside `L-07` (a build-requirement id from `00-FOUNDATION.md`, not a
citation-ledger entry — `07-STATE-REPORT.md` F-12(b)). The options and the ICO's published conditions above are left exactly
as they were, and **the quotations in this section have not been touched**, so the solicitor sees what
was weighed rather than a summary of it.

## 4B. Toggles that control nothing
<!-- L-PECR-6-CONSENT -->

**NEW — added at revision 1.1.** The banner offers three toggles: **Analytics**
(`analytics_storage`), **Advertising** (`ad_storage`) and **Preferences**
(`functionality_storage`). **Only Analytics gates anything.** No code branches on the other two
(`01-FACTUAL-INVENTORY.md` §4.1). Nothing on this site sets an advertising cookie or a preference
cookie, so there is currently nothing for them to gate.

> **[DECISION REQUIRED] — the two inert toggles.** Options:
> **(a)** remove them from the banner until something needs them — the banner then offers one honest
> choice;
> **(b)** keep them and say plainly here that they currently control nothing;
> **(c)** keep them silently.
> Consequence of (c): offering a control that does nothing is itself a representation to the visitor
> and bears on whether consent is *informed* under Art. 4(11). Option (a) is the smallest change.
> Note `ad_storage` is declared partly because Google Consent Mode expects it — if the toggle is
> removed, the default-denied signal must still be sent.

> **[DECISION TAKEN] — 26 August 2026. Option (a), and it reached all three.** `ad_storage` and
> `functionality_storage` are removed from the banner and from the code. `analytics_storage` is
> removed with them, because the same reasoning had by then reached the third toggle: it gated two
> libraries that recorded nothing, so it too was a control that changed nothing a visitor would ever
> observe. The owner's reasoning, recorded as the basis: *"There is no traffic, so this costs zero
> measurement today, which makes keeping it pure liability with nothing on the other side."*
> **The Consent Mode default-denied signal noted above is not sent, and does not need to be.** That
> requirement exists so a Google tag reads `denied` before it runs. There is no Google tag: the
> injection is deleted. The signal was in any case being pushed in a shape Google's contract does not
> define — a plain array where a `gtag()` shim's `arguments` object is expected — and that is recorded
> as a defect to fix, and to prove by measurement, **before** any tag is initialised, not after
> (`docs/_shared/BEFORE-LAUNCH.md` §"Analytics").
> Changed in the same commit: `lib/consent/state.ts`, `components/consent/ConsentBanner.tsx`,
> `components/consent/ConsentReopen.tsx`, the deletion of `lib/analytics/{load,config,posthog-region}.ts`,
> `scripts/check-axe.mjs`, `scripts/seed-legal.mjs`, this document, `PRIVACY-POLICY.md` and
> `01-FACTUAL-INVENTORY.md`.

## 5. What we do not use
<!-- L-PECR-6 -->

- No advertising or retargeting cookies
- No cross-site tracking
- No social media pixels
- No fingerprinting
- No third-party consent platform — our banner is our own code, served from our own domain
- No third-party fonts. Our typefaces are served from our own servers; **no request is made to Google
  Fonts or any other font host** in any state.

## 6. Changing your mind
<!-- L-PECR-6-CONSENT -->

**There is nothing to change your mind about**, because nothing non-essential is set and no consent
was given. The **Cookie notice** link in the footer of any page brings the notice back if you want to
read it again; it stores nothing and switches nothing on or off.
<!-- L-PECR-6-CONSENT — Art. 7(3), withdrawal as easy as giving, is not engaged while no consent is
relied on for anything. The persistent footer control is retained anyway (components/consent/ConsentReopen.tsx,
rendered at Footer.tsx:77) so that the mechanism exists on the day it is needed again, and it is
relabelled from "Cookie preferences" to "Cookie notice" because there are no preferences to offer. If
any non-essential storage returns, this section reverts to a withdrawal control and the label with
it. -->

You can also block or delete cookies in your browser. Deleting `gs_consent` means the notice appears
once more; nothing else depends on it.

## 7. How we record your choice
<!-- L-PECR-CONSENT-EVIDENCE -->

**CORRECTED at revision 1.1.** Version 1.0 said we keep "a random consent identifier, your choice,
which categories you selected, and the version of this policy in force … for 24 months". **We keep no
such record.**

What exists is the `gs_consent` cookie in your own browser, holding the category names you granted, for
365 days. **There is no timestamp, no policy version, no identifier, and no record on our servers.** If
you delete the cookie, no record of your choice exists anywhere.

**Revised at revision 1.3.** The cookie now records only that the notice was seen, so there is no
"choice" to record: `gs_consent` holds the single character `1`. Cookies written before 26 August 2026
still hold the old category names and are not overwritten — see §2.

**Art. 7(1) is no longer engaged, and that is a consequence of §4 rather than a fix for it.** A
controller must be able to demonstrate consent where it *relies* on consent; this site now relies on
consent for nothing, because it does nothing that requires it. **This does not close the underlying
gap.** `[TK — the day anything non-essential returns, Art. 7(1) applies again and there is still no
server-side consent record. Building one (`L-07`, the `consent_events` table) is a prerequisite of
re-introducing analytics and not a follow-up to it: initialising first would engage PECR reg. 6's
higher penalty tier while leaving demonstrability unmet, which is a worse position than either today's
or version 1.2's. See `docs/_shared/BEFORE-LAUNCH.md` §"Analytics" and the decision at
`PRIVACY-POLICY.md` §11A.]`

## 8. Contact
<!-- L-ECOM-6 -->

`[TK email]` · Information Commissioner's Office: ico.org.uk

---

**Revision 1.3, 26 August 2026 — round 10.** The largest change since 1.0, and it is a change to the
site: **the analytics scripts and all three consent categories are removed.** §1, §2, §3, §4, §6 and
§7 are rewritten to describe a site with no non-essential storage and no consent request. §4A's
`[DECISION REQUIRED]` is explicitly **left open** and deferred to the day analytics returns, and
**its ICO quotations were not touched** — they remain the owner's to settle with the solicitor.
§4B's `[DECISION REQUIRED]` is answered with `[DECISION TAKEN]`, with the options left standing
beneath it.

**`[TK]` items:** effective date · contact email · the consent-evidence position on the day anything
non-essential returns (§7) · whether analytics runs on consent or on the para. 5 exception if it
returns (§4A). **Two `[TK]`s are closed by this revision:** the inert Preferences toggle (§3) and
"which analytics ids, if any, are set on the live platform environment" (§4) — no id has any effect
anywhere now, so the question no longer bears on what this document says.

**Standing instruction for whoever publishes this:** the tables in §2, §3 and §4 must be re-verified
against the running site immediately before publication, in every state the notice can be in. Version
1.0 was wrong about five of six cookies, and nothing in CI checks a cookie table against the browser —
though `check:axe` now asserts, in the browser, that the complete cookie list after dismissing the
notice is exactly `gs_consent` and that no analytics host is contacted in any state.
