/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Keeps Mongo drivers out of the bundler so their optional native deps
  // (kerberos, snappy, aws4…) don't produce resolve warnings.
  serverExternalPackages: ["mongoose", "mongodb"],
  images: {
    // <Image> needs every remote host whitelisted here.
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "pbs.twimg.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

module.exports = nextConfig;
