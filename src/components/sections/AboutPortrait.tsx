"use client";

import Image from "next/image";
import { useRef } from "react";
import surfart from "../../../public/images/surfart.webp";
import { gsap, useGSAP } from "@/lib/gsap";
import { EASE, DUR, prefersReducedMotion } from "@/lib/motion";

/**
 * Art-directed portrait shown whole (its true 2:3 ratio — no crop). An ink
 * panel wipes upward to uncover it as it scrolls into view.
 */
export default function AboutPortrait() {
  const frameRef = useRef<HTMLDivElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);

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
    <figure
      ref={frameRef}
      className="relative aspect-[2/3] overflow-hidden border border-brand-ink/10"
    >
      <Image
        src={surfart}
        alt="Christoffer Friman"
        fill
        sizes="(max-width: 1024px) 100vw, 42vw"
        quality={75}
        placeholder="blur"
        className="object-cover grayscale contrast-[1.05]"
      />
      {/* Warm wash + grain tie the image to the day cycle */}
      <div className="pointer-events-none absolute inset-0 bg-brand-accent/5 mix-blend-multiply" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      {/* Reveal cover */}
      <div
        ref={coverRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-brand-ink"
      />
      <figcaption className="absolute bottom-3 left-3 font-mono text-meta uppercase text-brand-paper/90 mix-blend-difference">
        Trollhättan
      </figcaption>
    </figure>
  );
}
