"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Loader2, AlertCircle } from "lucide-react";
import EntityForm from "../entity-edit-dialog/EntityForm";
import useEntityCreateForm from "./useEntityCreateForm";
import { usePermissions } from "@/lib/permissions/hooks";

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
  // Permission check
  const permissions = usePermissions(entityType);

  // Quick Account mode state (only if config supports it)
  const hasQuickMode = formConfig?.quickMode?.enabled;
  const [isQuickMode, setIsQuickMode] = useState(hasQuickMode);

  // Filter form config based on mode
  const getActiveConfig = () => {
    if (!hasQuickMode || !isQuickMode) {
      return formConfig; // Complete mode or no quick mode support
    }

    // Quick mode: Filter fields and adjust validation
    const { fields: quickFields, requiredFields } = formConfig.quickMode;
    return {
      ...formConfig,
      fields: formConfig.fields
        .filter(field => quickFields.includes(field.key))
        .map(field => ({
          ...field,
          required: requiredFields.includes(field.key),
        }))
    };
  };

  const activeConfig = getActiveConfig();

  const { form, handleSubmit, isLoading, error } = useEntityCreateForm({
    entityType,
    formConfig: activeConfig,
    onSuccess,
    onClose,
    isQuickMode: hasQuickMode && isQuickMode,
  });

  // Capitalize entity type for display
  const entityTypeLabel =
    entityType.charAt(0).toUpperCase() + entityType.slice(1, -1); // Remove 's' from plural

  // Handle dialog close - reset form state when closing without saving
  const handleClose = () => {
    form.reset();
    onClose();
  };

  // Check if user has permission to create
  if (!permissions.canCreate && !permissions.isSuperuser) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Permission Denied</DialogTitle>
            <DialogDescription>
              You do not have permission to create {entityTypeLabel.toLowerCase()} entities.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 pt-4">
            <Button onClick={handleClose}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

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
          <EntityForm form={form} formConfig={activeConfig} />
        </div>

        <div className="flex justify-between items-center gap-4 pt-4 border-t">
          {hasQuickMode && (
            <div className="flex items-center gap-2">
              <Switch
                id="quick-mode"
                checked={isQuickMode}
                onCheckedChange={setIsQuickMode}
                disabled={isLoading}
              />
              <Label htmlFor="quick-mode" className="cursor-pointer">
                {isQuickMode ? 'Quick Account' : 'Complete Form'}
              </Label>
            </div>
          )}

          <div className="flex gap-2 ml-auto">
            <Button variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create {entityTypeLabel}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
