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

## 2026-05-16 - Primer simulador operativo del restaurante

Se reemplaza la landing inicial por una primera version del flujo de trabajo diario del local.

Incluye:

- panel del jefe para tomar pedidos que hoy llegan por WhatsApp
- busqueda de cliente existente o carga en el momento
- seleccion de productos por `cocina afuera` y `cocina adentro`
- envio de comanda al circuito correcto
- vistas separadas para ambas cocinas
- cambio de estado por click `pendiente -> preparacion -> lista`
- asignacion manual a `Repartidor A` o `Repartidor B`
- vista individual de reparto con cambio de estado del pedido
- seccion de movimientos con entradas positivas y salidas negativas
- ajuste visual hacia una interfaz mas sobria, oscura y minimalista

Objetivo:

- validar con el dueno si la operativa real queda bien representada antes de conectar backend, tiempo real real y web publica

## 2026-05-16 - Refactor por capas y ajuste del panel del jefe

Se ordena el modulo para no dejar la experiencia operativa en una sola pagina grande.

Incluye:

- separacion de `types`, `data`, `hooks`, `components`, `lib` y `styles`
- `global.css` reducido a base realmente global
- estilos del modulo movidos a `features/restaurante/styles`
- ajuste visual especifico de los inputs de `Buscar cliente` y del formulario del jefe

Objetivo:

- dejar una base mantenible para seguir creciendo sin mezclar logica, UI y estilos en un mismo archivo
