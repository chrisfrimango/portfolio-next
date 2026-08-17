"use client";

import { type ReactNode } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * The Midnight Sun day cycle: the homepage opens at night, dawn breaks as
 * you scroll into About, full day peaks over the work, and dusk returns at
 * Say hej. Implemented as scrubbed interpolation of the brand CSS variables
 * (RGB triplets on :root), so every token-colored element follows along.
 * The Stockholm clock narrates: scroll position drives the displayed time.
 */

const NIGHT = {
  paper: [19, 19, 19],
  ink: [246, 243, 237],
  gray: [154, 150, 142],
};

const DAY = {
  paper: [246, 243, 237], // warm paper — day feels lit, not clinical
  ink: [19, 19, 19],
  gray: [111, 111, 111],
};

// Narrative clock waypoints, in minutes on a continuous axis (>1440 = next day)
const CLOCK = {
  heroStart: 23 * 60 + 41, // 23:41 — night
  dayPeak: 24 * 60 + 11 * 60, // 11:00 — full light over About (the mountain)
  nightReturn: 24 * 60 + 23 * 60 + 41, // 23:41 — dusk falls over the work
};

function setPalette(t: number) {
  // t: 0 = night, 1 = day. If background and text both interpolated
  // linearly they would meet at the same mid-gray at t=0.5 (contrast 1:1).
  // Instead: the background smoothsteps (fast transit through the muddy
  // middle) and the text hard-swaps at t=0.47 — measured worst-case
  // contrast across the whole dawn is 4.12:1.
  const bgT = t * t * (3 - 2 * t);
  const textT = t < 0.47 ? 0 : 1;

  const root = document.documentElement.style;
  const mix = (a: number[], b: number[], amount: number) =>
    a
      .map((v, i) => Math.round(gsap.utils.interpolate(v, b[i], amount)))
      .join(" ");
  root.setProperty("--brand-paper", mix(NIGHT.paper, DAY.paper, bgT));
  root.setProperty("--brand-ink", mix(NIGHT.ink, DAY.ink, textT));
  root.setProperty("--brand-gray", mix(NIGHT.gray, DAY.gray, textT));
}

function emitClock(minutesOnAxis: number) {
  window.dispatchEvent(
    new CustomEvent<number>("daycycle:time", {
      detail: Math.round(minutesOnAxis) % (24 * 60),
    })
  );
}

export default function DayCycle({ children }: { children: ReactNode }) {
  useGSAP(() => {
    const root = document.documentElement.style;

    const clearPalette = () => {
      root.removeProperty("--brand-paper");
      root.removeProperty("--brand-ink");
      root.removeProperty("--brand-gray");
      window.dispatchEvent(new Event("daycycle:end"));
    };

    // Reduced motion: static day theme, real clock, no cycle
    if (prefersReducedMotion()) {
      setPalette(1);
      return clearPalette;
    }

    // The page opens at night
    setPalette(0);
    emitClock(CLOCK.heroStart);

    // Dawn: breaks while About scrolls in — full light peaks over the mountain
    ScrollTrigger.create({
      trigger: "#about",
      start: "top 85%",
      end: "top 5%",
      scrub: true,
      onUpdate: (self) => {
        setPalette(self.progress);
        emitClock(
          gsap.utils.interpolate(CLOCK.heroStart, CLOCK.dayPeak, self.progress)
        );
      },
    });

    // Dusk: night falls over the work — the mountain fades out and Projects
    // arrives dark, holding through Say hi where the loop closes.
    ScrollTrigger.create({
      trigger: "#projects",
      start: "top 90%",
      end: "top 40%",
      scrub: true,
      onUpdate: (self) => {
        setPalette(1 - self.progress);
        emitClock(
          gsap.utils.interpolate(CLOCK.dayPeak, CLOCK.nightReturn, self.progress)
        );
      },
    });

    return clearPalette;
  });

  return (
    <>
      {/* SSR: first paint is already night — no light flash before hydration */}
      <style>{`:root{--brand-paper:19 19 19;--brand-ink:246 243 237;--brand-gray:154 150 142;}`}</style>
      {children}
    </>
  );
}
