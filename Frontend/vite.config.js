import { defineConfig } from "vite";
import path from "path";

import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3030,
    allowedHosts: [
      "5824-103-71-19-206.ngrok-free.app"
    ],
    
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      components: path.resolve(__dirname, "src/components"),
      utils: path.resolve(__dirname, "src/lib/utils"),
      ui: path.resolve(__dirname, "src/components/ui"),
      lib: path.resolve(__dirname, "src/lib"),
      hooks: path.resolve(__dirname, "src/hooks"),
    },
  },
});
