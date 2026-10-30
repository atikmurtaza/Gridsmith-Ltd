# GS-LAUNCH-026 — owner review packet

28 October 2026. **What changed, what you can review, and the few decisions only you can make.** Full engineering record: [GS-LAUNCH-026.md](GS-LAUNCH-026.md). Structured results: [GS-LAUNCH-026-EVIDENCE.json](GS-LAUNCH-026-EVIDENCE.json).

Nothing here has been published, adopted or deployed. The approved temporary preview (`9f7e8e7f…`, source `a78166ef`) is unchanged and still live. WordPress, DNS, mail and gridsmith.uk are untouched.

## 1. What you will see in the new candidate

| Area | Change | Visible now? |
|---|---|---|
| Legal pages | All seven show the **proposed** revisions with a "NOT YET ADOPTED" notice. Cross-references are links: to the Privacy, Cookie and Accessibility documents, both sets of client terms, the contact page, the email address and the regulator's website. A page never links to itself | Yes |
| Keyboard focus | The header and footer focus outline, missing on the 13 Design service pages, is restored | Yes |
| Cookie notice | Same wording and single "Got it" button as today while no analytics identifier is configured | Yes (unchanged wording) |
| Cookie consent request | Ready but dormant: once GA4/PostHog identifiers are set, the notice becomes "Accept all / Reject optional / Customise", one unticked choice per provider, and the footer link becomes "Cookie settings" | No — needs your analytics accounts (section 4) |
| Freelancer reviews | The homepage review section is ready but renders nothing until written Freelancer permission and your separate approval are recorded. Reviewer names would be replaced by `******` | No — permission pending (section 5) |
| Everything else | No visual redesign. Service content, contact links and prices policy unchanged | — |

## 2. Decision: adopt the seven revised legal texts

**Why it is needed:** the revisions change the text you adopted on 22–25 October, so their fingerprints change. Earlier adoptions do not cover the new bytes.

Four documents change **only by links** — their words are proven identical, clause by clause, to what you adopted (`check:legal:adoption`). Three change substantively.

| Document | Adopted now | Proposed | Change | Proposed SHA-256 |
|---|---|---|---|---|
| Privacy Policy | 2.7 | 2.8 | Substantive: provider names → recipient categories; hosting country → "European Economic Area"; Freelancer platform records distinguished; optional GA4/PostHog described; links | see `PROPOSAL.json` |
| Cookie Policy | 2.4 | 2.5 | Substantive: GA4/PostHog by consent, cookie table, withdrawal, re-consent; links | see `PROPOSAL.json` |
| Accessibility Statement | 2.4 | 2.5 | Substantive: the WCAG 2.2 AA audit actually carried out, results, limits and outstanding manual checks; links | see `PROPOSAL.json` |
| Website Terms | 2.3 | 2.4 | Links only, words identical | see `PROPOSAL.json` |
| Client Terms — which apply | 2.3 | 2.4 | Links only, words identical | see `PROPOSAL.json` |
| Client Terms for Business Clients | 3.3 | 3.4 | Links only, words identical | see `PROPOSAL.json` |
| Client Terms for Consumers | 3.4 | 3.5 | Links only, words identical; cancellation form byte-identical; workflow relabelled 3.5 | see `PROPOSAL.json` |

Exact files, per-document diffs and fingerprints: `docs/_legal/proposed/GS-LAUNCH-026/` (`PROPOSAL.json` is authoritative for the hashes).

**Points to check while reading** (these are judgement calls made on your behalf):

