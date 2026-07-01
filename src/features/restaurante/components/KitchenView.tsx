import { formatCurrency } from "../lib/restaurantUtils";
import type { KitchenOrderGroup, OrderKitchenItem } from "../types";

type Props = {
  title: string;
  subtitle: string;
  orders: KitchenOrderGroup[];
  onAdvanceItem: (orderId: string, itemId: string) => void;
  onDismissItem: (orderId: string, itemId: string) => void;
};

export function KitchenView({ title, subtitle, orders, onAdvanceItem, onDismissItem }: Props) {
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
    <section className="ops-stack">
      <div className="panel panel-role">
        <div className="panel-heading">
          <div>
            <span className="panel-kicker">Comandas</span>
            <h2>{title}</h2>
            <p className="panel-copy">{subtitle}</p>
          </div>
        </div>

        <div className="kitchen-board-grid">
          <KitchenOrderBoard
            title="Comandas entrando"
            emptyLabel="No hay comandas entrando a esta cocina."
            orders={recentOrders}
            onAdvanceItem={onAdvanceItem}
            onDismissItem={onDismissItem}
            readyMode={false}
          />
          <KitchenOrderBoard
            title="Pedidos prontos"
            emptyLabel="No hay pedidos prontos en esta cocina."
            orders={readyOrders}
            onAdvanceItem={onAdvanceItem}
            onDismissItem={onDismissItem}
            readyMode
          />
        </div>
      </div>
    </section>
  );
}

function KitchenOrderBoard({
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
                <span>
                  {order.customerName} - {order.createdAtLabel}
                </span>
              </div>
              <span className="status-chip neutral">{order.address}</span>
            </div>

            <KitchenItems
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

function KitchenItems({
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
              <span className="kitchen-status-label">{item.status}</span>
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
