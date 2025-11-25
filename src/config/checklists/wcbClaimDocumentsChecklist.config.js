import { UPLOAD_MODES } from "@/config/file-uploader/uploaderSchema";
import { getMetadataFields } from "@/config/prisma/documentMetadataSchemas";

/**
 * WCB Claim Documents Checklist Configuration
 *
 * Required documents for WCB claim submission:
 * - Worker Report (Form 6/C060)
 * - Employer Report (Form 7)
 * - Healthcare Provider Report (Form 8)
 */

export const WCB_CLAIM_DOCUMENTS_CHECKLIST_CONFIG = {
  // Show progress indicator
  showProgress: true,

  // No custom fields
  customFields: [],

  // Checklist items - WCB required documents
  items: [
    {
      key: "wcb_worker_report",
      label: "Worker Report (Form 6/C060)",
      optional: false,
      itemType: "file",
      documentType: "wcb_worker_report",

      fileUpload: {
        mode: UPLOAD_MODES.IMMEDIATE,
        apiEndpoint: "/api/v1/wcb_claims/:id/documents",
        accept: "image/*,application/pdf",
        fields: getMetadataFields("wcb_worker_report", "wcb_claims"),
      },

      actions: {
        checkable: true,
        uploadable: true,
        editable: true,
        deletable: true,
      },

      roles: {
        view: ["all"],
        edit: ["admin", "humanResources", "safetyCompliance"],
        delete: ["admin"],
      },
    },

    {
      key: "wcb_employer_report",
      label: "Employer Report (Form 7)",
      optional: false,
      itemType: "file",
      documentType: "wcb_employer_report",

      fileUpload: {
        mode: UPLOAD_MODES.IMMEDIATE,
        apiEndpoint: "/api/v1/wcb_claims/:id/documents",
        accept: "image/*,application/pdf",
        fields: getMetadataFields("wcb_employer_report", "wcb_claims"),
      },

      actions: {
        checkable: true,
        uploadable: true,
        editable: true,
        deletable: true,
      },

      roles: {
        view: ["all"],
        edit: ["admin", "humanResources", "safetyCompliance"],
        delete: ["admin"],
      },
    },

    {
      key: "wcb_medical_report",
      label: "Healthcare Provider Report (Form 8)",
      optional: true,
      itemType: "file",
      documentType: "wcb_medical_report",

      fileUpload: {
        mode: UPLOAD_MODES.IMMEDIATE,
        apiEndpoint: "/api/v1/wcb_claims/:id/documents",
        accept: "image/*,application/pdf",
        fields: getMetadataFields("wcb_medical_report", "wcb_claims"),
      },

      actions: {
        checkable: true,
        uploadable: true,
        editable: true,
        deletable: true,
      },

      roles: {
        view: ["all"],
        edit: ["admin", "humanResources", "safetyCompliance"],
        delete: ["admin"],
      },
    },
  ],

  // Completion action - Submit to WCB when all documents uploaded
  completionAction: {
    checklistName: 'Documents Checklist',
    nextStatuses: [
      { value: 'submitted', label: 'Submit to WCB' }
    ],
    // What status transitions require this checklist to be complete?
    gates: ['new → submitted']
  },
};

export default WCB_CLAIM_DOCUMENTS_CHECKLIST_CONFIG;
