import { Container } from '@/components/primitives/Container';
import { Heading } from '@/components/primitives/Heading';
import { Section } from '@/components/primitives/Section';
import { ProcessStages } from '@/components/master/ProcessStages';
import styles from './master.module.css';

/**
 * Homepage block 5 — the six-stage process, condensed (`N-01`, `APP-FLOW.md` §2).
 *
 * Server Component, zero client JS.
 *
 * **Block 4 is skipped, not forgotten.** `APP-FLOW.md` §2 puts *"Selected work — 6, mixed, at
 * least 1 cross-division"* before this. There is no `caseStudy` schema and no real client work
 * to cite; building it would mean inventing client names and outcomes, which non-negotiable #2
 * forbids outright. It is raised rather than approximated — see the tracker entry.
 *
 * ## "Condensed" is a prop that does not exist, and that is the point
 *
 * `/approach` §4 item 4 renders the same six stages *full*. The difference between full and
 * condensed here is **what is passed in, not a variant of the component**: this block passes no
 * `detail`, so `divisionDetail`, `duration` and `clientTime` are all absent and each stage is a
 * number, a title and its canonical description. A `condensed` boolean would be a second way to
 * express the same absence, and the two would drift.
 *
 * ## No link, and the same rule as blocks 2 and 3
 *
 * `APP-FLOW.md` §2 gives this block `→ /approach`. That route does not exist, so nothing links
 * to it — `M-03`, and `check-axe` fails the build on a same-origin 404.
 *
 * ## The heading is sourced, not written
 *
 * `Q-M21` records that blocks 3–9 still need approved copy. This block introduces no *claim*:
 * the stages and their descriptions come from `_shared/00-PROCESS.md`, which is FIXED, and the
 * single sentence under the heading restates that file's own argument for why one process is
 * published across three divisions — *"A visitor who moves between divisions sees one company
 * with one way of working"*. Nothing here asserts a figure, a duration or an outcome. The label
 * still wants founder approval like the rest of blocks 4–9; it is flagged, not invented.
 *
 * `h2` here, so `ProcessStages` renders its stage titles at `h3` — the level below this
 * section's own heading, which is what `check:headings` and the document outline require.
 */
export function Process() {
  return (
    <Section>
      <Container>
        <div className={styles.blockIntro}>
          <Heading level={2} size="d2">
            How we work
          </Heading>
          <p className={styles.processLede}>
            The same six stages in all three studios. What happens inside them differs by the
            work; the shape of the relationship does not.
          </p>
        </div>
        <ProcessStages headingLevel={3} />
      </Container>
    </Section>
  );
}
