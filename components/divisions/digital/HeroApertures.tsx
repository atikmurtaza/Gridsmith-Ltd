import type { CSSProperties } from 'react';
import { HeroApertureMotion } from './HeroApertureMotion';

const CENTER = 320;
const PORTS = [0, 72, 144, 216, 288];
// Every number sits on one radius, so the numbered ring is as circular as the drawn one.
const NUMBER_RADIUS = 360;
// Leaders begin where they previously emerged from the number's (now removed) backing
// box, so no opaque box has to sit over the outer ring to hide their start.
const LEADERS = [
  'M366 -40 H410',
  'M704 162 V50 H600',
  'M531.60 657 V715',
  'M108.40 657 V715',
  'M-64 162 V50 H40',
];

export type Destination = { id: string; label: string; behaviour: string; count: number };

function coordinates(radius: number, degrees: number) {
  const radians = degrees * Math.PI / 180;
  return [CENTER + radius * Math.sin(radians), CENTER - radius * Math.cos(radians)];
}

function point(radius: number, degrees: number) {
  return coordinates(radius, degrees).map((value) => value.toFixed(2)).join(' ');
}

// Number centre as a fraction of the instrument, consumed by CSS for the number, the
// Route Map callout row and its leader length.
function numberPosition(degrees: number) {
  const [x, y] = coordinates(NUMBER_RADIUS, degrees);
  return { '--dg-nx': (x / 640).toFixed(4), '--dg-ny': (y / 640).toFixed(4) } as CSSProperties;
}

function arc(radius: number, start: number, end: number) {
  return `M ${point(radius, start)} A ${radius} ${radius} 0 ${end - start > 180 ? 1 : 0} 1 ${point(radius, end)}`;
}

function slot(inner: number, outer: number, start: number, end: number) {
  return `M ${point(inner, start)} L ${point(outer, start)} A ${outer} ${outer} 0 0 1 ${point(outer, end)} L ${point(inner, end)} A ${inner} ${inner} 0 0 0 ${point(inner, start)} Z`;
}

export function HeroApertures({ destinations }: { destinations: Destination[] }) {
  return <div className="dg-apertures" data-mode="hero" data-active="1" data-phase="settled" data-motion="pending">
    <svg className="dg-aperture-svg" viewBox="0 0 640 640" role="img" aria-label="An abstract system of nested rings. Its apertures align with one of five Digital service groups as the visitor moves through the page.">
      <g className="dg-aperture-frame" aria-hidden="true">
        <circle cx={CENTER} cy={CENTER} r="299" />
        {Array.from({ length: 25 }, (_, index) => <line key={index} x1={point(284, index * 14.4).split(' ')[0]} y1={point(284, index * 14.4).split(' ')[1]} x2={point(295, index * 14.4).split(' ')[0]} y2={point(295, index * 14.4).split(' ')[1]} />)}
        {PORTS.map((degrees) => <line className="dg-aperture-notch" key={degrees} x1={point(294, degrees).split(' ')[0]} y1={point(294, degrees).split(' ')[1]} x2={point(309, degrees).split(' ')[0]} y2={point(309, degrees).split(' ')[1]} />)}
      </g>
      {/* Outer groups carry destination alignment (set by script); inner .dg-spin groups
          carry the ambient CSS rotation, so neither transform overwrites the other. */}
      <g className="dg-aperture-ring-one" aria-hidden="true"><g className="dg-spin dg-spin-one"><path d={arc(236, 7, 173)} /><path d={arc(236, 187, 353)} /><circle cx={CENTER} cy={CENTER} r="224" className="dg-aperture-quiet-track" /></g></g>
      <g className="dg-aperture-ring-two" aria-hidden="true"><g className="dg-spin dg-spin-two"><path d={arc(172, 8, 352)} /><path d={arc(160, 172, 187)} className="dg-aperture-weight" /></g></g>
      <g className="dg-aperture-sightline" aria-hidden="true"><line x1="320" y1="84" x2="320" y2="207" /></g>
      <g className="dg-aperture-plane" aria-hidden="true"><circle cx={CENTER} cy={CENTER} r="108" /><g className="dg-spin dg-spin-plane"><circle className="dg-aperture-plane-inset" cx={CENTER} cy={CENTER} r="84" /></g><path className="dg-aperture-slot" d={slot(30, 109, -7, 7)} /></g>
      <g className="dg-aperture-core" aria-hidden="true"><circle cx={CENTER} cy={CENTER} r="28" /><circle className="dg-aperture-core-point" cx={CENTER} cy={CENTER} r="6" /></g>
      <g className="dg-aperture-cause" aria-hidden="true"><circle cx="320" cy="21" r="6" /><line x1="320" y1="30" x2="320" y2="44" /></g>
    </svg>
    <nav className="dg-compass-nav" aria-label="Digital service groups">
      {destinations.map((destination, index) => <a className={`dg-compass-link dg-compass-link-${index + 1}`} href={`#${destination.id}`} data-destination={index + 1} data-active={index === 0 ? 'true' : undefined} key={destination.id} style={numberPosition(PORTS[index])} aria-label={`${String(index + 1).padStart(2, '0')} ${destination.label}: ${destination.behaviour}, ${destination.count} services`}>
        <svg className="dg-compass-leader" viewBox="-160 -100 960 1000" aria-hidden="true"><path className="dg-leader-hit" d={LEADERS[index]} /><path d={LEADERS[index]} /></svg>
        <span className="dg-compass-number dg-system-index">{String(index + 1).padStart(2, '0')}</span><span className="dg-compass-label"><strong>{destination.label}</strong><small>{destination.behaviour}</small><small>{destination.count} services</small></span>
      </a>)}
    </nav>
    <button className="dg-motion-control" type="button" aria-pressed="false">Pause motion</button>
    <HeroApertureMotion />
  </div>;
}
