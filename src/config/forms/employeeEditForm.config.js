import {
  STATUS_CHOICES,
  DEPARTMENT_CHOICES,
  CANADIAN_PROVINCES,
} from "@/config/clientData";

/**
 * Employee Edit Form Configuration
 *
 * Defines all editable fields for employee entities.
 * Based on CREATE_EMPLOYEE_TEMPLATE_SETTINGS from createObjectTemplate.js
 */
export const EMPLOYEE_EDIT_FORM_CONFIG = {
  fields: [
    {
      key: "employee_id",
      label: "Employee ID",
      type: "text",
      required: true,
      disabled: true, // Primary identifier
    },
    {
      key: "card_number",
      label: "Card Number",
      type: "text",
      required: false,
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
      required: false,
    },
    {
      key: "emergency_phone",
      label: "Emergency Phone",
      type: "phone",
      required: false,
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
      key: "department",
      label: "Department",
      type: "select",
      options: DEPARTMENT_CHOICES,
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

export default EMPLOYEE_EDIT_FORM_CONFIG;
