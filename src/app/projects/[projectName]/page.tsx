import React from "react";
import { notFound } from "next/navigation";
import projects from "@/data/projects.json";
import { CardSpotlight } from "@/components/CardSpotlight";
import Link from "next/link";

export function generateStaticParams() {
  return projects.projects.map((project) => ({
    projectName: project.name,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ projectName: string }>;
}) {
  const { projectName } = await params;
  const project = projects.projects.find(
    (project) => project.name === projectName
  );

  if (!project) {
    return notFound();
  }

  const { title } = project;

  return {
    title: title,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ projectName: string }>;
}) {
  const { projectName } = await params;
  const project = projects.projects.find(
    (project) => project.name === projectName
  );

  if (!project) {
    return notFound();
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <CardSpotlight className="w-full max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-brand-ink mb-4 relative z-20">
          {project.title}
        </h1>
        <p className="text-brand-ink mb-6 relative z-20">
          {project.description}
        </p>
        <div className="text-brand-ink/80 space-y-4 relative z-20">
          <div>
            <h2 className="text-brand-ink font-semibold mb-2">Overview</h2>
            <p>{project.shortDescription}</p>
          </div>
          <div>
            <h2 className="text-brand-ink font-semibold mb-2">Technologies</h2>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 bg-brand-accent/5 text-brand-ink rounded-full text-sm border border-brand-ink/10"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-brand-ink font-semibold mb-2">Features</h2>
            <ul className="list-disc list-inside space-y-1">
              {project.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </div>
          {project.githubUrl && (
            <div>
              <h2 className="text-brand-ink font-semibold mb-2">Github</h2>
              <Link href={project.githubUrl}>{project.githubUrl}</Link>
            </div>
          )}
          <div>
            <Link
              href={project.liveUrl}
              target="_blank"
              className="px-3 py-1 bg-brand-ink/5 text-brand-ink rounded-full text-sm border border-brand-ink/10"
            >
              Visit live site &rarr;
            </Link>
          </div>
        </div>
      </CardSpotlight>
    </div>
  );
}
