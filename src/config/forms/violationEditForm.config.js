import {
  VIOLATION_STATUS_CHOICES,
  TRUE_FALSE_CHOICES,
  COUNTRIES,
  CANADIAN_PROVINCES,
  USA_STATES,
} from "@/config/clientData";

/**
 * Violation Edit Form Configuration
 *
 * Defines all editable fields for violation entities.
 * Based on CREATE_VIOLATION_TEMPLATE_SETTINGS from createObjectTemplate.js
 */
export const VIOLATION_EDIT_FORM_CONFIG = {
  fields: [
    {
      key: "violation_number",
      label: "Violation #",
      type: "text",
      required: true,
      disabled: true, // Primary identifier
    },
    {
      key: "assigned_to",
      label: "Assigned to",
      type: "text",
      required: true,
    },
    {
      key: "report",
      label: "Driver Report #",
      type: "select-context",
      contextKey: "driverReportsList",
      required: false,
    },
    {
      key: "status",
      label: "Status",
      type: "select",
      options: VIOLATION_STATUS_CHOICES,
      required: true,
    },
    {
      key: "date_time",
      label: "Date & Time",
      type: "datetime",
      required: true,
    },
    {
      key: "city",
      label: "City",
      type: "text",
      required: false,
    },
    {
      key: "country",
      label: "Country",
      type: "select",
      options: COUNTRIES,
      required: false,
    },
    {
      key: "province",
      label: "Province / State",
      type: "select",
      options: { ...CANADIAN_PROVINCES, ...USA_STATES },
      required: false,
    },
    {
      key: "gps_coordinates",
      label: "GPS Coordinates",
      type: "gps",
      required: false,
      disabled: true,
    },
    {
      key: "violation_details",
      label: "Violation Details",
      type: "textarea",
      required: true,
      fullWidth: true,
    },
    {
      key: "main_driver_id",
      label: "Main Driver",
      type: "select-context",
      contextKey: "hiredDriversList",
      required: false,
    },
    {
      key: "main_driver_injury",
      label: "Main Driver Injured",
      type: "select",
      options: TRUE_FALSE_CHOICES,
      required: false,
    },
    {
      key: "truck",
      label: "Truck",
      type: "select-context",
      contextKey: "activeTrucksList",
      required: false,
    },
    {
      key: "truck_violation",
      label: "Truck Violation",
      type: "textarea",
      required: false,
    },
    {
      key: "trailer_1_unit_number",
      label: "Trailer 1 Unit Number",
      type: "text",
      required: false,
    },
    {
      key: "trailer_1_violation",
      label: "Trailer 1 Violation",
      type: "textarea",
      required: false,
    },
  ],
};

export default VIOLATION_EDIT_FORM_CONFIG;
