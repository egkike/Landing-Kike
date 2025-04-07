import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/Landing-Kike/' : '/',
  resolve: {
    alias: {
      "/main.tsx": path.resolve(__dirname, "src/main.tsx"),
    },
  },
  build: {
    outDir: "dist",
  },
});
