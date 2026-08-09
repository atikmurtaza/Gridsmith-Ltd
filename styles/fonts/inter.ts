import { Inter } from 'next/font/google';

/**
 * Body face for Master, Design and Digital; display face for Master and Design.
 * Not loaded on Press, which is serif throughout.
 *
 * One typeface per module deliberately. A single fonts.ts calling all three would make
 * every route group's layout pull all three @font-face sets, which is exactly the
 * per-route-group scoping this is meant to provide.
 */
export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});
