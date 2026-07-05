import HeroHeader from "@/components/HeroHeader";
import AboutSection from "@/components/sections/AboutSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import SayHiSection from "@/components/sections/SayHiSection";
import { IntroProvider } from "@/components/intro/IntroContext";
import Preloader from "@/components/intro/Preloader";

export default function Home() {
  return (
    <IntroProvider>
      <Preloader />
      <div className="w-full flex flex-col gap-20 mb-10 overflow-hidden">
        <section id="hero" className="min-h-screen flex flex-col">
          <HeroHeader />
        </section>

        <section id="about" className="min-h-screen py-20">
          <AboutSection />
        </section>

        <section id="projects" className="min-h-screen py-20">
          <ProjectsSection />
        </section>

        <section id="sayhi" className="py-10 mt-10">
          <SayHiSection />
        </section>
      </div>
    </IntroProvider>
  );
}
