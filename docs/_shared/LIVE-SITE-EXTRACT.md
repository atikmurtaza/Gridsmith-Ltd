# Live site extract — `https://gridsmith.uk` as read on 7 September 2026

**Read by:** the session that also drafted `Q-P13` and wrote `PRE-DEPLOYMENT-CHECKLIST.md`.
**Method:** `fetch` of the served HTML at `/`, `/terms-and-conditions/` and `/privacy-policy/`,
script/style stripped, text extracted. All three serve **200**. The platform is WordPress +
Elementor (the "Get a Quote" control is an `elementor-action` popup trigger, not a link).

**Nothing in this file is content. It is a record of what a third party can read today.**
Nothing here may be copied into the build without first appearing on
`PRE-DEPLOYMENT-CHECKLIST.md` — `CLAUDE.md` non-negotiable #2 applies to text lifted from an
old site exactly as it applies to text invented from nothing: *the old site is not evidence
that a claim is true.*

---

## 0. Correction to `05-HANDOVER.md` — recorded before anything else

`05-HANDOVER.md` describes the live site as Press-facing. **It is not, and this was verified
rather than assumed.**

The live site is **wholly Gridsmith Digital**. The strings `press`, `book`, `publish`,
`manuscript`, `ghostwrit`, `ISBN`, `editorial`, `author` appear **nowhere** in the served
homepage; the single adjacent word is *"publishing outcomes"* inside the T&Cs' no-guarantees
clause (§6), which is a disclaimer and not an offer. **Gridsmith Design** appears only as
**"branding support"** and **"Brand Identity Support"** — line items inside the Digital
services list, not a division.

There is no division structure on the live site at all. There is one company selling one
category of service.

---

## 1. Navigation, verbatim

`Home` · `Services` (`/#services`) · `Digital Services` (`/#digital-services`) ·
`How It Works` (`/#howitworks`) · `About` (`/#about`) · `FAQs` (`/#faqs`) ·
`Contact` (`/#contact`)

One page, six anchors, two separate legal pages.

## 2. Hero, verbatim

> **Professional Digital Solutions for Businesses, Entrepreneurs, and Growing Brands**
>
> Gridsmith Ltd provides website development, SEO support, digital marketing support,
> branding support, and digital business solutions tailored to client needs.
>
> Whether a business needs a new website, improved search visibility, digital marketing
> support, branding updates, or help streamlining online operations, Gridsmith Ltd provides
> structured services based on clear scope, communication, and agreed deliverables.

Two calls to action: **Email Us** (`mailto:`) and **Get a Quote** (Elementor popup).

## 3. `HOW IT WORKS` — the six stages, verbatim

Source: `https://gridsmith.uk/#howitworks`.

| # | Stage | Live copy, verbatim |
|---|---|---|
| 1 | **Consultation** | Gridsmith Ltd starts by understanding the business, project goals, target audience, and current digital presence. |
| 2 | **Planning & Scope** | A clear project scope, timeline, pricing structure, and required deliverables are prepared before work begins. |
| 3 | **Approval & Start** | Work begins after the project scope is confirmed and the agreed initial payment is received. |
| 4 | **Design, Development & Updates** | The project is developed with regular updates, feedback opportunities, and clear communication throughout the process. |
| 5 | **Delivery** | Final deliverables are reviewed, completed, and provided according to the agreed scope. |
| 6 | **Support (if applicable)** | Ongoing support, maintenance, SEO improvements, and digital assistance can be provided where required. |

**These are already in the build.** `docs/_shared/00-PROCESS.md` §"The six stages" carries the
same six names and near-identical descriptions. The live site is where they came from; the
provenance was not previously recorded anywhere, and it is recorded here.

**One divergence, and it runs through the whole build.** Live stage 6 names *"SEO
improvements"* — a Digital-only activity — as part of the canonical stage. `00-PROCESS.md`
keeps that wording in the canonical row **and** gives Press its own stage-6 detail line
(*"Content Programme, further titles, reprints"*). So the canonical description names a
Digital service while claiming to be division-neutral. Listed, not resolved.

## 4. `SERVICES` / `DIGITAL SERVICES` — the offer, verbatim

