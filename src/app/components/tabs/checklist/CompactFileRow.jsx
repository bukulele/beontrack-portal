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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUpload,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import { Circle } from "lucide-react";
import { useSession } from "next-auth/react";
import { useLoader } from "@/app/context/LoaderContext";
import findHighestIdObject from "@/app/functions/findHighestIdObject";
import FileUploader from "@/app/components/file-uploader/FileUploader";
import ViewFilesModal from "./ViewFilesModal";
import useUserRoles from "@/app/functions/useUserRoles";
import { UPLOAD_MODES } from "@/config/file-uploader/uploaderSchema";

/**
 * CompactFileRow - Compact row for file-based checklist items
 *
 * Displays checkbox, label, status, and action buttons in a compact layout.
 * Uses ButtonGroup for action buttons (upload/view).
 *
 * @param {Object} item - Item configuration
 * @param {Object} entityData - Entity data from context
 * @param {Function} loadData - Reload entity data
 * @param {string} entityType - Entity type (driver, truck, etc.)
 * @param {number} entityId - Entity ID
 * @param {string} apiRoute - API endpoint for operations
 */
export function CompactFileRow({
  item,
  entityData,
  loadData,
  entityType,
  entityId,
  apiRoute,
}) {
  const [fileUploaderOpen, setFileUploaderOpen] = useState(false);
  const [viewFilesOpen, setViewFilesOpen] = useState(false);

  const { data: session } = useSession();
  const { startLoading, stopLoading } = useLoader();
  const userRoles = useUserRoles();

  // Get item data from entity
  const itemData = entityData[item.key];
  const latestItem = Array.isArray(itemData)
    ? findHighestIdObject(itemData)
    : itemData || {};

  // Determine if item has data
  const hasData = Array.isArray(itemData)
    ? itemData.length > 0
    : Object.keys(latestItem).length > 0;

  // Check if reviewed (new schema: wasReviewed boolean)
  const isReviewed = latestItem.wasReviewed || false;
  const reviewedBy = latestItem.reviewedBy
    ? `${latestItem.reviewedBy.firstName} ${latestItem.reviewedBy.lastName}`.trim() || latestItem.reviewedBy.username
    : "";

  // Role-based permissions
  // WORKAROUND: Auth system not implemented yet - allow all actions
  const canEdit = true;
  const canDelete = true;

  // Handle checkmark toggle
  const handleCheckmark = async (checked) => {
    if (!hasData) return; // Can't check if no file uploaded

    try {
      startLoading();

      // Build universal API endpoint: /api/v1/{entityType}/{entityId}/documents/{documentId}
      const reviewEndpoint = `/api/v1/${entityType}/${entityId}/documents/${latestItem.id}`;

      const data = {
        wasReviewed: checked,
      };

      const response = await fetch(reviewEndpoint, {
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
        console.error("Failed to update review status");
      }
    } catch (error) {
      console.error("Error updating review status:", error);
      stopLoading();
    }
  };

  // Build file uploader config from item config
  const getFileUploaderConfig = () => {
    if (!item.fileUpload) return null;

    // Build generic API endpoint: /api/v1/{entityType}/{entityId}/documents
    const apiEndpoint = `/api/v1/${entityType}/${entityId}/documents`;

    return {
      title: `Upload ${item.label}`,
      apiEndpoint: apiEndpoint,  // Generic for all entity types!
      documentType: item.key,    // The document type (resume, government_id, etc.)
      mode: item.fileUpload.mode || UPLOAD_MODES.IMMEDIATE,
      accept: item.fileUpload.accept || "image/*,application/pdf",
      fields: [
        // File input field - first
        {
          type: 'file',
          name: 'file',
          label: item.label,
          required: true,
          validation: {
            accept: item.fileUpload.accept || "image/*,application/pdf",
          },
        },
        // Metadata fields - after file input
        ...(item.fileUpload.fields || []),
      ],
    };
  };

  // Handle upload success
  const handleUploadSuccess = () => {
    setFileUploaderOpen(false);
    loadData();
  };

  // Handle upload error
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
                className={`h-2 w-2 text-red-600 shrink-0 ${item.optional ? '' : 'fill-red-600'}`}
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

  // Get status text
  const getStatusText = () => {
    if (!hasData) return "Not uploaded";
    if (reviewedBy) {
      return isReviewed
        ? `Reviewed by ${reviewedBy}`
        : `Unchecked by ${reviewedBy}`;
    }
    return "Pending review";
  };

  return (
    <>
      <div
        className={`flex items-center gap-3 py-1.5 px-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 transition-colors ${
          item.optional ? "opacity-60" : ""
        }`}
      >
        {/* Label - 30% width */}
        <div className="w-[30%] flex items-center gap-1.5 shrink-0">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {item.label}
          </span>
          {renderMissingIndicator()}
        </div>

        {/* Status - flexible width */}
        <div className="flex-1 min-w-0">
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {getStatusText()}
          </span>
        </div>

        {/* Action buttons */}
        <ButtonGroup>
          {/* Upload button */}
          {item.actions?.uploadable && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setFileUploaderOpen(true)}
                  >
                    <FontAwesomeIcon icon={faUpload} className="text-blue-600" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Upload file</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {/* View files button - always visible */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setViewFilesOpen(true)}
                  disabled={!hasData}
                >
                  <FontAwesomeIcon icon={faEye} className="text-gray-600" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {hasData ? "View all versions" : "No files uploaded"}
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
                    : "Upload file first"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </ButtonGroup>
      </div>

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
          canDelete={canDelete}
          loadData={loadData}
          entityType={entityType}
          entityId={entityId}
        />
      )}
    </>
  );
}

export default CompactFileRow;
