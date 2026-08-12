import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";
import path from "node:path";
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
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', '@iconify/react', 'embla-carousel-react'],
  },
  webpack(config, { isServer }) {
    if (!isServer) {
      config.resolve.alias["../build/polyfills/polyfill-module$"] = path.resolve(
        process.cwd(),
        "src/polyfills/next-modern.ts",
      );
    }

    return config;
  },
};

export default withNextIntl(nextConfig);
