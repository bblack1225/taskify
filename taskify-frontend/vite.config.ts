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
        target: "https://a800-219-80-117-88.ngrok-free.app",
        changeOrigin: true,
      },
    },
  },
});
