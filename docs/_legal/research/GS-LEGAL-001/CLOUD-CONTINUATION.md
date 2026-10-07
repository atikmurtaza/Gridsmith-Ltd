# GS-LEGAL-001 Cloud Continuation

Handoff for a fresh Claude Code cloud session, written 7 October 2026. Branch
`staging/gs-legal-001`; the GS-LEGAL-001 work is commit `53cc4f67`, and this file is the commit
after it. Read `CLAUDE.md` first, then this file, then `GS-LEGAL-001-RECORD.md` in this folder.

## R5 status (7 October 2026)

**GS-LEGAL-001-R5 — Privacy evidence reduced; owner checks remain.** Record: `R5-PRIVACY-EVIDENCE.md`;
clause plan: `R5-PRIVACY-2.2-READINESS.md`.
- **Supabase:** the contract is verified from its own source and the account. Its request logs carry client-IP fields and are held ≥49 days (E-4 asks for the real period).
- **Hostinger and Resend:** primary re-reads of their DPAs remain (the hosts are blocked here).
- **Owner checks:** E-1 to E-4, plus E-5 optional (`docs/_legal/operations/PRIVACY-EVIDENCE-CHECKLIST.md`).
- **Owner IP decision:** template 01 regardless; template 02 only under a verified contract.
- **A-1:** deferred to a trusted environment with existing development credentials.

**Next:**
1. The owner answers E-1 to E-4.
2. A session with unblocked access re-reads the Hostinger and Resend DPAs and the statutory periods.
3. A legal phase applies Privacy 2.2 for owner adoption, after the retention cleanup phase.

## R4 status (7 October 2026)

**GS-LEGAL-001-R4 — six documents OWNER_ADOPTED; Privacy evidence required.** Record:
`R4-OWNER-ADOPTION.md` in this folder.

- **Adopted on 7 October 2026:** Business 3.1 (OC-1 confirmed), Consumers 3.1, Website Terms 2.1,
  Cookie 2.1, Accessibility 2.1 and `/legal/client-terms` 2.1. All are `OWNER_ADOPTED`, none
  `PUBLISHABLE`.
- **Outstanding publication prerequisites:** CUTOVER-AUTHORITY and PRIVACY-PUBLISHABLE on all six;
  A-2 on Cookie as well.
- **Privacy 2.1:** `OWNER_REVIEW_REQUIRED` with three markers. Owner checks P-01 to P-12 are in
  `docs/_legal/operations/PRIVACY-EVIDENCE-CHECKLIST.md`; the plan is `R4-PRIVACY-2.2-CHANGE-PLAN.md`.
- **Prepared, not operating:**
  - the rights-chain templates (`docs/_legal/operations/rights-chain/`);
  - the retention activation checklist (`docs/_legal/operations/RETENTION-ACTIVATION-CHECKLIST.md`).
- **A-1 not run:** the Sanity API host is blocked and there is no token.

**Next:**
1. The owner answers P-01 to P-12 and the owner-employment question, and authorises the retention
   cleanup phase.
2. A later legal phase applies Privacy 2.2 for owner adoption.
3. A-1 runs once the network and token are available.
4. Cutover authority (H4-H) is separate.

## R3 status (7 October 2026)

**GS-LEGAL-001-R3 — owner decisions applied; six documents ready for owner adoption; Privacy needs
owner account evidence. STOPPED before adoption.** Record: `R3-OWNER-DECISIONS-APPLIED.md` in this
folder.

- **Drafts:** Client Terms for Consumers and for Business Clients are now **3.1**. The other drafts are
  unchanged.
- **Operations:** the adopted retention schedule, consumer contracting workflow and rights-chain
  requirements are under `docs/_legal/operations/`.
- **States:** all seven remain `OWNER_REVIEW_REQUIRED`. Six need only the owner's adoption. Privacy 2.1
  keeps its three markers: it needs the owner account checks in the R3 record §5.2 and the retention
  routine operating (P-1).
- **Not done:** no Sanity, Supabase, Hostinger, DNS or `main` change; no lead or `pg_dump` deleted; H4-H
  not started.

**Next:** the owner adopts the six adoptable documents (R3 record §12) and answers the Privacy account
checks. A later, separately authorised phase then:
- runs the 63-lead cleanup;
- activates the routine;
- moves Privacy to 2.2;
- reseeds development (A-1).

## R2 status (7 October 2026)

**GS-LEGAL-001-R2 complete — OWNER DECISION PACK READY; STOPPED before adoption and publication.**
`R2-OWNER-DECISION-PACK.md` in this folder answers items 1–7 of "Known Follow-up" below:
- N-1 to N-3 independently verified;
- D-1 to D-30 classified;
- the list reduced to §4 of the pack;
- the retention schedule (§5), liability-cap options (§6) and consumer workflow templates (§7);
- a final independent check, whose 18 defects are fixed (§8).

