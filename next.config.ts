import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF first: markedly smaller than WebP for photographic content
    formats: ["image/avif", "image/webp"],
    // Next 15 rejects any `quality` prop not listed here with a 400 from the
    // image optimizer. The portrait ships at 70 for a smaller payload.
    qualities: [70, 75],
  },
};

export default nextConfig;
