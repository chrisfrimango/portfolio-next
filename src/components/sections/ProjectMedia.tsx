"use client";

import { useEffect, useRef } from "react";

interface ProjectMediaProps {
  src: string;
  poster: string;
}

/** Project video that only loads and plays while in the viewport. */
export default function ProjectMedia({ src, poster }: ProjectMediaProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

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

  return (
    <div className="aspect-[16/10] overflow-hidden rounded-sm border border-brand-ink/10">
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
    </div>
  );
}
