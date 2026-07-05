import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "../styles/globals.css";
import { RootLayoutProps } from "@/types/rootLayoutTypes";
import Nav from "@/components/Nav";
import SmoothScroll from "@/components/SmoothScroll";

const inter = Inter({ subsets: ["latin"] });

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://christofferfriman.com"),
  title: "Christoffer Friman | Developer & Digital Consultant",
  description:
    "Developer and digital consultant based in Sweden with expertise in React, Next.js, TypeScript and business strategy. Specializing in creating digital solutions where technology and business meet.",
  keywords:
    "developer, digital consultant, React, Next.js, TypeScript, Sweden, frontend developer, technical strategist",
  openGraph: {
    title: "Christoffer Friman | Developer & Digital Consultant",
    description:
      "Developer and digital consultant based in Sweden — where technology and business meet.",
    url: "https://christofferfriman.com",
    siteName: "Christoffer Friman",
    images: [{ url: "/images/og-image.jpg", width: 1200, height: 630 }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Christoffer Friman | Developer & Digital Consultant",
    description:
      "Developer and digital consultant based in Sweden — where technology and business meet.",
    images: ["/images/og-image.jpg"],
  },
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} ${instrumentSerif.variable} flex flex-col items-center mx-auto`}
      >
        <SmoothScroll>
          <Nav />
          <main className="w-full h-full">{children}</main>
        </SmoothScroll>
      </body>
    </html>
  );
}
