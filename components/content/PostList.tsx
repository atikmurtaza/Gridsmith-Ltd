import { Card } from '@/components/primitives/Card';
import { EmptyState } from '@/components/primitives/EmptyState';
import { Heading } from '@/components/primitives/Heading';
import { Numeric } from '@/components/primitives/Numeric';
import type { PostCard } from '@/lib/sanity/queries';
import styles from './content.module.css';

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
 */
const formatDate = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : null;

export function PostList({
  posts,
  headingLevel = 3,
}: {
  posts: PostCard[];
  headingLevel?: 2 | 3 | 4;
}) {
  if (posts.length === 0) {
    return (
      <EmptyState title="Nothing published yet" headingLevel={headingLevel}>
        <p>Articles appear here as they are written.</p>
      </EmptyState>
    );
  }

  return (
    <ul className={styles.postList}>
      {posts.map((post) => (
        <Card as="li" key={post.slug} linked className={styles.postCard}>
          <Heading level={headingLevel} size="d4">
            <a href={`/insights/${post.slug}`} className={styles.cardLink}>
              {post.title}
            </a>
          </Heading>
          {post.excerpt ? <p className={styles.postExcerpt}>{post.excerpt}</p> : null}
          <p className={styles.postMeta}>
            <Numeric>
              {[formatDate(post.publishedAt), post.division, post.readingTime ? `${post.readingTime} min read` : null]
                .filter(Boolean)
                .join(' · ')}
            </Numeric>
          </p>
        </Card>
      ))}
    </ul>
  );
}
