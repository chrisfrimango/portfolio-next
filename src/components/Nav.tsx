"use client";

import { useState, useRef, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import ServicesAnimation from "@/components/ui/ServicesAnimation";
import FlipHover from "@/components/ui/FlipHover";
import { useLenis, useScrollTo } from "@/components/SmoothScroll";

interface NavLinkProps {
  link: {
    text: string;
    url: string;
    section: string;
  };
  handleNavClick: (e: React.MouseEvent, sectionId: string) => void;
  isActive: boolean;
}

const NavLink = ({ link, handleNavClick, isActive }: NavLinkProps) => (
  <Link
    href={link.url}
    onClick={(e) => handleNavClick(e, link.section)}
    className={cn(
      "text-gray-400 text-3xl text-nowrap sm:text-2xl md:text-2xl lg:text-2xl xl:text-3xl 2xl:text-4xl uppercase font-bold menu-item relative group",
      isActive && "text-black"
    )}
  >
    <FlipHover
      front={
        <>
          {link.text}
          {/* Red dot that appears on hover or when active */}
          <span
            className={cn(
              "ml-1 inline-block transition-all duration-300 opacity-0 group-hover:opacity-100",
              isActive && "opacity-100"
            )}
          >
            <span className="inline-block w-3 h-3 bg-brand-accent rounded-full" />
          </span>
        </>
      }
      back={
        <span className="text-black">
          {link.text}
          {/* Red dot that is always visible on the clone */}
          <span className="ml-1 inline-block">
            <span className="inline-block w-3 h-3 bg-brand-accent rounded-full" />
          </span>
        </span>
      }
    />
  </Link>
);

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeLink, setActiveLink] = useState<string>("hero");
  const [showServicesAnimation, setShowServicesAnimation] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuLinksRef = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const pathname = usePathname();
  const lenis = useLenis();
  const scrollTo = useScrollTo();

  const navLinks = useMemo(
    () => [
      { text: "Home", url: "#hero", section: "hero" },
      { text: "About", url: "#about", section: "about" },
      { text: "Projects", url: "#projects", section: "projects" },
      { text: "Say hi", url: "#sayhi", section: "sayhi" },
    ],
    []
  );

  // Scrollspy: one ScrollTrigger per section marks the link active while
  // that section spans the viewport center. Updates via Lenis' scroll events.
  useGSAP(
    () => {
      navLinks.forEach(({ section }) => {
        const element = document.getElementById(section);
        if (!element) return;

        ScrollTrigger.create({
          trigger: element,
          start: "top center",
          end: "bottom center",
          onToggle: (self) => {
            if (self.isActive) setActiveLink(section);
          },
        });
      });
    },
    { dependencies: [pathname, navLinks], revertOnUpdate: true }
  );

  // Mobile menu open/close timeline
  useGSAP(() => {
    gsap.set(menuRef.current, {
      yPercent: -100,
      opacity: 0,
    });

    const menuItems = Array.from(menuLinksRef.current?.children || []);
    gsap.set(menuItems, { y: 40, opacity: 0 });

    tl.current = gsap
      .timeline({ paused: true })
      .to(menuRef.current, {
        yPercent: 0,
        opacity: 1,
        duration: 1.3,
        ease: "power3.inOut",
      })
      .to(
        menuItems,
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.2,
          ease: "power2.out",
        },
        "-=0.4"
      );
  });

  const toggleMenu = () => {
    const nextOpen = !isOpen;
    setIsOpen(nextOpen);

    if (nextOpen) {
      tl.current?.play();
      lenis?.stop();
    } else {
      tl.current?.reverse();
      lenis?.start();
    }
  };

  const handleNavClick = (e: React.MouseEvent, sectionId: string) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (!element) return;

    if (isOpen) {
      toggleMenu();
    }

    setActiveLink(sectionId);
    scrollTo(element);
  };

  return (
    <div className="w-full relative">
      {/* Navigation bar */}
      <nav
        className={`fixed border-b-2 border-black lg:border-none bg-white ${
          activeLink === "hero" ? "lg:bg-transparent" : "lg:bg-brand-paper"
        } top-0 left-0 w-full z-[90]`}
      >
        <div className="relative z-[1002] mx-auto px-4 py-4 flex items-center justify-between">
          {/* Empty div for spacing on mobile */}
          <div className="lg:hidden"></div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center justify-between w-full">
            <div className="flex items-center space-x-8">
              {navLinks.map((link, index) => (
                <NavLink
                  key={index}
                  link={link}
                  handleNavClick={handleNavClick}
                  isActive={activeLink === link.section}
                />
              ))}
            </div>
            <div className="relative">
              <div
                className="group cursor-pointer"
                onClick={() => setShowServicesAnimation(!showServicesAnimation)}
              >
                <FlipHover
                  front={
                    <span className="text-gray-300 text-nowrap text-2xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl 2xl:text-4xl pr-2 uppercase font-bold">
                      OPEN TO WORK
                      <span className="ml-1 inline-block transition-all duration-300 opacity-0 group-hover:opacity-100">
                        <span className="inline-block w-2 h-2 bg-brand-accent rounded-full" />
                      </span>
                    </span>
                  }
                  back={
                    <span className="text-black text-nowrap text-2xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl pr-2 uppercase font-bold">
                      OPEN TO WORK
                      <span className="ml-1 inline-block">
                        <span className="inline-block w-2 h-2 bg-brand-accent rounded-full" />
                      </span>
                    </span>
                  }
                />
              </div>
              <ServicesAnimation
                isVisible={showServicesAnimation}
                onClose={() => setShowServicesAnimation(false)}
              />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className={`lg:hidden text-sm font-light tracking-wider menu-item z-[1002] relative group text-brand-ink`}
          >
            {isOpen ? "Close" : "Menu"}
            <span className="inline-block ml-1">
              <span className="inline-block w-1 h-1 bg-brand-accent rounded-full" />
            </span>
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <div
          ref={menuRef}
          className="lg:hidden fixed inset-0 bg-brand-accent w-full flex flex-col justify-between z-[1001] h-full px-12 py-28 lg:p-28 border-b-2 border-brand-ink"
        >
          <div
            ref={menuLinksRef}
            className="flex flex-col text-left space-y-2 uppercase"
          >
            {navLinks.map((link, index) => (
              <Link
                key={index}
                href={link.url}
                onClick={(e) => handleNavClick(e, link.section)}
                className={`text-brand-ink text-4xl lg:text-6xl font-light hover:text-brand-paper transition-colors w-fit block ${
                  activeLink === link.section ? "font-bold" : ""
                }`}
              >
                {link.text}
                {/* Red dot for mobile menu */}
                {activeLink === link.section && (
                  <span className="ml-1 inline-block">
                    <span className="inline-block w-2 h-2 bg-brand-paper rounded-full" />
                  </span>
                )}
              </Link>
            ))}
          </div>
          <div className="flex items-end w-full">
            <p className="text-brand-ink font-light text-xs uppercase">
              <span className="font-bold">Say hi</span> &rarr;{" "}
              <Link
                href="https://www.linkedin.com/in/christoffer-friman/"
                className="hover:text-brand-paper transition-colors"
              >
                linkedin
              </Link>{" "}
              &rarr;{" "}
              <Link
                href="https://github.com/chrisfrimango"
                className="hover:text-brand-paper transition-colors"
              >
                github
              </Link>{" "}
              &rarr;{" "}
              <Link
                href="mailto:christoffer.k.friman@gmail.com"
                className="hover:text-brand-paper transition-colors"
              >
                mail
              </Link>
            </p>
          </div>
        </div>
      </nav>
    </div>
  );
}
