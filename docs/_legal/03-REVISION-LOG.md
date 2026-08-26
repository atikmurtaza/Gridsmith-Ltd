# 03 — Revision Log (Pass 3)

**Date: 25 August 2026.** Seven files revised in place against `02-CITATION-LEDGER.md`, with
`01-FACTUAL-INVENTORY.md` as the authority on what the build actually does.

**Rule applied throughout:** every clause carries an inline `<!-- L-… -->` comment naming its ledger
entry, or `<!-- NO LEDGER ENTRY: … -->` explaining why it is still wanted. **No clause was deleted for
having no ledger entry** — deleting it would hide the question from the solicitor.

**Second rule applied throughout:** the drafts now describe **what the build does**, not what it was
meant to do. Where an obligation requires a control that does not exist, the draft says so with `[TK]`
or `[DECISION REQUIRED]`. Nothing unbuilt is described as if it exists.

---

## Totals

| | Count |
|---|---|
| Files changed | **7** |
| Clauses / sections **added** | **26** |
| Clauses **amended** | **46** |
| Clauses **flagged** `NO LEDGER ENTRY` | **33** |
| `[TK]` markers | **90** |
| `[DECISION REQUIRED]` items | **11 distinct** (21 occurrences, counting summary restatements) |
| Ledger ids cited inline | **all 31** |
| `[SEED - SOLICITOR REVIEW REQUIRED]` banner present | **7 / 7** |

Per file:

| File | Added | Amended | Flagged | `[TK]` | `[DECISION REQUIRED]` |
|---|---|---|---|---|---|
| `00-LEGAL-BASIS.md` | 6 rows + 7 solicitor questions | 11 | 5 | 2 | 2 |
| `WEBSITE-TERMS.md` | 3 | 8 | 7 | 12 | 3 (2 distinct) |
| `PRIVACY-POLICY.md` | 7 | 12 | 2 | 31 | 6 (4 distinct) |
| `COOKIE-POLICY.md` | 2 | 6 | 0 | 5 | 2 |
| `ACCESSIBILITY-STATEMENT.md` | 1 | 5 | 0 | 10 | 3 (2 distinct) |
| `MSA-BUSINESS.md` | 6 | 2 | 16 | 11 | 2 (1 distinct) |
| `CONSUMER-TERMS.md` | 5 | 2 | 3 | 19 | 3 (2 distinct) |

---

## The eleven `[DECISION REQUIRED]` items, with options

Restated in one place because each is an owner's choice, not the drafter's, and several are linked.

### D-1 — The VAT number (`WEBSITE-TERMS.md` cl. 1) · `L-ECOM-6`
The footer of every page renders `[SEED] GB123456789`.
**(a)** Registered → publish the real number. **(b)** Not registered → **publish none**; reg. 6(1)(g)
requires it only where the provider undertakes an activity subject to VAT.
**Consequence of neither:** a false disclosure ships. `check:launch-content` blocks a `production`
dataset carrying it, so it cannot reach production — but it is live in `development` today, and a
fabricated number is a worse defect than a missing one.

### D-2 — VAT display, and it splits by audience (`WEBSITE-TERMS.md` cl. 5A) · `L-VAT-CONSUMER`, `L-VAT-B2B`, `L-DMCC-230`
**(a)** Label everything "exc. VAT" → fixes Design and Digital, **breaks Press**.
**(b)** Everything inclusive → compliant everywhere, misstates the B2B position.
**(c)** Add the net/gross field to `pricingBlock` and render per division — inclusive on `/press`,
labelled-exclusive on `/design` and `/digital`. This is `M-P2-3`, NOT BUILT.
**Only (c) satisfies both entries.** Linked to D-1: if there is no VAT registration there is no VAT to
state and the label changes again.

### D-3 — Audience of the website terms (`WEBSITE-TERMS.md` head) · `L-CRA-57`
**(a)** One instrument with each divergence marked (what the draft does). **(b)** Split, requiring a
sixth legal slug. Consequence of (a): every limitation must be read down for consumers, and cl. 11 is
the only place that currently happens.

### D-4 — Slack (`PRIVACY-POLICY.md` §6) · `L-GDPR-28`, `L-GDPR-13`
A live code path transmits an enquirer's **full name** to Slack; it is inert only because
`SLACK_LEADS_WEBHOOK` is unset.
**(a)** Delete the path. **(b)** Keep unset but disclose it. **(c)** Enable — then a DPA, a region and
a notice row are prerequisites.
**Consequence of doing nothing:** an undocumented processor is one environment variable away from live,
with no code change and no further decision.

### D-5 — Enquiry retention period, and who builds the deletion (`PRIVACY-POLICY.md` §7) · `L-GDPR-5-1e`, `L-GDPR-13`
**(a)** State a period **and build the job**. **(b)** State criteria rather than a period — permitted,
still has to be applied. **(c)** Neither — not available; fails Art. 13(2)(a) outright.
**Consequence:** (a) is a build task nobody owns. Publishing a period with no deletion job converts a
build gap into a published misstatement.

### D-6 — Consent evidence vs the para. 5 exception (`PRIVACY-POLICY.md` §11A, `COOKIE-POLICY.md` §4A) · `L-PECR-CONSENT-EVIDENCE`, `L-PECR-6`
**(a)** Keep requiring consent → `consent_events` (`L-07`) becomes a prerequisite before any analytics
library is initialised, because Art. 7(1) requires demonstrability and today there is no record beyond
a deletable cookie.
**(b)** Rely on **PECR Sch. A1 para. 5** → the toggle becomes objection, may default on, coverage
becomes complete, and the demonstrability problem disappears for that purpose. Available **only** if
every ICO condition holds — see below.
**(c)** Split: para. 5 for strictly aggregate first-party measurement, consent for everything else.
Closest to the guidance, most work.
**Currently moot and that is the point:** nothing collects anything today, so the decision is cheap
now and expensive after the libraries are turned on.

### D-7 — The two inert toggles (`COOKIE-POLICY.md` §4B) · `L-PECR-6-CONSENT`
`ad_storage` and `functionality_storage` are offered, default denied, and **no code branches on
them**.
**(a)** Remove until something needs them. **(b)** Keep and say so here. **(c)** Keep silently.
**Consequence of (c):** offering a control that does nothing is a representation to the visitor and
bears on whether consent is *informed* under Art. 4(11). If `ad_storage` is removed, the
default-denied Consent Mode signal must still be sent.

### D-8 — Published conformance status (`ACCESSIBILITY-STATEMENT.md` §2) · `L-WCAG-22`, `L-EQA-20`
**(a)** "Partially conformant", gaps named and dated — the only option the evidence supports today.
**(b)** "Conformant" — **not available**; a false statement about the service under `L-CRA-50`, and for
a consumer it engages the DMCCA misleading-action provisions.
**(c)** Do the screen-reader pass and add the four uncovered legal routes first, then state what the
evidence supports.

### D-9 — The response/acknowledgement window (`PRIVACY-POLICY.md` §12, `CONSUMER-TERMS.md` §12, `ACCESSIBILITY-STATEMENT.md` §5) · `L-DPA-164A`, `L-CRA-50`
Three documents independently promised **5 working days**, which is three sources of truth for one
commitment. s. 164A's statutory outer limit is **30 days**.
**(a)** 5 working days everywhere — better service, and for a consumer a binding term under s. 50.
**(b)** 30 days — statutory floor, always achievable, weaker signal.
**(c)** 5 as a target, 30 as the guarantee.
`CLAUDE.md` requires one source of truth for response commitments and forbids promising faster than
end of next business day. Whatever is chosen must be identical in all three files.

