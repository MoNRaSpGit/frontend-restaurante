import { roleTabs } from "../data/restaurantData";
import type { ViewKey } from "../types";

type Props = {
  activeView: ViewKey;
  onChange: (view: ViewKey) => void;
};

export function RoleTabs({ activeView, onChange }: Props) {
  return (
    <nav className="ops-tabs" aria-label="Vistas operativas">
      {roleTabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          className={tab.key === activeView ? "ops-tab active" : "ops-tab"}
          onClick={() => onChange(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
