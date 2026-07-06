"use client";

import Image from "next/image";
import { useRef } from "react";
import surfart from "../../../public/images/surfart.webp";
import { gsap, useGSAP } from "@/lib/gsap";
import { EASE, DUR, prefersReducedMotion } from "@/lib/motion";

/**
 * Art-directed portrait with a masked reveal: an ink panel wipes upward to
 * uncover the image while it settles from a slow zoom, then the image drifts
 * with a gentle in-frame parallax as you keep scrolling.
 */
export default function AboutPortrait() {
  const frameRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      // Masked reveal — cover wipes up, image settles from a zoom
      gsap
        .timeline({
          scrollTrigger: { trigger: frameRef.current, start: "top 80%", once: true },
        })
        .set(coverRef.current, { scaleY: 1, transformOrigin: "bottom" })
        .fromTo(
          imageRef.current,
          { scale: 1.25 },
          { scale: 1, duration: DUR.act, ease: EASE.inOut },
          0
        )
        .to(
          coverRef.current,
          {
            scaleY: 0,
            transformOrigin: "top",
            duration: DUR.act,
            ease: EASE.inOut,
          },
          0
        );

      // In-frame parallax
      gsap.fromTo(
        imageRef.current,
        { yPercent: -6 },
        {
          yPercent: 6,
          ease: "none",
          scrollTrigger: {
            trigger: frameRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    },
    { scope: frameRef }
  );

  return (
    <figure
      ref={frameRef}
      className="lg:col-start-7 lg:col-span-6 relative aspect-[4/3] overflow-hidden rounded-sm border border-brand-ink/10"
    >
      <div ref={imageRef} className="absolute inset-0">
        <Image
          src={surfart}
          alt="Christoffer Friman"
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          quality={70}
          className="object-cover grayscale contrast-[1.05]"
        />
      </div>
      {/* Grain + warm wash tie the photo to the day cycle */}
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
      <figcaption className="absolute bottom-3 left-3 text-meta font-medium uppercase text-brand-paper/90 mix-blend-difference">
        Off duty &mdash; Stockholm
      </figcaption>
    </figure>
  );
}
