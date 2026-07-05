"use client";

import { useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { gsap, useGSAP } from "@/lib/gsap";
import { EASE, DUR, prefersReducedMotion } from "@/lib/motion";

/**
 * Route entrance: content rises in on navigation. The homepage is excluded —
 * its intro is owned by the Preloader.
 */
export default function Template({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useGSAP(
    () => {
      if (pathname === "/" || prefersReducedMotion()) return;

      gsap.fromTo(
        ref.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: DUR.element, ease: EASE.out }
      );
    },
    { scope: ref, dependencies: [pathname] }
  );

  return <div ref={ref}>{children}</div>;
}
