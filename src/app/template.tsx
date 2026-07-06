"use client";

import { useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { gsap, useGSAP } from "@/lib/gsap";
import { EASE, DUR, prefersReducedMotion } from "@/lib/motion";

/**
 * Cinematic route entrance: an accent curtain covers the viewport and wipes
 * upward to reveal the page, which rises in behind it. The homepage is
 * excluded — its intro is owned by the Preloader.
 */
export default function Template({ children }: { children: ReactNode }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useGSAP(
    () => {
      if (isHome || prefersReducedMotion()) {
        gsap.set(curtainRef.current, { display: "none" });
        return;
      }

      gsap
        .timeline()
        .set(curtainRef.current, { scaleY: 1, transformOrigin: "bottom" })
        .set(contentRef.current, { opacity: 0, y: 24 })
        .to(labelRef.current, {
          opacity: 1,
          duration: DUR.micro,
          ease: EASE.out,
        })
        .to(
          curtainRef.current,
          {
            scaleY: 0,
            transformOrigin: "top",
            duration: DUR.act,
            ease: EASE.inOut,
          },
          "+=0.15"
        )
        .to(labelRef.current, { opacity: 0, duration: 0.2 }, "<")
        .to(
          contentRef.current,
          { opacity: 1, y: 0, duration: DUR.section, ease: EASE.out },
          "-=0.7"
        );
    },
    { dependencies: [pathname] }
  );

  return (
    <>
      <div
        ref={curtainRef}
        aria-hidden
        className="fixed inset-0 z-[200] bg-brand-accent flex items-center justify-center pointer-events-none"
      >
        <div
          ref={labelRef}
          className="font-display italic text-title text-brand-paper opacity-0"
        >
          Friman
        </div>
      </div>
      <div ref={contentRef}>{children}</div>
    </>
  );
}
