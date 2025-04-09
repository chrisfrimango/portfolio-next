"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface CardDemoProps {
  text: string;
  subtext?: string;
  href: string | null;
  technologies?: string[];
}

export default function ProjectCard({
  text,
  subtext,
  href,
  technologies = [],
}: CardDemoProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Register ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    if (!cardRef.current) return;

    // Immediate animation on page load instead of scroll trigger
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power1.out",
        delay: 0.1, // Very slight delay for a smoother effect
      }
    );
  }, []);

  const cardContent = (
    <div className="w-full group/card" ref={cardRef}>
      <div
        className={cn(
          "cursor-pointer overflow-hidden relative card h-96 rounded-md shadow-xl w-full mx-auto backgroundImage flex flex-col justify-between p-4",
          "bg-[url(/images/camping_tent.jpeg)] bg-cover bg-center"
        )}
      >
        <div className="absolute w-full h-full top-0 left-0 transition duration-300 group-hover/card:bg-black opacity-60"></div>
        <div className="flex flex-row items-center space-x-4 z-10">
          <div className="h-10 w-10 rounded-full border-2 bg-[#ff3b00] flex items-center justify-center text-white font-bold" />
          <div className="flex flex-col">
            <p className="font-normal text-base text-gray-50 relative z-10">
              {text}
            </p>
          </div>
        </div>
        <div className="text content">
          <p className="font-normal text-sm text-gray-50 relative z-10 my-4">
            {subtext}
          </p>

          {technologies.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2 z-10 relative">
              {technologies.slice(0, 4).map((tech, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-black/30 text-white text-xs rounded-md border border-white/20"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return href ? (
    <Link target="_blank" href={href}>
      {cardContent}
    </Link>
  ) : (
    cardContent
  );
}
