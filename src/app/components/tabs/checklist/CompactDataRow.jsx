"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupTextarea,
} from "@/components/ui/input-group";
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
import { useSession } from "@/lib/auth-client";
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
    const fieldType = item.type || item.dataField?.type || "text";

    // For checkboxes, ensure we use boolean false instead of empty string
    if (fieldType === "checkbox") {
      setValue(entityValue === true ? true : false);
    } else if (entityValue !== undefined && entityValue !== null) {
      setValue(entityValue);
    } else {
      setValue("");
    }

    setHasChanges(false);
  }, [entityData, item.key, item.type, item.dataField?.type]);

  // Check if value has changed
  useEffect(() => {
    const entityValue = entityData[item.key];
    const currentValue = value;
    const fieldType = item.type || item.dataField?.type || "text";

    // For arrays, compare using JSON.stringify
    if (Array.isArray(currentValue) || Array.isArray(entityValue)) {
      setHasChanges(JSON.stringify(currentValue) !== JSON.stringify(entityValue || []));
    }
    // For checkboxes, compare boolean values
    else if (fieldType === "checkbox") {
      const entityBool = entityValue === true ? true : false;
      const currentBool = currentValue === true ? true : false;
      setHasChanges(currentBool !== entityBool);
    }
    // For everything else, compare strings
    else {
      setHasChanges(String(currentValue) !== String(entityValue || ""));
    }
  }, [value, entityData, item.key, item.type, item.dataField?.type]);

  // Handle save
  const handleSave = async () => {
    if (!hasChanges) return;

    try {
      startLoading();

      const data = new FormData();

      // Handle array values (for multi-select)
      if (Array.isArray(value)) {
        value.forEach((val) => {
          data.append(item.key, val);
        });
      } else {
        data.append(item.key, value);
      }

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
    const entityValue = entityData[item.key];
    const fieldType = item.type || item.dataField?.type || "text";

    // For arrays, create a new copy
    if (Array.isArray(entityValue)) {
      setValue([...entityValue]);
    }
    // For checkboxes, use boolean false as default
    else if (fieldType === "checkbox") {
      setValue(entityValue === true ? true : false);
    }
    // For everything else
    else {
      setValue(entityValue || "");
    }
    setHasChanges(false);
  };

  // Check if field is empty (type-aware)
  const fieldType = item.type || item.dataField?.type || "text";
  const isEmpty = (() => {
    const value = entityData[item.key];

    switch (fieldType) {
      case "checkbox":
        // Checkboxes never show red dot (false is a valid value)
        return false;

      case "multi-select":
        // Check if array is empty
        return !Array.isArray(value) || value.length === 0;

      case "select":
      case "text":
      case "number":
      case "date":
      case "textarea":
      default:
        // Check if value is empty or whitespace
        return !value || String(value).trim() === "";
    }
  })();

  // Show red dot for ALL empty fields (both required and optional)
  // The styling (solid vs outline) will differ based on item.optional
  const showRedDot = isEmpty;

  // Render input based on type
  const renderInput = () => {
    // Support both item.type and item.dataField.type
    const fieldType = item.type || item.dataField?.type || "text";

    // Action buttons for input group (only shown when hasChanges)
    const actionButtons = hasChanges && (
      <InputGroupAddon align="inline-end">
        <InputGroupButton onClick={handleSave} variant="ghost">
          <Check className="h-3.5 w-3.5 text-green-600" />
        </InputGroupButton>
        <InputGroupButton onClick={handleCancel} variant="ghost">
          <X className="h-3.5 w-3.5 text-red-600" />
        </InputGroupButton>
      </InputGroupAddon>
    );

    switch (fieldType) {
      case "number":
        return (
          <InputGroup>
            <InputGroupInput
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            {actionButtons}
          </InputGroup>
        );

      case "date":
        return (
          <InputGroup>
            <InputGroupInput
              type="date"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            {actionButtons}
          </InputGroup>
        );

      case "select":
        const selectValue = value ? String(value).trim() : undefined;
        // Support both item.selectOptions and item.dataField.options
        const options = item.selectOptions || item.dataField?.options || {};
        return (
          <div className="flex items-center gap-2 flex-1">
            <Select value={selectValue} onValueChange={setValue}>
              <SelectTrigger>
                <SelectValue placeholder={`Select ${item.label}...`} />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(options)
                  .filter(([key, label]) => key !== "" && label !== "") // Filter out empty values
                  .map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {hasChanges && (
              <ButtonGroup>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleSave}
                  className="h-9 w-9"
                >
                  <Check className="h-3.5 w-3.5 text-green-600" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCancel}
                  className="h-9 w-9"
                >
                  <X className="h-3.5 w-3.5 text-red-600" />
                </Button>
              </ButtonGroup>
            )}
          </div>
        );

      case "checkbox":
        return (
          <div className="flex items-center gap-2">
            <Checkbox
              checked={Boolean(value)}
              onCheckedChange={(checked) => setValue(checked)}
            />
            <Label>{item.dataField?.checkboxLabel || "Yes"}</Label>
            {hasChanges && (
              <ButtonGroup className="ml-auto">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleSave}
                  className="h-8 w-8"
                >
                  <Check className="h-3.5 w-3.5 text-green-600" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCancel}
                  className="h-8 w-8"
                >
                  <X className="h-3.5 w-3.5 text-red-600" />
                </Button>
              </ButtonGroup>
            )}
          </div>
        );

      case "multi-select":
        // Support both array format [{value, label}] and object format {key: label}
        const multiOptions = item.selectOptions || item.dataField?.options || [];
        const currentValues = Array.isArray(value) ? value : [];

        const handleMultiChange = (optionValue, checked) => {
          const numValue = typeof optionValue === 'number' ? optionValue : Number(optionValue);
          if (checked) {
            setValue([...currentValues, numValue]);
          } else {
            setValue(currentValues.filter(v => v !== numValue));
          }
        };

        // Convert to array format if it's an object
        const optionsArray = Array.isArray(multiOptions)
          ? multiOptions
          : Object.entries(multiOptions).map(([key, label]) => ({
              value: isNaN(Number(key)) ? key : Number(key),
              label
            }));

        return (
          <div className="flex items-center gap-3 flex-1">
            <div className="flex flex-wrap gap-3 flex-1">
              {optionsArray.map((option) => {
                const optVal = option.value;
                const optLabel = option.label;
                return (
                  <div key={optVal} className="flex items-center gap-1.5">
                    <Checkbox
                      checked={currentValues.includes(optVal)}
                      onCheckedChange={(checked) => handleMultiChange(optVal, checked)}
                    />
                    <Label className="cursor-pointer" onClick={() =>
                      handleMultiChange(optVal, !currentValues.includes(optVal))
                    }>
                      {optLabel}
                    </Label>
                  </div>
                );
              })}
            </div>
            {hasChanges && (
              <ButtonGroup>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleSave}
                  className="h-9 w-9"
                >
                  <Check className="h-3.5 w-3.5 text-green-600" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCancel}
                  className="h-9 w-9"
                >
                  <X className="h-3.5 w-3.5 text-red-600" />
                </Button>
              </ButtonGroup>
            )}
          </div>
        );

      case "textarea":
        return (
          <InputGroup>
            <InputGroupTextarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              rows={3}
            />
            {actionButtons}
          </InputGroup>
        );

      default:
        return (
          <InputGroup>
            <InputGroupInput
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            {actionButtons}
          </InputGroup>
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
          <Circle
            className={`h-2 w-2 text-red-600 shrink-0 ${item.optional ? '' : 'fill-red-600'}`}
          />
        )}
      </div>

      {/* Input - flexible width with integrated action buttons */}
      <div className="flex-1 min-w-0">{renderInput()}</div>
    </div>
  );
}

export default CompactDataRow;
