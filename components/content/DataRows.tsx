import styles from './content.module.css';

/**
 * The label / value / rationale row — originally `U-03`, Digital's dominant content pattern,
 * promoted out of `components/divisions/digital/` at `GS-P04`.
 *
 * ## Why it moved
 *
 * Its own docstring set the condition: *"Promoting it later, if a second division genuinely
 * wants it, is a small refactor made at the point where sharing is a fact rather than a guess."*
 * `GS-P04` gave Design and Press per-service pages, so all three divisions now render the same
 * deliverables / exclusions / process structure. The alternative was a Design page importing
 * from `divisions/digital/`, which is worse than the move.
 *
 * It did **not** move into `components/primitives/`. Primitives are theme-agnostic building
 * blocks whose every change needs review because they reach all four route groups; this is a
 * composed content pattern, and `components/content/` is where the other composed ones live.
 *
 * ## Shared structure, not shared colour
 *
 * `CLAUDE.md`: four voices, one hand — *"identical grid, spacing scale, type scale, component
 * shapes and motion language, with each division supplying its own palette and display face."*
 * Nothing here names a colour or a typeface. `--font-mono`, `--line` and `--ink-muted` all
 * resolve through whichever theme the route group's root layout set on `<html data-division>`,
 * so the same markup reads as a spec sheet on Digital and as a drawing schedule on Design
 * without a single conditional.
 *
 * The mono label is not a Digital mannerism either: *"monospace marks anything verifiable"* is
 * the one convention `CLAUDE.md` applies across all four sections.
 *
 * ## It is a `<dl>`, not a table
 *
 * Label-to-value is a description list. A `<div>` grouping wrapper inside `<dl>` is valid HTML5
 * and is what lets one row own its cells for the grid. A `<table>` would assert a
 * two-dimensional relationship that does not exist — there is no column heading a value
 * belongs under.
 *
 * Server Component. No client JavaScript: Digital carries the tightest budget in the programme
 * and a static list has no reason to cost any.
 */
export type DataRowItem = {
  /** The mono label, left. Short — it is a name, not a sentence. */
  label: string;
  /** The mono value, middle. The verifiable thing. */
  value: string;
  /** Optional body prose, right. Why the value is what it is. */
  rationale?: string;
};

export function DataRows({ items, label }: { items: DataRowItem[]; label?: string }) {
  if (items.length === 0) return null;

  return (
    <dl className={styles.dataRows} aria-label={label}>
      {items.map((item) => (
        <div key={item.label} className={styles.dataRow}>
          <dt className={styles.dataLabel}>{item.label}</dt>
          <dd className={styles.dataValue}>{item.value}</dd>
          {item.rationale ? <dd className={styles.dataRationale}>{item.rationale}</dd> : null}
        </div>
      ))}
    </dl>
  );
}
