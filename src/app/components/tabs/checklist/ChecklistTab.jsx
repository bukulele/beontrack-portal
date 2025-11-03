"use client";

import React, { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ChecklistProgress from "./ChecklistProgress";
import CompactDataRow from "./CompactDataRow";
import CompactFileRow from "./CompactFileRow";
import CompactModalRow from "./CompactModalRow";
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
}) {
  const [allChecked, setAllChecked] = useState(false);
  const [progress, setProgress] = useState({ checked: 0, total: 0 });
  const [validationError, setValidationError] = useState(null);

  // Calculate progress whenever entity data changes
  useEffect(() => {
    if (!entityData || !config?.items) return;

    let checkedCount = 0;
    let totalCount = 0;

    config.items.forEach((item) => {
      // Skip items that should not be displayed
      if (item.shouldDisplay && !item.shouldDisplay(entityData)) return;

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

  // Run validation when allChecked or entityData changes
  useEffect(() => {
    if (!config?.completionAction?.validation) {
      setValidationError(null);
      return;
    }

    const error = config.completionAction.validation(entityData, allChecked);
    setValidationError(error);
  }, [entityData, allChecked, config]);

  if (!entityData || !config?.items) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        No checklist configuration
      </div>
    );
  }

  // Filter items by shouldDisplay, then separate data and file items
  const visibleItems = config.items.filter((item) => {
    if (!item.shouldDisplay) return true;
    return item.shouldDisplay(entityData);
  });

  const dataItems = visibleItems.filter((item) => item.itemType === "data");
  const fileItems = visibleItems.filter((item) => item.itemType === "file");

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
        <div className="p-4 space-y-4">
          {/* General Information Card - combines customFields and data items */}
          {((config.customFields && config.customFields.length > 0) ||
            dataItems.length > 0) && (
            <Card>
              <CardHeader>
                <CardTitle>General Information</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {/* Custom Fields */}
                {config.customFields?.map((field) => (
                  <CompactDataRow
                    key={field.key}
                    item={field}
                    entityData={entityData}
                    loadData={loadData}
                    entityType={entityType}
                    entityId={entityId}
                  />
                ))}
                {/* Data Items */}
                {dataItems.map((item) => {
                  // Check if this item has a modal component specified in config
                  if (item.modalComponent) {
                    // Use CompactModalRow for items with modals
                    return (
                      <CompactModalRow
                        key={item.key}
                        item={item}
                        modalComponent={item.modalComponent}
                        entityData={entityData}
                        loadData={loadData}
                        entityType={entityType}
                        entityId={entityId}
                      />
                    );
                  } else {
                    // Use CompactDataRow for regular data items
                    return (
                      <CompactDataRow
                        key={item.key}
                        item={item}
                        entityData={entityData}
                        loadData={loadData}
                        entityType={entityType}
                        entityId={entityId}
                      />
                    );
                  }
                })}
              </CardContent>
            </Card>
          )}

          {/* Documents Card */}
          {fileItems.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Documents</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {fileItems.map((item) => (
                  <CompactFileRow
                    key={item.key}
                    item={item}
                    entityData={entityData}
                    loadData={loadData}
                    entityType={entityType}
                    entityId={entityId}
                  />
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </ScrollArea>

      {/* Action buttons footer */}
      {(config.statusActions || config.completionAction) && (
        <div className="p-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-3 justify-between items-center flex-wrap">
                {/* Validation error alert */}
                {validationError && (
                  <Alert variant="destructive" className="flex-1 py-2">
                    <AlertDescription>{validationError}</AlertDescription>
                  </Alert>
                )}

                <div className="flex gap-3 items-center flex-wrap">
                  {/* Status action buttons */}
                  {config.statusActions?.map((action) => {
                    // Check if action should be available
                    if (action.availableWhen && !action.availableWhen(entityData)) {
                      return null;
                    }

                    // Get validation error if any
                    const actionError = action.validation
                      ? action.validation(entityData, allChecked)
                      : null;

                    return (
                      <Button
                        key={action.label}
                        variant="outline"
                        disabled={!!actionError}
                        title={actionError || ""}
                        onClick={() => handleStatusAction(action)}
                      >
                        {action.label}
                      </Button>
                    );
                  })}

                  {/* Completion action button */}
                  {config.completionAction && (
                    <Button
                      variant="default"
                      disabled={!allChecked || !!validationError}
                      title={validationError || ""}
                      onClick={() => handleCompletionAction(config.completionAction)}
                    >
                      {config.completionAction.label}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );

  // Handler for status action buttons
  async function handleStatusAction(action) {
    // TODO: Implement status change logic
    console.log("Status action:", action);
  }

  // Handler for completion action
  async function handleCompletionAction(action) {
    // TODO: Implement completion action logic
    console.log("Completion action:", action);
  }
}

export default ChecklistTab;
