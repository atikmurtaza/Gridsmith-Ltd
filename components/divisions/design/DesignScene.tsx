"use client"; // Load the scroll choreography after paint; semantic content and SVG stay server-rendered.

import { useEffect, useRef, type ReactNode } from "react";

export function DesignScene({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const connection = navigator as Navigator & {
      connection?: { saveData?: boolean };
      deviceMemory?: number;
    };
    let cancelled = false;
    let generation = 0;
    let dispose: (() => void) | undefined;
    // WCAG 2.2 SC 2.2.2 (GS-LAUNCH-026): the wave and the mascot move on their own for as long as
    // the story is on screen, so the hero's Pause motion shows the approved static narrative (the
    // Save-Data state) until Play motion rebuilds the live scene.
    let still = false;
    const button = element.querySelector<HTMLButtonElement>("[data-design-motion]");
    const start = async () => {
      const current = ++generation;
      dispose?.();
      dispose = undefined;
      if (
        still ||
        motion.matches ||
        connection.connection?.saveData ||
        (connection.deviceMemory ?? 4) < 2
      ) {
        element.dataset.static = still ? "user" : "true";
        return;
      }
      delete element.dataset.static;
      try {
        const { startDesignScene } = await import("./sceneChoreography");
        if (!cancelled && current === generation && !motion.matches)
          dispose = startDesignScene(element);
      } catch {
        if (!cancelled && current === generation)
          element.dataset.static = "true";
      }
    };
    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(start, { timeout: 1000 })
      : window.setTimeout(start, 200);
    const toggle = () => {
      still = !still;
      if (button) button.textContent = still ? "Play motion" : "Pause motion";
      void start();
    };
    motion.addEventListener("change", start);
    button?.addEventListener("click", toggle);
    return () => {
      cancelled = true;
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      else clearTimeout(idle);
      motion.removeEventListener("change", start);
      button?.removeEventListener("click", toggle);
      dispose?.();
    };
  }, []);
  return (
    <div ref={ref} className="ds-story" data-design-story="" data-active="0">
      {children}
    </div>
  );
}
