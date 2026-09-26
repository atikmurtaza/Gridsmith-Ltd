import type { ReactNode } from 'react';
import { Link } from '@/components/primitives/Link';
import { getCompanyDetails } from '@/lib/company/companyDetails';
import { CANONICAL_PROCESS } from '@/lib/process/canonical';
import { enquiryHref } from '@/lib/services/architecture';
import { TERRITORIES } from './catalogue';
import { EditorialDemo } from './EditorialDemo';
import { PROJECT_LABEL, PROJECT_TITLE } from './passage';
import { PressMotion } from './PressMotion';
import { AudioVisual, ProductionVisual, PublicationRecord, PublishingDesk, ReleaseVisual, WritingVisual } from './visuals';
import './press-home.css';

/**
 * `/press` — GS-PRESS-001-R1 local visual redirection: "The Publishing Desk".
 *
 * One illustrative project travels source → manuscript → edit → produce → publish → amplify.
 * Each service territory has its own composition and mechanism; "Decided in the Margin" is the
 * Editing chapter's signature interaction rather than the page's layout.
 *
 * Copy: B2-locked text where B2 covers it (H1, lede, Writing/Editing/Publishing/Content ledes,
 * enquiry, final CTA, private-work notice, rights wording, process lines). R3's
 * six-territory presentation is bound to the formalised service model through
 * `catalogue.ts`; the Path Finder remains withheld.
 */
const GENERAL_ENQUIRY = enquiryHref('press');
const SPECIALIST_ENQUIRY = '/press/contact';
const PRIVATE_WORK =
  'Writing and ghostwriting work is not always available to show publicly. The editorial example on this page was created for this site and is not client work. Where we have permission, we may discuss or show relevant past work privately.';

const PROCESS_NOTES: Record<number, { detail: string; input: string }> = {
  1: { detail: 'Discuss the work’s purpose, readers, current material and intended destination.', input: 'Tell us what exists, who it is for and what you are trying to make.' },
  2: { detail: 'Agree the editorial or publishing tasks, outputs, responsibilities, review points and quote in writing.', input: 'Review the proposed scope, supplied materials and choices still to make.' },
  3: { detail: 'Begin once the scope is confirmed and the agreed starting conditions are met.', input: 'Confirm the scope and provide the material and access it calls for.' },
  4: { detail: 'Carry out the agreed writing, editing and preparation, coordinating visual cover design where included.', input: 'Review drafts and decisions at the agreed points; give consolidated feedback.' },
  5: { detail: 'Provide the agreed final text or files and complete any scoped setup or handover steps.', input: 'Review the deliverables against the scope and identify required corrections.' },
  6: { detail: 'Agree further editions, revisions or ongoing editorial work only where needed.', input: 'Decide whether there is a separate continuing need.' },
};

const JOURNEY = [
  { id: 'writing', short: 'Write', state: 'Source material → manuscript' },
  { id: 'editing', short: 'Edit', state: 'Manuscript → edited manuscript' },
  { id: 'production', short: 'Produce', state: 'Edited manuscript → composed pages' },
  { id: 'publishing', short: 'Publish', state: 'Composed pages → publication-ready' },
  { id: 'audio', short: 'Audio', state: 'Publication → audiobook' },
  { id: 'marketing', short: 'Amplify', state: 'Publication → release material' },
] as const;

function ChapterHead({ n, label, headline, lede, aside }: { n: number; label: string; headline: string; lede: string; aside?: ReactNode }) {
  const step = JOURNEY[n - 1];
  return (
    <header className="pr-ch-head">
      <div className="pr-ch-copy">
        <p className="pr-slug">
          <span className="pr-slug-n">{String(n).padStart(2, '0')}</span> {label}
          <span className="pr-slug-state">{step.state}</span>
        </p>
        <h2 id={`${step.id}-title`} className="pr-h2">{headline}</h2>
        <p className="pr-lede" data-prose="">{lede}</p>
      </div>
      {aside ? <div className="pr-ch-aside">{aside}</div> : null}
    </header>
  );
}

