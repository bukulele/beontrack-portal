import { DRIVER_RECRUITING_CHECKLIST_CONFIG } from "@/config/checklists/driverRecruitingChecklist.config";
import { DRIVER_SAFETY_CHECKLIST_CONFIG } from "@/config/checklists/driverSafetyChecklist.config";
import { DRIVER_GENERAL_INFO_CONFIG } from "@/config/cards/driverGeneralInfo.config";
import { driverLogConfig } from "@/config/cards/driverLog.config";
import { driverTrucksListConfig } from "@/config/cards/driverTrucksList.config";
import { driverOODriversListConfig } from "@/config/cards/driverOODriversList.config";
import { driverIncidentsListConfig } from "@/config/cards/driverIncidentsList.config";
import { driverViolationsListConfig } from "@/config/cards/driverViolationsList.config";

/**
 * Driver Card Configuration for Universal Card System
 *
 * Phase 7: 8 tabs (general-info + 2 checklists + log + 4 lists)
 * DriverCard is the MOST COMPLEX card with 10 tabs total.
 *
 * Deferred tabs:
 * - Time Card tab (needs timecard type - Phase 9)
 * - Seals tab (needs custom-seals type - Phase 8)
 */

export const DRIVER_CARD_CONFIG = {
  // Entity metadata
  entity: {
    type: "driver",
    contextProvider: "DriverProvider",
    dataKey: "userData",
    loadDataKey: "loadData",
  },

  // Additional context providers needed for Driver
  additionalContexts: [
    { provider: "IncidentsListProvider", dataKey: "incidentsList" },
    { provider: "ViolationsListProvider", dataKey: "violationsList" },
    { provider: "TrucksDriversProvider", dataKey: "hiredDriversList,activeTrucksList" },
  ],

  // Card dimensions
  width: "w-[1024px]",
  height: "h-[95vh]",

  // Default tab to open
  defaultTab: "general-info",

  // Tabs configuration - Phase 7: 8 tabs (general + 2 checklists + log + 4 lists)
  tabs: [
    {
      id: "general-info",
      label: "Driver Card",
      type: "general-info",
      config: DRIVER_GENERAL_INFO_CONFIG,
    },
    {
      id: "recruiting-checklist",
      label: "Pre-hiring Checklist",
      type: "checklist",
      config: DRIVER_RECRUITING_CHECKLIST_CONFIG,
    },
    {
      id: "safety-checklist",
      label: "Post-hiring Checklist",
      type: "checklist",
      config: DRIVER_SAFETY_CHECKLIST_CONFIG,
    },
    {
      id: "notes",
      label: "Notes",
      type: "log",
      config: driverLogConfig,
    },
    {
      id: "trucks",
      label: "Trucks",
      type: "list",
      config: driverTrucksListConfig,
    },
    {
      id: "oo-drivers",
      label: "O/O Drivers",
      type: "list",
      config: driverOODriversListConfig,
    },
    {
      id: "incidents",
      label: "Incidents",
      type: "list",
      config: driverIncidentsListConfig,
    },
    {
      id: "violations",
      label: "Violations",
      type: "list",
      config: driverViolationsListConfig,
    },
    // TODO Phase 8: Add Seals tab (custom-seals type)
    // TODO Phase 9: Add Time Card tab (timecard type)
  ],
};

export default DRIVER_CARD_CONFIG;
