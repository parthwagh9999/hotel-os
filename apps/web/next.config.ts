import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@hotel-os/ui", "@hotel-os/shared"],
  output: "standalone",
};

export default nextConfig;
