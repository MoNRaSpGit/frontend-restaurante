import { useMemo, useState } from "react";
import { categoryLabels, menuCatalog } from "../data/restaurantData";
import { formatCurrency, getRiderPresenceUi } from "../lib/restaurantUtils";
import type {
  Customer,
  DeliveryStatus,
  DraftOrderItem,
  KitchenOrderGroup,
  KitchenStatus,
  MenuCategoryKey,
  Movement,
  Order,
  Rider
} from "../types";

type Props = {
  customerLookup: string;
  onCustomerLookupChange: (value: string) => void;
  customers: Customer[];
  matchedCustomerLabel: string;
  draftItems: DraftOrderItem[];
  onSelectMatchedCustomer: () => void;
  onSelectCustomerById: (customerId: string) => void;
  onCreateQuickCustomer: (name: string, phone: string) => Customer | null;
  onAddMenuItem: (item: (typeof menuCatalog)[number]) => void;
  onChangeDraftQuantity: (itemId: string, direction: "up" | "down") => void;
  onResetDraft: () => void;
  onSubmitOrder: () => void;
  cartOrders: KitchenOrderGroup[];
  kitchenOrders: KitchenOrderGroup[];
  orders: Order[];
  riders: Rider[];
  onAssignRider: (orderId: string, riderId: string) => void;
  onAdvanceKitchenItem: (orderId: string, itemId: string) => void;
  onAdvanceRiderOrder: (orderId: string) => void;
  movements: Movement[];
  expandedMovementId: string | null;
  onToggleMovement: (movementId: string) => void;
};

const categories: MenuCategoryKey[] = ["hamburguesas", "milanesas", "bebidas"];
type ControlTabKey = "cliente" | "pedido" | "control" | "cocina" | "carrito" | "delivery-a" | "delivery-b" | "movimientos";
type ControlPageButton =
  | { kind: "tab"; key: ControlTabKey; label: string }
  | { kind: "action"; key: "close-session"; label: string };

const controlTabPages: ControlPageButton[][] = [
  [
    { kind: "tab", key: "cliente", label: "Cliente" },
    { kind: "tab", key: "pedido", label: "Pedido" },
    { kind: "tab", key: "control", label: "Control" }
  ],
  [
    { kind: "tab", key: "cocina", label: "Cocina" },
    { kind: "tab", key: "carrito", label: "Carrito" },
    { kind: "tab", key: "control", label: "Control" }
  ],
  [
    { kind: "tab", key: "delivery-b", label: "Deli Maria" },
    { kind: "tab", key: "delivery-a", label: "Deli Juan" },
    { kind: "tab", key: "control", label: "Control" }
  ],
  [
    { kind: "tab", key: "movimientos", label: "Movimientos" },
    { kind: "action", key: "close-session", label: "Cerrar sesion" },
    { kind: "tab", key: "control", label: "Control" }
  ]
];

const assignRiderLabels: Record<string, string> = {
  r1: "Juan",
  r2: "Maria"
};

