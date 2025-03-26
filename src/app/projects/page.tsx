import React from "react";
import { Metadata } from "next";
import { EvervaultCard } from "@/components/ui/aceternity/evervault-card";
import projects from "@/data/projects.json";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Projects | Christoffer Friman",
};

export default function Projects() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center relative  p-5 py-32 sm:py-48">
      {/* Fixed heading with lower z-index */}
      <h3 className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center font-bold text-[#131313] uppercase tracking-[10px] text-2xl sm:text-5xl md:text-7xl z-[1]">
        Selected <span className="italic font-light">works</span>
      </h3>

      {/* Projects container with higher z-index */}
      <div className="w-full max-w-4xl relative z-[2] py-20 sm:py-48">
        {projects.projects.map((project, index) => (
          <div
            key={project.id}
            className={cn(
              "w-full flex",
              "justify-center sm:justify-start",
              index % 2 === 0 ? "sm:justify-start" : "sm:justify-end",
              index !== 0 && "mt-8 sm:-mt-24",
              `z-[${20 - index}]`
            )}
          >
            <div className="w-[250px] h-[250px] sm:w-[350px] sm:h-[350px]">
              <EvervaultCard
                text={project.title}
                subtext={project.description}
                href={project.name !== "" ? `/projects/${project.name}` : null}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
