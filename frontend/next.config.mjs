/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'i.ytimg.com',
      'storage.cloud.google.com',
      'storage.googleapis.com',
      'cdn.yourwebsite.com',
      'www.physio-pedia.com',
      's3assets.skimble.com',
    ],
  },
  reactStrictMode: true,
  swcMinify: true,
};

export default nextConfig;
