import {
  STATUS_CHOICES,
  CANADIAN_PROVINCES,
} from "@/config/clientData";
import { DRIVER_EDIT_FORM_CONFIG } from "@/config/forms/driverEditForm.config";

/**
 * Driver General Info Tab Configuration
 */

export const DRIVER_GENERAL_INFO_CONFIG = {
  // Edit form configuration
  editFormConfig: DRIVER_EDIT_FORM_CONFIG,

  // Image configuration (driver photo)
  image: {
    src: (entityData) => `/driver_photos/${entityData.id}.jpg`,
    alt: "Driver Photo",
    width: 200,
    height: 200,
    additionalInfo: [
      {
        label: "Driver Since",
        value: (entityData) => {
          if (!entityData.application_date) return "N/A";
          return new Date(entityData.application_date).toLocaleDateString();
        },
      },
      {
        label: "Experience",
        value: (entityData) => {
          if (!entityData.application_date) return "N/A";
          const years = Math.floor((Date.now() - new Date(entityData.application_date).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
          return `${years} years`;
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
          key: "driver_id",
          label: "Driver ID",
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

  // File sections - show key safety documents in general tab
  fileSections: [
    {
      title: "Key Documents",
      defaultOpen: true,
      items: [
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
      ],
    },
  ],
};

export default DRIVER_GENERAL_INFO_CONFIG;
