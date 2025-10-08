import {
  WCB_STATUS_CHOICES,
  TERMINAL_CHOICES,
  TRUE_FALSE_CHOICES,
  DRIVER_EMPLOYEE_CHOICES,
} from "@/config/clientData";

/**
 * WCB Edit Form Configuration
 *
 * Defines all editable fields for WCB claim entities.
 * Based on WCB_OBJECT_TEMPLATE_SETTINGS from createObjectTemplate.js
 */
export const WCB_EDIT_FORM_CONFIG = {
  fields: [
    {
      key: "claim_number",
      label: "4Tracks Claim Number",
      type: "text",
      required: true,
      disabled: true, // Primary identifier
    },
    {
      key: "wcb_claim_number",
      label: "WCB Claim Number",
      type: "text",
      required: false,
    },
    {
      key: "assigned_to",
      label: "Assigned to",
      type: "text",
      required: true,
    },
    {
      key: "status",
      label: "Status",
      type: "select",
      options: WCB_STATUS_CHOICES,
      required: true,
    },
    {
      key: "date_time",
      label: "Date and Time",
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
      key: "province",
      label: "Province",
      type: "select",
      options: TERMINAL_CHOICES,
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
      key: "incident_details",
      label: "Incident Details",
      type: "textarea",
      required: true,
      fullWidth: true,
    },
    {
      key: "reported_to_doctor",
      label: "Reported to Doctor",
      type: "select",
      options: TRUE_FALSE_CHOICES,
      required: true,
    },
    {
      key: "first_contact_after_injury",
      label: "First Contact After Injury",
      type: "text",
      required: true,
    },
    {
      key: "wcbcontact_name",
      label: "WCB Contact Name",
      type: "text",
      required: false,
    },
    {
      key: "wcbcontact_email",
      label: "WCB Contact Email",
      type: "email",
      required: false,
    },
    {
      key: "wcbcontact_phone",
      label: "WCB Contact Phone",
      type: "phone",
      required: false,
    },
    {
      key: "select_driver_employee",
      label: "Choose Driver/Employee",
      type: "radio",
      options: DRIVER_EMPLOYEE_CHOICES,
      required: false,
    },
    {
      key: "main_driver_id",
      label: "Driver",
      type: "select-context",
      contextKey: "hiredDriversList",
      required: false, // Conditionally required based on select_driver_employee
    },
    {
      key: "main_employee_id",
      label: "Employee",
      type: "select-context",
      contextKey: "hiredEmployeesList",
      required: false, // Conditionally required based on select_driver_employee
    },
    {
      key: "report",
      label: "Driver Report #",
      type: "select-context",
      contextKey: "driverReportsList",
      required: false,
    },
    {
      key: "remarks",
      label: "Remarks",
      type: "textarea",
      required: false,
      fullWidth: true,
    },
  ],
};

export default WCB_EDIT_FORM_CONFIG;
