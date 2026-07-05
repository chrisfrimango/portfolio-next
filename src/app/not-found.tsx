"use client";

import Link from "next/link";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

export default function NotFound() {
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      contentRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }
    );
  });

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div ref={contentRef} className="text-center opacity-0">
        <h1 className="text-brand-accent text-4xl mb-8">Oops! Page not found</h1>
        <Link
          href="/"
          className="text-brand-gray hover:text-brand-accent transition-colors duration-300"
        >
          Return to home
        </Link>
      </div>
    </div>
  );
}
