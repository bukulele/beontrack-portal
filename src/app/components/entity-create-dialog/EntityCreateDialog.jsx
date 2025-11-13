"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle } from "lucide-react";
import EntityForm from "../entity-edit-dialog/EntityForm";
import useEntityCreateForm from "./useEntityCreateForm";

/**
 * EntityCreateDialog - Modal dialog for creating new entities
 *
 * Universal component that works with any entity type
 * Uses configuration-driven approach for form fields
 *
 * @param {boolean} open - Dialog open state
 * @param {Function} onClose - Close handler
 * @param {string} entityType - Entity type (employees, trucks, drivers, etc.)
 * @param {Object} formConfig - Form configuration
 * @param {Function} onSuccess - Success callback (called after entity is created)
 */
export function EntityCreateDialog({
  open,
  onClose,
  entityType,
  formConfig,
  onSuccess,
}) {
  const { form, handleSubmit, isLoading, error } = useEntityCreateForm({
    entityType,
    formConfig,
    onSuccess,
    onClose,
  });

  // Capitalize entity type for display
  const entityTypeLabel =
    entityType.charAt(0).toUpperCase() + entityType.slice(1, -1); // Remove 's' from plural

  // Handle dialog close - reset form state when closing without saving
  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Create New {entityTypeLabel}</DialogTitle>
          <DialogDescription>
            Enter the information for the new {entityTypeLabel.toLowerCase()} below
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex-1 overflow-y-auto pr-2">
          <EntityForm form={form} formConfig={formConfig} />
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create {entityTypeLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
