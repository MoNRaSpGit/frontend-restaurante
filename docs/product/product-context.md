# Contexto funcional del producto

Fecha de actualizacion: 2026-05-29

## Lectura inicial del modulo

`restaurante` apunta a convertirse en una experiencia de producto para operacion gastronomica con foco operativo rapido.

En una etapa madura podria cubrir:

- reservas
- mesas
- carta
- cocina
- delivery o retiro
- caja
- reportes basicos

## Regla para este inicio

Este frontend no declara aun el alcance final del producto.

En este corte solo busca:

- dejar un flujo guiado facil de usar en celular
- separar cliente, pedido, control y delivery sin mezclar todo en una sola pantalla
- facilitar validacion rapida en vivo del circuito real del local

## Flujo operativo actual

Hoy la lectura funcional del modulo queda asi:

1. se busca o se crea el cliente
2. se arma el pedido por categorias
3. el sistema deriva automaticamente cada item al sector correcto
4. `Control` muestra el estado por producto dentro de cada pedido
5. `Cocina` y `Carrito` avanzan los items que les corresponden
6. cuando un item queda listo, desaparece de la lista operativa del sector
7. cuando el pedido completo queda listo, se asigna a delivery
8. `Deli Juan` o `Deli Maria` avanzan el viaje hasta entrega
9. `Movimientos` resume caja y actividad reciente

## Regla de este corte

Aunque ya hay logica de estados y delivery, este frontend sigue siendo simulador local.

No define aun:

- contratos backend
- persistencia real
- sincronizacion multiusuario
- roles reales del SaaS
