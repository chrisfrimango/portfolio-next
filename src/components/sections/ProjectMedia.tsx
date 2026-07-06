"use client";

import { useEffect, useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { EASE, DUR, prefersReducedMotion } from "@/lib/motion";

interface ProjectMediaProps {
  src: string;
  poster: string;
}

/** Project video that only loads and plays while in the viewport, with an
 *  ink-panel masked reveal on first entrance. */
export default function ProjectMedia({ src, poster }: ProjectMediaProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        coverRef.current,
        { scaleY: 1, transformOrigin: "bottom" },
        {
          scaleY: 0,
          transformOrigin: "top",
          duration: DUR.act,
          ease: EASE.inOut,
          scrollTrigger: { trigger: frameRef.current, start: "top 80%", once: true },
        }
      );
    },
    { scope: frameRef }
  );

  return (
    <div
      ref={frameRef}
      className="relative aspect-[16/10] overflow-hidden rounded-sm border border-brand-ink/10"
    >
      <video
        ref={videoRef}
        loop
        muted
        playsInline
        preload="none"
        poster={poster}
        className="w-full h-full object-cover"
      >
        <source src={src} type="video/mp4" />
      </video>
      <div
        ref={coverRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-brand-ink"
      />
    </div>
  );
}
