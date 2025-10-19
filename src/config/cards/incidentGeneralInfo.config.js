import { INCIDENT_STATUS_CHOICES } from "@/config/clientData";
import { INCIDENT_EDIT_FORM_CONFIG } from "@/config/forms/incidentEditForm.config";

/**
 * Incident General Info Tab Configuration
 */

export const INCIDENT_GENERAL_INFO_CONFIG = {
  // Edit form configuration
  editFormConfig: INCIDENT_EDIT_FORM_CONFIG,

  // No image for incidents
  image: null,

  // Status badge configuration
  statusConfig: {
    statusChoices: INCIDENT_STATUS_CHOICES,
    editable: true,
  },

  // Field sections - ONE SECTION, NO TITLE (flat list)
  // Merged all fields from 3 sections into 1
  sections: [
    {
      // NO title property!
      fields: [
        {
          key: "incident_number",
          label: "Incident #",
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
          key: "location",
          label: "Location",
          type: "text",
          editable: false,
        },
        {
          key: "incident_details",
          label: "Incident Details",
          type: "textarea",
          editable: false,
        },
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
          key: "main_driver_injury",
          label: "Main Driver Injured",
          type: "boolean",
          editable: false,
        },
        {
          key: "co_driver_id",
          label: "Co-Driver",
          type: "text",
          editable: false,
          formatter: (value, entityData, contexts) => {
            if (!value) return null;
            const { hiredDriversList } = contexts;
            if (!hiredDriversList || !hiredDriversList[value]) return "N/A";
            const driver = hiredDriversList[value];
            return `${driver.first_name || ""} ${driver.last_name || ""} ${driver.driver_id || ""}`.trim();
          },
          linkTo: {
            type: "driver",
            idField: "co_driver_id",
          },
        },
        {
          key: "co_driver_injury",
          label: "Co-Driver Injured",
          type: "boolean",
          editable: false,
          formatter: (value, entityData) => {
            if (!entityData.co_driver_id) return null;
            return value;
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
          key: "trailer_1_unit_number",
          label: "Trailer 1 Unit #",
          type: "text",
          editable: false,
        },
        {
          key: "trailer_1_damage",
          label: "Trailer 1 Damage",
          type: "textarea",
          editable: false,
        },
        {
          key: "trailer_2_unit_number",
          label: "Trailer 2 Unit #",
          type: "text",
          editable: false,
        },
        {
          key: "trailer_2_damage",
          label: "Trailer 2 Damage",
          type: "textarea",
          editable: false,
        },
        {
          key: "cargo_1_bol_po_number",
          label: "Cargo 1 BOL/PO",
          type: "text",
          editable: false,
        },
        {
          key: "cargo_1_commodity",
          label: "Cargo 1 Commodity",
          type: "text",
          editable: false,
        },
        {
          key: "cargo_1_damage",
          label: "Cargo 1 Damage",
          type: "textarea",
          editable: false,
        },
        {
          key: "cargo_2_bol_po_number",
          label: "Cargo 2 BOL/PO",
          type: "text",
          editable: false,
        },
        {
          key: "cargo_2_commodity",
          label: "Cargo 2 Commodity",
          type: "text",
          editable: false,
        },
        {
          key: "cargo_2_damage",
          label: "Cargo 2 Damage",
          type: "textarea",
          editable: false,
        },
        {
          key: "trailer_1_license_plate",
          label: "Trailer 1 License Plate",
          type: "text",
          editable: false,
        },
        {
          key: "trailer_2_license_plate",
          label: "Trailer 2 License Plate",
          type: "text",
          editable: false,
        },
        {
          key: "converter_unit_number",
          label: "Converter Unit Number",
          type: "text",
          editable: false,
        },
        {
          key: "converter_damage",
          label: "Converter Damage",
          type: "textarea",
          editable: false,
        },
        {
          key: "police_involved",
          label: "Police Involved",
          type: "boolean",
          editable: false,
        },
        {
          key: "police_report_number",
          label: "Police Report Number",
          type: "text",
          editable: false,
        },
        {
          key: "officer_and_department",
          label: "Officer and Department",
          type: "text",
          editable: false,
        },
        {
          key: "towing_info",
          label: "Towing Info",
          type: "textarea",
          editable: false,
        },
        {
          key: "additional_info",
          label: "Additional Info",
          type: "textarea",
          editable: false,
        },
        {
          key: "analysis",
          label: "Analysis",
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
          key: "incident_documents",
          label: "Incident Documents",
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

  // Custom actions
  customActions: [
    {
      label: "View on Map",
      icon: "MapPin",
      variant: "outline",
      onClick: (entityData, helpers) => {
        if (entityData.gps_coordinates && entityData.gps_coordinates.length > 0) {
          helpers.handleOpenMap(entityData.gps_coordinates, entityData.location);
        }
      },
      disabled: (entityData) =>
        !entityData.gps_coordinates || entityData.gps_coordinates.length === 0,
    },
  ],

  // Map modal configuration
  mapModal: {
    enabled: true,
  },

  // Photo gallery configuration
  photoGallery: {
    title: "Incident Photos",
    photoSources: ["incident_photos", "report_photos"],
    gridCols: 5,
    upload: {
      entityType: "incident",
      dataType: "incident_id",
    },
  },
};

export default INCIDENT_GENERAL_INFO_CONFIG;
