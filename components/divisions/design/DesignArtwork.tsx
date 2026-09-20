/** Original GS-R002 studio studies. Decorative vectors; no client work or engineering specification. */
const nodes = [
  [475, 482],
  [856, 482],
  [475, 845],
  [856, 845],
  [675, 684],
  [1060, 684],
  [675, 1044],
  [1060, 1044],
];
const bars = [
  [475, 444, 381, 76],
  [437, 482, 76, 363],
  [475, 807, 381, 76],
  [675, 646, 385, 76],
  [1022, 684, 76, 360],
  [675, 1006, 385, 76],
];

function Mark({ id }: { id: string }) {
  return (
    <g transform="translate(110 95) scale(.5)">
      {bars.map(([x, y, width, height], i) => (
        <rect
          key={i}
          x={x}
          y={y}
          width={width}
          height={height}
          fill={`url(#${id}-metal)`}
        />
      ))}
      {nodes.map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="75" fill={`url(#${id}-orb)`} />
      ))}
    </g>
  );
}

/** Original R1 character: sculpted swept hair, wraparound visor and a tailored studio jacket. */
function Character({ id }: { id: string }) {
  return (
    <g data-character="">
      <ellipse cx="500" cy="694" rx="170" ry="16" className="ds-shadow" />
      <g data-character-body="">
        <path
          d="M445 477 390 497Q342 521 326 663Q498 724 674 661Q659 525 613 500L556 477Z"
          fill={`url(#${id}-blue)`}
        />
        <path
          d="M446 477 425 529 497 658 575 527 556 477Z"
          fill="var(--ds-night)"
        />
        <path d="M450 431H550V496Q503 535 449 495Z" fill={`url(#${id}-skin)`} />
        <path
          d="m440 491-44 37 51 34-17 29 67 67m62-167 43 37-51 34 16 29-70 67M368 570l-15 83m280-83 16 83"
          className="ds-seam"
        />
        <path d="M499 660v37" className="ds-seam" />
        <rect
          x="591"
          y="570"
          width="25"
          height="7"
          rx="2"
          fill="var(--ds-gold)"
        />
      </g>
      <g data-head="">
        <path
          d="M366 313Q328 293 337 350Q340 385 370 387M634 312Q669 293 661 350Q657 385 629 386"
          fill={`url(#${id}-skin)`}
        />
        <path
          d="M369 244Q386 187 496 187Q607 181 633 257L625 372Q613 439 544 466Q503 486 460 464Q393 442 376 381Z"
          fill={`url(#${id}-skin)`}
        />
        <path d="M385 343Q388 423 458 455" className="ds-face-shade" />
        <path d="M615 342Q608 423 548 451" className="ds-face-shade" />
        <path
          d="M398 277Q436 256 467 272M536 269Q579 249 609 273"
          className="ds-brows"
        />
        <path
          d="M360 291Q492 264 643 291L632 343Q605 382 550 366L507 347 486 348Q436 382 385 350Z"
          fill={`url(#${id}-visor)`}
          stroke="var(--ds-gold-muted)"
          strokeWidth="5"
        />
        <g data-eyes="" className="ds-visor-reflection">
          <path d="M380 302 423 292 398 339 378 326Z M451 290l23-2-27 52-25 9Z M537 289l18 1-25 38-15-5Z M578 290l40 6-32 52-29-3Z" />
        </g>
        <path
          d="M360 291Q492 264 643 291"
          fill="none"
          stroke="var(--ds-gold)"
          strokeWidth="5"
        />
        <path d="m498 351-9 32q10 8 22-1" className="ds-face-line" />
        <path d="M473 412Q502 426 531 408" className="ds-face-line" />
        <path d="M488 430q16 5 29-2" className="ds-face-shade" />
        <path
          d="M364 303 351 255Q345 164 431 149Q516 94 600 159Q650 190 644 273L630 313 612 240Q581 251 558 220Q478 262 401 219L382 295Z"
          fill={`url(#${id}-hair)`}
        />
        <g data-hair="">
          <path
            d="M389 213Q330 151 376 115Q403 147 439 132Q487 95 490 64Q544 104 581 105Q629 106 643 155Q612 146 584 166Q530 213 460 219Q425 215 389 213Z"
            fill={`url(#${id}-hair)`}
          />
          <path
            d="M388 151Q426 178 480 128Q521 103 558 137M413 192Q477 188 525 153Q565 126 607 143"
            className="ds-hair-strand"
          />
        </g>
      </g>
    </g>
  );
}

