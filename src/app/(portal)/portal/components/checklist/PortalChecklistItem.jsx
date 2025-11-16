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
import { Circle, Upload, Edit, Eye } from "lucide-react";
import { useLoader } from "@/app/context/LoaderContext";
import findHighestIdObject from "@/app/functions/findHighestIdObject";
import FileUploader from "@/app/components/file-uploader/FileUploader";
import ViewFilesModal from "@/app/components/tabs/checklist/ViewFilesModal";
import InlineDataField from "@/app/components/tabs/checklist/InlineDataField";

/**
 * PortalChecklistItem - Portal-specific checklist row component
 *
 * Simplified version for portal use without complex role-based permissions.
 * Uses simple canEdit prop from portal context.
 *
 * @param {Object} item - Item configuration
 * @param {Object} entityData - Entity data from context
 * @param {Function} loadData - Reload entity data
 * @param {string} entityType - Entity type (employees, etc.)
 * @param {number} entityId - Entity ID
 * @param {string} apiRoute - API endpoint for operations
 * @param {boolean} readOnly - Whether the component is read-only
 */
function PortalChecklistItem({
  item,
  entityData,
  loadData,
  entityType,
  entityId,
  apiRoute,
  readOnly = false,
}) {
  // All hooks must be called at the top level
  const [fileUploaderOpen, setFileUploaderOpen] = useState(false);
  const [viewFilesOpen, setViewFilesOpen] = useState(false);
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

  // Simple permission check - use readOnly prop from parent
  const canEdit = !readOnly;

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

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center">
              <Circle
                className={`h-2 w-2 text-red-600 shrink-0 ml-1.5 ${item.optional ? '' : 'fill-red-600'}`}
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
      <Item variant="outline" size="sm" className={item.optional ? "opacity-60" : ""}>
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
                    <Upload className="h-4 w-4 text-blue-600" />
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
                    <Eye className="h-4 w-4 text-gray-600" />
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
                    <Edit className="h-4 w-4 text-orange-600" />
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

export default PortalChecklistItem;
