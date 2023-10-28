import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: "@",
        replacement: "/src",
      },
    ],
  },
  server: {
    proxy: {
      "/api": {
        target: "https://c1dc-114-24-79-49.ngrok-free.app",
        changeOrigin: true,
      },
    },
  },
});
