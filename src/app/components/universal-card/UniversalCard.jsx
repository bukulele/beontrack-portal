"use client";

import React, { useState, useContext, useMemo } from "react";
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
import { WcbClaimContext } from "@/app/context/WcbClaimContext";
import { usePermissions, useCurrentUser } from "@/lib/permissions/hooks";
import { getDocumentCapabilities } from "@/lib/permissions/types";

/**
 * Context mapping for dynamic context access
 * Maps provider names (from config) to Context objects
 */
const CONTEXT_MAP = {
  EmployeeProvider: EmployeeContext,
  WcbClaimProvider: WcbClaimContext,
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
  // Access context data dynamically based on config.entity.contextProvider
  const ContextToUse = CONTEXT_MAP[config.entity.contextProvider];
  const context = useContext(ContextToUse);
  const entityData = context?.[config.entity.dataKey];
  const loadData = context?.[config.entity.loadDataKey];

  // Get current user info for role-based checks
  const { roles: userRoles = [], isSuperuser = false } = useCurrentUser();

  // Get permissions for this entity (still needed for CRUD operations and document management)
  const permissions = usePermissions(config.entity.type);

  // Get document permissions using the helper function from config
  const documentPermissions = useMemo(() => {
    // If config provides a helper function, use it
    if (config.getDocumentPermissions && typeof config.getDocumentPermissions === 'function') {
      return config.getDocumentPermissions(permissions);
    }

    // Otherwise, use generic helper from types.js
    return getDocumentCapabilities(permissions.actions, permissions.isSuperuser);
  }, [permissions, config]);

  // Filter tabs based on roles
  const visibleTabs = useMemo(() => {
    if (!config.tabs) return [];

    return config.tabs.filter(tab => {
      // If config provides a tab access helper, use it
      if (config.canAccessTab && typeof config.canAccessTab === 'function') {
        return config.canAccessTab(tab.id, userRoles, isSuperuser);
      }

      // Otherwise, show all tabs if user has read permission
      return permissions.canRead || permissions.isSuperuser;
    });
  }, [config, userRoles, isSuperuser, permissions]);

  // Determine which tab to open initially (must be a visible tab)
  const initialTabId = useMemo(() => {
    const requestedTab = config.initialTab || config.defaultTab;
    const requestedTabVisible = visibleTabs.find(t => t.id === requestedTab);

    // Use requested tab if visible, otherwise first visible tab
    return requestedTabVisible ? requestedTab : visibleTabs[0]?.id;
  }, [config.initialTab, config.defaultTab, visibleTabs]);

  const [activeTab, setActiveTab] = useState(initialTabId);

  // Get width and height from config
  const width = config.width || "w-[1024px]";
  const height = config.height || "h-[95vh]";

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

  // Show message if no tabs are visible
  if (visibleTabs.length === 0) {
    return (
      <Card className={`${width} ${height} flex flex-col overflow-hidden`}>
        <div className="flex items-center justify-center h-full text-muted-foreground">
          <div className="text-center">
            <p className="text-lg font-medium">No Access</p>
            <p className="text-sm mt-2">You do not have permission to view any tabs for this entity.</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`${width} ${height} flex flex-col overflow-hidden`}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
        {/* Tab Navigation - Fixed at top */}
        <TabsList className="w-full justify-start rounded-none h-auto p-0 bg-transparent border-b shrink-0">
          {visibleTabs.map((tab) => (
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
        {visibleTabs.map((tab) => (
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
