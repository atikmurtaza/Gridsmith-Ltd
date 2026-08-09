import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { inter } from '@/styles/fonts/inter';
import { jetbrainsMono } from '@/styles/fonts/jetbrains-mono';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Gridsmith Ltd',
};

/**
 * Master loads Inter and JetBrains Mono only. Press's serif is never imported here —
 * each route group's layout imports its own faces, which is what keeps Source Serif off
 * Design and Digital pages.
 *
 * `data-division="master"` is set here provisionally so A-03's themes are verifiable.
 * A-04 replaces this with per-route-group layouts, each setting its own value
 * server-side; the attribute belongs on <body> per master/TECH-SPEC.md §3.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-GB" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body data-division="master">{children}</body>
    </html>
  );
}
