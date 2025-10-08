import { WCB_GENERAL_INFO_CONFIG } from "@/config/cards/wcbGeneralInfo.config";

/**
 * WCB Card Configuration for Universal Card System
 *
 * WCB (Workers Compensation Board) claims have the simplest card structure:
 * - Only ONE tab (general info)
 * - No checklist tab
 * - No log tab
 * - No other tabs
 */

export const WCB_CARD_CONFIG = {
  // Entity metadata
  entity: {
    type: "wcb",
    contextProvider: "WCBProvider",
    dataKey: "wcbData",
    loadDataKey: "loadWCBData",
  },

  // Additional context providers needed for WCB
  additionalContexts: [
    { provider: "HiredEmployeesProvider", dataKey: "hiredEmployeesList" },
    { provider: "TrucksDriversProvider", dataKey: "hiredDriversList" },
  ],

  // Card dimensions
  width: "w-[1024px]",
  height: "h-[95vh]",

  // Default tab to open
  defaultTab: "general-info",

  // Tabs configuration - ONLY ONE TAB
  tabs: [
    {
      id: "general-info",
      label: "WCB Card",
      type: "general-info",
      config: WCB_GENERAL_INFO_CONFIG,
    },
  ],
};

export default WCB_CARD_CONFIG;
