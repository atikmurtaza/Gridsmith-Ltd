import { getCompanyDetails } from '@/lib/company/companyDetails';
import { CANONICAL_PROCESS } from '@/lib/process/canonical';
import { CAPABILITY_GROUPS, ENQUIRY_CTA, PRIVATE_EXAMPLES_NOTICE, enquiryHref } from '@/lib/services/architecture';
import { listServices, type ServiceCard } from '@/lib/sanity/queries';
import { HeroApertures } from './HeroApertures';
import { VisualActivation } from './VisualActivation';
import './digital.css';

const chapters = [
  { key: 'web', id: 'web', behaviour: 'Arrive and find a way in', headline: 'Help people find their next step.', lede: 'A visitor arrives with a question or a task. The site should make the next step clear, whether that is finding information, making an enquiry or using a service. We shape pages, content structures and web applications around those journeys, then agree how the site will be edited and run.' },
  { key: 'software', id: 'software', behaviour: 'Apply the working rules', headline: 'Make the rules of work clear.', lede: 'A process depends on rules: who can see a record, who can change it, and what happens when its status moves. We make those rules explicit before building tools, portals and dashboards. That gives people using them a way to follow the work and spot where it needs attention.' },
  { key: 'apps-interactive', id: 'apps-interactive', behaviour: 'Act and get feedback', headline: 'Let people act and see what happens.', lede: 'Some work happens in the hand, on the move or through direct interaction. We decide what an app or interactive experience needs to show, accept and return. The format follows the job, from a mobile task to a game mechanic, with feedback people can understand as they use it.' },
  { key: 'automation-intelligence', id: 'automation-intelligence', behaviour: 'Pass work between systems', headline: 'Pass work on with a clear decision.', lede: 'A useful handoff has a clear trigger, a known destination and a way to handle uncertainty. We map those decisions before connecting systems or automating steps. Where a model is involved, its task and limits are defined, with a person kept in the decision where the result has consequences.' },
  { key: 'operate-improve', id: 'operate-improve', behaviour: 'Watch, respond and improve', headline: 'See what needs attention next.', lede: 'Launch changes what needs attention; it does not end the work. Updates, monitoring and improvements are agreed for each engagement, along with who handles hosting and access. When something fails, the people responsible need enough information to find it, respond and decide what to improve next.' },
] as const;

const groups = CAPABILITY_GROUPS.filter((group) => group.division === 'digital');

function Station({ label, state = 'active' }: { label: string; state?: 'idle' | 'active' | 'human' | 'exception' }) {
  return <span className={`dg-station dg-${state}`}><span className="dg-station-glyph" aria-hidden="true" />{label}</span>;
}

function ServiceRows({ services, group }: { services: ServiceCard[]; group: string }) {
  const items = services.filter((service) => service.capabilityGroup === group);
  return (
    <div className="dg-service-index">
      <h3>Services in this group <span>{String(items.length).padStart(2, '0')}</span></h3>
      {items.length ? <ul>{items.map((service) => <li key={service.slug}>
        <a href={`/digital/services/${service.slug}`}>
          <strong>{service.title}</strong>
          <span>{service.problem}</span>
          <span className="dg-service-arrow" aria-hidden="true">↗</span>
        </a>
      </li>)}</ul> : <p>Ask us about this area and we can discuss the right scope.</p>}
    </div>
  );
}

const switchPaths = [
  { id: 'available', option: 'Everything needed is available.', states: ['Rule matched', 'Step run', 'Response confirmed', 'Settled'], result: 'The example request has what it needs and reaches a confirmed result.' },
  { id: 'review', option: 'A person needs to decide.', states: ['Rule checked', 'Sent for review', 'Person decides', 'Settled'], result: 'The request waits for a person’s decision before it can continue.' },
  { id: 'retry', option: 'The other system does not respond.', states: ['Handoff attempted', 'No response', 'Queued for retry', 'Response received'], result: 'The example holds the request, retries the handoff and shows when it receives a response.' },
] as const;

