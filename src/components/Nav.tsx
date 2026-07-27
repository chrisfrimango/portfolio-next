"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { useLenis, useScrollTo } from "@/components/SmoothScroll";
import { prefersReducedMotion } from "@/lib/motion";

const NAV_LINKS = [
  { text: "About", url: "#about", section: "about" },
  { text: "Work", url: "#projects", section: "projects" },
  { text: "Say hi", url: "#sayhi", section: "sayhi" },
];

/**
 * Minimalist distributed nav — a mono wordmark on the left, whisper-thin
 * "/ LABEL" links on the right. Colors ride the day-cycle tokens (light over
 * the night hero, dark over paper day). The accent lives only in the "/" tick
 * and the active label; no dots. Mobile opens a quiet token-coloured sheet,
 * never a colour flood.
 */
export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("hero");
  const sheetRef = useRef<HTMLDivElement>(null);
  const sheetItemsRef = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  const pathname = usePathname();
  const isHome = pathname === "/";
  const lenis = useLenis();
  const scrollTo = useScrollTo();

  const hrefFor = (url: string) => (isHome ? url : `/${url}`);

  // Scrollspy — one trigger per section marks its link active.
  useGSAP(
    () => {
      ["hero", "about", "projects", "sayhi"].forEach((section) => {
        const el = document.getElementById(section);
        if (!el) return;
        ScrollTrigger.create({
          trigger: el,
          start: "top center",
          end: "bottom center",
          onToggle: (self) => {
            if (self.isActive) setActiveLink(section);
          },
        });
      });
    },
    { dependencies: [pathname], revertOnUpdate: true }
  );

  // Mobile sheet timeline — one paused timeline, played/reversed (interruptible).
  useGSAP(
    () => {
      if (!sheetRef.current) return;
      const reduce = prefersReducedMotion();
      const items = Array.from(sheetItemsRef.current?.children ?? []);

      gsap.set(sheetRef.current, { yPercent: -100 });
      gsap.set(items, { y: reduce ? 0 : 24, opacity: 0 });

      tl.current = gsap
        .timeline({ paused: true })
        .to(sheetRef.current, {
          yPercent: 0,
          duration: reduce ? 0.2 : 0.9,
          ease: "power2.inOut",
        })
        .to(
          items,
          {
            y: 0,
            opacity: 1,
            duration: reduce ? 0.2 : 0.6,
            ease: "power3.out",
            stagger: reduce ? 0 : 0.08,
          },
          reduce ? "<" : "-=0.55"
        );
    },
    { dependencies: [pathname] }
  );

  const setOpen = (next: boolean) => {
    setIsOpen(next);
    if (next) {
      tl.current?.play();
      lenis?.stop();
    } else {
      tl.current?.reverse();
      lenis?.start();
    }
  };

  // Escape closes the sheet
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const onNavClick = (e: React.MouseEvent, section: string) => {
    if (isOpen) setOpen(false);
    if (!isHome) return; // let the browser navigate to "/#section"
    e.preventDefault();
    const el = document.getElementById(section);
    if (!el) return;
    setActiveLink(section);
    scrollTo(el);
  };

  const linkClass = (section: string) =>
    cn(
      "font-mono text-[11px] tracking-[0.18em] uppercase transition-colors duration-300",
      activeLink === section
        ? "text-brand-ink"
        : "text-brand-gray hover:text-brand-ink"
    );

  return (
    <header className="fixed top-0 left-0 w-full z-[90]">
      <div className="relative z-[1002] flex items-center justify-between px-5 sm:px-8 lg:px-12 py-5">
        {/* Wordmark = home */}
        <Link
          href={hrefFor("#hero")}
          onClick={(e) => onNavClick(e, "hero")}
          className="font-mono text-[11px] tracking-[0.18em] uppercase text-brand-ink hover:text-brand-accent transition-colors"
        >
          Christoffer Friman
        </Link>

        {/* Desktop / tablet distributed links */}
        <nav className="hidden sm:flex items-center gap-6 lg:gap-9">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.section}
              href={hrefFor(l.url)}
              onClick={(e) => onNavClick(e, l.section)}
              className={linkClass(l.section)}
            >
              <span className="text-brand-accent">/</span> {l.text}
            </Link>
          ))}
        </nav>

        {/* Mobile trigger */}
        <button
          onClick={() => setOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          className="sm:hidden font-mono text-[11px] tracking-[0.18em] uppercase text-brand-ink"
        >
          {isOpen ? "Close" : "Menu"}
        </button>
      </div>

      {/* Mobile sheet — quiet, token-coloured, editorial numbered index */}
      <div
        ref={sheetRef}
        inert={!isOpen}
        className="sm:hidden fixed inset-0 z-[1001] bg-brand-paper flex flex-col justify-between px-6 pt-24 pb-10"
      >
        <div ref={sheetItemsRef} className="flex flex-col gap-1">
          {NAV_LINKS.map((l, i) => (
            <Link
              key={l.section}
              href={hrefFor(l.url)}
              onClick={(e) => onNavClick(e, l.section)}
              className="flex items-baseline gap-4 py-1 font-display text-title text-brand-ink"
            >
              <span className="font-mono text-meta text-brand-accent">
                0{i + 1}
              </span>
              {l.text}
            </Link>
          ))}
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-1 font-mono text-[11px] tracking-[0.15em] uppercase text-brand-gray">
          <a
            href="https://www.linkedin.com/in/christoffer-friman/"
            className="hover:text-brand-ink transition-colors"
          >
            LinkedIn
          </a>
          <a
            href="https://github.com/chrisfrimango"
            className="hover:text-brand-ink transition-colors"
          >
            GitHub
          </a>
          <a
            href="mailto:christoffer.k.friman@gmail.com"
            className="hover:text-brand-ink transition-colors"
          >
            Email
          </a>
        </div>
      </div>
    </header>
  );
}
