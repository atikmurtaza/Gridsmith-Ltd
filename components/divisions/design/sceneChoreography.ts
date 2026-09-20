/** R1: one native-scroll timeline and a small damped character rig; no per-frame React work. */
export function startDesignScene(root: HTMLElement): () => void {
  const stage = root.querySelector<HTMLElement>("[data-design-stage]")!;
  const stageArt = stage.querySelector<HTMLElement>(".ds-stage-art")!;
  const svg = stage.querySelector<SVGSVGElement>("svg")!;
  const chapters = [...root.querySelectorAll<HTMLElement>("[data-chapter]")];
  const select = (s: string) => svg.querySelector<SVGElement>(s)!;
  const art = [...svg.querySelectorAll<SVGElement>("[data-art]")];
  const thread = select("[data-thread]");
  const controls = select("[data-workspace-controls]");
  const form = select("[data-workspace-form]");
  const node = select("[data-design-node]");
  const handles = select("[data-handles]");
  const letters = select("[data-letters]");
  const letterG = select("[data-letter-g]");
  const letterS = select("[data-letter-s]");
  const construction = select("[data-construction]");
  const gGeometry = select("[data-g-geometry]");
  const sGeometry = select("[data-s-geometry]");
  const mark = select("[data-resolved-mark]");
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
  const eyes = select("[data-eyes]");
  const head = select("[data-head]");
  const hair = select("[data-hair]");
  const body = select("[data-character-body]");
  const closeFragments = [
    ...svg.querySelectorAll<SVGElement>(
      '[data-art="convergence"] > :not(:first-child)',
    ),
  ];
  const narrow = matchMedia("(max-width: 760px)");
  const clamp = (n: number) => Math.max(0, Math.min(1, n));
  const smooth = (a: number, b: number, n: number) => {
    const t = clamp((n - a) / (b - a));
    return t * t * (3 - 2 * t);
  };
  const opacity = (el: SVGElement, n: number) => {
    el.style.opacity = String(clamp(n));
  };
  // Same three-cubic signal from hero through resolution. Endpoints guide each handoff.
  const paths = [
    [
      100, 510, 210, 510, 225, 265, 355, 330, 485, 395, 505, 580, 650, 505, 795,
      430, 755, 265, 905, 265,
    ],
    [
      75, 440, 190, 440, 180, 255, 335, 255, 490, 255, 495, 625, 665, 580, 835,
      535, 815, 320, 945, 320,
    ],
    [
      70, 500, 220, 500, 225, 190, 400, 200, 575, 210, 600, 680, 760, 620, 920,
      560, 815, 300, 930, 300,
    ],
    [
      75, 500, 170, 500, 180, 175, 310, 180, 440, 185, 490, 720, 660, 650, 830,
      580, 805, 360, 945, 360,
    ],
    [
      85, 510, 210, 510, 225, 290, 355, 355, 485, 420, 535, 625, 685, 535, 835,
      445, 775, 285, 930, 285,
    ],
  ];
  let frame = 0,
    target = 0,
    position = 0,
    x = 0,
    y = 0,
    px = 0,
    py = 0;
  let hairAngle = 0,
    hairVelocity = 0,
    lastTime = 0;
  let visible = true,
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
  function draw(time: number) {
    frame = 0;
    const dt = Math.min(
      2,
      Math.max(0.25, (time - (lastTime || time - 16.67)) / 16.67),
    );
    lastTime = time;
    const follow = 1 - Math.pow(0.84, dt);
    position += (target - position) * follow;
    px += (x - px) * follow;
    py += (y - py) * follow;
    const p = position,
      chapter = Math.min(4, Math.floor(p)),
      t = p - chapter;
    root.dataset.tone = chapter === 1 || chapter === 3 ? "paper" : "night";
    root.dataset.active = String(chapter);
    // Spatial interpolation belongs to the shared stage; each study has its own composition.
    const left = [0, 0, 40, 0, 18],
      width = [100, 60, 60, 60, 82];
    const spatial = smooth(0.68, 1, t),
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
    art.forEach((el, i) => {
      const enter = i === 0 ? 1 : smooth(i - 0.16, i + 0.08, p);
      const leave = i === 4 ? 1 : 1 - smooth(i + 0.82, i + 1.08, p);
      opacity(el, enter * leave);
      el.setAttribute(
        "transform",
        `translate(0 ${(1 - enter) * 24 - (1 - leave) * 20})`,
      );
    });
    opacity(controls, 1 - smooth(0.16, 0.82, p));
    opacity(form, 1 - smooth(0.55, 0.95, p));
    opacity(handles, 1 - smooth(0.38, 0.9, p));
    // No dead hero interval: the node unfolds and the signal moves from the first scroll.
    node.setAttribute(
      "transform",
      `translate(0 ${-24 * smooth(0, 0.65, p)}) rotate(${-8 * smooth(0, 0.7, p)} 490 410)`,
    );
    opacity(letters, 1 - smooth(1.32, 1.67, p));
    const geometric = smooth(1.15, 1.5, p);
    letterG.setAttribute(
      "transform",
      `translate(${-12 * geometric} ${-8 * geometric})`,
    );
    letterS.setAttribute(
      "transform",
      `translate(${8 * geometric} ${22 * geometric})`,
    );
    opacity(construction, smooth(0.94, 1.1, p) * (1 - smooth(1.64, 1.84, p)));
    gGeometry.style.strokeDashoffset = String(
      100 * (1 - smooth(1.17, 1.43, p)),
    );
    sGeometry.style.strokeDashoffset = String(
      100 * (1 - smooth(1.25, 1.56, p)),
    );
    opacity(mark, smooth(1.5, 1.73, p));
    opacity(sketch, 1 - smooth(2.15, 2.3, p));
    opacity(character, smooth(2.16, 2.28, p) * (1 - smooth(2.75, 3.08, p)));
    character.dataset.material =
      p < 2.3 ? "line" : p < 2.42 ? "flat" : "shaded";
    opacity(rig, smooth(2.64, 2.9, p));
    const rigPoints = [
      [500, 290],
      [500, 430],
      [500, 530],
      [390, 510],
      [612, 510],
      [355, 660],
      [648, 660],
    ];
    const buildingPoints = [
      [495, 150],
      [495, 335],
      [504, 525],
      [292, 246],
      [709, 249],
      [292, 619],
      [709, 626],
    ];
    const handoff = smooth(2.84, 3.1, p);
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
      `M${joint[0]} L${joint[1]} L${joint[2]} M${joint[5]} L${joint[3]} L${joint[1]} L${joint[4]} L${joint[6]}`,
    );
    const assembled = smooth(3.02, 3.2, p);
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
    const blend = smooth(chapter === 0 ? 0 : 0.6, 1, t);
    const pts = paths[chapter].map((v, i) => v + (paths[next][i] - v) * blend);
    thread.setAttribute(
      "d",
      `M${pts[0]} ${pts[1]} C${pts.slice(2, 8).join(" ")} C${pts.slice(8, 14).join(" ")} C${pts.slice(14).join(" ")}`,
    );
    const active = p > 2.35 && p < 2.78 && !narrow.matches;
    const hx = active ? px : 0,
      hy = active ? py : 0;
    // A bounded spring on the local quiff joint trails the damped head, then settles.
    const hairTarget = hx * 3.2;
    hairVelocity =
      (hairVelocity + (hairTarget - hairAngle) * 0.085 * dt) *
      Math.pow(0.72, dt);
    hairAngle = Math.max(-5, Math.min(5, hairAngle + hairVelocity * dt));
    eyes.setAttribute("transform", `translate(${hx * 5} ${hy * 2})`);
    head.setAttribute(
      "transform",
      `translate(${hx * 4} ${hy * 2}) rotate(${hx * 3.2} 500 460)`,
    );
    hair.setAttribute("transform", `rotate(${hairAngle} 500 185)`);
    body.setAttribute("transform", `rotate(${-hx * 0.7} 500 670)`);
    const resolution = smooth(4.35, 4.72, p);
    closeFragments.forEach((el) => opacity(el, 1 - 0.3 * resolution));
    thread.style.strokeOpacity = String(1 - 0.65 * smooth(3.9, 4.5, p));
    stage.dataset.progress = p.toFixed(3);
    if (
      Math.abs(target - position) > 0.001 ||
      Math.abs(x - px) > 0.001 ||
      Math.abs(y - py) > 0.001 ||
      Math.abs(hairTarget - hairAngle) > 0.002 ||
      Math.abs(hairVelocity) > 0.002
    )
      schedule();
  }
  const pointer = (e: PointerEvent) => {
    if (
      e.pointerType !== "mouse" ||
      narrow.matches ||
      position < 2.35 ||
      position > 2.78
    )
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
  root.addEventListener("pointermove", pointer, { passive: true });
  root.addEventListener("pointerleave", resetPointer);
  document.addEventListener("visibilitychange", visibility);
  measure();
  position = target;
  cancelAnimationFrame(frame);
  draw(performance.now());
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
    stageArt.style.removeProperty("--ds-art-left");
    stageArt.style.removeProperty("--ds-art-width");
  };
}
