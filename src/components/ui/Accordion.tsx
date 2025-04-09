"use client";

import React, { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";

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
  const [isDesktop, setIsDesktop] = useState(false);

  // Check if we're on desktop
  useEffect(() => {
    const checkIfDesktop = () => {
      setIsDesktop(window.innerWidth >= 1068); // sm breakpoint in Tailwind
    };

    checkIfDesktop();
    window.addEventListener("resize", checkIfDesktop);

    return () => window.removeEventListener("resize", checkIfDesktop);
  }, []);

  // Set initial state based on desktop or mobile
  useEffect(() => {
    if (isDesktop) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [isDesktop]);
  const contentRef = useRef<HTMLDivElement>(null);
  const crossRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    if (isOpen) {
      // Open animation
      gsap.to(contentRef.current, {
        height: "auto",
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
      });

      // Rotate cross to make an X
      if (crossRef.current) {
        gsap.to(crossRef.current.querySelector(".horizontal"), {
          rotation: 0,
          duration: 0.3,
        });
        gsap.to(crossRef.current.querySelector(".vertical"), {
          rotation: 90,
          duration: 0.3,
        });
      }
    } else {
      // Close animation
      gsap.to(contentRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.5,
        ease: "power2.in",
      });

      // Rotate cross back to plus
      if (crossRef.current) {
        gsap.to(crossRef.current.querySelector(".horizontal"), {
          rotation: 0,
          duration: 0.3,
        });
        gsap.to(crossRef.current.querySelector(".vertical"), {
          rotation: 0,
          duration: 0.3,
        });
      }
    }
  }, [isOpen]);

  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        className="w-full py-4 flex justify-between items-center text-left focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-[#131313] font-light text-sm sm:text-lg sm:text-center sm:mx-auto">
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
