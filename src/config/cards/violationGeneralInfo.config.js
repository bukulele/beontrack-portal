import { VIOLATION_STATUS_CHOICES } from "@/config/clientData";
import { VIOLATION_EDIT_FORM_CONFIG } from "@/config/forms/violationEditForm.config";

/**
 * Violation General Info Tab Configuration
 */

export const VIOLATION_GENERAL_INFO_CONFIG = {
  // Edit form configuration
  editFormConfig: VIOLATION_EDIT_FORM_CONFIG,

  // No image for violations
  image: null,

  // Status badge configuration
  statusConfig: {
    statusChoices: VIOLATION_STATUS_CHOICES,
    editable: true,
  },

  // Field sections (all READ-ONLY - edit via modal)
  sections: [
    {
      title: "Violation Information",
      fields: [
        {
          key: "violation_number",
          label: "Violation #",
          type: "text",
          editable: false,
        },
        {
          key: "assigned_to",
          label: "Assigned To",
          type: "text",
          editable: false,
        },
        {
          key: "date_time",
          label: "Date & Time",
          type: "datetime",
          editable: false,
        },
        {
          key: "city",
          label: "City",
          type: "text",
          editable: false,
        },
        {
          key: "province",
          label: "Province / State",
          type: "text",
          editable: false,
        },
        {
          key: "country",
          label: "Country",
          type: "text",
          editable: false,
        },
        {
          key: "violation_details",
          label: "Violation Details",
          type: "textarea",
          editable: false,
        },
      ],
    },
    {
      title: "Driver & Vehicle",
      fields: [
        {
          key: "main_driver_id",
          label: "Main Driver",
          type: "text",
          editable: false,
          formatter: (value, entityData, contexts) => {
            if (!value) return "N/A";
            const { hiredDriversList } = contexts;
            if (!hiredDriversList || !hiredDriversList[value]) return "N/A";
            const driver = hiredDriversList[value];
            return `${driver.first_name || ""} ${driver.last_name || ""} ${driver.driver_id || ""}`.trim();
          },
          linkTo: {
            type: "driver",
            idField: "main_driver_id",
          },
        },
        {
          key: "truck",
          label: "Truck",
          type: "text",
          editable: false,
          formatter: (value, entityData, contexts) => {
            if (!value) return "N/A";
            const { activeTrucksList } = contexts;
            if (!activeTrucksList || !activeTrucksList[value]) return "N/A";
            return activeTrucksList[value].unit_number || "N/A";
          },
          linkTo: {
            type: "truck",
            idField: "truck",
          },
        },
        {
          key: "truck_violation",
          label: "Truck Violation",
          type: "textarea",
          editable: false,
        },
        {
          key: "trailer_1_unit_number",
          label: "Trailer 1 Unit #",
          type: "text",
          editable: false,
        },
        {
          key: "trailer_1_violation",
          label: "Trailer 1 Violation",
          type: "textarea",
          editable: false,
        },
      ],
    },
  ],

  // File sections
  fileSections: [
    {
      title: "Documents",
      defaultOpen: true,
      items: [
        {
          key: "violation_documents",
          label: "Violation Documents",
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
            checkable: false,
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

export default VIOLATION_GENERAL_INFO_CONFIG;
