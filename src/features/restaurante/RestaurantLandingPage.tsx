import "./styles/restaurant-ops.css";
import { BossPanel } from "./components/BossPanel";
import { KitchenView } from "./components/KitchenView";
import { RestaurantHeader } from "./components/RestaurantHeader";
import { RiderView } from "./components/RiderView";
import { RoleTabs } from "./components/RoleTabs";
import { useRestaurantOperations } from "./hooks/useRestaurantOperations";

export function RestaurantLandingPage() {
  const operations = useRestaurantOperations();

  const matchedCustomerLabel = operations.matchedCustomer
    ? `Encontrado: ${operations.matchedCustomer.name} - ${operations.matchedCustomer.address}`
    : "Si no existe, lo agendas en los campos de abajo.";

  const customerForm = {
    name: operations.selectedCustomer?.name ?? operations.newCustomerName,
    phone: operations.selectedCustomer?.phone ?? operations.newCustomerPhone,
    address: operations.selectedCustomer?.address ?? operations.newCustomerAddress
  };

  return (
    <main className="restaurant-ops-page">
      <section className="ops-shell">
        <RestaurantHeader summary={operations.summary} />
        <RoleTabs activeView={operations.activeView} onChange={operations.setActiveView} />

        {operations.activeView === "jefe" ? (
          <BossPanel
            customerLookup={operations.customerLookup}
            onCustomerLookupChange={operations.setCustomerLookup}
            matchedCustomerLabel={matchedCustomerLabel}
            customerForm={customerForm}
            onCustomerFieldChange={operations.setCustomerField}
            draftItems={operations.draftItems}
            onSelectMatchedCustomer={operations.selectMatchedCustomer}
            onAddMenuItem={operations.addMenuItemToDraft}
            onChangeDraftQuantity={operations.changeDraftQuantity}
            onResetDraft={operations.resetDraft}
            onSubmitOrder={operations.submitOrder}
            outsideKitchenOrders={operations.kitchenViews.outsideKitchenOrders}
            insideKitchenOrders={operations.kitchenViews.insideKitchenOrders}
            orders={operations.orders}
            riders={operations.riders}
            onAssignRider={operations.assignRider}
            movements={operations.movements}
            expandedMovementId={operations.expandedMovementId}
            onToggleMovement={(movementId) =>
              operations.setExpandedMovementId(operations.expandedMovementId === movementId ? null : movementId)
            }
          />
        ) : null}

        {operations.activeView === "cocina-afuera" ? (
          <KitchenView
            title="Cocina afuera"
            subtitle="Hamburguesas, pizzas y fritos"
            orders={operations.kitchenViews.outsideKitchenOrders}
            onAdvanceItem={operations.advanceKitchenItem}
          />
        ) : null}

        {operations.activeView === "cocina-adentro" ? (
          <KitchenView
            title="Cocina adentro"
            subtitle="Platos internos y cocina clasica"
            orders={operations.kitchenViews.insideKitchenOrders}
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
