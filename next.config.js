const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYSE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  /**
   * @type {(webpackConfig: import('webpack').Configuration, nextContext: Parameters<import('next').NextConfig["webpack"]>[1]) => import('webpack').Configuration}
   **/
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

const withPlugins = [withBundleAnalyzer];

module.exports = withPlugins.reduce((previous, withPlugin) => withPlugin?.(previous) ?? previous, nextConfig);
