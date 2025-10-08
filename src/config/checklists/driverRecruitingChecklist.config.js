/**
 * Driver Recruiting Checklist Configuration
 *
 * Configuration for the driver pre-hiring recruiting checklist tab.
 * This is the Recruiting checklist (new applicants), not the Safety checklist.
 * Drivers have 20 different items in the recruiting checklist.
 */

export const DRIVER_RECRUITING_CHECKLIST_CONFIG = {
  // Show progress indicator
  showProgress: true,

  // Checklist items (20 items - mix of files and data)
  items: [
    {
      key: "licenses",
      label: "Driver Licenses",
      optional: false,
      itemType: "file",

      fileUpload: {
        accept: "image/*,application/pdf",
        fields: [
          {
            type: "text",
            name: "number",
            label: "License Number",
            required: false,
          },
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
        edit: ["recruiting", "admin"],
        delete: ["admin"],
      },
    },

    {
      key: "abstracts",
      label: "Abstracts",
      optional: false,
      itemType: "file",

      fileUpload: {
        accept: "image/*,application/pdf",
        fields: [
          {
            type: "date",
            name: "issue_date",
            label: "Issue Date",
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
        edit: ["recruiting", "admin"],
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
        edit: ["recruiting", "admin"],
        delete: ["admin"],
      },
    },

    {
      key: "criminal_records",
      label: "Criminal Records",
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
        edit: ["recruiting", "admin"],
        delete: ["admin"],
      },
    },

    {
      key: "log_books",
      label: "Log Books from Previous Employment",
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
        edit: ["recruiting", "admin"],
        delete: ["admin"],
      },
    },

    {
      key: "activity_history",
      label: "Activity History",
      optional: false,
      itemType: "data", // Not a file, just displays activity

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
      key: "driver_background",
      label: "Driver Background",
      optional: false,
      itemType: "data", // Not a file

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
        edit: ["payroll", "payrollManager", "admin"],
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
        edit: ["payroll", "payrollManager", "admin"],
        delete: ["admin"],
      },
    },

    {
      key: "passports",
      label: "Passports",
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
        edit: ["recruiting", "admin"],
        delete: ["admin"],
      },
    },

    {
      key: "us_visas",
      label: "US Visas",
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
        edit: ["recruiting", "admin"],
        delete: ["admin"],
      },
    },

    {
      key: "incorp_docs",
      label: "Incorp Docs",
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
        edit: ["recruiting", "admin"],
        delete: ["admin"],
      },
    },

    {
      key: "gst_docs",
      label: "GST Docs",
      optional: false,
      itemType: "file",

      fileUpload: {
        accept: "image/*,application/pdf",
        fields: [
          {
            type: "text",
            name: "number",
            label: "GST Number",
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
        edit: ["recruiting", "admin"],
        delete: ["admin"],
      },
    },

    {
      key: "consents",
      label: "Consent to Personal Investigation",
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
        edit: ["recruiting", "admin"],
        delete: ["admin"],
      },
    },

    {
      key: "reference_checks",
      label: "Reference Checks",
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
        edit: ["recruiting", "admin"],
        delete: ["admin"],
      },
    },

    {
      key: "driver_prescreenings",
      label: "Driver Pre-screenings",
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
        edit: ["recruiting", "admin"],
        delete: ["admin"],
      },
    },

    {
      key: "driver_rates",
      label: "Driver Rates",
      optional: false,
      itemType: "data", // Not a file

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
      key: "knowledge_tests",
      label: "Knowledge Test",
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
        edit: ["recruiting", "admin"],
        delete: ["admin"],
      },
    },

    {
      key: "road_tests",
      label: "Road Test",
      optional: false,
      itemType: "file",

      fileUpload: {
        accept: "image/*,application/pdf",
        fields: [
          {
            type: "date",
            name: "issue_date",
            label: "Test Date",
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
        edit: ["recruiting", "admin"],
        delete: ["admin"],
      },
    },

    {
      key: "prehire_quizes",
      label: "Pre-hire Quizzes",
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
        edit: ["recruiting", "admin"],
        delete: ["admin"],
      },
    },

    {
      key: "employment_contracts",
      label: "Employment Contract",
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
        edit: ["recruiting", "admin"],
        delete: ["admin"],
      },
    },
  ],

  // Completion action (move to trainee when all required items checked)
  completionAction: {
    type: "status-change",
    from: "RO",
    to: "TR",
    label: "Set To Trainee",
    endpoint: "/api/upload-driver-data",
  },
};

export default DRIVER_RECRUITING_CHECKLIST_CONFIG;