const levels = [620, 525, 430, 335];
function Building() {
  return (
    <g data-building="" className="ds-building">
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
        <linearGradient id={`${id}-skin`} x1="0" y1="0" x2="1" y2=".65">
          <stop stopColor="var(--ds-face-hi)" />
          <stop offset=".48" stopColor="var(--ds-face)" />
          <stop offset="1" stopColor="var(--ds-face-shade)" />
        </linearGradient>
        <linearGradient id={`${id}-hair`} x1="0" y1="0" x2=".7" y2="1">
          <stop stopColor="var(--ds-muted-navy)" />
          <stop offset=".48" stopColor="var(--ds-navy)" />
          <stop offset="1" stopColor="var(--ds-visor)" />
        </linearGradient>
        <linearGradient id={`${id}-visor`} x1="0" y1="0" x2="1" y2=".7">
          <stop stopColor="var(--ds-gold-deep)" />
          <stop offset=".32" stopColor="var(--ds-navy)" />
          <stop offset=".65" stopColor="var(--ds-visor)" />
          <stop offset="1" stopColor="var(--ds-gold-muted)" />
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
      <rect
        x="90"
        y="90"
        width="820"
        height="630"
        fill={`url(#${id}-grid)`}
        data-grid=""
      />
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
          <g data-letters="" className="ds-letters">
            <text data-letter-g="" x="340" y="335" fontSize="170">
              G
            </text>
            <text data-letter-s="" x="473" y="551" fontSize="340">
              S
            </text>
          </g>
          <g data-construction="" className="ds-construction">
            <path d="M290 195H710M290 340H710M290 620H710M347 170V645M640 170V645" />
            <path
              data-g-geometry=""
              pathLength="100"
              d="M538 336H347V518"
              className="ds-g-geometry"
            />
            <path
              data-s-geometry=""
              pathLength="100"
              d="M347 518H538M447 437H640V617H447"
              className="ds-s-geometry"
            />
            {nodes.map(([x, y], i) => (
              <rect
                key={i}
                x={x * 0.5 + 105}
                y={y * 0.5 + 90}
                width="10"
                height="10"
              />
            ))}
          </g>
          <g data-resolved-mark="">
            <Mark id={id} />
          </g>
        </g>
      )}
      {show(2) && (
        <g data-art="character">
          <g data-sketch="" className="ds-sketch">
            <ellipse cx="490" cy="310" rx="142" ry="123" />
            <path d="M340 310H650M500 110V690M345 665Q351 490 452 480M655 665Q651 490 550 480M370 220Q500 100 640 230M400 420Q500 491 610 420M370 291Q501 265 642 291M391 191Q476 141 490 64" />
            <path d="M449 430V500L500 660 550 500V430M340 665H659" />
          </g>
          <g data-finished-character="">
            <Character id={id} />
          </g>
          <g data-rig="" className="ds-rig">
            <path d="M490 288V480L439 591 422 640M490 480 546 591 566 640M367 535 418 451 490 423 566 451 625 522" />
            {[
              [490, 288],
              [490, 423],
              [490, 480],
              [418, 451],
              [566, 451],
              [439, 591],
              [546, 591],
            ].map(([cx, cy], i) => (
              <circle key={i} cx={cx} cy={cy} r="8" />
            ))}
          </g>
        </g>
      )}
      {show(3) && (
        <g data-art="technical">
          <Building />
        </g>
      )}
      {show(4) && (
        <g data-art="convergence">
          <g transform="translate(-48 -53) scale(1.1)">
            <Mark id={id} />
          </g>
          <g transform="translate(580 400) scale(.36)">
            <Character id={id} />
          </g>
          <g transform="translate(130 480) scale(.3)">
            <Building />
          </g>
          <g className="ds-convergence-vector">
            <path d="M200 275H315V380" />
            <rect x="193" y="268" width="14" height="14" />
            <rect x="308" y="373" width="14" height="14" />
          </g>
          <g transform="translate(733 220) rotate(10)">
            <path d="M0 0 65-32 127 0 65 35Z" fill="var(--ds-cobalt)" />
            <path d="M0 0v76l65 36V35Z" fill="var(--ds-navy)" />
            <path d="M65 35 127 0v76l-62 36Z" fill="var(--ds-gold)" />
          </g>
        </g>
      )}
    </svg>
  );
}
