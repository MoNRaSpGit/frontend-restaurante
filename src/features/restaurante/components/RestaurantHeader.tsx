import { formatCurrency } from "../lib/restaurantUtils";

type Props = {
  summary: {
    pendingOrdersCount: number;
    activeKitchenItems: number;
    ridersOnStreet: number;
    todayIncome: number;
  };
};

export function RestaurantHeader({ summary }: Props) {
  return (
    <header className="ops-header">
      <div>
        <span className="ops-kicker">Restaurante</span>
        <h1>Operacion simple para pedidos, cocinas, repartidores y caja.</h1>
        <p>
          La idea es ordenar el dia a dia real: entra pedido por WhatsApp, el jefe lo arma, lo deriva a cocina afuera o
          adentro, sigue el estado y luego lo asigna al repartidor.
        </p>
      </div>

      <div className="ops-summary-grid">
        <article className="summary-card">
          <span>Pedidos activos</span>
          <strong>{summary.pendingOrdersCount}</strong>
        </article>
        <article className="summary-card">
          <span>Items en cocina</span>
          <strong>{summary.activeKitchenItems}</strong>
        </article>
        <article className="summary-card">
          <span>Reparto en calle</span>
          <strong>{summary.ridersOnStreet}</strong>
        </article>
        <article className="summary-card">
          <span>Caja del corte</span>
          <strong className={summary.todayIncome >= 0 ? "money-positive" : "money-negative"}>
            {formatCurrency(summary.todayIncome)}
          </strong>
        </article>
      </div>
    </header>
  );
}
