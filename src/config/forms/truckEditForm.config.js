import {
  TERMINAL_CHOICES,
  VEHICLE_TYPE_CHOICES,
  OWNEDBY_CHOICES_TRUCKS,
  TRUCK_STATUS_CHOICES,
} from "@/config/clientData";

/**
 * Truck Edit Form Configuration
 *
 * Defines all editable fields for truck entities.
 * Based on EDIT_TRUCK_TEMPLATE_SETTINGS from createObjectTemplate.js
 */
export const TRUCK_EDIT_FORM_CONFIG = {
  fields: [
    {
      key: "unit_number",
      label: "Unit Number",
      type: "number",
      required: true,
      disabled: true, // Primary identifier
    },
    {
      key: "make",
      label: "Make",
      type: "text",
      required: true,
    },
    {
      key: "model",
      label: "Model",
      type: "text",
      required: true,
    },
    {
      key: "vin",
      label: "VIN",
      type: "text",
      required: true,
    },
    {
      key: "year",
      label: "Year",
      type: "number",
      required: true,
    },
    {
      key: "terminal",
      label: "Terminal",
      type: "select",
      options: TERMINAL_CHOICES,
      required: true,
    },
    {
      key: "value_in_cad",
      label: "Value In CAD",
      type: "number",
      required: true,
    },
    {
      key: "vehicle_type",
      label: "Vehicle Type",
      type: "select",
      options: VEHICLE_TYPE_CHOICES,
      required: true,
    },
    {
      key: "owned_by",
      label: "Owned By",
      type: "select",
      options: OWNEDBY_CHOICES_TRUCKS,
      required: true,
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

export default TRUCK_EDIT_FORM_CONFIG;