### D-10 — One slug, two instruments — **DECIDED AND IMPLEMENTED, 26 August 2026** (`MSA-BUSINESS.md` head, `CONSUMER-TERMS.md` head, `00-LEGAL-BASIS.md` §3) · `L-CRA-57`

> **Owner's decision, 26 August 2026: option (a) — split the routes.** The reasoning is that no
> single instrument and no single redirect target is honest for both audiences, which is the finding
> four verification passes converged on: s. 57 is not a drafting problem, it is a *who is reading
> this page* problem, and only routing can answer it.
>
> | | |
> |---|---|
> | `/legal/business-client-terms` | `MSA-BUSINESS.md`. Design and Digital |
> | `/legal/consumer-client-terms` | `CONSUMER-TERMS.md`. Press |
> | `/legal/client-terms` | **Disambiguation.** No operative clause. Says who each governs, links to both |
>
> **Why the old path is a disambiguation page and not a redirect.** A redirect has to choose a
> target, and either choice silently delivers one audience the other audience's instrument — the
> same defect with an extra hop in front of it. `redirects/legacy.json` is therefore untouched.
>
> **Why the master layer links to both.** `/` and `/contact` serve both audiences
> (`01-FACTUAL-INVENTORY.md` §5.1), so the master layer cannot pick one without being wrong for
> half its visitors. It links to `/legal/client-terms`, which is the one page whose job is to say
> which applies. In practice nothing in the master chrome links to any legal route yet — the footer
> carries the statutory disclosure and no legal link group — so this is the rule for when it does.
>
> **Each instrument states who it governs in its summary**, which is the first prose on the page,
> above the contents and above every clause.
>
> **Proven, not asserted.** `scripts/check-consumer-terms.mjs` reads the served pages and fails if
> any consumer-facing route links to the business terms, if `/press` links to no consumer terms at
> all, or if the consumer instrument stops being the consumer instrument. Three branches, each
> proven by deliberate failure; the proof is recorded in the commit that added the gate.
>
> **What was NOT done, and is for the solicitor.** No clause was drafted or amended — `CLAUDE.md`
> forbids it. The business instrument therefore still carries consumer-facing material at 2.1
> (CRA s. 50), 6.1 (CRA s. 49), 10.1 (14-day distance cancellation) and 11.1 (consumer ADR), which
> the split makes redundant there. Removing it is a drafting decision for the `L-04` review.

**The structural defect in the whole `_legal/` set. No clause can fix it.**
`lib/legal/slugs.ts` declares five slugs; `MSA-BUSINESS.md` and `CONSUMER-TERMS.md` both map to
`/legal/client-terms`, and the seeded document there mixes both regimes.
**(a)** Sixth slug + division routing. **(b)** One combined instrument disapplying every clause that
fails s. 57 for consumers. **(c)** Consumers handled off the website.
**Consequence of leaving it:** a Press author reading `/legal/client-terms` today reads terms drafted
for a business, including a liability cap void against them, and cannot tell.

### D-11 — Analytics position in the legal-basis map (`00-LEGAL-BASIS.md` §2.2) · `L-PECR-6`
Version 1.0 closed this question ("Position adopted: continue to require consent"). It is reopened as
D-6 because the exception is now in force and the regulator has published its conditions.

---

## The ICO fetch Pass 2 required

`CNV-1` recorded that no ICO guidance was reached, and that its post-DUAA position on the Sch. A1
para. 5 statistical-purposes exception was *"the single point where a regulator view would most change
what `COOKIE-POLICY.md` should say"*. It was fetched before the cookie policy was written.

**Source, quoted in full at `COOKIE-POLICY.md` §4A and marked there as regulator guidance, not
statute:** Information Commissioner's Office, *Guidance on the use of storage and access technologies*,
chapter **"What are the exceptions?"**, `ico.org.uk`, retrieved **25 August 2026**.

What it changed, concretely:

| Version 1.0 said | ICO position | Effect |
|---|---|---|
| The exemption is "narrow and **untested**" | Published guidance now exists to test a position against | The blanket refusal is no longer the only defensible answer → D-6 |
| "GA4 transmits data to a **third party**" — so the exception does not fit | *"The exception recognises that you can … use a third-party analytics provider"* — provided it is a **processor, not a joint controller** | **The third-party point alone does not defeat the exception.** What defeats it for GA4, if anything, is the unresolved controller/processor position (OQ-5) |
| "PostHog **session replay** is plainly not aggregate statistics" | Consent required for *"logs or recordings of individual visitors … and the actions they took"* | **Correct, and confirmed.** Replay must be off and stay off for (b) or (c) to be available |
| "an opt-out is still required even where an exemption applies" | *"a simple means of objecting, free of charge"*; a toggle that may default **on** and can be turned off at any time; browser settings alone are not sufficient | **Correct.** The toggle changes meaning, it does not disappear |
| — | *"does not apply to purposes related to online advertising"* | **`ad_storage` cannot ride on para. 5 at all** → feeds D-7 |
| — | *"You must ensure that the information resulting … is aggregate statistical information that you cannot use to identify people"*; no tracking or profiling of individuals or categories | Sets the hard boundary for any (b) or (c) implementation |

---

## Per-document detail

### `00-LEGAL-BASIS.md` — corrected where the ledger contradicts it

**Confirmed, not changed:** §2's commencement dates. DUAA main provisions **5 Feb 2026**, direct
complaints **19 Jun 2026** — Pass 2 verified both against SI 2026/82 regs. 2 and 3
(`L-DUAA-COMMENCEMENT`).

**Rows added (6):** storage limitation `L-GDPR-5-1e` · international transfers `L-GDPR-44A` · the ICO
fee `L-DPA-FEE` · marketing email `L-PECR-22` · consumer pricing and reviews `L-DMCC-230` /
`L-DMCC-SCH20-13` (**absent from version 1.0 entirely — the DMCCA is not mentioned once**) · VAT on
displayed prices `L-VAT-CONSUMER` / `L-VAT-B2B`.

**Amended (11):**
1. **Company disclosure** — the obligation read and cited is SI 2015/17 regs. 24–25, not CA 2006 s. 82;
   s. 82's text was never fetched (`CNV-7`).
2. **E-commerce disclosure** — reg. 6 is **not consumer-only**, which is why VAT display reaches the
   B2B divisions; status recorded as failing twice.
3. **Data protection** — expanded to the articles actually engaged, with s. 164A named.
4. **Cookies** — restated as reg. 6 *as substituted* with the seven Sch. A1 exceptions enumerated.
5. **§2.1 the penalty ceiling** — `£17.5m / 4%` and the removal of the damage-and-distress threshold
   are **asserted, not verified**; Pass 2 raised no entry. Flagged `[TK]` with the note that `CLAUDE.md`
   itself repeats the 4% figure as fact.
6. **§2.2** retitled from *"New cookie exemptions exist **but do not help here**"*. Position reopened as
   D-6; the four bullets checked one by one against the ICO; the parenthetical *"(`gs_consent`,
   session, CSRF)"* corrected — **there is no session cookie and no CSRF cookie**.
7. **§2.3** — "drafted at `PRIVACY-POLICY.md` §12" is true and is not the same as satisfied. **There is
   no complaints route and no electronic complaint form.**
8. **§3 consumer/business table** — liability-cap row restated to `L-CRA-57`; rows added for price
   display, marketing email and electronic contracting; a "Route today" row added showing both
   instruments share one slug.
9. **§3 the 14-day problem** — *"already reflected in the Press flow"* is **not true**; nothing is
   built. reg. 31's up-to-12-month extension added.
