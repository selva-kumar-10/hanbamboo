import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  // ── Build optimizations ────────────────────────────────────
  build: {
    target: "es2015",
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,    // removes all console.log in production
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        // Split vendor chunks so browser caches them separately
        manualChunks: {
          "vendor-react":  ["react", "react-dom"],
          "vendor-router": ["react-router-dom"],
          "vendor-axios":  ["axios"],
        },
      },
    },
    // Warn if any chunk exceeds 400kb
    chunkSizeWarningLimit: 400,
  },

  // ── Dev server ─────────────────────────────────────────────
  server: {
    port: 5175,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});