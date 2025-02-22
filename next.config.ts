import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
};

// module.exports = {
//   output: "standalone",
// } 
export default nextConfig;