10. **§4 accessibility row** — WCAG's status corrected: a W3C Recommendation, **not law**, not binding
    on a private-sector UK service; adopted, not required.
11. **§5 document table** — routes added, the three audit documents listed, and the fact that only
    `/legal/privacy` is covered by the accessibility gate.

**Flagged `NO LEDGER ENTRY` (5):** Provision of Services Regulations 2009 (never read by Pass 2) ·
UCTA 1977 (the entire B2B fairness basis is uncited while the consumer side is fully cited) · CDPA
s. 90(3) (**an unverified citation carrying real weight** — Digital's ownership promise rests on it) ·
Late Payment Act 1998 rate and fixed sum · the PECR penalty ceiling.

**Added to §6:** seven further questions for the solicitor (9–15), each tied to a ledger id.

**`[TK]` (2):** the PECR penalty figures · the Late Payment Act figures.

---

### `WEBSITE-TERMS.md`

**Added (3):** **cl. 5A prices shown on this site** (`L-ECOM-6`, `L-VAT-B2B`, `L-VAT-CONSUMER`,
`L-DMCC-230`) — no clause previously addressed VAT display and it is a live failure on every division ·
**cl. 12A data protection complaints** (`L-DPA-164A`) · **cl. 15 accessibility** (`L-EQA-29`,
`L-EQA-20`) stating the duty is **anticipatory**.

**Amended (8):** cl. 1 — the VAT line replaced with `[TK]` + D-1, and company number / registered office
marked `[TK]` because `seed-company-details.mjs` does not distinguish its verified values from its
`[SEED]` one (OQ-15) · cl. 4 — flagged that no sample-request flow exists · cl. 5 — flagged that **none
of the three estimating tools is built** · cl. 5 — consumer paragraph added under `L-CRA-51` · cl. 6 —
response commitment tagged `L-CRA-50` as a term of any consumer contract · cl. 7 — the accuracy
disclaimer expressly **cannot** cure live `[SEED]` content; the mitigation is a build gate, not a term ·
cl. 10 — tagged `L-GDPR-32` with the note that a contractual prohibition is not a technical measure and
there is no honeypot, rate limit or CAPTCHA · **cl. 11 — split by audience**: the exclusion now applies
to business users only and is **expressly disapplied for consumers** under `L-CRA-57`, rather than left
to be read down.

**Flagged `NO LEDGER ENTRY` (7):** acceptance by use · content/IP licence (no CDPA entry) · sample
materials · availability · the B2B limb of cl. 11 (UCTA uncited) · unilateral variation · law and
jurisdiction.

**`[TK]` (12):** company number · registered office · VAT number or its removal · contact email ·
contact phone · business days/hours · effective date · survival of cl. 5 · the sample flow · the VAT
sentence.

**`[DECISION REQUIRED]`:** D-3, D-1, D-2.

---

### `PRIVACY-POLICY.md` — the most heavily corrected document

**Added (7):** **§1A ICO registration and the fee** (`L-DPA-FEE`) · **§3A marketing**, written to the
consumer and business standards **separately** (`L-PECR-22`) · **§6A analytics — what actually happens
today** (`L-PECR-6`) · **§6B the hosting provider's own logs** · **§6C international transfers**
(`L-GDPR-44A`) · **§11A our record of your consent** (`L-PECR-CONSENT-EVIDENCE`) · **§12A record of
processing** (`L-GDPR-30`).

**Amended (12), each a statement that was not true of the build:**

1. **§2 — "Interaction data: pages viewed, referrer, device type, approximate location from IP"
   removed.** None of it is collected. Neither GA4 nor PostHog is ever initialised — `window.gtag` is
   `undefined` and `window.posthog.__loaded` is `false` **even after Accept**.
2. **§2 — "a random consent identifier … the policy version" removed.** No such record exists anywhere.
3. §2 — `created_at` added (stamped automatically); the latent unfilled columns explained; the absence
   of IP and user-agent capture stated.
4. §3 — lawful bases mapped to article numbers; the sample-pack row removed (no such flow); flagged
   that the ledger records the basis as *"cannot tell"* and that **no written LIA exists**.
5. §5 — the three estimating tools removed; none is built.
6. **§6 — every asserted processor region replaced with `[TK]`.** Version 1.0 asserted "EU/UK region",
   "EU region", "EU/US", "US" for six recipients; **none was established**, and OQ-2 says the Supabase
   region "must not be assumed to be EU".
7. **§6 — Slack added as a recipient** with exactly what reaches it (the enquirer's full name) → D-4.
8. **§6 — the "delivery partners" row and its note removed.** Version 1.0 asserted *"Gridsmith Ltd
   works with affiliated production entities outside the UK … This is a real transfer and cannot be
   omitted."* Nothing establishes that they exist. Retained as an open item, because a notice must not
   describe a transfer it cannot particularise **and** must not omit a real one.
9. **§6C — rewritten; version 1.0 cited repealed law.** "UK adequacy regulations … IDTA / UK Addendum"
   became Arts. 44A / 45A / **45B** / 46 / 49. **Arts. 44 and 45 were omitted on 5 Feb 2026.**
10. **§7 — the retention table was entirely aspirational.** Retention is **NOT IMPLEMENTED**: no purge,
    no anonymisation, no scheduled delete. Replaced with the real position + D-5.
11. **§8 — "encrypted at rest" removed** (unverified) and **"payments are handled by our payment
    provider" removed** (no payment provider exists; no payment is taken). RLS, the daily drift check
    as an Art. 32(1)(d) testing measure, and the **absence of a honeypot / rate limit / CAPTCHA** added.
12. **§12 — the complaints procedure rewritten** to s. 164A's actual terms, with the **missing
    electronic complaint form** as the leading `[TK]` and D-9 on the acknowledgement window.

**Flagged `NO LEDGER ENTRY` (2):** the no-file-uploads statement (a design choice, but true) ·
change notification.

**`[TK]` (31)** — the full list is at the foot of the document. The load-bearing ones: four processor
regions · the transfer mechanism for each · the enquiry retention period **and the job to enforce it** ·
the electronic complaint form · the written LIA · the erasure process · ICO registration · whether
affiliated production entities exist · the ROPA.

**`[DECISION REQUIRED]`:** D-4, D-5, D-6, D-9.

---

### `COOKIE-POLICY.md` — five of six listed cookies did not exist

**Added (2):** **§4A the 2026 statistical-purposes exception**, with the ICO's conditions quoted and
labelled as guidance not statute → D-6 · **§4B toggles that control nothing** (`L-PECR-6-CONSENT`) →
D-7.

**Amended (6):**
1. **§2 — `__Host-session` and `csrf_token` removed. Neither exists.** `gs_consent` is the only cookie
   on the site, in every state; its real attributes and 365-day `Max-Age` are stated, and its exemption
   is placed under **Sch. A1 para. 4** rather than a generic "strictly necessary".
2. **§3 — `gs_design_track` removed. It does not exist.** Replaced with the fact that the Preferences
   toggle gates nothing.
3. **§4 — `_ga`, `_ga_*` and `ph_*` removed. None of them is ever set**, because neither library is
   initialised. Replaced with a three-state table of what is actually observed, including the honest
   point that requesting a script sends IP and user-agent to Google and PostHog.
4. §5 — third-party fonts added: typefaces are self-hosted and **no request is made to Google Fonts**.
5. **§7 — the consent record corrected.** Version 1.0 described a random identifier, the categories,
   the policy version, kept 24 months. **None exists**; there is a cookie with no timestamp, no version
   and no server-side record.
6. Header — restated against reg. 6 *as substituted* and Sch. A1, in force 5 Feb 2026.

**`[TK]` (5):** effective date · contact email · the inert toggles · the analytics basis · the
consent-evidence position.

**Standing instruction added:** re-verify §2–§4 against the running site in all three consent states
immediately before publication. Version 1.0 was wrong about five of six cookies and **nothing in CI
checks a cookie table against a browser.**

---

### `ACCESSIBILITY-STATEMENT.md` — no conformance claimed that the evidence does not support

**Added (1):** §4 known limitations, rewritten from a `[TK]` placeholder into four **actual** named
limitations.

**Amended (5):**
1. **§1** — the duty stated precisely: s. 29, s. 20 with Sch. 2, **anticipatory** under Sch. 2
   para. 2(2), and s. 20(7)'s no-charging rule.
2. **§2 — WCAG's legal status corrected.** A W3C Recommendation, not law; the 2018 public-sector
   regulations do not bind Gridsmith Ltd; **AA is adopted, not required**. Status left `[TK]` with D-8,
   and "conformant" recorded as **not available** on the current evidence.
3. **§3 — five claims removed**, each because the thing does not exist or is unverified: the drawing
   matrix and packages comparison tables (**not built**); the three interactive tools and their
   announcements (**not built**, and announcement is precisely what no automated gate can check);
   blanket meaningful alt text; no-JavaScript readability; **and "manual keyboard and screen reader
   testing before release"**.
4. **§4** — the four real limitations: **no screen-reader testing**; no AT testing of any kind; **four
   of five legal routes outside the axe gate**, including this page; INP unmeasurable in CI.
5. **§6 — "Manual: keyboard-only navigation, NVDA on Windows, VoiceOver on macOS and iOS" replaced
   with the truth: it has never been performed.** `05-HANDOVER.md:79` is quoted, including that the
   gates *"do not cover announcement, and no lab check does."*

**`[TK]` (10):** conformance status · contact email · manual keyboard test date and tester ·
screen-reader pass date and tester · next review · the four uncovered routes · findings.

**`[DECISION REQUIRED]`:** D-8, D-9.

---

### `MSA-BUSINESS.md` (business audience)

**Added (6):** **cl. 6.7** prices displayed on the website (`L-VAT-B2B`, `L-ECOM-6`) · **cl. 10.3**
sub-processors (`L-GDPR-28`) · **cl. 10.4** international transfers under the restructured Chapter V
(`L-GDPR-44A`) · **cl. 10.5** data protection complaints (`L-DPA-164A`) · **cl. 15** contracting by
electronic means, **excluding regs. 9(1) and 11(1)(b) as permitted between businesses**
(`L-ECOM-9-11`) · **cl. 16** marketing, stating the **corporate-subscriber** position (`L-PECR-22`).

**Amended (2):** cl. 6.1 — annotated to show that "exclusive of VAT" is a **compliant** B2B statement
and that the failure is on the website, not in the clause · head of document — D-10 added.

**Flagged `NO LEDGER ENTRY` (16):** cll. 2, 3, 4, 5, 7, 8, 9, 11 (UCTA limb), 12, 13, 14, and
Schedules A2, A3, B1, C1. Notable ones:
- **cl. 8 (IP)** — the ledger has **no CDPA entry**. Clause 8.3 is drafted to satisfy s. 90(3) and
  Digital's whole ownership promise rests on it. Flagged as needing a citation and confirmation that it
  works for an electronically executed contract.
- **cl. 11 (liability)** — the B2B reasonableness basis is uncited while the consumer side is fully
  cited at `L-CRA-57`. Also tagged `L-CRA-57` as the reason this instrument must never reach a consumer.
- **cl. 7 (deemed acceptance)** and **cl. 12.3 (exclusion of implied warranties)** — flagged as having
  no consumer counterpart and needing none.
- **A2 standards** — BS 8888, BS EN ISO 128, Eurocodes and RIBA stages are named as examples;
  `CLAUDE.md` forbids inventing standards codes, so each must be confirmed or removed.
- **C9 author warranties** — tagged `L-CRA-57`; the asymmetry with the softer `CONSUMER-TERMS.md` 9.3
  is deliberate and must survive review.

**`[TK]` (11):** cap figure · PI limit · Late Payment figures · the VAT sentence · a DPA per processor ·
regions and mechanisms · the complaint form · the A2 standards · the CDPA citation.

**`[DECISION REQUIRED]`:** D-10.

---

### `CONSUMER-TERMS.md` (consumer audience)

**Added (5):** **cl. 4.1** ordering online — regs. 9, 11, 12, 14 and 16, stated as **mandatory and not
excludable**, the mirror image of MSA cl. 15 (`L-ECOM-9-11`, `L-CCR-13`) · **cl. 5.1** — **if the
reg. 13 cancellation information was not given, the cancellation period extends by up to 12 months**
(`L-CCR-29` reg. 31), the most expensive automatic consequence in the consumer regime and absent from
version 1.0 · **cl. 7.5** no charge you did not expressly agree to, with pre-ticked boxes named
(`L-CCR-40` reg. 40, and reg. 41 on helpline charges) · **cl. 12.1** data protection complaints
(`L-DPA-164A`) · **cl. 15.1** marketing to an individual subscriber (`L-PECR-22`).

Also added to §3: the **model cancellation form** and **confirmation on a durable medium**, two Sch. 2
items missing from version 1.0.

**Amended (2):** §3's total-price bullet annotated — **the clause is correct and the website is not**;
these terms promise a tax-inclusive total that the `/press` page the consumer read did not show (D-2) ·
§4's estimator sentence flagged, because no such tool exists.

**Flagged `NO LEDGER ENTRY` (3):** cl. 9 (the consumer's own obligations — deliberately softer than
MSA C9, and that asymmetry is intentional) · cl. 10 (the copyright position — **no CDPA entry in the
ledger**, yet this is the promise the whole Press proposition is built on) · cl. 16 (boilerplate; 16.4
is deliberately non-exclusive as to jurisdiction, unlike MSA 14.7).

**Testimonials** flagged at 10.8 under `L-DMCC-SCH20-13`: six real public Freelancer reviews are shown
on the homepage; whether that is a **selected** subset with negative reviews omitted is a decision no
gate can observe, and reviewer consent to being quoted is unconfirmed (OQ-20).

**`[TK]` (19):** company number · registered office · contact email and phone · late payment rate ·
complaint response time · ADR provider · the estimator reference · the VAT-inclusive price the site
does not show · the complaint form · the testimonial selection and consents.

**`[DECISION REQUIRED]`:** D-10, D-9.

---

## Audience divergences written to two standards, not collapsed

The instruction was not to apply the stricter standard to both. Where an obligation lands differently
it is drafted twice and labelled:

| Point | Business — Design, Digital | Consumer — Press |
|---|---|---|
| **Liability** | `WEBSITE-TERMS.md` cl. 11 ¶2 excludes; MSA cl. 11.3 caps | cl. 11 ¶3 **expressly disapplies** the exclusion; `CONSUMER-TERMS.md` 13 has **no cap at all** — `L-CRA-57` makes one void |
| **VAT on prices** | Treatment must be **stated**; exclusive permitted — `L-VAT-B2B` | **Total inclusive of tax**, equal prominence for calculation info — `L-VAT-CONSUMER`, `L-DMCC-230` |
| **Marketing email** | MSA cl. 16.1 — reg. 22 does not bind a corporate subscriber; reg. 23 still does | `CONSUMER-TERMS.md` 15.1 and `PRIVACY-POLICY.md` §3A — reg. 22 binds; soft opt-in only after a sale or negotiations for one |
| **Electronic contracting** | MSA cl. 15.1 — regs. 9(1) and 11(1)(b) **excluded by agreement** | `CONSUMER-TERMS.md` 4.1 — **mandatory, not excludable** |
| **Deemed acceptance** | MSA cl. 7.4 — 10 working days | **No equivalent, deliberately** |
| **Implied warranties** | MSA cl. 12.3 excludes them | **No equivalent, and must never acquire one** |
| **Cancellation** | None implied | 14 days, extended **up to 12 months** if reg. 13 information was not given |
| **Author warranties** | MSA C9 — warranty plus indemnity | `CONSUMER-TERMS.md` 9.3 — a confirmation, no indemnity |

---

## What Pass 3 could not do

1. **Fill any `[TK]`.** All 90 are facts nobody in the repository has: regions, DPAs, a VAT number, a
   retention period, an ICO registration, test dates. Filling one with a plausible default is the
   failure mode `CLAUDE.md` exists to prevent.
2. **Fix `L-CRA-57`'s structural defect (D-10).** One `/legal/client-terms` slug serves two
   instruments. **No clause can cure it** — it is a routing and instrument-structure decision.
3. **Create the complaints route (`L-DPA-164A`).** s. 164A wants an electronic complaint form. That is
   a build task. The drafts describe the procedure and flag that the form does not exist.
4. **Verify four secondary citations Pass 2 left open** and Pass 3 did not reach either: `CNV-3` PECR
   reg. 23 (relied on by MSA cl. 16.1 and `PRIVACY-POLICY.md` §3A) · `CNV-5` VAT Regulations 1995
   reg. 14 · `CNV-6` DMCCA ss. 226–227 · `CNV-7` CA 2006 s. 82. Each is flagged at the point of use.
5. **Supply citations for the five uncited instruments** now flagged `NO LEDGER ENTRY` in
   `00-LEGAL-BASIS.md`: PSR 2009, UCTA 1977, CDPA s. 90(3), the Late Payment Act figures, and the PECR
   penalty ceiling. These need a Pass-2-style primary read; **CDPA s. 90(3) is the one that carries real
   commercial weight**, because Digital's published ownership guarantee rests on it.
6. **Confirm the testimonials position (`L-DMCC-SCH20-13`).** Whether the six shown are a complete or
   selected set is not observable from the repository, and no clause can cure a selection decision.

---

*End of Pass 3 revision log. Pass 4 checked the inline ids against the ledger.*

---

# Round 5 — acting on Pass 4

**Date: 26 August 2026.** Three owner decisions executed against `04-VERIFICATION-REPORT.md`. **No
clause was drafted or amended on the law**; this round corrects numbers, records a decision, and adds
one ledger entry. The `[SEED - SOLICITOR REVIEW REQUIRED]` banners are untouched.

## 1. The PECR penalty figure — a proposed correction rejected, and why that matters

**Pass 4 §2.1 and §4.5 proposed replacing `CLAUDE.md`'s uncited "up to 4% of turnover" with "£8.7m or
2%". The owner rejected that correction.** The ground of rejection was not that the new figure was
implausible — it is the real UK GDPR *standard* maximum — but that **it was another uncited number put
in place of an uncited number.** Swapping one unsourced figure for a differently-unsourced figure
looks like a fix and is not one: it leaves the reader in exactly the position `CLAUDE.md` warns
about, holding a specific-looking number that nothing verifies and that therefore stops anyone
re-deriving it.

**The provision was then read.** The result:

- **Established: a PECR reg. 6 breach attracts the HIGHER maximum — £17,500,000 or 4% of total annual
  worldwide turnover, whichever is higher.** Route: reg. 31 → Sch. 1 para. 18 → DPA 2018
  s. 157(2)(a) and (5). Para. 18(b)(ii) substitutes the reg. list **into paragraph (a) of** s. 157(2),
  and (2)(a) is the higher-maximum limb; (2)(b), "otherwise", is the standard maximum, £8.7m or 2%
  (s. 157(6)). Both PECR provisions substituted 5 Feb 2026 by DUAA 2025 ss. 115(5), (8) and Sch. 13,
  commenced by SI 2026/82 reg. 2.
- **So the tiering in the proposed correction was inverted.** Pass 4 read para. 18(b)(ii) as modifying
  s. 157(2) as a whole. It modifies paragraph (a) of it. The rejection was made on the citation
  ground alone and turned out to be right on the substance as well — which is the argument for the
  rule, not a coincidence that excuses departing from it.
- **The figure now carries a primary citation and a stable id.** New ledger entry
  **`L-PECR-PENALTY`**, which states the route, quotes para. 18, gives both tiers, and says in terms
  which tier reg. 6 falls into. It also records the ICO's summary page as **regulator guidance, not
  statute** — the ICO states the alignment with UK GDPR and no figure of its own.
- **Settled, not left open.** Every link in the chain is in force and reachable at
  `legislation.gov.uk` at the in-force version, checked 26 Aug 2026.

Changed: `CLAUDE.md` #7 (one line, now naming the provision) · `00-LEGAL-BASIS.md` §2.1 (`[TK]`
closed, provenance of both earlier figures recorded) · `_shared/01-VALIDATION-REPORT.md` L-02 (cited)
· `02-CITATION-LEDGER.md` (new `L-PECR-PENALTY`).

## 2. The contrast and route figures — taken from the gates, not from the report

Read out of the scripts rather than out of Pass 4:

| Claim | Was | Now | Source |
|---|---|---|---|
| Contrast pairs / cells | 29 / 101 | **36 / 148** | `check-contrast.mjs:45-46`, hard-failed at :288 and :352 |
| axe routes | "14 routes" | **15 — 11 public, 4 internal** | `check-axe.mjs` `ROUTES` |
| axe viewports | "3 viewports" | **2 — 375px and 1280px** | `VIEWPORTS` |
| axe second axis | "2 consent phases" | **2 scroll states — initial and scrolled** | `PHASES` |

**Two things Pass 4 did not catch, found by counting.** (a) It reported "ten public routes plus five
internal probe routes"; the internal routes are **four** (`/_kitchen-sink`, `/_master-sink`,
`/_gridsmith-404-probe`, `/gridsmith-error-probe`) and the public pages are therefore **eleven**.
(b) The viewport count and the description of the second axis were wrong in the published statement
and Pass 4 quoted them without checking. Consent state *is* asserted by `check-axe`, but as a separate
per-route check, not as an axis of the axe matrix.

