import { Container } from '@/components/primitives/Container';
import { Heading } from '@/components/primitives/Heading';
import { Link } from '@/components/primitives/Link';
import { Section } from '@/components/primitives/Section';
import { ProjectGrid } from '@/components/content/ProjectGrid';
import { listFeaturedProjects } from '@/lib/sanity/queries';
import styles from './master.module.css';

/**
 * Homepage block 4 — selected work (`N-01`, `APP-FLOW.md` §2).
 *
 * Server Component, zero client JS.
 *
 * ## Why this block was skipped once, and what changed
 *
 * `M-P2-25`: the block was **skipped, not deferred**, because there was no `project` content and
 * building it would have meant inventing client names and outcomes — which non-negotiable #2
 * forbids outright. What changed is not that the rule relaxed: it is that `S-01` produced 24
 * seed projects that are *structurally* complete and *visibly* fake. Every client name is
 * `[SEED]`-prefixed and every metric reads `[SEED] 00%`, so the template is exercised against
 * realistic shapes without a single claim being made.
 *
 * That distinction is the whole of `FOUNDATION` §7 and it is worth stating here, because the
 * next session to look at this block will see plausible-looking cards and needs to know that the
 * plausibility is in the *structure* and never in the *content*.
 *
 * ## Six, mixed, at least one cross-division
 *
 * `APP-FLOW.md` §2's requirement, met in the query rather than here: `listFeaturedProjects`
 * orders by `count(divisions) desc` first, so a cross-division project is at the head of the
 * list whenever one exists. Filtering for it in this component would mean fetching everything
 * and discarding most of it.
 *
 * `masterFeatured` is the field that decides eligibility — `master/SCHEMA.md` §1 — so which six
 * appear is an editorial decision made in the CMS, not a rule encoded here.
 */
export async function SelectedWork() {
  const projects = await listFeaturedProjects(6);
  if (projects.length === 0) return null;

  return (
    <Section labelledBy="selected-work">
      <Container>
        <div className={styles.blockIntro}>
          <Heading level={2} id="selected-work">
            Selected work
          </Heading>
          <p className={styles.processLede}>
            Across all three studios. The projects that involved more than one are first — they
            are the clearest evidence that the divisions are one company.
          </p>
        </div>
        <ProjectGrid projects={projects} headingLevel={3} />
        <p className={styles.blockMore}>
          <Link href="/work">See all work</Link>
        </p>
      </Container>
    </Section>
  );
}
