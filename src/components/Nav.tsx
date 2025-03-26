"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuLinksRef = useRef<HTMLDivElement>(null);
  const tl = useRef<GSAPAnimation>(null);
  const pathname = usePathname();

  const navLinks = [
    { text: "Home", url: "/" },
    { text: "Projects", url: "/projects" },
    { text: "About", url: "/about" },
    { text: "Say hi", url: "/sayhi" },
  ];

  useGSAP(() => {
    gsap.set(menuRef.current, {
      yPercent: -100,
      opacity: 0,
    });

    gsap.set([...Array.from(menuLinksRef.current?.children || [])], {
      y: 40,
      opacity: 0,
    });
    // Create main timeline
    tl.current = gsap
      .timeline({ paused: true })
      .to(menuRef.current, {
        yPercent: 0,
        opacity: 1,
        duration: 1.3,
        ease: "power3.inOut",
      })
      .to(
        [...Array.from(menuLinksRef.current?.children || [])],
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
    setIsOpen(!isOpen);

    if (!isOpen) {
      tl.current?.play();
    } else {
      tl.current?.reverse();
    }
  };

  return (
    <nav className="fixed top-0 left-0 sm:px-4 w-full z-[90] bg-[#fcfcfc]">
      <div className="max-w-[1200px] mx-auto px-4 py-8 flex justify-between items-center">
        <Link
          href="/"
          className={`text-[#131313] text-sm font-light tracking-wider menu-item z-[1001] hover:text-[#ff3b00] ${
            isOpen ? "text-[#131313]" : ""
          }`}
        >
          Christoffer Friman
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-8">
          {navLinks.map((link, index) => (
            <Link
              key={index}
              href={link.url}
              className={cn(
                "text-[#131313] text-sm font-light transition-colors menu-item relative group",
                pathname === link.url && "border-b border-[#ff3b00]"
              )}
            >
              <span className="relative">
                {link.text}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#ff3b00] transition-all duration-300 group-hover:w-full" />
              </span>
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className={`lg:hidden text-[#131313] text-sm font-light tracking-wider menu-item z-[1001] relative group ${
            isOpen ? "hover:text-[#fcfcfc]" : ""
          }`}
        >
          {isOpen ? "Close." : "Menu."}
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#ff3b00] transition-all duration-300 group-hover:w-full" />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        ref={menuRef}
        className="lg:hidden fixed inset-0 bg-[#ff3b00] w-full flex flex-col justify-between z-[1000] h-full px-12 py-28 sm:p-28 border-b-2 border-[#131313]"
      >
        <div
          ref={menuLinksRef}
          className="flex flex-col text-left space-y-2 uppercase"
        >
          {navLinks.map((link, index) => (
            <Link
              key={index}
              href={link.url}
              onClick={toggleMenu}
              className="text-[#131313] text-4xl sm:text-6xl font-light hover:text-[#fcfcfc] transition-colors w-fit block"
            >
              {link.text}
            </Link>
          ))}
        </div>
        <div className="flex items-end w-full">
          <p className="text-[#131313] font-light text-xs uppercase">
            <span className="font-bold">Say hi</span> &rarr;{" "}
            <Link
              href="https://www.linkedin.com/in/christofferfriman/"
              className="hover:text-[#fcfcfc] transition-colors"
            >
              linkedin
            </Link>{" "}
            &rarr;{" "}
            <Link
              href="https://github.com/friman"
              className="hover:text-[#fcfcfc] transition-colors"
            >
              github
            </Link>{" "}
            &rarr;{" "}
            <Link
              href="mailto:christoffer@friman.se"
              className="hover:text-[#fcfcfc] transition-colors"
            >
              mail
            </Link>
          </p>
        </div>
      </div>
    </nav>
  );
}
