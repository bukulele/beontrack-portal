import { EQUIPMENT_CHECKLIST_CONFIG } from "@/config/checklists/equipmentChecklist.config";
import { EQUIPMENT_GENERAL_INFO_CONFIG } from "@/config/cards/equipmentGeneralInfo.config";

/**
 * Equipment Card Configuration for Universal Card System
 *
 * Almost identical to TruckCard - 2 tabs (general info + checklist).
 * Equipment includes trailers, converters, and other non-truck vehicles.
 */

export const EQUIPMENT_CARD_CONFIG = {
  // Entity metadata
  entity: {
    type: "equipment",
    contextProvider: "EquipmentProvider",
    dataKey: "equipmentData",
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
      label: "Equipment Info",
      type: "general-info",
      config: EQUIPMENT_GENERAL_INFO_CONFIG,
    },
    {
      id: "checklist",
      label: "Checklist",
      type: "checklist",
      config: EQUIPMENT_CHECKLIST_CONFIG,
    },
  ],
};

export default EQUIPMENT_CARD_CONFIG;
