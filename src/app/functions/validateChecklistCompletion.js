import findHighestIdObject from "./findHighestIdObject";

/**
 * Validates if a checklist is complete based on config and entity data
 *
 * Extracted from ChecklistTab validation logic to be reusable across the app.
 * Used to gate status transitions based on checklist completion.
 *
 * @param {Object} config - Checklist configuration
 * @param {Object} entityData - Entity data with document fields
 * @returns {Object} { isComplete: boolean, missingItems: Array, progress: Object }
 */
export function validateChecklistCompletion(config, entityData) {
  if (!entityData || !config?.items) {
    return {
      isComplete: false,
      missingItems: [],
      progress: { checked: 0, total: 0 }
    };
  }

  let checkedCount = 0;
  let totalCount = 0;
  const missing = [];

  config.items.forEach((item) => {
    // Skip items that should not be displayed
    if (item.shouldDisplay && !item.shouldDisplay(entityData)) return;

    // Skip optional items for "all checked" calculation
    if (item.optional) return;

    totalCount++;
    const itemData = entityData[item.key];

    // Handle data fields differently from files/modal items
    if (item.itemType === 'data') {
      // For data fields: just check if value exists and is non-empty
      const isEmpty = itemData === null ||
                     itemData === undefined ||
                     itemData === '' ||
                     (Array.isArray(itemData) && itemData.length === 0);

      if (!isEmpty) {
        checkedCount++;
      } else {
        missing.push({ label: item.label, reason: 'not filled' });
      }
    }
    // Handle modal items with custom validation
    else if (item.itemType === 'modal' && item.validate) {
      if (item.validate(itemData)) {
        checkedCount++;
      } else {
        missing.push({ label: item.label, reason: 'validation failed' });
      }
    }
    // Handle file items - check wasReviewed property
    else {
      if (Array.isArray(itemData) && itemData.length > 0) {
        const latest = findHighestIdObject(itemData);
        if (latest.wasReviewed) {
          checkedCount++;
        } else {
          // File uploaded but not reviewed
          missing.push({ label: item.label, reason: 'not reviewed' });
        }
      } else if (itemData && typeof itemData === 'object' && itemData.wasReviewed) {
        checkedCount++;
      } else if (itemData && typeof itemData === 'object' && !itemData.wasReviewed) {
        // Data exists but not reviewed
        missing.push({ label: item.label, reason: 'not reviewed' });
      } else {
        // No data uploaded
        missing.push({ label: item.label, reason: 'not uploaded' });
      }
    }
  });

  const isComplete = checkedCount === totalCount && totalCount > 0;

  return {
    isComplete,
    missingItems: missing,
    progress: { checked: checkedCount, total: totalCount }
  };
}

/**
 * Gets all checklists that gate a specific status transition
 *
 * @param {string} statusFrom - Source status code
 * @param {string} statusTo - Target status code
 * @param {Array} checklistConfigs - Array of checklist config objects
 * @returns {Array} Array of checklist configs that gate this transition
 */
export function getGatingChecklists(statusFrom, statusTo, checklistConfigs) {
  if (!checklistConfigs || !Array.isArray(checklistConfigs)) {
    return [];
  }

  const transition = `${statusFrom} → ${statusTo}`;

  return checklistConfigs.filter(config => {
    return config.completionAction?.gates?.includes(transition);
  });
}

/**
 * Validates if a status transition is allowed based on checklist completion
 *
 * Main validation function used by StatusBadge to determine if a status change
 * should be allowed based on checklist gates defined in checklist configs.
 *
 * @param {string} statusFrom - Source status code
 * @param {string} statusTo - Target status code
 * @param {Object} entityData - Entity data with all fields
 * @param {Array} checklistConfigs - Array of checklist configs to check
 * @returns {Object} { allowed: boolean, blockingChecklists: Array }
 */
export function validateStatusTransition(statusFrom, statusTo, entityData, checklistConfigs) {
  const gatingChecklists = getGatingChecklists(statusFrom, statusTo, checklistConfigs);

  // No checklists gate this transition - allow it
  if (gatingChecklists.length === 0) {
    return { allowed: true, blockingChecklists: [] };
  }

  const blockingChecklists = [];

  // Check each gating checklist for completion
  for (const config of gatingChecklists) {
    const validation = validateChecklistCompletion(config, entityData);

    if (!validation.isComplete) {
      blockingChecklists.push({
        name: config.completionAction.checklistName,
        missingItems: validation.missingItems,
        progress: validation.progress
      });
    }
  }

  return {
    allowed: blockingChecklists.length === 0,
    blockingChecklists
  };
}
