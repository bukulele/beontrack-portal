"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Item,
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
import { Circle, Upload, Eye } from "lucide-react";
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

  // Simple permission check - use readOnly prop from parent
  const canEdit = !readOnly;

  // Build file uploader config from item config
  const getFileUploaderConfig = () => {
    if (!item.fileUpload) return null;

    // Build generic API endpoint: /api/v1/{entityType}/{entityId}/documents
    const apiEndpoint = `/api/v1/${entityType}/${entityId}/documents`;

    return {
      title: `Upload ${item.label}`,
      apiEndpoint: apiEndpoint,
      documentType: item.key,
      mode: item.fileUpload.mode || "immediate",
      accept: item.fileUpload.accept || "image/*,application/pdf",
      fields: [
        // File input field - first
        {
          type: 'file',
          name: 'file',
          label: item.label,
          required: !item.optional,
          validation: {
            accept: item.fileUpload.accept || "image/*,application/pdf",
          },
        },
        // Metadata fields - after file input
        ...(item.fileUpload.fields || []),
      ],
    };
  };

  // Success handler for file upload
  const handleUploadSuccess = () => {
    setFileUploaderOpen(false);
    loadData();
  };

  // Error handler for file upload
  const handleUploadError = (error) => {
    console.error("Upload failed:", error);
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
    return "Uploaded";
  };

  return (
    <>
      <Item variant="outline" size="sm" className={item.optional ? "opacity-60" : ""}>
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
        </ItemActions>
      </Item>

      {/* File Uploader Modal */}
      {fileUploaderOpen && (
        <FileUploader
          config={getFileUploaderConfig()}
          open={fileUploaderOpen}
          onClose={() => setFileUploaderOpen(false)}
          onSuccess={handleUploadSuccess}
          onError={handleUploadError}
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
          entityId={entityId}
        />
      )}
    </>
  );
}

export default PortalChecklistItem;
