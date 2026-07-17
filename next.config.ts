import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  allowedDevOrigins: ["192.168.254.118"],
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
