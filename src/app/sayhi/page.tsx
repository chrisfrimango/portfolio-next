import { Metadata } from "next";
import SayHiSection from "@/components/sections/SayHiSection";

export const metadata: Metadata = {
  title: "Say Hi | Christoffer Friman",
};

export default function SayHi() {
  return <SayHiSection />;
}
