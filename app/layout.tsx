import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Gridsmith Ltd',
};

// `data-division` is set here by A-04, server-side, so the theme is correct in the
// first paint. Deliberately absent until then rather than stubbed.
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-GB">
      <body>{children}</body>
    </html>
  );
}
