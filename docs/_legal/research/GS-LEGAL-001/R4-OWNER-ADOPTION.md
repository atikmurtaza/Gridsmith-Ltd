# GS-LEGAL-001-R4 — owner adoption of six legal documents

**Date:** 7 October 2026.
**Branch:** `claude/sweet-mendel-11qvli`, from R3 HEAD `7b61e3bc07c1d813aff036e90456a1fb05719232`.
**Result:** six documents are `OWNER_ADOPTED`. Privacy Policy 2.1 is **not adopted** and stays
`OWNER_REVIEW_REQUIRED`. **Nothing is `PUBLISHABLE`, published or deployed.**

This record adds to the R1–R3 records and does not rewrite them. The only change to an earlier record is
the OC-1 addendum appended to `R3-OWNER-DECISIONS-APPLIED.md` §12. Owner adoption follows an
evidence-based internal review. It is **not** solicitor review, certification, or a guarantee of
compliance or enforceability, and nothing in this phase says otherwise.

## 1. Authority

The owner's instruction for `GS-LEGAL-001-R4` (7 October 2026):
- adopts the six documents below, in the exact versions reviewed in the R3 adoption package
  (`R3-OWNER-DECISIONS-APPLIED.md` §12);
- confirms OC-1;
- directs that Privacy Policy 2.1 is not adopted.

The register records this instruction as `adoptionAuthority` on each adopted entry. `check:legal:adoption`
refuses any adopted entry that lacks one, so a state change made by a script or an agent without the
owner's instruction is visible rather than looking like an adoption.

## 2. What was adopted

| Document | Route | Version | `ownerAdoptedOn` | State | Header | Publication prerequisites (all outstanding) |
|---|---|---|---|---|---|---|
| Client Terms for Business Clients | `/legal/business-client-terms` | **3.1** | 2026-10-07 | `OWNER_ADOPTED` | Effective date: 7 October 2026 | CUTOVER-AUTHORITY; PRIVACY-PUBLISHABLE |
| Client Terms for Consumers | `/legal/consumer-client-terms` | **3.1** | 2026-10-07 | `OWNER_ADOPTED` | Effective date: 7 October 2026 | CUTOVER-AUTHORITY; PRIVACY-PUBLISHABLE |
| Website Terms of Use | `/legal/terms` | **2.1** | 2026-10-07 | `OWNER_ADOPTED` | Effective date: 7 October 2026 | CUTOVER-AUTHORITY; PRIVACY-PUBLISHABLE |
| Cookie Policy | `/legal/cookies` | **2.1** | 2026-10-07 | `OWNER_ADOPTED` | Effective date: 7 October 2026 | CUTOVER-AUTHORITY; PRIVACY-PUBLISHABLE; **A-2-PRODUCTION-COOKIE-RETEST** |
| Accessibility Statement | `/legal/accessibility` | **2.1** | 2026-10-07 | `OWNER_ADOPTED` | Effective date: 7 October 2026 | CUTOVER-AUTHORITY; PRIVACY-PUBLISHABLE |
| Client terms (disambiguation page) | `/legal/client-terms` | **2.1** | 2026-10-07 | `OWNER_ADOPTED` | `effective: 2026-10-07` in `scripts/seed-legal.mjs` | CUTOVER-AUTHORITY; PRIVACY-PUBLISHABLE |

**Not adopted:**

| Document | Version | State | Why |
|---|---|---|---|
| Privacy Policy | 2.1, Draft date 6 October 2026 | `OWNER_REVIEW_REQUIRED`; `ownerAdoptedOn` and `ownerAdoptedVersion` remain `null` | Three open `[OWNER DECISION]` markers: §6 processor terms, §7 transfer safeguards, §8 retention. See §4 |

**Why `OWNER_ADOPTED` and not `PUBLISHABLE`.** The state model makes `PUBLISHABLE` a separate step. Each
adopted entry lists the prerequisites that must have recorded evidence in `prerequisitesMet` (empty
today) before it can move:
- **CUTOVER-AUTHORITY:** the owner authorises the production cutover that publishes `/legal/*`.
- **PRIVACY-PUBLISHABLE:** the other documents refer readers to the privacy policy, and the forms must not
  collect data before it is live.
- **A-2-PRODUCTION-COOKIE-RETEST** (Cookie only): the production cookie retest at cutover.

## 3. OC-1 — CONFIRMED BY OWNER

