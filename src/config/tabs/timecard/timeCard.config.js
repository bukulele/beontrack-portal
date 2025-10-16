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

  // API endpoints (entity-specific)
  api: {
    // Get all attendance data for a year
    attendance:
      entityType === "employee"
        ? "/api/get-attendance-data"
        : `/api/get-attendance-data-${entityType}`,

    // Save/update attendance entry
    saveAttendance:
      entityType === "employee"
        ? "/api/save-attendance-data"
        : `/api/save-attendance-data-${entityType}`,

    // Medical leave tracking (employee only)
    medicalLeave: "/api/get-medical-leave-data",

    // Hours adjustments (employee only)
    adjustments: "/api/get-adjustments-data",
    deleteAdjustment: "/api/get-adjustments-data/delete",

    // Update entity settings
    updateEntity: `/api/update-${entityType}`,
  },

  // Feature flags - what functionality is enabled for this entity type
  features: {
    // Medical leave tracking
    medicalLeave: {
      enabled: entityType === "employee",
      totalDaysPerYear: 10,
      defaultTimes: {
        checkIn: "08:00:00",
        checkOut: "16:30:00",
      },
    },

    // Hours adjustments for pay period
    adjustments: {
      enabled: entityType === "employee",
      createObjectType: `${entityType}_adjustment`,
    },

    // GPS tracking for check-in/check-out
    gpsTracking: {
      enabled: entityType === "employee",
      showCoordinates: true,
    },

    // Remote check-in permission toggle
    remoteCheckin: {
      enabled: entityType === "employee",
      fieldName: "can_checkin_remotely",
    },

    // Truck assignments (driver only - future support)
    truckAssignments: {
      enabled: entityType === "driver",
      showModal: true,
    },

    // Schedule integration (driver only - future support)
    schedule: {
      enabled: entityType === "driver",
    },
  },

  // Hours calculation rules
  calculations: {
    // Automatic lunch deduction
    lunchDeduction: entityType === "employee",
    lunchDeductionMinutes: 30,
    lunchDeductionThreshold: 5, // Apply deduction if total >= 5 hours

    // Round to nearest quarter hour (driver only)
    roundToQuarter: entityType === "driver",
  },

  // Display preferences
  display: {
    // Timezone display mode
    // 'dynamic' = shows user's local timezone
    // 'static' = shows fixed timezone
    timezoneMode: entityType === "employee" ? "dynamic" : "static",
    staticTimezone: "Winnipeg",

    // View mode (currently only half-month is implemented)
    viewMode: "halfMonth", // 'halfMonth' | 'fullMonth' | 'week'
  },

  // Role-based permissions
  roles: {
    // Who can edit time entries
    edit: ["payrollManager", "admin"],

    // Who can see third-party login warnings
    viewThirdPartyWarnings: ["payrollManager", "admin"],
  },
});

/**
 * Pre-configured time card for employees
 */
export const employeeTimeCardConfig = createTimeCardConfig("employee");

/**
 * Pre-configured time card for drivers (future support)
 */
export const driverTimeCardConfig = createTimeCardConfig("driver");

export default employeeTimeCardConfig;
