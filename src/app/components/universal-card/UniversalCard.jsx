"use client";

import React, { useState, useContext } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChecklistTab from "@/app/components/tabs/checklist/ChecklistTab";
import GeneralInfoTab from "@/app/components/tabs/general-info/GeneralInfoTab";
import LogTab from "@/app/components/tabs/log/LogTab";
import ListTab from "@/app/components/tabs/list/ListTab";
import { TruckContext } from "@/app/context/TruckContext";
import { DriverContext } from "@/app/context/DriverContext";
import { EquipmentContext } from "@/app/context/EquipmentContext";
import { EmployeeContext } from "@/app/context/EmployeeContext";
import { IncidentContext } from "@/app/context/IncidentContext";
import { ViolationContext } from "@/app/context/ViolationContext";
import { WCBContext } from "@/app/context/WCBContext";
import { IncidentsListContext } from "@/app/context/IncidentsListContext";
import { ViolationsListContext } from "@/app/context/ViolationsListContext";
import { TrucksDriversContext } from "@/app/context/TrucksDriversContext";

/**
 * Context mapping for dynamic context access
 * Maps provider names (from config) to Context objects
 */
const CONTEXT_MAP = {
  TruckProvider: TruckContext,
  DriverProvider: DriverContext,
  EquipmentProvider: EquipmentContext,
  EmployeeProvider: EmployeeContext,
  IncidentProvider: IncidentContext,
  ViolationProvider: ViolationContext,
  WCBProvider: WCBContext,
  // List contexts for referenced data
  IncidentsListProvider: IncidentsListContext,
  ViolationsListProvider: ViolationsListContext,
  TrucksDriversProvider: TrucksDriversContext,
};

/**
 * UniversalCard - Configuration-driven card component
 *
 * Replaces all entity-specific card components (DriverCard, TruckCard, etc.)
 * with a single universal component driven by configuration.
 *
 * @param {Object} config - Card configuration object
 * @param {Object} config.entity - Entity metadata (type, contextProvider, dataKey, loadDataKey)
 * @param {Array} config.tabs - Array of tab configurations
 * @param {string} config.defaultTab - Default tab ID to open
 * @param {string} config.initialTab - Initial tab ID (overrides defaultTab if provided)
 * @param {string} config.width - Width class (default: 'w-[1024px]')
 */
function UniversalCard({ config }) {
  // Determine which tab to open initially
  const initialTabId = config.initialTab || config.defaultTab || config.tabs[0]?.id;
  const [activeTab, setActiveTab] = useState(initialTabId);

  // Get width and height from config
  const width = config.width || "w-[1024px]";
  const height = config.height || "h-[95vh]";

  // Access context data dynamically based on config.entity.contextProvider
  const ContextToUse = CONTEXT_MAP[config.entity.contextProvider];
  const context = useContext(ContextToUse);
  const entityData = context?.[config.entity.dataKey];
  const loadData = context?.[config.entity.loadDataKey];

  // Access additional contexts if specified (for list tabs, etc.)
  const additionalContexts = {};
  if (config.additionalContexts) {
    config.additionalContexts.forEach((contextConfig) => {
      const AdditionalContext = CONTEXT_MAP[contextConfig.provider];
      const additionalContextData = useContext(AdditionalContext);

      // Support multiple data keys (comma-separated)
      const dataKeys = contextConfig.dataKey.split(',');
      dataKeys.forEach((key) => {
        additionalContexts[key.trim()] = additionalContextData?.[key.trim()];
      });
    });
  }

  // Render tab content based on type
  const renderTabContent = (tab) => {
    if (!entityData) {
      return (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          Loading...
        </div>
      );
    }

    switch (tab.type) {
      case "checklist":
        return (
          <ChecklistTab
            config={tab.config}
            entityData={entityData}
            loadData={loadData}
            entityType={config.entity.type}
            entityId={entityData.id}
            apiRoute="/api/update-file"
          />
        );

      case "general-info":
        return (
          <GeneralInfoTab
            config={tab.config}
            entityData={entityData}
            loadData={loadData}
            entityType={config.entity.type}
            entityId={entityData.id}
          />
        );

      case "log":
        return (
          <LogTab
            config={tab.config}
            context={context}
          />
        );

      case "list":
        return (
          <ListTab
            config={tab.config}
            context={context}
            additionalContexts={additionalContexts}
          />
        );

      default:
        return (
          <div className="p-4">
            <p className="text-sm text-muted-foreground">
              Tab type "{tab.type}" not implemented yet
            </p>
          </div>
        );
    }
  };

  return (
    <Card className={`${width} ${height} flex flex-col overflow-hidden`}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
        {/* Tab Navigation - Fixed at top */}
        <TabsList className="w-full justify-start rounded-none h-auto p-0 bg-transparent border-b shrink-0">
          {config.tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Tab Content */}
        {config.tabs.map((tab) => (
          <TabsContent
            key={tab.id}
            value={tab.id}
            className="flex-1 m-0 overflow-hidden data-[state=inactive]:hidden"
          >
            {renderTabContent(tab)}
          </TabsContent>
        ))}
      </Tabs>
    </Card>
  );
}

export default UniversalCard;
