/**
 * Portal Validation Utilities
 *
 * Functions to validate portal application completion
 * Checks both required fields and required documents
 */

/**
 * Validate all required data fields
 * @param {Object} entityData - Current entity data
 * @param {Object} portalConfig - Portal configuration
 * @returns {Array} Array of missing field labels
 */
export function validateRequiredFields(entityData, portalConfig) {
  const missingFields = [];

  // Check personal info fields
  if (portalConfig.personalInfoFields) {
    portalConfig.personalInfoFields.forEach(field => {
      if (field.required && !field.readOnly) {
        const value = entityData[field.key];
        // Check for null, undefined, empty string, or whitespace-only string
        const isEmpty = value === null ||
                       value === undefined ||
                       (typeof value === 'string' && value.trim() === '');
        if (isEmpty) {
          missingFields.push(field.label);
        }
      }
    });
  }

  // Check checklist data fields
  if (portalConfig.applicationChecklist?.items) {
    portalConfig.applicationChecklist.items.forEach(item => {
      if (item.itemType === 'data' && !item.optional && item.dataField) {
        const value = entityData[item.key];
        // Check for null, undefined, empty string, or whitespace-only string
        const isEmpty = value === null ||
                       value === undefined ||
                       (typeof value === 'string' && value.trim() === '');
        if (isEmpty) {
          missingFields.push(item.label);
        }
      }
    });
  }

  // Check document tab items (like Activity History)
  if (portalConfig.documentTabItems) {
    portalConfig.documentTabItems.forEach(item => {
      if (!item.optional && item.itemType === 'modal') {
        const value = entityData[item.key];
        // For modal items, check if data exists and is non-empty array
        if (!value || (Array.isArray(value) && value.length === 0)) {
          missingFields.push(item.label);
        }
      }
    });
  }

  return missingFields;
}

/**
 * Validate all required documents
 * @param {Object} entityData - Current entity data
 * @param {Object} portalConfig - Portal configuration
 * @returns {Array} Array of missing document labels
 */
export function validateRequiredDocuments(entityData, portalConfig) {
  const missingDocuments = [];

  if (portalConfig.applicationChecklist?.items) {
    portalConfig.applicationChecklist.items.forEach(item => {
      // Check file items that are required
      if (item.itemType === 'file' && !item.optional) {
        const documentKey = item.documentType || item.key;
        const documents = entityData.documents || [];

        // Check if at least one document of this type exists
        const hasDocument = documents.some(
          doc => doc.documentType === documentKey
        );

        if (!hasDocument) {
          missingDocuments.push(item.label);
        }
      }
    });
  }

  return missingDocuments;
}

/**
 * Get complete validation summary
 * @param {Object} entityData - Current entity data
 * @param {Object} portalConfig - Portal configuration
 * @returns {Object} Validation result with details
 */
export function getValidationSummary(entityData, portalConfig) {
  const missingFields = validateRequiredFields(entityData, portalConfig);
  const missingDocuments = validateRequiredDocuments(entityData, portalConfig);

  const missingCount = missingFields.length + missingDocuments.length;
  const isValid = missingCount === 0;

  return {
    isValid,
    missingFields,
    missingDocuments,
    missingCount,
  };
}
