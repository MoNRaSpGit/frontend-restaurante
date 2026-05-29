import "./styles/restaurant-ops.css";
import { BossPanel } from "./components/BossPanel";
import { KitchenView } from "./components/KitchenView";
import { RiderView } from "./components/RiderView";
import { useRestaurantOperations } from "./hooks/useRestaurantOperations";

export function RestaurantLandingPage() {
  const operations = useRestaurantOperations();

  const matchedCustomerLabel = operations.matchedCustomer
    ? `Encontrado: ${operations.matchedCustomer.name} - ${operations.matchedCustomer.address}`
    : "Busca un cliente o crea uno nuevo.";

  return (
    <main className="restaurant-ops-page">
      <section className="ops-shell">
        {operations.activeView === "jefe" ? (
          <BossPanel
            customerLookup={operations.customerLookup}
            onCustomerLookupChange={operations.setCustomerLookup}
            customers={operations.customers}
            matchedCustomerLabel={matchedCustomerLabel}
            draftItems={operations.draftItems}
            onSelectMatchedCustomer={operations.selectMatchedCustomer}
            onSelectCustomerById={operations.selectCustomerById}
            onCreateQuickCustomer={operations.createQuickCustomer}
            onAddMenuItem={operations.addMenuItemToDraft}
            onChangeDraftQuantity={operations.changeDraftQuantity}
            onResetDraft={operations.resetDraft}
            onSubmitOrder={operations.submitOrder}
            cartOrders={operations.kitchenViews.cartOrders}
            kitchenOrders={operations.kitchenViews.kitchenOrders}
            orders={operations.orders}
            riders={operations.riders}
            onAssignRider={operations.assignRider}
            onAdvanceKitchenItem={operations.advanceKitchenItem}
            onAdvanceRiderOrder={operations.advanceRiderOrder}
            movements={operations.movements}
            expandedMovementId={operations.expandedMovementId}
            onToggleMovement={(movementId) =>
              operations.setExpandedMovementId(operations.expandedMovementId === movementId ? null : movementId)
            }
          />
        ) : null}

        {operations.activeView === "cocina-afuera" ? (
          <KitchenView
            title="Carrito"
            subtitle="Preparaciones rapidas"
            orders={operations.kitchenViews.cartOrders}
            onAdvanceItem={operations.advanceKitchenItem}
          />
        ) : null}

        {operations.activeView === "cocina-adentro" ? (
          <KitchenView
            title="Cocina"
            subtitle="Preparaciones de cocina"
            orders={operations.kitchenViews.kitchenOrders}
            onAdvanceItem={operations.advanceKitchenItem}
          />
        ) : null}

        {operations.activeView === "repartidor-a" ? (
          <RiderView rider={operations.riders[0]} orders={operations.riderViews.riderAOrders} onAdvanceOrder={operations.advanceRiderOrder} />
        ) : null}

        {operations.activeView === "repartidor-b" ? (
          <RiderView rider={operations.riders[1]} orders={operations.riderViews.riderBOrders} onAdvanceOrder={operations.advanceRiderOrder} />
        ) : null}
      </section>
    </main>
  );
}
