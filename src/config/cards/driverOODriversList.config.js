/**
 * Driver Card - O/O Drivers List Tab Configuration
 *
 * Displays all child drivers (O/O drivers) assigned to this main driver.
 * Data source: direct array from driver.child_drivers
 */

export const driverOODriversListConfig = {
  type: 'list',

  // Parent context configuration
  parentDataKey: 'userData',

  // Data source configuration
  dataSource: {
    type: 'direct', // Array is directly in parent entity
    field: 'child_drivers', // Field name in parent entity
  },

  // Related entity configuration
  relatedEntityType: 'driver', // Type to open when clicking row

  // Empty state
  emptyMessage: 'No O/O drivers assigned to this main driver',

  // Sort function - no sorting, keep array order
  sortFn: null,

  // Row renderer configuration
  rowRenderer: {
    // Primary text (bold)
    primary: (driver) =>
      `${driver.first_name || ''} ${driver.last_name || ''}`.trim() || 'Unknown Driver',

    // Secondary text (gray, below primary)
    secondary: (driver) => driver.driver_id || 'No ID',

    // Badge text (top-right) - optional
    badge: null,

    // Metadata text (gray, below secondary) - optional
    metadata: null,

    // Show role icon (main/co) - only for incidents/violations
    roleIcon: false,
  },
};
