import { buildingCurves, buildingNodeStarts, curvePath, outline, facePoints, markCurves, markNodes, wirePath } from "./transitionGeometry";
import { gOutlines, sOutlines } from "./letterGeometry";

/**
 * GS-DES-002-R1 — the owner's supplied 3D logo, the payoff of Brand and of the final chapter.
 * `public/brand/gridsmith-logo-3d.png` is 2400 × 2400 and its frame is exactly the vector logo's
 * own `viewBox 307.5 303 920 920` (measured: the spheres sit on the SVG geometry at 2.608 px a
 * unit on both axes). The procedural mark is that geometry at `translate(110 95) scale(.5)`, so the
 * asset aligns over it at x 263.75, y 246.5, 460 square — no fitting, no approximation.
 *
 * It was kept unused at 3.2MB (GS-R001-R). It is not shipped at that size: Next's image optimiser
 * serves it at 1080px (it is drawn at up to ~550 CSS px, so 2× density), from the same origin. An
 * SVG `<image>` has no `srcset`, so one URL, in the default loader's own form (1080 is one of the
 * default device sizes the optimiser accepts). Not `getImageProps`: importing next/image here put
 * its client module on the /design route, +5.3KB for a string. check:design:scene loads it.
 */
// Public build-target constant is folded by webpack; the canonical brand PNG stays unchanged.
const LOGO_3D = process.env.GRIDSMITH_BUILD_TARGET === 'static'
  ? "/brand/gridsmith-logo-3d-1080.webp"
  : "/_next/image?url=%2Fbrand%2Fgridsmith-logo-3d.png&w=1080&q=75";

function Logo3D({ live = false }: { live?: boolean }) {
  return (
    <image
      data-mark-3d=""
      href={LOGO_3D}
      x="263.75"
      y="246.5"
      width="460"
      height="460"
      opacity={live ? 0 : undefined}
    />
  );
}

/** The owner-supplied SVG stays an image: its own CSS drives the original animation. */
function Character({ animated = false }: { animated?: boolean }) {
  return (
    <image
      data-character=""
      href={animated
        ? "/brand/design/headshot-animated.svg"
        : "/brand/design/headshot-transparent.svg"}
      x="280"
      y="80"
      width="440"
      height="630"
      preserveAspectRatio="xMidYMid meet"
    />
  );
}

const levels = [620, 525, 430, 335];
function Building({ id }: { id: string }) {
  return (
    <g data-building="" className="ds-building">
      <g data-building-detail="">
      <g data-foundation="">
        <path d="m250 634 242-111 260 121-245 127Z" className="ds-slab" />
        <path d="M250 634v16l257 135 245-126v-15M507 771v14" />
      </g>
      <g data-columns="">
        <path
          d="M292 619V246M504 725V347M709 626V249M497 523V150"
          strokeWidth="7"
        />
        <path
          d="M360 654V280M432 690V313M574 690V314M642 657V282"
          strokeWidth="3"
        />
      </g>
      <g data-floor="">
        {levels.map((y, i) => (
          <g key={y} data-storey={i + 1}>
            <path
              d={`M280 ${y} 495 ${y - 101} 721 ${y + 8} 504 ${y + 118}Z`}
              className="ds-slab"
            />
            <path d={`M280 ${y}v9l224 118 217-110v-9M504 ${y + 118}v9`} />
            <g data-facade="" className="ds-facade">
              {[0, 1, 2].map((n) => (
                <path
                  key={n}
                  d={`M${302 + n * 68} ${y - 68 + n * 35}v47l45 23v-47Z M${526 + n * 61} ${y + 44 - n * 31}v45l40-20v-45Z`}
                />
              ))}
              <path
                d={`M452 ${y - 71}v57l43 22 44-22v-57M452 ${y - 14}l43-22 44 22M495 ${y - 36}v44`}
                className="ds-core"
              />
            </g>
          </g>
        ))}
      </g>
      <g data-roof="">
        <path d="m273 238 222-103 236 111-227 115Z" className="ds-roof" />
        <path d="M273 238v13l231 124 227-116v-13M504 361v14m-165-123 156-72 168 79-159 78Z" />
        <path d="M451 202v-32l43-20 47 22v33l-47 22Z" className="ds-core" />
      </g>
      <g data-dimensions="" className="ds-dimensions">
        <path d="M230 619V238m-12 0h27m-27 381h27m-16-387 12 12m-12 369 12 12M273 687l231 118 232-116M273 677v20m231 97v21m232-136v20" />
        {levels.map((y, i) => (
          <g key={y}>
            <path d={`M205 ${y}h75`} strokeDasharray="4 5" />
            <text x="166" y={y + 5}>{`0${i}`}</text>
          </g>
        ))}
        <text x="145" y="430" transform="rotate(-90 145 430)">
          FOUR STOREYS
        </text>
        <text x="332" y="752">
          SPAN A
        </text>
        <text x="618" y="753">
          SPAN B
        </text>
        <text x="725" y="490" transform="rotate(-90 725 490)">
          SERVICE CORE
        </text>
      </g>
      <g data-electrical="" className="ds-system">
        <path d="M266 660 322 632V285" />
        <rect x="251" y="645" width="25" height="32" />
        {levels.map((y) => (
          <g key={y}>
            <path
              d={`M322 ${y - 20} 418 ${y + 27} 483 ${y - 3} 606 ${y + 55}M418 ${y + 27}v28M483 ${y - 3}v-22`}
            />
            <circle cx="606" cy={y + 55} r="5" />
            <circle cx="418" cy={y + 55} r="5" />
          </g>
        ))}
        <text x="224" y="708">
          SUPPLY / RISER
        </text>
      </g>
      <g data-water="" className="ds-water">
        <path d="M745 685 675 650V288" />
        {levels.map((y) => (
          <g key={y}>
            <path
              d={`M675 ${y - 3} 618 ${y + 25} 551 ${y - 8}M618 ${y + 25}v22`}
            />
            <path d={`m544 ${y - 12} 14 8m53 40 14-7`} />
          </g>
        ))}
        <text x="730" y="706">
          WATER
        </text>
      </g>
      </g>
      <g stroke={`url(#${id}-building-metal)`} fill={`url(#${id}-orb)`}>
        <g id={`${id}-building-outline`} data-building-outline="">
          {buildingCurves.map((curve, i) => (
            <path key={i} data-building-edge="" d={curvePath(curve)} fill="none" strokeLinecap="butt" />
          ))}
          {buildingNodeStarts.map(([cx, cy], i) => (
            <circle key={i} data-building-node="" cx={cx} cy={cy} r="0" stroke="none" />
          ))}
        </g>
      </g>
      {/* The converged outline gains its real material: the supplied 3D logo, aligned over it. */}
      <Logo3D live />
    </g>
  );
}

