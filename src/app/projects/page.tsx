import { Metadata } from "next";
import ProjectsSection from "@/components/sections/ProjectsSection";

export const metadata: Metadata = {
  title: "Projects | Christoffer Friman",
};

export default function Projects() {
  return <ProjectsSection />;
}
