import { kitchenLabels, menuCatalog } from "../data/restaurantData";
import { formatCurrency } from "../lib/restaurantUtils";
import type { DraftOrderItem, KitchenOrderGroup, Movement, Order, Rider } from "../types";

type Props = {
  customerLookup: string;
  onCustomerLookupChange: (value: string) => void;
  matchedCustomerLabel: string;
  customerForm: {
    name: string;
    phone: string;
    address: string;
  };
  onCustomerFieldChange: (field: "name" | "phone" | "address", value: string) => void;
  draftItems: DraftOrderItem[];
  onSelectMatchedCustomer: () => void;
  onAddMenuItem: (item: (typeof menuCatalog)[number]) => void;
  onChangeDraftQuantity: (itemId: string, direction: "up" | "down") => void;
  onResetDraft: () => void;
  onSubmitOrder: () => void;
  outsideKitchenOrders: KitchenOrderGroup[];
  insideKitchenOrders: KitchenOrderGroup[];
  orders: Order[];
  riders: Rider[];
  onAssignRider: (orderId: string, riderId: string) => void;
  movements: Movement[];
  expandedMovementId: string | null;
  onToggleMovement: (movementId: string) => void;
};

export function BossPanel({
  customerLookup,
  onCustomerLookupChange,
  matchedCustomerLabel,
  customerForm,
  onCustomerFieldChange,
  draftItems,
  onSelectMatchedCustomer,
  onAddMenuItem,
  onChangeDraftQuantity,
  onResetDraft,
  onSubmitOrder,
  outsideKitchenOrders,
  insideKitchenOrders,
  orders,
  riders,
  onAssignRider,
  movements,
  expandedMovementId,
  onToggleMovement
}: Props) {
  const draftTotal = draftItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <section className="ops-grid">
      <section className="panel panel-form">
        <div className="panel-heading">
          <div>
            <span className="panel-kicker">Ingreso de pedido</span>
            <h2>Panel del jefe</h2>
          </div>
          <span className="panel-badge">WhatsApp manual</span>
        </div>

        <div className="field-group">
          <label htmlFor="customer-lookup">Buscar cliente</label>
          <div className="inline-search">
            <input
              id="customer-lookup"
              type="text"
              value={customerLookup}
              placeholder="Nombre o telefono"
              onChange={(event) => onCustomerLookupChange(event.target.value)}
            />
            <button type="button" className="soft-button" onClick={onSelectMatchedCustomer}>
              Usar cliente
            </button>
          </div>
          <p className="field-hint">{matchedCustomerLabel}</p>
        </div>

        <div className="customer-grid">
          <label>
            Nombre
            <input type="text" value={customerForm.name} onChange={(event) => onCustomerFieldChange("name", event.target.value)} />
          </label>
          <label>
            Telefono
            <input type="text" value={customerForm.phone} onChange={(event) => onCustomerFieldChange("phone", event.target.value)} />
          </label>
          <label className="span-2">
            Direccion
            <input
              type="text"
              value={customerForm.address}
              onChange={(event) => onCustomerFieldChange("address", event.target.value)}
            />
          </label>
        </div>

        <div className="menu-builder">
          {(["afuera", "adentro"] as const).map((kitchen) => (
            <div key={kitchen} className="menu-column">
              <div className="menu-heading">
                <strong>{kitchenLabels[kitchen]}</strong>
                <span>
                  {kitchen === "afuera" ? "Hamburguesas, pizzas, fritos" : "Milanesas, platos, cocina interna"}
                </span>
              </div>
              <div className="menu-buttons">
                {menuCatalog
                  .filter((item) => item.kitchen === kitchen)
                  .map((item) => (
                    <button key={item.id} type="button" className="menu-item-button" onClick={() => onAddMenuItem(item)}>
                      <span>{item.name}</span>
                      <strong>{formatCurrency(item.price)}</strong>
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </div>

        <div className="draft-card">
          <div className="panel-heading compact">
            <div>
              <span className="panel-kicker">Comanda</span>
              <h3>Pedido en armado</h3>
            </div>
            <strong>{formatCurrency(draftTotal)}</strong>
          </div>

          {draftItems.length === 0 ? (
            <div className="empty-state">Aun no cargaste productos para la comanda.</div>
          ) : (
            <div className="draft-list">
              {draftItems.map((item) => (
                <article key={item.id} className="draft-item">
                  <div>
                    <strong>{item.name}</strong>
                    <span>
                      {kitchenLabels[item.kitchen]} - {formatCurrency(item.price)} c/u
                    </span>
                  </div>
                  <div className="quantity-actions">
                    <button type="button" onClick={() => onChangeDraftQuantity(item.id, "down")}>
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button type="button" onClick={() => onChangeDraftQuantity(item.id, "up")}>
                      +
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="draft-actions">
            <button type="button" className="ghost-button" onClick={onResetDraft}>
              Limpiar
            </button>
            <button type="button" className="primary-button" onClick={onSubmitOrder}>
              Enviar comanda
            </button>
          </div>
        </div>
      </section>

      <section className="panel panel-live">
        <div className="panel-heading">
          <div>
            <span className="panel-kicker">Tiempo real</span>
            <h2>Vista general del jefe</h2>
          </div>
        </div>

        <div className="live-columns">
          <KitchenOverviewCard title="Cocina afuera" orders={outsideKitchenOrders} />
          <KitchenOverviewCard title="Cocina adentro" orders={insideKitchenOrders} />
        </div>

        <section className="dispatch-card">
          <div className="panel-heading compact">
            <div>
              <span className="panel-kicker">Reparto</span>
              <h3>Asignacion de pedidos</h3>
            </div>
          </div>

          <div className="order-board">
            {orders.map((order) => {
              const allKitchenReady = order.items.every((item) => item.status === "lista");
              const assignedRider = riders.find((rider) => rider.id === order.riderId) ?? null;

              return (
                <article key={order.id} className="order-card">
                  <div className="order-card-top">
                    <div>
                      <strong>{order.id}</strong>
                      <span>
                        {order.customerName} - {order.address}
                      </span>
                    </div>
                    <strong>{formatCurrency(order.total)}</strong>
                  </div>

                  <div className="order-card-meta">
                    <span className={allKitchenReady ? "status-chip ready" : "status-chip pending"}>
                      {allKitchenReady ? "Comida lista" : "Cocina en curso"}
                    </span>
                    <span className="status-chip neutral">
                      {assignedRider ? `${assignedRider.name} - ${assignedRider.presence}` : "Sin repartidor"}
                    </span>
                  </div>

                  <div className="assign-actions">
                    {riders.map((rider) => (
                      <button
                        key={rider.id}
                        type="button"
                        className={order.riderId === rider.id ? "assign-button active" : "assign-button"}
                        onClick={() => onAssignRider(order.id, rider.id)}
                      >
                        {rider.name}
                      </button>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

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
                <button
                  key={movement.id}
                  type="button"
                  className="movement-row"
                  onClick={() => onToggleMovement(movement.id)}
                >
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
    </section>
  );
}

function KitchenOverviewCard({ title, orders }: { title: string; orders: KitchenOrderGroup[] }) {
  return (
    <section className="live-card">
      <div className="live-card-header">
        <strong>{title}</strong>
        <span>{orders.length} pedidos</span>
      </div>
      <div className="mini-order-list">
        {orders.map(({ order, items }) => (
          <article key={order.id} className="mini-order-card">
            <strong>{order.id}</strong>
            <span>{items.map((item) => `${item.name} x${item.quantity}`).join(", ")}</span>
          </article>
        ))}
      </div>
    </section>
  );
}
