import type { ReactNode } from 'react';
import { Container } from '@/components/primitives/Container';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Heading } from '@/components/primitives/Heading';
import { Link } from '@/components/primitives/Link';
import { Prose } from '@/components/primitives/Prose';
import { Section } from '@/components/primitives/Section';
import { Button } from '@/components/primitives/Button';
import { ProcessStages } from '@/components/master/ProcessStages';
import { ProjectGrid } from '@/components/content/ProjectGrid';
import { ServiceList } from '@/components/content/ServiceList';
import { TestimonialList } from '@/components/content/TestimonialList';
import { getCompanyDetails } from '@/lib/company/companyDetails';
import {
  listProjectsForDivision,
  listServices,
  listTestimonialsForDivision,
  type Division,
} from '@/lib/sanity/queries';
import styles from './divisions.module.css';

/**
 * The division landing page, shared by `/design`, `/digital` and `/press`.
 *
 * ## One composition, four voices — and that is the architecture, not a shortcut
 *
 * `CLAUDE.md`: *"Four distinct voices, one unmistakable hand… achieved through **shared
 * structure, not shared colour**: identical grid, spacing scale, type scale, component shapes
 * and motion language, with each division supplying its own palette and display face."*
 *
 * This component is that sentence made executable. It names no colour and no typeface. Every
 * rule it and its children rely on resolves through the theme tokens the route group's root
 * layout has already set on `<html data-division>` — so Design renders amber on near-black in a
 * neo-grotesque, Digital electric blue on off-white in a **monospace** display face, and Press
 * deep green on warm paper in a **serif**, from the same markup. Three separate components
 * would have been three places for the grid to drift.
 *
 * What each division supplies is `copy`: its positioning line, what it actually does, and the
 * words on its own call to action. Nothing structural.
 *
 * ## What this is not
 *
 * **It is not the full division hub.** `design/APP-FLOW.md` §3 specifies a track fork, a
 * standards and capability strip and a Design Desk teaser; Digital and Press have their own
 * equivalents. Those are `B-*`, `U-*` and `P-*` rows and they depend on division content that
 * does not exist. This is the shell: hero, services with prices, work, proof, process and a
 * call to action — a real page a visitor can use and a real page to point a social profile at,
 * built from the content that does exist.
 *
 * Server Component, zero client JS.
 *
 * ## Every service card carries a price, and every price says INDICATIVE
 *
 * Non-negotiable #3 is enforced in the schema — a service cannot be saved without pricing — and
 * `Price` renders the badge unconditionally rather than only on seed records, because a reader
 * has no access to `isSeed` and every price here is indicative until a scope is agreed. See
 * `Price.tsx`.
 */
export type DivisionCopy = {
  /** The trading name, exactly as the footer's statutory block gives it. */
  name: string;
  /** One line. What this division is, not a services list — the same rule as the master hero. */
  positioning: string;
  /** Two or three sentences under it. */
  intro: string[];
  /** The heading over the services block. */
  servicesHeading: string;
  servicesLede: string;
  /** The heading over the work block. */
  workHeading: string;
  /** The words on the conversion action. Division-specific because the ask differs. */
  ctaHeading: string;
  ctaLede: string;
  ctaLabel: string;
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
   * Press uses it for the rights statement — non-negotiable #6 — and it is a *slot* rather than
   * a `showRights` boolean because the next division to need one will need a different thing.
   * A boolean per division turns this component into three components sharing a file.
   *
   * It sits inside `<main>` and must not contain an `h1`: this component owns the only one.
   */
  afterHero?: ReactNode;
}) {
  const [services, projects, testimonials, company] = await Promise.all([
    listServices(division),
    listProjectsForDivision(division, 6),
    listTestimonialsForDivision(division, 3),
    getCompanyDetails(),
  ]);

  return (
    <main id="main" tabIndex={-1}>
      <Section rhythm="loose">
        <Container>
          {/* The division names itself before the positioning line. A visitor arriving from a
              social profile or a search result needs to know which studio they are on before
              they read what it claims — the theme tells them, but only if they already know
              the system. */}
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
          <ServiceList services={services} />
        </Container>
      </Section>

      <Section labelledBy="work">
        <Container>
          <div className={styles.blockIntro}>
            <Heading level={2} id="work">
              {copy.workHeading}
            </Heading>
          </div>
          <ProjectGrid
            projects={projects}
            emptyTitle="No work published here yet"
            emptyBody="Projects appear here as they are published."
          />
          <p className={styles.more}>
            {/* The canonical case studies live on the master layer — `N-09`, and `N-10`'s whole
                point: three divisions each publishing the same cross-division project under
                their own path is three URLs competing for one piece of work. */}
            <Link href="/work">All work, across the three studios</Link>
          </p>
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
            {/* The stage names come from `lib/process/canonical.ts` and never from the CMS —
                `00-PROCESS.md` rule 1 says they are fixed and not to be reworded per division,
                and the strongest way to hold that is to not accept them from an editor at all.
                A visitor moving between divisions sees one company with one way of working. */}
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

      <Section rhythm="loose" surface="raised" labelledBy="cta">
        <Container width="narrow">
          <div className={styles.cta}>
            <Heading level={2} id="cta">
              {copy.ctaHeading}
            </Heading>
            <p className={styles.ctaLede}>{copy.ctaLede}</p>
            <Button href="/contact">{copy.ctaLabel}</Button>
            {/* One source of truth for what we promise — non-negotiable #5. No page on this
                site writes this sentence itself. */}
            <p className={styles.ctaCommitment}>{company.responseCommitment}</p>
          </div>
        </Container>
      </Section>
    </main>
  );
}
