"use client";

import React, { useState, useEffect } from "react";
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
import { DatePicker } from "@/components/ui/date-picker";
import { Circle, Check, X } from "lucide-react";
import { parse, format, isValid } from "date-fns";
import { Button } from "@/components/ui/button";

// Convert date range notation to actual years
const getYearFromRange = (rangeValue) => {
  const currentYear = new Date().getFullYear();

  if (rangeValue === 'current') {
    return currentYear;
  } else if (typeof rangeValue === 'string' && rangeValue.startsWith('current')) {
    // Handle 'current+5', 'current-16' etc
    const match = rangeValue.match(/current([+-]\d+)/);
    if (match) {
      return currentYear + parseInt(match[1]);
    }
  }

  return rangeValue; // Numeric year
};

/**
 * CompactDataRowChecklist - Compact row for inline data field editing in checklists
 *
 * Supports direct API calls with save/cancel buttons.
 * Used in ChecklistTab for employee onboarding data fields.
 *
 * @param {Object} item - Item configuration
 * @param {Object} entityData - Full entity data object
 * @param {Function} loadData - Reload function after save
 * @param {string} entityType - Entity type (e.g., 'employees')
 * @param {string} entityId - Entity ID
 */
export function CompactDataRowChecklist({
  item,
  entityData,
  loadData,
  entityType,
  entityId,
}) {
  const initialValue = entityData[item.key];
  const [value, setValue] = useState(initialValue || "");
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Update local value when entityData changes (after save/reload)
  useEffect(() => {
    const fieldType = item.type || "text";
    const newValue = entityData[item.key];

    if (fieldType === "checkbox") {
      setValue(newValue === true ? true : false);
    } else if (fieldType === "date" && newValue) {
      // Convert ISO date string to YYYY-MM-DD format for date inputs
      const dateValue = typeof newValue === 'string'
        ? newValue.split('T')[0]  // Extract YYYY-MM-DD from ISO string
        : format(new Date(newValue), 'yyyy-MM-dd');
      setValue(dateValue);
    } else if (newValue !== undefined && newValue !== null) {
      setValue(newValue);
    } else {
      setValue("");
    }
    setHasChanges(false);
  }, [entityData, item.key, item.type]);

  // Handle value change
  const handleChange = (newValue) => {
    setValue(newValue);
    setHasChanges(true);
  };

  // Handle save
  const handleSave = async () => {
    try {
      setIsSaving(true);

      const response = await fetch(`/api/v1/${entityType}/${entityId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          [item.key]: value,
        }),
      });

      if (response.ok) {
        await loadData(); // Reload entity data
        setHasChanges(false);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("Failed to update field:", errorData);
        alert(`Failed to save: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Error updating field:", error);
      alert(`Error saving: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    const fieldType = item.type || "text";
    const originalValue = entityData[item.key];

    if (fieldType === "date" && originalValue) {
      const dateValue = typeof originalValue === 'string'
        ? originalValue.split('T')[0]
        : format(new Date(originalValue), 'yyyy-MM-dd');
      setValue(dateValue);
    } else {
      setValue(originalValue || "");
    }
    setHasChanges(false);
  };

  // Check if field is empty (for red dot indicator)
  const fieldType = item.type || "text";
  const isEmpty = (() => {
    const currentValue = value;

    switch (fieldType) {
      case "checkbox":
        return false; // Checkboxes never show red dot
      case "multi-select":
        return !Array.isArray(currentValue) || currentValue.length === 0;
      default:
        return !currentValue || String(currentValue).trim() === "";
    }
  })();

  // Show red dot for empty required fields (but not for read-only fields)
  const showRedDot = !item.optional && isEmpty && !item.readOnly;

  // Render input based on type
  const renderInput = () => {
    if (item.readOnly) {
      return (
        <span className="text-sm text-slate-600 dark:text-slate-400">
          {value || <span className="text-muted-foreground italic">Not assigned</span>}
        </span>
      );
    }

    switch (fieldType) {
      case "number":
        return (
          <Input
            type="number"
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={item.placeholder}
            className="h-9"
          />
        );

      case "date":
        // Get date range from field config
        const dateRange = item.dateRange;
        const startYear = dateRange?.start
          ? getYearFromRange(dateRange.start)
          : 1900;
        const endYear = dateRange?.end
          ? getYearFromRange(dateRange.end)
          : 2100;

        return (
          <DatePicker
            value={value ? parse(value, "yyyy-MM-dd", new Date()) : undefined}
            onChange={(date) => {
              handleChange(date && isValid(date) ? format(date, "yyyy-MM-dd") : "");
            }}
            startYear={startYear}
            endYear={endYear}
          />
        );

      case "select":
        const selectValue = value ? String(value).trim() : undefined;
        const options = item.selectOptions || {};
        return (
          <Select value={selectValue} onValueChange={handleChange}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder={item.placeholder || `Select ${item.label}...`} />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(options)
                .filter(([key, label]) => key !== "" && label !== "")
                .map(([key, label]) => (
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
              onCheckedChange={handleChange}
            />
            <Label>{item.checkboxLabel || "Yes"}</Label>
          </div>
        );

      case "multi-select":
        const multiOptions = item.selectOptions || [];
        const currentValues = Array.isArray(value) ? value : [];

        const handleMultiChange = (optionValue, checked) => {
          const numValue = typeof optionValue === 'number' ? optionValue : Number(optionValue);
          const newValues = checked
            ? [...currentValues, numValue]
            : currentValues.filter(v => v !== numValue);
          handleChange(newValues);
        };

        const optionsArray = Array.isArray(multiOptions)
          ? multiOptions
          : Object.entries(multiOptions).map(([key, label]) => ({
              value: isNaN(Number(key)) ? key : Number(key),
              label
            }));

        return (
          <div className="flex flex-wrap gap-3">
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
        );

      case "textarea":
        return (
          <Textarea
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={item.placeholder}
            rows={3}
            className="min-h-[60px]"
          />
        );

      default:
        return (
          <Input
            type="text"
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={item.placeholder}
            className="h-9"
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
      {/* Label - 25% width */}
      <div className="w-[25%] flex items-center gap-1.5 shrink-0">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {item.label}
        </span>
        {showRedDot && (
          <Circle
            className={`h-2 w-2 text-red-600 shrink-0 ${item.optional ? '' : 'fill-red-600'}`}
          />
        )}
      </div>

      {/* Input - flexible width */}
      <div className="flex-1 min-w-0">{renderInput()}</div>

      {/* Save/Cancel buttons - show only when there are changes */}
      {hasChanges && !item.readOnly && (
        <div className="flex items-center gap-1 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSave}
            disabled={isSaving}
            className="h-7 w-7 hover:bg-green-100 dark:hover:bg-green-900"
          >
            <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCancel}
            disabled={isSaving}
            className="h-7 w-7 hover:bg-red-100 dark:hover:bg-red-900"
          >
            <X className="h-4 w-4 text-red-600 dark:text-red-400" />
          </Button>
        </div>
      )}
    </div>
  );
}

export default CompactDataRowChecklist;
