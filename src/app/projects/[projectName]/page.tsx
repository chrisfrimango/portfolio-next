import React from "react";
import { notFound } from "next/navigation";
import projects from "@/data/projects.json";
import { CardSpotlight } from "@/components/CardSportlight";
import Link from "next/link";

export function generateMetadata({
  params,
}: {
  params: { projectName: string };
}) {
  const project = projects.projects.find(
    (project) => project.name === params.projectName
  );

  if (!project) {
    return notFound();
  }

  const { title } = project;

  return {
    title: title,
  };
}

export default function ProjectPage({
  params,
}: {
  params: { projectName: string };
}) {
  const project = projects.projects.find(
    (project) => project.name === params.projectName
  );

  if (!project) {
    return notFound();
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <CardSpotlight className="w-full max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-[#131313] mb-4 relative z-20">
          {project.title}
        </h1>
        <p className="text-[#131313] mb-6 relative z-20">
          {project.description}
        </p>
        <div className="text-[#131313]/80 space-y-4 relative z-20">
          <div>
            <h2 className="text-[#131313] font-semibold mb-2">Overview</h2>
            <p>{project.shortDescription}</p>
          </div>
          <div>
            <h2 className="text-[#131313] font-semibold mb-2">Technologies</h2>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 bg-[#ff3b00]/5 text-[#131313] rounded-full text-sm border border-[#131313]/10"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-[#131313] font-semibold mb-2">Features</h2>
            <ul className="list-disc list-inside space-y-1">
              {project.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-[#131313] font-semibold mb-2">Category</h2>
            <p>{project.category}</p>
          </div>
          <div>
            <h2 className="text-[#131313] font-semibold mb-2">Github</h2>
            <p>{project.githubUrl}</p>
          </div>
          <div>
            <Link
              href={project.liveUrl}
              className="px-3 py-1 bg-[#131313]/5 text-[#131313] rounded-full text-sm border border-[#131313]/10"
            >
              Play the game
            </Link>
          </div>
        </div>
      </CardSpotlight>
    </div>
  );
}
