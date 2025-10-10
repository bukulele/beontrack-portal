"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Circle } from "lucide-react";

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

  const itemData = entityData[item.key];

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

  return (
    <>
      <div
        className={`flex items-center gap-3 py-1.5 px-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 transition-colors cursor-pointer ${
          item.optional ? "opacity-60" : ""
        }`}
        onClick={() => setModalOpen(true)}
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
          <span>Click to view/edit</span>
        </div>

        {/* View/Edit button */}
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            setModalOpen(true);
          }}
          className="gap-2"
        >
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </Button>
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
