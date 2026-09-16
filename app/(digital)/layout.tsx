import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { RootShell } from '@/components/chrome/RootShell';
import { inter } from '@/styles/fonts/inter';
import { jetbrainsMono } from '@/styles/fonts/jetbrains-mono';
import { INDEXABLE, SITE_ORIGIN } from '@/lib/seo/site';
import '@/styles/globals.css';

/**
 * **Group-level metadata — `G-04`, `GS-R001` §17. Inherited by every route in this group.**
 *
 * Four root layouts and no `app/layout.tsx` means there is no single place to put this, so each
 * group carries its own copy of the same four decisions. That is the cost of the architecture
 * `CLAUDE.md` describes, not a duplication to factor out: the values differ per division, and a
 * shared helper returning them would be one more indirection over four literals.
 *
 * **No `title.template`.** Every page in this tree already writes its own full title ending in
 * the group name — `"About — Gridsmith Ltd"`, `"Tell us about the book — Gridsmith Press"` — so
 * a template would append the group name a second time to all of them. The title below is the
 * default for a route that declares none, which today is `/` in the master group.
 *
 * `metadataBase` — the origin every relative metadata URL resolves against. Without it Next
 * emits relative Open Graph URLs and warns on every build; `lib/seo/site.ts` explains why the
 * origin is read from the deployment rather than written down.
 *
 * `alternates.canonical: './'` — Next resolves this **per route**, against the current pathname,
 * so one line here gives every page in the group its own correct canonical. Writing
 * `alternates` into each page file would be the same result and twenty more places to forget.
 *
 * `robots` — belt to `app/robots.ts`'s braces. `robots.txt` tells a crawler not to fetch;
 * a `noindex` meta tag tells one that fetched anyway not to index. A staging candidate reached
 * through a link in an email is exactly the case the first of those does not cover.
 *
 * `openGraph` — no image is declared. `GS-O007` has not supplied approved brand assets, and an
 * invented one would be `CLAUDE.md` #2; a card with a title and a description is what this site
 * honestly has today. The type is `website` and the division is named as a trading division in
 * the description, because a link shared from `/press` must not read as a separate company.
 */
export const metadata: Metadata = {
  metadataBase: SITE_ORIGIN,
  title: 'Gridsmith Digital',
  description: 'Websites, software, apps, automation and intelligence. Gridsmith Digital is a trading division of Gridsmith Ltd.',
  alternates: { canonical: './' },
  robots: INDEXABLE ? { index: true, follow: true } : { index: false, follow: false },
  openGraph: {
    type: 'website',
    siteName: 'Gridsmith Digital',
    locale: 'en_GB',
    url: './',
    title: 'Gridsmith Digital',
    description: 'Websites, software, apps, automation and intelligence. Gridsmith Digital is a trading division of Gridsmith Ltd.',
  },
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
