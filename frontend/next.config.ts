import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.shopify.com' },
      { protocol: 'https', hostname: 'th.bing.com' },
      { protocol: 'https', hostname: 'e7.pngegg.com' },
    ],
  },
};

export default nextConfig;
