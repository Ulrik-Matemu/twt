import type { NextConfig } from "next";

// Unique per build, inlined into both the client bundle and the server so the
// running page can compare its own build against what the server now serves.
const BUILD_ID =
  process.env.VERCEL_GIT_COMMIT_SHA ?? process.env.GITHUB_SHA ?? String(Date.now());

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_BUILD_ID: BUILD_ID,
  },
};

export default nextConfig;
