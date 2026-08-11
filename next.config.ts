import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Produces a self-contained server (.next/standalone) with only the
  // production node_modules it actually needs — used by the Dockerfile
  // for a much smaller runtime image. Ignored by Vercel deploys.
  output: "standalone",
};

export default nextConfig;
