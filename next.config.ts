import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";
const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */

const nextConfig: NextConfig = {
  images: {
    domains: ["ibb.co"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ibb.co",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "giomurhtsumtshqcsxwd.supabase.co",
        pathname: "/**",
      }
    ],
  },
  // compiler: {
  //   removeConsole: process.env.NODE_ENV === 'production',
  // },
};

export default withNextIntl(nextConfig);
