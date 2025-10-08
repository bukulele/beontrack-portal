import { INCIDENT_CHECKLIST_CONFIG } from "@/config/checklists/incidentChecklist.config";
import { INCIDENT_GENERAL_INFO_CONFIG } from "@/config/cards/incidentGeneralInfo.config";

/**
 * Incident Card Configuration for Universal Card System
 *
 * Phase 5A: Only 2 tabs (general-info + checklist)
 * Deferred tabs:
 * - MPI Claims tab (needs custom-claims type - Phase 8)
 * - Loblaw Claims tab (needs custom-claims type - Phase 8)
 * - T/P info tab (needs custom-claims type - Phase 8)
 * - Log tab (needs log type - Phase 6)
 */

export const INCIDENT_CARD_CONFIG = {
  // Entity metadata
  entity: {
    type: "incident",
    contextProvider: "IncidentProvider",
    dataKey: "incidentData",
    loadDataKey: "loadIncidentData",
  },

  // Additional context providers needed for Incident
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
      label: "Incident Card",
      type: "general-info",
      config: INCIDENT_GENERAL_INFO_CONFIG,
    },
    {
      id: "checklist",
      label: "Documents",
      type: "checklist",
      config: INCIDENT_CHECKLIST_CONFIG,
    },
    // TODO Phase 8: Add MPI Claims, Loblaw Claims, T/P info tabs
    // TODO Phase 6: Add Log tab
  ],
};

export default INCIDENT_CARD_CONFIG;
