"use client";

import React, { useRef } from "react";
import { TextSectionProps } from "@/types/aboutTypes";
import ServicesAnimation from "@/components/ui/ServicesAnimation";
import { useState } from "react";
import Accordion from "@/components/ui/Accordion";
import aboutData from "@/data/about.json";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const TextSection: React.FC<TextSectionProps> = ({
  children,
  title,
  italicText,
  descriptionSection1,
  descriptionSection2,
  descriptionSection3,
}) => {
  const [showServicesAnimation, setShowServicesAnimation] = useState(false);

  // Refs for animation targets
  const titleRef = useRef<HTMLHeadingElement>(null);
  const section1Ref = useRef<HTMLDivElement>(null);
  const section2Ref = useRef<HTMLDivElement>(null);
  const section3Ref = useRef<HTMLDivElement>(null);
  const softValuesRef = useRef<HTMLDivElement>(null);

  // Register ScrollTrigger plugin
  gsap.registerPlugin(ScrollTrigger);

  // GSAP animations
  useGSAP(() => {
    // Initial animation for title and first section
    if (titleRef.current && section1Ref.current) {
      gsap.fromTo(
        titleRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
      );

      gsap.fromTo(
        section1Ref.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out", delay: 0.3 }
      );
    }

    // Scroll-triggered animations for other sections
    const sections = [section2Ref, section3Ref, softValuesRef];

    sections.forEach((ref) => {
      if (ref.current) {
        gsap.fromTo(
          ref.current,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ref.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    });
  }, []);
  return (
    <div className="w-full flex flex-col gap-8 mx-auto max-w-4xl xl:max-w-8xl 2xl:max-w-screen-2xl px-4 sm:px-8">
      <section className="mb-4 text-left sm:text-center z-10 w-full">
        <h1
          ref={titleRef}
          className="text-[#131313] text-4xl sm:text-7xl font-extrabold uppercase leading-[1.1] opacity-0"
        >
          {title}{" "}
          {italicText && (
            <span className="text-[#131313] font-light  text-sm sm:text-xl  px-1">
              {italicText}
            </span>
          )}
        </h1>
        <div
          ref={section1Ref}
          className="text-2xl pt-2 sm:pt-4 sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl uppercase font-bold md:font-extrabold text-[#131313] leading-[1.1] tracking-wide w-full opacity-0"
        >
          {descriptionSection1?.split("\n\n").map((paragraph, index) => (
            <p key={index} className="mb-4">
              {paragraph}
            </p>
          ))}
        </div>
      </section>
      {children}
      <section className="mb-10 text-left sm:text-center w-full">
        <span className="text-[#131313] font-light text-sm sm:text-xl">AI</span>
        <div
          ref={section2Ref}
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl uppercase font-bold md:font-extrabold text-[#131313] mt-6 sm:mt-10 leading-[1.1] tracking-wide w-full opacity-0"
        >
          {descriptionSection2?.split("\n\n").map((paragraph, index) => (
            <p key={index} className="mb-4">
              {paragraph}
            </p>
          ))}
        </div>
      </section>
      {/* Technical section - Accordion for both mobile and desktop */}
      <section
        ref={section3Ref}
        className="mb-10 w-full border-t border-gray-200 pt-4 opacity-0"
      >
        {descriptionSection3 && (
          <Accordion title="Technical" initiallyOpen={true}>
            <div className="text-2xl sm:text-4xl md:text-6xl uppercase text-center font-normal text-[#131313] leading-[1.1] tracking-wide w-full">
              {descriptionSection3?.split("\n\n").map((paragraph, index) => (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </Accordion>
        )}
      </section>

      {/* Soft values section - Always an accordion */}
      <section
        ref={softValuesRef}
        className="mb-10 w-full border-t border-gray-200 pt-4 opacity-0"
      >
        <Accordion title="Soft skills" initiallyOpen={true}>
          <div className="text-2xl sm:text-4xl md:text-6xl uppercase text-center font-normal italic text-[#131313] leading-[1.1] tracking-wide w-full">
            {aboutData.content[3]?.description
              .split("\n\n")
              .map((paragraph, index) => (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              ))}
          </div>
        </Accordion>
      </section>

      <section className="mb-10 text-left sm:hidden sm:text-center ">
        <div className="flex flex-col items-start">
          <span
            onClick={() => setShowServicesAnimation(!showServicesAnimation)}
            className="border border-black rounded-3xl text-[#131313] font-light text-sm sm:text-lg px-2 cursor-pointer hover:bg-black hover:text-white transition-colors"
          >
            OPEN TO WORK
          </span>
          <ServicesAnimation
            isVisible={showServicesAnimation}
            onClose={() => setShowServicesAnimation(false)}
          />
        </div>
      </section>
      <section className="mb-10 text-left sm:hidden sm:text-center ">
        <div className="flex flex-col items-start">
          <span className="text-[#131313] font-light text-sm sm:text-lg px-1">
            GET IN TOUCH
          </span>
          <button
            onClick={() => {
              document
                .getElementById("sayhi")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="mt-2 cursor-pointer transition-transform hover:scale-110"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="animate-bounce"
            >
              <path
                d="M12 4L12 20M12 20L18 14M12 20L6 14"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </section>
    </div>
  );
};

export default TextSection;
