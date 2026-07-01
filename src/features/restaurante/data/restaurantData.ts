import type { Customer, KitchenKey, MenuCategoryKey, MenuItem, Movement, Order, Rider, ViewKey } from "../types";

export const kitchenLabels: Record<KitchenKey, string> = {
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
  { id: "m2", name: "Hamburguesa con queso", price: 330, category: "hamburguesas" },
  { id: "m3", name: "Hamburguesa doble", price: 560, category: "hamburguesas" },
  { id: "m4", name: "Milanesa clasica", price: 590, category: "milanesas" },
  { id: "m5", name: "Milanesa napolitana", price: 640, category: "milanesas" },
  { id: "m6", name: "Milanesa cheddar", price: 670, category: "milanesas" },
  { id: "m7", name: "Refresco 600 ml", price: 140, category: "bebidas" },
  { id: "m8", name: "Agua con gas", price: 120, category: "bebidas" },
  { id: "m9", name: "Cerveza lata", price: 180, category: "bebidas" }
];

export const existingCustomers: Customer[] = [];

export const initialRiders: Rider[] = [
  { id: "r1", name: "Delivery", presence: "local" }
];

export const initialOrders: Order[] = [];

export const initialMovements: Movement[] = [];

export const roleTabs: Array<{ key: ViewKey; label: string }> = [
  { key: "jefe", label: "Panel de control" },
  { key: "cocina", label: "Cocina" },
  { key: "delivery", label: "Delivery" }
];
