import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
    // The character builder's planet/species/crystal icons are SVGs we
    // generate ourselves and upload to Sanity, so it's safe to let
    // next/image serve them (off by default since untrusted SVGs can carry
    // scripts).
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
