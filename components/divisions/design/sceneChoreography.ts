/** GS-R002: one demand-driven timeline, native scroll, no per-frame React work or WebGL. */
export function startDesignScene(root: HTMLElement): () => void {
  const stage = root.querySelector<HTMLElement>("[data-design-stage]")!;
  const svg = stage.querySelector<SVGSVGElement>("svg")!;
  const chapters = [...root.querySelectorAll<HTMLElement>("[data-chapter]")];
  const select = (s: string) => svg.querySelector<SVGElement>(s)!;
  const art = [...svg.querySelectorAll<SVGElement>("[data-art]")];
  const thread = select("[data-thread]");
  const grid = select("[data-grid]");
  const closeFragments = [
    ...svg.querySelectorAll<SVGElement>(
      '[data-art="convergence"] > :not(:first-child)',
    ),
  ];
  const controls = select("[data-workspace-controls]");
  const form = select("[data-workspace-form]");
  const handles = select("[data-handles]");
  const letters = select("[data-letters]");
  const letterG = select("[data-letter-g]");
  const letterS = select("[data-letter-s]");
  const construction = select("[data-construction]");
  const mark = select("[data-resolved-mark]");
  const sketch = select("[data-sketch]");
  const character = select("[data-finished-character]");
  const rig = select("[data-rig]");
  const rigPath = rig.querySelector("path")!;
  const joints = [...rig.querySelectorAll("circle")];
  const roof = select("[data-roof]");
  const floor = select("[data-floor]");
  const columns = select("[data-columns]");
  const dimensions = select("[data-dimensions]");
  const electrical = select("[data-electrical]");
  const water = select("[data-water]");
  const eyes = select("[data-eyes]");
  const head = select("[data-head]");
  const fine = matchMedia("(hover: hover) and (pointer: fine)");
  const narrow = matchMedia("(max-width: 760px)");
  const clamp = (n: number) => Math.max(0, Math.min(1, n));
  const smooth = (a: number, b: number, n: number) => {
    const t = clamp((n - a) / (b - a));
    return t * t * (3 - 2 * t);
  };
  const opacity = (el: SVGElement, n: number) => {
    el.style.opacity = String(clamp(n));
  };
  // Equal cubic topology makes the surviving line transform, rather than disappear at chapter cuts.
  const paths = [
    [
      130, 580, 200, 580, 170, 280, 340, 280, 510, 280, 430, 490, 600, 490, 770,
      490, 735, 210, 870, 210,
    ],
    [
      200, 566, 200, 450, 200, 214, 357, 214, 514, 214, 467, 566, 624, 566, 781,
      566, 781, 280, 781, 214,
    ],
    [
      220, 590, 330, 590, 350, 230, 490, 230, 630, 230, 635, 590, 760, 590, 840,
      590, 845, 350, 870, 310,
    ],
    [
      211, 585, 300, 630, 400, 690, 491, 738, 590, 690, 700, 635, 792, 585, 792,
      480, 792, 390, 792, 303,
    ],
    [
      210, 560, 190, 370, 240, 230, 400, 225, 550, 220, 700, 305, 785, 430, 875,
      565, 710, 665, 555, 635,
    ],
  ];
  let frame = 0,
    target = 0,
    position = 0,
    x = 0,
    y = 0,
    px = 0,
    py = 0,
    visible = true,
    stopped = false;
  let tops: number[] = [];
  const measure = () => {
    tops = chapters.map((el) => el.getBoundingClientRect().top + scrollY);
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
      frame = requestAnimationFrame(draw);
  }
  function draw() {
    frame = 0;
    position += (target - position) * 0.16;
    px += (x - px) * 0.16;
    py += (y - py) * 0.16;
    const p = position;
    const chapter = Math.min(4, Math.floor(p));
    const t = p - chapter;
    root.dataset.tone = chapter === 1 || chapter === 3 ? "paper" : "night";
    root.dataset.active = String(chapter);
    art.forEach((el, i) => {
      // A narrow handoff window leaves one dominant subject for most of each chapter.
      const enter = i === 0 ? 1 : smooth(i - 0.16, i + 0.08, p);
      const leave = i === 4 ? 1 : 1 - smooth(i + 0.78, i + 1.08, p);
      opacity(el, enter * leave);
      el.setAttribute(
        "transform",
        `translate(0 ${(1 - enter) * 35 - (1 - leave) * 30})`,
      );
    });
    opacity(controls, 1 - smooth(0.35, 0.84, p));
    opacity(form, 1 - smooth(0.3, 0.72, p));
    opacity(handles, 1 - smooth(0.55, 1, p));
    opacity(letters, 1 - smooth(1.48, 1.7, p));
    // Reinterpret curved letterforms as the mark's two offset, three-sided frames.
    const geometry = smooth(1.15, 1.47, p);
    const morph = (a: number[], b: number[]) =>
      a.map((v, i) => v + (b[i] - v) * geometry);
    const g = morph(
      [
        437, 263, 306, 170, 226, 263, 226, 389, 226, 515, 332, 566, 429, 496,
        429, 450, 429, 389, 347, 389,
      ],
      [
        538, 336, 475, 336, 410, 336, 347, 336, 347, 397, 347, 458, 347, 518,
        410, 518, 475, 518, 538, 518,
      ],
    );
    const s = morph(
      [700, 257, 547, 189, 508, 340, 609, 366, 710, 392, 741, 507, 578, 515],
      [447, 437, 510, 437, 640, 437, 640, 437, 640, 617, 640, 617, 447, 617],
    );
    letterG.setAttribute(
      "d",
      `M${g.slice(0, 2)} C${g.slice(2, 8)} C${g.slice(8, 14)} C${g.slice(14)}`,
    );
    letterS.setAttribute(
      "d",
      `M${s.slice(0, 2)} C${s.slice(2, 8)} C${s.slice(8)}`,
    );
    opacity(construction, smooth(0.85, 1.12, p) * (1 - smooth(1.63, 1.94, p)));
    opacity(mark, smooth(1.48, 1.72, p));
    mark.setAttribute(
      "transform",
      `translate(${smooth(1.72, 2.12, p) * 12} ${-smooth(1.72, 2.12, p) * 36})`,
    );
    opacity(sketch, 1 - smooth(2.15, 2.3, p));
    opacity(character, smooth(2.16, 2.28, p) * (1 - smooth(2.75, 3.08, p)));
    character.dataset.material =
      p < 2.3 ? "line" : p < 2.42 ? "flat" : "shaded";
    opacity(rig, smooth(2.64, 2.9, p));
    const handoff = smooth(2.86, 3.08, p);
    const rigPoints = [
      [490, 288],
      [490, 423],
      [490, 480],
      [418, 451],
      [566, 451],
      [439, 591],
      [546, 591],
      [422, 640],
      [566, 640],
      [367, 535],
      [625, 522],
    ];
    const buildingPoints = [
      [514, 215],
      [514, 440],
      [488, 425],
      [280, 318],
      [718, 316],
      [488, 654],
      [718, 542],
      [491, 682],
      [761, 543],
      [280, 541],
      [761, 543],
    ];
    const joint = rigPoints.map(([a, b], i) => [
      a + (buildingPoints[i][0] - a) * handoff,
      b + (buildingPoints[i][1] - b) * handoff,
    ]);
    joints.forEach((el, i) => {
      el.setAttribute("cx", String(joint[i][0]));
      el.setAttribute("cy", String(joint[i][1]));
    });
    rigPath.setAttribute(
      "d",
      `M${joint[0]} L${joint[1]} L${joint[2]} L${joint[5]} L${joint[7]} M${joint[2]} L${joint[6]} L${joint[8]} M${joint[9]} L${joint[3]} L${joint[1]} L${joint[4]} L${joint[10]}`,
    );
    character.setAttribute(
      "transform",
      `translate(0 ${Math.sin(t * Math.PI) * -10})`,
    );
    const assembled = smooth(3.02, 3.2, p);
    roof.setAttribute("transform", `translate(0 ${-95 * (1 - assembled)})`);
    floor.setAttribute("transform", `translate(0 ${-40 * (1 - assembled)})`);
    opacity(columns, 0.65);
    opacity(dimensions, smooth(3.2, 3.3, p));
    opacity(
      electrical,
      smooth(3.32, 3.4, p) * (1 - 0.73 * smooth(3.5, 3.57, p)),
    );
    opacity(water, smooth(3.52, 3.62, p));
    opacity(roof, 1 - 0.74 * smooth(3.23, 3.35, p));
    const a = paths[chapter],
      b = paths[Math.min(4, chapter + 1)],
      blend = smooth(0.65, 1, t);
    const pts = a.map((v, i) => v + (b[i] - v) * blend);
    thread.setAttribute(
      "d",
      `M${pts[0]} ${pts[1]} C${pts.slice(2, 8).join(" ")} C${pts.slice(8, 14).join(" ")} C${pts.slice(14).join(" ")}`,
    );
    const active = p > 2.35 && p < 2.78;
    eyes.setAttribute(
      "transform",
      `translate(${active ? px * 7 : 0} ${active ? py * 4 : 0})`,
    );
    head.setAttribute("transform", `rotate(${active ? px * 2 : 0} 490 390)`);
    // The closing canvas resolves to the parent mark; blue construction recedes.
    const resolution = 1 - 0.88 * smooth(4.35, 4.72, p);
    closeFragments.forEach((el) => opacity(el, resolution));
    opacity(grid, resolution);
    thread.style.strokeOpacity = String(resolution);
    stage.dataset.progress = p.toFixed(3);
    if (
      Math.abs(target - position) > 0.001 ||
      Math.abs(x - px) > 0.001 ||
      Math.abs(y - py) > 0.001
    )
      schedule();
  }
  const pointer = (e: PointerEvent) => {
    if (!fine.matches || narrow.matches || position < 2.35 || position > 2.78)
      return;
    x = Math.max(-1, Math.min(1, (e.clientX / innerWidth - 0.5) * 2));
    y = Math.max(-1, Math.min(1, (e.clientY / innerHeight - 0.5) * 2));
    schedule();
  };
  const resetPointer = () => {
    x = 0;
    y = 0;
    schedule();
  };
  const visibility = () => {
    if (document.hidden) {
      cancelAnimationFrame(frame);
      frame = 0;
    } else update();
  };
  const observer = new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
      if (visible) update();
      else {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    },
    { rootMargin: "100px" },
  );
  observer.observe(root);
  const resize = new ResizeObserver(measure);
  chapters.forEach((el) => resize.observe(el));
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", measure, { passive: true });
  root.addEventListener("pointermove", pointer, { passive: true });
  root.addEventListener("pointerleave", resetPointer);
  document.addEventListener("visibilitychange", visibility);
  measure();
  position = target;
  cancelAnimationFrame(frame);
  draw();
  root.dataset.enhanced = "true";
  return () => {
    stopped = true;
    cancelAnimationFrame(frame);
    observer.disconnect();
    resize.disconnect();
    window.removeEventListener("scroll", update);
    window.removeEventListener("resize", measure);
    root.removeEventListener("pointermove", pointer);
    root.removeEventListener("pointerleave", resetPointer);
    document.removeEventListener("visibilitychange", visibility);
    delete root.dataset.enhanced;
    delete root.dataset.tone;
    delete root.dataset.active;
  };
}
