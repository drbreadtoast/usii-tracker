import type { NextConfig } from "next";

const cacheControl = "public, s-maxage=21600, stale-while-revalidate=86400";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/((?!_next|api).*)",
        headers: [{ key: "Cache-Control", value: cacheControl }],
      },
    ];
  },
};

export default nextConfig;