`CLAUDE.md`'s "of 29 published contrast ratios, 25 were wrong" is a **historical fact about A-03** and
is still true of the 29 that existed then, so the anecdote is kept and put in the past tense; the
live count in the same paragraph, and the `EXPECTED_*` literals quoted later in the file, are
corrected to the measured values.

Changed: `CLAUDE.md` (two passages) · `ACCESSIBILITY-STATEMENT.md` §3 · `01-FACTUAL-INVENTORY.md` §
gates table.

## 3. VAT display — decision recorded

**Owner, 26 August 2026: option (c).** Add the net/gross field to `pricingBlock` and render per
division — inclusive on `/press`, labelled-exclusive on `/design` and `/digital`. **Reasoning: it is
the only option that satisfies the consumer-inclusive requirement (`L-VAT-CONSUMER`, Press) and the
B2B labelling requirement (`L-VAT-B2B`, Design and Digital) simultaneously.**

The `[DECISION REQUIRED]` block at `WEBSITE-TERMS.md` §5A is converted to `[DECISION TAKEN]` with the
three options and their consequences left standing, so the solicitor can see what was weighed.
Propagated to `CONSUMER-TERMS.md` §3's inline note and `00-LEGAL-BASIS.md`'s VAT row.

**Not implemented, deliberately.** The price-rendering change is `M-P2-3`, a separate build task, and
is still NOT BUILT. Every `[TK]` that says the site does not state VAT treatment **stays open**, and
both audiences still fail on the live site today. The second-order question — whether the company is
VAT-registered at all — is untouched and still open.

