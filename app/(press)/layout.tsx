import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { RootShell } from '@/components/chrome/RootShell';
import { jetbrainsMono } from '@/styles/fonts/jetbrains-mono';
import { sourceSerif } from '@/styles/fonts/source-serif';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Gridsmith Press',
};

/**
 * Root layout for the press route group. Source Serif 4 for display and body. Inter is deliberately not imported — it would
 * otherwise ship on every Press page for nothing.
 */
export default function PressLayout({ children }: { children: ReactNode }) {
  return (
    <RootShell division="press" fontVariables={`${sourceSerif.variable} ${jetbrainsMono.variable}`}>
      {children}
    </RootShell>
  );
}
