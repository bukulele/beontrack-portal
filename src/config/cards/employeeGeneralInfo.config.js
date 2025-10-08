import {
  STATUS_CHOICES,
  DEPARTMENT_CHOICES,
  CANADIAN_PROVINCES,
} from "@/config/clientData";
import { EMPLOYEE_EDIT_FORM_CONFIG } from "@/config/forms/employeeEditForm.config";

/**
 * Employee General Info Tab Configuration
 *
 * Configuration for the employee general info tab.
 */

export const EMPLOYEE_GENERAL_INFO_CONFIG = {
  // Edit form configuration
  editFormConfig: EMPLOYEE_EDIT_FORM_CONFIG,

  // Image configuration (employee photo)
  image: {
    src: (entityData) => `/employee_photos/${entityData.id}.jpg`,
    alt: "Employee Photo",
    width: 200,
    height: 200,
    additionalInfo: [
      {
        label: "Department",
        value: (entityData) => DEPARTMENT_CHOICES[entityData.department] || "N/A",
      },
      {
        label: "Employee Since",
        value: (entityData) => {
          if (!entityData.application_date) return "N/A";
          return new Date(entityData.application_date).toLocaleDateString();
        },
      },
    ],
  },

  // Status badge configuration
  statusConfig: {
    statusChoices: STATUS_CHOICES,
    editable: true,
  },

  // Field sections (all READ-ONLY - edit via modal)
  sections: [
    {
      title: "Personal Information",
      fields: [
        {
          key: "employee_id",
          label: "Employee ID",
          type: "text",
          editable: false,
        },
        {
          key: "card_number",
          label: "Card Number",
          type: "text",
          editable: false,
        },
        {
          key: "first_name",
          label: "First Name",
          type: "text",
          editable: false,
        },
        {
          key: "last_name",
          label: "Last Name",
          type: "text",
          editable: false,
        },
        {
          key: "date_of_birth",
          label: "Date of Birth",
          type: "date",
          editable: false,
          formatter: (value) => {
            if (!value) return "N/A";
            const age = Math.floor((Date.now() - new Date(value).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
            return `${new Date(value).toLocaleDateString()} (${age} years old)`;
          },
        },
        {
          key: "phone_number",
          label: "Phone Number",
          type: "phone",
          editable: false,
        },
        {
          key: "email",
          label: "Email",
          type: "email",
          editable: false,
        },
        {
          key: "department",
          label: "Department",
          type: "select",
          editable: false,
          selectOptions: DEPARTMENT_CHOICES,
        },
      ],
    },
    {
      title: "Address",
      fields: [
        {
          key: "address",
          label: "Full Address",
          type: "text",
          editable: false,
          formatter: (value, entityData) => {
            const parts = [
              entityData.street_number,
              entityData.street,
              entityData.unit_or_suite ? `Unit ${entityData.unit_or_suite}` : null,
              entityData.city,
              CANADIAN_PROVINCES[entityData.province],
              entityData.postal_code,
            ].filter(Boolean);
            return parts.join(", ") || "N/A";
          },
        },
      ],
    },
    {
      title: "Emergency Contact",
      fields: [
        {
          key: "emergency_contact",
          label: "Emergency Contact Name",
          type: "text",
          editable: false,
        },
        {
          key: "emergency_phone",
          label: "Emergency Phone",
          type: "phone",
          editable: false,
        },
      ],
    },
  ],

  // File sections - reuse checklist item configs for most important docs
  fileSections: [
    {
      title: "Essential Documents",
      defaultOpen: true,
      items: [
        {
          key: "id_documents",
          label: "ID Documents",
          optional: false,
          itemType: "file",

          fileUpload: {
            accept: "image/*,application/pdf",
            fields: [
              {
                type: "textarea",
                name: "comment",
                label: "Comment",
                required: false,
              },
            ],
          },

          actions: {
            checkable: true,
            uploadable: true,
            editable: true,
            deletable: true,
          },

          roles: {
            view: ["all"],
            edit: ["recruiting", "admin", "portalHr"],
            delete: ["admin"],
          },
        },
        {
          key: "sin",
          label: "SIN",
          optional: false,
          itemType: "file",

          fileUpload: {
            accept: "image/*,application/pdf",
            fields: [
              {
                type: "number",
                name: "number",
                label: "Document Number",
                required: false,
                max: 9,
              },
            ],
          },

          actions: {
            checkable: true,
            uploadable: true,
            editable: true,
            deletable: true,
          },

          roles: {
            view: ["all"],
            edit: ["payroll", "payrollManager", "admin", "portalHr"],
            delete: ["admin"],
          },
        },
        {
          key: "void_check",
          label: "Void Check",
          optional: false,
          itemType: "file",

          fileUpload: {
            accept: "image/*,application/pdf",
            fields: [
              {
                type: "textarea",
                name: "comment",
                label: "Comment",
                required: false,
              },
            ],
          },

          actions: {
            checkable: true,
            uploadable: true,
            editable: true,
            deletable: true,
          },

          roles: {
            view: ["all"],
            edit: ["payroll", "payrollManager", "admin", "portalHr"],
            delete: ["admin"],
          },
        },
      ],
    },
  ],
};

export default EMPLOYEE_GENERAL_INFO_CONFIG;
