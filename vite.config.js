import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          three:    ["three", "@react-three/fiber", "@react-three/drei"],
          gsap:     ["gsap"],
          framer:   ["framer-motion"],
          router:   ["react-router-dom"],
          icons:    ["react-icons"],
        },
      },
    },
  },
});