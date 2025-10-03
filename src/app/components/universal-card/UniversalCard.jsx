"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

/**
 * UniversalCard - Configuration-driven card component
 *
 * Replaces all entity-specific card components (DriverCard, TruckCard, etc.)
 * with a single universal component driven by configuration.
 *
 * @param {Object} config - Card configuration object
 * @param {Object} config.entity - Entity metadata (type, contextProvider, idField)
 * @param {Array} config.tabs - Array of tab configurations
 * @param {string} config.defaultTab - Default tab ID to open
 * @param {string} config.initialTab - Initial tab ID (overrides defaultTab if provided)
 * @param {string} config.width - Width class (default: 'w-[1024px]')
 */
function UniversalCard({ config }) {
  // Determine which tab to open initially
  const initialTabId = config.initialTab || config.defaultTab || config.tabs[0]?.id;
  const [activeTab, setActiveTab] = useState(initialTabId);

  // Get width from config or use default
  const width = config.width || "w-[1024px]";

  // Fixed height: 95vh
  const height = "h-[95vh]";

  return (
    <Card className={`${width} ${height} flex flex-col`}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
        {/* Tab Navigation - Fixed at top */}
        <TabsList className="w-full justify-start rounded-none h-auto p-0 bg-transparent border-b">
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

        {/* Tab Content - Scrollable area */}
        {config.tabs.map((tab) => (
          <TabsContent
            key={tab.id}
            value={tab.id}
            className="flex-1 m-0 data-[state=inactive]:hidden"
          >
            <ScrollArea className="h-full">
              <CardContent className="p-5">
                {/* Placeholder - will be replaced with actual tab components */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-700">{tab.label}</h3>
                    <p className="text-sm text-slate-500">
                      Tab Type: <code className="bg-slate-100 px-2 py-1 rounded">{tab.type}</code>
                    </p>
                  </div>

                  <div className="border rounded-lg p-4 bg-slate-50">
                    <p className="text-xs font-semibold text-slate-600 mb-2">Configuration:</p>
                    <pre className="text-xs overflow-auto">
                      {JSON.stringify(tab.config, null, 2)}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </ScrollArea>
          </TabsContent>
        ))}
      </Tabs>
    </Card>
  );
}

export default UniversalCard;
