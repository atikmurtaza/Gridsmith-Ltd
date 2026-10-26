import type { ReactNode } from 'react';

/**
 * The illustrative publishing project (GS-PRESS-001-R1) and the one working passage from it.
 * Original site copy: no client, no actual workshop, no author, no result. Every visual on the
 * page is a state of this same project.
 *
 * Edit marks are real elements with visually hidden words, so a change is never conveyed by
 * strike-through, colour or position alone.
 */
export const PROJECT_TITLE = 'The Repair Table';
export const PROJECT_LABEL = 'Illustrative publishing project — created for this site. It is not client work.';
export const EXAMPLE_LABEL = 'Illustrative editorial example — written for this site. It is not client work.';

export const CHAPTERS = [
  'Why things stop working',
  'Bring it in',
  'Looking together',
  'What to check next',
  'Keeping it going',
] as const;

export const S1_TAIL = ' to the workshop and tell us what happened when it stopped working.';
export const S2 = 'A short description helps us prepare, even if you do not know what caused the fault.';
export const S2_LINE = 'Even a short description helps us prepare. You do not need to know what caused the fault.';
export const S3 = 'We will look at it with you and explain what we can check next.';
export const FINAL_TEXT = `Bring your item${S1_TAIL} ${S2_LINE} ${S3}`;

export function Del({ children, label = 'deleted' }: { children: ReactNode; label?: string }) {
  return (
    <del>
      <span className="sr-only">{label}: </span>
      {children}
    </del>
  );
}

export function Ins({ children, label = 'inserted' }: { children: ReactNode; label?: string }) {
  return (
    <ins>
      <span className="sr-only">, {label}: </span>
      {children}
    </ins>
  );
}

/** A word replaced above the line — takes no layout width. */
export function Interlinear({ from, to }: { from: string; to: string }) {
  return (
    <span className="pr-edit">
      <Del>{from}</Del>
      <Ins label="replaced with">{to}</Ins>
    </span>
  );
}

export function Accepted({ children }: { children: ReactNode }) {
  return (
    <span className="pr-accepted">
      {children}
      <span className="sr-only"> (recorded choice)</span>
    </span>
  );
}

export function Query({ n }: { n: number }) {
  return (
    <sup className="pr-query">
      <span className="sr-only">query </span>
      {n}
    </sup>
  );
}
