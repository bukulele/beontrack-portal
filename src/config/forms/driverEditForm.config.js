import {
  STATUS_CHOICES,
  CANADIAN_PROVINCES,
} from "@/config/clientData";

/**
 * Driver Edit Form Configuration
 *
 * Defines all editable fields for driver entities.
 * Based on CREATE_DRIVER_TEMPLATE_SETTINGS from createObjectTemplate.js
 * Similar to employee but driver-specific
 */
export const DRIVER_EDIT_FORM_CONFIG = {
  fields: [
    {
      key: "driver_id",
      label: "Driver ID",
      type: "text",
      required: true,
      disabled: true, // Primary identifier (added during creation only)
    },
    {
      key: "email",
      label: "Email",
      type: "email",
      required: true,
      adminOnly: true,
    },
    {
      key: "first_name",
      label: "First Name",
      type: "text",
      required: true,
    },
    {
      key: "last_name",
      label: "Last Name",
      type: "text",
      required: true,
    },
    {
      key: "phone_number",
      label: "Phone Number",
      type: "phone",
      required: true,
    },
    {
      key: "emergency_contact",
      label: "Emergency Contact",
      type: "text",
      required: true,
    },
    {
      key: "emergency_phone",
      label: "Emergency Phone",
      type: "phone",
      required: true,
    },
    {
      key: "date_of_birth",
      label: "Date of Birth",
      type: "date",
      required: true,
    },
    {
      key: "date_available",
      label: "Date Available",
      type: "date",
      required: false,
    },
    {
      key: "street_number",
      label: "Street Number",
      type: "number",
      required: true,
    },
    {
      key: "street",
      label: "Street",
      type: "text",
      required: true,
    },
    {
      key: "unit_or_suite",
      label: "Unit or Suite",
      type: "text",
      required: false,
    },
    {
      key: "city",
      label: "City",
      type: "text",
      required: true,
    },
    {
      key: "province",
      label: "Province",
      type: "select",
      options: CANADIAN_PROVINCES,
      required: true,
    },
    {
      key: "postal_code",
      label: "Postal Code",
      type: "postal_code",
      required: true,
    },
  ],
};

export default DRIVER_EDIT_FORM_CONFIG;
