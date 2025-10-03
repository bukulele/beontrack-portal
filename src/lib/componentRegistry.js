/**
 * Component Registry
 *
 * Maps string names to React components for dynamic rendering.
 * This allows configuration files to reference components by name.
 */

import React from "react";

// Context Providers
import { DriverProvider } from "@/app/context/DriverContext";
import { TruckProvider } from "@/app/context/TruckContext";
import { EquipmentProvider } from "@/app/context/EquipmentContext";
import { EmployeeProvider } from "@/app/context/EmployeeContext";
import { IncidentProvider } from "@/app/context/IncidentContext";
import { ViolationProvider } from "@/app/context/ViolationContext";
import { WCBProvider } from "@/app/context/WCBContext";
import { DriverReportProvider } from "@/app/context/DriverReportContext";
import { IncidentsListProvider } from "@/app/context/IncidentsListContext";
import { ViolationsListProvider } from "@/app/context/ViolationsListContext";
import { TrucksDriversProvider } from "@/app/context/TrucksDriversContext";
import { HiredEmployeesProvider } from "@/app/context/HiredEmployeesContext";
import { WCBListProvider } from "@/app/context/WCBListContext";

// Tab Components (will be added as they are built)
// import { GeneralInfoTab } from "@/app/components/tabs/general-info/GeneralInfoTab";
// import { ChecklistTab } from "@/app/components/tabs/checklist/ChecklistTab";
// import { LogTab } from "@/app/components/tabs/log/LogTab";
// import { ListTab } from "@/app/components/tabs/list/ListTab";
// import { TimeCardTab } from "@/app/components/tabs/timecard/TimeCardTab";
// import { ClaimsTab } from "@/app/components/tabs/custom/ClaimsTab";
// import { ViolationDetailsTab } from "@/app/components/tabs/custom/ViolationDetailsTab";
// import { SealsTab } from "@/app/components/tabs/custom/SealsTab";

/**
 * Registry of Context Providers
 *
 * Maps provider names (strings) to actual React components
 */
export const CONTEXT_PROVIDERS = {
  DriverProvider,
  TruckProvider,
  EquipmentProvider,
  EmployeeProvider,
  IncidentProvider,
  ViolationProvider,
  WCBProvider,
  DriverReportProvider,
  IncidentsListProvider,
  ViolationsListProvider,
  TrucksDriversProvider,
  HiredEmployeesProvider,
  WCBListProvider,
};

/**
 * Registry of Tab Components
 *
 * Maps tab type names to React components
 */
export const TAB_COMPONENTS = {
  // Will be populated as components are built
  // "general-info": GeneralInfoTab,
  // "checklist": ChecklistTab,
  // "log": LogTab,
  // "list": ListTab,
  // "timecard": TimeCardTab,
  // "custom-claims": ClaimsTab,
  // "custom-violation-details": ViolationDetailsTab,
  // "custom-seals": SealsTab,
};

/**
 * Gets a context provider component by name
 *
 * @param {string} providerName - Name of the provider
 * @returns {React.Component|null} - Provider component or null if not found
 */
export function getContextProvider(providerName) {
  const Provider = CONTEXT_PROVIDERS[providerName];

  if (!Provider) {
    console.warn(`Context provider "${providerName}" not found in registry`);
    return null;
  }

  return Provider;
}

/**
 * Gets a tab component by type
 *
 * @param {string} tabType - Type of tab
 * @returns {React.Component|null} - Tab component or null if not found
 */
export function getTabComponent(tabType) {
  const Component = TAB_COMPONENTS[tabType];

  if (!Component) {
    console.warn(`Tab component for type "${tabType}" not found in registry`);
    return null;
  }

  return Component;
}

/**
 * Registers a new context provider
 *
 * @param {string} name - Provider name
 * @param {React.Component} Provider - Provider component
 */
export function registerContextProvider(name, Provider) {
  if (CONTEXT_PROVIDERS[name]) {
    console.warn(`Context provider "${name}" is already registered, overwriting`);
  }

  CONTEXT_PROVIDERS[name] = Provider;
  console.log(`✓ Registered context provider: ${name}`);
}

/**
 * Registers a new tab component
 *
 * @param {string} tabType - Tab type
 * @param {React.Component} Component - Tab component
 */
export function registerTabComponent(tabType, Component) {
  if (TAB_COMPONENTS[tabType]) {
    console.warn(`Tab component "${tabType}" is already registered, overwriting`);
  }

  TAB_COMPONENTS[tabType] = Component;
  console.log(`✓ Registered tab component: ${tabType}`);
}

/**
 * Lists all registered context providers
 *
 * @returns {Array<string>} - Array of provider names
 */
export function listContextProviders() {
  return Object.keys(CONTEXT_PROVIDERS);
}

/**
 * Lists all registered tab components
 *
 * @returns {Array<string>} - Array of tab types
 */
export function listTabComponents() {
  return Object.keys(TAB_COMPONENTS);
}
