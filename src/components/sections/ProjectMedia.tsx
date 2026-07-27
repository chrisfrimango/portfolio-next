"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";

interface ProjectMediaProps {
  src: string;
  poster: string;
}

/**
 * The cinematic frame: a video that only plays in view, two letterbox bars
 * that the stage timeline retracts ("emerge from black"), and a soft ink
 * vignette for spotlight focus. This is a dumb frame — all motion is driven
 * by ProjectsMotion. Autoplay is gated off under reduced motion, Save-Data
 * and 2G so the footage never costs the mobile budget.
 */
export default function ProjectMedia({ src, poster }: ProjectMediaProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const conn = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }
    ).connection;
    const blocked =
      prefersReducedMotion() ||
      conn?.saveData === true ||
      /(^|\b)(slow-)?2g/.test(conn?.effectiveType ?? "");
    if (blocked) return; // poster only

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.25 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative aspect-[16/10] overflow-hidden bg-brand-ink">
      <video
        ref={videoRef}
        loop
        muted
        playsInline
        preload="none"
        poster={poster}
        className="h-full w-full object-cover"
      >
        <source src={src} type="video/mp4" />
      </video>

      {/* Ink vignette — spotlight focus, faded out as the stage settles */}
      <div
        data-vignette
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 52%, rgba(15,15,15,0.6) 100%)",
        }}
      />

      {/* Letterbox bars — default open (scaleY 0) so no-JS/reduced-motion show
          the footage; the desktop stage retracts them from a covered start */}
      <div
        data-letterbox
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 h-1/2 w-full bg-brand-ink"
        style={{ transformOrigin: "top", transform: "scaleY(0)" }}
      />
      <div
        data-letterbox
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 h-1/2 w-full bg-brand-ink"
        style={{ transformOrigin: "bottom", transform: "scaleY(0)" }}
      />
    </div>
  );
}
