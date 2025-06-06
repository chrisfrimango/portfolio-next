import { Metadata } from "next";
import ProjectCard from "@/app/projects/project-card";
import projects from "@/data/projects.json";
import { cn } from "@/lib/utils";
import AnimatedTitle from "./animated-title";

export const metadata: Metadata = {
  title: "Projects | Christoffer Friman",
};

export default function Projects() {
  return (
    <div className="w-full h-full flex flex-col p-5 py-20 sm:py-38">
      <AnimatedTitle className="font-bold text-[#131313] uppercase tracking-[10px] text-5xl sm:text-center sm:text-6xl md:text-8xl z-[1]" />

      {/* Projects container with higher z-index */}
      <div className="w-full md:mx-auto max-w-4xl z-[2] py-12 sm:py-32">
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
            <div className="w-full max-w-[90vw] sm:w-[450px]">
              <ProjectCard
                text={project.title}
                subtext={project.shortDescription}
                href={project.liveUrl}
                technologies={project.technologies}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
