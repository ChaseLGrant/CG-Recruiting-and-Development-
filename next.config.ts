import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure Supabase packages are bundled correctly on Vercel
  serverExternalPackages: [],
};

export default nextConfig;
