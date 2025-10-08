import {
  TERMINAL_CHOICES,
  EQUIPMENT_TYPE_CHOICES,
  OWNEDBY_CHOICES_EQUIPMENT,
  EQUIPMENT_STATUS_CHOICES,
} from "@/config/clientData";
import { EQUIPMENT_EDIT_FORM_CONFIG } from "@/config/forms/equipmentEditForm.config";

/**
 * Equipment General Info Tab Configuration
 *
 * Configuration for the equipment general info tab.
 * Almost identical to truck general info, but with equipment-specific fields.
 */

export const EQUIPMENT_GENERAL_INFO_CONFIG = {
  // Edit form configuration
  editFormConfig: EQUIPMENT_EDIT_FORM_CONFIG,

  // Image configuration
  image: {
    src: (entityData) => `/equipment_photos/${entityData.equipment_type}.jpg`,
    alt: "Equipment Photo",
    width: 300,
    height: 200,
    additionalInfo: [
      {
        label: "Owned by",
        value: (entityData) => OWNEDBY_CHOICES_EQUIPMENT[entityData.owned_by] || "N/A",
      },
      {
        label: "Type",
        value: (entityData) => EQUIPMENT_TYPE_CHOICES[entityData.equipment_type] || "N/A",
      },
    ],
  },

  // Status badge configuration
  statusConfig: {
    statusChoices: EQUIPMENT_STATUS_CHOICES,
    editable: true,
  },

  // Field sections (all READ-ONLY - edit via modal only)
  sections: [
    {
      fields: [
        {
          key: "unit_number",
          label: "Unit Number",
          type: "text",
          editable: false,
        },
        {
          key: "equipment_license_plates",
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
          editable: false,
        },
        {
          key: "model",
          label: "Model",
          type: "text",
          editable: false,
        },
        {
          key: "vin",
          label: "VIN",
          type: "text",
          editable: false,
        },
        {
          key: "year",
          label: "Year",
          type: "number",
          editable: false,
        },
        {
          key: "terminal",
          label: "Terminal",
          type: "select",
          editable: false,
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
          editable: false,
          formatter: (value) => value ? `$${parseFloat(value).toLocaleString()}` : "N/A",
        },
        {
          key: "remarks",
          label: "Remarks",
          type: "textarea",
          editable: false,
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
          key: "equipment_license_plates",
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
          key: "equipment_safety_docs",
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
      ],
    },
    {
      title: "Additional Documents",
      defaultOpen: false,
      items: [
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
    },
  ],
};

export default EQUIPMENT_GENERAL_INFO_CONFIG;
