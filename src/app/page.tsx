import HeroHeader from "@/components/HeroHeader";
import meSurfing from "../../public/images/surf5.jpg";

export default function Home() {
  const words = ["WEB", "FRONT END", "[SOME STACK]"];

  return (
    <div className="w-full flex flex-col h-full sm:justify-center items-center">
      <HeroHeader imageUrl={meSurfing} words={words} />
    </div>
  );
}
