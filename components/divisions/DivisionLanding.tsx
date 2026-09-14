import type { ReactNode } from 'react';
import { Container } from '@/components/primitives/Container';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Heading } from '@/components/primitives/Heading';
import { Link } from '@/components/primitives/Link';
import { Prose } from '@/components/primitives/Prose';
import { Section } from '@/components/primitives/Section';
import { Button } from '@/components/primitives/Button';
import { ProcessStages } from '@/components/master/ProcessStages';
import { ServiceList } from '@/components/content/ServiceList';
import { TestimonialList } from '@/components/content/TestimonialList';
import { getCompanyDetails } from '@/lib/company/companyDetails';
import { ENQUIRY_CTA, PRIVATE_EXAMPLES_NOTICE, enquiryHref } from '@/lib/services/architecture';
import { listServices, listTestimonialsForDivision, type Division } from '@/lib/sanity/queries';
import styles from './divisions.module.css';

/**
 * The division landing page, shared by `/design`, `/digital` and `/press`.
 *
 * ## One composition, four voices — and that is the architecture, not a shortcut
 *
 * `CLAUDE.md`: *"Four distinct voices, one unmistakable hand… achieved through **shared
 * structure, not shared colour**."* This component names no colour and no typeface; every rule
 * resolves through the theme tokens the route group's root layout has already set on
 * `<html data-division>`. What each division supplies is `copy`. Nothing structural.
 *
 * ## What changed at `GS-P03`
 *
 * - **Services are grouped by capability group and carry no price** (`GS-D002`).
 * - **The "Selected work" block is gone** (`GS-D001`). Gridsmith does not hold permission to
 *   publish client work, so a portfolio grid would either be empty or fabricated. It is
 *   replaced by a plain statement that examples may be discussed privately — which neither
 *   claims all unshown work is confidential nor promises an example exists.
 * - **The CTA is contextual**: its wording is the division's, and it carries the division to
 *   the shared enquiry form so the lead arrives already routed.
 *
 * The verified external reviews stay: they are evidence a reader can check at the source.
 *
 * **It is not the full division hub.** Those blocks are `B-*`, `U-*` and `P-*` rows and depend
 * on approved content. Server Component, zero client JS.
 */
export type DivisionCopy = {
  /** The trading name, exactly as the footer's statutory block gives it. */
  name: 'Gridsmith Design' | 'Gridsmith Digital' | 'Gridsmith Press';
  /** One line. What this division is, not a services list — the same rule as the master hero. */
  positioning: string;
  /** Two or three sentences under it. */
  intro: string[];
  /** The heading over the services block. */
  servicesHeading: string;
  servicesLede: string;
  /** The words over the conversion action. The button wording is the division's CTA. */
  ctaHeading: string;
  ctaLede: string;
};

export async function DivisionLanding({
  division,
  copy,
  afterHero,
}: {
  division: Division;
  copy: DivisionCopy;
  /**
   * One slot, directly under the hero, for the thing a division cannot launch without.
   *
   * Press uses it for the rights statement — non-negotiable #6. It sits inside `<main>` and must
   * not contain an `h1`: this component owns the only one.
   */
  afterHero?: ReactNode;
}) {
  const [services, testimonials, company] = await Promise.all([
    listServices(division),
    listTestimonialsForDivision(division, 3),
    getCompanyDetails(),
  ]);

  return (
    <main id="main" tabIndex={-1}>
      {/* The hero is a colour band: `--accent-2` as a surface with `--accent-ink` measured on
          it. A background colour changes no geometry, so CLS and the LCP element are unaffected. */}
      <Section rhythm="loose" surface="accent">
        <Container>
          <Eyebrow>{copy.name}</Eyebrow>
          <Heading level={1} size="display" className={styles.hero}>
            {copy.positioning}
          </Heading>
          <Prose>
            {copy.intro.map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
          </Prose>
        </Container>
      </Section>

      {afterHero}

      <Section surface="sunken" labelledBy="services">
        <Container>
          <div className={styles.blockIntro}>
            <Heading level={2} id="services">
              {copy.servicesHeading}
            </Heading>
            <p className={styles.lede}>{copy.servicesLede}</p>
          </div>
          {/* Only Digital has per-service routes today (`U-08`). */}
          <ServiceList
            services={services}
            basePath={division === 'digital' ? '/digital/services' : undefined}
          />
        </Container>
      </Section>

      <Section labelledBy="examples">
        <Container width="narrow">
          <Heading level={2} id="examples">
            Examples of our work
          </Heading>
          <Prose>
            <p>{PRIVATE_EXAMPLES_NOTICE}</p>
          </Prose>
        </Container>
      </Section>

      {testimonials.length > 0 ? (
        <Section surface="sunken" labelledBy="said">
          <Container>
            <div className={styles.blockIntro}>
              <Heading level={2} id="said">
                What clients have said
              </Heading>
            </div>
            <TestimonialList testimonials={testimonials} />
          </Container>
        </Section>
      ) : null}

      <Section labelledBy="process">
        <Container>
          <div className={styles.blockIntro}>
            <Heading level={2} id="process">
              How we work
            </Heading>
            {/* The stage names come from `lib/process/canonical.ts` and never from the CMS. */}
            <p className={styles.lede}>
              The same six stages in all three studios. What happens inside them differs by the
              work; the shape of the relationship does not.
            </p>
          </div>
          <ProcessStages headingLevel={3} />
          <p className={styles.more}>
            <Link href="/approach">The six stages in full</Link>
          </p>
        </Container>
      </Section>

      <Section rhythm="loose" surface="accent" className={styles.ctaBand} labelledBy="cta">
        <Container width="narrow">
          <div className={styles.cta}>
            <Heading level={2} id="cta">
              {copy.ctaHeading}
            </Heading>
            <p className={styles.ctaLede}>{copy.ctaLede}</p>
            <Button href={enquiryHref(division)} variant="inverse">
              {ENQUIRY_CTA[division]}
            </Button>
            {/* One source of truth for what we promise — non-negotiable #5. */}
            <p className={styles.ctaCommitment}>{company.responseCommitment}</p>
          </div>
        </Container>
      </Section>
    </main>
  );
}