Work branch `claude/sweet-mendel-11qvli`, fast-forwarded from `main` to this branch's HEAD `02e69715`
before the work began. No document beyond `OWNER_REVIEW_REQUIRED`, no draft edited, no deployment, no
Sanity/Supabase/Hostinger/DNS/main change, H4-H not started.

**Next:** the owner answers §4 of the pack. Only then does a phase edit the drafts (3.1/2.2 where
answers require it), reseed development (A-1) and let the owner adopt.

## Current Status (as handed over, 6 October 2026)

**READY FOR OWNER LEGAL/COMMERCIAL DECISIONS.**

- No document is `OWNER_ADOPTED`.
- No document is `PUBLISHABLE`.
- Nothing has been deployed. The legal routes are not in production (they return 404 there).

## Programme Decision

The previous solicitor-only gate `GS-O003` has been replaced by **`GS-O003-R` — LEGAL EVIDENCE + OWNER
ADOPTION** (owner decision, 6 October 2026).

State model, in order: `RESEARCHED` → `VERIFIED` → `OWNER_REVIEW_REQUIRED` → `OWNER_ADOPTED` →
`PUBLISHABLE`.

- Only the owner may authorise adoption. Adoption is recorded as `ownerAdoptedOn` and
  `ownerAdoptedVersion` in `docs/_legal/GS-O003-R-REGISTER.json`. No script and no agent sets them.
- No solicitor approval, legal certification, "fully compliant", "legally guaranteed" or
  "enforceable in every circumstance" claim may be made anywhere. The documents must not carry
  internal "AI draft" disclaimers either.

## Completed Work

- **Independent reviews A–F** (all in this folder): A consumer law (`A-consumer-law.md`), B business
  terms, liability and IP (`B-business-terms.md`), C privacy and cookies (`C-privacy-cookies.md`), D
  disclosures and e-commerce (`D-ecommerce-disclosures.md`), E competitor benchmark — commercial
  completeness only, never authority (`E-competitor-benchmark.md`), F adversarial client review
  (`F-adversarial-review.md`). Shared brief: `00-BRIEF.md`.
- **Agent G cross-check** (`G-final-cross-check.md`): first pass 1 high, 8 medium, 17 low. Every
  drafting defect (G-01 to G-22) was fixed and G re-verified them (§7 of its report).
