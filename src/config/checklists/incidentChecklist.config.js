/**
 * Incident Checklist Configuration
 *
 * Configuration for the incident checklist tab.
 * Incidents have minimal checklist - just 2 document types.
 */

export const INCIDENT_CHECKLIST_CONFIG = {
  // Show progress indicator
  showProgress: false, // Only 2 items

  // Checklist items
  items: [
    {
      key: "incident_documents",
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
        checkable: false, // Incident documents don't have review checkmarks
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
      key: "claim_documents",
      label: "Claim Documents",
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

  // No completion action for incidents
  completionAction: null,
};

export default INCIDENT_CHECKLIST_CONFIG;
