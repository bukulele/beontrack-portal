"use client";

import React, { useState, useEffect } from "react";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useSession } from "next-auth/react";
import { useLoader } from "@/app/context/LoaderContext";

/**
 * InfoField - Inline editable field component
 *
 * Displays a field with label and value. Can switch to edit mode for inline editing.
 *
 * @param {Object} fieldConfig - Field configuration
 * @param {string} fieldConfig.key - Field key in entity data
 * @param {string} fieldConfig.label - Field label
 * @param {string} fieldConfig.type - Field type (text, number, textarea, select, date)
 * @param {boolean} fieldConfig.editable - Can be edited
 * @param {Object} fieldConfig.selectOptions - Options for select type
 * @param {Function} fieldConfig.formatter - Optional value formatter for display
 * @param {any} value - Current value
 * @param {Object} entityData - Full entity data
 * @param {string} entityType - Entity type (truck, driver, etc.)
 * @param {number} entityId - Entity ID
 * @param {Function} onSave - Callback after successful save
 * @param {React.ReactNode} sideContent - Optional content to render on the right side
 */
function InfoField({
  fieldConfig,
  value,
  entityData,
  entityType,
  entityId,
  onSave,
  sideContent,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value || "");
  const [hasChanges, setHasChanges] = useState(false);

  const { data: session } = useSession();
  const { startLoading, stopLoading } = useLoader();

  // Update editValue when value prop changes
  useEffect(() => {
    setEditValue(value || "");
    setHasChanges(false);
  }, [value]);

  // Check if value changed
  useEffect(() => {
    setHasChanges(editValue !== (value || ""));
  }, [editValue, value]);

  // Handle save
  const handleSave = async () => {
    if (!hasChanges) {
      setIsEditing(false);
      return;
    }

    try {
      startLoading();

      const data = new FormData();
      data.append(fieldConfig.key, editValue);
      data.append("changed_by", session.user.name);

      const response = await fetch(`/api/upload-${entityType}-data/${entityId}`, {
        method: "PATCH",
        body: data,
      });

      if (response.ok) {
        setIsEditing(false);
        if (onSave) onSave();
      } else {
        stopLoading();
        console.error("Failed to save field");
      }
    } catch (error) {
      console.error("Error saving field:", error);
      stopLoading();
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setEditValue(value || "");
    setIsEditing(false);
    setHasChanges(false);
  };

  // Format display value
  const getDisplayValue = () => {
    if (fieldConfig.formatter) {
      return fieldConfig.formatter(value, entityData);
    }

    if (fieldConfig.type === "select" && fieldConfig.selectOptions) {
      return fieldConfig.selectOptions[value] || value || "N/A";
    }

    return value || "N/A";
  };

  // Check if field should be hidden (formatter returned null)
  const displayValue = getDisplayValue();
  if (displayValue === null) {
    return null;
  }

  // Render edit mode
  const renderEditMode = () => {
    switch (fieldConfig.type) {
      case "textarea":
        return (
          <Textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="min-h-[80px]"
          />
        );

      case "select":
        const trimmedValue = editValue ? String(editValue).trim() : undefined;
        return (
          <Select value={trimmedValue} onValueChange={setEditValue}>
            <SelectTrigger>
              <SelectValue placeholder={`Select ${fieldConfig.label}...`} />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(fieldConfig.selectOptions || {}).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "number":
        return (
          <Input
            type="number"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
          />
        );

      case "text":
      default:
        return (
          <Input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
          />
        );
    }
  };

  return (
    <Field className="py-0.5">
      <div className="flex items-center justify-between gap-3 min-h-[32px]">
        {/* Label */}
        <FieldLabel className="text-sm font-medium text-muted-foreground">
          {fieldConfig.label}
        </FieldLabel>

        {/* Value / Edit Input */}
        <div className="flex-1">
          {isEditing ? (
            renderEditMode()
          ) : (
            <div className="text-sm">{displayValue}</div>
          )}
        </div>

        {/* Side Content or Action Buttons */}
        <div className="flex items-center gap-1 min-w-[80px] justify-end">
          {sideContent ? (
            sideContent
          ) : isEditing ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSave}
                disabled={!hasChanges}
                className="h-6 w-6"
                title="Save"
              >
                <FontAwesomeIcon icon={faCheck} className="text-green-600 text-xs" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCancel}
                className="h-6 w-6"
                title="Cancel"
              >
                <FontAwesomeIcon icon={faTimes} className="text-red-600 text-xs" />
              </Button>
            </>
          ) : (
            fieldConfig.editable && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditing(true)}
                className="h-6 w-6"
                title="Edit"
              >
                <FontAwesomeIcon icon={faPenToSquare} className="text-blue-600 text-xs" />
              </Button>
            )
          )}
        </div>
      </div>
    </Field>
  );
}

export default InfoField;
