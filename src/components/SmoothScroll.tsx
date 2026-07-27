"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const LenisContext = createContext<Lenis | null>(null);

export const useLenis = () => useContext(LenisContext);

/**
 * Scroll to a section/element. Uses Lenis when active, falls back to a
 * native jump when Lenis is disabled (prefers-reduced-motion).
 */
export function useScrollTo() {
  const lenis = useLenis();
  return useCallback(
    (target: string | HTMLElement) => {
      if (lenis) {
        lenis.scrollTo(target);
      } else {
        const element =
          typeof target === "string" ? document.querySelector(target) : target;
        element?.scrollIntoView();
      }
    },
    [lenis]
  );
}

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    // Respect reduced motion: no smooth scroll layer at all.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const instance = new Lenis({ autoRaf: false });
    instance.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    setLenis(instance);

    return () => {
      gsap.ticker.remove(raf);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  return (
    <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
  );
}
