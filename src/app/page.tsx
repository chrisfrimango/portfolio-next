import HeroHeader from "@/components/HeroHeader";
import AboutSection from "@/components/sections/AboutSection";
import WorkSection from "@/components/sections/WorkSection";
import SayHiSection from "@/components/sections/SayHiSection";
import { IntroProvider } from "@/components/intro/IntroContext";
import Preloader from "@/components/intro/Preloader";
import SectionHeading from "@/components/ui/SectionHeading";
import DayCycle from "@/components/DayCycle";
import MountainBackdrop from "@/components/MountainBackdrop";

export default function Home() {
  return (
    <IntroProvider>
      <Preloader />
      <DayCycle>
        <MountainBackdrop />
        <div className="w-full flex flex-col overflow-hidden">
          <section id="hero" className="min-h-screen flex flex-col">
            <HeroHeader />
          </section>

          <section id="about" className="py-section">
            <SectionHeading number="01" label="About" />
            <AboutSection />
          </section>

          <section id="projects" className="py-section">
            <SectionHeading number="02" label="Work" />
            <WorkSection />
          </section>

          <section id="sayhi" className="py-section">
            <SectionHeading number="03" label="Say hi" />
            <SayHiSection />
          </section>
        </div>
      </DayCycle>
    </IntroProvider>
  );
}
