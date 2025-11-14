"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Circle } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faEye } from "@fortawesome/free-solid-svg-icons";
import { useLoader } from "@/app/context/LoaderContext";
import findHighestIdObject from "@/app/functions/findHighestIdObject";

/**
 * CompactModalRow - Compact row for data items that open in modals
 *
 * Used for complex data like activity_history and driver_background
 * that need specialized modal editors.
 *
 * @param {Object} item - Item configuration
 * @param {React.Component} modalComponent - Modal component to render
 * @param {Object} entityData - Entity data from context
 * @param {Function} loadData - Reload entity data
 * @param {string} entityType - Entity type
 * @param {number} entityId - Entity ID
 */
export function CompactModalRow({
  item,
  modalComponent: ModalComponent,
  entityData,
  loadData,
  entityType,
  entityId,
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const { startLoading, stopLoading } = useLoader();

  const itemData = entityData[item.key];

  // Get latest item (for arrays like activityHistory)
  const latestItem = Array.isArray(itemData) && itemData.length > 0
    ? findHighestIdObject(itemData)
    : (itemData && typeof itemData === 'object' ? itemData : null);

  // Review status
  const isReviewed = latestItem?.wasReviewed || false;
  const reviewedBy = latestItem?.reviewedBy
    ? `${latestItem.reviewedBy.firstName} ${latestItem.reviewedBy.lastName}`.trim() || latestItem.reviewedBy.username
    : "";

  // Check if field is empty
  const isEmpty = (() => {
    // For arrays (like activity_history), check if empty
    if (Array.isArray(itemData)) {
      return itemData.length === 0;
    }
    // For other data items, consider them always needing review
    // (user must open modal to fill them)
    return true;
  })();

  // Show red dot for ALL empty fields (both required and optional)
  // The styling (solid vs outline) will differ based on item.optional
  const showRedDot = isEmpty;

  // Has data check (for checkbox enablement)
  const hasData = latestItem !== null;

  // Handle review checkbox
  const handleCheckmark = async (checked) => {
    if (!hasData) return; // Can't check if no data exists

    try {
      startLoading();

      // Build universal API endpoint for activity history
      const reviewEndpoint = `/api/v1/${entityType}/${entityId}/activity-history/${latestItem.id}`;

      const response = await fetch(reviewEndpoint, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          wasReviewed: checked,
        }),
      });

      if (response.ok) {
        loadData();
      } else {
        stopLoading();
        console.error("Failed to update review status");
      }
    } catch (error) {
      console.error("Error updating review status:", error);
      stopLoading();
    }
  };

  return (
    <>
      <div
        className={`flex items-center gap-3 py-1.5 px-3 border-b border-slate-100 dark:border-slate-800 ${
          item.optional ? "opacity-60" : ""
        }`}
      >
        {/* Label - 30% width */}
        <div className="w-[30%] flex items-center gap-1.5 shrink-0">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {item.label}
          </span>
          {showRedDot && (
            <Circle
              className={`h-2 w-2 text-red-600 shrink-0 ${item.optional ? '' : 'fill-red-600'}`}
            />
          )}
        </div>

        {/* Status - flexible width */}
        <div className="flex-1 min-w-0 text-sm text-slate-600 dark:text-slate-400">
          {isReviewed && reviewedBy ? (
            <span>Reviewed by {reviewedBy}</span>
          ) : hasData ? (
            <span>Needs review</span>
          ) : (
            <span>No data entered</span>
          )}
        </div>

        {/* Action buttons */}
        <ButtonGroup>
          {/* Edit button - equivalent to Upload in file rows */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setModalOpen(true)}
                >
                  <FontAwesomeIcon icon={faEdit} className="text-blue-600" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Edit {item.label}</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* View button - always visible, disabled if no data */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  disabled={!hasData}
                  onClick={() => setModalOpen(true)}
                >
                  <FontAwesomeIcon icon={faEye} className="text-gray-600" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {hasData ? `View ${item.label}` : "No data to view"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Checkbox */}
          {item.actions?.checkable && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-transparent hover:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-800">
                    <Checkbox
                      checked={isReviewed}
                      disabled={!hasData}
                      onCheckedChange={(checked) => handleCheckmark(checked)}
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  {isReviewed
                    ? `Reviewed by ${reviewedBy}`
                    : hasData
                    ? "Mark as reviewed"
                    : "Enter data first"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </ButtonGroup>
      </div>

      {/* Render modal component */}
      {ModalComponent && (
        <ModalComponent
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          item={item}
          itemData={itemData}
          entityData={entityData}
          loadData={loadData}
          entityType={entityType}
          entityId={entityId}
        />
      )}
    </>
  );
}

export default CompactModalRow;
