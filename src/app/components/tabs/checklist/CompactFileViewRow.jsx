"use client";

import React, { useState } from "react";
import findHighestIdObject from "@/app/functions/findHighestIdObject";
import ViewFilesModal from "./ViewFilesModal";
import formatDate from "@/app/functions/formatDate";

/**
 * CompactFileViewRow - Read-only compact row for viewing files
 *
 * Ultra-simple clickable row that opens ViewFilesModal.
 * No buttons, no checkboxes, no review status - just click to view.
 *
 * @param {Object} item - Item configuration
 * @param {Object} entityData - Entity data from context
 * @param {Function} loadData - Reload entity data (not used in read-only mode)
 * @param {string} entityType - Entity type
 */
export function CompactFileViewRow({
  item,
  entityData,
  loadData,
  entityType,
}) {
  const [viewFilesOpen, setViewFilesOpen] = useState(false);

  // Get item data from entity
  const itemData = entityData[item.key];
  const latestItem = Array.isArray(itemData)
    ? findHighestIdObject(itemData)
    : itemData || {};

  // Determine if item has data
  const hasData = Array.isArray(itemData)
    ? itemData.length > 0
    : Object.keys(latestItem).length > 0;

  // Get metadata to display (expiry date, plate number, etc.)
  const getMetadata = () => {
    if (!hasData) return "No documents uploaded";

    // Show expiry date if exists
    if (latestItem.expiry_date || latestItem.expiration_date) {
      const date = formatDate(latestItem.expiry_date || latestItem.expiration_date);
      return date ? `Expires: ${date}` : "Expires: N/A";
    }

    // Show plate number for license plates
    if (latestItem.plate_number) {
      return `Plate: ${latestItem.plate_number}`;
    }

    // Show issue date if exists
    if (latestItem.issue_date) {
      const date = formatDate(latestItem.issue_date);
      return date ? `Issued: ${date}` : "Issued: N/A";
    }

    // Show comment if exists
    if (latestItem.comment) {
      return latestItem.comment;
    }

    // Generic message
    return "Click to view documents";
  };

  // Handle row click
  const handleRowClick = () => {
    if (hasData) {
      setViewFilesOpen(true);
    }
  };

  return (
    <>
      <div
        onClick={handleRowClick}
        className={`flex items-center gap-3 py-1.5 px-3 border-b border-slate-100 dark:border-slate-800 transition-colors ${
          hasData
            ? "cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50"
            : "opacity-50 cursor-not-allowed"
        } ${item.optional ? "opacity-60" : ""}`}
      >
        {/* Label - 30% width */}
        <div className="w-[30%] shrink-0">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {item.label}
          </span>
        </div>

        {/* Metadata - flexible width */}
        <div className="flex-1 min-w-0">
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {getMetadata()}
          </span>
        </div>
      </div>

      {/* View Files Modal - Read-only mode */}
      {viewFilesOpen && hasData && (
        <ViewFilesModal
          open={viewFilesOpen}
          onClose={() => setViewFilesOpen(false)}
          item={item}
          itemData={itemData}
          readOnly={true}
          loadData={loadData}
          entityType={entityType}
        />
      )}
    </>
  );
}

export default CompactFileViewRow;
