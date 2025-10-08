/**
 * Driver Safety Checklist Configuration
 *
 * Configuration for the driver post-hiring safety checklist tab.
 * This is the Safety checklist (active drivers), not the Recruiting checklist.
 * Drivers have 16 different document types in the safety checklist.
 */

export const DRIVER_SAFETY_CHECKLIST_CONFIG = {
  // Show progress indicator
  showProgress: true,

  // Checklist items (16 file types)
  items: [
    // Required items
    {
      key: "tdg_cards",
      label: "TDG Card",
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
        edit: ["safety", "admin"],
        delete: ["admin"],
      },
    },

    {
      key: "good_to_go_cards",
      label: "GTG Cards",
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
        edit: ["safety", "admin"],
        delete: ["admin"],
      },
    },

    {
      key: "lcv_certificates",
      label: "LCV Certificate",
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
        edit: ["safety", "admin"],
        delete: ["admin"],
      },
    },

    {
      key: "lcv_licenses",
      label: "LCV License",
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
        edit: ["safety", "admin"],
        delete: ["admin"],
      },
    },

    {
      key: "abstract_request_forms",
      label: "Abstract Request Form",
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
        edit: ["safety", "admin"],
        delete: ["admin"],
      },
    },

    {
      key: "driver_memos",
      label: "Driver Memos",
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
        edit: ["safety", "admin"],
        delete: ["admin"],
      },
    },

    {
      key: "gtg_quizes",
      label: "GTG Quiz",
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
        edit: ["safety", "admin"],
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
        edit: ["payroll", "payrollManager", "admin"],
        delete: ["admin"],
      },
    },

    {
      key: "mentor_forms",
      label: "Mentor Form",
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
        edit: ["safety", "admin"],
        delete: ["admin"],
      },
    },

    // Optional items
    {
      key: "ctpat_papers",
      label: "CTPAT Memo",
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
        edit: ["safety", "admin"],
        delete: ["admin"],
      },
    },

    {
      key: "ctpat_quiz",
      label: "CTPAT Quiz",
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
        edit: ["safety", "admin"],
        delete: ["admin"],
      },
    },

    {
      key: "winter_courses",
      label: "Winter Courses",
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
        edit: ["safety", "admin"],
        delete: ["admin"],
      },
    },

    {
      key: "annual_performance_reviews",
      label: "Annual Performance Review",
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
        edit: ["safety", "admin"],
        delete: ["admin"],
      },
    },

    {
      key: "certificates_of_violations",
      label: "Certificates of Violations",
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
        edit: ["safety", "admin"],
        delete: ["admin"],
      },
    },

    {
      key: "pdic_certificates",
      label: "PDIC Certificate",
      optional: true,
      itemType: "file",

      fileUpload: {
        accept: "image/*,application/pdf",
        fields: [
          {
            type: "text",
            name: "number",
            label: "Certificate Number",
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
        edit: ["safety", "admin"],
        delete: ["admin"],
      },
    },

    {
      key: "driver_statements",
      label: "Driver Statements",
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
        edit: ["safety", "admin"],
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
        edit: ["safety", "admin"],
        delete: ["admin"],
      },
    },
  ],

  // Completion action (activate driver when all required items checked)
  completionAction: {
    type: "status-change",
    from: "TR",
    to: "AC",
    label: "Set To Active",
    endpoint: "/api/upload-driver-data",
  },
};

export default DRIVER_SAFETY_CHECKLIST_CONFIG;
