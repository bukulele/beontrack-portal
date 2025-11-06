"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSession } from "@/lib/auth-client";
import { useLoader } from "@/app/context/LoaderContext";

/**
 * EntityFormDialog - Modern form dialog for add/edit sub-entities
 *
 * Replaces legacy CreateObject modal with clean shadcn Dialog pattern.
 * Follows AdjustmentDialog pattern from timecard.
 *
 * @param {boolean} open - Dialog open state
 * @param {string} mode - 'add' or 'edit'
 * @param {Object} entity - Entity data (for edit mode)
 * @param {Object} config - Form configuration from tab config
 * @param {Object} parentData - Parent entity data (for context)
 * @param {Function} onSuccess - Success callback
 * @param {Function} onCancel - Cancel callback
 */
function EntityFormDialog({
  open,
  mode,
  entity,
  config,
  parentData,
  onSuccess,
  onCancel,
}) {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const { data: session } = useSession();
  const { startLoading, stopLoading } = useLoader();

  // Initialize form data
  useEffect(() => {
    if (open) {
      if (mode === "edit" && entity) {
        // Pre-fill with entity data
        const initialData = {};
        config.fields.forEach((field) => {
          initialData[field.key] = entity[field.key] || "";
        });
        setFormData(initialData);
      } else if (mode === "add") {
        // Initialize with empty values or parent data
        const initialData = { ...parentData };
        config.fields.forEach((field) => {
          if (!(field.key in initialData)) {
            initialData[field.key] = "";
          }
        });
        setFormData(initialData);
      }
      setErrors({});
    }
  }, [open, mode, entity, config.fields, parentData]);

  // Handle field change
  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    // Clear error for this field
    if (errors[key]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  // Validate form
  const validate = () => {
    const newErrors = {};

    config.fields.forEach((field) => {
      if (field.required && !formData[field.key]) {
        newErrors[field.key] = `${field.label} is required`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle save
  const handleSave = async () => {
    if (!validate()) return;

    try {
      startLoading();

      const data = new FormData();

      // Add all form fields
      config.fields.forEach((field) => {
        const value = formData[field.key];
        if (value !== undefined && value !== null && value !== "") {
          data.append(field.key, value);
        }
      });

      // Add metadata
      data.append("updated_by", session?.user?.name || "Unknown");
      if (mode === "edit") {
        data.append("id", entity.id);
      }

      // Determine endpoint and method
      const endpoint = config.endpoint;
      const method = mode === "add" ? config.method?.add || "POST" : config.method?.edit || "PATCH";

      const response = await fetch(endpoint, {
        method,
        body: data,
      });

      if (response.ok) {
        onSuccess();
        handleCancel();
      } else {
        console.error("Failed to save entity");
        stopLoading();
      }
    } catch (error) {
      console.error("Error saving entity:", error);
      stopLoading();
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setFormData({});
    setErrors({});
    onCancel();
  };

  // Generate dialog title
  const dialogTitle =
    typeof config.title === "function"
      ? config.title(mode, entity)
      : mode === "add"
      ? "Add Item"
      : "Edit Item";

  // Render field based on type
  const renderField = (field) => {
    const value = formData[field.key] || "";
    const error = errors[field.key];

    switch (field.type) {
      case "textarea":
        return (
          <div key={field.key} className="space-y-2">
            <Label htmlFor={field.key}>
              {field.label}
              {field.required && <span className="text-red-600 ml-1">*</span>}
            </Label>
            <Textarea
              id={field.key}
              value={value}
              onChange={(e) => handleChange(field.key, e.target.value)}
              rows={3}
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
        );

      case "select":
        // Get options - support both string reference and object
        let options = field.options;
        if (typeof options === "string") {
          const optionMaps = require("@/app/assets/tableData");
          options = optionMaps[options] || {};
        }

        return (
          <div key={field.key} className="space-y-2">
            <Label htmlFor={field.key}>
              {field.label}
              {field.required && <span className="text-red-600 ml-1">*</span>}
            </Label>
            <Select value={value} onValueChange={(val) => handleChange(field.key, val)}>
              <SelectTrigger id={field.key}>
                <SelectValue placeholder={`Select ${field.label}...`} />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(options).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
        );

      case "number":
        return (
          <div key={field.key} className="space-y-2">
            <Label htmlFor={field.key}>
              {field.label}
              {field.required && <span className="text-red-600 ml-1">*</span>}
            </Label>
            <Input
              id={field.key}
              type="number"
              value={value}
              onChange={(e) => handleChange(field.key, e.target.value)}
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
        );

      case "date":
        return (
          <div key={field.key} className="space-y-2">
            <Label htmlFor={field.key}>
              {field.label}
              {field.required && <span className="text-red-600 ml-1">*</span>}
            </Label>
            <Input
              id={field.key}
              type="date"
              value={value}
              onChange={(e) => handleChange(field.key, e.target.value)}
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
        );

      default: // text
        return (
          <div key={field.key} className="space-y-2">
            <Label htmlFor={field.key}>
              {field.label}
              {field.required && <span className="text-red-600 ml-1">*</span>}
            </Label>
            <Input
              id={field.key}
              type="text"
              value={value}
              onChange={(e) => handleChange(field.key, e.target.value)}
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          {config.description && (
            <DialogDescription>{config.description}</DialogDescription>
          )}
        </DialogHeader>

        <div className="space-y-4 py-4">
          {config.fields.map((field) => renderField(field))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default EntityFormDialog;