## 4. The GA4 cookie contradiction — settled by measurement

**Round 6, 26 August 2026.** Two sources in this repository disagreed about whether Google Analytics
sets a cookie on this site. `lib/analytics/load.ts`'s opening docstring asserted that a GA4 script
which is present has "already set the cookie". `COOKIE-POLICY.md` §2 gives a **complete** cookie list
containing only `gs_consent`, and §4 states that no analytics cookie is set in any state, resting on
`01-FACTUAL-INVENTORY.md` §1.3.

**Settled by loading the site, not by reading either source.** Environments:

| Environment | Reachable | Reading taken |
|---|---|---|
| Vercel production (`gridsmith-ltd-atikmurtazas-projects.vercel.app`) | **No.** Project `live: false`; every production-target deployment since 19 Aug is in state `ERROR`; the production alias returns `404 NOT_FOUND` with no deployment behind it | none |
| Vercel preview deployments (three `READY`) | **No.** Vercel Authentication (SSO) is enabled for `all_except_custom_domains`, so no unauthenticated browser can reach one | none |
| **Local production build** — `rm -rf .next`, `next build`, `next start` on port 3100 | Yes | **all three consent states** |

**The measurement id was present.** This matters, because a "no cookie" reading from an environment
with no id proves nothing. The served page's own `window.__gsAnalyticsConfigured` — published by
`lib/analytics/config.ts` precisely so a reader asks the page rather than the runner's `process.env` —
reported `{ga4: true, posthog: true, posthogHost: "https://eu.i.posthog.com"}` in every state.
`.env.local` supplies `NEXT_PUBLIC_GA4_ID=G-CB4NWWYRQ1`, and the id appears in the injected URL.