**Meaning.** For a retainer or other periodic Scope, Business §16 limb (ii) uses the fees for the
**notional first 12 months** of the Scope, even where a rolling retainer ends earlier.

**The wording (Business 3.1 §16 ¶2, unchanged from R3):**
> "… the greater of (i) the fees paid and payable in the 12 months before the event giving rise to the
> claim and (ii) the fees payable for the first 12 months of that Scope (or, where the Scope has a fixed
> term shorter than 12 months, for that term), whether or not the Scope continues for that period,
> calculated at the periodic fee or rates stated in the Scope …"

**Verification (R4), clause by clause:**

| Provision | Interaction | Result |
|---|---|---|
| §16 limb (ii) | "whether or not the Scope continues for that period" makes the 12 months notional. "Calculated at the periodic fee or rates stated in the Scope" fixes the amount without depending on fees actually becoming payable | Expresses OC-1 |
| §16 "fixed term shorter than 12 months" | A rolling retainer has no fixed term, so the full 12 months applies. Only a Scope with a stated shorter fixed term uses that term | Consistent |
| §6.2 — the client may end a project at any time | Ending early does not reduce limb (ii), as OC-1 intends | No contradiction |
| §7 — termination and suspension by Gridsmith | The cap concerns liability, not fees owed on termination, so §7 does not interact with it | No contradiction |
| §5 / §16 ¶4 — payment | "Nothing in this clause limits the client's obligation to pay": the notional figure measures our liability only and creates no fee obligation | No contradiction |
| §16 ¶1 — non-excludable liabilities | Preserved | No contradiction |
| "A different limit stated prominently in a Scope" | Overrides only for that Scope | No contradiction |

The liability architecture was not reopened. The wording is unchanged.

## 4. Privacy — why it stays unadopted

- **§6 marker:** processor terms accepted on the Hostinger, Supabase and Resend accounts. Needs owner
  checks P-02, P-05 and P-07.
- **§7 marker:** the safeguard per provider. Supabase is known (the UK Addendum in its DPA); Resend and
  Hostinger need P-02, P-07 and P-10.
- **§8 marker:** retention. The routine is **not operating**, and the provider periods need P-04, P-06,
  P-09 and P-12.
- **Also:** the "server functions" sentence describes the Supabase Edge Function intake. That intake is
  deployed only to Preview today; Production has no Edge Functions (re-verified read-only in R4). It
  becomes true only when H4-B is promoted at cutover.

No provider fact was filled in by inference. The checklist is
`../../operations/PRIVACY-EVIDENCE-CHECKLIST.md` and the change plan is `R4-PRIVACY-2.2-CHANGE-PLAN.md`.
The gate keeps Privacy blocked by construction: `stateProblems` refuses `OWNER_ADOPTED` for a draft with
an open marker or a Draft date, and `registerProblems` refuses adoption metadata on an unadopted entry.

## 5. Packs prepared

| Pack | Files | Status |
|---|---|---|
| **Rights chain** | `../../operations/rights-chain/` README plus 01–07 | Templates only; nothing signed |
| **Privacy owner evidence** | `../../operations/PRIVACY-EVIDENCE-CHECKLIST.md`: P-01 to P-12 | No check answered |
| **Privacy 2.2 change plan** | `R4-PRIVACY-2.2-CHANGE-PLAN.md` | Not applied |
| **Retention activation** | `../../operations/RETENTION-ACTIVATION-CHECKLIST.md` | Routine not operating; nothing deleted |

**Rights-chain templates:**
- 01: owner assignment and waiver (needed in every case);
- 02: employee IP clause (only if anyone is employed);
- 03: individual subcontractor schedule, with the writer and ghostwriter addenda;
- 04: subcontracting-company schedule, with chain-of-title and procurement of 05;
- 05: individual moral-rights waiver;
- 06: client rights-assignment instrument, with consumer and business variants that follow Cons 13 and
  Bus 9.3 word for word;
- 07: title, AI-tool and third-party-licence register.

**Formalities**, verified only against the evidence already collected, as set out in the README:
- s. 90(3), s. 91 and s. 87 were read at source by B;
- design right and database right formalities remain **UNVERIFIED**;
- whether s. 91 needs consideration remains **UNVERIFIED**;
- the templates are not deeds.

**Owner employment status: unknown and not assumed.** Template 01 is needed whatever the answer; template
02 depends on it.

## 6. Development reseed (A-1) — NOT EXECUTED

