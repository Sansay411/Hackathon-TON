import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  devIndicators: false,
  // The STON.fi Omniston SDK talks over a WebSocket (ws) with optional native
  // addons. Keep it out of the webpack bundle so it runs as a normal Node
  // module on the server.
  serverExternalPackages: ["@ston-fi/omniston-sdk", "ws"]
};

export default nextConfig;
