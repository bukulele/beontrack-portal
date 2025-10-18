"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { Trash2, Pencil } from "lucide-react";
import CompactDataRow from "../checklist/CompactDataRow";
import CompactFileRow from "../checklist/CompactFileRow";
import { useLoader } from "@/app/context/LoaderContext";

/**
 * EntityGroup - Single entity display card
 *
 * Shows data fields (CompactDataRow) and file section (CompactFileRow).
 * Provides Edit and Delete buttons.
 *
 * @param {Object} entity - Entity data
 * @param {Object} config - Sub-entities tab configuration
 * @param {number} index - Entity index
 * @param {Object} contextData - Parent entity data
 * @param {Function} loadData - Reload parent entity data
 * @param {number} entityId - Parent entity ID
 * @param {Function} onEdit - Edit callback
 */
function EntityGroup({
  entity,
  config,
  index,
  contextData,
  loadData,
  entityId,
  onEdit,
}) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { startLoading, stopLoading } = useLoader();

  // Generate group title
  const groupTitle =
    typeof config.groupTitle === "function"
      ? config.groupTitle(entity, index)
      : `Item ${index + 1}`;

  // Handle delete
  const handleDelete = async () => {
    if (!config.delete?.endpoint) {
      console.error("Delete endpoint not configured");
      return;
    }

    try {
      startLoading();

      const response = await fetch(config.delete.endpoint, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: entity.id }),
      });

      if (response.ok) {
        loadData();
        setDeleteDialogOpen(false);
      } else {
        console.error("Failed to delete entity");
      }
    } catch (error) {
      console.error("Error deleting entity:", error);
    } finally {
      stopLoading();
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">{groupTitle}</h3>
            <ButtonGroup>
              <Button
                variant="outline"
                size="icon"
                onClick={onEdit}
                className="h-8 w-8"
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setDeleteDialogOpen(true)}
                className="h-8 w-8"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </ButtonGroup>
          </div>
        </CardHeader>
        <CardContent className="space-y-0 p-0">
          {/* Data fields - read-only display */}
          {config.dataFields?.map((field, fieldIndex) => {
            // Check hideIf condition
            if (field.hideIf && field.hideIf(entity)) {
              return null;
            }

            // Get value
            let value = entity[field.key];

            // Apply valueMap if specified
            if (field.valueMap && typeof field.valueMap === "string") {
              // Import valueMap from tableData
              const valueMaps = require("@/app/assets/tableData");
              const mapObject = valueMaps[field.valueMap];
              if (mapObject) {
                value = mapObject[value] || value;
              }
            } else if (field.valueMap && typeof field.valueMap === "object") {
              value = field.valueMap[value] || value;
            }

            // Create a display-only item config
            const displayItem = {
              key: field.key,
              label: field.label,
              type: "text", // Always display as text (read-only)
              optional: field.optional,
            };

            // Create a mock entity with just this field for display
            const displayEntity = { [field.key]: value };

            return (
              <div
                key={fieldIndex}
                className="border-b last:border-b-0 px-3 py-1.5 hover:bg-slate-50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-[30%] text-sm font-medium text-slate-700">
                    {field.label}
                  </div>
                  <div className="flex-1 text-sm text-slate-900">{value}</div>
                </div>
              </div>
            );
          })}

          {/* File field - CompactFileRow */}
          {config.fileField && (
            <div className="border-t">
              <CompactFileRow
                item={config.fileField}
                entityData={entity}
                loadData={loadData}
                entityType={config.fileField.dataType}
                entityId={entity.id}
                apiRoute="/api/update-file"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              {config.delete?.confirmMessage ||
                "Are you sure you want to delete this item? This action cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default EntityGroup;