function Switch() {
  return <fieldset className="dg-switch">
    <legend>What happens to the request?</legend>
    <p className="dg-switch-notice">This is an illustration, not a live system. Rules, human checks, retries and recovery are designed for each project’s agreed scope.</p>
    <div className="dg-switch-choices">{switchPaths.map((path, index) => <div className="dg-switch-choice" key={path.id}>
      <input id={`dg-path-${path.id}`} type="radio" name="request-path" value={path.id} defaultChecked={index === 0} />
      <label htmlFor={`dg-path-${path.id}`}><span className="dg-choice-letter">{String.fromCharCode(65 + index)}</span>{path.option}</label>
      <div className="dg-switch-outcome">
        <ol>{path.states.map((state, step) => <li key={state}><span>{String(step + 1).padStart(2, '0')}</span>{state}</li>)}</ol>
        <p>{path.result}</p>
      </div>
    </div>)}</div>
  </fieldset>;
}

function Diagram({ chapter }: { chapter: string }) {
  if (chapter === 'web') return <div className="dg-diagram dg-web-diagram">
    <div className="dg-web-model"><span className="dg-diagram-label">One content structure</span><ol><li>Title</li><li>Body</li><li>Media</li><li>Action</li><li>Navigation</li></ol></div>
    <fieldset className="dg-web-control"><legend>Choose a layout</legend>
      <div className="dg-web-options"><input type="radio" name="web-layout" id="dg-web-wide" defaultChecked /><label htmlFor="dg-web-wide">Wide</label><input type="radio" name="web-layout" id="dg-web-mid" /><label htmlFor="dg-web-mid">Medium</label><input type="radio" name="web-layout" id="dg-web-narrow" /><label htmlFor="dg-web-narrow">Narrow</label></div>
      <div className="dg-web-layout" role="group" aria-label="The same title, body, media, action and navigation regions rearrange for the selected layout."><span className="dg-web-slot dg-web-nav">Navigation</span><span className="dg-web-slot dg-web-title">Title</span><span className="dg-web-slot dg-web-body">Body</span><span className="dg-web-slot dg-web-media">Media</span><span className="dg-web-slot dg-web-action">Action</span></div>
    </fieldset>
  </div>;
  if (chapter === 'software') return <div className="dg-diagram dg-software-diagram">
    <div className="dg-workspace-head"><span>Example record</span><span>Rules / permissions / state</span></div>
    <fieldset className="dg-workspace-controls"><legend>Change the record state</legend><div><span><input type="radio" name="record-state" id="dg-record-open" defaultChecked /><label htmlFor="dg-record-open">Open</label></span><span><input type="radio" name="record-state" id="dg-record-review" /><label htmlFor="dg-record-review">In review</label></span><span><input type="radio" name="record-state" id="dg-record-settled" /><label htmlFor="dg-record-settled">Settled</label></span></div></fieldset>
    <div className="dg-workspace-body"><div className="dg-workspace-record"><span className="dg-diagram-label">Record</span><dl><div><dt>Status</dt><dd className="dg-record-status"><span className="dg-state-open">Open</span><span className="dg-state-review">In review</span><span className="dg-state-settled">Settled</span></dd></div><div><dt>Owner</dt><dd>Assigned</dd></div><div><dt>Due</dt><dd>Defined</dd></div><div><dt>Access</dt><dd>Scoped</dd></div></dl></div><div className="dg-workspace-rule"><span className="dg-diagram-label">Available action</span><p className="dg-state-open">Edit permitted</p><p className="dg-state-review">Change awaits a decision</p><p className="dg-state-settled">Read the settled record</p><span className="dg-workspace-rule-foot">State determines the next action</span></div></div>
  </div>;
  if (chapter === 'apps-interactive') return <fieldset className="dg-diagram dg-app-diagram"><legend>Move the object</legend>
    <div className="dg-app-stage" aria-hidden="true"><span className="dg-app-target dg-app-target-left" /><span className="dg-app-target dg-app-target-centre" /><span className="dg-app-target dg-app-target-right" /><span className="dg-app-object"><i /></span></div>
    <div className="dg-app-controls"><input type="radio" name="app-position" id="dg-app-left" /><label htmlFor="dg-app-left">Left</label><input type="radio" name="app-position" id="dg-app-centre" defaultChecked /><label htmlFor="dg-app-centre">Centre</label><input type="radio" name="app-position" id="dg-app-right" /><label htmlFor="dg-app-right">Right</label></div>
    <p className="dg-app-feedback" aria-live="polite"><span className="dg-app-feedback-left">Left position confirmed.</span><span className="dg-app-feedback-centre">Centre position confirmed.</span><span className="dg-app-feedback-right">Right position confirmed.</span> Next input is clear.</p>
  </fieldset>;
  if (chapter === 'automation-intelligence') return <div className="dg-diagram dg-automation-diagram" role="img" aria-label="The selected example request takes one of three visibly different routes: direct response, human review or retry after no response.">
    <div className="dg-automation-core"><div className="dg-boundary"><span className="dg-diagram-label">System A</span><Station label="Request received" /></div>
    <div className="dg-connector" aria-hidden="true" />
    <div className="dg-boundary"><span className="dg-diagram-label">Defined task</span><Station label="Rule or evaluation" /><small>Limits set in scope</small></div></div>
    <div className="dg-automation-paths" aria-hidden="true">
      <div className="dg-path dg-path-available"><span>A / matched</span><i /><span>Step run</span><i /><span>Response confirmed</span></div>
      <div className="dg-path dg-path-review"><span>B / review</span><i /><span>Human decision</span><i /><span>Continue when decided</span></div>
      <div className="dg-path dg-path-retry"><span>C / no response</span><i /><span>Queued for retry</span><i /><span>Response received</span></div>
    </div>
    <div className="dg-automation-terminal" aria-live="polite"><span className="dg-terminal-available">Response confirmed</span><span className="dg-terminal-review">Awaiting human decision</span><span className="dg-terminal-retry">Handoff held for retry</span></div>
  </div>;
  return <div className="dg-diagram dg-operate-diagram">
    <div className="dg-diagnostic-head"><span>System observation</span><span>Qualitative states</span></div>
    <div className="dg-diagnostic-field"><svg viewBox="0 0 900 220" preserveAspectRatio="none" role="img" aria-label="A steady signal shows one exception, followed by observation, response and a settled state."><path className="dg-diagnostic-guide" d="M0 110 H900" /><path className="dg-diagnostic-trace" d="M0 110 H275 L310 82 L340 158 L372 110 H560 L592 100 L625 110 H900" /><circle className="dg-diagnostic-event" cx="340" cy="158" r="8" /><circle className="dg-diagnostic-recovery" cx="625" cy="110" r="7" /></svg><div className="dg-diagnostic-mobile" aria-hidden="true"><span /><span /><span /><span /></div><span className="dg-diagnostic-event-label">Exception detected</span></div>
    <div className="dg-diagnostic-states"><span>Observing</span><span>Exception identified</span><span>Response</span><span>Settled</span></div>
    <details className="dg-diagnostic-details"><summary>Inspect the exception</summary><p>Recovery and improvement follow the agreed responsibilities.</p></details>
  </div>;
}

