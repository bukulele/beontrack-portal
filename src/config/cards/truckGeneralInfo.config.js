import {
  TRUCK_STATUS_CHOICES,
  VEHICLE_TYPE_CHOICES,
  TERMINAL_CHOICES,
  OWNEDBY_CHOICES_TRUCKS,
} from "@/app/assets/tableData";

/**
 * Truck General Info Tab Configuration
 *
 * Configuration for the full-featured general info tab with:
 * - Inline editing for fields
 * - Editable status badge
 * - File sections (reusing checklist items)
 * - Image display
 */

export const TRUCK_GENERAL_INFO_CONFIG = {
  // Image configuration
  image: {
    src: (entityData) => `/truck_photos/${entityData.vehicle_type}.jpg`,
    alt: "Truck Photo",
    width: 300,
    height: 200,
    additionalInfo: [
      {
        label: "Owned by",
        value: (entityData) => OWNEDBY_CHOICES_TRUCKS[entityData.owned_by] || "N/A",
      },
      {
        label: "Type",
        value: (entityData) => VEHICLE_TYPE_CHOICES[entityData.vehicle_type] || "N/A",
      },
    ],
  },

  // Status badge configuration
  statusConfig: {
    statusChoices: TRUCK_STATUS_CHOICES,
    editable: true, // Can change status if not "NW"
  },

  // Field sections
  sections: [
    {
      fields: [
        {
          key: "unit_number",
          label: "Unit Number",
          type: "text",
          editable: false, // Primary identifier, not editable
        },
        {
          key: "truck_license_plates",
          label: "License Plates",
          type: "text",
          editable: false,
          formatter: (value) => {
            if (!value || !Array.isArray(value) || value.length === 0) return "N/A";
            const latest = value.reduce((prev, current) =>
              (prev.id > current.id) ? prev : current
            );
            return latest.plate_number || "N/A";
          },
        },
        {
          key: "make",
          label: "Make",
          type: "text",
          editable: true,
        },
        {
          key: "model",
          label: "Model",
          type: "text",
          editable: true,
        },
        {
          key: "vin",
          label: "VIN",
          type: "text",
          editable: true,
        },
        {
          key: "year",
          label: "Year",
          type: "number",
          editable: true,
        },
        {
          key: "terminal",
          label: "Terminal",
          type: "select",
          editable: true,
          selectOptions: TERMINAL_CHOICES,
        },
        {
          key: "driver",
          label: "Driver",
          type: "text",
          editable: false,
          formatter: (value, entityData) => {
            // Only show driver field if owned_by === "OO"
            if (entityData.owned_by !== "OO") return null;
            if (!value) return "N/A";
            return value;
          },
        },
        {
          key: "value_in_cad",
          label: "Value (CAD)",
          type: "number",
          editable: true,
          formatter: (value) => value ? `$${parseFloat(value).toLocaleString()}` : "N/A",
        },
        {
          key: "remarks",
          label: "Remarks",
          type: "textarea",
          editable: true,
        },
      ],
    },
  ],

  // File sections - reuse checklist item configs
  fileSections: [
    {
      title: "Documents & Expiry Dates",
      defaultOpen: true,
      items: [
        {
          key: "truck_license_plates",
          label: "License Plate",
          optional: false,
          itemType: "data",

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
          key: "truck_safety_docs",
          label: "Safety Certificate",
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
      ],
    },
    {
      title: "Additional Documents",
      defaultOpen: false,
      items: [
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
    },
  ],
};

export default TRUCK_GENERAL_INFO_CONFIG;
