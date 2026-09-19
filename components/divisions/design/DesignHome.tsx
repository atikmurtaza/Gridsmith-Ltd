import { listServices, type ServiceCard } from "@/lib/sanity/queries";
import { getCompanyDetails } from "@/lib/company/companyDetails";
import {
  ENQUIRY_CTA,
  enquiryHref,
  PRIVATE_EXAMPLES_NOTICE,
} from "@/lib/services/architecture";
import { CANONICAL_PROCESS } from "@/lib/process/canonical";
import { DesignArtwork } from "./DesignArtwork";
import { DesignScene } from "./DesignScene";
import "./design.css";
import "@/styles/themes/design-stage.css";
import { Link } from "@/components/primitives/Link";

/** GS-R002 presentation copy follows the existing landing-page copy convention.
 * Service names/content remain CMS-owned; the owner's brief authorises the thesis and studies.
 */
function Services({
  services,
  groups,
  label,
}: {
  services: ServiceCard[];
  groups: string[];
  label: string;
}) {
  const items = services.filter((s) =>
    groups.includes(s.capabilityGroup ?? ""),
  );
  return (
    <details className="ds-services">
      <summary>{label}</summary>
      {items.length ? (
        <ul>
          {items.map((s) => (
            <li key={s.slug}>
              <a href={`/design/services/${s.slug}`}>{s.title}</a>
            </li>
          ))}
        </ul>
      ) : (
        <p>Tell us what you need and we will discuss the scope with you.</p>
      )}
    </details>
  );
}

