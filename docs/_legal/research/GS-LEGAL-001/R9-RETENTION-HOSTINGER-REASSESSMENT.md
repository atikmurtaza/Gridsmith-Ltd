# GS-LEGAL-001-R9 — retention closure and Hostinger reassessment

**Date:** 7 October 2026. **Branch:** `claude/sweet-mendel-11qvli`, from R8 HEAD
`51bcfb504d590cf5df2fd506b3cbca918d6d4543` (CI `37672480871`, success on the first attempt).
**Workflow:** all work, review, fixes and verification were done locally before a single R9 commit.

**Result: HOSTING DOCUMENTATION REQUIRED.**
- **`RETENTION-ROUTINE-OPERATING`:** evidenced and recorded (§2).
- **`HOSTINGER-PROCESSOR-CHAIN`:** **residual documentation required** (§3).
  - **The infrastructure can stay.** UK GDPR does not require Gridsmith Ltd to be Hostinger's named
    customer, and no purchase or migration is needed.
  - But Hostinger's own terms treat the Account-information owner, not Gridsmith, as the owner of the
    Account's data and services. So Gridsmith's Art. 28(3) contract with Hostinger is **not evidenced
    by those terms alone**.
  - R8's "move under a Gridsmith-customer account" is withdrawn. The minimum documentary steps are in
    §3.4.
- **Privacy 2.2:** byte-identical, 0 markers, `OWNER_REVIEW_REQUIRED`, **not ready for adoption**.
- **Publication** still needs `H4-B-INTAKE-PROMOTED` and `CUTOVER-AUTHORITY`. Neither was begun.

This record is not legal advice and claims no solicitor review. No other business is named, and no
account history is described.

## 1. Owner decisions and facts (R9)

- **Infrastructure (fixed):** Gridsmith continues on the existing Hostinger Business infrastructure:
  - the static/hybrid production architecture, with zero persistent Hostinger Node runtime;
  - temporary Hostinger staging as the hosted verification environment;
  - dynamic boundaries on the approved external services.

  Not required, and not recommended as a prerequisite for anything: a new Hostinger account,
  subscription, domain, domain hosting or VPS, a migration, or any purchase.
- **Operational fact:** Gridsmith's admin department manages the hosting account.
- **Known facts:** the website is hosted in France, Europe (E-2); email hosting is Hostinger Business
  Email and Webmail.
- **Retention:** the owner personally and permanently deleted
  `supabase-production-20261002T125412Z.dump` from the Windows Recycle Bin (owner attestation).

## 2. Retention closure

| Check (read-only) | Result |
|---|---|
| Original path `%USERPROFILE%\gridsmith-backups\supabase-production-20261002T125412Z.dump` | **Absent** |
| Recycle Bin item of that exact name | **Not present** (matched on the exact name only; no other item was read) |
| Owner attestation | Permanently deleted (R9) |
| Production `dqiutgmxillhsbzgnlsx` leads (2026-10-07T21:16:46Z) | **0**; `sample_grants` 0, `press_path_results` 0; ledger 0001–0004 unchanged |
| R7 baseline JSON | **Kept** until the Mon 2 November 2026 monthly run (checklist B step 7) |
| Other backups | Untouched |

**Conditions (the R8 brief, Task 10):**

| # | Condition | State |
|---|---|---|
| 1 | Initial classification | Met (R7) |
| 2 | Authorised cleanup | Met (R7) |
| 3 | Obsolete dump handled | **Met** (R9: owner attestation plus the two read-only checks above) |
| 4–6 | Database, email and WhatsApp/SMS reviews | Met (R8, 7 October 2026) |
| 7 | First review logged | Met |
| 8 | Cadence recorded | Met: monthly Mon 2 Nov 2026; quarterly Mon 4 Jan 2027; annual Mon 1 Mar 2027 |
| 9 | Retained evidence controlled | Met (the R7 baseline, outside the repository, held until 2 Nov) |

