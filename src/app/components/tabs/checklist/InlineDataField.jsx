"use client";

import React, { useState, useEffect } from "react";
import {
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
} from "@/components/ui/item";
import { Button } from "@/components/ui/button";
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
import { Check, X, Pencil, Circle } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { useLoader } from "@/app/context/LoaderContext";
import { parse, format, isValid } from "date-fns";

/**
 * InlineDataField - Inline editable data field for checklist
 *
 * Displays entity field with inline editing. No review checkbox - just edit/save.
 * Matches original CheckListFieldFrame behavior.
 *
 * @param {Object} item - Item configuration
 * @param {Object} entityData - Entity data from context
 * @param {Function} loadData - Reload entity data
 * @param {string} entityType - Entity type
 * @param {number} entityId - Entity ID
 */
export function InlineDataField({
  item,
  entityData,
  loadData,
  entityType,
  entityId,
}) {
  const [isEditing, setIsEditing] = useState(false);
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
    if (!hasChanges) {
      setIsEditing(false);
      return;
    }

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
        setIsEditing(false);
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
    setIsEditing(false);
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
            className="h-8"
          />
        );

      case "date":
        return (
          <DatePicker
            value={value ? parse(value, "yyyy-MM-dd", new Date()) : undefined}
            onChange={(date) => {
              setValue(date && isValid(date) ? format(date, "yyyy-MM-dd") : "");
            }}
          />
        );

      case "select":
        return (
          <Select value={String(value)} onValueChange={setValue}>
            <SelectTrigger className="h-8">
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
            <Label className="text-sm">{item.dataField.checkboxLabel || "Yes"}</Label>
          </div>
        );

      case "textarea":
        return (
          <Textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="min-h-[60px]"
          />
        );

      default:
        return (
          <Input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="h-8"
          />
        );
    }
  };

  // Format display value
  const getDisplayValue = () => {
    if (isEmpty) return <span className="text-muted-foreground">Not set</span>;

    if (item.dataField?.type === "checkbox") {
      return value ? "Yes" : "No";
    }

    if (item.dataField?.type === "select" && item.dataField.options) {
      return item.dataField.options[value] || value;
    }

    return String(value);
  };

  return (
    <Item variant="outline" size="sm" className={item.optional ? "opacity-60" : ""}>
      <ItemContent className="flex-1">
        <ItemTitle className="flex items-center gap-2">
          {item.label}
          {showRedDot && (
            <Circle className="h-2 w-2 fill-red-600 text-red-600" />
          )}
        </ItemTitle>

        {isEditing ? (
          <div className="flex items-center gap-2 mt-1">
            {renderInput()}
          </div>
        ) : (
          <ItemDescription>{getDisplayValue()}</ItemDescription>
        )}
      </ItemContent>

      <ItemActions>
        {isEditing ? (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSave}
              disabled={!hasChanges}
              className="h-8 w-8"
            >
              <Check className="h-4 w-4 text-green-600" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCancel}
              className="h-8 w-8"
            >
              <X className="h-4 w-4 text-red-600" />
            </Button>
          </>
        ) : (
          item.actions?.editable && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditing(true)}
              className="h-8 w-8"
            >
              <Pencil className="h-4 w-4 text-blue-600" />
            </Button>
          )
        )}
      </ItemActions>
    </Item>
  );
}

export default InlineDataField;
