"use client";

import React from "react";
import { Progress } from "@/components/ui/progress";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

/**
 * ChecklistProgress - Display checklist completion progress
 *
 * Shows a progress bar and completion status for checklist items.
 *
 * @param {number} checked - Number of checked items
 * @param {number} total - Total number of items
 * @param {boolean} allChecked - All items are checked
 */
function ChecklistProgress({ checked, total, allChecked }) {
  const percentage = total > 0 ? (checked / total) * 100 : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">
          {allChecked ? (
            <span className="flex items-center gap-2 text-green-600">
              <FontAwesomeIcon icon={faCheckCircle} />
              All required items reviewed
            </span>
          ) : (
            <span>
              Progress: {checked} / {total} required items reviewed
            </span>
          )}
        </div>
        <div className="text-sm text-muted-foreground">
          {Math.round(percentage)}%
        </div>
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  );
}

export default ChecklistProgress;
