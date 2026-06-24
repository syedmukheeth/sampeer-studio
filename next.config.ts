import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Placeholder stock (Phase 1). Swap/extend when real assets land.
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "fastly.picsum.photos" },
    ],
  },
};

export default nextConfig;