- **Restore-test container:** non-blocking housekeeping, by the R8 owner instruction. It held probe rows
  only, and Docker was not running.
- **No requirement was added.**
- **`RETENTION-ROUTINE-OPERATING`: EVIDENCED.** It is recorded in the register's privacy
  `prerequisitesMet`.
- **Operator:** Atik Murtaza, through Gridsmith's admin department. **Deputy:** none appointed
  (recommended for resilience only).
- **The external log has the R9 line.**

## 3. Hostinger: first-principles reassessment

### 3.1 Primary sources read (7 October 2026; verbatim quotes)

**UK GDPR Art. 28** (legislation.gov.uk, latest revised version listed 30/09/2026):
- (1) the controller "shall use only processors providing sufficient guarantees";
- (2) a processor shall not engage another processor "without prior specific or general written
  authorisation";
- (3) processing by a processor "shall be governed by a contract or other legal act under domestic law,
  that is binding on the processor with regard to the controller";
- (4) "Where a processor engages another processor for carrying out specific processing activities on
  behalf of the controller", the same data protection obligations flow down.

**ICO, "What needs to be included in the contract?"** (ico.org.uk, UK GDPR guidance, accountability and
governance, contracts and liabilities between controllers and processors; read 7 October 2026; an
independent re-read hit a 404, so treat the wording as read once):
- the contract must include the Art. 28(3) details;
- a processor's sub-processor contract must impose "the same Article 28(3) data protection obligations".

It states no rule on who must be a party.

**Hostinger Terms of Service** (revised 2026-09-29 14:31:57):
- **§1:** "The terms “you”, “your”, “User” or “Customer” shall refer to any individual or entity who
  accepts the Agreement, has access to Customer account at Hostinger (“Account”) or uses the Services."
  The Agreement is effective "as of the date of your use of the Site or the date of electronic
  acceptance thereof, whichever occurs earlier".
- **§2:** the DPA is "incorporated into the Terms of Service by reference". For the UK, the contracting
  entity is Hostinger UK Limited.
- **§3:**
  - "If you are entering into this Agreement on behalf of a corporate entity … (in such cases, the terms
    “you”, “your”, “User” or “Customer” shall refer to such corporate entity)."
  - "You further agree to be bound by this Agreement for transactions entered into by you, anyone acting
    as your agent and anyone who uses your account or the Services, whether or not authorized by you."
- **§4:**
  - **"For the avoidance of doubt, the individual or entity whose data is listed in the ‘Account
    information’ section of Account is considered to be the owner of the Account and the data and
    Services contained therein (excluding the domain names, if any)."**
  - Access may be granted "to another Hostinger customer" and revoked "at any time".
  - "It is your obligation to ensure that you correctly indicate ownership of your Account."
- **§22:** Luxembourg law, subject to mandatory local law.

**Hostinger DPA** (revised 2026-09-29 11:49:03):
- **Preamble:** between Hostinger "and you (“Customer”)".
- **§2.2:**
  - "If Customer is a Controller of the Customer Data" (disclosure duties).
  - "If Customer is a Processor of the Customer Data, Customer warrants that Customer’s instructions
    and actions with respect to Customer Data, including the appointment of Hostinger as another
    Processor, have been authorized by the relevant Controller."
  - The processing purposes include "other documented, reasonable instructions provided by Customers".
- **§7.4:** "Notification of Security Incidents, if any, will be delivered to one or more of Customer’s
  administrators"; "It is Customer’s sole responsibility to ensure Customer’s administrators maintain
  accurate contact information".
- **§9:** "As of the date of Data Exporter’s electronic acceptance of Data Importer’s Terms of Service",
  "Data Exporter is deemed to have signed these EU Standard Contractual Clauses"; the UK Addendum
  applies (§9.3).
- **Appendix 1:** the data subjects include "Customer’s users authorized by Customer to use the Covered
  Services".

**Correction of R7 and R8:** both recorded the DPA's "Customer" as "the party entering into the
agreement", which was a tool paraphrase. The verbatim preamble is "you (“Customer”)". That correction
does **not** help Gridsmith here, for the reasons in §3.2.

