import { EMPLOYEE_PRE_HIRING_CHECKLIST_CONFIG } from "@/config/checklists/employeePreHiringChecklist.config";
import { EMPLOYEE_ONBOARDING_CHECKLIST_CONFIG } from "@/config/checklists/employeeOnboardingChecklist.config";
import { EMPLOYEE_GENERAL_INFO_CONFIG } from "@/config/cards/employeeGeneralInfo.config";
import { employeeLogConfig } from "@/config/cards/employeeLog.config";
import { employeeTimeCardConfig } from "@/config/tabs/timecard/timeCard.config";

/**
 * Employee Card Configuration for Universal Card System
 *
 * Updated for Prisma schema - PRISMA_MIGRATION_PLAN.md Phase 4
 * 5 tabs: general-info + pre-hiring + onboarding + notes + timecard
 */

export const EMPLOYEE_CARD_CONFIG = {
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

  // Tabs configuration - 5 tabs (general + pre-hiring + onboarding + notes + timecard)
  tabs: [
    {
      id: "general-info",
      label: "Employee Card",
      type: "general-info",
      config: EMPLOYEE_GENERAL_INFO_CONFIG,
      visibleForStatuses: "all",
      requiredRoles: ["all"],
    },
    {
      id: "pre-hiring",
      label: "Pre-Hiring",
      type: "checklist",
      config: EMPLOYEE_PRE_HIRING_CHECKLIST_CONFIG,
      visibleForStatuses: ["new", "under_review", "application_on_hold", "rejected", "offer_accepted"],
      requiredRoles: ["admin", "humanResources"],
    },
    {
      id: "onboarding",
      label: "Onboarding",
      type: "checklist",
      config: EMPLOYEE_ONBOARDING_CHECKLIST_CONFIG,
      visibleForStatuses: ["offer_accepted", "trainee", "active"],
      requiredRoles: ["admin", "humanResources"],
    },
    {
      id: "notes",
      label: "Notes",
      type: "log",
      config: employeeLogConfig,
      visibleForStatuses: "all",
      requiredRoles: ["all"],
    },
    {
      id: "timecard",
      label: "Time Card",
      type: "timecard",
      config: employeeTimeCardConfig,
      visibleForStatuses: ["trainee", "active", "vacation", "on_leave", "wcb", "suspended"],
      requiredRoles: ["admin", "humanResources", "finance", "productionManager"],
    },
  ],
};

export default EMPLOYEE_CARD_CONFIG;
