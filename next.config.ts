import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable subdomain routing for admin panel
  async rewrites() {
    return {
      beforeFiles: [
        // Handle admin subdomain - rewrite to /admin routes
        {
          source: '/:path*',
          has: [
            {
              type: 'host',
              value: 'admin.*',
            },
          ],
          destination: '/admin/:path*',
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },

  // Allow images from Firebase Storage
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
};

export default nextConfig;
