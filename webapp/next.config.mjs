/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: '**',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
