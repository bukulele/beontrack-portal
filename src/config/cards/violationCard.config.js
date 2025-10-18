import { VIOLATION_CHECKLIST_CONFIG } from "@/config/checklists/violationChecklist.config";
import { VIOLATION_GENERAL_INFO_CONFIG } from "@/config/cards/violationGeneralInfo.config";
import { inspectionConfig } from "@/config/tabs/sub-entities/inspection.config";
import { ticketsConfig } from "@/config/tabs/sub-entities/tickets.config";
import { violationLogConfig } from "@/config/tabs/activity-log/violationLog.config";

/**
 * Violation Card Configuration for Universal Card System
 *
 * Phase 9: All 5 tabs complete
 * - General Info (phase 5A)
 * - Documents Checklist (phase 5A)
 * - Inspection (phase 9 - sub-entities)
 * - Tickets (phase 9 - sub-entities)
 * - Log (phase 9 - activity-log)
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

  // Tabs configuration - Phase 9: All 5 tabs
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
    {
      id: "inspection",
      label: "Inspection",
      type: "sub-entities",
      config: inspectionConfig,
    },
    {
      id: "tickets",
      label: "Tickets",
      type: "sub-entities",
      config: ticketsConfig,
    },
    {
      id: "log",
      label: "Log",
      type: "activity-log",
      config: violationLogConfig,
    },
  ],
};

export default VIOLATION_CARD_CONFIG;
