import {
  EMPLOYMENT_TYPE_CHOICES,
  DEPARTMENT_CHOICES,
  CANADIAN_PROVINCES,
  COUNTRIES,
} from "@/config/clientData";

/**
 * Employee Edit Form Configuration
 *
 * Updated for Prisma schema - aligned with OfficeEmployee model
 * Uses camelCase field names matching Prisma schema
 *
 * Model: OfficeEmployee (26 fields)
 * Editable fields: 17 fields (excludes audit fields, system fields, and relations)
 */

export const EMPLOYEE_EDIT_FORM_CONFIG = {
  fields: [
    // ========================================
    // Identity Section
    // ========================================
    {
      key: "employeeId",
      label: "Employee ID",
      type: "text",
      required: true,
      disabled: true, // Primary identifier - read-only
    },
    {
      key: "firstName",
      label: "First Name",
      type: "text",
      required: true,
    },
    {
      key: "lastName",
      label: "Last Name",
      type: "text",
      required: true,
    },

    // ========================================
    // Contact Section
    // ========================================
    {
      key: "email",
      label: "Email",
      type: "email",
      required: false,
    },
    {
      key: "phoneNumber",
      label: "Phone Number",
      type: "phone",
      required: false,
    },
    {
      key: "emergencyContactName",
      label: "Emergency Contact Name",
      type: "text",
      required: false,
    },
    {
      key: "emergencyContactPhone",
      label: "Emergency Contact Phone",
      type: "phone",
      required: false,
    },

    // ========================================
    // Personal Information
    // ========================================
    {
      key: "dateOfBirth",
      label: "Date of Birth",
      type: "date",
      required: false,
    },

    // ========================================
    // Address Section (Prisma fields)
    // ========================================
    {
      key: "addressLine1",
      label: "Address Line 1",
      type: "text",
      required: false,
    },
    {
      key: "addressLine2",
      label: "Address Line 2 (Unit/Suite)",
      type: "text",
      required: false,
    },
    {
      key: "city",
      label: "City",
      type: "text",
      required: false,
    },
    {
      key: "stateProvince",
      label: "State/Province",
      type: "select",
      options: CANADIAN_PROVINCES,
      required: false,
    },
    {
      key: "postalCode",
      label: "Postal Code",
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

    // ========================================
    // Employment Section (Prisma fields)
    // ========================================
    {
      key: "hireDate",
      label: "Hire Date",
      type: "date",
      required: false,
    },
    {
      key: "terminationDate",
      label: "Termination Date",
      type: "date",
      required: false,
    },
    {
      key: "jobTitle",
      label: "Job Title",
      type: "text",
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
      key: "employmentType",
      label: "Employment Type",
      type: "select",
      options: EMPLOYMENT_TYPE_CHOICES,
      required: false,
    },
    {
      key: "officeLocation",
      label: "Office Location",
      type: "text",
      required: false,
    },
  ],
};

export default EMPLOYEE_EDIT_FORM_CONFIG;
