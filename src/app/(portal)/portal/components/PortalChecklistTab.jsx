/**
 * Portal Checklist Tab
 *
 * Simplified version of ChecklistTab for applicant portal.
 * Reuses CompactFileRow and CompactDataRow but removes HR-only features:
 * - No review checkboxes
 * - No status change buttons
 * - No completion actions
 *
 * Just file upload/delete and data entry for applicants.
 */

'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CompactFileRow from '@/app/components/tabs/checklist/CompactFileRow';
import CompactDataRow from '@/app/components/tabs/checklist/CompactDataRow';
import CompactModalRow from '@/app/components/tabs/checklist/CompactModalRow';
import { usePortal } from '@/app/context/PortalContext';

export default function PortalChecklistTab({
  config,
  entityData,
  loadData,
  entityType,
  entityId,
  readOnly = false,
  hideFiles = false, // New prop to hide Documents card
}) {
  const { updateField, getFieldValue } = usePortal();
  if (!config || !entityData) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No checklist configuration found
      </div>
    );
  }

  // Filter items that should be displayed
  const visibleItems = config.items.filter(item => {
    if (item.shouldDisplay) {
      return item.shouldDisplay(entityData);
    }
    return true;
  });

  // Separate items by type
  const dataItems = visibleItems.filter(item => item.itemType === 'data' || item.itemType === 'modal');
  const fileItems = visibleItems.filter(item => item.itemType === 'file');

  return (
    <div className="space-y-6">
      {/* Data fields card (if any) */}
      {dataItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">General Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {dataItems.map(item => {
              if (item.itemType === 'modal') {
                return (
                  <CompactModalRow
                    key={item.key}
                    item={item}
                    entityData={entityData}
                    loadData={loadData}
                    entityType={entityType}
                    entityId={entityId}
                  />
                );
              }

              return (
                <CompactDataRow
                  key={item.key}
                  item={item}
                  onFieldChange={updateField}
                  value={getFieldValue(item.key)}
                />
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Documents card */}
      {!hideFiles && fileItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Documents</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {fileItems.map(item => (
              <CompactFileRow
                key={item.key}
                item={{
                  ...item,
                  // Remove review functionality for portal
                  actions: {
                    ...item.actions,
                    checkable: false, // Hide review checkboxes
                  },
                }}
                entityData={entityData}
                loadData={loadData}
                entityType={entityType}
                entityId={entityId}
              />
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
