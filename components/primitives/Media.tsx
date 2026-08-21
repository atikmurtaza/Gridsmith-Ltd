import Image from 'next/image';
import styles from './content.module.css';

/**
 * `alt` is required with no default. An optional alt prop becomes an empty alt within a
 * week, and portfolio imagery is the site's primary evidence.
 *
 * Deterrence is CSS and HTML only — `user-select: none` and `draggable={false}`. The
 * watermark is baked into the asset at CMS ingest (Design D-03), not overlaid here where
 * it could be removed with devtools. Context-menu suppression needs a client listener
 * and is Design D-04; it is deliberately not in this primitive, which stays a Server
 * Component.
 */
export function Media({
  src,
  alt,
  width,
  height,
  caption,
  priority = false,
  sizes,
  className,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
}) {
  return (
    <figure className={[styles.media, className].filter(Boolean).join(' ')}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        sizes={sizes}
        draggable={false}
      />
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
