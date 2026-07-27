"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface AnimatedSayHiProps {
  className?: string;
}

const AnimatedSayHi: React.FC<AnimatedSayHiProps> = ({ className = "" }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sayRef = useRef<HTMLSpanElement>(null);
  const hiRef = useRef<HTMLSpanElement>(null);
  const coffeeRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // Initial state: coffee cup hidden
  useGSAP(
    () => {
      gsap.set(coffeeRef.current, {
        opacity: 0,
        scale: 0.5,
        width: "0.1em",
      });
    },
    { scope: containerRef }
  );

  // Hover: "say" and "hi!" split apart, coffee cup pops in (desktop only)
  useGSAP(
    () => {
      if (!sayRef.current || !hiRef.current || !coffeeRef.current) return;

      if (isDesktop && isHovered) {
        gsap.to(sayRef.current, { x: -40, duration: 0.4, ease: "power2.out" });
        gsap.to(hiRef.current, { x: 40, duration: 0.4, ease: "power2.out" });
        gsap.to(coffeeRef.current, {
          opacity: 1,
          scale: 1,
          width: "auto",
          duration: 0.5,
          ease: "elastic.out(1, 0.5)",
        });
      } else {
        gsap.to(sayRef.current, { x: 0, duration: 0.4, ease: "power2.out" });
        gsap.to(hiRef.current, { x: 0, duration: 0.4, ease: "power2.out" });
        gsap.to(coffeeRef.current, {
          opacity: 0,
          scale: 0.5,
          width: "0.1em",
          duration: 0.3,
          ease: "power2.in",
        });
      }
    },
    { scope: containerRef, dependencies: [isHovered, isDesktop] }
  );

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex items-center justify-center ${className}`}
      onMouseEnter={() => isDesktop && setIsHovered(true)}
      onMouseLeave={() => isDesktop && setIsHovered(false)}
    >
      <div className="flex items-center justify-center relative">
        <span
          ref={sayRef}
          className="text-brand-accent inline-block"
        >
          Say
        </span>
        <div
          ref={coffeeRef}
          className="mx-1 text-brand-accent opacity-0"
          aria-hidden="true"
          style={{
            width: isHovered && isDesktop ? "auto" : "0.1em",
            overflow: "hidden",
          }}
        >
          {/* Coffee cup emoji */}
          <span className="text-2xl sm:text-4xl">☕</span>
        </div>
        <span
          ref={hiRef}
          className="text-brand-accent inline-block"
        >
          hi!
        </span>
      </div>
    </div>
  );
};

export default AnimatedSayHi;
