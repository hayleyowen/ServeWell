import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // output:"export",
  // images: { unoptimized: true } 
};

// module.exports = {
//   output: "standalone",
// } 
export default nextConfig;
