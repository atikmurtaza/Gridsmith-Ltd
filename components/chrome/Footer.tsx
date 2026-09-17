import { ConsentReopen } from '@/components/consent/ConsentReopen';
import { getCompanyDetails } from '@/lib/company/companyDetails';
import { LEGAL_FOOTER_SLUGS } from '@/lib/legal/slugs';
import { SITE_URL } from '@/lib/seo/site';
import type { Division } from './RootShell';
import styles from './chrome.module.css';

const DIVISIONS: { href: string; label: string; division: Division }[] = [
  { href: '/design', label: 'Gridsmith Design', division: 'design' },
  { href: '/digital', label: 'Gridsmith Digital', division: 'digital' },
  { href: '/press', label: 'Gridsmith Press', division: 'press' },
];

const COMPANY_LINKS: { href: string; label: string }[] = [
  { href: '/about', label: 'About' },
  { href: '/approach', label: 'Approach' },
  { href: '/insights', label: 'Insights' },
  { href: '/contact', label: 'Contact' },
];

const LEGAL_LINKS = LEGAL_FOOTER_SLUGS.map((s) => ({
  href: `/legal/${s.slug}`,
  label: s.label,
}));

/**
 * The shared footer (`M-04`, FR-M12). Async Server Component — it reads `companyDetails`
 * once per build. Nothing here is hardcoded: every company fact comes from the singleton.
 *
 * **The row summarised the legal requirement as "registered name, registered number,
 * registered office". That is incomplete.** Checked against the legislation rather than the
 * summary:
 *
 * | Particular | Source |
 * |---|---|
 * | Registered name | Companies (Trading Disclosures) Regulations 2015 (SI 2015/17) reg. 24(2) |
 * | **The part of the UK in which the company is registered** | reg. 25(2)(a) — *missing from the row's summary* |
 * | Registered number | reg. 25(2)(b) |
 * | Registered office address | reg. 25(2)(c) |
 * | Name, geographic address, and a rapid contact route incl. email | e-commerce regs reg. 6(1)(a)–(c) |
 *
 * That last row is why `contactEmail` renders here and why `check:launch` requires it on a
 * production dataset: reg. 6(1)(c) is a launch obligation of the same shape, and it was not
 * in the tracker row at all.
 *
 * **`contactPhone` joins it at `GS-O004`, and stops being a link at `GS-R001-R`.** reg. 6(1)(c)
 * asks for details that make rapid, direct and effective contact possible and names email as a
 * floor, not a ceiling; the number is the other half of what a business reader looks for. It is
 * the number the live `gridsmith.uk` already publishes, so nothing new is asserted about how to
 * reach the company.
 *
 * **It renders as text here, with no `tel:` and no `wa.me`.** `GS-R001-R` withdraws the call
 * channel, and `check:company` question 3 refuses a `tel:` href on any route. A WhatsApp link
 * would satisfy that rule and still be wrong in *this* block: the statutory footer is a
 * Companies Act and e-commerce-regs disclosure, not a contact surface, and it is on all 77
 * routes — putting a messaging call-to-action in it is marketing inside a legal notice. The
 * linked channels live on `/contact`, `/press/contact` and `/about`, where a reader has gone
 * looking for them. The number being *readable* is what reg. 6(1)(c) needs; being *clickable*
 * was never the requirement, and the email beside it is a link.
 *
 * **No opening hours, ever.** `GS-O004` does not authorise published business hours and the
 * field no longer exists on the singleton. A phone number with no hours beside it is the
 * honest state: it says how to reach us, not when we are certain to answer.
 *
 * **No VAT line.** e-commerce regs reg. 6(1)(g) requires a VAT identification number only
 * *"where the provider undertakes an activity subject to VAT"*. Gridsmith is not registered,
 * so there is no number, no field on the singleton, and nothing here to render.
 *
 * **This block is the reg. 25(2) disclosure and it lives here on purpose.** The regulation
 * requires the registered name, the part of the UK of registration, the company number and
 * the registered office on the *website*, not only inside a transaction flow. Everywhere
 * else on the site the company's location is written "Bolton, United Kingdom"; the full
 * address appears here and on `/about`, and nowhere else.
 *
 * Every conditional line follows one rule — **render when the field is non-empty, omit when
 * empty**. Supplying a value is a content edit: no schema change, no code change, no deploy.
 *
 * Plain `<a>`, not the `Link` primitive, for the same two reasons as the header:
 * `TECH-SPEC.md` §3 requires route-group navigation to be a document load, and the primitive
 * in a shared layout would put `next/link`'s client runtime in every route's chunk.
 *
 * The division switcher lives here and only here (`TECH-SPEC.md` §3) — a header-level
 * switcher pulls buyers sideways mid-funnel.
 *
 * **The Company and Legal link groups (`APP-FLOW.md` §8) are built — `M-P2-22`.** They were
 * absent because their routes were, and this comment went on saying so after Epics N and L
 * landed them. The consequence was not cosmetic: the only link to a legal document anywhere
 * in the chrome was one on the Press landing page, so the privacy notice and cookie policy
 * were reachable by URL and by nothing else. E-commerce regs reg. 6 requires the particulars
 * *easily, directly and permanently accessible*, and a footer link is what "directly" means.
 *
 * **`Careers` is the one §8 entry not here.** There is no `/careers` route; `check-axe`
 * resolves every same-origin link on every audited route, so listing it fails the build
 * rather than shipping a 404 in the chrome of every page — the same policy `nav.ts` states.
 *
 * **Cookie preferences is `ConsentReopen`, already permanent in the statutory block below**,
 * so it is not duplicated into the Legal list. FOUNDATION requires one persistent way back
 * into the choice, not two.
 *
 * **The group labels are `<p>`, not headings.** A heading in the footer sits after whatever
 * the page's `main` ended on, and axe's `heading-order` reports a jump from an `h3` to an
 * `h2` — a violation caused by a component that cannot see the page it renders under. The
 * accessible name each group needs is on the `<nav>`'s `aria-label`, which is where a
 * landmark's name belongs anyway.
 *
 * `LEGAL_FOOTER_SLUGS` is a hardcoded subset of `LEGAL_DOCUMENT_SLUGS` rather than the whole
 * list: the two client-terms instruments and the disambiguation page are audience-specific
 * and belong in a contract flow, not in every page's chrome. `check-axe` asserts this list
 * against the SERVED footer on every audited route.
 */
