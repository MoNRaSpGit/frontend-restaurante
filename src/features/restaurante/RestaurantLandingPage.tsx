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
            kitchenOrders={operations.kitchenViews.kitchenOrders}
            orders={operations.orders}
            riders={operations.riders}
            onAssignRider={operations.assignRider}
            onAdvanceKitchenItem={operations.advanceKitchenItem}
            onDismissKitchenItem={operations.dismissKitchenItem}
            onAdvanceRiderOrder={operations.advanceRiderOrder}
            movements={operations.movements}
            expandedMovementId={operations.expandedMovementId}
            onToggleMovement={(movementId) =>
              operations.setExpandedMovementId(operations.expandedMovementId === movementId ? null : movementId)
            }
          />
        ) : null}

        {operations.activeView === "cocina" ? (
          <KitchenView
            title="Cocina"
            subtitle="Todas las preparaciones del local"
            orders={operations.kitchenViews.kitchenOrders}
            onAdvanceItem={operations.advanceKitchenItem}
            onDismissItem={operations.dismissKitchenItem}
          />
        ) : null}

        {operations.activeView === "delivery" ? (
          <RiderView rider={operations.riders[0]} orders={operations.riderViews.deliveryOrders} onAdvanceOrder={operations.advanceRiderOrder} />
        ) : null}
      </section>
    </main>
  );
}
