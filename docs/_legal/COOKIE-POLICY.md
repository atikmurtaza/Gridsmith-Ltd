# Cookie Policy — DRAFT for solicitor review

> **[SEED - SOLICITOR REVIEW REQUIRED]**
> This is a draft prepared for a qualified UK solicitor to review, amend and adopt. It is not legal
> advice and must not be published unreviewed. `legalDocument.solicitorApproved` gates publication.

**Version:** 1.2 · **Effective from:** `[TK]` · **Status: DRAFT**

Drafted against PECR 2003 **reg. 6 as substituted, and new Schedule A1 as inserted, by the Data (Use
and Access) Act 2025 s. 112 and Sch. 12 — in force 5 February 2026** (SI 2026/82 reg. 2).
<!-- L-DUAA-COMMENCEMENT -->
<!-- L-PECR-6 -->

**Revised 25 August 2026.** Version 1.0's cookie tables listed six cookies. **Five of them do not
exist.** The inventory observed the running site in all three consent states and found exactly one
cookie, no `localStorage` key and no `sessionStorage` key. An inaccurate cookie table is itself a
compliance failure, so the tables below now describe only what was observed.

---

## 1. Our position
<!-- L-PECR-6 -->
<!-- L-PECR-6-CONSENT -->

We place **no non-essential cookie, script or tracking technology until you have made a choice**.
Before you choose, this site makes **no third-party request of any kind** — verified by reading the
network log on the running site.

Accepting and rejecting are equally easy. Both are one click, in identically sized buttons, side by
side. Rejecting does not reduce what you can do on this site.
<!-- L-PECR-6-CONSENT — UK GDPR Arts. 4(11) and 7(3). Parity verified: Accept and Reject share one CSS
class and one width (components/consent/ConsentBanner.tsx:176, 179). Every category defaults to denied.
Nothing is stored until a button is pressed. Withdrawal is a persistent footer control. -->

## 2. Strictly necessary — no consent required
<!-- L-PECR-6 -->

| Cookie | Purpose | Duration | Party |
|---|---|---|---|
| `gs_consent` | Records that you made a choice, and which categories you granted, so we do not ask again | 365 days | First-party |

That is the **complete** list. There is no session cookie and no CSRF cookie on this site — version 1.0
listed `__Host-session` and `csrf_token` and **neither exists**.

`gs_consent` is set with `Path=/`, `SameSite=Lax`, and `Secure` when the page is served over HTTPS. Its
value is the granted category names, or the single character `0` if you refused everything.

This cookie is exempt from the consent requirement under **Schedule A1 paragraph 4** — it is strictly
necessary for the service you requested, because it is the thing that stops the banner asking you
again. It does not track you and it is not read by anyone else.
<!-- L-PECR-6 — Sch. A1 para. 4 (strictly necessary for an information society service requested by
the user). -->

## 3. Functional — consent required
<!-- L-PECR-6 -->

**None. Version 1.0 listed `gs_design_track`; it does not exist.** No functional or preference cookie is
set by this site in any state.

The consent banner offers a **Preferences** toggle labelled "Preferences" (`functionality_storage`).
`[TK — no code branches on it. It is offered, defaults to denied, and controls nothing. See the
decision at §4B.]`

## 4. Analytics — what actually happens
<!-- L-PECR-6 -->
<!-- L-GDPR-13 -->

**No analytics cookie is set on this site, in any state.** Version 1.0 listed `_ga`, `_ga_*` and `ph_*`
with 24-month and 12-month durations. **None of them exists.** Observed on the running site
(`01-FACTUAL-INVENTORY.md` §1.3, §2.2):

| If you | What happens |
|---|---|
| have not chosen yet | No third-party request. No cookie at all. |
| **accept** | **Where a Google Analytics measurement id or a PostHog key is configured for the environment serving this site**, two scripts are requested — `googletagmanager.com/gtag/js` and `eu.i.posthog.com/static/array.js`. Requesting a script sends your IP address and user-agent to Google and PostHog, as every HTTP request does. **Where neither is configured, nothing is requested.** Either way, **neither library is then initialised**: no configuration call is ever made, so no cookie is set, no event is recorded and no identifier is created. |
| **reject** | No third-party request. No script injected. No cookie. |

