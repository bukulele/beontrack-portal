/**
 * Universal Checklist Validation Service
 *
 * Entity-agnostic validation for checklist completion and status transitions
 * Works with any checklist configuration that follows the standard schema
 */

import { prisma } from '@/lib/prisma';

/**
 * Get required document types from checklist config
 * @param {Object} checklistConfig - Checklist configuration object
 * @returns {Array<string>} - Array of required document type keys
 */
function getRequiredDocumentTypes(checklistConfig) {
  return checklistConfig.items
    .filter(item => item.itemType === 'file' && !item.optional)
    .map(item => item.documentType);
}

/**
 * Universal checklist completion validator
 * Checks if all required documents are uploaded AND reviewed
 *
 * @param {string} entityId - Entity UUID
 * @param {string} entityType - Entity type (e.g., 'employees', 'trucks', 'drivers')
 * @param {Object} checklistConfig - Checklist configuration object
 * @returns {Promise<Object>} - { isComplete, missing, uploadedCount, reviewedCount, totalRequired, percentComplete }
 */
export async function validateChecklistCompletion(entityId, entityType, checklistConfig) {
  const requiredTypes = getRequiredDocumentTypes(checklistConfig);

  // If no required documents, checklist is automatically complete
  if (requiredTypes.length === 0) {
    return {
      isComplete: true,
      missing: [],
      uploadedCount: 0,
      reviewedCount: 0,
      totalRequired: 0,
      percentComplete: 100,
    };
  }

  // Fetch all documents for this entity
  const documents = await prisma.document.findMany({
    where: {
      entityType,
      entityId,
      documentType: {
        in: requiredTypes,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Group by document type, get latest version
  const latestDocs = {};
  for (const doc of documents) {
    if (!latestDocs[doc.documentType] || doc.version > latestDocs[doc.documentType].version) {
      latestDocs[doc.documentType] = doc;
    }
  }

  // Check which required documents are missing or not reviewed
  const missing = [];
  const uploadedCount = Object.keys(latestDocs).length;
  let reviewedCount = 0;

  for (const docType of requiredTypes) {
    const doc = latestDocs[docType];
    const item = checklistConfig.items.find(i => i.documentType === docType);

    if (!doc) {
      missing.push({
        documentType: docType,
        reason: 'not_uploaded',
        label: item?.label || docType,
      });
    } else if (!doc.wasReviewed) {
      missing.push({
        documentType: docType,
        reason: 'not_reviewed',
        label: item?.label || docType,
      });
    } else {
      reviewedCount++;
    }
  }

  const totalRequired = requiredTypes.length;
  const percentComplete = totalRequired > 0 ? Math.round((reviewedCount / totalRequired) * 100) : 100;

  return {
    isComplete: missing.length === 0,
    missing,
    uploadedCount,
    reviewedCount,
    totalRequired,
    percentComplete,
  };
}

/**
 * Validate status transition based on checklist gates
 * Entity-agnostic - works for any entity type with checklists
 *
 * @param {string} fromStatus - Current entity status
 * @param {string} toStatus - Desired new status
 * @param {string} entityId - Entity UUID
 * @param {string} entityType - Entity type (e.g., 'employees', 'trucks', 'drivers')
 * @param {Array<Object>} checklistConfigs - Array of checklist configs with completionAction.gates
 * @returns {Promise<Object>} - { allowed, reason, checklistResults }
 */
export async function validateStatusTransition(fromStatus, toStatus, entityId, entityType, checklistConfigs) {
  const transitionKey = `${fromStatus} → ${toStatus}`;
  const checklistResults = [];

  // Find all checklists that gate this transition
  for (const checklistConfig of checklistConfigs) {
    if (!checklistConfig.completionAction?.gates) {
      continue;
    }

    // Check if this checklist gates the transition
    const gatesThisTransition = checklistConfig.completionAction.gates.includes(transitionKey);

    if (gatesThisTransition) {
      // Validate this checklist
      const result = await validateChecklistCompletion(entityId, entityType, checklistConfig);
      checklistResults.push({
        checklistName: checklistConfig.completionAction.checklistName || 'Unknown Checklist',
        ...result,
      });

      if (!result.isComplete) {
        return {
          allowed: false,
          reason: `${checklistConfig.completionAction.checklistName || 'Checklist'} must be 100% complete (all required documents uploaded and reviewed)`,
          checklistResults,
        };
      }
    }
  }

  // All gating checklists passed (or no checklists gate this transition)
  return {
    allowed: true,
    reason: null,
    checklistResults,
  };
}

/**
 * Get checklist completion status for UI display
 * Useful for showing progress indicators on cards
 *
 * @param {string} entityId - Entity UUID
 * @param {string} entityType - Entity type
 * @param {Object} checklistConfig - Checklist configuration
 * @returns {Promise<Object>} - Completion status object
 */
export async function getChecklistStatus(entityId, entityType, checklistConfig) {
  return await validateChecklistCompletion(entityId, entityType, checklistConfig);
}
