import { useMemo, useState } from "react";
import { categoryLabels, menuCatalog } from "../data/restaurantData";
import { formatCurrency, getRiderPresenceUi } from "../lib/restaurantUtils";
import type {
  Customer,
  DeliveryStatus,
  DraftOrderItem,
  KitchenOrderGroup,
  KitchenStatus,
  Movement,
  MenuCategoryKey,
  Order,
  OrderKitchenItem,
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
  onCreateQuickCustomer: (name: string, address: string) => Customer | null;
  onAddMenuItem: (item: (typeof menuCatalog)[number]) => void;
  onChangeDraftQuantity: (itemId: string, direction: "up" | "down") => void;
  onResetDraft: () => void;
  onSubmitOrder: () => void;
  kitchenOrders: KitchenOrderGroup[];
  orders: Order[];
  riders: Rider[];
  onAssignRider: (orderId: string, riderId: string) => void;
  onAdvanceKitchenItem: (orderId: string, itemId: string) => void;
  onDismissKitchenItem: (orderId: string, itemId: string) => void;
  onAdvanceRiderOrder: (orderId: string) => void;
  movements: Movement[];
  expandedMovementId: string | null;
  onToggleMovement: (movementId: string) => void;
};

const categories: MenuCategoryKey[] = ["hamburguesas", "milanesas", "bebidas"];
type LeftPanelTab = "cliente" | "pedido" | "control" | "movimientos";

