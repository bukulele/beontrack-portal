import { REPORTS_TYPES } from "@/app/assets/tableData";

/**
 * Driver Report General Info Configuration
 *
 * Read-only display configuration for driver reports with:
 * - Conditional field templates (AC/TK vs IJ reports)
 * - Photo gallery (hidden for IJ reports)
 * - Related entity navigation (incidents, violations, WCB claims)
 * - Custom actions (PDF download, view on map)
 */

// Standard fields for AC (Accident) and TK (Ticket) reports
const STANDARD_FIELDS = [
  {
    key: "id",
    label: "Report ID",
    editable: false,
  },
  {
    key: "driver_id",
    label: "Driver",
    editable: false,
  },
  {
    key: "date_time",
    label: "Date and Time",
    type: "datetime",
    editable: false,
  },
  {
    key: "location",
    label: "Location",
    editable: false,
  },
  {
    key: "type_of_report",
    label: "Report Type",
    editable: false,
    formatter: (value) => REPORTS_TYPES[value] || value,
  },
  {
    key: "truck_number",
    label: "Truck Number",
    editable: false,
  },
  {
    key: "trailer_number",
    label: "Trailer Number",
    editable: false,
  },
  {
    key: "description",
    label: "Description",
    editable: false,
  },
  {
    key: "steps_taken",
    label: "Steps Taken",
    editable: false,
  },
];

// Injury-specific fields for IJ reports
const INJURY_FIELDS = [
  {
    key: "id",
    label: "Report ID",
    editable: false,
  },
  {
    key: "driver_id",
    label: "Driver",
    editable: false,
  },
  {
    key: "date_time",
    label: "Date and Time",
    type: "datetime",
    editable: false,
  },
  {
    key: "location",
    label: "Location",
    editable: false,
  },
  {
    key: "type_of_report",
    label: "Report Type",
    editable: false,
    formatter: (value) => REPORTS_TYPES[value] || value,
  },
  {
    key: "description",
    label: "Description",
    editable: false,
  },
  {
    key: "steps_taken",
    label: "Steps Taken",
    editable: false,
  },
  {
    key: "first_contact_after_injury",
    label: "First Contact After Injury",
    editable: false,
  },
  {
    key: "reported_to_doctor",
    label: "Reported to Doctor",
    editable: false,
    formatter: (value) => (value ? "Yes" : "No"),
  },
];

/**
 * Main configuration - uses standard fields by default
 * The specific field set will be selected based on report type at runtime
 */
export const DRIVER_REPORT_GENERAL_INFO_CONFIG = {
  // Read-only mode - no editing allowed
  readOnly: true,

  // Field sections
  sections: [
    {
      title: "Report Information",
      fields: STANDARD_FIELDS, // Default to standard
    },
  ],

  // Related entities configuration
  relatedEntities: [
    {
      label: "Incident",
      dataKey: "related_incidents",
      entityType: "incident",
      displayField: "incident_number",
      defaultLabel: "Go to incident",
    },
    {
      label: "Violation",
      dataKey: "related_violations",
      entityType: "violation",
      displayField: "violation_number",
      defaultLabel: "Go to violation",
    },
    {
      label: "WCB Claim",
      dataKey: "related_wcbclaims",
      entityType: "wcb",
      displayField: "claim_number",
      defaultLabel: "Go to WCB claim",
    },
  ],

  // Custom actions
  customActions: [
    {
      label: "Download PDF",
      icon: "Download",
      variant: "outline",
      onClick: (entityData) => {
        // Download PDF handler
        fetch(`/api/get-driver-report-pdf/${entityData.id}`)
          .then((response) => {
            if (!response.ok) {
              throw new Error("Failed to download PDF");
            }

            const contentDisposition = response.headers.get("Content-Disposition");
            const fileName = contentDisposition?.match(/filename="(.+?)"/)?.[1] || "report.pdf";

            return response.blob().then((blob) => ({ blob, fileName }));
          })
          .then(({ blob, fileName }) => {
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = downloadUrl;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(downloadUrl);
          })
          .catch((error) => {
            console.error("Error downloading PDF:", error.message);
          });
      },
    },
    {
      label: "View on Map",
      icon: "MapPin",
      variant: "outline",
      onClick: (entityData, helpers) => {
        if (entityData.gps_coordinates && entityData.gps_coordinates.length > 0) {
          helpers.handleOpenMap(entityData.gps_coordinates, entityData.location);
        }
      },
      disabled: (entityData) =>
        !entityData.gps_coordinates || entityData.gps_coordinates.length === 0,
    },
  ],

  // Map modal configuration
  mapModal: {
    enabled: true,
  },
};

// Export field templates for conditional use
export const DRIVER_REPORT_STANDARD_FIELDS = STANDARD_FIELDS;
export const DRIVER_REPORT_INJURY_FIELDS = INJURY_FIELDS;

export default DRIVER_REPORT_GENERAL_INFO_CONFIG;
