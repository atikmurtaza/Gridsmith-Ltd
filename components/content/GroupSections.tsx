import { Container } from '@/components/primitives/Container';
import { Heading } from '@/components/primitives/Heading';
import { Prose } from '@/components/primitives/Prose';
import { Section } from '@/components/primitives/Section';
import { Blocks } from '@/components/content/Blocks';
import { ContinuityExample } from '@/components/master/ContinuityExample';
import { ProcessStages } from '@/components/master/ProcessStages';
import type { GroupSection } from '@/lib/sanity/queries';

/**
 * Renders a `groupPage`'s sections — `/approach` (`N-04`) and `/about` (`N-07`).
 *
 * Server Component, zero client JS.
 *
 * ## `layout` is a closed list, and this switch is why
 *
 * `N-03` closed `groupSection.layout` to five values and `check:schemas` proves the rule runs
 * on write, not merely in the Studio dropdown. The guarantee it buys is here: every layout an
 * editor can choose is a case below, so a saved section always renders. An open field would let
 * a content edit produce a section that saves and displays as nothing — the failure mode
 * `groupPage`'s docstring calls out, and the one an editor cannot report because it looks like
 * their content simply vanished.
 *
 * ## `sunken-plain` is deliberately undesigned
 *
 * `master/SCHEMA.md` §2: the limits block *"is a layout value rather than a styling decision so
 * it cannot be prettified by a later content edit"*. It looks unpolished because polishing it
 * would sell the limits, and the whole point of an honest-limits section is that it does not
 * read as marketing. Do not add an icon, a border treatment or an illustration here.
 *
 * `continuity` renders the component's empty state today. `N-05` made a seed example
 * impossible: `verified` is hard-true, so a placeholder would have to assert that someone
 * confirmed a story that did not happen. `Q-M6` supplies a real one.
 */
export function GroupSections({ sections }: { sections: GroupSection[] | null }) {
  if (!sections || sections.length === 0) return null;

  return (
    <>
      {sections.map((section) => {
        const headingId = `section-${section.key}`;
        const body = (
          <>
            <Heading level={2} id={headingId}>
              {section.heading}
            </Heading>
            <Prose>
              <Blocks value={section.body} />
            </Prose>
            {section.layout === 'process' ? <ProcessStages headingLevel={3} /> : null}
            {section.layout === 'continuity' ? <ContinuityExample example={null} /> : null}
          </>
        );

        return (
          <Section
            key={section.key}
            labelledBy={headingId}
            surface={section.layout === 'sunken-plain' ? 'sunken' : undefined}
          >
            <Container width={section.layout === 'two-column' ? undefined : 'narrow'}>
              {body}
            </Container>
          </Section>
        );
      })}
    </>
  );
}