- **Three low-severity fixes made after G's last pass — still need independent confirmation:** N-1
  (the twelve-payments/12-months deferred-payment limit now extends to unincorporated bodies and to the
  business default invoicing schedule), N-2 ("This does not reduce our responsibility for our own work"
  added to the content-responsibility sentences in consumer §9 and business §13), N-3 (printing removed
  from consumer third-party costs; printed copies are bought "directly from the printer, on the
  printer's terms").
- **Legal redraft:** all seven documents (see Current Legal State).
- **`GS-O003-R` implementation:** `lib/legal/adoption.ts` (states); the register; Sanity schema and
  queries use `adoptionState`/`ownerAdoptedOn` instead of `solicitorApproved`; the legal route shows
  "NOT YET ADOPTED" and "Draft dated" below `PUBLISHABLE` and no longer renders public `Basis:` lines.
- **Migration gating:** `scripts/migrate-production-cms.mjs` admits a legal document only at
  `PUBLISHABLE` at the adopted version; preflight and selftest cases; manifest
  `docs/_shared/GS-PROD-001-CMS-MANIFEST.json` regenerated. The manifest reason embeds the register
  state, so every state change needs `--write-manifest`.
- **Legal adoption tests:** `scripts/check-legal-adoption.mjs`, `legal-adoption-rules.mjs` and the
  selftest (65 cases, every branch red on a mutated copy of the real drafts), in `verify:static` and CI.
- **Consumer-terms gate:** `check:consumer-terms` (served) still asserts no consumer route links to the
  business terms and that `/press` reaches `#clause-10-1`.
- **Legal parity architecture:** `check:legal:parity` compares the **served** pages with the drafts
  (version, every paragraph as a word run, every clause reachable, adoption banner against the
  register). Its `Basis:` exemption was removed.
- **Served legal text is generated from the drafts:** `scripts/seed-legal.mjs` → `parseDraft`. Edit the
  drafts in `docs/_legal/`, never the seed. Only `/legal/client-terms` (disambiguation, no draft) is
  hand-written in the seed.
- **`/contact`:** privacy-notice link inside the form; the confirmation no longer promises an
  acknowledgement email (none is sent).
- **Press:** the rights note no longer says the terms are "awaiting solicitor review" (copy is owner
  decision D-20).
- **Struck rule** `GS-O003-SOLICITOR-APPROVAL-GATE` registered in `check:struck`; 11 spec lines
  annotated in place.

## Current Legal State (updated at R4, 7 October 2026)

Six at **`OWNER_ADOPTED`** (adopted 7 October 2026, effective-date headers, not `PUBLISHABLE`); Privacy
at **`OWNER_REVIEW_REQUIRED`**. Until R4 all seven were `OWNER_REVIEW_REQUIRED`:

| Document | File | Version |
|---|---|---|
| Client Terms for Consumers | `docs/_legal/CONSUMER-TERMS.md` | 3.1 (3.0 until R3) |
| Client Terms for Business Clients | `docs/_legal/MSA-BUSINESS.md` | 3.1 (3.0 until R3) |
| Website Terms of Use | `docs/_legal/WEBSITE-TERMS.md` | 2.1 |
| Privacy Policy | `docs/_legal/PRIVACY-POLICY.md` | 2.1 |
| Cookie Policy | `docs/_legal/COOKIE-POLICY.md` | 2.1 |
| Accessibility Statement | `docs/_legal/ACCESSIBILITY-STATEMENT.md` | 2.1 |
| Client terms disambiguation | `scripts/seed-legal.mjs` (`/legal/client-terms`) | 2.1 |

Since R4 the five adopted drafts carry `**Effective date: 7 October 2026**`; Privacy keeps
`**Draft date: 6 October 2026**`. `check:legal:adoption` enforces both.

The Privacy Policy still contains three `[OWNER DECISION: …]` markers, which block `PUBLISHABLE`:
processor agreements (§6), international transfer safeguard (§7), retention periods and deletion
routine (§8).

## Known Owner Decisions

The register of decisions **D-1 to D-30** is `GS-LEGAL-001-RECORD.md` §7 (options and conservative
recommendation for each); numeric drafting defaults are in §6. Material items:

- **D-1** VAT status (documents are now neutral; the site publishes no VAT number)
- **D-2** business liability cap
- **D-4** Technical scope (drafted: no construction-related drawings; `GS-X002` still open)
- **D-6** processor agreements and transfer-safeguard evidence (Hostinger, Supabase, Resend)
- **D-7** retention periods and a deletion routine (63 Production leads are held)
- **D-9** early-start / stage-table consumer workflow and quotation templates
- **D-10** acceptance method (email or e-signature; CCR reg. 14 acknowledgement drafted)
- **D-16** complaints contact (published number is WhatsApp/text only)
- **D-24** development-dataset reseed of the legal documents
- **D-25** adoption itself

None of these is answered. Do not answer them on the owner's behalf.

## Current Verification

Latest results (6 October 2026, local, Node 24.21.0):

| Check | Result |
|---|---|
| `verify:static` | PASS on the final committed state (typecheck, lint, every static gate) |
| Migration dry run | PASS — 47 eligible, 10 gated (`GS-X002`, `GS-O003-R`), manifest in agreement, nothing written |
| axe (WCAG 2.2 A/AA tags) | 0 violations — `/contact` 375 and 1440, `/press` 1440, `/legal/consumer-client-terms` 375 (local dev server, development dataset; measured before G's text-only fixes, no code changed since) |
| `check:consumer-terms` | PASS (same server) |
| `check:legal:adoption` + selftest | PASS — 6 drafts, 7 documents, register coherent; selftest 65/65 |
| Simulated served parity | PASS — the real `check:legal:parity` against pages rendered from the generated seed (`build/gs-legal-001/served-sim.mjs`, not committed): 6 documents, 107 clauses, 429 paragraphs, 107 tokens; each of its four branches proven red |
| Development-dataset parity | **RED by design** — the development dataset still serves v2.0 (246 problems) because **Sanity was not reseeded**. It turns green only after an owner-authorised development reseed (D-24). CI's served `check:legal:parity` will be red for the same reason |

## Known Follow-up

Next cloud phase: **GS-LEGAL-001-R2 — OWNER DECISION PACK + FINAL INDEPENDENT LEGAL CHECK.**

1. Independently verify the three low-severity changes made after Agent G's last pass (N-1, N-2, N-3).
2. Classify D-1 to D-30 as: owner answered; implementation fact; legal requirement; safe conservative
   default; genuine owner decision; external evidence required.
3. Reduce the decision list to only what the owner genuinely needs to answer.
4. Prepare a concrete retention schedule.
5. Prepare liability-cap options.
6. Prepare the consumer contracting workflow (quotation template, acceptance wording, stage table,
   early-start statements, confirmation email, cancellation form).
7. **STOP before adoption and publication.**

Do not repeat the A–G research unless a specific proposition needs re-verification.

## Separate Non-Legal Defect

Unknown paths under `/contact/` and `/about/` on Hostinger staging were observed returning **HTTP 500
rather than 404** (for example `/contact/thank-you`, `/about/xyz`). Not part of the legal phase. **Do not
fix it during GS-LEGAL-001-R2.**

## Production Safety

- Hostinger release candidate unchanged (H4-G: source `6615d97c`, artifact `bd8dd825`); no redeploy;
  auto-deploy left off. A branch push runs CI only — Hostinger publish needs `workflow_dispatch`, and
  `vercel.json` disables Vercel Git deployments.
- gridsmith.uk untouched; DNS untouched.
- Development Sanity **not reseeded**; Production Sanity untouched.
- Production Supabase and Production Edge Functions untouched.
- `main` untouched.
- H4-H not started.
