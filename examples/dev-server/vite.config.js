import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const bridgeTarget = env.BRIDGE_DISPATCHER_URL || "https://bridge.patchworks.ai";
  const dashboardToken = env.BRIDGE_DASHBOARD_TOKEN;

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "the-bridge": path.resolve(__dirname, "../../src"),
      },
    },
    server: {
      proxy: {
        "/bridge-api": {
          target: bridgeTarget,
          changeOrigin: true,
          rewrite: (requestPath) => requestPath.replace(/^\/bridge-api/, "/api"),
          configure: (proxy) => {
            proxy.on("proxyReq", (proxyReq) => {
              if (dashboardToken) {
                proxyReq.setHeader("authorization", `Bearer ${dashboardToken}`);
              }
            });
          },
        },
      },
    },
  };
});