function DesignNode({ id }: { id: string }) {
  return (
    <g data-design-node="">
      <path d="M355 330 490 250 625 330 490 410Z" fill={`url(#${id}-metal)`} />
      <path d="M355 330v154l135 79V410Z" fill={`url(#${id}-blue)`} />
      <path d="M490 410 625 330v154l-135 79Z" fill="var(--ds-navy)" />
      <path
        d="M355 330 490 250 625 330v154l-135 79-135-79V330l135 80 135-80M490 410v153"
        fill="none"
        stroke="var(--ds-gold)"
        strokeWidth="2"
      />
      <path
        d="M300 295 490 185 680 295M300 520 490 630 680 520M490 185v65M300 295l55 35M625 330l55-35M490 563v67"
        className="ds-guide"
      />
      {[
        [355, 330],
        [490, 250],
        [625, 330],
        [490, 410],
        [490, 563],
      ].map(([cx, cy]) => (
        <circle
          key={`${cx}-${cy}`}
          cx={cx}
          cy={cy}
          r="7"
          fill={`url(#${id}-orb)`}
        />
      ))}
    </g>
  );
}

export function DesignArtwork({
  id,
  chapter,
  live = false,
}: {
  id: string;
  chapter?: number;
  live?: boolean;
}) {
  const show = (n: number) => live || chapter === n;
  return (
    <svg
      viewBox="0 0 1000 800"
      aria-hidden="true"
      focusable="false"
      data-design-art=""
    >
      <defs>
        <linearGradient id={`${id}-metal`} x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="var(--ds-gold-deep)" />
          <stop offset=".22" stopColor="var(--ds-gold-hi)" />
          <stop offset=".48" stopColor="var(--ds-gold)" />
          <stop offset="1" stopColor="var(--ds-gold-deep)" />
        </linearGradient>
        <linearGradient id={`${id}-brand-metal`} x1="0" y1="0" x2="0" y2="1">
          {[
            ["0", "--ds-gold-deep"], [".22", "--ds-gold-hi"],
            [".48", "--ds-gold"], ["1", "--ds-gold-deep"],
          ].map(([offset, colour]) => (
            <stop key={offset} offset={offset} stopColor={`var(${colour.replace("--ds-", "--ds-brand-")})`} />
          ))}
        </linearGradient>
        <linearGradient id={`${id}-building-metal`} gradientUnits="userSpaceOnUse" x1="320" y1="315" x2="680" y2="645">
          {[
            ["0", "--ds-gold-deep"], [".24", "--ds-gold-hi"],
            [".42", "--ds-gold"], [".6", "--ds-gold-deep"], [".82", "--ds-gold"], ["1", "--ds-gold-deep"],
          ].map(([offset, colour]) => (
            <stop key={offset} offset={offset} stopColor={`var(${colour.replace("--ds-", "--ds-building-")})`} />
          ))}
        </linearGradient>
        <radialGradient id={`${id}-orb`} cx=".3" cy=".22" r=".8">
          <stop stopColor="var(--ds-gold-hi)" />
          <stop offset=".4" stopColor="var(--ds-gold)" />
          <stop offset="1" stopColor="var(--ds-gold-deep)" />
        </radialGradient>
        <linearGradient id={`${id}-blue`} x1="0" y1="0" x2="1" y2=".8">
          <stop stopColor="var(--ds-blue-hi)" />
          <stop offset=".3" stopColor="var(--ds-cobalt)" />
          <stop offset=".7" stopColor="var(--ds-navy)" />
          <stop offset="1" stopColor="var(--ds-night)" />
        </linearGradient>
        <pattern
          id={`${id}-grid`}
          width="50"
          height="50"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M50 0H0V50"
            fill="none"
            stroke="var(--ds-grid)"
            strokeWidth=".7"
          />
        </pattern>
      </defs>
      {(live || chapter !== 4) && <rect
        x="90"
        y="90"
        width="820"
        height="630"
        fill={`url(#${id}-grid)`}
        data-grid=""
      />}
      {/* The same path remains present through every handoff; the controller morphs its geometry. */}
      <path
        data-thread=""
        className="ds-thread"
        d="M130 580 C200 580 170 280 340 280 C510 280 430 490 600 490 C770 490 735 210 870 210"
      />
      {show(0) && (
        <g data-art="workspace">
          <g data-workspace-controls="" className="ds-controls">
            <path d="M140 140H875V660H140Z M140 175H875M180 175V660M760 175V660" />
            {Array.from({ length: 15 }, (_, i) => (
              <path key={i} d={`M${200 + i * 38} 140v${i % 2 ? 8 : 14}`} />
            ))}
            <path d="M788 220h54m-54 20h35m-35 45h54m-54 20h35m-35 45h54m-54 20h35M152 205h16v16h-16Zm0 48 8-12 8 12-8 12Z M160 289v20m-10-10h20" />
            <rect
              x="256"
              y="232"
              width="429"
              height="351"
              strokeDasharray="5 7"
            />
            {[
              [256, 232],
              [685, 232],
              [256, 583],
              [685, 583],
            ].map(([x, y]) => (
              <rect
                key={x + y}
                x={x - 5}
                y={y - 5}
                width="10"
                height="10"
                className="ds-anchor"
              />
            ))}
          </g>
          <g data-workspace-form="">
            <DesignNode id={id} />
          </g>
          <g className="ds-handles" data-handles="">
            <path d="M170 280H510M430 490H770" />
            {[
              [170, 280],
              [340, 280],
              [510, 280],
              [430, 490],
              [600, 490],
              [770, 490],
            ].map(([cx, cy], i) => (
              <circle key={i} cx={cx} cy={cy} r={i % 3 === 1 ? 7 : 4} />
            ))}
          </g>
        </g>
      )}
      {show(1) && (
        <g data-art="identity">
          {live ? (
            <g data-letters="">
              <g data-letter-g="" fill={`url(#${id}-brand-metal)`}>
                <path d={gOutlines.map(shape => outline(shape.from)).join(" ")} />
              </g>
              <g data-letter-s="" fill={`url(#${id}-brand-metal)`}>
                <path d={sOutlines.map(shape => outline(shape.from)).join(" ")} />
              </g>
              {markNodes.map(([cx, cy], i) => (
                <circle key={i} data-brand-node="" cx={cx} cy={cy} r="0" fill={`url(#${id}-orb)`} />
              ))}
            </g>
          ) : <Logo3D />}
          <g data-construction="" className="ds-construction">
            <path d="M290 195H710M290 340H710M290 620H710M347 170V645M640 170V645" />
          </g>
        </g>
      )}
      {show(2) && (
        <g data-art="character">
          <g data-sketch="" className="ds-sketch">
            <path d="M250 160h55m-55 0v65M750 160h-55m55 0v65M250 665h55m-55 0v-65M750 665h-55m55 0v-65M220 410h60m440 0h60" />
          </g>
          <g data-finished-character="">
            <Character animated={live} />
          </g>
          <g data-rig="" className="ds-rig">
            <path d={wirePath(facePoints)} />
            {facePoints.map(([cx, cy], i) => (
              <circle key={i} cx={cx} cy={cy} r="4" />
            ))}
          </g>
        </g>
      )}
      {live && (
        /* GS-DES-002 — the Brand mark's own bars and spheres, thinned to strokes and nodes, drawing
           the mascot. Swapped in under the 3D logo at the mark's exact bar centrelines, bar width
           and sphere radius, so when the logo dissolves the same object is underneath. */
        <g data-morph="" opacity="0">
          <g stroke="var(--ds-gold)" fill="none" strokeLinecap="round" strokeLinejoin="round">
            {markCurves.map((curve, i) => (
              <path key={i} data-morph-edge="" d={curvePath(curve)} strokeWidth="38" />
            ))}
          </g>
          {markNodes.map(([cx, cy], i) => (
            <circle key={i} data-morph-node="" cx={cx} cy={cy} r="37.5" fill={`url(#${id}-orb)`} />
          ))}
        </g>
      )}
      {/* Above the procedural mark and the morph, so the 3D logo resolves over the exact geometry
          and later dissolves onto it: the Brand payoff, the first of the two [data-mark-3d]. */}
      {live && <Logo3D live />}
      {show(3) && (
        <g data-art="technical">
          <Building id={id} />
        </g>
      )}
      {show(4) && !live && (
        <g data-art="convergence">
          <g data-final-mark="" transform="translate(-48 -53) scale(1.1)">
            <Logo3D />
          </g>
        </g>
      )}
    </svg>
  );
}
