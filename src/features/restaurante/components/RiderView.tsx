import type { Order, Rider } from "../types";

type Props = {
  rider?: Rider;
  orders: Order[];
  onAdvanceOrder: (orderId: string) => void;
};

export function RiderView({ rider, orders, onAdvanceOrder }: Props) {
  if (!rider) {
    return null;
  }

  return (
    <section className="ops-stack">
      <div className="panel panel-role">
        <div className="panel-heading">
          <div>
            <span className="panel-kicker">Reparto</span>
            <h2>{rider.name}</h2>
            <p className="panel-copy">
              Estado actual: <strong>{rider.presence === "calle" ? "en la calle" : "en el local"}</strong>
            </p>
          </div>
        </div>

        <div className="rider-order-list">
          {orders.length === 0 ? <div className="empty-state">No hay pedidos asignados a este repartidor.</div> : null}
          {orders.map((order) => (
            <article key={order.id} className="rider-order-card">
              <div className="rider-order-top">
                <div>
                  <strong>{order.id}</strong>
                  <span>{order.customerName}</span>
                </div>
                <span className="status-chip neutral">{order.deliveryStatus}</span>
              </div>

              <p className="rider-order-address">{order.address}</p>
              <div className="rider-order-products">{order.items.map((item) => `${item.name} x${item.quantity}`).join(", ")}</div>

              <button type="button" className="primary-button full-width" onClick={() => onAdvanceOrder(order.id)}>
                {order.deliveryStatus === "asignado"
                  ? "Salir a reparto"
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
