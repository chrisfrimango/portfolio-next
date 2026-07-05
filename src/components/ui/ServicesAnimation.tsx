"use client";

import React, { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useScrollTo } from "@/components/SmoothScroll";

interface ServicesAnimationProps {
  isVisible: boolean;
  onClose: () => void;
}

const ServicesAnimation: React.FC<ServicesAnimationProps> = ({
  isVisible,
  onClose,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTo = useScrollTo();

  // Stays mounted so both the enter and exit animation can play
  useGSAP(
    () => {
      if (isVisible) {
        gsap.to(containerRef.current, {
          x: "0%",
          opacity: 1,
          duration: 0.5,
          ease: "power3.out",
        });
      } else {
        gsap.to(containerRef.current, {
          x: "100%",
          opacity: 0,
          duration: 0.3,
          ease: "power2.in",
        });
      }
    },
    { scope: containerRef, dependencies: [isVisible] }
  );

  return (
    <div
      ref={containerRef}
      aria-hidden={!isVisible}
      className={`fixed top-[80px] right-0 bg-brand-accent text-white p-6 rounded-l-lg shadow-lg z-50 max-w-[300px] translate-x-full opacity-0 ${
        isVisible ? "" : "pointer-events-none"
      }`}
    >
      <button
        onClick={onClose}
        tabIndex={isVisible ? 0 : -1}
        className="absolute top-2 right-2 text-white hover:text-gray-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 6L6 18" />
          <path d="M6 6L18 18" />
        </svg>
      </button>
      <h3 className="text-xl font-bold mb-4">Open for assignments within:</h3>
      <ul className="space-y-2">
        <li className="flex items-center">
          <span className="mr-2">•</span>
          <span>Web Development</span>
        </li>
        <li className="flex items-center">
          <span className="mr-2">•</span>
          <span>Frontend Development</span>
        </li>
        <li className="flex items-center">
          <span className="mr-2">•</span>
          <span>
            I’m open to developer roles as well as hybrid positions that combine
            technical work with strategic, business-oriented challenges.
          </span>
        </li>
      </ul>
      <button
        onClick={() => {
          scrollTo("#sayhi");
          onClose();
        }}
        tabIndex={isVisible ? 0 : -1}
        className="mt-6 border border-white px-4 py-2 rounded-3xl text-sm hover:bg-white hover:text-brand-accent transition-colors"
      >
        GET IN TOUCH
      </button>
    </div>
  );
};

export default ServicesAnimation;
