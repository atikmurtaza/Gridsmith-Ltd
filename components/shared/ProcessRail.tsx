import { STUDIOS } from '@/components/chrome/nav';
import { CANONICAL_PROCESS } from '@/lib/process/canonical';
import styles from './shared.module.css';

/** The stage whose work is done by the studio or studios the engagement needs. */
const BRANCH_STAGE = 4;

/**
 * Approach's principal visual — `GS-SHARED-001-B2`. Server Component, one semantic `<ol>`.
 *
 * Titles and descriptions are read from `CANONICAL_PROCESS` and never restated here
 * (`00-PROCESS.md`: fixed names, all divisions). A horizontal rail at 1024px+, a vertical
 * narrative below it — the same list, re-laid by CSS, so there is no second markup to drift.
 *
 * **Stage 04 branches into the studios, and the branch is conditional.** The lanes are dashed
 * and the caption says the work goes to the studio or studios it needs — one, two or all three.
 * Nothing here implies every engagement uses all three, and no example project is drawn to
 * demonstrate it. The optional sixth stage is marked in words as well as by its dashed node.
 */
export function ProcessRail({ headingLevel = 3 }: { headingLevel?: 3 | 4 }) {
  const H = `h${headingLevel}` as 'h3' | 'h4';
  return (
    <ol className={styles.rail}>
      {CANONICAL_PROCESS.map((stage) => (
        <li
          key={stage.number}
          className={styles.stage}
          data-branch={stage.number === BRANCH_STAGE ? '' : undefined}
          data-optional={stage.optional ? '' : undefined}
        >
          <span className={styles.stageNo} aria-hidden="true">
            {String(stage.number).padStart(2, '0')}
          </span>
          <H className={styles.stageTitle}>
            {stage.title}
            {stage.optional ? <span className={styles.stageQualifier}> (if applicable)</span> : null}
          </H>
          <p className={styles.stageText}>{stage.description}</p>
          {stage.number === BRANCH_STAGE ? (
            <div className={styles.branch}>
              <p className={styles.branchCaption}>By the studio or studios the work needs</p>
              <ul className={styles.lanes} aria-label="Studios that may carry out this stage">
                {STUDIOS.map((s) => (
                  <li key={s.href} className={styles.lane}>
                    {s.label}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
