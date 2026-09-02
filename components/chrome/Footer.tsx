import { ConsentReopen } from '@/components/consent/ConsentReopen';
import { getCompanyDetails } from '@/lib/company/companyDetails';
import { LEGAL_FOOTER_SLUGS } from '@/lib/legal/slugs';
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

  return (
    <footer className={styles.footer}>
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
          {c.contactEmail?.trim() ? (
            <p>
              <a href={`mailto:${c.contactEmail}`} className={styles.statutoryLink}>
                {c.contactEmail}
              </a>
            </p>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