export async function PressHome() {
  const company = await getCompanyDetails();

  return (
    <main id="main" tabIndex={-1} className="pr-home">
      <PressMotion />

      {/* ── Hero: the publishing desk ─────────────────────────────────────── */}
      <section className="pr-hero pr-deep" aria-labelledby="press-title">
        <div className="pr-wrap pr-hero-grid">
          <div className="pr-hero-copy">
            {/* PROTOTYPE: breadth line widened for the expanded offering (B2 had four areas). */}
            <p className="pr-breadth">Gridsmith Press · Writing, editing, production, publishing, audio and marketing</p>
            <h1 id="press-title" className="pr-h1">Clear writing is a series of decisions.</h1>
            <p className="pr-hero-lede">
              We write, edit and prepare work for its intended readers and destinations, from books and reports to websites and
              ongoing content. At each stage, we can explain what changed and why.
            </p>
            <div className="pr-hero-actions">
              <a className="pr-button" href={GENERAL_ENQUIRY}>Discuss your book or content <span aria-hidden="true">→</span></a>
              <a className="pr-quiet-link" href="#services">Explore the work <span aria-hidden="true">↓</span></a>
            </div>
          </div>
          <figure className="pr-hero-desk" aria-labelledby="pr-desk-label">
            <PublishingDesk />
            <figcaption id="pr-desk-label" className="pr-desk-label">{PROJECT_LABEL}</figcaption>
          </figure>
        </div>
      </section>

      <div className="pr-journey">
        <nav className="pr-bar" aria-label="The project, stage by stage">
          <ol className="pr-wrap">
            {JOURNEY.map((step, i) => (
              <li key={step.id}>
                <a href={`#${step.id}`} data-pr-step={step.id}>
                  <span className="pr-bar-n">{String(i + 1).padStart(2, '0')}</span> {step.short}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* ── 01 Writing & Development ─────────────────────────────────────── */}
        <section className="pr-chapter pr-writing" id="writing" aria-labelledby="writing-title" data-pr-motion="">
          <div className="pr-wrap">
            <ChapterHead
              n={1}
              label="Writing & Development"
              headline="Find the words the work needs."
              lede="A book, report, campaign or website needs a clear purpose before it needs polished sentences. We establish the audience, the material available and the voice the work should carry, then write within an agreed scope. Some projects begin with interviews and notes; others begin with a draft that needs developing. Writing can be the whole engagement."
              aside={
                <ul className="pr-starts">
                  <li><b>From your source material</b> Interviews, notes and recordings become a manuscript written within an agreed scope.</li>
                  <li><b>From an existing draft</b> We develop what is there and keep it in your voice.</li>
                  <li><b>From a finished manuscript</b> A written critique of its strengths, problems and possible next steps.</li>
                </ul>
              }
            />
            <WritingVisual />
            <p className="pr-caption">Every chapter traces to a source. Where the notes are silent, the draft is silent — and anything to verify is marked before it is used.</p>
          </div>
        </section>

        {/* ── 02 Editing — Decided in the Margin ───────────────────────────── */}
        <section className="pr-chapter pr-editing pr-dark" id="editing" aria-labelledby="editing-title">
          <div className="pr-wrap">
            <ChapterHead
              n={2}
              label="Editing"
              headline="See what the draft is doing."
              lede="Editorial work starts by identifying the decision in front of the writer. A manuscript may need an assessment, a change of structure, closer attention to wording, or a final proof. Those are different tasks, and the right one depends on the state and purpose of the work. We explain recommendations so you can review them in context."
            />
            <div className="pr-scale">
              <p className="pr-scale-ends" aria-hidden="true"><span>The whole book</span><span>The final character</span></p>
              <ol aria-label="Kinds of editing, from the whole book to the final character">
                {['Manuscript critique', 'Developmental', 'Structural', 'Line', 'Copyediting', 'Mechanical', 'Proofreading'].map((kind) => (
                  <li key={kind}>{kind}</li>
                ))}
              </ol>
              <p className="pr-scale-extra">Also: translation and bilingual proofreading, subject to language availability.</p>
            </div>
            <EditorialDemo />
          </div>
        </section>

        {/* ── 03 Book Design & Production ──────────────────────────────────── */}
        <section className="pr-chapter pr-production" id="production" aria-labelledby="production-title" data-pr-motion="">
          <div className="pr-wrap">
            {/* PROTOTYPE copy: no B2 chapter exists for production. */}
            <ChapterHead
              n={3}
              label="Book Design & Production"
              headline="Compose the book for its format."
              lede="An approved manuscript still has to become pages. We prepare interiors for print, reflowable ebooks and other agreed outputs, and coordinate the cover brief and print specification with Gridsmith Design and the printing supplier agreed in the scope."
            />
            <ProductionVisual />
          </div>
        </section>

        {/* ── 04 Publishing & Distribution ─────────────────────────────────── */}
        <section className="pr-chapter pr-publishing pr-green" id="publishing" aria-labelledby="publishing-title" data-pr-motion="">
          <div className="pr-wrap">
            <ChapterHead
              n={4}
              label="Publishing & Distribution"
              headline="Prepare the work for where it will go."
              lede="A finished text still needs decisions about format, files, metadata and the route to its readers. We help plan and prepare the publishing steps included in the written scope, coordinating visual cover work when required. Print and reflowable digital editions need different treatment; accounts, ISBN arrangements and handover are agreed before setup begins."
            />
            <PublicationRecord />
            <p className="pr-caption pr-caption-center">
              A platform decides whether to accept a submission or listing. Printing is carried out by a supplier agreed in the scope; we coordinate
              paperback and hardback specifications with them rather than printing in-house.
            </p>
          </div>
        </section>

        {/* ── 05 Audiobooks ────────────────────────────────────────────────── */}
        <section className="pr-chapter pr-audio pr-night" id="audio" aria-labelledby="audio-title" data-pr-motion="">
          <div className="pr-wrap">
            <ChapterHead
              n={5}
              label="Audiobooks"
              headline="Give the book a voice."
              lede="An audiobook starts from the text. We prepare the manuscript for narration, coordinate voice and recording, and organise chapters into tracks for the formats agreed in the scope. Editing, mastering and platform preparation are coordinated where they are included; platforms decide whether to accept a title."
            />
            <AudioVisual />
          </div>
        </section>

        {/* ── 06 Marketing & Content ───────────────────────────────────────── */}
        <section className="pr-chapter pr-marketing" id="marketing" aria-labelledby="marketing-title" data-pr-motion="">
          <div className="pr-wrap">
            <ChapterHead
              n={6}
              label="Marketing & Content"
              headline="Keep the editorial work useful."
              lede="Some work continues after one publication; other projects begin as an ongoing content need. We can plan and write a scoped sequence of pieces, improve content for readers arriving through search, or prepare words around a book’s release. The cadence and review points are agreed for the engagement, with visual, technical or campaign work coordinated where needed."
            />
            <ReleaseVisual />
            <p className="pr-caption pr-caption-center">
              Press writes the words. Gridsmith Design creates visual campaign assets, Gridsmith Digital builds landing pages, tracking and
              technical SEO, and campaign strategy across channels is coordinated by Gridsmith. No reach, sales or placement is promised.
            </p>
          </div>
        </section>
      </div>

      {/* ── Catalogue: the contents ─────────────────────────────────────────── */}
      <section className="pr-catalogue pr-green" id="services" aria-labelledby="services-title">
        <div className="pr-wrap">
          <div className="pr-cat-head">
            <p className="pr-slug"><span className="pr-slug-n">§</span> Contents</p>
            <h2 id="services-title" className="pr-h2">Explore the work.</h2>
            <p className="pr-lede" data-prose="">Six territories, from the first note to the release. Each entry leads to the service that covers it.</p>
          </div>
          <div className="pr-cat-sheet pr-paper-obj">
          <p className="pr-swipe" aria-hidden="true">Swipe for all six territories →</p>
          <ol className="pr-cat pr-rail">
            {TERRITORIES.map((territory) => (
              <li className="pr-cat-group" key={territory.key} id={`services-${territory.key}`}>
                <h3 className="pr-cat-name">
                  <span className="pr-cat-n" aria-hidden="true">{territory.number}</span>
                  <a href={`#${territory.anchor}`}>{territory.name}</a>
                </h3>
                <ul className="pr-cat-list">
                  {territory.primary.map((item) => (
                    <li key={item.name}>
                      <a href={`/press/services/${item.slug}`}>{item.name}</a>
                      {item.note ? <span className="pr-cat-note"> — {item.note}</span> : null}
                    </li>
                  ))}
                </ul>
                <details className="pr-cat-more">
                  <summary>Also in this territory <span className="pr-count">{territory.supporting.length}</span></summary>
                  <ul className="pr-cat-list pr-cat-list-sub">
                    {territory.supporting.map((item) => (
                      <li key={item.name}>
                        <a href={`/press/services/${item.slug}`}>{item.name}</a>
                        {item.note ? <span className="pr-cat-note"> — {item.note}</span> : null}
                      </li>
                    ))}
                  </ul>
                </details>
              </li>
            ))}
          </ol>
          </div>
          <p className="pr-private">{PRIVATE_WORK}</p>
        </div>
      </section>

      {/* ── Process: a compact progression ───────────────────────────────────── */}
      <section className="pr-process pr-dark" id="process" aria-labelledby="process-title">
        <div className="pr-wrap">
          <div className="pr-process-head">
            <p className="pr-slug"><span className="pr-slug-n">¶</span> Six stages</p>
            <h2 id="process-title" className="pr-h3">How an engagement runs</h2>
          </div>
          <p className="pr-swipe" aria-hidden="true">Swipe through the six stages →</p>
          <ol className="pr-stages pr-rail">
            {CANONICAL_PROCESS.map((stage) => (
              <li className="pr-stage" key={stage.number}>
                <span className="pr-stage-n" aria-hidden="true">{stage.number}</span>
                <h3 className="pr-stage-title">
                  <span className="sr-only">{stage.number} </span>
                  {stage.title}
                  {stage.optional ? ' (if applicable)' : ''}
                </h3>
                <p className="pr-stage-detail">{PROCESS_NOTES[stage.number]?.detail ?? stage.description}</p>
                <p className="pr-stage-input"><span className="pr-stage-kicker">Your part</span> {PROCESS_NOTES[stage.number]?.input ?? stage.clientInvolvement}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Arrangements: B2's qualified wording ─────────────────────────────── */}
      <section className="pr-arrangements pr-green" aria-labelledby="arrangements-title">
        <div className="pr-wrap">
          <h2 id="arrangements-title" className="pr-h3">Rights, ISBNs and accounts</h2>
          <div className="pr-arr-grid pr-rail">
            <p>
              Your existing manuscript, notes and source material remain yours. The written scope sets out the final work we will provide and any
              project-specific rights or licences. On full payment, rights Gridsmith owns in bespoke final work created for that scope transfer to
              you, subject to our pre-existing material, third-party licences and anything the scope expressly treats differently. For
              ghostwriting, we agree authorship and credit in writing before work begins. We do not take a royalty or sales-income interest merely
              for providing Press services.
            </p>
            <p>
              If your project needs an ISBN, we can advise on the options and help with the agreed steps to obtain one. We confirm who will hold
              the ISBN and be identified as publisher in the written scope before any registration or platform setup.
            </p>
            <p>
              Where publishing or distribution accounts are needed, the written scope sets out who opens and controls them, what access we need,
              which setup or uploads we handle, and what we hand over. Accounts should normally be in your name or under your control unless we
              agree otherwise in writing. A platform decides whether to accept a submission or listing.
            </p>
          </div>
          <p className="pr-arr-note">
            These summarise the draft client terms, which are awaiting solicitor review.{' '}
            <Link href="/legal/consumer-client-terms#clause-10-1">Read clause 10 of the Client Terms for Consumers</Link>.
          </p>
        </div>
      </section>

      {/* ── Close: the resolved project ──────────────────────────────────────── */}
      <section className="pr-close pr-deep" aria-labelledby="final-title" data-pr-motion="">
        <div className="pr-wrap pr-close-grid">
          <div className="pr-close-record" aria-hidden="true">
            <p className="pr-close-title">{PROJECT_TITLE}</p>
            <p className="pr-close-sub">Written · Edited · Composed · Prepared</p>
            <ul className="pr-close-formats">
              <li><span className="pr-close-tick" />Print</li>
              <li><span className="pr-close-tick" />Ebook</li>
              <li><span className="pr-close-tick" />Audio</li>
            </ul>
            <p className="pr-close-label">{PROJECT_LABEL}</p>
          </div>
          <div className="pr-close-copy">
            <h2 id="final-title" className="pr-h2">Tell us what you are working on.</h2>
            <p className="pr-lede" data-prose="">
              A draft, an idea for a book, or a continuing need for content can each start a useful conversation. Tell us what you have and what
              decision you are facing.
            </p>
            <div className="pr-routes">
              <div className="pr-route">
                <h3 className="pr-route-title">Discuss your writing or content</h3>
                <p>For writing, editing, publishing or ongoing content, including work that spans more than one area.</p>
                <a className="pr-button pr-button-light" href={GENERAL_ENQUIRY}>Discuss your book or content <span aria-hidden="true">→</span></a>
              </div>
              <div className="pr-route">
                <h3 className="pr-route-title">Tell us about the book</h3>
                <p>A guided enquiry for an author, manuscript, book project or ongoing content need, with questions that change by the selected route.</p>
                <a className="pr-button pr-button-ghost" href={SPECIALIST_ENQUIRY}>Tell us about the book <span aria-hidden="true">→</span></a>
              </div>
            </div>
            <p className="pr-commitment">{company.responseCommitment}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
