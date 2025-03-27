import HeroHeader from "@/components/HeroHeader";
import meSurfing from "../../public/images/surf5.jpg";

export default function Home() {
  const words = ["WEB", "FRONT END", "[SOME STACK]"];

  return <HeroHeader imageUrl={meSurfing} words={words} />;
}
