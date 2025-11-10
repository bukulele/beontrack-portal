"use client";

import React, { useState, useContext } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChecklistTab from "@/app/components/tabs/checklist/ChecklistTab";
import GeneralInfoTab from "@/app/components/tabs/general-info/GeneralInfoTab";
import LogTab from "@/app/components/tabs/log/LogTab";
import ListTab from "@/app/components/tabs/list/ListTab";
import TimeCardTab from "@/app/components/tabs/timecard/TimeCardTab";
import SubEntitiesTab from "@/app/components/tabs/sub-entities/SubEntitiesTab";
import ActivityLogTab from "@/app/components/tabs/activity-log/ActivityLogTab";
import { EmployeeContext } from "@/app/context/EmployeeContext";

/**
 * Context mapping for dynamic context access
 * Maps provider names (from config) to Context objects
 */
const CONTEXT_MAP = {
  EmployeeProvider: EmployeeContext,
  // List contexts for referenced data
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
 * @param {Function} onLightboxChange - Callback when lightbox state changes
 */
function UniversalCard({ config, onLightboxChange }) {
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

  // Additional contexts - currently empty as legacy contexts have been removed
  // TODO: Re-implement when needed for the new architecture
  const additionalContexts = {};

  // Handle entity navigation from list tabs
  const handleEntityClick = (entityId, entityType) => {
    // For now, just log the click - this can be enhanced to open nested cards
    // or navigate to a different page depending on requirements
    console.log(`Entity clicked: ${entityType} - ${entityId}`);
    // TODO: Implement navigation logic (e.g., open a nested dialog or navigate to entity page)
  };

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
            additionalContexts={additionalContexts}
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
            onEntityClick={handleEntityClick}
          />
        );

      case "timecard":
        return (
          <TimeCardTab
            config={tab.config}
            entityData={entityData}
          />
        );

      case "sub-entities":
        return (
          <SubEntitiesTab
            config={tab.config}
            contextData={entityData}
            loadData={loadData}
            entityId={entityData.id}
          />
        );

      case "activity-log":
        return (
          <ActivityLogTab
            config={tab.config}
            contextData={entityData}
            loadData={loadData}
            entityId={entityData.id}
          />
        );

      default:
        return (
          <div className="p-4">
            <p className="text-sm text-muted-foreground">
              Tab type &quot;{tab.type}&quot; not implemented yet
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
