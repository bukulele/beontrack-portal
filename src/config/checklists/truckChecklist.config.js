/**
 * Truck Checklist Configuration
 *
 * Configuration for the truck checklist tab in the Universal Card system.
 * This replaces the old TruckChecklist component with a configuration-driven approach.
 */

export const TRUCK_CHECKLIST_CONFIG = {
  // Show progress indicator
  showProgress: true,

  // Checklist items
  items: [
    {
      key: "truck_license_plates",
      label: "License Plate",
      optional: false,

      // This is a data-only item (no file upload, just plate number + expiry)
      itemType: "data",

      // File upload configuration (even though file is off, we still upload data)
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

      // Actions available for this item
      actions: {
        checkable: true,
        uploadable: true,
        editable: true,
        deletable: true,
      },

      // Role-based permissions
      roles: {
        view: ["all"],
        edit: ["safety", "admin", "shop"],
        delete: ["safety", "admin"],
      },
    },

    {
      key: "truck_safety_docs",
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
      key: "truck_registration_docs",
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
      key: "truck_bill_of_sales",
      label: "Bill of Sale",
      optional: true,
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
      key: "truck_other_documents",
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
    endpoint: "/api/upload-truck-data",
  },
};

export default TRUCK_CHECKLIST_CONFIG;
