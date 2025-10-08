import { VIOLATION_CHECKLIST_CONFIG } from "@/config/checklists/violationChecklist.config";
import { VIOLATION_GENERAL_INFO_CONFIG } from "@/config/cards/violationGeneralInfo.config";

/**
 * Violation Card Configuration for Universal Card System
 *
 * Phase 5A: Only 2 tabs (general-info + checklist)
 * Deferred tabs:
 * - Inspection tab (needs custom-violation-details type - Phase 8)
 * - Tickets tab (needs custom-violation-details type - Phase 8)
 * - Log tab (needs log type - Phase 6)
 */

export const VIOLATION_CARD_CONFIG = {
  // Entity metadata
  entity: {
    type: "violation",
    contextProvider: "ViolationProvider",
    dataKey: "violationData",
    loadDataKey: "loadViolationData",
  },

  // Additional context providers needed for Violation
  additionalContexts: [
    { provider: "TrucksDriversProvider", dataKey: "hiredDriversList,activeTrucksList" },
  ],

  // Card dimensions
  width: "w-[1024px]",
  height: "h-[95vh]",

  // Default tab to open
  defaultTab: "general-info",

  // Tabs configuration - Phase 5A: Only 2 tabs
  tabs: [
    {
      id: "general-info",
      label: "Violation Card",
      type: "general-info",
      config: VIOLATION_GENERAL_INFO_CONFIG,
    },
    {
      id: "checklist",
      label: "Documents",
      type: "checklist",
      config: VIOLATION_CHECKLIST_CONFIG,
    },
    // TODO Phase 8: Add Inspection and Tickets tabs
    // TODO Phase 6: Add Log tab
  ],
};

export default VIOLATION_CARD_CONFIG;