**Precondition failed: project and dataset identity could not be proven, so nothing was written.**
- `https://spzu6y31.api.sanity.io/…/data/query/development` was refused by this environment's egress proxy
  (`CONNECT tunnel failed, response 403`, re-tested in R4).
- No Sanity token is present in the environment, there is no `.env.local`, and no Sanity connector is
  attached.

The brief says to stop rather than write where identity is ambiguous, and a dataset that cannot be read
cannot be identified. **No Sanity dataset, development or Production, was read or written.**

**To run A-1 later:**
- allow `spzu6y31.api.sanity.io` in the environment's network access;
- provide a development-scoped write token as an environment secret;
- prove identity read-only (the project id, the `development` dataset, and the current `seed-legal-*`
  documents);
- then write only the seven `seed-legal-*` documents.

**Parity instead:** `check:legal:parity` ran against the real Next app in draft mode, with Sanity answered
locally from the repository's seeds through a scratch-only TLS-terminating proxy (as in R3). It confirms
the served pages match the drafts and the banner matches the state. It is **not** a reading of the
development dataset, which remains unreseeded.

## 7. Code and gate changes

| File | Change |
|---|---|
| `docs/_legal/GS-O003-R-REGISTER.json` | Six entries `OWNER_ADOPTED` (date, version, authority, prerequisites, `prerequisitesMet: {}`). The Business entry records OC-1. Privacy unchanged. New rule and state record |
| Five drafts | `**Draft date: …**` → `**Effective date: 7 October 2026**`. Privacy keeps its Draft date |
| `scripts/seed-legal.mjs` | `/legal/client-terms` effective 2026-10-07. `reviewedBy` "Adopted by Gridsmith Ltd on …" for adopted entries |
| `lib/legal/adoption.ts`, `app/(marketing)/legal/[slug]/page.tsx` | Three-way banner. `OWNER_ADOPTED` shows "ADOPTED, NOT YET PUBLISHED"; below that state, the existing "NOT YET ADOPTED" banner; `PUBLISHABLE` shows none. Meta label "Effective"; other-documents list annotations |
| `scripts/legal-parity-rules.mjs`, `check-legal-parity.mjs` (+ selftest, 39 assertions) | `bannerProblems(route, state, html)`: the served banner must match the register state |
| `scripts/legal-adoption-rules.mjs`, `check-legal-adoption.mjs` (+ selftest, **92 cases**) | See the rules list below |
| `scripts/migrate-production-cms.mjs`, `docs/_shared/GS-PROD-001-CMS-MANIFEST.json` | `OWNER_ADOPTED` legal documents are reported "Owner-adopted {v} on {date}; not PUBLISHABLE (prerequisites outstanding: …)". Manifest regenerated: 47 eligible, 10 gated, **0 legal eligible** |

**New rules in `legal-adoption-rules.mjs`:**
- `adoptionAuthority` is required once a document is adopted;
- the publication prerequisites are required, and Cookie's A-2 retest in particular;
- `PUBLISHABLE` needs evidence for every prerequisite;
- `crossRegisterProblems`: `PRIVACY-PUBLISHABLE` cannot be recorded as met while Privacy is not
  `PUBLISHABLE`;
- an adopted document must have no open markers, no Draft date and an Effective date;
- an adopted document's text must not say it is unadopted;
- forbidden claims extended to "lawyer approved", "guaranteed compliant/enforceable" and the obsolete
  solicitor gate ("subject to / pending / awaiting solicitor review, approval or sign-off").

**Task 8 coverage:**

| # | Must prove | Branch |
|---|---|---|
| 1 | Six documents carry the correct adoption metadata | `registerProblems` (date, version equals the draft, authority, prerequisites); `stateProblems` (Effective date) |
| 2 | Privacy does not | `registerProblems`: no adoption fields below `OWNER_ADOPTED` |
| 3 | No agent can accidentally mark Privacy adopted | Authority required, plus the marker, Draft-date and Effective-date rules. The real-gate proof gave 6 problems |
| 4 | Cookie keeps A-2 | `REQUIRED_PREREQUISITES.cookies` |
| 5 | No `PUBLISHABLE` without its own prerequisites | `prerequisitesMet` evidence rule, plus `crossRegisterProblems` |
| 6 | No `[SEED]`, solicitor gate, fake approval or contradictory state in the six | `MARKERS`, `FORBIDDEN_CLAIMS` (extended), `ADOPTION_CONTRADICTION`, and the parity `bannerProblems` on the served page |
| 7 | Privacy markers stay visible | `MARKERS` read from the draft; never stripped |

