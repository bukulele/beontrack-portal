/**
 * WCB Claim Edit Form Configuration
 *
 * Aligned with WcbClaim Prisma model
 * Uses camelCase field names matching Prisma schema
 *
 * Editable fields: All except audit fields, system fields, and entity linking
 */

export const WCB_CLAIM_EDIT_FORM_CONFIG = {
  fields: [
    // ========================================
    // Claim Information
    // ========================================
    {
      key: "claimNumber",
      label: "Internal Claim #",
      type: "text",
      required: true,
      disabled: true, // Auto-generated, shouldn't be changed
    },
    {
      key: "wcbClaimNumber",
      label: "WCB Claim #",
      type: "text",
      required: false,
      placeholder: "Assigned by WCB",
    },
    {
      key: "province",
      label: "Province",
      type: "select",
      required: true,
      options: {
        AB: "Alberta",
        BC: "British Columbia",
        MB: "Manitoba",
        NB: "New Brunswick",
        NL: "Newfoundland and Labrador",
        NS: "Nova Scotia",
        NT: "Northwest Territories",
        NU: "Nunavut",
        ON: "Ontario",
        PE: "Prince Edward Island",
        QC: "Quebec",
        SK: "Saskatchewan",
        YT: "Yukon",
      },
    },

    // ========================================
    // Incident Information
    // ========================================
    {
      key: "incidentDate",
      label: "Incident Date",
      type: "datetime",
      required: true,
      dateRange: { start: 'current-730', end: 'current' }, // Last 2 years to today
    },
    {
      key: "location",
      label: "Incident Location",
      type: "text",
      required: false,
      placeholder: "e.g., Shop Bay 3, Highway 2 North, etc.",
    },
    {
      key: "incidentDetails",
      label: "Incident Description",
      type: "textarea",
      required: true,
      rows: 4,
    },

    // ========================================
    // Injury Details
    // ========================================
    {
      key: "injuryType",
      label: "Injury Type",
      type: "text",
      required: false,
      placeholder: "e.g., Back strain, Laceration, Fracture",
    },
    {
      key: "bodyPartAffected",
      label: "Body Part Affected",
      type: "text",
      required: false,
      placeholder: "e.g., Lower back, Right hand, Left knee",
    },
    {
      key: "severityLevel",
      label: "Injury Severity",
      type: "select",
      required: false,
      options: {
        minor: "Minor",
        moderate: "Moderate",
        serious: "Serious",
        critical: "Critical",
      },
    },

    // ========================================
    // Medical Information
    // ========================================
    {
      key: "reportedToDoctor",
      label: "Reported to Doctor",
      type: "boolean",
      required: false,
    },
    {
      key: "firstContactDate",
      label: "First Medical Contact Date",
      type: "date",
      required: false,
      dateRange: { start: 'current-730', end: 'current' }, // Last 2 years to today
    },
    {
      key: "doctorName",
      label: "Physician Name",
      type: "text",
      required: false,
      placeholder: "Dr. Smith",
    },
    {
      key: "doctorPhone",
      label: "Physician Phone",
      type: "phone",
      required: false,
      placeholder: "(555) 123-4567",
    },
    {
      key: "medicalFacility",
      label: "Medical Facility",
      type: "text",
      required: false,
      placeholder: "e.g., City Hospital, Walk-in Clinic",
    },

    // ========================================
    // WCB Contact Information
    // ========================================
    {
      key: "wcbContactName",
      label: "WCB Adjuster Name",
      type: "text",
      required: false,
    },
    {
      key: "wcbContactPhone",
      label: "WCB Adjuster Phone",
      type: "phone",
      required: false,
      placeholder: "(555) 123-4567",
    },
    {
      key: "wcbContactEmail",
      label: "WCB Adjuster Email",
      type: "email",
      required: false,
    },

    // ========================================
    // Return to Work
    // ========================================
    {
      key: "expectedReturnDate",
      label: "Expected Return to Work Date",
      type: "date",
      required: false,
      dateRange: { start: 'current', end: 'current+730' }, // Today to 2 years in future
    },
    {
      key: "actualReturnDate",
      label: "Actual Return to Work Date",
      type: "date",
      required: false,
      dateRange: { start: 'current-365', end: 'current+730' }, // Last year to 2 years future
    },
    {
      key: "lostTimeDays",
      label: "Lost Time Days",
      type: "number",
      required: false,
      min: 0,
      placeholder: "0",
    },

    // ========================================
    // Financial Impact
    // ========================================
    {
      key: "estimatedCost",
      label: "Estimated Cost",
      type: "currency",
      required: false,
      placeholder: "0.00",
    },
    {
      key: "actualCost",
      label: "Actual Cost",
      type: "currency",
      required: false,
      placeholder: "0.00",
    },

    // ========================================
    // Notes
    // ========================================
    {
      key: "statusNote",
      label: "Status Note",
      type: "textarea",
      required: false,
      rows: 3,
      placeholder: "Internal notes about claim status",
    },
    {
      key: "remarksComments",
      label: "Remarks / Comments",
      type: "textarea",
      required: false,
      rows: 3,
      placeholder: "Additional comments or observations",
    },
  ],
};

export default WCB_CLAIM_EDIT_FORM_CONFIG;
