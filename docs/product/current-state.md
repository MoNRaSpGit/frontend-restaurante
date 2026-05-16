# Estado actual del frontend

Fecha de actualizacion: 2026-05-16

## Estado del corte

`frontend-restaurante` ya no esta solo como landing. Hoy queda en estado de simulador operativo funcional.

Hoy incluye:

- panel jefe para ingresar pedidos manuales
- busqueda o alta rapida de cliente
- armado de comanda con productos separados por cocina
- vista `Cocina afuera`
- vista `Cocina adentro`
- vista `Repartidor A`
- vista `Repartidor B`
- asignacion de pedidos a reparto
- tabla de movimientos con detalle expandible
- configuracion lista para deploy en GitHub Pages
- soporte `PWA` instalable
- estructura interna separada por capas para evitar una pagina unica gigante

## Lo que todavia no incluye

- autenticacion
- integracion real con backend
- persistencia real de clientes, pedidos o caja
- conexion con WhatsApp Web
- impresion real de comanda
- socket o sincronizacion real multiusuario
- web publica para pedidos del cliente final

## Prioridad del corte

Primero validar:

- que el flujo operativo represente bien al negocio
- que la division entre cocina afuera, cocina adentro y reparto sea clara
- que el tablero del jefe permita ver cocina, reparto y caja sin friccion
