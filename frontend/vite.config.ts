import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// Configuración base de Vite. defineConfig aporta tipado y autocompletado.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
  },
  preview: {
    port: 4173,
    strictPort: true,
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
