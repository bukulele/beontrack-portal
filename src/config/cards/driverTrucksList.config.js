import findHighestIdObject from "@/app/functions/findHighestIdObject";

/**
 * Driver Card - Trucks List Tab Configuration
 *
 * Displays all trucks assigned to this driver.
 * Data source: direct array from driver.trucks
 */

export const driverTrucksListConfig = {
  type: 'list',

  // Parent context configuration
  parentDataKey: 'userData',

  // Data source configuration
  dataSource: {
    type: 'direct', // Array is directly in parent entity
    field: 'trucks', // Field name in parent entity
  },

  // Related entity configuration
  relatedEntityType: 'truck', // Type to open when clicking row

  // Empty state
  emptyMessage: 'No trucks assigned to this driver',

  // Sort function (optional)
  sortFn: (truckA, truckB) =>
    truckA.unit_number.localeCompare(truckB.unit_number, undefined, {
      numeric: true,
    }),

  // Row renderer configuration
  rowRenderer: {
    // Primary text (bold)
    primary: (truck) => truck.unit_number,

    // Secondary text (gray, below primary)
    secondary: (truck) => `${truck.make || ''} ${truck.model || ''}`.trim() || 'Unknown',

    // Badge text (top-right)
    badge: (truck) => {
      if (!truck.truck_license_plates || truck.truck_license_plates.length === 0) {
        return null;
      }
      const latestPlate = findHighestIdObject(truck.truck_license_plates);
      return latestPlate?.plate_number || null;
    },

    // Metadata text (gray, below secondary) - optional
    metadata: null,

    // Show role icon (main/co) - only for incidents/violations
    roleIcon: false,
  },
};
