import type { Metadata } from 'next';
import { Close, Context, Hero, Process, Reviews, Studios } from '@/components/master/Home';
import { FallbackMark } from '@/components/master/FallbackMark';
import { MasterScene } from '@/components/master/MasterScene';
import { masterOpenGraph } from '@/lib/seo/site';

const TITLE = 'Gridsmith Ltd — design, digital and publishing studios';
const DESCRIPTION =
  'One UK company, three specialist studios: brand, visual and technical design; websites and software; writing and publishing. Brief once; the context stays.';

/** `/`'s own title, description and share card (`GS-SEO-001`); other Master routes keep the group's. */
export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: masterOpenGraph(TITLE, DESCRIPTION),
};

/**
 * The homepage — `GS-R001-M`, the Master redesign after the owner rejected `GS-R001-R`'s at
 * `GS-O008`. `docs/_shared/GS-R001-M-MASTER-REDESIGN.md` is the record.
 *
 * `data-stage="master"` switches `/` — and only `/` — to the gold stage palette
 * (`styles/themes/master-stage.css`); the other Master routes keep `master.css`.
 *
 * The scene sits outside `<main>`: it is decorative and `aria-hidden`, and a decorative layer
 * inside the main landmark is content a screen reader has to walk past.
 *
 * `id="main"` is the skip link's target (`M-02`); `tabIndex={-1}` so following the fragment
 * moves focus. The hero copy is the approved copy and is hardcoded on purpose (`Q-M21`); the
 * proposition became the H1 at `GS-MASTER-001-F`, and the kicker still carries the structure.
 */
export default function Page() {
  return (
    <>
      <MasterScene fallback={<FallbackMark />} />
      <main id="main" tabIndex={-1} data-stage="master">
        <Hero
          headline="Most companies start over with every supplier. You shouldn’t have to."
          intro="Design, digital and publishing studios in one company. Start with what you need now, and the context carries into whatever comes next."
        />
        <Studios />
        <Context />
        <Process />
        <Reviews />
        <Close />
      </main>
    </>
  );
}
