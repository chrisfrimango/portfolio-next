"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
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

  useGSAP(
    () => {
      if (!mounted) return;
      const root = rootRef.current,
        img = imgRef.current,
        scrim = scrimRef.current;
      if (!root || !img || !scrim) return;

      // Opacity is split across two elements so each has a single writer and
      // the layer starts invisible — a painted full-viewport image would
      // otherwise steal LCP from the headline. The ROOT reveals (0->1) as the
      // opaque hero scrolls off; the IMG WRAPPER fades (1->0) before Projects.
      // At load the root is opacity 0, so the image is not an LCP candidate.
      gsap.set(root, { opacity: reduced ? 1 : 0 });

      // Fade out before the first Projects stage (writer of imgRef opacity).
      gsap.fromTo(
        img,
        { opacity: 1 },
        {
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: "#projects",
            start: "top 90%",
            end: "top 40%",
            scrub: true,
          },
        }
      );

      if (reduced) {
        gsap.set(img, { yPercent: 0, scale: 1 });
        return;
      }

      // Reveal: root fades up as the hero scrolls away (writer of root opacity).
      gsap.fromTo(
        root,
        { opacity: 0 },
        {
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: "#hero",
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        }
      );

      // Descent drift — slow parallax over the mountain's visible life (About).
      gsap.fromTo(
        img,
        { yPercent: 6, scale: 1.06 },
        {
          yPercent: -4,
          scale: 1.0,
          ease: "none",
          scrollTrigger: {
            trigger: "#about",
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    },
    { dependencies: [mounted, reduced, introDone] }
  );

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
          A vertical veil secures the body copy (measured >=4.5:1 for --brand-ink),
          plus a soft left column that lifts the faint --brand-gray section
          labels; the mountain stays clearest through the centre where the peak
          sits. */}
      <div
        ref={scrimRef}
        className="absolute inset-0"
        style={{
          background: [
            "linear-gradient(to right, rgb(var(--brand-paper) / 0.9) 0%, transparent 20%)",
            "linear-gradient(to bottom, rgb(var(--brand-paper) / 0.58) 0%, rgb(var(--brand-paper) / 0.53) 50%, rgb(var(--brand-paper) / 0.63) 100%)",
          ].join(","),
        }}
      />
    </div>
  );
}
