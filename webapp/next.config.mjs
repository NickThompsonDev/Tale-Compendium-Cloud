/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: process.env.NEXT_PUBLIC_WEBAPP_URL?.split('//')[1],
        port: '',
        pathname: '/storage/**',
      },
    ],
  },
};

export default nextConfig;
