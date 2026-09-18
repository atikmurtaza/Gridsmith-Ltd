'use client'; // WebGL, matchMedia and a post-paint dynamic import — none of it exists on the server.

import { useEffect, useRef } from 'react';
import styles from './home.module.css';

/**
 * The Master environment — `GS-R001-M`. A fixed layer behind the whole homepage carrying the
 * Gridsmith mark as polished gold geometry, which travels through the page with the reader.
 *
 * This component is the **only** client code the scene adds to the route's initial JS. The
 * renderer (`scene.ts`) is fetched with `import()` once the browser is idle, so it is neither
 * on the LCP path nor counted in the route's first-load delta; `check-bundle-size` reports it
 * as its own line against its own ceiling.
 *
 * ## Four states, all of them a finished composition
 *
 * | `data-render` | When | What shows |
 * |---|---|---|
 * | *(unset)* | before the renderer arrives | the stage colour and its glow |
 * | `ready` | WebGL rendered its first frame | the scene |
 * | `fallback` | no WebGL, shader failure, lost context, failed import, low-capability device | the owner's gold logo, static |
 * | `ready` + reduced motion | `prefers-reduced-motion: reduce` | the scene, rendered once in its hero pose, never moving |
 *
 * `aria-hidden` and `pointer-events: none`: it is decorative, holds nothing focusable and
 * never takes input. Scrolling stays native — the scene reads `scrollY`, it never sets it.
 */
export function MasterScene() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const layer = canvas?.parentElement;
    if (!canvas || !layer) return;
    let dispose: (() => void) | null = null;
    let cancelled = false;
    const fallback = () => {
      dispose?.();
      dispose = null;
      layer.dataset.render = 'fallback';
    };

    const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
    const lowCapability =
      (nav.hardwareConcurrency ?? 4) <= 2 || (nav.deviceMemory ?? 4) <= 2 || nav.connection?.saveData === true;
    if (lowCapability) {
      fallback();
      return;
    }

    const start = () =>
      import('./scene')
        .then(({ startScene }) => {
          if (cancelled) return;
          dispose = startScene(canvas, {
            reduced: matchMedia('(prefers-reduced-motion: reduce)').matches,
          });
          if (dispose) layer.dataset.render = 'ready';
          else fallback();
        })
        .catch(fallback);

    canvas.addEventListener('gs-scene-lost', fallback);
    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(start, { timeout: 1200 })
      : window.setTimeout(start, 300);

    return () => {
      cancelled = true;
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
      canvas.removeEventListener('gs-scene-lost', fallback);
      dispose?.();
    };
  }, []);

  return (
    <div className={styles.scene} aria-hidden="true" data-master-scene="">
      <div className={styles.sceneFallback} />
      <canvas ref={ref} className={styles.sceneCanvas} />
    </div>
  );
}
