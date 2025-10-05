"use client";

import React, { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChecklistItem from "./ChecklistItem";
import ChecklistProgress from "./ChecklistProgress";
import findHighestIdObject from "@/app/functions/findHighestIdObject";

/**
 * ChecklistTab - Universal checklist tab component
 *
 * Displays a list of checklist items (files, data fields, rates)
 * with progress tracking and completion status.
 *
 * @param {Object} config - Checklist tab configuration
 * @param {Array} config.items - Array of checklist item configs
 * @param {boolean} config.showProgress - Show progress indicator
 * @param {Object} config.completionAction - Optional action when all checked
 * @param {Object} entityData - Entity data from context
 * @param {Function} loadData - Reload entity data
 * @param {string} entityType - Entity type (driver, truck, equipment, employee)
 * @param {number} entityId - Entity ID
 * @param {string} apiRoute - API endpoint for file operations
 */
function ChecklistTab({
  config,
  entityData,
  loadData,
  entityType,
  entityId,
  apiRoute = "/api/update-file",
}) {
  const [allChecked, setAllChecked] = useState(false);
  const [progress, setProgress] = useState({ checked: 0, total: 0 });

  // Calculate progress whenever entity data changes
  useEffect(() => {
    if (!entityData || !config?.items) return;

    let checkedCount = 0;
    let totalCount = 0;

    config.items.forEach((item) => {
      // Skip optional items for "all checked" calculation
      if (item.optional) return;

      totalCount++;

      const itemData = entityData[item.key];

      // Check if item is reviewed
      if (Array.isArray(itemData) && itemData.length > 0) {
        const latest = findHighestIdObject(itemData);
        if (latest.was_reviewed) {
          checkedCount++;
        }
      } else if (itemData && typeof itemData === 'object' && itemData.was_reviewed) {
        checkedCount++;
      }
    });

    setProgress({ checked: checkedCount, total: totalCount });
    setAllChecked(checkedCount === totalCount && totalCount > 0);
  }, [entityData, config]);

  if (!entityData || !config?.items) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        No checklist configuration
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Progress indicator */}
      {config.showProgress && (
        <div className="p-4 border-b">
          <ChecklistProgress
            checked={progress.checked}
            total={progress.total}
            allChecked={allChecked}
          />
        </div>
      )}

      {/* Checklist items */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {config.items.map((item) => (
            <ChecklistItem
              key={item.key}
              item={item}
              entityData={entityData}
              loadData={loadData}
              entityType={entityType}
              entityId={entityId}
              apiRoute={apiRoute}
            />
          ))}
        </div>
      </ScrollArea>

      {/* Completion action (e.g., "Set To Active" button) */}
      {config.completionAction && allChecked && (
        <div className="p-4 border-t flex justify-end">
          {/* This will be rendered by a CompletionAction component */}
          {/* For now, placeholder */}
        </div>
      )}
    </div>
  );
}

export default ChecklistTab;