const assignRiderLabels: Record<string, string> = {
  r1: "Delivery"
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
  kitchenOrders,
  orders,
  riders,
  onAssignRider,
  onAdvanceKitchenItem,
  onDismissKitchenItem,
  onAdvanceRiderOrder,
  movements,
  expandedMovementId,
  onToggleMovement
}: Props) {
  const [activeCategory, setActiveCategory] = useState<MenuCategoryKey>("hamburguesas");
  const [activeLeftTab, setActiveLeftTab] = useState<LeftPanelTab>("cliente");
  const [isOrdersCollapsed, setIsOrdersCollapsed] = useState(false);
  const [isKitchenCollapsed, setIsKitchenCollapsed] = useState(false);
  const [isDeliveryCollapsed, setIsDeliveryCollapsed] = useState(false);
  const [showCustomerList, setShowCustomerList] = useState(false);
  const [showCreateClientModal, setShowCreateClientModal] = useState(false);
  const [quickCustomerName, setQuickCustomerName] = useState("");
  const [quickCustomerAddress, setQuickCustomerAddress] = useState("");
  const [assignOrderModal, setAssignOrderModal] = useState<Order | null>(null);
  const [collapsedDeliveredOrderIds, setCollapsedDeliveredOrderIds] = useState<string[]>([]);

  const draftTotal = draftItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const activeMenuItems = menuCatalog.filter((item) => item.category === activeCategory);
  const visibleCustomers = useMemo(() => {
    const normalizedTerm = customerLookup.trim().toLowerCase();
    if (!normalizedTerm) {
      return customers;
    }

    return customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(normalizedTerm) ||
        customer.address.toLowerCase().includes(normalizedTerm)
    );
  }, [customerLookup, customers]);
  const controlOrders = useMemo(
    () =>
      [...orders].sort((left, right) => {
        if (left.deliveryStatus === "entregado" && right.deliveryStatus !== "entregado") {
          return 1;
        }

        if (left.deliveryStatus !== "entregado" && right.deliveryStatus === "entregado") {
          return -1;
        }

        return right.id.localeCompare(left.id);
      }),
    [orders]
  );
  const pendingOrdersCount = useMemo(
    () => orders.filter((order) => order.deliveryStatus !== "entregado").length,
    [orders]
  );
  const deliveryRider = riders.find((rider) => rider.id === "r1") ?? null;
  const deliveryOrders = useMemo(
    () => orders.filter((order) => order.riderId === "r1"),
    [orders]
  );
  const salesDaily = useMemo(
    () => movements.filter((movement) => movement.amount > 0).reduce((sum, movement) => sum + movement.amount, 0),
    [movements]
  );
  const estimatedGain = Math.round(salesDaily * 0.3);

  return (
    <section className="ops-stack dashboard-stack">
      <div className="system-title-block dashboard-title">
        <h1>Sistema de Pedidos</h1>
      </div>

      <section className="dashboard-grid">
        <section className="panel panel-form dashboard-column">
          <div className="dashboard-column-topbar">
            <div className="dashboard-column-header">
              <span className="panel-kicker">Pedidos</span>
            </div>
            <button
              type="button"
              className="section-collapse-button"
              aria-label={isOrdersCollapsed ? "Mostrar pedidos" : "Minimizar pedidos"}
              onClick={() => setIsOrdersCollapsed((current) => !current)}
            >
              {isOrdersCollapsed ? "v" : "^"}
            </button>
          </div>

          {!isOrdersCollapsed ? (
          <>
          <div className="control-tabs" aria-label="Secciones de pedidos">
            <button
              type="button"
              className={activeLeftTab === "cliente" ? "control-tab active" : "control-tab"}
              onClick={() => setActiveLeftTab("cliente")}
            >
              Cliente
            </button>
            <button
              type="button"
              className={activeLeftTab === "pedido" ? "control-tab active" : "control-tab"}
              onClick={() => setActiveLeftTab("pedido")}
            >
              Pedido
            </button>
            <button
              type="button"
              className={activeLeftTab === "control" ? "control-tab active" : "control-tab"}
              onClick={() => setActiveLeftTab("control")}
            >
              Control
            </button>
            <button
              type="button"
              className={activeLeftTab === "movimientos" ? "control-tab active" : "control-tab"}
              onClick={() => setActiveLeftTab("movimientos")}
            >
              Movimientos
            </button>
          </div>

          {activeLeftTab === "cliente" ? (
          <section className="guided-section dashboard-card-section">
            <div className="field-group">
              <label htmlFor="customer-lookup">Cliente</label>
              <div className="inline-search inline-search-plus">
                <input
                  id="customer-lookup"
                  type="text"
                  value={customerLookup}
                  placeholder="Buscar por nombre o direccion"
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
                <button
                  type="button"
                  className="plus-button"
                  aria-label="Agregar cliente"
                  onClick={() => setShowCreateClientModal(true)}
                >
                  +
                </button>
              </div>
            </div>

            <p className="panel-copy">{matchedCustomerLabel}</p>

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
                        setActiveLeftTab("pedido");
                      }}
                    >
                      <strong>{customer.name}</strong>
                      <span>{`Direccion: ${customer.address || "Sin direccion"}`}</span>
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
                  setActiveLeftTab("pedido");
                }}
              >
                Asignar cliente al pedido
              </button>
            </div>
          </section>
          ) : null}

          {activeLeftTab === "pedido" ? (
          <section className="guided-section dashboard-card-section">
            <div className="section-inline-header">
              <strong>Pedido</strong>
              <span>Armado de comanda</span>
            </div>

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
                <button type="button" className="ghost-button" onClick={() => setActiveLeftTab("cliente")}>
                  Volver
                </button>
                <button type="button" className="ghost-button" onClick={onResetDraft}>
                  Limpiar
                </button>
                <button
                  type="button"
                  className="primary-button"
                  onClick={() => {
                    onSubmitOrder();
                    setActiveLeftTab("control");
                  }}
                >
                  Confirmar pedido
                </button>
              </div>
            </div>
          </section>
          ) : null}

          {activeLeftTab === "control" ? (
          <section className="guided-section dashboard-card-section">
            <div className="section-inline-header">
              <strong>Control</strong>
              <span>{pendingOrdersCount} activos</span>
            </div>

            <div className="mini-order-list">
              {controlOrders.length === 0 ? <div className="empty-state">No hay pedidos cargados.</div> : null}
              {controlOrders.map((order) => {
                const controlStatus = getControlOrderStatus(order, order.items);
                const assignedRider = riders.find((rider) => rider.id === order.riderId);
                const assignedRiderLabel = getControlRiderLabel(assignedRider);
                const isCollapsedDelivered =
                  order.deliveryStatus === "entregado" && collapsedDeliveredOrderIds.includes(order.id);

                return (
                  <article key={order.id} className={`mini-order-card${isCollapsedDelivered ? " collapsed" : ""}`}>
                    <div className="mini-order-card-header">
                      <div>
                        <strong className="mini-order-code">{order.id}</strong>
                        <span>{order.customerName}</span>
                      </div>
                    </div>

                    {!isCollapsedDelivered ? (
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
                    ) : null}

                    <div className="mini-order-footer">
                      <div className="mini-order-assignment">
                        {assignedRiderLabel === "Delivery" ? "Delivery" : `Delivery: ${assignedRiderLabel}`}
                      </div>
                      <div className="mini-order-total">{formatCurrency(order.total)}</div>
                      <button
                        type="button"
                        className={`mini-status-chip action ${controlStatus.tone}`}
                        onClick={() => {
                          if (controlStatus.action === "assign") {
                            setAssignOrderModal(order);
                            return;
                          }

                          if (controlStatus.action === "toggle-delivered") {
                            setCollapsedDeliveredOrderIds((currentIds) =>
                              isCollapsedDelivered
                                ? currentIds.filter((currentId) => currentId !== order.id)
                                : [...currentIds, order.id]
                            );
                          }
                        }}
                        disabled={controlStatus.action === "none"}
                      >
                        {isCollapsedDelivered && controlStatus.action === "toggle-delivered"
                          ? "Ver detalle"
                          : controlStatus.label}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
          ) : null}

          {activeLeftTab === "movimientos" ? (
          <section className="guided-section dashboard-card-section compact-movements">
            <div className="section-inline-header">
              <strong>Movimientos</strong>
              <span>{formatCurrency(salesDaily)}</span>
            </div>

            <div className="movement-summary-grid">
              <article className="summary-card">
                <span>Ventas diarias</span>
                <strong>{formatCurrency(salesDaily)}</strong>
              </article>
              <article className="summary-card">
                <span>Ganancia</span>
                <strong className="money-positive">{formatCurrency(estimatedGain)}</strong>
              </article>
            </div>

            <div className="movement-list">
              {movements.length === 0 ? <div className="empty-state">Todavia no hay movimientos.</div> : null}
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
          ) : null}
          </>
          ) : null}
        </section>

        <section className="dashboard-column">
          <StationPanel
            title="Cocina"
            orders={kitchenOrders}
            onAdvanceItem={onAdvanceKitchenItem}
            onDismissItem={onDismissKitchenItem}
            isCollapsed={isKitchenCollapsed}
            onToggleCollapsed={() => setIsKitchenCollapsed((current) => !current)}
          />
        </section>

        <section className="dashboard-column">
          <DeliveryPanel
            rider={deliveryRider}
            orders={deliveryOrders}
            onAdvanceRiderOrder={onAdvanceRiderOrder}
            isCollapsed={isDeliveryCollapsed}
            onToggleCollapsed={() => setIsDeliveryCollapsed((current) => !current)}
          />
        </section>
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
                Direccion
                <input type="text" value={quickCustomerAddress} onChange={(event) => setQuickCustomerAddress(event.target.value)} placeholder="Direccion del cliente" />
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
                  const customer = onCreateQuickCustomer(quickCustomerName, quickCustomerAddress);
                  if (!customer) {
                    return;
                  }

                  setQuickCustomerName("");
                  setQuickCustomerAddress("");
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
  onAdvanceItem,
  onDismissItem,
  isCollapsed,
  onToggleCollapsed
}: {
  title: string;
  orders: KitchenOrderGroup[];
  onAdvanceItem: (orderId: string, itemId: string) => void;
  onDismissItem: (orderId: string, itemId: string) => void;
  isCollapsed: boolean;
  onToggleCollapsed: () => void;
}) {
  const recentOrders = orders
    .map(({ order, items }) => ({
      order,
      items: items.filter((item) => item.status !== "lista")
    }))
    .filter(({ items }) => items.length > 0);
  const readyOrders = orders
    .map(({ order, items }) => ({
      order,
      items: items.filter((item) => item.status === "lista")
    }))
    .filter(({ items }) => items.length > 0);

  return (
    <section className="panel panel-role dashboard-column-fill">
      <div className="dashboard-column-topbar">
        <div className="dashboard-column-header">
          <span className="panel-kicker">Cocina</span>
          {!isCollapsed ? <h2>{title}</h2> : null}
        </div>
        <button
          type="button"
          className="section-collapse-button"
          aria-label={isCollapsed ? "Mostrar cocina" : "Minimizar cocina"}
          onClick={onToggleCollapsed}
        >
          {isCollapsed ? "v" : "^"}
        </button>
      </div>

      {!isCollapsed ? (
      <div className="kitchen-board-grid">
        <StationOrderBoard
          title="Comandas entrando"
          emptyLabel="No hay pedidos entrando en cocina."
          orders={recentOrders}
          onAdvanceItem={onAdvanceItem}
          onDismissItem={onDismissItem}
          readyMode={false}
        />
        <StationOrderBoard
          title="Pedidos prontos"
          emptyLabel="No hay pedidos prontos en cocina."
          orders={readyOrders}
          onAdvanceItem={onAdvanceItem}
          onDismissItem={onDismissItem}
          readyMode
        />
      </div>
      ) : null}
    </section>
  );
}