So at the moment we ask for analytics consent and then collect nothing with it. That is a defect in
the build, not a claim of virtue, and it is recorded as such. This section must be rewritten the day
either library is initialised.

<!-- Corrected 26 August 2026, round 7, per 04-VERIFICATION-REPORT.md §2.12 and matching
PRIVACY-POLICY.md §6A word for word on the conditional. Each injection in lib/analytics/load.ts is
guarded on its own id; lib/analytics/config.ts defaults both to ''. The unconditional form described a
development environment and would have been wrong, in the visitor's favour, in any environment where
the ids are unset — including the live one, whose variables are not yet established.
The "neither library is initialised" half stays unconditional and is NOT to be softened. It was
settled by measurement, not by reading source: 03-REVISION-LOG.md round 6, local production build,
ids confirmed present on the served page via `window.__gsAnalyticsConfigured`, all three consent
states observed, `gs_consent` the only cookie in any of them. This section and PRIVACY-POLICY.md §6A
change together or not at all. -->
<!-- The `lib/analytics/load.ts` docstring that used to contradict this section — asserting GA4 had
"already set the cookie" — was corrected at round 6 after the measurement. §2's complete cookie list
and this section were confirmed right and were not changed. Do not reopen this from the source code. -->

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

Use the **Cookie preferences** link in the footer of any page. Changes take effect immediately.
Withdrawing consent stops further collection; it does not delete data already collected — for that,
see the Privacy Policy.
<!-- L-PECR-6-CONSENT — Art. 7(3): withdrawal must be as easy as giving. The footer control is
persistent and present on every page (components/consent/ConsentReopen.tsx, rendered at
Footer.tsx:77). -->

You can also block or delete cookies in your browser. Deleting `gs_consent` means we will ask you
again.

## 7. How we record your choice
<!-- L-PECR-CONSENT-EVIDENCE -->

**CORRECTED at revision 1.1.** Version 1.0 said we keep "a random consent identifier, your choice,
which categories you selected, and the version of this policy in force … for 24 months". **We keep no
such record.**

What exists is the `gs_consent` cookie in your own browser, holding the category names you granted, for
365 days. **There is no timestamp, no policy version, no identifier, and no record on our servers.** If
you delete the cookie, no record of your choice exists anywhere.

`[TK — this is the honest position and it does not satisfy Art. 7(1), which requires a controller
relying on consent to be able to demonstrate it. It is currently mitigated only by the fact that
nothing consent-gated collects anything (§4). See the decision at `PRIVACY-POLICY.md` §11A.]`

## 8. Contact
<!-- L-ECOM-6 -->

`[TK email]` · Information Commissioner's Office: ico.org.uk

---

**Revision 1.2, 26 August 2026 — round 7.** One change: **§4's two-script statement** was
unconditional when each script injection is conditional on its own environment variable, and is now
stated conditionally. Nothing else in this document was altered. §2 and §4's cookie claims were
confirmed by measurement at round 6 and stand unchanged, and **the ICO quotations at §4A were not
touched** — they are the owner's to settle with the solicitor and remain flagged exactly as they were.

**`[TK]` items:** effective date · contact email · whether the two inert toggles stay (§4B) · whether
analytics runs on consent or on the para. 5 exception (§4A) · the consent-evidence position (§7) ·
**which analytics ids, if any, are set on the live platform environment (§4) — no reading has ever
been taken from it; see `PRIVACY-POLICY.md` §6A**.

**Standing instruction for whoever publishes this:** the tables in §2, §3 and §4 must be re-verified
against the running site immediately before publication, in all three consent states. Version 1.0 was
wrong about five of six cookies, and nothing in CI checks a cookie table against the browser.
