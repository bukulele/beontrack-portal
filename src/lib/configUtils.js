/**
 * Configuration Utilities
 *
 * Generic utilities for transforming and combining configuration files
 * across different entity types in the platform.
 */

/**
 * Generate fileSections for General Info tab from checklist configurations
 *
 * Makes checklists the single source of truth for document types.
 * Works for any entity type (employees, trucks, drivers, lemons, etc.)
 *
 * @param {Array} checklistConfigs - Array of checklist configuration objects
 *   Example: [EMPLOYEE_PRE_HIRING_CHECKLIST_CONFIG, EMPLOYEE_ONBOARDING_CHECKLIST_CONFIG]
 *
 * @param {Object} sectionGroupings - Object mapping section titles to document keys
 *   Defines how to organize documents into logical sections for the General Info tab
 *   Example: {
 *     "Identity & Work Authorization": ["government_id", "work_authorization"],
 *     "Hiring & Employment": ["resume", "employment_contract"],
 *   }
 *
 * @returns {Array} fileSections array formatted for General Info tab configuration
 *   Each section contains: { title, defaultOpen, items[] }
 *   Each item contains: { key, label, optional, itemType }
 */
export function generateFileSectionsFromChecklists(checklistConfigs, sectionGroupings) {
  // Combine all file items from all provided checklists
  const allFileItems = checklistConfigs.flatMap(config =>
    config.items.filter(item => item.itemType === "file")
  );

  // Build fileSections array based on the grouping structure
  const fileSections = [];

  for (const [sectionTitle, documentKeys] of Object.entries(sectionGroupings)) {
    // Find checklist items that match this section's document keys
    const sectionItems = documentKeys
      .map(key => {
        const item = allFileItems.find(i => i.key === key);
        if (!item) return null;

        // Extract only the fields needed for General Info (read-only display)
        return {
          key: item.key,
          label: item.label,
          optional: item.optional,
          itemType: "file",
        };
      })
      .filter(Boolean); // Remove nulls (documents not found in checklists)

    // Only add section if it has items
    if (sectionItems.length > 0) {
      fileSections.push({
        title: sectionTitle,
        defaultOpen: fileSections.length === 0, // First section open by default
        items: sectionItems,
      });
    }
  }

  return fileSections;
}
