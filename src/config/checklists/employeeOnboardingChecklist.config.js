import { UPLOAD_MODES } from "@/config/file-uploader/uploaderSchema";
import { getMetadataFields } from "@/config/prisma/documentMetadataSchemas";

/**
 * Employee Onboarding Checklist Configuration
 *
 * Documents required AFTER offer acceptance (employee onboarding)
 * Used by payroll/HR for employee setup
 *
 * Based on PRISMA_MIGRATION_PLAN.md Phase 4
 * Uses Prisma DocumentType enum values (9 of 18 types)
 */

export const EMPLOYEE_ONBOARDING_CHECKLIST_CONFIG = {
  // Show progress indicator
  showProgress: true,

  // No custom data fields - use OfficeEmployee model fields from API
  customFields: [],

  // Checklist items - Onboarding documents (9 types)
  items: [
    {
      key: "employment_contract",
      label: "Employment Contract",
      optional: false,
      itemType: "file",
      documentType: "employment_contract",

      fileUpload: {
        mode: UPLOAD_MODES.IMMEDIATE,
        apiEndpoint: "/api/v1/employees/:id/documents",
        accept: "image/*,application/pdf",
        fields: getMetadataFields("employment_contract", "employees"),
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
      key: "company_policies",
      label: "Company Policies Acknowledgement",
      optional: true,
      itemType: "file",
      documentType: "company_policies",

      fileUpload: {
        mode: UPLOAD_MODES.IMMEDIATE,
        apiEndpoint: "/api/v1/employees/:id/documents",
        accept: "image/*,application/pdf",
        fields: getMetadataFields("company_policies", "employees"),
      },

      actions: {
        checkable: true,
        uploadable: true,
        editable: true,
        deletable: true,
      },

      roles: {
        view: ["all"],
        edit: ["admin", "portalHr"],
        delete: ["admin"],
      },
    },

    {
      key: "confidentiality_agreement",
      label: "Confidentiality Agreement",
      optional: true,
      itemType: "file",
      documentType: "confidentiality_agreement",

      fileUpload: {
        mode: UPLOAD_MODES.IMMEDIATE,
        apiEndpoint: "/api/v1/employees/:id/documents",
        accept: "image/*,application/pdf",
        fields: getMetadataFields("confidentiality_agreement", "employees"),
      },

      actions: {
        checkable: true,
        uploadable: true,
        editable: true,
        deletable: true,
      },

      roles: {
        view: ["all"],
        edit: ["admin", "portalHr"],
        delete: ["admin"],
      },
    },

    {
      key: "sin_ssn",
      label: "SIN/SSN",
      optional: false,
      itemType: "file",
      documentType: "sin_ssn",

      fileUpload: {
        mode: UPLOAD_MODES.IMMEDIATE,
        apiEndpoint: "/api/v1/employees/:id/documents",
        accept: "image/*,application/pdf",
        fields: getMetadataFields("sin_ssn", "employees"),
      },

      actions: {
        checkable: true,
        uploadable: true,
        editable: true,
        deletable: true,
      },

      roles: {
        view: ["all"],
        edit: ["payroll", "payrollManager", "admin", "portalHr"],
        delete: ["admin"],
      },
    },

    {
      key: "direct_deposit",
      label: "Direct Deposit (Void Cheque)",
      optional: false,
      itemType: "file",
      documentType: "direct_deposit",

      fileUpload: {
        mode: UPLOAD_MODES.IMMEDIATE,
        apiEndpoint: "/api/v1/employees/:id/documents",
        accept: "image/*,application/pdf",
        fields: getMetadataFields("direct_deposit", "employees"),
      },

      actions: {
        checkable: true,
        uploadable: true,
        editable: true,
        deletable: true,
      },

      roles: {
        view: ["all"],
        edit: ["payroll", "payrollManager", "admin", "portalHr"],
        delete: ["admin"],
      },
    },

    {
      key: "tax_forms",
      label: "Tax Forms",
      optional: false,
      itemType: "file",
      documentType: "tax_forms",

      fileUpload: {
        mode: UPLOAD_MODES.IMMEDIATE,
        apiEndpoint: "/api/v1/employees/:id/documents",
        accept: "image/*,application/pdf",
        fields: getMetadataFields("tax_forms", "employees"),
      },

      actions: {
        checkable: true,
        uploadable: true,
        editable: true,
        deletable: true,
      },

      roles: {
        view: ["all"],
        edit: ["payroll", "payrollManager", "admin", "portalHr"],
        delete: ["admin"],
      },
    },

    {
      key: "benefits_enrollment",
      label: "Benefits Enrollment",
      optional: true,
      itemType: "file",
      documentType: "benefits_enrollment",

      fileUpload: {
        mode: UPLOAD_MODES.IMMEDIATE,
        apiEndpoint: "/api/v1/employees/:id/documents",
        accept: "image/*,application/pdf",
        fields: getMetadataFields("benefits_enrollment", "employees"),
      },

      actions: {
        checkable: true,
        uploadable: true,
        editable: true,
        deletable: true,
      },

      roles: {
        view: ["all"],
        edit: ["payroll", "payrollManager", "admin", "portalHr"],
        delete: ["admin"],
      },
    },

    {
      key: "safety_training",
      label: "Safety Training Certificates",
      optional: true,
      itemType: "file",
      documentType: "safety_training",

      fileUpload: {
        mode: UPLOAD_MODES.IMMEDIATE,
        apiEndpoint: "/api/v1/employees/:id/documents",
        accept: "image/*,application/pdf",
        fields: getMetadataFields("safety_training", "employees"),
      },

      actions: {
        checkable: true,
        uploadable: true,
        editable: true,
        deletable: true,
      },

      roles: {
        view: ["all"],
        edit: ["admin", "portalHr"],
        delete: ["admin"],
      },
    },

    {
      key: "other_documents",
      label: "Other Documents",
      optional: true,
      itemType: "file",
      documentType: "other_documents",

      fileUpload: {
        mode: UPLOAD_MODES.IMMEDIATE,
        apiEndpoint: "/api/v1/employees/:id/documents",
        accept: "image/*,application/pdf",
        fields: getMetadataFields("other_documents", "employees"),
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
  ],

  // Completion action - What happens when checklist is 100% complete
  completionAction: {
    checklistName: 'Onboarding Checklist',
    nextStatuses: [
      { value: 'trainee', label: 'Start as Trainee' },
      { value: 'active', label: 'Activate Employee' }
    ],
    // What status transitions require this checklist to be complete?
    gates: ['offer_accepted → trainee', 'offer_accepted → active']
  },
};

export default EMPLOYEE_ONBOARDING_CHECKLIST_CONFIG;
