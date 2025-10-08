/**
 * Employee Checklist Configuration
 *
 * Configuration for the employee checklist tab.
 * Employees have 13 different document types to track.
 */

export const EMPLOYEE_CHECKLIST_CONFIG = {
  // Show progress indicator
  showProgress: true,

  // Checklist items (13 file types)
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
      key: "immigration_doc",
      label: "Immigration Docs",
      optional: false,
      itemType: "file",

      fileUpload: {
        accept: "image/*,application/pdf",
        fields: [
          {
            type: "date",
            name: "expiry_date",
            label: "Expiry Date",
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
      key: "activity_history",
      label: "Activity History",
      optional: false,
      itemType: "data", // Not a file upload, just displays activity

      actions: {
        checkable: false,
        uploadable: false,
        editable: false,
        deletable: false,
      },

      roles: {
        view: ["all"],
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

    {
      key: "employee_memos",
      label: "Employee Memos",
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
        edit: ["admin", "portalHr"],
        delete: ["admin"],
      },
    },

    {
      key: "tax_papers",
      label: "Tax Papers",
      optional: false,
      itemType: "file",

      fileUpload: {
        accept: "image/*,application/pdf",
        fields: [
          {
            type: "text",
            name: "number",
            label: "Document Number",
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

    {
      key: "employee_ctpat_papers",
      label: "CTPAT Papers",
      optional: true,
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
      key: "consents",
      label: "Consent to Personal Investigation",
      optional: true,
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
      key: "employment_contracts",
      label: "Employment Contract",
      optional: true,
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
      key: "passports",
      label: "Passports",
      optional: true,
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
      key: "us_visas",
      label: "US Visas",
      optional: true,
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
      key: "employee_resumes",
      label: "Resumes",
      optional: true,
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
      key: "other_documents",
      label: "Other Documents",
      optional: true,
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
  ],

  // No completion action for employees
  completionAction: null,
};

export default EMPLOYEE_CHECKLIST_CONFIG;
