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
        target: "http://192.168.68.106:8088",
        changeOrigin: true,
      },
    },
  },
});
