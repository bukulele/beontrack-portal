import { TRUCK_CHECKLIST_CONFIG } from "@/config/checklists/truckChecklist.config";
import { TRUCK_GENERAL_INFO_CONFIG } from "@/config/cards/truckGeneralInfo.config";

/**
 * Truck Card Configuration for Universal Card System
 *
 * This configuration defines the structure and behavior of the truck info card.
 * It replaces the old TruckCard component with a configuration-driven approach.
 */

export const TRUCK_CARD_CONFIG = {
  // Entity metadata
  entity: {
    type: "truck",
    contextProvider: "TruckProvider",
    dataKey: "truckData",
    loadDataKey: "loadData",
  },

  // Card dimensions
  width: "w-[1024px]",
  height: "h-[95vh]",

  // Default tab to open
  defaultTab: "general-info",

  // Tabs configuration
  tabs: [
    {
      id: "general-info",
      label: "Truck Info",
      type: "general-info", // Full-featured general info tab
      config: TRUCK_GENERAL_INFO_CONFIG,
    },
    {
      id: "checklist",
      label: "Checklist",
      type: "checklist",
      config: TRUCK_CHECKLIST_CONFIG,
    },
  ],
};

export default TRUCK_CARD_CONFIG;
