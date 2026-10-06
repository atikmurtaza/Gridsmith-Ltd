import { Fragment, type ReactNode } from 'react';
import { Prose } from '@/components/primitives/Prose';
import { Blocks } from '@/components/content/Blocks';
import { ProcessRail } from '@/components/shared/ProcessRail';
import styles from '@/components/shared/shared.module.css';
import type { GroupSection } from '@/lib/sanity/queries';

/**
 * Renders a `groupPage`'s sections — `/approach` (`N-04`) and `/about` (`N-07`), re-laid at
 * `GS-SHARED-001-B2` as editorial rows on the sheet (unnumbered since `GS-VIS-001-R3`: a
 * section's position on the page is not a service number). Server Component, zero client JS.
 *
 * ## `layout` is a closed list, and this switch is why
 *
 * `N-03` closed `groupSection.layout` to five values and `check:schemas` proves the rule runs on
 * write. Every layout an editor can choose is a case below, so a saved section always renders:
 *
 * | layout | renders as |
 * |---|---|
 * | `prose`, `two-column` | a row: heading left, body right |
 * | `process` | a Master-frame band carrying the canonical six-stage rail |
 * | `continuity` | a row with the section's own honest copy and **no** empty-state card — B2 removed the visible "No verified continuity example yet" block; `ContinuityExample` still exists for the day `Q-M6` supplies a real one |
 * | `sunken-plain` | a plain row on the sunken surface. Deliberately undesigned (`master/SCHEMA.md` §2): polishing the limits would sell them |
 *
 * `insert` places a page-owned band after a section; `pair` sets two consecutive sections side by
 * side, which is the variation that keeps a page from being a stack of identical rows. Keys that
 * are absent simply do nothing, so a content edit cannot break either.
 */
export function GroupSections({
  sections,
  insert = {},
  pair,
}: {
  sections: GroupSection[] | null;
  insert?: Record<string, () => ReactNode>;
  pair?: [string, string];
}) {
  if (!sections || sections.length === 0) return null;

  const out: ReactNode[] = [];

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    const next = sections[i + 1];

    if (pair && section.key === pair[0] && next?.key === pair[1]) {
      out.push(
        <div key={`pair-${section.key}`} className={`${styles.pair} ${styles.wrap}`}>
          <PairItem section={section} />
          <PairItem section={next} />
        </div>,
      );
      i += 1;
      if (insert[next.key]) out.push(<Fragment key={`insert-${next.key}`}>{insert[next.key]()}</Fragment>);
      continue;
    }

    const headingId = `section-${section.key}`;

    if (section.layout === 'process') {
      out.push(
        <section key={section.key} className={`${styles.frame} ${styles.band}`} aria-labelledby={headingId}>
          <div className={styles.wrap}>
            <div className={styles.bandHead}>
              <div>
                <h2 id={headingId} className={styles.rowTitle}>{section.heading}</h2>
              </div>
              <div className={styles.rowBody}>
                <Prose>
                  <Blocks value={section.body} />
                </Prose>
              </div>
            </div>
            <ProcessRail />
          </div>
        </section>,
      );
    } else {
      const row = (
        <section
          key={section.key}
          className={`${styles.row} ${styles.wrap} ${section.layout === 'sunken-plain' ? styles.plain : ''}`}
          aria-labelledby={headingId}
        >
          <div>
            <h2 id={headingId} className={styles.rowTitle}>{section.heading}</h2>
          </div>
          <div className={styles.rowBody}>
            <Prose>
              <Blocks value={section.body} />
            </Prose>
          </div>
        </section>
      );
      out.push(
        section.layout === 'sunken-plain' ? (
          <div key={section.key} className={styles.sunken}>{row}</div>
        ) : (
          row
        ),
      );
    }

    if (insert[section.key]) out.push(<Fragment key={`insert-${section.key}`}>{insert[section.key]()}</Fragment>);
  }

  return <>{out}</>;
}

function PairItem({ section }: { section: GroupSection }) {
  const headingId = `section-${section.key}`;
  return (
    <section aria-labelledby={headingId}>
      <h2 id={headingId} className={styles.rowTitle}>{section.heading}</h2>
      <div className={styles.rowBody}>
        <Prose>
          <Blocks value={section.body} />
        </Prose>
      </div>
    </section>
  );
}
