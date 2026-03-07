import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    optimizePackageImports: ["@mantine/core", "@mantine/hooks"],
  },
  output: "standalone",
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  reactCompiler: true,
};

export default nextConfig;
