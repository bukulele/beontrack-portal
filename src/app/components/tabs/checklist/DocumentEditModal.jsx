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
import { DatePicker } from "@/components/ui/date-picker";
import { useLoader } from "@/app/context/LoaderContext";
import { getMetadataFields } from "@/config/prisma/documentMetadataSchemas";
import { parse, format, isValid } from "date-fns";

/**
 * DocumentEditModal - Modal for editing document metadata
 *
 * Allows editing of document metadata fields (issue date, expiry date, etc.)
 * without re-uploading the file.
 *
 * @param {boolean} open - Modal open state
 * @param {Function} onClose - Close modal callback
 * @param {Object} file - Document record to edit
 * @param {string} entityType - Entity type
 * @param {string} entityId - Entity ID
 * @param {Function} loadData - Reload entity data callback
 */
export function DocumentEditModal({
  open,
  onClose,
  file,
  entityType,
  entityId,
  loadData,
}) {
  const [formData, setFormData] = useState({});
  const { startLoading, stopLoading } = useLoader();

  // Get field configuration for this document type
  const fields = file?.documentType
    ? getMetadataFields(file.documentType, entityType)
    : [];

  // Initialize form data when file changes or modal opens
  useEffect(() => {
    if (open && file) {
      const initialData = {};
      fields.forEach((field) => {
        initialData[field.name] = file.metadata?.[field.name] || "";
      });
      setFormData(initialData);
    }
  }, [open, file]);

  // Handle field change
  const handleChange = (fieldName, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  // Handle save
  const handleSave = async () => {
    try {
      startLoading();

      const response = await fetch(
        `/api/v1/${entityType}/${entityId}/documents/${file.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            metadata: formData,
          }),
        }
      );

      if (response.ok) {
        await loadData();
        onClose();
      } else {
        stopLoading();
        const errorData = await response.json().catch(() => ({}));
        console.error("Failed to update document:", errorData);
        alert(`Failed to update document: ${errorData.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error updating document:", error);
      stopLoading();
      alert("Error updating document. Please try again.");
    }
  };

  // Render form field based on type
  const renderField = (field) => {
    const value = formData[field.name] || "";

    switch (field.type) {
      case "text":
      case "email":
      case "tel":
        return (
          <Input
            id={field.name}
            type={field.type}
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder={field.label}
          />
        );

      case "date":
        return (
          <DatePicker
            value={value ? parse(value, "yyyy-MM-dd", new Date()) : undefined}
            onChange={(date) => handleChange(field.name, date && isValid(date) ? format(date, "yyyy-MM-dd") : "")}
          />
        );

      case "textarea":
        return (
          <Textarea
            id={field.name}
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder={field.label}
            rows={3}
          />
        );

      case "select":
        return (
          <Select
            value={value}
            onValueChange={(val) => handleChange(field.name, val)}
          >
            <SelectTrigger>
              <SelectValue placeholder={`Select ${field.label}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      default:
        return (
          <Input
            id={field.name}
            type="text"
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder={field.label}
          />
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Document Metadata</DialogTitle>
          <DialogDescription>
            Update the metadata fields for this document. The file itself will not be changed.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {fields.map((field) => (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={field.name}>
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
              {renderField(field)}
            </div>
          ))}

          {fields.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No editable metadata fields for this document type
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={fields.length === 0}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DocumentEditModal;
