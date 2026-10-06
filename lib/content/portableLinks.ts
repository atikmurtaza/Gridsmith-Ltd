/**
 * Link annotations in Portable Text — `GS-SEO-001`, closing `GS-PROD-006-S4`'s link half.
 *
 * Pure and JSX-free so `scripts/check-portable-links.selftest.mjs` can assert the return values
 * directly. `components/content/Blocks.tsx` is the only renderer.
 *
 * **What becomes a link is decided here, and anything not recognised stays text.** A span keeps
 * its words whatever its marks say; only an annotation that is a `link` with an `href` this
 * function accepts gains an `<a>`. So an unknown annotation type, a missing `markDef`, or an
 * `href` with any other scheme (`javascript:`, `data:`, a protocol-relative `//host`) fails safe
 * by rendering the plain text, never by dropping it and never as raw HTML.
 */

export type PortableSpan = { _type: string; _key?: string; text?: string; marks?: string[] };
export type PortableMarkDef = { _type: string; _key: string; href?: unknown };

export type SafeLink = { href: string; external: boolean };

/**
 * A site path (`/approach`, `/design/services/x#y`) is internal and opens in place. `https:`,
 * `http:` and `mailto:` are accepted; the first two are external and open in a new tab, the
 * project's convention (`components/primitives/Link.tsx`). Everything else returns `null`.
 */
export function safeHref(href: unknown): SafeLink | null {
  if (typeof href !== 'string') return null;
  const value = href.trim();
  if (!value) return null;
  if (value.startsWith('/')) {
    // `//host` and `/\host` are protocol-relative in browsers — another origin, not a path.
    return value.startsWith('//') || value.startsWith('/\\') ? null : { href: value, external: false };
  }
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }
  if (url.protocol === 'https:' || url.protocol === 'http:') return { href: url.href, external: true };
  if (url.protocol === 'mailto:') return { href: value, external: false };
  return null;
}

/** The safe link a span carries, if any — the first of its marks that resolves to one. */
export function spanLink(span: PortableSpan, markDefs: PortableMarkDef[] | undefined): SafeLink | null {
  for (const mark of span.marks ?? []) {
    const def = markDefs?.find((d) => d._key === mark);
    if (def?._type !== 'link') continue;
    const link = safeHref(def.href);
    if (link) return link;
  }
  return null;
}
