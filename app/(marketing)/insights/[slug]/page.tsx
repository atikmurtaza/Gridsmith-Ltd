import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/primitives/Breadcrumb';
import { Container } from '@/components/primitives/Container';
import { Heading } from '@/components/primitives/Heading';
import { Numeric } from '@/components/primitives/Numeric';
import { Prose } from '@/components/primitives/Prose';
import { Section } from '@/components/primitives/Section';
import { Blocks } from '@/components/content/Blocks';
import { getPost, listPostSlugs } from '@/lib/sanity/queries';
import styles from '@/components/content/content.module.css';

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

  return (
    <main id="main" tabIndex={-1}>
      <Section rhythm="loose">
        <Container width="narrow">
          <Breadcrumb
            items={[
              { href: '/', label: 'Home' },
              { href: '/insights', label: 'Insights' },
              { href: `/insights/${post.slug}`, label: post.title },
            ]}
          />
          <Heading level={1}>
            {post.title}
          </Heading>
          <p className={styles.postMeta}>
            <Numeric>
              {[
                formatDate(post.publishedAt),
                post.author,
                post.readingTime ? `${post.readingTime} min read` : null,
              ]
                .filter(Boolean)
                .join(' · ')}
            </Numeric>
          </p>
        </Container>
      </Section>
      <Section>
        <Container width="narrow">
          <Prose>
            <Blocks value={post.body} />
          </Prose>
        </Container>
      </Section>
    </main>
  );
}
