import {
  INCIDENT_STATUS_CHOICES,
  TRUE_FALSE_CHOICES,
} from "@/config/clientData";

/**
 * Incident Edit Form Configuration
 *
 * Defines all editable fields for incident entities.
 * Based on CREATE_INCIDENT_TEMPLATE_SETTINGS from createObjectTemplate.js
 */
export const INCIDENT_EDIT_FORM_CONFIG = {
  fields: [
    {
      key: "incident_number",
      label: "Incident #",
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
      options: INCIDENT_STATUS_CHOICES,
      required: true,
    },
    {
      key: "date_time",
      label: "Date & Time",
      type: "datetime",
      required: true,
    },
    {
      key: "location",
      label: "Location",
      type: "text",
      required: true,
    },
    {
      key: "gps_coordinates",
      label: "GPS Coordinates",
      type: "gps",
      required: false,
      disabled: true,
    },
    {
      key: "incident_details",
      label: "Incident Details",
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
      key: "co_driver_id",
      label: "Co-Driver",
      type: "select-context",
      contextKey: "hiredDriversList",
      required: false,
    },
    {
      key: "co_driver_injury",
      label: "Co-Driver Injured",
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
      key: "trailer_1_unit_number",
      label: "Trailer 1 Unit Number",
      type: "text",
      required: false,
    },
    {
      key: "trailer_1_license_plate",
      label: "Trailer 1 License Plate",
      type: "text",
      required: false,
    },
    {
      key: "trailer_1_damage",
      label: "Trailer 1 Damage",
      type: "textarea",
      required: false,
    },
    {
      key: "trailer_2_unit_number",
      label: "Trailer 2 Unit Number",
      type: "text",
      required: false,
    },
    {
      key: "trailer_2_license_plate",
      label: "Trailer 2 License Plate",
      type: "text",
      required: false,
    },
    {
      key: "trailer_2_damage",
      label: "Trailer 2 Damage",
      type: "textarea",
      required: false,
    },
    {
      key: "cargo_1_bol_po_number",
      label: "Cargo 1 BOL/PO Number",
      type: "text",
      required: false,
    },
    {
      key: "cargo_1_commodity",
      label: "Cargo 1 Commodity",
      type: "text",
      required: false,
    },
    {
      key: "cargo_1_damage",
      label: "Cargo 1 Damage",
      type: "textarea",
      required: false,
    },
    {
      key: "cargo_2_bol_po_number",
      label: "Cargo 2 BOL/PO Number",
      type: "text",
      required: false,
    },
    {
      key: "cargo_2_commodity",
      label: "Cargo 2 Commodity",
      type: "text",
      required: false,
    },
    {
      key: "cargo_2_damage",
      label: "Cargo 2 Damage",
      type: "textarea",
      required: false,
    },
  ],
};

export default INCIDENT_EDIT_FORM_CONFIG;
