"use client";

import React, { useRef, useState, useEffect } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  initiallyOpen?: boolean;
}

const Accordion: React.FC<AccordionProps> = ({
  title,
  children,
  initiallyOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(initiallyOpen);
  const isDesktop = useMediaQuery("(min-width: 1024px)"); // lg breakpoint

  // Force open on desktop, closed on mobile
  useEffect(() => {
    setIsOpen(isDesktop);
  }, [isDesktop]);

  const rootRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const crossRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!contentRef.current) return;

      gsap.to(contentRef.current, {
        height: isOpen ? "auto" : 0,
        opacity: isOpen ? 1 : 0,
        duration: 0.5,
        ease: isOpen ? "power2.out" : "power2.in",
        // Document height changes -> scroll-triggered positions must be recomputed
        onComplete: () => ScrollTrigger.refresh(),
      });

      // Rotate the vertical bar: plus (closed) <-> X-less minus look (open)
      gsap.to(".vertical", {
        rotation: isOpen ? 90 : 0,
        duration: 0.3,
      });
    },
    { scope: rootRef, dependencies: [isOpen] }
  );

  return (
    <div ref={rootRef} className="border-b border-gray-200 last:border-b-0">
      <button
        className="w-full py-4 flex justify-between items-center text-left focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="text-brand-ink font-light text-sm sm:text-lg sm:text-center sm:mx-auto">
          {title}
        </span>
        <div
          ref={crossRef}
          className="relative w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center pr-4"
        >
          <span className="horizontal absolute w-4 sm:w-5 h-0.5 bg-black"></span>
          <span className="vertical absolute w-0.5 h-4 sm:h-5 bg-black"></span>
        </div>
      </button>
      <div
        ref={contentRef}
        className="overflow-hidden"
        style={{
          height: initiallyOpen ? "auto" : 0,
          opacity: initiallyOpen ? 1 : 0,
        }}
      >
        <div className="pb-4">{children}</div>
      </div>
    </div>
  );
};

export default Accordion;
