# Estado actual del frontend

Fecha de actualizacion: 2026-05-30

## Estado del corte

`frontend-restaurante` ya no esta solo como landing. Hoy queda como simulador operativo guiado y mobile-first.

Hoy incluye:

- panel principal `Sistema de Pedidos`
- navegacion paginada de a `3` accesos visibles por bloque
- primer bloque: `Cliente`, `Pedido`, `Control`
- segundo bloque: `Cocina`, `Carrito`, `Control`
- tercer bloque: `Delivery B`, `Delivery A`, `Control`
- cuarto bloque: `Movimientos`, `Cerrar sesion`, `Control`
- flechas discretas para pasar de un bloque al otro sin mostrar toda la botonera junta
- `Cerrar sesion` visible como placeholder sin accion real en este corte
- flujo guiado por pestañas:
  - `Cliente`
  - `Pedido`
  - `Control`
  - `Cocina`
  - `Carrito`
  - `Delivery A`
  - `Delivery B`
  - `Movimientos`
- busqueda de cliente
- lista desplegable de clientes ya cargados
- alta rapida de cliente desde modal
- armado del pedido por categorias:
  - `Hamburguesas`
  - `Milanesas`
  - `Bebidas`
- catalogo mock actualizado con `Hamburguesa BBQ` a `$330`
- derivacion automatica por sector:
  - hamburguesas -> `Carrito`
  - milanesas -> `Cocina`
  - bebidas -> `Mostrador`
- control general por pedido completo
- estado por producto dentro de `Control`: `Pendiente`, `Preparando` y `Listo`
- estado del delivery dentro de `Control`: `En local` o `En viaje` segun lo que avance el deli
- boton general neutral mientras el pedido sigue en cocina
- asignacion manual a delivery cuando el pedido queda listo
- asignacion de delivery mostrando nombres operativos `Juan` y `Maria`
- vistas separadas para `Deli Juan` y `Deli Maria`
- tarjetas de delivery con numero de pedido, cliente, direccion y productos del pedido
- `Movimientos` confirma la venta cuando el deli marca el pedido como entregado
- listas de `Cocina` y `Carrito` que separan productos `entrando` y `prontos`
- los productos `listos` pueden tocarse desde `Pedidos prontos` para volver a `Pendiente`
- movimientos con resumen de venta diaria y ganancia estimada
- configuracion lista para deploy en GitHub Pages
- soporte `PWA` instalable
- estructura interna separada por capas para evitar una pagina unica gigante
- layout afinado para verse como app de celular

## Lo que todavia no incluye

- autenticacion
- integracion real con backend
- persistencia real de clientes, pedidos o caja
- conexion con WhatsApp Web
- impresion real de comanda
- socket o sincronizacion real multiusuario
- web publica para pedidos del cliente final
- multi-tenant real del SaaS

## Prioridad del corte

Primero validar:

- que el flujo guiado represente bien la operativa del local
- que la division entre `Carrito`, `Cocina` y `Delivery` sea clara
- que el uso en celular sea suficientemente simple para tomar pedidos rapido
