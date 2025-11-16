/**
 * Portal Application Page (GENERIC)
 *
 * Works for any entity type (employees, clients, suppliers).
 * Loads the appropriate portal config based on entityType.
 * Shows: Personal Info Form + Documents Checklist
 */

'use client';

import React from 'react';
import { PortalProvider, usePortal } from '@/app/context/PortalContext';
import PortalHeader from '@/app/(portal)/portal/components/PortalHeader';
import PortalNav from '@/app/(portal)/portal/components/PortalNav';
import PortalChecklistTab from '@/app/(portal)/portal/components/PortalChecklistTab';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import CompactDataRow from '@/app/components/tabs/checklist/CompactDataRow';
import { getPortalConfig } from '@/config/portal/portalConfigs';

function ApplicationPageContent({ entityType }) {
  const { entityData, loading, error, reloadEntityData, canEdit } = usePortal();

  // Load portal config for this entity type
  const portalConfig = getPortalConfig(entityType);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your application...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!entityData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertDescription>Unable to load your application data.</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!portalConfig) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertDescription>
            Portal not configured for entity type: {entityType}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Get status message from portal config
  const statusMessage = portalConfig.statusMessages?.[entityData.status] ||
    'Your application is in progress.';

  return (
    <div className="min-h-screen bg-background">
      <PortalHeader />
      <PortalNav />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Status Message */}
        <Alert className="mb-6">
          <AlertDescription>{statusMessage}</AlertDescription>
        </Alert>

        {!canEdit && (
          <Alert className="mb-6">
            <AlertDescription>
              Your application is currently locked. Contact support if you need to make changes.
            </AlertDescription>
          </Alert>
        )}

        {/* Personal Information Form */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {portalConfig.personalInfoFields.map(field => (
              <CompactDataRow
                key={field.key}
                item={{
                  key: field.key,
                  label: field.label,
                  type: field.type,
                  optional: !field.required,
                  placeholder: field.placeholder,
                  selectOptions: field.options,
                  readOnly: field.readOnly, // Pass readOnly flag
                }}
                entityData={entityData}
                loadData={reloadEntityData}
                entityType={entityType}
                entityId={entityData.id}
              />
            ))}
          </CardContent>
        </Card>

        {/* Activity History Only (Documents moved to separate tab) */}
        <PortalChecklistTab
          config={portalConfig.applicationChecklist}
          entityData={entityData}
          loadData={reloadEntityData}
          entityType={entityType}
          entityId={entityData.id}
          readOnly={!canEdit}
          hideFiles={true}
        />

        {/* Submit button for new applications */}
        {entityData.status === 'new' && canEdit && (
          <div className="mt-6 flex justify-end">
            <SubmitApplicationButton
              entityType={entityType}
              entityId={entityData.id}
              onSuccess={reloadEntityData}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function SubmitApplicationButton({ entityType, entityId, onSuccess }) {
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async () => {
    if (!confirm('Submit your application for review? You will not be able to edit it after submission.')) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/v1/${entityType}/${entityId}`, {
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

      alert('Application submitted successfully! We will review it and get back to you soon.');
      onSuccess?.();
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      size="lg"
      onClick={handleSubmit}
      disabled={loading}
    >
      {loading ? 'Submitting...' : 'Submit Application'}
    </Button>
  );
}

export default function ApplicationPage({ params }) {
  const { entityType } = React.use(params);

  return (
    <PortalProvider entityType={entityType}>
      <ApplicationPageContent entityType={entityType} />
    </PortalProvider>
  );
}
