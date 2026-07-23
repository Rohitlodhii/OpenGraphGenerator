import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_ENVIRONMENT: process.env.ENVIRONMENT,
  },
};

export default nextConfig;
