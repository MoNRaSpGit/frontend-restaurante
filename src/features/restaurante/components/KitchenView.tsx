import { formatCurrency } from "../lib/restaurantUtils";
import type { KitchenOrderGroup } from "../types";

type Props = {
  title: string;
  subtitle: string;
  orders: KitchenOrderGroup[];
  onAdvanceItem: (orderId: string, itemId: string) => void;
};

export function KitchenView({ title, subtitle, orders, onAdvanceItem }: Props) {
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

        <div className="kitchen-ticket-list">
          {orders.length === 0 ? <div className="empty-state">No hay comandas entrando a esta cocina.</div> : null}
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

              <div className="kitchen-item-list">
                {items.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`kitchen-item ${item.status}`}
                    onClick={() => onAdvanceItem(order.id, item.id)}
                  >
                    <div>
                      <strong>
                        {item.name} x{item.quantity}
                      </strong>
                      <span>{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                    <span className="kitchen-status-label">{item.status}</span>
                  </button>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
