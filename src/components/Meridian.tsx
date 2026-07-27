"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * MERIDIAN — the site's one constant: a single small sun on its arc. As you
 * read down the page it rises from the lower left (night, deep ember), climbs
 * white-hot over the work at midday, and sinks to the lower right at the
 * contact dusk — one disc, one arc, the whole site. The accent (#ff3b00) is
 * the sun and nothing else. Kept astronomical, never an illustrated "scene".
 */

const EMBER = "#D1300A"; // low sun — atmospheric
const NOON = "#FF4A12"; // high sun — white-hot

export default function Meridian() {
  const sunRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sun = sunRef.current;
    if (!sun) return;

    // progress 0 (top) → 1 (bottom of page). Sun travels left→right; a sine
    // arc lifts it off the horizon, peaking at mid-page.
    const place = (p: number) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const e = Math.sin(Math.PI * Math.min(Math.max(p, 0), 1));
      const x = (0.08 + p * 0.84) * w;
      const y = 0.82 * h - e * 0.58 * h;
      gsap.set(sun, {
        x,
        y,
        opacity: 0.4 + e * 0.6,
        backgroundColor: e > 0.5 ? NOON : EMBER,
        boxShadow: `0 0 ${Math.round(6 + e * 46)}px ${Math.round(
          1 + e * 10
        )}px rgba(255,74,18,${(0.1 + e * 0.4).toFixed(2)})`,
      });
    };

    // Reduced motion: hold the sun at a calm mid-morning position, no scrub.
    if (prefersReducedMotion()) {
      place(0.32);
      return;
    }

    place(0);
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      scrub: true,
      onUpdate: (self) => place(self.progress),
    });
    const onResize = () => place(st.progress);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      st.kill();
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[2] overflow-hidden"
    >
      {/* The sun — the one disc, positioned by transform (GPU) */}
      <div
        ref={sunRef}
        className="absolute top-0 left-0 h-2 w-2 rounded-full"
        style={{ marginLeft: -4, marginTop: -4, backgroundColor: EMBER }}
      />
    </div>
  );
}
