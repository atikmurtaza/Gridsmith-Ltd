import type { CSSProperties } from 'react';
import { DeskLoop } from './DeskLoop';
import { CHAPTERS, FINAL_TEXT, PROJECT_TITLE, S1_TAIL } from './passage';

/**
 * GS-PRESS-001-R1 — "The Publishing Desk". One illustrative project, one visual mechanism per
 * service territory. Server-rendered DOM and CSS only: stage switches are native radios read by
 * `:has()`, entrances are marked by `PressMotion`, and every visual's settled state is the
 * server HTML. Illustrative imagery is `aria-hidden`; each carries a visible text caption.
 */
const v = (vars: Record<string, string | number>) => vars as CSSProperties;

/* ── Hero: the desk ─────────────────────────────────────────────────────── */
const DESK_STAGES = [
  { id: 'write', label: 'Write', caption: 'Source notes become a first manuscript.' },
  { id: 'edit', label: 'Edit', caption: 'Editorial marks record what changes, and why.' },
  { id: 'produce', label: 'Produce', caption: 'The approved text is composed into pages.' },
  { id: 'publish', label: 'Publish', caption: 'One project, prepared for print, ebook and audio.' },
] as const;

export function PublishingDesk() {
  return (
    <div className="pr-desk">
      <fieldset className="pr-desk-stages">
        <legend className="sr-only">Show the project at a stage</legend>
        {DESK_STAGES.map((stage) => (
          <span className={`pr-desk-stage pr-desk-stage-${stage.id}`} key={stage.id}>
            <input type="radio" name="pr-desk" id={`pr-desk-${stage.id}`} value={stage.id} defaultChecked={stage.id === 'publish'} />
            <label htmlFor={`pr-desk-${stage.id}`}>{stage.label}</label>
          </span>
        ))}
      </fieldset>

      <div className="pr-desk-visual" aria-hidden="true">
        <div className="pr-d-note pr-d-note-1"><b>Interview notes</b><i>Visitors rarely know what broke.</i><i className="pr-d-bar" /></div>
        <div className="pr-d-note pr-d-note-2"><b>Voice</b><i>Plain, practical, warm.</i></div>
        <div className="pr-d-note pr-d-note-3"><b>Working title</b><i className="pr-d-serif">{PROJECT_TITLE}</i></div>

        <div className="pr-d-ms">
          <span className="pr-d-ms-tag">Edited manuscript</span>
          <p className="pr-d-ms-head">Chapter 2 — Bring it in</p>
          <p className="pr-d-ms-text">
            Bring <span className="pr-d-strike">the<span className="pr-d-ins">your</span></span> item{S1_TAIL} A short description helps us
            prepare, even if you do not know what caused the fault.
          </p>
          <i className="pr-d-bar" /><i className="pr-d-bar" /><i className="pr-d-bar pr-d-bar-short" />
          <span className="pr-d-flag pr-d-flag-1">Reason first?</span>
          <span className="pr-d-flag pr-d-flag-2">Split this sentence</span>
        </div>

        <div className="pr-d-page">
          <span className="pr-d-guides" />
          <p className="pr-d-rh">{PROJECT_TITLE}</p>
          <p className="pr-d-cn">2</p>
          <p className="pr-d-ct">Bring it in</p>
          <p className="pr-d-body">{FINAL_TEXT} Most visits begin with a question rather than a diagnosis.</p>
          <p className="pr-d-folio">18</p>
        </div>

        <div className="pr-d-format pr-d-print"><span className="pr-d-icon pr-d-icon-print"><i /><i /></span>Print</div>
        <div className="pr-d-format pr-d-ebook"><span className="pr-d-icon pr-d-icon-ebook"><i /><i /><i /></span>Ebook</div>
        <div className="pr-d-format pr-d-audio"><span className="pr-d-icon pr-d-icon-audio">{[5, 9, 6, 11, 7, 4, 8].map((h, i) => <i key={i} style={v({ '--h': h })} />)}</span>Audio</div>

        <div className="pr-d-record"><span>Metadata prepared</span><span>ISBN arrangement confirmed</span><span>Route selected</span></div>
      </div>

      <div className="pr-desk-captions">
        {DESK_STAGES.map((stage) => (
          <p className={`pr-desk-caption pr-desk-caption-${stage.id}`} key={stage.id}>{stage.caption}</p>
        ))}
        <DeskLoop />
      </div>
    </div>
  );
}

