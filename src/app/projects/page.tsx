import { Metadata } from "next";
import WorkSection from "@/components/sections/WorkSection";

export const metadata: Metadata = {
  title: "Work | Christoffer Friman",
};

export default function Projects() {
  return (
    <div className="pt-28">
      <WorkSection />
    </div>
  );
}
