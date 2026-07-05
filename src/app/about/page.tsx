import { Metadata } from "next";
import AboutSection from "@/components/sections/AboutSection";

export const metadata: Metadata = {
  title: "About | Christoffer Friman",
};

export default function About() {
  return <AboutSection />;
}
