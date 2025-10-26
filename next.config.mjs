/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'portaldev.4tracksltd.com',
      },
      {
        protocol: 'https',
        hostname: 'portal.4tracksltd.com',
      },
    ],
  },
};

export default nextConfig;
