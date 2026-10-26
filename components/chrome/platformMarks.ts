/**
 * Platform marks for the footer social row — `GS-SHARED-001-B1-R2` (owner decision: each
 * platform's own full-colour mark; owner authorisation for the official downloads and terms).
 *
 * Every file is local (`public/brand/social/`), never hotlinked, and unaltered except where
 * noted: rasters are proportionally downscaled from the official master, SVGs are verbatim. The
 * box sizes (CSS px) are set per mark so eight different proportions read at one visual weight;
 * each keeps its own aspect ratio — nothing is stretched or cropped (YouTube's official PNG keeps
 * its built-in clear space, which is why its box is the largest).
 *
 * | Platform | Source | Status |
 * |---|---|---|
 * | Facebook | Meta Brand Resource Center, Facebook-Brand-Asset-Pack.zip, Facebook_Logo_Primary.png | official |
 * | Instagram | Meta Brand Resource Center, IG_brand_asset_pack_2023.zip, Instagram_Glyph_Gradient.png | official |
 * | LinkedIn | brand.linkedin.com, in-logo.zip, LI-In-Bug.png (blue) | official |
 * | X | about.x.com brand toolkit, x-logo.zip, logo.svg (white, for dark backgrounds) | official |
 * | YouTube | brand.youtube, youtube-icon.zip, yt_icon_red_digital.png | official |
 * | Reddit | Reddit Brand System (redditbrand.lingoapp.com, Logo), Reddit_Icon_FullColor.svg — Snoo in the OrangeRed bubble | official; XML prolog, generator comment and trailing whitespace removed (render-neutral) |
 * | Freelancer | simple-icons 16.33.0 path (CC0, recorded source freelancer.com), filled in Freelancer's established brand blue inside the SVG file | **provisional third-party sourced mark pending an official Freelancer brand asset — `GS-O022`** |
 * | TikTok | simple-icons 16.33.0 path, monochrome `currentColor` (unchanged from R1) | **retained in the owner-approved row; written permission pending — `GS-O021`, a final production-cutover gate.** TikTok's Brand and Use Guidelines require prior written permission for any use of its logo; its sole use here is the mark linking to Gridsmith's own account |
 */
export type PlatformMark =
  | { src: string; width: number; height: number }
  | { path: string; width: number; height: number };

export const PLATFORM_MARKS: Record<string, PlatformMark> = {
  Facebook: { src: '/brand/social/facebook.png', width: 26, height: 26 },
  Instagram: { src: '/brand/social/instagram.png', width: 26, height: 26 },
  LinkedIn: { src: '/brand/social/linkedin.png', width: 28, height: 24 },
  X: { src: '/brand/social/x.svg', width: 22, height: 22.5 },
  TikTok: {
    path: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z',
    width: 24,
    height: 24,
  },
  YouTube: { src: '/brand/social/youtube.png', width: 44, height: 37.7 },
  Reddit: { src: '/brand/social/reddit.svg', width: 28, height: 28 },
  Freelancer: { src: '/brand/social/freelancer.svg', width: 26, height: 26 },
};