export async function DigitalHome() {
  const [services, company] = await Promise.all([listServices('digital'), getCompanyDetails()]);
  return <main id="main" tabIndex={-1} className="dg-home" data-digital-home="">
    <VisualActivation />
    <section className="dg-hero" aria-labelledby="digital-title">
      <div className="dg-frame">
        <div className="dg-hero-stage">
          <p className="dg-kicker">Gridsmith Digital <span>00 / Input</span></p>
          <h1 id="digital-title">When one thing changes,<br /> the right things follow.</h1>
          <div className="dg-hero-visual-space" aria-hidden="true" />
          <p className="dg-hero-lede">From the first visit to the work after launch, we build websites, software, apps and connected workflows around clear decisions and handoffs.</p>
          <div className="dg-hero-actions"><a className="dg-button" href={enquiryHref('digital')}>{ENQUIRY_CTA.digital} <span aria-hidden="true">↗</span></a><a className="dg-text-link" href="#route-map">See how it works <span aria-hidden="true">↓</span></a></div>
        </div>
      </div>
    </section>

    <div className="dg-compass-rail"><div className="dg-compass-sticky"><HeroApertures destinations={chapters.map((chapter) => ({ id: chapter.id, label: groups.find((group) => group.key === chapter.key)?.label ?? chapter.key, behaviour: chapter.behaviour, count: services.filter((service) => service.capabilityGroup === chapter.key).length }))} /></div></div>

    <section className="dg-route-map" id="route-map" aria-labelledby="route-title"><div className="dg-frame"><div className="dg-section-intro"><p className="dg-kicker">Route map</p><h2 id="route-title">Follow the request.</h2><p>A request enters, moves through the parts it needs, reaches a decision and returns a response; each group handles a different part of that journey.</p></div>
      <div className="dg-map-visual-space" aria-hidden="true" /><nav className="dg-map-links" aria-label="Digital capability groups"><ol>{chapters.map((chapter, index) => <li key={chapter.key}><a href={`#${chapter.id}`}><span className="dg-map-number">{String(index + 1).padStart(2, '0')}</span><strong>{groups.find((group) => group.key === chapter.key)?.label}</strong><span>{chapter.behaviour}</span><span className="dg-map-count">{services.filter((service) => service.capabilityGroup === chapter.key).length} services</span></a></li>)}</ol></nav>
    </div></section>

    {chapters.map((chapter, index) => <section className={`dg-chapter dg-chapter-${chapter.key}`} id={chapter.id} aria-labelledby={`${chapter.id}-title`} key={chapter.key}><div className="dg-frame">
      <div className="dg-chapter-header"><p className="dg-kicker">{String(index + 1).padStart(2, '0')} / {groups.find((group) => group.key === chapter.key)?.label}</p><h2 id={`${chapter.id}-title`}>{chapter.headline}</h2><p>{chapter.lede}</p></div>
      {chapter.key === 'automation-intelligence' ? <div className="dg-automation-unit"><Diagram chapter={chapter.key} /><Switch /></div> : <Diagram chapter={chapter.key} />}
      <ServiceRows services={services} group={chapter.key} />
    </div></section>)}

    <section className="dg-engagement" aria-labelledby="engagement-title"><div className="dg-frame"><div className="dg-section-intro"><p className="dg-kicker">Engagement route / process</p><h2 id="engagement-title">A clear route through the work.</h2><p>Each project follows the same six stages. The detail is agreed for the work at hand.</p></div><ol>{CANONICAL_PROCESS.map((stage) => <li key={stage.number}><span>{String(stage.number).padStart(2, '0')}</span><div><h3>{stage.title}{stage.optional ? ' (if applicable)' : ''}</h3><p>{stage.description}</p></div></li>)}</ol><a className="dg-text-link" href="/approach">The six stages in full <span aria-hidden="true">↗</span></a></div></section>

    <section className="dg-close" aria-labelledby="close-title"><div className="dg-frame"><p className="dg-kicker">Settled system / contact</p><div className="dg-close-layout"><div className="dg-close-copy"><h2 id="close-title">The next request starts here.</h2><p>Tell us what needs to connect, change or recover. We can discuss whether it fits and set the work and its arrangements out in writing.</p><a className="dg-button" href={enquiryHref('digital')}>{ENQUIRY_CTA.digital} <span aria-hidden="true">↗</span></a><p className="dg-commitment">{company.responseCommitment}</p><div className="dg-close-notes"><p>Your project agreement sets out the source code, documentation, account access and handover included in the work. We prefer arrangements you can access directly, with hosting and access agreed before work begins. We agree what is needed to run and support the system after launch.</p><p>{PRIVATE_EXAMPLES_NOTICE}</p><p>Gridsmith Digital is a trading division of Gridsmith Ltd.</p></div></div><div className="dg-close-visual-space" aria-hidden="true" /></div></div></section>
  </main>;
}
