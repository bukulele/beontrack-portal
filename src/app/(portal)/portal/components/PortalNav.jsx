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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { usePortal } from '@/app/context/PortalContext';
import { getValidationSummary } from '@/lib/portal/validation';
import { getPortalConfig } from '@/config/portal/portalConfigs';
import SignatureComponent from '@/app/components/signature/SignatureComponent';
import Image from 'next/image';

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
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [signatureComplete, setSignatureComplete] = useState(false);

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

  // Check if consent documents are required and if signature exists
  const requiresSignature = portalConfig.consentDocuments?.some(doc =>
    doc.required && doc.appliesToStatuses.includes(currentStatus)
  );
  const hasSignature = entityData.signature && entityData.signatureDate;

  // Can submit only if validation passes, has signature (if required), and status is 'new'
  const canSubmit = validation.isValid &&
    (!requiresSignature || hasSignature || signatureComplete) &&
    currentStatus === 'new' &&
    canEdit;

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

  // Handle signature complete
  const handleSignatureComplete = (data) => {
    setSignatureComplete(true);
    setShowConsentModal(false);
    // Optionally show a success message
    alert('Signature saved successfully! You can now submit your application.');
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

  // Get the first required consent document for current status
  const consentDocument = portalConfig.consentDocuments?.find(doc =>
    doc.required && doc.appliesToStatuses.includes(currentStatus)
  );

  const consentContent = consentDocument?.content?.(currentData);

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

                {/* Sign Document button (only for new applications that require signature) */}
                {currentStatus === 'new' && requiresSignature && !hasSignature && !signatureComplete && (
                  <Button
                    variant="outline"
                    onClick={() => setShowConsentModal(true)}
                  >
                    Sign Document
                  </Button>
                )}

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

      {/* Consent Document Modal */}
      <Dialog open={showConsentModal} onOpenChange={setShowConsentModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {consentContent && (
            <>
              <DialogHeader>
                {consentContent.header?.showLogo && (
                  <div className="flex justify-center mb-4">
                    <Image
                      src="/logo.png"
                      alt="Company Logo"
                      width={280}
                      height={65}
                    />
                  </div>
                )}
                <DialogTitle className="text-center text-2xl">
                  {consentContent.header?.title || consentDocument?.title}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                {/* Render consent document content */}
                {consentContent.body?.map((section, index) => {
                  if (section.type === 'applicantInfo') {
                    return (
                      <div key={index} className="space-y-1">
                        {section.fields.map((field, fieldIndex) => (
                          <p key={fieldIndex} className="text-sm">
                            <span className="font-semibold">{field.label}:</span> {field.value}
                          </p>
                        ))}
                      </div>
                    );
                  }

                  if (section.type === 'paragraph') {
                    return (
                      <p key={index} className="text-sm leading-relaxed">
                        {section.text}
                      </p>
                    );
                  }

                  return null;
                })}

                {/* Signature Component */}
                <div className="mt-6 border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Sign Below</h3>
                  <SignatureComponent
                    entityId={entityData.id}
                    entityType={entityType}
                    onSignatureComplete={handleSignatureComplete}
                    onCancel={() => setShowConsentModal(false)}
                  />
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
