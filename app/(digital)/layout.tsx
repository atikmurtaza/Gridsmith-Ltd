import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { RootShell } from '@/components/chrome/RootShell';
import { inter } from '@/styles/fonts/inter';
import { jetbrainsMono } from '@/styles/fonts/jetbrains-mono';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Gridsmith Digital',
};

/**
 * Root layout for the digital route group. JetBrains Mono is the display face here; Inter carries body copy.
 */
export default function DigitalLayout({ children }: { children: ReactNode }) {
  return (
    <RootShell division="digital" fontVariables={`${jetbrainsMono.variable} ${inter.variable}`}>
      {children}
    </RootShell>
  );
}