1. **Provider names.** Recipients are now described by category (UK GDPR Art. 13(1)(e) allows categories). You must still be able to name any recipient on request; the policy says so. Google and PostHog stay named because a consent choice must identify the third parties (ICO guidance, 29 April 2026).
2. **Countries.** "France" is replaced by "the European Economic Area". The **United States** (Google analytics; some delivery agencies) and **Pakistan** (delivery agencies) remain named: the safeguard explained for each depends on where the data goes, so omitting them would hide material transfer information.
3. **Freelancer clients.** The policy says there is no separate client database, and that platform records are copied only where the work or the law needs it (files downloaded to work on, briefs shared with agencies, payments in the accounts, the review copies). It does not say Gridsmith processes no personal data. Freelancing platforms are added as recipients.
4. **Reviews copy — please decide before adopting (section 5).** Privacy 2.8 §2A describes the copies as they are **today**: 11 reviews with text and ratings, six earlier copies with first names or a username, held in the public repository and a publicly readable development dataset. If you choose option A or B in section 5 first, tell the agent and §2A is shortened before you adopt. Describing the copies accurately does not make their public exposure lawful; option B is recommended.
5. **Analytics is described conditionally.** Privacy §5 and Cookie §3 apply only once a cookie request offers analytics; the retention, settings and data-processing statements become true only after the account steps in section 4. The build refuses analytics identifiers until `ANALYTICS-READY` evidence is recorded.
6. **Consent records.** The policies say Gridsmith keeps no record of individual cookie choices (the choice lives in the visitor's own cookie) and keeps dated versions of the request and policies instead. This follows your instruction not to create unnecessary data systems. The earlier internal plan for a consent log (`docs/_legal/compliance/ANALYTICS-ACTIVATION.md`) is marked superseded; if you would rather keep a consent log, say so and it becomes a separate task.
7. **Transfers.** The United States is described accurately: UK adequacy covers only organisations certified under the UK Extension to the Data Privacy Framework. The existing sentence "We require the applicable arrangements before access begins" is unchanged from your adopted 2.7; please confirm it is true for the agencies you use today.

**Suggested reply — wording for you to adapt, not an approval already given:**

> I adopt the seven GS-LAUNCH-026 proposed texts with exactly the versions and SHA-256 fingerprints in `docs/_legal/proposed/GS-LAUNCH-026/PROPOSAL.json`. Adoption does not authorise publication, a production build, a CMS write, deployment or any gridsmith.uk, WordPress or DNS change.

Adoption is then integrated by a later task, exactly as GS-LAUNCH-014 did: the files replace `current/`, the previous register is preserved, and the register records your new authority.

## 3. Decision: publish the new candidate to the temporary preview?

The candidate passes local acceptance and, once its exact-SHA CI run succeeds, CI packages an immutable artifact. Publishing it replaces the approved preview, so it needs a **new, artifact-specific approval** naming the CI run and artifact identity recorded in [GS-LAUNCH-026.md](GS-LAUNCH-026.md) §20–22. Before any publish dispatch, confirm in hPanel **that day** that Git auto-deployment is OFF for the temporary site (GS-LAUNCH-024 lesson). Do not click Redeploy.

## 4. When you are ready to activate analytics (account steps — not urgent)

**PURPOSE:** give the site the two public identifiers and configure each account so the adopted policies are true.

**WHERE:** your Google Analytics account (analytics.google.com) and a PostHog **EU Cloud** account (eu.posthog.com). GitHub → repository settings → Secrets and variables → Actions → **Variables** for the identifiers.

**STEPS** (labels from each provider's own help pages; if a label differs, use the help page named):

1. GA4: create a property and a **Web** data stream for `https://gridsmith.uk`. Copy the **Measurement ID** (`G-…`).
2. GA4 web stream: turn **Enhanced measurement off** entirely (help topic "Enhanced measurement events"). The site sends its own page views, without query strings or fragments; leaving Enhanced measurement on would add scroll, outbound-click and download tracking the policies do not describe, and duplicate page views.
3. GA4 property settings (help topics "Data retention", "Data sharing settings", "Google signals", "Data processing terms"): event data retention **2 months**; **Reset user data on new activity off**; Google signals **off**; data-sharing settings **off**; accept the data processing terms.
4. PostHog: create a project on **EU Cloud**, on the **free plan** (its one-year event retention is what Privacy 2.8 states; a paid plan keeps data longer and the policy would have to change). Copy the **Project API key** (`phc_…`). In project settings turn on **Discard client IP data**, and leave session replay, heatmaps, surveys, autocapture and web vitals **off** (the site also switches them off in code). Review PostHog's DPA.
5. Only after Cookie 2.5 and Privacy 2.8 are adopted and published, and `ANALYTICS-READY` is recorded: add repository variables `NEXT_PUBLIC_GA4_MEASUREMENT_ID` and `NEXT_PUBLIC_POSTHOG_KEY`. The build refuses them otherwise.

**DO NOT:** enable Google Ads links, advertising features, session recording, or a US PostHog project. Do not paste passwords or any secret key — only the two public identifiers are needed.

**REPORT BACK:** "GA4 and PostHog configured on [date]: Enhanced measurement off, retention 2 months, reset on new activity off, signals off, sharing off, processing terms accepted; PostHog EU free plan, IP discarded, replay/heatmaps/surveys/autocapture off." The agent then records `ANALYTICS-READY`, rebuilds and re-measures the live behaviour.

## 5. Reviews: permission, and a copy already public

**Freelancer permission** (you are pursuing it): the agent did not contact Freelancer. For activation, the written permission must cover **display of review text and star ratings on gridsmith.uk**. The activation record (`lib/reviews/activation.ts`) also needs a fresh check of the profile `https://www.freelancer.com/u/GridsmithLTD`, your separate approval, and is bound to the exact review set. Until then the section renders nothing.

**Finding that needs your decision:** this GitHub repository is **public**, and it already contains copies of Freelancer feedback:

- `lib/reviews/staging-approved.ts` — the 11 frozen review texts with star ratings (since commit `9d2facae`, present on several public branches);
- `scripts/seed-content.mjs` — six review texts with reviewers' first names and one public username;
- the **development** content dataset, which is publicly readable, holds six testimonial records built from the same seed.

Freelancer's terms (§11) restrict off-platform use of feedback without written permission, and the reviewers' names are personal data. Removing the files from the newest branch would not remove them from history. The options are yours:

- **A.** Make the repository private. Note: Hostinger's Git deployment of the temporary site then needs repository access configured.
- **B.** Authorise a cleanup task: remove the copies from current branches and the six development testimonials, then decide separately whether to purge history.
- **C.** Accept the risk until Freelancer's reply.

The proposed Privacy 2.8 describes the copies as they are today (section 2, point 4). If you choose B, the agent can remove the copies from the current branch; deleting the six development testimonials is a step you take yourself in the content studio, because the agent does not permanently delete data.

## 6. Please confirm three visual changes made for accessibility

WCAG 2.2 success criterion 2.2.2 (Level A) requires a way to pause motion that starts on its own and lasts more than five seconds. Three approved scenes did not have one, so each was changed in the smallest way that meets it. Accessibility wins the conflict under the project rules; please confirm or ask for an alternative:

- **Home:** the slow sway of the gold mark now settles onto its approved pose about four seconds after the page loads or after you stop scrolling, instead of swaying for ever. No new controls.
- **Digital:** the compass rings now turn only during the opening and closing demonstrations, beside the existing Pause motion button, which now stops them too. Behind the Route Map, chapters and Process they stand still.
- **Design:** a small underlined "Pause motion" text button now sits below the hero's chapter links. Pressing it shows the already-approved still version of the page; "Play motion" restores the animation. Nothing else changes.

## 7. Nothing else is needed from you now

The earlier O1/O2 and O3–O5 private evidence files are **withdrawn as asks**: you do not need to create them. The direct-contact publication prerequisite stays unmet for now; the publication-preparation task will write the minimum private record itself from the attestations already on file (GS-LAUNCH-024/025 and your statement in this task that client records stay on Freelancer). It needs, at most, one line from you then — for example: *"Still true on [date]: contact@gridsmith.uk and the business WhatsApp are read only by me and sales, with no forwarding to anyone else."* No support contact was made or drafted.
