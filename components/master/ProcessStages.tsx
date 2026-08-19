import { CANONICAL_PROCESS, validateStageDetail, type StageDetail } from '@/lib/process/canonical';
import { Numeric } from '@/components/primitives/Table';
import styles from './master.module.css';

/**
 * The canonical process (`N-06`, `DESIGN.md` §5 "Process stage").
 *
 * Server Component, zero client JS. An ordered list, because the stages are a sequence and a
 * screen reader user should be told there are six of them and which one this is — a stack of
 * divs says neither.
 *
 * **The stage names come from the constant, never from `detail`.** `_shared/00-PROCESS.md`
 * rule 1 fixes them; the strongest way to hold that is to give an editor no way to supply one.
 * `detail` carries only what rule 3 allows — `divisionDetail`, `duration`, `clientTime`.
 *
 * **Stage 6's "(if applicable)" is rendered from `optional`, not appended by the caller.** Rule
 * 2: presenting it as automatic would misrepresent the offer. Because it is a property of the
 * stage rather than a formatting choice, a division cannot drop it.
 *
 * **A non-canonical key is surfaced, not swallowed.** Content that saved and silently did not
 * render is the hardest kind of bug for an editor to report, so `validateStageDetail`'s
 * findings are rendered where the person who caused them will see them.
 */
export function ProcessStages({
  detail = {},
  headingLevel = 3,
}: {
  detail?: Record<string, StageDetail>;
  headingLevel?: 2 | 3 | 4;
}) {
  const Heading = `h${headingLevel}` as 'h2' | 'h3' | 'h4';
  const problems = validateStageDetail(detail);

  return (
    <div className={styles.process}>
      {problems.length > 0 ? (
        <p className={styles.processProblem} role="status">
          {problems.join(' ')}
        </p>
      ) : null}

      <ol className={styles.processList}>
        {CANONICAL_PROCESS.map((stage) => {
          const extra = detail[stage.title] ?? {};
          return (
            <li key={stage.number} className={styles.processStage}>
              {/* Mono, because a stage number is a verifiable fact — the one convention that
                  runs across all four themes. Padded to 01–06 per DESIGN.md §5. */}
              <Numeric>{String(stage.number).padStart(2, '0')}</Numeric>
              <div className={styles.processBody}>
                <Heading className={styles.processTitle}>
                  {stage.title}
                  {stage.optional ? <span className={styles.processQualifier}> (if applicable)</span> : null}
                </Heading>
                <p className={styles.processDescription}>{stage.description}</p>
                {extra.divisionDetail ? <p className={styles.processDetail}>{extra.divisionDetail}</p> : null}
                {extra.duration || extra.clientTime ? (
                  <p className={styles.processMeta}>
                    {extra.duration ? <>Typically <Numeric>{extra.duration}</Numeric></> : null}
                    {extra.duration && extra.clientTime ? ' · ' : null}
                    {extra.clientTime ? <>Your time: <Numeric>{extra.clientTime}</Numeric></> : null}
                  </p>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
