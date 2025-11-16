/**
 * Portal Documents Page (GENERIC)
 *
 * Works for any entity type (employees, clients, suppliers).
 * Shows all documents organized by sections using FileSectionAccordion.
 */

'use client';

import React, { useState } from 'react';
import { PortalProvider, usePortal } from '@/app/context/PortalContext';
import PortalHeader from '@/app/(portal)/portal/components/PortalHeader';
import PortalNav from '@/app/(portal)/portal/components/PortalNav';
import PortalFileSectionAccordion from '@/app/(portal)/portal/components/PortalFileSectionAccordion';
import PortalActivityHistoryModal from '@/app/(portal)/portal/components/PortalActivityHistoryModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { getPortalConfig } from '@/config/portal/portalConfigs';
import { Edit } from 'lucide-react';

// Helper component for modal items to avoid hooks in map
function ModalItemRow({ item, entityData, reloadEntityData, entityType }) {
  const [modalOpen, setModalOpen] = React.useState(false);
  const ModalComponent = item.modalComponent;
  const itemData = entityData[item.key];
  const hasData = Array.isArray(itemData) ? itemData.length > 0 : !!itemData;

  return (
    <div className="flex items-center gap-3 py-3 px-4 border-b border-slate-100 dark:border-slate-800">
      <div className="flex-1">
        <span className="text-sm font-medium">{item.label}</span>
        {!item.optional && !hasData && (
          <span className="ml-2 text-red-600 text-xs">Required</span>
        )}
      </div>
      <Button variant="outline" size="sm" onClick={() => setModalOpen(true)}>
        <Edit className="h-4 w-4 mr-2" />
        Edit
      </Button>
      {ModalComponent && (
        <ModalComponent
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          item={item}
          itemData={itemData}
          entityData={entityData}
          loadData={reloadEntityData}
          entityType={entityType}
          entityId={entityData.id}
        />
      )}
    </div>
  );
}

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
    title: 'Documents',
    subtitle: 'Upload required documents',
    items: portalConfig.applicationChecklist.items.filter(item => item.itemType === 'file'),
    defaultOpen: true,
    readOnly: !canEdit, // Respects allowApplicationEdit flag
  });

  // Onboarding documents - visible after offer_accepted, ALWAYS read-only for portal users
  if (['offer_accepted', 'trainee', 'active', 'vacation', 'on_leave', 'wcb'].includes(entityData.status)) {
    if (portalConfig.onboardingChecklist) {
      documentSections.push({
        title: 'Onboarding',
        subtitle: 'Managed by HR',
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
            {/* Activity History Section */}
            {portalConfig.documentTabItems && portalConfig.documentTabItems.length > 0 && (
              <Card>
                <CardContent className="p-0">
                  {portalConfig.documentTabItems.map((item) => (
                    <ModalItemRow
                      key={item.key}
                      item={item}
                      entityData={entityData}
                      reloadEntityData={reloadEntityData}
                      entityType={entityType}
                    />
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Help text */}
            <div className="text-sm text-muted-foreground bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
              <p>
                <strong>Solid red dots</strong> indicate required documents. <strong>Hollow red dots</strong> indicate optional documents.
                Upload all required documents to complete your application.
              </p>
            </div>

            {/* Document Sections */}
            {documentSections.map((section, index) => (
              <Card key={index}>
                <PortalFileSectionAccordion
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
  const { entityType } = React.use(params);

  return (
    <PortalProvider entityType={entityType}>
      <DocumentsPageContent entityType={entityType} />
    </PortalProvider>
  );
}
