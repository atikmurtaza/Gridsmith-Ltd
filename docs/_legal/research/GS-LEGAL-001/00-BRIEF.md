# GS-LEGAL-001 — shared brief for every review workstream

Date of review: **6 October 2026**. Repository: `C:\Users\atikm\.codex\worktrees\gs-host-004\Gridsmith Ltd`
(branch `codex/gs-host-004`). This brief is context, not legal authority.

## What this is

The owner (Gridsmith Ltd, UK private limited company 17050842, registered in England and Wales,
registered office 30 Briarfield Road, Farnworth, Bolton, BL4 0HD, contact `contact@gridsmith.uk`)
is **not** commissioning a solicitor at this stage. The legal set will instead be reviewed against
current UK primary legislation and official guidance, then adopted (or not) by the owner. Nothing
produced may claim to be "solicitor approved", "legally guaranteed", "fully compliant", "certified"
or "enforceable in every circumstance". Uncertainty must be stated, not hidden.

## Documents (read them)

- `docs/_legal/WEBSITE-TERMS.md` — website terms of use (`/legal/terms`)
- `docs/_legal/MSA-BUSINESS.md` — business client terms (`/legal/business-client-terms`)
- `docs/_legal/CONSUMER-TERMS.md` — consumer client terms (`/legal/consumer-client-terms`)
- `/legal/client-terms` — a disambiguation page with no operative clause (source: `scripts/seed-legal.mjs`)
- `docs/_legal/PRIVACY-POLICY.md` (`/legal/privacy`), `docs/_legal/COOKIE-POLICY.md` (`/legal/cookies`),
  `docs/_legal/ACCESSIBILITY-STATEMENT.md` (`/legal/accessibility`)
- Existing research: `docs/_legal/00-LEGAL-BASIS.md`, `01-FACTUAL-INVENTORY.md`, `02-CITATION-LEDGER.md`
  (citations written August–September 2026 — **re-verify, do not assume still current**),
  `03-REVISION-LOG.md`, `04`–`07` verification reports, `LEGAL-LAUNCH-CHECKLIST.md`.
- Served text: `scripts/seed-legal.mjs` (what the development site renders); `scripts/check-legal-parity.mjs`.

## Business model (authoritative, from the owner)

Three studios of one company: Design (brand, visual, illustration, motion, 3D, technical drawing —
the Technical group is gated, see below), Digital (websites, software, apps, automation, AI
integration, maintenance), Press (writing, ghostwriting, editing, book production, publishing
preparation, audiobook support, content, book marketing). Clients are businesses **and consumers**
(e.g. individual authors), in the UK **and abroad**.

No public prices. Every engagement is quoted. Before any payment: the project is discussed; scope,
deliverables, exclusions/assumptions, timing, price, payment structure and project-specific
conditions are agreed; the client receives/accepts the terms and the project scope; then payment is
requested. Payment structures vary per project (full upfront, deposit/balance, 50/50, milestones,
instalments, retainer, other agreed schedule). The project document (proposal / quotation / SOW)
records the actual arrangement. **Do not invent fixed percentages or schedules as policy.**

Refund intent: if a client decides not to proceed and no substantive work has been performed,
Gridsmith should normally return the refundable amount paid, subject to contract and statute; if
work has begun, the refundable amount may reduce by work actually provided and legitimate committed
costs, where legally permitted. **Not** a blanket "14-day refund policy"; consumers and business
clients must be treated separately.

Owner policy: no client project, client name, case study, cover or portfolio material is shown
publicly without the client's explicit consent. Terms must not grant automatic portfolio rights.

Technical boundary (`GS-X002`, still open): Technical Design is drafting, technical illustration and
documentation within an agreed scope. It does not include engineering design/calculations,
engineering certification, approval, stamping or regulated sign-off, and Gridsmith does not act as
responsible designer where an appropriately qualified professional is required. Gridsmith carries
no PI cover for this and never advertises insured/uninsured status (`GS-O005` closed by owner).

Gridsmith may use appropriate subcontractors/specialists.

## Actual site behaviour (facts to check documents against)

- Static website on Hostinger (staging today; production intended on Hostinger with its CDN, hCDN).
  Vercel is retired. Hosting access logs exist at the provider; their retention is a provider fact
  not yet recorded.
- **No analytics** (GA4/PostHog removed 26 Aug 2026). No advertising, no tracking pixels, no embedded
  third-party media. The built artifact makes no third-party requests on page load; external
  origins appear only as outbound links (Facebook, Instagram, LinkedIn, X, TikTok, YouTube, Reddit,
  Freelancer, WhatsApp `wa.me`).
- One cookie: `gs_consent` (first-party, records that the notice was seen/dismissed; the banner is a
  notice, there are no consent categories). No localStorage/sessionStorage in use (verify).
- Fonts self-hosted. CMS (Sanity) is read at build time only — visitors never contact Sanity.
- Forms (`/contact`, `/press/contact`) require JavaScript; the browser POSTs to a Supabase Edge
  Function (`gs-lead-intake`) in a Supabase project in **eu-west-1** (Ireland); leads are stored in
  Postgres (`public.leads`) with a notification outbox; a worker sends one notification email per
  lead through **Resend** to `contact@gridsmith.uk`. Fields: division/segment, name, email,
  optional company, optional phone, message, optional budget band, timeline, Press-specific answers;
  a honeypot field. Read `supabase/migrations/`, `lib/leads/`, `supabase/functions/` for exact
  fields and any retention. Phone/WhatsApp/SMS contact number +44 7405 448534 is published; there is
  no `tel:` link by policy.
- Reviews: 11 Freelancer.com reviews shown anonymously on staging (owner staging-only decision;
  written Freelancer permission is not held and is a production blocker).
- Company VAT registration status: **unknown** — no VAT number is published; do not assume either way.

## Source hierarchy

1. Current UK primary legislation (legislation.gov.uk, "latest available" text, with amendment
   status and commencement checked); 2. binding instruments; 3. current official regulator /
   government guidance (ICO, CMA, GOV.UK, Companies House, HMRC); 4. case law only if necessary;
5. the Gridsmith citation ledger; 6. Gridsmith commercial decisions; 7. competitor examples
   (commercial completeness only — never authority, never copied).

## Output rules

- Write ONE markdown file at `docs/_legal/research/GS-LEGAL-001/<your file name>`.
- **Do not edit any other file.** Do not edit the legal drafts. Do not commit. Do not push.
  Do not touch production systems, Sanity, Supabase, Hostinger or gridsmith.uk.
- For every material proposition give: topic; document/clause affected; authority; source URL;
  source type (primary / official guidance / case / secondary / competitor); retrieval date
  (6 Oct 2026); exact section/regulation; conclusion; confidence (high/medium/low); whether an
  owner decision is required.
- Mark anything uncertain, high-exposure, possibly unfair to consumers, dependent on an unsupplied
  fact, or a major commercial choice as **OWNER CONFIRMATION REQUIRED**, with options and the
  conservative recommendation.
- Quote statute briefly where precision matters; do not reproduce competitor text.
