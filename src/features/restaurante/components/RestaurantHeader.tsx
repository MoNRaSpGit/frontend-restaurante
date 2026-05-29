type Props = {
  summary: {
    pendingOrdersCount: number;
    activeKitchenItems: number;
    ridersOnStreet: number;
    todayIncome: number;
  };
};

export function RestaurantHeader({ summary }: Props) {
  void summary;

  return (
    <header className="ops-header">
      <div>
        <h1>Sistema de Pedidos</h1>
      </div>
    </header>
  );
}
