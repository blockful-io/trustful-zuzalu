/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    GRAPHQL_ENS_API_KEY: process.env.GRAPHQL_ENS_API_KEY,
    ALCHEMY_RPC_URL: process.env.ALCHEMY_RPC_URL,
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
};

module.exports = nextConfig;
