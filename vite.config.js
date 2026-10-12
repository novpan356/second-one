import { defineConfig } from "vite";

// Relative URLs support both the GitHub Pages /second-one/ subpath and local hosting.
export default defineConfig({
  base: "./",
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("/node_modules/@supabase/")) return "supabase";
        },
      },
    },
  },
});
