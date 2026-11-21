import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nyexgpoxoberoftmjfsg.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/work", destination: "/portfolio", permanent: false },
      { source: "/insights", destination: "/portfolio", permanent: false },
      {
        source: "/community-digital-support",
        destination: "/charity-digital-support-staffordshire",
        permanent: false,
      },
      {
        source: "/community-digital-support/",
        destination: "/charity-digital-support-staffordshire",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
