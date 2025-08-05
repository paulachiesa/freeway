import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Next ignorará todos los errores de TS al compilar
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
