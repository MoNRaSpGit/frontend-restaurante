import { useMemo, useRef, useState } from "react";
import {
  existingCustomers,
  initialMovements,
  initialOrders,
  initialRiders
} from "../data/restaurantData";
import {
  buildMovementDetail,
  findCustomerByTerm,
  groupOrdersByKitchen,
  resolveKitchenByCategory,
  nextDeliveryStatus,
  nextKitchenStatus
} from "../lib/restaurantUtils";
import type {
  Customer,
  DraftOrderItem,
  MenuCategoryKey,
  Movement,
  Order,
  Rider,
  ViewKey
} from "../types";

export function useRestaurantOperations() {
  const orderSequenceRef = useRef(103);
  const customerSequenceRef = useRef(4);
  const movementSequenceRef = useRef(4);
  const itemSequenceRef = useRef(10);

  const [activeView, setActiveView] = useState<ViewKey>("jefe");
  const [customers, setCustomers] = useState<Customer[]>(existingCustomers);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [movements, setMovements] = useState<Movement[]>(initialMovements);
  const [expandedMovementId, setExpandedMovementId] = useState<string | null>(null);

  const [customerLookup, setCustomerLookup] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newCustomerPhone, setNewCustomerPhone] = useState("");
  const [newCustomerAddress, setNewCustomerAddress] = useState("");
  const [draftItems, setDraftItems] = useState<DraftOrderItem[]>([]);

  const selectedCustomer = customers.find((customer) => customer.id === selectedCustomerId) ?? null;
  const matchedCustomer = findCustomerByTerm(customers, customerLookup);
  const riders = useMemo<Rider[]>(
    () =>
      initialRiders.map((rider) => {
        const riderOrders = orders.filter(
          (order) => order.riderId === rider.id && order.deliveryStatus !== "entregado"
        );

        if (riderOrders.some((order) => order.deliveryStatus === "en-camino")) {
          return {
            ...rider,
            presence: "calle"
          };
        }

        if (riderOrders.some((order) => order.deliveryStatus === "asignado")) {
          return {
            ...rider,
            presence: "local"
          };
        }

        return {
          ...rider,
          presence: "regresando"
        };
      }),
    [orders]
  );

  const summary = useMemo(() => {
    const pendingOrdersCount = orders.filter((order) => order.deliveryStatus !== "entregado").length;
    const activeKitchenItems = orders.flatMap((order) => order.items).filter((item) => item.status !== "lista").length;
    const ridersOnStreet = riders.filter((rider) => rider.presence === "calle").length;
    const todayIncome = movements.reduce((sum, movement) => sum + movement.amount, 0);

    return {
      pendingOrdersCount,
      activeKitchenItems,
      ridersOnStreet,
      todayIncome
    };
  }, [movements, orders, riders]);

  const kitchenViews = useMemo(
    () => ({
      cartOrders: groupOrdersByKitchen(orders.filter((order) => order.deliveryStatus !== "entregado"), "carrito"),
      kitchenOrders: groupOrdersByKitchen(orders.filter((order) => order.deliveryStatus !== "entregado"), "cocina"),
      counterOrders: groupOrdersByKitchen(orders.filter((order) => order.deliveryStatus !== "entregado"), "mostrador")
    }),
    [orders]
  );

  const riderViews = useMemo(
    () => ({
      riderAOrders: orders.filter((order) => order.riderId === "r1" && order.deliveryStatus !== "entregado"),
      riderBOrders: orders.filter((order) => order.riderId === "r2" && order.deliveryStatus !== "entregado")
    }),
    [orders]
  );

  function resetDraft() {
    setSelectedCustomerId(null);
    setCustomerLookup("");
    setNewCustomerName("");
    setNewCustomerPhone("");
    setNewCustomerAddress("");
    setDraftItems([]);
  }

  function selectMatchedCustomer() {
    if (!matchedCustomer) {
      return;
    }

    setSelectedCustomerId(matchedCustomer.id);
    setCustomerLookup("");
    setNewCustomerName(matchedCustomer.name);
    setNewCustomerPhone(matchedCustomer.phone);
    setNewCustomerAddress(matchedCustomer.address);
  }

  function selectCustomerById(customerId: string) {
    const customer = customers.find((entry) => entry.id === customerId);
    if (!customer) {
      return;
    }

    setSelectedCustomerId(customer.id);
    setCustomerLookup("");
    setNewCustomerName(customer.name);
    setNewCustomerPhone(customer.phone);
    setNewCustomerAddress(customer.address);
  }

  function createQuickCustomer(name: string, phone: string) {
    const normalizedName = name.trim();
    if (!normalizedName) {
      return null;
    }

    const customer: Customer = {
      id: `c${customerSequenceRef.current++}`,
      name: normalizedName,
      phone: phone.trim(),
      address: ""
    };

    setCustomers((currentCustomers) => [...currentCustomers, customer]);
    setSelectedCustomerId(customer.id);
    setCustomerLookup("");
    setNewCustomerName(customer.name);
    setNewCustomerPhone(customer.phone);
    setNewCustomerAddress(customer.address);
    return customer;
  }

  function setCustomerField(field: "name" | "phone" | "address", value: string) {
    setSelectedCustomerId(null);

    if (field === "name") {
      setNewCustomerName(value);
      return;
    }

    if (field === "phone") {
      setNewCustomerPhone(value);
      return;
    }

    setNewCustomerAddress(value);
  }

  function addMenuItemToDraft(menuItem: { name: string; price: number; category: MenuCategoryKey }) {
    setDraftItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.name === menuItem.name);
      if (existingItem) {
        return currentItems.map((item) =>
          item.id === existingItem.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      return [
        ...currentItems,
        {
          id: `draft-${itemSequenceRef.current++}`,
          name: menuItem.name,
          price: menuItem.price,
          quantity: 1,
          category: menuItem.category,
          kitchen: resolveKitchenByCategory(menuItem.category)
        }
      ];
    });
  }

  function changeDraftQuantity(itemId: string, direction: "up" | "down") {
    setDraftItems((currentItems) =>
      currentItems.flatMap((item) => {
        if (item.id !== itemId) {
          return [item];
        }

        if (direction === "down" && item.quantity <= 1) {
          return [];
        }

        const quantity = direction === "up" ? item.quantity + 1 : item.quantity - 1;
        return [{ ...item, quantity }];
      })
    );
  }

  function ensureCustomer() {
    if (selectedCustomer) {
      return selectedCustomer;
    }

    if (!newCustomerName.trim()) {
      return null;
    }

    const customer: Customer = {
      id: `c${customerSequenceRef.current++}`,
      name: newCustomerName.trim(),
      phone: newCustomerPhone.trim(),
      address: newCustomerAddress.trim()
    };

    setCustomers((currentCustomers) => [...currentCustomers, customer]);
    setSelectedCustomerId(customer.id);
    return customer;
  }

  function submitOrder() {
    if (draftItems.length === 0) {
      return;
    }

    const customer = ensureCustomer();
    if (!customer) {
      return;
    }

    const total = draftItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const orderId = `P-${orderSequenceRef.current++}`;
    const createdAtLabel = new Date().toLocaleTimeString("es-UY", {
      hour: "2-digit",
      minute: "2-digit"
    });

    const order: Order = {
      id: orderId,
      customerId: customer.id,
      customerName: customer.name,
      customerPhone: customer.phone,
      address: customer.address,
      items: draftItems.map((item) => ({
        ...item,
        status: item.kitchen === "mostrador" ? "lista" : "pendiente"
      })),
      riderId: null,
      deliveryStatus: "sin-asignar",
      createdAtLabel,
      total
    };

    const movement: Movement = {
      id: `mv-${movementSequenceRef.current++}`,
      label: `Venta pedido ${orderId}`,
      amount: total,
      createdAtLabel,
      detail: buildMovementDetail(draftItems),
      orderId
    };

    setOrders((currentOrders) => [order, ...currentOrders]);
    setMovements((currentMovements) => [movement, ...currentMovements]);
    resetDraft();
  }

  function advanceKitchenItem(orderId: string, itemId: string) {
    setOrders((currentOrders) =>
      currentOrders.map((order) => {
        if (order.id !== orderId) {
          return order;
        }

        return {
          ...order,
          items: order.items.map((item) =>
            item.id === itemId
              ? {
                  ...item,
                  status: nextKitchenStatus(item.status)
                }
              : item
          )
        };
      })
    );
  }

  function assignRider(orderId: string, riderId: string) {
    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              riderId,
              deliveryStatus: order.deliveryStatus === "sin-asignar" ? "asignado" : order.deliveryStatus
            }
          : order
      )
    );
  }

  function advanceRiderOrder(orderId: string) {
    setOrders((currentOrders) =>
      currentOrders.map((order) => {
        if (order.id !== orderId || !order.riderId) {
          return order;
        }

        const nextStatus = nextDeliveryStatus(order.deliveryStatus);
        return {
          ...order,
          deliveryStatus: nextStatus
        };
      })
    );
  }

  return {
    activeView,
    setActiveView,
    customers,
    orders,
    riders,
    movements,
    expandedMovementId,
    setExpandedMovementId,
    customerLookup,
    setCustomerLookup,
    selectedCustomer,
    matchedCustomer,
    newCustomerName,
    newCustomerPhone,
    newCustomerAddress,
    setCustomerField,
    draftItems,
    summary,
    kitchenViews,
    riderViews,
    resetDraft,
    selectMatchedCustomer,
    selectCustomerById,
    createQuickCustomer,
    addMenuItemToDraft,
    changeDraftQuantity,
    submitOrder,
    advanceKitchenItem,
    assignRider,
    advanceRiderOrder
  };
}
