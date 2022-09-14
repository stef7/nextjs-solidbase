/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = [].reduce((previous, withPlugin) => withPlugin(previous), nextConfig);
