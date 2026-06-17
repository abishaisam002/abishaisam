/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  images: {
    qualities: [75, 80, 95, 100],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
