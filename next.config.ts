import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root so Next.js does not pick up an unrelated lockfile
  // higher up the directory tree.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
