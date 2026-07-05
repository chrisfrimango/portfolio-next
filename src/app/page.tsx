import HeroHeader from "@/components/HeroHeader";
import AboutSection from "@/components/sections/AboutSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import SayHiSection from "@/components/sections/SayHiSection";
import { IntroProvider } from "@/components/intro/IntroContext";
import Preloader from "@/components/intro/Preloader";
import SectionHeading from "@/components/ui/SectionHeading";

export default function Home() {
  return (
    <IntroProvider>
      <Preloader />
      <div className="w-full flex flex-col gap-20 mb-10 overflow-hidden">
        <section id="hero" className="min-h-screen flex flex-col">
          <HeroHeader />
        </section>

        <section id="about" className="min-h-screen py-20">
          <SectionHeading number="01" label="About" />
          <AboutSection />
        </section>

        <section id="projects" className="min-h-screen py-20">
          <SectionHeading number="02" label="Selected works" />
          <ProjectsSection />
        </section>

        <section id="sayhi" className="py-10 mt-10">
          <SectionHeading number="03" label="Say hi" />
          <SayHiSection />
        </section>
      </div>
    </IntroProvider>
  );
}
