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
import PortalHeader from '@/app/portal/components/PortalHeader';
import PortalNav from '@/app/portal/components/PortalNav';
import PortalChecklistTab from '@/app/portal/components/PortalChecklistTab';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import CompactDataRow from '@/app/components/tabs/checklist/CompactDataRow';
import { getPortalConfig } from '@/config/portal/portalConfigs';
import { CheckCircle2, Clock, AlertCircle, FileText, User } from 'lucide-react';

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

  // Calculate progress
  const personalInfoFields = portalConfig.personalInfoFields;
  const filledFields = personalInfoFields.filter(field => {
    const value = entityData[field.key];
    return value !== null && value !== undefined && value !== '';
  }).length;
  const personalInfoProgress = personalInfoFields.length > 0
    ? Math.round((filledFields / personalInfoFields.length) * 100)
    : 0;

  // Calculate document progress
  const documentItems = portalConfig.applicationChecklist.items.filter(item => item.itemType === 'file');
  const uploadedDocs = documentItems.filter(item => {
    const docs = entityData.documents?.filter(doc => doc.documentType === item.documentType && !doc.isDeleted) || [];
    return docs.length > 0;
  }).length;
  const documentProgress = documentItems.length > 0
    ? Math.round((uploadedDocs / documentItems.length) * 100)
    : 0;

  // Overall progress (average of both)
  const overallProgress = Math.round((personalInfoProgress + documentProgress) / 2);

  // Get status message from portal config
  const statusMessage = portalConfig.statusMessages?.[entityData.status] ||
    'Your application is in progress.';

  // Check if there are issues
  const hasIssues = entityData.status === 'application_on_hold' ||
                    entityData.status === 'rejected';

  return (
    <div className="min-h-screen bg-background">
      <PortalHeader />
      <PortalNav />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Status Overview Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                {hasIssues ? (
                  <AlertCircle className="h-5 w-5 text-destructive" />
                ) : entityData.status === 'new' ? (
                  <Clock className="h-5 w-5 text-blue-500" />
                ) : (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                )}
                Application Status
              </CardTitle>
              <Badge variant={hasIssues ? 'destructive' : 'default'}>
                {entityData.status?.replace(/_/g, ' ').toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant={hasIssues ? 'destructive' : 'default'}>
              <AlertDescription>{statusMessage}</AlertDescription>
            </Alert>

            {/* Progress indicators - only show for active applications */}
            {!hasIssues && ['new', 'under_review', 'application_on_hold'].includes(entityData.status) && (
              <div className="space-y-4 pt-2">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Personal Information
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {filledFields} of {personalInfoFields.length} fields
                    </span>
                  </div>
                  <Progress value={personalInfoProgress} className="h-2" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Documents
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {uploadedDocs} of {documentItems.length} uploaded
                    </span>
                  </div>
                  <Progress value={documentProgress} className="h-2" />
                </div>

                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold">Overall Progress</span>
                    <span className="text-sm font-semibold">{overallProgress}%</span>
                  </div>
                  <Progress value={overallProgress} className="h-2" />
                </div>
              </div>
            )}

            {/* Application details */}
            <div className="pt-2 border-t space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Application ID:</span>
                <span className="font-medium">{entityData.employeeId || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Submitted:</span>
                <span className="font-medium">
                  {entityData.createdAt ? new Date(entityData.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Updated:</span>
                <span className="font-medium">
                  {entityData.updatedAt ? new Date(entityData.updatedAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

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
                }}
                entityData={entityData}
                loadData={reloadEntityData}
                entityType={entityType}
                entityId={entityData.id}
              />
            ))}
          </CardContent>
        </Card>

        {/* Documents & Activity History Checklist */}
        <PortalChecklistTab
          config={portalConfig.applicationChecklist}
          entityData={entityData}
          loadData={reloadEntityData}
          entityType={entityType}
          entityId={entityData.id}
          readOnly={!canEdit}
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
  const { entityType } = params;

  return (
    <PortalProvider entityType={entityType}>
      <ApplicationPageContent entityType={entityType} />
    </PortalProvider>
  );
}
