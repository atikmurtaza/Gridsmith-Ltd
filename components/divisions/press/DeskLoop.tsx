'use client';
// Loops the hero desk Write → Edit → Produce → Publish → hold by stepping the existing stage
// radios; the CSS state transitions do the movement. Client-only because it is timing, not
// content: without JS (or under reduced motion) the server's settled Publish state stands.
import { useEffect, useRef, useState } from 'react';

const STAGES = ['write', 'edit', 'produce', 'publish'] as const;
/** Stage start times (ms). Publish lands at 1.5s and settles by ~1.9s with the 400ms transition. */
const AT = [0, 450, 1000, 1500];
/** Next cycle: Publish holds ~1.9s, then the 400ms Publish → Write transition is the reset. */
const CYCLE = 3800;
/** After a visitor picks a stage, leave it alone this long before looping again. */
const RESUME_AFTER = 5000;

export function DeskLoop() {
  const ref = useRef<HTMLButtonElement>(null);
  const [active, setActive] = useState(false);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  const control = useRef<{ sync: () => void } | null>(null);

  useEffect(() => {
    const desk = ref.current?.closest<HTMLElement>('.pr-desk');
    if (!desk || !('IntersectionObserver' in window)) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const radios = STAGES.map((id) => desk.querySelector<HTMLInputElement>(`#pr-desk-${id}`));
    if (radios.some((r) => !r)) return;

    let timers: number[] = [];
    let running = false;
    let visible = false;
    let holding = false;
    let resume = 0;

    const clear = () => { timers.forEach(clearTimeout); timers = []; running = false; };
    const cycle = () => {
      clear();
      running = true;
      AT.forEach((t, i) => timers.push(window.setTimeout(() => { radios[i]!.checked = true; }, t)));
      timers.push(window.setTimeout(cycle, CYCLE));
    };
    const sync = () => {
      const go = visible && !document.hidden && !holding && !pausedRef.current;
      if (go && !running) cycle();
      else if (!go && running) clear();
    };

    // Only a real choice (pointer, touch or keyboard) fires `change`; the loop's own writes do not.
    const onChoice = () => {
      holding = true;
      clear();
      clearTimeout(resume);
      resume = window.setTimeout(() => { holding = false; sync(); }, RESUME_AFTER);
    };
    desk.addEventListener('change', onChoice);
    const io = new IntersectionObserver(([entry]) => { visible = entry.intersectionRatio >= 0.35; sync(); }, { threshold: [0, 0.35, 1] });
    io.observe(desk);
    document.addEventListener('visibilitychange', sync);
    control.current = { sync };
    setActive(true);

    return () => {
      clear();
      clearTimeout(resume);
      io.disconnect();
      desk.removeEventListener('change', onChoice);
      document.removeEventListener('visibilitychange', sync);
      control.current = null;
    };
  }, []);

  const toggle = () => {
    pausedRef.current = !pausedRef.current;
    setPaused(pausedRef.current);
    control.current?.sync();
  };

  // WCAG 2.2.2: anything that moves for more than five seconds can be paused.
  return (
    <button ref={ref} type="button" className="pr-desk-loop" aria-pressed={paused} onClick={toggle} hidden={!active}>
      {paused ? 'Play the sequence' : 'Pause the sequence'}
    </button>
  );
}
