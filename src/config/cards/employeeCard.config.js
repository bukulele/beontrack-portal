import { EMPLOYEE_PRE_HIRING_CHECKLIST_CONFIG } from "@/config/checklists/employeePreHiringChecklist.config";
import { EMPLOYEE_ONBOARDING_CHECKLIST_CONFIG } from "@/config/checklists/employeeOnboardingChecklist.config";
import { EMPLOYEE_GENERAL_INFO_CONFIG } from "@/config/cards/employeeGeneralInfo.config";
import { employeeLogConfig } from "@/config/cards/employeeLog.config";
import { employeeTimeCardConfig } from "@/config/tabs/timecard/timeCard.config";
import { EMPLOYEE_WCB_CLAIMS_TAB_CONFIG } from "@/config/tabs/wcbClaims/employeeWcbClaimsTab.config";
import { canAccessTab, getDocumentPermissions } from "@/config/entities/employees.config";

/**
 * Employee Card Configuration for Universal Card System
 *
 * Updated for Prisma schema - PRISMA_MIGRATION_PLAN.md Phase 4
 * 6 tabs: general-info + pre-hiring + onboarding + wcb-claims + notes + timecard
 */

export const EMPLOYEE_CARD_CONFIG = {
  // Helper functions for permissions and access control
  canAccessTab,
  getDocumentPermissions,

  // Entity metadata
  entity: {
    type: "employees",
    contextProvider: "EmployeeProvider",
    dataKey: "userData",
    loadDataKey: "loadEmployeeData",
  },

  // Card dimensions
  width: "w-[1024px]",
  height: "h-[95vh]",

  // Default tab to open
  defaultTab: "general-info",

  // Tabs configuration - 6 tabs (general + pre-hiring + onboarding + wcb-claims + notes + timecard)
  tabs: [
    {
      id: "general-info",
      label: "Employee Card",
      type: "general-info",
      config: EMPLOYEE_GENERAL_INFO_CONFIG,
    },
    {
      id: "pre-hiring",
      label: "Pre-Hiring",
      type: "checklist",
      config: EMPLOYEE_PRE_HIRING_CHECKLIST_CONFIG,
    },
    {
      id: "onboarding",
      label: "Onboarding",
      type: "checklist",
      config: EMPLOYEE_ONBOARDING_CHECKLIST_CONFIG,
    },
    {
      id: "wcb-claims",
      label: "WCB Claims",
      type: "list",
      config: EMPLOYEE_WCB_CLAIMS_TAB_CONFIG,
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
