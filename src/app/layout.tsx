import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import Nav from "@/components/Nav";
import { RootLayoutProps } from "@/types/rootLayoutTypes";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Christoffer Friman",
  description: "Developer, creator, sales, marketer, ninja",
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} h-screen flex flex-col items-center max-w-[1200px] mx-auto`}
      >
        <Nav />
        <main className="w-full h-full flex flex-col sm:justify-center items-center mt-28">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
