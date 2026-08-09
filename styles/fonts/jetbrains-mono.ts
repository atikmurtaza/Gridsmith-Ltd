import { JetBrains_Mono } from 'next/font/google';

/**
 * Loaded by all four route groups — monospace marks anything verifiable (prices, dates,
 * standards, ISBNs, dimensions, revision numbers) across the whole site, and is Digital's
 * display face as well.
 */
export const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains',
});
