import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { RootShell } from '@/components/chrome/RootShell';
import { inter } from '@/styles/fonts/inter';
import { jetbrainsMono } from '@/styles/fonts/jetbrains-mono';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Gridsmith Ltd',
};

/**
 * Root layout for the master route group. Inter for display and body, JetBrains Mono for facts.
 */
export default function MasterLayout({ children }: { children: ReactNode }) {
  return (
    <RootShell division="master" fontVariables={`${inter.variable} ${jetbrainsMono.variable}`}>
      {children}
    </RootShell>
  );
}
