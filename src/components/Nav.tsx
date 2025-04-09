"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import ServicesAnimation from "@/components/ui/ServicesAnimation";

interface NavLinkProps {
  link: {
    text: string;
    url: string;
    section: string;
  };
  pathname: string;
  handleNavClick: (e: React.MouseEvent, sectionId: string) => void;
  isActive: boolean;
  setActiveLink: (section: string) => void;
}

const NavLink = ({
  link,
  pathname,
  handleNavClick,
  isActive,
  setActiveLink,
}: NavLinkProps) => {
  const linkRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const cloneRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!linkRef.current) return;

    const element = linkRef.current;
    const textElement = textRef.current;
    const textClone = cloneRef.current;

    if (!textElement || !textClone) return;

    // Set initial states
    gsap.set(textClone, {
      y: -50,
      opacity: 0,
      rotationX: -90, // Add some 3D rotation
    });

    // Create hover animations
    const onEnter = () => {
      // Timeline for coordinated animation
      const tl = gsap.timeline();

      // First, make the original text disappear
      tl.to(textElement, {
        y: 50,
        opacity: 0,
        rotationX: 90, // Add 3D rotation on exit
        duration: 0.35,
        ease: "power2.in",
      });

      // Then, bring in the clone from above with a more dynamic effect
      tl.to(
        textClone,
        {
          y: 0,
          opacity: 1,
          rotationX: 0, // Reset rotation
          duration: 0.35,
          ease: "back.out(1.7)", // More bouncy effect
        },
        "-=0.15"
      ); // More overlap for smoother transition
    };

    const onLeave = () => {
      // Timeline for coordinated animation
      const tl = gsap.timeline();

      // First, make the clone disappear upward
      tl.to(textClone, {
        y: -50,
        opacity: 0,
        rotationX: -90, // Add 3D rotation on exit
        duration: 0.35,
        ease: "power2.in",
      });

      // Then, bring back the original text with a bounce
      tl.to(
        textElement,
        {
          y: 0,
          opacity: 1,
          rotationX: 0, // Reset rotation
          duration: 0.35,
          ease: "back.out(1.7)", // More bouncy effect
        },
        "-=0.15"
      ); // More overlap for smoother transition
    };

    element.addEventListener("mouseenter", onEnter);
    element.addEventListener("mouseleave", onLeave);

    return () => {
      element.removeEventListener("mouseenter", onEnter);
      element.removeEventListener("mouseleave", onLeave);
    };
  }, [pathname, link.url]);

  return (
    <Link
      href={link.url}
      onClick={(e) => {
        handleNavClick(e, link.section);
        setActiveLink(link.section);
      }}
      className={cn(
        "text-gray-400 text-3xl text-nowrap sm:text-2xl md:text-2xl lg:text-2xl xl:text-3xl 2xl:text-4xl uppercase font-bold menu-item relative group",
        isActive && "text-black"
      )}
    >
      <div ref={linkRef} className="relative overflow-hidden perspective-1000">
        {/* Original text that will disappear */}
        <span
          ref={textRef}
          className="text-content relative inline-block backface-hidden"
        >
          {link.text}
          {/* Red dot that appears on hover */}
          <span
            className={cn(
              "ml-1 inline-block transition-all duration-300 opacity-0 group-hover:opacity-100",
              isActive && "opacity-100"
            )}
          >
            <span className="inline-block w-3 h-3 bg-[#ff3b00] rounded-full" />
          </span>
        </span>

        {/* Clone text that will appear from above */}
        <span
          ref={cloneRef}
          className="text-clone absolute top-0 left-0 inline-block text-black backface-hidden"
        >
          {link.text}
          {/* Red dot that is always visible on the clone */}
          <span className="ml-1 inline-block">
            <span className="inline-block w-3 h-3 bg-[#ff3b00] rounded-full" />
          </span>
        </span>
      </div>
    </Link>
  );
};

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeLink, setActiveLink] = useState<string>("hero"); // Default to hero section
  const [disableScrollDetection, setDisableScrollDetection] = useState(false);
  const [showServicesAnimation, setShowServicesAnimation] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuLinksRef = useRef<HTMLDivElement>(null);
  const tl = useRef<GSAPAnimation>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();

  const navLinks = useMemo(
    () => [
      { text: "Home", url: "#hero", section: "hero" },
      { text: "About", url: "#about", section: "about" },
      { text: "Projects", url: "#projects", section: "projects" },
      { text: "Say hi", url: "#sayhi", section: "sayhi" },
    ],
    []
  );

  // Function to check which section is in the viewport and update active link
  const updateActiveSection = useCallback(() => {
    // Get all sections
    const sections = navLinks
      .map((link) => document.getElementById(link.section))
      .filter(Boolean);

    // Find the section that is most visible in the viewport
    let mostVisibleSection: string | null = null;
    let maxVisibility = 0;

    // Set a minimum threshold for visibility (at least 30% of the section must be visible)
    const visibilityThreshold = 0.3;

    sections.forEach((section) => {
      if (section) {
        // Add null check
        const rect = section.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Calculate how much of the section is visible in the viewport
        const visibleHeight =
          Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
        const sectionHeight = section.offsetHeight;
        const visibility =
          visibleHeight > 0 ? visibleHeight / sectionHeight : 0;

        // Give more weight to sections at the top of the viewport
        // This helps ensure we select the section the user is entering, not leaving
        const topPosition = rect.top;
        const positionFactor =
          topPosition >= 0 && topPosition < windowHeight / 2 ? 1.5 : 1;
        const effectiveVisibility = visibility * positionFactor;

        if (effectiveVisibility > maxVisibility) {
          maxVisibility = effectiveVisibility;
          mostVisibleSection = section.id;
        }
      }
    });

    // Only update if we have a clear winner above the threshold
    if (mostVisibleSection && maxVisibility >= visibilityThreshold) {
      // Ensure we're only setting the active link if it's different from the current one
      // This prevents unnecessary re-renders
      if (mostVisibleSection) {
        // Only update if we have a valid section ID
        // Use a type assertion to tell TypeScript that mostVisibleSection is a string here
        // This is safe because we've already checked that it's not null
        setActiveLink((prevActiveLink) =>
          prevActiveLink !== mostVisibleSection
            ? (mostVisibleSection as string)
            : prevActiveLink
        );
      }
    }
  }, [navLinks, setActiveLink]);

  // Add scroll event listener to update active section
  useEffect(() => {
    let scrollTimer: number | null = null;

    // Use a debounced version of the function to improve performance and reduce multiple updates
    const debouncedUpdateActiveSection = () => {
      // Skip if scroll detection is disabled (during manual navigation)
      if (disableScrollDetection) return;

      // Clear any existing timer
      if (scrollTimer) {
        window.cancelAnimationFrame(scrollTimer);
      }

      // Set a new timer
      scrollTimer = window.requestAnimationFrame(() => {
        updateActiveSection();
        scrollTimer = null;
      });
    };

    window.addEventListener("scroll", debouncedUpdateActiveSection);

    // Initial check after a short delay to ensure DOM is ready
    const initialCheckTimer = setTimeout(() => {
      updateActiveSection();
    }, 100);

    return () => {
      window.removeEventListener("scroll", debouncedUpdateActiveSection);
      // Clean up any timeouts when component unmounts
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      clearTimeout(initialCheckTimer);
      if (scrollTimer) {
        window.cancelAnimationFrame(scrollTimer);
      }
    };
  }, [updateActiveSection, disableScrollDetection]); // Now we can safely use updateActiveSection as a dependency

  useGSAP(() => {
    gsap.set(menuRef.current, {
      yPercent: -100,
      opacity: 0,
    });

    gsap.set([...Array.from(menuLinksRef.current?.children || [])], {
      y: 40,
      opacity: 0,
    });

    // Set up the "OPEN FOR WORK" animation
    const openForWorkText = document.querySelector(".open-for-work-text");
    const openForWorkClone = document.querySelector(".open-for-work-clone");

    if (openForWorkText && openForWorkClone) {
      // Set initial state
      gsap.set(openForWorkClone, {
        y: -50,
        opacity: 0,
        rotationX: -90,
      });

      // Create hover animations
      const openForWorkContainer = openForWorkText?.parentElement;

      if (openForWorkContainer) {
        openForWorkContainer.addEventListener("mouseenter", () => {
          // Timeline for coordinated animation
          const tl = gsap.timeline();

          // First, make the original text disappear
          tl.to(openForWorkText, {
            y: 50,
            opacity: 0,
            rotationX: 90,
            duration: 0.35,
            ease: "power2.in",
          });

          // Then, bring in the clone from above
          tl.to(
            openForWorkClone,
            {
              y: 0,
              opacity: 1,
              rotationX: 0,
              duration: 0.35,
              ease: "back.out(1.7)",
            },
            "-=0.15"
          );
        });

        openForWorkContainer.addEventListener("mouseleave", () => {
          // Timeline for coordinated animation
          const tl = gsap.timeline();

          // First, make the clone disappear upward
          tl.to(openForWorkClone, {
            y: -50,
            opacity: 0,
            rotationX: -90,
            duration: 0.35,
            ease: "power2.in",
          });

          // Then, bring back the original text
          tl.to(
            openForWorkText,
            {
              y: 0,
              opacity: 1,
              rotationX: 0,
              duration: 0.35,
              ease: "back.out(1.7)",
            },
            "-=0.15"
          );
        });
      }
    }

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

  const handleNavClick = (e: React.MouseEvent, sectionId: string) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      // Close mobile menu if open
      if (isOpen) {
        toggleMenu();
      }

      // Set active link - this is the only place we manually set it
      // Clear any existing timeouts to prevent race conditions
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Set active link immediately
      setActiveLink(sectionId);

      // Temporarily disable scroll detection to avoid conflicts
      setDisableScrollDetection(true);

      // Smooth scroll to section
      element.scrollIntoView({ behavior: "smooth" });

      // Re-enable scroll detection after scrolling is likely complete
      scrollTimeoutRef.current = setTimeout(() => {
        setDisableScrollDetection(false);
      }, 1000);
    }
  };

  return (
    <div className="w-full relative">
      {/* Navigation bar */}
      <nav
        className={`fixed border-b-2 border-black lg:border-none bg-white ${
          activeLink === "hero" ? "lg:bg-transparent" : "lg:bg-#fcfcfc"
        } top-0 left-0 w-full z-[90]`}
      >
        {/* Debug: {console.log('Active Link:', activeLink)} */}
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
                  pathname={pathname}
                  handleNavClick={handleNavClick}
                  isActive={activeLink === link.section}
                  setActiveLink={setActiveLink}
                />
              ))}
            </div>
            <div className="relative">
              <div
                className="relative overflow-hidden perspective-1000 group cursor-pointer"
                onClick={() => setShowServicesAnimation(!showServicesAnimation)}
              >
                <span className="text-gray-300 text-nowrap text-2xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl 2xl:text-4xl pr-2 uppercase font-bold relative inline-block backface-hidden open-for-work-text">
                  OPEN TO WORK
                  <span className="ml-1 inline-block transition-all duration-300 opacity-0 group-hover:opacity-100">
                    <span className="inline-block w-2 h-2 bg-[#ff3b00] rounded-full" />
                  </span>
                </span>
                <span className="absolute top-0 left-0 text-black text-nowrap text-2xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl pr-2 uppercase font-bold inline-block backface-hidden open-for-work-clone">
                  OPEN TO WORK
                  <span className="ml-1 inline-block">
                    <span className="inline-block w-2 h-2 bg-[#ff3b00] rounded-full" />
                  </span>
                </span>
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
            className={`lg:hidden text-sm font-light tracking-wider menu-item z-[1002] relative group text-[#131313]`}
          >
            {isOpen ? "Close" : "Menu"}
            <span className="inline-block ml-1">
              <span className="inline-block w-1 h-1 bg-[#ff3b00] rounded-full" />
            </span>
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <div
          ref={menuRef}
          className="lg:hidden fixed inset-0 bg-[#ff3b00] w-full flex flex-col justify-between z-[1001] h-full px-12 py-28 lg:p-28 border-b-2 border-[#131313]"
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
                className={`text-[#131313] text-4xl lg:text-6xl font-light hover:text-[#fcfcfc] transition-colors w-fit block ${
                  activeLink === link.section ? "font-bold" : ""
                }`}
              >
                {link.text}
                {/* Red dot for mobile menu */}
                {activeLink === link.section && (
                  <span className="ml-1 inline-block">
                    <span className="inline-block w-2 h-2 bg-[#fcfcfc] rounded-full" />
                  </span>
                )}
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
    </div>
  );
}
