import type { Order, Rider } from "../types";
import { getRiderPresenceUi } from "../lib/restaurantUtils";

type Props = {
  rider?: Rider;
  orders: Order[];
  onAdvanceOrder: (orderId: string) => void;
};

export function RiderView({ rider, orders, onAdvanceOrder }: Props) {
  if (!rider) {
    return null;
  }

  const riderPresence = getRiderPresenceUi(rider.presence);

  return (
    <section className="ops-stack">
      <div className="panel panel-role">
        <div className="panel-heading">
          <div>
            <span className="panel-kicker">Delivery</span>
            <h2>{rider.name}</h2>
            <p className="panel-copy">
              Estado actual: <strong>{`${riderPresence.icon} ${riderPresence.label}`}</strong>
            </p>
          </div>
        </div>

        <div className="rider-order-list">
          {orders.length === 0 ? <div className="empty-state">No hay pedidos asignados a este delivery.</div> : null}
          {orders.map((order) => (
            <article key={order.id} className="rider-order-card">
              <div className="rider-order-top">
                <div>
                  <strong className="order-card-code">{order.id}</strong>
                  <span className="order-card-customer">Cliente: {order.customerName}</span>
                </div>
                <span className="status-chip neutral">{order.deliveryStatus}</span>
              </div>

              <p className="rider-order-address">Direccion: {order.address || "Sin direccion"}</p>

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

              <button type="button" className="primary-button full-width" onClick={() => onAdvanceOrder(order.id)}>
                {order.deliveryStatus === "asignado"
                  ? "Salir a delivery"
                  : order.deliveryStatus === "en-camino"
                    ? "Marcar entregado"
                    : "Pedido entregado"}
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
