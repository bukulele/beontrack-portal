import {
  STATUS_CHOICES,
  DEPARTMENT_CHOICES,
  IMMIGRATION_STATUS,
  UPDATE_STATUS_CHOICES_EMPLOYEE,
  TERMINAL_CHOICES,
} from "@/config/clientData";
import { EMPLOYEE_EDIT_FORM_CONFIG } from "@/config/forms/employeeEditForm.config";

/**
 * Employee General Info Tab Configuration
 *
 * Matches OLD EMPLOYEE_COMMON_CHECKLIST from tableData.js (lines 589-674)
 * Employee documents are DIFFERENT from driver documents!
 */

export const EMPLOYEE_GENERAL_INFO_CONFIG = {
  // Edit form configuration
  editFormConfig: EMPLOYEE_EDIT_FORM_CONFIG,

  // Image configuration (employee photo)
  image: {
    src: (entityData) => entityData.employee_photo?.file || "/no_photo_driver.png",
    alt: "Employee Photo",
    width: 200,
    height: 300,
    // Data shown BELOW photo
    additionalInfo: [
      {
        // Immigration Status
        value: (entityData) => IMMIGRATION_STATUS[entityData.immigration_status] || "N/A",
        bold: true,
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
        },
      ],
    },
  ],

  // File sections - READ-ONLY display in General tab
  // 3 sections matching OLD EmployeeCardData.js structure
  // BUT only including documents from EMPLOYEE_COMMON_CHECKLIST (14 items total)
  fileSections: [
    {
      title: "Docs & Dates",
      defaultOpen: true,
      items: [
        {
          key: "immigration_doc",
          label: "Immigration Docs",
          optional: false,
          itemType: "file",
        },
      ],
    },
    {
      title: "HR & Recruiting",
      defaultOpen: false,
      items: [
        {
          key: "id_documents",
          label: "ID Documents",
          optional: false,
          itemType: "file",
        },
        {
          key: "activity_history",
          label: "Activity History",
          optional: false,
          itemType: "data",
        },
        {
          key: "consents",
          label: "Consent to Personal Investigation",
          optional: true,
          itemType: "file",
        },
        {
          key: "employment_contracts",
          label: "Employment Contract",
          optional: true,
          itemType: "file",
        },
        {
          key: "passports",
          label: "Passports",
          optional: true,
          itemType: "file",
        },
        {
          key: "us_visas",
          label: "US Visas",
          optional: true,
          itemType: "file",
        },
        {
          key: "employee_resumes",
          label: "Resumes",
          optional: true,
          itemType: "file",
        },
        {
          key: "employee_memos",
          label: "Employee Memos",
          optional: false,
          itemType: "file",
        },
        {
          key: "employee_ctpat_papers",
          label: "CTPAT Papers",
          optional: true,
          itemType: "file",
        },
        {
          key: "other_documents",
          label: "Other Documents",
          optional: true,
          itemType: "file",
        },
      ],
    },
    {
      title: "Payroll",
      defaultOpen: false,
      items: [
        {
          key: "sin",
          label: "SIN",
          optional: false,
          itemType: "file",
        },
        {
          key: "void_check",
          label: "Void Check",
          optional: false,
          itemType: "file",
        },
        {
          key: "tax_papers",
          label: "Tax Papers",
          optional: false,
          itemType: "file",
        },
      ],
    },
  ],
};

export default EMPLOYEE_GENERAL_INFO_CONFIG;
