# Processor and recipient register (internal)

**Status:** internal operational record, created at `GS-LEGAL-001-R6` (7 October 2026). It is not a
public page and not legal advice. It holds the detail that the Privacy Policy describes only by name or
category. Evidence references are to `../research/GS-LEGAL-001/R5-PRIVACY-EVIDENCE.md` and
`R6-PRIVACY-2.2-DRAFT.md`.

| Provider | Role for Gridsmith | Contracting position | Processing terms | Location | Evidence |
|---|---|---|---|---|---|
| **Supabase** (Supabase Pte. Ltd., Singapore) | Processor: enquiry database (Ireland), Edge Function intake (Preview only until H4-B is promoted), request logs | "Gridsmith Org" on the self-serve Free plan; no marketplace purchase recorded | DPA incorporated into the Terms of Service ("No separate signed DPA is needed"); UK Addendum B.1.0 | Data `eu-west-1`; sub-processors include US companies | R5 §3.1–§3.3 (provider source and account) |
| **Resend** (Plus Five Five, Inc., United States) | Processor: internal enquiry notification email | Free plan (owner-confirmed, R6) | DPA incorporated into the customer agreement and binding through it (verified outside this environment, R6). No separately signed DPA is recorded | Storage and processing in the US | R6 §2 |
| **Hostinger** (Hostinger International Ltd, Cyprus; Hostinger UK Limited; or Hostinger Global S.à r.l., per its DPA) | Processor: website hosting (servers in France), CDN (sub-processor Cloudflare) and email hosting for contact@gridsmith.uk | **Gridsmith's admin department manages the hosting account** (owner, R8). The account's Hostinger customer of record is **not Gridsmith Ltd** (owner, R8) | DPA revised 2026-09-29, read directly (R7, R8): annexed to the Terms of Service; Customer is controller or processor (§2.1–2.2); Email Services covered (§1.1); EU SCCs Modules 2/3 and the UK Addendum (§9). **It binds Hostinger to its Customer.** See *Open action* | Website: France (owner-confirmed). Mailbox location not established | R8 §2 |
| Professional advisers (e.g. accountants) | Recipients where necessary | Engaged case by case | Professional duties; terms per engagement | UK | Privacy §6 |
| WhatsApp (Meta), mobile networks | Independent providers that carry messages the person chooses to send | Their own terms with the sender | — | — | Privacy §6 |

## Open action — Gridsmith Ltd as Hostinger's Customer (R8; supersedes R6 and R7, kept in git history)

**What the processing arrangement is:**
- Gridsmith's admin department manages the hosting account.
- Hostinger supplies the hosting (France), CDN and email hosting.
- Hostinger's DPA governs that processing.

No inter-company processor relationship is created from the account's history (owner instruction, R8).

**The one residual (UK GDPR Art. 28(3)):** the contract must bind the processor "with regard to the
controller". Hostinger's Terms and DPA bind Hostinger to its Customer, and the account's customer of
record is not Gridsmith Ltd. Operational management does not change the contracting party.

**Ways to close it (owner's choice; (a) recommended, (b) not recommended):**
- **(a) Gridsmith Ltd becomes the Customer** for the gridsmith.uk website and mailbox.
  - **The minimum:** they sit under a Hostinger account whose Customer is Gridsmith Ltd, for example by
    moving them into a Gridsmith Ltd account. Changing the existing account as a whole is not required.
    The mechanism is not verified here.
  - **Afterwards:** re-confirm the hosting location (France) and the email hosting, and confirm that the
    account's contact address is Gridsmith-controlled.
  - Privacy 2.2 needs no change.
- **(b) A recorded owner risk decision** for a stated period.
  - It records an **accepted Art. 28(3) non-compliance**, not satisfaction.
  - The SCCs and UK Addendum would still not run to Gridsmith.
  - Hostinger's notices would still go to the customer of record.
  - Privacy §7's Hostinger reliance limb and §6's last sentence would have to be narrowed, followed by a
    re-hash, a fresh review and A-1.

**Adoption evidence `HOSTINGER-PROCESSOR-CHAIN` (redefined at R8; gate unchanged)** records elements 1–7 of
`../research/GS-LEGAL-001/R8-HOSTING-RETENTION-CLOSURE.md` §2.3. Elements 1–6 are met; element 7 waits on
(a), or on (b) with the Privacy change.

## Recommended confirmation (non-blocking)

Confirm that the Supabase organisation and the Resend account were opened for Gridsmith Ltd, not for the
owner personally, so that their incorporated DPAs bind them to Gridsmith Ltd as controller (R6 review
note). The same chain matters for Business Terms §23 wherever client personal data passes through the
mailbox.
