import Link from "next/link";
import projects from "@/data/projects.json";
import ProjectMedia from "@/components/sections/ProjectMedia";
import ProjectsMotion from "@/components/sections/ProjectsMotion";

const isFilled = (v?: string) => Boolean(v && !v.startsWith("[FYLL"));

/**
 * Work = a sequence of client case studies, each a full-bleed cinematic stage
 * that pins and emerges from black. Every project is the same unit: a hairline
 * header announces it (index / count), the film plays, then the title resolves.
 */
export default function WorkSection() {
  const total = String(projects.projects.length).padStart(2, "0");

  return (
    <div className="w-full">
      {projects.projects.map((project, i) => {
        const index = String(i + 1).padStart(2, "0");
        const year = project.caseStudy?.year;
        return (
          <ProjectsMotion key={project.name}>
            <article
              data-project-stage
              className="relative flex min-h-[64vh] w-full items-center py-16 lg:min-h-screen lg:py-0"
            >
              <div className="mx-auto w-[84vw] max-w-[880px] lg:w-[54vw]">
                {/* Delimiter — the clear boundary that says "new project" */}
                <div
                  data-project-detail
                  className="mb-6 flex items-center justify-between border-t border-brand-ink/20 pt-4 font-mono text-meta uppercase tracking-[0.18em]"
                >
                  <span className="text-brand-accent">{index}</span>
                  <span className="text-brand-gray">
                    {isFilled(year) ? year : `Selected work · ${index} / ${total}`}
                  </span>
                </div>

                <div data-project-media>
                  <ProjectMedia
                    src={project.media?.video || undefined}
                    poster={project.media?.poster ?? ""}
                    alt={`${project.title} — ${project.subTitle}`}
                  />
                </div>

                <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h2
                      data-project-detail
                      className="font-display text-title text-brand-ink"
                    >
                      {project.title}
                    </h2>
                    <p
                      data-project-detail
                      className="mt-3 font-mono text-meta text-brand-gray"
                    >
                      {project.technologies.join(" · ")}
                    </p>
                  </div>
                  <Link
                    data-project-detail
                    href={`/projects/${project.name}`}
                    className="link-underline shrink-0 font-mono text-meta uppercase text-brand-ink transition-colors hover:text-brand-accent"
                  >
                    View case study &rarr;
                  </Link>
                </div>
              </div>
            </article>
          </ProjectsMotion>
        );
      })}
    </div>
  );
}
