import { buildingCurves, buildingNodeStarts, curvePath, letterOutline, markCurves, markNodes, mascotCurves, mascotNodes, interpolate, facePoints, architecturalPoints, wirePath, travellingWave } from "./transitionGeometry";
import { gOutlines, sOutlines } from "./letterGeometry";
import { BRAND, FINAL, HANDOFF, MORPH, MOTION, TECHNICAL, handoffVisibility, smooth as within } from "./designTimeline";

/**
 * GS-DES-002-R1: the page scrolls the copy; the scene follows the page. Copy is sticky in normal
 * flow (design.css), so this module never moves, fades or hides it. It measures where each
 * chapter's copy settles and where it starts to leave, maps scroll onto those positions
 * (designTimeline: `p = i` settled, `i + HANDOFF` leaving, `i + 1` the next settled) and draws the
 * scene at that progress. The supplied mascot animates itself.
 */
export function startDesignScene(root: HTMLElement): () => void {
  const stage = root.querySelector<HTMLElement>("[data-design-stage]")!;
  const stageArt = stage.querySelector<HTMLElement>(".ds-stage-art")!;
  const svg = stage.querySelector<SVGSVGElement>("svg")!;
  const chapters = [...root.querySelectorAll<HTMLElement>("[data-chapter]")];
  const copies = chapters.map((el) => el.querySelector<HTMLElement>(".ds-copy")!);
  const papers = chapters.filter((el) => el.hasAttribute("data-paper"));
  const label = stage.querySelector<HTMLElement>(".ds-stage-label")!;
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
  const nodeTargets = markNodes;
  const nodeStarts = [[382, 221], [452, 232], [371, 320], [455, 310], [576, 297], [651, 321], [508, 515], [655, 482]];
  const buildingDetail = select("[data-building-detail]");
  const buildingEdges = [...svg.querySelectorAll<SVGPathElement>("[data-building-edge]")];
  const buildingNodes = [...svg.querySelectorAll<SVGCircleElement>("[data-building-node]")];
  // The supplied 3D logo, over the exact procedural mark in each payoff (DesignArtwork).
  const [brandAsset, finalAsset] = [...svg.querySelectorAll<SVGElement>("[data-mark-3d]")];
  const morph = select("[data-morph]");
  const morphEdges = [...svg.querySelectorAll<SVGPathElement>("[data-morph-edge]")];
  const morphNodes = [...svg.querySelectorAll<SVGCircleElement>("[data-morph-node]")];
  // The footer's own decorative mark is hidden on /design (chrome.module.css) but keeps its slot.
  const footerSlot = document.querySelector<HTMLElement>("body > footer [class*='footerMark']");
  const footer = footerSlot?.closest("footer");
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
  // Where the footer's slot sits beside its copy (the desktop and tablet grids) the mark glides into
  // it. On a phone the slot is below the social row, past every line of footer copy: there the mark
  // stays in the final chapter's page space and leaves with it, above the footer's first line.
  const docking = matchMedia("(min-width: 768px)");
  /**
   * The final mark's one trajectory into the footer, as an SVG-unit offset and scale. The stage stays
   * pinned through the footer (the story's ::after), so the settled mark does not move until the
   * footer enters; from then to the page's end it is one interpolation between two fixed screen
   * points — the settled mark and the slot where it will be at the end of the page — so its path is a
   * straight line, monotonic in every coordinate and in scale. (R1 chased the slot as it rose: the
   * mark went down towards it and then up with it, and the released stage lifted it a frame before
   * script put it back.) The mark's box is its eight spheres, radius included: centre (493.75, 476.5),
   * 367.5 wide; the group scales about the SVG origin, so the offset is solved for the scaled centre.
   */
  const footerDock = (tx: number, ty: number, scale: number) => {
    const ctm = svg.getScreenCTM();
    if (!footerSlot || !footer || !ctm || !docking.matches) return [0, 0, 1];
    const slot = footerSlot.getBoundingClientRect();
    // Scroll still to come, and so where the footer and its slot will be when the page ends.
    const rest = document.documentElement.scrollHeight - innerHeight - scrollY;
    const top = footer.getBoundingClientRect().top;
    const f = within([innerHeight, top - rest], top);
    const k = 1 + (slot.width / (ctm.a * 367.5 * scale) - 1) * f;
    const x = ctm.e + ctm.a * (tx + 493.75 * scale);
    const y = ctm.f + ctm.d * (ty + 476.5 * scale);
    return [
      (x + (slot.left + slot.width / 2 - x) * f - ctm.e) / ctm.a - tx - 493.75 * scale * k,
      (y + (slot.top + slot.height / 2 - rest - y) * f - ctm.f) / ctm.d - ty - 476.5 * scale * k,
      k,
    ];
  };
  const clamp = (n: number) => Math.max(0, Math.min(1, n));
  const opacity = (el: SVGElement, n: number) => {
    el.style.opacity = String(clamp(n));
  };
  let frame = 0,
    target = 0,
    position = NaN;
  let phase = 0, velocity = -0.65, waveTime = 0, lastTime = 0;
  let visible = true,
    stopped = false;
  // Per chapter: the scroll at which its copy settles, and at which it starts to leave.
  let marks: number[] = [];
  const sticks: number[] = [];
  let end = 0, wasPast = false;
  const measure = () => {
    marks = chapters.flatMap((el, i) => {
      const style = getComputedStyle(el), stick = (sticks[i] = parseFloat(getComputedStyle(copies[i]).top));
      const top = el.getBoundingClientRect().top + scrollY;
      return [
        top + parseFloat(style.paddingTop) - stick,
        top + el.offsetHeight - parseFloat(style.paddingBottom) - copies[i].offsetHeight - stick,
      ];
    });
    marks[0] = Math.min(0, marks[1]);
    root.style.setProperty("--ds-footer-h", `${docking.matches && footer ? footer.offsetHeight : 0}px`);
    end = chapters[4].getBoundingClientRect().bottom + scrollY;
    // Read by check:design:scene to place the page at a given progress.
    stage.dataset.map = marks.map(Math.round).join();
    position = NaN;
    update();
  };
  function update() {
    let p = 0;
    for (let i = 0; i < 5 && scrollY >= marks[2 * i]; i++) {
      const [settle, leave, next] = [marks[2 * i], marks[2 * i + 1], marks[2 * i + 2]];
      p = scrollY < leave
        ? i + HANDOFF * (scrollY - settle) / (leave - settle || 1)
        : i + HANDOFF + (next === undefined ? 0 : (1 - HANDOFF) * Math.min(1, (scrollY - leave) / (next - leave)));
    }
    target = Math.min(4.999, p);
    // Past the story's end progress stops, but the mark's glide into the footer keeps moving with the
    // scroll: redraw on the scroll itself, frame loop or not — and once more on the way back out, or
    // a return from the footer (End, then PageUp) leaves the mark docked over the final chapter.
    const past = scrollY + innerHeight > end;
    if (past || wasPast) draw();
    wasPast = past;
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
    // The label sits at the stage's foot, often over the next chapter's surface: it follows its own,
    // read every frame because the art eases its height and late layout moves the surfaces under it.
    const box = label.getBoundingClientRect(), foot = box.top + box.height / 2;
    const tone = papers.some((el) => { const r = el.getBoundingClientRect(); return r.top <= foot && r.bottom > foot; }) ? "1" : "0";
    if (stage.style.getPropertyValue("--ds-label-tone") !== tone) stage.style.setProperty("--ds-label-tone", tone);
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
    // The chapter whose copy holds the middle of the passing handoff.
    root.dataset.active = String(Math.min(4, Math.floor(p + 0.25)));
    // Each chapter paints its own surface, so the page changes tone as it scrolls; the scene's
    // drawing colours follow the share of paper behind its middle band rather than switching.
    let paper = 0;
    for (const el of papers) {
      const r = el.getBoundingClientRect();
      paper = Math.max(paper, clamp((Math.min(r.bottom, innerHeight * 0.7) - Math.max(r.top, innerHeight * 0.3)) / (innerHeight * 0.4)));
    }
    stage.style.setProperty("--ds-tone", String(paper));
    // Copy passing over the scene takes the foreground: the scene recedes behind copy in transit —
    // never behind copy that has settled — and the transformation carries on underneath. On a phone
    // copy and scene share one column; on a wide screen the scene changes sides as the copy passes.
    const box = stageArt.getBoundingClientRect();
    let cover = 0;
    copies.forEach((copy, i) => {
      const r = copy.getBoundingClientRect();
      if (Math.abs(r.top - sticks[i]) < 2) return;
      const w = Math.min(r.right, box.right) - Math.max(r.left, box.left), h = Math.min(r.bottom, box.bottom) - Math.max(r.top, box.top);
      if (w > 0 && h > 0) cover = Math.max(cover, (w * h) / (box.width * box.height));
    });
    stageArt.style.opacity = String(1 - 0.72 * clamp((cover - 0.08) / 0.3));
    // Spatial interpolation belongs to the shared stage; each study has its own composition.
    const left = [0, 0, 40, 0, 18],
      width = [100, 60, 60, 60, 82];
    const spatial = within([HANDOFF, 1], t),
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
    const handoff = handoffVisibility(p);
    opacity(art[0], 1 - within([HANDOFF, 0.95], p));
    // The mark stays exactly in place until the morph takes it over.
    opacity(art[1], handoff.mark);
    // The character group's parts carry their own timing; the group leaves as the plan dimensions.
    opacity(art[2], 1 - within(TECHNICAL.dimensions, p));
    // The actual building outline stays opaque and becomes the final mark's six bars.
    const convergence = within(FINAL.converge, p);
    const travel = within(FINAL.travel, p);
    const tx = (narrow.matches ? -48 : 112) * travel, ty = -53 * travel, scale = 1 + 0.1 * travel;
    const [dx, dy, dk] = footerDock(tx, ty, scale);
    technical.setAttribute("transform", `translate(${tx + dx} ${ty + dy}) scale(${scale * dk})`);
    opacity(technical, within(TECHNICAL.enter, p));
    // Technical copy is read over the building: its detail recedes to 0.2 and returns (designTimeline).
    const over = within(TECHNICAL.copyOver, p) * (1 - within(TECHNICAL.copyClear, p));
    opacity(buildingDetail, (1 - within(FINAL.detailOut, p)) * (1 - 0.8 * over));
    buildingEdges.forEach((el, i) => {
      el.setAttribute("d", curvePath(interpolate(buildingCurves[i], markCurves[i], convergence)));
      el.setAttribute("stroke-width", String(2 + 36 * convergence));
    });
    buildingNodes.forEach((el, i) => {
      const point = interpolate(buildingNodeStarts[i], nodeTargets[i], convergence);
      el.setAttribute("cx", String(point[0]));
      el.setAttribute("cy", String(point[1]));
      el.setAttribute("r", String(37.5 * within(FINAL.nodes, p)));
    });
    svg.style.setProperty("--ds-building-material", `${100 * convergence}%`);
    // The exact geometry gains its real material: the supplied 3D logo, aligned over it.
    opacity(finalAsset, within(FINAL.asset, p));
    opacity(grid, 1 - within(FINAL.travel, p));
    opacity(controls, 1 - within([0.16, 0.82], p));
    opacity(form, 1 - within([0.55, 0.95], p));
    opacity(handles, 1 - within([0.38, 0.9], p));
    // No dead hero interval: the node unfolds and the signal moves from the first scroll.
    node.setAttribute(
      "transform",
      `translate(0 ${-24 * within([0, 0.65], p)}) rotate(${-8 * within([0, 0.7], p)} 490 410)`,
    );
    // Exact font outlines deform in place as the Brand copy arrives; their internal sections
    // become the mark's bars, and the supplied 3D logo resolves over the exact result.
    const gProgress = within(BRAND.g, p);
    const sProgress = within(BRAND.s, p);
    svg.style.setProperty("--ds-brand-material", `${100 * within(BRAND.baseGold, p)}%`);
    opacity(brandAsset, handoff.asset);
    letterG.setAttribute("d", gOutlines.map(shape => letterOutline(shape, gProgress)).join(" "));
    letterS.setAttribute("d", sOutlines.map(shape => letterOutline(shape, sProgress)).join(" "));
    brandNodes.forEach((el, i) => {
      const point = interpolate(nodeStarts[i], nodeTargets[i], sProgress);
      el.setAttribute("cx", String(point[0]));
      el.setAttribute("cy", String(point[1]));
      el.setAttribute("r", String(37.5 * within(BRAND.nodes, p)));
    });
    opacity(construction, within(BRAND.guides, p) * (1 - within(BRAND.baseGold, p)));
    // Brand → Motion, as the copy passes: the 3D logo dissolves onto the same geometry as bars and
    // spheres, which thin to strokes and nodes and draw the mascot's construction outline; the
    // illustration resolves on that outline.
    opacity(morph, handoff.morph);
    const thin = within(MORPH.shrink, p), arrange = within(MORPH.arrange, p);
    morphEdges.forEach((el, i) => {
      el.setAttribute("d", curvePath(interpolate(markCurves[i], mascotCurves[i], arrange)));
      el.setAttribute("stroke-width", String(38 - 35 * thin));
    });
    morphNodes.forEach((el, i) => {
      const point = interpolate(nodeTargets[i], mascotNodes[i], arrange);
      el.setAttribute("cx", String(point[0]));
      el.setAttribute("cy", String(point[1]));
      el.setAttribute("r", String(37.5 - 32.5 * thin));
    });
    opacity(sketch, 0.4 * within(MORPH.arrange, p) * (1 - within(MOTION.rig, p)));
    opacity(character, handoff.mascot);
    opacity(rig, within(MOTION.rig, p));
    // Hold recognisable facial proportions first, then carry those very joints into the CAD grid.
    const faceToPlan = within(MOTION.faceToPlan, p);
    const joint = facePoints.map((point, i) => interpolate(point, architecturalPoints[i], faceToPlan));
    joints.forEach((el, i) => {
      el.setAttribute("cx", String(joint[i][0]));
      el.setAttribute("cy", String(joint[i][1]));
    });
    rigPath.setAttribute("d", wirePath(joint));
    const assembled = within(TECHNICAL.assemble, p);
    roof.setAttribute("transform", `translate(0 ${-65 * (1 - assembled)})`);
    floors.forEach((el, i) =>
      el.setAttribute("transform", `translate(0 ${-i * 22 * (1 - assembled)})`),
    );
    opacity(columns, 0.65);
    opacity(dimensions, within(TECHNICAL.dimensions, p));
    opacity(electrical, within(TECHNICAL.electrical, p) * (1 - 0.35 * within(TECHNICAL.electricalDim, p)));
    opacity(water, within(TECHNICAL.water, p));
    opacity(roof, 1 - 0.8 * within(TECHNICAL.roofGhost, p));
    // Pinned through the footer, the wave and the label leave as the story does (they used to ride
    // away with the released stage).
    const exit = docking.matches ? within([innerHeight, innerHeight * 0.75], chapters[4].getBoundingClientRect().bottom) : 0;
    thread.style.strokeOpacity = String((1 - 0.65 * within([3.7, 4.3], p)) * (1 - exit));
    // GS-DES-002-RC: text is never held part-faded by the scroll. The caption shows only while the art
    // is whole and the story is not leaving; otherwise it hides on a short transition (design.css).
    label.style.opacity = cover > 0.08 || exit > 0 ? "0" : "1";
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
  root.dataset.enhanced = "true";
  measure();
  cancelAnimationFrame(frame);
  frame = 0;
  draw();
  schedule();
  return () => {
    stopped = true;
    cancelAnimationFrame(frame);
    observer.disconnect();
    resize.disconnect();
    window.removeEventListener("scroll", update);
    window.removeEventListener("resize", measure);
    document.removeEventListener("visibilitychange", visibility);
    delete root.dataset.enhanced;
    delete root.dataset.active;
    stage.style.removeProperty("--ds-tone");
    stage.style.removeProperty("--ds-label-tone");
    root.style.removeProperty("--ds-footer-h");
    label.style.removeProperty("opacity");
    stageArt.style.removeProperty("--ds-art-left");
    stageArt.style.removeProperty("--ds-art-width");
    stageArt.style.removeProperty("opacity");
  };
}