Three groups, twenty line items, **no prices anywhere**:

- **Website Design & Development** — Custom Website Development · WordPress Development ·
  Website Redesign & Optimization · E-Commerce Website Setup · Landing Page Development ·
  UI/UX Design
- **SEO & Online Visibility** — Search Engine Optimization (SEO) · On-Page & Technical SEO ·
  Keyword Research & Strategy · Google Business Profile Support · Website Performance
  Optimization · Content Strategy
- **Branding & Digital Support** — Brand Identity Support · Website Graphics & Visual Assets ·
  Social Media Design Support · CRM & Workflow Setup · Email & Contact Form Automation ·
  Online Booking & Enquiry Systems

Second block, headed **DIGITAL GROWTH SERVICES / Build, Improve, and Grow Online**:

> Gridsmith Ltd provides practical digital support for businesses looking to build, improve,
> or grow their online presence. Services are tailored to each project and may include website
> development, SEO improvements, digital marketing support, automation setup, branding
> support, and ongoing website maintenance.
>
> **Note:** All digital services are provided based on agreed project requirements, scope, and
> deliverables.

## 5. `PRICING & BILLING TRANSPARENCY`, verbatim

> **Transparent Pricing & Billing**
> - Pricing is based on project scope, complexity, features, and required digital services.
> - Detailed proposals are provided before work begins.
> - Payments are processed securely through the agreed payment method.
> - Milestone-based payments may apply for larger website, SEO, or digital support projects.
>
> **Refund & Cancellation Summary:** Refund eligibility depends on the project stage, agreed
> scope, and work completed. Full terms are outlined in the Terms & Conditions page.

*(A stray literal `x` follows this block in the served markup — an Elementor artefact, not
copy.)*

**The heading says "Transparent Pricing" and the section contains no price, no range and no
starting figure.** The new build's non-negotiable #3 — *never publish a service page without
pricing* — is the direct answer to this, and it is schema-enforced there.

## 6. `SERVICE INTEGRITY`, verbatim

> - Services are provided based on agreed scope, timelines, and deliverables.
> - Clear and honest communication is maintained throughout each project.
> - Lawful and non-deceptive practices are followed across the website, SEO, marketing, and
>   digital support services.
> - No misleading, prohibited, or unethical digital strategies are used.
> - Client information, website access, and project details are handled with appropriate care
>   and confidentiality.

## 7. `FAQs`, verbatim — five, all five

| Question | Answer |
|---|---|
| Where is Gridsmith Ltd based? | Gridsmith Ltd operates remotely and works with clients across different locations. The company is registered in the United Kingdom. |
| Does Gridsmith Ltd provide quotes before starting work? | Yes. Projects begin with a clear proposal outlining scope, timeline, pricing, and agreed deliverables. |
| Does Gridsmith Ltd guarantee rankings or results? | No specific outcomes, such as rankings, traffic, leads, or sales, can be guaranteed because results depend on multiple external factors. |
| How do payments work? | Payments are typically made upfront or in agreed milestones depending on the size, scope, and complexity of the project. |
| Does Gridsmith Ltd offer Google Ads management? | Google Ads setup or support may be available depending on the project scope. Any advertising-related work is agreed clearly before the project begins. |

## 8. `ABOUT`, verbatim

> **About Gridsmith Ltd**
>
> Gridsmith Ltd is a digital solutions company supporting clients remotely with website
> development, SEO support, digital marketing support, branding assistance, automation setup,
> and ongoing digital business support tailored to project needs.
>
> The company's approach is built on clear communication, defined scope, realistic
> expectations, and professional delivery. Each project is handled based on its specific
> requirements, with a focus on transparency, quality work, and reliable client support.

## 9. Published contact and address details, verbatim

| Field | Live value |
|---|---|
| Phone | `+44 7405 448534` — linked `tel:+44%207405%20448534` |
| Email, as displayed | `contact.gridsmith@gmail.com` |
| Email, as linked | **`mailto:info@gridsmith.uk`** — see §11.2 |
| Address | `30, Briarfield Road, Farnworth Bolton BL4 OHD UNITED KINGDOM` |
| Copyright | `© 2026 Gridsmith Ltd. All Rights Reserved.` |
| Company number | **absent from every page** |
| The words "registered office" | **absent from every page** |

