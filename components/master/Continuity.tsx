import { Container } from '@/components/primitives/Container';
import { Heading } from '@/components/primitives/Heading';
import { Link } from '@/components/primitives/Link';
import { Prose } from '@/components/primitives/Prose';
import { Section } from '@/components/primitives/Section';
import styles from './master.module.css';

/**
 * Homepage block 3 — the one-company argument (`N-01`, `APP-FLOW.md` §2).
 *
 * Server Component, zero client JS. `APP-FLOW.md` §2 gives this block the primary action
 * `→ /approach`; that route did not exist when the block shipped, so it carried no link (`M-03`:
 * only links whose routes exist, and `check-axe` fails the build on a same-origin 404).
 * **`N-04` added the route and this commit adds the link.** It matters more here than anywhere
 * else on the page: this block is `M-J2`'s first stop and `/approach` is where that journey goes.
 *
 * **This is `M-J2`'s entry point, the journey the master layer exists for.** A visitor whose
 * need spans two divisions must have a path that does not require picking one, and this block
 * is the first thing below the routing cards that speaks to them.
 *
 * ## Deviation from `APP-FLOW.md` §2, recorded there in this commit
 *
 * The table says *"the one-company argument, condensed (3 short points)"*. The approved copy is
 * **a heading and one paragraph**, not three points. Splitting an approved paragraph into three
 * bullets would be rewriting it, and the founder approved the sentences — non-negotiable #2
 * covers invented structure as much as invented facts, because a three-point list makes a claim
 * about what the three things are.
 *
 * ## Asymmetric, not centred
 *
 * `DESIGN.md` §4: *"asymmetric anchoring for prose blocks; centred only for the hero and CTA
 * bands"*. Blocks 1 and 9 are the exceptions; this one is not.
 *
 * ## The copy states the relationship, and deliberately not more than that
 *
 * `Q-M21`. It says the studios share the client context — the business, the goals, the work
 * already done — and never that the same people execute across all three. Specialist teams stay
 * specialist. **No copy in any division may contradict this**, which is why it is written here
 * rather than left as an implication of the word "together".
 */
export function Continuity() {
  return (
    <Section surface="sunken">
      <Container>
        <div className={styles.blockIntro}>
          <Heading level={2} size="d2">
            You shouldn’t have to introduce your business from scratch every time you need a
            different kind of expertise.
          </Heading>
          <Prose>
            <p>
              Gridsmith brings three specialist studios together under one relationship. Each has
              its own expertise, people and standards, while sharing the context that matters:
              your business, your goals and the work we’ve already done together.
            </p>
          </Prose>
          <p className={styles.blockMore}>
            <Link href="/approach">How three studios work as one company</Link>
          </p>
        </div>
      </Container>
    </Section>
  );
}
