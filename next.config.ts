import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF first: markedly smaller than WebP for photographic content
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
