"use client";
import React, { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { gsap } from "gsap";

export const EvervaultCard = ({
  text,
  subtext,
  className,
  href,
}: {
  text: string;
  subtext?: string;
  className?: string;
  href: string | null;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    // Initial animation when card appears
    gsap.from(card, {
      opacity: 0,
      rotateY: -90,
      duration: 1,
      ease: "power2.out",
    });

    // Hover animations
    const enterAnimation = () => {
      gsap.to(card, {
        scale: 1.05,
        rotateY: 180,
        duration: 0.6,
        ease: "power2.out",
      });
    };

    const leaveAnimation = () => {
      gsap.to(card, {
        scale: 1,
        rotateY: 0,
        duration: 0.6,
        ease: "power2.in",
      });
    };

    card.addEventListener("mouseenter", enterAnimation);
    card.addEventListener("mouseleave", leaveAnimation);

    return () => {
      card.removeEventListener("mouseenter", enterAnimation);
      card.removeEventListener("mouseleave", leaveAnimation);
    };
  }, []);

  const CardContent = () => (
    <div
      ref={cardRef}
      className={cn(
        "group w-full aspect-square h-full cursor-pointer overflow-hidden relative border-2 border-[#131313]",
        "transition-all duration-500",
        "hover:after:content-[''] hover:after:absolute hover:after:inset-0",
        "hover:after:opacity-90",
        href === null &&
          "opacity-50 cursor-not-allowed hover:after:content-none",
        className
      )}
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className="relative z-10 h-full flex flex-col justify-end p-4 backface-hidden">
        <div className="transform transition-transform duration-500 group-hover:translate-y-0">
          <h2 className="text-[#ffffff] group-hover:text-[#131313] font-medium text-2xl mb-2">
            {text}
          </h2>
          <p className="text-[#ffffff] group-hover:text-[#131313] text-sm font-light opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            {subtext || "Coming soon..."}
          </p>
        </div>
      </div>
    </div>
  );

  if (href === null) {
    return (
      <div className="pointer-events-none">
        <CardContent />
      </div>
    );
  }

  return (
    <Link href={href}>
      <CardContent />
    </Link>
  );
};