### 3.2 The ten questions

| # | Question | Answer |
|---|---|---|
| 1 | Is Gridsmith the controller of the gridsmith.uk personal data? | **Yes** |
| 2 | Does Hostinger process website and email data on infrastructure Gridsmith's admin department manages? | **Yes.** Hostinger is Gridsmith's processor in substance |
| 3 | Is the Account's owner (the Account-information entity) another party? | **Presumed, not verified.** R8 established that the billing customer of record is another party; what Account information currently lists has not been checked. No identity is recorded |
| 4 | Does Art. 28 require Gridsmith to be Hostinger's *named account customer*? | **No.** Art. 28(3) requires a contract "binding on the processor with regard to the controller". It does not require the controller to be the purchaser or the account owner. A controller can be covered through a chain in which its own processor contracts with it under Art. 28(3), and that processor's sub-processor is bound under Art. 28(4). The ICO page states no party rule |
| 5 | Is Gridsmith covered by Hostinger's terms directly, as a "user"? | **Not established.** The ToS §1 "you" definition is disjunctive and reaches anyone who "has access" or "uses the Services". But three provisions point the other way. **(i) ToS §4:** the Account-information entity "is considered to be the owner of the Account and the data and Services contained therein". **(ii) ToS §3:** that owner is bound for "anyone who uses your account … whether or not authorized by you". **(iii) DPA Appendix 1:** "Customer's users authorized by Customer" appear as data subjects, apart from the Customer. The §3 corporate-entity limb applies only where someone entered into the Agreement on behalf of Gridsmith Ltd, and no such fact is recorded. On the face of the terms, Hostinger's DPA commitments for this Account run to its owner |
| 6 | Do Hostinger's terms permit a lawful structure without migration? | **Yes, two ways.** (a) The DPA expressly contemplates a Customer acting as **processor** for another controller, with Hostinger as "another Processor" (§2.2). (b) The account owner must "correctly indicate ownership" in Account information (ToS §4) |
| 7 | Is there a genuine Art. 28(3) documentation gap? | **Yes, a documentation gap, not unlawful infrastructure.** Today nothing on record binds Hostinger with regard to Gridsmith Ltd, and nothing binds the Account owner to Gridsmith Ltd. Hostinger's safeguards exist (DPA, SCCs, UK Addendum), but they run to the Account owner. Its security-incident notices go to that owner's administrators (§7.4). The SCCs are deemed signed on that owner's electronic acceptance (§9) |
| 8 | Can it be documented without changing infrastructure? | **Yes** (§3.4) |
| 9 | What does it affect: Privacy, governance or lawfulness? | **Privacy:** §6 is accurate ("Hostinger's data processing terms apply to the hosting account through which we receive its service" stays true). §7's "we rely on the safeguards in each provider's data processing terms … for … Hostinger" is only as true as the chain behind it. **Lawfulness and governance:** the Art. 28(3) record is incomplete until §3.4 is done. **Transfers:** the UK-to-France leg relies on UK adequacy for the EEA. The SCC/UK Addendum point concerns Hostinger's onward transfers (for example Cloudflare) |
| 10 | Does it block owner adoption of Privacy 2.2? | **Yes, as the gate is designed.** Adoption needs `HOSTINGER-PROCESSOR-CHAIN` evidence because §7 states reliance on Hostinger's safeguards as a present fact. It is not a publication-only matter. Once route A in §3.4 is done, no Privacy text changes |

**Outcome classification: B, not A.**
- The existing Hostinger infrastructure may continue. Hostinger is not unusable, and Gridsmith need not
  be its named customer.
- What Gridsmith needs is **documented contractual coverage** that puts Hostinger's processing of
  gridsmith.uk data under an Art. 28(3) arrangement with regard to Gridsmith Ltd.

### 3.3 Residual operational risks (to keep in view under any route)

