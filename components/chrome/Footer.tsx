import { ConsentReopen } from '@/components/consent/ConsentReopen';
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
 * **`APP-FLOW.md` §8 also lists Company and Legal link groups, and this comment used to say
 * those routes did not exist. They do now.** `/about`, `/approach`, `/contact`, `/work`,
 * `/insights` and `/legal/[slug]` all shipped in Epics N and L. The groups are unbuilt rather
 * than unbuildable, and today the only link to a legal document anywhere in the chrome is on
 * the Press landing page. Filed as `master/PROJECT-TRACKER.md` `M-P2-22`, which also records
 * why it may not be P2 at all. `check-axe` resolves every link on every audited route, so the
 * groups still cannot get ahead of their routes.
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
