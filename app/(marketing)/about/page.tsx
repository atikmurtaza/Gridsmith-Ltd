import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Numeric } from '@/components/primitives/Numeric';
import { Connect } from '@/components/content/Connect';
import { GroupSections } from '@/components/content/GroupSections';
import { Opening } from '@/components/shared/Opening';
import { StudioMap } from '@/components/shared/StudioMap';
import { getCompanyDetails } from '@/lib/company/companyDetails';
import { getGroupPage } from '@/lib/sanity/queries';
import { masterOpenGraph } from '@/lib/seo/site';
import styles from '@/components/shared/shared.module.css';

const TITLE = 'About Gridsmith Ltd — one company, three specialist studios';
const DESCRIPTION =
  'Gridsmith is one UK company with three studios — design, digital and publishing — under one contract, so work moves between them without starting over.';

/** Own title, description and share card (`GS-SEO-001`). */
export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: masterOpenGraph(TITLE, DESCRIPTION),
};

/**
 * `/about` — `N-07`, rebuilt at `GS-R001-R`.
 *
 * Server Component, zero client JS.
 *
 * ## What changed, and why it is not a smaller change than it looks
 *
 * This page was a **legal-registration display**. Under the heading *"The checkable facts"* it
 * rendered a table of the registered name, the company number and the place of registration, in
 * monospace, introduced by a paragraph inviting the reader to verify them against the Companies
 * House register. That was a deliberate design — `APP-FLOW.md` §1 gives `M-J4` an evaluator who
 * must be able to confirm this is a real company in under ninety seconds, and the table
 * answered it.
 *
 * **The owner's `GS-R001-R` decision is that it is the wrong page for it**, and the reasoning is
 * commercial rather than legal: being incorporated is not a differentiator, every competitor has
 * a company number, and leading a brand page with one reads as a business that has nothing
 * better to say about itself. So the marketing presentation and the legal disclosure are
 * separated. The disclosure did not move — **it was already in the statutory footer of every
 * page**, which is where SI 2015/17 reg. 25(2) puts it and where it satisfies the regulation
 * (`_legal/02-CITATION-LEDGER.md` `L-TDR-25`). Nothing about compliance changes here; what is
 * removed is a **second, promotional copy of it**.
 *
 * What remains of `M-J4` is one restrained line at the foot of the page: the company number,
 * the place of registration, and a pointer to the footer. An evaluator can still finish in
 * ninety seconds. Nobody is being sold incorporation.
 *
 * ## No registered office, and no telephone row
 *
 * The registered office came off at `GS-O004` and stays off — it is a residential address and
 * the footer discloses it once. The `Telephone` row is removed at `GS-R001-R`: the number is
 * still published, but it is a WhatsApp and SMS number now, not a `tel:` link, and it belongs
 * in `Connect` with the channel named beside it rather than in a facts table that implies
 * dialling. `check:company` question 3 refuses a `tel:` href anywhere on the site.
 *
 * ## There is no team section, and its absence is still the decision
 *
 * `Q-M9`. `GS-O004`: no public team members, no founder profile, no placeholder staff, and
 * `GS-R001-R` reaffirms it. It is enforced by the query and the renderer being deleted rather
 * than by a flag; `check:company` question 6 asserts the absence on the served page. **Do not
 * add a "meet the team" section, a founder biography or staff cards here.**
 */
export default async function Page() {
  const [page, company] = await Promise.all([getGroupPage('about'), getCompanyDetails()]);
  if (!page) notFound();

  return (
    <main id="main" tabIndex={-1} data-nav="about">
      <Opening size="spacious" place="About" title={page.title} lead={page.intro ?? undefined} />

      <div className={styles.sheet}>
        <GroupSections
          sections={page.sections}
          pair={['role', 'character']}
          insert={{
            structure: () => (
              <section className={`${styles.frame} ${styles.band}`} aria-labelledby="studios">
                <div className={`${styles.wrap} ${styles.bandHead} ${styles.bandHeadOnly}`}>
                  <div>
                    <h2 id="studios" className={styles.rowTitle}>One company, three studios</h2>
                  </div>
                  <StudioMap />
                </div>
              </section>
            ),
          }}
        />
      </div>

      <Connect
        contactEmail={company.contactEmail}
        contactPhone={company.contactPhone}
        responseCommitment={company.responseCommitment}
        registration={
          <>
            {company.legalName} is registered in {company.placeOfRegistration}, company number{' '}
            <Numeric>{company.companyNumber}</Numeric>. The full statutory details, including the
            registered office, are in the footer of every page.
          </>
        }
      />
    </main>
  );
}
