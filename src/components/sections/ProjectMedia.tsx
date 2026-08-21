"use client";

import Image from "next/image";
import { useEffect, useRef, type ReactNode } from "react";
import { prefersReducedMotion } from "@/lib/motion";

interface ProjectMediaProps {
  /** Optional looping film. When absent, the poster is shown as a still frame. */
  src?: string;
  poster: string;
  alt?: string;
  /** Custom media (e.g. a canvas animation) rendered in the frame instead of film/poster. */
  children?: ReactNode;
}

/**
 * The cinematic frame: a looping video (when provided) that only plays in view,
 * or a still poster, plus two letterbox bars the stage timeline retracts
 * ("emerge from black") and a soft ink vignette for spotlight focus. This is a
 * dumb frame — all motion is driven by ProjectsMotion. Autoplay is gated off
 * under reduced motion, Save-Data and 2G so footage never costs the mobile
 * budget.
 */
export default function ProjectMedia({
  src,
  poster,
  alt = "",
  children,
}: ProjectMediaProps) {
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
  }, [src]);

  return (
    <div className="relative aspect-[16/10] overflow-hidden bg-brand-ink">
      {children ? (
        children
      ) : src ? (
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
      ) : (
        <Image
          src={poster}
          alt={alt}
          fill
          sizes="(max-width: 1024px) 88vw, 66vw"
          quality={75}
          className="object-cover"
        />
      )}

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
