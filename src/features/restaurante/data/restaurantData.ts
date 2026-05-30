import type { Customer, KitchenKey, MenuCategoryKey, MenuItem, Movement, Order, Rider, ViewKey } from "../types";

export const kitchenLabels: Record<KitchenKey, string> = {
  carrito: "Carrito",
  cocina: "Cocina",
  mostrador: "Mostrador"
};

export const categoryLabels: Record<MenuCategoryKey, string> = {
  hamburguesas: "Hamburguesas",
  milanesas: "Milanesas",
  bebidas: "Bebidas"
};

export const menuCatalog: MenuItem[] = [
  { id: "m1", name: "Hamburguesa clasica", price: 420, category: "hamburguesas" },
  { id: "m2", name: "Hamburguesa BBQ", price: 330, category: "hamburguesas" },
  { id: "m3", name: "Hamburguesa doble", price: 560, category: "hamburguesas" },
  { id: "m4", name: "Milanesa clasica", price: 590, category: "milanesas" },
  { id: "m5", name: "Milanesa napolitana", price: 640, category: "milanesas" },
  { id: "m6", name: "Milanesa cheddar", price: 670, category: "milanesas" },
  { id: "m7", name: "Refresco 600 ml", price: 140, category: "bebidas" },
  { id: "m8", name: "Agua con gas", price: 120, category: "bebidas" },
  { id: "m9", name: "Cerveza lata", price: 180, category: "bebidas" }
];

export const existingCustomers: Customer[] = [
  { id: "c1", name: "Ramon", phone: "099111222", address: "Rivera 1408" },
  { id: "c2", name: "Juan", phone: "098333444", address: "Bulevar Artigas 915" },
  { id: "c3", name: "Maria", phone: "094555666", address: "Ellauri 221" }
];

export const initialRiders: Rider[] = [
  { id: "r1", name: "Delivery A", presence: "local" },
  { id: "r2", name: "Delivery B", presence: "local" }
];

export const initialOrders: Order[] = [
  {
    id: "P-101",
    customerId: "c1",
    customerName: "Ramon",
    customerPhone: "099111222",
    address: "Rivera 1408",
    items: [
      {
        id: "oi-1",
        name: "Hamburguesa clasica",
        price: 420,
        quantity: 2,
        category: "hamburguesas",
        kitchen: "carrito",
        status: "lista"
      },
      {
        id: "oi-2",
        name: "Refresco 600 ml",
        price: 140,
        quantity: 1,
        category: "bebidas",
        kitchen: "mostrador",
        status: "lista"
      }
    ],
    riderId: "r1",
    deliveryStatus: "asignado",
    createdAtLabel: "12:08",
    total: 980
  },
  {
    id: "P-102",
    customerId: "c2",
    customerName: "Juan",
    customerPhone: "098333444",
    address: "Bulevar Artigas 915",
    items: [
      {
        id: "oi-3",
        name: "Milanesa napolitana",
        price: 640,
        quantity: 1,
        category: "milanesas",
        kitchen: "cocina",
        status: "preparacion"
      },
      {
        id: "oi-4",
        name: "Agua con gas",
        price: 120,
        quantity: 1,
        category: "bebidas",
        kitchen: "mostrador",
        status: "lista"
      }
    ],
    riderId: "r2",
    deliveryStatus: "en-camino",
    createdAtLabel: "12:11",
    total: 760
  }
];

export const initialMovements: Movement[] = [
  {
    id: "mv-2",
    label: "Compra de insumos",
    amount: -500,
    createdAtLabel: "11:40",
    detail: "Gaseosas y pan rallado"
  }
];

export const roleTabs: Array<{ key: ViewKey; label: string }> = [
  { key: "jefe", label: "Panel de control" },
  { key: "cocina-afuera", label: "Carrito" },
  { key: "cocina-adentro", label: "Cocina adentro" },
  { key: "repartidor-a", label: "Delivery A" },
  { key: "repartidor-b", label: "Delivery B" }
];
