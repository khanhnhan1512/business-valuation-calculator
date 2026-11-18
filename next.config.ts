import type { NextConfig } from "next";

/**
 * Sites allowed to show the calculator in an iframe. aspenval.com embeds the
 * /embed page with an Elementor HTML widget (pages are built and previewed on
 * the live site, so there is no staging domain to add). Everyone else is refused.
 */
const FRAME_ANCESTORS = [
  "'self'",
  "https://aspenval.com",
  "https://www.aspenval.com",
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `frame-ancestors ${FRAME_ANCESTORS.join(" ")}`,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
