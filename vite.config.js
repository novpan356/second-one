import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";

// Relative URLs support both the GitHub Pages /second-one/ subpath and local hosting.
export default defineConfig({
  base: "./",
  build: {
    rollupOptions: {
      input: { main: fileURLToPath(new URL("./index.html", import.meta.url)), dojo: fileURLToPath(new URL("./dojo/index.html", import.meta.url)) },
      output: {
        manualChunks(id) {
          if (id.includes("/node_modules/@supabase/")) return "supabase";
        },
      },
    },
  },
});