| Risk | Basis |
|---|---|
| The Account owner can revoke Gridsmith's access, and ownership disputes block access | ToS §4; Art. 32(1)(b)–(c) |
| Security-incident notices go to the Customer's administrators | DPA §7.4; Art. 33 |
| The SCCs are deemed signed on the Customer's electronic acceptance | DPA §9 |

### 3.4 Minimum steps that keep the existing infrastructure (owner's choice; none involves a purchase, new hosting, new domain, VPS or migration)

| Route | What | Effect | Privacy text |
|---|---|---|---|
| **A — Account information** | **First check what Account information currently lists.** If it already lists Gridsmith Ltd, element 7 may already be met. Otherwise the Account owner corrects it so that it lists **Gridsmith Ltd** ("correctly indicate ownership", ToS §4), with the Terms accepted on Gridsmith Ltd's behalf (ToS §3) | Gridsmith Ltd becomes the Account owner and "Customer". The DPA binds Hostinger with regard to it, the SCCs are deemed signed on Gridsmith Ltd's electronic acceptance (DPA §9), and notices go to Gridsmith's administrators. It needs the current owner's cooperation, and Gridsmith Ltd takes on the Terms' obligations, including payment. It is not a purchase or a migration. Domain registration is unaffected (§4 excludes domain names) | **Unchanged.** But first check that the Account holds **only** Gridsmith's sites, data and mail. §4 would make Gridsmith the owner of everything "contained therein" |
| **B — Documented chain** | A short written arrangement, held outside the repository, between Gridsmith Ltd and the Account owner. The owner holds the Account and instructs Hostinger for gridsmith.uk data only as Gridsmith Ltd directs, with Art. 28(3) terms, authorising Hostinger as sub-processor under its DPA (DPA §2.2 "Customer is a Processor"; Art. 28(2) and (4)) | Covers the chain without touching the Account | **Changes.** The Account owner becomes a processor and so a recipient (Art. 4(9)). §6 needs a recipient category, and §7 needs coverage if that owner is outside the UK and EEA. Then a re-hash, a review and A-1 |
| C — Hostinger confirmation (supporting only) | A written statement from Hostinger on how its DPA treats a corporate user that manages an Account it does not own | Could clarify. Given ToS §4 it is unlikely on its own to establish coverage, so it is not a route by itself | — |

**Least disruptive:** route **A**, if the Account holds only Gridsmith's services. Otherwise route **B**.
Neither is a migration. This record does not choose between them; the owner does.

### 3.5 `HOSTINGER-PROCESSOR-CHAIN` — final classification: **RESIDUAL DOCUMENTATION REQUIRED**

| Element (R8 §2.3) | R9 |
|---|---|
| 1–2 Gridsmith manages the hosting; its admin department manages the account | Met (owner) |
| 3–5 Hostinger infrastructure; France; Hostinger Business email | Met (E-2; R9 owner facts; DPA §1.1) |
| 6 Privacy describes them accurately | Met for §6; §7 depends on element 7 |
| 7 ~~Gridsmith Ltd is the Customer, by moving the website and mailbox under a Gridsmith Ltd Customer account (R8)~~ **An Art. 28(3) arrangement binds Hostinger's processing of gridsmith.uk data with regard to Gridsmith Ltd, and Hostinger's notices reach Gridsmith** | **Not met.** Closed by route A or route B (§3.4). No migration |

The key is **not** recorded in `prerequisitesMet`.

## 4. Privacy 2.2

| | |
|---|---|
| Version | 2.2 |
| sha256 | `2404a1cfd985ae5a2e248b605075260558b28990d999d6612795ff48050d8c1e` (**byte-identical**; no change) |
| Markers | 0 |
| State | `OWNER_REVIEW_REQUIRED`; no adoption fields |
| Adoption evidence | `RETENTION-ROUTINE-OPERATING` recorded; `HOSTINGER-PROCESSOR-CHAIN` **not** (§3.5) |
| **Adoption readiness** | **Not ready:** element 7. Once route A in §3.4 is done, Privacy needs no text change and becomes ready. Route B requires a §6/§7 edit first |
| Publication readiness | Not ready: `H4-B-INTAKE-PROMOTED` and `CUTOVER-AUTHORITY` |

