'use client';
// One persistent server-rendered SVG gains section state, finite motion and navigation previews.
import { useEffect } from 'react';

const PORTS = [0, 72, 144, 216, 288];
const SEQUENCE = [0, 1, 2, 3, 4, 0];

function shortest(current: number, desired: number, period: number, tieDirection: -1 | 1) {
  let delta = ((desired - current) % period + period) % period;
  if (delta > period / 2) delta -= period;
  if (delta === period / 2) delta *= tieDirection;
  return current + delta;
}

export function HeroApertureMotion() {
  useEffect(() => {
    const shell = document.querySelector<HTMLElement>('.dg-apertures');
    const home = shell?.closest<HTMLElement>('.dg-home');
    const ringOne = shell?.querySelector<SVGGElement>('.dg-aperture-ring-one');
    const ringTwo = shell?.querySelector<SVGGElement>('.dg-aperture-ring-two');
    const plane = shell?.querySelector<SVGGElement>('.dg-aperture-plane');
    const cause = shell?.querySelector<SVGGElement>('.dg-aperture-cause');
    const sightline = shell?.querySelector<SVGGElement>('.dg-aperture-sightline');
    const svg = shell?.querySelector<SVGSVGElement>('.dg-aperture-svg');
    const nav = shell?.querySelector<HTMLElement>('.dg-compass-nav');
    const button = shell?.querySelector<HTMLButtonElement>('.dg-motion-control');
    const links = [...(shell?.querySelectorAll<HTMLAnchorElement>('.dg-compass-link') ?? [])];
    const sections = [...(home?.querySelectorAll<HTMLElement>('.dg-hero, .dg-route-map, .dg-chapter, .dg-engagement, .dg-close') ?? [])];
    const finalVisual = home?.querySelector<HTMLElement>('.dg-close-visual-space');
    const mapList = home?.querySelector<HTMLElement>('.dg-map-links');
    const heroVisual = home?.querySelector<HTMLElement>('.dg-hero-visual-space');
    // Composition sentinels: the Route Map's reserved field and the CTA's first paragraph.
    const mapSpace = home?.querySelector<HTMLElement>('.dg-map-visual-space');
    const closeLead = home?.querySelector<HTMLElement>('.dg-close-copy > p');
    const sticky = shell?.parentElement;
    if (!shell || !home || !ringOne || !ringTwo || !plane || !cause || !sightline || !svg || !nav || !button || !mapSpace || !closeLead || !sticky || links.length !== 5 || sections.length !== 9) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mapLinks = [...(home?.querySelectorAll<HTMLAnchorElement>('.dg-map-links a') ?? [])];
    const previewLinks = [...links, ...mapLinks];
    mapLinks.forEach((link, index) => { link.dataset.destination = String(index + 1); });
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;
    let instant = reduced.matches || saveData;
    type Mode = 'hero' | 'map' | 'chapter' | 'final';
    let mode: Mode | null = null;
    let motion: 'auto' | 'paused' | 'done' | 'manual' | 'inactive' = instant ? 'inactive' : 'auto';
    let current = 0;
    let oneAngle = 0;
    let twoAngle = 0;
    let planeAngle = 0;
    let sequenceIndex = 0;
    let onScreen = true;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let pending: (() => void) | null = null;
    let remaining = 0;
    let armedAt = 0;
    let mapLine = 0;
    let axisLine = 0;
    let readingLine = 0;

    // Ambient ring rotation is pure CSS; this only pauses it while it cannot be seen.
    const showAmbient = () => { shell.dataset.ambient = onScreen && !document.hidden ? 'run' : 'paused'; };
    const showMotion = () => {
      shell.dataset.motion = motion;
      shell.dataset.instant = String(instant);
      button.textContent = motion === 'done' ? 'Replay' : motion === 'paused' ? 'Play motion' : 'Pause motion';
      button.setAttribute('aria-pressed', String(motion === 'paused'));
    };
    const runnable = () => onScreen && !document.hidden && !shell.dataset.preview && motion === 'auto';
    const arm = () => {
      if (!pending || timer !== null || !runnable()) return;
      armedAt = performance.now();
      timer = setTimeout(() => {
        timer = null;
        const next = pending;
        pending = null;
        remaining = 0;
        next?.();
      }, remaining);
    };
    const suspend = () => {
      if (timer === null) return;
      clearTimeout(timer);
      timer = null;
      remaining = Math.max(0, remaining - (performance.now() - armedAt));
    };
    const clear = () => {
      suspend();
      pending = null;
      remaining = 0;
    };
    const after = (delay: number, next: () => void) => {
      clear();
      pending = next;
      remaining = delay;
      arm();
    };
    const setAxis = (port: number) => {
      current = port;
      if (port < 0) {
        delete shell.dataset.active;
        links.forEach((link) => link.removeAttribute('data-active'));
        return;
      }
      const desired = PORTS[port];
      oneAngle = shortest(oneAngle, desired, 180, 1);
      twoAngle = shortest(twoAngle, desired, 360, -1);
      planeAngle = shortest(planeAngle, desired, 360, 1);
      cause.style.transform = `rotate(${desired}deg)`;
      sightline.style.transform = `rotate(${desired}deg)`;
      ringOne.style.transform = `rotate(${oneAngle}deg)`;
      ringTwo.style.transform = `rotate(${twoAngle}deg)`;
      plane.style.transform = `rotate(${planeAngle}deg)`;
      shell.dataset.active = String(port + 1);
      links.forEach((link, index) => link.toggleAttribute('data-active', index === port));
    };
    const reactTo = (port: number, finished: () => void) => {
      if (instant) {
        setAxis(port);
        shell.dataset.phase = 'settled';
        finished();
        return;
      }
      const desired = PORTS[port];
      const nextOne = shortest(oneAngle, desired, 180, 1);
      const nextTwo = shortest(twoAngle, desired, 360, -1);
      const nextPlane = shortest(planeAngle, desired, 360, 1);
      shell.dataset.phase = 'cause';
      cause.style.transform = `rotate(${desired}deg)`;
      sightline.style.transform = `rotate(${desired}deg)`;
      after(180, () => {
        shell.dataset.phase = 'reacting';
        if (nextOne !== oneAngle) ringOne.style.transform = `rotate(${nextOne}deg)`;
        oneAngle = nextOne;
        after(120, () => {
          if (nextTwo !== twoAngle) ringTwo.style.transform = `rotate(${nextTwo}deg)`;
          twoAngle = nextTwo;
          after(120, () => {
            if (nextPlane !== planeAngle) plane.style.transform = `rotate(${nextPlane}deg)`;
            planeAngle = nextPlane;
            after(540, () => {
              shell.dataset.phase = 'resolve';
              after(240, () => {
                shell.dataset.phase = 'settled';
                shell.dataset.active = String(port + 1);
                current = port;
                links.forEach((link, index) => link.toggleAttribute('data-active', index === port));
                finished();
              });
            });
          });
        });
      });
    };
    const nextEvent = () => {
      reactTo(SEQUENCE[sequenceIndex], () => {
        sequenceIndex += 1;
        if (sequenceIndex === SEQUENCE.length) {
          motion = 'done';
          showMotion();
        } else after(2800, nextEvent);
      });
    };
    const start = () => {
      clear();
      sequenceIndex = 1;
      setAxis(0);
      shell.dataset.phase = 'settled';
      motion = instant ? 'inactive' : 'auto';
      showMotion();
      if (motion === 'auto') after(2800, nextEvent);
    };
    const onButton = () => {
      if (motion === 'done') start();
      else if (motion === 'auto') { motion = 'paused'; suspend(); showMotion(); }
      else if (motion === 'paused') { motion = 'auto'; showMotion(); arm(); }
    };
    const onPreview = (event: Event) => {
      const link = (event.currentTarget as HTMLElement);
      suspend();
      shell.dataset.preview = link.dataset.destination;
      links.forEach((item) => item.toggleAttribute('data-preview', item.dataset.destination === link.dataset.destination));
    };
    const clearPreview = (event?: Event) => {
      const next = event instanceof FocusEvent || event instanceof MouseEvent ? event.relatedTarget : null;
      if (next instanceof Element && next.closest('.dg-compass-link, .dg-map-links a')) return;
      const focused = previewLinks.find((link) => link === document.activeElement);
      if (event?.type === 'mouseleave' && focused) return;
      delete shell.dataset.preview;
      links.forEach((link) => link.removeAttribute('data-preview'));
      arm();
    };
    const onLink = (event: Event) => {
      const port = Number((event.currentTarget as HTMLElement).dataset.destination) - 1;
      if (port < 0 || port > 4) return;
      clear();
      motion = 'manual';
      showMotion();
      setAxis(port);
      shell.dataset.phase = 'settled';
    };
    const setMode = (next: Mode, chapter = 0) => {
      if (next === mode && (next !== 'chapter' || current === chapter)) return;
      clear();
      clearPreview();
      const changed = mode !== next;
      mode = next;
      shell.dataset.mode = next;
      shell.dataset.phase = 'settled';
      nav.inert = next === 'chapter';
      button.inert = nav.inert;
      if (next === 'chapter') {
        nav.setAttribute('aria-hidden', 'true');
        svg.setAttribute('aria-hidden', 'true');
        motion = 'inactive';
        setAxis(chapter);
      } else {
        nav.removeAttribute('aria-hidden');
        svg.removeAttribute('aria-hidden');
        if (next === 'map') { motion = 'inactive'; setAxis(-1); }
        else if (changed) start();
      }
      showMotion();
    };
    const onVisibility = () => { showAmbient(); if (document.hidden) suspend(); else arm(); };
    const onMotionPreference = () => {
      if (!reduced.matches) return;
      clear();
      instant = true;
      motion = 'inactive';
      setAxis(current);
      shell.dataset.phase = 'settled';
      showMotion();
    };
    // Native sticky positioning carries the same object through the page and out
    // with the final section. Only section crossings change its transform target.
    const onSections = () => {
      const viewport = window.innerHeight;
      const entry = viewport * .65;
      const currentLine = viewport * .45;
      const rects = sections.map((section) => section.getBoundingClientRect());
      const stacked = window.innerWidth < 1024;
      shell.dataset.transit = String(stacked && rects[1].top <= entry && rects[1].top > viewport * .05);
      // Stacked: the rows take the foreground as soon as they reach the instrument's lower edge
      // in its map position, so they never pass under the opaque compass (GS-DIG-001-RC).
      shell.dataset.mapReading = String(stacked && !!mapList && mapList.getBoundingClientRect().top <= readingLine);
      // Desktop hand-offs wait for composition space rather than section contact: the map
      // once the intro has cleared the callout field, the CTA once its first paragraph has
      // fully risen past the instrument's horizontal axis. Stacked layouts keep their thresholds.
      const finalReady = stacked
        ? (finalVisual?.getBoundingClientRect().top ?? rects[8].top) <= viewport * .15
        : closeLead.getBoundingClientRect().bottom <= axisLine;
      const mapReady = stacked ? rects[1].top <= viewport * .05 : mapSpace.getBoundingClientRect().top <= mapLine;
      if (finalReady) setMode('final');
      else if (rects[2].top <= entry) {
        let chapter = -1;
        // The engagement route is unnumbered, so reaching it returns every destination to neutral.
        rects.slice(2, 8).forEach((rect, index) => { if (rect.top <= currentLine) chapter = index < 5 ? index : -1; });
        setMode('chapter', chapter);
      } else if (mapReady) setMode('map');
      else setMode('hero');
      nav.inert = mode === 'chapter' || shell.dataset.transit === 'true' || !onScreen;
      button.inert = nav.inert;
      if (nav.inert) nav.setAttribute('aria-hidden', 'true'); else nav.removeAttribute('aria-hidden');
    };
    const measure = () => {
      if (heroVisual) {
        const top = heroVisual.getBoundingClientRect().top - home.getBoundingClientRect().top + 74;
        home.style.setProperty('--dg-rail-start', `${top}px`);
      }
      // Mirrors the map geometry in digital.css: the compass rests 9rem below its sticky top
      // and the 01 callout (5.25rem tall) is centred on the number at -6.25% of its size.
      // The map begins once the intro, 2rem above the reserved field, clears that callout.
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
      const stickyTop = parseFloat(getComputedStyle(sticky).top);
      const size = shell.offsetWidth;
      mapLine = stickyTop + rem * 9 - size * .0625 - rem * 5.25 / 2 + rem * .5;
      axisLine = stickyTop + size / 2;
      // Mirrors the stacked map offset in digital.css (--dg-y: 14rem below the sticky top).
      readingLine = stickyTop + rem * 14 + size;
      onSections();
    };
    let sectionObservers: IntersectionObserver[] = [];
    const resize = () => {
      sectionObservers.forEach((observer) => observer.disconnect());
      measure();
      const viewport = window.innerHeight;
      sectionObservers = [.65, .45, .15, .05].map((line) => viewport * line).concat(mapLine, axisLine, readingLine).map((line) => {
        const observer = new IntersectionObserver(onSections, {
          rootMargin: `-${line}px 0px -${Math.max(0, viewport - line - 1)}px 0px`, threshold: 0,
        });
        sections.forEach((section) => observer.observe(section));
        [finalVisual, mapList, mapSpace, closeLead].forEach((element) => { if (element) observer.observe(element); });
        return observer;
      });
    };
    const observer = new ResizeObserver(resize);
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      showAmbient();
      onSections();
      if (onScreen) arm(); else suspend();
    });

    previewLinks.forEach((link) => {
      link.addEventListener('mouseenter', onPreview);
      link.addEventListener('focus', onPreview);
      link.addEventListener('mouseleave', clearPreview);
      link.addEventListener('blur', clearPreview);
      link.addEventListener('click', onLink);
    });
    button.addEventListener('click', onButton);
    document.addEventListener('visibilitychange', onVisibility);
    reduced.addEventListener('change', onMotionPreference);
    shell.dataset.enhanced = 'true';
    showAmbient();
    showMotion();
    observer.observe(home);
    visibilityObserver.observe(shell);
    window.addEventListener('resize', resize);
    resize();
    return () => {
      clear();
      observer.disconnect();
      visibilityObserver.disconnect();
      sectionObservers.forEach((sectionObserver) => sectionObserver.disconnect());
      window.removeEventListener('resize', resize);
      previewLinks.forEach((link) => {
        link.removeEventListener('mouseenter', onPreview);
        link.removeEventListener('focus', onPreview);
        link.removeEventListener('mouseleave', clearPreview);
        link.removeEventListener('blur', clearPreview);
        link.removeEventListener('click', onLink);
      });
      button.removeEventListener('click', onButton);
      document.removeEventListener('visibilitychange', onVisibility);
      reduced.removeEventListener('change', onMotionPreference);
    };
  }, []);
  return null;
}
