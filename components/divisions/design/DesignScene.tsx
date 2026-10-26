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
    const start = async () => {
      const current = ++generation;
      dispose?.();
      dispose = undefined;
      if (
        motion.matches ||
        connection.connection?.saveData ||
        (connection.deviceMemory ?? 4) < 2
      ) {
        element.dataset.static = "true";
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
    motion.addEventListener("change", start);
    return () => {
      cancelled = true;
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      else clearTimeout(idle);
      motion.removeEventListener("change", start);
      dispose?.();
    };
  }, []);
  return (
    <div ref={ref} className="ds-story" data-design-story="" data-active="0">
      {children}
    </div>
  );
}