## 8. Proofs by deliberate failure

The mutation harness captures the file's bytes, mutates, runs and restores, then asserts the sha256 is
unchanged. It ran one harness at a time.

**Adoption-rule mutants:** each of the following went red on its named selftest case.
- the authority check removed;
- the empty-authority branch;
- the prerequisite loop;
- the PUBLISHABLE evidence loop;
- the adopted-marker loop, Draft-date rule and Effective-date rule;
- the cross-register condition (2 cases);
- the contradiction test;
- each new forbidden-claim pattern ("lawyer approved"; "guaranteed compliant/enforceable", 2 cases;
  "subject to solicitor approval").

**Banner-rule mutants:** red on all eight `bannerProblems` cases.

**Real gate, Privacy falsely adopted in the register:** 6 problems.
- no authority;
- missing CUTOVER-AUTHORITY;
- missing PRIVACY-PUBLISHABLE;
- an open `[OWNER DECISION` marker;
- still headed with a Draft date;
- no Effective date.

Restored byte-identical.

**Real gate, Website Terms claiming PRIVACY-PUBLISHABLE met:** 1 problem ("records PRIVACY-PUBLISHABLE
as met while the privacy entry is OWNER_REVIEW_REQUIRED"). Restored byte-identical.

**Served:** reverting the page banner made draft-mode parity red on exactly the five adopted drafts, 2
problems each. Green after restore.

## 9. Verification

Run on the working tree before the R4 commit, with Node 24.21.0:

| Check | Result |
|---|---|
| `check:legal:adoption` | PASS. Register coherent: privacy `OWNER_REVIEW_REQUIRED`; the other six `OWNER_ADOPTED` |
| `check:legal:adoption:selftest` | PASS, 92 cases |
| `check:legal:parity` (draft mode, real Next app, Sanity answered locally from the seeds) | PASS: 6 documents, 107 clauses, 429 paragraphs; served banners match the state ("ADOPTED, NOT YET PUBLISHED" ×6 incl. `/legal/client-terms`; Privacy "NOT YET ADOPTED") |
| `check-legal-parity.selftest` | PASS, 39 assertions |
| `check:consumer-terms` | PASS: 2 routes, 202 links, 0 to the business terms |
| `verify:static` | PASS (exit 0) |
| Migration dry run | PASS: 47 eligible, 10 gated (GS-X002, GS-O003-R), manifest in agreement, nothing read or written |
| `git diff --check` | Clean |
| Marker scan (drafts) | Only `PRIVACY-POLICY.md` carries markers: 3 `[OWNER DECISION`. No `[TK]`, `[SEED]` or `[DECISION REQUIRED]` in any draft. The historical research ledgers keep theirs, unchanged |
| VAT / company scan | No VAT status or number in any draft or the seed. Company number 17050842 and "registered in England and Wales" appear in all six drafts |
| Solicitor / forbidden-claim scan | None in the drafts, seed, page or operations docs. The only matches are this record describing the rule |
| Route references | Register slugs equal the seven `/legal/[slug]` documents; every `.md` reference in the new documents resolves |
| Privacy adoption | `ownerAdoptedOn` and `ownerAdoptedVersion` are `null`; state `OWNER_REVIEW_REQUIRED` |
| Production mutation | None. Supabase was used read-only (list projects, list functions, get organisation). No Sanity, Hostinger, Vercel, DNS or `main` call |
| Exact-SHA CI | Reported in the phase's final status, not here |

## 10. Remaining blockers

| Blocker | Owner of the next step |
|---|---|
| **Privacy:** P-01 to P-12; retention routine operating; 2.2 applied and adopted | Owner (evidence); a later legal phase |
| **Cookie A-2:** production cookie retest at cutover | Cutover phase |
| **Freelancer permission** (`GS-HOST-H4-C`): no written permission; review publication blocked | Owner / provider |
| **`GS-X002`:** Technical scope review; the 3 Technical services are not migrated | Reviewer / owner |
| **Rights-chain preconditions:** owner employment answer; template 01 signed before any project relies on the owner's work; 03/04/05 before subcontracted work is used; 06 on full payment | Owner |
| **Development reseed A-1:** network allowance for `spzu6y31.api.sanity.io` and a development token | Owner (environment) |
| **H4-H / cutover authority:** not begun; nothing published or deployed | Owner |
