/**
 * Action Buttons Component
 *
 * Displays edit/delete buttons for time entries.
 * - Edit and Delete buttons appear on the right
 * - Plus button appears on the left (only for last entry in IN column)
 */

import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Plus } from "lucide-react";

export default function ActionButtons({
  field, // 'checkIn' | 'checkOut'
  isLastEntry,
  onEdit,
  onDelete,
  onAddEntry,
}) {
  return (
    <>
      {/* Plus button on LEFT - only for LAST entry in IN column */}
      {field === "checkIn" && isLastEntry && (
        <div className="absolute left-1 pointer-events-auto">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onAddEntry();
            }}
          >
            <Plus className="h-3 w-3 pointer-events-none" />
          </Button>
        </div>
      )}

      {/* Edit/Delete on RIGHT - always for hovered entries */}
      <div className="absolute right-1 flex gap-1 pointer-events-auto">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onEdit();
          }}
        >
          <Pencil className="h-3 w-3 pointer-events-none" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onDelete();
          }}
        >
          <Trash2 className="h-3 w-3 pointer-events-none" />
        </Button>
      </div>
    </>
  );
}
