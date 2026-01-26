import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { tanstackRouter } from "@tanstack/router-vite-plugin";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tanstackRouter({
            target: "react",
            autoCodeSplitting: true,
            routesDirectory: "./src/pages",
        }),
    ],
     resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@services": path.resolve(__dirname, "./src/services"),
      "@models": path.resolve(__dirname, "./src/models"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@config": path.resolve(__dirname, "./src/config"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@stores": path.resolve(__dirname, "./src/stores"),
      "@interceptors": path.resolve(__dirname, "./src/interceptors"),
    },
  },
  build: {
    // Compresión y optimización para conexiones lentas
    minify: 'terser',
    rollupOptions: {
      output: {
        // Separar vendors grandes para mejor caché
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'tanstack-vendor': ['@tanstack/react-query', '@tanstack/react-router'],
          'mantine-vendor': ['@mantine/core', '@mantine/hooks', '@mantine/notifications', '@mantine/dates'],
          'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],
        },
        // Cache busting con hash en nombres
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    // Aumentar límite de warning para chunks grandes
    chunkSizeWarningLimit: 1000,
    // Habilitar sourcemaps solo para debugging
    sourcemap: false,
  },
});
