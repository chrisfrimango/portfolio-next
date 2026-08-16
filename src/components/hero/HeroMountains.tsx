"use client";

/**
 * Mountain silhouettes for the hero descent. Three bottom-anchored SVG ridge
 * bands (far/mid/near) plus a mist wisp. Fixed warm-dark fill so they read as
 * silhouettes against both the night sky and the dawn glow behind them; depth
 * comes from per-band opacity, not colour. Purely presentational — the parallax
 * transforms are applied by HeroHeader's scroll timeline via the data attrs.
 * Rendered only after the intro hands off, so it never affects LCP.
 */
const TONE = "#0e0b09";

// Low-detail ridgelines. viewBox 1440x300, filled down to the baseline.
const FAR =
  "M0,180 L120,160 L280,175 L440,150 L620,168 L800,140 L980,165 L1180,150 L1440,170 L1440,300 L0,300 Z";
const MID =
  "M0,220 L160,150 L300,190 L460,120 L640,175 L820,110 L1020,180 L1240,130 L1440,190 L1440,300 L0,300 Z";
const NEAR =
  "M0,260 L180,140 L360,240 L520,120 L700,220 L900,100 L1120,230 L1320,150 L1440,240 L1440,300 L0,300 Z";

function Band({
  d,
  role,
  opacity,
  heightVh,
}: {
  d: string;
  role: "far" | "mid" | "near";
  opacity: number;
  heightVh: number;
}) {
  return (
    <svg
      data-mtn={role}
      viewBox="0 0 1440 300"
      preserveAspectRatio="none"
      aria-hidden
      className="absolute bottom-0 left-0 w-full will-change-transform"
      style={{ height: `${heightVh}vh`, opacity }}
    >
      <path d={d} fill={TONE} />
    </svg>
  );
}

export default function HeroMountains() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <Band d={FAR} role="far" opacity={0.5} heightVh={30} />
      <Band d={MID} role="mid" opacity={0.72} heightVh={38} />
      <Band d={NEAR} role="near" opacity={0.92} heightVh={46} />
      {/* Mist wisp drifting along the ridge bases */}
      <div
        data-mist
        className="absolute bottom-0 left-0 w-full will-change-transform"
        style={{
          height: "40vh",
          background:
            "linear-gradient(to top, transparent 0%, rgba(246,243,237,0.10) 30%, rgba(246,243,237,0.16) 45%, transparent 70%)",
        }}
      />
    </div>
  );
}
