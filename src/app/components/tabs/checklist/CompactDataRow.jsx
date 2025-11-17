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
import { Circle } from "lucide-react";
import { parse, format, isValid } from "date-fns";

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
 * CompactDataRow - Compact row for inline data field editing
 *
 * Always shows inputs (no edit mode). Changes are staged in context.
 * Actual save happens via central Save button in PortalNav.
 *
 * @param {Object} item - Item configuration
 * @param {Function} onFieldChange - Callback to update field in context
 * @param {*} value - Current field value
 */
export function CompactDataRow({
  item,
  onFieldChange,
  value: initialValue,
}) {
  const [value, setValue] = useState(initialValue || "");

  // Update local value when prop changes (after save/reload)
  useEffect(() => {
    const fieldType = item.type || item.dataField?.type || "text";

    if (fieldType === "checkbox") {
      setValue(initialValue === true ? true : false);
    } else if (fieldType === "date" && initialValue) {
      // Convert ISO date string to YYYY-MM-DD format for date inputs
      const dateValue = typeof initialValue === 'string'
        ? initialValue.split('T')[0]  // Extract YYYY-MM-DD from ISO string
        : format(new Date(initialValue), 'yyyy-MM-dd');
      setValue(dateValue);
    } else if (initialValue !== undefined && initialValue !== null) {
      setValue(initialValue);
    } else {
      setValue("");
    }
  }, [initialValue, item.type, item.dataField?.type]);

  // Handle value change
  const handleChange = (newValue) => {
    setValue(newValue);
    onFieldChange(item.key, newValue);
  };

  // Check if field is empty (for red dot indicator)
  const fieldType = item.type || item.dataField?.type || "text";
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
            className="h-9"
          />
        );

      case "date":
        // Get date range from field config
        const dateRange = item.dataField?.dateRange || item.dateRange;
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
        const options = item.selectOptions || item.dataField?.options || {};
        return (
          <Select value={selectValue} onValueChange={handleChange}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder={`Select ${item.label}...`} />
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
            <Label>{item.dataField?.checkboxLabel || "Yes"}</Label>
          </div>
        );

      case "multi-select":
        const multiOptions = item.selectOptions || item.dataField?.options || [];
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

      {/* Input - flexible width */}
      <div className="flex-1 min-w-0">{renderInput()}</div>
    </div>
  );
}

export default CompactDataRow;
