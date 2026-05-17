import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  images: {
    remotePatterns: [],
    dangerouslyAllowSVG: true,
  },
};

export default nextConfig;
