import { Source_Serif_4 } from 'next/font/google';

/**
 * Press only — display and body. Never loaded by the other three route groups.
 */
export const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-source-serif',
});
