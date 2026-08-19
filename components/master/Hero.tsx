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
 * ## The copy is approved, and the homepage is hardcoded
 *
 * `Q-M21` is resolved for blocks 1–2. The headline and intro are the approved words, passed in
 * by the route rather than fetched: **the homepage is deliberately not CMS-driven**. It changes
 * rarely, every block is bespoke, and `groupPage` is correctly closed to `approach` and `about`
 * — there is no homepage schema and none is to be built. Non-negotiable #2 is satisfied by the
 * copy being approved rather than by it being marked, which is the only other way to satisfy it.
 *
 * The intro is optional because block 1 is the only caller and the shape is the hero's, not a
 * general one; if a second caller ever needs it the prop is already here.
 *
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
