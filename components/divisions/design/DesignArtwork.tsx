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

function Character({ id }: { id: string }) {
  return (
    <g data-character="">
      <ellipse cx="490" cy="666" rx="140" ry="16" className="ds-shadow" />
      <g data-character-body="">
        <path
          d="M410 433 Q360 470 349 540 L380 553 432 498 M566 431 Q612 458 633 516 L604 538 553 485"
          fill={`url(#${id}-blue)`}
        />
        <path
          d="M424 553 408 633 Q422 656 466 642 L480 563 M511 565 529 643 Q570 655 589 635 L565 545"
          fill={`url(#${id}-blue)`}
        />
        <path
          d="M410 430 Q490 395 570 430 L578 548 Q494 594 407 548Z"
          fill={`url(#${id}-blue)`}
        />
        <path
          d="M423 446 Q492 470 558 445 M425 536 Q491 560 560 536"
          className="ds-seam"
        />
        <circle cx="490" cy="502" r="13" fill={`url(#${id}-orb)`} />
        <g data-head="">
          <path
            d="M363 293 Q370 205 478 188 Q586 185 619 279 L604 383 Q493 436 373 389Z"
            fill={`url(#${id}-blue)`}
          />
          <path
            d="M367 304 Q482 253 616 291 L602 357 Q486 398 375 359Z"
            className="ds-visor"
          />
          <g data-eyes="" className="ds-eyes">
            <path d="M425 312 425 337 M549 308 549 334" />
          </g>
          <path d="M414 239 Q467 211 527 230" className="ds-highlight" />
          <path d="M491 189 507 145 545 134" className="ds-antenna" />
          <circle cx="545" cy="134" r="10" fill={`url(#${id}-orb)`} />
        </g>
      </g>
    </g>
  );
}

function Building() {
  return (
    <g data-building="" className="ds-building">
      <g data-foundation="">
        <path d="m241 541 270-132 250 134-270 139Z" className="ds-slab" />
        <path d="m241 541 0 22 250 140 270-138v-22M491 682v21" />
      </g>
      <g data-columns="">
        <path
          d="M280 541V318M488 654V425M718 542V316M514 440V215"
          strokeWidth="10"
        />
        <path d="m280 318 234-103 204 101-230 109Z" />
      </g>
      <g data-floor="">
        <path d="m264 407 250-117 222 117-248 127Z" className="ds-slab" />
        <path d="m264 407 0 15 224 127 248-127v-15M488 534v15" />
      </g>
      <g data-roof="">
        <path d="m242 285 272-127 249 124-275 143Z" className="ds-roof" />
        <path d="m242 285 0 19 246 141 275-144v-19M488 425v20" />
      </g>
      <g data-dimensions="" className="ds-dimensions">
        <text x="290" y="670">
          SPAN A
        </text>
        <text x="646" y="681">
          SPAN B
        </text>
        <text x="170" y="470" transform="rotate(-90 170 470)">
          LEVELS
        </text>
        <path d="m217 585 275 153 300-153M217 573v24M492 725v25M792 573v24M211 523V303M201 523h20M201 303h20" />
        <path d="m223 583-12 6m275 142 12 8m288-160 12 8M206 309l10-12M206 529l10-12" />
      </g>
      <g data-electrical="" className="ds-system">
        <text x="255" y="493">
          SUPPLY
        </text>
        <path d="M277 517 325 492 325 355 406 399 489 355 607 416M489 355V479L590 535M406 399V516" />
        <rect x="263" y="507" width="26" height="30" />
        <circle cx="607" cy="416" r="9" />
        <circle cx="590" cy="535" r="9" />
        <circle cx="406" cy="516" r="9" />
      </g>
      <g data-water="" className="ds-water">
        <text x="688" y="600">
          WATER
        </text>
        <path d="M715 571 667 547V354L605 385M667 484 608 516" />
        <path d="m598 381 15 8m-13 123 16 8M710 566l10 10" />
      </g>
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
            <path
              d="M352 510 432 280 507 280 593 510H539L522 459H411L393 510Z M428 410H505L466 298Z"
              fill={`url(#${id}-blue)`}
              fillRule="evenodd"
            />
            <path d="m345 522 264 0M466 249v295" className="ds-guide" />
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
            <path
              data-letter-g=""
              d="M437 263C306 170 226 263 226 389C226 515 332 566 429 496C429 450 429 389 347 389"
            />
            <path
              data-letter-s=""
              d="M700 257C547 189 508 340 609 366C710 392 741 507 578 515"
            />
          </g>
          <g data-construction="" className="ds-construction">
            <circle cx="357" cy="390" r="176" />
            <circle cx="624" cy="390" r="176" />
            <path d="M181 214H800M181 390H800M181 566H800M357 150V632M624 150V632" />
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
            <path d="M340 310H640M490 154V666M403 435 579 546M576 432 402 551M350 285Q488 153 630 286M386 397Q493 425 603 397" />
            <ellipse cx="490" cy="504" rx="94" ry="91" />
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
          <g transform="translate(130 30) scale(.7)">
            <Mark id={id} />
          </g>
          <g transform="translate(440 380) scale(.35)">
            <Character id={id} />
          </g>
          <g transform="translate(-10 290) scale(.45)">
            <Building />
          </g>
          <path
            d="M275 274C210 205 374 148 444 257M299 304 380 350 336 431Z"
            className="ds-convergence-path"
          />
          <g transform="translate(726 251) rotate(25)">
            <path d="M0 0 65-32 127 0 65 35Z" fill="var(--ds-cobalt)" />
            <path d="M0 0v76l65 36V35Z" fill="var(--ds-navy)" />
            <path d="M65 35 127 0v76l-62 36Z" fill="var(--ds-gold)" />
          </g>
        </g>
      )}
    </svg>
  );
}
