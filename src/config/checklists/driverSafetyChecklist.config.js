/**
 * Driver Safety Checklist Configuration
 *
 * Configuration for the driver post-hiring safety checklist tab.
 * This is the Safety checklist (active drivers), not the Recruiting checklist.
 * Drivers have 16 different document types in the safety checklist.
 */

import { IMMIGRATION_STATUS } from "@/config/clientData";

export const DRIVER_SAFETY_CHECKLIST_CONFIG = {
  // Show progress indicator
  showProgress: true,

  // Custom fields - inline-editable data fields at the top
  customFields: [
    {
      key: "driver_id",
      label: "Driver Id",
      type: "number",
      required: true,
      validation: (value) => {
        if (!value || value.length === 0) return "Driver ID is required";
        return null;
      },
    },
    {
      key: "hiring_date",
      label: "Hiring Date",
      type: "date",
      required: true,
      validation: (value) => {
        if (!value || value.length === 0) return "Hiring Date is required";
        return null;
      },
    },
    {
      key: "lcv_certified",
      label: "LCV Driver",
      type: "checkbox",
      required: false,
    },
    {
      key: "cp_driver",
      label: "CP Driver",
      type: "checkbox",
      required: false,
    },
    {
      key: "immigration_status",
      label: "Immigration Status",
      type: "select",
      selectOptions: IMMIGRATION_STATUS,
      required: true,
    },
  ],

  // Checklist items (16 file types)
  items: [
    // Required items
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

    {
      key: "lcv_certificates",
      label: "LCV Certificate",
      optional: false,
      itemType: "file",

      // Only show if driver is LCV certified
      shouldDisplay: (entityData) => entityData.lcv_certified === true,

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
      key: "lcv_licenses",
      label: "LCV License",
      optional: false,
      itemType: "file",

      // Only show if driver is LCV certified
      shouldDisplay: (entityData) => entityData.lcv_certified === true,

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
      key: "abstract_request_forms",
      label: "Abstract Request Form",
      optional: false,
      itemType: "file",

      // Only show if driver terminal is Manitoba
      shouldDisplay: (entityData) => entityData.terminal === "MB",

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
        edit: ["safety", "admin"],
        delete: ["admin"],
      },
    },

    {
      key: "driver_memos",
      label: "Driver Memos",
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
        edit: ["safety", "admin"],
        delete: ["admin"],
      },
    },

    {
      key: "gtg_quizes",
      label: "GTG Quiz",
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
        edit: ["safety", "admin"],
        delete: ["admin"],
      },
    },

    {
      key: "tax_papers",
      label: "Tax Papers",
      optional: false,
      itemType: "file",

      // Only show for Owner-Operator or Other Driver types (not Company Driver)
      shouldDisplay: (entityData) =>
        entityData.driver_type === "OO" || entityData.driver_type === "OD",

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
        edit: ["payroll", "payrollManager", "admin"],
        delete: ["admin"],
      },
    },

    {
      key: "mentor_forms",
      label: "Mentor Form",
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
        edit: ["safety", "admin"],
        delete: ["admin"],
      },
    },

    // Optional items
    {
      key: "ctpat_papers",
      label: "CTPAT Memo",
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
        edit: ["safety", "admin"],
        delete: ["admin"],
      },
    },

    {
      key: "ctpat_quiz",
      label: "CTPAT Quiz",
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
        edit: ["safety", "admin"],
        delete: ["admin"],
      },
    },

    {
      key: "winter_courses",
      label: "Winter Courses",
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
        edit: ["safety", "admin"],
        delete: ["admin"],
      },
    },

    {
      key: "annual_performance_reviews",
      label: "Annual Performance Review",
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
        edit: ["safety", "admin"],
        delete: ["admin"],
      },
    },

    {
      key: "certificates_of_violations",
      label: "Certificates of Violations",
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
        edit: ["safety", "admin"],
        delete: ["admin"],
      },
    },

    {
      key: "pdic_certificates",
      label: "PDIC Certificate",
      optional: true,
      itemType: "file",

      fileUpload: {
        accept: "image/*,application/pdf",
        fields: [
          {
            type: "text",
            name: "number",
            label: "Certificate Number",
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
      key: "driver_statements",
      label: "Driver Statements",
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
        edit: ["safety", "admin"],
        delete: ["admin"],
      },
    },

    {
      key: "other_documents",
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
        edit: ["safety", "admin"],
        delete: ["admin"],
      },
    },
  ],

  // Additional status action buttons (beyond completion action)
  statusActions: [
    {
      label: "Set Driver To Trainee",
      type: "status-change",
      to: "TR",
      endpoint: "/api/upload-driver-data",
      roles: ["safety", "recruiting"],
      availableWhen: (entityData) => {
        return entityData.status === "RO" || entityData.status === "AR";
      },
      validation: (entityData, allChecked) => {
        if (!allChecked) {
          return "Not all documents have been checked!";
        }
        return null;
      },
    },
    {
      label: "Set Driver To Active",
      type: "status-change",
      to: "AC",
      endpoint: "/api/upload-driver-data",
      roles: ["safety", "recruiting"],
      availableWhen: (entityData) => {
        return entityData.status === "TR";
      },
      validation: (entityData, allChecked) => {
        if (!allChecked) {
          return "Not all documents have been checked!";
        }

        // Check mentor forms are reviewed
        if (entityData.status === "TR" || entityData.status === "RO") {
          const mentorForms = entityData.mentor_forms;
          if (Array.isArray(mentorForms) && mentorForms.length > 0) {
            const latest = mentorForms.reduce(
              (max, item) => (item.id > max.id ? item : max),
              mentorForms[0]
            );
            if (!latest.was_reviewed) {
              return "Mentor forms document is not checked!";
            }
          }
        }

        // Check drug test for USA drivers
        if (entityData.routes && entityData.routes.includes(2)) {
          if (!entityData.drug_test_done) {
            return "Drug test absent!";
          }
        }

        // Check schedule for WA drivers
        if (entityData.routes && entityData.routes.includes(3)) {
          if (!entityData.schedule || entityData.schedule === "") {
            return "Driver schedule is empty!";
          }
        }

        return null;
      },
    },
    {
      label: "Request Change From Driver",
      type: "update-status-change",
      endpoint: "/api/upload-driver-data",
      roles: ["safety"],
      requiresMessage: true,
      availableWhen: (entityData) => {
        return (
          entityData.status === "AC" && entityData.update_status !== "UR"
        );
      },
    },
  ],

  // Completion action (activate driver when all required items checked)
  completionAction: {
    type: "status-change",
    from: "TR",
    to: "AC",
    label: "Set To Active",
    endpoint: "/api/upload-driver-data",

    // Validation before allowing completion
    validation: (entityData, allChecked, itemsData) => {
      if (!allChecked) {
        return "Not all documents have been checked!";
      }

      // Check mentor forms are reviewed (for TR or RO status drivers)
      if (entityData.status === "TR" || entityData.status === "RO") {
        const mentorForms = entityData.mentor_forms;
        if (Array.isArray(mentorForms) && mentorForms.length > 0) {
          const latest = mentorForms.reduce((max, item) =>
            item.id > max.id ? item : max, mentorForms[0]
          );
          if (!latest.was_reviewed) {
            return "Mentor forms document is not checked!";
          }
        }
      }

      // Check drug test for drivers on route 2 (USA)
      if (entityData.routes && entityData.routes.includes(2)) {
        if (!entityData.drug_test_done) {
          return "Drug test absent!";
        }
      }

      // Check schedule for drivers on route 3 (WA schedule)
      if (entityData.routes && entityData.routes.includes(3)) {
        if (!entityData.schedule || entityData.schedule === "") {
          return "Driver schedule is empty!";
        }
      }

      return null; // No errors
    },
  },
};

export default DRIVER_SAFETY_CHECKLIST_CONFIG;
