"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Check, X, Circle } from "lucide-react";
import { useSession } from "next-auth/react";
import { useLoader } from "@/app/context/LoaderContext";

/**
 * CompactDataRow - Compact row for inline data field editing
 *
 * Always shows inputs (no edit mode), save button appears on change.
 * Much more compact than InlineDataField - inspired by old CheckListFieldFrame.
 *
 * @param {Object} item - Item configuration
 * @param {Object} entityData - Entity data from context
 * @param {Function} loadData - Reload entity data
 * @param {string} entityType - Entity type
 * @param {number} entityId - Entity ID
 */
export function CompactDataRow({
  item,
  entityData,
  loadData,
  entityType,
  entityId,
}) {
  const [value, setValue] = useState(entityData[item.key] || "");
  const [hasChanges, setHasChanges] = useState(false);

  const { data: session } = useSession();
  const { startLoading, stopLoading } = useLoader();

  // Update value when entity data changes
  useEffect(() => {
    const entityValue = entityData[item.key];
    setValue(entityValue !== undefined && entityValue !== null ? entityValue : "");
    setHasChanges(false);
  }, [entityData, item.key]);

  // Check if value has changed
  useEffect(() => {
    const entityValue = entityData[item.key];
    const currentValue = value;
    setHasChanges(String(currentValue) !== String(entityValue || ""));
  }, [value, entityData, item.key]);

  // Handle save
  const handleSave = async () => {
    if (!hasChanges) return;

    try {
      startLoading();

      const data = new FormData();
      data.append(item.key, value);
      data.append("changed_by", session?.user?.name || "Unknown");

      const response = await fetch(`/api/upload-${entityType}-data/${entityId}`, {
        method: "PATCH",
        body: data,
      });

      if (response.ok) {
        loadData();
      } else {
        stopLoading();
        console.error("Failed to save data field");
      }
    } catch (error) {
      console.error("Error saving data field:", error);
      stopLoading();
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setValue(entityData[item.key] || "");
    setHasChanges(false);
  };

  // Check if field is empty and required
  const isEmpty = !entityData[item.key] || String(entityData[item.key]).trim() === "";
  const showRedDot = item.dataField?.required && isEmpty;

  // Render input based on type
  const renderInput = () => {
    const fieldType = item.dataField?.type || "text";

    switch (fieldType) {
      case "number":
        return (
          <Input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        );

      case "date":
        return (
          <Input
            type="date"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        );

      case "select":
        return (
          <Select value={String(value)} onValueChange={setValue}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(item.dataField.options || {}).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "checkbox":
        return (
          <div className="flex items-center gap-2">
            <Checkbox
              checked={Boolean(value)}
              onCheckedChange={(checked) => setValue(checked)}
            />
            <Label>{item.dataField.checkboxLabel || "Yes"}</Label>
          </div>
        );

      case "textarea":
        return (
          <Textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        );

      default:
        return (
          <Input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        );
    }
  };

  return (
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
        {showRedDot && (
          <Circle className="h-2 w-2 fill-red-600 text-red-600 shrink-0" />
        )}
      </div>

      {/* Input - flexible width */}
      <div className="flex-1 min-w-0">{renderInput()}</div>

      {/* Action buttons - only show when changes detected */}
      {hasChanges && (
        <ButtonGroup>
          <Button
            variant="outline"
            size="icon"
            onClick={handleSave}
          >
            <Check className="h-4 w-4 text-green-600" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleCancel}
          >
            <X className="h-4 w-4 text-red-600" />
          </Button>
        </ButtonGroup>
      )}
    </div>
  );
}

export default CompactDataRow;
