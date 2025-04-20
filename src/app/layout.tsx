import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import { RootLayoutProps } from "@/types/rootLayoutTypes";
import Nav from "@/components/Nav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Christoffer Friman | Developer & Digital Consultant",
  description:
    "Developer and digital consultant based in Sweden with expertise in React, Next.js, TypeScript and business strategy. Specializing in creating digital solutions where technology and business meet.",
  keywords:
    "developer, digital consultant, React, Next.js, TypeScript, Sweden, frontend developer, technical strategist",
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={`${inter.className}flex flex-col items-center mx-auto`}>
        <Nav />
        <main className="w-full h-full">{children}</main>
      </body>
    </html>
  );
}
