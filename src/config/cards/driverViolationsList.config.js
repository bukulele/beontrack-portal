import moment from "moment-timezone";

/**
 * Driver Card - Violations List Tab Configuration
 *
 * Displays all violations where this driver was involved (main driver or co-driver).
 * Data source: multi-referenced (main_driver_violations + co_driver_violations)
 * Requires: ViolationsListContext
 */

export const driverViolationsListConfig = {
  type: 'list',

  // Parent context configuration
  parentDataKey: 'userData',

  // Data source configuration
  dataSource: {
    type: 'multi-referenced', // Combines two ID arrays and looks up from context
    mainIdsField: 'main_driver_violations', // Field with main driver violation IDs
    coIdsField: 'co_driver_violations', // Field with co-driver violation IDs
    listContextKey: 'violationsList', // Context key in additionalContexts
  },

  // Related entity configuration
  relatedEntityType: 'violation', // Type to open when clicking row

  // Empty state
  emptyMessage: 'No violations recorded for this driver',

  // Sort function - newest first (by ID desc)
  sortFn: (a, b) => b.id - a.id,

  // Row renderer configuration
  rowRenderer: {
    // Primary text (bold)
    primary: (violation) => violation.violation_number || `Violation #${violation.id}`,

    // Secondary text (gray, below primary)
    secondary: (violation) => {
      if (!violation.date_time) return 'Date unknown';
      return moment(violation.date_time).format('DD MMM YYYY, hh:mm');
    },

    // Metadata text (gray, below secondary)
    metadata: (violation) =>
      violation.assigned_to ? `Assigned to: ${violation.assigned_to}` : null,

    // Badge text (top-right) - optional
    badge: null,

    // Show role icon (main driver = steering wheel, co-driver = seat icon)
    roleIcon: true, // Will show icon based on _role field ('main' or 'co')
  },
};