**Observed, in full:**

| State | `document.cookie` | `localStorage` | `sessionStorage` | Third-party requests |
|---|---|---|---|---|
| No choice yet | *(empty)* | empty | empty | **none** |
| **Accept** | `gs_consent=analytics_storage%2Cad_storage%2Cfunctionality_storage` — **and nothing else** | empty | empty | `googletagmanager.com/gtag/js?id=G-CB4NWWYRQ1`, `eu.i.posthog.com/static/array.js` — both 200, neither followed by any further request |
| **Reject** | `gs_consent=0` | empty | empty | **none** |

Re-checked after an 8-second settle and again after a second page load on a different route, in case
either library set a cookie late. No `_ga`, no `_ga_*`, no `ph_*`, in any state.

**Why, verified at code level after the measurement told us what happened.** `gtag/js` did load and
did execute — `window.google_tag_data` becomes an object and `gtm.dom`/`gtm.load` are pushed into
`dataLayer` — but a GA4 tag is only instantiated by a `gtag('config', …)` call, and no `gtag()` call
exists anywhere in the repository; `window.gtag` remains `undefined` after a grant. PostHog is the
same shape: `array.js` defines the stub object, `window.posthog.__loaded` stays `false`, and there is
no `posthog.init()`. A `grep` for `gtag(` and `.init(` across `lib/`, `components/` and `app/` returns
nothing.

**Verdict: `COOKIE-POLICY.md` was right and the docstring was wrong.** §2, §4 and
`01-FACTUAL-INVENTORY.md` §1.3 are **confirmed by independent measurement and unchanged**. The cookie
policy does **not** understate what the site sets.

**Changed: `lib/analytics/load.ts` only** — the docstring now states what happens and why, names the
environment the reading came from, records that the id was present, and requires that any commit
adding an initialisation call rewrite it and the two `_legal` §s in the same commit. The rule this
correction is an instance of is `CLAUDE.md`'s: a docstring asserting the state of a system it does not
run in is guessing, and this one had been guessing since `A-09`.

**No analytics behaviour was changed.** The inert-analytics finding is the owner's to resolve and is
already open as OQ-7 and as `COOKIE-POLICY.md` §4's `[DECISION REQUIRED]`.

**Also observed, adjacent and not acted on:** `lib/consent/state.ts:74` pushes a plain array
`['consent','update',{…}]` into `dataLayer`, where Google's contract is an `arguments` object from a
`gtag()` shim. If a `config` call is ever added, whether the queued denied-default is honoured needs
proving by measurement before the tag is trusted — it is exactly the shape of claim that reads as
working and is not.

## What this round did not do

- **No clause was drafted or amended.** The fourteen other Pass 4 findings (§2.4–§2.14, §3.1, §4.1–§4.6)
  are untouched and remain for the solicitor or a later round.
- **The `check:contrast` and `check-axe` figures were not re-proved.** They are read from the gates'
  own literals, which is what the arbitration rule requires. Neither gate was run in this round.

---

*End of round 6. Nothing was committed.*

---

# Round 7 — 26 August 2026: the four held-back documents

**Scope.** The four documents Pass 4 marked *needs another pass* —
`PRIVACY-POLICY.md`, `COOKIE-POLICY.md`, `ACCESSIBILITY-STATEMENT.md`, `MSA-BUSINESS.md`. Nothing
else was drafted or amended, except two ledger corrections the clauses in these four depend on.

**Method, and the rule this round was built on.** Pass 4 was treated as a list of *leads*, not as an
authority. It has been wrong three times in this project — it inverted the PECR tiering (round 4), and
it miscounted both the public/internal route split and the axe viewports (round 5). **Every finding
below was re-checked at the primary source or in the code before it was acted on, and three were
rejected on that check.** Where a Pass 4 count differed from the count taken here, the count taken
here is the one in the document, and the divergence is recorded.

Primary sources fetched and read in full on 26 August 2026:
`legislation.gov.uk` — CDPA 1988 ss. 90 and 91 · LPCD(I)A 1998 ss. 5A and 6 · SI 2002/1675 art. 4 ·
SI 2002/2013 regs. 9 and 11 · SI 2003/2426 reg. 23 · SI 2018/480 contents · UK GDPR Art. 13.
Code re-derived: `lib/leads/schema.ts`, `lib/leads/action.ts`, `components/leads/ContactForm.tsx`,
`lib/legal/slugs.ts`, `scripts/check-axe.mjs`, `scripts/check-contrast.mjs`.

## 1. `MSA-BUSINESS.md` — version 1.2

### 1.1 Clause 6.4 — late payment. Three corrections, all confirmed at source.

`SI 2002/1675 art. 4` reads: *"The rate of interest … shall be 8 per cent per annum over the official
dealing rate in force on the 30th June (in respect of interest which starts to run between 1st July
and 31st December) or the 31st December (in respect of interest which starts to run between 1st
January and 30th June) immediately before the day on which statutory interest starts to run."*
**1998 Act s. 6(1)** only empowers the Secretary of State to set the rate by order — the Act sets no
rate. **s. 5A(2)** sets **three** fixed sums, £40 / £70 / £100 by band; **s. 5A(2A)** adds reasonable
recovery costs above the fixed sum.

So the clause was wrong on the instrument (it credited the Act), wrong on the mechanic (it read as
8% over the base rate on the day the invoice fell due, which is a floating rate the statute does not
create), and wrong on the recovery sum (*"the fixed statutory recovery sum"*, definite and singular,
where there are three plus s. 5A(2A)). The third of those was **giving away** an entitlement by
omission. All three are now stated. **Pass 4 §2.8 and §2.9 hold.**

