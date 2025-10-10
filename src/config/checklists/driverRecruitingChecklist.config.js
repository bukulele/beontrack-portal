/**
 * Driver Recruiting Checklist Configuration
 *
 * Configuration for the driver pre-hiring recruiting checklist tab.
 * This is the Recruiting checklist (new applicants), not the Safety checklist.
 * Drivers have 20 different items in the recruiting checklist.
 */

import {
  TERMINAL_CHOICES,
  DRIVERTYPE_CHOICES,
  OPTION_LISTS,
} from "@/config/clientData";
import ActivityHistoryModal from "@/app/components/tabs/checklist/ActivityHistoryModal";
import DriverBackgroundModal from "@/app/components/tabs/checklist/DriverBackgroundModal";

export const DRIVER_RECRUITING_CHECKLIST_CONFIG = {
  // Show progress indicator
  showProgress: true,

  // Custom fields - inline-editable data fields at the top
  customFields: [
    {
      key: "terminal",
      label: "Terminal",
      type: "select",
      selectOptions: TERMINAL_CHOICES,
      required: true,
    },
    {
      key: "routes",
      label: "Routes",
      type: "multi-select",
      selectOptions: OPTION_LISTS.ROUTES_CHOICES,
      required: true,
    },
    {
      key: "eligible_to_enter_usa",
      label: "Current USA driver",
      type: "checkbox",
      required: false,
    },
    {
      key: "driver_type",
      label: "Driver Type",
      type: "select",
      selectOptions: DRIVERTYPE_CHOICES,
      required: true,
    },
  ],

  // Checklist items (20 items - mix of files and data)
  items: [
    {
      key: "licenses",
      label: "Driver Licenses",
      optional: false,
      itemType: "file",

      fileUpload: {
        accept: "image/*,application/pdf",
        fields: [
          {
            type: "text",
            name: "number",
            label: "License Number",
            required: false,
          },
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
        edit: ["recruiting", "admin"],
        delete: ["admin"],
      },
    },

    {
      key: "abstracts",
      label: "Abstracts",
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
        edit: ["recruiting", "admin"],
        delete: ["admin"],
      },
    },

    {
      key: "immigration_doc",
      label: "Immigration Docs",
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
        edit: ["recruiting", "admin"],
        delete: ["admin"],
      },
    },

    {
      key: "criminal_records",
      label: "Criminal Records",
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
        edit: ["recruiting", "admin"],
        delete: ["admin"],
      },
    },

    {
      key: "log_books",
      label: "Log Books from Previous Employment",
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
        edit: ["recruiting", "admin"],
        delete: ["admin"],
      },
    },

    {
      key: "activity_history",
      label: "Activity History",
      optional: false,
      itemType: "data", // Not a file, just displays activity
      modalComponent: ActivityHistoryModal,

      actions: {
        checkable: false,
        uploadable: false,
        editable: false,
        deletable: false,
      },

      roles: {
        view: ["all"],
      },
    },

    {
      key: "driver_background",
      label: "Driver Background",
      optional: false,
      itemType: "data", // Not a file
      modalComponent: DriverBackgroundModal,

      actions: {
        checkable: false,
        uploadable: false,
        editable: false,
        deletable: false,
      },

      roles: {
        view: ["all"],
      },
    },

    {
      key: "sin",
      label: "SIN",
      optional: false,
      itemType: "file",

      fileUpload: {
        accept: "image/*,application/pdf",
        fields: [
          {
            type: "number",
            name: "number",
            label: "Document Number",
            required: false,
            max: 9,
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
      key: "void_check",
      label: "Void Check",
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
        edit: ["payroll", "payrollManager", "admin"],
        delete: ["admin"],
      },
    },

    {
      key: "passports",
      label: "Passports",
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
        edit: ["recruiting", "admin"],
        delete: ["admin"],
      },
    },

    {
      key: "us_visas",
      label: "US Visas",
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
        edit: ["recruiting", "admin"],
        delete: ["admin"],
      },
    },

    {
      key: "incorp_docs",
      label: "Incorp Docs",
      optional: false,
      itemType: "file",

      // Only show for Owner-Operator drivers
      shouldDisplay: (entityData) => entityData.driver_type === "OO",

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
        edit: ["recruiting", "admin"],
        delete: ["admin"],
      },
    },

    {
      key: "gst_docs",
      label: "GST Docs",
      optional: false,
      itemType: "file",

      // Only show for Owner-Operator drivers
      shouldDisplay: (entityData) => entityData.driver_type === "OO",

      fileUpload: {
        accept: "image/*,application/pdf",
        fields: [
          {
            type: "text",
            name: "number",
            label: "GST Number",
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
        edit: ["recruiting", "admin"],
        delete: ["admin"],
      },
    },

    {
      key: "consents",
      label: "Consent to Personal Investigation",
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
        edit: ["recruiting", "admin"],
        delete: ["admin"],
      },
    },

    {
      key: "reference_checks",
      label: "Reference Checks",
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
        edit: ["recruiting", "admin"],
        delete: ["admin"],
      },
    },

    {
      key: "driver_prescreenings",
      label: "Driver Pre-screenings",
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
        edit: ["recruiting", "admin"],
        delete: ["admin"],
      },
    },

    {
      key: "driver_rates",
      label: "Driver Rates",
      optional: false,
      itemType: "data", // Not a file

      // Only hide for Other Driver type (show for OO and CD)
      shouldDisplay: (entityData) => entityData.driver_type !== "OD",

      actions: {
        checkable: false,
        uploadable: false,
        editable: false,
        deletable: false,
      },

      roles: {
        view: ["all"],
      },
    },

    {
      key: "knowledge_tests",
      label: "Knowledge Test",
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
        edit: ["recruiting", "admin"],
        delete: ["admin"],
      },
    },

    {
      key: "road_tests",
      label: "Road Test",
      optional: false,
      itemType: "file",

      fileUpload: {
        accept: "image/*,application/pdf",
        fields: [
          {
            type: "date",
            name: "issue_date",
            label: "Test Date",
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
        edit: ["recruiting", "admin"],
        delete: ["admin"],
      },
    },

    {
      key: "prehire_quizes",
      label: "Pre-hire Quizzes",
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
        edit: ["recruiting", "admin"],
        delete: ["admin"],
      },
    },

    {
      key: "employment_contracts",
      label: "Employment Contract",
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
        edit: ["recruiting", "admin"],
        delete: ["admin"],
      },
    },
  ],

  // Additional status action buttons (beyond completion action)
  statusActions: [
    {
      label: "Allow Changes For Driver",
      type: "status-change",
      to: "NW",
      endpoint: "/api/upload-driver-data",
      roles: ["safety", "recruiting"],
      availableWhen: (entityData) => {
        // Available when driver is in AR status and buttonsSettings allows it
        return entityData.status === "AR";
      },
    },
    {
      label: "Ready for Orientation",
      type: "status-change",
      to: "RO",
      endpoint: "/api/upload-driver-data",
      roles: ["safety", "recruiting"],
      availableWhen: (entityData) => {
        return entityData.status === "AR";
      },
      validation: (entityData, allChecked) => {
        if (!allChecked) {
          return "Not all documents have been checked!";
        }

        // Check activity period
        if (entityData.activity_history) {
          const activityGaps = checkActivityPeriod(
            entityData.activity_history,
            10
          );
          if (activityGaps.length > 0) {
            return "ACTIVITY PERIOD NOT FULFILLED";
          }
        }

        return null;
      },
    },
  ],

  // Completion action (move to trainee when all required items checked)
  completionAction: {
    type: "status-change",
    from: "RO",
    to: "TR",
    label: "Set To Trainee",
    endpoint: "/api/upload-driver-data",

    // Validation before allowing completion
    validation: (entityData, allChecked) => {
      if (!allChecked) {
        return "Not all documents have been checked!";
      }

      // Check activity period (must have activity history covering last 10 years)
      if (entityData.activity_history) {
        const activityGaps = checkActivityPeriod(entityData.activity_history, 10);
        if (activityGaps.length > 0) {
          return "ACTIVITY PERIOD NOT FULFILLED";
        }
      }

      return null; // No errors
    },
  },
};

// Helper function to check activity period gaps
function checkActivityPeriod(activityHistory, years) {
  // This is a simplified version - the actual implementation
  // should verify continuous employment history for the specified years
  // Returns array of gaps (empty if no gaps)
  // TODO: Implement actual activity period checking logic from OLD checklist
  return [];
}

export default DRIVER_RECRUITING_CHECKLIST_CONFIG;
