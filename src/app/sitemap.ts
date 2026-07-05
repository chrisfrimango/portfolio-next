import type { MetadataRoute } from "next";
import projectsData from "@/data/projects.json";

const BASE_URL = "https://christofferfriman.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const projectPages = projectsData.projects.map((project) => ({
    url: `${BASE_URL}/projects/${project.name}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/lab`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...projectPages,
  ];
}
