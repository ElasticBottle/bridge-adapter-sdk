/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@elasticbottle/react-bridge-adapter-sdk"],
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
};

module.exports = nextConfig;