### 1.2 Clause 8.3 — the assignment is of future copyright.

**CDPA s. 90(3)** governs assignment of copyright that already exists. Clause 8.3 assigns rights in
deliverables that do not exist at signature — future copyright, **s. 91**. s. 91(1) makes the
copyright vest in the assignee *"by virtue of this subsection"* on coming into existence, given an
agreement in relation to future copyright *"signed by or on behalf of the prospective owner"*. s. 91
also requires signed writing, so the clause's **form** was probably already adequate and Pass 4 was
right to say so — but the section that makes the assignment bite automatically was unnamed. Both are
now cited. **Pass 4 §4.1 holds.**

Two questions the citation does **not** answer are marked `[TK]` on the clause rather than resolved:
whether an electronically executed agreement is *"signed"*, and whether *"other intellectual property
rights"* — which are not copyright, and which ss. 90 and 91 do not reach — are validly assigned by
these words. The second was not raised by Pass 4 and was found by reading the clause against the
sections.

### 1.3 Clause 15 — the excludable set, and the carve-out that may make the clause unnecessary.

Regs. 9 and 11 were fetched in full. Each of **reg. 9(1)**, **reg. 9(2)** and **reg. 11(1)** opens
*"Unless parties who are not consumers have agreed otherwise"*, and in reg. 11 that conditional
governs paragraph (1) **entire** — the instrument draws no (a)/(b) division for this purpose. The
clause named *"9(1) and 11(1)(b)"*: less than the parties can disapply, and a division that does not
exist. **reg. 9(3)** carries no such conditional and is **not** excludable; the clause now says so,
because a reader should not be left to infer an exclusion wider than it is. That last point is not in
Pass 4 — it came out of reading reg. 9 in full rather than reading reg. 9(1).

**reg. 9(4)** and **reg. 11(3)** disapply all three paragraphs for a contract *"concluded exclusively
by exchange of electronic mail or by equivalent individual communications"*. That is how Gridsmith
contracts. A new **15.2** states it, and a `[DECISION REQUIRED]` asks the solicitor whether clause 15
is worth keeping at all — it is belt-and-braces over a carve-out that already applies, and the
alternative to asking is a billable paragraph the statute did not require. **Pass 4 §2.4 and §2.5
hold.**

## 2. `PRIVACY-POLICY.md` — version 1.2

### 2.1 §2A is new — UK GDPR Art. 13(2)(e).

Art. 13 was fetched and every sub-paragraph of Art. 13(2) read in order: (a) storage period,
(b) access/rectification/erasure/restriction/objection/portability, (c) withdraw consent, (ca)
complain to the controller under DPA 2018 s. 164A, (d) complain to the Commissioner, **(e) whether
provision is a statutory or contractual requirement**, (f) automated decision-making. **(e)** requires
three things: which kind of requirement it is, whether the data subject is obliged, and the possible
consequences of not providing.

*A note on how this was verified, because the first attempt failed.* A general "quote Article 13(2)"
fetch returned the text of Art. 13(1)(e) — recipients or categories of recipients — presented as
13(2)(e). The article was re-fetched with a prompt enumerating every sub-paragraph of paragraph 2 by
letter, which returned the correct text. **A summarised fetch of a numbered provision can silently
return the wrong limb**, and the tell is only that the text does not match what the provision is known
to be about. Enumerate the sub-paragraphs.

This was the only Art. 13 limb with no clause anywhere in the notice, and — unlike every other gap in
it — **it was not marked `[TK]`, so nothing was tracking it.** §2A now answers all three limbs for the
enquiry case, from the build rather than from the drafts: `lib/leads/schema.ts` makes `full_name` and
`email` the only required text fields, every other rendered field is `.optional()`, and `division`
defaults to `'unsure'`. So: no statutory requirement on anyone; two fields required if you want a
reply; the consequence of withholding them is that the enquiry cannot be submitted; the consequence of
withholding the optional fields is only a less useful reply.

