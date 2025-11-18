/**
 * Portal Navigation
 *
 * Configuration-driven navigation tabs for the portal.
 * Shows different tabs based on applicant's current status.
 * Includes Save/Submit buttons on the right.
 */

'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { usePortal } from '@/app/context/PortalContext';
import { getValidationSummary } from '@/lib/portal/validation';
import { getPortalConfig } from '@/config/portal/portalConfigs';

export default function PortalNav() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    portalConfig,
    entityData,
    entityType,
    loading,
    hasUnsavedChanges,
    saveChanges,
    resetChanges,
    canEdit,
    formChanges,
  } = usePortal();

  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);

  if (loading || !portalConfig || !entityData) {
    return null;
  }

  const currentStatus = entityData.status;

  // Merge entityData with formChanges for validation
  const currentData = { ...entityData, ...formChanges };

  // Filter navigation items based on current status
  const visibleNavItems = portalConfig.navigationItems?.filter(item => {
    if (item.statuses.includes('all')) return true;
    return item.statuses.includes(currentStatus);
  }) || [];

  if (visibleNavItems.length === 0) {
    return null;
  }

  // Determine active tab from current pathname
  const activeTab = visibleNavItems.find(item =>
    pathname.startsWith(item.route)
  )?.key || visibleNavItems[0]?.key;

  const handleTabChange = (tabKey) => {
    const navItem = visibleNavItems.find(item => item.key === tabKey);
    if (navItem) {
      router.push(navItem.route);
    }
  };

  // Validate application completeness (using current data including unsaved changes)
  const validation = getValidationSummary(currentData, portalConfig);
  const canSubmit = validation.isValid && currentStatus === 'new' && canEdit;

  // Handle save progress
  const handleSave = async () => {
    if (!hasUnsavedChanges) return;

    try {
      setSaving(true);
      await saveChanges();
      setShowSaveDialog(true);
    } catch (error) {
      alert(`Error saving changes: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  // Handle submit application
  const handleSubmit = async () => {
    if (!canSubmit) return;

    if (!confirm('Submit your application for review? You will not be able to edit it after submission.')) {
      return;
    }

    try {
      setSubmitting(true);

      // Auto-save any unsaved changes first
      if (hasUnsavedChanges) {
        await saveChanges();
      }

      // Submit application (change status and lock editing)
      const response = await fetch(`/api/portal/${entityType}/me`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'under_review',
          allowApplicationEdit: false,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit application');
      }

      setShowSubmitDialog(true);

      // Reload to reflect new status
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      alert(`Error submitting application: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  // Show buttons only when user can edit
  const showButtons = canEdit;

  return (
    <>
      <div className="border-b bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Navigation tabs */}
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="h-12">
                {visibleNavItems.map(item => (
                  <TabsTrigger
                    key={item.key}
                    value={item.key}
                    className="px-6"
                  >
                    {item.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            {/* Action buttons */}
            {showButtons && (
              <div className="flex items-center gap-3 py-2">
                {/* Validation message when submit is disabled */}
                {currentStatus === 'new' && !validation.isValid && (
                  <p className="text-sm text-muted-foreground">
                    {validation.missingCount} items remaining
                  </p>
                )}

                {/* Save Progress button */}
                <Button
                  variant="outline"
                  onClick={handleSave}
                  disabled={!hasUnsavedChanges || saving}
                >
                  {saving ? 'Saving...' : 'Save Progress'}
                </Button>

                {/* Submit Application button (only for new applications) */}
                {currentStatus === 'new' && (
                  <Button
                    onClick={handleSubmit}
                    disabled={!canSubmit || submitting}
                  >
                    {submitting ? 'Submitting...' : 'Submit Application'}
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Save success dialog */}
      <AlertDialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Changes Saved</AlertDialogTitle>
            <AlertDialogDescription>
              Your changes have been saved successfully.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Submit success dialog */}
      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Application Submitted</AlertDialogTitle>
            <AlertDialogDescription>
              Your application has been submitted successfully! We will review it and get back to you soon.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
