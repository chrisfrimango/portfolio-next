import HeroHeader from "@/components/HeroHeader";
import About from "@/app/about/page";
import Projects from "@/app/projects/page";
import SayHi from "@/app/sayhi/page";

export default function Home() {
  return (
    <div className="w-full flex flex-col gap-20 mb-10">
      <section id="hero" className="min-h-screen flex flex-col">
        <HeroHeader />
      </section>

      <section id="about" className="min-h-screen py-20">
        <About />
      </section>

      <section id="projects" className="min-h-screen py-20">
        <Projects />
      </section>

      <section id="sayhi" className="py-10 mt-10">
        <SayHi />
      </section>
    </div>
  );
}
