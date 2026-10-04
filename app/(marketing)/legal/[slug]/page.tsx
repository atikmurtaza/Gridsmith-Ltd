import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/primitives/Breadcrumb';
import { Numeric } from '@/components/primitives/Numeric';
import { Prose } from '@/components/primitives/Prose';
import { Blocks } from '@/components/content/Blocks';
import { Opening } from '@/components/shared/Opening';
import { getLegalDocument, listLegalDocuments } from '@/lib/sanity/queries';
import { STATIC_BUILD } from '@/lib/build/target';
import { staticParams } from '@/lib/build/static-routes';
import {
  CLIENT_TERMS_COUNTERPART,
  LEGAL_DOCUMENT_SLUGS,
  type LegalSlug,
} from '@/lib/legal/slugs';
import styles from '@/components/shared/shared.module.css';
import opening from '@/components/shared/opening.module.css';

/**
 * `/legal/[slug]` — the legal document template (`L-02`).
 *
 * Server Component, zero client JS, statically generated.
 *
 * ## Stable anchors, because contracts cite them
 *
 * Each clause renders with `id={clause.anchorId}` and a link to itself. `master/SCHEMA.md`:
 * *"Contracts and the site both cite `anchorId`, so clause numbering must not drift —
 * renumbering requires a version bump and a redirect for the old anchor."* The anchor comes
 * from the CMS field rather than being derived from the clause number here, so renumbering a
 * clause does not silently move its anchor: the two are separate fields and moving one is a
 * visible edit.
 *
 * `scroll-margin-block-start` on the clause is what stops a followed anchor landing under the
 * sticky header — a fragment that scrolls the target out of view is a WCAG 2.4.7-adjacent
 * failure that no automated check catches, because the element is technically focused.
 *
 * ## An unapproved document is announced, never hidden
 *
 * `solicitorApproved` defaults false. The query does **not** filter on it —
 * `lib/sanity/queries.ts` explains why in full. A missing privacy notice is a worse outcome
 * than a draft that says, in the first thing on the page, that it is a draft. What must not
 * happen is a draft presented as though it were reviewed, and that is prevented by rendering
 * the state rather than by hiding the document.
 *
 * **As of 2 September 2026 the flag gates nothing — it describes.** It filters no query,
 * blocks no route, fails no build, and no longer suppresses indexing. The owner's decision is
 * that external legal review is booked separately and the programme does not wait on it, so a
 * flag that withheld the published instruments until the review landed was withholding them
 * indefinitely. `check-legal-parity.mjs` branch D still requires the banner to render, which
 * is an assertion that the state is *shown* — the opposite of a gate.
 *
 * ## Print
 *
 * `shared.module.css` carries the print rules since `GS-SHARED-001-B2`: white paper, black text,
 * no navigation or contents, clauses kept whole where they fit. A legal page is a document
 * someone keeps, which is the whole difference between it and every other page on this site.
 *
 * ## `GS-SHARED-001-B2` — presentation only; the wording is frozen
 *
 * Compact Master-frame opening (breadcrumb, title, the draft notice, metadata, summary), then the
 * document on the light sheet at ~68ch, 17px, 1.7 leading, with sticky contents at 1024px+ and a
 * native `<details>` below it — no script, no scroll spy. **Nothing the CMS serves is altered.**
 * The markup `check:legal:parity` reads is deliberately unchanged in shape: each clause is a
 * `<section>` whose FIRST attribute is its `id`, with no nested `<section>`; its `<h2>`'s first
 * `<span>` is the clause number; clause prose is `<p>`; the banner still contains the exact
 * string the gate looks for. Some list-like clause content is stored as separate paragraphs —
 * a known data defect, recorded for a controlled later fix and not touched here.
 */