export function BossPanel({
  customerLookup,
  onCustomerLookupChange,
  customers,
  matchedCustomerLabel,
  draftItems,
  onSelectMatchedCustomer,
  onSelectCustomerById,
  onCreateQuickCustomer,
  onAddMenuItem,
  onChangeDraftQuantity,
  onResetDraft,
  onSubmitOrder,
  cartOrders,
  kitchenOrders,
  orders,
  riders,
  onAssignRider,
  onAdvanceKitchenItem,
  onAdvanceRiderOrder,
  movements,
  expandedMovementId,
  onToggleMovement
}: Props) {
  const [activeCategory, setActiveCategory] = useState<MenuCategoryKey>("hamburguesas");
  const [activeTab, setActiveTab] = useState<ControlTabKey>("cliente");
  const [visibleControlPage, setVisibleControlPage] = useState(0);
  const [showCustomerList, setShowCustomerList] = useState(false);
  const [showCreateClientModal, setShowCreateClientModal] = useState(false);
  const [quickCustomerName, setQuickCustomerName] = useState("");
  const [quickCustomerPhone, setQuickCustomerPhone] = useState("");
  const [assignOrderModal, setAssignOrderModal] = useState<Order | null>(null);

  const draftTotal = draftItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const activeMenuItems = menuCatalog.filter((item) => item.category === activeCategory);
  const visibleCustomers = useMemo(() => {
    const normalizedTerm = customerLookup.trim().toLowerCase();
    if (!normalizedTerm) {
      return customers;
    }

    return customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(normalizedTerm) || customer.phone.includes(normalizedTerm)
    );
  }, [customerLookup, customers]);

  const salesDaily = useMemo(
    () => movements.filter((movement) => movement.amount > 0).reduce((sum, movement) => sum + movement.amount, 0),
    [movements]
  );
  const estimatedGain = Math.round(salesDaily * 0.3);
  const activeOrders = useMemo(
    () => orders.filter((order) => order.deliveryStatus !== "entregado"),
    [orders]
  );
  const riderA = riders.find((rider) => rider.id === "r1") ?? null;
  const riderB = riders.find((rider) => rider.id === "r2") ?? null;
  const riderAOrders = useMemo(
    () => orders.filter((order) => order.riderId === "r1" && order.deliveryStatus !== "entregado"),
    [orders]
  );
  const riderBOrders = useMemo(
    () => orders.filter((order) => order.riderId === "r2" && order.deliveryStatus !== "entregado"),
    [orders]
  );
  const controlPageButtons = controlTabPages[visibleControlPage];

  function selectControlTab(nextTab: ControlTabKey) {
    setActiveTab(nextTab);
  }

  function goToControlPage(direction: "previous" | "next") {
    const totalPages = controlTabPages.length;
    const nextPage =
      direction === "next"
        ? (visibleControlPage + 1) % totalPages
        : (visibleControlPage - 1 + totalPages) % totalPages;
    const firstTabInPage = controlTabPages[nextPage].find((button) => button.kind === "tab");

    setVisibleControlPage(nextPage);

    if (firstTabInPage?.kind === "tab") {
      setActiveTab(firstTabInPage.key);
    }
  }

  return (
    <section className="ops-stack guided-stack">
      <section className="panel panel-form">
        <div className="system-title-block">
          <h1>Sistema de Pedidos</h1>
        </div>

        <div className="control-tabs-pager" aria-label="Paginacion de accesos">
          <button
            type="button"
            className="control-page-arrow"
            aria-label="Ver accesos anteriores"
            onClick={() => goToControlPage("previous")}
          >
            {"<"}
          </button>
          <span className="control-page-indicator">{`${visibleControlPage + 1}/${controlTabPages.length}`}</span>
          <button
            type="button"
            className="control-page-arrow"
            aria-label="Ver siguientes accesos"
            onClick={() => goToControlPage("next")}
          >
            {">"}
          </button>
        </div>

        <div className="control-tabs" aria-label="Secciones del panel">
          {controlPageButtons.map((button) => (
            <button
              key={button.key}
              type="button"
              className={
                button.kind === "tab"
                  ? button.key === activeTab
                    ? "control-tab active"
                    : "control-tab"
                  : "control-tab placeholder"
              }
              onClick={() => {
                if (button.kind === "tab") {
                  selectControlTab(button.key);
                }
              }}
            >
              {button.label}
            </button>
          ))}
        </div>

        {activeTab === "cliente" ? (
          <section className="guided-section">
            <div className="field-group">
              <label htmlFor="customer-lookup">Cliente</label>
              <div className="inline-search inline-search-plus">
                <input
                  id="customer-lookup"
                  type="text"
                  value={customerLookup}
                  placeholder="Buscar por nombre o telefono"
                  onChange={(event) => onCustomerLookupChange(event.target.value)}
                />
                <button
                  type="button"
                  className="toggle-list-button"
                  aria-label={showCustomerList ? "Ocultar clientes" : "Mostrar clientes"}
                  onClick={() => setShowCustomerList((current) => !current)}
                >
                  {showCustomerList ? "^" : "v"}
                </button>
                <button type="button" className="plus-button" aria-label="Agregar cliente" onClick={() => setShowCreateClientModal(true)}>
                  +
                </button>
              </div>
              <p className="field-hint">{matchedCustomerLabel}</p>
            </div>

            {showCustomerList ? (
              <section className="customer-list-card">
                <div className="customer-list">
                  {visibleCustomers.map((customer) => (
                    <button
                      key={customer.id}
                      type="button"
                      className="customer-list-item"
                      onClick={() => {
                        onSelectCustomerById(customer.id);
                        setShowCustomerList(false);
                        selectControlTab("pedido");
                      }}
                    >
                      <strong>{customer.name}</strong>
                      <span>
                        {customer.phone || "Sin telefono"}
                        {customer.address ? ` - ${customer.address}` : ""}
                      </span>
                    </button>
                  ))}
                  {visibleCustomers.length === 0 ? <div className="empty-state">No hay clientes para esa busqueda.</div> : null}
                </div>
              </section>
            ) : null}

            <div className="draft-actions">
              <button
                type="button"
                className="primary-button full-width"
                onClick={() => {
                  onSelectMatchedCustomer();
                  selectControlTab("pedido");
                }}
              >
                Asignar pedido
              </button>
            </div>
          </section>
        ) : null}

        {activeTab === "pedido" ? (
          <section className="guided-section">
            <div className="category-tabs" aria-label="Categorias del menu">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={category === activeCategory ? "category-tab active" : "category-tab"}
                  onClick={() => setActiveCategory(category)}
                >
                  {categoryLabels[category]}
                </button>
              ))}
            </div>

            <div className="category-panel">
              <div className="category-panel-header">
                <strong>{categoryLabels[activeCategory]}</strong>
                <span>{activeMenuItems.length} opciones</span>
              </div>

              <div className="menu-buttons">
                {activeMenuItems.map((item) => (
                  <button key={item.id} type="button" className="menu-item-button" onClick={() => onAddMenuItem(item)}>
                    <span>{item.name}</span>
                    <strong>{formatCurrency(item.price)}</strong>
                  </button>
                ))}
              </div>
            </div>

            <div className="draft-card">
              <div className="panel-heading compact">
                <div>
                  <span className="panel-kicker">Pedido</span>
                  <h3>Resumen del pedido</h3>
                </div>
                <strong>{formatCurrency(draftTotal)}</strong>
              </div>

              {draftItems.length === 0 ? (
                <div className="empty-state">Todavia no agregaste productos al pedido.</div>
              ) : (
                <div className="draft-list">
                  {draftItems.map((item) => (
                    <article key={item.id} className="draft-item guided-draft-item">
                      <div className="draft-item-copy">
                        <strong>{item.name}</strong>
                        <span>{formatCurrency(item.price)}</span>
                      </div>

                      <div className="draft-item-controls">
                        <div className="quantity-actions">
                          <button type="button" onClick={() => onChangeDraftQuantity(item.id, "down")}>
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button type="button" onClick={() => onChangeDraftQuantity(item.id, "up")}>
                            +
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}

              <div className="draft-actions">
                <button type="button" className="ghost-button" onClick={() => selectControlTab("cliente")}>
                  Volver a cliente
                </button>
                <button type="button" className="ghost-button" onClick={onResetDraft}>
                  Limpiar
                </button>
                <button
                  type="button"
                  className="primary-button"
                  onClick={() => {
                    onSubmitOrder();
                    selectControlTab("control");
                  }}
                >
                  Confirmar pedido
                </button>
              </div>
            </div>
          </section>
        ) : null}

        {activeTab === "control" ? (
          <section className="guided-section">
            <section className="live-card">
              <div className="live-card-header">
                <div>
                  <strong>Pedidos activos</strong>
                  <span>Seguimiento general por pedido</span>
                </div>
                <span>{activeOrders.length} pedidos</span>
              </div>

              <div className="mini-order-list">
                {activeOrders.length === 0 ? <div className="empty-state">No hay pedidos activos.</div> : null}
                {activeOrders.map((order) => {
                  const controlStatus = getControlOrderStatus(order, order.items);
                  const assignedRiderLabel = order.riderId
                    ? assignRiderLabels[order.riderId] ?? order.riderId
                    : "Sin asignar";
                  return (
                    <article key={order.id} className="mini-order-card">
                      <div className="mini-order-card-header">
                        <div>
                          <strong className="mini-order-code">{order.id}</strong>
                          <span>{order.customerName}</span>
                        </div>
                      </div>

                      <div className="mini-order-items">
                        {order.items.map((item) => (
                          <div key={item.id} className="mini-order-item-row">
                            <div className="mini-order-item-copy">
                              <strong>{item.name}</strong>
                              <span>
                                x{item.quantity} | {formatCurrency(item.price * item.quantity)}
                              </span>
                            </div>
                            <span className={`mini-item-status ${item.status}`}>{getKitchenStatusLabel(item.status)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="mini-order-footer">
                        <div className="mini-order-assignment">{`Delivery: ${assignedRiderLabel}`}</div>
                        <div className="mini-order-total">{formatCurrency(order.total)}</div>
                        <button
                          type="button"
                          className={`mini-status-chip action ${controlStatus.tone}`}
                          disabled={controlStatus.action !== "assign"}
                          onClick={() => {
                            if (controlStatus.action === "assign") {
                              setAssignOrderModal(order);
                            }
                          }}
                        >
                          {controlStatus.label}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          </section>
        ) : null}

        {activeTab === "cocina" ? (
          <section className="guided-section">
            <StationPanel title="Cocina" orders={kitchenOrders} onAdvanceItem={onAdvanceKitchenItem} />
          </section>
        ) : null}

        {activeTab === "carrito" ? (
          <section className="guided-section">
            <StationPanel title="Carrito" orders={cartOrders} onAdvanceItem={onAdvanceKitchenItem} />
          </section>
        ) : null}

        {activeTab === "movimientos" ? (
          <section className="guided-section">
            <div className="movement-summary-grid">
              <article className="summary-card">
                <span>Venta diaria</span>
                <strong>{formatCurrency(salesDaily)}</strong>
              </article>
              <article className="summary-card">
                <span>Ganancia</span>
                <strong className="money-positive">{formatCurrency(estimatedGain)}</strong>
              </article>
            </div>

            <section className="movements-card">
              <div className="panel-heading compact">
                <div>
                  <span className="panel-kicker">Caja</span>
                  <h3>Movimientos</h3>
                </div>
              </div>

              <div className="movement-list">
                {movements.map((movement) => {
                  const expanded = expandedMovementId === movement.id;
                  return (
                    <button key={movement.id} type="button" className="movement-row" onClick={() => onToggleMovement(movement.id)}>
                      <div className="movement-main">
                        <strong>{movement.label}</strong>
                        <span>{movement.createdAtLabel}</span>
                      </div>
                      <div className="movement-side">
                        <strong className={movement.amount >= 0 ? "money-positive" : "money-negative"}>
                          {movement.amount >= 0 ? "+" : "-"}
                          {formatCurrency(Math.abs(movement.amount))}
                        </strong>
                      </div>
                      {expanded ? <p className="movement-detail">{movement.detail}</p> : null}
                    </button>
                  );
                })}
              </div>
            </section>
          </section>
        ) : null}

        {activeTab === "delivery-a" ? (
          <section className="guided-section">
            <DeliveryPanel rider={riderA} orders={riderAOrders} onAdvanceRiderOrder={onAdvanceRiderOrder} />
          </section>
        ) : null}

        {activeTab === "delivery-b" ? (
          <section className="guided-section">
            <DeliveryPanel rider={riderB} orders={riderBOrders} onAdvanceRiderOrder={onAdvanceRiderOrder} />
          </section>
        ) : null}
      </section>

      {showCreateClientModal ? (
        <div className="modal-overlay" onClick={() => setShowCreateClientModal(false)}>
          <section className="modal-card compact-modal-card" onClick={(event) => event.stopPropagation()}>
            <div className="compact-create-header">
              <strong>Nuevo cliente</strong>
              <span>Nombre obligatorio</span>
            </div>

            <div className="customer-grid">
              <label>
                Nombre
                <input type="text" value={quickCustomerName} onChange={(event) => setQuickCustomerName(event.target.value)} placeholder="Nombre del cliente" />
              </label>
              <label>
                Telefono
                <input type="text" value={quickCustomerPhone} onChange={(event) => setQuickCustomerPhone(event.target.value)} placeholder="Opcional" />
              </label>
            </div>

            <div className="draft-actions">
              <button type="button" className="ghost-button" onClick={() => setShowCreateClientModal(false)}>
                Cancelar
              </button>
              <button
                type="button"
                className="primary-button"
                onClick={() => {
                  const customer = onCreateQuickCustomer(quickCustomerName, quickCustomerPhone);
                  if (!customer) {
                    return;
                  }

                  setQuickCustomerName("");
                  setQuickCustomerPhone("");
                  setShowCreateClientModal(false);
                }}
              >
                Guardar cliente
              </button>
            </div>
          </section>
        </div>
      ) : null}

      {assignOrderModal ? (
        <div className="modal-overlay" onClick={() => setAssignOrderModal(null)}>
          <section className="modal-card compact-modal-card" onClick={(event) => event.stopPropagation()}>
            <div className="compact-create-header">
              <strong>Asignar delivery</strong>
              <span>{assignOrderModal.id}</span>
            </div>

            <div className="assign-modal-copy">
              <strong>{assignOrderModal.customerName}</strong>
              <span>{assignOrderModal.address}</span>
            </div>

            <div className="assign-modal-list">
              {riders.map((rider) => {
                const riderPresence = getRiderPresenceUi(rider.presence);
                return (
                  <button
                    key={rider.id}
                    type="button"
                    className="assign-modal-button"
                    onClick={() => {
                      onAssignRider(assignOrderModal.id, rider.id);
                      setAssignOrderModal(null);
                    }}
                  >
                    <strong>{assignRiderLabels[rider.id] ?? rider.name}</strong>
                    <span>{`${riderPresence.icon} ${riderPresence.label}`}</span>
                  </button>
                );
              })}
            </div>

            <div className="draft-actions">
              <button type="button" className="ghost-button" onClick={() => setAssignOrderModal(null)}>
                Cancelar
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </section>
  );
}

function StationPanel({
  title,
  orders,
  onAdvanceItem
}: {
  title: string;
  orders: KitchenOrderGroup[];
  onAdvanceItem: (orderId: string, itemId: string) => void;
}) {
  return (
    <section className="live-card">
      <div className="live-card-header">
        <div>
          <strong>{title}</strong>
          <span>Productos en elaboracion</span>
        </div>
        <span>{orders.length} pedidos</span>
      </div>

      <div className="kitchen-ticket-list">
        {orders.length === 0 ? <div className="empty-state">No hay pedidos en este sector.</div> : null}
        {orders.map(({ order, items }) => (
          <article key={order.id} className="kitchen-ticket">
            <div className="kitchen-ticket-top">
              <div>
                <strong>{order.id}</strong>
                <span>{order.customerName}</span>
              </div>
            </div>

            <div className="kitchen-item-list">
              {items.map((item) => (
                <button key={item.id} type="button" className={`kitchen-item ${item.status}`} onClick={() => onAdvanceItem(order.id, item.id)}>
                  <div>
                    <strong>
                      {item.name} x{item.quantity}
                    </strong>
                    <span>{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                  <span className="kitchen-status-label">{getKitchenStatusLabel(item.status)}</span>
                </button>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function DeliveryPanel({
  rider,
  orders,
  onAdvanceRiderOrder
}: {
  rider: Rider | null;
  orders: Order[];
  onAdvanceRiderOrder: (orderId: string) => void;
}) {
  const riderPresence = rider ? getRiderPresenceUi(rider.presence) : null;

  return (
    <section className="dispatch-card">
      <div className="panel-heading compact">
        <div>
          <span className="panel-kicker">{rider?.name ?? "Delivery"}</span>
          <h3>Seguimiento de entregas</h3>
        </div>
        {riderPresence ? <span className="status-chip neutral">{`${riderPresence.icon} ${riderPresence.label}`}</span> : null}
      </div>

      <div className="order-board">
        {orders.length === 0 ? <div className="empty-state">No hay pedidos activos para este delivery.</div> : null}
        {orders.map((order) => (
          <article key={order.id} className="order-card">
            <div className="order-card-top">
              <div>
                <strong className="order-card-code">{order.id}</strong>
                <span className="order-card-customer">Cliente: {order.customerName}</span>
              </div>
              <strong>{formatCurrency(order.total)}</strong>
            </div>

            <div className="delivery-meta">
              <span>Direccion: {order.address || "Sin direccion"}</span>
              <span>Delivery: {rider?.name ?? "Sin asignar"}</span>
            </div>

            <div className="delivery-products">
              <strong className="delivery-products-title">Pedido</strong>
              <div className="delivery-products-list">
                {order.items.map((item) => (
                  <div key={item.id} className="delivery-product-row">
                    <span>{item.name}</span>
                    <strong>x{item.quantity}</strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="order-card-meta">
              <span className={getDeliveryStatusClass(order.deliveryStatus)}>{getDeliveryStatusLabel(order.deliveryStatus)}</span>
            </div>

            <div className="draft-actions">
              <button
                type="button"
                className="primary-button full-width"
                disabled={order.deliveryStatus === "entregado"}
                onClick={() => onAdvanceRiderOrder(order.id)}
              >
                {order.deliveryStatus === "asignado"
                  ? "Marcar en viaje"
                  : order.deliveryStatus === "en-camino"
                    ? "Marcar entregado"
                    : "Pedido entregado"}
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function getOrderKitchenStatus(items: KitchenOrderGroup["items"]) {
  if (items.every((item) => item.status === "lista")) {
    return "lista";
  }

  if (items.some((item) => item.status === "preparacion") || items.some((item) => item.status === "lista")) {
    return "preparacion";
  }

  return "pendiente";
}

function getControlOrderStatus(order: Order, items: KitchenOrderGroup["items"]) {
  if (order.deliveryStatus === "en-camino") {
    return { label: "En viaje", tone: "pending", action: "none" as const };
  }

  if (order.deliveryStatus === "asignado") {
    return { label: "Asignado a delivery", tone: "neutral", action: "none" as const };
  }

  if (getOrderKitchenStatus(items) === "lista") {
    return { label: "Listo - asignar delivery", tone: "lista", action: "assign" as const };
  }

  return { label: "Pedido en cocina", tone: "neutral", action: "none" as const };
}

function getKitchenStatusLabel(status: KitchenStatus) {
  if (status === "preparacion") {
    return "Preparando";
  }

  if (status === "lista") {
    return "Listo";
  }

  return "Pendiente";
}

function getDeliveryStatusLabel(status: DeliveryStatus) {
  if (status === "en-camino") {
    return "En viaje";
  }

  if (status === "entregado") {
    return "Entregado";
  }

  if (status === "asignado") {
    return "Asignado";
  }

  return "Sin asignar";
}

function getDeliveryStatusClass(status: DeliveryStatus) {
  if (status === "entregado") {
    return "status-chip ready";
  }

  if (status === "en-camino") {
    return "status-chip pending";
  }

  if (status === "asignado") {
    return "status-chip neutral";
  }

  return "status-chip neutral";
}
