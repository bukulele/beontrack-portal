/**
 * Portal Documents Page (GENERIC)
 *
 * Works for any entity type (employees, clients, suppliers).
 * Shows all documents organized by sections using FileSectionAccordion.
 */

'use client';

import React from 'react';
import { PortalProvider, usePortal } from '@/app/context/PortalContext';
import PortalHeader from '@/app/portal/components/PortalHeader';
import PortalNav from '@/app/portal/components/PortalNav';
import FileSectionAccordion from '@/app/components/tabs/general-info/FileSectionAccordion';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getPortalConfig } from '@/config/portal/portalConfigs';

function DocumentsPageContent({ entityType }) {
  const { entityData, loading, error, reloadEntityData, canEdit } = usePortal();

  // Load portal config for this entity type
  const portalConfig = getPortalConfig(entityType);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading documents...</p>
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
          <AlertDescription>Unable to load your data.</AlertDescription>
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

  // Group documents by section
  // ALWAYS show all document sections, control editability via readOnly prop
  const documentSections = [];

  // Application documents - ALWAYS visible, editable based on canEdit (allowApplicationEdit flag)
  documentSections.push({
    title: 'Application Documents',
    subtitle: 'Documents for application review',
    items: portalConfig.applicationChecklist.items.filter(item => item.itemType === 'file'),
    defaultOpen: true,
    readOnly: !canEdit, // Respects allowApplicationEdit flag
  });

  // Onboarding documents - visible after offer_accepted, ALWAYS read-only for portal users
  if (['offer_accepted', 'trainee', 'active', 'vacation', 'on_leave', 'wcb'].includes(entityData.status)) {
    if (portalConfig.onboardingChecklist) {
      documentSections.push({
        title: 'Onboarding Documents',
        subtitle: 'Documents for onboarding (managed by HR)',
        items: portalConfig.onboardingChecklist.items.filter(item => item.itemType === 'file'),
        defaultOpen: false,
        readOnly: true, // ALWAYS read-only for portal users
      });
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <PortalHeader />
      <PortalNav />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">My Documents</h1>

        {!canEdit && (
          <Alert className="mb-6">
            <AlertDescription>
              Your application is locked. Contact support if you need to make changes.
            </AlertDescription>
          </Alert>
        )}

        {documentSections.length === 0 ? (
          <Alert>
            <AlertDescription>
              No documents to display at this time.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4">
            {documentSections.map((section, index) => (
              <Card key={index}>
                <FileSectionAccordion
                  section={section}
                  readOnly={section.readOnly} // Use section-specific readOnly flag
                  entityData={entityData}
                  loadData={reloadEntityData}
                  entityType={entityType}
                  entityId={entityData.id}
                />
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function DocumentsPage({ params }) {
  const { entityType } = params;

  return (
    <PortalProvider entityType={entityType}>
      <DocumentsPageContent entityType={entityType} />
    </PortalProvider>
  );
}
