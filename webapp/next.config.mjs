/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: process.env.NEXT_PUBLIC_WEBAPP_URL
          ? new URL(process.env.NEXT_PUBLIC_WEBAPP_URL).hostname
          : 'localhost', // Fallback to 'localhost' for development
        port: '',
        pathname: '/api/storage/**', // Updated to reflect correct path
      },
    ],
  },
};

export default nextConfig;
