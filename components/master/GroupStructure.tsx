import { Container } from '@/components/primitives/Container';
import { Heading } from '@/components/primitives/Heading';
import { Link } from '@/components/primitives/Link';
import { Numeric } from '@/components/primitives/Numeric';
import { Prose } from '@/components/primitives/Prose';
import { Section } from '@/components/primitives/Section';
import { getCompanyDetails } from '@/lib/company/companyDetails';
import styles from './master.module.css';

/**
 * Homepage block 7 — the group structure statement (`N-01`, `APP-FLOW.md` §2).
 *
 * Server Component, zero client JS.
 *
 * **`APP-FLOW.md` §2 gives this block the purpose "Honesty + legal", and both halves are
 * load-bearing.** Three trading names and one legal entity is the fact most likely to be
 * misread on this site, and misreading it has contractual consequences: a client who believes
 * they are contracting with "Gridsmith Press" is wrong about who owes them the work and wrong
 * about who they would sue.
 *
 * So it is stated plainly, on the homepage, above the fold of the evaluator's journey rather
 * than only in the footer's statutory block. `M-J4` — the evaluator — must be able to verify the
 * company in under ninety seconds, and this is the first thing that lets them start.
 *
 * The company number is read from `companyDetails`, the same singleton the footer reads. **There
 * is no second copy of it anywhere on this site**, which is the whole reason it is fetched here
 * rather than typed. Monospace, because the convention across all four themes is that monospace
 * marks anything verifiable, and a registered number is the most checkable fact available.
 */
export async function GroupStructure() {
  const company = await getCompanyDetails();

  return (
    <Section labelledBy="structure">
      <Container>
        <div className={styles.blockIntro}>
          <Heading level={2} id="structure">
            Three studios. One company. One contract.
          </Heading>
          <Prose>
            <p>
              Gridsmith Design, Gridsmith Digital and Gridsmith Press are trading divisions of{' '}
              {company.legalName}, registered in {company.placeOfRegistration} as company number{' '}
              <Numeric>{company.companyNumber}</Numeric>. They are not separate companies.
            </p>
            <p>
              Work that spans two studios is one engagement, one scope and one invoice. You never
              have to manage the boundary between them, because for contractual purposes there
              is not one.
            </p>
          </Prose>
          <p className={styles.blockMore}>
            <Link href="/about">How the company is structured, and how to check it</Link>
          </p>
        </div>
      </Container>
    </Section>
  );
}
