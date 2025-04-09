"use client";

import Image from "next/image";
import AnimationBox from "./ui/AnimationBox";
import surfart from "../../public/images/surfart.webp";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

export default function HeroHeader() {
  const mobileTextRef = useRef<HTMLDivElement>(null);
  const desktopTextRef = useRef<HTMLDivElement>(null);

  // GSAP animation for text elements
  useGSAP(() => {
    // Animation for mobile text
    if (mobileTextRef.current) {
      gsap.fromTo(
        mobileTextRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power2.out", delay: 0.3 }
      );
    }

    // Animation for desktop text
    if (desktopTextRef.current) {
      gsap.fromTo(
        desktopTextRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power2.out", delay: 0.5 }
      );
    }
  }, []);
  return (
    <div id="hero" className="w-full h-screen relative">
      {/* Mobile view - full screen image and text below */}
      <div className="lg:hidden w-full h-full flex flex-col">
        <div className="relative h-[70vh] w-full">
          <Image
            src={surfart}
            alt="Developer"
            fill
            quality={100}
            className="object-cover object-top"
            priority
          />
        </div>
        {/* Mobile text below image */}
        <div className="h-[30vh] flex flex-col justify-between px-4 py-3">
          <div
            ref={mobileTextRef}
            className="leading-[1] text-left text-4xl sm:text-6xl md:text-7xl lg:text-7xl font-extrabold opacity-0"
          >
            HEY! IM FRIMAN, DEVELOPER WITH BUSINESS ACCUMEN
          </div>

          {/* Animation box for mobile view - positioned to be partially visible outside viewport */}
          <div className="flex justify-center relative -mb-4 translate-y-[40%]">
            <AnimationBox
              position="hero"
              className="cursor-pointer opacity-90 w-[12px] h-[80px]"
            />
          </div>
        </div>
      </div>

      {/* Desktop view - image positioned to the right */}
      <div className="hidden lg:block relative h-full">
        <div className="absolute top-0 right-0 w-[55vw] max-w-[800px] h-[80vh] overflow-hidden">
          <div className="relative w-full h-full">
            <Image
              src={surfart}
              alt="Developer"
              fill
              quality={100}
              className="object-contain object-right"
              priority
            />
          </div>
        </div>

        {/* Desktop text at the bottom */}
        <div className="absolute bottom-10 left-0 right-0 px-4 z-10">
          <div
            ref={desktopTextRef}
            className="leading-[1] text-left text-3xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-9xl font-black max-w-full opacity-0"
          >
            HEY! IM FRIMAN, DEVELOPER WITH BUSINESS ACCUMEN
          </div>

          {/* Animation box to entice scrolling - positioned partially outside viewport */}
          <div className="flex justify-center mt-8 sm:mt-0 absolute bottom-[-40px] left-0 right-0">
            <AnimationBox position="hero" className="cursor-pointer h-[80px]" />
          </div>
        </div>
      </div>
    </div>
  );
}
