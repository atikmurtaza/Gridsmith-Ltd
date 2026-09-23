import { buildingCurves, buildingNodeStarts, curvePath, letterOutline, markCurves, interpolate, facePoints, architecturalPoints, wirePath, travellingWave } from "./transitionGeometry";
import { gOutlines, sOutlines } from "./letterGeometry";

/** R2: copy and artwork share native-scroll progress; the supplied mascot animates itself. */
export function startDesignScene(root: HTMLElement): () => void {
  const stage = root.querySelector<HTMLElement>("[data-design-stage]")!;
  const stageArt = stage.querySelector<HTMLElement>(".ds-stage-art")!;
  const svg = stage.querySelector<SVGSVGElement>("svg")!;
  const chapters = [...root.querySelectorAll<HTMLElement>("[data-chapter]")];
  const copies = chapters.map((el) => el.querySelector<HTMLElement>(".ds-copy")!);
  const select = (s: string) => svg.querySelector<SVGElement>(s)!;
  const art = [...svg.querySelectorAll<SVGElement>("[data-art]")];
  const thread = select("[data-thread]");
  const controls = select("[data-workspace-controls]");
  const form = select("[data-workspace-form]");
  const node = select("[data-design-node]");
  const handles = select("[data-handles]");
  const letterG = select("[data-letter-g] path");
  const letterS = select("[data-letter-s] path");
  const construction = select("[data-construction]");
  const brandNodes = [...svg.querySelectorAll<SVGCircleElement>("[data-brand-node]")];
  // The DOM contains an intermediate pose after a reduced-motion toggle. Targets
  // must stay at the approved mark coordinates when the scene starts again.
  const nodeTargets = [[347.5, 336], [538, 336], [347.5, 517.5], [538, 517.5], [447.5, 437], [640, 437], [447.5, 617], [640, 617]];
  const nodeStarts = [[382, 221], [452, 232], [371, 320], [455, 310], [576, 297], [651, 321], [508, 515], [655, 482]];
  const buildingDetail = select("[data-building-detail]");
  const buildingEdges = [...svg.querySelectorAll<SVGPathElement>("[data-building-edge]")];
  const buildingNodes = [...svg.querySelectorAll<SVGCircleElement>("[data-building-node]")];
  const shine = select("[data-metal-shine]");
  const shineGradient = select("[data-shine-gradient]");
  const sketch = select("[data-sketch]");
  const character = select("[data-finished-character]");
  const rig = select("[data-rig]");
  const rigPath = rig.querySelector("path")!;
  const joints = [...rig.querySelectorAll("circle")];
  const roof = select("[data-roof]");
  const floors = [
    ...svg.querySelectorAll<SVGElement>('[data-art="technical"] [data-storey]'),
  ];
  const columns = select("[data-columns]");
  const dimensions = select("[data-dimensions]");
  const electrical = select("[data-electrical]");
  const water = select("[data-water]");
  const technical = select('[data-art="technical"]');
  const grid = select('[data-grid]');
  const narrow = matchMedia("(max-width: 760px)");
  const clamp = (n: number) => Math.max(0, Math.min(1, n));
  const smooth = (a: number, b: number, n: number) => {
    const t = clamp((n - a) / (b - a));
    return t * t * (3 - 2 * t);
  };
  const opacity = (el: SVGElement, n: number) => {
    el.style.opacity = String(clamp(n));
  };
  let frame = 0,
    target = 0,
    position = NaN;
  let phase = 0, velocity = -0.65, waveTime = 0, lastTime = 0;
  let visible = true,
    stopped = false;
  let tops: number[] = [];
  let end = 0;
  const measure = () => {
    tops = chapters.map((el) => el.getBoundingClientRect().top + scrollY);
    end = tops[4] + chapters[4].offsetHeight;
    position = NaN;
    update();
  };
  function update() {
    const point = scrollY + innerHeight * 0.2;
    let index = 0;
    for (let i = 1; i < tops.length; i++) if (point >= tops[i]) index = i;
    const distance =
      index < 4 ? tops[index + 1] - tops[index] : chapters[index].offsetHeight;
    target = Math.min(4.999, index + clamp((point - tops[index]) / distance));
    schedule();
  }
  function schedule() {
    if (!frame && visible && !document.hidden && !stopped)
      frame = requestAnimationFrame(tick);
  }
  function tick(now: number) {
    frame = 0;
    const dt = lastTime ? Math.min((now - lastTime) / 1000, 0.05) : 0;
    lastTime = now;
    if (position !== target) draw();
    const direction = target < 1 || (target >= 2 && target < 3) ? -1 : 1;
    // Integrate one uninterrupted phase; ease velocity through zero on a reversal.
    velocity += (direction * 0.65 - velocity) * (1 - Math.exp(-dt * 2.8));
    phase += velocity * dt;
    waveTime += dt;
    thread.setAttribute("d", travellingWave(phase, waveTime, target));
    thread.dataset.phase = phase.toFixed(4);
    thread.dataset.velocity = velocity.toFixed(4);
    schedule();
  }
  function draw() {
    // Native scrolling is already the clock. A second easing loop makes every handoff lag.
    position = target;
    const p = position,
      chapter = Math.min(4, Math.floor(p)),
      t = p - chapter;
    root.dataset.tone = chapter === 1 || chapter === 3 ? "paper" : "night";
    root.dataset.active = String(chapter);
    // Spatial interpolation belongs to the shared stage; each study has its own composition.
    const left = [0, 0, 40, 0, 18],
      width = [100, 60, 60, 60, 82];
    const spatial = smooth(0.65, 1, t),
      next = Math.min(4, chapter + 1);
    if (!narrow.matches) {
      stageArt.style.setProperty(
        "--ds-art-left",
        `${left[chapter] + (left[next] - left[chapter]) * spatial}%`,
      );
      stageArt.style.setProperty(
        "--ds-art-width",
        `${width[chapter] + (width[next] - width[chapter]) * spatial}%`,
      );
    }
    // One chapter envelope owns copy and protagonist entry/exit initiation.
    // The outgoing visual may finish its physical handoff after its copy has left.
    const timeline = chapters.map((_, i) => ({
      enter: i === 0 ? 1 : smooth(i - 0.25, i + 0.02, p),
      exit: i === 4 ? 0 : smooth(i + 0.65, i + 0.85, p),
    }));
    art.forEach((el, i) => {
      const { enter, exit } = timeline[i];
      const visible = i >= 3 ? 1 : i === 2 ? 1 - smooth(3.06, 3.2, p) : 1 - smooth(i + 0.65, i + 1, p);
      opacity(el, enter * visible);
      el.setAttribute("transform", `translate(0 ${(1 - enter) * 24 - exit * 20})`);
    });
    // Copy uses that same envelope, including the 75–85% overlap with the next chapter.
    const stageShift = Math.max(0, tops[0] - scrollY) + Math.min(0, end - scrollY - innerHeight);
    // Release the whole scene with its copy; no extra final pin over the footer.
    stage.style.transform = `translateY(${Math.min(0, end - scrollY - innerHeight)}px)`;
    copies.forEach((copy, i) => {
      const { enter, exit } = timeline[i];
      const leave = 1 - exit;
      const shown = enter * leave > 0.01 && scrollY < end && scrollY + innerHeight > tops[0];
      copy.style.opacity = String(enter * leave);
      // The original page H1 remains semantic after its visual hero exits. Keep
      // its parent out of hidden/inert; retire only the other hero content.
      copy.style.visibility = i === 0 || shown ? "visible" : "hidden";
      copy.style.transform = `translateY(${stageShift + (1 - enter) * 20 - (1 - leave) * 20}px)`;
      // Phone copy shares one column. Complementary clips prevent double-printed text
      // during the overlap, without delaying the next chapter's entry envelope.
      const reveal = i === 0 ? 1 : smooth(i - 0.25, i - 0.15, p);
      const cover = i === 4 ? 0 : smooth(i + 0.75, i + 0.85, p);
      copy.style.clipPath = narrow.matches
        ? `inset(0 ${cover * 100}% 0 ${(1 - reveal) * 100}%)`
        : "none";
      copy.inert = i !== 0 && !shown;
      if (i === 0) [...copy.children].forEach(child => {
        if (child instanceof HTMLElement && child.tagName !== "H1") child.inert = !shown;
      });
    });
    // The actual building outline stays opaque and becomes the final mark's six bars.
    // Only secondary CAD information recedes; there is no separate live final logo.
    const convergence = smooth(3.76, 4.28, p);
    const travel = smooth(3.65, 4.3, p);
    technical.setAttribute("transform", `translate(${(narrow.matches ? -48 : 112) * travel} ${-53 * travel}) scale(${1 + 0.1 * travel})`);
    opacity(technical, timeline[3].enter);
    opacity(buildingDetail, 1 - smooth(3.65, 3.87, p));
    buildingEdges.forEach((el, i) => {
      el.setAttribute("d", curvePath(interpolate(buildingCurves[i], markCurves[i], convergence)));
      el.setAttribute("stroke-width", String(2 + 36 * convergence));
    });
    buildingNodes.forEach((el, i) => {
      const point = interpolate(buildingNodeStarts[i], nodeTargets[i], convergence);
      el.setAttribute("cx", String(point[0]));
      el.setAttribute("cy", String(point[1]));
      el.setAttribute("r", String(37.5 * smooth(4.08, 4.28, p)));
    });
    svg.style.setProperty("--ds-building-material", `${100 * smooth(3.8, 4.22, p)}%`);
    opacity(shine, smooth(4.28, 4.32, p));
    shineGradient.setAttribute("gradientTransform", `translate(${200 + 620 * smooth(4.3, 4.7, p)} 0)`);
    opacity(grid, 1 - smooth(3.65, 4.2, p));
    opacity(controls, 1 - smooth(0.16, 0.82, p));
    opacity(form, 1 - smooth(0.55, 0.95, p));
    opacity(handles, 1 - smooth(0.38, 0.9, p));
    // No dead hero interval: the node unfolds and the signal moves from the first scroll.
    node.setAttribute(
      "transform",
      `translate(0 ${-24 * smooth(0, 0.65, p)}) rotate(${-8 * smooth(0, 0.7, p)} 490 410)`,
    );
    // Exact font outlines deform in place; their internal sections become mark bars.
    const gProgress = smooth(1.12, 1.65, p);
    const sProgress = smooth(1.18, 1.7, p);
    svg.style.setProperty("--ds-brand-material", `${100 * smooth(1.38, 1.7, p)}%`);
    letterG.setAttribute("d", gOutlines.map(shape => letterOutline(shape, gProgress)).join(" "));
    letterS.setAttribute("d", sOutlines.map(shape => letterOutline(shape, sProgress)).join(" "));
    brandNodes.forEach((el, i) => {
      const point = interpolate(nodeStarts[i], nodeTargets[i], sProgress);
      el.setAttribute("cx", String(point[0]));
      el.setAttribute("cy", String(point[1]));
      el.setAttribute("r", String(37.5 * smooth(1.42, 1.7, p)));
    });
    opacity(construction, smooth(0.94, 1.1, p) * (1 - smooth(1.55, 1.72, p)));
    opacity(sketch, 0.4 * (1 - smooth(2.5, 2.7, p)));
    opacity(character, 1 - smooth(2.65, 2.85, p));
    opacity(rig, smooth(2.43, 2.61, p));
    // Hold recognisable facial proportions first, then carry those very joints into the CAD grid.
    const handoff = smooth(2.74, 3.08, p);
    const joint = facePoints.map((point, i) => interpolate(point, architecturalPoints[i], handoff));
    joints.forEach((el, i) => {
      el.setAttribute("cx", String(joint[i][0]));
      el.setAttribute("cy", String(joint[i][1]));
    });
    rigPath.setAttribute("d", wirePath(joint));
    const assembled = smooth(2.92, 3.2, p);
    roof.setAttribute("transform", `translate(0 ${-65 * (1 - assembled)})`);
    floors.forEach((el, i) =>
      el.setAttribute("transform", `translate(0 ${-i * 22 * (1 - assembled)})`),
    );
    opacity(columns, 0.65);
    opacity(dimensions, smooth(3.2, 3.3, p));
    opacity(
      electrical,
      smooth(3.32, 3.4, p) * (1 - 0.35 * smooth(3.5, 3.57, p)),
    );
    opacity(water, smooth(3.52, 3.62, p));
    opacity(roof, 1 - 0.8 * smooth(3.23, 3.35, p));
    thread.style.strokeOpacity = String(1 - 0.65 * smooth(3.9, 4.5, p));
    stage.dataset.progress = p.toFixed(3);
  }
  const visibility = () => {
    if (document.hidden) {
      cancelAnimationFrame(frame);
      frame = 0;
      lastTime = 0;
    } else update();
  };
  const observer = new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
      if (visible) update();
      else {
        cancelAnimationFrame(frame);
        frame = 0;
        lastTime = 0;
      }
    },
    { rootMargin: "100px" },
  );
  observer.observe(root);
  const resize = new ResizeObserver(measure);
  chapters.forEach((el) => resize.observe(el));
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", measure, { passive: true });
  document.addEventListener("visibilitychange", visibility);
  measure();
  cancelAnimationFrame(frame);
  frame = 0;
  draw();
  schedule();
  root.dataset.enhanced = "true";
  return () => {
    stopped = true;
    cancelAnimationFrame(frame);
    observer.disconnect();
    resize.disconnect();
    window.removeEventListener("scroll", update);
    window.removeEventListener("resize", measure);
    document.removeEventListener("visibilitychange", visibility);
    copies.forEach((copy) => {
      copy.style.removeProperty("opacity");
      copy.style.removeProperty("visibility");
      copy.style.removeProperty("transform");
      copy.style.removeProperty("clip-path");
      copy.inert = false;
      [...copy.children].forEach(child => {
        if (child instanceof HTMLElement) child.inert = false;
      });
    });
    delete root.dataset.enhanced;
    delete root.dataset.tone;
    delete root.dataset.active;
    stage.style.removeProperty("transform");
    stageArt.style.removeProperty("--ds-art-left");
    stageArt.style.removeProperty("--ds-art-width");
  };
}
