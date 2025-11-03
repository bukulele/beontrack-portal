import { UPLOAD_MODES } from "@/config/file-uploader/uploaderSchema";
import { getMetadataFields } from "@/config/prisma/documentMetadataSchemas";
import ActivityHistoryModal from "@/app/components/tabs/checklist/ActivityHistoryModal";

/**
 * Employee Pre-Hiring Checklist Configuration
 *
 * Documents required from applicant BEFORE offer acceptance
 * Used by recruiting/HR for candidate evaluation
 *
 * Based on PRISMA_MIGRATION_PLAN.md Phase 4
 * Uses Prisma DocumentType enum values (7 of 18 types)
 */

export const EMPLOYEE_PRE_HIRING_CHECKLIST_CONFIG = {
  // Show progress indicator
  showProgress: true,

  // No custom data fields - use OfficeEmployee model fields from API
  customFields: [],

  // Checklist items - Pre-hiring documents (7 types)
  items: [
    {
      key: "resume",
      label: "Resume/CV",
      optional: false,
      itemType: "file",
      documentType: "resume",

      fileUpload: {
        mode: UPLOAD_MODES.IMMEDIATE,
        accept: "image/*,application/pdf,.doc,.docx",
        fields: getMetadataFields("resume", "employee"),
      },

      actions: {
        checkable: true,
        uploadable: true,
        editable: true,
        deletable: true,
      },

      roles: {
        view: ["all"],
        edit: ["recruiting", "admin", "portalHr"],
        delete: ["admin"],
      },
    },

    {
      key: "government_id",
      label: "Government ID",
      optional: false,
      itemType: "file",
      documentType: "government_id",

      fileUpload: {
        mode: UPLOAD_MODES.IMMEDIATE,
        accept: "image/*,application/pdf",
        fields: getMetadataFields("government_id", "employee"),
      },

      actions: {
        checkable: true,
        uploadable: true,
        editable: true,
        deletable: true,
      },

      roles: {
        view: ["all"],
        edit: ["recruiting", "admin", "portalHr"],
        delete: ["admin"],
      },
    },

    {
      key: "work_authorization",
      label: "Work Authorization",
      optional: true,
      itemType: "file",
      documentType: "work_authorization",

      fileUpload: {
        mode: UPLOAD_MODES.IMMEDIATE,
        accept: "image/*,application/pdf",
        fields: getMetadataFields("work_authorization", "employee"),
      },

      actions: {
        checkable: true,
        uploadable: true,
        editable: true,
        deletable: true,
      },

      roles: {
        view: ["all"],
        edit: ["recruiting", "admin", "portalHr"],
        delete: ["admin"],
      },
    },

    {
      key: "immigration_documents",
      label: "Immigration Documents",
      optional: true,
      itemType: "file",
      documentType: "immigration_documents",

      fileUpload: {
        mode: UPLOAD_MODES.IMMEDIATE,
        accept: "image/*,application/pdf",
        fields: getMetadataFields("immigration_documents", "employee"),
      },

      actions: {
        checkable: true,
        uploadable: true,
        editable: true,
        deletable: true,
      },

      roles: {
        view: ["all"],
        edit: ["recruiting", "admin", "portalHr"],
        delete: ["admin"],
      },
    },

    {
      key: "education_verification",
      label: "Education Verification",
      optional: true,
      itemType: "file",
      documentType: "education_verification",

      fileUpload: {
        mode: UPLOAD_MODES.IMMEDIATE,
        accept: "image/*,application/pdf",
        fields: getMetadataFields("education_verification", "employee"),
      },

      actions: {
        checkable: true,
        uploadable: true,
        editable: true,
        deletable: true,
      },

      roles: {
        view: ["all"],
        edit: ["recruiting", "admin", "portalHr"],
        delete: ["admin"],
      },
    },

    {
      key: "professional_certifications",
      label: "Professional Certifications",
      optional: true,
      itemType: "file",
      documentType: "professional_certifications",

      fileUpload: {
        mode: UPLOAD_MODES.IMMEDIATE,
        accept: "image/*,application/pdf",
        fields: getMetadataFields("professional_certifications", "employee"),
      },

      actions: {
        checkable: true,
        uploadable: true,
        editable: true,
        deletable: true,
      },

      roles: {
        view: ["all"],
        edit: ["recruiting", "admin", "portalHr"],
        delete: ["admin"],
      },
    },

    {
      key: "background_check_consent",
      label: "Background Check Consent",
      optional: false,
      itemType: "file",
      documentType: "background_check_consent",

      fileUpload: {
        mode: UPLOAD_MODES.IMMEDIATE,
        accept: "image/*,application/pdf",
        fields: getMetadataFields("background_check_consent", "employee"),
      },

      actions: {
        checkable: true,
        uploadable: true,
        editable: true,
        deletable: true,
      },

      roles: {
        view: ["all"],
        edit: ["recruiting", "admin", "portalHr"],
        delete: ["admin"],
      },
    },

    // Activity History (special data-only item)
    {
      key: "activityHistory", // camelCase to match API response
      label: "Activity History",
      optional: false,
      itemType: "data",
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
  ],

  // No completion action
  completionAction: null,
};

export default EMPLOYEE_PRE_HIRING_CHECKLIST_CONFIG;
