# Bitacora del modulo

Fecha de actualizacion: 2026-05-16

## 2026-05-16 - Nacimiento de frontend-restaurante

Se crea la base inicial del frontend `restaurante`.

Incluye:

- scaffold Vite + React + TypeScript
- estructura `src/app`, `src/features`, `src/styles` y `src/shared`
- landing inicial del producto
- scripts para `build`, `build:gh` y `deploy`
- documentacion base del frontend
- configuracion `PWA` para instalacion como app

Objetivo:

- poder publicar rapido una primera version visual en GitHub Pages

## 2026-05-16 - GitHub Pages y PWA listos

Se ajusta el frontend para quedar listo para publicacion e instalacion.

Incluye:

- plugin `vite-plugin-pwa`
- manifest web
- service worker con `autoUpdate`
- assets publicos para iconos
- `deploy` preparado para subir tambien archivos ocultos al branch `gh-pages`
