import type { Metadata } from "next";
import { Inter, Fraunces, IBM_Plex_Mono } from "next/font/google";
import "../styles/globals.css";
import { RootLayoutProps } from "@/types/rootLayoutTypes";
import Nav from "@/components/Nav";
import SmoothScroll from "@/components/SmoothScroll";
import StatusChip from "@/components/ui/StatusChip";
import Meridian from "@/components/Meridian";

const inter = Inter({ subsets: ["latin"] });

// Fraunces: an expressive variable serif (weights to 900, optical sizing)
// — the heavier, more characterful display voice of the site.
const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["opsz", "SOFT"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

// IBM Plex Mono: the "engineering" voice — labels, metadata, coordinates,
// the clock and marks. The third register that speaks the tech half.
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://christofferfriman.com"),
  title: "Christoffer Friman | Digital Transformation & Technology",
  description:
    "I help companies navigate digital transformation — connecting what's technically possible with the organizational change that AI makes possible. Based in Trollhättan, Sweden, with the rare mix of business, change and hands-on engineering.",
  keywords:
    "digital transformation, digitalization, AI, change management, technology strategy, digital consultant, developer, Sweden, Trollhättan",
  openGraph: {
    title: "Christoffer Friman | Digital Transformation & Technology",
    description:
      "I help companies navigate digital transformation — the technology, and the change that comes with it.",
    url: "https://christofferfriman.com",
    siteName: "Christoffer Friman",
    images: [{ url: "/images/og-image.jpg", width: 1200, height: 630 }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Christoffer Friman | Digital Transformation & Technology",
    description:
      "I help companies navigate digital transformation — the technology, and the change that comes with it.",
    images: ["/images/og-image.jpg"],
  },
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} ${fraunces.variable} ${plexMono.variable} flex flex-col items-center mx-auto`}
      >
        <SmoothScroll>
          <Meridian />
          <Nav />
          <main className="w-full h-full">{children}</main>
          <StatusChip />
        </SmoothScroll>
      </body>
    </html>
  );
}
