'use client'; // WebGL, matchMedia and a post-paint dynamic import — none of it exists on the server.

import { useEffect, useRef, type ReactNode } from 'react';
import type { Scene } from './scene';
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
 * | `fallback` | no WebGL, **software-only WebGL**, a draw that blocks >100ms, shader failure, lost context, failed import, low-capability device | the logo's geometry as inline gold vector shapes (`FallbackMark`), static — never an image, so never an LCP candidate |
 * | `ready` + reduced motion | `prefers-reduced-motion: reduce` | the scene, rendered once in its hero pose, never moving |
 *
 * `aria-hidden` and `pointer-events: none`: it is decorative, holds nothing focusable and
 * never takes input. Scrolling stays native — the scene reads `scrollY`, it never sets it.
 */
export function MasterScene({ fallback }: { fallback: ReactNode }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const layer = canvas?.parentElement;
    if (!canvas || !layer) return;
    let scene: Scene | null = null;
    let cancelled = false;
    const fallback = () => {
      if (cancelled) return;
      scene?.dispose();
      scene = null;
      layer.dataset.render = 'fallback';
    };

    const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
    const lowCapability =
      (nav.hardwareConcurrency ?? 4) <= 2 || (nav.deviceMemory ?? 4) <= 2 || nav.connection?.saveData === true;
    if (lowCapability) {
      fallback();
      return;
    }

    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const onMotion = () => scene?.setReducedMotion(motion.matches);
    if (motion.addEventListener) motion.addEventListener('change', onMotion);
    else motion.addListener(onMotion);

    const start = () =>
      import('./scene')
        .then(({ startScene }) => {
          if (cancelled) return;
          scene = startScene(canvas, {
            reduced: motion.matches,
            // Test affordance for `check:master:scene` on a GPU-less runner; see scene.ts.
            allowSoftware: new URLSearchParams(location.search).get('scene') === 'software',
            onSlow: fallback,
          });
          if (scene) layer.dataset.render = 'ready';
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
      if (motion.removeEventListener) motion.removeEventListener('change', onMotion);
      else motion.removeListener(onMotion);
      scene?.dispose();
      scene = null;
    };
  }, []);

  return (
    <div className={styles.scene} aria-hidden="true" data-master-scene="">
      <div className={styles.sceneFallback}>{fallback}</div>
      <canvas ref={ref} className={styles.sceneCanvas} />
    </div>
  );
}
