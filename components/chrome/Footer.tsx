import { getCompanyDetails } from '@/lib/company/companyDetails';
import type { Division } from './RootShell';
import styles from './chrome.module.css';

const DIVISIONS: { href: string; label: string; division: Division }[] = [
  { href: '/design', label: 'Gridsmith Design', division: 'design' },
  { href: '/digital', label: 'Gridsmith Digital', division: 'digital' },
  { href: '/press', label: 'Gridsmith Press', division: 'press' },
];

/**
 * The shared footer (`M-04`, FR-M12). Async Server Component — it reads `companyDetails`
 * once per build. Nothing here is hardcoded: every company fact comes from the singleton.
 *
 * **The row summarised the legal requirement as "registered name, registered number,
 * registered office". That is incomplete, and the VAT line's basis is a different
 * instrument entirely.** Checked against the legislation rather than the summary:
 *
 * | Particular | Source |
 * |---|---|
 * | Registered name | Companies (Trading Disclosures) Regulations 2015 (SI 2015/17) reg. 24(2) |
 * | **The part of the UK in which the company is registered** | reg. 25(2)(a) — *missing from the row's summary* |
 * | Registered number | reg. 25(2)(b) |
 * | Registered office address | reg. 25(2)(c) |
 * | VAT identification number | **Electronic Commerce (EC Directive) Regulations 2002 reg. 6(1)(g)** — not the Companies Act, and it binds only while the activity is VAT-subject |
 * | Name, geographic address, and a rapid contact route incl. email | e-commerce regs reg. 6(1)(a)–(c) |
 *
 * That last row is why `contactEmail` renders here and why `check:launch` requires it on a
 * production dataset alongside the VAT number: reg. 6(1)(c) is a launch obligation of the
 * same shape, and it was not in the tracker row at all.
 *
 * Every conditional line follows one rule — **render when the field is non-empty, omit when
 * empty**. Supplying a value is a content edit: no schema change, no code change, no deploy.
 *
 * Plain `<a>`, not the `Link` primitive, for the same two reasons as the header:
 * `TECH-SPEC.md` §3 requires route-group navigation to be a document load, and the primitive
 * in a shared layout would put `next/link`'s client runtime in every route's chunk.
 *
 * The division switcher lives here and only here (`TECH-SPEC.md` §3) — a header-level
 * switcher pulls buyers sideways mid-funnel. `APP-FLOW.md` §8 also lists Company and Legal
 * link groups; those routes are Epic N and Epic L and do not exist, so they are not linked.
 * `check-axe` resolves every link on every audited route and would fail the build if they
 * were.
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
      </div>

      {/* Plain and permanent. A Companies Act disclosure is a legal requirement, not a
          design element, so it is not collapsed, not truncated and not behind a toggle. */}
      <div className={styles.statutory}>
        <div className={styles.statutoryInner}>
          <p>
            {c.legalName} · registered in {c.placeOfRegistration} · company number{' '}
            {c.companyNumber} · registered office {c.registeredOffice}
            {c.tradingAddress?.trim() ? ` · trading address ${c.tradingAddress}` : ''}
            {c.vatNumber?.trim() ? ` · VAT number ${c.vatNumber}` : ''}
          </p>
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
