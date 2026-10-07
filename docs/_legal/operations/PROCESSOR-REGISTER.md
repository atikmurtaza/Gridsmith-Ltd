# Processor and recipient register (internal)

**Status:** internal operational record, created at `GS-LEGAL-001-R6` (7 October 2026). It is not a
public page and not legal advice. It holds the detail that the Privacy Policy describes only by name or
category. Evidence references are to `../research/GS-LEGAL-001/R5-PRIVACY-EVIDENCE.md` and
`R6-PRIVACY-2.2-DRAFT.md`.

| Provider | Role for Gridsmith | Contracting position | Processing terms | Location | Evidence |
|---|---|---|---|---|---|
| **Supabase** (Supabase Pte. Ltd., Singapore) | Processor: enquiry database (Ireland), Edge Function intake (Preview only until H4-B is promoted), request logs | "Gridsmith Org" on the self-serve Free plan; no marketplace purchase recorded | DPA incorporated into the Terms of Service ("No separate signed DPA is needed"); UK Addendum B.1.0 | Data `eu-west-1`; sub-processors include US companies | R5 §3.1–§3.3 (provider source and account) |
| **Resend** (Plus Five Five, Inc., United States) | Processor: internal enquiry notification email | Free plan (owner-confirmed, R6) | DPA incorporated into the customer agreement and binding through it (verified outside this environment, R6). No separately signed DPA is recorded | Storage and processing in the US | R6 §2 |
| **Hostinger** | Provides website hosting (servers in France), CDN and email hosting for contact@gridsmith.uk | **Not contracted by Gridsmith Ltd.** The subscription was bought in 2024 by another business for four years, prepaid to 2028 (owner-confirmed, R6) | Hostinger's DPA applies to the account holder. Gridsmith is not its counterparty | Website: France (owner-confirmed). Mailbox location not established | R6 §3 |
| **Subscription-holding business** (identity: not recorded in the repository; the owner holds it) | **Treated as a processor (R6 review).** As account holder it can suspend or delete the account, and so Gridsmith's data, whatever its day-to-day access. Whether it or its staff can also access the data is an open owner fact, which decides how Privacy describes it. Where it is established is also open (relevant to Privacy §7 if it is outside the UK and EEA) | Holds the Hostinger subscription | **None recorded between it and Gridsmith Ltd** | — | R6 §3 |
| Professional advisers (e.g. accountants) | Recipients where necessary | Engaged case by case | Professional duties; terms per engagement | UK | Privacy §6 |
| WhatsApp (Meta), mobile networks | Independent providers that carry messages the person chooses to send | Their own terms with the sender | — | — | Privacy §6 |

## Open action — the Hostinger arrangement

**UK GDPR Art. 28(3)** requires processing by a processor to be governed by a contract that binds the
processor with regard to the controller. Gridsmith Ltd is the controller for its website, logs and
mailbox. It is not party to Hostinger's terms; the account holder is. So, whatever the access answer,
Gridsmith's own processor contract chain for hosting is currently undocumented.

Either of the following closes it:

1. **A short written data processing agreement** between Gridsmith Ltd and the subscription-holding
   business. Under it, that business acts as Gridsmith's processor for the hosting account, on
   Gridsmith's documented instructions, with Art. 28(3) terms, and Hostinger is authorised as its
   sub-processor under Hostinger's DPA (Art. 28(2) and (4)). The DPA makes Module Three
   (processor-to-processor) available to a customer acting as processor (search summary, R5).
2. **Transfer of the hosting account to Gridsmith Ltd**, so that Gridsmith accepts Hostinger's terms and
   DPA directly. If the transfer waits for renewal in 2028, option 1 is the interim route. **One of the
   two must be in place before Privacy is adopted:** `check:legal:adoption` requires
   `prerequisitesMet["HOSTINGER-PROCESSOR-CHAIN"]` (the signed agreement, or the transfer, with a date).

**Owner facts needed to word Privacy §6 and §7 correctly:** *"Can the company that owns the Hostinger
subscription, or its staff, access Gridsmith's hosting files, mailbox, logs or other account data?"* —
and *where is that company established?*
- **If yes:** it is a recipient and processor. Privacy says that it may access personal data only to
  administer the account on our instructions, and option 1 or 2 is needed before adoption.
- **If no:** it is not a recipient. Option 1 or 2 is still needed to document the processor chain, but
  Privacy does not have to mention its access.

Its name does not have to be published. Art. 13(1)(e) allows recipients to be identified by category.

The Privacy 2.2 draft carries one `[OWNER DECISION]` marker for this. `check:legal:adoption` refuses
adoption while the marker remains **and** until `HOSTINGER-PROCESSOR-CHAIN` evidence is recorded, so
deleting the marker alone does not unblock it. The Hostinger transfer limb in Privacy §7 also needs a
direct reading of Hostinger's DPA transfer terms; R5 had only search summaries of them.

## Recommended confirmation (non-blocking)

Confirm that the Supabase organisation and the Resend account were opened for Gridsmith Ltd, not for the
owner personally, so that their incorporated DPAs bind them to Gridsmith Ltd as controller (R6 review
note). The same chain matters for Business Terms §23 wherever client personal data passes through the
mailbox.
