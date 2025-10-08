import {
  TERMINAL_CHOICES,
  EQUIPMENT_TYPE_CHOICES,
  OWNEDBY_CHOICES_EQUIPMENT,
} from "@/config/clientData";

/**
 * Equipment Checklist Configuration
 *
 * Configuration for the equipment checklist tab in the Universal Card system.
 * Almost identical to truck checklist, but with equipment-specific field names.
 */

export const EQUIPMENT_CHECKLIST_CONFIG = {
  // Show progress indicator
  showProgress: true,

  // Checklist items
  items: [
    // Data fields (inline editable)
    {
      key: "unit_number",
      label: "Unit Number",
      itemType: "data",
      optional: false,
      dataField: { type: "number", required: true },
      actions: { editable: true },
      roles: { view: ["all"], edit: ["safety", "admin", "shop"] },
    },
    {
      key: "make",
      label: "Make",
      itemType: "data",
      optional: false,
      dataField: { type: "text", required: true },
      actions: { editable: true },
      roles: { view: ["all"], edit: ["safety", "admin", "shop"] },
    },
    {
      key: "model",
      label: "Model",
      itemType: "data",
      optional: false,
      dataField: { type: "text", required: true },
      actions: { editable: true },
      roles: { view: ["all"], edit: ["safety", "admin", "shop"] },
    },
    {
      key: "vin",
      label: "VIN",
      itemType: "data",
      optional: false,
      dataField: { type: "text", required: true },
      actions: { editable: true },
      roles: { view: ["all"], edit: ["safety", "admin", "shop"] },
    },
    {
      key: "year",
      label: "Year",
      itemType: "data",
      optional: false,
      dataField: { type: "number", required: true },
      actions: { editable: true },
      roles: { view: ["all"], edit: ["safety", "admin", "shop"] },
    },
    {
      key: "terminal",
      label: "Terminal",
      itemType: "data",
      optional: false,
      dataField: {
        type: "select",
        required: true,
        options: TERMINAL_CHOICES,
      },
      actions: { editable: true },
      roles: { view: ["all"], edit: ["safety", "admin", "shop"] },
    },
    {
      key: "value_in_cad",
      label: "Value In CAD",
      itemType: "data",
      optional: false,
      dataField: { type: "number", required: true },
      actions: { editable: true },
      roles: { view: ["all"], edit: ["safety", "admin", "shop"] },
    },
    {
      key: "equipment_type",
      label: "Equipment Type",
      itemType: "data",
      optional: false,
      dataField: {
        type: "select",
        required: true,
        options: EQUIPMENT_TYPE_CHOICES,
      },
      actions: { editable: true },
      roles: { view: ["all"], edit: ["safety", "admin", "shop"] },
    },
    {
      key: "owned_by",
      label: "Owned By",
      itemType: "data",
      optional: false,
      dataField: {
        type: "select",
        required: true,
        options: OWNEDBY_CHOICES_EQUIPMENT,
      },
      actions: { editable: true },
      roles: { view: ["all"], edit: ["safety", "admin", "shop"] },
    },
    {
      key: "remarks",
      label: "Remarks",
      itemType: "data",
      optional: true,
      dataField: { type: "textarea", required: false },
      actions: { editable: true },
      roles: { view: ["all"], edit: ["safety", "admin", "shop"] },
    },

    // File fields (with review checkboxes)
    {
      key: "equipment_license_plates",
      label: "License Plate",
      optional: false,
      itemType: "file",

      fileUpload: {
        accept: "image/*,application/pdf",
        fields: [
          {
            type: "text",
            name: "plate_number",
            label: "Plate Number",
            required: true,
          },
          {
            type: "date",
            name: "expiry_date",
            label: "Expiry Date",
            required: true,
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
        edit: ["safety", "admin", "shop"],
        delete: ["safety", "admin"],
      },
    },

    {
      key: "equipment_safety_docs",
      label: "Safety",
      optional: false,
      itemType: "file",

      fileUpload: {
        accept: "image/*,application/pdf",
        fields: [
          {
            type: "date",
            name: "expiry_date",
            label: "Expiry Date",
            required: true,
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
        edit: ["safety", "admin", "shop"],
        delete: ["safety", "admin"],
      },
    },

    {
      key: "equipment_registration_docs",
      label: "Registration",
      optional: false,
      itemType: "file",

      fileUpload: {
        accept: "image/*,application/pdf",
        fields: [
          {
            type: "date",
            name: "expiry_date",
            label: "Expiry Date",
            required: true,
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
        edit: ["safety", "admin", "shop"],
        delete: ["safety", "admin"],
      },
    },

    {
      key: "equipment_bill_of_sales",
      label: "Bill of Sale",
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
        edit: ["safety", "admin", "shop"],
        delete: ["safety", "admin"],
      },
    },

    {
      key: "equipment_other_documents",
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
        edit: ["safety", "admin", "shop"],
        delete: ["safety", "admin"],
      },
    },
  ],

  // Completion action (shown when all required items are checked)
  completionAction: {
    type: "status-change",
    from: "NW",
    to: "AC",
    label: "Set To Active",
    endpoint: "/api/upload-equipment-data",
  },
};

export default EQUIPMENT_CHECKLIST_CONFIG;
