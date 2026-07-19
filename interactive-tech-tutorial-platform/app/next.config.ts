import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 一期不做图像优化（无 next/image 使用），关掉可避免 build 时依赖 sharp。
  images: { unoptimized: true },
};

export default nextConfig;