function StationOrderBoard({
  title,
  emptyLabel,
  orders,
  onAdvanceItem,
  onDismissItem,
  readyMode
}: {
  title: string;
  emptyLabel: string;
  orders: KitchenOrderGroup[];
  onAdvanceItem: (orderId: string, itemId: string) => void;
  onDismissItem: (orderId: string, itemId: string) => void;
  readyMode: boolean;
}) {
  return (
    <section className={`kitchen-board ${readyMode ? "ready" : "recent"}`}>
      <div className="kitchen-board-header">
        <strong>{title}</strong>
        <span>{orders.length} pedidos</span>
      </div>

      <div className="kitchen-ticket-list">
        {orders.length === 0 ? <div className="empty-state">{emptyLabel}</div> : null}
        {orders.map(({ order, items }) => (
          <article key={order.id} className="kitchen-ticket">
            <div className="kitchen-ticket-top">
              <div>
                <strong>{order.id}</strong>
                <span>{order.customerName}</span>
              </div>
            </div>

            <StationItems
              orderId={order.id}
              items={items}
              onAdvanceItem={onAdvanceItem}
              onDismissItem={onDismissItem}
              readyMode={readyMode}
            />
          </article>
        ))}
      </div>
    </section>
  );
}

function StationItems({
  orderId,
  items,
  onAdvanceItem,
  onDismissItem,
  readyMode
}: {
  orderId: string;
  items: OrderKitchenItem[];
  onAdvanceItem: (orderId: string, itemId: string) => void;
  onDismissItem: (orderId: string, itemId: string) => void;
  readyMode: boolean;
}) {
  return (
    <div className="kitchen-item-list">
      {items.map((item) => (
        <div key={item.id} className={`kitchen-item ${item.status}`}>
          {readyMode ? (
            <button type="button" className="kitchen-item-main" onClick={() => onAdvanceItem(orderId, item.id)}>
              <div>
                <strong>
                  {item.name} x{item.quantity}
                </strong>
                <span>{formatCurrency(item.price * item.quantity)}</span>
              </div>
              <span className="kitchen-status-label">Volver a pendiente</span>
            </button>
          ) : (
            <button type="button" className="kitchen-item-main" onClick={() => onAdvanceItem(orderId, item.id)}>
              <div>
                <strong>
                  {item.name} x{item.quantity}
                </strong>
                <span>{formatCurrency(item.price * item.quantity)}</span>
              </div>
              <span className="kitchen-status-label">{getKitchenStatusLabel(item.status)}</span>
            </button>
          )}
          {readyMode ? (
            <button
              type="button"
              className="kitchen-remove-button"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onDismissItem(orderId, item.id);
              }}
            >
              Borrar
            </button>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function DeliveryPanel({
  rider,
  orders,
  onAdvanceRiderOrder,
  isCollapsed,
  onToggleCollapsed
}: {
  rider: Rider | null;
  orders: Order[];
  onAdvanceRiderOrder: (orderId: string) => void;
  isCollapsed: boolean;
  onToggleCollapsed: () => void;
}) {
  const riderPresence = rider ? getRiderPresenceUi(rider.presence) : null;

  return (
    <section className="panel panel-role dashboard-column-fill">
      <div className="dashboard-column-topbar">
        <div className="dashboard-column-header">
          <span className="panel-kicker">Delivery</span>
          {!isCollapsed ? <h2>{rider?.name ?? "Delivery"}</h2> : null}
          {!isCollapsed ? (
            <p className="panel-copy">
              Estado actual: <strong>{riderPresence ? `${riderPresence.icon} ${riderPresence.label}` : "Sin estado"}</strong>
            </p>
          ) : null}
        </div>
        <button
          type="button"
          className="section-collapse-button"
          aria-label={isCollapsed ? "Mostrar delivery" : "Minimizar delivery"}
          onClick={onToggleCollapsed}
        >
          {isCollapsed ? "v" : "^"}
        </button>
      </div>

      {!isCollapsed ? (
      <div className="order-board rider-order-list">
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
      ) : null}
    </section>
  );
}

function getOrderKitchenStatus(items: KitchenOrderGroup["items"]) {
  if (items.every((item) => item.status === "lista")) {
    return "lista";
  }

  return "pendiente";
}

function getControlOrderStatus(order: Order, items: KitchenOrderGroup["items"]) {
  if (order.deliveryStatus === "entregado") {
    return { label: "Entregado", tone: "lista", action: "toggle-delivered" as const };
  }

  if (order.deliveryStatus === "en-camino") {
    return { label: "En viaje", tone: "pending", action: "none" as const };
  }

  if (order.deliveryStatus === "asignado") {
    return { label: "Asignado a delivery", tone: "lista", action: "none" as const };
  }

  if (getOrderKitchenStatus(items) === "lista") {
    return { label: "Listo - asignar delivery", tone: "lista", action: "assign" as const };
  }

  return { label: "Pedido en cocina", tone: "neutral", action: "none" as const };
}

function getKitchenStatusLabel(status: KitchenStatus) {
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

function getControlRiderLabel(rider?: Rider) {
  if (!rider) {
    return "Sin asignar";
  }

  return assignRiderLabels[rider.id] ?? rider.name;
}
