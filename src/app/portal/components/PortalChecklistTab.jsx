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
import ChecklistProgress from '@/app/components/tabs/checklist/ChecklistProgress';

export default function PortalChecklistTab({
  config,
  entityData,
  loadData,
  entityType,
  entityId,
  readOnly = false,
}) {
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

  // Calculate progress (only for file items with checkable=true)
  const checkableFileItems = fileItems.filter(item => item.actions?.checkable !== false);
  const checkedCount = checkableFileItems.filter(item => {
    const itemData = entityData[item.key];
    if (Array.isArray(itemData)) {
      return itemData.some(doc => doc.wasReviewed);
    }
    return itemData?.wasReviewed;
  }).length;

  const showProgress = config.showProgress !== false && checkableFileItems.length > 0;

  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      {showProgress && (
        <ChecklistProgress
          checked={checkedCount}
          total={checkableFileItems.length}
          allChecked={checkedCount === checkableFileItems.length}
        />
      )}

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
                  entityData={entityData}
                  loadData={loadData}
                  entityType={entityType}
                  entityId={entityId}
                />
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Documents card */}
      {fileItems.length > 0 && (
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

      {/* Help text */}
      <div className="text-sm text-muted-foreground">
        <p>
          <strong>Required documents</strong> are marked with a red dot.
          Upload all required documents to complete your application.
        </p>
      </div>
    </div>
  );
}
