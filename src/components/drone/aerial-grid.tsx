/**
 * Aerial grid motif.
 *
 * Stands in for footage on the drone page. There is no aerial work in the
 * portfolio yet, and dressing the section with ground photography would imply
 * drone credits that do not exist — so the visual is built rather than
 * borrowed. It reads as a flight-planning overlay: survey grid, altitude rings,
 * and a target reticle, in the same hairline language as the viewfinder
 * brackets used across the site.
 *
 * Replace with real aerial footage once you have it — see the note in
 * src/app/drone/page.tsx.
 */
export function AerialGrid({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 800 800"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="drone-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e90ff" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#1e90ff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="drone-vignette" cx="50%" cy="50%" r="50%">
          <stop offset="55%" stopColor="#0a0a0a" stopOpacity="0" />
          <stop offset="100%" stopColor="#0a0a0a" stopOpacity="1" />
        </radialGradient>
        <pattern id="drone-survey" width="50" height="50" patternUnits="userSpaceOnUse">
          <path
            d="M 50 0 L 0 0 0 50"
            fill="none"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth="1"
          />
        </pattern>
      </defs>

      {/* Survey grid */}
      <rect width="800" height="800" fill="url(#drone-survey)" />

      {/* Altitude rings */}
      {[120, 210, 300].map((r) => (
        <circle
          key={r}
          cx="400"
          cy="400"
          r={r}
          fill="none"
          stroke="rgba(30,144,255,0.22)"
          strokeWidth="1"
          strokeDasharray={r === 210 ? "3 7" : undefined}
        />
      ))}

      {/* Flight path */}
      <path
        d="M 60 640 C 240 520, 300 300, 420 250 S 640 260, 740 150"
        fill="none"
        stroke="url(#drone-fade)"
        strokeWidth="1.5"
      />

      {/* Target reticle */}
      <g stroke="rgba(30,144,255,0.85)" strokeWidth="1.25">
        <line x1="400" y1="352" x2="400" y2="386" />
        <line x1="400" y1="414" x2="400" y2="448" />
        <line x1="352" y1="400" x2="386" y2="400" />
        <line x1="414" y1="400" x2="448" y2="400" />
      </g>
      <circle cx="400" cy="400" r="3" fill="#1e90ff" />

      {/* Corner brackets — the house motif */}
      {[
        "M 40 90 L 40 40 L 90 40",
        "M 710 40 L 760 40 L 760 90",
        "M 760 710 L 760 760 L 710 760",
        "M 90 760 L 40 760 L 40 710",
      ].map((d) => (
        <path key={d} d={d} fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="1.25" />
      ))}

      {/* Readout ticks */}
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={i}
          x={620}
          y={620 + i * 14}
          width={i === 0 ? 96 : 96 - i * 22}
          height="2"
          fill="rgba(255,255,255,0.16)"
        />
      ))}

      <rect width="800" height="800" fill="url(#drone-vignette)" />
    </svg>
  );
}
