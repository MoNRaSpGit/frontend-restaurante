import type {
  Customer,
  DeliveryStatus,
  DraftOrderItem,
  KitchenOrderGroup,
  KitchenStatus,
  Order
} from "../types";

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-UY", {
    style: "currency",
    currency: "UYU",
    maximumFractionDigits: 0
  }).format(value);
}

export function nextKitchenStatus(currentStatus: KitchenStatus) {
  if (currentStatus === "pendiente") {
    return "preparacion";
  }

  if (currentStatus === "preparacion") {
    return "lista";
  }

  return "lista";
}

export function nextDeliveryStatus(currentStatus: DeliveryStatus) {
  if (currentStatus === "asignado") {
    return "en-camino";
  }

  if (currentStatus === "en-camino") {
    return "entregado";
  }

  return currentStatus;
}

export function findCustomerByTerm(customers: Customer[], term: string) {
  const normalizedTerm = term.trim().toLowerCase();
  if (!normalizedTerm) {
    return null;
  }

  return (
    customers.find(
      (customer) =>
        customer.name.toLowerCase().includes(normalizedTerm) || customer.phone.includes(normalizedTerm)
    ) ?? null
  );
}

export function buildMovementDetail(items: DraftOrderItem[]) {
  return items.map((item) => `${item.name} x${item.quantity}`).join(", ");
}

export function groupOrdersByKitchen(orders: Order[], kitchen: "afuera" | "adentro"): KitchenOrderGroup[] {
  return orders
    .map((order) => ({
      order,
      items: order.items.filter((item) => item.kitchen === kitchen)
    }))
    .filter((entry) => entry.items.length > 0);
}
