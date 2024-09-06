/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'http://35.196.90.174'.split('//')[1],
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
