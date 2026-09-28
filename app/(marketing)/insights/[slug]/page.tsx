import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/primitives/Breadcrumb';
import { Numeric } from '@/components/primitives/Numeric';
import { Prose } from '@/components/primitives/Prose';
import { Blocks } from '@/components/content/Blocks';
import { Opening } from '@/components/shared/Opening';
import { getPost, listPostSlugs } from '@/lib/sanity/queries';
import styles from '@/components/shared/shared.module.css';
import opening from '@/components/shared/opening.module.css';

/**
 * `/insights/[slug]` — an article.
 *
 * Server Component, zero client JS, statically generated from `listPostSlugs`.
 *
 * `author` is a **string** rather than a reference to `teamMember`, and `readingTime` is
 * stored rather than computed. Both are recorded spec gaps (`M-P2-10`), not decisions taken
 * here — `SCHEMA-CORE.md` lists them as bare field names with no type. The conservative shape
 * is used until someone decides: a string cannot dangle, and a stored number cannot be wrong in
 * a way nobody sees.
 */
export async function generateStaticParams() {
  const slugs = await listPostSlugs();
  return slugs.filter(Boolean).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: 'Not found — Gridsmith Ltd' };
  return { title: `${post.title} — Gridsmith Ltd`, description: post.excerpt ?? undefined };
}

const formatDate = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : null;

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  // `GS-SHARED-001-B2`: dark opening, then the article on the light sheet at a ~68ch measure.
  // **`post.author` is not rendered** — a launch presentation decision, not a schema change; the
  // field and the query are untouched, and showing it again is one line here.
  return (
    <main id="main" tabIndex={-1}>
      <Opening
        place="Insights"
        title={post.title}
        before={
          <Breadcrumb
            items={[
              { href: '/', label: 'Home' },
              { href: '/insights', label: 'Insights' },
              { href: `/insights/${post.slug}`, label: post.title },
            ]}
          />
        }
      >
        <p className={opening.meta}>
          <Numeric>
            {[formatDate(post.publishedAt), post.readingTime ? `${post.readingTime} min read` : null]
              .filter(Boolean)
              .join(' · ')}
          </Numeric>
        </p>
      </Opening>
      <div className={styles.sheet}>
        <div className={`${styles.wrap} ${styles.indexSheet}`}>
          <div className={styles.document}>
            <Prose>
              <Blocks value={post.body} />
            </Prose>
          </div>
        </div>
      </div>
    </main>
  );
}
