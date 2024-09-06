/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '35.196.90.174',
        port: '',
        pathname: '/api/storage/**',
      },
    ],
  },
};

export default nextConfig;
