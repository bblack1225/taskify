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
        target: "https://taskify-api.zeabur.app",
        //本地端的話不用設定沒關係，但有碰到local以外的就有跨域的問題，必須加 changeOrigin: true
        changeOrigin: true,
      },
    },
  },
});