**When ready** (later), adoption is the owner's explicit instruction. It sets:
- the adoption fields;
- the publication prerequisites (`CUTOVER-AUTHORITY`, `H4-B-INTAKE-PROMOTED`);
- the Effective-date header.

The adopted hash is therefore that of the post-header file, as with the R4 adoptions, and A-1 then
re-runs.

**No Sanity write** (Privacy unchanged).

## 5. Verification and review

### 5a. Results

**Local verification** (all before the single R9 commit):
- Clean `next build` against `development`: EXIT 0. Served on port 3217:
  - `check:legal:parity` PASS: 6 documents, 107 clauses, 437 paragraphs; banners match the register;
  - `check:consumer-terms` PASS;
  - `check:company` PASS (10 questions, 18 routes);
  - `check:launch` PASS (reports `development`);
  - `check:vat` PASS.
- `verify:static` EXIT 0 on the final state. It includes:
  - `check:legal:adoption` PASS;
  - adoption selftest 103;
  - legal-parity selftest 39;
  - company selftest 80;
  - migration dry run: 47 eligible, 10 gated;
  - `check:struck`.
- **Evidence-key proof** (working copy; register restored byte-identical). It was run while the draft
  still recorded both keys:
  - a simulated adoption that kept the recorded `prerequisitesMet` was refused only on the
    Draft/Effective-date header items;
  - the control, with empty evidence, also flagged both keys.

  This shows the gate reads `prerequisitesMet`. In the final state, only `RETENTION-ROUTINE-OPERATING` is
  recorded.
- **Byte checks:**
  - Privacy sha256 `2404a1cf…`, unchanged;
  - the six adopted drafts and `scripts/seed-legal.mjs` are unchanged;
  - fingerprints match;
  - 0 markers.
- `git diff --check` clean. No credentials, personal data, or hosting identity or history in the diff.
- **Production, read-only:** leads 0; ledger 0001–0004.
- **No Sanity write.**

**Independent review:** one fresh read-only reviewer re-fetched the primary sources.

**Result:** 3 HIGH, 5 MEDIUM, 6 LOW, plus NOTEs. **The HIGH findings overturned the first R9 draft's
conclusion.** That draft had read ToS §1/§3 as making Gridsmith Ltd a DPA "Customer".

**HIGH:**
1. **H1:** ToS §4's owner-of-Account clause had been left out.
2. **H2:** DPA Appendix 1 and the full §3 quote point the other way.
3. **H3:** the §3 corporate limb rested on an unrecorded fact.

**Outcome:** reclassified **RESIDUAL DOCUMENTATION REQUIRED**, with the key removed from
`prerequisitesMet`.

**MEDIUM:**
1. **M1:** Art. 28(4) was misused; it is now confined to the chain route.
2. **M2:** the SCC deemed-signature and adequacy limits are recorded.
3. **M3:** the notice limb is restored to element 7.
4. **M4:** this section was missing.
5. **M5:** the evidence checklist overstated closure.

**LOW:**
1. **L1:** the DPA §7.4 citation.
2. **L2:** an exact §2.2 quote.
3. **L3:** stale checklist text struck.
4. **L4:** in-place strikes and annotations.
5. **L5:** moot after the reclassification.
6. **L6:** the ICO read is noted as single.

**Narrow re-check:** no HIGH or MEDIUM remains. Three LOW wording points were fixed:
- the Account-information entity is presumed, not verified, so route A starts by checking it;
- route A's SCC effect requires the Terms to be accepted on Gridsmith Ltd's behalf;
- "no inter-company agreement required" is not a prohibition, since route B is one.

Its NOTEs on route A (the owner's cooperation; Gridsmith takes on the Terms' obligations; domains
unaffected) are recorded in §3.4.
