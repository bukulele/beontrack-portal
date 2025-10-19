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

  // Field sections - ONE SECTION, NO TITLE (flat list)
  // Merged all fields from 2 sections into 1
  sections: [
    {
      // NO title property!
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
          key: "trailer_1_license_plate",
          label: "Trailer 1 License Plate",
          type: "text",
          editable: false,
        },
        {
          key: "trailer_1_violation",
          label: "Trailer 1 Violation",
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
          key: "trailer_2_license_plate",
          label: "Trailer 2 License Plate",
          type: "text",
          editable: false,
        },
        {
          key: "trailer_2_violation",
          label: "Trailer 2 Violation",
          type: "textarea",
          editable: false,
        },
        {
          key: "converter_unit_number",
          label: "Converter Unit Number",
          type: "text",
          editable: false,
        },
        {
          key: "converter_violation",
          label: "Converter Violation",
          type: "textarea",
          editable: false,
        },
        {
          key: "truck_unit_number",
          label: "Truck Unit Number",
          type: "text",
          editable: false,
        },
        {
          key: "truck_license_plate",
          label: "Truck License Plate",
          type: "text",
          editable: false,
        },
        {
          key: "truck_make_model",
          label: "Truck Make/Model",
          type: "text",
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
          key: "lawyer_company",
          label: "Lawyer Company",
          type: "text",
          editable: false,
        },
        {
          key: "lawyer_email",
          label: "Lawyer Email",
          type: "email",
          editable: false,
        },
        {
          key: "lawyer_phone",
          label: "Lawyer Phone",
          type: "phone",
          editable: false,
        },
        {
          key: "lawyer_other_info",
          label: "Lawyer Other Info",
          type: "textarea",
          editable: false,
        },
        {
          key: "lawyer_result",
          label: "Lawyer Result",
          type: "text",
          editable: false,
        },
        {
          key: "additional_info",
          label: "Additional Info",
          type: "textarea",
          editable: false,
        },
        {
          key: "has_ticket",
          label: "Has Ticket",
          type: "boolean",
          editable: false,
        },
        {
          key: "traffic_violation_indicated",
          label: "Traffic Violation Indicated",
          type: "boolean",
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
    title: "Violation Photos",
    photoSources: ["violation_photos", "report_photos"],
    gridCols: 5,
    upload: {
      entityType: "violation",
      dataType: "violation_id",
    },
  },
};

export default VIOLATION_GENERAL_INFO_CONFIG;
