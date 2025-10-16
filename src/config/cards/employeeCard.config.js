import { EMPLOYEE_CHECKLIST_CONFIG } from "@/config/checklists/employeeChecklist.config";
import { EMPLOYEE_GENERAL_INFO_CONFIG } from "@/config/cards/employeeGeneralInfo.config";
import { employeeLogConfig } from "@/config/cards/employeeLog.config";
import { employeeTimeCardConfig } from "@/config/tabs/timecard/timeCard.config";

/**
 * Employee Card Configuration for Universal Card System
 *
 * Phase 8: 4 tabs (general-info + checklist + log + timecard)
 */

export const EMPLOYEE_CARD_CONFIG = {
  // Entity metadata
  entity: {
    type: "employee",
    contextProvider: "EmployeeProvider",
    dataKey: "userData",
    loadDataKey: "loadEmployeeData",
  },

  // Card dimensions
  width: "w-[1024px]",
  height: "h-[95vh]",

  // Default tab to open
  defaultTab: "general-info",

  // Tabs configuration - Phase 8: 4 tabs (general + checklist + log + timecard)
  tabs: [
    {
      id: "general-info",
      label: "Employee Card",
      type: "general-info",
      config: EMPLOYEE_GENERAL_INFO_CONFIG,
    },
    {
      id: "checklist",
      label: "Checklist",
      type: "checklist",
      config: EMPLOYEE_CHECKLIST_CONFIG,
    },
    {
      id: "notes",
      label: "Notes",
      type: "log",
      config: employeeLogConfig,
    },
    {
      id: "timecard",
      label: "Time Card",
      type: "timecard",
      config: employeeTimeCardConfig,
    },
  ],
};

export default EMPLOYEE_CARD_CONFIG;
