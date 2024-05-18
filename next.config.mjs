/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    nextScriptWorkers: true,
  },
  images: {
    domains: ["imagedelivery.net"],
  },
};

export default nextConfig;
