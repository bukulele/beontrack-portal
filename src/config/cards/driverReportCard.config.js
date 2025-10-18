import { DRIVER_REPORT_GENERAL_INFO_CONFIG } from "./driverReportGeneralInfo.config";

/**
 * Driver Report Card Configuration for Universal Card System
 *
 * Read-only card for driver-submitted reports (accidents, tickets, injuries).
 * Single tab with photo gallery, related entity navigation, and custom actions.
 *
 * Phase 9: Complete implementation with:
 * - General Info tab (read-only mode)
 * - Photo gallery (for AC/TK reports)
 * - Related entities navigation
 * - PDF download and map viewing
 */

export const DRIVER_REPORT_CARD_CONFIG = {
  // Entity metadata
  entity: {
    type: "driverReport",
    contextProvider: "DriverReportProvider",
    dataKey: "driverReportData",
    loadDataKey: "loadData",
  },

  // Additional context providers for related entities
  additionalContexts: [
    {
      provider: "TrucksDriversProvider",
      dataKey: "hiredDriversList,activeTrucksList",
    },
    {
      provider: "IncidentsListProvider",
      dataKey: "incidentsList",
    },
    {
      provider: "ViolationsListProvider",
      dataKey: "violationsList",
    },
    {
      provider: "WCBListProvider",
      dataKey: "wcbClaimsList",
    },
  ],

  // Card dimensions
  width: "w-[1024px]",
  height: "h-[95vh]",

  // Default tab
  defaultTab: "general-info",

  // Tabs configuration - Single tab (read-only display)
  tabs: [
    {
      id: "general-info",
      label: "Driver Report",
      type: "general-info",
      config: DRIVER_REPORT_GENERAL_INFO_CONFIG,
    },
  ],
};

export default DRIVER_REPORT_CARD_CONFIG;
