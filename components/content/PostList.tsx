import { Numeric } from '@/components/primitives/Numeric';
import type { PostCard } from '@/lib/sanity/queries';
import styles from '@/components/shared/shared.module.css';

/**
 * Insights — homepage block 8 and the `/insights` hub (`N-13`).
 *
 * Server Component, zero client JS.
 *
 * **Dates and reading times are monospace** — the convention across all four themes is that
 * monospace marks anything verifiable, and a publication date is exactly that.
 *
 * `readingTime` is stored rather than computed, which is a recorded spec gap (`M-P2-10`) and not
 * a decision made here. It renders only when present: a missing value omits the line rather than
 * showing a zero, because a zero would be a claim.
 *
 * ## `GS-SHARED-001-B2` — a typographic index, not a card grid
 *
 * Date and studio, then title and excerpt, on hairline rows. It is the same component with zero,
 * one or many posts: the empty state is an index row that says so, not a grey placeholder card,
 * and there are no thumbnails because there is nothing real to show in one.
 */
const formatDate = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : null;

const STUDIO: Record<string, string> = { design: 'Design', digital: 'Digital', press: 'Press' };

export function PostList({
  posts,
  headingLevel = 3,
}: {
  posts: PostCard[];
  headingLevel?: 2 | 3 | 4;
}) {
  const H = `h${headingLevel}` as 'h2' | 'h3' | 'h4';

  if (posts.length === 0) {
    return (
      <ol className={styles.entries}>
        <li className={`${styles.entry} ${styles.entryEmpty}`}>
          <p className={styles.entryMeta} aria-hidden="true">—</p>
          <div>
            <H className={styles.entryTitle}>Nothing published yet</H>
            <p className={styles.entryExcerpt}>Articles appear here as they are written.</p>
          </div>
        </li>
      </ol>
    );
  }

  return (
    <ol className={styles.entries}>
      {posts.map((post) => (
        <li key={post.slug} className={styles.entry}>
          <p className={styles.entryMeta}>
            <Numeric>{formatDate(post.publishedAt)}</Numeric>
            {post.division && STUDIO[post.division] ? <><br />{STUDIO[post.division]}</> : null}
            {post.readingTime ? <><br /><Numeric>{`${post.readingTime} min read`}</Numeric></> : null}
          </p>
          <div>
            <H className={styles.entryTitle}>
              <a href={`/insights/${post.slug}`}>{post.title}</a>
            </H>
            {post.excerpt ? <p className={styles.entryExcerpt}>{post.excerpt}</p> : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
