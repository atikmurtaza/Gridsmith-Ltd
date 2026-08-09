import type { ReactNode } from 'react';

export type Division = 'master' | 'design' | 'digital' | 'press';

/**
 * The document shell, shared by all four root layouts.
 *
 * `data-division` is rendered here, server-side, into the static HTML. It is never set,
 * changed or read by client JavaScript — that is what makes the theme correct in the
 * first paint rather than after hydration (master/PROJECT-RULES.md §3).
 *
 * Four near-identical root layouts would drift the moment Epic M adds the skip link,
 * header, footer and consent banner to all of them. They compose here instead.
 */
export function RootShell({
  division,
  fontVariables,
  children,
}: {
  division: Division;
  fontVariables: string;
  children: ReactNode;
}) {
  return (
    <html lang="en-GB" className={fontVariables}>
      <body data-division={division}>{children}</body>
    </html>
  );
}
