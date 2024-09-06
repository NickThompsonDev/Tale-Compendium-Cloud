console.log("NEXT_PUBLIC_WEBAPP_URL:", process.env.NEXT_PUBLIC_WEBAPP_URL);

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
        pathname: '/api/storage/**', // Update this based on your API route
      },
    ],
  },
};

export default nextConfig;
