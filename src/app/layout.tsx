import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import { RootLayoutProps } from "@/types/rootLayoutTypes";
import Nav from "@/components/Nav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Christoffer Friman",
  description: "Developer, creator, sales, marketer, ninja",
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
