import React from "react";
import aboutData from "@/data/about.json";
import { Metadata } from "next";
import TextSection from "@/components/TextSection";
import AnimationBox from "@/components/ui/AnimationBox";
import Image from "next/image";
import meSurfing from "../../../public/images/surf5.jpg";

export const metadata: Metadata = {
  title: "About | Christoffer Friman",
};

export default function About() {
  return (
    <div className="w-full flex flex-col sm:justify-center sm:mt-38 relative">
      <div className="hidden w-[150px] h-[220px] sm:w-[250px] sm:h-[350px] shadow-xl z-10 overflow-hidden rounded-md mx-auto sm:items-start transform rotate-6">
        <Image
          src={meSurfing}
          alt="Developer"
          fill
          quality={100}
          className="object-cover"
          priority
        />
      </div>
      <TextSection
        title={"Hello"}
        italicText={"again,"}
        descriptionSection1={aboutData.content[0].description}
        descriptionSection2={aboutData.content[1].description}
        descriptionSection3={aboutData.content[2].description}
      >
        <AnimationBox />
      </TextSection>
    </div>
  );
}
