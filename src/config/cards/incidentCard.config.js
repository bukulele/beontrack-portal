import { INCIDENT_CHECKLIST_CONFIG } from "@/config/checklists/incidentChecklist.config";
import { INCIDENT_GENERAL_INFO_CONFIG } from "@/config/cards/incidentGeneralInfo.config";
import { mpiClaimsConfig } from "@/config/tabs/sub-entities/mpiClaims.config";
import { loblawClaimsConfig } from "@/config/tabs/sub-entities/loblawClaims.config";
import { tpInfoConfig } from "@/config/tabs/sub-entities/tpInfo.config";
import { incidentLogConfig } from "@/config/tabs/activity-log/incidentLog.config";

/**
 * Incident Card Configuration for Universal Card System
 *
 * Phase 9: All 6 tabs complete
 * - General Info (phase 5A)
 * - Documents Checklist (phase 5A)
 * - MPI Claims (phase 9 - sub-entities)
 * - Loblaw Claims (phase 9 - sub-entities)
 * - T/P Info (phase 9 - sub-entities)
 * - Log (phase 9 - activity-log)
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

  // Tabs configuration - Phase 9: All 6 tabs
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
    {
      id: "mpi-claims",
      label: "MPI Claims",
      type: "sub-entities",
      config: mpiClaimsConfig,
    },
    {
      id: "loblaw-claims",
      label: "Loblaw Claims",
      type: "sub-entities",
      config: loblawClaimsConfig,
    },
    {
      id: "tp-info",
      label: "T/P info",
      type: "sub-entities",
      config: tpInfoConfig,
    },
    {
      id: "log",
      label: "Log",
      type: "activity-log",
      config: incidentLogConfig,
    },
  ],
};

export default INCIDENT_CARD_CONFIG;