The T&Cs §14 and the Privacy Policy §10 both repeat the same address and the same Gmail
address as the contact of record.

## 10. Consent banner, verbatim — recorded because it bears on non-negotiable #7

> We use cookies to enhance your browsing experience, serve personalised ads or content, and
> analyse our traffic. By clicking "Accept All", you consent to our use of cookies.
> `Customise` · `Reject All` · `Accept All`

Privacy Policy §4 says the site *"may use cookies and similar technologies for site
functionality, analytics, and performance measurement"* and that *"Third-party tools may also
collect limited usage data."*

The new build has **no analytics and no consent categories** — its banner is a notice
(`CLAUDE.md` *Stack*, and `_legal/03-REVISION-LOG.md` round 10). The two sites therefore make
**incompatible statements about the same company**, and whichever survives is a decision.

---

# 11. Contradictions and inconsistencies — listed, none resolved

## 11.1 Positioning — the live site and the new build describe different companies

| | Live `gridsmith.uk` | The new build |
|---|---|---|
| What the company is | *"a digital solutions company"* | one UK company trading as **three divisions** |
| Divisions | none | Design · Digital · Press |
| Press | **does not exist** | a full route group, a Path Finder, its own legal instruments |
| Design | one bullet, *"branding support"*, inside Digital | a division with CAD and engineering drawings |
| Digital | the whole company | one of three |
| Prices | none published | non-negotiable #3 forbids a service page without one |
| Governing law | **Pakistan** (T&Cs §13) | England & Wales |

**This is a positioning change and it is the owner's to confirm.** Not recorded as a defect
in either artefact — the live site is not wrong about itself, and the build is not wrong about
its own intent. They disagree, and only one can be served from `gridsmith.uk`.

The narrower half of it is worth separating: even if the three-division positioning is
confirmed, **launching it replaces a live public description of the company**. Anyone who read
`gridsmith.uk` before launch and after will see Press appear from nothing. That is normal for a
repositioning and it is only a problem if a client contracted against the old description.

## 11.2 The contact-address inconsistency — **the direction is the opposite of the brief**

The brief states the footer link *text* reads `info@gridsmith.uk` while pointing at the Gmail
address. **The served markup is the other way round:**

```
<a href="mailto:info@gridsmith.uk">contact.gridsmith@gmail.com</a>
```

The **displayed** address is `contact.gridsmith@gmail.com`; the **`href`** is
`mailto:info@gridsmith.uk`. So a visitor who reads the footer writes to the Gmail address, and
a visitor who *clicks* it writes to `info@gridsmith.uk` — two different mailboxes from one
control, and the two hero/contact "Email Us" / "Email Me" buttons both go to the Gmail address,
agreeing with the footer's label but not its `href`.

That makes **three** addresses in play across the estate:

| Address | Where |
|---|---|
| `contact.gridsmith@gmail.com` | footer link text, both CTA `mailto:`s, T&Cs §14, Privacy §10 |
| `info@gridsmith.uk` | footer link `href` only — appears nowhere as visible text |
| `contact@gridsmith.uk` | **the new build**, `scripts/seed-company-details.mjs:47`, and `CONSUMER-TERMS.md` §6.1 as the address for serving a **statutory cancellation notice** |

The third is the one with legal weight: a consumer cancelling under CCRs 2013 is told in the
build's own instrument to write to `contact@gridsmith.uk`, which is **not published anywhere on
the live site** and whose deliverability this session has not tested. Listed, not resolved.

A separate, smaller defect in the same family: **T&Cs §1 says the Terms govern *"your use of
contact.gridsmith@gmail.com"*** — an email address occupying the slot where the website URL
belongs. The Privacy Policy §1 has the mirror-image slip, naming
*"https://gridsmith.uk/Gridsmith.com"*.

## 11.3 Registered address — live vs. `companyDetails`

| | Value |
|---|---|
| Live site (all three pages) | `30, Briarfield Road, Farnworth Bolton BL4 OHD UNITED KINGDOM` |
| `scripts/seed-company-details.mjs:40` | `30 Briarfield Road, Farnworth, Bolton, BL4 0HD` |

