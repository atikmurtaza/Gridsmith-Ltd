/**
 * GS-PRESS-001-D: the approved six-territory presentation of the canonical Press services.
 * `slug` always names a record in `SERVICES.press` (scripts/service-content.mjs); the
 * service-content gate checks the relationship. A catalogue row is not automatically a page.
 */
export type CatalogueItem = {
  name: string;
  slug: string;
  kind: 'service' | 'capability' | 'coordinated' | 'conditional';
  note?: string;
};
export type Territory = {
  key: string;
  group: string;
  number: string;
  name: string;
  anchor: string;
  primary: CatalogueItem[];
  supporting: CatalogueItem[];
};

export const TERRITORIES: Territory[] = [
  {
    key: 'writing', group: 'writing', number: '01', name: 'Writing & Development', anchor: 'writing',
    primary: [
      { name: 'Ghostwriting', slug: 'ghostwriting', kind: 'service' },
      { name: 'Book Writing & Development', slug: 'book-writing-and-development', kind: 'service' },
      { name: 'Website & Campaign Copywriting', slug: 'website-and-business-copywriting', kind: 'service' },
      { name: 'Thought Leadership, Whitepapers & Reports', slug: 'thought-leadership-and-reports', kind: 'service' },
    ],
    supporting: [
      { name: 'Author & Manuscript Consultation', slug: 'book-writing-and-development', kind: 'capability' },
      { name: 'Manuscript Critique & Assessment', slug: 'manuscript-assessment', kind: 'capability', note: 'also under Editing' },
    ],
  },
  {
    key: 'editing', group: 'editorial', number: '02', name: 'Editing', anchor: 'editing',
    primary: [
      { name: 'Manuscript Critique', slug: 'manuscript-assessment', kind: 'service' },
      { name: 'Developmental & Structural Editing', slug: 'manuscript-development', kind: 'service' },
      { name: 'Line Editing', slug: 'copy-editing-and-proofreading', kind: 'capability' },
      { name: 'Copyediting & Proofreading', slug: 'copy-editing-and-proofreading', kind: 'service' },
    ],
    supporting: [
      { name: 'Mechanical Editing', slug: 'copy-editing-and-proofreading', kind: 'capability' },
      { name: 'Translation & Bilingual Proofreading', slug: 'copy-editing-and-proofreading', kind: 'conditional', note: 'subject to language, scope and qualified resource availability' },
    ],
  },
  {
    key: 'production', group: 'book-production', number: '03', name: 'Book Design & Production', anchor: 'production',
    primary: [
      { name: 'Interior Layout & Typesetting', slug: 'typesetting-and-formatting', kind: 'service' },
      { name: 'Print & eBook Formatting', slug: 'typesetting-and-formatting', kind: 'capability' },
      { name: 'Cover Design Coordination', slug: 'cover-design-coordination', kind: 'service' },
      { name: 'Print Production Coordination', slug: 'typesetting-and-formatting', kind: 'capability', note: 'with a supplier agreed in scope' },
    ],
    supporting: [
      { name: 'Reflowable eBook Preparation', slug: 'typesetting-and-formatting', kind: 'capability' },
      { name: 'Print-ready File Preparation', slug: 'typesetting-and-formatting', kind: 'capability' },
      { name: 'Print Specification Guidance', slug: 'typesetting-and-formatting', kind: 'capability' },
      { name: 'Illustration Coordination', slug: 'cover-design-coordination', kind: 'coordinated', note: 'visual artwork by Gridsmith Design where scoped' },
    ],
  },
  {
    key: 'publishing', group: 'publishing', number: '04', name: 'Publishing & Distribution', anchor: 'publishing',
    primary: [
      { name: 'Publishing Preparation & Distribution Setup', slug: 'publishing-preparation', kind: 'service' },
      { name: 'Metadata & ISBN Guidance', slug: 'publishing-preparation', kind: 'capability' },
      { name: 'Print-on-Demand Coordination', slug: 'publishing-preparation', kind: 'conditional', note: 'where scoped and supported by the chosen platform' },
      { name: 'Release Preparation', slug: 'publishing-preparation', kind: 'capability' },
    ],
    supporting: [
      { name: 'Category & Keyword Guidance', slug: 'publishing-preparation', kind: 'capability' },
      { name: 'Platform Readiness & Submission Support', slug: 'publishing-preparation', kind: 'conditional', note: 'where scoped' },
      { name: 'Publishing File Checks', slug: 'publishing-preparation', kind: 'capability' },
      { name: 'Account & Platform Coordination', slug: 'publishing-preparation', kind: 'conditional', note: 'arrangements agreed in writing' },
    ],
  },
  {
    key: 'audio', group: 'audiobook', number: '05', name: 'Audiobooks', anchor: 'audio',
    primary: [
      { name: 'Audiobook Production Support', slug: 'audiobook-production-support', kind: 'service' },
      { name: 'Narration & Voice Coordination', slug: 'audiobook-production-support', kind: 'conditional', note: 'subject to suitable resource availability' },
      { name: 'Script Preparation for Audio', slug: 'audiobook-production-support', kind: 'capability' },
    ],
    supporting: [
      { name: 'Chapter & Track Preparation', slug: 'audiobook-production-support', kind: 'capability' },
      { name: 'Audio Editing & Mastering Coordination', slug: 'audiobook-production-support', kind: 'conditional', note: 'where scoped' },
      { name: 'Platform-ready Audio Preparation', slug: 'audiobook-production-support', kind: 'conditional', note: 'destination-specific' },
      { name: 'Audio Distribution Guidance', slug: 'audiobook-production-support', kind: 'conditional', note: 'platform decisions remain third-party' },
    ],
  },
  {
    key: 'marketing', group: 'content-promotion', number: '06', name: 'Marketing & Content', anchor: 'marketing',
    primary: [
      { name: 'Book Marketing Support', slug: 'book-marketing-support', kind: 'service' },
      { name: 'Content Programmes', slug: 'content-programmes', kind: 'service' },
      { name: 'Content SEO', slug: 'content-seo', kind: 'service' },
      { name: 'Book Description & Launch Copy', slug: 'book-marketing-support', kind: 'capability' },
    ],
    supporting: [
      { name: 'Author Bio & Profile Copy', slug: 'book-marketing-support', kind: 'capability' },
      { name: 'Email & Announcement Copy', slug: 'book-marketing-support', kind: 'capability' },
      { name: 'Editorial Social Content', slug: 'book-marketing-support', kind: 'capability' },
      { name: 'Press & Media Material', slug: 'book-marketing-support', kind: 'conditional', note: 'written material where scoped; no placement promise' },
    ],
  },
];
