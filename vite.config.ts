import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

const devPort = 5176;
const previewPort = 4176;
const repoName = "frontend-restaurante";

export default defineConfig(({ mode }) => ({
  base: mode === "github-pages" ? `/${repoName}/` : "/",
  server: {
    port: devPort,
    strictPort: true
  },
  preview: {
    port: previewPort,
    strictPort: true
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "robots.txt", "pwa-192x192.svg", "pwa-512x512.svg", "maskable-icon.svg"],
      manifest: {
        id: mode === "github-pages" ? `/${repoName}/` : "/",
        name: "SaasPro Restaurante",
        short_name: "Restaurante",
        description: "Modulo visual y operativo para restaurante dentro de SaasPro.",
        theme_color: "#120f0d",
        background_color: "#120f0d",
        display: "standalone",
        orientation: "portrait",
        start_url: mode === "github-pages" ? `/${repoName}/` : "/",
        scope: mode === "github-pages" ? `/${repoName}/` : "/",
        icons: [
          {
            src: "pwa-192x192.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "any"
          },
          {
            src: "pwa-512x512.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "any"
          },
          {
            src: "maskable-icon.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "maskable"
          }
        ]
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,webmanifest}"]
      }
    })
  ]
}));
