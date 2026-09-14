import { Button } from '@/components/primitives/Button';
import { Container } from '@/components/primitives/Container';
import { Heading } from '@/components/primitives/Heading';
import { Section } from '@/components/primitives/Section';
import { getCompanyDetails } from '@/lib/company/companyDetails';
import { ENQUIRY_CTA, enquiryHref } from '@/lib/services/architecture';
import styles from './master.module.css';

/**
 * Homepage block 9 — the CTA band (`N-01`, `APP-FLOW.md` §2).
 *
 * Server Component, zero client JS.
 *
 * **Centred, and that is one of exactly two places the site centres anything.** `DESIGN.md` §4:
 * *"asymmetric anchoring for prose blocks; centred only for the hero and CTA bands"*. Blocks 1
 * and 9 are the two exceptions and every block between them is anchored.
 *
 * ## The commitment comes from the CMS, not from this file
 *
 * Non-negotiable #5 — nothing on this site may promise a response faster than the end of the
 * next business day, and there is **one source of truth**:
 * `companyDetails.responseCommitment`. A CTA band is exactly where someone would write "we'll
 * get back to you within the hour" without thinking, so the sentence is fetched rather than
 * typed. `H-07` audits every confirmation surface in all four route groups against this.
 *
 * The heading stays `APP-FLOW.md` §2's own. **The button wording is the master CTA from
 * `lib/services/architecture.ts`** (`GS-P03`): Master holds the relationship rather than a
 * production service, so its action is to discuss requirements, and the destination is the one
 * enquiry form every division's CTA also reaches — with no division preselected.
 */
export async function CtaBand() {
  const company = await getCompanyDetails();

  return (
    <Section rhythm="loose" surface="raised" labelledBy="cta">
      <Container width="narrow">
        <div className={styles.ctaBand}>
          <Heading level={2} id="cta">
            Tell us what you need.
          </Heading>
          <p className={styles.ctaLede}>
            One form, all three studios. If what you need spans more than one of them, that is
            the first option on it.
          </p>
          <Button href={enquiryHref()}>{ENQUIRY_CTA.master}</Button>
          <p className={styles.ctaCommitment}>{company.responseCommitment}</p>
        </div>
      </Container>
    </Section>
  );
}
