/**
 * WCB Claim Medical Info Checklist Configuration
 *
 * Medical information and injury details for WCB claims
 * Used by HR and Safety/Compliance roles
 */

export const WCB_CLAIM_MEDICAL_CHECKLIST_CONFIG = {
  // Show progress indicator
  showProgress: true,

  // No custom fields - use WcbClaim model fields from API
  customFields: [],

  // Checklist items - Medical data fields
  items: [
    // ========== INJURY DETAILS ==========
    {
      key: "injuryType",
      label: "Injury Type",
      optional: false,
      itemType: "data",
      type: "text",
      placeholder: "e.g., Back strain, Laceration, Fracture, Concussion",

      roles: {
        view: ["all"],
        edit: ["admin", "humanResources", "safetyCompliance"],
      },
    },

    {
      key: "bodyPartAffected",
      label: "Body Part Affected",
      optional: false,
      itemType: "data",
      type: "text",
      placeholder: "e.g., Lower back, Right hand, Left knee, Head",

      roles: {
        view: ["all"],
        edit: ["admin", "humanResources", "safetyCompliance"],
      },
    },

    {
      key: "severityLevel",
      label: "Injury Severity",
      optional: false,
      itemType: "data",
      type: "select",
      selectOptions: {
        minor: "Minor",
        moderate: "Moderate",
        serious: "Serious",
        critical: "Critical",
      },

      roles: {
        view: ["all"],
        edit: ["admin", "humanResources", "safetyCompliance"],
      },
    },

    // ========== MEDICAL PROVIDER INFORMATION ==========
    {
      key: "doctorName",
      label: "Physician Name",
      optional: true,
      itemType: "data",
      type: "text",
      placeholder: "Dr. Smith",

      roles: {
        view: ["all"],
        edit: ["admin", "humanResources", "safetyCompliance"],
      },
    },

    {
      key: "doctorPhone",
      label: "Physician Phone",
      optional: true,
      itemType: "data",
      type: "tel",
      placeholder: "(555) 123-4567",

      roles: {
        view: ["all"],
        edit: ["admin", "humanResources", "safetyCompliance"],
      },
    },

    // ========== RETURN TO WORK ==========
    {
      key: "actualReturnDate",
      label: "Return to Work Date",
      optional: true,
      itemType: "data",
      type: "date",
      dateRange: { start: 'current-365', end: 'current+730' }, // Last year to 2 years future

      roles: {
        view: ["all"],
        edit: ["admin", "humanResources", "safetyCompliance"],
      },
    },
  ],

  // No completion action for medical checklist (it's informational)
  completionAction: null,
};

export default WCB_CLAIM_MEDICAL_CHECKLIST_CONFIG;
