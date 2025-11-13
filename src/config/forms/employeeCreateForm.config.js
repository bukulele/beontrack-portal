import {
  EMPLOYMENT_TYPE_CHOICES,
  DEPARTMENT_CHOICES,
  CANADIAN_PROVINCES,
  COUNTRIES,
} from "@/config/clientData";

/**
 * Employee Create Form Configuration
 *
 * Configuration for creating new office employees
 * Based on Prisma OfficeEmployee model
 *
 * Required fields: employeeId, firstName, lastName
 * Default status: "new" (recruiting pipeline)
 * All other fields optional
 */

export const EMPLOYEE_CREATE_FORM_CONFIG = {
  fields: [
    // ========================================
    // Identity Section
    // ========================================
    {
      key: "employeeId",
      label: "Employee ID",
      type: "text",
      required: true,
      placeholder: "e.g., EMP-001",
      // Editable in create form (unlike edit form where it's disabled)
    },
    {
      key: "firstName",
      label: "First Name",
      type: "text",
      required: true,
      placeholder: "Enter first name",
    },
    {
      key: "lastName",
      label: "Last Name",
      type: "text",
      required: true,
      placeholder: "Enter last name",
    },

    // ========================================
    // Contact Section
    // ========================================
    {
      key: "email",
      label: "Email",
      type: "email",
      required: false,
      placeholder: "user@example.com",
    },
    {
      key: "phoneNumber",
      label: "Phone Number",
      type: "phone",
      required: false,
      placeholder: "+1 (555) 123-4567",
    },
    {
      key: "emergencyContactName",
      label: "Emergency Contact Name",
      type: "text",
      required: false,
      placeholder: "Full name",
    },
    {
      key: "emergencyContactPhone",
      label: "Emergency Contact Phone",
      type: "phone",
      required: false,
      placeholder: "+1 (555) 123-4567",
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
    // Address Section
    // ========================================
    {
      key: "addressLine1",
      label: "Address Line 1",
      type: "text",
      required: false,
      placeholder: "Street address",
    },
    {
      key: "addressLine2",
      label: "Address Line 2 (Unit/Suite)",
      type: "text",
      required: false,
      placeholder: "Apt, suite, unit, etc.",
    },
    {
      key: "city",
      label: "City",
      type: "text",
      required: false,
      placeholder: "City name",
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
      placeholder: "A1A 1A1",
    },
    {
      key: "country",
      label: "Country",
      type: "select",
      options: COUNTRIES,
      required: false,
    },

    // ========================================
    // Employment Section
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
      placeholder: "e.g., Office Manager",
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
      placeholder: "e.g., Head Office",
    },
  ],
};

export default EMPLOYEE_CREATE_FORM_CONFIG;
