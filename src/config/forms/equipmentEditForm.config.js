import {
  TERMINAL_CHOICES,
  EQUIPMENT_TYPE_CHOICES,
  OWNEDBY_CHOICES_EQUIPMENT,
} from "@/config/clientData";

/**
 * Equipment Edit Form Configuration
 *
 * Defines all editable fields for equipment entities.
 * Based on EDIT_EQUIPMENT_TEMPLATE_SETTINGS from createObjectTemplate.js
 * Nearly identical to Truck, but uses equipment_type instead of vehicle_type
 */
export const EQUIPMENT_EDIT_FORM_CONFIG = {
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
      key: "equipment_type",
      label: "Equipment Type",
      type: "select",
      options: EQUIPMENT_TYPE_CHOICES,
      required: true,
    },
    {
      key: "owned_by",
      label: "Owned By",
      type: "select",
      options: OWNEDBY_CHOICES_EQUIPMENT,
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

export default EQUIPMENT_EDIT_FORM_CONFIG;
