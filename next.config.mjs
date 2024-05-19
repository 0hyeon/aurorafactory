/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    nextScriptWorkers: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: "avatars.githubusercontent.com",
      },
      {
        hostname: "imagedelivery.net",
      },
    ],
  },
};

export default nextConfig;
