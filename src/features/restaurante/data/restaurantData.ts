import type { Customer, KitchenKey, MenuItem, Movement, Order, Rider, ViewKey } from "../types";

export const kitchenLabels: Record<KitchenKey, string> = {
  afuera: "Cocina afuera",
  adentro: "Cocina adentro"
};

export const menuCatalog: MenuItem[] = [
  { id: "m1", name: "Hamburguesa clasica", price: 420, kitchen: "afuera" },
  { id: "m2", name: "Pizza muzzarella", price: 590, kitchen: "afuera" },
  { id: "m3", name: "Papas fritas", price: 230, kitchen: "afuera" },
  { id: "m4", name: "Milanesa al plato", price: 540, kitchen: "adentro" },
  { id: "m5", name: "Pasta del dia", price: 480, kitchen: "adentro" },
  { id: "m6", name: "Ensalada completa", price: 360, kitchen: "adentro" }
];

export const existingCustomers: Customer[] = [
  { id: "c1", name: "Lucia Pereira", phone: "099111222", address: "Rivera 1408" },
  { id: "c2", name: "Matias Silva", phone: "098333444", address: "Bulevar Artigas 915" },
  { id: "c3", name: "Sofia Cabrera", phone: "094555666", address: "Ellauri 221" }
];

export const initialRiders: Rider[] = [
  { id: "r1", name: "Repartidor A", presence: "local" },
  { id: "r2", name: "Repartidor B", presence: "local" }
];

export const initialOrders: Order[] = [
  {
    id: "P-101",
    customerId: "c1",
    customerName: "Lucia Pereira",
    customerPhone: "099111222",
    address: "Rivera 1408",
    items: [
      {
        id: "oi-1",
        name: "Hamburguesa clasica",
        price: 420,
        quantity: 2,
        kitchen: "afuera",
        status: "preparacion"
      },
      {
        id: "oi-2",
        name: "Papas fritas",
        price: 230,
        quantity: 1,
        kitchen: "afuera",
        status: "pendiente"
      }
    ],
    riderId: "r1",
    deliveryStatus: "asignado",
    createdAtLabel: "12:08",
    total: 1070
  },
  {
    id: "P-102",
    customerId: "c2",
    customerName: "Matias Silva",
    customerPhone: "098333444",
    address: "Bulevar Artigas 915",
    items: [
      {
        id: "oi-3",
        name: "Milanesa al plato",
        price: 540,
        quantity: 1,
        kitchen: "adentro",
        status: "preparacion"
      },
      {
        id: "oi-4",
        name: "Ensalada completa",
        price: 360,
        quantity: 1,
        kitchen: "adentro",
        status: "lista"
      }
    ],
    riderId: "r2",
    deliveryStatus: "en-camino",
    createdAtLabel: "12:11",
    total: 900
  }
];

export const initialMovements: Movement[] = [
  {
    id: "mv-1",
    label: "Venta pedido P-102",
    amount: 900,
    createdAtLabel: "12:11",
    detail: "Milanesa al plato x1, Ensalada completa x1",
    orderId: "P-102"
  },
  {
    id: "mv-2",
    label: "Compra de insumos",
    amount: -500,
    createdAtLabel: "11:40",
    detail: "Gaseosas y pan rallado"
  },
  {
    id: "mv-3",
    label: "Venta pedido P-101",
    amount: 1070,
    createdAtLabel: "12:08",
    detail: "Hamburguesa clasica x2, Papas fritas x1",
    orderId: "P-101"
  }
];

export const roleTabs: Array<{ key: ViewKey; label: string }> = [
  { key: "jefe", label: "Panel jefe" },
  { key: "cocina-afuera", label: "Cocina afuera" },
  { key: "cocina-adentro", label: "Cocina adentro" },
  { key: "repartidor-a", label: "Repartidor A" },
  { key: "repartidor-b", label: "Repartidor B" }
];
