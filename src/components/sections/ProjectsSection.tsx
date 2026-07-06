import Link from "next/link";
import projects from "@/data/projects.json";
import ProjectMedia from "@/components/sections/ProjectMedia";
import ProjectsMotion from "@/components/sections/ProjectsMotion";

/**
 * Selected works as an editorial index: the flagship gets a full-width
 * entry; entry 02/02 is this site itself — honesty as curation.
 */
export default function ProjectsSection() {
  const [flagship] = projects.projects;

  return (
    <ProjectsMotion>
    <div className="w-full mx-auto max-w-content px-5 sm:px-8 lg:px-12 py-12 space-y-16">
      {/* 01 / 02 — flagship */}
      <article data-project-flagship className="lg:grid lg:grid-cols-12 lg:gap-x-6">
        <div data-project-media className="lg:col-span-7">
          <ProjectMedia
            src="/footage/camping_video.mp4"
            poster="/footage/camping_poster.webp"
          />
        </div>
        <div className="mt-6 lg:mt-0 lg:col-start-9 lg:col-span-4 lg:self-end">
          <p data-project-detail className="font-display italic text-statement text-brand-accent">
            01 / 02
          </p>
          <h2 data-project-detail className="font-display text-title text-brand-ink mt-2">
            {flagship.title}
          </h2>
          <p data-project-detail className="text-body text-brand-gray max-w-[42ch] mt-4">
            {flagship.shortDescription}
          </p>
          <p data-project-detail className="text-meta font-medium uppercase text-brand-gray mt-6">
            {flagship.technologies.join(" / ")}
          </p>
          <Link
            data-project-detail
            href={`/projects/${flagship.name}`}
            className="inline-block mt-6 text-body text-brand-ink underline underline-offset-4 decoration-brand-accent hover:text-brand-accent transition-colors"
          >
            View case study &rarr;
          </Link>
        </div>
      </article>

      {/* 02 / 02 — this site */}
      <article data-project-second className="border-t border-brand-ink/10 pt-10 lg:grid lg:grid-cols-12 lg:gap-x-6">
        <p className="font-display italic text-statement text-brand-accent lg:col-span-3">
          02 / 02
        </p>
        <div className="lg:col-start-4 lg:col-span-8">
          <h2 className="font-display text-title text-brand-ink">This site</h2>
          <p className="font-display text-statement text-brand-ink mt-4">
            You&apos;re looking at it. The build notes are in the{" "}
            <Link
              href="/lab"
              className="underline underline-offset-4 decoration-brand-accent hover:text-brand-accent transition-colors"
            >
              Lab
            </Link>{" "}
            &darr;
          </p>
        </div>
      </article>
    </div>
    </ProjectsMotion>
  );
}