export async function Footer() {
  const c = await getCompanyDetails();

  /**
   * **Company structured data — `G-04`, `GS-R001` §17. One record, from the same singleton.**
   *
   * `Organization` rather than `LocalBusiness`: Gridsmith works remotely and publishes no
   * opening hours (`GS-O004`), and `LocalBusiness` asks for both a physical customer-facing
   * location and hours. Declaring one would assert a premises visitors may attend, which is a
   * claim about the business nobody has made.
   *
   * The values are the ones already disclosed in the statutory footer below this and nowhere
   * else — including the registered office, which appears here because `PostalAddress` is what
   * makes `identifier` and `legalName` resolvable to the register entry, and because a machine
   * reading this reads the same page the footer is on. No invented `sameAs`, no logo, no
   * `aggregateRating`: `GS-O007` has supplied no brand assets, and a rating derived from ten
   * Freelancer reviews rendered under someone else's terms is not Gridsmith's to publish as
   * its own structured data.
   *
   * It is emitted here rather than on `/` alone because the footer is the one component that
   * already reads `companyDetails`, so there is no second copy of any value — which is the rule
   * this whole file exists to keep.
   */
  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: c.legalName,
    legalName: c.legalName,
    url: SITE_URL,
    identifier: c.companyNumber,
    ...(c.contactEmail?.trim() ? { email: c.contactEmail } : {}),
    ...(c.contactPhone?.trim() ? { telephone: c.contactPhone } : {}),
    address: { '@type': 'PostalAddress', streetAddress: c.registeredOffice, addressCountry: 'GB' },
    brand: DIVISIONS.map((d) => ({ '@type': 'Brand', name: d.label })),
  };

  return (
    <footer className={styles.footer}>
      {/* Not executed, so `script-src 'self' 'unsafe-inline'` is satisfied and no nonce is
          needed. `JSON.stringify` on values that came from the CMS: the closing-tag sequence is
          the one thing that could break out, so it is escaped. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organization).replaceAll('<', '\u003c'),
        }}
      />
      <div className={styles.footerInner}>
        <nav aria-label="Divisions">
          <ul className={styles.switcherList}>
            {DIVISIONS.map((d) => (
              <li key={d.href}>
                <a href={d.href} className={styles.switcherLink} data-division-accent={d.division}>
                  {d.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.footerGroups}>
          <nav aria-label="Company" className={styles.footerGroup}>
            <p className={styles.footerGroupHeading}>Company</p>
            <ul className={styles.footerList}>
              {COMPANY_LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className={styles.footerLink}>{l.label}</a>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Legal" className={styles.footerGroup}>
            <p className={styles.footerGroupHeading}>Legal</p>
            <ul className={styles.footerList}>
              {LEGAL_LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className={styles.footerLink}>{l.label}</a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Plain and permanent. A Companies Act disclosure is a legal requirement, not a
          design element, so it is not collapsed, not truncated and not behind a toggle. */}
      <div className={styles.statutory}>
        <div className={styles.statutoryInner}>
          <p>
            {c.legalName} · registered in {c.placeOfRegistration} · company number{' '}
            {c.companyNumber} · registered office {c.registeredOffice}
            {c.tradingAddress?.trim() ? ` · trading address ${c.tradingAddress}` : ''}
          </p>
          {/* FOUNDATION requires a persistent way back into the choice. It is its own
              tiny Client Component so the footer stays a Server Component. */}
          <p><ConsentReopen /></p>
          {c.contactEmail?.trim() || c.contactPhone?.trim() ? (
            <p>
              {c.contactEmail?.trim() ? (
                <a href={`mailto:${c.contactEmail}`} className={styles.statutoryLink}>
                  {c.contactEmail}
                </a>
              ) : null}
              {c.contactEmail?.trim() && c.contactPhone?.trim() ? ' · ' : ''}
              {c.contactPhone?.trim() ? c.contactPhone : null}
            </p>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
