"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Item,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
} from "@/components/ui/item";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircle as faCircleSolid,
  faUpload,
  faPenToSquare,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import { faCircle as faCircleRegular } from "@fortawesome/free-regular-svg-icons";
import { useSession } from "@/lib/auth-client";
import { useLoader } from "@/app/context/LoaderContext";
import findHighestIdObject from "@/app/functions/findHighestIdObject";
import FileUploader from "@/app/components/file-uploader/FileUploader";
import ViewFilesModal from "./ViewFilesModal";
import InlineDataField from "./InlineDataField";

/**
 * ChecklistItem - Single checklist row component
 *
 * Displays a checklist item with file upload, checkmark, and action buttons.
 * Handles three types: file-based, data-only, and rate display.
 *
 * @param {Object} item - Item configuration
 * @param {Object} entityData - Entity data from context
 * @param {Function} loadData - Reload entity data
 * @param {string} entityType - Entity type (driver, truck, etc.)
 * @param {number} entityId - Entity ID
 * @param {string} apiRoute - API endpoint for operations
 */
function ChecklistItem({
  item,
  entityData,
  loadData,
  entityType,
  entityId,
  apiRoute,
}) {
  // All hooks must be called at the top level
  const [fileUploaderOpen, setFileUploaderOpen] = useState(false);
  const [viewFilesOpen, setViewFilesOpen] = useState(false);
  const { data: session } = useSession();
  const { startLoading, stopLoading } = useLoader();

  // If this is a data field item (not file upload), use InlineDataField
  if (item.itemType === "data") {
    return (
      <InlineDataField
        item={item}
        entityData={entityData}
        loadData={loadData}
        entityType={entityType}
        entityId={entityId}
      />
    );
  }

  // File-based checklist item (existing logic)

  // Get item data from entity
  const itemData = entityData[item.key];
  const latestItem = Array.isArray(itemData)
    ? findHighestIdObject(itemData)
    : itemData || {};

  // Determine if item has data
  const hasData = Array.isArray(itemData)
    ? itemData.length > 0
    : Object.keys(latestItem).length > 0;

  // Check if reviewed
  const isReviewed = latestItem.was_reviewed || false;
  const reviewedBy = latestItem.last_reviewed_by || "";

  // Role-based permissions
  const canEdit = item.roles?.edit
    ? item.roles.edit.some((role) => userRoles.includes(role))
    : true;

  // Handle checkmark toggle
  const handleCheckmark = async (checked) => {
    if (!hasData) return; // Can't check if no file uploaded

    try {
      startLoading();

      const data = {
        endpointIdentifier: item.key,
        id: latestItem.id,
        last_reviewed_by: session.user.name,
        was_reviewed: checked,
        changed_by: session.user.name,
      };

      const response = await fetch(apiRoute, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        loadData();
      } else {
        stopLoading();
        console.error("Failed to update checkmark");
      }
    } catch (error) {
      console.error("Error updating checkmark:", error);
      stopLoading();
    }
  };

  // Build file uploader config from item config
  const getFileUploaderConfig = () => {
    if (!item.fileUpload) return null;

    return {
      mode: "immediate",
      entityType: entityType,
      entityId: entityId,
      accept: item.fileUpload.accept || "image/*,application/pdf",
      fields: item.fileUpload.fields || [],
      apiRoute: apiRoute,
      endpointIdentifier: item.key,
      onSuccess: () => {
        setFileUploaderOpen(false);
        loadData();
      },
      onError: (error) => {
        console.error("Upload failed:", error);
      },
    };
  };

  // Render missing indicator
  const renderMissingIndicator = () => {
    if (hasData) return null;

    const IconComponent = item.optional ? faCircleRegular : faCircleSolid;
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center">
              <FontAwesomeIcon
                icon={IconComponent}
                className="text-red-600 text-xs"
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            {item.optional ? "Optional - Not uploaded" : "Required - Missing"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  // Get description text
  const getDescription = () => {
    if (!hasData) return "Not uploaded";
    if (isReviewed) return `Reviewed by ${reviewedBy}`;
    return "Pending review";
  };

  return (
    <>
      <Item variant="outline" size="sm">
        {/* Checkmark */}
        {item.actions?.checkable && (
          <ItemMedia>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Checkbox
                      checked={isReviewed}
                      onCheckedChange={handleCheckmark}
                      disabled={!hasData}
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  {isReviewed
                    ? `Reviewed by ${reviewedBy}`
                    : hasData
                    ? "Mark as reviewed"
                    : "Upload file first"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </ItemMedia>
        )}

        {/* Label & Description */}
        <ItemContent>
          <ItemTitle>
            {item.label}
            {renderMissingIndicator()}
          </ItemTitle>
          <ItemDescription>{getDescription()}</ItemDescription>
        </ItemContent>

        {/* Actions */}
        <ItemActions>
          {/* Upload button */}
          {item.actions?.uploadable && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setFileUploaderOpen(true)}
                    className="h-8 w-8"
                  >
                    <FontAwesomeIcon icon={faUpload} className="text-blue-600" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Upload file</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {/* View files button */}
          {hasData && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setViewFilesOpen(true)}
                    className="h-8 w-8"
                  >
                    <FontAwesomeIcon icon={faEye} className="text-gray-600" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>View all versions</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {/* Edit button */}
          {item.actions?.editable && hasData && canEdit && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      // TODO: Open edit modal
                      console.log("Edit clicked");
                    }}
                    className="h-8 w-8"
                  >
                    <FontAwesomeIcon
                      icon={faPenToSquare}
                      className="text-orange-600"
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Edit</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </ItemActions>
      </Item>

      {/* File Uploader Modal */}
      {fileUploaderOpen && (
        <FileUploader
          config={getFileUploaderConfig()}
          open={fileUploaderOpen}
          onClose={() => setFileUploaderOpen(false)}
        />
      )}

      {/* View Files Modal */}
      {viewFilesOpen && (
        <ViewFilesModal
          open={viewFilesOpen}
          onClose={() => setViewFilesOpen(false)}
          item={item}
          itemData={itemData}
          canEdit={canEdit}
          loadData={loadData}
          apiRoute={apiRoute}
          entityType={entityType}
        />
      )}
    </>
  );
}

export default ChecklistItem;
