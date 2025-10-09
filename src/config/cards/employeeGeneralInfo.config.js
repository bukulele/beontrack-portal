import {
  STATUS_CHOICES,
  DEPARTMENT_CHOICES,
  CANADIAN_PROVINCES,
  IMMIGRATION_STATUS,
  UPDATE_STATUS_CHOICES_EMPLOYEE,
  TERMINAL_CHOICES,
} from "@/config/clientData";
import { EMPLOYEE_EDIT_FORM_CONFIG } from "@/config/forms/employeeEditForm.config";

/**
 * Employee General Info Tab Configuration
 *
 * Matches OLD EmployeeCardInfo.js structure (lines 449-701)
 */

export const EMPLOYEE_GENERAL_INFO_CONFIG = {
  // Edit form configuration
  editFormConfig: EMPLOYEE_EDIT_FORM_CONFIG,

  // Image configuration (employee photo)
  image: {
    src: (entityData) => `/employee_photos/${entityData.id}.jpg`,
    alt: "Employee Photo",
    width: 200,
    height: 300,
    // Data shown BELOW photo (from OLD card line 449)
    additionalInfo: [
      {
        // Immigration Status
        value: (entityData) => IMMIGRATION_STATUS[entityData.immigration_status] || "N/A",
      },
    ],
  },

  // Status badge configuration
  statusConfig: {
    statusChoices: STATUS_CHOICES,
    editable: true,
    // Employee has TWO status dropdowns: update_status + status
    updateStatus: UPDATE_STATUS_CHOICES_EMPLOYEE,
  },

  // Field sections - ONE SECTION, NO TITLE (flat list)
  // Field order from OLD EmployeeCardInfo.js lines 453-701
  sections: [
    {
      // NO title property!
      fields: [
        {
          key: "employee_id",
          label: "Employee ID",
          type: "text",
          editable: false,
        },
        {
          key: "card_number",
          label: "Card #",
          type: "text",
          editable: false,
          actions: ["copy"],
        },
        {
          key: "name",
          label: "Name",
          type: "computed",
          editable: false,
          formatter: (value, entityData) => `${entityData.first_name} ${entityData.last_name}`,
          actions: ["copy"],
        },
        {
          key: "phone_number",
          label: "Phone",
          type: "phone",
          editable: false,
          formatter: (value) => value ? `+1 ${value.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')}` : "N/A",
          actions: ["whatsapp", "call", "copy"],
        },
        {
          key: "emergency_contact",
          label: "Emergency contact",
          type: "text",
          editable: false,
          actions: ["copy"],
        },
        {
          key: "emergency_phone",
          label: "Emergency phone",
          type: "phone",
          editable: false,
          formatter: (value) => value ? `+1 ${value.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')}` : "N/A",
          actions: ["call", "copy"],
        },
        {
          key: "email",
          label: "Email",
          type: "email",
          editable: false,
          actions: ["email", "copy"],
        },
        {
          key: "address",
          label: "Address",
          type: "computed",
          editable: false,
          formatter: (value, entityData) => {
            const parts = [
              entityData.unit_or_suite,
              entityData.street_number,
              entityData.street,
              entityData.city,
              entityData.province,
              entityData.postal_code,
            ].filter(Boolean);
            return parts.join(", ") || "N/A";
          },
          actions: ["copy"],
        },
        {
          key: "date_of_birth",
          label: "Date of Birth",
          type: "date",
          editable: false,
          sideInfo: (entityData) => {
            if (!entityData.date_of_birth) return null;
            const age = Math.floor((Date.now() - new Date(entityData.date_of_birth).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
            return `Age: ${age}`;
          },
        },
        {
          key: "terminal",
          label: "Terminal",
          type: "select",
          editable: false,
          selectOptions: TERMINAL_CHOICES,
          sideInfo: (entityData) => {
            // Title | Department display
            const title = entityData.title || "";
            const dept = DEPARTMENT_CHOICES[entityData.department] || "";
            if (title && dept) return `${title} | ${dept}`;
            if (title) return title;
            if (dept) return dept;
            return null;
          },
        },
        {
          key: "hiring_date",
          label: "Hiring Date",
          type: "date",
          editable: false,
          formatter: (value, entityData) => {
            // TODO: Add time passed calculation like OLD card
            return value;
          },
        },
        {
          key: "date_of_leaving",
          label: "Leaving Date",
          type: "date",
          editable: false,
          conditional: (entityData) => {
            return entityData.date_of_leaving &&
                   (entityData.status === "RE" || entityData.status === "TE");
          },
          formatter: (value, entityData) => {
            // TODO: Add time passed calculation
            return value;
          },
        },
      ],
    },
  ],

  // File sections - essential docs in general tab
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