Same premises, **four differences, one of which is substantive**:

1. **`BL4 OHD` vs `BL4 0HD`** — the live postcode uses the **letter O**; the build uses the
   **digit zero**. UK postcodes take a digit in that position, so the live rendering is
   malformed. This is the substantive one: it is the version a client copies into a courier
   form or a bank payee record.
2. Live has a comma after the building number (`30,`); the build does not.
3. Live has no comma between `Farnworth` and `Bolton`; the build does.
4. Live appends `UNITED KINGDOM`; the build does not, and pairs the address with a separate
   `placeOfRegistration: 'England & Wales'` field instead.

**Does the live address match what `companyDetails` expects?** It matches the *premises* and
does not match the *string*, and `companyDetails.registeredOffice` is `required()`, so the
build will render whichever string is seeded, not reconcile them. **Neither has been checked
against the Companies House register in this session** — `companyNumber: '17050842'` is in the
seed and nowhere on the live site, so the two artefacts cannot corroborate each other.

Structurally, the live site publishes **no company number and never uses the words "registered
office"**, so it does not meet what `master/PROJECT-RULES.md` expects of the statutory footer.
Recorded as a difference; whether it is a live compliance gap is not this session's call.

## 11.4 Refund summary — live vs. `CONSUMER-TERMS` and `MSA-BUSINESS` as published

**`K-17` is open and this does not resolve it.** Comparison only.

| | Live homepage summary | Live T&Cs §10 | `CONSUMER-TERMS.md` | `MSA-BUSINESS.md` |
|---|---|---|---|---|
| Basis | *"depends on the project stage, agreed scope, and work completed"* | *"reviewed on a case-by-case basis"* | statutory right, then proportionate payment for work supplied | payment for work performed + committed cost |
| Discretionary? | reads as criteria | **explicitly discretionary** | **no** — §6 is a right | no — §6 is a mechanism |
| 14-day cancellation right | **not mentioned** | **not mentioned** | §6: *"14 days from the day after the contract is made"* | n/a — business client |
| Where to cancel | not stated | not stated | §6.1 / §18: `contact@gridsmith.uk` | notice under §6 |
| After substantial work | *"refunds may not be available"* | same | §7: *"the refundable balance may be small or zero"* | §6: *"may therefore be zero"* |
| Governing law | — | **Pakistan** (§13) | England & Wales | England & Wales, exclusive jurisdiction |

Four observations, none acted on:

1. **The live pages describe no statutory cancellation right at all.** The build's
   `CONSUMER-TERMS` §6 treats one as existing for distance consumer contracts under CCRs 2013.
   These are not two wordings of one position; they are two positions.
2. **"Case-by-case" and "a right" are different in kind.** Live §10 makes a refund an exercise
   of discretion. `CONSUMER-TERMS` §6 makes it an entitlement, and §7 makes the
   post-cancellation calculation a formula. The *arithmetic outcome* after substantial work is
   nearly identical across all four columns — *may be zero* — which is why a summary-level
   reading makes them look aligned when the mechanism differs completely.
3. **Live T&Cs §13 elects the law of Pakistan** for a UK-registered company publishing a UK
   address. Both build instruments elect England & Wales. This is the largest single
   divergence found and it sits underneath every other clause on the live site.
4. **The live T&Cs are one instrument for everyone.** The build splits consumer and business —
   which is `K-16`'s finding: the instruments test *what you are buying for*, not who you are.
   A single set cannot make that distinction, so the live site applies business-style
   discretionary refund terms to consumers.

The already-recorded `F-11` ceiling still applies and is unchanged by this file:
`check:legal:parity` asserts the served copy matches the reviewed copy, never that the reviewed
copy is right.

---

## 12. Anything on this page that reaches the build reaches the checklist first

Two items are already in the build with live-site provenance and are on
`PRE-DEPLOYMENT-CHECKLIST.md` for that reason:

- the six process stage names and descriptions (`00-PROCESS.md`), and
- the registered address and phone number, which exist in the seed in a form that differs from
  the live one in four ways.

Everything else in this file — the services list, the FAQs, the About copy, the Service
Integrity list, the pricing language — is **recorded and not adopted**.
