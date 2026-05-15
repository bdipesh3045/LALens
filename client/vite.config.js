import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, "");
  const apiProxy = env.LALENS_API_PROXY || "http://127.0.0.1:5050";
  return {
    plugins: [react()],
    server: {
      proxy: {
        "/api": {
          target: apiProxy,
          changeOrigin: true
        }
      }
    }
  };
});
