import React from "react";
import aboutData from "@/data/about.json";
import { Metadata } from "next";
import TextSection from "@/components/TextSection";
import AnimationBox from "@/components/ui/AnimationBox";

export const metadata: Metadata = {
  title: "About | Christoffer Friman",
};

export default function About() {
  return (
    <div className="w-full h-full flex flex-col justify-center  mt-48 sm:mt-0">
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
