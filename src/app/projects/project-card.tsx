"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRef, useEffect } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

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
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Only load and play the video when the card enters the viewport
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  useGSAP(
    () => {
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
    },
    { scope: cardRef }
  );

  const cardContent = (
    <div className="w-full group/card" ref={cardRef}>
      <div
        className={cn(
          "cursor-pointer overflow-hidden relative card h-96 rounded-md shadow-xl w-full mx-auto flex flex-col justify-between p-4"
        )}
      >
        <video
          ref={videoRef}
          loop
          muted
          playsInline
          preload="none"
          poster="/footage/camping_poster.webp"
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src="/footage/camping_video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute w-full h-full top-0 left-0 transition duration-300 group-hover/card:bg-black opacity-60"></div>
        <div className="flex flex-row items-center space-x-4 z-10">
          <div className="h-10 w-10 rounded-full border-2 bg-brand-accent flex items-center justify-center text-white font-bold" />
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
