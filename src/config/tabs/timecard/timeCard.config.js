/**
 * Universal Time Card Configuration
 *
 * Factory function to create time card configuration for any entity type.
 * Currently supports 'employee', designed to be extended for 'driver' in the future.
 */

/**
 * Create time card configuration for specific entity type
 * @param {string} entityType - 'employee' | 'driver' | etc.
 * @returns {object} Time card configuration
 */
export const createTimeCardConfig = (entityType) => ({
  type: "timecard",
  entityType,

  // API endpoints (universal pattern)
  api: {
    // Time entries CRUD (universal pattern)
    // GET/POST: /api/v1/{entityType}/{id}/time-entries
    // PATCH/DELETE: /api/v1/{entityType}/{id}/time-entries/{entryId}
    getTimeEntries: (entityId) =>
      `/api/v1/${entityType}/${entityId}/time-entries`,

    createTimeEntry: (entityId) =>
      `/api/v1/${entityType}/${entityId}/time-entries`,

    updateTimeEntry: (entityId, entryId) =>
      `/api/v1/${entityType}/${entityId}/time-entries/${entryId}`,

    deleteTimeEntry: (entityId, entryId) =>
      `/api/v1/${entityType}/${entityId}/time-entries/${entryId}`,

    // Hours adjustments
    // GET/POST: /api/v1/{entityType}/{id}/adjustments
    // DELETE: /api/v1/adjustments/{adjustmentId}
    getAdjustments: (entityId) => `/api/v1/${entityType}/${entityId}/adjustments`,

    createAdjustment: (entityId) => `/api/v1/${entityType}/${entityId}/adjustments`,

    deleteAdjustment: (adjustmentId) => `/api/v1/adjustments/${adjustmentId}`,

    // Update entity settings (e.g., can_checkin_remotely)
    updateEntity: (entityId) => `/api/v1/${entityType}/${entityId}`,
  },

  // Feature flags - what functionality is enabled for this entity type
  features: {
    // Medical leave tracking
    medicalLeave: {
      enabled: entityType === "employees",
      totalDaysPerYear: 10,
      defaultTimes: {
        checkIn: "08:00:00",
        checkOut: "16:30:00",
      },
    },

    // Hours adjustments for pay period
    adjustments: {
      enabled: entityType === "employees",
      createObjectType: `${entityType}_adjustment`,
    },

    // GPS tracking for check-in/check-out
    gpsTracking: {
      enabled: entityType === "employees",
      showCoordinates: true,
    },

    // Remote check-in permission toggle
    remoteCheckin: {
      enabled: entityType === "employees",
      fieldName: "can_checkin_remotely",
    },

    // Truck assignments (driver only - future support)
    truckAssignments: {
      enabled: entityType === "drivers",
      showModal: true,
    },

    // Schedule integration (driver only - future support)
    schedule: {
      enabled: entityType === "drivers",
    },
  },

  // Hours calculation rules
  calculations: {
    // Automatic lunch deduction
    lunchDeduction: entityType === "employees",
    lunchDeductionMinutes: 30,
    lunchDeductionThreshold: 5, // Apply deduction if total >= 5 hours

    // Round to nearest quarter hour (driver only)
    roundToQuarter: entityType === "drivers",
  },

  // Display preferences
  display: {
    // Timezone display mode
    // 'dynamic' = shows user's local timezone
    // 'static' = shows fixed timezone
    timezoneMode: entityType === "employees" ? "dynamic" : "static",
    staticTimezone: "Winnipeg",

    // View mode (currently only half-month is implemented)
    viewMode: "halfMonth", // 'halfMonth' | 'fullMonth' | 'week'
  },

  // Role-based permissions
  roles: {
    // Who can edit time entries
    edit: ["finance", "humanResources", "admin"],

    // Who can see third-party login warnings
    viewThirdPartyWarnings: ["finance", "humanResources", "admin"],
  },
});

/**
 * Pre-configured time card for employees
 */
export const employeeTimeCardConfig = createTimeCardConfig("employees");

/**
 * Pre-configured time card for drivers (future support)
 */
export const driverTimeCardConfig = createTimeCardConfig("drivers");

export default employeeTimeCardConfig;
