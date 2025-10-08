import { WCB_STATUS_CHOICES } from "@/config/clientData";
import { WCB_EDIT_FORM_CONFIG } from "@/config/forms/wcbEditForm.config";

/**
 * WCB General Info Tab Configuration
 *
 * Configuration for the WCB claim general info tab.
 * WCB has only one tab - no checklist.
 */

export const WCB_GENERAL_INFO_CONFIG = {
  // Edit form configuration
  editFormConfig: WCB_EDIT_FORM_CONFIG,

  // No image for WCB
  image: null,

  // Status badge configuration
  statusConfig: {
    statusChoices: WCB_STATUS_CHOICES,
    editable: true,
  },

  // Field sections (all READ-ONLY - edit via modal)
  sections: [
    {
      fields: [
        {
          key: "claim_number",
          label: "4Tracks Claim #",
          type: "text",
          editable: false,
        },
        {
          key: "wcb_claim_number",
          label: "WCB Claim #",
          type: "text",
          editable: false,
        },
        {
          key: "date_time",
          label: "Date and Time",
          type: "datetime",
          editable: false,
        },
        {
          key: "assigned_to",
          label: "Assigned To",
          type: "text",
          editable: false,
        },
        {
          key: "main_driver_id",
          label: "Driver",
          type: "text",
          editable: false,
          formatter: (value, entityData, contexts) => {
            if (!value || value.length === 0) return null;
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
          key: "main_employee_id",
          label: "Employee",
          type: "text",
          editable: false,
          formatter: (value, entityData, contexts) => {
            if (!value || value.length === 0) return null;
            const { hiredEmployeesList } = contexts;
            if (!hiredEmployeesList || !hiredEmployeesList[value]) return "N/A";
            const employee = hiredEmployeesList[value];
            return `${employee.first_name || ""} ${employee.last_name || ""} ${employee.employee_id || ""}`.trim();
          },
          linkTo: {
            type: "employee",
            idField: "main_employee_id",
          },
        },
        {
          key: "location",
          label: "Location",
          type: "text",
          editable: false,
        },
        {
          key: "province",
          label: "Province",
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
          key: "reported_to_doctor",
          label: "Reported to Doctor",
          type: "boolean",
          editable: false,
        },
        {
          key: "first_contact_after_injury",
          label: "First Contact",
          type: "text",
          editable: false,
        },
        {
          key: "wcbcontact_name",
          label: "WCB Contact Name",
          type: "text",
          editable: false,
        },
        {
          key: "wcbcontact_phone",
          label: "WCB Contact Phone",
          type: "phone",
          editable: false,
        },
        {
          key: "wcbcontact_email",
          label: "WCB Contact Email",
          type: "email",
          editable: false,
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

  // File sections - just one document type
  fileSections: [
    {
      title: "Documents",
      defaultOpen: true,
      items: [
        {
          key: "wcbclaim_documents",
          label: "Documents",
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
            checkable: false, // WCB doesn't use review checkmarks
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

export default WCB_GENERAL_INFO_CONFIG;