export function generateStaticParams() {
  if (STATIC_BUILD) return staticParams('legalDocument');
  return LEGAL_DOCUMENT_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doc = await getLegalDocument(slug);
  if (!doc) return { title: 'Not found — Gridsmith Ltd' };
  return {
    title: `${doc.title} — Gridsmith Ltd`,
    description: doc.summary ?? undefined,
    // **No `robots` gate on `solicitorApproved`, as of 2 September 2026.** It used to `noindex`
    // every legal page until the flag flipped, which made the flag a publication gate: the
    // instruments were served but withheld from search, so the company's published legal
    // position was unfindable pending a review that had not been booked. The owner's decision
    // is that the review does not gate the programme. The draft state is *described* — the
    // banner below, `reviewedBy`, and the version — and describing a state is not the same as
    // suppressing the document. A visitor who searches for Gridsmith's privacy notice should
    // find the notice Gridsmith actually publishes.
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = await getLegalDocument(slug);
  if (!doc) notFound();

  // The counterpart client-terms instrument is excluded, not merely ordered last. Listing the
  // business MSA at the foot of the consumer terms is the s. 57 defect the split removed,
  // rebuilt as a hyperlink — see `CLIENT_TERMS_COUNTERPART`. `/legal/client-terms` stays in
  // the list, and it is the page that explains which of the two a reader wants.
  const counterpart = CLIENT_TERMS_COUNTERPART[slug as LegalSlug];
  const others = (await listLegalDocuments()).filter(
    (d) => d.slug !== slug && d.slug !== counterpart,
  );

  const clauses = doc.clauses ?? [];
  const contents = (
    <ol className={styles.contentsList}>
      {clauses.map((clause) => (
        <li key={clause.anchorId}>
          <a href={`#${clause.anchorId}`}>
            <span className={styles.contentsNo}>{clause.number}</span>
            <span>{clause.heading}</span>
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <main id="main" tabIndex={-1}>
      <Opening
        place="Legal"
        title={doc.title}
        lead={doc.summary ?? undefined}
        before={
          <Breadcrumb
            items={[
              { href: '/', label: 'Home' },
              { href: `/legal/${slug}`, label: doc.title },
            ]}
          />
        }
      >
        {!doc.solicitorApproved ? (
          <p className={opening.status}>
            <span className={opening.statusLabel}>DRAFT — NOT YET REVIEWED BY A SOLICITOR.</span>{' '}
            This is the document Gridsmith Ltd currently publishes and works to. It has been through
            internal revision but not external legal review, and it will be updated when that
            review happens.
          </p>
        ) : null}
        <p className={opening.meta}>
          <Numeric>
            {[
              doc.version ? `Version ${doc.version}` : null,
              doc.effectiveFrom ? `Effective ${doc.effectiveFrom}` : null,
              doc.lastReviewed ? `Reviewed ${doc.lastReviewed}` : null,
              doc.reviewedBy,
            ]
              .filter(Boolean)
              .join('  |  ')}
          </Numeric>
        </p>
      </Opening>

      <div className={styles.sheet}>
        <div className={`${styles.wrap} ${styles.legalGrid}`}>
          {clauses.length > 0 ? (
            <nav aria-labelledby="contents" className={styles.contents}>
              <p id="contents" className={styles.connectHeading}>Contents</p>
              {contents}
            </nav>
          ) : <div />}

          <div className={styles.document}>
            {clauses.length > 0 ? (
              <details className={styles.contentsDetails}>
                <summary>Contents</summary>
                <nav aria-label="Contents">{contents}</nav>
              </details>
            ) : null}
            {clauses.map((clause) => (
              <section key={clause.anchorId} id={clause.anchorId} className={styles.clause}>
                <h2 className={styles.clauseTitle}>
                  <span className={styles.clauseNo}>{clause.number}</span> {clause.heading}
                </h2>
                <Prose>
                  <Blocks value={clause.body} />
                </Prose>
                {clause.basis ? <p className={styles.basis}>Basis: {clause.basis}</p> : null}
              </section>
            ))}
          </div>
        </div>
      </div>

      {others.length > 0 ? (
        <section className={`${styles.sunken} ${styles.otherDocs}`} aria-labelledby="other-documents">
          <div className={styles.wrap}>
            <h2 id="other-documents" className={styles.connectHeading}>The other documents</h2>
            <ul className={styles.others}>
              {others.map((other) => (
                <li key={other.slug}>
                  <a href={`/legal/${other.slug}`}>{other.title}</a>
                  {!other.solicitorApproved ? <span className={styles.othersNote}> — draft</span> : null}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </main>
  );
}
