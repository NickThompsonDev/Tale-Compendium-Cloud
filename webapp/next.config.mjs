/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: process.env.NEXT_PUBLIC_WEBAPP_URL
          ? process.env.NEXT_PUBLIC_WEBAPP_URL.split('//')[1]
          : 'localhost', // Fallback to localhost for development
        port: '',
        pathname: '/storage/**',
      },
    ],
  },
};

export default nextConfig;
