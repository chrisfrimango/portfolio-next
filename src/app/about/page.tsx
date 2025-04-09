import React from "react";
import aboutData from "@/data/about.json";
import TextSection from "@/components/TextSection";

export default function About() {
  return (
    <div className="w-full flex flex-col sm:justify-center sm:pt-38 relative ">
      <TextSection
        italicText={"about me"}
        descriptionSection1={aboutData.content[0].description}
        descriptionSection2={aboutData.content[1].description}
        descriptionSection3={aboutData.content[2].description}
      ></TextSection>
    </div>
  );
}
