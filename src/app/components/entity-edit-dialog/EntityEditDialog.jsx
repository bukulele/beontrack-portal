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
import EntityForm from "./EntityForm";
import useEntityForm from "./useEntityForm";

/**
 * EntityEditDialog - Modal dialog for editing entity data
 *
 * @param {boolean} open - Dialog open state
 * @param {Function} onClose - Close handler
 * @param {string} entityType - Entity type (truck, driver, employee, etc.)
 * @param {Object} entityData - Current entity data
 * @param {Object} formConfig - Form configuration
 * @param {Function} onSuccess - Success callback
 */
export function EntityEditDialog({
  open,
  onClose,
  entityType,
  entityData,
  formConfig,
  onSuccess,
}) {
  const { form, handleSubmit, isLoading, error, sanitizedDefaults } = useEntityForm({
    entityType,
    entityData,
    formConfig,
    onSuccess,
    onClose,
  });

  const entityTypeLabel =
    entityType.charAt(0).toUpperCase() + entityType.slice(1);

  // Handle dialog close - reset form state when closing without saving
  const handleClose = () => {
    form.reset(sanitizedDefaults); // Reset form to sanitized data (null -> "")
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit {entityTypeLabel}</DialogTitle>
          <DialogDescription>
            Make changes to the {entityType} information below
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
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