export async function DesignHome() {
  const [services, company] = await Promise.all([
    listServices("design"),
    getCompanyDetails(),
  ]);
  return (
    <main id="main" tabIndex={-1}>
      <DesignScene>
        <noscript>
          <style>
            {
              ".ds-stage{display:none!important}.ds-poster{display:block!important}.ds-chapter{min-height:0!important;padding:3rem 6vw!important}.ds-copy{position:relative!important;top:auto!important;width:100%!important}.ds-chapter[data-paper]{background:var(--ds-paper)!important;color:var(--ds-paper-ink)}"
            }
          </style>
        </noscript>
        <div className="ds-stage" data-design-stage="" aria-hidden="true">
          <div className="ds-stage-art">
            <DesignArtwork id="ds-live" live />
            <div className="ds-stage-label">
              <span data-label="0">Vector / workspace</span>
              <span data-label="1">Identity / construction study</span>
              <span data-label="2">Character / form study</span>
              <span data-label="3">Systems / diagrammatic study</span>
              <span data-label="4">Gridsmith Design / from line to form</span>
            </div>
          </div>
        </div>
        <section
          className="ds-chapter"
          data-chapter="0"
          aria-labelledby="design-title"
        >
          <div className="ds-copy">
            <p className="ds-kicker">Gridsmith Design</p>
            <h1 id="design-title">
              From line <span>to form.</span>
            </h1>
            <p className="ds-intro">
              Visual identity, creative design, motion, 3D and technical
              drawing. One connected design practice.
            </p>
            <a
              className="ds-cta"
              data-design-cta=""
              href={enquiryHref("design")}
            >
              {ENQUIRY_CTA.design}
              <span aria-hidden="true">↗</span>
            </a>
            <nav className="ds-chapter-links" aria-label="Design disciplines">
              <a href="#brand-visual">Brand / Visual</a>
              <a href="#motion-dimensional">Motion / Dimensional</a>
              <a href="#technical-design">Technical Design</a>
            </nav>
          </div>
          <div className="ds-poster">
            <DesignArtwork id="ds-workspace" chapter={0} />
          </div>
        </section>
        <section
          id="brand-visual"
          className="ds-chapter"
          data-chapter="1"
          data-paper=""
          aria-labelledby="brand-title"
        >
          <div className="ds-copy">
            <p className="ds-kicker">Brand / Visual</p>
            <h2 id="brand-title">
              An idea.
              <br />A language.
              <br />
              An identity.
            </h2>
            <p className="ds-intro">
              From a letterform to a visual system. Identity, typography and
              graphic composition, considered together.
            </p>
            <Services
              services={services}
              groups={["brand-visual"]}
              label="Explore Brand & Visual services"
            />
            <p className="ds-note">
              G + S is an illustrative construction study using our own mark,
              not an account of its origin.
            </p>
          </div>
          <div className="ds-poster">
            <DesignArtwork id="ds-identity" chapter={1} />
          </div>
        </section>
        <section
          id="motion-dimensional"
          className="ds-chapter"
          data-chapter="2"
          aria-labelledby="motion-title"
        >
          <div className="ds-copy">
            <p className="ds-kicker">Motion / Dimensional</p>
            <h2 id="motion-title">
              Character.
              <br />
              With another
              <br />
              dimension.
            </h2>
            <p className="ds-intro">
              A sketch becomes a shape, a form, a personality. Illustration,
              animation and dimensional design give an idea room to move.
            </p>
            <Services
              services={services}
              groups={["illustration", "motion", "3d-visualisation"]}
              label="Explore illustration, motion & 3D services"
            />
            <p className="ds-note">
              An original Gridsmith character study. Streamer identities, emotes
              and animated channel assets belong to the same visual craft.
            </p>
          </div>
          <div className="ds-poster">
            <DesignArtwork id="ds-character" chapter={2} />
          </div>
        </section>
        <section
          id="technical-design"
          className="ds-chapter"
          data-chapter="3"
          data-paper=""
          aria-labelledby="technical-title"
        >
          <div className="ds-copy">
            <p className="ds-kicker">Technical Design</p>
            <h2 id="technical-title">
              Make the
              <br />
              complex
              <br />
              legible.
            </h2>
            <p className="ds-intro">
              Parts become an assembly. Layers become a coordinated drawing.
              CAD, technical illustration and documentation bring structure to
              supplied design information.
            </p>
            <Services
              services={services}
              groups={["technical"]}
              label="Explore Technical Design services"
            />
            <p className="ds-note ds-gate">
              Diagrammatic Gridsmith study, not a construction design. Technical
              services remain subject to professional-scope and insurance
              confirmation. No engineering certification or regulated sign-off
              is offered.
            </p>
          </div>
          <div className="ds-poster">
            <DesignArtwork id="ds-technical" chapter={3} />
          </div>
        </section>
        <section
          className="ds-chapter"
          data-chapter="4"
          aria-labelledby="design-close"
        >
          <div className="ds-copy">
            <p className="ds-kicker">Gridsmith Design</p>
            <h2 id="design-close">
              Tell us what
              <br />
              you are
              <br />
              making.
            </h2>
            <p className="ds-intro">
              A sketch, an idea, a brief. We’ll discuss the work, define the
              scope and put together a bespoke quote.
            </p>
            <details className="ds-services ds-process">
              <summary>One practice. A considered process.</summary>
              <ol>
                {CANONICAL_PROCESS.map((stage, i) => (
                  <li key={stage.title}>
                    <span>{String(i + 1).padStart(2, "0")}</span>
                    {stage.title}
                    {stage.optional ? " (if applicable)" : ""}
                  </li>
                ))}
              </ol>
              <p>
                <a href="/approach">The six stages in full</a> ·{" "}
                <Link href="/">Meet Gridsmith</Link>
              </p>
            </details>
            <a className="ds-cta" href={enquiryHref("design")}>
              {ENQUIRY_CTA.design}
              <span aria-hidden="true">↗</span>
            </a>
            <p className="ds-note">{company.responseCommitment}</p>
            <details className="ds-services">
              <summary>About private examples</summary>
              <p className="ds-note">{PRIVATE_EXAMPLES_NOTICE}</p>
            </details>
          </div>
          <div className="ds-poster">
            <DesignArtwork id="ds-convergence" chapter={4} />
          </div>
        </section>
      </DesignScene>
    </main>
  );
}
