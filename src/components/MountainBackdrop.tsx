"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { useIntro } from "@/components/intro/IntroContext";

/**
 * A photographic mountain fixed behind the page. The hero (cloud curtain) hides
 * it until scrolled away; it stands behind About and fades before Projects.
 * Mounted only after the intro hands off (LCP-safe). Motion is added in a later
 * step; this version renders it statically at full opacity.
 */
export default function MountainBackdrop() {
  const { introDone } = useIntro();
  const [mounted, setMounted] = useState(false);
  const [reduced, setReduced] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    setReduced(prefersReducedMotion());
  }, []);

  // Motion added in Task 4. Placeholder scope keeps refs wired.
  useGSAP(() => {}, { dependencies: [mounted, reduced, introDone] });

  if (!mounted || (!reduced && !introDone)) return null;

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="fixed inset-0 -z-10 pointer-events-none overflow-hidden"
    >
      <div ref={imgRef} className="absolute inset-0 will-change-transform">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/mountain_backdrop.webp"
          alt=""
          className="h-full w-full object-cover object-bottom"
        />
      </div>
      {/* Contrast scrim over About — --brand-paper so it tracks the day cycle.
          Starting values; tuned to >=4.5:1 in Task 5. */}
      <div
        ref={scrimRef}
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgb(var(--brand-paper) / 0.5) 0%, rgb(var(--brand-paper) / 0.35) 50%, rgb(var(--brand-paper) / 0.55) 100%)",
        }}
      />
    </div>
  );
}
