import moment from "moment-timezone";

/**
 * Driver Card - Incidents List Tab Configuration
 *
 * Displays all incidents where this driver was involved (main driver or co-driver).
 * Data source: multi-referenced (main_driver_incidents + co_driver_incidents)
 * Requires: IncidentsListContext
 */

export const driverIncidentsListConfig = {
  type: 'list',

  // Parent context configuration
  parentDataKey: 'userData',

  // Data source configuration
  dataSource: {
    type: 'multi-referenced', // Combines two ID arrays and looks up from context
    mainIdsField: 'main_driver_incidents', // Field with main driver incident IDs
    coIdsField: 'co_driver_incidents', // Field with co-driver incident IDs
    listContextKey: 'incidentsList', // Context key in additionalContexts
  },

  // Related entity configuration
  relatedEntityType: 'incident', // Type to open when clicking row

  // Empty state
  emptyMessage: 'No incidents recorded for this driver',

  // Sort function - newest first (by ID desc)
  sortFn: (a, b) => b.id - a.id,

  // Row renderer configuration
  rowRenderer: {
    // Primary text (bold)
    primary: (incident) => incident.incident_number || `Incident #${incident.id}`,

    // Secondary text (gray, below primary)
    secondary: (incident) => {
      if (!incident.date_time) return 'Date unknown';
      return moment(incident.date_time).format('DD MMM YYYY, hh:mm');
    },

    // Metadata text (gray, below secondary)
    metadata: (incident) =>
      incident.assigned_to ? `Assigned to: ${incident.assigned_to}` : null,

    // Badge text (top-right) - optional
    badge: null,

    // Show role icon (main driver = steering wheel, co-driver = seat icon)
    roleIcon: true, // Will show icon based on _role field ('main' or 'co')
  },
};