The **client-engagement** half is marked `[TK]` and deliberately not written. Some client information
genuinely does become contractual (invoicing and delivery) and some statutory (accounting records,
§3's Art. 6(1)(c) row) — but no engagement process, invoicing flow or record-keeping policy exists in
this repository, so it cannot be written from it without inventing it. **Pass 4 §3.1 holds.**

### 2.2 §2's list of schema fields no form sends — and a correction to Pass 4's own count.

Re-derived from `lib/leads/schema.ts` and `lib/leads/action.ts` against the eight inputs
`components/leads/ContactForm.tsx` actually renders (`division`, `full_name`, `email`, `company`,
`phone`, `message`, `budget_band`, `timeline`).

| | |
|---|---|
| Fields the schema accepts that no form sends | **ten** — `track`, `service_slug`, `role`, `payload`, `source`, `medium`, `campaign`, `referrer`, `landing_page`, `is_ai_referral` |
| Of those, read by the server action from submitted `FormData` | **seven** — `role`, `source`, `medium`, `campaign`, `referrer`, `landing_page`, `is_ai_referral` |
| Not read by the server at all | three — `track`, `service_slug`, `payload` |

**Two things Pass 4 got wrong here, found by counting.** (a) It said *"two of which the server action
reads from submitted form data"*, citing `action.ts:51-52` where `referrer` and `landing_page` are
read. The same block reads five more. It is **seven**, not two. (b) It left `role` in the
already-published "not sent" enumeration; `action.ts` reads `role`, so it belongs with the seven.

The enumeration is replaced with a complete list plus the general statement, because **an enumerated
list in a privacy notice reads as exhaustive** and the previous one named four of ten. A sentence was
added saying plainly that nothing on the site fills these and nothing derives them — `referrer` and
`landing_page` hold URLs and are the fields here most likely to become personal data if anything ever
starts sending them. **Pass 4 §2.11 holds in substance; its count did not.**

### 2.3 §6A — the two-script claim made conditional.

`lib/analytics/load.ts` guards each injection on its own id (`if (GA4_ID)`, `if (POSTHOG_KEY)`) and
`lib/analytics/config.ts` defaults both to `''`. The unconditional sentence was a true observation of
a development environment generalised into a statement about every environment, and it was wrong **in
the visitor's favour** wherever the ids are unset. It is now conditional, and a `[TK]` records that no
reading has ever been taken from the environment this notice will be published from — round 6 found
Vercel production unreachable and previews behind SSO.

**The non-initialisation half was deliberately left unconditional**, with a comment saying why: it
does not depend on configuration, and it was settled by measurement at round 6 on a build where the
ids were confirmed present on the served page. That measurement is not to be re-litigated from source.
**Pass 4 §2.12 holds. Pass 4 §2.13 is closed by round 6 and was not reopened.**

### 2.4 Two flags closed.

`CNV-3` — the §3A note saying PECR reg. 23's text had not been retrieved. It has now been fetched and
read: reg. 23 prohibits marketing mail where the sender's identity is *"disguised or concealed"* or
where *"a valid address to which the recipient … may send a request that such communications cease
has not been provided"*, and it carries **no individual-subscriber limitation**, unlike reg. 22(1).
The corporate-subscriber sentence is correct as drafted and no longer rests on a summary.

`L-DPA-FEE`'s Schedule citation at §1A. SI 2018/480's contents page was fetched: the instrument has
**one** Schedule, titled **"Exempt Processing"** (para. 1 interpretation, para. 2 exempt processing).
The bands are in reg. 2(3)(b) and (c). Corrected in the clause comment and in the ledger entry.
**Pass 4 §2.6 holds.**

## 3. `COOKIE-POLICY.md` — version 1.2

One change: §4's two-script row is made conditional, in the same words as `PRIVACY-POLICY.md` §6A,
with a comment requiring the two to change together or not at all. **Pass 4 §2.12 holds.**

**§4A was not touched.** The ICO quotations there are the owner's to settle with the solicitor and are
left flagged exactly as they were. Pass 4's own limit 1 — that it did not independently retrieve
them — stands unresolved and is not this round's to close.

§2's complete cookie list and §4's *"no analytics cookie is set in any state"* were confirmed by
measurement at round 6 and are unchanged.

## 4. `ACCESSIBILITY-STATEMENT.md` — version 1.2

### 4.1 §3's figures re-verified. Unchanged, and correct.

| Claim in §3 | Re-counted from | Result |
|---|---|---|
| 36 token pairs / 148 cells | `check-contrast.mjs:45-46`, hard-failed at :288 and :352 | **correct** |
| 15 axe routes, 11 public + 4 internal | `check-axe.mjs` `ROUTES` — 15 entries; internal are `/_kitchen-sink`, `/_master-sink`, `/_gridsmith-404-probe`, `/gridsmith-error-probe` | **correct** |
| 2 viewports × 2 scroll states, 60 analyses | `VIEWPORTS` (375px, 1280px), `PHASES` (initial, scrolled); 15 × 2 × 2 = 60 | **correct** |

**The client-terms split did not move this count.** `ROUTES` contains `/legal/privacy` and no other
legal path, so adding two slugs to the site added two **unaudited** pages and left the audited count
at 15. That was the specific risk this round was asked to check and it did not materialise here — it
materialised in §4.3.

### 4.2 §4.3 — the count that the split *did* move.

The lead sentence read *"Four of our five legal pages are outside the automated audit"* while the list
beneath it named **six** routes. The sentence was written in the five-slug era; the list was updated
when the routes were split; nobody updated the sentence, so the paragraph contradicted itself.
`lib/legal/slugs.ts` declares **seven** slugs — `privacy`, `cookies`, `terms`, `client-terms`,
`business-client-terms`, `consumer-client-terms`, `accessibility`. One is audited. **Six are not.**
Corrected in §4.3, in §2's `[TK]` which repeated it, and in the `[TK]` index.

This is worth naming as a class rather than an instance: **a count in prose and a list beneath it are
two statements of the same fact, and only one of them gets updated.** Both derive from the same
source and should be read together whenever either changes.

### 4.3 Nothing was added.

No claim in this document was strengthened. The screen-reader pass still has not happened, §6 still
says so plainly, and §2 still cannot say more than "partially conformant".

## 5. Findings NOT applied, and why

**`04-VERIFICATION-REPORT.md` §2.1 and §4.5 — the PECR penalty ceiling. REJECTED, at round 4.** Pass 4
proposed replacing *"4% of turnover"* with *"£8.7m or 2%"*. Round 4 read the provision and found the
proposed correction inverted the tiering: **reg. 6 is inside the PECR Sch. 1 para. 18(b)(ii) list, so
it sits in DPA 2018 s. 157(2)(a) and attracts the HIGHER maximum — £17.5m or 4%** (`L-PECR-PENALTY`).
This is the *"1 failing uncited statement"* in Pass 4 §4, and it is now **cited rather than removed**.

**It does not land in any of these four documents.** A grep for every form of the figure across
`PRIVACY-POLICY.md`, `COOKIE-POLICY.md`, `ACCESSIBILITY-STATEMENT.md` and `MSA-BUSINESS.md` returns
nothing. The statement lived in `CLAUDE.md` #7 and `00-LEGAL-BASIS.md` §2.1, both corrected at round
4. Nothing was done to it here, and **the 2% / £8.7m figure is not to be reintroduced.**

**Pass 4 §2.11's "two of which the server action reads". REJECTED on the count.** It is seven. See
§2.2 above. The finding's substance — that the enumeration is incomplete — holds and was applied; its
arithmetic did not and was not.

**Pass 4 §2.3's "ten public routes plus five internal probe routes". REJECTED on the count**, as it
already was at round 5. Four internal, eleven public. Re-counted again here and unchanged.

**Pass 4 §2.13 — the GA4 cookie contradiction. NOT REOPENED.** Settled by measurement at round 6: the
scripts load and never initialise, and `gs_consent` is the only cookie in any state.
`COOKIE-POLICY.md` §2 and §4 were confirmed correct. Pass 4 could not settle it from source and said
so; the answer did not come from source and will not.

**Pass 4 §2.7, §2.10, §2.14 — out of scope.** §2.7 lands in `CONSUMER-TERMS.md`, §2.10 in
`WEBSITE-TERMS.md`, both of which Pass 4 cleared for a solicitor. §2.14's two mis-descriptions are in
ledger entries (`L-DMCC-230`'s heading, `L-CA-82 / L-TDR-24`'s reg. 24(2)) whose substance is right
and which no clause in these four documents relies on. All three remain open.

## 6. Ledger entries added

Both close a `NO LEDGER ENTRY` flag that stood on a clause carrying a specific figure or a specific
section with no primary citation.

- **`L-LATE-PAYMENT`** — LPCD(I)A 1998 ss. 5A(1), 5A(2), 5A(2A) and s. 6, with SI 2002/1675 art. 4.
  Records where the 8% actually lives, the three fixed sums, s. 5A(2A) recovery costs, and the
  30 June / 31 December reference-rate mechanic. B2B only.
- **`L-CDPA-90-91`** — CDPA 1988 ss. 90(1)–(3) and 91(1)–(2). Records why s. 91 is the operative
  section for a deliverables clause signed before the deliverables exist.

Both sit in a new **section I — Business contract terms**. `L-ECOM-9-11` was amended in place with the
corrected excludable set and the reg. 9(4) / reg. 11(3) carve-out; `L-DPA-FEE`'s Schedule citation was
corrected in place. Each amendment records what it replaced.

## 7. State after this round

| Document | Version | `[TK]` markers | `[DECISION REQUIRED]` |
|---|---|---|---|
| `PRIVACY-POLICY.md` | 1.2 | 35 | 6 |
| `COOKIE-POLICY.md` | 1.2 | 5 | 2 |
| `ACCESSIBILITY-STATEMENT.md` | 1.2 | 10 | 3 |
| `MSA-BUSINESS.md` | 1.2 | 11 | 3 |

Raw marker counts including the index lines at the foot of each document, which repeat markers rather
than adding them. Three `[TK]`s and one `[DECISION REQUIRED]` are new in this round — the client-side
Art. 13(2)(e) statement, the live-environment analytics ids (counted once in each of the two policies
that assert the behaviour), the two open CDPA questions at MSA 8.3, and whether MSA clause 15 is
retained. None resolves anything by guessing.

## What this round did not do

- **No `[TK]` or `[DECISION REQUIRED]` was resolved.** Every one is an owner fact, a build fact, or a
  solicitor's judgement, and none became knowable in this round.
- **The `[SEED - SOLICITOR REVIEW REQUIRED]` banner on all four documents is untouched.**
- **`COOKIE-POLICY.md` §4A's ICO quotations were not verified and not edited.**
- **No gate was run.** §3's contrast and axe figures were read from the gates' own literals and their
  `ROUTES` / `VIEWPORTS` / `PHASES` arrays, which is what the arbitration rule requires. Neither gate
  was executed, and this round therefore establishes that the published figures **match the gates**,
  not that the gates measure what they claim.
- **Nothing was committed.**

---

*End of round 7.*
