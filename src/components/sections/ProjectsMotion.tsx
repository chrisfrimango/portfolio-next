"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { DUR, EASE, prefersReducedMotion } from "@/lib/motion";

/**
 * PIN #2 — the cinematic stage. The flagship film pins and emerges from black:
 * letterbox bars retract, the frame pushes in, index/year flank from the
 * gutters and the title resolves, then the whole thing settles into the Lab
 * index. Transform/opacity only. Mobile drops the pin for one masked rise;
 * reduced motion renders the final composition statically.
 */
export default function ProjectsMotion({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;

      const flagship = root.querySelector("[data-project-flagship]");
      const media = root.querySelector("[data-project-media]");
      const bars = root.querySelectorAll("[data-letterbox]");
      const vignette = root.querySelector("[data-vignette]");
      const flanks = root.querySelectorAll("[data-project-flank]");
      const details = root.querySelectorAll("[data-project-detail]");
      if (!flagship || !media) return;

      // Reduced motion: static final composition (bars open, vignette calm).
      if (prefersReducedMotion()) {
        gsap.set(bars, { scaleY: 0 });
        gsap.set(vignette, { opacity: 0.18 });
        return;
      }

      const mm = gsap.matchMedia(ref);

      // Desktop: the pinned cinematic stage
      mm.add("(min-width: 769px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: flagship,
            start: "top top",
            end: "+=100%",
            scrub: 0.5,
            pin: true,
            anticipatePin: 1,
            refreshPriority: 1,
          },
        });
        tl.fromTo(media, { scale: 0.86 }, { scale: 1, duration: 0.4, ease: "none" }, 0)
          .fromTo(bars, { scaleY: 1 }, { scaleY: 0, duration: 0.3, ease: "none" }, 0)
          .fromTo(
            vignette,
            { opacity: 1 },
            { opacity: 0.18, duration: 0.5, ease: "none" },
            0.15
          )
          .fromTo(
            flanks,
            { opacity: 0 },
            { opacity: 1, duration: 0.2, ease: "none" },
            0.2
          )
          .fromTo(
            details,
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.2, ease: "none", stagger: 0.06 },
            0.35
          )
          .to(media, { yPercent: -3, duration: 0.35, ease: "none" }, 0.62);
      });

      // Mobile: no pin — bars open, one masked rise for the whole stage
      mm.add("(max-width: 768px)", () => {
        gsap.set(bars, { scaleY: 0 });
        gsap.set(vignette, { opacity: 0.18 });
        gsap.fromTo(
          flagship,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: DUR.section,
            ease: EASE.out,
            scrollTrigger: { trigger: flagship, start: "top 80%", once: true },
          }
        );
      });
    },
    { scope: ref }
  );

  return <div ref={ref}>{children}</div>;
}
