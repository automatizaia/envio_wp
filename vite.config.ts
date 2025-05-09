import { defineConfig } from "vite";
import react from "@vitejs/plugin-react"; // Alterado para o plugin 'react' padrão do Vite
import path from "path";
import { componentTagger } from "lovable-tagger";
import json from '@vitejs/plugin-json'; // Adicionando suporte a arquivos JSON

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(), // Plugin React atualizado
    mode === 'development' && componentTagger(),
    json(), // Plugin JSON
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
