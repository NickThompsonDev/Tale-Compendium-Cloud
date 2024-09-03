/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: process.env.NEXT_PUBLIC_API_URL.split('//')[1],  // Extract hostname from API URL
        port: '5000',
        pathname: '/storage/**',
      },
    ],
  },
};

export default nextConfig;
