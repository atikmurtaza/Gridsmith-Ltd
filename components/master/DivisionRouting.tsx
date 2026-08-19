import { Card } from '@/components/primitives/Card';
import { Container } from '@/components/primitives/Container';
import { Heading } from '@/components/primitives/Heading';
import { Section } from '@/components/primitives/Section';
import styles from './master.module.css';

/**
 * Homepage block 2 — division routing (`N-01`, `APP-FLOW.md` §3, `FR-M02`).
 *
 * Server Component, zero client JS. Hover, focus and the sibling dim are CSS; a
 * `useState` here would put 3KB of client boundary on the route with the tightest
 * Lighthouse gate in the programme to do what `:hover` already does.
 *
 * **This is `M-J3`, the single most important block on the page.** `APP-FLOW.md` §2: it
 * must sit above the second viewport at every breakpoint, and nothing above it may compete
 * with it — which is why block 1 is one sentence and not a services list.
 *
 * ## The copy is approved and hardcoded
 *
 * `Q-M21`, resolved for blocks 1–2: the homepage is not CMS-driven. These are the approved
 * words and they are not to be reworded without the same approval.
 *
 * **They deliberately do not imply that the same people execute across all three studios.**
 * Specialist teams stay specialist; Gridsmith holds the relationship and the client context.
 * No copy in any division may contradict that.
 *
 * ## Plain `<a>`, not the `Link` primitive — the same rule the header and footer already follow
 *
 * `TECH-SPEC.md` §3: **navigation between route groups is a full document load.** The four root
 * layouts have no shared ancestor, so a client-side transition across the boundary cannot
 * happen — and §9 wants it that way, because the theme change *is* the transition.
 *
 * `next/link` therefore buys nothing here, and this was measured rather than argued. With the
 * primitive in place, `/` prefetched **three RSC payloads totalling 33,531 B** on load, and the
 * click was still a `document` request that discarded all three. The cost was **4.8KB gz of
 * JS** on the route with the strictest Lighthouse target in the programme.
 *
 * The `Link` primitive stays correct for within-group navigation, where its underline rule and
 * external-link handling matter. Across the boundary it is the wrong component, which `Footer`
 * and `Header` both say in the same words — **block 2 shipped against a convention that was
 * already written down in two files.**
 *
 * ## Two deviations from `DESIGN.md` §5, both recorded there in this commit
 *
 * 1. The card body is two sentences of prose, not *"three example services in mono"*. The
 *    approved copy supplies sentences, and splitting them on commas would produce three
 *    items for Design, four for Digital and a broken phrase for Press. Mono would also be
 *    wrong: the convention across all four themes is that **monospace marks anything
 *    verifiable**, and a services list is a description, not a fact anyone can check.
 * 2. The "not sure / need more than one" line ships as **text, not a link**. `/contact` does
 *    not exist yet, and `M-03` set the rule that only links whose routes exist are shipped —
 *    `check-axe` fails the build on a same-origin link that 404s. It becomes a link in the
 *    commit that adds `/contact`, and `DESIGN.md`'s requirement that it not be visually
 *    subordinate is met now: `--text-lg`, `--ink`, full weight.
 */
const DIVISIONS = [
  {
    href: '/design',
    name: 'Gridsmith Design',
    services: 'Brand identity, graphic and 3D design, CAD and engineering drawings.',
    character: 'Creative and technical design built with the same attention to detail.',
    className: 'cardDesign',
  },
  {
    href: '/digital',
    name: 'Gridsmith Digital',
    services: 'Websites, software, applications and AI integrations.',
    character:
      'Custom digital products and internal systems designed around how your business actually works.',
    className: 'cardDigital',
  },
  {
    href: '/press',
    name: 'Gridsmith Press',
    services: 'Publishing, writing and content from manuscript to market.',
    character:
      'Professional support for authors and businesses, while keeping ownership where it belongs.',
    className: 'cardPress',
  },
] as const;

export function DivisionRouting() {
  return (
    <Section>
      <Container>
        <ul className={styles.divisionCards}>
          {DIVISIONS.map((d) => (
            <Card as="li" key={d.href} linked className={styles[d.className]}>
              <Heading level={2} size="d4">
                <a href={d.href} className={styles.divisionLink}>
                  {d.name}
                </a>
              </Heading>
              <p className={styles.divisionServices}>{d.services}</p>
              <p className={styles.divisionCharacter}>{d.character}</p>
            </Card>
          ))}
        </ul>
        <p className={styles.divisionFallback}>
          Not sure, or need more than one? Tell us what you need.
        </p>
      </Container>
    </Section>
  );
}
