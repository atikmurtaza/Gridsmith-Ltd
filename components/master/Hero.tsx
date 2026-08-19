import { Container } from '@/components/primitives/Container';
import { Heading } from '@/components/primitives/Heading';
import { Section } from '@/components/primitives/Section';
import styles from './master.module.css';

/**
 * Homepage block 1 — the hero (`N-01`, `APP-FLOW.md` §2).
 *
 * Server Component, zero client JS, and no entrance animation: `DESIGN.md` §6 prohibits
 * entrance animation on above-the-fold content outright, and this is the LCP element on the
 * route with the tightest Lighthouse gate in the programme.
 *
 * **One sentence, and not a services list.** `APP-FLOW.md` §2 says so in bold, and `M-J3`
 * explains why — nothing on the homepage may compete with the division routing block above
 * the second scroll. A hero that enumerates services is a second routing block placed first.
 *
 * Centred, per `DESIGN.md` §4: *"asymmetric anchoring for prose blocks; centred only for the
 * hero and CTA bands"*. `--text-4xl` display at 500/-0.03em/1.02 is §3's display-hero row,
 * carried by `Heading size="display"` rather than re-declared here.
 *
 * ## The sentence does not exist, and it is not being written here
 *
 * No approved positioning line appears in any specification — `APP-FLOW.md` §2 names the slot,
 * `PRD.md` and `DESIGN.md` describe the job it does, and none of them supplies the words.
 * CLAUDE.md non-negotiable #2: *never invent content… mark `[TK]` and stop.* A hero sentence is
 * the single most-read piece of copy on the site and the one a founder will have opinions
 * about; drafting it here would put a plausible invention in the place hardest to notice it
 * later. `Q-M21`.
 *
 * The structure is built and measured anyway, because the measurement does not depend on the
 * wording — which is the whole argument for building this page one block at a time.
 */
export function Hero({ headline, intro }: { headline: string; intro?: string }) {
  return (
    <Section rhythm="loose" className={styles.hero}>
      <Container width="narrow">
        <Heading level={1} size="display" className={styles.heroHeadline}>
          {headline}
        </Heading>
        {intro ? <p className={styles.heroIntro}>{intro}</p> : null}
      </Container>
    </Section>
  );
}