/* ── Writing: source material → manuscript structure ────────────────────── */
const SOURCES = [
  { kind: 'Interview notes', text: 'Visitors rarely know what broke, and apologise for it.' },
  { kind: 'Your chapter notes', text: 'Start with the first visit, not the history.' },
  { kind: 'Partial draft', text: 'Early pages on why repair matters to a street.' },
  { kind: 'Voice memo, transcribed', text: '“…look at it together, then decide what to check.”' },
  { kind: 'To verify', text: 'Details about local repair groups — confirm before use.' },
] as const;

const OUTLINE_SOURCES = [[3, 2], [1, 2], [4], [4], [5]] as const;

export function WritingVisual() {
  return (
    <div className="pr-wr">
      <div className="pr-wr-col">
        <p className="pr-kicker">Source material</p>
        <ul className="pr-wr-sources">
          {SOURCES.map((source, i) => (
            <li className={`pr-src pr-src-${i + 1}`} key={source.kind} style={v({ '--i': i })}>
              <span className="pr-src-n">{i + 1}</span>
              <span className="pr-src-kind">{source.kind}</span>
              <span className="pr-src-text">{source.text}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="pr-wr-flow" aria-hidden="true"><span /></div>
      <div className="pr-wr-col pr-wr-sheet pr-paper-obj">
        <p className="pr-kicker">Manuscript structure · <span className="pr-serif-inline">{PROJECT_TITLE}</span></p>
        <ol className="pr-wr-outline">
          {CHAPTERS.map((chapter, i) => (
            <li className={`pr-ch pr-ch-${i + 1}`} key={chapter} style={v({ '--i': i })}>
              <span className="pr-ch-n">{i + 1}</span>
              <span className="pr-ch-title">{chapter}</span>
              <span className="pr-ch-from">from notes {OUTLINE_SOURCES[i].join(', ')}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

/* ── Production: manuscript → print page → reflowable ebook ─────────────── */
const SECOND_PARAGRAPH =
  'Most visits begin with a question rather than a diagnosis. The people at the table are there to look with you, not to judge what went wrong.';

export function ProductionVisual() {
  return (
    <div className="pr-pro">
      <div className="pr-pro-main">
        <fieldset className="pr-switch pr-pro-modes">
          <legend className="pr-kicker">Show the same chapter as</legend>
          {[
            ['ms', 'Manuscript'],
            ['print', 'Print page'],
            ['ebook', 'Reflowable ebook'],
          ].map(([id, label]) => (
            <span key={id}>
              <input type="radio" name="pr-pro" id={`pr-pro-${id}`} defaultChecked={id === 'print'} />
              <label htmlFor={`pr-pro-${id}`}>{label}</label>
            </span>
          ))}
        </fieldset>
        <fieldset className="pr-switch pr-pro-size">
          <legend className="pr-kicker">Reader text size</legend>
          {[
            ['s', 'A−', 'Smaller text'],
            ['m', 'A', 'Default text'],
            ['l', 'A+', 'Larger text'],
          ].map(([id, label, name]) => (
            <span key={id}>
              <input type="radio" name="pr-size" id={`pr-size-${id}`} defaultChecked={id === 'm'} aria-label={name} />
              <label htmlFor={`pr-size-${id}`} aria-hidden="true">{label}</label>
            </span>
          ))}
        </fieldset>

        <div className="pr-pro-stage">
          <div className="pr-pro-doc">
            <span className="pr-pro-guides" aria-hidden="true" />
            <p className="pr-pro-rh" aria-hidden="true">{PROJECT_TITLE}</p>
            <p className="pr-pro-cn">Chapter 2</p>
            <p className="pr-pro-ct">Bring it in</p>
            <p className="pr-pro-p">{FINAL_TEXT}</p>
            <p className="pr-pro-p">{SECOND_PARAGRAPH}</p>
            <p className="pr-pro-folio" aria-hidden="true">18</p>
            <p className="pr-pro-loc" aria-hidden="true">Chapter 2 · lines reflow to your screen and settings</p>
          </div>
          <div className="pr-pro-explain">
            <p className="pr-pro-x pr-pro-x-ms"><b>Manuscript.</b> The approved text as written: double-spaced, unstyled, ready to compose.</p>
            <p className="pr-pro-x pr-pro-x-print"><b>Print page.</b> Trim, margins, running head, chapter hierarchy and page number are fixed for the agreed format. Line breaks are set once.</p>
            <p className="pr-pro-x pr-pro-x-ebook"><b>Reflowable ebook.</b> No fixed pages. Change the text size: the same structure reflows to the reader’s device and settings.</p>
          </div>
        </div>
      </div>

      <aside className="pr-cover" aria-labelledby="pr-cover-title">
        <p className="pr-kicker" id="pr-cover-title">Cover specification</p>
        <div className="pr-cover-flat" aria-hidden="true">
          <span className="pr-cover-back">Back<i /><i /><i /></span>
          <span className="pr-cover-spine"><span>{PROJECT_TITLE}</span></span>
          <span className="pr-cover-front"><b>{PROJECT_TITLE}</b><i>Visual design by Gridsmith Design</i></span>
        </div>
        <dl className="pr-spec">
          <div><dt>Bleed</dt><dd>Set by the printing supplier’s template</dd></div>
          <div><dt>Spine width</dt><dd>From the final page count and paper</dd></div>
          <div><dt>Trim, paper, binding</dt><dd>Agreed in the scope with the supplier</dd></div>
        </dl>
        <p className="pr-cover-note">Press coordinates the publishing brief and production requirements; Gridsmith Design creates the visual cover where design is included.</p>
      </aside>
    </div>
  );
}

/* ── Publishing: the publication record ──────────────────────────────────── */
const RECORD = [
  { label: 'Manuscript', state: 'Final text approved', side: 'l' },
  { label: 'Print file', state: 'Prepared and checked', side: 'l' },
  { label: 'Ebook file', state: 'Reflowable file prepared', side: 'l' },
  { label: 'Cover', state: 'Coordinated with Gridsmith Design', side: 'l' },
  { label: 'Metadata', state: 'Description, categories and keywords prepared', side: 'r' },
  { label: 'ISBN', state: 'Arrangement confirmed in the scope', side: 'r' },
  { label: 'Distribution route', state: 'Selected in the scope', side: 'r' },
  { label: 'Print-on-demand', state: 'Coordinated where scoped', side: 'r' },
] as const;

export function PublicationRecord() {
  const side = (s: 'l' | 'r') =>
    RECORD.map((entry, i) => ({ ...entry, i })).filter((entry) => entry.side === s).map((entry) => (
      <li className={`pr-rec pr-rec-${entry.side}`} key={entry.label} style={v({ '--i': entry.i })}>
        <span className="pr-rec-mark" aria-hidden="true" />
        <span className="pr-rec-label">{entry.label}</span>
        <span className="pr-rec-state">{entry.state}</span>
      </li>
    ));
  return (
    <div className="pr-record">
      <ul className="pr-record-side">{side('l')}</ul>
      <div className="pr-titlepage">
        <p className="pr-titlepage-kicker">Publication record</p>
        <p className="pr-titlepage-title">{PROJECT_TITLE}</p>
        <p className="pr-titlepage-sub">Working title</p>
        <p className="pr-titlepage-formats">Print · Ebook · Audio</p>
        <p className="pr-titlepage-note">Illustrative workflow states, not a client project.</p>
      </div>
      <ul className="pr-record-side">{side('r')}</ul>
    </div>
  );
}

/* ── Audio: text → voice ─────────────────────────────────────────────────── */
const AUDIO_LINE = `Bring your item${S1_TAIL} Even a short description helps us prepare.`;
const barHeight = (word: string) => 0.45 + (((word.length * 7 + word.charCodeAt(0)) % 10) / 10) * 0.55;
/** Deterministic bars drawn from the word's letters: a metaphor for speech, not a recording. */
const bars = (word: string) =>
  Array.from({ length: Math.max(3, Math.round(word.length * 1.6)) }, (_, k) =>
    (0.25 + ((word.charCodeAt(k % word.length) * (k + 3)) % 8) / 10).toFixed(2),
  );

export function AudioVisual() {
  return (
    <div className="pr-au">
      <fieldset className="pr-switch pr-au-modes">
        <legend className="pr-kicker">Show chapter 2 as</legend>
        <span><input type="radio" name="pr-au" id="pr-au-text" /><label htmlFor="pr-au-text">Text</label></span>
        <span><input type="radio" name="pr-au" id="pr-au-voice" defaultChecked /><label htmlFor="pr-au-voice">Voice</label></span>
      </fieldset>
      <div className="pr-au-stage">
        {CHAPTERS.slice(0, 3).map((chapter, i) => (
          <div className={`pr-au-row${i === 1 ? ' pr-au-row-main' : ''}`} key={chapter}>
            <p className="pr-au-marker">
              <span className="pr-au-marker-text">Chapter {i + 1}</span>
              <span className="pr-au-marker-voice" aria-hidden="true">Track {String(i + 1).padStart(2, '0')}</span>
            </p>
            <p className="pr-au-words">
              {(i === 1 ? AUDIO_LINE : chapter).split(' ').map((word, w) => (
                <span className="pr-w" key={w} style={v({ '--h': barHeight(word).toFixed(2), '--i': w })}>
                  <span className="pr-w-t">{word}</span>
                  <span className="pr-w-b" aria-hidden="true">
                    {bars(word).map((b, k) => <i key={k} style={v({ '--b': b })} />)}
                  </span>{' '}
                </span>
              ))}
            </p>
          </div>
        ))}
        <ul className="pr-au-notes" aria-label="Narration notes">
          <li><b>Pronunciation</b> “workshop” — one word</li>
          <li><b>Pause</b> after “stopped working.”</li>
          <li><b>Tone</b> unhurried and practical</li>
        </ul>
      </div>
      <p className="pr-au-caption">Illustrative waveform drawn from the words on the page — a visual metaphor, not recorded audio. Nothing plays, and no running time is implied.</p>
    </div>
  );
}

/* ── Marketing: one source, several reader-facing expressions ──────────── */
const MATERIALS = [
  { kind: 'Book description', text: 'A practical guide to bringing broken things to people who can help.' },
  { kind: 'Author profile', text: 'Written from your notes, in your voice, and approved by you.' },
  { kind: 'Launch email', text: 'Subject: The Repair Table is ready to read' },
  { kind: 'Social copy', text: 'Bring it in. Tell us what happened. That is where repair starts.' },
  { kind: 'Press note', text: 'For release: a guide to the first visit to a repair table.' },
  { kind: 'Search article', text: 'What to bring to a repair workshop, and what to say.' },
] as const;

export function ReleaseVisual() {
  return (
    <div className="pr-rel">
      <div className="pr-rel-source">
        <p className="pr-kicker">Source</p>
        <p className="pr-rel-title">{PROJECT_TITLE}</p>
        <p className="pr-rel-excerpt">“Even a short description helps us prepare.”</p>
        <p className="pr-rel-meta">Chapter 2 · the recorded version</p>
      </div>
      <ul className="pr-rel-items">
        {MATERIALS.map((m, i) => (
          <li className={`pr-rel-item pr-rel-item-${i + 1}`} key={m.kind} style={v({ '--i': i })}>
            <span className="pr-rel-kind">{m.kind}</span>
            <span className="pr-rel-text">{m.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
