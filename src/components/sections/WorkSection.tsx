import Link from "next/link";
import projects from "@/data/projects.json";
import labData from "@/data/lab.json";
import ProjectMedia from "@/components/sections/ProjectMedia";
import ProjectsMotion from "@/components/sections/ProjectsMotion";
import LabMotion from "@/components/sections/LabMotion";

/**
 * Work = the client case study as the flagship, then the craft experiments
 * built into this very site as a compact index. Business proof and craft
 * proof in one section.
 */
export default function WorkSection() {
  const [flagship] = projects.projects;

  return (
    <div className="w-full mx-auto max-w-content px-5 sm:px-8 lg:px-12 py-12">
      {/* Flagship client case study */}
      <ProjectsMotion>
        <article
          data-project-flagship
          className="lg:grid lg:grid-cols-12 lg:gap-x-6"
        >
          <div data-project-media className="lg:col-span-7">
            <ProjectMedia
              src="/footage/camping_video.mp4"
              poster="/footage/camping_poster.webp"
            />
          </div>
          <div className="mt-6 lg:mt-0 lg:col-start-9 lg:col-span-4 lg:self-end">
            <p
              data-project-detail
              className="font-display italic text-statement text-brand-accent"
            >
              01
            </p>
            <h2
              data-project-detail
              className="font-display text-title text-brand-ink mt-2"
            >
              {flagship.title}
            </h2>
            <p
              data-project-detail
              className="text-body text-brand-gray max-w-[42ch] mt-4"
            >
              {flagship.shortDescription}
            </p>
            <p
              data-project-detail
              className="text-meta font-medium uppercase text-brand-gray mt-6"
            >
              {flagship.technologies.join(" / ")}
            </p>
            <Link
              data-project-detail
              href={`/projects/${flagship.name}`}
              className="link-underline inline-block mt-6 text-body text-brand-ink hover:text-brand-accent transition-colors"
            >
              View case study &rarr;
            </Link>
          </div>
        </article>
      </ProjectsMotion>

      {/* Built into this site — the craft experiments */}
      <LabMotion>
        <div className="mt-24">
          <p
            data-lab-intro
            className="text-meta font-medium uppercase text-brand-gray mb-8"
          >
            &mdash; Built into this site
          </p>
          <ul className="divide-y divide-brand-ink/10 border-y border-brand-ink/10">
            {labData.entries.map((entry) => (
              <li key={entry.id} data-lab-row>
                <Link
                  href="/lab"
                  className="group flex items-baseline gap-5 py-5 hover:bg-brand-ink/[0.03] transition-colors"
                >
                  <span className="font-display italic text-brand-accent text-statement w-12 shrink-0">
                    {entry.id}
                  </span>
                  <span className="font-display text-statement text-brand-ink group-hover:text-brand-accent transition-colors">
                    {entry.title}
                  </span>
                  <span className="hidden lg:block ml-auto max-w-[34ch] text-right text-body text-brand-gray">
                    {entry.summary}
                  </span>
                  <span className="text-brand-gray text-sm hidden sm:inline shrink-0">
                    &rarr;
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <Link
            data-lab-outro
            href="/lab"
            className="inline-block mt-8 text-meta font-medium uppercase text-brand-gray hover:text-brand-ink transition-colors"
          >
            All experiments &rarr;
          </Link>
        </div>
      </LabMotion>
    </div>
  );
}
