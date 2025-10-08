/**
 * Violation Checklist Configuration
 *
 * Configuration for the violation checklist tab.
 * Violations have minimal checklist - just general documents.
 */

export const VIOLATION_CHECKLIST_CONFIG = {
  // Show progress indicator
  showProgress: false,

  // Checklist items
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

  // No completion action for violations
  completionAction: null,
};

export default VIOLATION_CHECKLIST_CONFIG;
