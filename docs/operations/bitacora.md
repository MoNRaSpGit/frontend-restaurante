# Bitacora del modulo

Fecha de actualizacion: 2026-05-29

## 2026-05-29 - Documentacion del simulador operativo actualizado

Se alinea la documentacion del modulo con el estado realmente publicado del simulador.

Incluye:

- navegacion paginada actual con `Control` siempre visible
- catalogo mock con `Hamburguesa BBQ`
- lectura de estado por producto dentro de `Control`
- nombres operativos de delivery como `Deli Juan` y `Deli Maria`
- comportamiento de `Cocina` y `Carrito` ocultando productos listos

Objetivo:

- dejar la documentacion consistente con el prototipo publicado
- evitar que el proximo cambio arranque con contexto viejo

## 2026-05-29 - Navegacion paginada de accesos operativos

Se reorganiza la botonera principal del simulador para no mostrar todos los accesos juntos desde el arranque.

Incluye:

- grilla visible de `3` botones por bloque
- flechas discretas para cambiar entre bloques
- primer bloque con `Cliente`, `Pedido` y `Control`
- segundo bloque con `Cocina`, `Carrito` y `Delivery A`
- tercer bloque con `Delivery B`, `Movimientos` y `Cerrar sesion`
- `Cerrar sesion` queda visible como placeholder sin accion real por ahora

Objetivo:

- bajar la sensacion de saturacion al abrir la app
- simular mejor una app futura con accesos distintos segun rol operativo

## 2026-05-29 - Delivery con pedido y cliente mejor separados

Se ajusta la vista de delivery para que la lectura del pedido sea mas clara durante la entrega.

Incluye:

- numero de pedido mas visible en cada tarjeta
- cliente separado visualmente del codigo del pedido
- direccion presentada con etiqueta clara
- listado de productos del pedido dentro de la tarjeta

Objetivo:

- evitar que pedido y cliente se lean todo junto
- dejar mas claro que lleva cada delivery

## 2026-05-29 - Control repetido en las cuatro paginas de accesos

Se ajusta de nuevo la paginacion de accesos para que `Control` quede siempre a mano en todos los bloques.

Queda asi:

- pagina 1: `Cliente`, `Pedido`, `Control`
- pagina 2: `Cocina`, `Carrito`, `Control`
- pagina 3: `Delivery B`, `Delivery A`, `Control`
- pagina 4: `Movimientos`, `Cerrar sesion`, `Control`

Objetivo:

- mantener `Control` disponible sin importar en que bloque de accesos este parado el usuario

## 2026-05-29 - Control muestra estado por producto

Se ajusta la lectura del bloque `Control` para que el avance operativo se vea en cada producto del pedido y no solo en el boton general.

Incluye:

- cada producto ahora muestra su estado `Pendiente`, `Preparando` o `Listo`
- el estado del producto se refleja segun lo que marque `Cocina` o `Carrito`
- el boton general deja de mostrar estados finos de cocina
- mientras el pedido no este cerrado, el boton general muestra una lectura neutral
- cuando todos los productos quedan listos, el boton vuelve a `Listo - asignar delivery`

Objetivo:

- hacer mas clara la lectura real de cada pedido dentro de `Control`
- separar el avance por producto del siguiente paso operativo del pedido completo

## 2026-05-29 - Cocina y Carrito ocultan productos listos

Se ajustan las listas operativas de `Cocina` y `Carrito` para que dejen de mostrar productos que ya quedaron terminados.

Incluye:

- cuando un producto pasa a `Listo`, desaparece de la lista del sector
- `Cocina` y `Carrito` muestran solo lo que sigue pendiente o en preparacion

Objetivo:

- limpiar la vista operativa del cocinero
- dejar en pantalla solo lo que todavia requiere accion

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
- asignacion manual a `Delivery A` o `Delivery B`
- vista individual de delivery con cambio de estado del pedido
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

## 2026-05-22 - Sistema de pedidos guiado y mobile-first

Se reordena el simulador para parecerse mas a una app operativa de celular.

Incluye:

- titulo principal `Sistema de Pedidos`
- experiencia principal metida dentro de una sola caja mobile
- pestañas internas para separar etapas del flujo
- patron `buscar cliente / desplegar lista / agregar cliente`
- alta rapida de cliente en modal
- pedido por categorias simples
- derivacion automatica por sector de cocina
- `Control` agrupado por pedido completo
- pestañas propias para `Cocina`, `Carrito`, `Delivery A`, `Delivery B` y `Movimientos`
- asignacion de delivery solo cuando el pedido queda listo
- seguimiento de entrega desde la vista del delivery

Objetivo:

- validar si el negocio entiende mejor el circuito cuando esta dividido por pasos
- bajar ruido visual y operarlo mejor desde pantalla chica
