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
import ProfilePhotoDisplay from '@/app/components/tabs/general-info/ProfilePhotoDisplay';

function ApplicationPageContent({ entityType }) {
  const { entityData, loading, error, reloadEntityData, canEdit, updateField, getFieldValue } = usePortal();

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
      <div className="min-h-screen bg-background">
        <PortalHeader />
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <div className="mt-4">
            <Button onClick={reloadEntityData} variant="outline">
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!entityData) {
    return (
      <div className="min-h-screen bg-background">
        <PortalHeader />
        <div className="container mx-auto px-4 py-8">
          <Alert>
            <AlertDescription>Unable to load your application data.</AlertDescription>
          </Alert>
          <div className="mt-4">
            <Button onClick={reloadEntityData} variant="outline">
              Retry
            </Button>
          </div>
        </div>
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

        {/* Profile Photo */}
        {portalConfig.image && (
          <div className="mb-6 flex justify-center">
            <ProfilePhotoDisplay
              entityData={entityData}
              entityType={entityType}
              entityId={entityData.id}
              onReload={reloadEntityData}
              width={portalConfig.image.width}
              height={portalConfig.image.height}
              photoSrc={portalConfig.image.src}
              placeholder={portalConfig.image.placeholder}
              uploadEndpoint={portalConfig.image.uploadEndpoint(entityData.id)}
              updateEndpoint={portalConfig.image.updateEndpoint(entityData.id)}
              photoFieldName={portalConfig.image.photoFieldName}
              documentType={portalConfig.image.documentType}
            />
          </div>
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
                  readOnly: field.readOnly,
                  dateRange: field.dateRange,
                }}
                onFieldChange={updateField}
                value={getFieldValue(field.key)}
              />
            ))}
          </CardContent>
        </Card>

        {/* Data fields only (Documents and Activity History moved to separate tabs) */}
        <PortalChecklistTab
          config={portalConfig.applicationChecklist}
          entityData={entityData}
          loadData={reloadEntityData}
          entityType={entityType}
          entityId={entityData.id}
          readOnly={!canEdit}
          hideFiles={true}
          hideModals={true}
        />
      </div>
    </div>
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
