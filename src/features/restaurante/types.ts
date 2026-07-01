export type ViewKey = "jefe" | "cocina" | "delivery";
export type KitchenKey = "cocina" | "mostrador";
export type MenuCategoryKey = "hamburguesas" | "milanesas" | "bebidas";
export type KitchenStatus = "pendiente" | "preparacion" | "lista";
export type DeliveryStatus = "sin-asignar" | "asignado" | "en-camino" | "entregado";
export type RiderPresence = "local" | "calle" | "regresando";

export type Customer = {
  id: string;
  name: string;
  phone: string;
  address: string;
};

export type MenuItem = {
  id: string;
  name: string;
  price: number;
  category: MenuCategoryKey;
};

export type DraftOrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: MenuCategoryKey;
  kitchen: KitchenKey;
};

export type OrderKitchenItem = DraftOrderItem & {
  dismissedAtKitchen?: boolean;
  status: KitchenStatus;
};

export type Order = {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  address: string;
  items: OrderKitchenItem[];
  riderId: string | null;
  deliveryStatus: DeliveryStatus;
  createdAtLabel: string;
  total: number;
};

export type Rider = {
  id: string;
  name: string;
  presence: RiderPresence;
};

export type Movement = {
  id: string;
  label: string;
  amount: number;
  createdAtLabel: string;
  detail: string;
  orderId?: string;
};

export type KitchenOrderGroup = {
  order: Order;
  items: OrderKitchenItem[];
};
